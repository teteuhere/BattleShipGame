import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://52.15.115.204:8000/api';

const getApiBaseUrl = () => {
  const { protocol, hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://52.15.115.204:8000/api';
  }
  return `${protocol}//${hostname}:8000/api`;
};

const API_URL = getApiBaseUrl();

export const createOnlineGame = async (playerName, { boardWidth, boardHeight }) => {
  try {
    const payload = {
      player1_name: playerName,
      power_ups_enabled: true,
      board_width: boardWidth,
      board_height: boardHeight,
    };
    const response = await axios.post(`${API_URL}/games/online/create/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating online game:", error);
    throw error;
  }
};


export const createGame = async (playerMode, gameRules, gameOptions) => {
  try {
    const payload = {
      player_mode: playerMode,
      game_rules: gameRules,
      player1_name: gameOptions.player1,
      player2_name: gameOptions.player2,
      power_ups_enabled: gameOptions.power_ups_enabled,
      board_width: gameOptions.boardWidth,
      board_height: gameOptions.boardHeight,
    };
    const response = await axios.post(`${API_URL}/games/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

export const joinGame = async (gameCode, playerName) => {
  try {
    const payload = {
      game_code: gameCode,
      player2_name: playerName,
    };
    const response = await axios.post(`${API_URL}/games/join/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error joining game:", error.response.data);
    throw new Error(error.response.data.error || 'Failed to join game.');
  }
};

export const getGameState = async (gameId) => {
  try {
    const response = await axios.get(`${API_URL}/games/${gameId}/`);
    return response.data;
  } catch (error) {
    console.error("Error getting game state:", error);
    throw error;
  }
};

export const placeShips = async (gameId, playerId, ships) => {
  try {
    const payload = {
      player_id: playerId, // This line was missing or incorrect
      ships: ships,
    };
    const response = await axios.post(`${API_URL}/games/${gameId}/place-ships/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error placing ships:", error);
    throw error;
  }
};
// --- END UPDATE ---

export const fireShot = async (gameId, playerId, coordinatesList) => {
    try {
        const payload = {
            player_id: playerId,
            coordinates: coordinatesList,
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
