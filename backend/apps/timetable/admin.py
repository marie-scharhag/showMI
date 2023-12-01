from django.contrib import admin
from .models import *


class LectureAdmin(admin.ModelAdmin):
    list_display = ('lectureNr', 'lectureName', 'group', 'get_infos', 'get_rooms', 'get_teachers', 'study', 'weekday', 'start', 'end', 'semester_timetable')

    def get_infos(self, obj):
        return obj.information.all() if hasattr(obj, 'information') else None

    # def get_timeslots(self, obj):
    #     return obj.timeslot.all()

    def get_rooms(self, obj):
        return obj.room.all()

    def get_teachers(self, obj):
        return obj.teacher.all()


class BeamerAdmin(admin.ModelAdmin):
    list_display = ('name', 'ip_address', 'port', 'room')


class RoomAdmin(admin.ModelAdmin):
    list_display = ('roomNr', 'floor', 'building', 'get_studys')

    def get_studys(self,obj):
        return obj.studys.all()


class InfoAdmin(admin.ModelAdmin):
    list_display = ('info', 'start', 'end')


# class TimeslotAdmin(admin.ModelAdmin):
#     list_display = ('weekday', 'start', 'end')


class StudyAdmin(admin.ModelAdmin):
    list_display = ('id', 'studyName', 'get_teachers')

    def get_teachers(self,obj):
        return obj.teachers.all()


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('documentData', 'name', 'start', 'end', 'get_rooms')

    def get_rooms(self, obj):
        return obj.rooms.all()

class SemesterTimetableAdmin(admin.ModelAdmin):
    list_display = ('semester_name', 'timetable_data', 'semester_start', 'semester_end')

# Register your models here.

#
admin.site.register(Lecture, LectureAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Information, InfoAdmin)
# admin.site.register(Timeslot, TimeslotAdmin)
admin.site.register(Study, StudyAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(SemesterTimetable, SemesterTimetableAdmin)
admin.site.register(Beamer, BeamerAdmin)
