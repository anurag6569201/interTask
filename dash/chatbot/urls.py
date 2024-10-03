from django.urls import path
from chatbot import views

app_name = 'chatbot'

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('send-message/', views.send_message, name='send_message'),
]
