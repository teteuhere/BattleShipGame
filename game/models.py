# game/models.py

from django.db import models
from django.utils import timezone # Import timezone to set finished_at

class Game(models.Model):
    status = models.CharField(max_length=20, default='placing_ships')
    created_at = models.DateTimeField(auto_now_add=True)
    current_turn = models.ForeignKey('Player', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    winner = models.ForeignKey('Player', on_delete=models.SET_NULL, null=True, blank=True, related_name='won_games')
    finished_at = models.DateTimeField(null=True, blank=True)

    # --- NEW PROPERTY ---
    # Calculate game duration on the fly!
    @property
    def duration(self):
        if self.finished_at:
            return self.finished_at - self.created_at
        return None

class Player(models.Model):
    game = models.ForeignKey(Game, related_name='players', on_delete=models.CASCADE)
    is_ai = models.BooleanField(default=False)
    name = models.CharField(max_length=50)

    # --- NEW FIELDS ---
    # Track player stats directly on their model
    hits = models.PositiveIntegerField(default=0)
    misses = models.PositiveIntegerField(default=0)


class Ship(models.Model):
    player = models.ForeignKey(Player, related_name='ships', on_delete=models.CASCADE)
    ship_type = models.CharField(max_length=20)
    coordinates = models.JSONField()
    hits = models.JSONField(default=list)

    @property
    def is_sunk(self):
        return len(self.hits) >= len(self.coordinates)


class Shot(models.Model):
    game = models.ForeignKey(Game, related_name='shots', on_delete=models.CASCADE)
    player = models.ForeignKey(Player, related_name='shots_fired', on_delete=models.CASCADE)
    coordinates = models.JSONField()
    is_hit = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)