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