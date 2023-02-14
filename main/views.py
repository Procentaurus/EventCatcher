from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.db.models import Q
from itertools import chain
from django.core import serializers
from django.http import JsonResponse
from datetime import datetime
import json

from .forms import *
from api.forms import *
from api.models import Event
from .decorators import *
from .models import *
from .functions import *


def home(request):
    return render(request, 'main/home.html')

def eventShowdown(request):
    return render(request, 'main/eventShowdown.html')

def error404_view(request, exception):
    context = {
        'error': '404',
    }
    return render(request, 'main/error.html', context, status=404)

def error500_view(request):
    context = {
        'error': '500',
    }
    return render(request, 'main/error.html', context, status=500)

@authenticatedUser
def loginPage(request):
    page = 'login'
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Login or password incorrect')

    context = {'page': page}
    return render(request, 'main/login_register.html', context)

@unauthenticatedUser
def logoutPage(request):
    logout(request)
    return redirect('home')

@authenticatedUser
def registerPage(request):
    page='register'
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(request, email=user.email, password=raw_password)
            if user is not None:
                login(request, user)
            else:
                messages.error(request, 'An error occured during registration')
            return redirect('home')

    context = {'page': page, 'form': form}
    return render(request, 'main/login_register.html', context)

@unauthenticatedUser
def addEvent(request):
    form = CreateEventForm()

    context = {'form':form}
    return render(request,'main/addEvent.html', context)

@unauthenticatedUser
def userSettings(request):
    user = request.user
    form = SettingsForm(instance=user)

    if request.method =='POST':
        form = SettingsForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.info(request, "Your data has been updated successfully")
        else:
            messages.error(request, "Some error occured.")

    context = {
        'user':user,
        'form':form,
    }
    return render(request,'main/userSettings.html', context)

@unauthenticatedUser
def userProfile(request, pk):
    user = MyUser.objects.get(pk=pk)
    friendRequests = FriendRequest.objects.filter(to_user=user)
    friends = user.friends.all()
    invitations = Invitation.objects.filter(invited=user)

    events = Event.objects.all()
    for event in events:
        if user not in event.participants.all():
            events = events.exclude(id=event.id)
    events = events.order_by('start_date_time')[:5]

    form1 = AvatarForm()

    # sprawdzenie, czy któryś z użytkowników nie wysłał już zaproszenia do drugiego
    friendRequest = None
    try:
        friendRequest = FriendRequest.objects.get(to_user=user, from_user=request.user)
    except:
        try:
           friendRequest = FriendRequest.objects.get(to_user=request.user, from_user=user)
        except:
            pass
    
    context = {
        'friendRequests': friendRequests,
        'friends': friends,
        'user': user,
        'friendRequest': friendRequest,
        'avatarForm': form1,
        'invitations': invitations,
        'events': events
    }
    return render(request, 'main/userProfile.html', context)

@unauthenticatedUser
def sendFriendRequest(request):
    from_user = request.user
    username = request.POST.get('username')

    to_user = MyUser.objects.get(username=username)
    try:
        to_user = MyUser.objects.get(username=username)
    except:
         messages.error(request, 'Something went wrong.')
         return redirect(request.META['HTTP_REFERER'])
        
    newRequest = FriendRequest(to_user=to_user, from_user=from_user, send_date=datetime.now().date())
    newRequest.save()

    return redirect(request.META['HTTP_REFERER'])

@unauthenticatedUser
def acceptFriendRequest(request, pk):
    friendRequest = FriendRequest.objects.get(id=pk)
    if request.user == friendRequest.to_user:
        friendRequest.to_user.friends.add(friendRequest.from_user)
        friendRequest.from_user.friends.add(friendRequest.to_user)
        friendRequest.delete()
    return redirect(request.META['HTTP_REFERER'])

@unauthenticatedUser
def rejectFriendRequest(request, pk):
    friendRequest = FriendRequest.objects.get(id=pk)
    if request.user == friendRequest.to_user:
        friendRequest.delete()
    return redirect(request.META['HTTP_REFERER'])

