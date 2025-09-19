from rest_framework import serializers
from game.models import Game
from .player_serializer import PlayerSerializer

class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    duration = serializers.DurationField(read_only=True) # Add duration field

    class Meta:
        model = Game
        # Add new fields to the list
        fields = ['id', 'status', 'created_at', 'finished_at', 'current_turn', 'winner', 'players', 'duration']
        read_only_fields = ['status', 'created_at', 'players', 'finished_at', 'winner', 'duration']
