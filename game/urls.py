from django.urls import path
from .views import (
    CreateGameView,
    GameStateView,
    PlaceShipsView,
    FireShotView
)

urlpatterns = [
    path('games/', CreateGameView.as_view(), name='create_game'),
    path('games/<int:pk>/', GameStateView.as_view(), name='game_state'),
    path('games/<int:pk>/place-ships/', PlaceShipsView.as_view(), name='place_ships'),
    path('games/<int:pk>/fire/', FireShotView.as_view(), name='fire_shot'),
]