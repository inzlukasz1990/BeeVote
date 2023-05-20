from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class MyAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        url = super().get_email_confirmation_url(request, emailconfirmation)
        return settings.FRONTEND_URL + url