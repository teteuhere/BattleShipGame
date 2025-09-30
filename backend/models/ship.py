from django.db import models

# Um navio afunda quando a quantidade de acertos é igual ao seu tamanho.

class Ship(models.Model):
    player = models.ForeignKey(
        'backend.Player',
        related_name='ships',
        on_delete=models.CASCADE
    )
    ship_type = models.CharField(max_length=20)
    coordinates = models.JSONField()

    @property
    def is_sunk(self):
        return self.hits.filter(is_hit=True).count() >= len(self.coordinates)
