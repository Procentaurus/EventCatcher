from django.db import models
from main.models import MyUser

class Event(models.Model):

    CATEGORYS = [
        ('Official', (
                ('Company Meeting', 'Company Meeting'),
                ('Exhibition', 'Exhibition'),
                ('Concert', 'Concert'),
                ('Gala','Gala'),
                ('Bal','Bal'),
                ('March','March'),
                ('Show','Show'),
                ('Others','Others'),
            )
        ),
        ('Unofficial', (
                ('Birthday Party', 'Birthday Party'),
                ('Boozing', 'Boozing'),
                ('House Party', 'House Party'),
                ('Celebration', 'Celebration'),
                ('Family Meeting', 'Family Meeting'),
                ('Others','Others'),
            )
        ),
    ]

    def event_directory_path(instance, filename):
        return 'eventImages/event_{0}/{1}'.format(instance.id, filename)

    name = models.CharField(verbose_name="Name",max_length=50)
    start_date_time = models.DateTimeField("Start time",null=True)
    end_date_time = models.DateTimeField("End time  ",null=True)
    organiser = models.ForeignKey(MyUser, on_delete=models.CASCADE, null=True)
    participants = models.ManyToManyField(MyUser, related_name='participants', blank=True)
    location = models.CharField("Location  ", max_length=60, null=True)
    category = models.CharField("Category  ", max_length=50, choices=CATEGORYS, null=True)
    is_open = models.BooleanField("Is open",null=True)
    is_free = models.BooleanField("Is free",null=True)
    description = models.TextField("Description",max_length=500, null=True)
    can_participants_invite = models.BooleanField(null=True, default=True)
    image = models.ImageField(null=True, blank=True, upload_to=event_directory_path, default='eventmodel.png')

    def __str__(self):
        return self.name


class Invitation(models.Model):
    inviting = models.ForeignKey(MyUser,on_delete=models.CASCADE, null=True, related_name='inviting')
    invited  = models.ForeignKey(MyUser,on_delete=models.CASCADE, null=True, related_name='invited')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    send_date = models.DateField(auto_now_add=True, null=True)

    def __str__(self):
        return f'{self.inviting} - {self.invited} - {self.event}'

class Message(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    content = models.TextField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    isSpecial = models.BooleanField(null=True, default=False)

    class Meta:
        ordering = ['-isSpecial','-updated', '-created']

    def __str__(self):
        if len(self.content) > 100:
            return self.content[0:99]+" ..."
        else:
            return self.content
