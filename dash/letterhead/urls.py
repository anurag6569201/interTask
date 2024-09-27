from django.urls import path
from letterhead import views

app_name = 'letterhead'

urlpatterns = [
    path('letterhead/', views.letterhead, name='letterhead'),
    path('create_letterhead/<int:pk>/', views.create_letterhead, name='create_letterhead'),  # Edit page
    path('preview_letterhead/<int:pk>/', views.preview_letterhead, name='preview_letterhead'),  # Preview page
    path('letterhead/bulk-delete/', views.bulk_delete_letterhead, name='bulk_delete_letterhead'),  # Bulk delete
]