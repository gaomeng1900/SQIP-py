
/**
 * helper ===================================================================
 */

/**
 * 设置cookie
 */
var getCookie, getsec, logined, logout, pro_bar_end, pro_bar_start, redirect, refresh_token, setCookie;

setCookie = function(name, value, time) {
  var exp, strsec;
  if (value === void 0) {
    console.warn('try to set cookie of ', value);
    return;
  }
  strsec = getsec(time);
  exp = new Date();
  exp.setTime(exp.getTime() + strsec * 1);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=server.com";
};


/**
 * 将时间单位转换为秒
 */

getsec = function(str) {
  var str1, str2;
  str1 = str.substring(1, str.length) * 1;
  str2 = str.substring(0, 1);
  if (str2 === "s") {
    return str1 * 1000;
  } else if (str2 === "h") {
    return str1 * 60 * 60 * 1000;
  } else if (str2 === "d") {
    return str1 * 24 * 60 * 60 * 1000;
  }
};


/**
 * 这是有设定过期时间的使用示例：
 * s20是代表20秒 
 * h是指小时，如12小时则是：h12 
 * d是天数，30天则：d30
 */


/**
 * 获取cookie
 */

getCookie = function(name) {
  var arr, reg;
  reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return 0;
  }
};

logined = function() {
  if ((getCookie('uid')) && (getCookie('token'))) {
    return true;
  } else {
    return false;
  }
};

logout = function() {
  console.log('logout ing !!!');
  setCookie('uid', 0, 's5');
  return redirect('/login.html');
};

redirect = function(url) {
  console.log("redirect : " + url);
  return top.location = url;
};


/**
 * 检查是否登陆，每次载入dashboard时运行
 */

refresh_token = function() {
  console.log('refreshing token...');
  console.log(logined());
  if (!logined()) {
    return redirect('/login.html');
  } else {
    return new Requests({
      url: _API_SERVER_ + 'api/v1/user/login',
      params: {
        uid: getCookie('uid'),
        token: getCookie('token')
      },
      withCredentials: true,
      load: function(args) {
        console.log(args);
        setCookie('uid', args.uid, 'd1');
        return setCookie('token', args.token, 'd1');
      },
      error: function(args) {
        console.log(args);
        return redirect('/login.html');
      }
    }).put();
  }
};

pro_bar_start = function() {
  return document.getElementById('gm-pro-bar').className = 'gm-start';
};

pro_bar_end = function() {
  document.getElementById('gm-pro-bar').className = 'gm-end';
  return setTimeout((function() {
    return document.getElementById('gm-pro-bar').className = 'gm-init';
  }), 500);
};

