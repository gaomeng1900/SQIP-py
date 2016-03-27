candidate = new Array();

Array.prototype.indexOf = function(val) {              
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) return i;  
    }  
    return -1;  
};  
Array.prototype.remove = function(val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
}; 
Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

var page = 1;
var max_page = 4;

// ====================================================================================================



function refreshState(argu){
	console.info("==============refreshState==============", candidate);
	startLoad(); var sleeptime=100;
	argu=argu || new Object();
	//frame (visibility and url) 
	if (argu.visi != null) {
		iframe=document.getElementById("iframe");
		iframe.className=(argu.visi==1)? "visible": "hidden";
		if (argu.visi==0) {sleeptime=sleeptime-100};
	};
	if (argu.tutor_id != null) {
		if (appOrWeb == "web"){url="/tutor/detail/"+argu.tutor_id;};
		if (appOrWeb == "app"){url="/tutor/detail/"+argu.tutor_id+"?appOrWeb=app";};

		iframe=document.getElementsByTagName("iframe")[0];
		iframe.setAttribute("src",url);
		sleeptime=sleeptime+100;
	};
	//choose buttom (tutor_id and class)
	if (argu.tutor_id!=null) {
		buttom=document.getElementById("detailCheckBox");
		if (candidate.contains(argu.tutor_id)) {
			buttom.setAttribute("onclick", "unchooseTutor('" + argu.tutor_id + "');");
			buttom.className="chosen";
		}else{
			buttom.setAttribute("onclick", "chooseTutor('" + argu.tutor_id + "');");
			buttom.className="unchosen";
		};
	};
	//tutor visual state
	var tutor_card_block = document.getElementById('tutor_card_block');
	var childs = tutor_card_block.childNodes;
	for(var i = childs.length - 3; i >= 0; i=i-2) {  
		console.info(childs);    
		console.info(i, childs[i]);    
		name = childs[i].getAttribute("name");
		// console.info(name);
		// console.info(candidate);
		// if (name) {
			if (candidate.contains(name)) {
				childs[i].className = "chosen"
				// console.info(childs[i]);
			}else{
				childs[i].className = "unchosen"
			};
		// };

	};
	// write into form
	var form = document.getElementsByTagName("form")[0];
	form.innerHTML="<input type='text' class='hidden' name='tutors_to_save' value=" + candidate + " /><input type='submit' class='am-btn am-btn-success tutor_submit_btn' form='tutor_candidate' value='提交导师候选人' ></input>";
	// set the page
	var page_nav_inner = '<li class="am-disabled"><a href="javascript:void(0);" onclick="prevPage();">&laquo;</a></li>';
	for (var i = 1; i <= max_page; i++) {
		page_nav_inner = page_nav_inner + '<li><a href="javascript:void(0);" onclick="pageTo('+i+')">'+i+'</a></li>';
	};
	page_nav_inner = page_nav_inner + '<li><a href="javascript:void(0);" onclick="nextPage();">&raquo;</a></li>';
	document.getElementById("page_nav").innerHTML=page_nav_inner;
	page_nav = document.getElementById("page_nav").getElementsByTagName("li");
	console.info(page_nav, page);
	page_nav[page].className="am-active";
	if (page==1) {page_nav[0].className="am-disabled"} else {page_nav[0].className=""};
	if (page==max_page) {page_nav[max_page+1].className="am-disabled"};

	setTimeout("stopLoad();",sleeptime); 
	
};

function showDetail(tutor_id){
	if (whereami != 1) { 
		if (appOrWeb == "app") {window.location.href="/tutor?tutor_id="+tutor_id;}
		else {window.location.href="/tutor?tutor_id="+tutor_id;};  
	};
	var argu = new Object() ;
	argu.visi=1;
	argu.tutor_id= tutor_id;
	refreshState(argu);
	noScroll(1);
};

function closeDetail(){
	noScroll(0);
	var argu = new Object() ;
	argu.visi=0;
	refreshState(argu);
};

function chooseTutor (tutor_id) {
	// alert("选择导师的时间未到哦，请先浏览导师信息")
	if (candidate.length >= 3) {
		if (candidate[0] != "/"){
			alert("您已经选择三位导师！");
			return;
		};
	};
	if (candidate.length >= 4) {
		alert("您已经选择三位导师！");
		return;
	};
	console.info("chooseTutor");
	var argu = new Object() ;
	argu.tutor_id=tutor_id;
	// argu.visi=0;
	candidate.push(tutor_id);
	refreshState(argu);
	setTimeout("closeDetail();",200);	
};

