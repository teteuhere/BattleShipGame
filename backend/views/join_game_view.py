from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Game, Player
from ..serializers import GameSerializer

class JoinGameView(APIView):
    def post(self, request, *args, **kwargs):
        game_code = request.data.get('game_code')
        player2_name = request.data.get('player2_name')

        if not game_code or not player2_name:
            return Response({"error": "game_code and player2_name are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            game = Game.objects.get(game_code=game_code.upper())

            if game.players.count() >= 2:
                return Response({"error": "This game is already full."}, status=status.HTTP_400_BAD_REQUEST)

            player1 = game.players.first()

            Player.objects.create(game=game, name=player2_name.strip(), is_ai=False)

            game.refresh_from_db()

            game.status = 'placing_ships'
            game.current_turn = player1
            game.save()

            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Game.DoesNotExist:
            return Response({"error": "Game not found."}, status=status.HTTP_404_NOT_FOUND)
