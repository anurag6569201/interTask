from django.urls import path
from chatbot import views

app_name = 'chatbot'

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('send-message/', views.send_message, name='send_message'),
    path('chatbot/edit/<int:pk>/', views.edit_csv, name='edit_csv'),
     path('chatbot/fetch_csv_data/<int:pk>/', views.fetch_csv_data, name='fetch_csv_data'),
]
