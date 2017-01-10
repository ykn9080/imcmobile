/*--------------------------------------------------------------
google chart그리기
json: cols,rows로 구성된 serial data
kpiname;json 중 chunk일부선택시
chtdiv:cht가 표시될 div id(""일경우에는 absolute position에 생성됨;
opt:title^width^height^xaxis title로 구성(추가될 수 있음)
ctype:chart type(line,column,bar,area,pie,donut,bubble,scatter)
---------------------------------------------------------------*/
var chart;
var data;
var table;
function drawChart(json, keyname, chtdiv, opt, ctype,cursor) {
/*
    if (json != "") {
        var obj = eval("(" + json + ")");
        var list = "";
        if (keyname != "")
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].keyname == keyname) {
                    list = obj[i].data;
                }
            }
        else
            list = json;
    }*/

    data = json;//new google.visualization.DataTable(list);
    var options = opt;//	eval("(" + opt + ")");

    //Chart background
    var container;
    if (chtdiv == "") {
        container = document.createElement('div');
        container.setAttribute("id", "dvContainer");
    }
    else
        container = document.getElementById(chtdiv);

    //var h = parseInt(options.height) + 20;
    
    switch (ctype) {
        case "line":
            chart = new google.visualization.LineChart(container);
            break;
        case "column":
            chart = new google.visualization.ColumnChart(container);
            break;
        case "bar":
            chart = new google.visualization.BarChart(container);
            break;
        case "area":
            chart = new google.visualization.AreaChart(container);
            break;
        case "pie":
            chart = new google.visualization.PieChart(container);
            break;
        case "donut":
            chart = new google.visualization.PieChart(container);
            options.pieHole=0.4;
            break;
        case "bubble":
            chart = new google.visualization.BubbleChart(container);
            break;
        case "scatter":
            chart = new google.visualization.ScatterChart(container);
            break;
    }
    chart.draw(data, options);
	//document.getElementById(chtdiv).appendChild(container);
    //event handler

}

