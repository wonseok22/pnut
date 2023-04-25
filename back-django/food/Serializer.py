from rest_framework import serializers
from . import models

class foodSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Food
        fields  = ('food_id','name',"url")
        # 사진도 보내야함

class searchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Food
        fields = ('food_id',"name", "time", "ingredients", "url", "cal")
        # 칼로리 보내야함


class nutrientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Nutrient
        fields = ("name", "guide", "description", "tag1", "tag2")