@unauthenticatedUser
def lookForFriends(request, pk):

    if request.method == 'POST':
        searchedUser = request.POST.get('users')
        try:
            searchedUserID = MyUser.objects.get(username=searchedUser)
        except:
            messages.error(request, 'There is no such user.')
            searchedUserID = None
        if searchedUserID is not None:
            return redirect('userprofile', pk=searchedUserID.id)

    # obsługa asynchronicznych zapytań o użytkowników
    q = request.GET.get('user_name')
    if q is not None:
        if q != "":
            users = MyUser.objects.filter(Q(username__icontains=q) | Q(email__icontains=q))
            users = users.exclude(id=request.user.id)
            for friend in request.user.friends.all():
                users = users.exclude(id = friend.id)
            data = serializers.serialize('json', users[:6], fields=["username", "image"])
            return JsonResponse(data, safe=False)

    user = MyUser.objects.get(pk=pk)
    friends = user.friends.all()

    friendsForFriends = MyUser.objects.none()
    for friend in friends:
        friendsOfMyFriend = friend.friends.all()
        friendsOfMyFriend = friendsOfMyFriend.exclude(username=user.username)
        for friendOfFriend in friendsOfMyFriend:
            temp = friends.filter(username=friendOfFriend.username).exists()
            if temp:
                friendsOfMyFriend = friendsOfMyFriend.exclude(username=friendOfFriend.username)

        friendsForFriends = list(chain(friendsForFriends, friendsOfMyFriend))

    context = {
        'friendsForFriends':friendsForFriends[:6],
    }
    return render(request,'main/lookforfriends.html', context)

def updateAvatar(request, pk):
    user = MyUser.objects.get(id=pk)
    picture = user.image

    if request.method == 'POST':
        form = AvatarForm(request.POST,request.FILES, instance=user)
        if form.is_valid():
            form.save()
        if user.image != picture:
            deleteFile(picture)
    
    return redirect(request.META['HTTP_REFERER'])


def eventSite(request, pk):

    form = CreateEventForm()
    try:
        event = Event.objects.get(id=pk)
    except:
        return redirect('eventshowdown')
    
    #obsługa zapytan asynchronicznych
    q = request.GET.get('user_name')
    newOne = None
    if q is not None:
        try:
            newOne = MyUser.objects.get(username=q)
        except:
            return JsonResponse({'message':'There is no such user.'}, safe=False)
        
        if newOne is not None and newOne not in event.participants.all():
                return JsonResponse({'username':newOne.username,'image':newOne.image.url,'id':newOne.id}, safe=False)
        else:
           return JsonResponse({'message':'The user is already a participant of this event.'}, safe=False)

    if request.method == 'POST':

        post_data = json.loads(request.body.decode("utf-8"))
        newParticipantID = post_data.get('participant')
        newParticipant = MyUser.objects.get(id=newParticipantID)

        try:
            possibleinvitation = Invitation.objects.get(inviting=request.user, invited=newParticipant,event=event)
        except:
            invitation = Invitation(inviting=request.user, invited=newParticipant,event=event, send_date=datetime.now().date())
            invitation.save()
            return redirect(request.META['HTTP_REFERER'])
    friends = None
    try:
        friends = request.user.friends.all()[0:9]
    except:
        pass

    context = {
        'event_id': pk,
        'user': event.organiser,
        'form': form,
        'friends': friends
    }
    return render(request, 'main/eventSite.html', context)

@unauthenticatedUser
def acceptInvitation(request, pk):
    invitation = Invitation.objects.get(id=pk)
    if request.user == invitation.invited:
        invitation.event.participants.add(invitation.invited)

        possibleOtherInvitations = Invitation.objects.filter(event=invitation.event, invited=invitation.invited)
        for possibleInvitation in possibleOtherInvitations:
            possibleInvitation.delete()
        invitation.delete()

    return redirect(request.META['HTTP_REFERER'])

@unauthenticatedUser
def rejectInvitation(request, pk):
    invitation = Invitation.objects.get(id=pk)
    if request.user == invitation.invited:
        invitation.delete()
        
    return redirect(request.META['HTTP_REFERER'])