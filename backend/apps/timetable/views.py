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
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, lecture_id=None, roomNr=None, user_id=None):
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

        # if lectureId and roomNr:
        #     try:
        #         lecture = Lecture.objects.get(id=lectureId)
        #         room = Room.objects.get(roomNr=roomNr)
        #         image_response = cached_image(request, lecture, room)
        #         if image_response.status_code == 200:
        #             response = HttpResponse(image_response.content, content_type='image/png')
        #             response['Content-Disposition'] = f'attachment; filename="{lecture.lectureNr}.png"'
        #             return response
        #         else:
        #             return Response({"error": "Error at loading image"}, image_response.status_code)
        #     except Lecture.DoesNotExist:
        #         return Response({"error": "Lecture not found"}, status=status.HTTP_404_NOT_FOUND)
        #
        # if lectureId:
        #     try:
        #         lecture = Lecture.objects.get(id=lectureId)
        #         image_response = cached_image(request, lecture)
        #         if image_response.status_code == 200:
        #             response = HttpResponse(image_response.content, content_type='image/png')
        #             response['Content-Disposition'] = f'attachment; filename="{lecture.lectureNr}.png"'
        #             return response
        #         else:
        #             return Response({"error": "Error at loading image"}, image_response.status_code)
        #     except Lecture.DoesNotExist:
        #         return Response({"error": "Lecture not found"}, status=status.HTTP_404_NOT_FOUND)
        # if roomNr:
        #     try:
        #         room = Room.objects.get(roomNr=roomNr)
        #         lectures = Lecture.objects.filter(room=room)
        #         serializer = LectureSerializer(lectures, many=True)
        #         return Response(serializer.data, status=status.HTTP_200_OK)
        #     except Room.DoesNotExist:
        #         return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        # if user_id:
        #     try:
        #         user = UserModel.objects.filter(id=user_id)
        #         lectures = Lecture.objects.filter(teacher__in=user)
        #         serializer = LectureSerializer(lectures, many=True)
        #         return Response(serializer.data, status=status.HTTP_200_OK)
        #     except UserModel.DoesNotExist:
        #         return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        data = request.data
        return LectureBusinessLogic.new_lecture(data)
        # print(request.data)
        # roomNrs_data_list = request.data.get('room', [])
        # teacherIds_data_list = request.data.get('teacher', [])
        # serializer = LectureSerializer(data=request.data)
        # if serializer.is_valid():
        #     lecture = serializer.save()
        #
        #     rooms = Room.objects.filter(roomNr__in=roomNrs_data_list)
        #     lecture.room.set(rooms)
        #
        #     teachers = UserModel.objects.filter(id__in=teacherIds_data_list)
        #     lecture.teacher.set(teachers)
        #
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, lecture_id):
        data = request.data
        return LectureBusinessLogic.edit_lecture(data,lecture_id)
        # lecture = get_object_or_404(Lecture, id=lecture_id)
        # room_data_list = request.data.get('rooms', [])
        # teacher_data_list = request.data.get('teacher', [])
        # print(room_data_list, teacher_data_list)
        #
        # serializer = LectureSerializer(lecture, data=request.data)
        #
        # if serializer.is_valid():
        #     lecture = serializer.save()
        #
        #     room_nrs = [room['roomNr'] for room in room_data_list]
        #     rooms = Room.objects.filter(roomNr__in=room_nrs)
        #     lecture.room.set(rooms)
        #
        #     teacher_ids = [teacher['id'] for teacher in teacher_data_list]
        #     teachers = UserModel.objects.filter(id__in=teacher_ids)
        #     lecture.teacher.set(teachers)
        #
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, lecture_id):
        return LectureBusinessLogic.delete_lecture(lecture_id)
        # lecture = get_object_or_404(Lecture, id=lecture_id)
        # lecture.delete()
        # return Response({'message': 'Successfuly delete'}, status=status.HTTP_204_NO_CONTENT)


