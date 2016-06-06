#!/usr/bin/python
# -*- coding: UTF-8 -*- 

from __init__ import *

# alter table tutor add column head char(11) DEFAULT NULL;

class Tutor(db.Model):
	id     = db.Column(db.String(5), primary_key=True)
	name   = db.Column(db.String(15),unique=False)
	school = db.Column(db.String(20), unique=False)
	post   = db.Column(db.String(20), unique=False)
	skills = db.Column(db.String(20), unique=False) 
	phone  = db.Column(db.String(14), unique=False) 
	email  = db.Column(db.String(25), unique=False) 
	detail = db.Column(db.String(500), unique=False) 
	head   = db.Column(db.String(200), unique=False) 

	def __init__(self, id, name, school, post, skills, phone, email, detail, head):
		self.id      = id
		self.name    = name
		self.school  = school
		self.post    = post
		self. skills = skills
		self.phone   = phone
		self.email   = email
		self.detail  = detail
		self.head    = head

	def __repr__(self):
		return '<Turor %r %s> ' % (self.id, self.name)


def addTutor(kw):
	#make a id
	while True:
		id = randNumberString(3);
		if getTutorByID(id) == 2:
			break

	name      = kw.get("name", "")
	school    = kw.get("school", "")
	post      = kw.get("post", "")
	skills    = kw.get("skills", "")
	phone     = kw.get("phone", "")
	email     = kw.get("email", "")
	olddetail = kw.get("detail", "")
	detail    = olddetail.replace('\n', '<br>')
	head      = kw.get("head", DEFAULT_USER_HEAD)

	tutor = Tutor(id, name, school, post, skills, phone, email, detail, head)
	# add the User
	db.session.add(tutor)
	db.session.commit()
	db.session.close()

	# default head
	# if kw.get("img", False)==False:
	# 	shutil.copy(DEFAULT_USER_HEAD, TUTOR_HEAD_FORDER + id + '.jpg')
	# else:
	# 	tempIMG = kw.get("img")
	# 	shutil.move(tempIMG, TUTOR_HEAD_FORDER + id + '.jpg')

	return 0

def deleteTutor(id):
	thisGuy  = Tutor.query.filter_by(id=id).first()
	if thisGuy:
		db.session.delete(thisGuy)
		db.session.commit()
		db.session.close()

def getTutorByID(id):
	thisGuy  = Tutor.query.filter_by(id=id).first()
	db.session.close()
	if thisGuy == None:
		return 2
	else:
		return thisGuy

def updateTutor(id, form):
	thisTutor        = Tutor.query.filter_by(id=id).first()
	thisTutor.name   = form.get("name", "")
	thisTutor.school = form.get("school", "")
	thisTutor.post   = form.get("post", "")
	thisTutor.skills = form.get("skills", "")
	thisTutor.phone  = form.get("phone", "")
	thisTutor.email  = form.get("email", "")
	olddetail        = form.get("detail", "")
	thisTutor.detail = olddetail.replace('\n', '<br>')
	thisTutor.head   = form.get("head", DEFAULT_USER_HEAD)
	# thisTutor.update(form)
	db.session.add(thisTutor)
	db.session.commit()
	db.session.close()


@union_bug_logger
def getTutorsByPage(page):
	tutorPage = Tutor.query.order_by(Tutor.id).paginate(page, TUTOR_PER_PAGE, False)
	db.session.close()
	return tutorPage

def reset():
	db.drop_all()
	db.create_all()
	return 0
