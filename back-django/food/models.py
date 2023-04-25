from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Board(models.Model):
    board_id = models.BigAutoField(primary_key=True)
    user_email = models.ForeignKey('User', models.DO_NOTHING, db_column='user_email')
    content = models.TextField(blank=True, null=True)
    create_date = models.DateTimeField(blank=True, null=True)
    visit = models.IntegerField()
    thumbnail_image_url = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=30, blank=True, null=True)
    ingredients = models.CharField(max_length=200, blank=True, null=True)
    time = models.IntegerField(blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    likes = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'board'


class BoardSteps(models.Model):
    board_steps_id = models.BigAutoField(primary_key=True)
    board = models.ForeignKey(Board, models.DO_NOTHING)
    content = models.CharField(max_length=200, blank=True, null=True)
    image_url = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'board_steps'


class Category(models.Model):
    category_id = models.BigAutoField(primary_key=True)
    category_name = models.CharField(max_length=16, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'category'


class Comment(models.Model):
    user_email = models.ForeignKey('User', models.DO_NOTHING, db_column='user_email')
    board = models.ForeignKey(Board, models.DO_NOTHING)
    content = models.CharField(max_length=100, blank=True, null=True)
    create_date = models.DateTimeField(blank=True, null=True)
    comment_id = models.BigAutoField(primary_key=True)

    class Meta:
        managed = False
        db_table = 'comment'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Food(models.Model):
    food_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=45, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    time = models.IntegerField(blank=True, null=True)
    efficiency = models.CharField(max_length=255, blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    unit = models.CharField(max_length=5, blank=True, null=True)
    ingredients = models.CharField(max_length=100, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    cal = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'food'


class FoodCat(models.Model):
    food_cat_id = models.BigAutoField(primary_key=True)
    food = models.ForeignKey(Food, models.DO_NOTHING)
    cat = models.ForeignKey(Category, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'food_cat'


class FoodIngre(models.Model):
    food_ingre_id = models.BigAutoField(primary_key=True)
    ingredient = models.ForeignKey('Ingredient', models.DO_NOTHING)
    food = models.ForeignKey(Food, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'food_ingre'


class FoodNut(models.Model):
    food_nut_id = models.BigAutoField(primary_key=True)
    nutrient = models.ForeignKey('Nutrient', models.DO_NOTHING)
    food = models.ForeignKey(Food, models.DO_NOTHING)
    weight = models.FloatField(blank=True, null=True)
    weight_percent = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'food_nut'


class Ingredient(models.Model):
    ingredient_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ingredient'


class LikeTable(models.Model):
    like_id = models.BigAutoField(primary_key=True)
    board = models.ForeignKey(Board, models.DO_NOTHING)
    user_email = models.ForeignKey('User', models.DO_NOTHING, db_column='user_email')

    class Meta:
        managed = False
        db_table = 'like_table'


class NutIngre(models.Model):
    nut_ingre_id = models.BigIntegerField(primary_key=True)
    ingredient_ingredient_id = models.BigIntegerField()
    nutrient_nutrient_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'nut_ingre'


class NutQuest(models.Model):
    nut_quest_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey('Question', models.DO_NOTHING)
    nutrient = models.ForeignKey('Nutrient', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'nut_quest'


class Nutrient(models.Model):
    nutrient_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=45)
    guide = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    tag1 = models.CharField(max_length=30, blank=True, null=True)
    tag2 = models.CharField(max_length=30, blank=True, null=True)
    unit = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nutrient'


class NutrientQuestion(models.Model):
    nut_quest_id = models.BigAutoField(primary_key=True)
    nutrient_id = models.IntegerField(blank=True, null=True)
    question = models.ForeignKey('Question', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nutrient_question'


class NutrientRec(models.Model):
    nutrient_rec_id = models.BigAutoField(primary_key=True)
    gender = models.IntegerField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    nutrient = models.ForeignKey(Nutrient, models.DO_NOTHING)
    weight = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nutrient_rec'


class Question(models.Model):
    question_id = models.BigAutoField(primary_key=True)
    content = models.CharField(max_length=45, blank=True, null=True)
    category = models.ForeignKey(Category, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'question'


class Recipe(models.Model):
    recipe_id = models.BigAutoField(primary_key=True)
    ingredients = models.CharField(max_length=255, blank=True, null=True)
    time = models.IntegerField(blank=True, null=True)
    food = models.ForeignKey(Food, models.DO_NOTHING)
    quantitiy = models.IntegerField(blank=True, null=True)
    quantity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'recipe'


class RecipeSteps(models.Model):
    recipe_steps_id = models.BigAutoField(primary_key=True)
    recipe = models.ForeignKey(Recipe, models.DO_NOTHING)
    image_url = models.CharField(max_length=45, blank=True, null=True)
    content = models.CharField(max_length=200, blank=True, null=True)
    recipe_stepscol = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recipe_steps'


class Result(models.Model):
    result_id = models.BigAutoField(primary_key=True)
    user_email = models.ForeignKey('User', models.DO_NOTHING, db_column='user_email')
    question = models.ForeignKey(Question, models.DO_NOTHING)
    degree = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'result'


class User(models.Model):
    email = models.CharField(primary_key=True, max_length=50)
    password = models.CharField(max_length=100, blank=True, null=True)
    salt = models.TextField(blank=True, null=True)
    nickname = models.CharField(max_length=24, blank=True, null=True)
    name = models.CharField(max_length=10, blank=True, null=True)
    type = models.CharField(max_length=10, blank=True, null=True)
    join_date = models.DateTimeField(blank=True, null=True)
    profile_image_url = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField()
    gender = models.IntegerField()
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    auth = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'


class UserSymptom(models.Model):
    user_symptom_id = models.BigAutoField(primary_key=True)
    user_email = models.ForeignKey(User, models.DO_NOTHING, db_column='user_email')
    nutrient = models.ForeignKey(Nutrient, models.DO_NOTHING)
    value = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_symptom'
