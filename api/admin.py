from django.contrib import admin

from .models import *

class EventAdmin(admin.ModelAdmin):
    list_display  =('name', 'category', 'is_open', 'is_free', 'location', 'organiser')
    search_fields = ('name', 'category', 'is_open', 'is_free', 'location', 'organiser')
    readonly_fields = ()

class InvitationAdmin(admin.ModelAdmin):
    list_display = ('inviting', 'invited', 'event', 'send_date')
    search_fields = ('inviting', 'invited', 'event', 'send_date')
    readonly_fields = ()

admin.site.register(Invitation, InvitationAdmin)
admin.site.register(Event, EventAdmin)
