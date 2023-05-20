from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import Group
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.db.models import Max

class User(AbstractUser):
    pass
    
User=get_user_model()
    
class Board(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    def clean(self):
        if self.group not in self.user.groups.all():
            raise ValidationError("The user does not belong to the chosen group.")
        super().clean()

class Idea(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    content = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey(Idea, related_name='votes', on_delete=models.CASCADE)
    value = models.BooleanField()  # True for upvote, False for downvote

    class Meta:
        unique_together = ('user', 'idea')  # User can only vote once on each idea