from django.contrib.auth import get_user_model
from django.db import models
from django.conf import settings


UserModel = get_user_model()

class Study(models.Model):
    """
    Model representing a study program.

    Attributes:
    - studyName (str): The name of the study program.
    - teachers (ManyToManyField): Teachers associated with the study program.
    """

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
    """
    Model representing information.

    Attributes:
    - info (str): Information text.
    - start (DateTimeField): Start time of the information.
    - end (DateTimeField): End time of the information.
    """
    info = models.TextField()
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return self.info


class Room(models.Model):
    """
    Model representing a room.

    Attributes:
    - roomNr (str): The room number.
    - floor (str): The floor of the building where the room is located.
    - building (str): The building where the room is located.
    - studys (ManyToManyField): Study programs associated with the room.
    """
    roomNr = models.CharField(max_length=5, primary_key=True)
    floor = models.CharField(max_length=20, null=True, blank=True)
    building = models.CharField(max_length=20, null=True, blank=True)
    # beamer = models.CharField(max_length=180, null=True, blank=True)
    studys = models.ManyToManyField(Study)

    def __str__(self):
        return self.roomNr


class Beamer(models.Model):
    """
    Model representing a beamer.

    Attributes:
    - name (str): The name of the beamer.
    - ip_address (str): The IP address of the beamer.
    - port (str): The port number of the beamer.
    - room (ForeignKey): The room associated with the beamer.
    """
    name = models.CharField(max_length=64)
    ip_address = models.CharField(max_length=15, primary_key=True)
    port = models.CharField(max_length=4, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return self.ip_address



class Document(models.Model):
    """
    Model representing a document.

    Attributes:
    - documentData (ImageField): The document file.
    - name (str): The name of the document.
    - start (DateTimeField): Start time of the document.
    - end (DateTimeField): End time of the document.
    - rooms (ManyToManyField): Rooms associated with the document.
    - onlyDisplay (bool): Flag indicating whether to only display the document.
    """

    documentData = models.ImageField(upload_to='documents/')
    name = models.CharField(max_length=50)
    start = models.DateTimeField()
    end = models.DateTimeField()
    rooms = models.ManyToManyField(Room)
    onlyDisplay = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class SemesterTimetable(models.Model):
    """
    Model representing a semester timetable.

    Attributes:
    - semester_name (str): The name of the semester.
    - timetable_data (FileField): The timetable file.
    - semester_start (DateField): Start date of the semester.
    - semester_end (DateField): End date of the semester.
    """

    semester_name = models.CharField(max_length=45)
    timetable_data = models.FileField(upload_to='timetables/')
    semester_start = models.DateField()
    semester_end = models.DateField()
    #study
    def __str__(self):
        return self.semester_name


class Lecture(models.Model):
    """
    Model representing a lecture.

    Attributes:
    - lectureNr (int): The lecture number.
    - lectureName (str): The name of the lecture.
    - semester (int): The semester of the lecture.
    - typ (str): The type of the lecture.
    - group (str): The group associated with the lecture.
    - information (ManyToManyField): Information associated with the lecture.
    - room (ManyToManyField): Rooms associated with the lecture.
    - teacher (ManyToManyField): Teachers associated with the lecture.
    - study (ForeignKey): The study associated with the lecture.
    - semester_timetable (ForeignKey): The semester timetable associated with the lecture.
    - weekday (str): The weekday of the lecture.
    - start (TimeField): Start time of the lecture.
    - end (TimeField): End time of the lecture.
    """
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
