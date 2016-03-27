// python style
// 封装get，post，put
define( function () {


// 将一个url和一个参数对象合成新的url，保留现有url中的参数（如果有），覆盖、添加新的参数
// flask style
function url_for (url, params) {
	// clog("got : "+url + " " + params);
	params= typeof params !== 'undefined' ?  params : 0;
	url= typeof url !== 'undefined' ?  url : window.location.href;
	// clog("init: "+url + " " + params);

	params_new = getUrlParams(url);
	params_new.t = Math.random();

	if (params) {
		for (var key in params ){
			if (params[key] != 'undefined' && params[key] !== false && params[key] != null) {
				params_new[key] = params[key];
			};
		}
	};

	url = getUrlHostPath(url);

	for (var key in params_new ){
		if (params_new[key] != 'undefined') {
			url = url_para_addon(url, key, params_new[key] );
		};
	};

	// clog("end "+url );
	return url;
};
// url把参数完整解析为一个对象
function getUrlParams(url) {
  var params = {};

  url.toString().replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
	params[key] = decodeURI(value);
  });

  return params;
};

// 获取不带参数的完整地址
function getUrlHostPath(url) {
	var a = document.createElement('a');
	a.href = url;
	var pathname = (a.pathname[0]=="/") ? a.pathname : "/"+a.pathname; //万恶的IE呀
	return "http://" + a.hostname+pathname;
};
// 给url加参数，不考虑现有参数
function url_para_addon (url, k, v) {
	if (url.indexOf("=") == -1){
		url = url + "?";
		return url = url + k + "=" + v;
	}else{
		return url = url + "&" + k + "=" + v;
	};
};

	var requests = {
		get: function(url, params, auth, callback, cbc_args, redirect) {
			requests._get_delete(url, params, auth, callback, cbc_args, redirect, "get");
		},
		delete: function(url, params, auth, callback, cbc_args, redirect) {
			requests._get_delete(url, params, auth, callback, cbc_args, redirect, "delete");
		},
		_get_delete: function(url, params, auth, callback, cbc_args, redirect, method){
			// url：请求地址（可以带参数）
			// params：地址加上的参数
			// auth：0/1，是否需要身份验证，1：从cookie中读取uid和token加入params中
			// callback：完成之后的回调函数
			// cbc_args：留给回调函数的参数对象
			// redirect：0/1，是否跳转到登陆页，1：如果auth=1而且返回了用户登陆错误，则直接跳转到登陆页

			var auth= typeof auth !== 'undefined' ?  auth : 0;
			var callback= typeof callback !== 'undefined' ?  callback : 0;
			var cbc_args= typeof cbc_args !== 'undefined' ?  cbc_args : 0;
			var params= typeof params !== 'undefined' ?  params : 0;
			var redirect= typeof redirect !== 'undefined' ?  redirect : 0;
			var method= typeof method !== 'undefined' ?  method : "get";
			if (auth) {
				if (params) {
					params.uid = getCookie("uid"), params.token=getCookie("token"), params.t = Math.random();
				} else{
					params = {"uid":getCookie("uid"), "token":getCookie("token"), "t":Math.random()};
				};
			};


			var xmlhttp;
			if (window.XMLHttpRequest)
				{// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
			else
				{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				};

			var url = url_for(url, params);

			if (callback) {

				xmlhttp.open(method ,url ,true);
				xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				xmlhttp.send();
				xmlhttp.onreadystatechange=function(){
					if (xmlhttp.readyState==4){
						r = xmlhttp.responseText;
						try{
							r = JSON.parse(r);
						}catch(err){
							clog(r);
							return false;
						};

						if (redirect) {login_redirect (r);};

						if(callback && typeof(callback) === "function") {
							callback(r, cbc_args);
						}else{
							alert("callback_wrong");
						};
						// return r
					};
				};
			} else{
				xmlhttp.open(method ,url ,false);
				xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				xmlhttp.send();

				r = xmlhttp.responseText;

				try{
					r = JSON.parse(r);
				}catch(err){
					alert(r);
					return false;
				};

				if (redirect) {login_redirect (r);};

				return r
		
			};

		},
		post: function(url, params, form, callback, cbc_args){
			// url：请求地址（可以带参数）
			// params：地址加上的参数
			// form：表单对象
			// callback：完成之后的回调函数
			// cbc_args：留给回调函数的参数对象
			// POST必然会验证用户，并在验证失败后直接跳转到登陆页
			requests._put_post("POST", url, params, form, callback, cbc_args);
		
		},
		put: function(url, params, form, callback, cbc_args) {
			// url：请求地址（可以带参数）
			// params：地址加上的参数
			// form：表单对象
			// callback：完成之后的回调函数
			// cbc_args：留给回调函数的参数对象
			// PUT必然会验证用户，并在验证失败后直接跳转到登陆页
			requests._put_post("PUT", url, params, form, callback, cbc_args);
		},
		_put_post: function(method, url, params, form, callback, cbc_args){
			clog(url + " " + method);

			callback= typeof callback !== 'undefined' ?  callback : 0;
			cbc_args= typeof cbc_args !== 'undefined' ?  cbc_args : 0;
			params= typeof params !== 'undefined' ?  params : 0;

			if (params) {
				params.uid = getCookie("uid"), params.token=getCookie("token"), params.t = Math.random();
			} else{
				params = {"uid":getCookie("uid"), "token":getCookie("token"), "t":Math.random()};
			};

			var xmlhttp;
			if (window.XMLHttpRequest)
				{// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
			else
				{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				};

			url = url_for(url, params);

			var oMyForm = new FormData();

			// var form_data = "";

			for (var key in form ){
				if (form[key] != 'undefined' && form[key] !== false && form[key] != null) {
					// form_data = form_data + key + "=" + form[key] + "&";
					oMyForm.append(key, form[key]);
				};
			}

			if (callback) {

				xmlhttp.open(method ,url ,true);
				// xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				// xmlhttp.setRequestHeader("Content-type","application/form-data; charset=utf-8");
				xmlhttp.send(oMyForm);

				xmlhttp.onreadystatechange=function(){
					if (xmlhttp.readyState==4){
						r = xmlhttp.responseText;
						try{
							r = JSON.parse(r);
						}catch(err){
							clog(r + " " + err);
							return false;
						};

						var login_right = login_redirect (r);
						r.login_right = login_right;

						if(callback && typeof(callback) === "function") {
							callback(r, cbc_args);
						}else{
							alert("callback_wrong");
						};
						// return r
						return false;
					};
				};
			} else{
				clog("syn!!!!!!!!");
				xmlhttp.open(method ,url ,false);
				// xmlhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				// xmlhttp.setRequestHeader("Content-type","application/form-data; charset=utf-8");
				xmlhttp.send(oMyForm);

				r = xmlhttp.responseText;

				try{
					r = JSON.parse(r);
				}catch(err){
					clog(r);
					return false;
				};

				login_redirect (r);

				return r
		
			};
		},
	};

	return {
		get:requests.get
	};
})