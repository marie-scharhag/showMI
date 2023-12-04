from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers

from .models import *
from ..app_user.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    """
    Serializer for the Room model.

    Fields:
    - roomNr (str): The room number.
    - floor (str): The floor of the building where the room is located.
    - building (str): The building where the room is located.
    """
    class Meta:
        model = Room
        fields = ('roomNr', 'floor', 'building')


class StudySerializer(serializers.ModelSerializer):
    """
    Serializer for the Study model.

    Fields:
    - id (int): The unique identifier of the study.
    - studyName (str): The name of the study program.
    """
    class Meta:
        model = Study
        fields = ('id', 'studyName')


class InfoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Information model.

    Fields:
    - info (str): Information text.
    - start (DateTimeField): Start time of the information.
    - end (DateTimeField): End time of the information.
    """
    class Meta:
        model = Information
        fields = ('info', 'start', 'end')


class SemesterTimetableSerializer(serializers.ModelSerializer):
    """
    Serializer for the SemesterTimetable model.

    Fields:
    - id (int): The unique identifier of the timetable.
    - semester_name (str): The name of the semester.
    - timetable_data (FileField): The timetable file.
    - semester_start (DateField): Start date of the semester.
    - semester_end (DateField): End date of the semester.
    """
    class Meta:
        model = SemesterTimetable
        fields = ('id','semester_name', 'timetable_data', 'semester_start', 'semester_end')
        read_only_fields = ('timetable_data',)


class LectureSerializer(serializers.ModelSerializer):
    """
    Serializer for the Lecture model.

    Fields:
    - id (int): The unique identifier of the lecture.
    - lectureNr (int): The lecture number.
    - lectureName (str): The name of the lecture.
    - semester (int): The semester of the lecture.
    - typ (str): The type of the lecture.
    - group (str): The group associated with the lecture.
    - information (InfoSerializer): Information associated with the lecture.
    - room (RoomSerializer): Rooms associated with the lecture.
    - teacher (UserSerializer): Teachers associated with the lecture.
    - study (StudySerializer): The study associated with the lecture.
    - weekday (str): The weekday of the lecture.
    - start (TimeField): Start time of the lecture.
    - end (TimeField): End time of the lecture.
    - semester_timetable (SemesterTimetableSerializer): The semester timetable associated with the lecture.
    """
    room = RoomSerializer(many=True, read_only=True)
    study = StudySerializer(read_only=True)
    information = InfoSerializer(many=True, read_only=True)
    teacher = UserSerializer(many=True, read_only=True)
    semester_timetable = SemesterTimetableSerializer(read_only=True)

    class Meta:
        model = Lecture
        fields = (
        'id', 'lectureNr', 'lectureName', 'semester', 'typ', 'group', 'information', 'room', 'teacher',
        'study', 'weekday', 'start', 'end', 'semester_timetable')



class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Document model.

    Fields:
    - id (int): The unique identifier of the document.
    - name (str): The name of the document.
    - rooms (RoomSerializer): Rooms associated with the document.
    - documentData (FileField): The document file.
    - start (DateTimeField): Start time of the document.
    - end (DateTimeField): End time of the document.
    - onlyDisplay (bool): Flag indicating whether to only display the document.
    """
    rooms = RoomSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = ('id' ,'name', 'rooms', 'documentData', 'start', 'end', 'onlyDisplay')

    def get_read_only_fields(self, *args, **kwargs):
        if self.context.get('request') and self.context['request'].method == 'POST':
            return super().get_read_only_fields(*args, **kwargs)
        else:
            return super().get_read_only_fields(*args, **kwargs) + ('documentData',)

    def validate_documentData(self, value):
        if value and not isinstance(value, (File, InMemoryUploadedFile)):
            raise serializers.ValidationError("The submitted data was not a file.")
        return value






