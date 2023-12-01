from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user'] = {"id": user.id ,"email": user.email, "is_staff": user.is_staff, "first_name": user.first_name, "last_name": user.last_name}

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



# @api_view(['GET'])
# def getRoutes (request):
#
#     routes = ['/api/token','/api/token/refresh']
#
#     return Response(routes)
