# Generated by Django 4.2.6 on 2023-11-05 15:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_user', '0002_remove_appuser_country'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appuser',
            name='username',
        ),
    ]
