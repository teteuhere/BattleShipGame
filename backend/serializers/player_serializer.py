from rest_framework import serializers
from backend.models import Player
from .ship_serializer import ShipSerializer

class PlayerSerializer(serializers.ModelSerializer):
    ships = ShipSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = ['id', 'game', 'name', 'is_ai', 'ships', 'hits', 'misses', 'used_scout_plane', 'used_torpedo', 'used_emp']
