# Generated by Django 4.1.1 on 2022-12-29 12:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_event_can_paricipants_invite'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='can_paricipants_invite',
            new_name='can_participants_invite',
        ),
    ]
