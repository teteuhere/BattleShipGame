from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count
from ..models import Player

class LeaderboardView(APIView):
    def get(self, request, *args, **kwargs):
        leaderboard_data = (
            Player.objects.filter(won_games__isnull=False, is_ai=False)
            .values('name')
            .annotate(wins=Count('won_games'))
            .order_by('-wins')
        )

        return Response(list(leaderboard_data), status=status.HTTP_200_OK)
