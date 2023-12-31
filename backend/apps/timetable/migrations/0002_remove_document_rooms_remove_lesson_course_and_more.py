# Generated by Django 4.2.7 on 2023-11-09 14:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='rooms',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='course',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='information',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='room',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='teacher',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='timeslot',
        ),
        migrations.DeleteModel(
            name='TimetableModel',
        ),
        migrations.DeleteModel(
            name='Course',
        ),
        migrations.DeleteModel(
            name='Document',
        ),
        migrations.DeleteModel(
            name='Information',
        ),
        migrations.DeleteModel(
            name='Lesson',
        ),
        migrations.DeleteModel(
            name='Room',
        ),
        migrations.DeleteModel(
            name='Timeslot',
        ),
    ]
