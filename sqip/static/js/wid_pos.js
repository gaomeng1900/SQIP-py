if (window.innerWidth)
	winWidth = window.innerWidth;
else if ((document.body) && (document.body.clientWidth))
	winWidth = document.body.clientWidth;

if (winWidth >= 800)
	appOrWebToGo = "web"
else
	appOrWebToGo = "app"

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

appOrWebNow = GetQueryString("appOrWeb");
if (appOrWebNow == null)
	appOrWebNow = "web"

tutor_id = GetQueryString("tutor_id");
if (tutor_id == null)
	tutor_id = ""

if (appOrWebNow != appOrWebToGo){
	url = window.location.pathname;
	href= window.location.href;
	window.location.href=url+"?appOrWeb="+appOrWebToGo+"&tutor_id="+tutor_id;
}
 


