from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include additional user information in the generated token.

    Inherits from TokenObtainPairSerializer.
    """
    @classmethod
    def get_token(cls, user):
        """
        Override the get_token method to include additional user information in the token.

        Parameters:
        - `user` (AppUser): User for whom the token is generated.

        Returns:
        - `token` (dict): JSON Web Token (JWT) containing user information.
        """
        token = super().get_token(user)

        token['user'] = {"id": user.id ,"email": user.email, "is_staff": user.is_staff, "first_name": user.first_name, "last_name": user.last_name}

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    """
     Custom token view using the MyTokenObtainPairSerializer.

     Inherits from TokenObtainPairView.
     """
    serializer_class = MyTokenObtainPairSerializer

