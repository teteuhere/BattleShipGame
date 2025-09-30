from rest_framework import serializers
from ..models import Shot

class ShotSerializer(serializers.ModelSerializer):
    """
    This serializer formats the data for a single shot, specifying which
    fields should be included in the API response. We only need to know
    who fired it, where it went, and if it was a hit.
    """
    class Meta:
        model = Shot
        fields = ['player', 'coordinates', 'is_hit']
