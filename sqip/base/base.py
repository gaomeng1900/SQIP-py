#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

from sqip.config import *
from sqip.libs import *
import controller

import sys, random

from flask import Blueprint, jsonify, g, request, redirect

from jinja2 import Environment, PackageLoader
# jinja2 自动转义扩展
def guess_autoescape(template_name):
	if template_name is None or '.' not in template_name:
		return False
	ext = template_name.rsplit('.', 1)[1]
	return ext in ('html', 'htm', 'xml')
# jinjia2 environment
env = Environment(autoescape=guess_autoescape, 
				  loader=PackageLoader('sqip.base', 'templates'), 
				  extensions=['jinja2.ext.autoescape']) 

def render(tamp_name, **kw):
	if kw.get("sep", True):
		if kw["appOrWeb"] == "web":
			template = env.get_template(tamp_name+'.html')
			return template.render(kw)
		else:
			template = env.get_template(tamp_name+'_app.html')
			return template.render(kw)
	else:
		template = env.get_template(tamp_name+'.html')
		return template.render(kw)



from flask.ext.login import LoginManager, login_required, login_user ,\
							logout_user, current_user, \
							AnonymousUserMixin, fresh_login_required
login_manager = LoginManager()
login_manager.login_view = '.login_page'
@login_manager.user_loader
def load_user(id):
	thisGuy  = controller.getStuByYBID(id)
	if thisGuy == 2:
		print "no user"
		return None
	return thisGuy
# this will have to run init_app in the end, cause there is no app here


base = Blueprint('base', __name__, 
				 template_folder='templates', 
				 static_folder='static')


def before_request():
	"""每个请求前更新全局变量中的当前用户
	"""
	g.user = current_user

base.before_request(before_request)


@base.route('/', methods=['GET', 'POST'])
@base.route('/m', methods=['GET', 'POST'])
@union_bug
def index():
	if request.method == 'GET':
		# oauth yiban
		verify_request = request.args.get('verify_request', False)
		if verify_request != False:
			report = controller.yb_oauth(verify_request)
			if report == 2:
				return redirect('/login?somethingWrong')
			elif report == '''oauth_state["visit_oauth"] == False''':
				return redirect('/login')
			else:
				# return report
				thisGuy = controller.getStuByYBID(report)
				login_user(thisGuy)
				# return ha
				return redirect('/panel?rand='+str(random.randint(0, 999)))
		# normal
		else:
			appOrWeb = request.args.get('appOrWeb', 'web')
			template = env.get_template('index.html')
			return template.render(user=g.user, 
								   next=request.url, 
								   whereami=0, 
								   appOrWeb=request.args.get('appOrWeb', 'web'))
			# if appOrWeb == "web":
			# 	return render("index", user=g.user, next=request.url, whereami=0, appOrWeb=request.args.get('appOrWeb', 'web'))
			# else:
			# 	return render("index", user=g.user, next=request.url, whereami=0, appOrWeb=request.args.get('appOrWeb', 'app'))

@base.route('/tutor', methods=['GET', 'POST'])
def tutor_page():
	if request.method == 'GET':
		submit_or = False
		if g.user.is_anonymous:
			tutors_chosen_js = "[]"
		else:
			tutors_chosen_python = controller.getTutorChosenByStuID(g.user.yb_id)
			# tutors_chosen_js = str(tutors_chosen_python)
			tutors_chosen_js = "["
			for tutor in tutors_chosen_python:
				tutors_chosen_js = tutors_chosen_js + "'" + tutor + "'" + ","
			tutors_chosen_js = tutors_chosen_js + "]"
			# haghbg
			submit_or = (controller.getApplicationByStuID(g.user.yb_id)).submit_or
		# just for diff body class!! dont do this again
		template = env.get_template('tutor.html')
		return template.render(user=g.user, 
							   next=request.url, 
							   whereami=1, 
							   appOrWeb=request.args.get('appOrWeb', 'web'), 
							   bodyClass="tutor_page", 
							   tutors_chosen_js=tutors_chosen_js, 
							   submit_or=submit_or)


