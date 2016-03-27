#!/usr/bin/env python
#-*-coding:utf-8-*-
# 
# @author Meng G.
# 2016-03-28 restructed


from sqip import app as application


if __name__ == '__main__':
	application.debug = True
	application.run(host="0.0.0.0")