from .models import Player

def process_shot(game, firing_player, coordinates):
    """
    Handles the logic for a single shot. It checks for hits against the
    opponent's ships and updates the game state accordingly.
    """
    try:
        # Identify the opponent player
        opponent = game.players.exclude(id=firing_player.id).get()
    except Player.DoesNotExist:
        return {"error": "Could not find an opponent for the player."}

    # Check each of the opponent's ships
    for ship in opponent.ships.all():
        # Check if the shot coordinates match any of the ship's coordinates
        if tuple(coordinates) in [tuple(c) for c in ship.coordinates]:
            # It's a HIT!
            # (A more advanced version would track which part of the ship was hit)
            ship.is_sunk = True # For simplicity, we'll say a single hit sinks a ship
            ship.save()

            # After a hit, check if the opponent has any ships left
            if not opponent.ships.filter(is_sunk=False).exists():
                game.status = 'finished'
                game.save()
                return {"result": "win", "message": f"{firing_player.name} has won the game!"}

            return {"result": "hit", "message": f"You hit the opponent's {ship.ship_type}!"}

    # If the loop finishes without finding a match, it's a miss
    return {"result": "miss", "message": "You missed!"}