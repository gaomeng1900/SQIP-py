#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed


from sqip.config import *
from sqip.libs import *
# @TODO
# 为什么没有后三行就一直提示
# 'module' object has no attribute 'stu'
import models
from models import project
from models import tutor
from models import stu
from models import application

from flask import Blueprint, g, request, redirect

api = Blueprint('api', __name__)


import logging
from functools import wraps

def pm_admin(func):
	@wraps(func)
	def wraped(*args, **kw):
		if request.args.get('uid', False) == 'admin' and request.args.get('token', False) == 'xcfgtrfghyujhgfdrtyhbvcxvbh':
			return func(*args, **kw)
		else:
			return jsonify({"status":"failed", "error_code":"pm_admin", "info":"func: "+str(func.__name__)}), 404
	return wraped


@api.route('/api/v1/tutors', methods=['GET', 'POST'])
@union_bug
def api_tutors():
	if request.method == 'GET':
		page = int(request.args.get('page', 1))
		# sql转json真麻烦 -.-
		tutors = models.tutor.getTutorsByPage(page)
		tutors_list = []
		for tutor in tutors.items:
			tutor_dic = {"id":tutor.id, "name":tutor.name, "school":tutor.school, "skills":tutor.skills, "phone":tutor.phone, "email":tutor.email}
			tutors_list.append(tutor_dic)
		curr_args = {"page_num":tutors.page}
		r = {"status":"success", "tutors":tutors_list, "curr_args":curr_args, "max_page":tutors.pages}
		return jsonify(r)



@api.route('/api/v1/users', methods=['GET'])
@union_bug
def api_users():
	if request.method == 'GET':
		page = int(request.args.get('page', 1))
		# sql转json真麻烦 -.-
		users = models.stu.getStuByPage(page)
		users_list = []
		for user in users.items:
			user_dic = {"id":user.id, "name":user.name, "school":user.school, "gender":user.gender, "head":user.head}
			users_list.append(user_dic)
		curr_args = {"page_num":users.page}
		r = {"status":"success", "users":users_list, "curr_args":curr_args, "max_page":users.pages}
		return jsonify(r)


@app.route('/api/v1/user/login', methods=['PUT'])
@union_bug
@pm_admin
def admin_login_refresh():
	uid = request.args.get('uid', False)
	return jsonify({"status":"success", "uid":uid, "token":"xcfgtrfghyujhgfdrtyhbvcxvbh"})

# ===============================================================================================


@api.route('/api/v1/projects', methods=['GET'])
@union_bug
def get_pros():
	pros = models.project.getPros(int(request.args.get('page', 1)), int(request.args.get('size', 5)))
	if pros:
		return jsonify({"status":"success", "pros":pros["pros"], "max_page":pros["max_page"]})
	elif pros == []:
		return jsonify({"status":"failed", "error_msg":"no projects fond"}), 404
	else:
		return jsonify({"status":"failed", "error_msg":""}), 404


@api.route('/api/v1/projects', methods=['POST'])
@union_bug
@pm_admin
def add_pros():
	re = models.project.addPro(request.form)
	# re = models.project.addPro(request.form, request.files['thumbnail'])
	if re == 0:
		return jsonify({"status":"success"})
	else:
		return jsonify(re)


@api.route('/api/v1/projects/<proId>', methods=['GET'])
@union_bug
def get_pro_by_id(proId):
	the_pro = models.project.getPro(proId)
	if the_pro:
		return jsonify({"status":"success", "pro":the_pro})
	else:
		return jsonify({"status":"failed", "error_msg":"no_such_id"}), 404


@api.route('/api/v1/projects/<proId>', methods=['PUT', 'DELETE'])
@union_bug
@pm_admin
def edit_pro_by_id(proId):
	# return proId
	the_pro = models.project.getPro(proId)
	if the_pro:
		if request.method == 'DELETE':
			re = models.project.delPro(proId)
			if not re:
				return jsonify({"status":"success"})
			else: 
				return jsonify({"status":"failed", "error_msg":"delete_wrong"}), 404

		if request.method == 'PUT':
			re = models.project.updPro(request.form, proId)
			if re == 0:
				return jsonify({"status":"success"})
			else:
				return jsonify(re)

	else:
		return jsonify({"status":"failed", "error_msg":"no_such_id"}), 404



@api.route('/api/v1/projects/<proId>/news')
@union_bug
def get_news_by_id(proId):
	the_news= models.project.getNews(proId, int(request.args.get('page', 1)), int(request.args.get('size', 5)))
	if the_news:
		return jsonify({"status":"success", "news_list":the_news["news_list"], "max_page":the_news["max_page"]})
	elif the_news == []:
		return jsonify({"status":"failed", "error_msg":"no news or out of page"}), 404
	else:
		return jsonify({"status":"failed", "error_msg":""}), 404


@api.route('/api/v1/applications', methods=['GET'])
@union_bug
@pm_admin
def admin_applications():
	all_apl = models.application.getAllApplications()
	if all_apl is not False:
		return jsonify({"status":"success", "applications":all_apl, "max_page":1})
	else:
		return jsonify({"status":"failed", "error_msg":"all_apl null"}), 404


@api.route('/api/v1/user/login', methods=['POST'])
@union_bug
def admin_login():
	uid = request.form.get('uid', False)
	pwd = request.form.get('pwd', False)
	if uid == 'admin' and pwd == 'jjnbv':
		return jsonify({"status":"success", "uid":uid, "token":"xcfgtrfghyujhgfdrtyhbvcxvbh"})
	else:
		return jsonify({"status":"failed", "error_msg":"uid or token wrong"}), 404


@api.route('/api/v1/user/login', methods=['PUT'])
@union_bug
@pm_admin
def admin_login_refresh():
	uid = request.args.get('uid', False)
	return jsonify({"status":"success", "uid":uid, "token":"xcfgtrfghyujhgfdrtyhbvcxvbh"})


