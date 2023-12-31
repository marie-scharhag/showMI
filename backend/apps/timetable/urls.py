from django.urls import path, include
from .views import *
from django.conf.urls.static import static
from django.conf import settings

# router = routers.DefaultRouter()
# router.register(r'lesson', LessonView, 'lesson')
# router.register(r'room', RoomView, 'room')
# router.register(r'info', InfoView, 'info')
# router.register(r'timeslot', TimeslotView, 'timeslot')
# router.register(r'study', StudyView, 'study')
# router.register(r'document', DocumentView, 'document')
# router.register(r'uploadTimetable',import_csv, 'uploadTimetable')

urlpatterns = ([
    path('lectures/new/', LectureView.as_view(), name='lecture'),
    path('lectures/all/', LectureView.as_view(), name='lecture'),
    path('lectures/<int:lecture_id>/', LectureView.as_view(), name='lecture'),
    path('lectures/<str:roomNr>/all/', LectureView.as_view(), name='lectures-in-room'),
    path('lectures/user/<int:user_id>/all/', LectureView.as_view(), name='lectures-for-user'),
    path('lectures/image/<int:lecture_id>/', LectureView.as_view(), name='lecture-image'),
    path('lectures/image/<int:lecture_id>/<str:roomNr>/', LectureView.as_view(), name='lecture-image-in-room'),

    path('rooms/all/', RoomView.as_view(), name='room-all'),
    path('rooms/study/<str:studyId>/', RoomView.as_view(), name='rooms-for-study'),
    path('rooms/<str:roomNr>/', RoomView.as_view(), name='room-roomNr'),
    path('rooms/new/', RoomView.as_view(), name='room-new'),

    path('info/new/', InfoView.as_view(), name='info'),
    path('info/<int:id>/', InfoView.as_view(), name='info'),

    # path('info', InfoView.as_view, name='info'),
    # path('timeslot', TimeslotView.as_view, name='timeslot'),
    # path('study', StudyView.as_view, name='study'),

    # path('documents/uploadImage/',DocumentView.as_view(), name='uploadImage'),
    path('documents/all/', DocumentView.as_view(), name='documents'),
    path('documents/new/', DocumentView.as_view(), name='documents'),
    path('documents/<int:document_id>/', DocumentView.as_view(), name='document'),
    path('documents/room/<str:roomNr>/', DocumentView.as_view(), name='documents-in-room'),
    path('documents/image/<int:documentId>/', DocumentView.as_view(), name='document-image'),

    path('timetable/new/',TimetableView.as_view(), name='uploadTimetable'),
    path('timetable/all/',TimetableView.as_view(), name='showTimetable'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