function TableCreate(contents, ttlwidth) {
    var table = document.createElement('TABLE');
    table.border = '0';
    var width = ttlwidth;
    table.setAttribute("style", "width:"+width+"px;");
    //var tableBody = document.createElement('TBODY');
    //table.appendChild(tableBody);
    var ct = contents.split(';');
    var colcum=0; //column 수 누계(2개이상인 경우 tr삽입을 지연)
    var colnum = 0; //기본 2개의 컬럼
    //max col수 찾기
    var maxcol = 0;
    for (var i = 0; i < ct.length; i++) {
        var c = ct[i].split(',');
        if (c[3] == "break" && c[4] > maxcol)
            maxcol = c[4];
    }

    for (var i = 0; i < ct.length; i++) {
        var c = ct[i].split(',');
        if (c[3] == "break") {
            colnum = c[4]; //column수 변경
            colcum = 0;
            if (c[0] != "") {
                var tr = document.createElement('TR');
                var td = document.createElement('TD');
                td.setAttribute("colspan", maxcol);
                td.setAttribute("style", "font-weight:bold;text-decoration:underline;");
                td.appendChild(document.createTextNode(c[0]));
                tr.appendChild(td);
                table.appendChild(tr);

            }
             
        }
        else {
            //tr생성
            if (colcum == 0) { 
                var tr = document.createElement('TR');
                table.appendChild(tr);
            }
            //td생성->tr삽입
            for (var j = 0; j < 1; j++) {
                var td = document.createElement('TD');
                switch (j) {
                    case 0:
                        td.appendChild(document.createTextNode(c[0]));
                        td.setAttribute("style", "width:90px;");
                        tr.appendChild(td);
                        break;
                    case 1:
                        //column width계산
                        //(전체넓이-타이틀합계넓이)/컨텐츠컬럼수 (ttlwidth-70*colnum/2)/colnum/2
                            var halfnum = colnum / 2;
                            var cwidth = ((ttlwidth) - 70 * halfnum) / halfnum;
                            td.appendChild(TableContentsCreate(c[3],c[1], c[4], c[2], cwidth));
                            var colspan = (maxcol - halfnum) / halfnum;
                            if (colnum < maxcol)
                                td.setAttribute("colspan", colspan);
                            tr.appendChild(td);
                        break;
                }
            }
            colcum = colcum + 2;
            //colcum초기화
            if (colnum == colcum) colcum = 0;
        }
    }
    return table;
}
function TableContentsCreate(type, fieldJson, fieldoption, fieldvalue, fieldwidth) {
    var rtn = document.createElement('div');
    rtn.setAttribute("value", fieldJson); //Json으로 표현된 타이틀명
    rtn.setAttribute("style", "width:" + fieldwidth + "px;padding-right:10px;");

    switch (type) {
        default:
            var rtn1 = document.createElement('input');
            rtn1.setAttribute("style", "width:100%;");
            rtn1.setAttribute("class", "color");
            rtn1.setAttribute("value", fieldvalue);
            rtn.appendChild(rtn1);
            break;
        case "break":
            var rtn1 = document.createElement('text');
            rtn.setAttribute("style", "font-weight:bold;");
            rtn.appendChild(rtn1);
            break;
        case "color":
            var rtn1 = document.createElement('input');
            rtn1.setAttribute("type", "color");
            //rtn1.setAttribute("class", "color");
            rtn1.value = fieldvalue;
            rtn.appendChild(rtn1);
            break;
        case "radio":case "checkbox":
            var optionlist = fieldoption.split('^');
            if (optionlist.length > 0) {
                //1개의 체크박스는 true,false로 체크함.  
                if (type == "checkbox" && optionlist.length == 1) {
                    var rtn1 = document.createElement('input');
                    rtn1.type = type;
                    if (fieldvalue == "true")
                        rtn1.checked = "checked";
                    rtn.appendChild(rtn1);
                }
                else
                    for (var i = 0; i < optionlist.length; i++) {
                        var rtn1 = document.createElement('input');
                        rtn1.type = type;
                        rtn1.name = "g1+" + type;
                        rtn1.setAttribute("style", "margin:0 0 0 3px;vertical-align:middle;");
                        rtn1.value = optionlist[i];
                        rtn.appendChild(rtn1);
                        rtn.innerHTML += optionlist[i];
                    }
            }

            break;
        case "select":
            rtn1 = document.createElement('select');
            rtn1.name = "name";
            rtn1.id = "selCtype";
            var optionlist = fieldoption.split('^');
            for (var i = 0; i < optionlist.length; i++) {
                rtn1.options[i] = new Option(optionlist[i], optionlist[i]);
            }

            rtn1.value = fieldvalue;
            rtn.appendChild(rtn1);
            break;
    }
    return rtn;
}
function TopBar(container,title) {
    //clear both용 div
    var cleardiv = document.createElement('div');
    cleardiv.setAttribute("style", "clear:both;");

    //close button용 div
    var closediv = document.createElement('div');
    closediv.setAttribute("style", "float:right;");
    var closeimg = document.createElement("img"); //close img
    closeimg.setAttribute("src", "/images/closegray.png");
    closeimg.setAttribute("style", "padding:0 1px 3px 0;");
    closeimg.setAttribute("class", "imdim");
    closeimg.setAttribute("onclick", "document.getElementById('" + container + "').parentNode.removeChild(document.getElementById('" + container + "'));document.getElementById('dvFade12').parentNode.removeChild(document.getElementById('dvFade12'));");
    closediv.appendChild(closeimg);

    //title
    var titlediv = document.createElement('div');
    titlediv.setAttribute("style", "float:left;");
    var span = document.createElement('span');
    span.setAttribute("style", "color:white;font-weight:bold;font-size:12px;");
    span.innerHTML = title;
    titlediv.appendChild(span);
    //top float할 div생성한후 append
    var floatdiv = document.createElement('div');
    floatdiv.appendChild(closediv);
    floatdiv.appendChild(titlediv);
    floatdiv.appendChild(cleardiv);

   
    return floatdiv;
}
function GoogleChartRead(opt) { 
     var options = eval("(" + opt + ")");
     var val = "";
     val += ",,,break,2;";
     //val += "Title,title," + options.title + ",input,;";
     val += ",,,break,4;";
     val += "Width,width," + options.width + ",input,;";
     val += "Height,height," + options.height + ",input,;";
     val += "Legend,legend," + options.legend + ",select,right^bottom^top^left;";
     val += "3D,is3d," + options.is3d + ",checkbox,;";
     val += "GridLine,gridlines.color," + options.gridlines.color + ",color," + options.gridlines.color + ";";
     val += "CrossHair,crosshair.trigger," + options.crosshair.trigger + ",select,none^both;";

     val += "Axis-x,,,break,4;";
     val += "Title,hAxis.title," + options.hAxis.title + ",input," + options.hAxis.title + ";";
     val += "Color,hAxis.titleTextStyle.color," + options.hAxis.titleTextStyle.color + ",color," + options.hAxis.titleTextStyle.color+";";
     val += "Font,hAxis.titleTextStyle.fontSize," + options.hAxis.titleTextStyle.fontSize + ",select,5^6^7^8^9^10^11^12^13^14^16^20;";

     val += "Axis-y,,,break,4;";
     val += "Title,vAxis.title," + options.vAxis.title + ",input,;";
     val += "Color,vAxis.titleTextStyle.color," + options.vAxis.titleTextStyle.color + ",color," + options.vAxis.titleTextStyle.color + ";";
     val += "Font,vAxis.titleTextStyle.fontSize," + options.vAxis.titleTextStyle.fontSize + ",select,5^6^7^8^9^10^11^12^13^14^16^20";


     return val;
}
function GoogleChartEdit(container,list,opt,ctype,width,height) {
    var editor = document.createElement('div');
    editor.setAttribute("id", "dvChartEdit");
    editor.setAttribute("class", "msgbox");
    editor.setAttribute("style", "width:" + width + ";height:" + height + ";z-index:1001;");
     document.getElementById("dvGoalChart").innerHTML="";
    document.getElementById("dvGoalChart").appendChild(editor);

    //topbar삽입
    editor.appendChild(TopBar('dvChartEdit','Edit'));//div명, topbar title
    //table area
    var dvtable = document.createElement('div');
    dvtable.setAttribute("style", "width:" + (width-10) + "px;height:" + (height - 45) + "px;background-color:t;z-index:1002;padding:15px 5px 5px 5px;");
    editor.appendChild(dvtable);
    var cont = GoogleChartRead(opt);
    var table = TableCreate(cont,parseInt(width)-50);
    
    //apply,cancel button을 table에 추가
    var tr = document.createElement('TR');
    var td = document.createElement('TD');
    td.setAttribute("colspan", "4");
    var btmdiv = document.createElement('div');
    btmdiv.setAttribute("style", "text-align:right;padding:top:10px;");

    //cancel btn 추가
    var cancelbtn = document.createElement("input");
    cancelbtn.setAttribute("value", "Cancel");
    cancelbtn.setAttribute("style", "width:60px;text-align:center;");
    cancelbtn.setAttribute("class", "button");
    var cancel = "document.getElementById('dvChartEdit').parentNode.removeChild(document.getElementById('dvChartEdit'));document.getElementById('dvFade12').parentNode.removeChild(document.getElementById('dvFade12'));drawChart1();";
    cancelbtn.setAttribute("onclick", cancel);
    btmdiv.appendChild(cancelbtn);

    //apply btn추가
    var applybtn = document.createElement("input");
    applybtn.setAttribute("value", "Apply");
    applybtn.setAttribute("style", "width:60px;text-align:center;");
    applybtn.setAttribute("class", "button");
    var closechart = "document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));drawChart1();";

    var cursor = getPositionOffset(window.event, width, height);
    applybtn.setAttribute("onclick", "drawChart('" + list + "','', '',JSON.stringify(GoogleChartSave()) , '" + ctype + "','" + JSON.stringify(cursor) + "');" + closechart + cancel);
    //console.log(JSON.stringify(GoogleChartSave()));
    btmdiv.appendChild(applybtn);

    td.appendChild(btmdiv);
    tr.appendChild(td);
    table.appendChild(tr);

    dvtable.appendChild(table);

    //"Title,title,input,;Width,width,input,;Height,height,input,;Legend,legend,select,right^bottom^left^top^none;vAxis,vAxis.title,checkbox,good source^relation^food;4th,4th,radio,ss^uu^ll"
}

