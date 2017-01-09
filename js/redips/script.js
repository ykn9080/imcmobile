/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false, REDIPS: true */
/* Version 1.0.0 */

/* enable strict mode */
"use strict";

// define redips object container
var redips = {};
var initDisplay, displayLayout, scanTable, scanObject, injectObject, editLayout, makecontextmenu,test
, initEdit, editObject, editcell, editcellsave, tableResize, reSize,delRow,delCol, prefixFind, prefixFind1, showContent, getContent;
var menuid = "", subid = ""; //현재 선택한 menu, submenuid
// configuration
redips.configuration = function () {
    redips.components = 'tblComponents';// left table id (table containing components)
    redips.tableEditor = 'tblEditor';	// right table id (table editor)
    //redips.tableEditorDivs = document.getElementById(redips.tableEditor).getElementsByTagName('DIV');	// live collection of DIV elements inside table editor
    redips.ajaxField = 'db_field.php';	// get component details (via AJAX)
    redips.ajaxSave = 'db_save.php';	// save page (via AJAX)
    redips.cDetails = 'cDetails';		// component detail class name (it should be the same as is in CSS file)
    redips.markedColor = '#9BB3DA';		// marked cells background color
    // layout (HTML code) for component placed to the table editor 
    redips.component = '<table class="nolayout cHeader"><tr><td class="hLeft" onclick="redips.details(this)">+</td><td class="hTitle">|</td><td class="hRight" onclick="redips.divDelete(this)">x</td></tr></table>' +
						'<div class="' + redips.cDetails + '">|</div>';
};
// initialization
redips.init = function () {
    // define reference to the REDIPS.drag and REDIPS.table object
    var rt = REDIPS.table,
		rd = REDIPS.drag;
    // configuration
    redips.configuration();
    // attach onmousedown event handler to tblEditor
    rt.onmousedown(redips.tableEditor, true);
    // show cellIndex (it is nice for debugging)
    //rt.cell_index(true);
    // selected cell background color
    rt.color.cell =redips.markedColor;
    // disable marking not empty table cells
    rt.mark_nonempty = false;
    // create XMLHttp request object
    //redips.request = redips.initXMLHttpClient();

    // initialize REDIPS.drag library
    rd.init();
    // set drop mode as "single" - DIV element can be dropped only to the empty cells
    //rd.dropMode = 'single';
    // event handler invoked on click on DIV element
   
    //rd.event.clicked = function () {
    //    var div, // DIV element reference
	//		i; 	// loop variable
    //    // loop goes through all DIV elements inside table editor
    //    for (i = 0; i < redips.tableEditorDivs.length; i++) {
    //        // set reference to the DIV element
    //        div = redips.tableEditorDivs[i];
    //        // if DIV element contains class name of component details then hide
    //        if (div.className.indexOf(redips.cDetails) > -1) {
    //            redips.details(div, 'hide');
    //        }
    //    }

    //};
    rd.event.moved = function (targetCell) {
       
        if (targetCell)
            rd.obj.style.width = '150px';
        //else {
        //    var wth = parseInt(rd.obj.style.width.replace("px", ""));
        //    var leftoffset = wth - 300;
        //    if (wth > 300) {
        //        $(rd.obj).effect("scale", { percent: 50, origin: 'center' });
        //        //rd.obj.style.width = '300px';
        //        //rd.obj.style.left = 0;// parseInt(rd.obj.style.left.replace("px", "")) - leftoffset + "px";
                
        //    }
        //}
    }
    // event handler invoked before DIV element is dropped to the table cell
    rd.event.droppedBefore = function (targetCell) {
        rd.obj.style.width = '100%';
        // set new width to the dropped DIV element
        var width = targetCell.offsetWidth;
        // set width and reset height value
        rd.obj.style.width = (width - 10) + 'px';
        rd.obj.style.height = '';
        //edit시 발생하는 일련번호이슈해결
        //move시에 적용안되게함
        var pos = rd.getPosition();

        if (pos[3] == 0) {//신규로 추가되었을 경우만 적용

            var cnt = 0;
            var maxcnt = 0;
            var tblEditor = document.getElementById(redips.tableEditor),
                divs = tblEditor.getElementsByTagName('DIV');
            for (var i = 0; i < divs.length; i++) {
                // set current DIV element
                var div = divs[i];
                // filter only components
                if (div.className.indexOf('drag') > -1) {
                    if (rd.obj.id.substring(0, 1) == div.id.substring(0, 1))
                        cnt++;
                    //중간번호을 지웠을 경우버그방지
                    if (parseInt(div.id.substring(2)) > maxcnt)
                        maxcnt = parseInt(div.id.substring(2));
                }
            }
            if (maxcnt > cnt) cnt = maxcnt + 1;
            cnt=idMake();
            rd.obj.id = rd.obj.id.substring(0, 2) + cnt;

            var set = {};
            set.id = $(rd.obj).attr("id");
            var clas = $(rd.obj).attr("class").split(" ");
            set.class = clas[clas.length - 1];
            if (set.class == "roundbox1") set.class = "googlechart";
            var onclick = "editObject(" + JSON.stringify(set) + ")";
            $(rd.obj).append("<div><img src='/images/editnote1.png' style='opacity:0.3' class='imdim' onclick=\'" + onclick + "\'/></div>");

        }
    };
    // event handler invoked in a moment when DIV element is dropped to the table
    rd.event.dropped = function (targetCell) {
        var st, 	// source table
			id; 	// DIV id
        // deselect target cell id needed
        rt.mark(false, targetCell);
        var pos = rd.getPosition();

        // define source table
        st = rd.findParent('TABLE', rd.td.source);
        // if source table is table editor then expand DIV element
        if (redips.components === st.id) {
            // define id of dropped DIV element (only first three characters because cloned element will have addition in id)
            id = rd.obj.id.substring(0, 3);
            //			rd.obj.style.borderColor = 'white';
            // send request (input parameter is object reference)
            redips.getComponent(rd.obj, id);
        }
    };
    // delete imctable after DIV element is deleted
    rd.event.deleted = function () {
        //deleteimcsetting("imctable", convertId(prefixFind1(rd.obj.id)));
        updateimctable(menuid, subid, rd.obj.id, "");
    };
};

