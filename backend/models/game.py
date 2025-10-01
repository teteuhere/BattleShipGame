from django.db import models
from django.utils import timezone

class Game(models.Model):
    status = models.CharField(max_length=20, default='placing_ships')
    game_mode = models.CharField(max_length=20, default='classic') # classic vs salvo
    created_at = models.DateTimeField(auto_now_add=True)
    current_turn = models.ForeignKey(
        'backend.Player',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )
    winner = models.ForeignKey(
        'backend.Player',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='won_games'
    )
    finished_at = models.DateTimeField(null=True, blank=True)
    power_ups_enabled = models.BooleanField(default=False)
    emp_active_on_player = models.ForeignKey(
        'backend.Player',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='emp_effect'
    )

    @property
    def duration(self):
        if self.finished_at:
            return self.finished_at - self.created_at
        return None
