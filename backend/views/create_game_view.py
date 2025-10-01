from rest_framework import generics
from ..models import Game, Player
from ..serializers import GameSerializer
from ..logic import place_ai_ships

class CreateGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        # --- UPDATED LOGIC TO HANDLE SEPARATE MODES ---
        player_mode = self.request.data.get('player_mode', 'pvp') # 'pvp' or 'pva'
        game_rules = self.request.data.get('game_rules', 'classic') # 'classic' or 'salvo'
        power_ups_enabled = self.request.data.get('power_ups_enabled', False)

        player1_name_data = self.request.data.get('player1_name')
        player1_name = player1_name_data.strip() if player1_name_data else "Jogador 1"

        player2_name_data = self.request.data.get('player2_name')
        player2_name = player2_name_data.strip() if player2_name_data else None

        game = serializer.save(
            power_ups_enabled=power_ups_enabled,
            game_mode=game_rules # Save the game rules ('classic' or 'salvo')
        )

        player1 = Player.objects.create(game=game, name=player1_name, is_ai=False)

        # Use player_mode to decide if an AI is needed
        if player_mode == 'pva':
            ai_player = Player.objects.create(game=game, name='gemma:2b AI', is_ai=True)
            place_ai_ships(ai_player)
        else: # pvp
            Player.objects.create(game=game, name=player2_name, is_ai=False)

        game.current_turn = player1
        game.save()
