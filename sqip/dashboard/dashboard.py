#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed


from sqip.config import *
from sqip.libs import *


dashboard = Blueprint('dashboard', __name__, template_folder='templates')


@base.route('/admin/login' , methods=['GET'])
@union_bug
def admin_login():
	template = env.get_template('login.html')
	return template.render()


@base.route('/admin' , methods=['GET'])
@base.route('/admin/<oath:path>' , methods=['GET'])
@union_bug
def admin():
	template = env.get_template('index.html')
	return template.render()