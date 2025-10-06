from rest_framework import generics
from ..models import Game, Player
from ..serializers import GameSerializer

class CreateOnlineGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        player_name = self.request.data.get('player1_name', 'Jogador 1').strip()

        board_width = self.request.data.get('board_width', 10)
        board_height = self.request.data.get('board_height', 10)

        game = serializer.save(
            game_mode='classic',
            status='waiting_for_player',
            board_width=board_width,
            board_height=board_height
        )

        player1 = Player.objects.create(game=game, name=player_name, is_ai=False)
        game.current_turn = player1
        game.save()
