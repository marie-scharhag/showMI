# Generated by Django 4.2.7 on 2023-11-27 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timetable', '0024_alter_document_end_alter_document_start'),
    ]

    operations = [
        migrations.AlterField(
            model_name='information',
            name='end',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='information',
            name='start',
            field=models.DateTimeField(),
        ),
    ]
