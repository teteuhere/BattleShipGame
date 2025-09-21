import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// A função agora aceita um objeto playerNames
export const createGame = async (gameMode, playerNames) => {
  try {
    const payload = {
      game_mode: gameMode,
      player1_name: playerNames.player1,
      player2_name: playerNames.player2,
    };
    const response = await axios.post(`${API_URL}/games/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};


/**
 * Takes the final ship layout and sends it to the backend to be saved.
 */
export const placeShips = async (gameId, playerId, ships) => {
  try {
    const payload = {
      player_id: playerId,
      ships: ships,
    };
    const response = await axios.post(`${API_URL}/games/${gameId}/place-ships/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error placing ships:", error);
    throw error;
  }
};

/**
 * Sends shot coordinates to the backend and returns the complete, updated
 * game state from the single API call. This is super efficient!
 */
export const fireShot = async (gameId, playerId, coordinates) => {
    try {
        const payload = {
            player_id: playerId,
            coordinates: coordinates,
        };
        // The POST request now returns the full game state!
        const response = await axios.post(`${API_URL}/games/${gameId}/fire/`, payload);
        return response.data;
    } catch (error) {
        console.error("Error firing shot:", error);
        throw error;
    }
};