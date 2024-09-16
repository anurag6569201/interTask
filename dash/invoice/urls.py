from django.urls import path
from invoice import views

app_name = 'invoice'

urlpatterns = [
    path('invoice/', views.invoice, name='invoice'),
    path('create-invoice/', views.create_invoice, name='create_invoice'),
    path('edit-invoice/<int:pk>/', views.edit_invoice, name='edit_invoice'),
    path('delete-invoice/<int:pk>/', views.delete_invoice, name='delete_invoice'),
    path('print-invoice/<int:pk>/', views.print_invoice, name='print_invoice'),
    path('duplicate-invoice/<int:pk>/', views.duplicate_invoice, name='duplicate_invoice'),
]
