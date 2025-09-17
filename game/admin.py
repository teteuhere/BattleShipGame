from django.contrib import admin
from .models import Game, Player, Ship

# Register your models here so you can see them in the admin panel
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(Ship)

