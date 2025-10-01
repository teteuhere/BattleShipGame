import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Game, Player
from ..serializers import GameSerializer
from ..logic import process_shot

class UseAbilityView(APIView):
    def post(self, request, *args, **kwargs):
        game_id = self.kwargs.get('pk')
        player_id = request.data.get('player_id')
        ability_type = request.data.get('ability_type')

        if not all([player_id, ability_type]):
            return Response({"error": "player_id and ability_type are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(id=game_id)
            player = Player.objects.get(id=player_id)
            opponent = game.players.exclude(id=player.id).get()

            if not game.power_ups_enabled:
                return Response({"error": "Power-ups are not enabled for this game."}, status=status.HTTP_400_BAD_REQUEST)
            if game.current_turn != player:
                return Response({"error": "It's not your turn."}, status=status.HTTP_400_BAD_REQUEST)

            ability_result = {}

            if ability_type == 'scout':
                if player.used_scout_plane:
                    return Response({"error": "Scout plane already used."}, status=status.HTTP_400_BAD_REQUEST)
                player.used_scout_plane = True

                opponent_ship_coords = {tuple(c) for ship in opponent.ships.all() for c in ship.coordinates}
                scan_row, scan_col = random.randint(0, 8), random.randint(0, 8)
                scouted_cells = [{"coords": [r, c], "has_ship": (r, c) in opponent_ship_coords}
                                 for r in range(scan_row, scan_row + 2) for c in range(scan_col, scan_col + 2)]
                ability_result = {"scouted_cells": scouted_cells}

            elif ability_type == 'emp':
                if player.used_emp:
                    return Response({"error": "EMP blast already used."}, status=status.HTTP_400_BAD_REQUEST)
                player.used_emp = True
                game.emp_active_on_player = opponent
                ability_result = {"message": f"EMP blast successful! {opponent.name} is disabled for one turn."}

            elif ability_type == 'torpedo':
                if player.used_torpedo:
                    return Response({"error": "Torpedo already used."}, status=status.HTTP_400_BAD_REQUEST)

                target_type = request.data.get('target_type')
                index = request.data.get('index')
                if target_type not in ['row', 'col'] or not isinstance(index, int):
                    return Response({"error": "Invalid torpedo target."}, status=status.HTTP_400_BAD_REQUEST)

                player.used_torpedo = True

                opponent_ships = opponent.ships.all()
                hit_coord = None

                coords_in_path = []
                if target_type == 'row':
                    coords_in_path = [(index, c) for c in range(10)]
                else: # col
                    coords_in_path = [(r, index) for r in range(10)]

                for ship in opponent_ships:
                    if ship.is_sunk: continue
                    for coord in ship.coordinates:
                        if tuple(coord) in [tuple(c) for c in coords_in_path]:
                            hit_coord = coord
                            break
                    if hit_coord: break

                if hit_coord:
                    shot_result = process_shot(game, player, hit_coord)
                    ability_result = {"shot_result": shot_result, "torpedo_path": {"type": target_type, "index": index}}
                else:
                    ability_result = {"shot_result": {"result": "miss", "message": "Torpedo missed!"}, "torpedo_path": {"type": target_type, "index": index}}

            else:
                return Response({"error": "Invalid ability type."}, status=status.HTTP_400_BAD_REQUEST)

            player.save()
            game.save()
            game.refresh_from_db()
            serializer = GameSerializer(game)

            return Response({
                "game_state": serializer.data,
                "ability_result": ability_result
            }, status=status.HTTP_200_OK)

        except (Game.DoesNotExist, Player.DoesNotExist):
            return Response({"error": "Game or Player not found."}, status=status.HTTP_404_NOT_FOUND)
