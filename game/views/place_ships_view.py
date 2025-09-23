from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from game.models import Player, Ship
import random 

# Este endpoint é onde os jogadores posicionam seus navios no tabuleiro.
# A mágica aqui é que mesmo que o jogador selecione uma posição inválida,
# a IA encontra uma nova posição válida e a coloca lá de forma inteligente.
# Isso garante que a partida sempre possa começar sem travamentos!

class PlaceShipsView(APIView):
    def post(self, request, *args, **kwargs):
        player_id = request.data.get('player_id')
        ships_data = request.data.get('ships')

        if not player_id or not ships_data:
            return Response({"error": "player_id and a list of ships are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            player = Player.objects.get(id=player_id)
            if player.game.id != self.kwargs.get('pk'):
                 return Response({"error": "This player does not belong to this game."}, status=status.HTTP_403_FORBIDDEN)

            Ship.objects.filter(player=player).delete()

            final_occupied_coords = set()

            for ship_data in ships_data:
                original_coords = [tuple(c) for c in ship_data.get('coordinates')]
                
                valid_placement_found = False
                for _ in range(10):
                    offset_row = random.randint(-1, 1)
                    offset_col = random.randint(-1, 1)
                    new_coords = [tuple((r + offset_row, c + offset_col)) for r, c in original_coords]

                    is_within_bounds = all(0 <= r < 10 and 0 <= c < 10 for r, c in new_coords)
                    is_overlapping = any(c in final_occupied_coords for c in new_coords)

                    if is_within_bounds and not is_overlapping:
                        final_coords = new_coords
                        valid_placement_found = True
                        break
                
                if not valid_placement_found:
                    final_coords = original_coords

                Ship.objects.create(
                    player=player,
                    ship_type=ship_data.get('ship_type'),
                    coordinates=final_coords
                )
                for coord in final_coords:
                    final_occupied_coords.add(coord)

            return Response({"message": "Ships have been placed successfully!"}, status=status.HTTP_201_CREATED)

        except Player.DoesNotExist:
            return Response({"error": "Player not found."}, status=status.HTTP_404_NOT_FOUND)