from django.contrib.auth import get_user_model
from django.db import models
from django.conf import settings


UserModel = get_user_model()

class Study(models.Model):
    STUDYS = [
        ("MI", "Medieninformatik"),
        ("AI", "Angewandte Informatik"),
        ("WI", "Wirtschafts Informatik"),
        ("TS", "Technische Systeme"),
    ]
    studyName = models.CharField(max_length=46, choices=STUDYS)
    teachers = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)

    def __str__(self):
        return self.studyName


class Information(models.Model):
    info = models.TextField()
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return self.info


class Room(models.Model):
    roomNr = models.CharField(max_length=5, primary_key=True)
    floor = models.CharField(max_length=20, null=True, blank=True)
    building = models.CharField(max_length=20, null=True, blank=True)
    # beamer = models.CharField(max_length=180, null=True, blank=True)
    studys = models.ManyToManyField(Study)

    def __str__(self):
        return self.roomNr


class Beamer(models.Model):
    name = models.CharField(max_length=64)
    ip_address = models.CharField(max_length=15, primary_key=True)
    port = models.CharField(max_length=4, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return self.ip_address


# class Timeslot(models.Model):
#     WEEK_DAYS = [
#         ("MO", 0),
#         ("DI", 1),
#         ("MI", 2),
#         ("DO", 3),
#         ("FR", 4),
#         ("SA", 5),
#         ("SO", 6),
#     ]
#     weekday = models.CharField(max_length=10, choices=WEEK_DAYS)
#     start = models.TimeField()
#     end = models.TimeField()
#
#     def __str__(self):
#         return self.weekday + self.start.strftime('%H:%M:%S') + self.end.strftime('%H:%M:%S')


class Document(models.Model):
    documentData = models.ImageField(upload_to='documents/')
    name = models.CharField(max_length=50)
    start = models.DateTimeField()
    end = models.DateTimeField()
    rooms = models.ManyToManyField(Room)
    onlyDisplay = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class SemesterTimetable(models.Model):
    semester_name = models.CharField(max_length=45)
    timetable_data = models.FileField(upload_to='timetables/')
    semester_start = models.DateField()
    semester_end = models.DateField()
    #study
    def __str__(self):
        return self.semester_name


class Lecture(models.Model):
    TYPES = [
        ("V", "Vorlesung"),
        ("P", "Praktikum"),
        ("Ü", "Übung"),
        ("S", "Seminar"),
    ]

    WEEK_DAYS = [
        ("MO", 0),
        ("DI", 1),
        ("MI", 2),
        ("DO", 3),
        ("FR", 4),
        ("SA", 5),
        ("SO", 6),
    ]

    lectureNr = models.IntegerField()
    lectureName = models.CharField(max_length=120)
    semester = models.IntegerField(null=True, blank=True)
    typ = models.CharField(max_length=1,choices=TYPES)
    group = models.CharField(max_length=2, blank=True, null=True)
    information = models.ManyToManyField(Information, blank=True)
    room = models.ManyToManyField(Room)
    teacher = models.ManyToManyField(UserModel)
    study = models.ForeignKey(Study, on_delete=models.CASCADE, blank=True, null=True)
    semester_timetable = models.ForeignKey(SemesterTimetable, on_delete=models.CASCADE, blank=True, null=True)

    # timeslot = models.ManyToManyField(Timeslot)
    weekday = models.CharField(max_length=10, choices=WEEK_DAYS)
    start = models.TimeField()
    end = models.TimeField()

    def __str__(self):
        return self.lectureName
