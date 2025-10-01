from django.urls import path
from .views import (
    CreateGameView,
    GameStateView,
    PlaceShipsView,
    FireShotView,
    AIChatView,
    SurrenderView,
    LeaderboardView,
    UseAbilityView,
)

urlpatterns = [
    path('games/', CreateGameView.as_view(), name='create_game'),
    path('games/<int:pk>/', GameStateView.as_view(), name='game_state'),
    path('games/<int:pk>/place-ships/', PlaceShipsView.as_view(), name='place_ships'),
    path('games/<int:pk>/fire/', FireShotView.as_view(), name='fire_shot'),
    path('chat-ai/', AIChatView.as_view(), name='chat_ai'),
    path('games/<int:pk>/surrender/', SurrenderView.as_view(), name='surrender'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('games/<int:pk>/use-ability/', UseAbilityView.as_view(), name='use_ability'), # Add this new URL
]
