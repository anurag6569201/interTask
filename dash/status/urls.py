from django.urls import path
from status import views

app_name = 'status'

urlpatterns = [
    path('status/', views.status, name='status')
]