//# sourceMappingURL=data:application/json;base64,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LEVBQWlCLElBTEw7TUFNWixJQUFBLEVBQU0sU0FBQyxJQUFEO1FBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaO1FBQ0EsU0FBQSxDQUFVLEtBQVYsRUFBaUIsSUFBSSxDQUFDLEdBQXRCLEVBQTJCLElBQTNCO2VBQ0EsU0FBQSxDQUFVLE9BQVYsRUFBbUIsSUFBSSxDQUFDLEtBQXhCLEVBQStCLElBQS9CO01BSEssQ0FOTTtNQVVaLEtBQUEsRUFBTyxTQUFDLElBQUQ7UUFDTixPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7ZUFDQSxRQUFBLENBQVMsYUFBVDtNQUZNLENBVks7S0FBVCxDQWFELENBQUMsR0FiQSxDQUFBLEVBTEw7O0FBSGU7O0FBd0JoQixhQUFBLEdBQWdCLFNBQUE7U0FDZixRQUFRLENBQUMsY0FBVCxDQUF3QixZQUF4QixDQUFxQyxDQUFDLFNBQXRDLEdBQWtEO0FBRG5DOztBQUloQixXQUFBLEdBQWMsU0FBQTtFQUNiLFFBQVEsQ0FBQyxjQUFULENBQXdCLFlBQXhCLENBQXFDLENBQUMsU0FBdEMsR0FBa0Q7U0FDbEQsVUFBQSxDQUFXLENBQUMsU0FBQTtXQUFLLFFBQVEsQ0FBQyxjQUFULENBQXdCLFlBQXhCLENBQXFDLENBQUMsU0FBdEMsR0FBa0Q7RUFBdkQsQ0FBRCxDQUFYLEVBQStFLEdBQS9FO0FBRmEiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjIypcbiAqIGhlbHBlciA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIyNcblxuIyMjKlxuICog6K6+572uY29va2llXG4jIyNcbnNldENvb2tpZSA9IChuYW1lLHZhbHVlLHRpbWUpLT5cblx0aWYgdmFsdWUgPT0gdW5kZWZpbmVkXG5cdFx0Y29uc29sZS53YXJuICd0cnkgdG8gc2V0IGNvb2tpZSBvZiAnLCB2YWx1ZVxuXHRcdHJldHVyblxuXHRzdHJzZWMgPSBnZXRzZWModGltZSlcblx0ZXhwID0gbmV3IERhdGUoKVxuXHRleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgc3Ryc2VjKjEpXG5cdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIisgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9Lztkb21haW49c2VydmVyLmNvbVwiXG5cdHJldHVybiBcblxuXG4jIyMqXG4gKiDlsIbml7bpl7TljZXkvY3ovazmjaLkuLrnp5JcbiMjI1xuZ2V0c2VjPShzdHIpLT5cblx0c3RyMT1zdHIuc3Vic3RyaW5nKDEsc3RyLmxlbmd0aCkqMVxuXHRzdHIyPXN0ci5zdWJzdHJpbmcoMCwxKVxuXHRpZiBzdHIyPT1cInNcIlxuXHRcdHJldHVybiBzdHIxKjEwMDBcblx0ZWxzZSBpZiAoc3RyMj09XCJoXCIpXG5cdFx0cmV0dXJuIHN0cjEqNjAqNjAqMTAwMFxuXHRlbHNlIGlmIChzdHIyPT1cImRcIilcblx0XHRyZXR1cm4gc3RyMSoyNCo2MCo2MCoxMDAwXG4jIyMqXG4gKiDov5nmmK/mnInorr7lrprov4fmnJ/ml7bpl7TnmoTkvb/nlKjnpLrkvovvvJpcbiAqIHMyMOaYr+S7o+ihqDIw56eSIFxuICogaOaYr+aMh+Wwj+aXtu+8jOWmgjEy5bCP5pe25YiZ5piv77yaaDEyIFxuICogZOaYr+WkqeaVsO+8jDMw5aSp5YiZ77yaZDMwIFxuIyMjXG5cbiMjIypcbiAqIOiOt+WPlmNvb2tpZVxuIyMjXG5nZXRDb29raWU9KG5hbWUpIC0+XG5cdHJlZz1uZXcgUmVnRXhwKFwiKF58IClcIituYW1lK1wiPShbXjtdKikoO3wkKVwiKVxuXHRpZiBhcnI9ZG9jdW1lbnQuY29va2llLm1hdGNoKHJlZylcblx0XHRyZXR1cm4gdW5lc2NhcGUoYXJyWzJdKVxuXHRlbHNlIFxuXHRcdHJldHVybiAwXG5cblxubG9naW5lZCA9ICgpLT5cblx0aWYgKGdldENvb2tpZSAndWlkJykgYW5kIChnZXRDb29raWUgJ3Rva2VuJylcblx0XHRyZXR1cm4gdHJ1ZVxuXHRlbHNlXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxubG9nb3V0PSgpLT5cblx0Y29uc29sZS5sb2cgJ2xvZ291dCBpbmcgISEhJ1xuXHRzZXRDb29raWUgJ3VpZCcsIDAsICdzNSdcblx0cmVkaXJlY3QgJy9sb2dpbi5odG1sJ1xuXG5cbnJlZGlyZWN0PSAodXJsKS0+XG5cdGNvbnNvbGUubG9nKFwicmVkaXJlY3QgOiBcIiArIHVybClcblx0dG9wLmxvY2F0aW9uPXVybFxuXG4jIyMqXG4gKiDmo4Dmn6XmmK/lkKbnmbvpmYbvvIzmr4/mrKHovb3lhaVkYXNoYm9hcmTml7bov5DooYxcbiMjI1xucmVmcmVzaF90b2tlbiA9ICgpLT5cblx0Y29uc29sZS5sb2cgJ3JlZnJlc2hpbmcgdG9rZW4uLi4nXG5cdGNvbnNvbGUubG9nIGxvZ2luZWQoKVxuXHRpZiBub3QgbG9naW5lZCgpXG5cdFx0cmVkaXJlY3QgJy9sb2dpbi5odG1sJ1xuXG5cdGVsc2Vcblx0XHQjIOWIt+aWsHRva2Vu77yM6aG65L6/6aqM6K+BdG9rZW7mmK/lkKbmraPnoa5cblx0XHRuZXcgUmVxdWVzdHMoe1xuXHRcdFx0dXJsOiBfQVBJX1NFUlZFUl8gKyAnYXBpL3YxL3VzZXIvbG9naW4nXG5cdFx0XHRwYXJhbXM6XG5cdFx0XHRcdHVpZDogZ2V0Q29va2llICd1aWQnXG5cdFx0XHRcdHRva2VuOiBnZXRDb29raWUgJ3Rva2VuJ1xuXHRcdFx0d2l0aENyZWRlbnRpYWxzOiB0cnVlXG5cdFx0XHRsb2FkOiAoYXJncyktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyBhcmdzXG5cdFx0XHRcdHNldENvb2tpZSAndWlkJywgYXJncy51aWQsICdkMSdcblx0XHRcdFx0c2V0Q29va2llICd0b2tlbicsIGFyZ3MudG9rZW4sICdkMSdcblx0XHRcdGVycm9yOiAoYXJncyktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyBhcmdzXG5cdFx0XHRcdHJlZGlyZWN0ICcvbG9naW4uaHRtbCdcblx0XHRcdH0pLnB1dCgpXG5cblxucHJvX2Jhcl9zdGFydCA9ICgpLT5cblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dtLXByby1iYXInKS5jbGFzc05hbWUgPSAnZ20tc3RhcnQnXG5cblxucHJvX2Jhcl9lbmQgPSAoKS0+XG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnbS1wcm8tYmFyJykuY2xhc3NOYW1lID0gJ2dtLWVuZCdcblx0c2V0VGltZW91dCgoKCktPiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ20tcHJvLWJhcicpLmNsYXNzTmFtZSA9ICdnbS1pbml0JyksIDUwMClcbiJdfQ==
