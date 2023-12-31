from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from rest_framework.serializers import ModelSerializer


UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    class Meta:
        model = UserModel
        fields = 'email', 'first_name', 'last_name', 'is_staff'

    def create(self, clean_data):
        """
        Create and return a new user based on the provided data.

        Parameters:
        - `validated_data` (dict): Validated data containing user details.

        Returns:
        - `user_obj` (UserModel): Newly created user object.
        """
        print(clean_data)
        user_obj = UserModel.objects.create_user(email=clean_data['email'], first_name=clean_data['first_name'], last_name=clean_data['last_name'], is_staff=clean_data['is_staff'])
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        """
        Authenticate and return the user based on the provided data.

        Parameters:
        - `validated_data` (dict): Validated data containing user credentials.

        Returns:
        - `user` (UserModel): Authenticated user object.

        Raises:
        - `ValidationError`: If the user is not found or authentication fails.
        """
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user details.
    """
    class Meta:
        model = UserModel
        fields = ['id','email','is_staff','first_name','last_name'] #'username'

