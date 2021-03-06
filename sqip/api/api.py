#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

import sys 
reload(sys) 
sys.setdefaultencoding("utf-8")

from sqip.config import *
from sqip.libs import *
# @TODO
# 为什么没有后三行就一直提示
# 'module' object has no attribute 'stu'
import models
from models import project, meta

from sqip.base.models import tutor, stu, application

from flask import Blueprint, g, request, redirect

api = Blueprint('api', __name__)


import logging
from functools import wraps
import requests, json, time

import pandas

def pm_admin(func):
	@wraps(func)
	def wraped(*args, **kw):
		return func(*args, **kw)
		
		if request.args.get('uid', False) == 'admin' and \
		   request.args.get('token',False)=='xcfgtrfghyujhgfdrtyhbvcxvbh':
			return func(*args, **kw)
		else:
			return jsonify({"status":"failed", 
							"error_code":"pm_admin", 
							"info":"func: "+str(func.__name__)}), 404
	return wraped


@api.route('/api/v1/tutors', methods=['GET'])
@union_bug
def api_tutors_get():
	page = int(request.args.get('page', 1))
	# sql转json真麻烦 -.-
	tutors = tutor.getTutorsByPage(page)
	tutors_list = []
	for a_tutor in tutors.items:
		tutor_dic ={"id"	:a_tutor.id, 
					"name"  :a_tutor.name, 
					"school":a_tutor.school, 
					"post"  :a_tutor.post, 
					"skills":a_tutor.skills, 
					"phone" :a_tutor.phone, 
					"email" :a_tutor.email,
					"head"  :a_tutor.head,
					"detail":a_tutor.detail}
		tutors_list.append(tutor_dic)

	return jsonify({"status"	:"success", 
					"tutors"	:tutors_list, 
					"curr_args"	:{"page_num":tutors.page}, 
					"max_page"	:tutors.pages})


@api.route('/api/v1/tutors', methods=['POST'])
@union_bug
@pm_admin
def api_tutors_post():
	report = tutor.addTutor(request.form)
	if report == 0:
		return jsonify({"status":"success"})
	else:
		jsonify(re)


@api.route('/api/v1/tutors/<tutorID>', methods=['GET'])
@union_bug
def api_tutor_get(tutorID):
	# sql转json真麻烦 -.-
	thisTutor = tutor.getTutorByID(tutorID)
	tutor_dic = {"id"	:thisTutor.id, 
				"name"  :thisTutor.name, 
				"school":thisTutor.school, 
				"post"  :thisTutor.post, 
				"skills":thisTutor.skills, 
				"phone" :thisTutor.phone, 
				"email" :thisTutor.email,
				"head"  :thisTutor.head,
				"detail":thisTutor.detail}

	return jsonify({"status":"success", 
					"tutor"	:tutor_dic})


@api.route('/api/v1/tutors/<tutorID>', methods=['PUT'])
@union_bug
@pm_admin
def api_tutor_put(tutorID):
	tutor.updateTutor(tutorID, request.form)
	return jsonify({"status":"success"})


@api.route('/api/v1/tutors/<tutorID>', methods=['DELETE'])
@union_bug
@pm_admin
def api_tutor_del(tutorID):
	tutor.deleteTutor(tutorID)
	return jsonify({"status":"success"})


@api.route('/api/v1/users', methods=['GET'])
@union_bug
def api_users():
	if request.method == 'GET':
		page = int(request.args.get('page', 1))
		# sql转json真麻烦 -.-
		users = stu.getStuByPage(page)
		users_list = []
		for user in users.items:
			user_dic = {"id":user.id, 
						"name":user.name, 
						"school":user.school, 
						"gender":user.gender, 
						"head":user.head}
			users_list.append(user_dic)

		return jsonify({"status":"success", 
						"users":users_list, 
						"curr_args":{"page_num":users.page}, 
						"max_page":users.pages})


# ======================================================================


@api.route('/api/v1/projects', methods=['GET'])
@union_bug
def get_pros():
	pros = project.getPros(int(request.args.get('page', 1)), 
								  int(request.args.get('size', 5)))
	if pros:
		return jsonify({"status":"success", 
						"pros":pros["pros"], 
						"max_page":pros["max_page"]})
	elif pros == []:
		return jsonify({"status":"failed", 
						"error_msg":"no projects fond"}), 404
	else:
		return jsonify({"status":"failed", 
						"error_msg":""}), 404


