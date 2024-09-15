from django.urls import path
from invoice import views

app_name = 'invoice'

urlpatterns = [
    path('invoice/', views.invoice, name='invoice')
]