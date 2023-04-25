# import sys
# import os
# import pymysql
# import base64
# import requests
# import pandas as pd
# import openpyxl
# host = "pnut.cr7lqn4qteql.ap-northeast-2.rds.amazonaws.com"
# port = 3306
# username = "admin"
# database = "pnut"
# password = "asdf1234"
#
#
# def connect(host, port, username, password, database):
#     try :
#         conn = pymysql.connect(
#             host="pnut.cr7lqn4qteql.ap-northeast-2.rds.amazonaws.com",
#             port=3306,
#             user="admin",
#             password="asdf1234",
#             database="pnut"
#         )
#         cursor = conn.cursor()
#     except:
#         exit(-1)
#     return conn,cursor
#
#
# conn, cursor = connect(host,port,username,password,database)
# nutrients = [
#     "열량",
#     "단백질",
#     "지방",
#     "탄수화물",
#     "포도당",
#     "식이섬유",
#     "칼슘",
#     "철",
#     "마그네슘",
#     "인",
#     "칼륨",
#     "나트륨",
#     "아연",
#     "구리",
#     "망간",
#     "베타카로틴",
#     "비타민D",
#     "비타민B",
#     "엽산",
#     "비타민C",
#     "콜레스테롤",
#     "포화지방산",
#     "트랜스지방산",
#     "오메가3"
# ]
# unit = [
#     "kcal",
#     "g",
#     "g",
#     "g",
#     "g",
#     "g",
#     "g",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "mg",
#     "µg",
#     "µg",
#     "mg",
#     "µg",
#     "mg",
#     "mg",
#     "g",
#     "g",
#     "µg"
# ]
# category = [
#     "마음",
#     "피부",
#     "구강관리",
#     "다이어트",
#     "뼈/관절",
#     "피로/활력",
#     "간 건강",
#     "장 건강",
#     "모발/두피",
#     "위/소화",
#     "면역력"
# ]
#
# while True:
#     print("질문 번호 입력")
#     question_num = input()
#     if question_num == -1:
#         print("정상적으로 종료되었씁니다.")
#         break
#     print("영양소 번호 입력")
#     nut_num = input()
#     query = "INSERT INTO pnut.nut_quest (question_id, nutrient_id) VALUES('" + question_num + "',"+ nut_num + ");"
#     cursor.execute(query)
#     conn.commit()









