from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from game.models import Game, Player
# Import our brand new logic and AI functions!
from game.logic import process_shot
from game.ai import trigger_ai_turn

class FireShotView(APIView):
    """
    An API endpoint for a player to fire a shot. It processes the player's
    move and then triggers the AI's counter-move.
    """
    def post(self, request, *args, **kwargs):
        game_id = self.kwargs.get('pk')
        player_id = request.data.get('player_id')
        coordinates = request.data.get('coordinates')

        if not all([player_id, coordinates]):
            return Response(
                {"error": "A player_id and coordinates are required to fire a shot."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            game = Game.objects.get(id=game_id)
            player = Player.objects.get(id=player_id)

            if game.status == 'finished':
                return Response({"message": "This game is over!"}, status=status.HTTP_400_BAD_REQUEST)

            # --- Player's Turn ---
            player_shot_result = process_shot(game, player, coordinates)

            # --- AI's Turn ---
            ai_shot_response = None
            # If the player's shot didn't end the game, the AI takes its turn
            if game.status != 'finished':
                ai_shot_response = trigger_ai_turn(game)

            return Response({
                "player_shot": player_shot_result,
                "ai_shot": ai_shot_response
            }, status=status.HTTP_200_OK)

        except (Game.DoesNotExist, Player.DoesNotExist):
            return Response(
                {"error": "Game or Player not found."},
                status=status.HTTP_404_NOT_FOUND
            )
