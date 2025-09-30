from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Game, Player, Ship

class GameAPITests(APITestCase):
    """
    Test suite for the entire Game API, from creation to firing shots.
    """

    def test_create_game_endpoint(self):
        """
        Ensure we can create a new game object and it automatically creates two players.
        """
        url = reverse('create_game')
        response = self.client.post(url, {"game_mode": "pvp", "player1_name": "Player 1", "player2_name": "Player 2"}, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Game.objects.count(), 1)
        self.assertEqual(Player.objects.count(), 2)

        game = Game.objects.first()
        self.assertEqual(game.players.count(), 2)
        self.assertIsNotNone(game.current_turn)

    def test_place_ships_endpoint(self):
        """
        Ensure a player can place their ships on the board.
        """
        # First, create a game to get a valid player
        game_response = self.client.post(reverse('create_game'), {"game_mode": "pvp", "player1_name": "Player 1", "player2_name": "Player 2"}, format='json')
        game_id = game_response.data['id']
        player1_id = game_response.data['players'][0]['id']

        url = reverse('place_ships', kwargs={'pk': game_id})
        ships_data = {
            "player_id": player1_id,
            "ships": [
                {"ship_type": "carrier", "coordinates": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]},
                {"ship_type": "battleship", "coordinates": [[1, 0], [1, 1], [1, 2], [1, 3]]}
            ]
        }
        response = self.client.post(url, ships_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ship.objects.filter(player_id=player1_id).count(), 2)

    def test_fire_shot_endpoint(self):
        """
        Ensure a player can fire a shot and the game state is updated.
        """
        # 1. Create Game
        game_response = self.client.post(reverse('create_game'), {"game_mode": "pvp", "player1_name": "Captain", "player2_name": "Ronin"}, format='json')
        game_id = game_response.data['id']
        player1_id = game_response.data['players'][0]['id']
        player2_id = game_response.data['players'][1]['id']

        # 2. Place ships for Player 2 (the one being shot at)
        self.client.post(
            reverse('place_ships', kwargs={'pk': game_id}),
            {
                "player_id": player2_id,
                "ships": [{"ship_type": "destroyer", "coordinates": [[5, 5], [5, 6]]}]
            },
            format='json'
        )

        # 3. Player 1 fires a shot
        url = reverse('fire_shot', kwargs={'pk': game_id})
        shot_data = {"player_id": player1_id, "coordinates": [5, 5]}
        response = self.client.post(url, shot_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['shot_result']['result'], 'hit')

        # Check that it's now Player 2's turn
        self.assertEqual(response.data['game_state']['current_turn'], player2_id)
