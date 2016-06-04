#!/usr/bin/env python
#-*-coding:utf-8-*-
# 保存系统源信息

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from sqip.config import *

from pymongo import MongoClient
client = MongoClient(host=MONGO_HOST, port=MONGO_PORT)
mongo = client.sqip


def Meta(arg):
	meta = {}
	try:
		meta["term"]       = arg.get("term") 	  # 当前项目的期数
		meta["appliable"]  = arg.get("appliable") # 是否开放申报
		meta["admin_uid"]  = arg.get("admin_uid") # 管理员用户名
		meta["admin_pwd"]  = arg.get("admin_pwd") # 管理员密码
		return meta
	except Exception, e:
		return 0

def getTerm():
	meta = mongo.Meta.find_one({"id":0})
	return meta["term"]

def setTerm(_term):
	mongo.Meta.update({"id":0}, 
					  {"$set":{"term": _term}}, True, True)
	return 0

def getAppliable():
	meta = mongo.Meta.find_one({"id":0})
	return meta["appliable"]

def setAppliable(_appliable):
	mongo.Meta.update({"id":0}, 
					  {"$set":{"appliable": _appliable}}, True, True)
	return 0

def getAdminUid():
	meta = mongo.Meta.find_one({"id":0})
	return meta["admin_uid"]

def setAdminUid(_admin_uid):
	mongo.Meta.update({"id":0}, 
					  {"$set":{"admin_uid": _admin_uid}}, True, True)
	return 0

def getAdminPwd():
	meta = mongo.Meta.find_one({"id":0})
	return meta["admin_pwd"]

def setAdminPwd(_admin_pwd):
	mongo.Meta.update({"id":0}, 
					  {"$set":{"admin_pwd": _admin_pwd}}, True, True)
	return 0

def _init_meta(term, appliable=0, 
			   admin_uid="admin001", admin_pwd="jjnbv"):
	mongo.Meta.update({"id":0}, 
					  {"$set":{
					  		"id": 0,
					   		"term": term,
					   		"appliable": appliable,
					   		"admin_uid": admin_uid,
					   		"admin_pwd": admin_pwd,
					   }}, True, True)
	return 0