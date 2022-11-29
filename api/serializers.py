from rest_framework import serializers

from .models import *

class EventSerializer(serializers.ModelSerializer):
    organiser = serializers.StringRelatedField()
    class Meta:
        model = Event
        fields = '__all__'

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'
