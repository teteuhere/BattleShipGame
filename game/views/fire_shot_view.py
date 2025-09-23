from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Game, Player
from ..logic import process_shot
from ..ai import trigger_ai_turn
from ..serializers import GameSerializer 

# Endpoint para coordenar a batalha. Ele recebe os disparos e gerencia os turnos.
# Primeiro, processamos a jogada do comandante humano.
# Se o jogo ainda não acabou, passamos a vez para o oponente.
# Se o oponente for a nossa IA, ela faz o contra-ataque.
# Por fim, enviamos o estado completo e atualizado do jogo para o frontend.

class FireShotView(APIView):
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

            process_shot(game, player, coordinates)
            
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
            return Response(serializer.data, status=status.HTTP_200_OK)

        except (Game.DoesNotExist, Player.DoesNotExist):
            return Response({"error": "Game or Player not found."}, status=status.HTTP_404_NOT_FOUND)