@base.route('/tutor/save', methods=['POST', ])
@login_required
def tutor_save():
	if request.method == "POST":
		tutors_to_save = request.form.get("tutors_to_save", "")
		flag = controller.updateTutors(g.user.yb_id, tutors_to_save)
		if flag == 0:
			return redirect('/apply?appOrWeb=app&rand=' + str(random.randint(0, 9999)) )
		else :
			return "wrong"

@base.route('/tutor/index' , methods=['GET', 'POST'])
@union_bug
def tutor_index_api():
	if request.method == 'GET':
		tutors = controller.getTutorsByPage(1)
		template = env.get_template('tutor_list.html')
		return template.render(tutors=tutors, user=g.user, for_index=True)


@base.route('/tutor/p/<int:page>', methods=['GET', 'POST'])
def tutor_page_api(page):
	if request.method == 'GET':
		tutors = controller.getTutorsByPage(page)
		template = env.get_template('tutor_list.html')
		return template.render(tutors=tutors, user=g.user, )


@base.route('/tutor/detail/<id>', methods=['GET', 'POST'])
def tutor_detail_page(id):
	if request.method == 'GET':
		tutor_info = controller.getTutorByID(id);
		return render("tutor_detail", 
					  tutor_info=tutor_info, 
					  user=g.user, 
					  next=request.url, 
					  whereami=1, 
					  appOrWeb=request.args.get('appOrWeb', 'web'), 
					  bodyClass="tutor_page", 
					  sep=False)


@base.route('/apply', methods=['GET', 'POST'])
@login_required
def apply_page():
	# check if submited
	if controller.checkIfSubmited(g.user.yb_id):
		return redirect("/panel?rand=" + str(random.randint(0, 9999)) )
	if request.method == 'GET':
		tutorNames = controller.getTutorNames(g.user.yb_id)
		template = env.get_template('apply.html')
		appliable = controller.checkIfApliable()
		# return what
		return template.render(user=g.user, 
							   next=request.url, 
							   whereami=3, 
							   appOrWeb=request.args.get('appOrWeb', 'web'), 
							   bodyClass="apply_page", 
							   tutorNames=tutorNames,
							   appliable=appliable)
	if request.method == "POST":
		flag = controller.submitApplication(g.user.yb_id, request.form)
		attach = request.files['attach']
		attach.save(APPLICATION_FORDER + g.user.yb_id + "/" + g.user.yb_id + ".zip")
		if flag == 0:
			return redirect("/panel?rand=" + str(random.randint(0, 9999)) )
		else:
			return "something wrong"


@base.route('/apply/cancel', methods=['GET', 'POST'])
def cancelApply():
	report = controller.cancelApplicationByStuID(g.user.yb_id)
	if report == 0:
		return redirect("/")
	else:
		return '''<h3>很遗憾您的撤销操作失败，
					  可能是您的项目已经在审核或者服务器正在维护，
					  请联系18580521994为您人工解决</h3>'''


@base.route('/login', methods=['GET', 'POST'])
def login_page():
	if request.method == 'GET':
		return redirect('https://openapi.yiban.cn/oauth/authorize?client_id=3288d370af0a77c5&redirect_uri=http://f.yiban.cn/iapp7937&display=html')

@base.route('/panel', methods=['GET', 'POST'])
@login_required
def apply_user_panel():
	if request.method == 'GET':
		tutorNames = controller.getTutorNames(g.user.yb_id)
		application = controller.getApplicationByStuID(g.user.yb_id)
		template = env.get_template('panel_user.html')
		return template.render(user=g.user, 
							   application=application, 
							   next=request.url, 
							   whereami=3, 
							   appOrWeb=request.args.get('appOrWeb', 'web'), 
							   bodyClass="panel_user_page", 
							   bodyOnLoad="changeWebOrApp()", 
							   tutorNames=tutorNames)

@base.route('/logout', methods=['GET', 'POST'])
def logout():
	report = controller.revokeToken(g.user.yb_id)
	logout_user()
	return redirect("/")




@base.record_once
def on_load(state):
	"""蓝图插入之后，初始化flask-login
	
	Decorators:
		base.record_once
	
	Arguments:
		state
	"""
	login_manager.init_app(state.app)

