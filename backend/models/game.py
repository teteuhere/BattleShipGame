from django.db import models
from django.utils import timezone
import uuid

class Game(models.Model):
    status = models.CharField(max_length=20, default='placing_ships')
    game_mode = models.CharField(max_length=20, default='classic')
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
    game_code = models.CharField(max_length=10, unique=True, blank=True)

    board_width = models.PositiveIntegerField(default=10)
    board_height = models.PositiveIntegerField(default=10)

    def save(self, *args, **kwargs):
        if not self.game_code:
            self.game_code = uuid.uuid4().hex[:6].upper()
        super().save(*args, **kwargs)

    @property
    def duration(self):
        if self.finished_at:
            return self.finished_at - self.created_at
        return None