//#region display layout
initDisplay = function (id, data,insertdv) {
    clearinserted();
    if (typeof data == "undefined" | data=="")
        data = selectimctable(menuid, subid);
    else if (typeof data != "object")
        data = JSON.parse(data);
    if (data == "")
        remoteimctable();
    if (typeof data == "undefined") return false;
    var inittext = "page1", dt = "", wth = "100%";
    if (typeof (data) == "object") {
        if (data.hasOwnProperty("text")) inittext = data.text;
        if (data.hasOwnProperty("table")) dt = data.table;
        if (data.hasOwnProperty("width")) wth = data.width;
    }
    var dv;
    if ($("#tableinsert").length == 0)
        $(" <div id='tableinsert' style='margin-top:10px' class='layout' ></div><div style='clear:both;margin-bottom:20px;'/>").appendTo($($("form")[0]));

    var table = displayLayout(id, dt, wth);
    var tb = $(".layout"), w;
    if (typeof insertdv != "undefined") tb = insertdv;
    tb.empty();
    w = tb.width() + "px";
    tb.attr("style", "float:right;position:relative;width:" + w);
    tb.append(table);
    injectObject(tb);
    documentreadyInsert("resize1", "$(window).resize(function () {refreshLayout();});");
    refreshLayout();
   tb.find("table").first().find("td").css({ padding: "0 3px 3px 0" });
    tb.css({ padding: "0 5px 0 5px" })
    return table;
}
displayLayout = function (id, data, wth) {
    $("#main-menu").show();
    var table = $("<table/>");
    if (id != "") table.attr("id", id);
        table.attr("cellpadding", 0);
        table.attr("cellspcing", 0);
        table.attr("style", "width:100%;");
        $('#main-top>span').show();
    //if mobile
        if (window.matchMedia("only screen and (max-width: 760px)").matches | isMobile()) {
            $("form").removeAttr("style");
            $("body").removeAttr("style");//.css({ width: $(window).width() })
            $('#main-top>span').hide();
            if(isMobile())
            var table = $("<div/>");
            $.each(data, function (rowIndex, r) {
                $.each(r, function (colIndex, c) {
                    if (c.dv)
                        $.each(c.dv, function (dvIndex, d) {
                            var dv = $("<div />");
                            dv.css({ "padding": "0 5px 5px 0","margin":"5px 0 5px 0" });
                            dv.attr("id", d.id);
                            if (d.clas) {
                                dv.attr("class", d.clas);
                                table.append(dv);
                                scanObject(dv);
                            }
                        });
                });
               
            });
        }
        else {
            $.each(data, function (rowIndex, r) {
                var row = $("<tr/>");
                //ttl column num
                var colnum = r.length;
                $.each(r, function (colIndex, c) {
                    if (c.colspan) colnum += parseInt(c.colspan) - 1;
                });
                var unitwidth = Math.round(100 / colnum);
                var realwth = 1024;
                switch (colnum) {
                    case 1:
                        realwth = 1020 / colnum;
                        break;
                    case 2:
                        realwth = 1018 / colnum;
                        break;
                    case 3:
                        realwth = 1010 / colnum;
                        break;
                    default:
                        realwth = 1000 / colnum;
                        break;
                }
                $.each(r, function (colIndex, c) {
                    var cell = $("<td/>");
                    if (c.colspan) {
                        cell.attr("colspan", c.colspan);
                        var width = unitwidth * c.colspan;
                    }
                    else
                        width = unitwidth;
                    if (c.rowspan) cell.attr("rowspan", c.rowspan);
                    if (c.id) cell.attr("id", c.id);
                    if (c.clas) cell.attr("class", c.clas);
                    //style
                    var sty = "", wpct = width;
                    if (widthpct(wth).length > 0)
                        wpct = widthpct(wth)[colIndex];
                    sty = "width:" + wpct + "%;";
                    // sty = "width:" + realwth + "px;";
                    // if (c.style) sty += c.style;
                    if (sty != "" && sty.indexOf("vertical-align") == -1)
                        sty += "vertical-align:top;";
                    cell.attr("style", sty);
                    if (c.dv)
                        $.each(c.dv, function (dvIndex, d) {
                            var dv = $("<div />");
                            if (colIndex < r.length - 1 && rowIndex < (data.length - 1) / colnum)
                                dv.css({ "padding": "0 5px 5px 0" });
                            dv.attr("id", d.id);
                            if (d.clas) {
                                dv.attr("class", d.clas);
                                cell.append(dv);
                                scanObject(dv);
                            }
                        });
                    row.append(cell);
                });
                table.append(row);
            });
        }
    function unitwidth(colnum) {
        return Math.round(100 / colnum);
    }
    //width to pct
    return table;
}
function widthpct(wth) {
    var wpct = [];
    var w = wth.split(','), ttl = 0;

    $.each(w, function (i, k) {
        ttl += parseInt(k);
    });
    $.each(w, function (i, k) {
        wpct.push(Math.round(parseInt(k) / ttl * 100));
    });
    return wpct;
}
injectObject = function (dvid) {
    if (typeof dvid == "undefined") dvid = $("#tableinsert");
    var list = ["jqgrid", "select", "jstree", "googlechart", "fullcalendar", "content", "map", "ifrm", "pivot", "form","rstat","otherpage","html"];
    //if imcdata not exists
    if (sessionStorage.getItem("imcdata") == null && getlogin()!="")
        dataListOnlyAjax();
    $.each(list, function (i, k) {
        $.each(dvid.find("."+k), function (index, data) {
            var id = $(data).attr("id");
            //$(this).removeClass("rectanglebox");
            //$(this).css("width", "100%");
            switch (k) {
                case "jqgrid":
                    jqgridInit(id);
                    break;
                case "select":
                    selectInit(id);
                    break;
                case "jstree":
                    jstreeInit(id);
                    break;
                case "googlechart":
                    googlechartInit(id);
                    break;
                case "fullcalendar":
                    fullCalendarInit(id);
                    break;
                case "content":
                    contentInit(id);
                    break;
                case "map":
                    mapInit(id);
                    break;
                case "ifrm":
                    iframeInit(id);
                    break;
                case "pivot":
                    pivotInit(id);
                    break;
                case "rstat":
                    rstatInit(id);
                    break;
                case "form":
                    formInit(id);
                    break;
                case "otherpage":
                    otherpageInit(id);
                    break;
                case "html":
                    htmlInit(id);
                    break;
            }
        });
    });

}
//#endregion

