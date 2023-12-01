from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, authenticate
from rest_framework.serializers import ModelSerializer


UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = 'email', 'first_name', 'last_name', 'is_staff'

    def create(self, clean_data):
        print(clean_data)
        user_obj = UserModel.objects.create_user(email=clean_data['email'], first_name=clean_data['first_name'], last_name=clean_data['last_name'], is_staff=clean_data['is_staff'])
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['id','email','is_staff','first_name','last_name'] #'username'

