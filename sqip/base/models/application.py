#!/usr/bin/python
# -*- coding: UTF-8 -*- 

from __init__ import *

import stu, tutor

class Application(db.Model):
	id              = db.Column(db.Integer, primary_key=True)
	pro_name        = db.Column(db.String(40), unique=False) # project name
	# pro_type        = db.Column(db.String(8), unique=False) # project type ()
	# date_start      = db.Column(db.DateTime,  unique=False) # project start time
	# date_end        = db.Column(db.DateTime, unique=False) # project end time
	# date_submit     = db.Column(db.DateTime, unique=False) # time when the application submited
	in_charge_id    = db.Column(db.String(15), unique=False) # the id(in stuff) of the one who is incharge of the project
	# team_member     = db.Column(db.PickleType, unique=False) # (id0, id1, id2, ...(in stuff))
	tutors_expected = db.Column(db.PickleType, unique=False) # (tutor1_id, tutor2_id, tutor3_id)
	tutor_id        = db.Column(db.String(5), unique=False) # the id(in tutor) of the fianl tutor
	# team_support    = db.Column(db.String(80), unique=False) #
	# expected_achi   = db.Column(db.String(400),unique=False) 
	# audiences       = db.Column(db.String(200), unique=False) 
	# popularize_plan = db.Column(db.String(25), unique=False)
	# budget          = db.Column(db.PickleType, unique=False) # {"material": double, "print": double, "activity", "cultivate": double, "subsidy": double, "other":double, "totle": double}
	submit_or		= db.Column(db.Boolean, unique=False)
	review_state    = db.Column(db.Integer, unique=False)

	def __init__(self, in_charge_id, pro_name="", tutors_expected="", tutor_id="", submit_or=False, review_state=0):
		self.in_charge_id    = in_charge_id
		self.pro_name        = pro_name
		self.tutors_expected = tutors_expected
		self.tutor_id        = tutor_id
		self.submit_or       = submit_or
		self.review_state    = review_state

	def __repr__(self):
		return '<Application %r %s %s %s %s %s %s> ' % (self.id, self.pro_name, self.in_charge_id, self.tutors_expected, self.tutor_id, self.submit_or, self.review_state)


def createApplication(yb_userid):
	apl = Application(in_charge_id=yb_userid)
	db.session.add(apl)
	db.session.commit()
	db.session.close()
	return 0

def getApplicationByID(id):
	thisApplication = Application.query.filter_by(id=id).first()
	db.session.close()
	return thisApplication

def getApplicationByStuID(in_charge_id):
	thisApplication = Application.query.filter_by(in_charge_id=in_charge_id).first()
	db.session.close()
	return thisApplication

def submitApplication(yb_id, form):
	thisApplication = Application.query.filter_by(in_charge_id=yb_id).first()
	thisApplication.pro_name        = safeProName(form["pro_name"])
	thisApplication.submit_or       = True
	thisApplication.review_state    = 1
	db.session.add(thisApplication)
	db.session.commit()
	db.session.close()
	return 0

def updateTutors(yb_id, tutors_to_save):
	thisApplication = Application.query.filter_by(in_charge_id=yb_id).first()
	thisApplication.tutors_expected = tutors_to_save
	db.session.add(thisApplication)
	db.session.commit()
	db.session.close()

def getAll():
	allApls = Application.query.all()
	db.session.close()
	return allApls

def cancelApplicationByStuID(yb_id):
	thisApplication = Application.query.filter_by(in_charge_id=yb_id).first()
	db.session.delete(thisApplication)
	db.session.commit()
	db.session.close()
	createApplication(yb_id)
	return 0

def reset():
	db.drop_all()
	db.create_all()
	return 0

def getAllApplications():
	apls = getAll()
	apl_info_s = []
	if apls:
		for apl in apls:
			if apl.submit_or is True:
				in_charge_stu_name = stu.getStuByYBID(apl.in_charge_id).name
				tutors_id_expected = apl.tutors_expected
				tutors_name_expected = []
				for tutor_id in tutors_id_expected:
					if tutor_id != "/":
						thisGuy = tutor.getTutorByID(tutor_id)
						if thisGuy != 2:
							tutor_name = thisGuy.name
						else:
							tutor_name = '导师信息已注销'
						tutors_name_expected.append(tutor_name)
				apl_info = {"id":apl.id, "pro_name":apl.pro_name , "in_charge_stu_name":in_charge_stu_name , "tutors_name_expected":tutors_name_expected ,"in_charge_id":apl.in_charge_id, }	
				apl_info_s.append(apl_info)
	# hahaha = what
	return apl_info_s