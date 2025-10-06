from rest_framework import generics
from ..models import Game, Player
from ..serializers import GameSerializer
from ..logic import place_ai_ships

class CreateGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        player_mode = self.request.data.get('player_mode', 'pvp')
        game_rules = self.request.data.get('game_rules', 'classic')
        power_ups_enabled = self.request.data.get('power_ups_enabled', False)

        board_width = self.request.data.get('board_width', 10)
        board_height = self.request.data.get('board_height', 10)

        player1_name_data = self.request.data.get('player1_name')
        player1_name = player1_name_data.strip() if player1_name_data else "Jogador 1"

        game = serializer.save(
            power_ups_enabled=power_ups_enabled,
            game_mode=game_rules,
            status='waiting_for_player' if player_mode == 'online' else 'placing_ships',
            board_width=board_width,
            board_height=board_height
        )

        player1 = Player.objects.create(game=game, name=player1_name, is_ai=False)

        if player_mode == 'pva':
            ai_player = Player.objects.create(game=game, name='gemma:2b AI', is_ai=True)
            place_ai_ships(ai_player)
        elif player_mode == 'pvp':
            player2_name_data = self.request.data.get('player2_name')
            player2_name = player2_name_data.strip() if player2_name_data else "Jogador 2"
            Player.objects.create(game=game, name=player2_name, is_ai=False)

        game.current_turn = player1
        game.save()
