from django.urls import path
from core import views

app_name='core'

urlpatterns=[
    path('',views.index,name='index'),
    path('error',views.ErrorPage,name='errorPage'),
    path('Add',views.addShow,name='addShow'),
]