function selectHandler(e) {
    var selection = chart.getSelection();
    var message = '';
    for (var i = 0; i < selection.length; i++) {
        var item = selection[i];
        if (item.row != null && item.column != null) {
            var str = data.getFormattedValue(item.row, item.column);
            message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
        } else if (item.row != null) {
            var str = data.getFormattedValue(item.row, 0);
            message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
        } else if (item.column != null) {
            var str = data.getFormattedValue(0, item.column);
            message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
        }
    }
    if (message == '') {
        message = 'nothing';
    }
    alert('You selected ' + message);
}
    //window를 9등분해서 위치에 따라 div의 위치를 바꿈
function getPositionOffset(e, boxw, boxh) {
    var sw = screen.width;
    var sh = screen.height;
    var cx = e.clientX;
    var cy = e.clientY;
    var bw = parseInt(boxw);
    var bh = parseInt(boxh);
    var centerx = sw / 2 - bw / 2;
    var centery = sh / 2 - bh / 2;
    var cursor = { x: 0, y: 0 };
    //order
    // 1 2 3
    // 4 5 6
    // 7 8 9

    if (cx > sw / 3 && cx <= sw * 2 / 3 && cy <= sh / 3) {
            cursor.x = centerx;
            cursor.y = cy;
        }
    else if (cx > sw / 3 && cx <= sw * 2 / 3 && cx <= sw * 2 / 3 && cy <= sh / 3) {
        cursor.x = centerx;
        cursor.y = centery;
    }
    else if (cx > sw / 3 && cx <= sw * 2 / 3 && cy > sh * 2 / 3) {
            cursor.x = centerx;
            cursor.y = cy - bh;
        }
    else if (cx <= sw / 2 && cy <= sh / 2) {
        cursor.x = cx;
        cursor.y = cy;
    }
    else if (cx > sw / 2 && cx <= sw && cy <= sh) {
        cursor.x = cx - bw;
        cursor.y = cy;
    }
    else if (cx <= sw / 2 && cy > sh / 2 && cy <= sh) {
        cursor.x = cx;
        cursor.y = cy - bh;
    }
    else if (cx > sw / 2 && cx <= sw && cy > sh / 2 && cy <= sh) {
        cursor.x = cx - bw;
        cursor.y = cy - bh;
    }

    return cursor;
}  
   
