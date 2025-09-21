from django.db import models
from django.utils import timezone

class Game(models.Model):
    status = models.CharField(max_length=20, default='placing_ships')
    created_at = models.DateTimeField(auto_now_add=True)
    current_turn = models.ForeignKey(
        'game.Player',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )
    winner = models.ForeignKey(
        'game.Player',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='won_games'
    )
    finished_at = models.DateTimeField(null=True, blank=True)

    @property
    def duration(self):
        if self.finished_at:
            return self.finished_at - self.created_at
        return None