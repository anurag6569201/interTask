from django.urls import path, re_path
from home import views

app_name = 'home'

urlpatterns = [
    path('', views.index, name='home'),
    re_path(r'^page/(?P<page_slug>[\w-]+)/$', views.pages, name='pages'),
]