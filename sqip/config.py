#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

SECRET_KEY = "bgyjnb"

ALLOWED_EXTENSIONS = []

SQLALCHEMY_DATABASE_URI = "mysql://root:kojihu@mysql:3306/sqip?charset=utf8"

MONGO_HOST = "db.sqip"

MONGO_PORT = 27017

TUTOR_PER_PAGE = 12 
STU_PER_PAGE = 10

DEFAULT_USER_HEAD = "/app/static/img/default/default-user.jpg"

MAX_WIDTH_TUTOR_HEAD = 230

MAX_WIDTH_PRO_THUMB = 700;

IMG_TEMP_PATH = "/tmp/"

TUTOR_HEAD_FORDER = "/app/static/data/tutors/pics/"

APPLICATION_FORDER = "/app/static/data/application/"

PRO_THUMB_PATH = "/static/data/pro/"

ROOT_PATH = "/app"

API_SERVER = "127.0.0.1"