function unchooseTutor(tutor_id) {
	// alert("选择导师的时间未到哦，请先浏览导师信息")
	console.info("unchooseTutor");
	var argu = new Object() ;
	argu.tutor_id=tutor_id;
	// argu.visi=0;
	candidate.remove(tutor_id);
	refreshState(argu);
	setTimeout("closeDetail();",200);	
};

function nextPage () {
	if (page < max_page) {
		page=page+1;
		pageTo(page);
	};

};

function prevPage () {
	if (page > 1) {
		page=page-1;
		pageTo(page);
	};

};

function pageTo(new_page){
	page=new_page;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		document.getElementById("tutor_card_block").innerHTML=xmlhttp.responseText;
		console.info("xmlhttp done");
		refreshState();	
		};
	};
	if (whereami == 0){
		console.log("/tutor/index")
		xmlhttp.open("GET","/tutor/index", true);
	}
	else{
		console.log("/tutor/p")
		xmlhttp.open("GET","/tutor/p/"+page,true);
	}
	xmlhttp.send();
	//ajax


};

function startLoad(){
	loading=document.getElementById("loading");
	// console.info(loading);
	loading.className="visible";
}
function stopLoad(){
	loading=document.getElementById("loading");
	loading.className="hidden";
}

function noScroll(flag){
	if (flag==1) {document.getElementsByTagName("body")[0].style.overflow="hidden";
	} else{
		document.getElementsByTagName("body")[0].style.overflow="";
	};
}




// class Argu{
// 	constructor(visi, tutor_id) {
// 		this.visi = visi || null;
// 		this.tutor_id = tutor_id || null;
// 	}
// };

// function showDetail(tutor_id){  //load the detail iframe
//   console.info("showDetail");
// 	state=checkChooseState(tutor_id);
// 	setChooseButtomState(state);
// 	setChooseButtom(tutor_id);
// 	url="./tutors/"+tutor_id+".html";
// 	setURL(url);
// 	setFrameVisi(1);
// 	noScroll(1);
// };


// function closeDetail(){
//   console.info("closeDetail");
// 	setFrameVisi(0);
// 	noScroll(0);
// };



// function chooseTutor(tutor_id){
//   console.info("chooseTutor");
// 	state=checkChooseState(tutor_id);
// 	tutor=document.getElementById("check_"+tutor_id);
// 	if (state==1) {
// 		setChooseState(tutor_id, "unchosen");
// 		setChooseButtomState("unchosen");
// 		setChooseVisuState(tutor_id, "unchosen");
// 	} else if (state==2) {
// 		setChooseState(tutor_id, "chosen");
// 		setChooseButtomState("chosen");
// 		setChooseVisuState(tutor_id, "chosen");
// 	} else if (state==3) {
// 		alert("选择导师数已达到上限！");
// 	} else{
// 		alert("error: no such tutor!");
// 	};
// };


// function checkChooseState(tutor_id){
//   console.info("checkChooseState "+tutor_id);
// 	tutor=document.getElementsByName(tutor_id)[0];
// 	console.info(tutor);
// 	if (tutor!=undefined) {
// 		if (tutor.className=="chosen"){return 1;}
// 		else if (candidate.length>=3){return 3;}
// 		else if (tutor.className=="unchosen"){return 2;};
// 	} else{return 4};
// };


// function setChooseState(tutor_id, state){
//   console.info("setChooseState "+ tutor_id);
//   if (state=="chosen") {
//   	candidate.push(tutor_id);
//   } else {
//   	candidate.remove(tutor_id);
//   };
// };


// function setChooseButtomState(state){
//   console.info("setChooseButtomState");
// 	detailCheckBox=document.getElementById("detailCheckBox");
// 	detailCheckBox.className=state;
// };


// function setChooseVisuState(tutor_id, state){
//   console.info("setChooseVisuState "+ tutor_id);
// 	chechboxInList=document.getElementsByName(tutor_id)[0];
// 	chechboxInList.className=state;
// };

// function setURL(url){
//   console.info("setURL "+ url);
// 	iframe=document.getElementsByTagName("iframe")[0];
// 	iframe.setAttribute("src",url);
// };


// function setFrameVisi(visibility){
//   console.info("setFrameVisi "+ visibility);
// 	iframe=document.getElementById("iframe");
// 	visibility = (visibility==1)? "visible": "hidden";
// 	iframe.className=visibility;
// };


// function setChooseButtom(tutor_id){
//   console.info("setChooseButtom "+ tutor_id);
// 	buttom=document.getElementById("detailCheckBox");
// 	buttom.setAttribute("onclick", "chooseTutor('" + tutor_id + "');");
// };
