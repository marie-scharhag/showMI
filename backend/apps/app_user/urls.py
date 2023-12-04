from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('all/', views.UserView.as_view(), name='users'),
    path('<int:user_id>/', views.UserView.as_view(), name='user'),

    path('change-password/<int:id>/', views.ChangePasswordView.as_view(), name='changePW'),
    path('register/', views.UserRegister.as_view(), name='registeruser'),
]