from django.urls import path, include
from allauth.account.views import confirm_email
from rest_framework_nested import routers

from .views import confirm_email
from .views import GroupViewSet, UserViewSet, BoardViewSet, BoardIdeasViewSet, BoardIdeaVotesViewSet

router = routers.SimpleRouter()
router.register(r'groups', GroupViewSet)
router.register(r'users', UserViewSet)
router.register(r'boards', BoardViewSet)

boards_router = routers.NestedSimpleRouter(router, r'boards', lookup='board')
boards_router.register(r'ideas', BoardIdeasViewSet, basename='ideas')

ideas_router = routers.NestedSimpleRouter(boards_router, r'ideas', lookup='idea')
ideas_router.register(r'votes', BoardIdeaVotesViewSet, basename='votes')

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/confirm-email/<str:key>', confirm_email, name='account_confirm_email'),
    path('', include(router.urls)),
    path('', include(boards_router.urls)),
    path('', include(ideas_router.urls)),
]