function select(list, opt,cursor) {
    var sel = document.getElementById('selCtype').value;
    document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));
    document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));
    drawChart(list, "", "", opt, sel, cursor);
}

function GoogleChartSave() {
    if (document.getElementById('hidResult') != null) document.getElementById('hidResult').parentNode.removeChild(document.getElementById('hidResult'));
    var obj = new Object();
    var tbl = document.getElementById("dvChartEdit").childNodes[1].childNodes[0]; //.getElementsByTagName("TABLE");
    var rtn = "";
    // tbl should be reference to the TABLE object
    if (tbl.nodeName === 'TABLE') {
        // define number of table rows
        var tbl_rows = tbl.rows.length - 1;
        // iterate through each table row
        for (var r = 0; r < tbl_rows; r++) {
            var cells = tbl.rows[r].cells.length;
            if (cells > 1) {
                for (var c = 0; c < cells; c++) {
                    var tbl_cell = tbl.rows[r].cells[c];
                    if (!isEven(c)) {
                        if (tbl_cell.childNodes.length > 0) {//break로 설정된 row를 피하기 위해
                            var cn = tbl_cell.childNodes[0]; //td내의 div
                            var rtn = ValuebyType(cn)
                            var title = cn.getAttribute("value").split('.');//  tbl.rows[r].cells[c - 1].innerText.split('.');
                            assign(obj, title, rtn);
                        }
                    }
                }
            }

        }
    }
    //console.log(JSON.stringify(obj));
    return obj;
}
function isEven(num) { return (num % 2==0)? true :false; }

