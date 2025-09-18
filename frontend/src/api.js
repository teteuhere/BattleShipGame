// frontend/src/api.js

import axios from 'axios';

// The base URL for our Django API.
const API_URL = 'http://localhost:8000/api';

/**
 * Creates a new game session.
 */
export const createGame = () => {
  return axios.post(`${API_URL}/games/`);
};

/**
 * Places ships for a given player.
 */
export const placeShips = (gameId, playerId, ships) => {
  return axios.post(`${API_URL}/games/${gameId}/place-ships/`, {
    player_id: playerId,
    ships: ships,
  });
};

/**
 * Fires a shot at a given coordinate.
 */
export const fireShot = (gameId, playerId, coordinates) => {
  return axios.post(`${API_URL}/games/${gameId}/fire/`, {
    player_id: playerId,
    coordinates: coordinates,
  });
};