//#region edit layout
initEdit = function () {
    var nodename = selectimctable(menuid, subid, "");
    if (typeof nodename != "undefined")
        nodename = nodename.text;
    else nodename = "";
    if ($("#tableinsert").length == 0)
        $(" <div id='tableinsert' style='margin-top:10px' class='layout' ></div>").appendTo($($("form")[0]));
  
    $(".layout").empty();
    $(".layout").append(editLayout());
    $("#tblEditor").colResizable({ disable: true });
    tableResize($("#tblEditor"));
    //makecontextmenu();
  
    //submenu tree
    var options = { display: "textbox" };

    //if (menutoggle != "open") menutoggle = "";
    menuTree("imcMenu", options);
    //menutoggle = "admin";
    //append topmenu
    var topm = menuMy("menu"), list = [], tlist = "";;// selectimc("imctable", "menu")
    $(topm).each(function (i, k) {
        list.push(k.title + "," + k.menuid);
    });
    tlist = list.join(";");
    var st = makeCtr(["select", tlist, "selTopmenu", "ddlTextbox|width:90%;padding:5px;margin:5px;", "onchange:retree($(this).val())"]);
    $("<div/>").append(st).insertBefore($("#imcMenu"))
    $("#selTopmenu").val(menuid);
    $("#inNodename").val(nodename);
    $("#inNodename").css({ "width": "80%", "height": "18px" ,"margin":"0 0 10px 3px"});
   
    jscriptInsert("theme", "/js2/jquery-themeroller/jquery.themeswitcher.min.js");
    $("#tableinsert").css({ "margin-top": "10px" });
    funStop();
    //menuBreadcrumbs($($(this)[0]));
    //$("#dvName").empty();
    //var title = "Page Build";
    //$("#dvName").append($("<label style='font-size:2em;padding-top:10px;'>" + title + "</label>"));

}
editLayout = function () {
    var drag, left, right, table1, tr1, td1, dv1, menu;
    //table1 좌측 droppable menu
    table1 = $("<table/>")
    table1.attr("id", "table1");
    table1.append("<colgroup><col width='100'/></colgroup>");
    var tb1 = [["a", "drag clone orange1 jqgrid", "Grid"]
                , ["b", "drag clone green1 select", "Select"]
                , ["c", "drag clone blue1 jstree", "Tree"]
                , ["d", "drag clone yellow1 googlechart", "Chart"]
                , ["e", "drag clone yellow1 fullcalendar", "Calendar"]
                , ["g", "drag clone green1 map", "Map"]
                , ["h", "drag clone blue1 ifrm", "ifrm"]
                , ["f", "drag clone yellow1 content", "Content"]
                , ["i", "drag clone yellow1 pivot", "PivotTable"]
                , ["j", "drag clone yellow1 form", "Form"]
                , ["k", "drag clone yellow1 otherpage", "Otherpage"]
                , ["l", "drag clone yellow1 html", "HTML"]
                , ["m", "drag clone yellow1 rstat", "R"]
    ];
    $.each(tb1, function (i, k) {
        tr1 = $("<tr/>");
        td1 = $("<td/>");
        dv1 = $("<div/>");
        table1.append(tr1);
        tr1.append(td1);
        td1.append(dv1);
        td1.attr("class", "single");
        dv1.attr("id", k[0]);
        dv1.attr("class", "rectanglebox " + k[1]);

        dv1.text(k[2]);
    });
    //blank tr insert
    tr1 = $("<tr/>");
    td1 = $("<td/>");
    dv1 = $("<div style='margin:5px;'/>");
    td1.append(dv1);
    tr1.append(td1);
    table1.append(tr1)

    //trash
    tr1 = $("<tr/>");
    td1 = $("<td/>");
    td1.attr("class", "trash");
    td1.text("Trash");
    tr1.append(td1);
    table1.append(tr1)

    //left
    left = $("<div/>");
    left.attr("id", "left");
    left.append($("<div id='dvmenutoggle'></div>"))
 
    //menu dropdown
    dv1 = $("<div/>");
    dv1.css({"padding-bottom":"5px","height":"20px"});
    dv1.attr("id", "imcMenu");
    left.append(dv1);
    left.append(table1);
    //right
    right = $("<div/>");
    right.attr("id", "right");
    //right-buttontop
    table1 = $("<table />")
    table1.attr("id", "tblToolbox");
    tr1 = $("<tr/>");
    table1.append(tr1);
    right.append(table1);
    var list = //[["Merge", "reSize('dis');redips.merge();reSize('en')"]
        //, ["Split H", "reSize('dis');redips.split();reSize('en')"]
        //, ["Split V", "reSize('dis');REDIPS.table.split('v');reSize('en')"]
         [["R+", "reSize('dis');REDIPS.table.row('tblEditor','insert');reSize('en')"], ["R-", "reSize('dis');delRow();reSize('en')"]
        , ["C+", "reSize('dis');REDIPS.table.column('tblEditor','insert');reSize('en')"], ["C-", "reSize('dis');delCol();reSize('en')"]];
    $.each(list, function (i, k) {
        var inp = $("<input/>");
        td1 = $("<td style='padding:0 0 5px 0;'/>");
        td1.attr("class", "mark");
        inp.attr("type", "button");
        //inp.attr("class", "button mButton");
        inp.attr("value", k[0]);
        inp.attr("onclick", k[1]);
        td1.append(inp);
        tr1.append(td1);
        inp.button();
    });

    //right-middle table
    table1 = $("<table/>")
    table1.attr("id", "tblEditor");
    table1.attr("class", "ui-widget");
    table1.attr("style", "table-layout:fixed;width:100%;");
   
    //var data = selectimc('imctable', convertId('layout_0'));
    var data = selectimctable(menuid, subid);
    var cellwidth = "";
    if (data != "" && typeof (data) != "undefined") {
        var wth = "";
        if (data.hasOwnProperty("width")) {
            wth = data.width;
        }
        if (!data.hasOwnProperty("table") || data.table.length == 0)
            data = [[{ "id": 0, "style": ":" }, { "id": 1, "style": ":" }, { "id": 2, "style": ":" }]];
        else
            data = data.table;
        //else data=[[{"id":0,"style":"vertical-align:top;:","dv":[]}]];
        var tbody = $("<tbody class='ui-widget-body'/>");
        var thead = $("<thead class='ui-widget-header'/>").prependTo(table1);
        $.each(data, function (rowIndex, r) {
            var row = $("<tr/>"), row1 = $("<tr/>");
            $.each(r, function (colIndex, c) {
                cellwidth = parseInt(wth.split(',')[colIndex]) - 10;
                if (rowIndex == 0) {

                    var th = $("<th>&nbsp;</th>");
                    if (wth != "") th.css("width", widthpct(wth)[colIndex] + "%");

                    // if (c.colspan) th.attr("colspan", c.colspan);
                    thead.append(row1);
                    row1.append(th);
                }
                var cell = $("<td/>");
                if (c.colspan) cell.attr("colspan", c.colspan);
                if (c.rowspan) cell.attr("rowspan", c.rowspan);
                if (c.id) cell.attr("id", c.id);
                var cls = "";
                if (c.clas) {
                    cls = c.clas;
                }
                if (colIndex == 0)
                    cls += " left";
                if (colIndex == r.length - 1)
                    cls += " right";
                cell.attr("class", cls);
                var sty = "";
                if (typeof c.style != "undefined") sty = c.style;
                if (sty == "") sty = "vertical-align:top;";
                else if (sty.indexOf("vertical-align") == -1) sty += ";vertical-align:top;";

                cell.attr("style", sty);

                var dv = $("<div/>");
                dv.attr("style", "text-align:right;height:22px;");
                //dv.attr("class", "showhide");
                var ebtn = $("<i style='padding-right:8px;font-size:22px;display:none;' class='fa fa-pencil-square imexpand'  onclick=\"editcell('" + rowIndex + ',' + c.id + "')\">")
                dv.append(ebtn);
                dv.hover(function () {
                    ebtn.show();
                }, function () {
                    ebtn.hide();
                });
                cell.append(dv);
                if (c.dv)
                    $.each(c.dv, function (dvIndex, d) {
                        var dv = $("<div/>");
                        if (d.txt)
                            dv.text(d.txt);

                        dv.attr("id", d.id);
                        if (d.clas) {
                            dv.attr("class", d.clas);
                        }
                        if (d.style) {
                            dv.attr("style", d.style);
                        }
                        dv.css("width", cellwidth)
                        cell.append(dv);
                        var set = {};
                        set.id = d.id;

                        var cls = d.clas;
                        if (typeof cls != "undefined") {
                            cls = cls.split(' ');
                            cls.splice(0, 2);
                            set.class = cls.join(" ");//[cls.length - 1];
                            if (set.class == "roundbox1") set.class = "googlechart";
                        }
                        var onclick = 'editObject(' + JSON.stringify(set) + ')';
                        var jqdata = selectimctable(menuid, subid, set.id);
                        var sty = "";
                        if (jqdata == "") sty = "style='opacity:0.3;'";

                        dv.append("<div><img src='/images/editnote1.png' " + sty + " class='imdim' onclick=\'" + onclick + "\'/></div>");

                    });
                row.append(cell);
            });
            tbody.append(row);
            table1.append(tbody);
        });
    }
    else {
        table1.append("<tr style='vertical-align:top;'><td></td><td></td><td></td></tr>");
    }
    var dv = $("<div />");
    dv.append(table1);
    right.append(dv);
    rowSortable(table1);
    //right-buttonbottom
    var mtoggle = "menutoggle='';";
    switch (menutoggle) {
        case "open":
            mtoggle = "menutoggle='open';";
            break;
        case "template":
            mtoggle = "menutoggle='template';";
            break;
    }
    list = [["inE", "Apply", "funLoading(true);editSave(true); initDisplay('', selectimctable(menuid, subid)); menuInit();"]
                , ["inL", "Save", "funLoading(true);editSave(true);initEdit();redips.init();"]
                , ["inS", "Cancel", "funLoading(true);initDisplay('',selectimctable(menuid,subid))"]];
    dv = $("<div style='padding-top:5px;text-align:right;' />");
    var adminfix = "";
    $.each(list, function (i, k) {
        var inp = $("<input/>");
        inp.attr("id", k[0]);
        inp.attr("type", "button");
        //inp.attr("class", "button sButton");
        inp.attr("value", k[1]);
        //inp.text(k[1]);
      
        if (menutoggle == "admin" && k[0]=="inE")
        adminfix="menutoggle = 'admin'; menuMain();";

        inp.attr("onclick", k[2]+adminfix);
        inp.button();
        dv.append(inp);
        right.append(dv);
    });
    //drag
    drag = $("<div/>");
    drag.attr("id", "drag");
    drag.append(left);
    drag.append(right);
    styleInsert("content", ".content{margin:3px 0 3px 0 !important;}.clone{width:155px !important;}")
    function makeStyle(obj) {
        var result = "";
        if (obj != "")
            $.each(obj, function (i, k) { result += i + ":" + k + ";"; })

        return result;
    }
    
    return drag;
};

