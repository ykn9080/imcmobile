function selchg(){
	switch($('#selectLogout').val()){
		case "logout":
			navigator.app.loadUrl("file:///android_asset/www/index.html");
			localStorage.removeItem('login');
			break;
		case "exit":
			navigator.app.loadUrl("file:///android_asset/www/index.html");
			break;
		default:
			$(".selectLogout" ).popup( "close" );
			break;
	   } 
}
function savelocal(key,value){
	  if (typeof(localStorage) == 'undefined' ) {
	  alert('localStorage not available !');
	} 
	else {
		try {
			localStorage.setItem(key, value); 
		} 
		catch (e) {
			 if (e == QUOTA_EXCEEDED_ERR) {
			   alert('Exceed capacity!'); 
			}
		}
	}
}
function showHidden(div)
{

    var div1 = document.getElementById(div)
    if (div1.style.display == 'none'){div1.style.display = 'block'} 
    else {div1.style.display = 'none'}
}
function idMake(){
	var d = new Date();	
	var yr=d.getFullYear().toString().substr(2, 2)
	var month = d.getMonth()+1;
	var day = d.getDate();
	var hr = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
	var id= yr + 
	    ((''+month).length<2 ? '0' : '') + month +
	    ((''+day).length<2 ? '0' : '') + day+
	    hr+min+sec;
    return id;
}
function makeDateTime(d){	
	var yr=d.getFullYear();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var hr = d.getHours();
	var min = d.getMinutes();
	var dt= yr + "-"+
	    ((''+month).length<2 ? '0' : '') + month +"-"+
	    ((''+day).length<2 ? '0' : '') + day+" "+
	    ((''+hr).length<2 ? '0' : '') + hr +":"+
	    ((''+min).length<2 ? '0' : '') +min;
    return dt;
}
function spage(pagename){
	var new1=[];
	var spnew={};
	var spage=JSON.parse(localStorage.getItem("spage"));
		for(i in spage){
			if(spage[i].name==pagename){
				window.location.hash = spage[i].pos;
    			$.mobile.initializePage();
			}
			else{
				spnew={};
				spnew.name=spage[i].name;
				spnew.pos=spage[i].pos;
				new1.push(spnew);
			}
		}
		localStorage.removeItem("spage");
	localStorage.setItem("spage",JSON.stringify(new1));//splice가 하도 안돼서
}
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function makeDate(now,seperator){
	var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear()+seperator+(month)+seperator+(day) ;
}
function makeYr(now,add){
    return now.getFullYear()+add;
}
function populate(id,content,code,name,selcode){
	var selected="";
	$(id).empty();
	var newOptions='<option value="">-- Select --</option>';
	for (i in content){
		if(selcode==content[i][code]) selected="selected";
        newOptions += '<option '+selected+' value="'+content[i][code] + '">' + content[i][name] + '</option>';
        selected="";
    }
    $(id).append(newOptions);
   if ( typeof $( id ).selectmenu() !== "undefined" ) {
		$( id ).selectmenu( "refresh",true );
  	}
  	//$(id).selectmenu('refresh');
    //$(id).attr("selectedIndex", -1)
}

