from rest_framework import serializers
from ..models import Game
from .player_serializer import PlayerSerializer
from .shot_serializer import ShotSerializer # Import our new serializer!

class GameSerializer(serializers.ModelSerializer):
    """
    This is the main serializer for the entire game state. It bundles up
    all the necessary information—players, shots, and game status—into
    a single, clean package for the frontend.
    """
    players = PlayerSerializer(many=True, read_only=True)
    shots = ShotSerializer(many=True, read_only=True) # Add this line!
    duration = serializers.DurationField(read_only=True)

    class Meta:
        model = Game
        # Add 'shots' to the list of fields to include!
        fields = ['id', 'status', 'created_at', 'finished_at', 'current_turn', 'winner', 'players', 'shots', 'duration']
        read_only_fields = ['status', 'created_at', 'players', 'shots', 'finished_at', 'winner', 'duration']
