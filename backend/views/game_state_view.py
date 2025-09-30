from rest_framework import generics
from backend.models import Game
from backend.serializers import GameSerializer

class GameStateView(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
