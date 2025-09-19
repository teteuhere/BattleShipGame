# game/logic.py

from .models import Player, Shot
from django.utils import timezone

def process_shot(game, firing_player, coordinates):
    """
    Handles the logic for a single shot with detailed tracking.
    - Creates a Shot record for every attempt.
    - Updates ship hits and checks if it's sunk.
    - Updates player's hit/miss counters.
    - Checks for a win condition and ends the game.
    """
    try:
        opponent = game.players.exclude(id=firing_player.id).get()
    except Player.DoesNotExist:
        return {"error": "Could not find an opponent for the player."}

    shot_is_a_hit = False
    hit_ship_type = None

    # Check each of the opponent's ships
    for ship in opponent.ships.all():
        # Convert coordinates to tuples for reliable comparison
        ship_coords_tuples = [tuple(c) for c in ship.coordinates]
        shot_coord_tuple = tuple(coordinates)

        # Check if the shot hits the ship AND hasn't been hit there before
        if shot_coord_tuple in ship_coords_tuples and shot_coord_tuple not in [tuple(h) for h in ship.hits]:
            # It's a HIT!
            shot_is_a_hit = True
            hit_ship_type = ship.ship_type
            ship.hits.append(coordinates)
            ship.save()
            break # Exit the loop once a hit is registered

    # --- Update Stats and Create Shot Record ---
    if shot_is_a_hit:
        firing_player.hits += 1
        result_message = {"result": "hit", "message": f"You hit the opponent's {hit_ship_type}!"}

        # After a hit, check if this sinks the entire fleet
        if not opponent.ships.exclude(id__in=[s.id for s in opponent.ships.all() if s.is_sunk]).exists():
            game.status = 'finished'
            game.winner = firing_player
            game.finished_at = timezone.now()
            game.save()
            result_message = {"result": "win", "message": f"{firing_player.name} has won the game!"}
    else:
        firing_player.misses += 1
        result_message = {"result": "miss", "message": "You missed!"}

    firing_player.save()

    # Record every shot in the database
    Shot.objects.create(
        game=game,
        player=firing_player,
        coordinates=coordinates,
        is_hit=shot_is_a_hit
    )

    return result_message