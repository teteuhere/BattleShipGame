from rest_framework import serializers
from backend.models import Ship

class ShipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ship
        fields = ['id', 'player', 'ship_type', 'coordinates', 'is_sunk']
        read_only_fields = ['is_sunk']

