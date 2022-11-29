# Generated by Django 4.1.1 on 2022-11-13 12:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_myuser_friends'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='friends',
        ),
        migrations.AddField(
            model_name='myuser',
            name='friends',
            field=models.ManyToManyField(blank=True, null=True, to=settings.AUTH_USER_MODEL),
        ),
    ]
