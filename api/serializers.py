from rest_framework import serializers

from .models import *
from main.models import MyUser

class MyUserFriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id','username']

class MyUserOrganiserSerializer(serializers.ModelSerializer):
    friends = MyUserFriendsSerializer(many=True, read_only=True)
    class Meta:
        model = MyUser
        fields = ['id','username', 'friends', 'image']

class MyUserParticipantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id','username', 'image']


class EventSerializer(serializers.ModelSerializer):
    organiser = MyUserOrganiserSerializer(read_only=True)
    participants = MyUserParticipantsSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    user = MyUserFriendsSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'
