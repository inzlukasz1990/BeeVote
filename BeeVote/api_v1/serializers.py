from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Board, Idea, Vote

User=get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']
        
class BoardSerializer(serializers.ModelSerializer):
   class Meta:
        model = Board
        fields = ['id', 'user', 'group', 'title']

class IdeaSerializer(serializers.ModelSerializer):
    votes = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = ['id', 'user', 'content', 'order', 'votes']

    def get_votes(self, obj):
        return {
            'positive': Vote.objects.filter(idea__id=obj.pk, value=True).count(),
            'negative': Vote.objects.filter(idea__id=obj.pk, value=False).count(),
            'has_majority': Vote.objects.filter(idea__id=obj.pk, value=True).count() - Vote.objects.filter(idea__id=obj.pk, value=False).count(),
        }
        
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['value']
