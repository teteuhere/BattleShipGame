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
        ship_coords_tuples = [tuple(c) for c in ship.coordinates]
        shot_coord_tuple = tuple(coordinates)
        if shot_coord_tuple in ship_coords_tuples:
            shot_is_a_hit = True
            hit_ship = ship
            break

    if shot_is_a_hit:
        for coord in hit_ship.coordinates:
            Shot.objects.get_or_create(
                game=game,
                player=firing_player,
                coordinates=coord,
                defaults={'is_hit': True, 'hit_ship': hit_ship}
            )

        firing_player.hits += 1
        result_message = {"result": "hit", "message": f"You sunk the opponent's {hit_ship.ship_type}!"}

        if all(s.is_sunk for s in opponent.ships.all()):
            game.status = 'finished'
            game.winner = firing_player
            game.finished_at = timezone.now()
            game.save()
            result_message = {"result": "win", "message": f"{firing_player.name} has won the game!"}
    else:
        Shot.objects.create(
            game=game,
            player=firing_player,
            coordinates=coordinates,
            is_hit=False,
            hit_ship=None
        )
        firing_player.misses += 1
        result_message = {"result": "miss", "message": "You missed!"}

    firing_player.save()
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