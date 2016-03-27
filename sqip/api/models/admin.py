#!/usr/bin/python
# -*- coding: UTF-8 -*- 

from __init__ import *

class Admin(db.Model):
	adminname  = db.Column(db.String(80 ), primary_key=True)
	password   = db.Column(db.String(80 ), unique=False)
	permission = db.Column(db.Integer    , unique=False) # {3:superAdmin, 2:webAdmin 1:orgAdmin, 0:student}

	def __init__(self, adminname, password, permission=0):
		self.adminname  = adminname
		self.password   = password
		self.permission = permission

	# for flask-login
	def is_authenticated(self):
		return True

	def is_active(self):
		return True

	def is_anonymous(self):
		return False

	def get_id(self):
		return self.adminname

	def __repr__(self):
		return '<Admin %r>' % self.adminname

def addAdmin(kw):
	adminname = kw['adminname']
	if __adminnameUsed(adminname) == 1:
		return 2 #adminname used! #
	# check if info legal
	password = kw['password']
	if len(password) <=3 :
		return 3 # password too short
	# pack a admin
	admin = Admin(adminname, password)
	# add the admin
	db.session.add(admin)
	db.session.commit()
	db.session.close()
	return 0

def __adminnameUsed(adminname):
	someone = Admin.query.filter_by(adminname=adminname).first()
	db.session.close()
	if someone != None:
		return 1
	else:
		return 0

def getAdmin(adminname):
	thisGuy  = Admin.query.filter_by(adminname=adminname).first()
	db.session.close()
	if thisGuy == None:
		return 2
	else:
		return thisGuy

def checkAdmin(adminname, password):
	thisGuy = getAdmin(adminname)
	if thisGuy:
		if thisGuy.password == adminname:
			return 0
		else:
			return 1
	else:
		return 2