# Generated by Django 4.2.7 on 2023-11-28 22:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0027_timetablemodel'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='teachers',
        ),
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
            model_name='room',
            name='courses',
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
    ]
