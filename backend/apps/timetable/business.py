from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response

from apps.timetable.image_generation.imageGenerator import cached_image
from apps.timetable.models import Lecture, Room, Study, Document, SemesterTimetable
from apps.timetable.serializers import LectureSerializer, RoomSerializer, InfoSerializer, DocumentSerializer, \
    SemesterTimetableSerializer

from apps.timetable.data_loaders.csv import CsvTimetableLoader

UserModel = get_user_model()


class LectureBusinessLogic:
    @staticmethod
    def get_lecture_image(request, lecture_id, roomNr=None):
        """
        Retrieves the image for a specific lecture and optionally for a specific room.

        :param request: HttpRequest object for the request.
        :type request: django.http.HttpRequest

        :param lecture_id: The unique ID of the lecture.
        :type lecture_id: int

        :param roomNr: The room number (optional).
        :type roomNr: int, optional

        :return: HttpResponse with the image or an error Response object.
        :rtype: django.http.HttpResponse or rest_framework.response.Response
        """
        lecture = get_object_or_404(Lecture, id=lecture_id)
        room = None

        if roomNr:
            room = get_object_or_404(Room, roomNr=roomNr)

        image_response = cached_image(request, lecture, room)
        if image_response.status_code == 200:
            response = HttpResponse(image_response.content, content_type='image/png')
            response['Content-Disposition'] = f'attachment; filename="{lecture.lectureNr}.png"'
            return response
        else:
            return Response({"error": "Error at loading image"}, image_response.status_code)

    @staticmethod
    def get_lectures_by_room(room_nr):
        """Retrieves lectures associated with a specific room.

        :param room_nr: The room number.
        :type room_nr: int

        :return: List of lectures associated with the room.
        :rtype: rest_framework.response.Response
        """
        try:
            room = Room.objects.get(roomNr=room_nr)
            lectures = Lecture.objects.filter(room=room)
            serializer = LectureSerializer(lectures, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def get_lectures_by_user(user_id):
        """
        Retrieves lectures associated with a specific user.

        :param user_id: The user ID.
        :type user_id: int

        :return: List of lectures associated with the user.
        :rtype: rest_framework.response.Response
        """
        try:
            user = UserModel.objects.get(id=user_id)
            lectures = Lecture.objects.filter(teacher=user)
            serializer = LectureSerializer(lectures, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserModel.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def new_lecture(data):
        """
        Creates a new lecture.

        :param data: The data for creating the new lecture.
        :type data: dict

        :return: Response with the created lecture data or error.
        :rtype: rest_framework.response.Response
        """
        roomNrs_data_list = data.get('room', [])
        teacherIds_data_list = data.get('teacher', [])
        serializer = LectureSerializer(data=data)
        if serializer.is_valid():
            lecture = serializer.save()

            rooms = Room.objects.filter(roomNr__in=roomNrs_data_list)
            lecture.room.set(rooms)

            teachers = UserModel.objects.filter(id__in=teacherIds_data_list)
            lecture.teacher.set(teachers)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def edit_lecture(data, lecture_id):
        """
        Edits an existing lecture.

        :param data: The data for editing the lecture.
        :type data: dict

        :param lecture_id: The ID of the lecture to be edited.
        :type lecture_id: int

        :return: Response with the edited lecture data or error.
        :rtype: rest_framework.response.Response
        """
        lecture = get_object_or_404(Lecture, id=lecture_id)
        room_data_list = data.get('rooms', [])
        teacher_data_list = data.get('teacher', [])
        print(room_data_list, teacher_data_list)

        serializer = LectureSerializer(lecture, data=data)

        if serializer.is_valid():
            lecture = serializer.save()

            room_nrs = [room['roomNr'] for room in room_data_list]
            rooms = Room.objects.filter(roomNr__in=room_nrs)
            lecture.room.set(rooms)

            teacher_ids = [teacher['id'] for teacher in teacher_data_list]
            teachers = UserModel.objects.filter(id__in=teacher_ids)
            lecture.teacher.set(teachers)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def delete_lecture(lecture_id):
        """
        Deletes an existing lecture.

        :param lecture_id: The ID of the lecture to be deleted.
        :type lecture_id: int

        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """
        lecture = get_object_or_404(Lecture, id=lecture_id)
        lecture.delete()
        return Response({'message': 'Successfuly delete'}, status=status.HTTP_204_NO_CONTENT)


class RoomBusinessLogic:
    @staticmethod
    def get_rooms_by_study(studyId):
        """
        Retrieves rooms associated with a specific study.

        :param studyId: The study ID.
        :type studyId: str

        :return: List of rooms associated with the study.
        :rtype: rest_framework.response.Response
        """

        study = get_object_or_404(Study, studyName=studyId)
        rooms = Room.objects.filter(studys=study)
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def get_rooms_all():
        """
        Retrieves all rooms.

        :return: List of all rooms.
        :rtype: rest_framework.response.Response
        """
        try:
            rooms = Room.objects.all()
            serializer = RoomSerializer(rooms, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({"error": "No existing Rooms"})

    @staticmethod
    def new_room(data):
        """
        Creates a new room.

        :param data: The data for creating the new room.
        :type data: dict

        :return: Response with the created room data or error.
        :rtype: rest_framework.response.Response
        """
        serializer = RoomSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def edit_room(data, roomNr):
        """
        Edits an existing room.

        :param data: The data for editing the room.
        :type data: dict

        :param roomNr: The room number of the room to be edited.
        :type roomNr: int

        :return: Response with the edited room data or error.
        :rtype: rest_framework.response.Response
        """
        room = get_object_or_404(Room, roomNr=roomNr)
        serializer = RoomSerializer(room, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def delete_room(roomNr):
        """
        Deletes an existing room.

        :param roomNr: The room number of the room to be deleted.
        :type roomNr: int

        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """
        room = get_object_or_404(Room, roomNr=roomNr)
        room.delete()
        return Response({"success": f"Room {roomNr} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class InfoBusinessLogic:
    @staticmethod
    def new_info(data):
        """
        Creates a new info.

        :param data: The data for creating the new info.
        :type data: dict

        :return: Response indicating the success of the operation.
        :rtype: rest_framework.response.Response
        """
        info_data = data.get('info', {})
        lecture_data_list = data.get('lectures', [])
        info_serializer = InfoSerializer(data=info_data)

        if info_serializer.is_valid(raise_exception=True):
            info = info_serializer.save()
            for lecture_data in lecture_data_list:
                lecture_id = lecture_data['id']
                lecture = Lecture.objects.get(id=lecture_id)
                lecture.information.add(info)
        return Response("RESPONSE")


class DocumentBusinessLogic:
    @staticmethod
    def get_document_by_id(documentId):
        """
        Retrieves a document by its ID.

        :param documentId: The ID of the document.
        :type documentId: int

        :return: Document data.
        :rtype: rest_framework.response.Response
        """
        document = get_object_or_404(Document, id=documentId)
        serializer = DocumentSerializer(document)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def get_documents_by_room(roomNr):
        """
        Retrieves documents associated with a specific room.

        :param roomNr: The room number.
        :type roomNr: int

        :return: List of documents associated with the room.
        :rtype: rest_framework.response.Response
        """
        room = get_object_or_404(Room, roomNr=roomNr)
        documents = Document.objects.filter(rooms=room)
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def get_all_documents():
        """
        Retrieves all documents.

        :return: List of all documents.
        :rtype: rest_framework.response.Response
        """
        try:
            documents = Document.objects.all()
            serializer = DocumentSerializer(documents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Document.DoesNotExist:
            return Response({"error": "No DocumentsFound"}, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def new_document(request):
        """
        Creates a new document.

        :param request: The HTTP request object.
        :type request: django.http.HttpRequest

        :return: Response with the created document data or error.
        :rtype: rest_framework.response.Response
        """
        serializer = DocumentSerializer(context={'request': request}, data=request.data)
        if serializer.is_valid(raise_exception=True):
            document = serializer.save()
            room_nrs = request.data.pop('room_nrs', [])
            rooms = Room.objects.filter(roomNr__in=room_nrs)
            document.rooms.set(rooms)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def edit_document(data, document_id):
        """
        Edits an existing document.

        :param data: The data for editing the document.
        :type data: dict

        :param document_id: The ID of the document to be edited.
        :type document_id: int

        :return: Response with the edited document data or error.
        :rtype: rest_framework.response.Response
        """
        room_data_list = data.get('rooms', [])
        document = get_object_or_404(Document, id=document_id)
        serializer = DocumentSerializer(document, data=data)
        if serializer.is_valid():
            document = serializer.save()
            room_nrs = [room['roomNr'] for room in room_data_list]
            rooms = Room.objects.filter(roomNr__in=room_nrs)
            document.rooms.set(rooms)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def delete_document(document_id):
        """
        Deletes an existing document.

        :param document_id: The ID of the document to be deleted.
        :type document_id: int

        :return: Response indicating the success of the deletion.
        :rtype: rest_framework.response.Response
        """
        document = get_object_or_404(Document, id=document_id)
        document.delete()
        return Response({"success": f"Document {document_id} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class SemesterTimetableBusinessLogic:

    @staticmethod
    def get_all_timetables():
        """
        Retrieves all semester timetables.

        :return: List of all semester timetables.
        :rtype: rest_framework.response.Response
        """
        try:
            timetables = SemesterTimetable.objects.all()
            serializer = SemesterTimetableSerializer(timetables, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SemesterTimetable.DoesNotExist:
            return Response({"error": "No Timetables found"}, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def new_timetable(data):
        """
        Creates a new semester timetable.

        :param data: The data for creating the new timetable.
        :type data: dict

        :return: Response indicating the success of the operation.
        :rtype: rest_framework.response.Response
        """
        try:
            serializer = SemesterTimetableSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                semester_timetable = serializer.save()
                csv_loader = CsvTimetableLoader()
                csv_loader.load_timetable_data(semester_timetable)
                return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
