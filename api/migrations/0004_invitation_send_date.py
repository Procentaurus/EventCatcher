# Generated by Django 4.1.1 on 2022-10-23 13:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_invitation_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='invitation',
            name='send_date',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]
