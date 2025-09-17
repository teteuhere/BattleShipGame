import requests
import json
from .models import Player
from .logic import process_shot # Import the core logic!

def trigger_ai_turn(game):
    """
    Constructs a prompt for the Ollama AI, gets its move, and processes it.
    """
    try:
        # Find the AI and human players in the current game
        ai_player = game.players.get(is_ai=True)
        human_player = game.players.get(is_ai=False)
    except Player.DoesNotExist:
        return {"error": "Could not find the AI or human player."}

    # --- Construct a Prompt for the AI ---
    # This prompt asks the AI to act as a Battleship player and return
    # its move in a clean JSON format.
    prompt = (
        "You are a Battleship AI. The game board is 10x10 (coordinates 0-9). "
        "Your goal is to sink the human player's ships. "
        "Return your next shot as a JSON object like {\"coordinates\": [x, y]}. "
        "Do not add any other text or explanation outside of the JSON. "
        "A clever coordinate to shoot at would be: "
    )

    # --- Call the Ollama AI Service ---
    try:
        # The URL uses the Docker service name 'ollama' as the hostname
        ollama_url = "http://ollama:11434/api/generate"
        payload = {
            "model": "deepseek-coder", # The model you are using
            "prompt": prompt,
            "stream": False,
            "format": "json" # This tells Ollama to ensure the output is valid JSON
        }

        # Make the request to the Ollama container
        response = requests.post(ollama_url, json=payload)
        response.raise_for_status() # This will raise an error for bad responses (like 404 or 500)

        # Parse the JSON response from Ollama
        response_text = response.json().get('response', '{}')
        ai_move = json.loads(response_text)
        ai_coordinates = ai_move.get("coordinates")

        if not ai_coordinates:
            return {"error": "The AI did not return valid coordinates."}

        # Use the SAME logic function to process the AI's shot!
        ai_shot_result = process_shot(game, ai_player, ai_coordinates)
        return {"coordinates": ai_coordinates, "result": ai_shot_result}

    except requests.exceptions.RequestException as e:
        return {"error": f"Could not connect to the AI service: {e}"}
    except json.JSONDecodeError:
        return {"error": "The AI returned a response that was not valid JSON."}