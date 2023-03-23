from django.urls import path
from . import views

urlpatterns = [
    path('api/note/',views.getRouters, name='routes'),
    path('api/note/<str:pk>/', views.getModelNote, name='router')
]