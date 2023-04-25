from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.get_personal_food),
    path('calc', views.calc_weight),
    path('tag', views.get_tags),
    path('info', views.get_single_food),
    path('search', views.search_food),
    path('nutrient', views.lack_of_nutrient),
    path('symptom/<symptom_id>', views.search_symptom),
]