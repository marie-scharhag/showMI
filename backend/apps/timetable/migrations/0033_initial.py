# Generated by Django 4.2.7 on 2023-11-30 15:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('timetable', '0032_remove_document_rooms_remove_lecture_information_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Information',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('info', models.TextField()),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='SemesterTimetable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semester_name', models.CharField(max_length=45)),
                ('timetable_data', models.FileField(upload_to='timetables/')),
                ('semester_start', models.DateField()),
                ('semester_end', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Study',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('studyName', models.CharField(choices=[('MI', 'Medieninformatik'), ('AI', 'Angewandte Informatik'), ('WI', 'Wirtschafts Informatik'), ('TS', 'Technische Systeme')], max_length=46)),
                ('teachers', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('roomNr', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('floor', models.CharField(blank=True, max_length=20, null=True)),
                ('building', models.CharField(blank=True, max_length=20, null=True)),
                ('studys', models.ManyToManyField(to='timetable.study')),
            ],
        ),
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lectureNr', models.IntegerField()),
                ('lectureName', models.CharField(max_length=120)),
                ('semester', models.IntegerField(blank=True, null=True)),
                ('typ', models.CharField(choices=[('V', 'Vorlesung'), ('P', 'Praktikum'), ('Ü', 'Übung'), ('S', 'Seminar')], max_length=1)),
                ('group', models.CharField(blank=True, max_length=2, null=True)),
                ('weekday', models.CharField(choices=[('MO', 0), ('DI', 1), ('MI', 2), ('DO', 3), ('FR', 4), ('SA', 5), ('SO', 6)], max_length=10)),
                ('start', models.TimeField()),
                ('end', models.TimeField()),
                ('information', models.ManyToManyField(blank=True, to='timetable.information')),
                ('room', models.ManyToManyField(to='timetable.room')),
                ('semester_timetable', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='timetable.semestertimetable')),
                ('study', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='timetable.study')),
                ('teacher', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('documentData', models.ImageField(upload_to='documents/')),
                ('name', models.CharField(max_length=50)),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
                ('onlyDisplay', models.BooleanField(default=False)),
                ('rooms', models.ManyToManyField(to='timetable.room')),
            ],
        ),
        migrations.CreateModel(
            name='Beamer',
            fields=[
                ('name', models.CharField(max_length=64)),
                ('ip_address', models.CharField(max_length=15, primary_key=True, serialize=False)),
                ('port', models.CharField(blank=True, max_length=4, null=True)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='timetable.room')),
            ],
        ),
    ]
