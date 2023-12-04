from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .data_loaders.csv import CsvTimetableLoader
from apps.timetable.business import LectureBusinessLogic, RoomBusinessLogic, InfoBusinessLogic, DocumentBusinessLogic, \
    SemesterTimetableBusinessLogic
from .serializers import *
from .models import *
from rest_framework.response import Response

UserModel = get_user_model()


class LectureView(APIView):
    """
    API View for handling lectures.

    - GET: Retrieve lecture information or images.
    - POST: Create a new lecture.
    - PUT: Edit an existing lecture.
    - DELETE: Delete an existing lecture.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, lecture_id=None, roomNr=None, user_id=None):
        """
        Retrieve lecture information or images.

        :param request: The HTTP request object.
        :param lecture_id: The ID of the lecture (optional).
        :param roomNr: The room number (optional).
        :param user_id: The user ID (optional).
        :return: Response with lecture information or images.
        :rtype: rest_framework.response.Response
        """
        if lecture_id and roomNr:
            return LectureBusinessLogic.get_lecture_image(request, lecture_id, roomNr)
        elif lecture_id:
            return LectureBusinessLogic.get_lecture_image(request, lecture_id)
        elif roomNr:
            return LectureBusinessLogic.get_lectures_by_room(roomNr)
        elif user_id:
            return LectureBusinessLogic.get_lectures_by_user(user_id)
        else:
            return Response({"error": "Invalid parameters"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Create a new lecture.

        :param request: The HTTP request object.
        :return: Response with the created lecture data or error.
        :rtype: rest_framework.response.Response
        """
        data = request.data
        return LectureBusinessLogic.new_lecture(data)


    def put(self, request, lecture_id):
        """
        Edit an existing lecture.

        :param request: The HTTP request object.
        :param lecture_id: The ID of the lecture to be edited.
        :return: Response with the edited lecture data or error.
        :rtype: rest_framework.response.Response
        """
        data = request.data
        return LectureBusinessLogic.edit_lecture(data,lecture_id)

    def delete(self, request, lecture_id):
        """
        Delete an existing lecture.

        :param request: The HTTP request object.
        :param lecture_id: The ID of the lecture to be deleted.
        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """
        return LectureBusinessLogic.delete_lecture(lecture_id)


class RoomView(APIView):
    """
    API View for handling rooms.

    - GET: Retrieve room information.
    - POST: Create a new room.
    - PUT: Edit an existing room.
    - DELETE: Delete an existing room.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, studyId=None):
        """
        Retrieve room information.

        :param request: The HTTP request object.
        :param studyId: The ID of the study (optional).
        :return: Response with room information.
        :rtype: rest_framework.response.Response
        """
        if studyId:
            return RoomBusinessLogic.get_rooms_by_study(studyId)
        else:
            return RoomBusinessLogic.get_rooms_all()

    def post(self, request):
        """
        Create a new room.

        :param request: The HTTP request object.
        :return: Response with the created room data or error.
        :rtype: rest_framework.response.Response
        """
        data = request.data
        return RoomBusinessLogic.new_room(data)

    def put(self, request, roomNr):
        """
        Edit an existing room.

        :param request: The HTTP request object.
        :param roomNr: The room number to be edited.
        :return: Response with the edited room data or error.
        :rtype: rest_framework.response.Response
        """
        data = request.data
        return RoomBusinessLogic.edit_room(data, roomNr)

    def delete(self, request, roomNr):
        """
        Delete an existing room.

        :param request: The HTTP request object.
        :param roomNr: The room number to be deleted.
        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """
        return RoomBusinessLogic.delete_room(roomNr)


class InfoView(APIView):
    """
    API View for handling information.

    - POST: Create a new info.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Create a new info.

        :param request: The HTTP request object.
        :return: Response indicating the success of the operation.
        :rtype: rest_framework.response.Response
        """
        data = request.data
        return InfoBusinessLogic.new_info(data)


class StudyView(viewsets.ModelViewSet):
    """
    ViewSet for Study model.

    Provides CRUD operations for Study model.
    """
    serializer_class = StudySerializer
    queryset = Study.objects.all()


class DocumentView(APIView):
    """
    API View for handling documents.

    - GET: Retrieve document information.
    - POST: Create a new document.
    - PUT: Edit an existing document.
    - DELETE: Delete an existing document.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, documentId=None, roomNr=None):
        """
        Retrieve document information.

        :param request: The HTTP request object.
        :param documentId: The ID of the document (optional).
        :param roomNr: The room number (optional).
        :return: Response with document information.
        :rtype: rest_framework.response.Response
        """
        if documentId:
            return DocumentBusinessLogic.get_document_by_id(documentId)
        if roomNr:
            return DocumentBusinessLogic.get_documents_by_room(roomNr)
        else:
            return DocumentBusinessLogic.get_all_documents()

    def post(self, request):
        """
        Create a new document.

        :param request: The HTTP request object.
        :return: Response with the created document data or error.
        :rtype: rest_framework.response.Response
        """
        return DocumentBusinessLogic.new_document(request)

    def put(self, request, document_id):
        """
        Edit an existing document.

        :param request: The HTTP request object.
        :param document_id: The ID of the document to be edited.
        :return: Response with the edited document data or error.
        :rtype: rest_framework.response.Response
        """
        return DocumentBusinessLogic.edit_document(request.data, document_id)

    def delete(self, request, document_id):
        """
        Delete an existing document.

        :param request: The HTTP request object.
        :param document_id: The ID of the document to be deleted.
        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """

        return DocumentBusinessLogic.delete_document(document_id)


class TimetableView(APIView):
    """
    API View for handling semester timetables.

    - GET: Retrieve all timetables.
    - POST: Create a new timetable.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
        Retrieve all timetables.

        :param request: The HTTP request object.
        :return: Response with all timetables or an error.
        :rtype: rest_framework.response.Response
        """
        return SemesterTimetableBusinessLogic.get_all_timetables()


    def post(self, request):
        """
        Create a new timetable.

        :param request: The HTTP request object.
        :return: Response indicating the success of the operation.
        :rtype: rest_framework.response.Response
        """
        return SemesterTimetableBusinessLogic.new_timetable(request.data)
