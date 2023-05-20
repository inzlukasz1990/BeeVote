from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin to edit or delete a group
    """
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to view or edit.
    """
    def has_object_permission(self, request, view, obj):
        # Only allow the owner of the object to view/edit.
        return obj.user == request.user

class IsInGroup(permissions.BasePermission):
    message = 'User is not a member of the group to which the board belongs.'

    def has_object_permission(self, request, view, obj):
        # obj here is a Board instance
        return request.user.groups.filter(name=obj.group.name).exists()