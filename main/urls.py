from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),

    path('login/', views.loginPage, name='login'),
    path('logout/', views.logoutPage, name='logout'),
    path('register/', views.registerPage, name='register'),

    path('addEvent/', views.addEvent, name='addEvent'),
    path('eventshowdown/', views.eventShowdown, name='eventshowdown'),
    path('eventsite/<int:pk>/', views.eventSite, name='eventsite'),

    path('usersettings/', views.userSettings, name='usersettings'),
    path('userprofile/<int:pk>/', views.userProfile, name='userprofile'),
    path('updateavatar/<int:pk>/', views.updateAvatar, name='updateavatar'),

    path('acceptfriendrequest/<int:pk>/', views.acceptFriendRequest, name='acceptfriendrequest'),
    path('rejectfriendrequest/<int:pk>/', views.rejectFriendRequest, name='rejectfriendrequest'),
    path('sendfriendrequest/', views.sendFriendRequest, name='sendfriendrequest'),
    path('lookforfriends/<int:pk>/', views.lookForFriends, name='lookforfriends'),
]
