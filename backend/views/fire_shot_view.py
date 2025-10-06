# Summary of changes:
# A bug was fixed where, in 'Classic' mode, the game state was not being
# refreshed after a shot was processed. This caused the turn-switching
# logic to fail. By adding `game.refresh_from_db()` after the shot is
# processed for Classic mode (just like it was for Salvo mode), we ensure
# the view always has the latest data before correctly passing the turn
# to the opponent.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Game, Player
from ..logic import process_shot
from ..ai import trigger_ai_turn
from ..serializers import GameSerializer

class FireShotView(APIView):
    def post(self, request, *args, **kwargs):
        game_id = self.kwargs.get('pk')
        player_id = request.data.get('player_id')
        coordinates_list = request.data.get('coordinates')

        if not all([player_id, coordinates_list]):
            return Response({"error": "player_id and a list of coordinates are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(id=game_id)
            player = Player.objects.get(id=player_id)

            if game.status == 'finished':
                return Response({"message": "This game is over!"}, status=status.HTTP_400_BAD_REQUEST)

            if game.current_turn != player:
                return Response({"error": "It's not your turn!"}, status=status.HTTP_400_BAD_REQUEST)

            if game.emp_active_on_player == player:
                opponent = game.players.exclude(id=player.id).get()
                game.emp_active_on_player = None
                game.current_turn = opponent
                game.save()
                serializer = GameSerializer(game)
                return Response({
                    "game_state": serializer.data,
                    "shot_results": [{"result": "miss", "message": "Your systems were disabled by an EMP! Turn skipped."}]
                }, status=status.HTTP_200_OK)

            shot_results = []
            if game.game_mode == 'salvo':
                all_player_ships = player.ships.all()
                num_ships_left = sum(1 for ship in all_player_ships if not ship.is_sunk)

                if len(coordinates_list) != num_ships_left:
                    return Response({"error": f"Invalid number of shots. You must fire {num_ships_left} shots."}, status=status.HTTP_400_BAD_REQUEST)

                for coords in coordinates_list:
                    result = process_shot(game, player, coords)
                    shot_results.append(result)
                    game.refresh_from_db()
                    if game.status == 'finished':
                        break
            else: # Classic mode
                result = process_shot(game, player, coordinates_list[0])
                shot_results.append(result)
                # --- THIS IS THE FIX ---
                game.refresh_from_db()
                # --- END OF FIX ---

            if game.status != 'finished':
                opponent = game.players.exclude(id=player.id).get()
                game.current_turn = opponent
                game.save()

                if opponent.is_ai:
                    ai_response = trigger_ai_turn(game)
                    if "error" in ai_response:
                        return Response(
                            {"error": f"AI opponent failed to make a move: {ai_response['error']}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                    if game.status != 'finished':
                        game.current_turn = player
                        game.save()

            serializer = GameSerializer(game)

            return Response({
                "game_state": serializer.data,
                "shot_results": shot_results
            }, status=status.HTTP_200_OK)

        except (Game.DoesNotExist, Player.DoesNotExist):
            return Response({"error": "Game or Player not found."}, status=status.HTTP_404_NOT_FOUND)