/*--------------------------------------------------------------
////assign내역////
obj: 값을 담을 JSON object
keyPath:array로 구성 예(vAxis.color)
value:keyPath의 값
---------------------------------------------------------------*/
function assign(obj, keyPath, value) {
    lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        key = keyPath[i];
        if (!(key in obj))
            obj[key] = {}
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

function ValuebyType(div) {
    var cn = div.childNodes[0];//node:div 안의 첫번째자식
    switch (cn.nodeName) {
        case "INPUT":
            switch (cn.type) {
                default:
                    rtn = cn.value;
                    break;
                case "checkbox":
                    var rd = div.childNodes; //div안에 복수의 input으로 구성
                    if (rd.length == 1) {
                        rtn = false;
                        if (rd[0].checked) {
                            rtn = true;
                        }
                    }
                    else if (rd.length > 1) {
                        var chk = [];
                        var val;
                        for (i = 0; i < rd.length; i++) {
                            if (rd[i].checked) {
                                val = rd[i + 1].data;
                                chk.push(val);
                            }
                        }
                        rtn = chk;
                    }
                    break;
                case "radio":
                    var rd = div.childNodes; //div안에 복수의 input으로 구성
                    for (i = 0; i < rd.length; i++) {
                        if (rd[i].checked) {
                            rtn = rd[i].value;
                            break;
                        }
                    }
                    break;
            }
            break;
        case "SELECT":
            rtn =  cn.value 
            break;
    }
    return rtn;
}




//based on raw data create chart data for google
function makeGoogleDataTable(data,axislist,series,valuelist,filterlist,sortlist){
	var grpby=[];
	var val=[];
	var row=[];
	//create datatable
	var googledt = new google.visualization.DataTable();
	var al=axislist.split(',');
	var sl=series;
	var vl=valuelist.split(';');
	var axistype="";
	//googledt column create:axis,value
	for(var t in al){
		//add axis column

		var d = new Date(data[0][al[t]]);
		if(d instanceof Date && d!="Invalid Date"){
			googledt.addColumn('date', al[t]);
		}
		else{
    		googledt.addColumn('string', al[t]);
    	}
    }
    //if series
    var serieslist="";
    if(sl !=""){
		//series value distict extract
    	ser=[];
		for(i in data){
        	ser.push(data[i][sl]);
        }
        ser=uniques(ser);//refer common.js(uniques)
        //series column
        var tt=vl[0].split(',');
   		var aggregation=tt[1];
        for(j in ser){
			//add axis column
	    	googledt.addColumn('number', ser[j]);
	    	serieslist +=ser[j]+","+aggregation+";";
    	}
    	//add row
    	for(i in data){
	   		row=[];
    		//x axis row data insert
    		var d = new Date(data[i][al[0]]);
			if(d instanceof Date && d !="Invalid Date"){
				row.push(new Date(d.getFullYear(),d.getMonth(),d.getDate()));
			}
			else
        		row.push(data[i][al[0]]);
        		
       		for(j in ser){
	       		if(data[i][sl]==ser[j])
	        	row.push(parseFloat(data[i][tt[0]]));
	        	else
	        	row.push(0);
	        	
        	}
	     	googledt.addRow(row)
   		}
   		
    	serieslist=serieslist.substring(0,serieslist.length-1);
    }
	else{
		//value column

	   	for(var t in vl){
	   		//add value column
	   		var tt=vl[t].split(',');
	    	googledt.addColumn('number', tt[0]);
	   	}
	   	//googledt row insert
	   	for(i in data){
	   		row=[];
	        var d = new Date(data[i][al[0]]);
			if(d instanceof Date && d !="Invalid Date"){
				row.push(new Date(d.getFullYear(),d.getMonth(),d.getDate()));
				axistype="date";
			}
			else
        		row.push(data[i][al[0]]);
        		
	       	for(var t in vl){
	       		var tt=vl[t].split(',');
	        	row.push(parseFloat(data[i][tt[0]]));
	       	}
	   		googledt.addRow(row)
	   	}
   }

   	//groupby 
	//axis field

	var axisarray=[];
	for(i in axislist.split(',')){
		axisarray.push(parseInt(i));
	}
	//value field
	if(sl!="") valuelist=serieslist;
	var valarray=googleGroupbyValueArray(axislist,valuelist);
	
	//google groupby
	var result = google.visualization.data.group(googledt,axisarray,valarray );
	return  result;

}

//SORTING: data=googledata,sortlist=column Index+","+sort order;(comma & semicolon)
function googleSortArray(sortlist){
	var sortout=[];
	var srt=sortlist.split(';');
	for(i in srt){
		var st={};
		var srtt=srt[i].split(',');
		st.column=parseInt(srtt[0]);
		switch(srtt[1]){
			case "true":
				st.desc=true;
			break;
			case "false":
				st.desc=false;
			break;
		}
		sortout.push(st);
	}
	return sortout;
}
function googleFilterArray(filterlist){
	var srt=filterlist.split(';');
	var filterout=[];
	
	for(i in srt){
		var st={};
		var srtt=srt[i].split(',');
		st={};
		st.column=parseInt(srtt[0]);
	 	var d = new Date(srtt[1]);
		if(srtt[2]==""){
			st.value=srtt[1];
		}

		else {
			
			if($.isNumeric( srtt[1])){
				st.minValue=parseFloat(srtt[1]);
				st.maxValue=parseFloat(srtt[2]);
			}
			else if(d instanceof Date && d !="Invalid Date"){
				st.minValue=new Date(srtt[1]);
				st.maxValue=new Date(srtt[2]);
			}
		}
		

		filterout.push(st);
	}



	return filterout;
}

function googleGroupbyValueArray(axislist,valuelist){
	var val=[];
	var vset={};
	var vl=valuelist.split(';');
	for(var t in vl){
   		var tt=vl[t].split(',');
    	var index=axislist.split(',').length+parseInt(t);
    	var aggregate=tt[1];
    	var labelname=tt[0];

    	switch(aggregate){
		case "sum":
       		val.push({'column': index,'type': 'number','label': labelname,'aggregation': google.visualization.data.sum});   
       	break;
       	case "avg":
       		val.push({'column': index,'type': 'number','label': labelname,'aggregation': google.visualization.data.avg}); 
       	break;
      	}
   	}
   
   return val;
}
// chart list for single user 
//title,tsize,tfontname,tcolor,tbold,titalic
//,width,height
//,haxis(title,hsize,hfontname,hcolor,hbold,hitalic)
//,vaxis(title,vsize,vfontname,vcolor,vbold,vitalic),legendposition
//,filterlist,sortlist
function OfflineChartdtList(){
	var List=[];
	//order data
	//var data=makeOrderData();	
	var srcname="chart_sales"
	var opt_tit=",14,malgun gothic,,,";
	var opt_wh="100%,";
	var opt_vax="mth,12,,,,";
	var opt_hax="yr,10,,,,";
	var opt_leg="top";
	//var optionlist=opt_tit+","+opt_wh+","+opt_vax+","+opt_hax+","+opt_leg;
	var xaxis="odate";
	var xformat="M/d";
	var series="prodname";
	var vallist="rev,sum";
	var filterlist="";
	var sortlist="0,false";
	var dt=createChartdt(List,"거래선별 실적",srcname,xaxis,xformat,series,vallist,"Column",opt_tit,opt_wh,opt_vax,opt_hax,opt_leg,filterlist,sortlist);		
	List.push(dt);
	
	//marketinfo data
	//data=makeMarketinfoData();	
	srcname="chart_marketinfo";
	var opt_tit=",16,,,,";
	var opt_wh="100%,";
	var opt_vax=",12,,,,";
	var opt_hax=",12,,,,";
	var opt_leg="left";
	//var optionlist=opt_tit+","+opt_wh+","+opt_vax+","+opt_hax+","+opt_leg;

	//optionlist=',16,,,,,100%,,,12,,,,,,12,,,,,left';
	xaxis="infoname";
	xformat="";
	series="";
	vallist="num,sum";
	filterlist="";
	sortlist="1,true";
	dt=createChartdt(List,"정보유형별구성",srcname,xaxis,xformat,series,vallist,"Pie",opt_tit,opt_wh,opt_vax,opt_hax,opt_leg,filterlist,sortlist);		
	List.push(dt);
	return List;
}

function createChartdt(List,title,srcname,axislist,xformat,series,valuelist,ctype,opt_tit,opt_wh,opt_vax,opt_hax,opt_leg,filterlist,sortlist){	
	var dlist={};
	
	dlist.id="CT"+(1000+List.length+1);
	dlist.srcname=srcname;
	dlist.axis=axislist;
	dlist.xformat=xformat;
	dlist.series=series;
	dlist.value=valuelist;
	dlist.opt_tit=opt_tit;
	dlist.opt_wh=opt_wh;
	dlist.opt_vax=opt_vax;
	dlist.opt_hax=opt_hax;
	dlist.opt_leg=opt_leg;
	dlist.title=title;
	dlist.ctype=ctype;
	dlist.filterlist=filterlist;
	dlist.sortlist=sortlist;

	return dlist;
}
var w=$(window).width();
var h=$(window).height();

function createOption(opt_tit,opt_wh,opt_vax,opt_hax,opt_leg){
	//optlist='test,100%,,mth,10,FF0000,yr,10,FF0000';
	var ht=$( window ).height()-100;
	var wth="100%";
	var opt=opt_tit.split(',')
	var title=opt[0];
	var tsize=opt[1];
	if(opt[1]=="")tsize=16;
	var tfname=opt[2];
	var tcolor=opt[3];
	if(tcolor=="")tcolor="#1C1C1C";
	var tbold=opt[4];
	if(opt[4]=="")tbold="false";
	tbold=getBool(tbold);
	var titalic=opt[5];
	if(opt[5]=="")titalic="false";
	titalic=getBool(titalic);
	//orientation a step behind thus reverse!!
/*
	if(window.orientation!=0)
		if(w>h)ht=w;
	else 
		if(w<h)ht=w;*/

/*
	if(opt[6]!="")wth=opt[6];
	if(opt[7]!="")ht=opt[7];*/
 	opt=opt_vax.split(',')
	var vtitle=opt[0];
	var vsize=opt[1];
	if(opt[1]=="")tsize=12;
	var vfname=opt[2];
	var vcolor=opt[3];
	if(opt[3]=="")vcolor="#1C1C1C";
	var vbold=opt[4];
	if(opt[4]=="")vbold="false";
	vbold=getBool(vbold);
	var vitalic=opt[5];
	if(opt[5]=="")vitalic="false";
	vitalic=getBool(vitalic);
	
	opt=opt_hax.split(',')
	var htitle=opt[0];
	var hsize=opt[1];
	if(opt[1]=="")hsize=12;
	var hfname=opt[2];
	var hcolor=opt[3];
	if(opt[3]=="")hcolor="#1C1C1C";
	var hbold=opt[4];
	if(opt[4]=="")hbold="false";
	hbold=getBool(hbold);
	var hitalic=opt[5];
	if(opt[5]=="")hitalic="false";
	hitalic=getBool(hitalic);

	opt=opt_leg.split(',')
	var legend="none";
	if(opt[0]!="")legend=opt[0];
	
	//if xaxis data format is datetime && not bar chart apply xformat
	var fname=valaxis().axis;
	var srcname=valaxis().src;
	var data=defaultData(srcname);
	var d = new Date(data[0][fname]);
	var vformat="";
	var xformat="";
	if(d instanceof Date && d !="Invalid Date"){
		
		switch(valaxis().ctype){//charttype
			case "Bar":
				vformat=valaxis().xformat;
			break;
			default:
				xformat=valaxis().xformat;
			break;
		}
	}
	
	var combine='{"title":"'+title+'","titleTextStyle": {"color": "'+tcolor+'","fontSize": '+tsize+',"fontName": "'+tfname+'","bold":'+tbold+',"italic":'+titalic+'},"width":"'+wth+'","height":"'+ht+'"';
	//combine +=',"chartArea": {"left":10,"top":10,"width": "50%", "height": "70%"}';
	combine +=',"hAxis":{"title":"'+htitle+'","format": "'+xformat+'","textStyle":{"color":"'+hcolor+'","fontSize":'+hsize+',"fontName": "'+hfname+'","bold":'+hbold+',"italic":'+hitalic+'}}';
	combine +=',"vAxis":{"title":"'+vtitle+'","format": "'+vformat+'","textStyle":{"color":"'+vcolor+'","fontSize":'+vsize+',"fontName": "'+vfname+'","bold":'+vbold+',"italic":'+vitalic+'}}';
	combine +=',"legend":{"position":"'+legend+'","color":"#808080"},"gridline":{"color":"#808080"},"crosshair":{"trigger":"none"}}';
	//combine +=',""';

	return JSON.parse(combine);
}

//returns lots of attributes of localstorage(googlechart)
//e.g: valaxis().srcname;
function valaxis(){
    var chartlist=localStorage.getItem("googlechart");
   
	var axis="";
	var xformat="";
	var ser="";
	var vallist="";
	var srcname="";
	var ctype="";
	var sortlist="";
	var filterlist="";
	var axistype="string";
	if(chartlist !==null){
		var cht=JSON.parse(chartlist).data;
		for(i in cht){
			if(cht[i].id==$("#inId").val()){
				axis=cht[i].axis;
				xformat=cht[i].xformat;
				if(cht[i].series !==null)
				ser=cht[i].series;
				vallist=cht[i].value;
				srcname=cht[i].srcname;
				ctype=cht[i].ctype;
				sortlist=cht[i].sortlist;
				filterlist=cht[i].filterlist;
			}
		}
	}
	var data=defaultData(srcname);
	var al=axis.split(',');
	var d = new Date(data[0][al[0]]);
	if(d instanceof Date && d !="Invalid Date"){
		axistype="date";
	}
	
     return {axis:axis,series:ser,val:vallist,src:srcname,xformat:xformat,ctype:ctype,sortlist:sortlist,filterlist:filterlist,axistype:axistype}
}

//imcMobile provide local data, add list additionally
function defaultDataCreate(){
	var data={};
	data.chart_sales=makeOrderData();
	data.chart_marketinfo=makeMarketinfoData();
	localStorage.setItem("googledata",JSON.stringify(data));
	//localStorage.setItem("chart_sales",JSON.stringify(makeOrderData()));
	//localStorage.setItem("chart_marketinfo",JSON.stringify(makeMarketinfoData()))
}

//imcMobile provide local data, add list additionally
function defaultData(srcname){
	var data=localStorage.getItem("googledata");
	//var data=localStorage.getItem(srcname);
	if(data ===null){
		defaultDataCreate();
		//data=localStorage.getItem(srcname);
		data=localStorage.getItem("googledata");
	}
		data=JSON.parse(data);
		
		data=data[srcname];
		
	return data;
}
//add src list whenever included !
function defaultDatasrc(){
	var dt=localStorage.getItem("googledata");
	var data=eval("(" + dt + ")");
	data=data.datalist;
	var output="";
	for(i in data){
		output+=data[i]["datacode"]+","+data[i]["dataname"]+";"
	}
	if(output !="")output=output.substring(0,output.length-1);
	return output;//"chart_sales,Sales;chart_marketinfo,Market Information";
}

//create {chcode,chname,staff,staffname,odate,prod,prodname,rev} list 
function makeOrderData(){
	var sl = JSON.parse(localStorage.getItem("sales"));
	var sld=sl.data;
	var newdata=[];
	var dtset={};
	for(i in sld){
		dtset={};
		dtset.staff=sld[i]["staff"];
		dtset.staffname=sld[i]["staffname"];
		dtset.chcode=sld[i]["chcode"];
		dtset.chname=sld[i]["chname"];
		dtset.odate=sld[i]["odate"];
		var pl=sld[i]["prodlist"];
		if(pl.length>0){
			for(j in pl){
				dtset.prod=pl[j]["prod"];
				dtset.prodname=pl[j]["prodname"];
				dtset.rev=parseInt(pl[j]["rev"]);
				dtset.num=parseInt(pl[j]["num"]);
				newdata.push(dtset);	
			}
		}
	}
	return newdata;
}

function makeMarketinfoData(){
	var sl = JSON.parse(localStorage.getItem("marketinfo"));
	
	var newdata=[];	
	if(sl!==null){
	var sld=sl.data;
	var dtset={};
	for(i in sld){
		dtset={};
		dtset.prod=sld[i]["prod"];
		dtset.prodname=sld[i]["prodname"];
		dtset.chcode=sld[i]["chcode"];
		dtset.chname=sld[i]["chname"];
		dtset.infotype=sld[i]["infotype"];
		dtset.infoname=sld[i]["infoname"];
		dtset.staff=sld[i]["staff"];
		dtset.idate=sld[i]["idate"];
		dtset.num=1;
		newdata.push(dtset);
	}
	}
	return newdata;
}

function LaySort(a, b) {
  if(a.pos == b.pos){ return 0} return  a.pos > b.pos ? 1 : -1;
}

var paramshow="none";
var tb="";
function drawDashboard(json, opt, ctype,filterlist,sortlist){
	var contain=document.getElementById('dvContainer');
	contain.innerHTML="";
	var dvdash=document.createElement('div');
 	
	contain.appendChild(dvdash);
	var dvactr=document.createElement('div');
		dvactr.setAttribute("class","google-visualization-controls-theme-contrast");
	dvactr.id="dvAxis";
	
	//value control
	var val=valaxis().val;
	val=val.split(';');
	if(valaxis().series =="")
	for(m in val){
		dv=document.createElement('div');
		dv.id="dvValue"+m;
		dv.setAttribute("style","padding:5px 0 5px 5px;display:"+paramshow+";");
		dv.setAttribute("class","google-visualization-controls-theme-contrast");
		dvdash.appendChild(dv);
	}
	
	//chart
	var dvcht=document.createElement('div');
	dvcht.id="dvChart";
	//table
	var dvtb=document.createElement('div');
	dvtb.id="dvTable";
	dvtb.setAttribute("style","display:"+paramshow+";padding:5px 0 0 5px;");
	if(valaxis().axistype=="date")	{
		dvdash.appendChild(dvcht);
		dvdash.appendChild(dvactr);
		dvactr.setAttribute("style","padding:0px 0 5px 5px;display:"+paramshow+";height:50px;");
		
	}
	else{
		dvdash.appendChild(dvactr);
		dvdash.appendChild(dvcht);
		dvactr.setAttribute("style","padding:5px 0 5px 5px;display:"+paramshow+";");
	}
	
	dvdash.appendChild(dvtb);
	
	
	//axis control
	var ctrtype="CategoryFilter";
	if(valaxis().axistype=="date")	
	ctrtype="ChartRangeFilter";
	var actr =setControl(ctrtype,valaxis().axis, dvactr);  
	//value control
	
	if(ctype=="DoughnutChart"){
		
	}
	var cht = setChart(modifyCtype(ctype), dvcht,opt);  
	tb = setChart("Table", dvtb,"");  
	google.visualization.events.addListener(tb, 'select', selectHandler);
	//dashboard
	var myDashboard = new google.visualization.Dashboard(dvdash);
	
	if(valaxis().series =="")
	for(m in val){
		var dvval=document.getElementById('dvValue'+m)
		var vctr =setControl("NumberRangeFilter",val[m].split(',')[0], dvval);  
		myDashboard.bind(vctr,cht);
		myDashboard.bind(vctr,tb);
	}
	myDashboard.bind(actr,tb);
	myDashboard.bind(actr,cht);
	//series control
	
	//sort

	 var view = new google.visualization.DataView(json);
	if(sortlist !="")
   	view.setRows(view.getSortedRows(googleSortArray(sortlist)));
   	//console.log(googleSortArray(sortlist))
   	


   	if(filterlist !="")
   	//filterlist=[{"column":0,"minValue":new Date(2014,10,1),"maxValue":new Date(2014,10,30)}];
   	//view.setRows(view.getFilteredRows(filterlist));
   	//view.setRows(view.getFilteredRows([{"column": 0, "minValue": "new Date('2014-11-1')"}]));
    	view.setRows(view.getFilteredRows(googleFilterArray(filterlist)));
	console.log(filterlist,JSON.stringify(googleFilterArray(filterlist)))
   	

    myDashboard.draw(view);
     
   
}

function modifyCtype(ctype){
	if(ctype.indexOf("Chart")==-1)
		ctype+="Chart";
	return ctype.capitalize();	
}

function setChartView () {
        var state = columnFilter.getState();
        var row;
        var view = {
            columns: [0]
        };
        for (var i = 0; i < state.selectedValues.length; i++) {
            row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[i]}])[0];
            view.columns.push(columnsTable.getValue(row, 0));
        }
        // sort the indices into their original order
    view.columns.sort(function (a, b) {
        return (a - b);
    });
    chart.setView(view);
    chart.draw();
}
    //google.visualization.events.addListener(columnFilter, 'statechange', setChartView);

