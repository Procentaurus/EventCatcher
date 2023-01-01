from rest_framework import mixins
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import datetime

from .models import *
from .serializers import *
from main.models import MyUser

class EventList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Event.objects.all()
        name = self.request.query_params.get('name')
        start_date_time = self.request.query_params.get('start_date_time')
        end_date_time = self.request.query_params.get('end_date_time')
        location = self.request.query_params.get('location')
        category = self.request.query_params.get('category')
        is_open = self.request.query_params.get('is_open')
        is_free = self.request.query_params.get('is_free')
        organiser = self.request.query_params.get('organiser')

        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        if start_date_time is not None:
            queryset = queryset.filter(start_date_time__gte=start_date_time)
        if end_date_time is not None:
            queryset = queryset.filter(start_date_time__lte=end_date_time)
        if location is not None:
            queryset = queryset.filter(location__icontains=location)
        if category is not None:
            queryset = queryset.filter(category=category)
        if is_open is not None:
            queryset = queryset.filter(is_open=is_open)
        if is_free is not None:
            queryset = queryset.filter(is_free=is_free)
        if organiser is not None:
            user = MyUser.objects.get(username=organiser).id
            queryset = queryset.filter(organiser=user)
        return queryset

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = EventSerializer(data=request.data)
        file = None

        # try:
        #     file = request.data['image']
        # except:
        #     pass

        if serializer.is_valid():
            event = serializer.save(organiser=user)
            event.participants.add(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):

        event = Event.objects.get(id=request.data['id'])
        kickout, invited = None, None
        try:
            kickout = MyUser.objects.get(id=request.data['to_kick'])
        except:
            pass

        try:
            invited = MyUser.objects.get(id=request.data['to_invite'])
        except:
            pass
        
        if kickout is not None:
            event.participants.remove(kickout)
        if invited is not None:
            newInvitation = Invitation(request.user,invited,event,datetime.date.today())
            newInvitation.save()

        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class InvitationList(mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class InvitationDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)