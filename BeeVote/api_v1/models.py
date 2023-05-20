from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta


def one_week_from_now():
    return timezone.now() + timedelta(weeks=1)


def get_next_order_value():
    return Idea.objects.count() + 1


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
    order = models.PositiveIntegerField(default=get_next_order_value)
    voting_start = models.DateTimeField(default=timezone.now)
    voting_end = models.DateTimeField(default=one_week_from_now)
    voting_result = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if self.voting_end and timezone.now() > self.voting_end:
            votes = self.votes.values_list('value', flat=True)
            positive_votes = votes.count(True)
            negative_votes = votes.count(False)
            self.voting_result = positive_votes > negative_votes
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    idea = models.ForeignKey(Idea, related_name='votes', on_delete=models.CASCADE)
    value = models.BooleanField()  # True for upvote, False for downvote

    class Meta:
        unique_together = ('user', 'idea')