// Create a date range slider
function setControl(ctrtype,filtercolumn,div){
    var set={};
    set.controlType=ctrtype;
    set.containerId=div;
    var opt={};
    opt.filterColumnLabel=filtercolumn;
     var ui={};
    ui.labelStacking='vertical';
    ui.allowTyping=false;
    ui.allowMultiple=true;
    ui.chartOptions={chartArea:{width:'80%'}};
    opt.ui=ui;
    
    set.options=opt;
    
    var ctr = new google.visualization.ControlWrapper(set);
    
    return ctr;
}

function setChart(chttype,div,options){
    var set={};
    set.chartType=chttype;
    //set.dataTable=createTable();
/*
	options.sortColumn=1;
     options.sortAscending= false;*/

     options.chartArea={width:'80%'};
    set.options=options;
    set.containerId=div;
    var cht = new google.visualization.ChartWrapper(set); 
    return cht;
}

function drawVisualization() {
 // Table visualization  
var myTable = new google.visualization.ChartWrapper(setChart('Table', 'dvTable'));  
//Chart visualization
var myLine = new google.visualization.ChartWrapper(setChart('LineChart','dvChart'));
//Control visualization
var myDateSlider = new google.visualization.ControlWrapper(setControl('ChartRangeFilter','Date','dvControl'));

//Control2
var myCategory = new google.visualization.ControlWrapper(setControl('CategoryFilter','Date','dvCategory'));
var mySlider = new google.visualization.ControlWrapper(setControl('NumberRangeFilter','Hours','dvRange'));
   
    // Create a dashboard.
    if(lay.indexOf('dvDash')>-1){
     var dash_container = document.getElementById('dvDash'),
      myDashboard = new google.visualization.Dashboard(dash_container);
        
      myDashboard.bind(myCategory, myLine );
      myDashboard.bind(myDateSlider, myTable );
      myDashboard.draw(data);
    }
}
