from django.urls import path
from status import views

app_name = 'status'

urlpatterns = [
    path('order/', views.order_list, name='order_list'),
    path('order/create/', views.order_create, name='order_create'),
    path('<int:pk>/edit/', views.order_update, name='order_update'),
    path('<int:pk>/delete/', views.order_delete, name='order_delete'),
    path('status/bulk-delete/', views.bulk_delete_status, name='bulk_delete'),
]