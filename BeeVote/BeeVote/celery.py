import os
from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BeeVote.settings')

app = Celery('BeeVote')

redis_host = "redis://127.0.0.1:6379/0"
app.conf.broker_url = redis_host
app.conf.result_backend = redis_host

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check_voting_results_every_midnight': {
        'task': 'api_v1.tasks.check_voting_results',
        'schedule': crontab(hour=0, minute=0),
    },
}