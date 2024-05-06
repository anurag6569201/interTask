from django.urls import path
from core import views
from core.views import LikeEvent

app_name='core'

urlpatterns=[
    path('',views.index,name='index'),
    path('error',views.ErrorPage,name='errorPage'),
    path('Add',views.addShow,name='addShow'),
    path('like/<int:event_id>/', LikeEvent.as_view(), name='like_event'),
]