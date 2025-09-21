from django.db import models

class Ship(models.Model):
    player = models.ForeignKey(
        'game.Player',
        related_name='ships',
        on_delete=models.CASCADE
    )
    ship_type = models.CharField(max_length=20)
    coordinates = models.JSONField()

    @property
    def is_sunk(self):
        # The ship is sunk if the number of hits is equal to its length
        return self.hits.count() >= len(self.coordinates)