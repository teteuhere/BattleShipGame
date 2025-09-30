import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Prepara os dados e envia para o backend iniciar um novo jogo.
// Manda para o backend o layout final dos navios do jogador.
// Envia as coordenadas do disparo para o backend e retorna o novo estado do jogo.
// Comunica diretamente com a IA para uma conversa.

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

export const fireShot = async (gameId, playerId, coordinates) => {
    try {
        const payload = {
            player_id: playerId,
            coordinates: coordinates,
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
