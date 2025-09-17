from rest_framework import generics
from game.models import Game
from game.serializers import GameSerializer

class GameStateView(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer