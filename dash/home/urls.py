from django.urls import path, re_path
from home import views

urlpatterns = [
    path('', views.index, name='home'),
    re_path(r'^.*\.*', views.pages, name='pages'),

]