@api.route('/api/v1/projects', methods=['POST'])
@union_bug
@pm_admin
def add_pros():
	re = project.addPro(request.form)
	if re == 0:
		return jsonify({"status":"success"})
	else:
		return jsonify(re)


@api.route('/api/v1/projects/<proId>', methods=['GET'])
@union_bug
def get_pro_by_id(proId):
	the_pro = project.getPro(proId)
	if the_pro:
		return jsonify({"status":"success", "pro":the_pro})
	else:
		return jsonify({"status":"failed", "error_msg":"no_such_id"}), 404


@api.route('/api/v1/projects/<proId>', methods=['PUT', 'DELETE'])
@union_bug
@pm_admin
def edit_pro_by_id(proId):
	# return proId
	the_pro = project.getPro(proId)
	if the_pro:
		if request.method == 'DELETE':
			re = project.delPro(proId)
			if not re:
				return jsonify({"status":"success"})
			else: 
				return jsonify({"status":"failed", 
								"error_msg":"delete_wrong"}), 404

		if request.method == 'PUT':
			re = project.updPro(request.form, proId)
			if re == 0:
				return jsonify({"status":"success"})
			else:
				return jsonify(re)

	else:
		return jsonify({"status":"failed", 
						"error_msg":"no_such_id"}), 404



@api.route('/api/v1/projects/<proId>/news')
@union_bug
def get_news_by_id(proId):
	if request.args.get('pinned', False):
		the_news= project.getPinnedNews(proId, 
								 	 int(request.args.get('page', 1)),
								 	 int(request.args.get('size', 5)))
	else:
		the_news= project.getNews(proId, 
								  int(request.args.get('page', 1)),
								  int(request.args.get('size', 5)))

	if the_news:
		return jsonify({"status":"success", 
						"news_list":the_news["news_list"], 
						"max_page":the_news["max_page"]})
	elif the_news == []:
		return jsonify({"status":"failed", 
						"error_msg":"no news or out of page"}), 404
	else:
		return jsonify({"status":"failed", 
						"error_msg":str(the_news)}), 404


@api.route("/api/v1/projects/<proId>/news/pins")
@union_bug
@pm_admin
def get_new_pins(proId):
	newsPins = project.getNewsPins(proId)["newsPins"]
	return jsonify({"status":"success", 
					"id": proId,
					"newsPins": newsPins})


@api.route("/api/v1/projects/<proId>/news/pins", methods=['POST'])
@union_bug
@pm_admin
def add_new_pin(proId):
	project.pinNews(proId, request.form.get('newsId', ''))
	return jsonify({"status":"success"})


@api.route("/api/v1/projects/<proId>/news/pins/<newsId>", methods=['DELETE'])
@union_bug
@pm_admin
def delete_pin(proId, newsId):
	project.unpinNews(proId, newsId)
	return jsonify({"status":"success"})


# -------------------------------------------------------------------

@api.route('/api/v1/projects/update', methods=['GET'])
@union_bug
@pm_admin
def projects_update():
	"""更新news
	
	从projects数据库中拿出所有pro的news_src
	从易班暂未设置跨域的接口中抓该易班账号的轻博客文章列表
	覆盖更新新闻列表
	
	Raises:
		e -- [description]
	"""
	logging.debug("update_news ing")
	pros = project.getPros(1, 99999) # 获取全部项目

	from multiprocessing.dummy import Pool as ThreadPool 
	pool = ThreadPool(20) 
	pool.map(news_updater, pros["pros"])
	pool.close()
	pool.join()

	return jsonify({"status":"success"})


# def decode_news_src(src_raw):
# 	return filter(None, map(lambda x:src_raw.get("news_src_"+str(x) ,False),
# 							range(0,10)))


def news_updater(pro):
	# srcs = decode_news_src(pro)
	srcs = filter(None, map(lambda x:pro.get("news_src_"+str(x) ,False),
							range(0,10)))
	news_list = []
	for news_src in srcs:
		r = requests.get('http://www.yiban.cn/blog/blog/getBlogList', 
						 params ={"page":1, "size":100, "uid":news_src })
		if r:
			news_list += r.json()["data"]["list"]
			
	try:
		project.updateNews(pro["id"], news_list)
		logging.exception("done")
	except Exception, e:
		logging.exception(pro)
		raise e

# -------------------------------------------------------------------


