from django.urls import path
from authentication import views
from django.contrib.auth.views import LogoutView

app_name = 'authentication'

urlpatterns = [
    path('login/',views.login_view,name='login'),
    path('register/',views.register_view,name='register'),
    path('logout/',views.logout_view,name='logout'),
    path('verify-otp/', views.verify_otp_view, name='verify_otp'),
]
