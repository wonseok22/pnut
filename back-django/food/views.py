import random
import urllib

from django.db.models import Subquery, ExpressionWrapper, F, FloatField
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

# Create your views here.
import sys

from django.views.decorators.csrf import csrf_exempt

from . import models
from . import Serializer
MAX_NUTRIENT = 24


@csrf_exempt
def lack_of_nutrient(request):
    """
    Desc :
        개인별 부족한 영양소 3가지와 각 영양소 별 음식을 3가지씩 추천한다.

    Args :
        user_email : 현재 로그인 한 사용자의 이메일

    Returns :
        [부족한 영양소, [음식1, 음식2, 음식3]]의 형태로 반환
    """
    user_email = request.GET["user_email"]
    user_symptoms = models.UserSymptom.objects.filter(user_email = user_email).order_by("-value")
    nutrients = list()

    for us in user_symptoms[:3]:
        nutrients.append(us.nutrient_id)
    result = dict()
    result["data"] = list()
    result["message"] = "SUCCESS"
    for r in nutrients:
        result["data"].append([Serializer.nutrientSerializer(models.Nutrient.objects.get(nutrient_id = r)).data,
                               [Serializer.foodSerializer(food).data for food in models.Food.objects.filter(foodnut__nutrient_id=r).order_by('-foodnut__weight')[:3]]
                               ])
    return JsonResponse(result, status=200)

@csrf_exempt
def calc_weight(request):
    """
    Desc :
        설문조사 결과 데이터를 통해 해당 유저의 영양소 별 가중치를 계산하여 DB에 넣는다.

    Args :
        user_email : 현재 로그인 한 사용자의 이메일

    Returns :
        None
    """
    user_email = request.GET["user_email"]
    models.UserSymptom.objects.filter(user_email=user_email).delete()
    degree = [0, 0.25, 0.5, 0.75, 1.0]
    nutrient = [0 for _ in range(MAX_NUTRIENT + 1)]
    results = models.Result.objects.filter(user_email=user_email)
    user = models.User.objects.get(email=user_email)
    # 모든 설문 결과에 대해 해당 설문의 영양소 번호와 부족한 수치를 누적
    for result in results:
        d = result.degree
        question = result.question_id
        nut_quest = models.NutQuest.objects.filter(question_id=question)
        for n_quest in nut_quest:
            nutrient_id = n_quest.nutrient_id
            nutrient[nutrient_id] += degree[d]

    # 부족한 영양소라면 user_symptom 테이블에 저장
    for nutrient_id in range(1, MAX_NUTRIENT + 1):
        n = models.Nutrient.objects.get(nutrient_id=nutrient_id)
        if nutrient[nutrient_id] > 0:
            user_nutrient = models.UserSymptom()
            user_nutrient.nutrient = n
            user_nutrient.user_email = user
            user_nutrient.value = nutrient[nutrient_id]
            user_nutrient.save()
    return HttpResponse(status=200)

@csrf_exempt
def get_personal_food(request):
    """
    Desc :
        (개인별 부족한 영양소 ) x ( 음식의 해당 영양소 함유량 비율 )을 계산하여 가중치 별 상위 5개의 음식을 알려준다..
    Args :
        user_email : 현재 로그인 한 사용자의 이메일
    Returns :
        음식 객체 5개
    """
    user_email = request.GET["user_email"]
    foods = models.Food.objects.all()
    food_list = [[0, 0] for _ in range(len(foods))]
    user_nutrient = models.UserSymptom.objects.filter(user_email=user_email)
    for idx, food in enumerate(foods):
        nutrients = models.FoodNut.objects.filter(food_id=food.food_id)
        food_list[idx][1] = food.food_id
        for user_nut in user_nutrient:
            for nutrient in nutrients:
                if nutrient.nutrient_id == user_nut.nutrient_id:
                    food_list[idx][0] += nutrient.weight_percent * user_nut.value
    food_list.sort(reverse=True, key=lambda x: x[0])
    result = dict()
    result["data"] = list()
    result["message"] = "SUCCESS"

    for nut,food_id in food_list[:5]:
        result["data"].append(Serializer.foodSerializer(models.Food.objects.get(food_id=food_id)).data)
    return JsonResponse(result, status=200)


