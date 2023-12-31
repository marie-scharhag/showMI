# Generated by Django 4.2.7 on 2023-11-30 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0031_alter_lecture_semester_timetable_alter_lecture_study'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='rooms',
        ),
        migrations.RemoveField(
            model_name='lecture',
            name='information',
        ),
        migrations.RemoveField(
            model_name='lecture',
            name='room',
        ),
        migrations.RemoveField(
            model_name='lecture',
            name='semester_timetable',
        ),
        migrations.RemoveField(
            model_name='lecture',
            name='study',
        ),
        migrations.RemoveField(
            model_name='lecture',
            name='teacher',
        ),
        migrations.RemoveField(
            model_name='room',
            name='studys',
        ),
        migrations.RemoveField(
            model_name='study',
            name='teachers',
        ),
        migrations.DeleteModel(
            name='Beamer',
        ),
        migrations.DeleteModel(
            name='Document',
        ),
        migrations.DeleteModel(
            name='Information',
        ),
        migrations.DeleteModel(
            name='Lecture',
        ),
        migrations.DeleteModel(
            name='Room',
        ),
        migrations.DeleteModel(
            name='SemesterTimetable',
        ),
        migrations.DeleteModel(
            name='Study',
        ),
    ]
