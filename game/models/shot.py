from django.db import models

class Shot(models.Model):
    game = models.ForeignKey(
        'game.Game',
        related_name='shots',
        on_delete=models.CASCADE
    )
    player = models.ForeignKey(
        'game.Player',
        related_name='shots_fired',
        on_delete=models.CASCADE
    )
    coordinates = models.JSONField()
    is_hit = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)
    hit_ship = models.ForeignKey(
        'game.Ship',
        related_name='hits',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )