import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const createGame = async (playerMode, gameRules, gameOptions) => {
  try {
    const payload = {
      player_mode: playerMode,
      game_rules: gameRules,
      player1_name: gameOptions.player1,
      player2_name: gameOptions.player2,
      power_ups_enabled: gameOptions.power_ups_enabled,
    };
    const response = await axios.post(`${API_URL}/games/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

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

export const fireShot = async (gameId, playerId, coordinatesList) => { // Renamed to coordinatesList
    try {
        const payload = {
            player_id: playerId,
            coordinates: coordinatesList, // Send the list
        };
        const response = await axios.post(`${API_URL}/games/${gameId}/fire/`, payload);
        return response.data;
    } catch (error) {
        console.error("Error firing shot:", error);
        throw error;
    }
};


export const chatWithAI = async (message) => {
  try {
    const payload = { message: message };
    const response = await axios.post(`${API_URL}/chat-ai/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
};

export const surrenderGame = async (gameId, playerId) => {
  try {
    const payload = {
      player_id: playerId,
    };
    const response = await axios.post(`${API_URL}/games/${gameId}/surrender/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error surrendering game:", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};

/**
 * A generic function to use any player ability.
 * @param {number} gameId - The ID of the current game.
 * @param {number} playerId - The ID of the player using the ability.
 * @param {string} abilityType - The type of ability ('scout', 'torpedo', 'emp').
 * @param {object} options - Extra data needed for the ability (e.g., torpedo target).
 */
export const useAbility = async (gameId, playerId, abilityType, options = {}) => {
  try {
    const payload = {
      player_id: playerId,
      ability_type: abilityType,
      ...options,
    };
    const response = await axios.post(`${API_URL}/games/${gameId}/use-ability/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error using ${abilityType} ability:`, error);
    const errorMessage = error.response?.data?.error || `Failed to use ${abilityType}.`;
    throw new Error(errorMessage);
  }
};
