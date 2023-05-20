from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from django.shortcuts import redirect
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import Group
from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from django.db.models import F
from rest_framework import status

from .models import Board, Idea, Vote
from .serializers import GroupSerializer, UserSerializer, BoardSerializer, IdeaSerializer, VoteSerializer
from .permissions import IsAdmin, IsOwner

from django.db.models import Max

User=get_user_model()

def confirm_email(request, key):
    email_confirmation = EmailConfirmationHMAC.from_key(key)
    if not email_confirmation:
        email_confirmation = EmailConfirmation.objects.get(key=key)
    if email_confirmation:
        email_confirmation.confirm(request)
    return redirect('http://localhost:3000/')

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def user_groups(self, request, pk=None):
        queryset = self.filter_queryset(self.get_queryset())

        queryset = queryset.filter(user=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def join_group(self, request, pk=None):
        user = self.get_object()
        group = Group.objects.get(pk=request.data['group'])
        user.groups.add(group)
        return Response({'status': 'group joined'})
    
    @action(detail=True, methods=['post'])
    def leave_group(self, request, pk=None):
        user = self.get_object()
        group = Group.objects.get(pk=request.data['group'])
        user.groups.remove(group)
        return Response({'status': 'group left'})

class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsOwner,]
        else:
            self.permission_classes = [permissions.IsAuthenticated,]
        return super(BoardViewSet, self).get_permissions()
        
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        queryset = queryset.filter(group__user=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class BoardIdeasViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [IsOwner,]
        else:
            self.permission_classes = [permissions.IsAuthenticated,]
        return super(BoardIdeasViewSet, self).get_permissions()

    def perform_create(self, serializer):
        board_id = self.kwargs['board_pk']
        max_order = Idea.objects.filter(board__id=board_id).aggregate(Max('order'))['order__max'] or 0
        serializer.save(user=self.request.user, board_id=board_id, order=max_order + 1)

    def perform_update(self, serializer):
        instance = self.get_object()
        validated_data = serializer.validated_data
        
        print(validated_data)

        if 'order' in validated_data:
            new_order = validated_data.get('order')

            if new_order != instance.order:
                if new_order > instance.order:
                    self.get_queryset().filter(order__gt=instance.order, order__lte=new_order).update(order=F('order') - 1)
                else:
                    self.get_queryset().filter(order__lt=instance.order, order__gte=new_order).update(order=F('order') + 1)
        
        if set(validated_data.keys()) != {'order'} and self.request.user != instance.user:
            raise ValidationError("You can only update your own ideas")

        serializer.save()
            
    def get_queryset(self):
        board_id = self.kwargs['board_pk']
        return Idea.objects.filter(board__id=board_id)    
            
class BoardIdeaVotesViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'destroy']:
            self.permission_classes = [IsOwner,]
        else:
            self.permission_classes = [permissions.IsAuthenticated,]
        return super(BoardIdeaVotesViewSet, self).get_permissions()
        
    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_pk']
        idea = Idea.objects.get(pk=idea_id)
        serializer = VoteSerializer(data=self.request.data)
        if serializer.is_valid():
            # Check if the vote already exists
            vote_exists = Vote.objects.filter(user=self.request.user, idea=idea).exists()

            if vote_exists:
                return Response({'status': 'vote already made'}, status=status.HTTP_400_BAD_REQUEST)

            Vote.objects.create(
                user=self.request.user, 
                idea=idea, 
                value=serializer.validated_data['value']
            )
            return Response({'status': 'vote set'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
