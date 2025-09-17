from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from game.models import Player, Ship

class PlaceShipsView(APIView):
    """
    An API endpoint for a player to place their ships on the board.
    Expects a POST request with 'player_id' and a 'ships' list.
    e.g., {"player_id": 1, "ships": [{"ship_type": "carrier", "coordinates": [[0,0], [0,1]]}]}
    """
    def post(self, request, *args, **kwargs):
        player_id = request.data.get('player_id')
        ships_data = request.data.get('ships')

        # --- Input Validation ---
        if not player_id or not ships_data:
            return Response(
                {"error": "player_id and a list of ships are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            player = Player.objects.get(id=player_id)
            # Make sure the player belongs to the game specified in the URL
            if player.game.id != self.kwargs.get('pk'):
                 return Response(
                    {"error": "This player does not belong to this game."},
                    status=status.HTTP_403_FORBIDDEN
                 )

            # --- Ship Creation ---
            # Clear any ships the player might have placed before
            Ship.objects.filter(player=player).delete()
            for ship_data in ships_data:
                Ship.objects.create(
                    player=player,
                    ship_type=ship_data.get('ship_type'),
                    coordinates=ship_data.get('coordinates')
                )

            return Response(
                {"message": "Ships have been placed successfully!"},
                status=status.HTTP_201_CREATED
            )

        except Player.DoesNotExist:
            return Response(
                {"error": "Player not found."},
                status=status.HTTP_404_NOT_FOUND
            )