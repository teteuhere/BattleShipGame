from rest_framework import generics
from ..models import Game, Player
from ..serializers import GameSerializer
from ..logic import place_ai_ships

class CreateGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        game_mode = self.request.data.get('game_mode', 'pvp')

        # Pega os nomes dos jogadores da requisição.
        # Removendo os valores padrão para forçar o uso dos nomes passados.
        player1_name = self.request.data.get('player1_name').strip()
        player2_name = self.request.data.get('player2_name').strip()

        game = serializer.save()

        player1 = Player.objects.create(game=game, name=player1_name, is_ai=False)

        if game_mode == 'pva':
            ai_player = Player.objects.create(game=game, name='gemma:2b AI', is_ai=True)
            place_ai_ships(ai_player)
        else:
            Player.objects.create(game=game, name=player2_name, is_ai=False)

        game.current_turn = player1
        game.save()
