from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
import secrets
import string
from apps.app_user.sendMail import send_temporary_password_email


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        # if not password:
        #     raise ValueError('Password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password is None:
            set_temp_pw_send_mail(user)
        else:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)

        # if not email:
        #     raise ValueError('Email is required.')
        # if not password:
        #     raise ValueError('Password is required.')
        # user = self.create_user(email, password)
        # user.is_superuser = True
        # user.save()
        # return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    # username = models.CharField(max_length=50)
    # country = models.CharField(max_length=100)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = AppUserManager()

    def set_new_password(self, new_password):
        self.set_password(new_password)
        self.save()

    def save(self, *args, **kwargs):
        is_new_user = not self.id

        if is_new_user:
            set_temp_pw_send_mail(self)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


def set_temp_pw_send_mail(user):
    characters = string.ascii_letters + string.digits + string.punctuation
    temporary_password = ''.join(secrets.choice(characters) for _ in range(12))
    user.set_password(temporary_password)
    send_temporary_password_email(user, temporary_password)