from tabnanny import verbose
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator

class MyUserManager(BaseUserManager):

    def create_user(self, email, username,phone_number, password=None):
        if not email:
            raise ValueError("User must have an email adress.")
        if not username:
            raise ValueError("User must have an username.")
        if not phone_number:
            raise ValueError("User must have an username.")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username,phone_number, password=None):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
            phone_number=phone_number,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True

        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):

    def user_directory_path(instance, filename):
        return 'profileImages/user_{0}/{1}'.format(instance.id, filename)

    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    last_login = models.DateTimeField(verbose_name="last login", auto_now=True)
    hide_mail = models.BooleanField(default=True)
    phone_number = models.PositiveIntegerField(null=True, unique=True, validators=[MinValueValidator(111111111), MaxValueValidator(999999999)])
    friends = models.ManyToManyField('self', blank=True)
    image = models.ImageField(null=True, blank=True, upload_to=user_directory_path, default="model.png")

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = MyUserManager()

    def __str__(self):
        return self.username
    
    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_Label):
        return True

class FriendRequest(models.Model):
    from_user = models.ForeignKey(MyUser, related_name="from_user", on_delete=models.CASCADE)
    to_user = models.ForeignKey(MyUser, related_name="to_user", on_delete=models.CASCADE)
    send_date = models.DateField(auto_now_add=True, null=True)
    