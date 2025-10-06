from rest_framework import generics
from backend.models import Game
from backend.serializers import GameSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache

class GameStateView(generics.RetrieveAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    @method_decorator(never_cache)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
