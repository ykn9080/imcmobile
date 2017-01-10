function openWindow(url, hsize, wsize)
{
	var openObject;
	openObject = window.open(url,"","height="+ hsize + ",width=" + wsize + ",status=no,toolbar=no,menubar=no,location=no");
}

function openWindow2(url, wsize, hsize, scroll)
{
	var openObject;
	openObject = window.open(url,"","height="+ hsize + ",width=" + wsize + ",status=no,toolbar=no,menubar=no,location=no, scrollbars=" + scroll);
}

function openWindow3(url, wsize, hsize, scroll)
{
	var openObject;
	openObject = window.open(url,"","height="+ hsize + ",width=" + wsize + ",status=yes,toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=" + scroll);
}

function openWindow4(url, wsize, hsize)
{
    var openObject;
    openObject = window.open(url,"","height="+ hsize + ",width=" + wsize + ",status=no,toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=no");
}

function search(keyword)
{
	window.navigate('/Result/?keyword=' + keyword);
}

function test(reportName)
{
	var url = "http://localhost/ReportServer?/Report01/" + reportName + "&rs:Command=render&rc:toolbar=false&rs:Format=HTML4.0";
	document.all.browser1.src= url;
}

function ShowDialog(url, width, height)
{
    window.showModalDialog(url, window ,"dialogHeight: " + height +"px; dialogWidth: " + width + "px; dialogHide: On; edge: Raised; center: Yes; scroll: No; resizable: Yes; status: No;");
}

function Refrash()
{
    window.location.href = window.location.href;
}

function panelToggle(id)
{
    var panel = document.getElementById(id);
    var img = document.getElementById(id + "_Img");
    
    if(panel.style.display == "none")
    {
        panel.style.display = "block";
        img.src = "/images/expand.jpg";
    }
    else
    {
        panel.style.display = "none";
        img.src = "/images/collapse.jpg";
    }
}

function toggleImg()
{
    var imgObj = document.getElementById('titleImg');
    
    if(imgObj.alt == 'Off')
    {
        imgObj.src = '/images/PinOn.gif';
        imgObj.alt = 'On';
    }
    else
    {
        imgObj.src = '/images/PinOff.gif';
        imgObj.alt = 'Off';
    }
}

function getCookie(c_name)
{
    if (document.cookie.length > 0)
    { 
        c_start = document.cookie.indexOf(c_name + "=");
        
        if (c_start!=-1)
        { 
            c_start = c_start + c_name.length+1;
            c_end = document.cookie.indexOf(";",c_start);
            if (c_end == -1) 
                c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    
    return ""
}

function setCookie(c_name, value, expiredays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name+ "=" + escape(value) + ((expiredays==null) ? "" : "; expires=" + exdate.toGMTString());
}

function checkCookie()
{
    expand = getCookie('winstatus');
    
    if (expand == "true")
    {
        return true;
    }
    else 
    {
        return false;
    }
}

function clock() 
{
    if (!document.layers && !document.all) 
        return;
        
    var digital = new Date();
    var hours = digital.getHours();
    var minutes = digital.getMinutes();
    var seconds = digital.getSeconds();
    var amOrPm = "AM";
    
    if (hours > 11) 
        amOrPm = "PM";
    if (hours > 12) 
        hours = hours - 12;
    if (hours == 0) 
        hours = 12;
    if (minutes <= 9) 
        minutes = "0" + minutes;
    if (seconds <= 9) 
        seconds = "0" + seconds;
    dispTime = hours + ":" + minutes + ":" + seconds + " " + amOrPm;
    
    if (document.layers) {
        document.layers.pendule.document.write(dispTime);
        document.layers.pendule.document.close();
    }
    else
        if (document.all)
            pendule.innerHTML = dispTime;
            
    setTimeout("clock()", 1000);
}

var next_go = true;
var cur_val = null;
function moveNext(id_from,id_to,size) {     // 주민번호 valid check , 자동 다음 폼 이동
    
    var a = document.getElementById(id_from).value;
    siz = a.length;
    numFlag = isNumeric(a);

    if ( !numFlag && siz > 1 && a != '00' &&  a != '000') {
	    alert('숫자를 넣어주세요');
	    document.getElementById(id_from).value='';
	    document.getElementById(id_from).focus();
	    return false;
    }
    if (siz == size) {
	    if(next_go || cur_val != a)
	    {
		    cur_val = a;
		    next_go = false;
		    document.getElementById(id_to).focus();
	    }			
	    return true;
    }
    next_go = true;
}

function isNumeric(s) {
     var isNum = /\d/;
     if( !isNum.test(s) ) return 0; 
     return 1;
}


/* Report Control */
/*
var menuPopup = window.createPopup();
    
function ReportSet_Menu(id)
{
    var rmenu = document.getElementById(id);
    
    menuPopup.document.body.innerHTML = rmenu.innerHTML;    

    var popupBody = menuPopup.document.body;
    menuPopup.show(0, 0, 50, 50);
    var realHeight = popupBody.scrollHeight;
    menuPopup.hide();
    menuPopup.show(0, 20, 150 , realHeight, event.srcElement);
}
*/