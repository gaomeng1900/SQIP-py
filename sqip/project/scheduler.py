#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

from sqip.config import *
from sqip.libs import *
import models

from threading import Timer, Thread
from time import sleep
import requests


class Scheduler(object):
	"""定时任务
		
	Variables:
		logging.debug("update_news ing") 
		pros 
		for pro in pros["pros"]: 
	"""
	def __init__(self, sleep_time, function):
		self.sleep_time = sleep_time
		self.function = function
		self._t = None

	def start(self):
		if self._t is None:
			self._t = Timer(self.sleep_time, self._run)
			self._t.start()
		else:
			raise Exception("this timer is already running")

	def _run(self):
		self.function()
		self._t = Timer(self.sleep_time, self._run)
		self._t.start()

	def stop(self):
		if self._t is not None:
			self._t.cancel()
			self._t = None


def update_news():
	"""更新news
	
	从projects数据库中拿出所有pro的news_src
	从易班暂未设置跨域的接口中抓该易班账号的轻博客文章列表
	覆盖更新新闻列表
	
	Raises:
		e -- [description]
	"""
	logging.debug("update_news ing")
	# get the pros (proId and news_src)
	pros = models.getPros(1, 50)
	for pro in pros["pros"]:
		# updateNews(proId, news_list)
		params = {"page":1, "size":100, "uid":pro["news_src"]}
		headers = {'content-type': 'application/json'}
		r = requests.get('http://www.yiban.cn/blog/blog/getBlogList', params=params, headers=headers)
		if r:
			news_list = r.json()["data"]["list"]
		else:
			news_list = []
		try:
			models.updateNews(pro["id"], news_list)
		except Exception, e:
			logging.exception(pro)
			raise e
		

# 构造一个定时任务用于更新news
news_updater = Scheduler(5, update_news)