@api.route('/api/v1/applications', methods=['GET'])
@union_bug
@pm_admin
def admin_applications():
	all_apl = application.getAllApplications()
	if all_apl is not False:
		return jsonify({"status":"success", 
						"applications":all_apl, 
						"max_page":1})
	else:
		return jsonify({"status":"failed", 
						"error_msg":"all_apl null"}), 404


@api.route('/api/v1/applications/old', methods=['GET'])
@union_bug
@pm_admin
def admin_old_applications():
	all_apl = application.getAllOldApplications()
	if all_apl is not False:
		return jsonify({"status":"success", 
						"applications":all_apl, 
						"max_page":1})
	else:
		return jsonify({"status":"failed", 
						"error_msg":"all_apl null"}), 404


@api.route("/api/v1/applications/archive", methods=['GET'])
@union_bug
@pm_admin
def archive_applications():
	application.archive()
	return jsonify({"status":"success"})
	# all_apl = application.getAllApplications()
	# if all_apl is not False:
	# 	for apl in all_apl:
	# 		apl["down_load_link"] = "//" + \
	# 									API_SERVER + \
	# 									"/static/data/application/" + \
	# 									str(apl["in_charge_id"]) + \
	# 									"/" + \
	# 									str(apl["in_charge_id"]) + \
	# 									"_term" +\
	# 									str(meta.getTerm()) + \
	# 									".zip"
	# 	result_string = json.dumps(all_apl).decode("unicode-escape")
	# 	file_name = ARCHIVE_FORDER + \
	# 				"archive-" + \
	# 				time.strftime("%Y%m%d-%H%M%S", time.localtime()) + \
	# 				".xlsx"
	# 	pandas.read_json(result_string).to_excel(file_name,	merge_cells=False)
	# 	return jsonify({"status":"success", 
	# 					"link":file_name[3:]})
	# else:
	# 	return jsonify({"status":"failed", 
	# 					"error_msg":"all_apl null"}), 404

@api.route('/api/v1/applications/<appId>/state', methods=['PUT'])
@union_bug
@pm_admin
def admin_applications_change_state(appId):
	r = application.changeState(appId, request.form.get('state'))
	if r == 0:
		return jsonify({"status":"success"})
	else:
		return jsonify({"status":"failed", "error_msg": "no such application"}), 404


@api.route('/api/v1/user/login', methods=['POST'])
@union_bug
def admin_login():
	uid = request.form.get('uid', False)
	pwd = request.form.get('pwd', False)
	if uid == 'admin' and pwd == 'jjnbv':
		return jsonify({"status":"success", 
						"uid":uid, 
						"token":"xcfgtrfghyujhgfdrtyhbvcxvbh"})
	else:
		return jsonify({"status":"failed", 
						"error_msg":"uid or token wrong"}), 404


@api.route('/api/v1/user/login', methods=['PUT'])
@union_bug
@pm_admin
def admin_login_refresh():
	uid = request.args.get('uid', False)
	return jsonify({"status":"success", 
					"uid":uid, 
					"token":"xcfgtrfghyujhgfdrtyhbvcxvbh"})


# ------------------------------------------------------------------

@api.route("/api/v1/meta/term")
@union_bug
def get_term():
	return jsonify({"status": "success", "term": meta.getTerm()})


@api.route("/api/v1/meta/term", methods=['PUT'])
@union_bug
@pm_admin
def meta_change_term():
	meta.setTerm( request.form.get('term') );
	return jsonify({"status": "success"})


@api.route("/api/v1/meta/appliable")
@union_bug
def getAppliable():
	return jsonify({"status": "success", "appliable": meta.getAppliable()})


@api.route("/api/v1/meta/appliable", methods=['PUT'])
@union_bug
@pm_admin
def meta_change_appliable():
	meta.setAppliable( request.form.get('appliable') );
	return jsonify({"status": "success"})


@api.route("/api/v1/meta/init", methods=['POST'])
@union_bug
@pm_admin
def init_meta():
	meta._init_meta( request.form.get('term'),
					 request.form.get('appliable', None),
					 request.form.get('admin_uid', None),
					 request.form.get('admin_pwd', None) );
	return jsonify({"status": "success"})


@api.route('/api/v1/meta/clear_application', methods=['GET'])
@union_bug
@pm_admin
def clear_appl():
	# appls = application.getAll()
	# map(lambda appl: application.cancelApplicationByStuID(appl.in_charge_id), appls)
	return "{'status': 'success'}"