function populateRtn(content,code,name,selcode){
	var sel=document.createElement("select");
	//sel.setAttribute("data-native-menu","false");
	sel.setAttribute("style"," font-size:14px;height:40px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;padding-left: 15px;");
	var selected="";
	var newOptions='<option value="">-- Select --</option>';
	for (i in content){
		if(selcode==content[i][code]) selected="selected='selected'";
        newOptions += '<option '+selected+' value="'+content[i][code] + '">' + content[i][name] + '</option>';
        selected="";
    }
    sel.innerHTML=newOptions;
    return sel;
}
//
//list:comma&semicolon based list (ex:code,name;)
//populatePure("#selSize","10,10px;12,12px;14,14px;18,18px;20,20px;24,24px",fontsize);
function populatePure(id,list,selcode,firstline)
{
	var selected="";
	$(id).empty();
	var newOptions='<option value="">-- Select --</option>';
	if(firstline!="" )newOptions='<option value="">'+firstline+'</option>';
	var lt=list.split(';');
	for (i in lt){
		var lts=lt[i].split(',');
		if(selcode==lts[0]) selected="selected='selected'";
        newOptions += '<option '+selected+' value="'+lts[0] + '">' + lts[1] + '</option>';
        selected="";
    }
    $(id).append(newOptions);
  	//$(id).selectmenu('refresh');
  	selectrefresh(id);
    $(id).attr("selectedIndex", -1)
}
function populatePureRtn(list,selcode)
	{
		var sel=document.createElement("select");
		sel.setAttribute("style"," font-size:14px;height:40px;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;padding-left: 15px;");
		var selected="";
		var newOptions='<option value="">-- Select --</option>';
		
		var lt=list.split(';');
		for (i in lt){
			var lts=lt[i].split(',');
			if(selcode==lts[0]) selected="selected='selected'";
	        newOptions += '<option '+selected+' value="'+lts[0] + '">' + lts[1] + '</option>';
	        selected="";
	      
	    }
	    sel.innerHTML=newOptions;
	    return sel;
	}
	
	
//jquery component if exist refresh
function selectrefresh(id){
	if ( typeof $( id ).selectmenu() !== "undefined" ) {
		var opt = $(id ).find( "option" ).last().text();
		$( id ).find( "option" ).last().text( opt  );
		$( id ).selectmenu( "refresh" );
  	}
  	} 
  
  	

/* //alternative approach maintain just in case
	var w = $(id);
	if( w.data("mobile-selectmenu") === undefined) {
	  // not initialized yet, lets do so
	  w.selectmenu();
	}
	w.selectmenu("refresh",true);
*/

function listrefresh(id){
	if ( typeof $( id ).listview() !== "undefined" ) {
		var li = $( id ).find( "li" ).last().text();
		$( id ).find( "li" ).last().text( li + " - refreshed" );
		$( id ).listview( "refresh" );
	}
}
/*
 // Sort by price high to low
homes.sort(sort_by('price', true, parseInt));

// Sort by city, case-insensitive, A-Z
homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));
*/
var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = [-1, 1][+!!reverse];

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}
//array unique
/*
 var foo;
foo = ["1",1,2,3,4,1,"foo"];
foo.unique();
 * */
function uniques(arr) {
    var a = [];
    for (var i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}

//parse string to bool
function getBool(val){ 
    var num = +val;
    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
}
function msgshow(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e '><p>"+msg+"</p></div>").css({ "display": "block","font-family:dotum arial;font-size":"12px","padding":"0 0 0 5px","background-color":"black","color":"white", "opacity": 0.70,"width":"90%", "left":"10px","top": $(window).scrollTop() + $(window).height()-100 })
	  .appendTo( $.mobile.pageContainer )
	  .delay( 3500 )
	  .fadeOut( 400, function(){
	    $(this).remove();
	  });
}
function showmsg(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e '><p>"+msg+"</p></div>").css({ "display": "block","font-family:dotum arial;font-size":"12px","padding":"0 0 0 5px","background-color":"black","color":"white", "opacity": 0.70,"width":"90%", "left":"10px","top": $(window).scrollTop() + $(window).height()-100 })
	  .appendTo( $.mobile.pageContainer )
	  .delay( 3500 )
	  .fadeOut( 400, function(){
	    $(this).remove();
	  });
}
//First Letter Capitalize
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
    //ex: string.capitalize();
}

//detect mobile
function detectmobile() { 
	 if( navigator.userAgent.match(/Android/i)
	 || navigator.userAgent.match(/webOS/i)
	 || navigator.userAgent.match(/iPhone/i)
	 || navigator.userAgent.match(/iPad/i)
	 || navigator.userAgent.match(/iPod/i)
	 || navigator.userAgent.match(/BlackBerry/i)
	 || navigator.userAgent.match(/Windows Phone/i)
	 ){
	    return true;
	  }
	 else {
	    return false;
	  }
}
//change page
function change(page){
	$.mobile.loading( 'show', {
		text: "loading...",
		textVisible: true,
		theme: 'a',
		html: ""
	});
	window.location.href=page+".html";
}