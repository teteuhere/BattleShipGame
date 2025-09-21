# game/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Game, Player

class GameCreationTests(APITestCase):
    """
    Tests for the game creation process.
    """
    def test_create_game_endpoint(self):
        """
        Ensure we can create a new game object and it automatically creates two players.
        """
        # The URL for creating a game
        url = reverse('create_game')
        
        # Make a POST request to the endpoint
        response = self.client.post(url, format='json')
        
        # --- Assertions ---
        # 1. Check that the request was successful (HTTP 201 Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 2. Check that exactly one Game has been created in the database
        self.assertEqual(Game.objects.count(), 1)
        
        # 3. Check that exactly two Players have been created
        self.assertEqual(Player.objects.count(), 2)
        
        # 4. Check that the players are linked to the created game
        game = Game.objects.first()
        self.assertEqual(game.players.count(), 2)