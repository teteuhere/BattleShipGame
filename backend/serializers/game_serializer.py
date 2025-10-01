from rest_framework import serializers
from ..models import Game
from .player_serializer import PlayerSerializer
from .shot_serializer import ShotSerializer

class GameSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    shots = ShotSerializer(many=True, read_only=True)
    duration = serializers.DurationField(read_only=True)

    class Meta:
        model = Game
        # --- ADD 'game_mode' TO THE FIELDS ---
        fields = ['id', 'status', 'game_mode', 'created_at', 'finished_at', 'current_turn', 'winner', 'players', 'shots', 'duration', 'power_ups_enabled', 'emp_active_on_player']
        read_only_fields = ['status', 'created_at', 'players', 'shots', 'finished_at', 'winner', 'duration']
