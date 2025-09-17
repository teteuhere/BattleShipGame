from rest_framework import serializers
from game.models import Game
from .player_serializer import PlayerSerializer

class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'status', 'created_at', 'players']
        read_only_fields = ['status', 'created_at', 'players']