@csrf_exempt
def search_food(request):
    """
    Desc :
        type과 keyword를 통해 검색한 요리 결과물을 반환한다.
    Args :
        type : 재료, 또는 음식이름으로 검색
            ingredient 또는 food
        keyword : 검색어
    Returns :
       검색 결과 반환
    """

    type = request.GET["type"]
    keyword = request.GET["keyword"]
    if type == "ingredient": # 재료 검색
        search_result = models.Food.objects.filter(ingredients__icontains=keyword)
    else: # 음식 이름으로 검색
        search_result = models.Food.objects.filter(name__icontains=keyword)
    result = dict()
    result["data"] = list()
    result["message"] = "SUCCESS"
    for r in search_result:
        result["data"].append(Serializer.searchSerializer(r).data)
    return JsonResponse(result,status=200)


@csrf_exempt
def search_symptom(request,symptom_id):
    """
    Desc :
        증상별로 요리를 반환한다.
    Args :
        symptoms_id : 검색할 증상 번호
            0   전체
            1	마음
            2	피부
            3	구강관리
            4	다이어트
            5	뼈/관절
            6	피로/활력
            7	간 건강
            8	장 건강
            9	모발/두피
            10	위/소화
            11	면역력
    Returns :
       증상별 검색 결과 반환
    """
    result = dict()
    result["data"] = list()
    result["message"] = "SUCCESS"
    if symptom_id == '0':
        search_result = models.Food.objects.all()
    else:
        search_result = models.Food.objects.filter(foodcat__cat_id=symptom_id)
    for r in search_result:
        result["data"].append({
            'food_id' : r.food_id,
            'name' : r.name,
            'time' : r.time,
            'ingredients' : r.ingredients,
            'url' : r.url,
            'cal' : r.cal
        })
    random.shuffle(result["data"])
    return JsonResponse(result,status=200)

@csrf_exempt
def get_single_food(request):
    """
    Desc :
        음식 상세정보를 반환한다.

    Args :
        food_id : 상세정보를 받을 음식의 ID

    Returns :
        url, name, 설명, 효능, 영양소와 권장섭취량 비율 리스트
    """
    food_id = request.GET["food_id"]
    user_email = request.GET["user_email"]
    nut = list()

    food = models.Food.objects.get(food_id=food_id)
    user = models.User.objects.get(email=user_email)
    age_group = user.age // 10
    res = models.Nutrient.objects.filter(foodnut__food_id=food_id, nutrientrec__gender=user.gender,
                                         nutrientrec__age=age_group).annotate(
        percent=ExpressionWrapper(
            F('foodnut__weight') / F('nutrientrec__weight') * 100,
            output_field=FloatField()
        )
    ).values('name', 'percent')
    for r in res:

        nut.append([r["name"],round(r["percent"],1)])
    result = dict()
    result["data"] = dict()
    result["data"]["cal"] = models.FoodNut.objects.get(food_id = food_id, nutrient_id=1).weight
    result["data"]["food_id"] = food_id
    result["data"]["url"] = food.url
    result["data"]["name"] = food.name
    result["data"]["desc"] = food.description
    result["data"]["efficiency"] = food.efficiency
    result["data"]["ingredient"] = food.ingredients
    result["data"]["nutrient"] = nut
    result["message"] = "SUCCESS"
    return JsonResponse(result, status=200)

def get_tags(request):
    ing = models.Ingredient.objects.all()
    result = dict()
    result["data"] = list()

    for i in ing:
        result["data"].append(i.name)
    random.shuffle(result["data"])
    result["data"] = result["data"][:10]
    result["message"] = "SUCCESS"
    return JsonResponse(result, status=200)