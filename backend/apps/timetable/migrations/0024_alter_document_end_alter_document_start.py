# Generated by Django 4.2.7 on 2023-11-19 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0023_document_onlydisplay'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='end',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='document',
            name='start',
            field=models.DateTimeField(),
        ),
    ]