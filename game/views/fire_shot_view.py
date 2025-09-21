from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Game, Player
from ..logic import process_shot
from ..ai import trigger_ai_turn
from ..serializers import GameSerializer 

class FireShotView(APIView):
    """
    This endpoint now intelligently handles turns and returns the complete,
    updated game state after the move (and the AI's counter-move, if applicable).
    """
    def post(self, request, *args, **kwargs):
        game_id = self.kwargs.get('pk')
        player_id = request.data.get('player_id')
        coordinates = request.data.get('coordinates')

        if not all([player_id, coordinates]):
            return Response({"error": "player_id and coordinates are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(id=game_id)
            player = Player.objects.get(id=player_id)

            if game.status == 'finished':
                return Response({"message": "This game is over!"}, status=status.HTTP_400_BAD_REQUEST)
            
            if game.current_turn != player:
                return Response({"error": "It's not your turn!"}, status=status.HTTP_400_BAD_REQUEST)

            # --- Process the Human Player's Shot ---
            process_shot(game, player, coordinates)
            
            # --- Check if it's now the AI's turn ---
            if game.status != 'finished':
                opponent = game.players.exclude(id=player.id).get()
                game.current_turn = opponent
                game.save()

                if opponent.is_ai:
                    ai_response = trigger_ai_turn(game)
                    if "error" in ai_response:
                        # If the AI fails to make a move, return an error
                        return Response(
                            {"error": f"AI opponent failed to make a move: {ai_response['error']}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )

                    if game.status != 'finished':
                        game.current_turn = player
                        game.save()
            
            # Serialize and return the entire updated game state
            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except (Game.DoesNotExist, Player.DoesNotExist):
            return Response({"error": "Game or Player not found."}, status=status.HTTP_404_NOT_FOUND)
