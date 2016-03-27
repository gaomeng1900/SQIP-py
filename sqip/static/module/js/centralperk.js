var sofa = {};


var perk = {

	init: function(){
		var p = {};
		p.guid = ran8();
		p.linkto = perk.linkto;
		p.linkto_ = perk.linkto_;
		p.store = perk.store;
		p.go = perk.go;
		p.get = perk.get;
		p.post = perk.post;
		p.put = perk.put;
		p.delete = perk.delete;
		return p;
	},


	link: function(ross, rachel, coffee){ 
		clog("- linking " + ross + " -> " + rachel);
		coffee= typeof coffee !== 'undefined' ? coffee : {};
		if (!sofa[ross]) {sofa[ross] = {"value":coffee, "on":""};};
		if ( sofa[ross].on.indexOf( rachel + "(") < 0 ) {sofa[ross].on += rachel + "(sofa." + ross + ".value);";};
	},

	linkto: function(rachel){
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		perk.link(ross, rachel);
	},

	linkto_: function(){
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		var rachel = getFunctionName(arguments.callee.caller) + "_";
		perk.link(ross, rachel);
	},


	_store: function (ross, coffee) {
		clog("- _storeing " + ross);
		if (sofa[ross]) {
			for (var tem in coffee) {
				if (sofa[ross].value[tem]) {clog("!!! perk coffee conflict")};
				sofa[ross].value[tem] = coffee[tem];
			};
		};
	},

	store: function(coffee) {
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		perk._store(ross, coffee);
	},


	pass: function(ross, coffee) {
		clog("- passing " + ross);
		coffee= typeof coffee !== 'undefined' ?  coffee : {};
		if (sofa[ross]) {
			for (var tem in coffee) {
				sofa[ross].value[tem] = coffee[tem];
			};
			if (!sofa[ross]) {
				clog("perk not linked !!!!");
				return false;
			};
			if (sofa[ross].on) {
				Function(sofa[ross].on)();
				return true;
			} else {
				clog("perk passed but no function to run !!!!");
				return false;
			};
		};
	},

	go: function(coffee){
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		perk.pass(ross, coffee);
	},


	_mailbox: function (r, cbc_args) {
		clog("- got mail, passing");
		perk.pass(cbc_args.ross, r);
	},

	get: function (url, params, auth, or_redirect) {
		clog("- sending mail(get)");
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		or_redirect= typeof or_redirect !== 'undefined' ?  or_redirect : 0;
		requests.get(url, params, auth, perk._mailbox, {"ross":ross}, or_redirect);
	},

	delete: function (url, params, auth, or_redirect) {
		clog("- sending mail(delete)");
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		or_redirect= typeof or_redirect !== 'undefined' ?  or_redirect : 0;
		requests.delete(url, params, auth, perk._mailbox, {"ross":ross}, or_redirect);
	},

	post: function (url, params, form) {
		clog("- sending mail(post)");
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		requests.post(url, params, form, perk._mailbox, {"ross":ross});
	},

	put: function (url, params, form) {
		clog("- sending mail(put)");
		var ross = getFunctionName(arguments.callee.caller) + (this.guid ? "__" + this.guid : "");
		requests.put(url, params, form, perk._mailbox, {"ross":ross});
	}
};