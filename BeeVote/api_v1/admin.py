from django.contrib import admin
from .models import Board, Idea, Vote

admin.site.register(Board)
admin.site.register(Idea)
admin.site.register(Vote)