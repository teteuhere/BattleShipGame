from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Player, Ship
from ..serializers import GameSerializer

class PlaceShipsView(APIView):
    def post(self, request, *args, **kwargs):
        player_id = request.data.get('player_id')
        ships_data = request.data.get('ships')

        try:
            player = Player.objects.get(id=player_id)
            game = player.game

            if game.current_turn != player:
                return Response({"error": "It's not your turn to place ships."}, status=status.HTTP_400_BAD_REQUEST)

            Ship.objects.filter(player=player).delete()
            for ship_data in ships_data:
                Ship.objects.create(
                    player=player,
                    ship_type=ship_data.get('ship_type'),
                    coordinates=ship_data.get('coordinates')
                )

            game.refresh_from_db()

            all_players = game.players.all().order_by('id')
            ready_players = [p for p in all_players if p.ships.exists()]

            if len(ready_players) == all_players.count() and all_players.count() > 1:
                game.status = 'battle'
                game.current_turn = all_players.first()
            else:
                next_player = all_players.exclude(id__in=[p.id for p in ready_players]).first()
                game.current_turn = next_player

            game.save()

            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Player.DoesNotExist:
            return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)
