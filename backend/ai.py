import requests
import json
import random
from .models import Player, Shot
from .logic import process_shot

def trigger_ai_turn(game):
    """
    Constructs a prompt for the Ollama AI, gets its move, and processes it.
    """
    try:
        ai_player = game.players.get(is_ai=True)
    except Player.DoesNotExist:
        return {"error": "Could not find the AI player."}

    ai_shots = Shot.objects.filter(player=ai_player).order_by('timestamp')
    shot_history = []
    already_shot_coords = []
    for shot in ai_shots:
        result = "hit" if shot.is_hit else "miss"
        shot_history.append(f"- Shot at {shot.coordinates}: {result}")
        # Use a tuple for faster checking later
        already_shot_coords.append(tuple(shot.coordinates))

    shot_history_str = "\\n".join(shot_history)
    if not shot_history_str:
        shot_history_str = "You have not fired any shots yet."

    prompt = (
        "You are a Battleship AI. The board is 10x10 (0-9). "
        "Your goal is to sink the human's ships. "
        "Here are your previous shots:\\n"
        f"{shot_history_str}\\n"
        f"Do not shoot at these coordinates again: {already_shot_coords}\\n"
        "Return your next shot as JSON, like {\"coordinates\": [x, y]}. "
        "Do not add any other text. A clever coordinate to shoot at would be:"
    )

    payload = {
        "model": "gemma:2b",
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    ollama_url = "http://ollama:11434/api/generate"

    try:
        response = requests.post(ollama_url, json=payload, timeout=60)
        response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)

        response_text = response.json().get('response', '{}')
        ai_move = json.loads(response_text)
        ai_coordinates = ai_move.get("coordinates")

        if not ai_coordinates or not isinstance(ai_coordinates, list) or len(ai_coordinates) != 2:
            return {"error": "The AI did not return valid coordinates."}

        if tuple(ai_coordinates) in set(already_shot_coords):
            all_coords = {(r, c) for r in range(10) for c in range(10)}
            available_coords = list(all_coords - set(already_shot_coords))
            if not available_coords:
                return {"error": "No available coordinates to shoot at."}
            ai_coordinates = list(random.choice(available_coords))

        ai_shot_result = process_shot(game, ai_player, ai_coordinates)
        return {"coordinates": ai_coordinates, "result": ai_shot_result}

    except requests.exceptions.HTTPError as e:
        error_details = e.response.json().get('error', str(e))
        if 'model' in error_details and 'not found' in error_details:
            return {"error": f"The AI model '{payload['model']}' was not found in Ollama. Please make sure it's pulled."}
        return {"error": f"The AI service returned an HTTP error: {error_details}"}
    except requests.exceptions.ConnectionError:
        return {"error": f"Could not connect to the AI service at {ollama_url}. Is the Ollama container running?"}
    except requests.exceptions.Timeout:
        return {"error": "The request to the AI service timed out. The AI might be taking too long to think."}
    except requests.exceptions.RequestException as e:
        return {"error": f"An unexpected error occurred with the AI service: {e}"}
    except json.JSONDecodeError:
        return {"error": "The AI returned a response that was not valid JSON."}
