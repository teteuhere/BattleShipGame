from rest_framework import generics
from ..models import Game, Player
from ..serializers import GameSerializer
from ..logic import place_ai_ships

# A view que orquestra a criação de um novo jogo.
# Ela prepara o terreno, cria os jogadores e, se necessário, já posiciona os navios da IA.
# A lógica aqui é um "plano de ataque" que garante que tudo esteja pronto para a batalha começar.

class CreateGameView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        game_mode = self.request.data.get('game_mode', 'pvp')

        player1_name_data = self.request.data.get('player1_name')
        player1_name = player1_name_data.strip() if player1_name_data else "Jogador 1"
        
        player2_name_data = self.request.data.get('player2_name')
        player2_name = player2_name_data.strip() if player2_name_data else None

        game = serializer.save()

        player1 = Player.objects.create(game=game, name=player1_name, is_ai=False)

        if game_mode == 'pva':
            ai_player = Player.objects.create(game=game, name='gemma:2b AI', is_ai=True)
            place_ai_ships(ai_player)
        else:
            Player.objects.create(game=game, name=player2_name, is_ai=False)

        game.current_turn = player1
        game.save()