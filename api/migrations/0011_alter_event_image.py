# Generated by Django 4.1.1 on 2022-12-27 16:34

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_alter_event_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='image',
            field=models.ImageField(blank=True, default='eventmodel.png', null=True, upload_to=api.models.Event.event_directory_path),
        ),
    ]
