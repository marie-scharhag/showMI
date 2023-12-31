from django.contrib.auth import get_user_model, login, logout
from django.template.loader import render_to_string
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import AppUser

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token


from ..timetable.models import Study

UserModel = get_user_model()



class UserLogin(APIView):
    """
    API View for user login.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        """
        Handle user login.

        Parameters:
        - `email` (str): User's email address.
        - `password` (str): User's password.

        Returns:
        - `user` (UserSerializer): Serialized user information.
        - `token` (str): JWT token for authenticated user.
        """
        data = request.data
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'user': serializer.data,'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    """
    API View for user logout.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Handle user logout.
        """
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    """
    API View for user-related operations.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, studyId=None, user_id=None):
        """
        Get user information based on study or user ID.

        Parameters:
        - `studyId` (str): Study ID for filtering users.
        - `user_id` (int): User ID for retrieving specific user details.

        Returns:
        - List of serialized user information.
        """
        if studyId:
            try:
                study = Study.objects.get(studyName=studyId)
                users = UserModel.objects.filter(study=study)
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except Study.DoesNotExist:
                return Response({"error": "Study not found"},status=status.HTTP_404_NOT_FOUND)
        if user_id:
            try:
                user = UserModel.objects.get(id=user_id)
                serializer = UserSerializer(user)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            users = UserModel.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        """
        Update user information.

        Parameters:
        - `user_id` (int): ID of the user to be updated.

        Returns:
        - `user` (UserSerializer): Serialized user information.
        """
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
    """
    API View for changing user password.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, id):
        """
        Change user password.

        Parameters:
        - `id` (int): ID of the user changing the password.
        - `oldPassword` (str): User's current password.
        - `newPassword` (str): User's new password.

        Returns:
        - Success message or error message.
        """
        # Implemen
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')

        user = UserModel.objects.get(id=id)

        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class UserRegister(APIView):
    """
    API View for user registration.
    """
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Handle user registration.

        Parameters:
        - `email` (str): User's email address.
        - `password` (str): User's password.
        - Additional user details.

        Returns:
        - Success message or error message.
        """
        try:
            user = UserModel.objects.get(email=request.data["email"])
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        except AppUser.DoesNotExist:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.create(request.data)
                if user:
                    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)