class RoomView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, studyId=None):
        if studyId:
            return RoomBusinessLogic.get_rooms_by_study(studyId)
        else:
            return RoomBusinessLogic.get_rooms_all()

    def post(self, request):
        data = request.data
        return RoomBusinessLogic.new_room(data)
        # serializer = RoomSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, roomNr):
        data = request.data
        return RoomBusinessLogic.edit_room(data, roomNr)
        # try:
        #     room = Room.objects.get(roomNr=roomNr)
        # except Room.DoesNotExist:
        #     return Response({"error": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
        #
        # serializer = RoomSerializer(room, data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, roomNr):
        return RoomBusinessLogic.delete_room(roomNr)
        # room = get_object_or_404(Room, roomNr=roomNr)
        # room.delete()
        # return Response({"success": f"Room {roomNr} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class InfoView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        return InfoBusinessLogic.new_info(data)
        # info_data = request.data.get('info', {})
        # lecture_data_list = request.data.get('lectures', [])
        #
        # # for lecture_data in lecture_data_list:
        # #     lecture_data['information'] = info_data
        #
        # infoSerializer = InfoSerializer(data=info_data)
        # # lectureSerializer = LectureSerializer(data=lecture_data_list, many=True)
        # # print(infoSerializer.data)
        # # info = Information.objects.get_or_create(infoSerializer.data)
        # if infoSerializer.is_valid(raise_exception=True):
        #     info = infoSerializer.save()
        #     # info.save()
        #
        #     for lecture_data in lecture_data_list:
        #         lecture_id = lecture_data['id']
        #         lecture = Lecture.objects.get(id=lecture_data['id'])
        #         print(f"Lecture ID: {lecture_id}, lecture: {lecture}")
        #         lecture.information.add(info)
        #         # lecture.save()
        #         print(lecture.information)
        #         print(f"lecture information after adding: {lecture.information.all()}")
        #     # print(LectureSerializer.data)
        # return Response("RESPONSE")


# class TimeslotView(viewsets.ModelViewSet):
#     serializer_class = TimeslotSerializer
#     queryset = Timeslot.objects.all()


class StudyView(viewsets.ModelViewSet):
    serializer_class = StudySerializer
    queryset = Study.objects.all()


class DocumentView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, documentId=None, roomNr=None):
        if documentId:
            return DocumentBusinessLogic.get_document_by_id(documentId)
            # document = Document.objects.get(id=documentId)
            # serializer = DocumentSerializer(document)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        if roomNr:
            return DocumentBusinessLogic.get_documents_by_room(roomNr)
            # room = Room.objects.get(roomNr=roomNr)
            # documents = Document.objects.filter(rooms=room)
            # serializer = DocumentSerializer(documents, many=True)
            # return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return DocumentBusinessLogic.get_all_documents()
            # try:
            #     documents = Document.objects.all()
            #     serializer = DocumentSerializer(documents, many=True)
            #     return Response(serializer.data, status=status.HTTP_200_OK)
            # except Document.DoesNotExist:
            #     return Response({"error": "No DocumentsFound"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        return DocumentBusinessLogic.new_document(request)
        # serializer = DocumentSerializer(context={'request': request},data=request.data)
        # if serializer.is_valid(raise_exception=True):
        #     document = serializer.save()
        #     room_nrs = request.data.pop('room_nrs', [])
        #     rooms = Room.objects.filter(roomNr__in=room_nrs)
        #     document.rooms.set(rooms)
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # else:
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, document_id):
        return DocumentBusinessLogic.edit_document(request.data, document_id)
        # room_data_list = request.data.get('rooms', [])
        # print(room_data_list)
        # document = get_object_or_404(Document, id=document_id)
        # serializer = DocumentSerializer(document, data=request.data)
        # print(request.data)
        # if serializer.is_valid():
        #     document = serializer.save()
        #     room_nrs = [room['roomNr'] for room in room_data_list]
        #     rooms = Room.objects.filter(roomNr__in=room_nrs)
        #     document.rooms.set(rooms)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # else:
        #     print(serializer.errors)
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, document_id):
        return DocumentBusinessLogic.delete_document(document_id)
        # document = get_object_or_404(Document, id=document_id)
        # document.delete()
        # return Response({"success": f"Document {document_id} deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class TimetableView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return SemesterTimetableBusinessLogic.get_all_timetables()
        # try:
        #     timetables = SemesterTimetable.objects.all()
        #     serializer = SemesterTimetableSerializer(timetables,many=True)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        # except SemesterTimetable.DoesNotExist:
        #     return Response({"error": "No Timetables found"}, status=status.HTTP_404_NOT_FOUND)


    def post(self, request):
        return SemesterTimetableBusinessLogic.new_timetable(request.data)
        # try:
        #     serializer = SemesterTimetableSerializer(data=request.data)
        #     if serializer.is_valid(raise_exception=True):
        #         semester_timetable = serializer.save()
        #         print(semester_timetable)
        #         # csv_file = request.FILES['timetable_data']
        #         csv_loader = CsvTimetableLoader()
        #         csv_loader.load_timetable_data(semester_timetable)
        #         return Response(status=status.HTTP_200_OK)
        # except Exception as e:
        #     print(e)
        #     return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
