from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('users/', views.StudyUsersView.as_view(), name='users'),
    path('users/<int:user_id>', views.StudyUsersView.as_view(), name='users'),
    path('users/<str:studyId>/', views.StudyUsersView.as_view(), name='users'),
    path('users/change-password/<int:id>/', views.ChangePasswordView.as_view(), name='changePW'),
    # path('users/register/', views.UserRegister.as_view(), name='registeruser'),
]