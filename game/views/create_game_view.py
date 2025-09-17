from rest_framework import generics
from game.models import Game, Player
from game.serializers import GameSerializer

class CreateGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        game = serializer.save()
        Player.objects.create(game=game, name='Player 1', is_ai=False)
        Player.objects.create(game=game, name='Deepseek AI', is_ai=True)
