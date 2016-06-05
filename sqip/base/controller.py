#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed

from sqip.config import *
from sqip.libs import *

from sqip.base.models import admin, application, stu, tutor
from sqip.api.models import meta

import socket, json, httplib, sys
from PIL import Image


def yb_oauth(verify_request):
	oauth_state = decrypt(verify_request)
	if oauth_state["visit_oauth"] != False:
		user_id = oauth_state["visit_user"]["userid"]
		access_token = oauth_state["visit_oauth"]["access_token"]
		url = "/user/other?yb_userid="+user_id+"&access_token="+access_token
		httpClient = None
		try:
			httpClient = httplib.HTTPConnection('openapi.yiban.cn', 80, timeout=30)
			httpClient.request('GET', url)
			response = httpClient.getresponse()
			html = "".join([ str(response.read()).strip().rsplit("}" , 1)[0] ,  "}"] )
			user_info = json.loads(html)
		except Exception, e:
			return "what!!!!!"
		finally:
			if httpClient:
				httpClient.close()
			if user_info["info"]["yb_userid"]:
				report = stu.updateStu(user_info, access_token)
				if report == 0:
					# thisguy = getStuByID(user_info["info"]["yb_userid"])
					# return thisguy
					return user_info["info"]["yb_userid"]
				if report == 2:
					return 2
			else: 
				return 2
	else:
		return '''oauth_state["visit_oauth"] == False'''


# def updateApplicationAll(form, AppliNumber, user):
# 	# update the apply form if exits, create if not
# 	# return 0 if updated; 1 if created; 2 if wrong
# 	pass


def revokeToken(yb_id):
	thisguy = getStuByYBID(yb_id)
	if thisguy != 2:
		access_token = thisguy.access_token
		import urllib2, urllib
		data = {'client_id' : '3288d370af0a77c5', 'access_token' : access_token}
		report = urllib2.urlopen(url='https://openapi.yiban.cn/oauth/revoke_token', data=urllib.urlencode(data))
		report = report.read()


def addTutor(head, form):
	if head :
		im = Image.open(head)
		width, hight = im.getbbox()[2], im.getbbox()[3]
		if width > MAX_WIDTH_TUTOR_HEAD:
			im = im.resize((MAX_WIDTH_TUTOR_HEAD, hight * MAX_WIDTH_TUTOR_HEAD / width), Image.ANTIALIAS)
		im = im.convert('RGB')
		head = IMG_TEMP_PATH + randNumberString(36) + ".jpg"
		im.save(head)
	else:
		head = False
	# form = dict(form, **{"img": head, })
	form = {'name':form.get('name',''), 'school':form.get('school',''), 'post':form.get('post',''), 'skills':form.get('skills',''), 'phone':form.get('phone',''), 'email':form.get('email',''), 'detail':form.get('detail',''), 'img':head, }
	if tutor.addTutor(form) == 0 :
		return 0


def getStuByPage(page):
	return stu.getStuByPage(page)

def getStuByYBID(yb_id):
	return stu.getStuByYBID(yb_id)

@union_bug_logger
def getTutorsByPage(page):
	return tutor.getTutorsByPage(page)

def getTutorNames(yb_id):
	application = getApplicationByStuID(yb_id)
	tutors_expected = application.tutors_expected
	if (tutors_expected == "") or (tutors_expected[0] == "") or ( (tutors_expected[0] == "/") and (len(tutors_expected) == 1) ) :
		# return what
		return "未选择"
	else:
		tutor_names = ""
		for tutor_id in tutors_expected:
			if tutor_id != "/":
				tutor_names = tutor_names + getTutorByID(tutor_id).name + ", "
		return tutor_names

def getTutorChosenByStuID(yb_id):
	application = getApplicationByStuID(yb_id)
	return application.tutors_expected

def getTutorByID(id):
	return tutor.getTutorByID(id)

def checkAdmin(adminname, password):
	return admin.checkAdmin(adminname, password)

def updateTutors(yb_id, tutors_to_save):
	#unpack tutors ids
	# tutors_to_save = "(" + tutors_to_save + ")"
	# tutors_to_save = list(eval("tutors_to_save"))
	tutors_to_save = tutors_to_save.split(',')
	#update to database
	application.updateTutors(yb_id, tutors_to_save)
	return 0
	# pass


def getApplicationByStuID(yb_id):
	return application.getApplicationByStuID(yb_id)

def submitApplication(yb_id, form):
	# update the form
	return application.submitApplication(yb_id, form)

def checkIfSubmited(yb_id):
	apl = getApplicationByStuID(yb_id)
	if not apl.submit_or:
		return False
	else:
		return True

def cancelApplicationByStuID(yb_id):
	return application.cancelApplicationByStuID(yb_id)


def getAllApplications():
	apls = application.getAll()
	apl_info_s = []
	if apls:
		for apl in apls:
			if apl.submit_or is True:
				in_charge_stu_name = stu.getStuByYBID(apl.in_charge_id).name
				tutors_id_expected = apl.tutors_expected
				tutors_name_expected = []
				for tutor_id in tutors_id_expected:
					if tutor_id != "/":
						tutor_name = tutor.getTutorByID(tutor_id).name
						tutors_name_expected.append(tutor_name)
				apl_info = {"id":apl.id, "pro_name":apl.pro_name , "in_charge_stu_name":in_charge_stu_name , "tutors_name_expected":tutors_name_expected ,"in_charge_id":apl.in_charge_id, }	
				apl_info_s.append(apl_info)
	# hahaha = what
	return apl_info_s


def checkIfApliable():
	return (meta.getAppliable() == "1" or meta.getAppliable() == 1)