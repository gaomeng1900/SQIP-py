#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

from flask import Flask
from base import base
from project import project
from api import api

app = Flask(__name__)

app.register_blueprint(base)
app.register_blueprint(project)
app.register_blueprint(api)


# others
def wrap_teardown_func(teardown_func):
	def log_teardown_error(*args, **kwargs):
		try:
			teardown_func(*args, **kwargs)
		except Exception as exc:
			app.logger.exception(exc)
	return log_teardown_error

if app.teardown_request_funcs:
	for bp, func_list in app.teardown_request_funcs.items():
		for i, func in enumerate(func_list):
			app.teardown_request_funcs[bp][i] = wrap_teardown_func(func)
if app.teardown_appcontext_funcs:
	for i, func in enumerate(app.teardown_appcontext_funcs):
		app.teardown_appcontext_funcs[i] = wrap_teardown_func(func)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


@app.errorhandler(404)
def page_not_found(error):
    return '''{"status":"failed", "error_code":"E404", "error_info":"wrong_url", "msg":"url不存在"}''', 404


@app.errorhandler(405)
def page_not_found(error):
    return '''{"status":"failed", "error_code":"E405", "error_info":"method_not_allowd"}''', 405


@app.errorhandler(403)
def page_not_found(error):
    return '''{"status":"failed", "error_code":"E403", "error_info":"forbidden", "msg":"服务器内部权限错误，请通知管理员该错误"}''', 403


if __name__ == '__main__':
	app.debug = True
	app.run(host="0.0.0.0")

