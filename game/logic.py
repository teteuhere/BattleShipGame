from .models import Player, Shot, Ship
from django.utils import timezone
import random

# Quando um disparo atinge o alvo, o sistema do jogo age!
# O primeiro navio atingido causa uma reação em cadeia e afunda por completo.
# Registramos cada tiro e o resultado na história do jogador.
# Verificamos se a frota inimiga foi toda pro fundo do mar!
# Se o tiro não acertou nada, registramos como um "tiro na água".

# Esta função é a cereja do bolo! Ela define a estratégia para a IA,
# posicionando seus navios de forma esperta para o combate.
# O loop garante que os navios sempre sejam colocados em posições válidas,
# sem saírem do mapa ou colidirem uns com os outros.


def process_shot(game, firing_player, coordinates):
    try:
        opponent = game.players.exclude(id=firing_player.id).get()
    except Player.DoesNotExist:
        return {"error": "Could not find an opponent for the player."}

    shot_is_a_hit = False
    hit_ship = None

    for ship in opponent.ships.all():
        if tuple(coordinates) in [tuple(c) for c in ship.coordinates]:
            shot_is_a_hit = True
            hit_ship = ship
            break

    if shot_is_a_hit:
        ships_to_sink = [hit_ship]
        processed_ids = {hit_ship.id}
        
        i = 0
        while i < len(ships_to_sink):
            current_ship = ships_to_sink[i]
            blast_radius = set()
            for r, c in current_ship.coordinates:
                for dr in [-1, 0, 1]:
                    for dc in [-1, 0, 1]:
                        if dr == 0 and dc == 0:
                            continue
                        blast_radius.add((r + dr, c + dc))
            for other_ship in opponent.ships.all():
                if other_ship.id not in processed_ids:
                    for coord in other_ship.coordinates:
                        if tuple(coord) in blast_radius:
                            ships_to_sink.append(other_ship)
                            processed_ids.add(other_ship.id)
                            break 
            i += 1
        total_hits = 0
        for ship in ships_to_sink:
            total_hits += len(ship.coordinates)
            for coord in ship.coordinates:
                Shot.objects.get_or_create(
                    game=game, player=firing_player, coordinates=coord,
                    defaults={'is_hit': True, 'hit_ship': ship}
                )
        firing_player.hits += total_hits
        if all(s.is_sunk for s in opponent.ships.all()):
            game.status = 'finished'
            game.winner = firing_player
            game.finished_at = timezone.now()
            result_message = {"result": "win", "message": "Frota inimiga neutralizada!"}
        elif len(ships_to_sink) > 1:
            result_message = {"result": "hit", "message": f"Reação em cadeia! Você afundou {len(ships_to_sink)} navios!"}
        else:
            result_message = {"result": "hit", "message": f"Você afundou o navio '{hit_ship.ship_type}' do oponente!"}
    
    else:
        Shot.objects.create(
            game=game, player=firing_player, coordinates=coordinates,
            is_hit=False, hit_ship=None
        )
        firing_player.misses += 1
        result_message = {"result": "miss", "message": "Você errou o alvo!"}

    firing_player.save()
    game.save()
    return result_message

def place_ai_ships(ai_player):
    ships_to_place = {
        "carrier": 5,
        "battleship": 4,
        "cruiser": 3,
        "submarine": 3,
        "destroyer": 2,
    }
    board_size = 10
    occupied_coords = set()

    for ship_type, length in ships_to_place.items():
        placed = False
        while not placed:
            orientation = random.choice(['horizontal', 'vertical'])
            if orientation == 'horizontal':
                start_row = random.randint(0, board_size - 1)
                start_col = random.randint(0, board_size - length)
                ship_coords = [[start_row, start_col + i] for i in range(length)]
            else: # vertical
                start_row = random.randint(0, board_size - length)
                start_col = random.randint(0, board_size - 1)
                ship_coords = [[start_row + i, start_col] for i in range(length)]

            if not any(tuple(coord) in occupied_coords for coord in ship_coords):
                Ship.objects.create(
                    player=ai_player,
                    ship_type=ship_type,
                    coordinates=ship_coords
                )
                for coord in ship_coords:
                    occupied_coords.add(tuple(coord))
                placed = True