from django.urls import path

from .views import *

urlpatterns = [
    path('events/', EventList.as_view()),
    path('events/<int:pk>/', EventDetail.as_view()),
    path('invitations/', InvitationList.as_view()),
    path('invitations/<int:pk>/', InvitationDetail.as_view()),
]
