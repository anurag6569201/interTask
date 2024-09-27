from django.urls import path, re_path
from home import views

app_name = 'home'

urlpatterns = [
    path('', views.index, name='home'),
    path('profile/', views.profile, name='profile'),
    path('profile/update-email/', views.update_email_view, name='update_email'),
    path('profile/change-password/', views.change_password_view, name='change_password'),
    re_path(r'^page/(?P<page_slug>[\w-]+)/$', views.pages, name='pages'),
]