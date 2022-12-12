from django.contrib.auth.forms import UserCreationForm
from django import forms

from .models import *


class CreateUserForm(UserCreationForm):
    password1 = forms.CharField(max_length=16, widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter password..'}))
    password2 = forms.CharField(max_length=16, widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm password..'}))

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'phone_number']
        widgets = {
            'username': forms.TextInput(attrs={
                        'class':'form-control',
                        'placeholder':'Username..',
                        'required':'True'
                }),
            'email': forms.EmailInput(attrs={
                        'class':'form-control',
                        'placeholder':'Email..',
                        'required':'True'
                }),
            'phone_number': forms.NumberInput(attrs={
                        'class':'form-control',
                        'placeholder':'Phone number..',
                        'required':'True'
                }),
        }

class AvatarForm(forms.ModelForm):
    image = forms.ImageField(required=True, widget=forms.FileInput(attrs={'class':"form-control rounded me-5", 'id':"inputGroupFile01"}))
    class Meta:
        model = MyUser
        fields = ['image']

class SettingsForm(forms.ModelForm):
     class Meta:
        model = MyUser
        fields = ['username', 'phone_number','hide_mail']
        widgets = {
            'hide_mail': forms.CheckboxInput(
                attrs={
                    'type': 'checkbox',
                    'class': 'mb-4',
                }),
            'username': forms.TextInput(attrs={
                        'class':'form-control',
                        'placeholder':'Username..',
                        'required':'True'
                }),
            'phone_number': forms.NumberInput(attrs={
                        'class':'form-control',
                        'placeholder':'Phone number..',
                        'required':'True'
                }),
        }