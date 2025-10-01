from django.db import models

class Player(models.Model):
    game = models.ForeignKey(
        'backend.Game',
        related_name='players',
        on_delete=models.CASCADE
    )
    is_ai = models.BooleanField(default=False)
    name = models.CharField(max_length=50)
    hits = models.PositiveIntegerField(default=0)
    misses = models.PositiveIntegerField(default=0)
    used_scout_plane = models.BooleanField(default=False)
    used_torpedo = models.BooleanField(default=False)
    used_emp = models.BooleanField(default=False)
