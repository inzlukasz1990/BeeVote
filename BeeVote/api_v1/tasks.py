from celery import shared_task
from django.utils import timezone
from .models import Idea


@shared_task
def check_voting_results():
    ideas = Idea.objects.filter(voting_end__lt=timezone.now())

    for idea in ideas:
        votes = idea.votes.filter(value=True)
        positive_votes = votes.count()

        idea.voting_result = (positive_votes - (idea.board.group.user_set.count() // 2)) > 0
        idea.save()
