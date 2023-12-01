from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers

from .models import *
from ..app_user.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('roomNr', 'floor', 'building')


# class TimeslotSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Timeslot
#         fields = ('weekday', 'start', 'end')


class StudySerializer(serializers.ModelSerializer):
    class Meta:
        model = Study
        fields = ('id', 'studyName')


class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Information
        fields = ('info', 'start', 'end')


class SemesterTimetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = SemesterTimetable
        fields = ('id','semester_name', 'timetable_data', 'semester_start', 'semester_end')
        read_only_fields = ('timetable_data',)


class LectureSerializer(serializers.ModelSerializer):
    # timeslot = TimeslotSerializer(many=True, read_only=True)
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






