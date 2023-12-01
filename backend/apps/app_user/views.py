from django.contrib.auth import get_user_model, login, logout
from django.template.loader import render_to_string
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from rest_framework.authtoken.models import Token


from ..timetable.models import Study

UserModel = get_user_model()



class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    # authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            # login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'user': serializer.data,'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # logout(request)
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)



class StudyUsersView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, studyId=None):
        if studyId:
            try:
                study = Study.objects.get(studyName=studyId)
                users = UserModel.objects.filter(study=study)
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except Study.DoesNotExist:
                return Response({"error": "Study not found"},status=status.HTTP_404_NOT_FOUND)
        else:
            users = UserModel.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        try:
            user = UserModel.objects.get(id=user_id)
            serializer = UserRegisterSerializer(user,data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, id):
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')

        user = UserModel.objects.get(id=id)

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class UserRegister(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    #eventuell isAdminUser -> nur Admin soll User registrieren können

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(request.data)
            if user:
                return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)