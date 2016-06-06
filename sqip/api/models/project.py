#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import logging, json

from sqip.config import *

# MONGO_HOST = "db.sqip"

# MONGO_PORT = 27017

from pymongo import MongoClient
client = MongoClient(host=MONGO_HOST, port=MONGO_PORT)
mongo = client.sqip


def Project(arg, _id=False):
	pro = {}
	try:
		pro["id"]        = _id if _id else arg.get("id").lower() # ID
		pro["pro_name"]  = arg.get("pro_name") # 项目名
		pro["img"]       = arg.get("img") # 项目头图
		pro["type"]      = arg.get("type") # 项目类型
		pro["tutor"]     = arg.get("tutor") # 指导老师
		pro["in_charge"] = arg.get("in_charge") # 负责人
		pro["staff"]     = arg.get("staff") # 团队成员
		pro["state"]     = arg.get("state") # 进行状态 finished | inProgress

		pro["news_src_0"]      = arg.get("news_src_0") # 新闻来源的易班ID
		pro["news_src_0_note"] = arg.get("news_src_0_note") # 备注
		pro["news_src_1"]      = arg.get("news_src_1") # 新闻来源的易班ID
		pro["news_src_1_note"] = arg.get("news_src_1_note") # 备注
		pro["news_src_2"]      = arg.get("news_src_2") # 新闻来源的易班ID
		pro["news_src_2_note"] = arg.get("news_src_2_note") # 备注

		pro["intro"]   = arg.get("intro") # 项目介绍
		pro["join_us"] = arg.get("join_us") # 报名方式
		pro["time"]    = arg.get("time") # 项目进行时间
		pro["place"]   = arg.get("place") # 项目进行地点

		# add 
		pro["term"]      = arg.get("term") # 第几期项目
		pro["excellent"] = arg.get("excellent") # 是否为优秀项目
		pro["pin"]       = arg.get("pin") # 是固定在主页上
		return pro
	except Exception, e:
		return 0


def addPro(the_pro):
	try:
		the_pro = Project(the_pro)
		if not the_pro:
			return {"status":"failed", "error_msg":"args_wrong"}		
		
		mongo.Pro.update({"id":the_pro["id"]}, 
						 {"$set":the_pro}, True, True)
		return 0
	except Exception, e:
		return {"status":"failed", "error_msg":str(e)}


def updPro(the_pro, proId):
	try:
		the_pro = Project(the_pro, proId)
		if not the_pro:
			return {"status":"failed", "error_msg":"args_wrong"}
		mongo.Pro.update({"id":the_pro["id"]}, 
						 {"$set":the_pro}, True, True)
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
	return {"pros":pro_list[(page-1)*size : page*size], 
			"max_page":max_page}
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
	mongo.News.update({"id":proId}, 
					  {"$set":{"list":news_list}}, True, True)
	return 0


def getNews(proId, page, size):
	full_list = mongo.News.find_one({"id":proId})
	if full_list:
		full_list = full_list["list"]
		if len(full_list)%size>0:
			max_page = len(full_list)/size + 1
		else:
			max_page = len(full_list)/size
		return {"news_list":full_list[(page-1)*size : page*size], 
				"max_page":max_page}
	else:
		return 0


def getPinnedNews(proId, page, size):
	newsPins = getNewsPins(proId)["newsPins"]
	logging.exception(json.dumps(newsPins))
	full_list = mongo.News.find_one({"id":proId})
	if full_list:
		full_list = full_list["list"]
		# delete news not pinned
		pinned_list = []
		for news in full_list:
			if news["id"] in newsPins:
				# logging.exception(json.dumps(news["id"]))
				pinned_list.append(news)
				# full_list.remove(news)

		if len(pinned_list)%size>0:
			max_page = len(pinned_list)/size + 1
		else:
			max_page = len(pinned_list)/size
		return {"news_list":pinned_list[(page-1)*size : page*size], 
				"max_page":max_page}
	else:
		return 0


def pinNews(proId, newsId):
	# do some ckeck
	# logging.exception(set(getNewsPins(proId)["newsPins"]))
	# logging.exception(set([newsId]))
	newsPins = set(getNewsPins(proId)["newsPins"]) | set([newsId])
	# logging.exception(newsPins)
	# logging.exception(list(newsPins))
	mongo.News.update({"id":proId}, 
					  {"$set":{"newsPins":list(newsPins)}}, True, True)
	return 0


def unpinNews(proId, newsId):
	newsPins = set(getNewsPins(proId)["newsPins"]) - set([newsId])
	mongo.News.update({"id":proId}, 
					  {"$set":{"newsPins":list(newsPins)}}, True, True)
	return 0


def getNewsPins(proId):
	pro = mongo.News.find_one({"id":proId})
	if pro:
		return {"id": proId, "newsPins": pro.get("newsPins", [])}
	else:
		return {"id": proId, "newsPins": [], "info": "no such proId"}
