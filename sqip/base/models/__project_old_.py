#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from sqip.config import *

MONGO_HOST = "db.sqip"

MONGO_PORT = 27017

from pymongo import MongoClient
client = MongoClient(host=MONGO_HOST, port=MONGO_PORT)
mongo = client.sqip

# apro = {
# 	"id"	: "CQUSQIPX502",
# 	"pro_name"	: "新视界.COM",
# 	"type"	: "重点项目",
# 	"tutor"	: "郭坤银",
# 	"in_charge"	: "高萌",
# 	"staff"	: "李亚轩",
# 	"state":"已结题",
# 	"news_src":"5383318",
# 	"update_time":"2015-11-15 09:38:41",
# 	"intro":"我们是害虫！我们是害虫！",
# 	"join_us":"加入我们吧！",
# 	"img":"http://img.xunsheng90.com/img/banner/voice_channel/拉赫.jpg@!banner-wx",
# }

# apronews = {
# 	"id":"",
# 	"list":[],
# }

def Project(arg, _id=False):
	pro = {}
	try:
		pro["id"]= _id if _id else arg.get("id").lower()
		pro["pro_name"]= arg.get("pro_name")
		pro["img"]= arg.get("img")
		pro["type"]= arg.get("type")
		pro["tutor"]= arg.get("tutor")
		pro["in_charge"]= arg.get("in_charge")
		pro["staff"]= arg.get("staff")
		pro["state"]= arg.get("state")
		pro["news_src"]= arg.get("news_src")
		pro["intro"]= arg.get("intro")
		pro["join_us"]= arg.get("join_us")
		pro["time"]= arg.get("time")
		pro["place"]= arg.get("place")
		return pro
	except Exception, e:
		return 0
		

# mongo.Pro.update({"id":"CQUSQIPX502"}, apro, True, True)
# test_pro = mongo.Pro.find_one({"id":"CQUSQIPX502"})
# print test_pro

# import requests

# params = {"page":1, "size":100, "uid":test_pro["news_src"]}
# print params

# headers = {'content-type': 'application/json'}
# r = requests.get('http://www.yiban.cn/blog/blog/getBlogList', params=params, headers=headers)
# r = r.json()
# news_list = r["data"]["list"]

# print news_list
# mongo.News.update({"id":"CQUSQIPX502"}, {"id":"CQUSQIPX502", "list":news_list}, True, True)

# news_test = mongo.News.find_one({"id":"CQUSQIPX502"})["list"]
# for news in news_test:
# 	print "http://www.yiban.cn/blog/index/otherblog/suid/" + news["User_id"] + "/blogid/" + news["id"]
import logging

from PIL import Image

def addPro(the_pro):
	try:
		the_pro = Project(the_pro)
		if not the_pro:
			return {"status":"failed", "error_msg":"args_wrong"}

		# if not thumbnail:
		# 	return {"status":"failed", "error_msg":"no_thumbnail"}
		# im = Image.open(thumbnail)
		# width, hight = im.getbbox()[2], im.getbbox()[3]
		# if width > MAX_WIDTH_PRO_THUMB:
		# 	im = im.resize((MAX_WIDTH_PRO_THUMB, hight * MAX_WIDTH_PRO_THUMB / width), Image.ANTIALIAS)
		# im = im.convert('RGB')
		# thumb_url = PRO_THUMB_PATH + the_pro.get("id") + ".jpg"
		# thumb_path = ROOT_PATH + thumb_url
		# im.save(thumb_path)

		# the_pro["img"] = thumb_url

		# the_pro = {'id':the_pro.get('id'), 'school':the_pro.get('school',''), 'post':the_pro.get('post',''), 'skills':the_pro.get('skills',''), 'phone':the_pro.get('phone',''), 'email':the_pro.get('email',''), 'detail':the_pro.get('detail',''), 'img':head, }
		# if tutor.addTutor(the_pro) == 0 :
		# 	return 0
		# do some check here
		mongo.Pro.update({"id":the_pro["id"]}, {"$set":the_pro}, True, True)
		return 0
	except Exception, e:
		return {"status":"failed", "error_msg":str(e)}

def updPro(the_pro, proId):
	try:
		the_pro = Project(the_pro, proId)
		if not the_pro:
			return {"status":"failed", "error_msg":"args_wrong"}
		mongo.Pro.update({"id":the_pro["id"]}, {"$set":the_pro}, True, True)
		return 0
	except Exception, e:
		return {"status":"failed", "error_msg":str(e)}

def getPros(page, size):
	pros = mongo.Pro.find()
	pro_list = []
	for pro in pros:
		del pro["_id"]
		pro_list.append(pro)
	# logging.exception(pro_list)
	# logging.exception(len(pro_list))
	# logging.exception(size)
	# logging.exception(len(pro_list)/size)
	if len(pro_list)%size>0:
		max_page = len(pro_list)/size + 1
	else:
		max_page = len(pro_list)/size
	return {"pros":pro_list[(page-1)*size : page*size], "max_page":max_page}
	# return test

def delPro(proId):
	mongo.Pro.remove({"id":proId})
	return 0


def getPro(proId):
	# do some check here
	pro = mongo.Pro.find_one({"id":proId})
	if pro:
		del pro["_id"]
		return pro
	else:
		return 0

def updateNews(proId, news_list):
	# do some check here
	mongo.News.update({"id":proId}, {"id":proId, "list":news_list}, True, True)
	return 0


def getNews(proId, page, size):
	full_list = mongo.News.find_one({"id":proId})
	if full_list:
		full_list = full_list["list"]
		if len(full_list)%size>0:
			max_page = len(full_list)/size + 1
		else:
			max_page = len(full_list)/size
		return {"news_list":full_list[(page-1)*size : page*size], "max_page":max_page}
	else:
		return 0


