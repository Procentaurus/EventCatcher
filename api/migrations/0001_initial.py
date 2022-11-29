# Generated by Django 4.1.1 on 2022-10-22 22:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('start_date_time', models.DateTimeField(null=True)),
                ('end_date_time', models.DateTimeField(null=True)),
                ('location', models.CharField(max_length=60, null=True)),
                ('category', models.CharField(choices=[('Official', (('Company Meeting', 'Company Meeting'), ('Exhibition', 'Exhibition'), ('Concert', 'Concert'), ('Gala', 'Gala'), ('Bal', 'Bal'), ('March', 'March'), ('Show', 'Show'), ('Others', 'Others'))), ('Unofficial', (('Birthday Party', 'Birthday Party'), ('Boozing', 'Boozing'), ('House Party', 'House Party'), ('Others', 'Others'), ('Celebration', 'Celebration'), ('Family Meeting', 'Family Meeting'), ('Others', 'Others')))], max_length=50, null=True)),
                ('is_open', models.BooleanField(null=True)),
                ('is_free', models.BooleanField(null=True)),
                ('description', models.TextField(max_length=400, null=True)),
                ('intrested', models.ManyToManyField(blank=True, related_name='intrested', to=settings.AUTH_USER_MODEL)),
                ('organiser', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('participants', models.ManyToManyField(blank=True, related_name='participants', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
