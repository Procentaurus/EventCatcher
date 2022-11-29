# Generated by Django 4.1.1 on 2022-10-23 10:48

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='intrested',
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Confirmed', 'Confirm'), ('Pending', 'Pending'), ('Rejected', 'Rejected')], max_length=20, null=True)),
                ('event', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.event')),
                ('invited', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='invited', to=settings.AUTH_USER_MODEL)),
                ('inviting', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inviting', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
