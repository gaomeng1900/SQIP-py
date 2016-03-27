#!/usr/bin/python
# -*- coding: UTF-8 -*- 

from __init__ import *
import os
import application

class Stu(db.Model):
	id     = db.Column(db.Integer, primary_key=True)
	yb_id  = db.Column(db.String(15), primary_key=True)
	access_token = db.Column(db.String(40), unique=False) 
	name   = db.Column(db.String(15), unique=False)
	gender = db.Column(db.String(5),  unique=False)
	school = db.Column(db.String(20), unique=False)
	head   = db.Column(db.String(80), unique=False)
	phone  = db.Column(db.String(14), unique=False) 
	email  = db.Column(db.String(25), unique=False)
	detail = db.Column(db.String(500),unique=False) 

	def __init__(self, yb_id, access_token, name, gender, school, head, phone="", email="", detail=""):
		self.yb_id        = yb_id
		self.access_token = access_token
		self.name         = name
		self.gender       = gender
		self.school       = school
		self.head         = head
		self.phone        = phone
		self.email        = email
		self.detail       = detail

	def __repr__(self):
		return '<Stu %r %s> ' % (self.yb_id, self.name)

	# for flask-login
	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False
	
	is_anonymous=False

	def get_id(self):
		return self.yb_id


def getStuByYBID(yb_id):
	thisGuy  = Stu.query.filter_by(yb_id=yb_id).first()
	db.session.close()
	if thisGuy == None:
		return 2
	else:
		return thisGuy

def addStu(stu_info, access_token):
	# check if exist
	thisGuy  = Stu.query.filter_by(yb_id=stu_info["info"]["yb_userid"]).first()
	# new stu!
	if thisGuy == None:
		stu = Stu(stu_info["info"]["yb_userid"], access_token, stu_info["info"]["yb_username"], stu_info["info"]["yb_sex"], stu_info["info"]["yb_schoolname"], stu_info["info"]["yb_userhead"])
		# add the User
		db.session.add(stu)
		db.session.commit()
		db.session.close()
		application.createApplication(stu_info["info"]["yb_userid"])
		# create a forder
		if not os.path.exists(APPLICATION_FORDER + stu_info["info"]["yb_userid"]):
			os.makedirs(APPLICATION_FORDER + stu_info["info"]["yb_userid"] + "/")
			return 0
	# exited stu!
	else:
		db.session.close()
		return 0

def updateStu(user_info, access_token):
	thisGuy = Stu.query.filter_by(yb_id=user_info["info"]["yb_userid"]).first()
	if thisGuy == None:
		db.session.close()
		addStu(user_info, access_token)
		return 0
	else:
		thisGuy.access_token = access_token
		thisGuy.name         = user_info["info"]["yb_username"]
		thisGuy.gender       = user_info["info"]["yb_sex"]
		thisGuy.school       = user_info["info"]["yb_schoolname"]
		thisGuy.head         = user_info["info"]["yb_userhead"]
		db.session.add(thisGuy)
		db.session.commit()
		db.session.close()
		return 0

def getStuByPage(page):
	stuPage = Stu.query.order_by(Stu.id).paginate(page, STU_PER_PAGE, False)
	db.session.close()
	return stuPage

def reset():
	db.drop_all()
	db.create_all()
	return 0