delRow = function () {
    //check last row,col has controls?
    var tr = $("#tblEditor tr");
    var tds = $(tr[tr.length - 1]).find("td");
    var emptyrow = true;
    $(tds).each(function (i, k) {
        if ($(k).children().length > 1)
            emptyrow = false;
    });
    if (emptyrow)
        REDIPS.table.row('tblEditor', 'delete');
    else
        swal("Last row is not empty!!");
}
delCol = function () {
    //check last row,col has controls?
    var lasttds=$("#tblEditor:first tr td:last-child");
    var empty = true;
    $(lasttds).each(function (i, k) {
        if ($(k).children().length > 1)
            empty = false;
    });
    if (empty)
        REDIPS.table.column('tblEditor', 'delete');
    else
        swal("Last column is not empty!!");
}
var wtharr = [];
reSize = function (type) {
    var tb = $("#tblEditor");
    tb.attr("class", "ui-widget");
    switch (type) {
        case "dis":
            wtharr = [];
            $("#tblEditor th").each(function (i, k) {
                wtharr.push($(k).css("width"));
            })
            tb.colResizable({ disable: true });
            $("#tblEditor th").parent().remove();
            break;
        case "en":
            //new cell edit wrench insert
            var newwidth = "";
            $("#tblEditor tr").each(function (i, row) {
                $(row).children().each(function (j, cell) {
                    if ($(this).children().length == 0) {
                        $(this).attr("id", j);
                        $(this).attr("style", "vertical-align:top;width:" + $(this).css("width"));
                        $(this).append(makeWrench(i, j));
                        if (i == 0)
                            newwidth += "," + $(this).css("width");
                    }
                });
            });
            //            var smenu = selectimctable(menuid, subid);
            //            smenu.width = smenu.width + newwidth;
            //            updateimctable(menuid, subid, "", smenu);
            //th insert
            var row = $("#tblEditor tr:eq(0)").children();
            var thead = $("<thead class='ui-widget-header'/>").prependTo("#tblEditor");
            var tr = $('<tr/>').prependTo(thead);
            //var tr = $('<tr/>').prependTo("#tblEditor > tbody");
            $.each(row, function (colIndex, c) {
                var tth = $('<th>&nbsp;</th>');
                if(wtharr.length>0)
                tth.css("width",wtharr[colIndex])
                tr.append(tth);
            });
            tableResize(tb);

            break;
    }
    function makeWrench(rindex, cindex) {
        var dv = $("<div/>");
        dv.attr("style", "text-align:right;");
        dv.append("<i style='padding-right:5px;' class='fa fa-square-o imcolor' onclick=\"editcell('" + rindex + ',' + cindex + "')\">");
        return dv;
    }
    rowSortable(tb);
}
editObject = function (obj) {
    editObject.process = function (obj) {
      
       // if (menutoggle == "admin") menutoggle = "";
        datartnctr = "";
        var clsarr = obj.class.split(" "),cls;
        var ctrarr = ['jqgrid', 'select', 'jstree', 'googlechart', 'fullcalendar', 'content', 'map', 'ifrm', 'pivot','rstat', 'form', 'otherpage', 'html'];
        $(clsarr).each(function (i, k) {
            if ($.inArray(k, ctrarr) > -1)
                cls = k;
        })
        switch (cls) {
            case "jqgrid":
                jqEdit(obj.id);
                break;
            case "select":
                selectEdit(obj.id);
                break;
            case "jstree":
                jstreeEdit(obj.id);
                break;
            case "googlechart":
                googlechartEdit(obj.id);
                break;
            case "fullcalendar":
                fullCalendarEdit(obj.id);
                break;
            case "content":
                contentEdit(obj.id);
                break;
            case "map":
                mapEdit(obj.id);
                break;
            case "ifrm":
                iframeEdit(obj.id);
                break;
            case "pivot":
                pivotEdit(obj.id);
                break;
            case "rstat":
                rstatEdit(obj.id);
                break;
            case "form":
                formEdit(obj.id);
                break;
            case "otherpage":
                otherpageEdit(obj.id);
                break;
            case "html":
                htmlEdit(obj.id);
                break;
        }
        $("#tab-Contain>div>.ui-tabs-panel").css({ padding: "5px 0 5px 2px" });
    }
    //obj = JSON.parse(obj);
    var imc = selectimctable(menuid, subid, obj.id), datacode;
    if (typeof imc != "undefined" && imc.hasOwnProperty("data")) {
        if (imc.data.hasOwnProperty("datacode"))
            datacode = imc.data.datacode;
        else if (imc.data.hasOwnProperty("code"))
            datacode = imc.data.code
        if(datacode !="")
            jsonReadAjax("imcdata", "", "code", datacode, dataajaxinsert, ["", "edit", obj]);
        else {
            $("#spdlist").remove();
            $("#spdataajax").remove();
            editObject.process(obj);
        }
    }
    else {
        $("#spdlist").remove();
        $("#spdataajax").remove();
        editObject.process(obj);
    }
}
//tblEditor scheme을 분석해서 data로 만듬
scanTable = function () {
    var rtn = [], trr = [], tdd = {}, dvv = [], objj = {};
    $('#tblEditor').find('tr').each(function (i, tr) {
        trr = [];

        $(tr).children().each(function (j, td) {//td
            if ($(td).prop("tagName") == "TD") {
                if ($(td).find('SPAN').attr("class") != "rowTool") {
                    tdd = {};
                    tdd.id = j;
                    tdd.colspan = $(td).attr("colspan");
                    tdd.rowspan = $(td).attr("rowspan");
                    var sty = $(td).attr("style"), newsty = [];
                    if (sty != "") {
                        sty = sty.split(';');
                        $.each(sty, function (i, k) {
                            var sp = k.split(":");
                            if (sp[0] != "width")
                                newsty.push($.trim(sp[0] + ":" + $.trim(sp[1])));
                        });
                        tdd.style = newsty.join(';');
                    }
                    trr.push(tdd);
                    dvv = [];
                    $(td).children().each(function (k, dv) {//div
                        if (k > 0) {
                            objj = {};
                            objj.id = $(dv).attr("id");
                            $(dv).removeClass("rectanglebox");
                            objj.clas = $(dv).attr("class");
                            objj.style = $(dv).attr("style");
                            if ($(dv).text() != "")
                                objj.txt = $(dv).text();
                            if (Object.keys(objj).length > 0) {
                                dvv.push(objj);
                                tdd.dv = dvv;
                            }
                        }
                    });
                }
            }
        });
        if (trr.length > 0)
            rtn.push(trr);
    });
    return rtn;
}
scanObject = function (dv) {
    var clas = dv.attr("class").split(" ");
    var jid = dv.attr("id");
    dv.css({ "width": "100%" });
    switch (clas[clas.length - 1]) {
        case "jqgrid":
            dv.removeClass("drag clone orange1");
            break;
        case "select":
            dv.removeClass("drag clone green1");
            break;
        case "jstree":
            dv.removeClass("drag clone blue1");
            break;
        case "googlechart":
            dv.removeClass("drag clone yellow1");
            break;
        case "fullcalendar":
            dv.removeClass("drag clone yellow1");
            break;
        case "content":
            dv.removeClass("drag clone green1");
            break;
        case "map":
            dv.removeClass("drag clone yellow1");
            break;
        case "ifrm":
            dv.removeClass("drag clone blue1");
            break;
        case "pivot":
            dv.removeClass("drag clone yellow1");
            break;
        case "rstat":
            dv.removeClass("drag clone yellow1");
            break;
        case "form":
            dv.removeClass("drag clone yellow1");
            break;
        case "otherpage":
            dv.removeClass("drag clone yellow1");
            break;
        case "html":
            dv.removeClass("drag clone yellow1");
            break;
    }
}

