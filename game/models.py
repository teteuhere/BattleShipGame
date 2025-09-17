from django.db import models

# Create your models here.

class Game(models.Model):
    status = models.CharField(max_length=20, default='in_progress')
    created_at = models.DateTimeField(auto_now_add=True)

class Player(models.Model):
    game = models.ForeignKey(Game, related_name='players', on_delete=models.CASCADE)
    is_ai = models.BooleanField(default=False)
    name = models.CharField(max_length=50)

class Ship(models.Model):
    player = models.ForeignKey(Player, related_name='ships', on_delete=models.CASCADE)
    ship_type = models.CharField(max_length=20)
    coordinates = models.JSONField()
    is_sunk = models.BooleanField(default=False)