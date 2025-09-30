# /game/views/surrender_view.py

from game.serializers.game_serializer import GameSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from ..models import Game, Player

class SurrenderView(APIView):
      def post(self, request, *args, **kwargs):
            game_id = self.kwargs.get('pk')
            player_id = request.data.get('player_id')

            if not player_id:
                  return Response({"error": "player_id is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                  game = Game.objects.get(id=game_id)
                  player = Player.objects.get(id=player_id)

                  if game.status == 'finished':
                        return Response({"message": "This game is already over!"}, status=status.HTTP_400_BAD_REQUEST)

                  # The opponent is the winner
                  opponent = game.players.exclude(id=player.id).get()
                  game.status = 'finished'
                  game.winner = opponent
                  game.finished_at = timezone.now()
                  game.save()

                  serializer = GameSerializer(game)
                  return Response(serializer.data, status=status.HTTP_200_OK)

            except (Game.DoesNotExist, Player.DoesNotExist):
                  return Response({"error": "Game or Player not found."}, status=status.HTTP_404_NOT_FOUND)
