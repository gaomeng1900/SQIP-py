#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

from sqip.config import *
from sqip.libs import *
from sqip.api import models
# import scheduler

from flask import Blueprint, g, request, redirect

from jinja2 import Environment, PackageLoader
# jinja2 自动转义扩展
def guess_autoescape(template_name):
	if template_name is None or '.' not in template_name:
		return False
	ext = template_name.rsplit('.', 1)[1]
	return ext in ('html', 'htm', 'xml')
# jinjia2 environment
env = Environment(autoescape = guess_autoescape, 
				  loader 	 = PackageLoader('sqip.base', 'templates'), 
				  extensions = ['jinja2.ext.autoescape']) 

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


from flask.ext.login import LoginManager, login_required, \
							login_user, logout_user, current_user, \
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


project = Blueprint('project', __name__, 
					template_folder = 'templates', 
					static_folder   = 'static')


@project.route('/projects')
@union_bug
def show_projects():
	if "Mobile" in request.headers.get('User-Agent'):
		appOrWeb = "app"
	else:
		appOrWeb = "web"

	template = env.get_template('projects.html')
	return template.render(whereami = 2, 
						   appOrWeb = appOrWeb, 
						   user     = g.user)


@project.route('/projects/<proId>')
@union_bug
def show_project(proId):
	if "Mobile" in request.headers.get('User-Agent'):
		appOrWeb = "app"
	else:
		appOrWeb = "web"

	the_pro = models.project.getPro(proId)
	if the_pro:
		template = env.get_template('projects.html')
		return template.render(whereami = 2, 
							   appOrWeb = appOrWeb, 
							   user     = g.user, 
							   the_pro  = json.dumps(the_pro))
	else:
		return redirect("/projects")


# 启更新news的定时任务
# droped, handly update instead
# scheduler.news_updater.start()


def before_request():
	"""每个请求前更新全局变量中的当前用户
	"""
	g.user = current_user

project.before_request(before_request)


@project.record_once
def on_load(state):
	"""蓝图插入之后，初始化flask-login
	
	Decorators:
		project.record_once
	
	Arguments:
		state
	"""
	login_manager.init_app(state.app)
