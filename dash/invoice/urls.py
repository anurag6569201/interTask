from django.urls import path
from invoice import views

app_name = 'invoice'

urlpatterns = [
    path('invoice/', views.invoice, name='invoice'),
    path('create-invoice/', views.create_invoice, name='create_invoice'),
    path('edit-invoice/<int:pk>/', views.edit_invoice, name='edit_invoice'),
    path('delete-invoice/<int:pk>/', views.delete_invoice, name='delete_invoice'),
    path('duplicate-invoice/<int:pk>/', views.duplicate_invoice, name='duplicate_invoice'),
    path('bulk-delete/', views.bulk_delete_invoices, name='bulk_delete'),
    path('view_invoice/<int:pk>/', views.view_invoice, name='view_invoice'),

    path('bank-details/', views.bank_details_view, name='bank_details_view'),
]
