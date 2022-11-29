from django.forms import ModelForm
from django import forms

from .models import *


class CreateEventForm(ModelForm):
    class Meta:
        model = Event
        fields = '__all__'
        exclude = ['organiser', 'participants']

        widgets = {
            'start_date_time': forms.DateTimeInput(
                attrs={
                    'type': 'datetime-local',
                    'class':'form-control',
                }),
            'end_date_time': forms.DateTimeInput(
                attrs={
                    'type': 'datetime-local',
                    'class':'form-control',
                }),
            'is_open': forms.CheckboxInput(
                attrs={
                    'type': 'checkbox',
                }),
            'is_free': forms.CheckboxInput(
                attrs={
                    'type': 'checkbox',
                }),
            'name': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'type': 'text'
                }),
            'location': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'type': 'text'
                }),
            'category': forms.NullBooleanSelect(
                attrs={
                    'class':'form-control',
                    'type': 'text'
                }),
            'description': forms.Textarea(
                attrs={
                    'class':'form-control',
                }),
        }