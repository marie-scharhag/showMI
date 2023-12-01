from rest_framework.response import Response

from .serializers import UserLoginSerializer
from rest_framework import status
from .validations import validate_email, validate_password
from rest_framework.authtoken.models import Token


# def login(request):
#     data = request.data
#     assert validate_email(data)
#     assert validate_password(data)
#     serializer = UserLoginSerializer(data=data)
#     if serializer.is_valid(raise_exception=True):
#         user = serializer.check_user(data)
#         login(request, user)
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({'user': serializer.data, 'token': token.key}, status=status.HTTP_200_OK)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)