//save,delete함께 처리함. savedata=""일 경우 splice로 delete함
//control저장/삭제시 table schemen도 update함(redips.scanTable())
function editSave(remote) {
    //tableEditor layout교체는 redips.scanTable한 결과를 교체함.
    initimctable();
    var storename = 'imctable';
    if (menutoggle == "template") storename = 'imctemplate';
    var imctb = sessionStorage.getItem(storename);   
    imctb = JSON.parse(imctb);
    var sublist = imctb[menutoggle+"submenu"];
    var text = $("#inNodename").val();
    var exist = false;
    var set = {};
    var width = [];
    $("#tblEditor tr:eq(0) th").each(function () {
        width.push($(this).css("width"));
    });
    $.each(sublist, function (i, k) {
        if (k.menuid == menuid && k.subid == subid) {
           
            sublist[i].table = scanTable();
            sublist[i].width = width.join(',');
            set = sublist[i];
            exist = true;
            return false;
        }
    });
    if (!exist) {
        set = {};
        set.menuid = menuid;
        set.subid = subid;
        set.text = text;
        set.parent = menuid;
        if (menutoggle == "template")
            set.templatetype = templatetype;
        set.table = scanTable();
        set.width = width.join(',');
        sublist.push(set);
    }
    if (menutoggle == "template") {
       // updateimc(storename, menutoggle + 'submenu', sublist, "subid", subid)
        sessionStorage.setItem(storename, JSON.stringify(imctb));
        jsonSaveAjax(storename, JSON.stringify(imctb));
        //jsonUpdateAjax(storename, menutoggle + 'submenu', JSON.stringify(set), "subid", subid);
        //console.log(storename, menutoggle + 'submenu', sublist,JSON.stringify(sublist), "subid", subid)
    }
    else {
        updateimctable(menuid, "", "", set);
        sessionStorage.setItem("imctable", JSON.stringify(imctb));
        //remote upload
        if (remote)
            remoteimcupdate("imctable");
    }
    return false;
}
var colwidth = '';
//resizable column width
tableResize = function (tb) {
    var onSampleResized = function (e) {
        var columns = $(e.currentTarget).find("th");
        colwidth = "";
        columns.each(function () {
            colwidth += $(this).width() + ",";
        });
        var tb = selectimctable(menuid, subid);
        tb.width = colwidth.substring(0, colwidth.length - 1);
        updateimctable(menuid, subid, "", tb);
    };

    tb.colResizable({
        liveDrag: true,
        gripInnerHtml: "<div class='grip'></div>",
        draggingClass: "dragging",
        onResize: onSampleResized

    });
}
//dialog로 cell별 style 설정
editcell = function (cellid) {
    var dv = $("<div/>"), sty = "", rspan = "", cspan = "", rc = cellid.split(',');
    $('body').append(dv);
    if ($("#dvtbedit").length > 0) {
        $(this).remove();
    }
    var tb = selectimctable(menuid, subid).table;
    $.each(tb, function (i, k) {
        if (i == rc[0]) {
            $.each(k, function (j, l) {
                if (l.id == rc[1]) {
                    sty = l.style
                    rspan = l.rowspan;
                    cspan = l.colspan;
                }
            });
        }
    });
    if (sty != "") {
        sty = sty.split(';');
        var set = {};
        $.each(sty, function (i, k) {
            var s = k.split(':');
            set[s[0]] = s[1];
        });
        sty = set;
    }

    var w = "", v = "", t = "";
    if (typeof (sty) != "undefined") {
        if (sty.hasOwnProperty("width")) w = sty.width;
        if (sty.hasOwnProperty("vertical-align")) v = sty["vertical-align"];
        if (sty.hasOwnProperty("text-align")) t = sty["text-align"];
    }
    dv.attr("id", "dvtbedit");
    var data = [
        [makeCtr(["span", "Type", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["vertical-align", makeCtr(["select", "top,top;middle,middle;bottom,bottom", "selVt", "inp", ])]
    , ["text-align", makeCtr(["select", "left,left;center,center;right,right", "selTa", "inp", ])]
     , ["colspan", makeCtr(["input", cspan, "", "inp", ])]
      , ["rowspan", makeCtr(["input", rspan, "", "inp", ])]
    ]
    var tb = makeTable("tbStyle", data, "general");

    dv.append(tb);
    dv.dialog({
        buttons: {
            "Save": function () {
                editcellsave(cellid);
                dv.remove();
            },
            Cancel: function () {
                dv.remove();
            }
        }
    });
    dv.addClass('helpinsert').attr("help", 'pagebuild_cell');
    helpinsert();
    if (v != "") $("#selVt").val(v);
    if (t != "") $("#selTa").val(t);
    dv.css("z-Index", 300);

}
editcellsave = function (cellid) {
    var rc = cellid.split(',');
    var rdt = "";
    //rdt["width"] = $("#inpWidth").val();
    rdt += "vertical-align:" + $("#selVt").val() + ";";
    rdt += "text-align:" + $("#selTa").val() + ";";
    var tbs = saveTable("tbStyle");
    var cspan = tbs[2][1];
    var rspan = tbs[3][1];
    var subdt = selectimctable(menuid, subid);
    var tb = subdt.table;
    $.each(tb, function (i, k) {
        if (i == rc[0]) {
            $.each(k, function (j, l) {
                if (l.id == rc[1]) {
                    l.style = rdt;
                    if (cspan != "") l.colspan = cspan; else delete l.colspan;
                    if (rspan != "") l.rowspan = rspan; else delete l.rowspan;
                }
            });
        }
    });
    //table style change
    var row = parseInt(rc[0]) + 1;
    var cell = $("#tblEditor").find("tr:eq(" + row + ")").find("td:eq(" + rc[1] + ")");
    cell.attr("style", rdt);
    if (cspan != "") cell.attr("colspan", cspan); else cell.removeAttr("colspan");
    if (rspan != "") cell.attr("rowspan", rspan); else cell.removeAttr("rowspan");
    rowSortable($("#tblEditor"));
    updateimctable(menuid, subid, "", subdt);
}
//#endregion

//#region 보관파일
// show TD content
showContent = function () {
    // get content of TD cells in right table
    var td1 = getContent('td1'),
		td2 = getContent('td2'),
		td3 = getContent('td3'),
		td4 = getContent('td4'),
    // set reference to the message DIV (below tables)
		message = document.getElementById('message');
    // show block content
    message.innerHTML = 'td1 = ' + td1 + '<br>' +
						'td2 = ' + td2 + '<br>' +
						'td3 = ' + td3 + '<br>' +
						'td4 = ' + td4;
};
// get content (DIV elements in TD)
getContent = function (id) {
    var td = document.getElementById(id),
		content = '',
		cn, i;
    // TD can contain many DIV elements
    for (i = 0; i < td.childNodes.length; i++) {
        // set reference to the child node
        cn = td.childNodes[i];
        // childNode should be DIV with containing "drag" class name
        if (cn.nodeName === 'DIV' && cn.className.indexOf('drag') > -1) { // and yes, it should be uppercase
            // append DIV id to the result string
            content += cn.id + '_';
        }
    }
    // cut last '_' from string
    content = content.substring(0, content.length - 1);
    // return result
    return content;
};

// XMLHttp request object
redips.initXMLHttpClient = function () {
    var XMLHTTP_IDS,
		xmlhttp,
		success = false,
		i;
    // Mozilla/Chrome/Safari/IE7/IE8 (normal browsers)
    try {
        xmlhttp = new XMLHttpRequest();
    }
    // IE (?!)
    catch (e1) {
        XMLHTTP_IDS = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
						'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (i = 0; i < XMLHTTP_IDS.length && !success; i++) {
            try {
                success = true;
                xmlhttp = new ActiveXObject(XMLHTTP_IDS[i]);
            }
            catch (e2) { }
        }
        if (!success) {
            throw new Error('Unable to create XMLHttpRequest!');
        }
    }
    return xmlhttp;
};

// executed when DIV element is dropped to the right table
redips.getComponent = function (obj, id) {
    // open asynchronus request
    //	redips.request.open('GET', redips.ajaxField + '?id=' + id, true);
    //	// the onreadystatechange event is triggered every time the readyState changes
    //	redips.request.onreadystatechange = function () {
    //		// prepare title and layout
    //		var title = obj.innerHTML,
    //			layout = redips.component.split('|');
    //		//  request finished and response is ready (set innerHTML of dropped DIV element
    //		if (redips.request.readyState === 4) {
    //			if (redips.request.status === 200) {
    //				obj.innerHTML = layout[0] + title + layout[1] + redips.request.responseText + layout[2];
    //			}
    ////			// if request status isn't OK
    ////			else {
    ////				obj.innerHTML = 'Error: [' + redips.request.status + '] ' + redips.request.statusText;
    ////			}
    //	    }
    //	};
    //	redips.request.send(null); // send request
};

// delete DIV element from table editor
redips.divDelete = function (el) {
    var div = REDIPS.drag.findParent('DIV', el),	// set reference to the DIV element
		rcell = el.parentNode.cells[1],				// set reference to the right cell of DIV element header
		name = rcell.innerText || rcell.textContent;// set name in a cross-browser manner
    // set name to lower case
    name = name.toLowerCase();
    // confirm deletion
    if (confirm('Delete component (' + name + ')?')) {
        // delete DIV element from table editor
        div.parentNode.removeChild(div);
    }
};

// method shows/hides details of DIV elements sent as input parameter 
redips.details = function (el, type) {
    var divDrag = REDIPS.drag.findParent('DIV', el),	// find parent DIV element
		tbl = divDrag.childNodes[0],	// first child node is table
		div = divDrag.childNodes[1],	// second child node is hidden DIV (with containing component details)
		td = tbl.rows[0].cells[0];		// set reference of the first cell in table header
    // show component details
    if (type === undefined || type === 'show') {
        td.innerHTML = '';
        div.style.display = 'block';
        div.style.zIndex = 999;
        // element with position: absolute is taken out of the normal flow of the page and positioned at the desired coordinates relative to its containing block
        // http://www.quirksmode.org/css/position.html
        div.style.position = 'absolute';
        // http://foohack.com/2007/10/top-5-css-mistakes/ (how z-index works)
        // setting z-index and opacity were messing things up (so opacity should be turned off) 
        divDrag.style.opacity = 1;
    }
        // hide component details
    else {
        td.innerHTML = '+';
        div.style.display = 'none';
        div.style.zIndex = -1;
        div.style.position = '';
        // return opacity value (if opacity is removed from style.css then this line should be removed as well)
        divDrag.style.opacity = 0.9;
    }
};

// save form
redips.save = function () {
    // declare local variables
    var tblEditor = document.getElementById(redips.tableEditor),
		divs = tblEditor.getElementsByTagName('DIV'),
		message = document.getElementById('message'),
		frm,			// form reference inside component (it should be only one form)
		JSONobj = [],	// prepare JSON object
		json,			// json converted to the string
		component,		// component object
		div,			// current DIV element
		pos,			// component position
		i;				// loop variable
    // loop goes through each DIV element collected in table editor
    for (i = 0; i < divs.length; i++) {
        // set current DIV element
        div = divs[i];
        // filter only components
        if (div.className.indexOf('drag') > -1) {
            // initialize component object
            component = {};
            // component id (only first three characters because cloned element will have addition in id)
            component.id = div.id.substring(0, 3);
            // component position
            pos = REDIPS.drag.getPosition(div);	// get component position in editor table and remove first item from array (table index is not needed)
            pos.shift();						// remove first item from array (table index is not needed)
            component.position = pos;			// add position to the component
            // set form reference (there shoud be only one form inside DIV component)
            frm = div.getElementsByTagName('FORM')[0];
            // call method to scan component form and return all form elements with their values
            component.form = redips.form2obj(frm);
            // push values for DIV element as Array to the Array
            JSONobj.push(component);
        }
    }
    // prepare query string in JSON format (only if array isn't empty)
    if (JSONobj.length > 0) {
        json = JSON.stringify(JSONobj);
    }
    //	// open asynchronus request (POST method)
    //	redips.request.open('POST', redips.ajaxSave, true);
    //	// set content type for POST method
    //	redips.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //	// the onreadystatechange event is triggered every time the readyState changes
    //	redips.request.onreadystatechange = function () {
    //		//  request finished and response is ready (set innerHTML of dropped DIV element
    //		if (redips.request.readyState === 4) {
    //			if (redips.request.status === 200) {
    //				message.innerHTML = redips.request.responseText;
    //			}
    //			// if request status isn't OK
    //			else {
    //				message.innerHTML = 'Error: [' + redips.request.status + '] ' + redips.request.statusText;
    //			}
    //	    }
    //	};
    //	redips.request.send('json=' + json); // send POST request
};

// method scans form and returns object as result
redips.form2obj = function (frm) {
    var obj = [],	// result array initialization
		type,		// form element type
		name,		// form element name
		value,		// form element value
		idx,		// selected index
		i, j;		// loop variables
    // loop through each element on form
    for (i = 0; i < frm.elements.length; i++) {
        // define element type and name
        type = frm.elements[i].type;
        name = frm.elements[i].name;
        // switch on element type
        switch (type) {
            case 'text':
            case 'textarea':
            case 'password':
            case 'hidden':
                value = frm.elements[i].value;
                break;
            case 'radio':
            case 'checkbox':
                value = frm.elements[i].checked;
                break;
            case 'select-one':
                idx = frm.elements[i].selectedIndex;
                value = frm.elements[i].options[idx].value;
                break;
                /*
                case 'select-multiple':
                    for (j = 0; j < frm.elements[i].options.length; j++) {
                        frm.elements[i].options[j].selected = false;
                    }
                    break;
                */
        }
        // push element form to the object
        obj.push({ 'type': type, 'name': name, 'value': value });
    }
    return obj;
};

// function merge cells horizontally 
redips.merge = function () {
    // first merge cells horizontally and leave cells marked
    REDIPS.table.merge('h', false);
    // then merge cells vertically and clear cells (second param is true by default)
    REDIPS.table.merge('v');
};

// function splits cells horizontally
redips.split = function () {
    REDIPS.table.split('h');
};

// insert row (below current row)
redips.rowInsert = function (el) {
    var row = REDIPS.drag.findParent('TR', el), // find source row (skip inner row)
		top_row, 								// cells reference in top row of the table editor
		nr, 										// new table row
		lc; 										// last cell in newly inserted row
    // set reference to the top row cells
    top_row = row.parentNode.rows[0].cells;
    // insert table row
    nr = REDIPS.table.row(redips.tableEditor, 'insert', row.rowIndex + 1);
    nr.setAttribute("style", "vertical-align:top;");
    // define last cell in newly inserted table row
    lc = nr.cells[nr.cells.length - 1];
    // copy last cell content from the top row to the last cell of the newly inserted row
    lc.innerHTML = top_row[top_row.length - 1].innerHTML;

    // ignore last cell (attached onmousedown event listener will be removed)
    REDIPS.table.cell_ignore(lc);
};

// remove table row from the table editor
redips.rowDelete = function (el) {
    // find source row (skip inner row)
    var row = REDIPS.drag.findParent('TR', el);
    // confirm deletion
    if (confirm('Delete row?')) {
        // delete row from table editor
        REDIPS.table.row(redips.tableEditor, 'delete', row.rowIndex);
    }
};

// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
    window.attachEvent('onload', redips.init);
}
prefixFind = function (obj) {
    var set = {};
    switch (obj.class) {
        case "jqgrid":
            set.id = "jq" + obj.id;
            set.pager = "pg" + obj.id;
            break;
        case "select":
            set.id = "sel" + obj.id;
            break;
        case "jstree":
            set.id = "js" + obj.id;
            break;
        case "googlechart":
            set.id = "chart" + obj.id;
            break;
    }
    return set;
}
prefixFind1 = function (id) {
    //delete event시 id로 imctable key찾기용
    var revisedid;
    switch (id.substring(0, 1)) {
        case "a":
            revisedid = "jq" + id;
            break;
        case "b":
            revisedid = "sel" + id;
            break;
        case "c":
            revisedid = "js" + id;
            break;
        case "d":
            revisedid = "chart" + id;
            break;
    }
    return revisedid;
}
//#endregion
