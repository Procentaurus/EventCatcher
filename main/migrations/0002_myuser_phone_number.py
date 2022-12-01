# Generated by Django 4.1.1 on 2022-10-23 10:21

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='myuser',
            name='phone_number',
            field=models.PositiveIntegerField(null=True, unique=True, validators=[django.core.validators.MinValueValidator(111111111), django.core.validators.MaxValueValidator(999999999)]),
        ),
    ]