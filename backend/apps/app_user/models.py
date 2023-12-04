from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.mail import get_connection, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db import models
from django.utils import timezone
import secrets
import string



class AppUserManager(BaseUserManager):
    """
    Custom manager for AppUser model.

    Provides methods to create regular users and superusers.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an optional temporary password.

        Parameters:
        - `email` (str): User's email address.
        - `password` (str, optional): User's password. If not provided, a temporary password will be set.
        - `extra_fields` (dict): Additional fields for the user.

        Returns:
        - `user` (AppUser): Newly created user object.
        """
        if not email:
            raise ValueError('Email is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password is None:
            user.set_temp_pw_send_mail()
        else:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and return a superuser.

        Parameters:
        - `email` (str): Superuser's email address.
        - `password` (str): Superuser's password.
        - `extra_fields` (dict): Additional fields for the superuser.

        Returns:
        - `superuser` (AppUser): Newly created superuser object.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)



class AppUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model for the application.

    Inherits from AbstractBaseUser and PermissionsMixin.
    """
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = AppUserManager()

    def set_new_password(self, new_password):
        """
        Set a new password for the user.

        Parameters:
        - `new_password` (str): New password for the user.
        """
        self.set_password(new_password)
        self.save()

    def save(self, *args, **kwargs):
        """
        Save the user instance. If it's a new user, set a temporary password and send a welcome email.

        Overrides the save method of the parent class.

        Parameters:
        - `args` (tuple): Additional positional arguments.
        - `kwargs` (dict): Additional keyword arguments.
        """
        is_new_user = not self.id

        if is_new_user:
            self.set_temp_pw_send_mail()

        super().save(*args, **kwargs)

    def __str__(self):
        """
        Return a string representation of the user.

        Returns:
        - `str`: User's email.
        """
        return self.email

    def set_temp_pw_send_mail(self):
        """
        Set a temporary password for the user and send a welcome email.

        Generates a temporary password, sets it for the user, and sends a welcome email.

        """
        characters = string.ascii_letters + string.digits + string.punctuation
        temporary_password = ''.join(secrets.choice(characters) for _ in range(12))
        self.set_password(temporary_password)
        self.send_temporary_password_email(temporary_password)

    def send_temporary_password_email(self, temporary_password):
        """
        Send a welcome email to the user with a temporary password.

        Parameters:
        - `temporary_password` (str): Temporary password for the user.
        """
        connection = get_connection()  # uses SMTP server specified in settings.py
        connection.open()

        subject = 'Welcome to showMI'
        html_message = render_to_string(f'welcome_email.html',
                                        {'user': self, 'temporary_password': temporary_password})
        plain_message = strip_tags(html_message)
        to_email = 'marie.scharhag@student.hs-rm.de'  # user.email
        message = EmailMultiAlternatives(subject=subject, body=plain_message, from_email=None, to=[to_email],
                                         connection=connection)

        message.attach_alternative(html_message, "text/html")
        message.send()

        connection.close()

