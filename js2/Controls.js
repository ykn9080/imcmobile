//#region tab,container
function makeTab(tabarr) {
    /*
    tabarr{id,head,content,options}
    tabarr.id = "tab-nobg";
    tabarr.head = ["Table", "Model"];
    var content = [];
    tabarr.content = content;
    */
    var tab = $(document.createElement('div'));
    var ul = $(document.createElement('ul'));
    var content = $(document.createElement('div'));
    $(tab).attr("id", tabarr.id);

    if (tabarr.hasOwnProperty("class"))
        $(tab).attr("class", tabarr.class);
    $.each(tabarr.head, function (r, k) {
        var li = $(document.createElement('li'));
        var a = $(document.createElement('a'));
        var href = k, html = k;
        if ($.type(k) == "object") {//k=[href:tabid,html:tabname]
            href = k.href;
            html = k.html;
        }
        $(a).attr("href", "#" + href);
        $(a).attr("lang", "en");
        $(a).html(html);
        $(li).append(a);
        $(ul).append(li);
        var tabEl = $("<div />");
        $(tabEl).attr("id", href);
        $(tabEl).append(tabarr.content[r]);
        $(content).append(tabEl);
    });
    $(tab).prepend(ul);
    $(tab).append(content);
    var tabs = $(tab).tabs();
   
    return tab;
}
function makebootstrapTab(tabarr) {
    var tab = $("<div class='container'/>");
    var ul = $("<ul class='nav nav-tabs'/>");
    var content = $("<div class='tab-content'/>");
    tab.attr("id", tabarr.id);
    tab.prepend(ul);
    tab.append(content);
    $.each(tabarr.head, function (r, k) {
        var li = $("<li/>");
        var a = $("<a data-toggle='tab'/>");
        var href = k, html = k;
        if ($.type(k) == "object") {//k=[href:tabid,html:tabname]
            href = k.href;
            html = k.html;
        }
        a.attr("href", "#" + href);
        a.attr("lang", "en");
        a.html(html);
        li.append(a);
        ul.append(li);
        var tabEl = $("<div />");
        tabEl.attr("id", href);

        tabEl.append(tabarr.content[r]);
        content.append(tabEl);
        if (r == 0) {
            li.attr("class", "active");
            tabEl.attr("class", "active");
        }
    });
  
    return tab;
}
function appendTab(tab,tabarr) {
    var ul = tab.find("ul");
    $.each(tabarr.head, function (r, k) {
        var li = $(document.createElement('li'));
        var a = $(document.createElement('a'));
        $(a).attr("href", "#" + k);
        $(a).html(k);
        $(li).append(a);
        $(ul).append(li);
        var tabEl = $(document.createElement('div'));
        $(tabEl).attr("id", k);
        $(tabEl).append(tabarr.content[r]);
        $(tab).append(tabEl);
    });
    var tabs = tab.tabs();

    return tabs;
}
function makePortlet(arr) {
    /*
    arr={};//{id,head,content,options}
    arr.id = "tab-nobg";
    arr.head = ["Table", "Model","Goal"];
    var content = [];
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td></tr></table>");
    content.push("<table id='jqgridedit' ></table><div id='jqpageedit'></div>");
    content.push("333");
    arr.content=content;
    arr.options={columns:[270,100],colchild:[["Table","Goal"],["Model"]]};//multiple column   일 경우 columnwidth
    , 각 column에 위치할 portlet head
    */
    var container = $("<div/>");
    var style = ".column {width: 270px;float: left;padding-bottom: 100px; }";
    if(typeof arr.options.columns !="undefined"){
        $.each(arr.options.columns, function (i, k) {
            style += ".column c"+i+"{width:"+k+"px; !important;}";
        });
    }
    style += ".portlet {    margin: 0 1em 1em 0;padding: 0.3em;}";
    style += ".portlet-header {    padding: 0.2em 0.3em;margin-bottom: 0.5em;position: relative;  }";
    style += ".portlet-toggle {    position: absolute;top: 50%;right: 0;margin-top: -8px;  }";
    style += ".portlet-content {    padding: 0.4em;  }";
    style += ".portlet-placeholder {    border: 1px dotted black;margin: 0 1em 1em 0;height: 50px;  }";
    styleInsert("portlet-css", style);
    var col = [arr.head];
    if (typeof arr.options.colchild != "undefined") {
        col = arr.options.colchild;
    }
    $(col, function (j, l) {
        dvc = $("<div/>");
        dvc.attr("class", "column c"+j);

        $.each(arr.head, function (i, k) {
            dvh = $("<div/>");
            dvh.attr("class", "portlet");
            dv = $("<div/>");
            dv.attr("class", "portlet-header");
            dv.text(k);
            dvh.append(dv);
            dv = $("<div/>");
            dv.attr("class", "portlet-content");
            dv.text(arr.content[i]);
            dvh.append(dv);
            if($.inArray(k,l)>-1)
            dvc.append(dvh);
        });
        container.append(dvc);
    });

    $(".column").sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all",
        stop: function (event, ui) {
            console.log('hhh');
        },
        update: function (event, ui) {
            var inp = makeinput();
            var vv = [];
            $(".portlet-header").each(function (i) {
                vv.push($(this).text());
            });
            inp.val(vv.join(','));
        }
    });

    $(".portlet")
            .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
            .find(".portlet-header")
            .addClass("ui-widget-header ui-corner-all")
            .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $(".portlet-toggle").click(function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });
    return container;
}
function makeAccordion(arr) {
    /*
    arr={id,header,content,options}
    arr.id = "tab-nobg";
    arr.head = ["Table", "Model"];
    var content = [];
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td></tr></table>");
    content.push("<table id='jqgridedit' ></table><div id='jqpageedit'></div>");
    arr.content = content;
    */
    accordioncss();
    var id = "accord";
    if (arr.id != "") id = arr.id;
    var accord = $("<div />");
    accord.attr("id", id);
    accord.remove();
    var dvg, dv, h;

    $.each(arr.head, function (i, k) {
        dvg = $("<div/>");
        dvg.attr("class", "group");
        dv = $("<div/>");
        dv.append(arr.content[i]);
        h = $("<h3/>");
        h.append(k);
        //        dvg.append(h);
        //        dvg.append(dv);
        //        accord.append(dvg);
        accord.append(h.outerHTML());
        accord.append(dv.outerHTML());
    });
    accord.accordion({
        header: "h3",
        collapsible: true,
        active: 0,
        heightStyle: "content"
    })
    .sortable({
        axis: "y",
        handle: "h3",
        stop: function (event, ui) {
            //ui.item.children( "h3" ).triggerHandler( "focusout" );
            $(this).accordion("refresh");
        },
        //tab order change & save state
        update: function (e, ui) {
            var inp = makeinput();
            var vv = [];
            $(".ui-accordion-header").each(function (i) {
                vv.push($(this).text());
            });
            inp.val(vv.join(','));
        }
    });
//    accord.accordion({
//        event: "click",
//        collapsible: true,
//        active: 0
//    });
//    accord.accordion();
    return accord;
}
function makeinput() {
    $("#inporder").remove();
    var inp = $("<input/>");
    inp.attr("id", "inporder");
    inp.attr("type", "hidden");
    $(document.body).append(inp);
    return inp
}
function makeContainer(conarr) {
    var container = "";
    if (typeof (conarr) == "undefined") var conarr = {};

    if (!conarr.hasOwnProperty("id")) {
        conarr.id = "dvContainer";
    }
    else
        $(conarr.id).remove();
    if (conarr.hasOwnProperty("parent")) {
        $("#" + conarr.parent).append(conarr.body).append(conarr.bottom);
    }
    else {
        if ($("#" + conarr.id).size() == 0) {
            container = $(document.createElement('div'));
            $('body').append(container);
            $('body').append("<div class='fade' style='display:block;z-index:20;'></div>");// onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();\"></div>");
            $(container).resizable();
        }

        else
            container = $("#" + conarr.id);
        if (!conarr.hasOwnProperty("class"))
            conarr.class = "pdiv";
        if (!conarr.hasOwnProperty("css"))
            conarr.css = {
                "z-index": "401",
                "border": "solid 1px #97BCE1",
                "-moz-box-shadow": "0 3 3px #000000",
                "-webkit-box-shadow": "0 3 3px #000000",
                "-moz-border-radius": "5px",
                "-webkit-border-radius": "5px",
                "padding": "5px",
                "background-color": "#4A5D84",
                "width": "840px",
                "height": "auto",
                "position": "absolute",
                "top": "20%",
                "left": "20%"
            }
        if (!conarr.hasOwnProperty("top"))
            conarr.top = "<div id='dvContainTop' onmouseover=\"enabling('" + conarr.id + "')\" onmouseout=\"disabling('" + conarr.id + "')\" style='text-align:right;'><img onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();\" class='imexpand' src='/images/closegray.png' /></div>";


        container.css(conarr.css);
        if ($("#dvContainTop").length == 0)
            $(container).prepend(conarr.top);
        $(container).attr("id", conarr.id);
        $(container).attr("class", conarr.class);

        $(container).append(conarr.body);
        $(container).append(conarr.bottom);
    }
    return container;
}
function enabling(that) {
    $("#" + that).draggable().draggable('enable');
}
function disabling(that) {
    $("#" + that).draggable('disable');
}
//#endregion

//#region select
function makeSelect(srcdata, field) {
    //srcdata:json format data
    //filed=["optgroup","code","name"];
    //options={placeholder:"-- select --",selected:[code array],disabled:[code array],multiple:false,
    // width:200,multiplewidth:55,selectAll:false,single:true,position:top,filter:true,isOpen:true,keepOpen:true, styler: function(value) {
    //if (value == '1') {return 'background-color: #ffee00; color: #ff0000;';}}}

    var sel = $("<select />");

    //option create
    var rtn = [], opt = [];
    $.each(srcdata, function (key, data) {
        opt = [];
        switch (typeof (field)) {
            case "undefined":
                //find distinct value
                if (!arraycheckexist(rtn, data)) {
                    rtn.push(["",data,data]);
                }
                break;
            default:
                //get all values
                if (field[0] != "")
                    opt.push(data[field[0]]);
                else
                    opt.push('');
                //find distinct value
                if (!arraycheckexist(rtn, data[field[1]])) {
                    opt.push(data[field[1]]);
                    opt.push(data[field[2]]);
                    rtn.push(opt);
                }
                break;
        }
    });

    $.each(rtn, function (i, k) {
        if (k[0] != "") {
            var optg = $("<optgroup />");
            optg.attr("label", k[0]);
            sel.append(optg);
        }
        var opt = $("<option />");
        opt.attr("value", k[1]);
        opt.text(k[2]);
        if (optg)
            optg.append(opt);
        else
            sel.append(opt);
    });
    return sel;
}
function makeSelectEvent(id) {
    var rtncss = cssInsert("multiple-select-css", "/js2/jquery-multiple-select/multiple-select.css");
    var rtnjs = jscriptInsert("multiple-select-js", "/js2/jquery-multiple-select/jquery.multiple.select.js");
    var msec = 0;
    if (rtncss == true | rtnjs == true) msec = 1500;
    sleep(msec);

    var ctr = selectimctable(menuid, subid, id); //var ctr = selectimc("imctable", pathname);

    if (typeof ctr == "undefined")
        ctr = imctableAjaxRead(id);
    else {
        var ctrdata = ctr.data;
        var dt = selectimcdata("imcdata", ctrdata.datacode).datalist;
        if (typeof dt == "undefined") {
            dataListAjax(ctrdata.datacode, false);
            dt = selectimcdata("imcdata", ctrdata.datacode).datalist;
        }
        var filter = '';
        if (ctrdata.hasOwnProperty('filter')) filter = ctrdata.filter;
        dt = applyFilter(dt, filter);

        var sel = makeSelect(dt, ctr.setting.field);

        if (ctr.setting.options.multiple) {
            $(sel).attr("class", "multiselect");
            $(sel).attr("multiple", "multiple");
        }
        else {
            var firstline = "";
            if (typeof ctr.setting.placeholder != "undefined")
                firstline = ctr.setting.placeholder;
            $(sel).prepend("<option value=''>" + firstline + "</option>");
            $(sel).css("margin", "3px 0 3px 0");
            //$(sel).val('');
            $("#" + id + " option:eq(0)").attr("selected", "selected");
        }


        console.log(ctr.setting.options);
        if (ctr.hasOwnProperty("event")) {
            var event = ctr.event;
            if (!event.button) {
                //documentreadyInsert("onchange" + id, "$('#sel"+id+"').click(function () { eventInit('" + id + "',$('#sel"+id+"').val()); });");
                $(sel).attr("onchange", "eventInit('" + id + "',$('#sel" + id + "').val());");
            }
        }
    }
    return sel;
}
function selectInit(id) {
    var sel=makeSelectEvent(id);
    $(sel).attr("id", "sel" + id);
    $("#" + id).empty();
    $("#" + id).append($(sel));
    var ctr = selectimctable(menuid, subid, id);
    if (typeof ctr !="undefined" && ctr.hasOwnProperty("event")) {
        var event = ctr.event;
        if (event.button) {
            var btn = $("<button style='margin:0 0 5px 5px;padding:0' onclick=\"eventInit('" + id + "',$('#sel" + id + "').val());\">go</button>");
            btn.button().height(25);
            $("#" + id).append(btn);
            $(sel).css("height", "25px");
        }
    }

    return $(sel);
}
function makeSelectDisplay(id) {
    var rtn = "";
    var sel = makeSelectEvent(id);
    if (typeof sel != "undefined") {
    sel=sel.outerHTML();
        sel = sel.split('<option');
        $(sel).each(function (i, k) {
            if (i == 0)
                rtn = k + "\n";
            else {
                rtn += "    <option" + k + "\n";
                if (k.indexOf("</select>") > -1) {
                    k = k.replace("</select>", "");
                    //rtn += "</select>";
                }
            }
        });
    }
    return rtn;
}
function multipleselectAgain(list) {
    // var list = selectimc('imcLayout', convertId('0'));
    $.each(list, function (i, k) {
        $.each(k, function (j, l) {
            if (Array.isArray(l.dv)) {
                var arr = l.dv[0];
                if (arr.txt = "Select") {
                    var pathname = convertId("sel" + arr.id);
                    var ctr = selectimctable(menuid,subid,id);//var ctr = selectimc("imctable", pathname);
                   if (typeof ctr == "undefined") {
                        ctr = imctableAjaxRead(arr.id);
                    }
                    if (ctr.setting.options.multiple) {
                    console.log(ctr.setting.options.multiple)
                        $("#sel" + arr.id).multipleSelect(ctr.setting.options);
                    }
                }
            }
        });
    });
}
function selectEdit(id) {
    var conarr = {};
    conarr.id = "container"+id;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting","Event", "Data"];
    var content = [];

    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' value='Render'  onclick=\"selEditSave();selectInit('"+id+"');$('#" + conarr.id + "').remove();$('.fade').remove();\"/>&nbsp;";
    btn += "<input type='button' value='Save'  onclick=\"selEditSave();\"/>&nbsp;";
    btn += "<input type='button' value='Cancel'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();menutoggle='admin';\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + id + "</label>";

    var code = "Code:<label id='lbSelcode'>" +id+ "</label>";
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'>"+code+"<div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
    "<td style='vertical-align:top;'><div id='dvtx' style='display:block;padding:5px;'>" +
    "<textarea id='txseledit' rows='20' cols='13' style='width:100%;'></textarea></div></td></tr><tr><td colspan='2'>" + btn + "</td></tr></table>");
    content.push(eventEdit(id));
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    //container complete
    conarr.body = tab;
    var container = makeContainer(conarr);

    //jqgrid scheme & srcdata
    var gdt = imctableAjaxRead(id);
    var datacode = "";
    if (typeof(gdt)!="undefined" && gdt.datacode) {
        datacode = gdt.datacode;

        var chk = jscriptInsert("multiple-select-js", "/js2/jquery-multiple-select/jquery.multiple.select.js");
        var msec = 0;
        if (chk) msec = 1000;
        sleep(msec)
        selEditTable(id, gdt);
        eventEdit(id);
        if (gdt.hasOwnProperty("setting"))
            if (gdt.setting.hasOwnProperty("multiple"))
                if (gdt.setting.multiple == true) {
                    var id = "ingrp";
                    var child = $('.indent.' + id).parent().parent();

                    child.show();
                }
    }
            $("#txseledit").val(makeSelectDisplay($("#lbSelcode").text()));
    //tabclick event
    var tabb = $('#' + tabarr.id);
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    selectEdit($("#lbSelcode").text());
                    break;
                case 2:
                    dataTabClick($("#lbSelcode").text());
                    break;
            }
        }
    });
    //button init
    $("input[type='button']").button();

}
function selEditTable(selid, gdt) {
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle", sty);

    var optgroup = "", value = "", text = "", width="",placeholder = "", isOpen = false,keepOpen=false, multiple = false, selectAll = false;
    if (gdt) {
        //var imcdata = selectimc("imcdata", gdt.datacode);
        var src = selectimcdata("imcdata", gdt.datacode).datalist;
        var dt = src;
        if (gdt.filter.length > 0)
            dt= applyFilter(src, gdt.filter);
        var columnlist = [];
        $.each(dt[0], function (i, k) {
            columnlist.push(i + "," + i);
        });
        columnlist.unshift("select,");

        var st = gdt.setting;
        if (st) {
            if (st.optgroup != "") optgroup = st.optgroup;
            if (st.value != "") value = st.value;
            if (st.text != "") text = st.text;
            if (st.multiple != "") multiple = st.multiple;
            if (st.width != "") width= st.width;
            if (st.placeholder != "") placeholder = st.placeholder;
            if (st.isOpen != "") isOpen = st.isOpen;
            if (st.selectAll != "") selectAll = st.selectAll;
            if (st.keepOpen != "") keepOpen = st.keepOpen;
        }
    }

    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["optgroup", makeCtr(["select", InsertSelected(dt[0], optgroup),"", "inp", ])]
    , ["value", makeCtr(["select", InsertSelected(dt[0], value), "", "inp", ])]
    , ["text", makeCtr(["select", InsertSelected(dt[0], text), "", "inp", ])]
    , ["width", makeCtr(["input", width, "", "inp", ])]
    , ["1stline", makeCtr(["input", placeholder, "", "inp", ])]
    ,[makeCtr(["span", "multiple", , "expcol", , ]), makeCtr(["input:checkbox", multiple, "ingrp", , "onclick:toggle($(this))"])]

     , [makeCtr(["span", "selectAll", , "indent ingrp", , ]), makeCtr(["input:checkbox", selectAll, "", "inp", ])]
      , [makeCtr(["span", "isOpen", , "indent ingrp", , ]), makeCtr(["input:checkbox", isOpen, "", "inp", ])]
        , [makeCtr(["span", "keepOpen", , "indent ingrp", , ]), makeCtr(["input:checkbox", keepOpen, "", "inp", ])]
    //, [makeCtr(["span", "groupField", , "indent ingrp", ]), makeCtr(["select", , "", "inp", ])]
    ]
    var tb = makeTable("tes1", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="reloadTable(\"\")" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","class":"ui-widget-footer"}'];
    var tb1 = appendFooter(tb, foot);

    $("#dvtable").append(tb1);
    $('.indent').parent().parent().hide();

}
function selEditSave() {
    var jqset = saveTable("tes1");
    var selid = $("#lbSelcode").html();
    //var combine = selectimc("imctable", convertId(selid));
    var combine = selectimctable(menuid, subid, selid);
    if (combine == ""| typeof(combine)=="undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = selid;
    }
    var setting = {},options = {};
    setting.field = [];
    $.each(jqset, function (i, k) {
        setting[k[0]] = k[1];
        if(i<3)
        setting.field.push(k[1]);
    });
 //options={placeholder:"-- select --",selected:[code array],disabled:[code array],multiple:false,
    // width:200,multiplewidth:55,selectAll:false,single:true,position:top,filter:true,isOpen:true,keepOpen:true, styler: function(value) {
    //if (value == '1') {return 'background-color: #ffee00; color: #ff0000;';}}}
    options.width = jqset[3][1];
    options.placeholder = jqset[4][1];
    options.multiple = jqset[5][1];
    options.selectAll = jqset[6][1];
    options.isOpen = jqset[7][1];
    options.keepOpen = jqset[8][1];
    if(countObject(options)>0)
    setting.options = options;
    combine.setting = setting;
    var out = '';

    //imcsetting("imctable", convertId(selid), JSON.stringify(combine));
    if(combine !=null)
    updateimctable(menuid, subid, selid, combine);
    $("#txCodeshow").val(out);
    $("#txseledit").val(makeSelectDisplay(selid));
}
//#endregion

//#region archive
function archiveList(dt, option) {
    // jqgrid list
    $("#archivegdt").remove();
    var ctrid = "";
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("ctrid")) ctrid = option.ctrid;
    }
    else option = {};

    //var dt = selectimc("imclist", option.type);
    var gridid = "tbList", pagerid = "dvListpager", datasrc = [];
    //top list/gallery toggle button
    var wrapdiv = $("<div id='dvwrap'/>");
    var ibtn2 = $("<i class='fa fa-th-large fa-2x imdim' val='2' style='margin-right:5px' onclick=\"$('#dvgallery').show();$('#gbox_tbList').hide();\"/>");
    var ibtnlist = $("<i class='fa fa-align-justify fa-2x imdim' val='list'  style='margin-right:5px' onclick=\"$('#dvgallery').hide();$('#gbox_tbList').show();\" />");
    var ibtn1 = $("<i class='fa fa-th fa-2x imdim'  val='1'  style='margin-right:5px' onclick=\"$('#dvgallery').show();$('#gbox_tbList').hide();\"/>"),
        ibtn3 = $("<i class='fa fa-square fa-2x imdim' val='3'   style='margin-right:5px' onclick=\"$('#dvgallery').show();$('#gbox_tbList').hide();\"/>");
  
    wrapdiv.append(ibtn1).append(ibtn2).append(ibtn3).append(ibtnlist);
    var tcontain = $("<div style='margin:10p 0 0 0;'/>"), tb = $("<table width='100%'/>"), tr = $("<tr/>"), td = $("<td  style='padding:0;width:60%;'/>");
    var addbtn=$("<i class='fa fa-plus-square fa-2x imdim'/>");
    tcontain.append(tb); tb.append(tr); tr.append(td);
    if(ctrid=="")td.append(addbtn);
    var td=$("<td style='text-align:right;padding:0'/>");
    tr.append(td);td.append(wrapdiv);
    ibtnlist.click(function () { $('#dvgallery').hide(); enlargesize($(this)); });
    ibtn2.click(function () { arListGallery(dt, 2, ctrid, option); enlargesize($(this)); });
    ibtn3.click(function(){ enlargesize($(this));arListGallery(dt, 1,ctrid,option);});
    ibtn1.click(function () { enlargesize($(this)); arListGallery(dt, 3, ctrid, option); });
    function enlargesize(that) {
        that.siblings().css({"opacity":1});
        that.css({ "opacity": 0.6 })
    }
    addbtn.click(function () {
        var newcode = "ar" + idMake();
        option.code = newcode;
        option.src = "list";
        archiveEdit(option);
    })
    var dvjq = $("<div />");
    dvjq.append(tcontain);
    dvjq.append($("<table id='" + gridid + "'/>"));
    dvjq.append($("<div id='" + pagerid + "' />"));

    dvjq.append($("<div id='dvgallery' />"));
    var contain = "dvadmin";
    if (ctrid != "")
        contain = "tab-Contain";
    var lbtitle = $("#dvName").find("label");
    if(typeof option!="undefined" && option.hasOwnProperty("type"))
    lbtitle.text(option.type.capitalize() + " List");

    $("#" + contain).empty();
    $("#" + contain).append(dvjq);
    if (ctrid != "")
        $("#lbArchivetitle").text(option.type.capitalize() + " List");
    
    $(dt).each(function (i, k) {
        var set = {};
        set.code = k.code;
        set.name = k.name;
        set.desc = k.desc
        datasrc.push(set);
    });
    arListGrid(dt, datasrc, gridid, pagerid, ctrid, option);  
    arListGallery(dt, 2,ctrid,option);
    if (option.hasOwnProperty("initial") && option.initial == "list") {
        enlargesize(ibtnlist); $('#dvgallery').hide();
    }
    else {
        enlargesize(ibtn2); $('#gbox_tbList').hide();
    }
    if (dt.length == 0 ) {
        $('#gbox_tbList').show();
        $('#dvgallery').hide();
    }
   
    function arListGrid(dt, datasrc, gridid, pagerid, ctrid, option) {

        $("#" + gridid).jqGrid("GridUnload");
        var colmodel = []; var colname = ["code", "name", "desc"];
        colmodel.push({ name: "code", width: 100 });
        colmodel.push({ name: "name", width: 100 });
        colmodel.push({ name: "desc", width: 150 });
        colname.push('');
        colmodel.push({ name: 'del', width: 15, sortable: false });
        colname.push('');
        colmodel.push({ name: 'edit', width: 15, sortable: false });
        if (typeof ctrid != "undefined") {
            colname.unshift('');
            colmodel.unshift({ name: 'sel', width: 15, sortable: false });
        }
        var options = {
            colNames: colname,
            colModel: colmodel,
            datatype: "local",
            data: datasrc,
            height: "auto",
            autowidth: true,
            shrinkToFit: true,
            rowNum: 10,
            rowList: [5, 10, 20, 30],
            pager: pagerid,
            //caption: "Data View",
            sortable: true,
            onCellSelect: function (rowid, iCol) {
                var list = jQuery("#" + gridid).getRowData(rowid);
                var namelist = Object.keys(list);
                switch (namelist[iCol]) {
                    //case "sel":
                    //    selectList(type, list.code, ctrid);
                    //    break;
                    case "edit":
                        option.src = 'list';
                        var dtt = $.grep(dt, function (a) {
                            return a['code'] == list.code;
                        });
                        option.gdt = dtt[0];//selectimc("imclist", option.type, "code", list.code);
                        //option.code = list.code;
                        //option.name = list.name;
                        //option.desc = list.desc;
                        $( ["code", "name", "desc"]).each(function (a,b) {
                            option[b] = list[b];
                            delete option.gdt[b];
                        });
                        if (ctrid != "") {
                            option.src = "temp";
                            var ar = {};
                            ar.type = option.type;
                            ar.code = option.code;
                            ar.name = option.name;
                            ar.desc = option.desc;
                            option.gdt.archive = ar;
                        }
                        funLoading(true);
                        archiveEdit(option);
                        break;
                    case "del":
                        if (checkCookie('Delete_Archive')) 
                            exedel();
                        else
                            swal({
                                title: "Are you sure?"
                                , text: "<div>You will not be able to recover this file!</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('Delete_Archive');\">10264</a></div>"
                                , type: "warning"
                                , showCancelButton: true
                                , confirmButtonColor: "#DD6B55"
                                , confirmButtonText: "Yes, Delete it!"
                                , cancelButtonText: "No, never!"
                                , closeOnConfirm: true
                                , closeOnCancel: true
                                        , html: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    exedel();
                                }
                            });
                        function exedel() {
                            jsonDelAjax("imclist", option.type, "code", list.code,archiveList, [option]);
                        }
                        break;
                }
                lbtitle.text(type.capitalize().replace("List", "Edit"));
            },
            gridComplete: function () {
                var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var rowarr = jQuery("#" + gridid).getRowData(cl);
                    var selicon = 'ui-icon-check';
                    if (rowarr.code == selcode)
                        selicon = ' ui-icon-circle-check';

                    be = "<span class='ui-icon " + selicon + "'  />";
                    ae = "<span class='ui-icon ui-icon-pencil'  />";
                    ce = "<span class='ui-icon ui-icon-trash'  />";
                    var ctr = { edit: ae, del: ce };

                    if (typeof ctrid != "undefined")
                        ctr = { edit: ae, sel: be, del: ce };
                    jQuery("#" + gridid).jqGrid('setRowData', ids[i], ctr);
                }
            }
        };
        jQuery("#" + gridid).jqGrid(options);
        jQuery("#" + gridid).jqGrid('navGrid', '#' + pagerid, { edit: false, add: false, del: false, refresh: false, search: false });
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption: "add",
            buttonicon: "ui-icon-plus",
            onClickButton: function () {
                var newcode = "ar" + idMake();
                option.code = newcode;
                option.src = "list";
                archiveEdit(option);
            }
        });
    }
}
function arListGallery(dt, colnum, ctrid, option) {
    $("#dvgallery").empty();
    var pad = [15, 40, 60];
    var wth = (parseInt($("#dvgallery").width()) - pad[colnum - 1]) / colnum;
    if (typeof colnum == "undefined") colnum = 2;
    var tb = $("<table id='tbgallery' width='100%' cellpadding='5'/>"), tbody = $("<tbody/>"), tr, td, tds, dv, header, title, editbtn, delbtn1;

    $("#dvgallery").append(tb); tb.append(tbody);
    var cnt = parseInt(colnum), tdwth = 980 / cnt;
    if (cnt == 1) tdwth = 1000;
    arListGallery.ctrpreview = ctrpreview;
    arListGallery.googlechartpreview = googlechartpreview;
    $(dt).each(function (i, k) {
        if (cnt == colnum && dt.length != i) {
            tr = $("<tr/>"), tds = "";
            for (n = 0; n < colnum; n++) {
                if (n == 0)
                    tds += "<td style='vertical-align:top;width:" + tdwth + "px'/>";
                else
                    tds += "<td style='vertical-align:top;'/>";
            }
            tr.append($(tds));
            tbody.append(tr);
            cnt = 0;
        }
        dv = $("<div class='imdim ui-widget-content' style='height:200px;overflow:hidden;padding-top:5px;'/>");
        header = $("<div class='ui-widget-header' style='height:30px;'></div>");
        title = $("<div style='margin:3px 0 0 5px;font-size:14px;float:left'>" + k.name + "</div>");
        if (k.desc != "") title.attr("title", k.desc);
        delbtn1 = $("<i style='margin:0 10px 0 0' class='fa fa-trash fa-lg imdim' val='" + k.code + "'/>");
        editbtn = $("<i class='fa fa-pencil fa-lg imdim' val='" + k.code + "'/>");
        editdv = $("<div style='float:right;padding:10px 10px 0 0'></div>");
        editdv.append(delbtn1).append(editbtn);
        header.append(title); header.append(editdv);
        cnt++
        //var tdnth = $("#tbgallery>tbody>tr:last-child>td:nth-child(" + cnt + ")");
        var tdnth = tr.find("td:nth-child(" + cnt + ")").last();
        cnt--

        tdnth.append(header);
        tdnth.append(dv);
        paginathing(tb);
        tb.attr("id", "tbgallery");
        editbtn.on("click", function () {
            var tt = $(this).attr("val"), notexternal = true;
            if (tt != "") {
                funLoading(true);
               
                if (typeof option == "undefined") option = {};
                if (option.hasOwnProperty('src') && option.src.indexOf("external") > -1) notexternal = false;
               if(notexternal){
                    option.src = 'list';
                    var dtt = $.grep(dt, function (a) {
                        return a['code'] == k.code;
                    });
                    option.gdt = dtt[0];
                    option.type = k.type;
                    $(["code", "name", "desc"]).each(function (a, b) {
                        option[b] = k[b];
                        delete option.gdt[b];
                    });
                }
              
                if (ctrid != "") {
                    if (notexternal)
                        option.src = "temp";
                    else {
                        option.gdt = k;
                        $(["menuid", "subid", "dvid"]).each(function (a, b) {
                            delete option.gdt[b];
                        });
                    }
                    var ar = {};
                    ar.type = option.type;
                    ar.code = option.code;
                    ar.name = option.name;
                    ar.desc = option.desc;
                    option.ctrid = ctrid;
                    option.gdt.archive = ar;
                }
                archiveEdit(option);

                console.log(option)
            }
        });
        delbtn1.on("click", function (e) {
            if (checkCookie('Delete_Archive_Gallery')) {
                exe();
            }
            else
                swal({
                    title: "Are you sure?"
                    , text: "<div>You will not be able to recover this file!</div><div style='margin:0'>" +
                        "<a  class='linkbtn' onclick=\"closenoask('Delete_Archive_Gallery');\">Don't ask</a></div>"
                    , type: "warning"
                    , showCancelButton: true
                    , confirmButtonColor: "#DD6B55"
                    , confirmButtonText: "Yes, Delete it!"
                    , cancelButtonText: "No, never!"
                    , closeOnConfirm: true
                    , closeOnCancel: true
                            , html: true
                },
                function (isConfirm) {
                    if (isConfirm) {
                        exe();
                    }
                });

            function exe() {
                var tt = $(e.currentTarget).attr("val")
                if (tt != "") {
                    jsonDelAjax("imclist", k.type, "code", tt, archiveList, [option]);
                }
            }
        });

        cnt++;

        switch (k.type) {
            case "jstree":
                dv.attr("id","dvtree"+k.code)
                jsonReadAjax("imclist", k.type, "code", k.code, jstreeInitmake, [ "dvtree"+k.code]);
                break;
            case "form":
                formInit(k.code, { contain: dv, gdt: k });
                break;
            case "googlechart":
                if (k.hasOwnProperty("data") && k.data.hasOwnProperty("datacode")) {
                    jsonReadAjax("imcdata", "", "code", k.data.datacode, arListGallery.googlechartpreview, [k, dv, wth]);
                }
                else {
                    googlechartpreview("", k, dv, wth);
                }
                break;
            case "content": case "map":
                if (k.hasOwnProperty("data") && k.data.hasOwnProperty("datacode"))
                    jsonReadAjax("imcdata", "", "code", k.data.datacode, arListGallery.ctrpreview, [k.type, k, dv]);
                else
                    ctrpreview("", k.type, k, dv);
                break;
            case "fullcalendar":
                dv.attr("id", k.code);
                fullCalendarInit(k.code);
                break;
            case "jqgrid":
                dv.attr("id", k.code);
                dv.attr("class", "jqgrid");
                var gridid = "jq" + k.code;
                var pagerid = "pg" + k.code;
                dv.append($("<table id='" + gridid + "' />"));
                dv.append($("<div id='" + pagerid + "' />"));

                jqgridInit(gridid, { gdt: k }, setgridwidth, [gridid, tdwth]);
                break;
            case "pivot":
                dv.attr("id", k.code);
                dv.attr("class", "pivot");
                pivotInit(k.code, k);
                break;
        }
    });

    function googlechartpreview(data, gdt, dv, wth) {
        var rtn = googlechartdt(gdt, data);
        var options = {}, ctype = "ColumnChart", layout, flist = "", slist = "", val = "", ser = "", ax = "", json;
        json = rtn.json, options = rtn.options, ctype = rtn.ctype, flist = rtn.flist, slist = rtn.slist;
        if (gdt.hasOwnProperty("options")) gdt.options.width = wth;
        drawDashboard(dv, gdt, json,data)

    }
    function ctrpreview(dt, type, gdt, dv) {
        if (dt != "")
            gdt.data = dt;
        dv.attr("id", gdt.code);
        var option = {};
        option.gdt = gdt;
        switch (type) {
            case "content":
                contentInit(gdt.code, option);
                break;
            case "map":
                mapInit(gdt.code, option);
                break;
        }

    }
    function makeoption(gdt) {
        var dt = {};
        dt.src = 'list';
        $(["code", "name", "desc", "type"]).each(function (i, k) {
            dt[k] = gdt[k];
            delete gdt[k];
        });
        dt.gdt = gdt;
        return dt;
    }
    //arListGallery.getdata = getdata;
}
function archiveEdit(option) {
    $("#archivegdt").remove();
    $("#spdataajax").remove();
    $("#spdlist").remove();
    $("#dvadmin").append($("<span style='display:none' id='archivegdt'></span>"));
    var gdtstr = "",datacode='';
    if (typeof option != "undefined" && option.hasOwnProperty('gdt') &&  option.gdt.hasOwnProperty('data') && option.gdt.data.datacode !="" && Object.keys(option.gdt).length>0) {
        gdtstr = JSON.stringify(option.gdt);
        if(option.src!="temp" )
        $("#archivegdt").text(gdtstr);
        if (option.gdt.data.hasOwnProperty("datacode"))
            datacode = option.gdt.data.datacode;
        else if (option.gdt.data.hasOwnProperty("code"))
            datacode = option.gdt.data.code
        if(datacode !="")
            jsonReadAjax("imcdata", "", "code", datacode, dataajaxinsert, ["", "list", option]);
        else
            process(option);
    }
    else
        process(option);
    archiveEdit.process = process;
    function process(option) {
    switch (option.type) {
        case "content":
            contentEdit(findcurid(option), option);
            break;
        case "map":
            mapEdit(findcurid(option), option);
            break;
        case "fullcalendar":
            fullCalendarEdit(findcurid(option), option);
            break;
        case "jqgrid":
            jqEdit(findcurid(option), option);
            break;
        case "form":
            formEdit(findcurid(option), option);
            break;
        default:
            eval(option.type + "Edit(findcurid(option), option);");
            break;
    }

    $("#dvName").find("label").text(option.type.capitalize() + " Edit");
    }
}
function archivegdt() {
    //read gdt string  and parse from archiveEdit
    var rtn = "";
    var gdt = $("#archivegdt").text();
    if (gdt != "") {
        rtn = JSON.parse(gdt);
    }
    return rtn;
}
function archivegdtReload(tab) {
    var agdt = $("#archivegdt").text();
    $("#dvadmin").empty().append(tab);
    $("#dvadmin").prepend($("<span style='display:none' id='archivegdt'>" + agdt + "</span>"));
}
  
function findcurid(option) {
    //id is differ by src type
    var src = "",id;
    if (option.hasOwnProperty("src")) src = option.src;
    switch (src) {
        default:
            id = option.ctrid;
            break;
        case "list":
            id = option.code;
            break;
    }
    return id;
}
function findcurid1() {
    //find current id either controls or archive
    var rtn = "";
    if ($("#lbCtr").text() != "") rtn = $("#lbCtr").text();
    else if ($("#sparchive").text() != "") {
        var ss = JSON.parse($("#sparchive").text());
        if(ss.hasOwnProperty("code")) rtn=ss.code;
    }
    return rtn;
}
function optionread(option) {
    var rtn = {},src='',type='',gdt='',id='',code='',rtnid='';
    if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
    if (options.hasOwnProperty('type')) type = options.type
    if (options.hasOwnProperty('gdt')) gdt = options.gdt;
    if (options.hasOwnProperty('ctrid')) id = options.ctrid;
    if (options.hasOwnProperty('code')) code = options.code;
    if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
    rtn.src = src;
    rtn.type = type;
    rtn.gdt = gdt;
    rtn.id = id
    rtn.code = code;
    rtn.rtnid = rtnid;
    return rtn;
}
function externalAttach(option, arr, directshow) {
    //call a control from external controls
    //option.rtnctrid,rtngdt,rtntype,
    //element type at return: rtncid(default:"sp"+rtnctrid),elementtype:(ex:span(default),input,textarea)
    //link button: linkbtn:{icon:'pencil',size:'2x',color:'#D6276D'}
    //for external edit control:type,ctrid,gdt
    //option = makeoption(option.arr);
    var newopt = {};// option;
    if (typeof arr != "undefined" && arr.length > 0) {
        newopt.rtnctrid = arr[0];//id;
        newopt.rtngdt = arr[1];//editsave({ctrid:arr[0],type:arr[2],src:"external"})
        newopt.rtntype = arr[2];//"map";
        newopt.extid = arr[3];//extid;
        newopt.gdt = arr[4];//extgdt;
        newopt.type = arr[5];//ext.type;
        delete newopt.ctrid;
        //misc
        if (typeof arr[6] != "undefined") {
            newopt.misc = arr[6];//"sp" + extid;
        }
    }

    var elementtype = 'span', rtnctrid, rtn = "", elementtype, imgbtn, icon = '', size = '', color = '';
    if (newopt.hasOwnProperty("misc")) {
        var misc = newopt.misc;
        if (misc.hasOwnProperty("elementtype")) elementtype = misc.elementtype;
        if (misc.hasOwnProperty("btn")) {
            icon = misc.btn[0];
            size = misc.btn[1];
            color = misc.btn[2];
        }
    }

    //display control shows result
    var contain = $("#dv" + newopt.extid);
    //if (typeof dvcontain != "undefined") contain = dvcontain;
    var showctr = $(makeCtr([elementtype, "", newopt.extid, "width:99%", ]));
    var extinp = $("<input style='display:none;' type='external' id='inp" + newopt.extid + "'></input>");
    extinp.val(JSON.stringify(newopt.gdt));
    showctr.text(newopt.extid);
    imgbtn = $("<i id='iexternal' class='fa fa-image fa-2x imdim' style='vertical-align:middle;margin-left:5px;'/>");
    var icls = imgbtn.attr("class");
    if (icon != "") icls = icls.replace("image", btn.icon);
    if (size != "") icls = icls.replace("fa-2x", btn.size);
    if (color != "") imgbtn.css("color", btn.color);
    imgbtn.attr("class", icls);

    contain.append(showctr);
    contain.append(extinp).append(imgbtn);
    imgbtn.click(function () {
       loadexternal()
    });
    if (directshow) loadexternal();

    function loadexternal() {
        var extval = extinp.val();
        if (extval != "")
            newopt.gdt = JSON.parse(extval);
        newopt.rtngdt = editsave({ ctrid: newopt.rtnctrid, src: "external", type: newopt.rtntype });
        newopt.src = "externalsave";
        if (option.src == "list")
            newopt.src = "externalsavelist";
        $('#dveditback').remove(); $('.fade').remove(); editorRemove();
        archiveEdit(newopt);
        setTimeout(function () { $('.fade').remove(); },1000);
    }

    //return contain;
}
function externalReturn(option, extgdt) {
    //after finish external control editing, save result to gdt.external array of origin control;
    //extid:keycode of external array object,extgdt:contents of extid
    //replace rtngdt->gdt, rtnctrid=ctrid,rtntype->type
    //delete gdt,ctrid,type
    //change src:"" & return new optio
    option.gdt = option.rtngdt;
    switch (option.src) {
        case "list":
            option.code = option.rtnctrid;
            option.name = option.rtngdt.name;
            option.desc = option.rtngdt.desc;
            break;
        default:
            option.ctrid = option.rtnctrid;
            option.src = "";
            break;
    }
    option.type = option.rtntype;
    delete option.rtngdt;
    delete option.rtnctrid;
    delete option.rtntype;
    //editsave({ctrid:option.ctrid,type:option.type,src:"external"})
    //$(["gdt", "ctrid", "type"]).each(function (i, k) {
    //    option[k] = option["rtn" + k];
    //    delete option["rtn" + k];
    //});
    var extid = option.extid;
    var elementtype = "sp";//option.misc.elementtype;
    delete option.misc;
    delete option.extid;
    if (option.src != "list") {
        $('#dveditback').remove(); $('.fade').remove(); editorRemove();
    }

    switch (elementtype) {
        default:
            $("#" + extid).find("span").text(extid);
            break;
        case "input": case "textarea":
            $("#" + extid).find(elementtype).val(extid);
            break;
    }
    extgdt.extid = extid;
    if (option.gdt.hasOwnProperty("external")) {
        var chk = false;
        $(option.gdt.external).each(function (i, k) {
            if (k.extid == extid) {
                option.gdt.external.splice(i, 1, extgdt);
                chk = true;
            }
        });
        if (!chk) {
            $(["menuid", "subid", "dvid"]).each(function (a, b) {
                delete extgdt[b];
            });
            option.gdt.external.push(extgdt);
        }
    }
    else
        option.gdt.external = [extgdt];
    archiveEdit(option);
    console.log(option)
    $("#inp" + extid).val(JSON.stringify(extgdt));
}
function externalFind(gdt,extid){
    var rtn='';
    if(typeof gdt=="undefined" | !gdt.hasOwnProperty("external"))
        return "";
    else {
        var dt = $.grep(gdt.external, function (a) {
            return a.extid == extid;
        });
        if (dt.length > 0) rtn = dt[0];
        return rtn;
    }
}
function externalremove(extid, options, opt1) {
    var btn = $("<i class='fa fa-times-circle fa-lg imdim' style='margin-left:5px'/>");
    var sel = $("#selexttype");
    if (sel.length == 0)
        sel = $(makeCtr(["select", "select,;content;form", "selexttype", "height:25px;margin-bottom:2px"]));
    btn.insertAfter($("#iexternal"));
    btn.on("click", function () {
       var title= "Reset External", text= "Are you sure to reset ?";
        swal({
            title: title, text: text, html: true, type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55"
                   , closeOnConfirm: true, closeOnCancel: true
        }
        , function (isConfirm) {
            if (isConfirm) {
                $(sel).insertAfter($("#iexternal"));
                $("#iexternal").hide();
                btn.hide();
                $(sel).on("change", function () {
                    $("#iexternal").show();
                    btn.show();
                    $(sel).hide();
                    externaldelete(opt1[1], extid)
                    opt1[5] = $(this).val();
                    externalAttach(options, opt1, true);
                    externalremove(extid, options, opt1)
                });
            }
        });
    });
    
    function externaldelete(gdt,extid) {
        $(gdt.external).each(function (i, k) {
            if (k.extid == extid)
                gdt.external.splice(i, 1);
        });
    }
}
var externalselect = "";
function externalloopFind(extlist, extarr) {
    if (!extlist.hasOwnProperty("external")) {
        externalselect = extlist;
    }
    else
        $(extlist.external).each(function (i, k) {
            if (k.extid == extarr[0]) {
                extarr.splice(0, 1)
                externalloopFind(k, extarr);
            }
        });
}
function externalsave() {
    //find all component that id startwith 'inpext'+number
    var rtn = [];
    var ext = $('body').find("input[type='external']");
    $(ext).each(function (i, k) {
        if ($(k).val() != "" && $(k).val() != '""')
            rtn.push(JSON.parse($(k).val()));
    });
   return rtn;
}
function editsave(options) {
    ////universial edit save func apply to all controls
    var id = "", rtn;
    if (options.hasOwnProperty('src') && options.src == 'list')
        id = options.code;
    else
        id = options.ctrid;
    switch (options.type) {
        case "map":
            rtn = mapEditSave(id, options);
            break;
        case "content":
            rtn = contentEditSave(id, options)
            break;
        case "form":
            rtn = formBuildSave(options, id)
            break;
        case "googlechart":
            rtn = googlechartEditSave(id, options);
            break;
        case "jstree":
            rtn = jstreeEditSave(id, options);
            break;
        case "fullcalendar":
            rtn = calEditSave(id, options);
            break;
        case "jqgrid":
            rtn = jqEditSave(options);
            break;
        case "pivot":
            rtn = pivotEditSave(id, options);
            break;
        case "rstat":
            rtn = rstatEditSave(id, options);
            break;
    }
    return rtn
}
function defaultcombine(options) {
    if ($("#lbCtr").text() != "")
        id = $("#lbCtr").text();
    else {
        var ar = $("#sparchive").text();
        if (ar != "") ar = JSON.parse(ar);
        if (ar.hasOwnProperty("code")) id = ar.code;
        src = 'list'
    }
    if (typeof options != "undefined" && options.hasOwnProperty("src")) src = options.src;
    var combine = readdata(id, "gdt", options);
    if ($("#lbCtr").text() != "") {
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = id;
    }
}
function editbutton(options) {
    //universial button collection apply to all controls
    var src = "";
    if (options.hasOwnProperty("src")) src = options.src;
    var contain = $("<div style='text-align:right;padding:10px 5px 5px 0;'/>");
    var save = $("<button type='button'>Save</button>"); var cancel = $("<button type='button'>Cancel</button>");
   contain.append(save).append(cancel);
   contain.prepend(archiveattach(options));
   if (src == "" | src == "temp" | src == "externalsave") {
       if($("#tbbtn").length>0)
           $("#tbbtn").append($("<label id='lbCtr'>" + options.ctrid + "</label>"));
       else
          contain.prepend($("<div style='float:left'><label id='lbCtr'>" + options.ctrid + "</label></div>"));
   }

    switch (src) {
        case "external": case "externalsave": case "externalsavelist":
            $("#dvContainTop").find("img").first().hide();
            if ($("#dvContainTop").find("span:contains('external edit')").length<=0)
            $("#dvContainTop").removeAttr("style").prepend($("<span style='color:white;font-size:12px'>external edit</span>"));
            break;
    }
   
   cancel.on("click", function () {
       $("#archivegdt").remove();
       switch (src) {
           case "list":
               var newopt = {};
               newopt.type = options.type;
              
               jsonReadAjax("imclist", options.type, "", "", archiveList, [newopt]);
               //archiveList(newopt);
               break;

           case "external": case "externalsave": case "externalsavelist":
               externalcancel();
               $("#dvContainTop").find("img").first().show();
               $("#dvContainTop").find("span").first().remove();
               $("#dvContainTop").css({ "text-align": "right" });
               break;
           default:
               $('#dveditback').remove(); $('.fade').remove(); editorRemove();
               break;
       }
   });
   save.click(function () {
      // options["src"] = "externalsavelist";
        var cbchk=$("input:checkbox[id='cbarchive']").is(":checked");
        if (src == "list" | cbchk) {
            var name = "";
            var opt = $("#sparchive").text();
            if (opt != "") {
                opt = JSON.parse(opt);
                if (opt.hasOwnProperty("name")) name = opt.name;
            }
            if (name == "") {
                archivepop($("#sparchive"));
                sweetmsgautoclose("Fill in blank!", "You missed fillin Name!!");
            }
            else
                editsave(gdtsave(options));
        }
        else
            editsave(options);
   });
   function gdtsave(options) {
       var rtn;
       if ($("#archivegdt").text() != "") {
           rtn = JSON.parse($("#archivegdt").text());
           rtn.src = "list";
       }
       else
           rtn = options;

       if ($("#spdataajax").text() != "")
           rtn.data = JSON.parse($("#spdataajax").text());
       return rtn;
   }
   function externalcancel() {
       var src2 = "";
       if (src == "externalsavelist") src2 = "list";
       options.src = src2;
       var newopt = {};
       newopt.src = src2;
       newopt.ctrid = options.rtnctrid;
       newopt.type = options.rtntype;
       if (options.rtngdt.hasOwnProperty("gdt")) newopt.gdt = options.rtngdt.gdt;
       else newopt.gdt = options.rtngdt;
       if (src == "externalsavelist") {
           newopt.code = options.rtnctrid;
           newopt.name = options.rtngdt.name;
           newopt.desc = options.rtngdt.desc;
       }

       archiveEdit(newopt);
   }
    return contain;
}
function editDataFind(id,option){
    var gdt;
    if(typeof option=="undefined"){
        gdt = selectimctable(menuid, subid, id);
        if (typeof gdt == "undefined")
            gdt = archivegdt();
    }
    else if(option.hasOwnProperty("gdt"))gdt=option.gdt;
    return gdt;  
}
function editoptionmake(type, ctrid,gdt) {
    var option = {};
    option.ctrid = ctrid;
    option.type = type;
    if (typeof gdt != "undefined") 
    option.gdt = gdt;
    return option;
}
function archivecodeInsert(objdt, ardt) {
    // add code,name,desc to archive dt for  imclist insert
    if (ardt != "") {
        objdt.type = ardt.type;
        objdt.code = ardt.code;
        objdt.name = ardt.name;
        objdt.desc = ardt.desc;
        if (ardt.hasOwnProperty("data"))
            objdt.data = ardt.data;
    }
    return objdt;
}
function archiveClean(objdt) {
    //if save to archive, delete control info
    $(["menuid", "subid", "dvid","archive","code","name","desc"]).each(function (i, k) {
        delete objdt[k];
    });
    return objdt;
}
function archiveCssadd(objdt) {
    if ($("#dvCsscontain").length>0 && $("#dvCsscontain").find("span").first().text()!="") {
        var cssset = JSON.parse($("#dvCsscontain").find("span").first().text());
        if (cssset.hasOwnProperty("csscode")){
            objdt.csscode = cssset.csscode;
            delete objdt.css;
        }
        else if (cssset.hasOwnProperty("css")) {
            objdt.css = cssset.css;
            delete objdt.csscode;
        }
    }
    return objdt;
}
function archiveDatacode(objdt) {
    if (objdt.hasOwnProperty("data")) {
        if (objdt.data.hasOwnProperty("code") && !objdt.data.hasOwnProperty("datacode")) {
            objdt.data.datacode = objdt.data.code;
            delete objdt.data.code;
        }
    }
    return objdt;
}
function archiveattach(option) {
    //option: current info:gdt,type,ctrid,  archive info: code,name,desc, other info:if any, return info:rtnctrid,rtngdt,rtntype,rtnctype,rtncid
    var sp = $("<span/>"), ardt = {type:option.type,code:"ar"+idMake()};
    var chkbx = $("<input id='cbarchive' type='checkbox'/>");
    var lbmsg = $("<label for='cbarchive' style='margin-right:10px;'>Save to archive</label>");
    var sparch = $("<span id='sparchive' style='display:none;'/>");
    var dialog = $("<i style='margin-right:10px;vertical-align:middle;' class='fa fa-caret-square-o-up fa-2x imdim'/>");
    var listbtn = $("<button type='button' >List</button>");
    switch (option.src) {
        case "list":
            ardt = {};
            ardt.type = option.type;
            ardt.code = option.code;
            ardt.name = option.name;
            ardt.desc = option.desc;
            break;
        default:
            if (option.hasOwnProperty("gdt") && typeof option.gdt != "undefined" && option.gdt.hasOwnProperty("archive"))
                ardt = option.gdt.archive;
            break;
    }
    sparch.text(JSON.stringify(ardt));
    chkbx.on("change", function () { archivecheck(sparch); });
    dialog.click(function () { archivepop(sparch); });
    listbtn.click(function () {
        if (option.src == "list") {
            var newopt = {};
            newopt.type = option.type;
            jsonReadAjax("imclist", option.type, "", "", archiveList, [newopt]);
            //archiveList(newopt);
        }
        else {
            archiveReturn("",option);
        }
        
    });
    $('button').button();
    if (option.hasOwnProperty('src') && option.src == "list")
        return sp.append(lbmsg).append(sparch).append(dialog).append(listbtn);
    else
        return sp.append(chkbx).append(lbmsg).append(sparch).append(dialog).append(listbtn);
}
function archiveReturn(dt, option) {
    console.log(option)
    if (dt == "")
        jsonReadAjax("imclist", option.type, "", "", archiveReturn, [option]);
    else {
        var gdt, type;
        if (typeof option != "undefined") {
            if (option.hasOwnProperty("gdt")) gdt = option.gdt;
            if (option.hasOwnProperty("type")) type = option.type;
        }
        var dvcontain = $("#tab-Contain");
        //if (option.src.indexOf("external") == -1)
        //    option.src = "temp";
        //else
            option.ctrid = "external";
        archiveList(dt,option);
        dvcontain.append($("<div style='text-align:right;margin-top:5px;'><button>Return</button></div>"))
        dvcontain.find("button").on("click", function () {
            if (option.src.indexOf("external") == -1)
            option.src = "temp";
            archiveEdit(option);
        });
        $('button').button();
    }
}
function archivecheck(sparch) {
    if ($("input:checkbox[id='cbarchive']").is(":checked")) {
        if (sparch.text() != "") {
            var option = JSON.parse(sparch.text());
            if (!option.hasOwnProperty("name")) archivepop(sparch);
        }
    }
}
function archivepop(sparch) {
    //sp:if multiple #sparchive exists send it as span object
    var type = "", name = '', code = '', desc = '', prefix="ar";;
    if (sparch.text() != "") {
        var option = JSON.parse(sparch.text());
        if (option.hasOwnProperty("type")) type = option.type;
        if (option.hasOwnProperty("name")) name = option.name;
        if (option.hasOwnProperty("code")) code = option.code;
        if (option.hasOwnProperty("desc")) desc = option.desc;
        if (type == "css") prefix = "cs";
    }
    var dia =
        "<table id='tbarchive' style='margin-top:20px;width:100%' class='helpinsert' help='archive_save'>" +
         "<tr><td style='width:60px'>type:</td><td><label /></td></tr>" +
        "<tr><td>code:</td><td><label /></td></tr>" +
        "<tr><td>name:</td><td><input/></td></tr>" +
        "<tr><td>desc:</td><td><input/></td></tr></table>";
         $(dia).dialog({
             autoOpen: true,
        modal: true,
        height: 325,
        width: 350,
        title: "Archive Save",
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: "Saveas",
                click: function () {
                    var tb = $(this).closest("table");
                  tb.find("label").last().text(prefix + idMake());
                  tb.find("input").first().val("");
                   tb.find("input").last().val("");
                }
            },
             {
                 text: "Save",
                 click: function () {
                     var tb = $(this).closest("table");
                     var opt = {};
                    opt.type= tb.find("label").first().text();
                    opt.code = tb.find("label").last().text();
                    opt.name = tb.find("input").first().val();
                    opt.desc = tb.find("input").last().val();
                    sparch.text(JSON.stringify(opt));
                     $(this).dialog('destroy').remove();
                 }
             },
            {
                text: "Cancel",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }
    ]

    });
        $("#tbarchive").parent().css({ "z-index": 1000 });
        var tb = $("#tbarchive");
        tb.find("label").first().text(type);
        tb.find("label").last().text(code);
        tb.find("input").first().val(name);
        tb.find("input").last().val(desc);
    helpinsert();
}
function archiveupdate(sparch,val) {
    //update sessionStorage imclist by type
    //sparch:span that contain archive key info
    var name = '', code = '', desc = '', option = '';
    var option = JSON.parse(sparch.text());
    if (option.hasOwnProperty("type")) type = option.type;
    if (option.hasOwnProperty("name")) name = option.name;
    if (option.hasOwnProperty("code")) code = option.code;
    if (option.hasOwnProperty("desc")) desc = option.desc;
    //val.code = code;
    //val.name = name;
    //val.desc = desc    //updateimc("imclist", type, val, "code", code);
    jsonUpdateAjax("imclist", type, JSON.stringify(val), "code", code);
}
function commonsave(id, src, combine, options) {
    //it applys to all controls and archivelist regardless of save contents(combine).
     var sparch = $("#sparchive");
    var ardt = sparch.text();
    if (ardt != "") 
        ardt = JSON.parse(ardt);
    combine = archiveCssadd(combine)
    combine = archiveDatacode(combine);
    combine.comp = getlogin().comp;
    switch (src) {
        case "list":
            //delete combine.setting.archivesave;
            combine = archiveClean(combine);
            combine = archivecodeInsert(combine, ardt)//code,name,desc,data(optional)
            if ($("#spdataajax").text()!="")
                combine.data = JSON.parse($("#spdataajax").text());
            else if ($("#archivegdt").text() != "") {
                var gdt = JSON.parse($("#archivegdt").text());
                if (gdt.hasOwnProperty("data"))
                    combine.data = gdt.data;
            }
            if (typeof id == "undefined") id = combine.code;
            jsonUpdateAjax("imclist", ardt.type, JSON.stringify(combine), "code", id);
            if (typeof option != "undefined" && !options.hasOwnProperty("stay"))
                jsonReadAjax("imclist", ardt.type, "", "", archiveList, [{ type: ardt.type }]);
            break;
        case "external":
            return combine;
            break;
        case "externalsave":
            externalReturn(options, combine);
            break;
       case "externalsavelist":
           options.src = "list";
            externalReturn(options, combine);
            break;
        case "help":
            jsonUpdateAjax("imchelp", "", JSON.stringify(combine), "code", id);
            break;
        default:
            var archivesave=$("input:checkbox[id='cbarchive']").is(":checked");
            if (archivesave) 
                combine.archive = ardt;
            if ($("#archivegdt").text() != "") {
                var gdt = JSON.parse($("#archivegdt").text());
                if (gdt.hasOwnProperty("data")) {
                    if (gdt.data.hasOwnProperty("code")) {
                        gdt.data.datacode = gdt.data.code;
                    }
                }
                combine.data = gdt.data;
            }
            if (typeof id == "undefined") id = combine.dvid;
            if (archivesave) {
                var arset = combine;
                arset = archiveClean(arset);
                arset = archivecodeInsert(arset, ardt);
                archiveupdate(sparch, arset);
            }
            var storename = 'imctable';
            if (menutoggle == "template") {
                storename = 'imctemplate';
                combine.templatetype = templatetype;
                sessionStorage.setItem(storename, JSON.stringify(combine));
                jsonSaveAjax(storename, JSON.stringify(combine));
            }
            else {
                updateimctable(menutoggle + menuid, subid, id, combine);
                remoteimcupdate(storename);
            }
            break;
    }
}
//#endregion
jsonUpdateAjax("imctemplate", "statistics"
    , JSON.stringify([{code:1,name:"regression",desc:"description form regression",slist:[{seq:1,name:"y",desc:"ttt"}],output:[{type:"model",model:"lm(y~x)"},{type:"chart",model:"plot(y,x)",name:"chart1",desc:"good explanation"}]}]),"", "");
//#region form
function formInit(id, options) {
    var gdt, forsample = false, formdt = "", event = "", datacode = "",editmode=false,filter="";
    var contain = $("#" + id);
 
    if (typeof options != "undefined") {
        if (options.hasOwnProperty("forsample")) {
            forsample = options.forsample;
            if (forsample) contain = $("#dvdomsample");
        }
        if (options.hasOwnProperty("contain")) contain = options.contain;
      
        if (options.hasOwnProperty("gdt")) gdt = options.gdt;
        if (options.hasOwnProperty("editmode")) editmode = options.editmode;
    }
    if (typeof gdt == "undefined") gdt = readdata(id, "gdt");
    if (typeof gdt != "undefined") {
        formdt = gdt;
        if (formdt.hasOwnProperty("eventlist")) event = formdt.eventlist;
        if (gdt.hasOwnProperty("data")) {
            datacode = gdt.data.datacode;
            filter = findfilter(gdt.data);
        }
    }
  
    var fm = $("<form id='tb" + id + "' />");
    //contain.empty();
    $(".pagination-container").remove();
    contain.append(fm);
    //body
    formControlInit(formdt, id, fm,contain,datacode,filter);
  
    //bottom btn
    actionbutton(id, gdt, contain);//bottons are located at top,bottom,left,right of contain
    if (!forsample | typeof forsample == "undefined") {
        cssInit(id, "form", "tb" + id);
    }
    setTimeout(function () {
        var clas = contain.attr("class");
        contain.removeAttr("class");
        repositionbutton(fm);
        contain.addClass(clas);
        //if (datacode != "") {
        //    if(editmode)
        //    jsonReadAjax("imcdata", "", "code", datacode, formControlFill, [fm, filter, event]);
        //}
    }, 2000);

    function repositionbutton(form) {
        var btn = contain.find("input:button");
        if (btn.length > 0) {
            var frm = form.children().last();
            if(typeof frm!="undefined"){
                var node0 = frm.prop("nodeName");
                var fst = $("<" + node0 + "/>");
                if (node0 == "FIELDSET")
                    fst = $("<div/>");
                switch (node0) {
                    case "INPUT":
                        form.append(btn)
                        break
                    default:
                        fst.append(btn);
                        form.append(fst)
                        break;
                }
                if (btn.length > 1) {
                    btn.css({ "float": "right", width: "48%", "margin-right": "5px" });
                }
                $("<div style='clear:both'/>").insertAfter(form.children().last());
            }
        }
    }
}
function formControlInit(curdt, id, fm, contain, datacode, filter) {
    formControlInit.findform = findform;
    formControlInit.filldata = filldata;
    //when deploy form
    if (curdt.hasOwnProperty("csscode"))
        jsonReadAjax("imcsetting", "csslist", "code", curdt.csscode, formControlInit.findform, [curdt, id, fm, contain, datacode, filter]);

    else if (curdt.hasOwnProperty("css"))
        process(curdt, id, fm, curdt.css.domdetail, curdt.css.htmlsample, curdt.css, contain, datacode, filter);
    else
        process(curdt, id, fm, "<label/><input/>", "", "", contain, datacode, filter);
    function findform(cssdt, curdt, id, fm, contain, datacode, filter) {
        var domdetail = cssdt.domdetail;
        var domsample = cssdt.htmlsample;
        process(curdt, id, fm, domdetail, domsample, cssdt, contain, datacode, filter);
    }
    function process(curdt, id, fm, domdetail, domsample, cssdt, contain, datacode, filter) {
        var ctr = "", data = [], ctrlist = [], finishedseq = [], formgrp = "", colnum = 1;

        if (typeof curdt != "undefined" && curdt != "") {
            if (curdt.hasOwnProperty("ctrlist"))
                ctrlist = curdt.ctrlist;
            //top title

            //if has fieldset
            if (curdt.hasOwnProperty("formgrplist") && curdt.formgrplist != "") {
                formgrp = curdt.formgrplist.split(",");
                $(formgrp).each(function (a, b) {
                    var num = parseInt(a) + 1;
                    var fieldset = $("<fieldset><legend><span class='number'>" + num + "</span>" + b + "</legend></fieldset>");
                    fm.append(fieldset);
                });
            }
            //var sample = $(domsample);
            //var top = sample.prop("nodeName").toLowerCase();
            if (curdt.hasOwnProperty("title") && curdt.title != "") {
                var tit = $("<h2>" + curdt.title + "</h2>");
                fm.prepend(tit);
            }
            colnum = curdt.colnum;
        }
        jsonReadAjax("imcdata", "", "code", datacode, actionbutton, [id, curdt, contain, { domdetail: domdetail }]);
        // data.push([makeCtr(["span", "seq", , , ]), makeCtr(["span", "title", , , ]), makeCtr(["span", "control", , , ])]);
        if (ctrlist.length > 0) {
            ctrlist.sort(function (a, b) {
                return (a.odr > b.odr) ? 1 : -1;
            });
            $(ctrlist).each(function (i, k) {
                var rowdt = makeArrSameseq(ctrlist, k.seq, finishedseq);
                if (rowdt.length > 0) {
                    //<label><span><input/></label>, <label/><input/>
                    //<li><label><span/></label><input/></li>, <li><input/></li>, <fieldset><legned/><input/></fieldset>
                    var frm = $(domdetail);
                    var rtn = fillsub(frm, rowdt, colnum, i, id, curdt, cssdt);
                    if (formgrp == "") {
                        rtn.appendTo(fm);
                    }
                    else {
                        var ltit = rowdt[0].formgroup;
                        fieldsetinsert(fm, ltit, rtn);
                    }
                }
                //if (ctrlist.length - 1 == i && checkfilter(filter)) {
                //    jsonReadAjax("imcdata", "", "code", datacode, formControlInit.filldata, [id, curdt, filter]);
                //}
            });
           // if (ctrlist.length - 1 == i && checkfilter(filter)) {
                jsonReadAjax("imcdata", "", "code", datacode, formControlInit.filldata, [id, curdt, filter]);
           // }
        }
    }
    function checkfilter(filter) {
        var chk = false;
        $(filter).each(function (i, k) {

            var param = k[2];
            if(typeof param!="object")
            param=param.replace(":", "");
            if (param != "" | param.length > 0)
                chk = true;
        });
        return chk;
    }
    function filldata(data, id, curdt, filter) {
      
        
        var jsonscheme = "", mapping, keycode;
        $(curdt.eventlist).each(function (i, k) {
            if (k.command == "update" && k.dataset==data.code) {
                if (k.hasOwnProperty("jsonscheme"))
                    jsonscheme = k.jsonscheme;
                else if (k.hasOwnProperty("mapping"))
                    jsonscheme = k.mapping;
            }
        });
        //change filter: fillin keycode n/a when not exist
        $(jsonscheme).each(function (a, b) {
            set = {};
            if (b[2]) {
                $(filter).each(function (x, y) {
                    if (y[0] == b[0]) {

                        if (!(y[2].length > 0 && y[2] != ":"))
                            y[2] = ["n/a"];
                    }
                });
            }
        });
        var dt = datalistreturn(data);
        dt = applyFilter(dt, filter);
      

        $("#tb" + id + ">label>span").each(function (i, k) {
            var title = $(k).text(), code;
            if (title != "") {
                $(jsonscheme).each(function (a, b) {
                    if (b[1] == title | b[1] == title + ":value")
                        code = b[0];
                    if (dt.length == 0 && b[2]) {
                        var klist = findkeyvalue(filter);
                        $(klist).each(function (e, f) {
                            if (code == f.dtfield)
                                ctrlistinput(k, f.keyvalue);
                        })

                    }
                    else
                        $(dt).each(function (c, d) {
                            ctrlistinput(k, d[code]);
                        });
                });
                //eventhandler attach
                $(curdt.ctrlist).each(function (a, b) {
                    if (b.hasOwnProperty("functype") && b.functype != "none" && title == b.title) {
                        $(k).next().on(b.functype.substring(2), function () {
                            eval(b.func);
                        });
                    }
                });
            }
        });

        function ctrlistinput(k, inp) {
            switch ($(k).next().prop("nodeName")) {
                case "LABEL": case "SPAN":
                    $(k).next().text(inp);
                    break;
                case "INPUT": case "TEXTAREA":
                    $(k).next().val(inp);
                    break;
                case "SELECT":
                    $(k).next().val(inp);
                    break;
            }
          
        }
        function findkeyvalue(filter) {
            //fill in keyvalue to ctrlist
            var keylist = [];
            $(filter).each(function (i, k) {
                if (k[2].length > 0 && k[2][0]!='n/a')
                    keylist.push({ dtfield: k[0], keyvalue: k[2][0] });
            });
            return keylist;
        }
    }
    function fillsub(elset, rowdt, colnum, i, id, curdt, cssdt) {
        var inp;
        var node0 = elset.prop("nodeName").toLowerCase();
        var fst = $("<" + node0 + "/>");
        if (elset.children().length == 0) {
            fst = makecontrol(rowdt, id, curdt, cssdt);
        }
        else {
            $(elset.children()).each(function (i, k) {
                switch ($(k).prop("nodeName")) {
                    case "LABEL": case "SPAN":
                        $(k).text(rowdt[0].title);
                        fst.append($(k))
                        break;
                    case "INPUT": case "TEXTAREA":case "SELECT":
                        fst.append(makecontrol(rowdt, id, curdt, cssdt));
                        break;
                }
            })
        }
        function makecontrol(rowdt, id, curdt, cssdt) {
            inp = controlmake(rowdt, id + i, curdt);
            switch (rowdt[0].ctrtype) {
                case "input": case "textarea":
                    $(inp).attr("placeholder", rowdt[0].title);
                    break;
                case "tree":
                    if (typeof $(inp).attr("setting") != "undefined") {
                        var treedt = JSON.parse($(inp).attr("setting")), setting = "";
                        var idd = $(inp).attr("id");
                        jstreeInitmake(treedt, idd);
                    }
                    break;

            }
        
            return $(inp);
        }
        if (colnum == 2)
            fst.css({ float: "left", "margin-right": "2px", width: "48%" });
        if ($("#imgx").length > 0)
            $("#imgx").on("hover", function () {
                $("#imgx").css({ height: "200px", position: "absolute" });
            });
        return fst;
    }
    function fieldsetinsert(fm, legendtitle, element) {
        //fm:form,legendtitle,element=control to append
        $(fm.find("fieldset")).each(function (i, k) {
            var name = $(k).find("legend").clone().children().remove().end().text();
            if (name == legendtitle)
                $(k).append(element);
        })
    }
    //function modifyselectcss(cssdt) {
    //    $(cssdt.stylelist).each(function (i, k) {
    //        if (k.sname.indexOf(cssdt.name + " select") > -1) {
    //            var slist = k.style.split(";")
    //            $(slist).each(function (a, b) {
    //                var bb = b.split(":");
    //                if (bb[0] == "width") {
    //                    $(".ddlTextbox").css({ width: bb[1] });
    //                    console.log(bb[0], bb[1])
    //                }
    //            });
    //        }
    //    });
    //}
   
}
function formEdit(id, options) {
    var src = '', type, gdt, code = '', rtnid = '';
    if (typeof options != "undefined" && options != "") {
        if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (options.hasOwnProperty('type')) type = options.type
        if (options.hasOwnProperty('gdt')) gdt = options.gdt;
        if (options.hasOwnProperty('ctrid')) id = options.ctrid;
        if (options.hasOwnProperty('code')) code = options.code;
        if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
    }
    else {
        gdt = editDataFind(id, options);
        options = editoptionmake("form", id, gdt);
    }

    var formdt = "", strformdt = "";
    if (typeof gdt != "undefined") {
        formdt = gdt;
    }
    $("#splistdata").remove();
    if (formdt != "") strformdt = JSON.stringify(formdt);
    $("body").append($("<span id='splistdata' style='display:none'/>").text(strformdt));
    formBuild(formdt, id,options);
    funStop();
}
function formBuild(curdt, ctrid, options) {
    var src = '', type, gdt, code = '', rtnid = '';
    if (typeof options != "undefined" && options != "") {
        if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (options.hasOwnProperty('type')) type = options.type
        if (options.hasOwnProperty('gdt')) gdt = options.gdt;
        if (options.hasOwnProperty('ctrid')) ctrid = options.ctrid;
        if (options.hasOwnProperty('code')) code = options.code;
        if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
        if (src == "temp" | src.indexOf("external") > -1) {
            $("#splistdata").text(JSON.stringify(gdt));
        }
    }
    var dv = $("#dvadmin");
    var fdt = $("#splistdata").text();
    dv.empty();
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Edit", "Action", "Data", "Style"];

    var tb = $("<table id='tbform' style='width:100%'/>"),
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td style='width:120px' ><label>Form Title:</label></td><td><input id='inpformTitle' style='width:99%;margin-bottom:2px' /><span style='display:none; id='lbformid'/></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Group:</label></td><td><input id='inpgrplist' style='margin-bottom:2px'/><span>* In case multiple input, comma seperated</span></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Column:</label></td><td>" + makeCtr(["select", "1;2", "selcolnum", "height:25px;margin-bottom:2px"]) + "</td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td style='vertical-align:top'><label>Control List:</label></td><td id='tdcontrollist'></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Action:</label></td><td>Save & Cancel:<input id='cbactsave' type='checkbox' /></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td id='tbbtn' colspan='2'></td>"));
    var map = [], btndv = "";
    //1st Tab
    //if (typeof ctrid == "undefined")
    //    btndv = btnlist;
    map.push(tb.outerHTML() + btndv);
    //2nd Tab action
    map.push("<div id='dndcontain_form' class='dndcontain'  />");
    //3rd Tab Data
    map.push(makeDatasrc());
    tabarr.content = map;
    var tab = makeTab(tabarr);
    if (src.indexOf("list") > -1) {
        archivegdtReload(tab);
        dv.append($("<span id='splistdata' style='display:none;'/>").text(fdt));
    }
    else {
        var conarr = {};
        conarr.id = "dveditback";// "container" + id;
        //container complete
        conarr.body = tab;
        var container = makeContainer(conarr);
        $("#" + conarr.id).append($("<span id='splistdata' style='display:none;'/>").text(fdt));
    }
    $("#tbbtn").append(editbutton(options));
    $("#dvadmin.ui-tabs.ui-widget-content").css("border", "none");
    //dv.append(tb);
    var formname = "", formdesc = "", title = "", colnum = '1', formgrplist = "", actsave = "", action = true;;
    if (curdt != "" && typeof curdt != "undefined") {
        if (curdt.hasOwnProperty("title")) title = curdt.title;
        if (curdt.hasOwnProperty("formgrplist")) formgrplist = curdt.formgrplist;
        if (curdt.hasOwnProperty("colnum")) colnum = curdt.colnum;
        if (curdt.hasOwnProperty("actsave")) actsave = curdt.actsave;
        //action button batch insert
        if (actsave)
            $("#cbactsave").prop("checked", true)
        //$("#cbactsave").attr('checked', true).trigger('change');
        //create edit,cancel,save action
        // actioninsert();
        //}
    }
    if (typeof ctrid == 'undefined') ctrid = code;
    $("#inpformTitle").val(title);
    $("#inpgrplist").val(formgrplist);
    $("#selcolnum").val(colnum);
    $("#lbformid").text(code);
    $("#tdcontrollist").append(formControllist(curdt, ctrid));

    delRowdelegate("tbCtrlist");
    runAfterTableCreate("tbCtrlist");
    //4th Tab style

    var tabb = $('#' + tabarr.id);
    var first = true, dtsrc = true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 1:
                    var dcode = "";
                    if (curdt.hasOwnProperty("data")) dcode = curdt.data.datacode;
                    if (dcode != $("#spDatacode").text()) reloadAction();
                    //3rd action
                    if (action) {
                        dndboxInit(curdt, 'form');
                        action = false;
                    }
                case 2:
                    //if (dtsrc) {
                    dataTabClick(ctrid, options);
                    dtsrc = false;
                    // }
                    break;
                case 3:
                    if (first)
                        cssEditInit("Style", ctrid, "form");
                    first = false;
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['formedit', 'action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'formedit');
    helpinsert();

    $(".fa-chevron-circle-down,.fa-chevron-circle-up").on("click", function (e) {
        $(".trdetail").toggle();
        if ($(this).attr("class") == "fa fa-chevron-circle-down imdim") $(this).attr("class", "fa fa-chevron-circle-up imdim");
        else $(this).attr("class", "fa fa-chevron-circle-down imdim");
    });

    $("#inpformName").one("blur", function (e) {
        $("#inpformTitle").val($(this).val());
    });

    $("#cbactsave").on("change", function () {
        switch ($(this).is(":checked")) {
            case true:
                actioninsert();
                break;
            case false:
                dndautoInsert(false);
                break;
        }
    });
    function actioninsert() {
        var insarr = [], cd = "bt" + idMake();
        var data = "";
        if (curdt.hasOwnProperty("data")) data = curdt.data;
        insarr.push({ buttonname: "Save", command: "update" });
        insarr.push({ buttonname: "Cancel", script: "$('#$curid').remove();" });
        dndautoInsert(true, cd, insarr, data, "form");
        action = false;
    }
    $('input:button').button();
    $("button").button();
    funStop();
}
function formList(init, ctrid) {
    //init:true(load remote json file), ctrid:control id, from formEdit
    var flist = [], code = "", title = "", desc = "", dt;
    //check clientid exists
    dt = formDataRead(init);
    var datasrc = [];
    $(dt).each(function (i, k) {
        datasrc.push({ code: k.code, formname: k.formname, formdesc: k.formdesc });
    });
    // jqgrid list
    var gridid = "tbList";
    var pagerid = "dvListpager";
    var dvjq = $("<div />");
    // if(clevel=="style")
    // dvjq.css({'margin-left':'15%','width':'85%','text-align':'right'});
    dvjq.append($("<table id='" + gridid + "'/>"));
    dvjq.append($("<div id='" + pagerid + "' />"));
  
    var contain = "dvadmin";
    if (typeof ctrid != "undefined" && ctrid != "")
        contain = "tab-Contain";
   
    $("#" + contain).empty();
    $("#"+contain).append(dvjq);
    formListGrid(datasrc, gridid, pagerid,ctrid);
    function formListGrid(datasrc, gridid, pagerid,ctrid) {
        $("#" + gridid).jqGrid("GridUnload");
        var colmodel = []; var colname = ["code", "formname", "desc"];
        colmodel.push({ name: "code", width: 100 });
        colmodel.push({ name: "formname", width: 100 });
        colmodel.push({ name: "formdesc", width: 150 });
        colname.push('');
        colmodel.push({ name: 'edit', width: 15, sortable: false });
       if (typeof ctrid != "undefined") {
            colname.unshift('');
            colmodel.unshift({ name: 'sel', width: 15, sortable: false });
       }

        var options = {
            colNames: colname,
            colModel: colmodel,
            datatype: "local",
            data: datasrc,
            height: "auto",
            autowidth: true,
            shrinkToFit: true,
            rowNum: 10,
            rowList: [5, 10, 20, 30],
            pager: pagerid,
            //caption: "Data View",
            sortable: true,
            onCellSelect: function (rowid, iCol) {
                var list = jQuery("#" + gridid).getRowData(rowid);
                var namelist = Object.keys(list);
                switch (namelist[iCol]) {
                    case "sel":
                        selectList("form",list.code,ctrid);
                        break;
                  
                }

            },
            gridComplete: function () {
                var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var rowarr = jQuery("#" + gridid).getRowData(cl);
                    var selicon = 'ui-icon-check';
                    if (rowarr.code == selcode)
                        selicon = ' ui-icon-circle-check';
                  
                    be = "<span class='ui-icon " + selicon + "'  />";
                    ae = "<span class='ui-icon ui-icon-pencil'  onclick=\"formBuild('','" + rowarr.code + "',{src:'list',type:'form'});\"  />";
                    var ctr = { edit: ae };

                    if(typeof ctrid!="undefined"){
                    //if requested from formEdit
                        ae = "<span class='ui-icon ui-icon-pencil'  onclick=\"formBuildFind('" + rowarr.code + "','" + ctrid + "');\"  />";
                        ctr = { edit: ae,sel:be };

                        }
                    
                    jQuery("#" + gridid).jqGrid('setRowData', ids[i], ctr);
                }
            }
        };
        jQuery("#" + gridid).jqGrid(options);
        jQuery("#" + gridid).jqGrid('navGrid', '#' + pagerid, { edit: false, add: false, del: false, refresh: false, search: false });
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption: "add",
            buttonicon: "ui-icon-plus",
            onClickButton: function () {
                    var formcode = "fr" + idMake();
                    formBuild("", formcode, {src:"list",type:'form'});

            }
        });
    }
}
function selectList(seltype,keycode,ctrid) {
    var list = selectimc("imclist", seltype);
    switch (seltype) {
        case "formlist":
            formBuild(dtt(list), ctrid);
            $("#lbformid").text("");
        break;
    }
   
    function dtt(list) {
        var rtn = "";
        var dt = $.grep(list, function (a) {
            return a.code == keycode;
        });
        if (dt.length > 0) rtn = dt[0];
        return rtn;
    }
    selcode = keycode;
}
function ListReturn() {
    //when from edit to list back to previous edit setting
    if (clientid != "" && $("#lbformid").text() != "") {
        formList();
    }
    else {
        var dvcontain = $("#tab-Contain");
        var val = $("#inpcurdt").val();
        var ctrid = $("#lbcontrolid").text();
        formList(false, ctrid);
            dvcontain.append($("<div style='text-align:right;margin-top:5px;'><button>Return</button></div>"))
            dvcontain.find("button").on("click", function () {
                if (val != "") val = JSON.parse(val);
                formBuild(val, ctrid)
                ;            });
            $("button").button();
    }
}
function formDataRead(init) {
    var login = getlogin(), comp;
    if (login != "" && login.group == "CommonAdmins")
        comp = "_" + login.comp;
    else if (login.group == "SystemAdmins")
        comp = "";
    if (init)
        jsonReadallAjax("form" + comp);
    var form = selectimc("imclist", "form"),formstr="";
    if(form!="")formstr=JSON.stringify(form);
    $("#splistdata").remove();
    $("body").append($("<span id='splistdata' style='display:none'/>").text(formstr));
   
    return form;
}
function reorderseq() {
    var dtt = [], dt = [], curdt = {};
    dtt = $("#splistdata").text();
    if (dtt != "") dtt = JSON.parse(dtt);

    dt = $.grep(dtt, function (a) {
        return a.code ==$("#lbformid").text();
    });

    //reorder control order & reassign seq numbering
    var tb = saveTable("tbCtrlist"),odrlist=[],set={};
    $(tb).each(function (i, k) {
        set = {};
        set.id = k[0];
        set.odr = i;
        odrlist.push(set);
    });
    if(dt[0].hasOwnProperty("ctrlist"))
    $(odrlist).each(function (i, k) {
        $(dt[0].ctrlist).each(function (a, b) {
            if (k.id == b.seq)
                b.odr = k.odr;
        });
    });
    $(dtt).each(function (i, k) {
        if (k.code == $("#lbformid").text())
            dtt.splice(i, 1, dt[0]);
    })
    $("#splistdata").text(JSON.stringify(dtt));
}
function controlevent(curdt, id) {
    //after control inserted add eventhandler
    var ctr = "", data = [], ctrlist = [], finishedseq = [];
    if (typeof curdt != "undefined" && curdt != "" && curdt.hasOwnProperty("ctrlist")) ctrlist = curdt.ctrlist;
    data.push([makeCtr(["span", "title", , , ]), makeCtr(["span", "control", , , ])]);
    if (ctrlist.length > 0) {
        ctrlist.sort(function (a, b) {
            return (a.odr > b.odr) ? 1 : -1;
        });
        $(ctrlist).each(function (i, k) {
            var rowdt = makeArrSameseq(ctrlist, k.seq, finishedseq);
            if (rowdt.length > 0) {
                $(rowdt).each(function (a, b) {
                    if (b.hasOwnProperty("func")) {
                        func = b.func;//.replace(/(\r\n|\n|\r)/gm, "");
                        $("#" + id + a).on("click", function () {
                            eval(func);
                        });
                    }
                });
            }
        });
    }
}
function formControllist(curdt, id) {
    formControllist.makedata = makedata;
    // data field list
    var ctr = "", data = [], ctrlist = [], finishedseq = [];
    if (typeof curdt != "undefined" && curdt != "" && curdt.hasOwnProperty("ctrlist")) ctrlist = curdt.ctrlist;
    data.push([makeCtr(["span", "seq", , , ]), makeCtr(["span", "group", , , ]), makeCtr(["span", "type", , , ]), makeCtr(["span", "title", , , ])
        , makeCtr(["span", "control", , , ]), makeCtr(["span", , , "width:10px", ]), makeCtr(["span", , , "width:10px", ])]);
    if (ctrlist.length > 0) {
        ctrlist.sort(function (a, b) {
            return (a.odr > b.odr) ? 1 : -1;
        });

        data = makedata(data, ctrlist, finishedseq, curdt,id);
    }
   
    var tb2 = makeTable("tbCtrlist", data, "general");

    var foot = ['<div><input id="inpcontroladd" type="button" class="btnRoundsmall" value="add"  onclick="formControlEdit()"' +
        'style="padding:2px;"/></div>|{"colspan":"7","style":"text-align:right;padding:5px 5px 2px 0;"}'];
    tb2 = appendFooter(tb2, foot);
  
    //insert jstree
    tb2.find("tbody>tr>td:nth-child(5)>div").each(function (i, k) {
        $(k).attr("id", "edit" + $(k).attr("id"));
        var extctr = $(k).attr("setting");
        if (typeof extctr != "undefined") {
            extctr = JSON.parse(extctr);
            jstreeInitmake(extctr, $(k).attr("id"));
           
        }
    })
    //formControllist edit click
    var dbmap = $("<input type='button' value='dbmap' style='padding:2px'/>");
    dbmap.on("click", function () {
        var dv = $("<div/>");
        dv.append($(makeCtr(["select", "input;label", "selctrtype", "", ""])));
        dv.dialog({
            height: 'auto'
         , width: 400
        , appendTo: "#tbCtrlist"
         , modal: true
         , minHeight: 'auto'
         , title: "Default Control Type"
         , stack: false
         , close: function (event, ui) {
            
             $(this).dialog('destroy').remove();
         },
            buttons: [
                {
                    text: "Apply",
                    icons: {
                        primary: "ui-icon-check"
                    },
                    click: function () {
                        dbmapping();
                        $(this).dialog('destroy').remove();
                    }
                },
                {
                    text: "Cancel",
                    icons: {
                        primary: "ui-icon-close"
                    },
                    click: function () {
                        $(this).dialog('destroy').remove();
                    }
                }
            ]
        });
    })
    function dbmapping() {
        var data1 = $("#spdlist").text(), mapdt = [];
        if (data1 != "") {
            var dt = JSON.parse(data1);
            //var dt = datalistreturn(data1);
            //dt = applyFilter(dt, saveFilter("tbFilter"));
            var dt1 = Object.keys(dt[0]);
            data = [];
            data.push([makeCtr(["span", "seq", , , ]), makeCtr(["span", "group", , , ]), makeCtr(["span", "type", , , ]), makeCtr(["span", "title", , , ])
       , makeCtr(["span", "control", , , ]), makeCtr(["span", , , "width:10px", ]), makeCtr(["span", , , "width:10px", ])]);
            $(dt1).each(function (i, k) {
                var tt = {}; tt.ctrtype = $("#selctrtype").val(); tt.odr = i; tt.seq = i + 1; tt.title = k;
                mapdt.push(tt);
            });
            data = makedata(data, mapdt, [], id);
            var tbb = makeTable("tbCtrlist1", data, "general");
            $("#tbCtrlist>tbody").remove();
            $("#tbCtrlist").append(tbb.find("tbody"));

            var form = $("#splistdata").text();
            if (form != "") {
                form = JSON.parse(form);
                form.ctrlist = mapdt;
                $("#splistdata").text(JSON.stringify(form));
            }
            $("#tbCtrlist").find(".fa-pencil").on("click", function (e) {
                var seq = $(this).closest("tr").find("span").first().text(), finishedseq = [];
                var rowdt = makeArrSameseq(mapdt, seq, finishedseq);
                formControlEdit(rowdt);
            });
            delRowdelegate("tbCtrlist");
            tb2.find(".fa-times-circle").on("click", function (e) {
                var seq = $(this).closest("tr").find("span").first().text(), finishedseq = [];
                var rowdt = makeArrSameseq(curdt.ctrlist, seq, finishedseq);
                formControlEdit(rowdt);
            });
            var opt = {
                perPage: 5
            , limitPagination: 5
                , containerClass: "panel-footer"
                // , insertAfter: "#sortable"
            };
            paginathing($("#tbCtrlist"), opt);
        }
        else
            sweetmsgautoclose("Ooops!!!", "No Data available.");
    };
    tb2.find("tfoot").find("div").prepend(dbmap);
    tb2.find(".fa-pencil").on("click", function (e) {
        var seq = $(this).closest("tr").find("span").first().text(), finishedseq = [];
        var rowdt = makeArrSameseq(curdt.ctrlist, seq, finishedseq);
        formControlEdit(rowdt);
    });
    delRowdelegate("tbCtrlist");
    //make row droppable
    var bgcl = tb2.find('tbody>tr:nth-child(2)').css("background-color");
    tb2.find("tbody").sortable({
        // items: "> tr:not(:first)",
        appendTo: "parent",
        helper: "clone",
        update: function (event, ui) {
            evenoddcolor(tb2, bgcl)
            reorderseq();
        }
    }).disableSelection();
    var opt = {
        perPage: 5
 , limitPagination: 5

    };
    setTimeout(function () { paginathing(tb2, opt); }, 100);
    function makedata(data, ctrlist, finishedseq, curdt, id) {
        
        $(ctrlist).each(function (i, k) {
            var rowdt = makeArrSameseq(ctrlist, k.seq, finishedseq);
            var formgrp = "";
            if (rowdt.length>0 && typeof rowdt!="undefined" && rowdt[0].hasOwnProperty("formgroup")) {
                formgrp = rowdt[0].formgroup;
            }

            if (rowdt.length > 0) {
                data.push([makeCtr(["span", rowdt[0].seq, , "width:50px", ]), makeCtr(["span", formgrp, , , ])
                , makeCtr(["span", rowdt[0].ctrtype, , "width:50px", ]), makeCtr(["span", rowdt[0].title, , "width:250px", ])
                , controlmake(rowdt, id, curdt)
                , makeCtr(["i", "fa fa-pencil imdim", "", "width:10px", ""])
                , makeCtr(["i", "fa fa-times-circle fa-lg imdim", , "width:10px", ""])]);
            }
        });
        return data;
    }

    return tb2;
}
function formControlEdit(ctrarray, curseq) {
    datareturn = "";
    if (typeof curseq == "undefined") curseq = 0;
    var dv = $("<div id='dvformcontrol'/>");
    var ctrtypelist = ['input', 'textarea', 'label', 'file', 'image', 'span', 'div', 'button', 'i', 'checkbox', 'radiobutton', 'radiobuttonlist', 'dropdownlist,select', 'ul', 'selectimage', 'multiselect', 'tree', 'color,input:color', 'number,input:number'], title = "", ctr1 = [];
    var eventtypelist = ['none', 'onclick', 'onblur', 'onchange', 'ondblclick', 'onfocus', 'onhover', 'onkeydown', 'onkeypress', 'onkeyup', 'onmousedown', 'onmouseeventer', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize'];
    //tab create
    var tabarr = {};
    if ($("#tab-Contain1").length > 0) {
        $("#tab-Contain1").remove();
    }
    tabarr.id = "tab-Contain1";
    tabarr.head = ["Edit"];
    //add more button
    addbtn = $("<div id='dvaddcontrol' style='float:left;padding:2px 7px 0 0;'></div>");
    addbtn.attr("title", "add more contorls in a row");
    addbtn.append($("<i  style='color:#797979;' onclick=\"addcontrol();\"  class='fa fa-plus-square fa-2x imdim'/>"));
    var tb = $("<table style='width:100%'/>"), tr = $("<tr/>");
    tb.append(tr); tr.append($("<td style='width:100px'><label>seq</label></td><td><label style='margin-right:5px;'id='lbSeq'  /></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Title</label></td><td><input id='inpctrTitle' style='width:100%;' /></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Desc</label></td><td><input id='inpctrDesc' style='width:100%;' /></td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Formgroup</label></td><td>" +makeCtr(["select", $('#inpgrplist').val().replace(',',';'), "selformgrp", "width:150px;", ""]) + "</td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>#</label><label style='margin-right:5px;'id='lbSubseq'/>"+
        "&nbsp;<i title='add more controls in a row.' class='fa fa-toggle-right imdim' onclick=\"$(this).closest('td').next().toggle()\"/>" +
        "<label style='display:none;'id='lbOdr'  /></td>" +
        "<span id='sptemp' style='display:none'/><td style='display:none'>" + addbtn.outerHTML() + "</td>"));
    tr = $("<tr/>");
    var option = {}, cid = $("#lbcontrolid").text(), fid = $("#lbformid").text();
    if (cid != "") { option.ctrid = cid; option.type = "formctr" }
    if (fid != "") { option.ctrid = fid; option.type = "form" }
    if (typeof ctrarray != "undefined") {
        if (ctrarray[curseq].hasOwnProperty("style"))
            option = ctrarray[curseq].style;// JSON.parse(ctrarray[curseq].style);
    }
    tb.append(tr); tr.append($("<td><label>Style</label></td><td>" + trstyleInsert(option) + "</td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td><label>Control</label></td><td>" + makeCtr(["select", "Choose a control,;" + ctrtypelist.join(";"), "selcontrollist", "width:150px;", ""]) + "</td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td style='vertical-align:top'><label>Function</label></td><td>" + makeCtr(["select", eventtypelist.join(";"), "seleventlist", "width:150px;;", ""])
    + makeCtr(["textarea", "", "txfunc", "display:none;", "rows:5;cols:92"]) + "</td>"));
    tr = $("<tr/>");
    tb.append(tr); tr.append($("<td style='vertical-align:top'><label>Detail</label></td><td><div id='dvCtrdetail'/></td>"));
    var map = [];
    //1st Tab
    map.push(tb.outerHTML());
    //2nd Content
    ////3rd Tab
    //map.push(makeDatasrc());
    tabarr.content = map;
    var tab = makeTab(tabarr);
    dv.append(tab);
    var appendto = "#dvadmin";
    if ($("#tab-Contain").length>0) appendto = "#tab-Contain";
    dv.dialog({
        height: 'auto'
         , width: 900
        , appendTo: appendto
         , modal: true
         , minHeight: 'auto'
         , title: "Control Wizard"
         , stack: false
         , close: function (event, ui) {
             $(this).dialog('destroy').remove();
         },
        buttons: [
            {
                text: "Save",
                icons: {
                    primary: "ui-icon-check"
                },
                click: function () {
                    if ($("#selcontrollist").val() == "" ) {
                        sweetmsgautoclose("Warn", "Please select control type!");
                        return false;
                    }
                    tempControlSave(); formControlSave(); 
                    $(this).dialog('destroy').remove();
                }
            },
            {
                text: "Cancel",
                icons: {
                    primary: "ui-icon-close"
                },
                click: function () {
                    $(this).dialog('destroy').remove();
                    datareturn = "";
                }
            }
        ]
    });

    if (typeof ctrarray != "undefined") {
        rr = ctrarray;
        $("#lbSeq").text(ctrarray[curseq].seq);
        var subseq = 1, odr = "";
        if (ctrarray[curseq].hasOwnProperty("subseq")) subseq = ctrarray[curseq].subseq;
        $("#lbSubseq").text(subseq);
        if (ctrarray[curseq].hasOwnProperty("odr")) odr = ctrarray[curseq].odr;
        $("#lbOdr").text(odr);
        $("#inpctrTitle").val(ctrarray[curseq].title);
        if (ctrarray[curseq].hasOwnProperty("desc")) $("#inpctrDesc").val(ctrarray[curseq].desc);
        if (ctrarray[curseq].hasOwnProperty("formgroup")) {
            $("#selformgrp").show();
            $("#selformgrp").val(ctrarray[curseq].formgroup);
        }
        if (ctrarray[curseq].hasOwnProperty("functype")) {
            $("#seleventlist").val(ctrarray[curseq].functype);
            if (ctrarray[curseq].functype !== "none")
                $("#seleventlist").next().show();
            if (ctrarray[curseq].hasOwnProperty("func")) $("#txfunc").val(ctrarray[curseq].func);
        }
        $("#selcontrollist").val(ctrarray[curseq].ctrtype);
        formSelectcontrol(ctrarray[curseq]);
        if (ctrarray[curseq].hasOwnProperty("data"))
            datareturn = ctrarray[curseq].data;
        //save control arr into sptemp
        $("#sptemp").text(JSON.stringify(ctrarray));
        $(ctrarray.reverse()).each(function (i, k) {
            addcontrol(k);
        })
        // $("#ulmenu").find("li").first().click();
        $('#ulmenu').append(function () {
            return $(this).children().get().reverse()
        });
    }
    else {
        //find max seq number
        var tb = saveTable1("tbCtrlist");
        var mseq = 1;
        $(tb).each(function (i, k) {
            var num = parseInt(k[0]);
            if (num >= mseq) mseq = num + 1;
        });
        $("#lbSeq").text(mseq);
        $("#lbSubseq").text("1");
        $("#lbOdr").text($("#tbCtrlist").find("tbody>tr").length);
        addcontrol();
    }
    //formgroup show hide
    var glist = $("#selformgrp");
    glist.closest("tr").hide();
    if (glist.val() != "") 
        glist.closest("tr").show();
    
    //tabclick event
    var tabb = $('#' + tabarr.id);
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    if (typeof datareturn == "object") {
                        $("#dvoption").remove();
                        var val = $("#ulmenu").find(".selectlii").attr("val");
                        if (typeof val != "undefined" && val != "") {
                            val = JSON.parse(val);
                            val.data = datareturn;
                        }
                        if (datareturn.hasOwnProperty("datalist")) {
                            var list = Object.keys(datareturn.datalist[0]);
                            var valsel = $("<div id='dvoption' >Value : " + makeCtr(["select", list.join(";"), "selval", , ""]) + "Text : "
                                + makeCtr(["select", list.join(";"), "seltxt", , ""]) +
                                 "<input type='button' value='Apply' onclick='makeoptionlist()' style='margin:0 0 5px 5px'/>" +
                                 "<input type='button' value='Reset' onclick=\"datareturn='yes';$('#dvoption').remove();\" style='margin:0 0 5px 5px'/></div>");
                            valsel.prependTo($("#dvCtrdetail"));
                        }
                    }
                    break;
                case 1:
                    if (datareturn == "") datareturn = "yes";
                    //else if (typeof datareturn == "object")
                    editDatacode1();
                    break;
            }
        }
    });

    $("button").button();
    $(".ui-dialog-titlebar.ui-widget-header").hide();
    dv.parent().css("z-index", 300);
    var closebtn = $("<div style='float:right;padding:2px 7px 0 0;'></div>");
    closebtn.attr("title", "user edit menu");
    closebtn.append($("<i  style='color:#797979;' onclick=\"$('#dvformcontrol').remove()\"  class='fa fa-times-circle fa-2x imdim'/>"));
    $($("#tab-Contain1").find("ul")[0]).append(closebtn);
    $("#seleventlist").on("change", function () {
        switch ($(this).val()) {
            case "none":
                $(this).next().hide();
                break;
            default:
                $(this).next().show();
                break;
        }
    });
    $("#selcontrollist").on("change", function () {
        var dvctr = $("#dvCtrdetail");
        dvctr.empty();
        var set = {}, seq = $("#lbSubseq").text();
        var ctr = $("#ulmenu").find(".selectlii").attr("val");
        if (ctr != "") {
            ctr = JSON.parse(ctr);
            ctr.ctrtype = $("#selcontrollist").val();
            set = ctr;
        }
        else
            set.ctrtype = $("#selcontrollist").val();

        formSelectcontrol(set);
    });
    function makedatakey(datajson) {
        if (datajson.hasOwnProperty("datalist")) {
            datajson.datalist
        }
    }
    $("input,select").css({ "margin-bottom": "2px", height: "25px" })
}
function formControlFill(data, fm, filter, eventlist) {
    //when options has editmode:true, fill the form field with data
    var dt = datalistreturn(data), dtobj;
    if (filter != "")
        dt = applyFilter(dt, filter);
    if (dt.length > 0){
        dtobj = dt[0];
    }
  
    var rtn = [];
    var updateevent = $.grep(eventlist, function (a) {
        return a.command == "update";
    });
    if (updateevent.length > 0) {
        $(updateevent[0].mapping).each(function (a, b) {
            var fname = b[0], fval = "";
            if(typeof dtobj!="undefined")
             fval = dtobj[fname];//fieldname
            var rowtitle = b[1];//form row title
            var keycode = b[2];
            bydomformat(fval, rowtitle,keycode);
        });
    }
    function bydomformat(fval, rowtitle, keycode) {
        //in case label <label><span/><input/></label>
        fm.find('label').each(function (i, k) {
            if ($(k).find('span').text() == rowtitle) {
                var field = $(k).find('span').next();
                bynodename(field, fval);
            }
        });
    }
    function bynodename(field, fval) {
        switch (field.prop("nodeName")) {
            default:
                field.val(fval);
                break;
            case "LABEL":
                field.text(fval);
                break;
        }
    }
}
function controlmake(rowdt, id, curdt) {
    var rtn = "", optlist = "";
    $(rowdt).each(function (i, k) {
        var cid = "";
        if (typeof id != "undefined") cid = id + i;

        switch (k.ctrtype) {
            case "select": case "multiselect":
                if (k.hasOwnProperty("optionlist")) {
                    $(k.optionlist).each(function (i, k) {
                        optlist += k[0] + "," + k[1] + ";";
                    });
                    if (optlist != "")
                        optlist = optlist.substring(0, optlist.length - 1);
                }

                rtn += makeCtr(["select", optlist, cid, "margin-right:5px;", eventsrcipt(k)]);
                break;
            case "selectimage":
                if (k.hasOwnProperty("optionlist")) {
                    $(k.optionlist).each(function (i, k) {
                        optlist += k[0] + "," + k[1] + "," + k[2] + "," + k[3] + ";";
                    });
                    if (optlist != "")
                        optlist = optlist.substring(0, optlist.length - 1);
                }
                rtn += makeCtr(["selectimage", optlist, cid, ";margin-right:5px;", eventsrcipt(k)]);
                break;
            case "button":
                var btn = "";

                if (k.hasOwnProperty("button")) btn = k.button;
                var ctr = makeCtr([k.ctrtype, btn, cid, "margin-right:5px;", eventsrcipt(k)]);
                rtn += ctr;
            case "file":
                var comp = selectimc("imcsetting", "login").comp, imgsrc = "";
                if (k.hasOwnProperty("url")) {
                    imgsrc = k.url;
                    var urlid = "inpUrl" + id + k.seq;
                    rtn = "<input id='" + urlid + "' onkeyup=\"responsive_filemanager_callback('" + urlid + "')\" value='" + k.url + "' style='width:60%;margin-right:5px;'/>";
                    rtn += "<img style='height:25px;margin-right:5px;' id='imgx' src='" + imgsrc + "' />";

                }
                rtn += "<a href=\"/js2/filemanager/dialog.php?type=1&field_id=" + urlid + "\" class='roundbtn iframe-btn' type='button'>";
                rtn += "<i class='fa fa-cloud-download fa-2x imdim' style='padding-top:3px;'/></a>";

                $('.iframe-btn').fancybox({
                    'width': 900,
                    'height': 600,
                    'type': 'iframe',
                    'autoScale': true,
                    'autoSize': false
                });
                break;
            case "tree":
                if (typeof curdt != "undefined")
                    $(curdt.external).each(function (a, b) {
                        if (b.extid == "ext" + k.seq) {
                            var list = $("<div id='dvext" + id + k.seq + "'/>").attr("setting", JSON.stringify(b));
                            rtn += list.outerHTML();
                        }
                    });
                break;
            case "input":
                rtn += makeCtr([k.ctrtype, , cid, "margin-right:5px;", "type:text;placeholder:" + k.title, eventsrcipt(k)]);
                break;
            case "label":
                var lb = "";
                switch (k.label) {
                    case "custom":
                        lb = k.labelinput;
                        break;
                    default:
                        if (curdt.hasOwnProperty("data")) {
                            //var dlist = datalistreturn(curdt.data);
                            var dlist = $("#spdlist").text();
                            if (dlist != "") dlist = JSON.parse(dlist);
                            if (dlist.length > 0) lb = dlist[0][k.label];
                        }
                        break;
                }

               
                if (k.keymake && lb == "") {
                    switch (k.keymethod) {
                        case "random":
                            lb = k.keyprefix + idMake();
                            break;
                        case "seq":
                            lb = k.keyprefix + idMake();
                            break;
                    }
                }
                
                rtn += "<label style='font-weight:normal;padding-top:10px;'>" + lb + "</label>";
                break;
            case "image":
                var lb = "", imgsize = "100%";
                if (k.img == "custom") lb = k.imginput;
                else if (curdt.hasOwnProperty("data")) {
                    var dlist = datalistreturn(curdt.data);
                    if (dlist.length > 0) lb = dlist[0][k.img];
                }
                imgsize = k.imgsize + k.imgtype;
                rtn += "<img src='" + lb + "' style='width:" + imgsize + "' />";
                break;
            default:
                rtn += makeCtr([k.ctrtype, , cid, "margin-right:5px;", "placeholder:" + k.title, eventsrcipt(k)]);
                break;
        }
    });
    function eventsrcipt(k) {
        var ertn = "", funcname = id + k.seq;
        //if (k.functype != "none") {

        //     var tts = function () { eval(k.func) }; $("body").append(tts);
        //     ertn = k.functype + ":" + "tts" + "()";
        //    console.log(tts)
        //}
        return ertn;
    }
    return rtn;
}
function loadscript(that) {
    var ta = $("#txData");
    var bname = "";
   // if ($.inArray(that, []) > -1)
    {
       
    }
   var id="tb"+ $("#lbCtr").text()
   var str="var sv=saveTable1('"+id+"')";
    var txval=$("#tbBtn>tbody>tr").find("textarea")
    switch (that) {
        case "savelocal":
            bname = "Save";
            break;
        case "saveremote":
            bname = "Save";
            break;
        case "saveboth":
             bname = "Save";
            break;
        case "delete":
            bname = "Delete";
            break;
        case "cancel":
            bname = "Cancel";
            break;
        case "custom":
           
            break;
        default:
            ta.val('');
            break;
    }
    if (bname != "") {
        buttonupdate(bname);
        $("#inpbname").val(bname);
    }
    txval.val(str);
    function savedata() {
        var dtt = [], dt = [], curdt = {},data1=[];
        dtt = $("#splistdata").text();
        if (dtt != "") dtt = JSON.parse(dtt);

        dt = $.grep(dtt, function (a) {
            return a.code == $("#lbformid").text();
        });
        dt[0].ctrlist
        data1.push([makeCtr(["label", "Seq", , "width:100px", ]), makeCtr(["label", val.subseq, , "width:99%", ])]);
    }
}
function buttonupdate(that) {
    var btn=$(".dndul .selectlii");
    btn.text(that).css("width", "80px");
}
function makeArrSameseq(ctrlist, seq,finishedseq) {
    //push controls with same seq
    var seqrtn = [];
    if ($.inArray(seq, finishedseq) == -1) {
        $(ctrlist).each(function (i, k) {
            if (k.seq == seq)
                seqrtn.push(k);
        });
        finishedseq.push(seq);
    }
    return seqrtn;
}
var rr;
function addcontrol(ctr) {
    //add multiple control in a row
    var sty = "#dvbtnmenu{width: 580px; padding-top:3px;border-bottom:solid 0px #AEAEAE;max-height:22px;float:left; }";
    sty += "#ulmenu { list-style-type: none; display: inline-block; }";
    sty += " #ulmenu li { padding: 1px; width: 20px;text-align:center;border:solid 1px black;margin-right:3px; float:left;font-size: 1em;cursor:pointer; display: inline-block;}";
    sty += ".selectlii {color:white !important;background-color:black !important;}";
    sty += ".newaddli{border:dashed 2px yellow !important;}";
    styleInsert("addcontrol-css", sty);

    var contain = $("#dvbtnmenu");
    var trash = $(".fa-trash");
    var ul = $("#ulmenu");
    if (contain.length == 0) {
        contain = $("<div id='dvbtnmenu' />").droppable({
            drop: function (event, ui) { console.log('hi', event) }
        });
        trash = $("<i class='fa fa-trash fa-2x'  style='margin-left:10px' id='dvtrash'/>");
        trash.droppable({
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                $(this)
                  .addClass("ui-state-highlight")
                  .find("p")
                    .html("Dropped!");
                if ($("#ulmenu").find("li").length == 2) {
                    swal({
                        title: "Warning", text: "Delete row completely?", html: true, type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55"
                 , confirmButtonText: "Yes", cancelButtonText: "No"
                 , closeOnConfirm: true, closeOnCancel: true
                    }
             , function (isConfirm) {
                 if (isConfirm) {
                     $("#" + ui.draggable.context.id).remove();
                    // removeli(ui.draggable.context.id);
                 }
             });
                }
                else {
                    $("#" + ui.draggable.context.id).remove();
                   // removeli(ui.draggable.context.id);
                }
            }
        });
        contain.insertAfter($("#dvaddcontrol"));
        trash.appendTo($("#dvaddcontrol"));
    }
    if (ul.length == 0) {
        ul = $("<ul id='ulmenu' />").sortable({
            revert: false,
            placeholder: "ui-state-highlight"
        });
        contain.append(ul);
    }
    if (typeof ctr != "undefined") {
        if (ctr.hasOwnProperty("subseq")) {
            addli(ul, ctr.subseq, ctr);
           // ul.find("li").removeClass("selectlii");

        }
        else
            addli(ul, 1, ctr);
    }
    else {
        var maxnum = 1;
        $(ul.find("li")).each(function (i, k) {
            var val = $(k).attr("val");
            if (typeof val != "undefined") {
                val = JSON.parse(val);
                if(val.hasOwnProperty("subseq"))
                    if(parseInt(val.subseq)>=maxnum)
                        maxnum=parseInt(val.subseq)+1;
            }
        });
        addli(ul, maxnum);
    }
    $("#ulmenu").disableSelection();
    $("#ulmenu li").on("click", function () {
        tempControlSave();
        //console.log($("#lbSubseq").text()+$("#inpctrTitle").val())
        $(this).siblings().removeClass("selectlii");
        $(this).addClass("selectlii");
        var ctr = JSON.parse($(this).attr("val"));        var title = "",desc="",func="", conttype = "", subseq = "";
        if (ctr.hasOwnProperty('title')) title = ctr.title;
        if (ctr.hasOwnProperty('desc')) desc = ctr.desc;
        if (ctr.hasOwnProperty('func')) func = ctr.func;
        if (ctr.hasOwnProperty('ctrtype')) conttype = ctr.ctrtype;
        if (ctr.hasOwnProperty('subseq')) subseq = ctr.subseq;
        if (ctr.hasOwnProperty("data")) datareturn = ctr.data;
        $("#lbSubseq").text(subseq);
        $("#inpctrTitle").val(title);
        $("#inpctrDesc").val(desc);
        $("#txfunc").val(func);
        $("#inpctrDesc").val(desc);
        $("#selcontrollist").val(conttype);
        formSelectcontrol(ctr);
        $("#inpctrTitle").closest("tr").show();
        $("#inpctrDesc").closest("tr").show();
        //$("#txfunc").closest("tr").show();
        if (subseq != 1) {
            $("#inpctrTitle").closest("tr").hide();
            $("#inpctrDesc").closest("tr").hide();
            //$("#txfunc").closest("tr").hide();
        }

        //formControlEdit(JSON.parse($("#sptemp").text()), $(this).text());
    });
    function addli(ul, num, ctr) {
        var li = $("<li id='"+num+"'></li>");
        li.text(num);
        ul.append(li);
        setTimeout(function () {
            li.siblings().removeClass("selectlii");
            li.addClass("selectlii");

            if(typeof ctr=="undefined"){
                var val={ seq: $("#lbSeq").text(), subseq: num };
                li.attr("val", JSON.stringify(val));

                $("#lbSubseq").text(num);
                $("#inpctrTitle").val("")
                $("#inpctrDesc").val("")
                $("#selcontrollist").val("");
                $("#txfunc").val("");
                if (num != 1) {
                    $("#inpctrTitle").closest("tr").hide();
                    $("#inpctrDesc").closest("tr").hide();
                }
            }
            else{
                ctr.subseq = num;
                li.attr("val", JSON.stringify(ctr));

            }
            //li.click();
        }, 100);
    }
}
function removeli(num) {
    var ctrarr = JSON.parse($("#sptemp").text());
    $(ctrarr).each(function (i, k) {
        if (k.subseq == num)
            ctrarr.splice(i, 1);
    });
    $("#sptemp").text(JSON.stringify(ctrarr));
}
function formSelectcontrol(ctrarray) {
    var dvctr = $("#dvCtrdetail"), lbl = $("#dvCtrdetail").closest("tr").find("label");
    lbl.text("Detail");
    dvctr.empty();
    var optarr, valsel="";
    if (ctrarray.hasOwnProperty("optionlist")) optarr = ctrarray.optionlist;
    optiontable(optarr);
    if (ctrarray.hasOwnProperty("data") && ctrarray.data.hasOwnProperty("datalist")) {
        var list = Object.keys(ctrarray.data.datalist[0]);
        list.unshift("select");
        var valstr = makeCtr(["select", list.join(";"), "selval", "height:25px", "onchange:opttxt()"]),
            txtstr = makeCtr(["select", list.join(";"), "seltxt", "height:25px", ""]),
            btnlist = "<input type='button' value='Apply' onclick='makeoptionlist()' style='margin:0 0 5px 5px'/>" +
                    "<input type='button' value='Reset' onclick=\"datareturn='yes';$('#dvoption').remove();\" style='margin:0 0 5px 5px'/>";
    }
    //if select,selectimage insert placeholder tr,others remove tr
    switch (ctrarray.ctrtype) {
        case "select": case "selectimage":
            var prevtr = dvctr.closest("tr").prev();
            var pmsg = "Select ....";
            if (ctrarray.hasOwnProperty("placeholder")) pmsg = ctrarray.placeholder;
            if (prevtr.find("label").text() != "Placeholder") {
                $("<tr><td><label>Placeholder</label></td><td colspan='2'><input id='inpplace' value='"+pmsg+"' style='width:100%;height:20px' /></td></tr>").insertBefore(dvctr.closest("tr"))
            }
            else
                $("#inpplace").text(pmsg);
            break;
        case "file": case "image":
            var prevtr = dvctr.closest("tr").prev(), url = "", imgsrc = "/images/prettywoman1.jpg";
            if (ctrarray.hasOwnProperty("url")) url = ctrarray.url;
            if (prevtr.find("label").text() != "Url") {
                var comp = selectimc("imcsetting", "login").comp;
                var rtn = "<td><input id='inpUrl' onkeyup=\"responsive_filemanager_callback('inpUrl')\" style='width:75%'/>";
                if (url != "") {
                    rtn = "<td><input id='inpUrl' onkeyup=\"responsive_filemanager_callback('inpUrl')\" value='" + url + "' style='width:75%'/>";
                    imgsrc = url;
                }
                rtn += "<a href=\"/js2/filemanager/dialog.php?type=1&field_id=inpUrl\" class='roundbtn iframe-btn ' type='button'>Select</a></td>";
                rtn += "<td><div style='width:55px;min-height:40px;vertical-align:top;border:solid 1px #FFC000;padding:2px;'>";
                rtn += "<img style='max-height:27px' id='imgx' src='" + imgsrc + "'/></div></td>";
               
                $("<tr><td><label>Url</label></td>" +rtn + "</tr>").insertBefore(dvctr.closest("tr"));
                $('.iframe-btn').fancybox({
                    'width': 900,
                    'height': 600,
                    'type': 'iframe',
                    'autoScale': true,
                    'autoSize': false
                });
                if (ctrarray.ctrtype == "image") {
                    var rtn1 = "", dlist = [ 'custom'];
                    var dt = $("#spdlist").text();
                    if (dt != "") {
                        dt = JSON.parse(dt);
                            if(dt.length>0)
                                dlist = $.merge( Object.keys(dt[0]),dlist);
                    }
                    rtn1 = makeCtr(["select", dlist.join(";"), "selimage", "height:27px;margin-right:5px;", ""]);
                    $(rtn1).insertBefore($("#inpUrl"));
                    $("#inpUrl").hide(); $("#inpUrl").next().hide(); $("#inpUrl").parent().next().hide();
                    $("#selimage").on("change", function () {
                        toggleinput($("#selimage").val(), [$("#inpUrl"), $("#inpUrl").next(), $("#inpUrl").parent().next()]);
                    });
                    
                   
                    var lb = "";
                    if (dt == "") {
                        toggleinput($("#selimage").val(), [$("#inpUrl"), $("#inpUrl").next(), $("#inpUrl").parent().next()]);
                    }
                    if (ctrarray.hasOwnProperty("imginput")) lb = ctrarray.imginput;
                         if (ctrarray.hasOwnProperty("img")) {
                        $("#selimage").val(ctrarray.img);
                        if (ctrarray.img == "custom") {
                            $("#inpUrl").show(); $("#inpUrl").next().show(), $("#inpUrl").parent().next().show();
                        }
                    }
                }
            }
            break;
        default:
            var prevtr = dvctr.closest("tr").prev();
            if(prevtr.find("label").text()=="Placeholder")
            prevtr.remove();
            break;
    }
    switch (ctrarray.ctrtype) {
        case "select": case "multiselect":
            if (ctrarray.hasOwnProperty("data") && ctrarray.data.hasOwnProperty("datalist"))
            valsel = $("<div id='dvoption'>Value : " + valstr + " Text : " + txtstr + btnlist + "</div>");
            lbl.text("Options");
            break;
        case "selectimage":
            var imgstr = makeCtr(["select", list.join(";"), "selimg", "height:25px", ""]),
                descstr = makeCtr(["select", list.join(";"), "seldesc", "height:25px", ""]);
            if (ctrarray.hasOwnProperty("data") && ctrarray.data.hasOwnProperty("datalist"))
            valsel = $("<div id='dvoption'>Value : " + valstr + " Text : " + txtstr +
                 " Image : " + imgstr + " Desc : " + descstr + btnlist+"</div>");//value;text;imgsrc;description(index:0;1;2;3)
            lbl.text("Options");
            break;
        case "label":
            dvctr.empty();
            var dlist = ['custom','function'];
            var dt = $("#spdlist").text();
            if (dt != "") {
                dt = JSON.parse(dt);
                if (dt.length > 0)
                   dlist=$.merge(Object.keys(dt[0]),dlist);
            }
            var dblist = makeCtr(["select", dlist.join(";"), "sellabel", "margin-right:5px", "onchange:toggleinput($(this).val(),[$(this).next()])"]),
            valsel = $("<div id='dvoption'></div>");
            valsel.prepend($(dblist))
           
            var lb = "";
            if (ctrarray.hasOwnProperty("labelinput")) lb = ctrarray.labelinput;
            var inputlabel = $(makeCtr(["input", lb, "inplabel", "display:none;", ]));
            if (dt == "") inputlabel.show();
            valsel.append(inputlabel);
            lbl.text("Text");
            var keymake = $("<span>auto key generate<input id='cbkeymake' type='checkbox' onchange='$(this).parent().next().toggle()' style='height:15px'/></span><span style='margin-left:10px;display:none;'>Code type:" + makeCtr(["select", "random;seq number,seq"]) + " <input style='width:50px;margin-left:5px' placeholder='Prefix' id='inpprefix'/></span>");
            valsel.append(keymake);
            $("#cbkeymake").on("change", function () {console.log($(this).is(":checked"))
                if($(this).is(":checked"))$(this).parent().next().show();
                else $(this).parent().next().hide();
            });
            break;
        case "button":
            dvctr.empty();
            valsel = $("<div id='dvoption'></div>");
            var btn = "";
            if(ctrarray.hasOwnProperty("button"))btn=ctrarray.button;
            valsel.append($(makeCtr(["input",btn , "inpName", "inp", ])));
            lbl.text("Button Text");
            break;
        case "i":
            var icon = "fa fa-times";
            var iconlist = makeCtr(["i", , , icon, ]) + "&nbsp;" + makeCtr(["span", icon, "lbicon", "inp", ]) + "&nbsp;"
                + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnediticon", "btnRoundsmall", "onclick:faLoad('lbicon','" + icon + "')"]);

            valsel = $("<div id='dvoption'></div>");
            valsel.append(iconlist);
        case "tree":
            //external button attach
            //[rtnctrid,rtngdt,rtntype,extid,extgdt,exttype,misc]
            dvctr.empty();
            var gdt = "", id, options = {}, src = "";
            if ($("#splistdata").text() != "") {
                gdt = JSON.parse($("#splistdata").text());
                if (gdt.hasOwnProperty("dvid")) {
                    id = gdt.dvid;
                    options.gdt = gdt;
                    options.ctrid = id;
                    options.type = "form";
                }
                else {
                    var adt = $("#sparchive").text();
                    if (adt != "") adt = JSON.parse(adt);
                    id = adt.code;
                    options = adt;
                    options.gdt = gdt;
                    options.src = "list";
                    src = 'list';
                }
            }

            var extid = 'ext' + $('#lbSeq').text(), type = 'form', extgdt;
            if (typeof gdt != "undefined") extgdt = externalFind(gdt, extid);
            var opt1 = [id, options, type, extid, extgdt, "jstree"];
            if (ctrarray.hasOwnProperty("tree")) pmsg = ctrarray.tree;
            $("#dvCtrdetail").append($(makeCtr(["span", , "dv" + extid, , ])));

            // jstreeInitmake(extgdt, "dvedit" + extid);
            externalAttach(options, opt1);
            $("#dvCtrdetail").find("i").on("click", function () {
                tempControlSave(); formControlSave(); $("#tbbtn").find("button>span:contains('Save')").click();
                gdt = JSON.parse($("#splistdata").text()), chkexist = false;
                if (gdt.hasOwnProperty("external")) {
                    var dt = $.grep(gdt.external, function (a) {
                        return a.extid == 'ext' + ctrarray.seq;
                    });
                    if (dt.length == 0)
                        gdt.external.push({ extid: 'ext' + ctrarray.seq });
                }
                else
                    gdt.external = [{ extid: 'ext' + ctrarray.seq }];
                gdt.ctrtype = 'form';
                commonsave(id, src, gdt, options);
            });
            // this func will unshift the order of eventhandler
            var eventList = $._data($("#dvCtrdetail").find("i")[0], "events");
            eventList.click.unshift(eventList.click.pop());
            break;
      
        default:
            dvctr.empty();
            break;
    }
    if (valsel != "") valsel.prependTo($("#dvCtrdetail"));
    if (ctrarray.hasOwnProperty("label")) {
        $("#sellabel").val(ctrarray.label);
        if ($.inArray(ctrarray.label,["custom","function"])>-1) $("#inplabel").show();
        if (ctrarray.hasOwnProperty("keymake")) {
            $("#cbkeymake").prop("checked", true);
            $("#inpprefix").parent().toggle();
            $("#inpprefix").val(ctrarray.keyprefix);
            $("#inpprefix").prev().val(ctrarray.keymethod);
        }
        if (ctrarray.label == "custom") $("#inplabel").show();
        if (ctrarray.label == "custom") $("#inplabel").show();
    }
    if (ctrarray.ctrtype == "image") {
        lbl.text("Size");
        imgsize = "100", imgtype = "%";
        if (ctrarray.hasOwnProperty("imgsize")) {
            imgsize = ctrarray.imgsize;
            imgtype = ctrarray.imgtype;
        }
        dvctr.append($("<input /><select style='height:27px;margin-left:5px;'><option value='%'>%</option><option value='px'>px</option></select>"));
        dvctr.find("input").first().val(imgsize);
        dvctr.find("select").first().val(imgtype);
    }
    if (ctrarray.hasOwnProperty("optionvalue")) {
        $("#selval").val(ctrarray.optionvalue);
        $("#seltxt").val(ctrarray.optiontext);
    }
    if (ctrarray.hasOwnProperty("optionimage")) $("#selimg").val(ctrarray.optionimage);
    if (ctrarray.hasOwnProperty("optiondesc")) $("#seldesc").val(ctrarray.optiondesc);
}
function toggleinput(val,thatarr) {
    $(thatarr).each(function (i, k) {
        k.hide();
        $("#inplabel").next().show();
        if ($.inArray(val,["custom","function"])>-1) {
            k.show();
        }
        if (val == "function") {
            $("#inplabel").css({ width: "100%" }); $("#inplabel").next().hide();
        }
    });
   
}
function optiontable(optarr) {
    var data = [], optlist = "", array = [];
    var ctrtype = $("#selcontrollist").val();
    array = [makeCtr(["span", "text", , , ]), makeCtr(["span", "value", , , ]), makeCtr(["span", , , "width:20px", ])];
    switch (ctrtype){
    case "selectimage":
        array.splice(2, 0, makeCtr(["span", "desc", , , ]));
        array.splice(2, 0, makeCtr(["span", "image", , , ]));
        break;
    }
    data.push(array);

    if (typeof optarr != "undefined") {
        $(optarr).each(function (i, k) {
            array = [makeCtr(["input", k[0], , , ]), makeCtr(["input", k[1], , , ]),
                    makeCtr(["i", "fa fa-times-circle imdim", , "width:20px", ""])];
            switch (ctrtype) {
                case "selectimage":
                    array.splice(2, 0, makeCtr(["input", k[3], , , ]));
                    array.splice(2, 0, makeCtr(["input", k[2], , , ]));
                    break;
            }
             data.push(array);
        });

    }
    var colspan = data[0].length;
    var tb2 = makeTable("tbselect", data, "general");
    var dbmap = '<input id="inpoptionmap" type="button" class="btnRoundsmall" value="dbmap"  style="padding:2px;margin-right:5px"/>';
    var insert='<input id="inpselectadd" type="button" class="btnRoundsmall" value="add"  style="padding:2px;"/>';
    var foot = ['<div>'+dbmap+insert+'</div>|{"colspan":"'+colspan+'","style":"text-align:right;padding:5px 5px 2px 0;"}'];
    tb2 = appendFooter(tb2, foot);
    var dvctr = $("#dvCtrdetail");
    $("#tbselect").remove();
    dvctr.append(tb2);
    $("#inpselectadd").on("click", function () {
        //destory paging
        // if ($('#tbselect').length == 1) $("#tbselect").paging("destroy");
        var inp = makeCtr(["input", , , "width:99%;padding:1px;", ]);
        appendTableRow($('#tbselect'), [inp, inp, makeCtr(["i", "fa fa-times-circle imdim", , "", ""])]);
        delRowdelegate('tbselect');
        runAfterTableCreate("tbselect", { activepage: "last", pagenum: 10 });
    });
    $("#inpoptionmap").on("click", function () {
        var dv = $("<div/>"),tbarr=[];
        var tbhead = $("#tbselect>thead>tr>th>span");
        $(tbhead).each(function (i, k) {
            if($(k).text()!="")
            tbarr.push($(k).text())
        });
        dv.append(optionmaptable(tbarr));
        dv.dialog({
            autoOpen: true,
            modal: true,
            height: 325,
            width: 500,
            title: "Field Map",
            close: function (event, ui) {
                $(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: "Apply",
                    click: function () {
                        tblist = [];
                        var list = saveTable1('tboptionmap'),vlist,codename;
                        var srcdata = $("#spdlist").text();
                        if (srcdata != "") srcdata = JSON.parse(srcdata);
                        codename = list[1][1];
                        vlist = fieldTypeFind(srcdata, codename);
                        //$(list).each(function (i, k) {
                        //    var ftype = fieldTypeFind(srcdata, k[1]);
                        //    switch (i){
                        //        case 0:
                        //            vlist = ftype;
                        //            break;
                        //    }
                        //});
                        $(vlist.valuelist).each(function (i, k) {
                            $(srcdata).each(function (a, b) {
                                if (b[codename] == k) {
                                    var set = [];
                                    $(list).each(function (c,d) {
                                        set.push(b[d[1]]);
                                    });
                                    tblist.push(set);
                                    return false;
                                }
                            });
                            //var dt = $.grep(srcdata, function (a) {
                            //    return a[codename] = k;
                            //});
                            //console.log(dt)
                            //if (dt.length > 0) {
                            //    var set = [];
                            //    $(list).each(function (a, b) {
                            //        set.push(dt[0][b[1]]);
                            //        console.log(dt[0][b[1]], b[1])
                            //    });
                            //    tblist.push(set);
                            //}
                        });
                        $("#tbselect").remove();
                        optiontable(tblist);
                        $(this).dialog('destroy').remove();
                    }
                },
                {
                    text: "Close",
                    click: function () {
                        $(this).dialog('destroy').remove();
                    }
                }
            ]

        });
        dv.parent().css({ "z-index": 1000 });
    });
    delRowdelegate("tbselect");
    $('#tbselect').css("width", "100%");
    rowSortable($("#tbselect"));
}
function optionmaptable(tablefield){
    var inputlist = fieldnamelist();
    if (typeof tablefield == "undefined") tablefield = ["value","text"];
    var data = [[makeCtr(["span", "DataField", , , ]), makeCtr(["span", "Field", , , ])]];
    $(tablefield).each(function (i, k) {
        data.push([k, makeCtr(["select", inputlist.join(";"), "", "", ])]);
    });
    
    var tb = makeTable("tboptionmap", data, "general");
    return tb;
}
function opttxt() {
    $("#seltxt").val($("#selval").val());
}
function makeoptionlist() {
    var vallist = [],output=[];
    var valfield = $("#selval").val(),txtfield=$("#seltxt").val();
    $.each(datareturn.datalist, function (index, value) {
        if ($.inArray(value[valfield], vallist) === -1) {
            vallist.push(value[valfield]);
            output.push([value[valfield],value[txtfield]]);
        }
    });
    optiontable(output);
}
function formBuildSave(options) {
    var login = getlogin(), comp,form1=[];
    if (login == "") {
        sweetmsgautoclose("Warn", "You must log in to save!");
    }
    else {
        switch (login.group) {
            case "CommonAdmins":case "CommonUsers":
                comp = "_" + login.comp;
                break;
            case "SystemAdmins":
                comp = "";
                break;
        }

        var setting = {}, grid = [], design = {}, tab = [], optjson, src = "",external="",combine;
        var id = $("#lbCtr").text();//, code = $("#lbformid").text();
        if (id == "") {
            src = "list";
            id = makekey({}).code;
        }
        if (typeof options != "undefined") {
            if (options.hasOwnProperty("src")) src = options.src;
            if (src=='list' && options.hasOwnProperty("gdt")) external = options.gdt.external;
        }
        if (typeof comp != "undefined") {
            var form = $("#splistdata").text();

        }
        if (form == "") {
            combine = {};
            makekey(combine);
           // combine.eventlist = evtlist();
        }
        else {
           
            combine = JSON.parse(form);
             if (external != "")
                combine.external = external;
            combine=externalcleanup(combine);
            combine.title = $("#inpformTitle").val();
            combine.formgrplist = $("#inpgrplist").val();
            combine.colnum = $("#selcolnum").val();
            combine.actsave = $("#cbactsave").is(":checked");
            makekey(combine);
            //if delete row splice from sessionStorage
            var keylist = [], tblist = [];
            $(combine.ctrlist).each(function (a, b) {
                keylist.push(b.title);
            });
            var list = saveTable("tbCtrlist");
            if (list.length == 0) combine.ctrlist = [];
            else {
                $(list).each(function (a, b) {
                    tblist.push(b[3]);
                });
                var diff = $(keylist).not(tblist).get();
                $(combine.ctrlist).each(function (a, b) {
                    if ($.inArray(b.title, diff) > -1)
                        combine.ctrlist.splice(a, 1);
                });
                //combine.ctrlist = list;
            }
            if($(".dnd").length>0)
            combine.eventlist = dndevtlist("form");
        }
        var save = saveData(true);
        if (save.hasOwnProperty("data"))
            combine.data = save.data;

        $("#splistdata").text(JSON.stringify(combine));
        combine.ctrtype = 'form';
        commonsave(id, src, combine, options);
        return combine;
    }
   
    function makekey(combine) {
        var id = $("#lbCtr").text();//, code = $("#lbformid").text();
        if (id == "") {
            src = "list";
            var ardt = $("#sparchive").text();
            if (ardt != "") {
                ardt = JSON.parse(ardt);
                combine.code = ardt.code;
                combine.name = ardt.name;
                combine.desc = ardt.desc;
                combine.type = ardt.type;
                combine.title = $("#inpformTitle").val();
                combine.formgroup = $("#formgroup").val();
                combine.colnum = $("#selcolnum").val();
                combine.actsave = $("#cbactsave").is(":checked");
            }

        }
        else {
            combine.menuid = menuid;
            combine.subid = subid;
            combine.dvid = id;
        }
        return combine;
    }
    function externalcleanup(form) {
        //check if there is same seq number in external with that of the row deleting
        // if exists remove that external before delete row from $("#splistdata")
        var ctrlist = [];
        $("#tbCtrlist>tbody>tr").each(function (i, k) {
            ctrlist.push($(k).find("td > span").first().text());
        });
        if (form.hasOwnProperty("external")) {
            $(form.external).each(function (i, k) {
                if ($.inArray(k.extid.replace("ext", ""), ctrlist) == -1)
                    form.external.splice(i, 1);
            })
        }
        return form;
    }
}
function formControlSave() {
    var curarr = [], set = {}, id = idfinder();
    $("#ulmenu li").each(function (i, k) {
        val = $(k).attr("val");
        if (val != "") {
            set = JSON.parse(val);
            curarr.push(set);
        }
    });
    var form = $("#splistdata").text(), form1;
    if (form == "") {
        formBuildSave();
        form = $("#splistdata").text()
    }
    form1 = JSON.parse(form);
    if (form1.hasOwnProperty("ctrlist")) {
        var dt = $.grep(form1.ctrlist, function (a) {
            return a.seq != set.seq;
        });
        form1.ctrlist = $.merge(dt, curarr);
    }
    else
        form1.ctrlist = curarr;
    if (form1.hasOwnProperty("ctrlist")) {
        $("#tbCtrlist").remove();
        $("#tdcontrollist").append(formControllist(form1,id));
        delRowdelegate("tbCtrlist");
        runAfterTableCreate("tbCtrlist");
        $("#splistdata").text(JSON.stringify(form1));
        autofillgroup($("#lbSeq").text());
    }
   
}
function tempControlSave() {
    //save current page setting inside li
    var cursubseq = 1, seqorder = [];
    var set = {}, ctrlist = [], val = "";
    set.seq = $("#lbSeq").text();
    set.subseq = $("#lbSubseq").text();
    set.odr = $("#lbOdr").text();
    set.title = $("#inpctrTitle").val();
    set.desc = $("#inpctrDesc").val();
    if ($("#selformgrp").val() != null && $("#selformgrp").val() != "")
    set.formgroup = $("#selformgrp").val();
    set.functype = $("#seleventlist").val();
    set.func = $("#txfunc").val();
    set.ctrtype = $("#selcontrollist").val();
    if ($("#inpUrl").length > 0) {
        set.url = $("#inpUrl").val().replace("http://" + window.location.host, "");
    }
    var sty = {};
    if ($("#lbCtr").length == 0) {
        sty.ctrid = $("#lbformid").text();
        sty.type = "form";
    }
    else {
        sty.ctrid = $("#lbCtr").text();
    }
    if ($("#spinput").css("display") == "block" | $("#spinput").css("display") == "inline") {
        sty.style = $("#inpstyle").val();
    }
    if ($("#selcss").css("display") == "block" | $("#selcss").css("display") == "inline") {
        sty.class = $("#selcss").val();
    }
    set.style = sty;//JSON.stringify(sty);
    switch (set.ctrtype) {
        case "button":
            set.button = $("#inpName").val();
            break;
        case "select": case "selectimage":
            set.placeholder = $("#inpplace").val();
            break;
        case "label":
            var lb = $("#inplabel").val(), lb1 = $("#sellabel").val();
            set.label = lb1;
            set.labelinput = lb
            if ($("#cbkeymake").is(":checked")) {
                set.keymake = true
                set.keymethod = $("#inpprefix").prev().val();
                set.keyprefix = $("#inpprefix").val();
            }
            break;
        case "image":
            var dvctr = $("#dvCtrdetail");
            var lb = $("#inpUrl").val(), lb1 = $("#selimage").val();
            set.img = lb1;
            set.imginput = lb;
            set.imgsize = dvctr.find("input").first().val();
            set.imgtype = dvctr.find("select").first().val();
            break;
    }
    if ($("#tbselect>tbody>tr").length > 0) set.optionlist = saveTable1("tbselect");
    if (typeof datareturn == "object") {
        set.data = datareturn;
        if ($("#selval").length > 0) set.optionvalue = $("#selval").val();
        if ($("#seltxt").length > 0) set.optiontext = $("#seltxt").val();
        if ($("#selimg").length > 0) set.optionimage = $("#selimg").val();
        if ($("#seldesc").length > 0) set.optiondesc = $("#seldesc").val();
    }
    $("#ulmenu").find(".selectlii").attr("val", JSON.stringify(set));
}
function autofillgroup(seq) {
    //auto fill formgroup 
    var prev = "";
    var form = $("#splistdata").text(),ctrlist;
    if (form != "") {
        form = JSON.parse(form);
        ctrlist = form.ctrlist;
    }
    $("#tbCtrlist>tbody>tr").each(function (i, k) {
        var curr = $(k).find("td:nth-child(2)>span")
        if (i+1 == seq)
            prev = curr.text();
        else if(i+1>seq){
            curr.text(prev);
            ctrlist[i].formgroup = prev;
        } 
    });
    $("#splistdata").text(JSON.stringify(form));
}
//#endregion

//#region content
var contparam = "",contentdt="";
function contentInit(id, option) {
    //if (typeof option !="undefined" && option.hasOwnProperty("gdt")) {
    //    console.log(id, JSON.stringify(option.gdt)); return false;
    //}
    var gdt, dt = "", datacode = "", filter = "";
    contentInit.datasrc = datasrc;
    classInsert(id);
    var contain = $("#" + id);
    if (typeof option != "undefined" && option.hasOwnProperty("gdt")) {
        gdt = option.gdt;
        if (gdt.hasOwnProperty("data") && gdt.data.datacode != "") {
            datacode = gdt.data.datacode;
            filter = findfilter(gdt.data);
        }
        if (option.hasOwnProperty("contain")) contain = option.contain;
    }
    if (typeof gdt == "undefined") {
        if ($("#archivegdt").text() != "")
            gdt = JSON.parse($("#archivegdt").text());
        else
            gdt = readdata(id, "gdt");
        if (typeof gdt != "undefined") {
            if (gdt.hasOwnProperty("data") && gdt.data.datacode != "")
                datacode = gdt.data.datacode;
            else
                process("", gdt, option, contain, filter);
        }
    }
    if (datacode != "")
        jsonReadAjax("imcdata", "", "code", datacode, contentInit.datasrc, [gdt, option, contain, filter]);
    function datasrc(dsrc, gdt, option, contain, filter) {
        var dt;
        if (dsrc != "")
            dt = datalistreturn(dsrc);
        if (filter != "")
            dt = applyFilter(dt, filter);
        process(dt, gdt, option, contain);
    }
    function process(dt, gdt, option, contain) {
        var cid = contain.attr("id");
        var gstack1 = [], tab = [{ href: "001" + cid, html: "FirstTab" }], cstyle = [],setup,disp="",pagenum="",ht="";
        if (typeof gdt != "undefined") {
            if (gdt.hasOwnProperty("setting")) { 
            if (gdt.setting.hasOwnProperty("gridstack")) gstack1 = gdt.setting.gridstack;
            if (gdt.setting.hasOwnProperty("tab"))  tab = gdt.setting.tab;
            if (gdt.setting.hasOwnProperty("style"))  cstyle = gdt.setting.style;
            }
            if (gdt.hasOwnProperty("setup")) setup = gdt.setup;
        }
        if (typeof option != "undefined" && option.hasOwnProperty("key") && typeof dt != "undefined") {
            //content requested from external control(option has key & val)
            dt = $.grep(dt, function (a) {
                return a[option.key] == option.val;
            });
            dt = dt[0];
        }
        var tb, tr, td;
        tb = $("<table style='width:100%' id='tbcontent" + cid + "'/>"), tr, td;
        //contain.empty()
        contain.append(tb);
        //contain.css("width", "100%");
        contain.removeClass("yellow");
       // gridstackStyle();
      
        if (typeof dt == "undefined" | dt == "")
            tabmake(tb, "", "");
        else {
            datarun(call);
            function datarun(callback) {
                $(dt).each(function (j, x) {
                    tabmake(tb, j, x);
                });
                if (typeof callback == "function") {
                    call();
                }
            }
            function call() {
                var rownum = 1;
                if (setup.hasOwnProperty("dispnum")) rownum = setup.dispnum;

                if (setup.hasOwnProperty("pagenum")) pagenum = setup.pagenum;
                if(dt.length/rownum<pagenum)pagenum=Math.ceil(dt.length/rownum);
                var opt = {
                    perPage: rownum
                    , limitPagination: pagenum
                    , containerClass: "panel-footer"
                };
                if (dt.length > 1)
                    paginathing($("#tbcontent" + cid), opt);
            }
        }
        //bottom btn
      
        actionbutton(dt, cid, gdt, $("#" + cid).find(".ui-tabs-panel"), option);//bottons are located at top,bottom,left,right of contain
       
        //move pagination to bottom
        $("#" + gdt.dvid + ">.pagination-container").appendTo($("#" + gdt.dvid + ">.pagination-container").parent())
        //show text scroll to end
        setTimeout(function () {
            $(".grid-stack-item").each(function (i, k) {
                var sx = parseInt($(k).attr("data-gs-x"));
                var ex = parseInt($(k).attr("data-gs-width"));
                var sy = parseInt($(k).attr("data-gs-y"));
                var ey = parseInt($(k).attr("data-gs-height"));
                if (nothingbelow($(k), sx, ex,sy)) {
                    $(k).find(".grid-stack-item-content").removeClass();
                    $(k).parent().css({ "overflow-y": "auto" });
                }
                else {
                    $(k).children().first().css({ "overflow-y": "auto" });
                    }
            });
            switch (setup.height) {
                case "auto":
                    $(".grid-stack").each(function (i, k) {
                        var maxht = 0, cht;
                        if ($(k).css("overflow-y") == "auto") {
                            $($(k).find(".grid-stack-item>div")).each(function (x, y) {
                                cht = $(y).height();
                                if (maxht < cht)
                                    maxht = cht;
                            });
                            $(k).css({ height: maxht + 20,"min-height":"","overflow-y":"hidden" });
                        }
                    });
                    break;
                default:
                    $(".grid-stack").css({ height: setup.height });
                    break;
            }
          
            if (setup.tab=="none") {
                $('[href^="#001' + cid + '"]').closest('ul').hide();
            }
        }, 2000);
        
        function nothingbelow(item,startx,endx,starty) {
            //chk widget box exist below
            var td = item.closest('td');
            var chk = true;
            $(td).find(".grid-stack-item").each(function (i, k) {
                var sx = parseInt($(k).attr("data-gs-x"));
                var ex = parseInt($(k).attr("data-gs-width"));
                var sy = parseInt($(k).attr("data-gs-y"));
                var ey = parseInt($(k).attr("data-gs-height"));
             
                if (starty < sy && ((sx >= startx && startx <= ex) | (sx <= endx && endx <= ex))) {
                    chk = false;
                }
            });
            return chk;
        }
        function tabmake(tb, j, x) {
            var ntab = [];
            $(tab).each(function (s, y) {
                var ss = {};
                ss.href = y.href + j;
                ss.html = y.html;
                ntab.push(ss);
            });
            var workarr = {};
            if ($("#tab-grid" + cid + j).length > 0) {
                $("#tab-grid" + cid + j).remove();
            }
            //$("#tab-grid" + cid)
            workarr.id = "tab-grid" + cid + j;
            workarr.head = ntab;
            var content = [];
            $(workarr.head).each(function (i, k) {
                var dvWorkspace = $("<div class='grid-stack grid-stack-24' style='min-height:300px;'/>");
                dvWorkspace.attr("id", "tab" + k.href);
                dvWorkspace.attr("dtrow", JSON.stringify(x));
                content.push(dvWorkspace.prop('outerHTML'));
            });

            workarr.content = content;
            var tabmake = makeTab(workarr);
            tr = $("<tr/>"), td = $("<td>");
            tb.append(tr);
            tr.append(td);
            td.append(tabmake);

            var options = {
                float: true
                , static_grid: true
                , draggable: { scroll: false }
                , width: 24
                , cell_height: 20
                , vertical_margin: 3
                , auto_height: true
            };

            var worktab = $("#tab-grid" + cid + j);
            worktab.tabs({
                activate: function (event, ui) {
                    var currentTabId = $($("div[id*='tab-grid" + cid + j + "'] ul .ui-tabs-active").find('a')).attr("href");
                    var tabid = "tab" + currentTabId.replace("#", "") + j;
                    var tabstack = [];
                    $(gstack1).each(function (q, b) {
                        if ("tab" + b.tabid + j == tabid) {
                            if (b.type == 'video')
                                resizeIframe($("#contain" + b.id));
                        }
                    });
                }
            });
            setTimeout(function () {
                $("div[id='tab-grid" + cid + j + "'] ul>li").each(function (i, k) {
                    var tabid = $(k).find('a').attr("href").replace("#", "tab");
                    //gridstackInit(tabid);
                    var tabstack = [];
                    $(gstack1).each(function (q, b) {
                        if ("tab" + b.tabid + j == tabid)
                            tabstack.push(b);
                    });
                    $('#' + tabid + '.grid-stack').gridstack(options);
                    gridstackLoad(id, tabid, tabstack, 'display', x, j);
                });
            }, 500);
        }
      
        return tb;
    }
}
function contentEdit(id, option) {
    //classInsert(id);
    gstack = [];
    var cstyle,setup="", arattach = "", archive ="", src = '', code = '', name = '', desc = '', gdt, type;
    if (typeof option != "undefined") {
        if (option.hasOwnProperty('src')) src = option.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (option.hasOwnProperty('type')) type = option.type
        if (option.hasOwnProperty('gdt')) gdt = option.gdt;
        if (option.hasOwnProperty('ctrid')) id = option.ctrid;
        if (option.hasOwnProperty('code')) code = option.code;
        if (option.hasOwnProperty('rtnid')) rtnid = option.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
        if (option.hasOwnProperty('archive')) archive = option.archive;
        if (src == "temp") {
            $("#splistdata").text(JSON.stringify(gdt));
        }
    }
    else {
        gdt = editDataFind(id, option);
        option = editoptionmake("content", id, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
    }
    if (typeof gdt != "undefined") {
        //common thru type
        if (gdt.hasOwnProperty("code")) code = gdt.code;
        if (gdt.hasOwnProperty("name")) name = gdt.name;
        if (gdt.hasOwnProperty("desc")) desc = gdt.desc;
        if (gdt.hasOwnProperty("archive")) {
            option.archive = archive;
            archive = gdt.archive;
        } 
        //from here differ by type
        if (gdt.hasOwnProperty("setting")) {
            if (gdt.setting.hasOwnProperty("gridstack")) gstack = gdt.setting.gridstack;
            if (gdt.setting.hasOwnProperty("style")) cstyle = gdt.setting.style;
        }
        if (gdt.hasOwnProperty("data")) contentdt = gdt.data;
        if (gdt.hasOwnProperty("setup")) setup = gdt.setup;
        if ($.inArray(src, ["externalsave", "externalsavelist"]) > -1) {
            if (option.hasOwnProperty("rtngdt")) {
                extgdt = option.rtngdt;
                if (extgdt.hasOwnProperty("data")) {
                    contentdt = extgdt.data;//for getcolumnlist, declare global param:contentdt;
                }
            }
        }
    }
    console.log(id,gdt,src)
    //tab create
    var tabarr = {};
    $("#tab-Contain").remove();
    tabarr.id = "tab-Contain";
    tabarr.head = ["Content", "Action", "Data","Style"];
    var content = [];
    var msg = "";
    //1st Tab
    content.push("<div id='dvcontentedit'/>" );

    //3rd Tab action
    content.push("<div id='dndcontain_content' class='dndcontain'  />");
    //4th Tab
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    if ($.inArray(src, ["list", "externalsavelist"]) > -1) {
        archivegdtReload(tab);
        funStop();
    }
    else {
        //container create
        var conarr = {};
        conarr.id = "dveditback";
        conarr.body = tab;
        var container = makeContainer(conarr);
    }
    $("#dvcontentedit").append(gridstackEdit(id, gdt));//.prop('outerHTML')
    //button
    $("#tab-Contain").find("div").first().append(editbutton(option));
    $('input[type = "button"]').button();
    $('button').button();
    //tabclick event
    var tabb = $('#' + tabarr.id);
    var first = true, action = true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 1:
                    var dcode = "";
                    if (gdt.hasOwnProperty("data")) dcode = gdt.data.datacode;
                    if (dcode != $("#spDatacode").text()) reloadAction();
                    //3rd action
                    if (action) {
                        dndboxInit(gdt, 'content');
                        action = false;
                    }
                case 2:
                    dataTabClick(id, option);
                    break;
                case 3:
                    //3rd Tab style
                    if (first) {
                        if (typeof id == 'undefined') id = code;
                        cssEditInit("Style", id,"content");
                        first = false;
                    }
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['contentedit', 'setting',dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'contentedit');
    helpinsert();
    //content workspace tab
    var worktab = $("#tab-grid");
    worktab.tabs({
        activate: function (event, ui) {
            var currentTabId = $($('div[id*="tab-grid"] ul .ui-tabs-active').find('a')).attr("href");
            var tabid = "tab" + currentTabId.replace("#", "");
            gridstackInit(id, tabid);
            var tabstack = [];
            $(gstack).each(function (j, l) {
                if ("tab" + l.tabid == tabid) {
                    if (l.type == 'video')
                        resizeIframe($("#contain" + l.id));
                }

            });
        }
    });
    $('div[id*="tab-grid"] ul>li').each(function (i, k) {
        var tabid = $(k).find('a').attr("href").replace("#", "tab");
        gridstackInit(id, tabid);
        var tabstack = [];
        $(gstack).each(function (j, l) {
            if ("tab" + l.tabid == tabid)
                tabstack.push(l);
        });
        gridstackLoad(id, tabid, tabstack, 'edit');
    })
    $('div[id*="tab-grid"] ul>li').find('a').attr("href");
    gridstackAdd(id, "tab-grid");
    tabrename("tab-grid");
    $(document).tooltip({
        position: {
            my: "center top",
            at: "center bottom+5",
        },
        show: {
            duration: "fast"
        },
        hide: {
            effect: "hide"
        }
    });
   
    $("#selwidget").change(function (e) {
        if($(this).val()=="None")
            sweetmsgautoclose("Warn","Only first tab available!")
    })
    //style tab dialog remove
    $(".ui-dialog-titlebar").hide()
    $('.ui-dialog').css({
        'position': 'relative',
        'top': 0,
        left: 0
    });
    $("#dvCsscontain").parent().css("z-index", "1000");
    setTimeout(function () {
        if (typeof cstyle != "undefined") {
            $("#selwidget").val(cstyle.widget);
            if (cstyle.widget == "None") $('[href="#001' + id + '"]').closest('ul').hide();
           // $("#selshownum").val(cstyle["show num"]);
        }
        var tab = "tab", ht = "",pct="px", disp = "", pnum = "";
        if (setup.hasOwnProperty("tab")) tab = setup.tab;
        if (setup.hasOwnProperty("height")) {
            var ht1 = setup.height, rtn = splitpct(ht1);
            if (rtn.chk) {
                ht = rtn.ht.toString();
                pct = rtn.pct;
            }
            console.log(rtn)
        }
        if (setup.hasOwnProperty("dispnum")) disp = setup.dispnum.toString();
        if (setup.hasOwnProperty("pagenum")) pnum = setup.pagenum.toString();
        
        $("#seltab").val(tab);
        $("#selheight").next().val(pct);
        toggleSelect($("#selheight"), ht);
        toggleSelect($("#seldisplaynum"), disp);
        toggleSelect($("#selpagenum"), pnum);
        $('.fade').remove();
        console.log(tab,pct,ht,disp,pnum)
    }, 1000);
    function splitpct(txt){
        var rtn={chk:false};
        if(txt!=""){
            $(["%","px","em",""]).each(function(i,k){
                if(txt.indexOf(k)>-1){
                    rtn.chk=true;
                    rtn.pct=k;
                    rtn.ht=txt.substring(0,txt.length-k.length);
                }
            });
        }
        return rtn;
    }
}
function contentsetting(id,gdt) {
    //var dva = $("<div />");
    var data = [
       [makeCtr(["span", "Option", ,"width:150px" , ]), makeCtr(["span", "Value", ,"width:150px" , ])]//headers
      , ["Tab", makeCtr(["select", "Tab,tab;None,none", "seltab", "inp", ""])]
      , ["Height", makeCtr(["select", "200;400;500;600;auto;custom", "selheight", "", ]) + makeCtr(["select", "px;%;em", , "", ])]
      , ["Dispnum", makeCtr(["select", "1;2;3;4;5;all;custom", "seldisplaynum", "", ])]
       , ["Pagenum", makeCtr(["select", "5,10;custom", "selpagenum", "", ])]
        ];

    var tb = makeTable("contentset", data, "general1");
    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' id='save-grid' value='Save'  onclick=\"contentsettingSave('" + id + "');\"/>&nbsp;";
  
   // btn += "<input type='button' value='Cancel'  onclick=\"$('#" +id + "').remove();$('.fade').remove();editorRemove();\"/></div>";
    //dva.append(btn);
   // $("#selshownum").css("padding", 0);

    return tb;
}
function contentsettingSave() {
    $('[href="#001' + id + '"]').closest('ul').show();
   // var ctr=selectimctable(menuid,subid,id)
    var con = saveTable("contentset", false), setting = {}, sty = {};
    $(con).each(function (i, k) {
        var val = k[1];
        if (k.length == 3) val += k[2];
        sty[k[0].toLowerCase()] = val;
    });
    return sty;
    //if (ctr.hasOwnProperty("setting")) setting = ctr.setting; else setting = ctr.setting = {};
    //setting.style = sty;
    //updateimctable(menuid, subid, id, ctr);

    //if (ctr.setting.style.widget == "None") {
    //    $('[href="#001' + id + '"]').closest('ul').hide();
    //}


}
function styleBorder(ctrid,styid,style) {
    var setting = {}, design={},grid = [];
    var combine = selectimctable(menuid, subid, ctrid);
    if (typeof (combine) == "undefined") {
        combine = {};
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = ctrid;
        datacode = $("#lbDatacode").text();
    }
    else
        datacode = combine.datacode;
    if (!combine.hasOwnProperty("setting")) combine.setting = {};
    if (!combine.setting.hasOwnProperty("design")) combine.setting.design = {};

    combine.setting.design.layout = styid;
    if(typeof style !="undefined" && style !="")
        combine.setting.design.style = style;
        updateimctable(menuid, subid, ctrid, combine);

}
function contentEditSave(id, options) {
    var setting = {}, grid = [], design = {}, tab = [], optjson, src = "";
    if (options.hasOwnProperty("src"))
        src = options.src;
   
    var combine = saveData(true);
    if (combine.hasOwnProperty("setting")) setting = combine.setting;
    if (setting.hasOwnProperty("gridstack")) grid = setting.gridstack;
    if (setting.hasOwnProperty("design")) design = setting.design;
  
    var tablist = $("#tab-grid").find("li").find("a");
    $(tablist).each(function (i, k) {
        var tid = $(k).attr("href").replace("#", "");
        var name = $(k).html();
        tab.push({ href: tid, html: name });
    });
    //add external
    combine.external = externalsave();
    //add acton
    if ($(".dnd").length > 0)
        combine.eventlist = dndevtlist("content");

    var con = saveTable("contentset", false,true), sty = {};
    $(con).each(function (i, k) {
        var val = k[1];
        if (k.length == 3 && k[1]!="auto") {
            val += k[2];
        }
        sty[k[0].toLowerCase()] = val;
    });
    setTimeout(function () {
        gridstackSave();
        setting.gridstack = gstack;
        setting.tab = tab;
        combine.setup = sty;
        combine.setting = setting;
        combine.ctrtype = 'content';
        commonsave(id,src,combine, options);
    }, 500);
   
}
var srcval="",parentid="" ;
function gridObjectEdit(ctrid,tabid, objid, type,cnt) {
    var columnlist1 = "", columnlist = "";
    var clist = [];
    var rtn = "";
 
    var dt, src, dtsrc;
    if ($("#spdlist").text() != "") {
        dt = JSON.parse($("#spdlist").text());
        dtsrc = JSON.parse($("#spdataajax").text());
    }
    if (typeof dt != "undefined") {
        if (typeof dtsrc.filter != "undefined" && dtsrc.filter.length > 0)
            dt = applyFilter(dt, dtsrc.filter);
        if (dt.length > 0) {
            $.each(dt[0], function (i, k) {
                clist.push(i);
            });
        }
        columnlist = clist;
    }
    var tb1 = editcontent(type);
    if (typeof tb1 == "undefined" | typeof type=="undefined") tb1 = "";

    //tab create
    var tabarr = {};
    if ($("#tab-Edit2").length > 0) {
        $("#tab-Edit2").remove();
    }
    tabarr.id = "tab-Edit2";
    tabarr.head = ["Edit"];

    var content = [];
    //if (tb1 != "") {
    //    tabarr.head.unshift("Edit");
    //    content.push(tb1);
    //}
    content.push(tb1);

    tabarr.content = content;
    var tab = makeTab(tabarr);
    if ($("#dvDia").length > 0) $("#dvDia").remove();
    var dia = $("<div id='dvDia'/>");
    console.log(tabid)
    dia.append(tab);
    dia.dialog({
        autoOpen: true,
        modal: true,
        height: "auto",
       resize:"auto",
        width: 800,
        title: "Edit",
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
            $("#dveditback").show();
        },
        buttons: [
            {
                text: "Apply",
                click: function () {
                    var tabstack = findcurrentstack(tabid.replace("tab", ""));
                    gridObjectEditSave(tabid, objid, type);
                    $(this).dialog('destroy').remove();
                    $("#dveditback").show();
                    classInsert(ctrid);
                    gridstackLoad(ctrid, tabid, tabstack, 'edit');

                }
            },
            {
                text: "Close",
                click: function () {
                    $(this).dialog('destroy').remove();
                    $("#dveditback").show();
                }
            }
        ]
    });
    tabbedDialog(dia, tab);
    tab.addClass('helpinsert');
    tab.attr("help", 'content_'+type);
    helpinsert();
    tab.find("button[title='help']").css({ position: "absolute", right: "2em" });
    var content = "", savetype = "html", text = "", url = "",link="",iclass="fa-user",size="" , clas = "", dtmap = "", prefix = "$[data]";
    $(gstack).each(function (i, k) {
        if (k.id == objid && k.hasOwnProperty("content")) {
            if (k.content.hasOwnProperty("savetype")) savetype = k.content.savetype;
            if (k.content.hasOwnProperty("text")) text = k.content.text;
            if (k.content.hasOwnProperty("url")) url = k.content.url;
            if (k.content.hasOwnProperty("link")) link = k.content.link;
            if (k.content.hasOwnProperty("iclass")) iclass = k.content.iclass;
            if (k.content.hasOwnProperty("size")) size = k.content.size;
            if (k.content.hasOwnProperty("datamap")) dtmap = k.content.datamap;
            if (k.content.hasOwnProperty("clas")) clas = k.content.clas;
            if (k.content.hasOwnProperty("prefix")) prefix = k.content.prefix;
        }
    });

    $("#dveditback").hide();
    styleInsert("tab", ".ui-tabs-panel{padding:5px 0 0 0 !important}");
    var datamaplist =columnlist;
    if (datamaplist == "undefined") datamaplist = "";
    contenttinyMCE(text, "#txEditor", datamaplist);
    runAfterTableCreate('tes3');//collapse rows
    switch (type) {
        case "img":
            $("#inpUrl").val(url);
            responsive_filemanager_callback('inpUrl');
            $("#inpUrl").next().button();
            break;
        case "text":
            $("#selHtmltype").val(savetype);
            break;
        case "video":
            $("#txiframe").val(url);
            break;
        case "iframe":
            $("#txiframe").val(url);
            $("#selLink").val(link);
            break;
        case "icon":
            $("#lbicon").text(iclass);
            $("#fa1").attr("class", iclass);
            $("#selSize").val(size);
            break;
    }
    $("#selClas").val(clas);

    codechg('backward'); codechg('forward');
    $("#selDatamap").val(dtmap);

   if (dtmap != ""){
       showValuelist(type,dtmap);
       $("#selValuelist").val(prefix);
   }
   if (prefix != "$[data]") $("#dvPrefix").show();
   //Edit content...
     function editcontent(type) {
         var rtn = "";
         if (typeof columnlist !="undefined" && columnlist !="undefined" && columnlist.length > 0 && type !="text") {
             columnlist.unshift("No data field mapped,");
             rtn = "<div style='padding:5px 0 0 5px;'><table><tr><td style='vertical-align:top;'><label for='selDatamap' style='width:90px'>MapData:</label></td>";
             rtn +="<td>"+ makeCtr(["select", columnlist.join(';'), "selDatamap", "inp", "onchange:showValuelist('" + type + "',$(this).val())"])+"</div>";
             rtn += "<div style='display:none;' id='dvValuelist'></div></td></tr></table></div>";
         }
         //style
         rtn += "<div style='padding:5px 0 0 5px;'><label for='selClas' style='width:90px'>Style:</label>";
         rtn += makeCtr(["select", makeselStylelist(ctrid), "selClas", "inp", ""]) + "<span class='imbtn' onclick=\"styleBuildPop('"+ctrid+"')\"><i style='margin:0 2px 0 5px;' class='fa fa-css3'></i>css</span></div>";
         switch (type) {
             case "text":
                 rtn += "<div style='padding:5px 0 0 5px;'><label for='selHtmltype' style='width:90px'>Savetype:</label>";
                 rtn += makeCtr(["select", "HTML,html;Plain Text,text", "selHtmltype", "inp", ""])+"</div>";
                 rtn += "<div style='padding:5px 0 0 5px;'>";
                 rtn += $("<textarea id='txEditor'/>").prop('outerHTML');
                 rtn += "</div>";
                 break;
             case "icon":
                 rtn += "<div style='padding:5px 0 0 5px'><label style='width:90px'>Icon:</label><i id='fa1' class=\""+iclass+"\" />&nbsp;<label style='margin-right:5px' id='lbicon'/>";
                 rtn += "<button  onclick=\"faLoad('lbicon')\" >edit</button>";
                 rtn += "<div style='padding:5px 0 0 0;'><label style='width:90px'>Size:</label>";
                 rtn += makeCtr(["select", "1x,;lg,fa-lg;2x,fa-2x;3x,fa-3x;4x,fa-4x;5x,fa-5x", "selSize", "inp", "onchange:changeiconsize($(this).val())"]);
                 rtn += "</div></div>";
                 break;
             case "video":
                 rtn += "<div style='padding:5px 0 0 5px;clear:both;'>";
                 rtn += "<table style='width:100%'><tr><td style='vertical-align:top;width:50%;'><label>Iframe:</label><i style='margin-left:20px;' title='run code to preview' class='fa fa-refresh imdim' onclick=\"onPasteyoutube($('#txiframe'))\"></i><br /><textarea onkeyup=\"onPasteyoutube($(this))\" rows=5 cols=52 id='txiframe'></textarea>";
                 rtn += "</td>";
                 rtn += "<td style='vertical-align:top' rowspan='3'><label>Preview:</label><br /><div id='dvYoutube' style='width:350px;min-height:250px;vertical-align:top;border:solid 10px #FFC000;padding:2px;'></div></td></tr>"
                 rtn += "</table>";
                 $('#txiframe').bind("paste", function (e) {
                     $("#dvYoutube").empty();
                     var ifr = $($(this).val());
                     ifr.attr("width", "330");
                     ifr.attr("height", "247");
                     $("#dvYoutube").append(ifr);
                 });
                 break;
             case "iframe":
                 rtn += "<div style='padding:5px 0 0 5px;clear:both;'>";
                 rtn += "<table style='width:100%'><tr><td style='vertical-align:top;width:50%;'><label style='width:100px' for='selLink'>Iframe:</label>" +
                     makeCtr(["select", "select,;stafflist,controls/imc/share/stafflist.aspx", "selLink", "inp", "onchange:fillin($(this).val())"]) +
                     "<i style='margin-left:20px;' title='run code to preview' class='fa fa-refresh imdim' onclick=\"onPasteyoutube($('#txiframe'))\"></i><br /><textarea onkeyup=\"onPasteyoutube($(this))\" rows=5 cols=52 id='txiframe'></textarea>";
                 rtn += "</td>";
                 rtn += "<td style='vertical-align:top' rowspan='3'><label>Preview:</label><br /><div id='dvYoutube' style='width:350px;min-height:250px;vertical-align:top;border:solid 10px #FFC000;padding:2px;'></div></td></tr>"
                 rtn += "</table>";
                 $('#txiframe').bind("paste", function (e) {
                     $("#dvYoutube").empty();
                     var ifr = $($(this).val());
                     ifr.attr("width", "330");
                     ifr.attr("height", "247");
                     $("#dvYoutube").append(ifr);
                 });
                 break;
             case "img":
                 var comp = selectimc("imcsetting", "login").comp;
                 rtn += "<div style='padding:5px 0 0 5px;clear:both;'>";
                 rtn += "<table style='width:100%'><tr><td style='vertical-align:top;width:60%;'><label style='width:90px'>URL:</label><input id='inpUrl' onkeyup=\"responsive_filemanager_callback('inpUrl')\" style='width:60%;margin-right:5px;'/>";
                 rtn += "<a href=\"/js2/filemanager/dialog.php?type=1&field_id=inpUrl\" class='roundbtn iframe-btn' type='button'>Select</a></td>";
                 rtn += "<td rowspan='3'><div style='width:280px;min-height:200px;vertical-align:top;border:solid 10px #FFC000;padding:2px;'><img style='max-width:250px' id='imgx' src='/images/prettywoman1.jpg'/></div></td></tr>"
                 rtn += "</table>";
                 $('.iframe-btn').fancybox({
                     'width': 900,
                     'height': 600,
                     'type': 'iframe',
                     'autoScale': true,
                     'autoSize':false
                 });
                 break;
         }
         return rtn;
     }
    
}
function fillin(that) {
    var url="http://"+window.location.hostname+"/"+that;
    var rtn = '<iframe width="420" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
    $('#txiframe').val(rtn);
}
function gridObjectEditSave(tabid, objid, type) {
    var gsid = [];
    var chk = false;
    var data = "";
    $(gstack).each(function (i, k) {
        if (k.id == objid) {
            data = k;
            chk = true;
            return false;
        }
    });
    if (!chk) {
        if(typeof objid !="undefined")
            gstack.push({ id: objid, type: type });
    }
    //apply to all
    var clas = "", dtmap = "", prefix = "";
    var lastfix = "";
    //var sc = saveTable("tes3", true);
    //$(sc).each(function (i, k) {
    //    lastfix = "";
    //    if (typeof k[2] != "undefined") lastfix = k[2];
    //    if (k[1].toUpperCase() != "#FFFFFE")//prevent input:color display as black(#00000)
    //        sty += k[0] + ":" + k[1] + lastfix + ";";
    //});
    if ($("#selClas").children().length>0)
    clas=$("#selClas").val();
    dtmap = $("#selDatamap").val();
    prefix = $("#selValuelist").val();

    $(gstack).each(function (i, k) {
        if (k.id == objid) {
            //apply by type
            switch (type) {
                case "text":
                    var txt = tinyMCE.activeEditor.getContent();
                    if ($("#selHtmltype").val() == "text") txt = $(txt).text();
                    k.content = { savetype: $("#selHtmltype").val(), text: txt };
                    break;
                case "icon":
                    k.content = { iclass: $("#fa1").attr("class"), size: $("#selSize").val() };
                    break;
                case "video":
                    k.content = { url: $("#txiframe").val() };
                    break;
                case "iframe":
                    k.content = { url: $("#txiframe").val(), link: $("#selLink").val() };
                    break;
                case "img":
                    k.content = { url: $("#inpUrl").val() };
                    break;
            }
            //apply to all
            if (dtmap != "") k.content.datamap = dtmap;
            if (prefix != "$[data]") k.content.prefix = prefix;
            if (clas != "" ) k.content.clas = clas;
        }
    });
}
function styleBuildPop(ctrid) {
    var sty = "", type = "class", title = "", desc = "";
    var datasrc = "", dt = selectimc("imcsetting", "csslist");
    var ctr = selectimctable(menuid, subid, ctrid);
    clientid = ctrid;
    if (ctr.hasOwnProperty("csscode")) {
        $(dt).each(function (i, k) {
            if (k.code == ctr.csscode) {
                datasrc = combinecss(k).stylelist;
            }
        });
       
        $(datasrc).each(function (i, k) {
            var name = k.sname;
            switch (k.stype) {
                case "class":
                    name = "." + name;
                    break;
                case "id":
                    name = "#" + name;
                    break;
            }
            console.log(name, $("#selClas").val())
            if (name == $("#selClas").val() && k.hasOwnProperty("style")) {
                sty = JSON.stringify(k.style).replace('"', "").replace('"', "");
                type = k.stype;
                title = k.sname;
                desc = k.sdesc;

            }
        });
    }
    addstyleBuild(sty, title, type, desc);
    $($("#dvCsscontain").parent()).css({ "z-index":1300,"width": "800px", "left": "270px" });
}
function getColumnlist(data,filterkeyval) {
    var clist = [];
    var rtn="",datacode="";
    //var data = imctableAjaxRead(id);
    if (typeof data != "undefined" && data != "undefined") {
        if (data.hasOwnProperty("datacode")) datacode=data.datacode;
        else if(data.hasOwnProperty("code")) datacode=data.code;
    }
    if(datacode !="")
            var src = selectimcdata("imcdata", datacode).datalist;
            jsonReadAjax("imcdata", "", datacode, getColumnlist.datasrc, [filterkeyval]);
        }  
    function datasrc(dtsrc,filterkeyval){
        var dt = [], src;
        if (dtsrc != "") {
            src = dtsrc.datalist;
        }
        if (typeof filterkeyval != "undefined")
            $(src).each(function (a, b) {
                if (b[filterkeyval[0]] == filterkeyval[1]) {
                    dt.push(b); return false;
                }
            });
        else
            dt = src;
        if (typeof dtsrc.filter != "undefined" && dtsrc.filter.length > 0)
            dt = applyFilter(dt, dtsrc.filter);
        if (typeof dt!="undefined" && dt.length > 0) {
            $.each(dt[0], function (i, k) {
                clist.push(i);
            });
            rtn = { src: dt, columnlist: clist };
        }
           
    
}
function showValuelist(type, fname) {
    var ftype = fieldTypeFind(srcval, fname);
    var val = ftype.valuelist;
    val.unshift("select,");
    var onchg = "";

    switch (type) {
        case "text":
            onchg = "tinyMCE.activeEditor.setContent(filterVal($(this).val()))";
            break;
        case "icon":
            onchg = "$('#fa1').attr('class',filterVal($(this).val()));$('#lbicon').text(filterVal($(this).val()))";
            break;
        case "video":
            onchg = "$('#txiframe').val(filterVal($(this).val()));onPasteyoutube($('#txiframe'))";
            break;
        case "img":
            onchg = "$('#inpUrl').val(filterVal($(this).val()));responsive_filemanager_callback('inpUrl')";
            break;
    }
    var sel = makeCtr(["select", val.join(';'), "selValuelist", "inp", ""]);
    if (val.length > 0) {
        $("#dvValuelist").empty();
        $("#dvValuelist").css({ "display": "block","margin-top":"5px"});
        $("#dvValuelist").append($(sel).css("max-width", "250px").attr("onchange",onchg));
        $("#dvValuelist").append($("<span onclick=\"$('#dvPrefix').toggle();$('#txPrefix').val('$[data]')\" class='linkbtn'><i title='add filter to the data'  class='fa fa-edit fa-lg' style='margin-left:5px;' > </i> Prefix/Suffix</span><i style='margin-left:5px' class ='fa fa-info-circle imdim' title='Testing only ! Selection not applied to actual display!'/>"));
        $("#dvValuelist").append($("<div style='display:none;margin-top:5px;' id='dvPrefix'><textarea cols=50 rows=3 id='txPrefix' value='$[data]'></textarea><br /><div class='imdim' onclick=\"sweetmsg('Prefix/Suffix Method','<b>$[data]</b> will replaced with selected value string.<br /> ex)this <b>$[data]</b> is important.==> this <b>selected value</b>  is important')\"><i class ='fa fa-info-circle imdim' />How to fiter setting. </div></div>"));

    }
}
function filterVal(val) {
    var rtn="";
    var amd = $("#txPrefix").val();
    var cnt=amd.split("$[data]").length - 1;

    if (amd == "") rtn = val;
    else {
        for (i in cnt)
            amd = amd.replace("$[data]", val);
        rtn = amd;
    }
    return rtn;
}
function dataFieldmap(fieldarray) {
    // data list for dragdrop to tinyMCE
    var field = [];
    $(fieldarray).each(function (i, k) {
        var el = {};
        el.text = k;
        el.onclick = function() {tinymce.activeEditor.execCommand('mceInsertContent', false, "$[" + k + "]");};
        field.push(el);
    });
    return field;
}
//$("#imgx").css({"clip":"rect(0, 100px, 20px, 0)","position":"absolute"});//clip으로 일부분만 표시가능
function onPasteyoutube(that) {
    console.log(that)
    $("#dvYoutube").empty();
    var ifr = $(that.val());
    ifr.attr("width", "330");
    ifr.attr("height", "247");
    $("#dvYoutube").append(ifr);
}
function responsive_filemanager_callback(field_id) {

    var url = jQuery('#' + field_id).val();
    var arr = location.href.split('/');
    var baseurl = arr[0] + "//" + arr[2];
    $('#' + field_id).val(url.replace(baseurl, ""));
    var default_url="/images/noimage1.jpg";
    setTimeout(function () {
        $("#imgx").error(function () { $(this).attr('src', default_url) });
        $("#imgx").attr("src", url);
    }, 500);

}
function changeiconsize(val) {
    var icon=$('#lbicon').text().replace("fa-lg","").replace("fa-2x","").replace("fa-3x","").replace("fa-4x","").replace("fa-5x","");
    $('#lbicon').text(icon + ' ' + val);
    $('#fa1').attr('class', 'fa '+icon + ' ' + val);
}
function contenttinyMCE(msg, selector, fieldarray) {
    editorRemove();
    if (typeof selector == "undefined" | selector == "") selector = "#txEditor";
    tinymce.init({
        selector: selector,
        theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap print preview hr anchor pagebreak save ",
            "searchreplace wordcount visualblocks visualchars code fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "emoticons template paste textcolor colorpicker textpattern imagetools responsivefilemanager"
        ],
        setup: function(editor) {
            editor.addButton('mybutton', {
                type: 'menubutton',
                text: 'DataField',
                tooltip: "Insert Data Field to Editor",
                icon: false,
                menu: dataFieldmap(fieldarray)
            });
        },
        toolbar: " bold italic forecolor backcolor | alignleft aligncenter | link image | mybutton",
        image_advtab: true,
        external_filemanager_path:"/filemanager/",
        filemanager_title:"Responsive Filemanager" ,
        external_plugins: { "filemanager": "/filemanager/plugin.min.js" },

        file_browser_callback: function (field_name, url, type, win) {
            console.log("filename:", field_name, "url:", url, "type:", type, "win", win)
            win.document.getElementById(field_name).value = "my browser value";// '/data/document/acuvue/woman-1.jpg';
            iffileup(field_name);
        }
    });
    if (typeof selector != "undefined" && typeof msg != "undefined" && msg != "")
        setTimeout(function () {
            tinyMCE.activeEditor.setContent(msg);
        }, 1000);
}
function editorRemove() {
    for (i in tinymce.editors) {
        tinymce.remove(tinymce.editors[i]);
    }
}

//gridstack editing
var gstack = [],gcontent=[];
function gridstackEdit(id, gdt) {
    var contain = $("<div />"), dvbtn, dvWorkspace, dvbody;
    var accdv=$("<div id='accordh'  style='margin-bottom:10px;'/>"), ol,li,head;
    ol = $("<ol/>"), li1 = $("<li/>"), li2 = $("<li/>"), head1 = $("<h2><span>Layout</span></h2>"), head2 = $("<h2><span>Object</span></h2>")
    , dv1 = $("<div style='padding:10px 0 0 20px;'/>"); dv2 = $("<div style='padding:10px 0 0 20px;'/>");
    accdv.append(ol);
    ol.append(li1).append(li2);
    li1.append(head1).append(dv1);
    li2.append(head2).append(dv2);
    contain.append(accdv);
    dv2.append($('<a class="btn btn-default imgbtn1" style="margin-left:15px;" id="newtext" href="#"><img src="/images/font.png" title="text"/></a>'));
    dv2.append($('<a class="btn btn-default imgbtn1" id="newimage" href="#"><img src="/images/pic.png" title="image"/></a>'));
    dv2.append($('<a class="btn btn-default imgbtn1" id="newvideo" href="#"><img src="/images/youtube.png" title="video"/></a>'));
    dv2.append($('<a class="btn btn-default imgbtn1" id="newiframe" href="#"><img src="/images/iframe.png" title="iframe"/></a>'));
    dv2.append($('<a class="btn btn-default imgbtn1" id="newicon" href="#"><img src="/images/happy-icon.png" title="icon"/></a>'));

    dv1.append($('<a class="btn btn-default imgbtn1 gslaycss" style="margin-left:15px;" title="blank form" id="tempblank" href="#"><img src="/images/blank.png" title="blank page"/></a>'));
    dv1.append($('<a class="btn btn-default imgbtn1 gslaycss" title="form with rectangle border" id="temprec" href="#"><img src="/images/template_rectangle.png" title="Rectangle"/></a>'));
    dv1.append($('<a class="btn btn-default imgbtn1 gslaycss" title="form with round border" id="tempround" href="#"><img src="/images/template_round.png" title="Round"/></a>'));
    dv1.append($('<a class="btn btn-default imgbtn1 gslaycss" title="form with rectangle border and header area" id="temphead1" href="#"><img src="/images/template_rectangle_head.png" title="Head"/></a>'));
    dv1.append($('<a class="btn btn-default imgbtn1 gslaycss" title="form with round border and header area" id="temphead2" href="#"><img src="/images/template_round_head.png" title="RndHead"/></a>'));
    dv1.append($('<div style="float:right;border-left:solid 1px #BEBEBE;padding:2px 5px 2px 0;"><a class="btn btn-default imgbtn1 gslaycss" title="edit css of template" id="tempcss" href="#"><img src="/images/Files-Css-Filetype-icon.png"/>edit</a></div>'));

    //tab create
    var tab = [{href:"001"+id,html:"FirstTab"}];
    if (typeof gdt != "undefined" && gdt.hasOwnProperty("setting")) {
        if (gdt.setting.hasOwnProperty("tab")) {
            tab = gdt.setting.tab;
        }
    }

    var workarr = {};
    if ($("#tab-grid").length > 0) {
        $("#tab-grid").remove();
    }
    workarr.id = "tab-grid";
    workarr.head =tab;
    var content = [];
    $(workarr.head).each(function (i, k) {
        var dvWorkspace = $("<div class='grid-stack grid-stack-24 dashbox' style='min-height:300px;'/>");
        dvWorkspace.attr("id", "tab" + k.href);
        content.push(dvWorkspace.prop('outerHTML'));
    });

    workarr.content = content;
    if(workarr.head.length>0){
        var tab = makeTab(workarr);

    var tb = $("<table width='100%'/>"), tr = $("<tr/>"), td1 = $("<td style='vertical-align:top;width:25%;padding-right:5px;'/>"), td2 = $("<td style='width:75%'/>");
    tb.append(tr), tr.append(td1).append(td2), td2.append(tab);
    td1.append(contentsetting(id, gdt));
    contain.append(tb);
}
   gridstackStyle('edit');

   return contain;
}
function tabrename(tabid) {
    var tabs;
    if (typeof tabid != "undefined")
        tabs = $("#" + tabid).tabs();
    else
        tabs = $(".dvtab").tabs();
    tabs.find(".ui-tabs-nav").sortable({
        axis: "x",
        stop: function () {
            tabs.tabs("refresh");
        }
    });
    var tabli = $(tabs.find("ul")).find("li");
    $(tabli).each(function (i, k) {
        if ($($(k).find('input')).length == 0) {
            $(k).prepend($("<input class='txt' type='text' style='display:none'/>"));
            $(k).append($("<span class='ui-icon ui-icon-close' style='float: left; margin: 0.4em 0.2em 0 0; cursor: pointer;' role='presentation'>Remove Tab</span>"));
        }
    });

    //tabli.on('dblclick', function () {
    //    $(this).find('input').toggle().val($(this).find('a').html()).focus();
    //    $(this).find('a').toggle();
    //});

    //tabli.on('blur', 'input', function () {
    //    $(this).toggle();
    //    $(this).siblings('a').toggle().html($(this).val());
    //});
    tabs.delegate("li","dblclick", function () {
        $(this).find('input').toggle().val($(this).find('a').html()).focus();
        $(this).find('a').toggle();
    });
    tabs.delegate("input", "blur", function () {
        $(this).toggle();
        $(this).siblings('a').text($(this).val()).toggle();
    })
    tabs.delegate("span.ui-icon-close", "click", function () {
        var panelId = $(this).closest("li");
        var sibling = $(this).closest("ul").find("li");
        if (sibling.length == 1) {
            sweetmsgautoclose("Error", "You can't delete last tab!!");
            return false;
        }
        if (checkCookie('Remove_tab_of_content'))
            execode();
        else
            swal({
                title: "Are you sure?"
          , text: "<div>You will not be able to recover this file!</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('Remove_tab_of_content');\">Don't ask</a></div>"
          , type: "warning"
          , showCancelButton: true
          , confirmButtonColor: "#DD6B55"
          , confirmButtonText: "Yes, delete it!"
          , cancelButtonText: "No, never!"
          , closeOnConfirm: true
          , closeOnCancel: true
                , html: true
            },
          function (isConfirm) {
              if (isConfirm) {
                 execode();
              }
          });
        function execode() {
            var pp = panelId.remove().attr("aria-controls");
            $("#" + pp).remove();
            tabs.tabs("refresh");
        }
    });

}
function gridstackAdd(ctrid,tabid) {
    var tabs;
    if (typeof tabid != "undefined")
        tabs = "#" + tabid;
    else
        tabs = ".dvtab";

    var dvWorkspace;

    $(tabs).find("ul").append($("<div style='float:left;margin:5px 0 0 0;' title='add tab'><i id='addtab'  style='color:#9C7878' class='fa fa-plus-square fa-lg imdim'/></div>"));
    $("#addtab").click(function () {
        var num_tabs = $(tabs + " ul li").length;
        var code = "tb" + idMake();
        $(tabs + " ul li:last").after(
            "<li><a href='#" + code + "'>New tab" + num_tabs+1 + "</a></li>"
        );
        var dv=$("<div id='"+code+"'/>");
        dvWorkspace = $("<div class='grid-stack grid-stack-24 dashbox' style='min-height:300px;'/>");
        dvWorkspace.attr("id", "tab" + code);
        dv.append(dvWorkspace);
        $(tabs).append(dv);

        gridstackInit(ctrid,"tab"+code);
        $(tabs).tabs("refresh");
        //tabrename(tabid);
        $(tabs).tabs("option", "active", num_tabs);


        var tabli = $($(tabs).find("ul")).find("li");
        $(tabli).each(function (i, k) {
            if ($($(k).find('input')).length == 0) {
                $(k).prepend($("<input class='txt' type='text' style='display:none'/>"));
                $(k).append($("<span class='ui-icon ui-icon-close' style='float: left; margin: 0.4em 0.2em 0 0; cursor: pointer;' role='presentation'>Remove Tab</span>"));
            }
        });
    });

}
function gridstackStyle(type) {
    $("#gridstack-css1").remove();
    var sty = ".grid-stack>.grid-stack-item>.grid-stack-item-content{left:0px; right:3px !important;} ";
    if (type == 'edit') {
        sty += ".grid-stack {  background: lightgoldenrodyellow;    }";
        sty += ".grid-stack-item-content {color: #2c3e50;text-align: center;background-color: #18bc9c;border:dashed 1px gray;z-index:10 }";
    }
    else
        sty += ".grid-stack .grid-stack-item .grid-stack-item-content {   overflow: hidden;}";
    sty += "#btnnew { display:none;background-color:#BABABA;position:absolute;width:100%;}";
    sty += ".topdv { position:absolute;top:0;left:0;padding:5px 5px 5px 0;background-color:#D7D7D7;width:100%;opacity:0.7;z-index:0}";
    sty += ".contentin { text-align:left;}";
    sty += ".imgbtn1 { padding:0 0 0 10px;}";
    sty += ".ui-tabs .ui-tabs-panel {padding:5px 0 0 0}";
    sty += ".tophead { background-image:linear-gradient(to bottom, #C2C2C2,#C2C2C2 50px, #FFFFE0 15%, #FFFFE0 85%,#FFFFE0 85%);}";
    styleInsert("gridstack-css1", sty);
}
var temp1, temp2, temp3, temp4, temp5, tempcss,tst;
function gridstackInit(ctrid,tabid) {
    //var grid = $('#' + tabid + '.grid-stack').data('gridstack');
    //if(grid!="undefined" && typeof grid !="undefined")
    //grid.remove_all;
    var options = {
        float: true
        , width: 24
        , cell_height: 20
        , vertical_margin: 3
        , auto_height: true
    };
    $('#'+tabid+'.grid-stack').gridstack(options);
    //$('#'+tabid).gridstack(options);
    var tabstack = [];
    $(gstack).each(function (i, k) {
        if ("tab"+k.tabid == tabid)
            tabstack.push(k);
    });

    new function () {
        this.items = tabstack;
        this.grid = $('#'+tabid+'.grid-stack').data('gridstack');
        //this.grid = $("#"+tabid).data('gridstack');
        this.load_grid = function () {
            this.items = gstack;
            this.grid.remove_all();
            var items = GridStackUI.Utils.sort(this.items);
            _.each(items, function (node) {
                var cont = makeGridstack(ctrid,tabid,node.id,node.type,node);
                this.grid.add_widget(cont,
                    node.x, node.y, node.width, node.height);

            }, this);
        }.bind(this);

        var node = {//this.items.pop() || {
            x: parseInt(12 * Math.random()),
            y: parseInt(5 * Math.random()),
            width: 1,
            height: 1
        };
        this.newimage = function () {
            node.id = "gs" + idMake();
            var cont = makeGridstack(ctrid,tabid,node.id, "img",node);
            node.height =8;
            node.width = 8;
            this.grid.add_widget(cont,
                node.x, node.y, node.width, node.height, true);
        }.bind(this);
        this.newtext = function () {
            node.id = "gs" + idMake();
            node.width = 12;
            node.height = 2;
            var cont = makeGridstack(ctrid,tabid, node.id, 'text', node);
            this.grid.add_widget(cont,
                node.x, node.y, node.width, node.height, true);
        }.bind(this);
        this.newvideo = function () {
            node.id = "gs" + idMake();
            node.height = 8;
            node.width = 8;
            var cont = makeGridstack(ctrid,tabid, node.id, 'video', node);
            this.grid.add_widget(cont,
                node.x, node.y, node.width, node.height, true);
            resizeIframe($("#contain" + node.id));

        }.bind(this);
        this.newiframe = function () {
            node.id = "gs" + idMake();
            var cont = makeGridstack(ctrid, tabid, node.id, "iframe", node);
            node.height = 12;
            node.width = 12;
            this.grid.add_widget(cont,
                node.x, node.y, node.width, node.height, true);
        }.bind(this);
        this.newicon = function () {
            node.id = "gs" + idMake();
            var cont = makeGridstack(ctrid,tabid, node.id, "icon", node);
            node.height = 1;
            node.width = 1;
            this.grid.add_widget(cont,
                node.x, node.y, node.width, node.height, true);
            $("#" + node.id).parent().css("z-Index", 3000);
        }.bind(this);
        this.save_grid = function () {
            this.serialized_data = _.map($('.grid-stack > .grid-stack-item'), function (el) {
                el = $(el);
                var tabid = $(el.parent()).attr("id").replace("tab","");
                var fch=$(el.children()[0]);
                $(fch.find('div')).each(function(i,k){
                    if($(k).attr('id')){
                        id=$(k).attr('id');
                        type=$(k).attr('data-type');
                    }
                });
                var node = el.data('_gridstack_node');
                return {
                    tabid:tabid,
                    id: id,
                    type:type,
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height
                };
            }, this);
            var grid = this.serialized_data;
            //delete from gstack
            var gsid = [];
            $(grid).each(function (i, k) {
                gsid.push(k.id);
            });
            $(gstack).each(function (j, l) {
                if ($.inArray(l.id, gsid) == -1)
                    gstack.splice(j, 1);
            });
            //update gstack
            $(grid).each(function (i, k) {
                var chk = false;
                $(gstack).each(function (j, l) {
                    if (l.id == k.id) {
                        l.tabid = k.tabid;
                        l.x = k.x;
                        l.y = k.y;
                        l.height = k.height;
                        l.width = k.width;
                        chk = true;
                    }
                });
                if (!chk)
                    gstack.push(k);
            });


            //gstack = JSON.parse(this.serialized_data, null, '    ');
            //$('#saved-data').val(JSON.stringify(this.serialized_data, null, '    '));
        }.bind(this);

        this.clear_grid = function () {
            this.grid.remove_all();
            gstack = "";
        }.bind(this);

        $("#newimage").unbind("click");
        $("#newtext").unbind("click");
        $("#newvideo").unbind("click");
        $("#newiframe").unbind("click");
        $("#newicon").unbind("click");
       // $("#save-grid").unbind("click");
        $("#clear-grid").unbind("click");
        $("#load-grid").unbind("click");

        $('#newimage').click(this.newimage);
        $('#newtext').click(this.newtext);
        $('#newvideo').click(this.newvideo);
        $('#newiframe').click(this.newiframe);
        $('#newicon').click(this.newicon);
        //$('#add-new-widget').click(function () { createnew('img');});
        $('#save-grid').click(this.save_grid);
        $('#save-grid1').click(this.save_grid);
        $('#clear-grid').click(this.clear_grid);
        $('#load-grid').click(this.load_grid);
        //horizontal accordion init
        $('#accordh').liteAccordion({
            theme: 'stitch',
            containerHeight: 70,
            containerWidth: 765,
            headerWidth: 48,
            rounded: true,
            enumerateSlides: false,
            firstSlide: 2,
            activateOn: 'click',
            linkable: true
        });
       // this.load_grid;
    };
    $("#tempblank").unbind("click");
    $("#temprec").unbind("click");
    $("#tempround").unbind("click");
    $("#temphead1").unbind("click");
    $("#temphead2").unbind("click");
    $('#tempblank').click(function () { $(".grid-stack").removeClass("roundbox1 tophead").addClass("dashbox"); });
    $('#temprec').click(function () { $(".grid-stack").removeClass("roundbox1 tophead dashbox").addClass("rectanglebox"); });
    $('#tempround').click(function () { $(".grid-stack").removeClass("rectanglebox tophead dashbox").addClass("roundbox1"); });
    $('#temphead1').click(function () { $(".grid-stack").removeClass("roundbox1 dashbox").addClass("rectanglebox tophead"); });
    $('#temphead2').click(function () { $(".grid-stack").removeClass("rectanglebox dashbox").addClass("roundbox1 tophead"); });
    //$('#tempcss').click(function () { console.log("tobecontinued") });

}
function makeGridstack(ctrid, tabid, objid, type, node) {
    var contain = $("<div id='contain" + objid + "' />");
    var content = $('<div class="grid-stack-item-content contentin" />');
    contain.append(content);
    var img = "/images/prettywoman1.jpg";
    var text = "There ain’t no party like a Lagos party.";
    var video = '<iframe src="https://www.youtube.com/embed/xAQQClV3k1E" frameborder="0" allowfullscreen></iframe>';
    var iframe = '<iframe src="' + window.location.pathname + '" frameborder="0" allowfullscreen></iframe>';
    var icon = 'fa fa-user';
    var cont = "", clas = "", sty = "";
    if (node.hasOwnProperty("content")) {
        cont = node.content;
        if (cont.hasOwnProperty("text")) text = cont.text;
        if (cont.hasOwnProperty("url")) {
            switch (type) {
                case "img":
                    img = cont.url;
                    break;
                case "video":
                    video = cont.url;
                    break;
                case "iframe":
                    iframe = cont.url;
                    break;
            }
        }
        if (cont.hasOwnProperty("iclass")) icon = cont.iclass;
        if (cont.hasOwnProperty("clas")) clas = cont.clas;
    }
    contain.append($("<div/>"));
    var el;//content element
    switch (type) {
        case "img":
            el = $("<img />").attr("src", img)
            break;
        case "text":
            el = $("<div />").html(text);
            break;
        case "video":
            el = $(video);
            break;
        case "iframe":
            el = $(iframe);
            break;
        case "icon":
            el = $("<i/>").attr("class",icon);
            break;
    }

    content.append(el);
    if (sty != "") sty += ";";
        if (type == 'img') sty += "max-width:100%;max-height: 100%";
        el.attr("style", sty);
        if (clas != "") {
            console.log("here,",clas)
        var cha = [];
        if (cont.hasOwnProperty("clas")) {
            clas = cont.clas.split("");
            $(clas).each(function (i, k) {
                if ($.inArray(k, [".", "#"]) == -1)
                    cha.push(k)
            });
            clas = cha.join("");
        }
        el.attr("class", clas);
    }
    $(contain.children()[0]).css("background-color", "transparent");
    var dv = $("<div id='" + objid + "' data-type='" + type + "' style='vertical-align:top;text-align:right;display:none;'/>");
    contain.attr("onmouseover", "$('#" + objid + "').show()");
    contain.attr("onmouseout", "$('#" + objid + "').hide()");
    //if (type != 'icon') {
    //    contain.attr("onmouseover", "$('#" + objid + "').show()");
    //    contain.attr("onmouseout", "$('#" + objid + "').hide()");
    //}
    //else {
    //    var mval = "$('#" + objid + "').dialog({ width: '70px',minHeight:'80px',resizable: false,draggable:false,position: { my: 'right center', at: 'right top', of: '#contain" + objid + "' }});";
    //    mval += "$('#" + objid + "').dialog().dialog('widget').find('.ui-dialog-title').hide();";
    //    mval += "$('#" + objid + "').dialog().dialog('widget').find('.ui-dialog-titlebar-close').hide();";
    //    mval += "$('#" + objid + "').dialog().dialog('widget').find('.ui-dialog-titlebar').hide();";
    //    mval += "$('#" + objid + "').attr('onmouseout',\"$('#" + objid + "').dialog('destroy');\");";
    //    mval += "$('#" + objid + "').css({'min-height':'30px'});";
    //    mval += "$('#" + objid + "').parent().css({'z-index':10000,'margin-bottom':'-20px'})";
    //    contain.attr("onmouseover", mval);
    //   contain.attr("onmouseout", "$('#" + objid + "').dialog('destroy');");
    //}

    var topdv = $("<div class='topdv'/>");
    dv.append(topdv);
    //var del = $("<i class='fa fa-trash imdim' style='padding:3px;' onclick='$($(this).parent().parent().parent()).remove()'/>");
    var del = $("<i class='fa fa-trash fa-lg imdim' style='padding:3px;' onclick=\"delGridstack('" + objid + "')\"/>");
    var edit = $("<i class='fa fa-pencil fa-lg imdim' style='padding:3px;'  onclick=\"gridstackSave('" + tabid + "');gridObjectEdit('" + ctrid + "','" + tabid + "','" + objid + "','" + type + "')\"/>");
    topdv.append(edit);
    topdv.append(del);
    content.append(dv)
    contain.attr("onclick", "containSelect($(this),'" + tabid + "','" + objid + "','" + type + "')");
    contain.css("z-index", 2);
    return contain;
}
function makeGridstackDisplay(tabid, objid, type, node, dtrow, j) {
    var contain = $("<div id='contain" + objid +j+ "' />");
    var content = $('<div class="grid-stack-item-content contentin" />');
    contain.append(content);
    var img = "",text = "",video = '',iframe='', icon = '',cont = "", sty = "",clas="";
    if (node.hasOwnProperty("content")) {
        cont = node.content;
        if (type == "text") text = gridstackTextDatamap(cont.text, dtrow);
        else if (typeof cont.datamap == "undefined") {
            if (cont.hasOwnProperty("text")) text = cont.text;
            if (cont.hasOwnProperty("url")) {
                switch (type) {
                    case "img":
                        img = cont.url;
                        break;
                    case "video":
                        video = cont.url;
                        break;
                    case "iframe":
                        iframe = cont.url;
                        break;
                }
            }
            if (cont.hasOwnProperty("iclass")) icon = cont.iclass;
        }
        else {
            switch (type) {
                //case "text":
                //    //text = dtrow[cont.datamap];
                //    text = gridstackTextDatamap(cont.text, dtrow);
                //    break;
                case "img":
                    img = dtrow[cont.datamap];
                    break;
                case "video":
                    video = dtrow[cont.datamap];
                    break;
                case "iframe":
                    iframe = dtrow[cont.datamap];
                    break;
                case "iclass":
                    iclass = dtrow[cont.datamap];
                    break;
            }
        }

        var cha = [];
        if (cont.hasOwnProperty("clas")) {
            clas = cont.clas.split("");
            $(clas).each(function (i, k) {
                if ($.inArray(k, [".", "#"]) > -1)
                    cha.push(k)
            });
            clas = cha.join("");
        }
    }
    contain.append($("<div/>"));
    var el;//content element
    switch (type) {
        case "img":
            el = $("<img />").attr("src", img)
            break;
        case "text":
            el = $("<div />").html($(text));
            break;
        case "video":
            el = $(video);
            break;
        case "iframe":
            el = $(iframe);
            break;
        case "icon":
            el = $("<i/>").attr("class", icon);
            break;
    }
    
    content.append(el);
    if (sty != "") sty += ";";
    if (type == 'img') sty += "max-width:100%;max-height: 100%";
    if(sty!="")
        el.attr("style", sty);
    if (clas != "") {
        var cha = [];
        if (cont.hasOwnProperty("clas")) {
            clas = cont.clas.split("");
            $(clas).each(function (i, k) {
                if ($.inArray(k, [".", "#"]) == -1)
                    cha.push(k)
            });
            clas = cha.join("");
        }
        el.attr("class", clas);
    }
    $(contain.children()[0]).css("background-color", "transparent");

    return contain;
}
function makeGridstackDisplaysingle(tabid, objid, type, node) {
    var contain = $("<div id='contain" + objid + "' />");
    var content = $('<div class="grid-stack-item-content contentin" />');
    contain.append(content);
    var img = "", text = "", video = '', icon = '', cont = "", sty = "", clas = "";
    if (node.hasOwnProperty("content")) {
        cont = node.content;
        if (cont.hasOwnProperty("text")) text = cont.text;
        if (cont.hasOwnProperty("url")) {
            switch (type) {
                case "img":
                    img = cont.url;
                    break;
                case "video":
                    video = cont.url;
                    break;
                case "iframe":
                    iframe = cont.url;
                    break;
            }
        }
        if (cont.hasOwnProperty("iclass")) icon = cont.iclass;
        var cha = [];
        if (cont.hasOwnProperty("clas")) {
            clas = cont.clas.split("");
            $(clas).each(function (i, k) {
                if ($.inArray(k, [".", "#"]) > -1)
                    cha.push(k)
            });
            clas = cha.join("");
        }
    }
    contain.append($("<div/>"));
    var el;//content element
    switch (type) {
        case "img":
            el = $("<img />").attr("src", img)
            break;
        case "text":
            el = $("<div />").html(text);
            break;
        case "video":
            el = $(video);
            break;
        case "iframe":
            el = $(iframe);
            break;
        case "icon":
            el = $("<i/>").attr("class", icon);
            break;
    }
    content.append(el);
    if (sty != "") sty += ";";
    if (type == 'img') sty += "max-width:100%;max-height: 100%";
    if (sty != "")
        el.attr("style", sty);
    if (clas != "") {
        var cha = [];
        if (cont.hasOwnProperty("clas")) {
            clas = cont.clas.split("");
            $(clas).each(function (i, k) {
                if ($.inArray(k, [".", "#"]) == -1)
                    cha.push(k)
            });
            clas = cha.join("");
        }
        el.attr("class", clas);
    }

    $(contain.children()[0]).css("background-color", "transparent");

    return contain;
}
function gridstackTextDatamap(txt,dtrow) {
    //convert $[data] in text to database field (ex: his name is $[name]-> his name is Tom)
    var dtmap = [],text=txt;
    var cnt = txt.split('$').length - 1;
    for (var i = 0; i < cnt; i++) {
        var st = txt.indexOf("$") + 2;
        var ed = txt.indexOf("]");
        dtmap.push(txt.substring(st, ed));
        txt = txt.substring(ed + 2);
    }
    $(dtmap).each(function (i, k) {
        text = text.replace("$[" + k + "]", dtrow[k]);
    });
        return text;
}
function gridstackSave(ctrid) {
    var rtnid=[],previd=[],curid=[];
    var chk=false,id,type;
    $(gstack).each(function(i,k){
        previd.push(k.id);
    })
    _.map($('.grid-stack > .grid-stack-item'), function (el) {
        el = $(el);
        var tabid = $(el.parent()).attr("id").replace("tab", "");
        var fch=$(el.children()[0]);
        $(fch.find('div')).each(function (i, k) {
            if ($(k).attr('id')) {
                id = $(k).attr('id');
                type = $(k).attr('data-type');
            }
        });
        curid.push(id);//for delete
        var node = el.data('_gridstack_node');
        if ($.inArray(id, previd) == -1)
            gstack.push({
                tabid:tabid,
                id: id,
                type: type,
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height
            });
        else {
            $(gstack).each(function (i, k) {
                if (k.id == id) {
                    k.x = node.x;
                    k.y = node.y;
                    k.width = node.width;
                    k.height = node.height;
                }
            });
        }
    });
    //delete if not exist
    $(gstack).each(function (j, l) {
        if ($.inArray(l.id, curid) == -1)
            gstack.splice(j, 1);
    });
}
function findcurrentstack(tabid) {
    var rtn = [];
    $(gstack).each(function (i, k) {
        if (k.tabid == tabid)
            rtn.push(k);
    });
    return rtn;
}
function gridstackLoad(ctrid, tabid, tabstack, type, dtrow, j) {

    if (typeof j == "undefined") j = "none";
    var grid = $("#" + tabid).data('gridstack');
    if (grid != "undefined" && typeof grid != "undefined") {
        grid.remove_all();
         var delay = 0;
        setTimeout(function () {
        var items = GridStackUI.Utils.sort(tabstack);
            _.each(items, function (node) {
                switch (type) {
                    case "edit":
                        var cont = makeGridstack(ctrid, tabid, node.id, node.type, node);
                        break;
                    default:
                        if (j == "none")
                            cont = makeGridstackDisplaysingle(tabid, node.id, node.type, node);
                        else
                            cont = makeGridstackDisplay(tabid, node.id, node.type, node, dtrow, j);
                        break;
                }

                grid.add_widget(cont, node.x, node.y, node.width, node.height);
                switch (node.type) {
                    case 'video': case 'iframe':
                        resizeIframe($("#contain" + node.id + j));
                        break;
                    case "icon":
                        $("#" + node.id).parent().css("z-Index", 3000);
                        break;
                }
            });
        }, delay);
    }
}
function containSelect(that,ctrid,objid,type) {
    var contain = $("div[id^='contain']");
    var head = $("<div style='background-color:black;height:20px;width:100%'/>");
    var id = $(that).attr("id").replace("contain", "");
    $(contain).each(function (i, k) {
         $(k).css({ "border": ""});
    });
    $(that).css({ "border": "solid 3px #FFF000" });
}
function resizeIframe($contain) {
    var $you = $($contain.find("iframe"));
    var ratio = 9 / 16;//parseFloat($you.height() / $you.width());
    var rratio = 16 / 9;
    $you.data('aspectRatio', ratio)

    var newWidth = $contain.width();
    var newHeight = $contain.height();
    var newratio = parseFloat(newHeight / newWidth);
    if (ratio < newratio)
        $you.width(newWidth)
            .height(parseInt(parseFloat(newWidth) * ratio));
    else
        $you.height(newHeight)
            .width(parseInt(parseFloat(newHeight) * rratio));
    $contain.resize(function () {
        var newWidth = $contain.width();
        var newHeight = $contain.height();
        var newratio=parseFloat(newHeight/newWidth);
        if(ratio<newratio)
            $you.width(newWidth)
                .height(parseInt(parseFloat(newWidth) *ratio));
        else
            $you.height(newHeight)
                .width(parseInt(parseFloat(newHeight) *rratio));
    }).resize();
}
function imagepadding($contain) {

    var $container = $contain;
    var $img = $($contain.attr("id") + " img");
    $container.css("overflow", "hidden");
        var cHeight = $container.height();
        var cWidth = $container.width();
        var iHeight = $img.height();
        var iWidth = $img.width();

        var top = (iHeight - cHeight) / 2;
        var left = (iWidth - cWidth) / 2;

        $container.scrollLeft(left);
        $container.scrollTop(top);

    var clicking = false;
    var previousX;
    var previousY;

    $container.mousedown(function (e) {
        e.preventDefault();
        previousX = e.clientX;
        previousY = e.clientY;
        clicking = true;
    });

    $(document).mouseup(function () {

        clicking = false;
    });

    $container.mousemove(function (e) {

        if (clicking) {
            e.preventDefault();
            var directionX = (previousX - e.clientX) > 0 ? 1 : -1;
            var directionY = (previousY - e.clientY) > 0 ? 1 : -1;
            //$("#scroll").scrollLeft($("#scroll").scrollLeft() + 10 * directionX);
            //$("#scroll").scrollTop($("#scroll").scrollTop() + 10 * directionY);
            $container.scrollLeft($container.scrollLeft() + (previousX - e.clientX));
            $container.scrollTop($container.scrollTop() + (previousY - e.clientY));
            previousX = e.clientX;
            previousY = e.clientY;
        }
    });

    $container.mouseleave(function (e) {
        clicking = false;
    });
}
function delGridstack(id) {
    swal({
        title: "Are you sure?"
        , text: "You will not be able to recover this file!"
        , type: "warning"
        , showCancelButton: true
        , confirmButtonColor: "#DD6B55"
        , confirmButtonText: "Yes, delete it!"
        , cancelButtonText: "No, never!"
        , closeOnConfirm: true
        , closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                $("#contain" + id).remove();
                //$($("#"+id).parent().parent().parent()).remove();
            }
        });
}
//#endregion

//#region iframe
function iframeInit(id)  {
    var ctr = selectimctable(menuid, subid, id);//var ctr = selectimc("imctable", pathname);
    if (typeof ctr == "undefined") {
        ctr = imctableAjaxRead(id);
    }
    if (typeof ctr != "undefined") {
        //var dt = selectimcdata("imcdata", ctr.datacode).datalist;
        //if (typeof dt == "undefined") {
        //    dataListAjax(ctr.datacode, false);
        //    dt = selectimcdata("imcdata", ctr.datacode).datalist;
        //}
        //var filter = '';
        //if (ctr.hasOwnProperty('filter')) filter = ctr.filter;
        //dt = applyFilter(dt, filter);
        var src = "", width = "100^%", height = "500px", scrolling = "no";

        if (ctr.hasOwnProperty("setting")) {
            var setting = ctr.setting;
            if (setting.hasOwnProperty("src")) src = setting.src
            if (setting.hasOwnProperty("width")) width = setting.width;
            if (setting.hasOwnProperty("height")) height = setting.height;
            if (setting.hasOwnProperty("scrolling")) scrolling = setting.scrolling;
        }
        var opt = {};
        opt.src = src;
        opt.width = width;
        opt.height = height;
        opt.scrolling = scrolling;
        iframeappend(id, opt);
    }
}
function iframeappend(containerid, option) {
    funLoading(true);
    var frm = $("<iframe id='ifcontain' frameborder='0' style='min-height:500px'/>");
    var src = "", width = "100%", height = "500px", scrolling = "no";
    if (option.hasOwnProperty("src")) src = option.src
    if (option.hasOwnProperty("width")) width = option.width;
    if (option.hasOwnProperty("height")) height = option.height;
    if (option.hasOwnProperty("scrolling")) scrolling = option.scrolling;


    $([["src",src],["width", width], ["height", height], ["scrolling", scrolling]]).each(function (i, k) {
        frm.attr(k[0], k[1].replace("^",""));
    })
    frm.attr("onload", "funStop();");
    $("#" + containerid).append(frm);
    $('#ifcontain').load(function () {
        this.style.height = parseInt(this.contentWindow.document.body.offsetHeight)+50 + 'px';
    });
}
function resizeIframe1(obj,id) {
    var h=obj.contentWindow.document.body.scrollHeight + 'px'
    obj.style.height = h;
    $("#" + id).css("height", h);
}
function iframeEdit(id) {
    var conarr = {};
    conarr.id = "dveditback";// "container" + id;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting", "Data"];
    var content = [];

    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' value='Render'  onclick=\"iframeEditSave();initDisplay('',selectimctable(menuid,subid).table);$('#" + conarr.id + "').remove();$('.fade').remove()\"/>&nbsp;";
    btn += "<input type='button' value='Save'  onclick=\"iframeEditSave();\"/>&nbsp;";
    btn += "<input type='button' value='Cancel'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + id + "</label>";

    var code = "Code:<label id='lbiframecode'>" + id + "</label>";
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'>" + code + "<div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
        "</tr><tr><td colspan='2'>" + btn + "</td></tr></table>");

    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    //container complete
    conarr.body = tab;
    var container = makeContainer(conarr);

    //jqgrid scheme & srcdata
    var gdt = imctableAjaxRead(id);
    iframeEditTable(id, gdt);
    //tabclick event
    var tabb = $('#' + tabarr.id);
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    iframeEdit(id);
                    break;
                case 2:
                    dataTabClick(id);
                    break;
            }
        }
    });
    //button init
    $("input[type='button']").button();
}
function iframeEditTable(id, gdt) {
    //makeCtr(type, value, id, clas, style,attribute)
    var src = "", width = "100^%", height = "100^%", scrolling = "no";
    if (typeof gdt!="undefined") {
        var dt = selectimcdata("imcdata", gdt.datacode).datalist;
        //if (gdt.hasOwnProperty("filter") && gdt.filter.length > 0)
        //    dt = applyFilter(src, gdt.filter);

        var st = gdt.setting;
        if (st) {
            if (st.src != "") src = st.src;
            if (st.width != "") width = st.width;
            if (st.height != "") height = st.height;
            if (st.scrolling != "") scrolling = st.scrolling;
        }
    }
  console.log(src)
    var urls = [];
    urls.push("select,");
    $(extlink).each(function (i, k) {
        urls.push("<"+k.grp+">  "+k.name + "," + k.url);
    });
    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
        , ["src", makeCtr(["select", urls.join(";"), "selSrc", "margin-right:5px;width:80%", ""]) + makeCtr(["input", , "inpSrc", "display:none;width:80%;margin-right:5px;", ]) + makeCtr(["button", "<i class='fa fa-exchange'/>", "btn", "btnRoundsmall", "onclick:togglechg('inpSrc', 'selSrc')"])]
        , ["width", makeCtr(["input:number", "", "inpWidth", "text-align:right", ]) + makeCtr(["select", "%;px;e", "selWidth", "margin:0 0 0 3px;height:23px", ])]
        , ["height", makeCtr(["input:number", "", "inpHeight", "text-align:right", ]) + makeCtr(["select", "%;px;em", "selHieght", "margin:0 0 0 3px;height:23px", ])]
        , ["scrolling", makeCtr(["select", "no,yes", "width:95%", "inp", ])]
        ]
    //<button class="btnRoundsmall" onclick="faLoad('lbicon')" id="btnediticon"><i class="fa fa-external-link-square"></i></button>
    var tb = makeTable("tes1", data, "general");
    //var foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="reloadTable(\"\")" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","style":"text-align:right;"}'];
    //var tb1 = appendFooter(tb, foot);

    $("#dvtable").append(tb);
    var uurl = src.split("^");
    if (uurl[0] != "")
        $("#selSrc").val(uurl[0]);
    else if (uurl[1] != "") {
        $("#inpSrc").val(uurl[1]);
        togglechg('inpSrc', 'selSrc');
    }
    $([width, height]).each(function (i, k) {
        var kk = k.split("^");
        switch (i) {
            case 0:
                $("#inpWidth").val(kk[0]);
                $("#selWidth").val(kk[1]);
                break;
            case 1:
                $("#inpHeight").val(kk[0]);
                $("#selHeight").val(kk[1]);
                break;
        }
    });
}
function iframeEditSave() {
    var jsid = $("#lbiframecode").html();
    var combine = selectimctable(menuid, subid, jsid);
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = jsid;
    }


    var setting = {}
    var jqset = saveTable("tes1");
    $.each(jqset, function (i, k) {
        var k2 = "";
        if (typeof k[2] != "undefined") k2 = "^"+k[2];
        setting[k[0]] = k[1]+k2;
    });

    combine.setting = setting;
    if (combine != null) {
        var storename = 'imctable';
        if (menutoggle == "template")
            storename = "imctemplate";
        updateimctable(menuid, subid, jsid, combine);
        remoteimcupdate(storename);
    }

}
//#endregion

//#region otherpage
function otherpageInit(id) {
   
    var ctr = selectimctable(menuid,subid,id);
    var mu = menutoggle,m=menuid,s=subid;
    if (typeof ctr != "undefined") {
        if (ctr.hasOwnProperty("setting")) {
            var setting = ctr.setting;
            var menutype = "", menuid1 , subid1;
            if (setting.hasOwnProperty("menutype")) menutype = setting.menutype
            if (setting.hasOwnProperty("menuid")) menuid1 = setting.menuid;
            if (setting.hasOwnProperty("subid")) subid1 = setting.subid;
            var tb = selectimc("imctable", menutype + "submenu");
            $(tb).each(function (i, k) {
                if (k.menuid == menuid1 && k.subid == subid1) {

                    menutoggle = menutype,menuid=menuid1,subid=subid1;
                    initDisplay('sssss', k, $('#' + id));
                    menutoggle = mu,menuid=m,subid=s;
                }
            });

        }

    }
    function otherpageDisplay() {
        clearinserted();
        if (typeof data == "undefined" | data == "")
            data = selectimctable(menuid, subid);
        else if (typeof data != "object")
            data = JSON.parse(data);
        if (data == "")
            remoteimctable();
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
    }
}
function otherpageappend(containerid, option) {
    funLoading(true);
    var frm = $("<otherpage id='ifcontain' frameborder='0' style='min-height:500px'/>");
    var src = "", width = "100%", height = "500px", scrolling = "no";
    if (option.hasOwnProperty("src")) src = option.src
    if (option.hasOwnProperty("width")) width = option.width;
    if (option.hasOwnProperty("height")) height = option.height;
    if (option.hasOwnProperty("scrolling")) scrolling = option.scrolling;


    $([["src",src],["width", width], ["height", height], ["scrolling", scrolling]]).each(function (i, k) {
        frm.attr(k[0], k[1].replace("^",""));
    })
    frm.attr("onload", "funStop();");
    $("#" + containerid).append(frm);
    $('#ifcontain').load(function () {
        this.style.height = parseInt(this.contentWindow.document.body.offsetHeight)+50 + 'px';
    });
}
function resizeotherpage1(obj,id) {
    var h=obj.contentWindow.document.body.scrollHeight + 'px'
    obj.style.height = h;
    $("#" + id).css("height", h);
}
function otherpageEdit(id) {
    var conarr = {};
    conarr.id = "dveditback";// "container" + id;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting"];
    var content = [];
    var m = menuid, s = subid;
    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' value='Save'  onclick=\"otherpageEditSave('" + m + "','" + s + "','" + id + "');\"/>&nbsp;";
    btn += "<input type='button' value='Cancel'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + id + "</label>";

    var code = "Code:<label id='lbotherpagecode'>" + id + "</label>";
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'>" + code + "<div id='imcMenu1' style='padding:5px 0 5px 0;'></div></td>" +
        "<td><div id='dvpage1'/></td></tr><tr><td colspan='2'>" + btn + "</td></tr></table>");

    //content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    //container complete
    conarr.body = tab;
    var container = makeContainer(conarr);

    //jqgrid scheme & srcdata
    menutoggle = "";
    console.log(menuid,subid,id)
    var gdt = imctableAjaxRead(id);
    console.log(id,gdt)
    otherpageEditTable(gdt);

    //button init
    $("input[type='button']").button();
}
function otherpageEditTable(gdt) {
   
    //makeCtr(type, value, id, clas, style,attribute)
    var menutype = "",menuid1=menuid,subid1=subid;
    if (typeof gdt != "undefined") {
        menutype = gdt.setting.menutype;
        menuid1 = gdt.setting.menuid;
        subid1 = gdt.setting.subid;
    }
    var options = { display: "textbox" };
    var st1 = makeCtr(["select", "user,;open;admin", "selmenutype", "", ""]);
  
    var topm = menuMy("menu",menutype), list = [], tlist = "";
    $(topm).each(function (i, k) {
        list.push(k.title + "," + k.menuid);
    });
    tlist = list.join(";");
    var st = makeCtr(["select", tlist, "selTopmenu1", "ddlTextbox|width:90%;padding:5px;margin:5px;", ""]);
   
    $("<div/>").append(st1).append(st).insertBefore($("#imcMenu1"))
    $("#selmenutype").val(menutype);
    $("#selTopmenu1").val(menuid1);
    menutreemake(menutype, menuid1,subid1);

    $("#selmenutype").on("change", function () {
        var topm = menuMy("menu", $(this).val());
        $("#selTopmenu1").empty();
        $(topm).each(function (i, k) {
            if (i == 0) menutreemake($("#selmenutype").val(), k.menuid);
            $("#selTopmenu1").append($("<option>", { text: k.title, value: k.menuid }));
        });
        
    });
    $("#selTopmenu1").on("change", function () {
        menutreemake($("#selmenutype").val(),$(this).val());
    });
  
   // $("#inNodename1").css({ "width": "80%", "height": "18px", "margin": "0 0 10px 3px" });

}
function menutreemake(menutype, menuid1,subid1) {
    console.log(menutype, menuid1)
    clearDiv('imcMenu1');
    var jstree = $('#imcMenu1');
    var ttllist = menuMy("submenu", menutype);//selectimc("imctable", menutoggle+"submenu");
    var list = $.grep(ttllist, function (a) {
        return a.menuid == menuid1;
    });

    var data = [{ id: menuid1, text: "Top Menu", parent: "#", icon: "fa fa-home" }];
    if (list.length > 0)
        $.each(list, function (i, k) {
            if (k != null && k.menuid == menuid1) {
                var set = {};
                set.id = k.subid;
                console.log(k)
                if (k.hasOwnProperty("text")) set.text = k.text;
                if (k.hasOwnProperty("parent")) set.parent = k.parent;
                if (k.hasOwnProperty("icon")) set.icon = "fa " + k.icon;
                if (k.hasOwnProperty("href")) set.href = k.href;
                if (k.hasOwnProperty("table")) set.table = k.table;
                if (k.hasOwnProperty("useiframe")) set.useiframe = k.useiframe;
                if (k.hasOwnProperty("permissionname")) set.permissionname = k.permissionname;
                if (k.hasOwnProperty("permission")) set.permission = k.permission;
                data.push(set)
            }
        });
   
    jstree.jstree({
        'core': {
            'data': data
            , "check_callback": true
           // , "initially_open": ["root"]
        }

         , "types": {
             "default": {
                 "icon": "fa fa-align-justify"
             },
             "folder": {
                 "icon": "/images/icon/folder.png"
             },
             "g": {
                 "icon": "/images/white.gif"
             }
         }

    }).on('changed.jstree', function (event, data) {
        ////contextmenu일경우 작동 방지
        var evt = window.event;
        if (typeof (evt) != "undefined") {
            var button = evt.which || evt.button;
            if (button != 1 && (typeof button != "undefined")) return false;
        }
        var node = data.instance.get_node(data.selected[0]);
        $('#dvpage1').empty();

        var tb = node.original;//selectimc("imctable", menutype + "submenu", "id", node.id);
        console.log(tb)
        if (tb.hasOwnProperty("table") && tb.table.length > 0) {
            var mm=[menuid,subid,menutoggle];
            menuid = menuid1, subid = node.id,menutoggle=menutype;
            initDisplay('sssss', tb, $('#dvpage1'));
            menuid = mm[0], subid = mm[1], menutoggle = mm[2];
        }
    });
    if (typeof subid1 != "undefined") {
        var mm = [menuid, subid, menutoggle];
        menuid = menuid1, subid = subid1;
       
        $(data).each(function (i,k) {
            if (k.id == subid1) {
                menutoggle = menutype;
                initDisplay('sssss', k, $('#dvpage1'));
                 menuid = mm[0], subid = mm[1], menutoggle = mm[2];
            }
        });
        setTimeout(function () { 
            $('#imcMenu1').jstree("select_node", subid1, true);
        }, 500);
    }
}
function otherpageEditSave(m,s,id) {
    var combine;// = selectimctable(m,s,id);
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.menuid = m;
        combine.subid = s;
        combine.dvid = id;
    }
    console.log(m,s,id)

    var setting = {}
    setting.menutype = $("#selmenutype").val();
    setting.menuid = $("#selTopmenu1").val();
    setting.subid = $('#imcMenu1').jstree('get_selected')[0];

    combine.setting = setting;
    commonsave(id, "", combine, {});
    //var imctb = sessionStorage.getItem("imctable");
    //imctb = JSON.parse(imctb);
    //var exist = false, list = [];
    //    list = menuMy("control","");//selectimc("imctable", menutoggle + "control")
    //    if (list == "") list = [];
    //    //control save
    //    $.each(list, function (i, k) {
    //        if (k != null && k.menuid == m && k.subid == s && k.dvid == id) {
    //            list.splice(i, 1, combine);
    //            }
    //            exist = true;
            
    //    });
    //    if (!exist) {
    //        list.push(combine);
    //    }
    //    imctb['control'] = list;
    //console.log(imctb)
    //    sessionStorage.setItem("imctable",JSON.stringify(imctb));
    menutoggle = "";
    menuid = m;
    subid = s;
}
//#endregion

//#region html
function htmlInit(id) {
   
    var ctr = selectimctable(menuid,subid,id);
    var mu = menutoggle,m=menuid,s=subid;
    if (typeof ctr != "undefined") {
        if (ctr.hasOwnProperty("setting")) {
            var setting = ctr.setting;
            var menutype = "", menuid1 , subid1;
            if (setting.hasOwnProperty("menutype")) menutype = setting.menutype
            if (setting.hasOwnProperty("menuid")) menuid1 = setting.menuid;
            if (setting.hasOwnProperty("subid")) subid1 = setting.subid;
           console.log(menuid1,subid1)
            var tb = selectimc("imctable", menutype + "submenu");
            $(tb).each(function (i, k) {
                if (k.menuid == menuid1 && k.subid == subid1) {

                    menutoggle = menutype,menuid=menuid1,subid=subid1;
                    initDisplay('sssss', k, $('#' + id));
                    menutoggle = mu,menuid=m,subid=s;
                }
            });

        }

    }
    function htmlDisplay() {
        clearinserted();
        if (typeof data == "undefined" | data == "")
            data = selectimctable(menuid, subid);
        else if (typeof data != "object")
            data = JSON.parse(data);
        if (data == "")
            remoteimctable();
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
    }
}
function htmlappend(containerid, option) {
    funLoading(true);
    var frm = $("<html id='ifcontain' frameborder='0' style='min-height:500px'/>");
    var src = "", width = "100%", height = "500px", scrolling = "no";
    if (option.hasOwnProperty("src")) src = option.src
    if (option.hasOwnProperty("width")) width = option.width;
    if (option.hasOwnProperty("height")) height = option.height;
    if (option.hasOwnProperty("scrolling")) scrolling = option.scrolling;


    $([["src",src],["width", width], ["height", height], ["scrolling", scrolling]]).each(function (i, k) {
        frm.attr(k[0], k[1].replace("^",""));
    })
    frm.attr("onload", "funStop();");
    $("#" + containerid).append(frm);
    $('#ifcontain').load(function () {
        this.style.height = parseInt(this.contentWindow.document.body.offsetHeight)+50 + 'px';
    });
}
function resizehtml1(obj,id) {
    var h=obj.contentWindow.document.body.scrollHeight + 'px'
    obj.style.height = h;
    $("#" + id).css("height", h);
}
function htmlEdit(id) {
    var conarr = {};
    conarr.id = "dveditback";// "container" + id;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting"];
    var content = [];
    var m = menuid, s = subid;
    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' value='Save'  onclick=\"htmlEditSave('" + m + "','" + s + "','" + id + "');\"/>&nbsp;";
    btn += "<input type='button' value='Cancel'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + id + "</label>";

    var code = "Code:<label id='lbhtmlcode'>" + id + "</label>";
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'>" + code + "<div id='imcMenu1' style='padding:5px 0 5px 0;'></div></td>" +
        "<td><div id='dvpage1'/></td></tr><tr><td colspan='2'>" + btn + "</td></tr></table>");

    //content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    //container complete
    conarr.body = tab;
    var container = makeContainer(conarr);

    //jqgrid scheme & srcdata
    menutoggle = "";
    console.log(menuid,subid,id)
    var gdt = imctableAjaxRead(id);
    console.log(id,gdt)
    htmlEditTable(gdt);

    //button init
    $("input[type='button']").button();
}
function htmlEditTable(gdt) {
   
    //makeCtr(type, value, id, clas, style,attribute)
    var menutype = "",menuid1=menuid,subid1=subid;
    if (typeof gdt != "undefined") {
        menutype = gdt.setting.menutype;
        menuid1 = gdt.setting.menuid;
        subid1 = gdt.setting.subid;
    }
    var options = { display: "textbox" };
    var st1 = makeCtr(["select", "user,;open;admin", "selmenutype", "", ""]);
  
    var topm = menuMy("menu",menutype), list = [], tlist = "";
    $(topm).each(function (i, k) {
        list.push(k.title + "," + k.menuid);
    });
    tlist = list.join(";");
    var st = makeCtr(["select", tlist, "selTopmenu1", "ddlTextbox|width:90%;padding:5px;margin:5px;", ""]);
   
    $("<div/>").append(st1).append(st).insertBefore($("#imcMenu1"))
    $("#selmenutype").val(menutype);
    $("#selTopmenu1").val(menuid1);
    menutreemake(menutype, menuid1,subid1);

    $("#selmenutype").on("change", function () {
        var topm = menuMy("menu", $(this).val());
        $("#selTopmenu1").empty();
        $(topm).each(function (i, k) {
            if (i == 0) menutreemake($("#selmenutype").val(), k.menuid);
            $("#selTopmenu1").append($("<option>", { text: k.title, value: k.menuid }));
        });
        
    });
    $("#selTopmenu1").on("change", function () {
        menutreemake($("#selmenutype").val(),$(this).val());
    });
  
   // $("#inNodename1").css({ "width": "80%", "height": "18px", "margin": "0 0 10px 3px" });

}
function menutreemake(menutype, menuid1,subid1) {
    console.log(menutype, menuid1)
    clearDiv('imcMenu1');
    var jstree = $('#imcMenu1');
    var ttllist = menuMy("submenu", menutype);//selectimc("imctable", menutoggle+"submenu");
    var list = $.grep(ttllist, function (a) {
        return a.menuid == menuid1;
    });

    var data = [{ id: menuid1, text: "Top Menu", parent: "#", icon: "fa fa-home" }];
    if (list.length > 0)
        $.each(list, function (i, k) {
            if (k != null && k.menuid == menuid1) {
                var set = {};
                set.id = k.subid;
                console.log(k)
                if (k.hasOwnProperty("text")) set.text = k.text;
                if (k.hasOwnProperty("parent")) set.parent = k.parent;
                if (k.hasOwnProperty("icon")) set.icon = "fa " + k.icon;
                if (k.hasOwnProperty("href")) set.href = k.href;
                if (k.hasOwnProperty("table")) set.table = k.table;
                if (k.hasOwnProperty("useiframe")) set.useiframe = k.useiframe;
                if (k.hasOwnProperty("permissionname")) set.permissionname = k.permissionname;
                if (k.hasOwnProperty("permission")) set.permission = k.permission;
                data.push(set)
            }
        });
   
    jstree.jstree({
        'core': {
            'data': data
            , "check_callback": true
           // , "initially_open": ["root"]
        }

         , "types": {
             "default": {
                 "icon": "fa fa-align-justify"
             },
             "folder": {
                 "icon": "/images/icon/folder.png"
             },
             "g": {
                 "icon": "/images/white.gif"
             }
         }

    }).on('changed.jstree', function (event, data) {
        ////contextmenu일경우 작동 방지
        var evt = window.event;
        if (typeof (evt) != "undefined") {
            var button = evt.which || evt.button;
            if (button != 1 && (typeof button != "undefined")) return false;
        }
        var node = data.instance.get_node(data.selected[0]);
        $('#dvpage1').empty();

        var tb = node.original;//selectimc("imctable", menutype + "submenu", "id", node.id);
        console.log(tb)
        if (tb.hasOwnProperty("table") && tb.table.length > 0) {
            var mm=[menuid,subid,menutoggle];
            menuid = menuid1, subid = node.id,menutoggle=menutype;
            initDisplay('sssss', tb, $('#dvpage1'));
            menuid = mm[0], subid = mm[1], menutoggle = mm[2];
        }
    });
    if (typeof subid1 != "undefined") {
        var mm = [menuid, subid, menutoggle];
        menuid = menuid1, subid = subid1;
       
        $(data).each(function (i,k) {
            if (k.id == subid1) {
                menutoggle = menutype;
                initDisplay('sssss', k, $('#dvpage1'));
                 menuid = mm[0], subid = mm[1], menutoggle = mm[2];
            }
        });
        setTimeout(function () { 
            $('#imcMenu1').jstree("select_node", subid1, true);
        }, 500);
    }
}
function htmlEditSave(m,s,id) {
    var combine;// = selectimctable(m,s,id);
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.menuid = m;
        combine.subid = s;
        combine.dvid = id;
    }
    console.log(m,s,id)

    var setting = {}
    setting.menutype = $("#selmenutype").val();
    setting.menuid = $("#selTopmenu1").val();
    setting.subid = $('#imcMenu1').jstree('get_selected')[0];

    combine.setting = setting;
    commonsave(id, "", combine, {});
    //var imctb = sessionStorage.getItem("imctable");
    //imctb = JSON.parse(imctb);
    //var exist = false, list = [];
    //    list = menuMy("control","");//selectimc("imctable", menutoggle + "control")
    //    if (list == "") list = [];
    //    //control save
    //    $.each(list, function (i, k) {
    //        if (k != null && k.menuid == m && k.subid == s && k.dvid == id) {
    //            list.splice(i, 1, combine);
    //            }
    //            exist = true;
            
    //    });
    //    if (!exist) {
    //        list.push(combine);
    //    }
    //    imctb['control'] = list;
    //console.log(imctb)
    //    sessionStorage.setItem("imctable",JSON.stringify(imctb));
    menutoggle = "";
    menuid = m;
    subid = s;
}
//#endregion

//#region rstat
function rstatInit(id, options) {
    var ctr, gcontain = $("#" + id), data;
    if (typeof options != "undefined"){
        if (options.hasOwnProperty("gdt")) ctr = options.gdt;
        else
            ctr = options;
        if (options.hasOwnProperty("contain"))
            gcontain = options.contain;
    }
    else
        ctr = readdata(id, "gdt");
    rstatInit.datasrc = datasrc;
    if (typeof ctr != "undefined" && ctr.hasOwnProperty("data")) 
        jsonReadAjax("imcdata", "", "code", ctr.data.datacode, rstatInit.datasrc, [id, ctr]);
    function datasrc(data, id, ctr) {
        var dt, tablist = [];
        dt = datalistreturn(data);
        jsonQueryCheck(data, rstatInit.datasrc, [gcontain, ctr]);
         if (typeof ctr != "undefined") {
             if (ctr.hasOwnProperty("tablist")) tablist = ctr.tablist;
             if (ctr.hasOwnProperty("opencputmp")) opencputmp = ctr.opencputmp;
        }
         if (dt == "undefined")
             return false;
         else {
             var dtcontain = $("<span style='display:none' id='dt" + id + "'>"+JSON.stringify(dt)+"</span>");
             dtcontain.appendTo($('body'));
         }
        var ntab = [];
        $(tablist).each(function (s, y) {
            var ss = {};
            ss.href = y.id ;
            ss.html = y.name;
            ntab.push(ss);
        });
        var workarr = {};
        if ($("#tab-grid" + id ).length > 0) {
            $("#tab-grid" + id ).remove();
        }
        workarr.id = "tab-grid" + id;
        workarr.head = ntab;
        var content = [];
        $(workarr.head).each(function (i, k) {
            var dvWorkspace = $("<div />");
            dvWorkspace.attr("id", "tab" + k.href);
            content.push(dvWorkspace.prop('outerHTML'));
        });
        workarr.content = content;
        var tabmake = makeTab(workarr);
        $("#" + id).append(tabmake);
        var worktab = $("#tab-grid" + id);

        tabload(id, tablist, 0, dt);
        worktab.tabs({
            activate: function (event, ui) {
                var $activeTab = worktab.tabs('option', 'active');
                tabload (id,tablist,$activeTab,dt);
            }
        });

        function tabload(id,tablist,index,dt) {
            if (tablist.length > 0) {
                $("#statsortable-style").remove();
                $(tablist).each(function (i, m) {
                    $("#tab" + m.id).empty(); 
                    $("a[href='#" + m.id + "']").parent().attr("val", JSON.stringify(m));
                });
               
                var tabdata = tablist[index];
                tabdata.dt = dt;
                tabdata.rstatid = id;
                predarr = tabdata.predictarr;
                rstatInitRun(tabdata);
            }
        }
    }
    
}
function rstatInitRun(tabdata,reload) {
    var indeparr = [], dlist = [],k=tabdata;
    var outlist = k.outlist, predarr = k.predictarr, predarr1 = k.predictarr, varlist = k.varlist, tabname = k.tabname, tabsetting = k.tabsetting,
        outodr = k.outorder, column = k.column, cmd = k.cmd, outcmd = [],dt=k.dt,id=k.rstatid;
    //$("#tab" + k.id).empty();
    $(varlist).each(function (a, b) {
        if (b.vartype != "dependent") {
            indeparr.push(b.imgid);
        }
    });

    $(outlist).each(function (a, b) {
        if (b[2] == "predict") {
            var rtn = predictdatafind(b[1]), rtn1;
            if (rtn != "") {
                if (rtn.hasOwnProperty("dlist") && rtn.dlist.hasOwnProperty("dframe"))
                    rtn1 = rtn.dlist.dframe;
                outcmd.push({ code:"",type:"",model: "newdata=data.frame(" + rtn1 + ")" });
                outcmd.push({ code: b[1], type: b[2], model: b[6], newdata: true });
            }
        }
        else
            outcmd.push({ code: b[1], type: b[2], model: b[6] });
    });
    var rcmdobj = {};
    rcmdobj.dtlist = dt;
    rcmdobj.outcmd = outcmd;
    var opt = opencpuOption(outlist, indeparr, outodr, column, combinecmd(rcmdobj), tabname, tabsetting, $("#tab" + k.id), dt, id);
    if (reload) opt.reload = true;
    else
        $("#tab" + k.id).empty();
    opt.wth = $("#tab" + k.id).width();
        opencpuRun(opt);
  
}
//rstatEdit
var selcol = 3;//how many column select?
function rstatEdit(id, option) {
    tablist = [];
    jsonReadallAjax("imctemplate");
    sleep(1000);
    var cstyle, setup = "", arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type,statlist="";
    if (typeof option != "undefined") {
        if (option.hasOwnProperty('src')) src = option.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (option.hasOwnProperty('type')) type = option.type
        if (option.hasOwnProperty('gdt')) gdt = option.gdt;
        if (option.hasOwnProperty('ctrid')) id = option.ctrid;
        if (option.hasOwnProperty('code')) code = option.code;
        if (option.hasOwnProperty('rtnid')) rtnid = option.rtnid;//previous control id that moved to current stage(ex: mapedit->rstatEdit)
        if (option.hasOwnProperty('archive')) archive = option.archive;
        if (src == "temp") {
            $("#splistdata").text(JSON.stringify(gdt));
        }
    }
    else {
        gdt = editDataFind(id, option);
        option = editoptionmake("rstat", id, gdt);//{ ctrid: id, type: "rstat", gdt: gdt };//
    }
    if (typeof gdt != "undefined") {
        //common thru type
        if (gdt.hasOwnProperty("code")) code = gdt.code;
        if (gdt.hasOwnProperty("name")) name = gdt.name;
        if (gdt.hasOwnProperty("desc")) desc = gdt.desc;
        if (gdt.hasOwnProperty("opencputmp")) opencputmp = gdt.opencputmp;
        if (gdt.hasOwnProperty("statlist")) statlist = gdt.statlist;
        if (gdt.hasOwnProperty("setting") && gdt.setting.hasOwnProperty("style")) cstyle = gdt.setting.style;
        if (gdt.hasOwnProperty("tablist")) tablist = gdt.tablist;
        if (gdt.hasOwnProperty("data")) rstatdt = gdt.data;
        if (gdt.hasOwnProperty("setup")) setup = gdt.setup;
    }
    //tab create
    var tabarr = {};
    $("#tab-Contain").remove();
    tabarr.id = "tab-Contain";
    tabarr.head = ["Statistics", "Action", "Data", "Style"];
    var rstat = [];
    var msg = "";
    //1st Tab
    rstat.push("<div id='dvrstatedit'  />");
    //2nd Tab action
    rstat.push("<div id='dndcontain_rstat' class='dndcontain'  />");
    //3rd Tab
    rstat.push(makeDatasrc());
    tabarr.content = rstat;
    var tab = makeTab(tabarr);
    dataTabClick(id, option);
    //container create
    var conarr = {};
    conarr.id = "dveditback";
    conarr.body = tab;
    var container = makeContainer(conarr);
    //button
    $("#tab-Contain>div:eq(0)>div:eq(0)").append(editbutton(option));
    $('input[type = "button"]').button();
    $('button').button();
    //tabclick event
    var tabb = $('#' + tabarr.id);
    var first = true, action = true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                //case 0:
                //    if ($("#tab-grid>div>div").children().length == 0)
                //        selectimctable(menu)
                //        rstatLoad();
                //    break;
                case 1:
                    var dcode = "";
                    if (gdt.hasOwnProperty("data")) dcode = gdt.data.datacode;
                    if (dcode != $("#spDatacode").text()) reloadAction();
                    //3rd action
                    if (action) {
                        dndboxInit(gdt, 'rstat');
                        action = false;
                    }
                case 2:
                    dataTabClick(id, option);
                    break;
                case 3:
                    //3rd Tab style
                    if (first) {
                        if (typeof id == 'undefined') id = code;
                        cssEditInit("Style", id, "rstat");
                        first = false;
                    }
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['rstatedit', 'setting', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'rstatedit');
    helpinsert();
    //rstat workspace tab
    $("#dvrstatedit").append(rstatEditTab(id, tablist));
    rtabInit(tablist);
    $(document).tooltip({
        position: {
            my: "center top",
            at: "center bottom+5",
        },
        show: {
            duration: "fast"
        },
        hide: {
            effect: "hide"
        }
    });
    //style tab dialog remove
    $(".ui-dialog-titlebar").hide()
    $('.ui-dialog').css({
        'position': 'relative',
        'top': 0,
        left: 0
    });
    $("#dvCsscontain").parent().css("z-index", "1000");
}
function rstatEditTab(id,tablist) {
    //var contain = $("<div id='dvstatcontent'/>"), dvbtn, dvWorkspace, dvbody;
    //tab create
    var tab1 = [{ href: "001" + id, html: "Stat" }];
    if (tablist.length > 0) {
        tab1 = [];
        $(tablist).each(function (i, k) {
            var set = {};
            set.href = k.id;
            set.html = k.name;
            tab1.push(set)
        });
    }
    var workarr = {};
    if ($("#tab-grid").length > 0) $("#tab-grid").remove();
    workarr.id = "tab-grid";
    workarr.head = tab1;
    var content = [];
    workarr.content = content;
    if (workarr.head.length > 0) {
        var tab = makeTab(workarr);
    }
    return tab;
}
function rtabInit(tablist) {
    var worktab = $("#tab-grid");
    worktab.attr("class", 'interiorNavigation');
    $(".ui-tabs-panel").css({ padding: "5px 0 5px 2px" });
    $("#statsortable-style").remove();
    
    tablist.sort(function (a, b) {
        return a.index - b.index;
    });
    $(tablist).each(function (i, k) {
        tabadd(k);
    });
    worktab.tabs({
        activate: function (event, ui) {
            var val = $("#tab-grid>ul>li[class*='ui-state-active']").attr("value");
            var pval="";
            if(typeof val!="undefined" && val!="")
                pval=JSON.parse(val);
            $("#statsortable-style").remove();
            rstatTabSave();
            rstatLoad(pval);
        }
    });
    worktab.find("ul").append($("<div style='float:left;margin:5px 0 0 0;' title='add tab'>" +
        "<i id='addtab'  style='color:#9C7878' class='fa fa-plus-square fa-lg imdim'/></div>"));
       // .append($("<div style='float:right;margin:5px 5px 0 0;' onclick='rstatLoad()'><i class='fa fa-rotate fa-lg imdim'/></div>"));
    $("#addtab").click(function () {
        rstatTabSave();
        tabadd();
        worktab.tabs("refresh");
        var num_tabs = parseInt($("#tab-grid>ul:nth-child(1)>li").length);
        worktab.tabs("option", "active", num_tabs - 1);
        rstatLoad();
        setTimeout(function () { $(".ui-tabs-panel").css({ padding: "5px 0 0 0" }); }, 1000);
    });
    tabrename("tab-grid");
    worktab.tabs("option", "active", 0);
    //worktab.find("ul>li:nth-child(1)>a").trigger('click');
    var val = $("#tab-grid>ul>li[class*='ui-state-active']").attr("value")
    var pval = "";
    if (typeof val != "undefined" && val != "")
        pval = JSON.parse(val);
   // predarr = [];//init predict input dataset
    rstatLoad(pval);
   
}
function tabadd(tobj) {
    var tabs = "#tab-grid";
    var num_tabs = parseInt($(tabs + " ul li").length);
    var id = "tb" + idMake();
    var name="stat" + num_tabs ;
    if (typeof tobj != "undefined") {
        if(tobj.hasOwnProperty("id"))id = tobj.id;
        if (tobj.hasOwnProperty("name")) name = tobj.name;
    }
    var noexist = true;
    $(tabs + ">ul:nth-child(1)>li").each(function (i, k) {
        if ($(k).find("a").attr("href") == "#" + id) {
            $(k).attr("value", JSON.stringify(tobj));
            noexist = false;
        }
    });
    if(noexist)
    $(tabs + ">ul:nth-child(1)>li:last").after(
        "<li><a href='#" + id + "' value='"+JSON.stringify(tobj)+"'>"+name+ "</a></li>"
    );
    var dv = $("<div id='" + id + "'/>");
    $(tabs + ">ul:nth-child(1)").next("div").append(dv);
    $(tabs).find("ul:nth-child(1)>li").each(function (i, k) {
        if ($($(k).find('input')).length == 0) {
            $(k).prepend($("<input class='txt' type='text' style='display:none'/>"));
            $(k).append($("<span class='ui-icon ui-icon-close' style='float: left; margin: 0.4em 0.2em 0 0; cursor: pointer;' role='presentation'>Remove Tab</span>"));
        }
    });
}
function rstatLoad(tobj) {
    rstatLoad.statform = statform;
    //rstatLoad.statAuthorlist = statAuthorlist;
    var datacode = "";
    var style = "#ulsrc, .ulvar { border: 1px solid gray;list-style-type: none;display:inline-block;margin: 0; padding: 5px;float: left;margin-right: 10px;}";
    style += "#ulsrc{max-height:400px;overflow-y:auto;overflow-x: hidden; width: 180px;margin:0 0px 0 5px;}";
    style += ".ulvar{height:40px;width:100%;padding:5px;border-color:#A9A9A9}";
    style += "#ulsrc li, .ulvar li {margin: 5px ;padding: 3px 10px 3px 3px;font-size: 1em;cursor:pointer;}";
    style += ".ulvar li {display: inline-block}";
    style += "#ulsrc li.ui-sortable-helper, .ulvar li.ui-sortable-helper {cursor:move;}";
    styleInsert("statdrop-style", style);
   // $("#tbFilter").find("input#inpFilterrefresh").trigger("click");
    //find tab setting
    var tabid = $("#tab-grid>ul>li[class*='ui-state-active']>a").attr("href").replace("#", "");
    var cmd = "", stattype = "", modelcode = "", varlist = [],tabsetting;
    if (typeof tobj != "undefined") {
        if (tobj.hasOwnProperty("id")) code = tobj.id;
        if (tobj.hasOwnProperty("name")) name = tobj.name;
        if (tobj.hasOwnProperty("modelcode")) modelcode = tobj.modelcode;
        if (tobj.hasOwnProperty("varlist")) {
            $(tobj.varlist).each(function (i, k) {
                varlist.push(k.imgid);
            });
        }
        if (tobj.hasOwnProperty("tabsetting")) tabsetting = tobj.tabsetting;
        if (tobj.hasOwnProperty("predictarr")) predarr = tobj.predictarr;
    }
    //before inject stat form remove previous setting
    $("#tab-grid>ul").first().find("li>a").each(function (i, k) {
        $($(k).attr("href")).empty();
    });
    var left1 = "<div id='dvstatlayout' style='padding:5px 0 5px 0;width:195px;'></div>";
    var right = "<div id='dvform' class='tabbed' style='float:left;margin:0 5px 10px 0'/>";
    var btnbottom = "<div id='tbbtn' style='clear:both;margin-top:10px'/>";
    var tb = $("<table style='width:100%'><tr><td style='vertical-align:top'>" + left1 + "</td><td style='vertical-align:top'>" + right + "</td></tr></table>");
    $("#" + tabid).append(tb);

    var left = $("#dvstatlayout");
    left.empty();
    var dvmodel = $("<div style='margin-right:10px'/>");
    left.append(dvmodel);
    dvmodel.append($("<label style='margin:5px 0 0 5px;'><i class='fa fa-caret-right'/>model list</label>"))
    dvmodel.append(statAuthorlist(modelcode));
    dvmodel.append($("<label style='margin:5px 0 0 5px;'><i class='fa fa-caret-right'/>variable list</label>"))
    var ulsrc = $("<ul id='ulsrc' class='connectedSortable' ></ul>");
    dvmodel.append(ulsrc);
    ulsrclist(ulsrc, varlist, false);
    left.append($("<div id='dvtabsetting' style='margin:5px;padding:0 5px 0 0'/>"));
    rtabSetting(tabsetting);
    statform(tobj);
    $("#ulsrc").sortable({
        connectWith: ".connectedSortable"
    });
    $("#ulsrc").droppable({
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function (event, ui) {
            variableupdate();
        }
    });
    function variableupdate() {
        //update model with variable setting
        var val = $("#dvform").attr("model");
        if (val != "") {
            setTimeout(function () {
                val = JSON.parse(val);
                var varlist = val.varlist;
                var outlist = val.outlist;
                var model = val.model, outmodel;
                var vararr = [], set = {};
                $(varlist).each(function (i, k) {
                    var reptx = $(".ulvar").closest("td").siblings().find("div>label:contains('" + k[1] + "')").closest("td").siblings().find("li");
                    var tx = [];
                    $(reptx).each(function (a, b) {
                        tx.push($(b).text());
                    });
                    for (var a = 0; a < 10; a++) {
                        model = model.replace(k[1], tx.join("+"));
                    }
                    set = {};
                    set.varname = k[1];
                    set.realname = tx;
                    vararr.push(set);
                });
                $("#txcmd").val(model); $("#txcmd2").val(model);
                var modelidx = tbcolindexbytitle("tbstatmodel1", "model");
                $("#tbstatmodel1>tbody>tr").each(function (r, q) {
                    //var span = $(q).find("td:nth-child(6)>span");
                    var span = $(q).find("td:eq(" + modelidx + ")>span");
                    var txt = outlist[r][6];
                    span.text(replacemodel(vararr, txt));
                });
            }, 500);
        }
        function replacemodel(vararr, txt) {
            $(vararr).each(function (a, b) {
                for (var j = 0; j < 10; j++) {
                    txt = txt.replace(b.varname, b.realname.join("+"));
                }
            });
            return txt;
        }
    }
    function ulsrclist($ul, liarray, include) {
        // include: true:insert, false:exclude
        var list = [], imsi = [];
        var gdt, dataobj, dt = [], f1, filter = [], data;
        if ($("#spdlist").text() != "") {
            dt = JSON.parse($("#spdlist").text());
        }
        if ($("#spdataajax").text() != "") {
            data = JSON.parse($("#spdataajax").text());
            f1 = findfilter(data);
            $(f1).each(function (i, k) {
                if (include) {
                    if ($.inArray(k[0], liarray) > -1)
                        filter.push(k);
                }
                else {
                    if ($.inArray(k[0], liarray) == -1)
                        filter.push(k);
                }
            });
        }

        if (dt.length > 0) {
            $.each(filter, function (i, k) {
                imsi = [];
                var img, fname = k[5];
                if (fname == "") fname = k[0]
                switch (k[1]) {
                    case "string":
                        img = "string1.gif";
                        break;
                    case "datetime":
                        img = "datetime.png";
                        break;
                    case "number": case "int":
                        img = "int.gif";
                        break;
                    case "float": case "decimal":
                        img = "decimal.png";
                        break;
                    case "boolean":
                        img = "checkbox1.png";
                        break;
                }
                li = $("<li class='ui-state-default'></li>");
                li.html("<img style='padding-right:3px;' id='" + k[0] + "'  src='/images/" + img + "'/>" + fname);
                //imsi.push(k[1], img, fname)
                //list.push(imsi);
                //$("#ulsrc").append(li);
                $ul.append(li);
            });
        }
    }
    function statAuthorlist(modelcode) {
        var statlist = selectimc("imctemplate", "statistics"), statlist1 = [];
        // var statlist = [{ grp: "predict", val: "regression" }, { grp: "predict", val: "timeseries" }, { grp: "analysis", val: "scattergram" }, { grp: "analysis", val: "histogram" }], statlist1 = [];
        $(statlist).each(function (i, k) {
            var tx = k.name, val = k.code, grp = k.group, selected = "";
            if (k.hasOwnProperty("text")) tx = k.text;
            if (val == modelcode) selected = ",selected:selected";
            statlist1.push(grp + "," + tx + "," + val + selected);
        });

        statlist1.sort(function (a, b) {
            return (a[0] > b[0]) ? 1 : -1;
        });

        var seldv = $("<div style='width:185px;text-align:left'/>"), selstat;
        styleInsert("selstaticon", "option[value='add']{ background-image:url('/images/add-icon.png'); padding-left:15px; }");
        selstat = $(makeCtr(["select:selectgroup", statlist1.join(";"), "selstat", "height:25px;margin:0 0 0 5px;width:145px", ""]));
        selstat.prepend($("<option disabled='disabled' selected='selected'>Select Model</option>"));
        selstat.append($("<optgroup label='-------------'><option value='add' >add new</option></optgroup>"));
        seldv.append(selstat);
        var seledit = $("<button class='btnRoundsmall'  style='margin:0 0 0 5px;padding:4px'><i class='fa fa-gear fa-lg imdim' /></button>");
        seldv.append(seledit);
        if (typeof modelcode != "undefined" && modelcode != "")
            selstat.val(modelcode);
        seledit.on("click", function () {
            if (selstat.val() == null)
                rstatAuthor();
            else
                jsonReadAjax("imctemplate", "statistics", "code", selstat.val(), rstatAuthor);
        });
        selstat.on("change", function () {
            if (selstat.val() == "add")
                rstatAuthor();
            else {
                $("#ulsrc").empty();
                ulsrclist($("#ulsrc"), [], false);
                jsonReadAjax("imctemplate", "statistics", "code", selstat.val(), rstatLoad.statform);
            }
        });
        return seldv;
    }
    function statform(sdt) {
        var dv1 = $("#dvform");
        var grp = "", id = "", stype = "", name = "", tabname = "", desc = "", model = "", modelname = "", modelcode = "", column = "1", cmd = ""
            , varlist = [], modelcmd = "", modelvarlist = [], modeloutlist = [], outlist = [], outodr = [];
        if (typeof sdt != "undefined" && sdt != "") {
            if (sdt.hasOwnProperty("modelcode")) {
                model = selectimc("imctemplate", "statistics", "code", sdt.modelcode);
                id = sdt.id;
                name = sdt.name;
                tabname = sdt.tabname;
                column = sdt.column;
                selcol = column;
                if (sdt.hasOwnProperty('cmd'))
                    cmd = sdt.cmd;
                varlist = sdt.varlist;
                outlist = sdt.outlist;
                outodr = sdt.outorder;
            }
            else
                model = sdt
            dv1.attr("model", JSON.stringify(model));
            if (model.hasOwnProperty('group')) grp = model.group;
            if (model.hasOwnProperty('name')) modelname = model.name;
            if (model.hasOwnProperty('code')) modelcode = model.code;
            if (model.hasOwnProperty('desc')) desc = model.desc;
            if (model.hasOwnProperty('model')) modelcmd = model.model;
            if (model.hasOwnProperty('varlist')) modelvarlist = model.varlist;
            if (model.hasOwnProperty('outlist')) modeloutlist = model.outlist;
        }
        dv1.empty();
        $("#tab-grid>ul>li[class*='ui-state-active']").attr("value", JSON.stringify(sdt));
        var dv2 = "<div id='dvmodel' style='min-width:525px'/>", dv3 = "<div id='dvoutput' style='min-width:525px'></div>";
        //fieldlist box create
        dv1.append('<input name="tabbed" id="tabbed1" type="radio" checked><section><h1><label for="tabbed1">Command</label></h1>' + dv2 + '</section>');
        dv1.append('<input name="tabbed" id="tabbed2" type="radio" ><section><h1><label for="tabbed2">Output</label></h1>' + dv3 + '</section>');
        //command
        var summary = $("<div id='dvsummary' class='rounddiv' style='font-size:12px;border-color:#A9A9A9;margin: 0 5px 10px 0;background-color: #EFEFEF;'/>");
        summary.html("<b>[" + grp + "]</b> " + modelname + "( " + modelcode + " ):" + desc + "<br/> <b>command</b>:" + modelcmd);
        var dv = $("#dvmodel");
        if (modelcode != "") {
            $("#dvsummary").remove();
            dv.closest("td").prepend(summary);
        }
        var btnset = $("<div id='dvbtnset' style='float:left'/>");
        $(["data", "output", "all"]).each(function (j, l) {
            btnset.append($("<input type='checkbox' checked='checked' id='inp" + l + "' value='" + l + "'/><label style='font-size:0.9em' for='inp" + l + "'>" + l + "</label>"));
        });
        dv.append(btnset);
        dv.append($("<textarea id='txcmd' style='width:100%;max-height:400px;overflow:auto;'/><input id='txcmd1' value='" + modelcmd + "' style='display:none'/><input id='txcmd2' style='display:none'/>"));
        dv.append($("<div style='padding-top:5px'><div id='dvshowhide' class='imdim' style='float:left;'><i class='fa fa-caret-square-o-down fa-lg imdim'/>&nbsp;Wizard</div>" +
            "<div style='float:right'><input type='button' class='roundbtn' value='run' style='font-size: 0.9em' /></div>"))
        dv.append($("<div style='clear:both'/>"));
        var author = $("<div class='rounddiv' style='padding:5px;margin:3px;display:block;'/>").appendTo(dv);
        author.append($("<div style='margin-top:10px'><label>variable</label></div>" + makeCtr(["div", "", "spvar1", , ])));
       // author.append($("<div style='margin-top:10px'><label>predict</label></div>" + makeCtr(["span", "", "sppredict1", , ])));
        author.append($("<div style='margin-top:10px'><label>outputs</label></div>" + makeCtr(["div", "", "spout1", , ])));
        $("input[type='button']").button()
        $("#dvmodel>label").each(function (i, k) {
            $(k).css("{margin:0}");
        });
        $("#dvbtnset").buttonset();
        $("#dvshowhide").on("click", function () {
            switch (author.css("display")) {
                case "block":
                    author.hide();
                    $("#dvshowhide>i").attr("class", "fa fa-caret-square-o-down fa-lg imdim");
                    //$(this).text('show');
                    break;
                case "none":
                    author.show();
                    $("#dvshowhide>i").attr("class", "fa fa-caret-square-o-up fa-lg imdim");
                    //$(this).text('hide');
                    break;
            }
        });
        $("#dvbtnset>input").on("click", function () {
            setTimeout(function () {
                $("#txcmd").css('height', 30);
                var arr = [];
                $("#dvbtnset>input:checkbox").each(function (i, k) {
                    if (!$(k).is(":checked"))
                        arr.push($(k).val())
                });
                var dtscript = combinecmd(arr);

                $("#txcmd").val(dtscript);
                var textEleHeight = $("#txcmd").prop('scrollHeight');
                $("#txcmd").css('height', textEleHeight + 10);
            }, 500);
        });
        $("#txcmd").val(cmd); $("#txcmd2").val(cmd);
        $("#tbsummary>tbody>tr>td:nth-child(1)").css({ width: "100px" });
        var tb1, tr, td;
        tb1 = $("<table id='tbvar1' width='100%'/>");
        $("#spvar1").append(tb1);
		//predictopt(varlist,{tbid:"tbpredict",addid:"inpaddpredict",containid:"sppredict1",dialog:false});
        if ($("#txcmd").val() == "") {
            $("#txcmd").val(modelcmd);
        }
        $(modelvarlist).each(function (i, k) {
            tr = $("<tr />").appendTo(tb1);
            td = $("<td style='vertical-align:top;width:80px;max-width:150px'/>").appendTo(tr);
            td.append($("<div class='ui-widget-header' style='padding:5px;height:40px;margin-right:2px;'><span style='display:none'>" + k[0] + "</span><label style='color:white'>" + k[1] + "</label></div>"))
            td = $("<td/>").appendTo(tr);
            ulvar = $("<ul class='connectedSortable ulvar'></ul>");
            ulvar.attr("varstyle", k[0]);
            td.append(ulvar);
            insertli(ulvar, k[1]);
        });
        $("#tbstatvar1>tbody").sortable();
        function insertli($ul, varname) {
            var insarr = [];
            $(varlist).each(function (i, k) {
                if (k.varname == varname) {
                    insarr.push(k.imgid);
                }
            });
            ulsrclist($ul, insarr, true);
        }
        if (outlist.length == 0) outlist = modeloutlist;
        outsetting(outlist, { tbid: "tbstatmodel1", addid: "inpaddmodel1", containid: "spout1", appendto: "dvsummary" });
        $("#ulvar,.ulvar").sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
        $(".ulvar").droppable({
            classes: {
                "ui-droppable-active": "ui-state-active",
                "ui-droppable-hover": "ui-state-hover"
            },
            drop: function (event, ui) {
                $(this).addClass("ui-state-highlight");
                variableupdate();
            },
            greedy: true
        });
        $("#tabbed2").on("click", function () {
            //conditional calling opencpu
            var outlist = saveTable("tbstatmodel1", false, true);
            if ($("#selcolnum1").length > 0)
                column = $("#selcolnum1").val();
            if (tabname == "") tabname = $("#tab-grid>ul>.ui-state-active").attr("aria-controls");
            if ($("#dvoutput").children().length <= 1) {
                $("#dvoutput").empty();
                var indeparr = [];
                  $(varlist).each(function (i, k) {
                    if (k.vartype != "dependent") {
                        indeparr.push(k.imgid);
                    }
                  });
                  var rcmdobj = {};
                  rcmdobj.outcmd = makeoutcmd(outlist);
                  rcmdobj.dtlist = makedtlist();
                  var opt = opencpuOption(outlist, indeparr, outodr, column, combinecmd(rcmdobj), tabname, tabsetting, $("#dvoutput"), rcmdobj.dtlist);
                opencpuRun(opt);
               
            }
        });
        $("input[value='run'],#inpreload").on("click", function () {
            $("#tabbed2").click();
        });
    }
}
function rtabSetting(setting) {
    //dropdown with image
    var auto = "", ht = "", hide = "";
    if (typeof setting != "undefined") {
        auto = setting[0][1];
        ht = setting[1][1].replace("px","");
        if (ht != "")
            ht += "px";
        hide = setting[2][1];
    }
    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["autoheight", makeCtr(["span", auto, "", "", ])]
    , ["height", makeCtr(["span", ht, "", "", ])]
    , ["hide", makeCtr(["span", hide, "", "", ])]
    ];
    var tb = makeTable("rtabsetting", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="edit" onclick="tabsettingdialog()" style="padding:0 3px 0 3px;font-size:10px" id="btntabsetting"/>|{"colspan":"2","style":"text-align:right;"}'];
    var tb2 = appendFooter(tb, foot);
    $("#dvtabsetting").empty();
    $("#dvtabsetting").append($("<label style='margin:5px 0 0 0;'><i class='fa fa-caret-right'/>tab setting</label>"))
    $("#dvtabsetting").append(tb2)
        //$("input[type='button']").button();
}
function tabsettingdialog() {
    var dv = $("<div  style='padding:5px'/>");
    dv.dialog({
        width: '340',
        autoResize: true,
        modal:true,
        autoOpen: true,
        title: "tab setting",
        stack: false,
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
            $("#btntabsetting").show();
        },
        buttons: [
        {
            text: "Save",
            icons: {
                primary: "ui-icon-check"
            },
            click: function () {
                var arr2 = saveTable("rtabsetting1", false, true);
                rtabSetting(arr2);
                $(this).dialog('destroy').remove();
                $("#btntabsetting").show();
            }
        },
        {
            text: "Cancel",
            icons: {
                primary: "ui-icon-close"
            },
            click: function () {
                $(this).dialog('destroy').remove();
                $("#btntabsetting").show();
            }
        }
        ]
    });
    var setting = saveTable("rtabsetting", false, true);
    var auto = true, ht = "", hide = "";
    if (setting.length>0) {
        auto = setting[0][1];
        ht = setting[1][1].replace("px","");
        hide = setting[2][1];
    }
    var data = [
     [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["autoheight", makeCtr(["input:checkbox", auto, "cbautoheight", "", ])]
    , ["height", makeCtr(["input", ht, "inpheight", "width:100px", ]) + "px"]
    , ["hide", makeCtr(["input:checkbox", hide, "cbhide", "", ])]
    ];
    var tb = makeTable("rtabsetting1", data, "general").appendTo(dv);
    $("#rtabsetting1").parent().parent().css({ "z-index": 1000 });
    $("#rtabsetting1>thead>tr>th:eq(0)").css("width", "40%");
    if(auto)
    $("#inpheight").closest("tr").hide();
    $("#cbautoheight").on("click", function () {
        if ($(this).is(":checked")){ 
            $(this).closest("tr").next().hide();
            $("#inpheight").val("");
        }
        else
            $(this).closest("tr").next().show();
    });
}
function rstatAuthor(sdt) {
    //authoring 
    var dv = $("<div id='dvauthorstat' style='padding:5px'/>");
    dv.dialog({
        width: '840',
        minHeight: '430',
        autoResize: true,
        appendTo: "#dveditback",
        modal: false,
        autoOpen: true,
        title: "Authoring Statistic Model",
        position: top,
        stack: false,
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
             {
                 text: "Delete",
                 icons: {
                     primary: "ui-icon-trash"
                 },
                 click: function () {
                     $(this).dialog('destroy').remove();
                     jsonDelAjax("imctemplate", "statistics", "code", $("#spcode").text());
                 }
             },
        {
            text: "Save",
            icons: {
                primary: "ui-icon-check"
            },
            click: function () {
                var arr1 = saveTable("tbauthor"), arr2 = saveTable("tbstatvar",false,true), arr3 = saveTable("tbstatmodel",false,true), list = [], outlist = [], combine = {};
                $(arr1).each(function (i, k) {
                    combine[k[0]]=k[1];
                });
                combine.varlist = arr2;
                combine.outlist = arr3;
               
                jsonUpdateAjax("imctemplate", "statistics", JSON.stringify(combine), "code", $("#spcode").text());
                updateimc("imctemplate", "statistics", combine, "code", $("#spcode").text())
                $(this).dialog('destroy').remove();
            }
        },
        {
            text: "Cancel",
            icons: {
                primary: "ui-icon-close"
            },
            click: function () {
                $(this).dialog('destroy').remove();
            }
        }
        ]
    });
    $("#dvauthorstat").addClass('helpinsert').attr("help", 'authormodel');
    helpinsert();
    var grp = "", code = "st" + idMake(),stype="select,;predict;analysis", name = "", column=1,collist="1;2;3;4",desc = "", model = "",predict=false, varlist = [], outlist = [];
    if (typeof sdt != "undefined" && sdt!="") {
        grp = sdt.group;
        stype = stype.replace(grp, grp + "," + grp + ",selected:selected");
        code = sdt.code;
        column = sdt.column;
        selcol = column;
        collist=collist.replace(column,column+","+column+",selected:selected")
        name = sdt.name;
        desc = sdt.desc;
        model = sdt.model;
        predict = sdt.predict;
       if(sdt.hasOwnProperty("predict"))predict=sdt.predict;
        varlist = sdt.varlist;
        outlist = sdt.outlist;
    }
    var data = [
        [makeCtr(["div", "Type", , "width:80px", ]), makeCtr(["div", "Value", , , ])]//headers
    , [makeCtr(["label", "code"]), makeCtr(["span", code, "spcode", "", ])]
    , [makeCtr(["label", "group"]), makeCtr(["select", stype, "", "", ""])]
    , [makeCtr(["label", "column"]), makeCtr(["select",collist, "selcolnum", "", ""])]
    , [makeCtr(["label", "name"]), makeCtr(["input", name, "", "width:100%", ])]
    , [makeCtr(["label", "desc"]), makeCtr(["input", desc, "", "width:100%", ])]
    , [makeCtr(["label", "model"]), makeCtr(["textarea", model, "", "width:100%", ])]
    , [makeCtr(["label", "predict"]), makeCtr(["input:checkbox", predict, "cbpredict", "", ])]
    ];
    var tb = makeTable("tbauthor", data, "general");
    dv.append(tb);
    dv.append($("<div style='margin-top:10px'><label>variable</label></div>" + makeCtr(["span", "", "spvar", , ])));
    //dv.append($("<div style='margin-top:10px'><label>predict</label></div>" + makeCtr(["span", "", "sppredict", , ])));
    dv.append($("<div style='margin-top:10px'><label>outputs</label></div>" + makeCtr(["span", "", "spout", , ])));
    $("#tbauthor>tbody>tr>td:nth-child(1)").css({ width: "100px" });
    varsetting(varlist);
    //predictopt(varlist);
    outsetting(outlist);
    function varsetting(varlist) {
        //variable list
        var data = [[makeCtr(["span", "type", , , ]),makeCtr(["span", "name", , , ]), makeCtr(["span", "desc", , , ]), makeCtr(["span", "", , , ])]];//headers
        var tb = makeTable("tbstatvar", data, "general");
        var foot = ['<input id="inpaddvar" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:3px 5px 0 0" />' +
                    '|{"colspan":"5","style":"text-align:right;padding:3px 0 3px 0;"}'];
        tb = appendFooter(tb, foot);
        $("#spvar").append(tb);
        var vartype = "dependent;multiple";
        var transform=""
        $(varlist).each(function (j, k) {
            var rowarr = [];
            var varselect = vartype.replace(k[0], k[0] + "," + k[0] + ",selected:selected");
            rowarr.push(makeCtr(["select", varselect, "", , ]));
            rowarr.push(makeCtr(["input", k[1], , "width:99%", ]));
            rowarr.push(makeCtr(["input", k[2], , "width:99%", ]));
            rowarr.push(makeCtr(["i", "fa fa-minus-square imdim", , "", ""]));
            appendTableRow($('#tbstatvar'), rowarr);
        });
        $("#tbstatvar>tbody").sortable();
      styling();
        $("#inpaddvar").on("click", function () {
            //destory paging
            //$("#tbstatvar").paging("destroy");
            var inp = makeCtr(["input","", , "width:99%", ]);
            var type1 = makeCtr(["select", vartype, "", , ]);
            appendTableRow($('#tbstatvar'), [type1,inp, inp, makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
            styling();
        });
        function styling() {
            $("#tbstatvar>tbody>tr>td:nth-child(1)").css({ width: "80px" });
            $("#tbstatvar>tbody>tr>td:nth-child(2)").css({ width: "120px" });
            $("tbstatvartfoot>tr>td>input").button();
            delRowdelegate('tbstatvar');
            runAfterTableCreate("tbstatvar", { activepage: "last", pagenum: 5 });
        }
    }
}
function outsetting(outlist, option) {
    //output model,chart setting
    var tbid = "tbstatmodel", addid = "inpaddmodel",containid="spout",appendto="dvauthorstat";
    if (typeof option != "undefined") {
        tbid = option.tbid;
        addid = option.addid;
        containid = option.containid;
        appendto = option.appendto;
    }
    var data = [[makeCtr(["span", "#", , , ]), makeCtr(["span", "code", , , ]), makeCtr(["span", "type", , , ]), makeCtr(["span", "col", , "", ]), makeCtr(["span", "name", , "", ]), makeCtr(["span", "desc", , , ]), makeCtr(["span", "model", ,"max-width:200px" , ]), makeCtr(["span", "outname", , , ]), makeCtr(["span", "", , , ]), makeCtr(["span", "", , , ])]];//headers
    var tb = makeTable(tbid, data);
    var colnum = data[0].length;
    var foot = ['<input id="' + addid + '" type="button" class="btnRoundsmall" value="add" style="padding:0 3px 0 3px;margin:1px 5px 0 0" />' +
        "<input id='inpreload' type='button'  value='reload' style='padding:0 3px 0 3px;margin:1px 5px 0 0' />" +
                '|{"colspan":"'+colnum+'","style":"text-align:right;padding:3px 0 3px 0;"}'];
    tb = appendFooter(tb, foot);
    $("#" + containid).append(tb);

   // var outputtype = "text;graph;dataset";
    $(outlist).each(function (j, k) {
        appendrow(tbid, k);
    });
    styling(tbid);
    tb.find("tfoot>tr>td>input").button();
   // $("#" + tbid + ">tbody").sortable();
    $("#"+addid).on("click", function () {
        edit(tbid,appendto);
    });
    outsetting.extractoutname = extractoutname;
    function styling(tbid) {
        //edit button click
        $("#" + tbid + ">tbody>tr>td:nth-child(9)").on("click", function () {
            var arr = [];
            var tr = $(this).closest("tr");
            tr.find("td>span").each(function (i, k) {
                arr.push($(k).text())
            });
            edit(tbid, appendto, arr);
        });
        var rowindexchg_callback = { callback: rowindexreorder, callbackoption: [tbid] };
        delRowdelegate(tbid,rowindexchg_callback );
        runAfterTableCreate(tbid, { activepage: "last", pagenum: 5 });
        rowSortable($("#" + tbid), rowindexchg_callback);
    }
    function edit(tbid, appendto, val) {
        var rindex = $("#" + tbid + ">tbody>tr").length + 1,colnum=1,code="t"+idMake(3), type = "", name = "", desc = "", model = "",outname;
        if (typeof val != "undefined") {
            rindex = val[0];
            code = val[1];
            type = val[2];
            colnum = val[3];
            name = val[4];
            desc = val[5];
            model = val[6];
           // if (type == "text")
            outname = val[7];
        }
        var outputtype = "select,;text;graph;predict;dataset";
        var colnumlist = "",colarr=[];
        for (var i = 1; i <parseInt(selcol)+1 ; i++) {
            colarr.push(i);
        }
        var colnumlist = colarr.join(";").replace(colnum, colnum + "," + colnum + ",selected:selected");
        var outselect = outputtype;
        if(type!="")
        outselect = outputtype.replace(type, type + "," + type + ",selected:selected");
        var data = [[makeCtr(["span", "type", , , ]), makeCtr(["span", "value", , "width:100px", ])]];//headers
        data.push([makeCtr(["span", "#", , , ]), makeCtr(["span", rindex, "", , ])]);
        data.push([makeCtr(["span", "code", , , ]), makeCtr(["span", code, "text-overflow:eclipsis;width:30px", , ])]);
        data.push([makeCtr(["span", "type", , , ]), makeCtr(["select", outselect, "selstype", , ])]);
        data.push([makeCtr(["span", "column", , , ]), makeCtr(["select", colnumlist, "", , ])]);
        data.push([makeCtr(["span", "name", , , ]),makeCtr(["textarea", name, , "width:100%;height:20px", ])]);
        data.push([makeCtr(["span", "desc", , , ]), makeCtr(["textarea", desc, , "width:100%;text-overflow:eclipsis;", ])]);
        data.push([makeCtr(["span", "model", "model1", "", ""]), makeCtr(["textarea", model, , "width:100%", ])]);
        data.push([makeCtr(["span", "outname", , , ]), makeCtr(["input", outname, , "width:100%", ])]);
       
        var tb = makeTable("tboutput", data);
       
        var dv = $("<div  style='padding:5px'/>").append(tb);
        dv.dialog({
            width: '440',
            autoResize: true,
            appendTo: "#"+appendto,
            modal: false,
            autoOpen: true,
            position: top,
            title: "Model Edit",
            stack: false,
            close: function (event, ui) {
                $(this).dialog('destroy').remove();
            },
            buttons: [
                  {
                      text: "Cancel",
                      click: function () {
                          $(this).dialog('destroy').remove();
                          $("#" + addid).show();
                      }
                  },
                {
                    text: "Save",
                    click: function () {
                        var ar = saveTable("tboutput");
                        var append = [],append1=[];
                        $(ar).each(function (i, k) {
                            append.push(makeCtr(["span", k[1], , , ]));
                            append1.push(k[1]);
                        });
                        if (typeof val == "undefined") {
                            //append1.splice(0, 1);
                            appendrow(tbid, append1);
                            styling(tbid);
                        }
                        else {
                            $('#' + tbid + ">tbody>tr:nth-child(" + rindex + ")>td>span").each(function (q, m) {
                                $(m).text(append1[q]);
                            });
                        }
                        $(this).dialog('destroy').remove();
                        $("#" + addid).show();
                    }
                }
            ]
        });
        dv.addClass('helpinsert').attr("help", 'modeledit');
        helpinsert();
        $("#tboutput>thead").remove();
        $("span:contains('outname')").closest("td").siblings().find("input").on("click", function () {
            $(this).show();
        });
        $("#tboutput textarea").on("click", function () {
            $("span:contains('outname')").closest("td").siblings().find("input").show();
        });
        if (type == "text" | type == "predict") {
            $("span:contains('outname')").closest("tr").show();
           // when blur model parse extract outname
            $("#model1").closest("td").siblings().find("textarea").on("blur", function () {
                var ext=extractoutname($(this).val());
                $("span:contains('outname')").closest("td").siblings().find("input").val(ext);
            });
        }
        else
            $("span:contains('outname')").closest("tr").hide();
        $("#selstype").on("change", function () {
            switch ($(this).val()) {
                case "text": case "predict":
                    $("span:contains('outname')").closest("tr").show();
                    break;
                default:
                    $("span:contains('outname')").closest("tr").hide();
                    $("span:contains('outname')").closest("td").siblings().find("input").val("");
                    break;
            }
        });
       
    }
    function extractoutname(val) {
        var varr = val.split("\n"), rtn = [], rtn1 = "";
        $(varr).each(function (i, k) {
            var indx = k.indexOf("=");
            rtn.push(k.substr(0, indx));
        })
        if (rtn.length > 0) {
            rtn1 = rtn.join(",");
        };
        return rtn1;
    }
    function editrow(tbid,rowindex,val){
        $('#' + tbid + ">tbody>tr:nth-child(" + rowindex + 1 + ")>td>span").each(function (i, k) {
            $(k).text(val[i]);
        });
    }
    function appendrow(tbid, val) {
        var rowarr = [];
        rindx = $("#" + tbid + ">tbody>tr").length + 1;
        //$(val).each(function (i, k) {
        //    rowarr.push(makeCtr(["span", k[i], "", , ]));
        //});
        rowarr.push(makeCtr(["span", val[0], "", , ]));
        rowarr.push(makeCtr(["span", val[1], , "", ]));
        rowarr.push(makeCtr(["span", val[2], , "", ]));
        rowarr.push(makeCtr(["span", val[3], , "", ]));
        rowarr.push(makeCtr(["span", val[4], , "", ]));
        rowarr.push(makeCtr(["span", val[5], "", , ]));
        rowarr.push(makeCtr(["span", val[6], , "width:150px", ]));
        rowarr.push(makeCtr(["span", val[7], "", , ]));
        rowarr.push(makeCtr(["i", "fa fa-pencil imdim", , "", ""]));
        rowarr.push(makeCtr(["i", "fa fa-times-circle imdim", , "", ""]));
        appendTableRow($('#' + tbid), rowarr);
    }
    setTimeout(function () {
        $("input[type='button']").button();
        $("#" + tbid + ">tbody>tr>td:e(0)").css({ width: "50px" });
        $("#" + tbid + ">tbody>tr>td>span[text='mode']") + "<span onclick=\"console.log('hi');\" style='margin-left:10px' class='imgbtn'/>"
    }, 1000);
}
//predict table setting
var predarr = [], showpredictlist = false;
function predictopt(option) {
    predictopt.reload = reload;
    var tbid = "tbpredict", addid = "inpaddpredict", containid = "", code = "", indeparr = [], seq = 1,id="",dtlist=[];
    if (typeof option != "undefined") {
        tbid = option.tbid;
        addid = option.addid;
        containid = option.containid;
        indeparr = option.indeparr;
        code = option.code;
        id = option.rstatid;
        dtlist = option.dtlist;
        var rtn = predictdatafind(code);
        if (option.hasOwnProperty("seq")) seq = option.seq;
        else seq = rtn.seq;
    }
    var dt = [makeCtr(["span", "#", , , ])];
    $(indeparr).each(function (i, k) {
        dt.push(makeCtr(["span", k, , , ]));
    });
    dt.push(makeCtr(["span", "", , , ]));
    var data = [dt];//headers
    var tb = makeTable(tbid, data);
    var colnum = data[0].length;
    var foot = ['<input id="' + addid + '" type="button"  value="add" style="padding:0 3px 0 3px;margin:1px 5px 0 0" />' +
                '|{"colspan":"' + colnum + '","style":"text-align:right;padding:3px 0 3px 0;"}'];
    tb = appendFooter(tb, foot);
    var dv = $("<div id='dvpop'/>");
    var tbb = $("<table width='100%'/>"), tbody = $("<tbody/>");
    tbb.append(tbody);
    tbody.append($("<tr><td style='width:50px'>select</td><td><input type='checkbox' id='cbselect'/></td></tr>"));
    tbody.append($("<tr><td style='width:50px'>seq</td><td><span id='spseq'>" + seq + "</span></td></tr>"));
    tbody.append($("<tr><td style='width:50px'>name</td><td><input id='inpname' style='width:100%'/></td></tr>"));
    tbody.append($("<tr><td cospan='2' style='vertical-align:top'>input</td><td>"+tb.outerHTML()+"</td></tr>"));
    dv.append(tbb);
    
    predictopt.appendrow1 = appendrow1;
	function appendrow1(tbid, indeparr,dlist) {
	    var rowarr = [];
	    if (typeof dlist != "undefined") {
	        $(dlist).each(function (i, k) {
	            if (i > 0) {
	                rowarr = [];
	                rowarr.push(makeCtr(["span", k[0], "", , ]));
	                for (var a = 1; a < k.length; a++) {
	                    rowarr.push(makeCtr(["input", k[a], , "numonly|width:99%", ]));
	                }
	                rowinsert(tbid,rowarr);
	            }
	        });
	    }
	    else {
	        rindx = $("#" + tbid + ">tbody>tr").length + 1;
	        rowarr.push(makeCtr(["span", rindx, "", , ]));
	        $(indeparr).each(function (i, k) {
	            rowarr.push(makeCtr(["input", , , "numonly|width:99%", ]));
	        });
	        rowinsert(tbid,rowarr);
	    }
	    var rowindexchg_callback = { callback: predictopt.reload, callbackoption: [tbid] };
	    delRowdelegate(tbid, rowindexchg_callback);
	    runAfterTableCreate(tbid, { activepage: "last", pagenum: 5 });

	    $(".numonly").keyup(function (e) {

	        //if the letter is not digit then display error and don't type anything
	        if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 190 && (e.which < 48 || e.which > 57)) {
	            //display error message
	            sweetmsgautoclose("Numbers Only!!", "Please try again.")
	            $(this).val("");
	            return false;
	        }
	    });
	    function rowinsert(tbid,rowarr) {
	        rowarr.push(makeCtr(["i", "fa fa-times-circle fa-lg imdim", , , ]));
	        appendTableRow($('#' + tbid), rowarr);
	    }
	}
	function reload(tbid) {
	    $("#inpaddpredict").show();
	    rowindexreorder(tbid);
	}
	var opt = {
	    width: '540',
	    //minHeight: '330',
	    autoResize: true,
	    modal: false,
	    autoOpen: true,
	    title: "Predict Input",
	    stack: false,
	    close: function (event, ui) {
	        $(this).dialog('destroy').remove();
	    },
	    buttons: [
        {
            text: "Cancel",
            click: function () {
                $(this).dialog('destroy').remove();
            }
        },
        {
            text: "Save",
            click: function () {
                saveopt(tbid, code, indeparr);
                $(this).dialog('destroy').remove();
            }
        }
	    ]
	};
	if (containid != "") {
	    $("#" + containid).parent().append(dv);
	    dv.css({ width: parseInt($(".portlet-content").css("width").replace("px", "")) - 10, border: "solid 1px #E0E0E0", padding: "5px", "border-radius": "5px", "background-color": "#F5F5F5" })
	    //opt.appendTo = "#" + containid;
	    //opt.position = ['center', 100];
	    //opt.width = parseInt($(".portlet-content").css("width").replace("px", "")) - 25;
	    var btndv = $("<div style='text-align:right;padding:5px;'/>");
	    var btn1 = $("<input type='button' value='Save'/>"), btn2 = $("<input id='dvtogg' type='button' value='List'/>");
	    btndv.append(btn2).append(btn1);
	    dv.append(btndv);
	    btn1.on("click", function () {
	        saveopt(tbid, code, indeparr);
	    });
	}
	else {
	    dv.dialog(opt);
	    $("<div  id='dvtogg' class='imdim' style='text-align:right'><i class='fa fa-caret-square-o-down fa-lg'/>&nbsp;List</div>").appendTo(dv);
	}
	dv.addClass('helpinsert').attr("help", 'predictinput');
	helpinsert();
	dv.parent().css("z-index", 500);

	var predinput = "";//predict input parameter
	function makenewdata(tbid, outarr) {
	    var htitle = [], rtn = {};
	    if (typeof outarr == "undefined") {
	        $("#" + tbid + ">thead>tr>th>span").each(function (i, k) {
	            if ($(k).text() != "")
	                htitle.push($(k).text());
	        });
	        predinput = saveTable1(tbid);
	        predinput.unshift(htitle);
	        rtn.dlist = predinput;
	        var transpred = predinput.transpose(), output = [];
	        transpred.splice(0, 1);
	        $(transpred).each(function (i, k) {
	            var title = k[0];
	            k.splice(0, 1);
	            output.push(title + "=c(" + k.join(",") + ")");
	        });
	        rtn.dframe = output.join(",");
	        return rtn;
	    }
	}
	function saveopt(tbid,code,indeparr) {
	    var set = {}, dset = {}, dtsett = [];
	    set.code = code;
	    set.indeparr = indeparr;
	    var chk = $("input:checkbox[id='cbselect']").is(":checked");
	    dset.select = chk;
	    dset.seq = parseInt($("#spseq").text());
	    dset.name = $("#inpname").val();
	    dset.dframe = makenewdata(tbid).dframe;
	    dset.tblist = makenewdata(tbid).dlist;

	    $(predarr).each(function (i, k) {
	        if (k.code == code) {
	            $(k.dtlist).each(function (a, b) {
	                if (b.seq == dset.seq)
	                    b.select = chk;
	                else
	                    b.select = !chk;
	            });
	        }
	    });

	    var chkexist = false, chk1 = false;
	    var dtt = $.grep(predarr, function (a) {
	        return a['code'] == code;
	    });
	    if (dtt.length > 0) {
	        if (dtt[0].hasOwnProperty("dtlist")) {
	            dtsett = dtt[0].dtlist;
	        }
	        $(dtsett).each(function (a, b) {
	            if (b.seq == $("#spseq").text()) {
	                dtsett.splice(a, 1, dset);
	                chkexist = true;
	            }
	        });
	        if (!chkexist)
	            dtsett.push(dset);
	        set.dtlist = dtsett;
	        $(predarr).each(function (c, d) {
	            if (d.code == code) {
	                predarr.splice(c, 1, set);
	                chk1 = true;
	            }
	        });
	    }
	    if (!chk1)
	        predarr.push(set);
        if(chk)
	    $(".fa-refresh").click();
	}
	$("input[type='button']").button();
	$("#" + addid).on("click", function () {
	    var ddlist = predictdatafind(code, seq).dlist;
	    appendrow1(tbid, indeparr);
	});
	if ($("#inpname").val() == "") {
	    $("#inpname").val("alt" + $("#spseq").text());
        if(tb.find("tbody").length==0)
	    $("#" + addid).click();
	}
	$("#dvtogg").on("click", function () {
	    if (dv.css("display") == "block" ) {
	        dv.hide();
	        $("#tbalt").show();
	    }
	    else {
	        dv.show();
	        $("#tbalt").hide();
	    }
	});
	
	var tb = predaltlist(code).insertBefore(dv);
	delRowdelegate("tbalt");
	runAfterTableCreate("tbalt", { activepage: "last", pagenum: 5 });
	$("#tbalt>tbody>tr").each(function (i, k) {
	    $(k).find("td:eq(4)").on("click", function () {
	        dv.show(); $("#tbalt").hide();
	        var seq = $(k).find("td:eq(1)>span").text();
	        $("input:checkbox[id='cbselect']").prop("checked", false);
	        predaltedit(tbid, code, seq)
	    });
	    $(k).find("td:eq(0)>input").on("click", function () {
	        // chkbox check
	        var seq = $(k).find("td:eq(1)>span").text();
	        $("#tbalt>tbody>tr").each(function (a, b) {
                if($(b).find("td:eq(1)>span").text()!=seq)
                    $(b).find("td:eq(0)>input").prop("checked", false);
                else
                    $(b).find("td:eq(0)>input").prop("checked", true);
	        });
	        $(predarr).each(function (u,m) {
	            if (m.code == code) {
	                $(m.dtlist).each(function (a, b) {
	                    if (b.seq == seq)
	                        b.select = true;
	                    else
	                        b.select = false;
	                });
	            }
	        });
	        //expand predictlist after opencpu refresh
	        showpredictlist = true;
	        var tabdata = $("#tbalt").closest($(".rstat")).find(".ui-state-active").attr("val");
            
	        if (typeof tabdata != "undefined") {
	            var tabdt = JSON.parse(tabdata);
	            tabdt.predictarr = predarr;
	            tabdt.dt = dtlist;
	            tabdt.id = id;
	            rstatInitRun(tabdt, true);
	            
	            $("#tbalt").closest($(".rstat")).find(".ui-state-active").attr("val",JSON.stringify(tabdt));
	        }
	        else {
	            $(".fa-refresh").click();
	        }
	    });
	});
	$("#inpadd1").on("click", function () {
	    $("#dvtogg").click();
	    $("input:checkbox[id='cbselect']").prop("checked", false);
	    var mseq = 1;
	    $("#tbalt>tbody>tr").each(function (i, k) {
	        if (mseq <= parseInt($(k).find("td:eq(1)>span").text())) {
	            mseq = parseInt($(k).find("td:eq(1)>span").text()) + 1;
	        }
	    });
	    predaltedit(tbid,code,mseq);
	});
	$("input:checkbox[id='cbselect']").prop("checked", false);
	$("input[type='button']").button();
	predaltedit(tbid, code, seq);
    //prevent when onclick input element hide 
	dv.click(function () { $(this).find("input").show() });
	$("#dvpop").hide(); $("#tbalt").show(); $(".fa-caret-square-o-down").click();
}
function predaltlist(code) {//outline, option, pid) {
    var altlist = [];
    var dtt = $.grep(predarr, function (a) {
        return a['code'] == code;
    });
    if (dtt.length > 0)
        altlist = dtt[0].dtlist;
    var data = [];
    var head = ["","Seq","Name","Alt","",""];//[makeCtr(["span", "", , , ]), makeCtr(["span", "Seq", , , ]), makeCtr(["span", "Name", , , ]), makeCtr(["span", "Alt", , , ]), makeCtr(["span", , , , ]), makeCtr(["span", , , , ]), makeCtr(["span", , , , ])];
    data.push(head);
    $(altlist).each(function (i, k) {
        data.push([makeCtr(["input:checkbox", k.select, , , ]), makeCtr(["span", k.seq, , , ]), makeCtr(["span", k.name, , , ]), makeCtr(["span", JSON.stringify(k.dframe), , , ])
           , makeCtr(["i", "fa fa-gear fa-lg imdim", , , ]), makeCtr(["i", "fa fa-times-circle fa-lg imdim", , , ])]);
    });
    var tb = makeTable("tbalt", data);
    var colnum = data[0].length;
    var foot = ['<input id="inpadd1" type="button"  value="add" style="padding:0 3px 0 3px;margin:1px 5px 0 0" />' +
                '|{"colspan":"' + colnum + '","style":"text-align:right;padding:3px 0 3px 0;"}'];
    tb = appendFooter(tb, foot);
    
    tb.css({ "margin": "5px 0 0 0" });
    tb.click(function () { $(this).find("input").show() });
    return tb;
}
function predaltedit(tbid,code, seq) {
    if (typeof seq == "undefined") seq = 1;
    $("#" + tbid + ">tfoot>tr>td").find("input").show();
    $("#spseq").text(seq);
    $("#cbselect").show();
    $("#inpname").show();
    var name = "alt" + seq,select=false;
    $("#" + tbid + ">tbody").empty();
    if (predarr.length > 0) {
        var ddlist = predictdatafind(code, seq),tblist=[];
        if (typeof ddlist.dlist != "undefined") {
            name = ddlist.dlist.name;
            select = ddlist.dlist.select;
            tblist = ddlist.dlist.tblist;
        }
        if (select)
            $("input:checkbox[id='cbselect']").prop("checked", true);
        $("#inpname").val(name);
        predictopt.appendrow1(tbid, ddlist.indeparr, tblist);
    }
}
function predictdatafind(linecode,seq) {
    var rtn = {},dt=[];
    var dtt = $.grep(predarr, function (a) {
        return a['code'] == linecode;
    });
    if (dtt.length > 0) {
        if (dtt[0].hasOwnProperty("dtlist")){
            var dlist = dtt[0].dtlist;
            if (typeof seq == "undefined") {
                var dtt2 = $.grep(dlist, function (a) {
                    return a['select'] == true;
                });
                //var ss = findmaxseq(dlist);
                //seq = ss.maxnum;
                seq = dtt2[0].seq;
            }
            var dtt1 = $.grep(dlist, function (a) {
                return a['seq'] == seq;
            });
            rtn.dlist = dtt1[0];
            rtn.indeparr = dtt[0].indeparr;
            rtn.seq = seq;
        }
    }
    return rtn;
}
function findmaxseq(arr) {
    var maxnum = 1, indx = 0, rtnseq = {};
    $(arr).each(function (i, k) {
        if (parseInt(k.seq) > maxnum) {
            maxnum = parseInt(k.seq);
            indx = i;
        }
    });
    rtnseq.maxnum = maxnum;
    rtnseq.indx = indx;
    return rtnseq;
}
//opencpu preparation
var opencputmp = [];
function opencpuOption(outlist,indeparr, outodr, column,rcmd,tabname,tabsetting, container,dtlist,id) {
    var option = {};
    var arr = commandarray(outlist, indeparr, outodr,dtlist,id);
    option.outarr = arr;
    option.indeparr = indeparr;
    option.column = column;
    option.container = container;
    option.rcmd = rcmd;
    option.tabsetting = tabsetting;
    option.tabname = tabname;
    option.dtlist = dtlist;
    option.id = id;
    return option;
}
function commandarray(outlist, indeparr, outodr, dtlist, id) {
    var arr = [], j = 1, set = {}, set2 = {};
    $(outlist).each(function (i, k) {
        set = {};
        set = { code: k[1], type: k[2], column: k[3], name: k[4], desc: k[5], model: k[6], outname: k[7] };
        switch (k[2]) {
            case "graph":
                var nn = set.model.split("\n");
                if (nn.length > 1)
                    multigraph(set, j, arr, outodr);
                else {
                    set.outname = j;
                    set = outorderUpdate(set, set.code, outodr)
                    arr.push(set);
                    j++;
                }
                break;
            case "predict":
                var rtn = predictdatafind(set.code), rtn1;
                if (rtn != "") {
                    if (rtn.hasOwnProperty("dlist") && rtn.dlist.hasOwnProperty("dframe"))
                        rtn1 = rtn.dlist.dframe;
                    set.model = set.model.replace("newdata", "data.frame(" + rtn1 + ")");
                    set = outorderUpdate(set, set.code, outodr)
                    arr.push(set);
                }
                else {
                    var opt = { tbid: "tbpredict", addid: "inpaddpredict", containid: "", indeparr: indeparr, code: k[1], dtlist: dtlist, rstatid: id };
                    predictopt(opt);
                }
                break;
            default:
                if (set.hasOwnProperty("outname") && set.outname.split(",").length > 1)
                    multicmd(set, arr);
                else {
                    set = outorderUpdate(set, set.code, outodr)
                    arr.push(set);
                }
                break;
        }
    });

    return arr;

    function multicmd(set, arr) {
        var nn = set.model.split("\n");
        var oo = set.outname.split(",");
        $(nn).each(function (a, b) {
            var set1 = jQuery.extend(true, {}, set);
            set1.code = set1.code + "_" + a;
            set1.name = set1.name + parseInt(a) + 1;
            set1.model = b;
            set1.desc = b;
            set1.outname = oo[a];
            arr.push(set);
        });
    }
    function multigraph(set, j, arr, outodr) {
        var nn = set.model.split("\n");
        $(nn).each(function (a, b) {
            var seq = parseInt(a) + 1;
            var set1 = jQuery.extend(true, {}, set);
            set1.code = set1.code + "_" + a;
            set1.name = set1.name + seq;
            set1.model = b;
            set1.desc = b;
            set1.outname = j;
            set1 = outorderUpdate(set1, set1.code, outodr)
            arr.push(set1);
            j++;
        });
    }
    function outorderUpdate(out, code, outodr) {
        //update order, width change, and multiple cmd split
        var dtt = $.grep(outodr, function (a) {
            return a['code'] == code;
        });
        if (dtt.length > 0) {
            var odr = dtt[0];
            if (odr.hasOwnProperty("code")) out.code = odr.code;
            if (odr.hasOwnProperty("odr")) out.odr = odr.odr;
            if (odr.hasOwnProperty("outnamne")) out.outnamne = odr.outnamne;
            if (odr.hasOwnProperty("column")) out.column = odr.column;
            if (odr.hasOwnProperty("url")) out.url = odr.url;
        }
        return out;
    }
}
function combinecmd(arr) {
    var outcmd = [], dtlist = "";
    if (typeof arr != 'undefined') {
        if (arr.hasOwnProperty("dtlist")) dtlist = JSON.stringify(arr.dtlist);
        if (arr.hasOwnProperty("outcmd")) outcmd = arr.outcmd;
    }
    dtscript = "library(jsonlite)\n";
    dtscript += "library(car)\n";
    dtscript += "data=fromJSON('" + dtlist + "')\n";
    dtscript += "attach(data)\n";
    $(outcmd).each(function (j, q) {
        if ((q.type == "predict" && q.newdata) | q.type != "predict")
            dtscript += q.model;
        if (outcmd.length - 1 != j)
            dtscript += "\n";
    });
    return dtscript;
}
function makeoutcmd(outline) {
    var outcmd = [];
    $(outline).each(function (r, q) {
        var cd = q[1];
        var type = q[2];
        var md = q[6];
        var set = { type: type, code: cd, model: md };
        if (type == "predict") {
            //in case predict check newdata exists
            $(predarr).each(function (a, b) {
                if (b.code == cd) {
                    set.newdata = true;
                    $(b.dtlist).each(function (x, y) {
                        if (y.select)
                            set.model = set.model.replace("newdata", "data.frame(" + y.dframe + ")");
                    });
                }
            });
        }
        outcmd.push(set);// + "\n";
    });
    return outcmd;
}
function makedtlist(id) {
    var dt = $('#spdlist').text()
    if (dt == '') {
        if (id == "")
            id = $("#tbalt").closest(".rstat").attr("id");
        dt = $("#dt" + id).text();
    }
    if (dt != "") dt = JSON.parse(dt)
    return dt;
}
//opencpu run
function opencpuRun(option, pred) {
    //prevent predarr to become [] 
    if (typeof pred != "undefined")
        predarr = pred;

    //Go R button Click Event Handler
    var rCommands = "",tabname="",reload=false,tabsetting="";
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("rcmd")) rCommands = option.rcmd;
        if (option.hasOwnProperty("tabname")) tabname = option.tabname;
        if (option.hasOwnProperty("tabsetting")) tabsetting = option.tabsetting;
        if (option.hasOwnProperty("reload")) reload = option.reload;
    }
    jscriptInsert("lightbox-js", "/js2/lightbox2/src/js/lightbox.js");
    jsfunctionInsert("lightbox-opt", "lightbox.option({'fitImagesInViewport': false })");
    cssInsert("lightbox-css","/js2/lightbox2/src/css/lightbox.css");
    funLoading(true);
    var tmpobj = findopencputmp(tabname)
   
    if (reload | opencputmp.length == 0 | !tmpobj | openreload(tmpobj)) {
        var resultsUrlPrefix = "http://public.opencpu.org",
            url = resultsUrlPrefix + "/ocpu/library/base/R/identity/save";
      
        $.post(url,
        {
            x: rCommands
        },
        function (data) {
            option.container.empty();
            processopencpu(data, option);
            var tmp = data.toString().match(/.+\/console/m);
            if (tmp.length > 0) {
                var set = {};
                //tmp = tmp[0].replace("/ocpu/tmp/", "").replace("/console", "");
                set.tabname = tabname;
                set.data = data;
                set.date = new Date();
                updateopencputmp(set)
            }
            funStop();
        })
        .error(function (jqXHR, status, error) {
            funStop();
            sweetmsg("Error", jqXHR.responseText);
        });
    }
    else {
        option.container.empty();
        var dt = findopencputmp(tabname);
        processopencpu(dt, option);
        funStop();
    }
    function openreload(tmpobj) {
        //chk if reload is needed
        var rtn = false;
        if(!tmpobj | !tmpobj.hasOwnProperty("data") | tmpobj.date<new Date().addDays(-1))
        rtn = true;
        return rtn;
    }
}
function processopencpu(data,option) {
    var colnum = 1,indeparr=[], outarr = [],container=$("#dvoutput"),tabsetting="";
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("column")) colnum = option.column;
        if (option.hasOwnProperty("indeparr")) indeparr = option.indeparr;
        if (option.hasOwnProperty("tabsetting")) tabsetting = option.tabsetting;
        if (option.hasOwnProperty("outarr")) outarr = option.outarr;
        if (option.hasOwnProperty("container")) container = option.container;
    }
    var ocpurl = "http://public.opencpu.org";
    if ($("#statsortable").length==0)
        $("<div id='statsortable' />").appendTo(container);
    else
        $("#statsortable").empty();
    opencpuhead(option);
    var txtarr = [],regex;
    $(outarr).each(function (i, k) {
        switch(k.type){
            case "text":case "predict":
                regex = new RegExp(".+\/" + k.outname, "m");
                break;
            case "graph":
                regex = new RegExp(".+\/graphics\/" + k.outname, "m");
                break;
        }
        if (data.toString().match(regex) != null) {
            var staturl = ocpurl + data.toString().match(regex);
            k.url= staturl;
        }
    });
    var wth;
    if(option.hasOwnProperty("wth"))wth=option.wth;
    responsivediv(outarr,indeparr,tabsetting, colnum, $('#statsortable'),option.id,option.dtlist,wth);
    responsiveAfter(colnum);
}
function opencpuhead(opt) {
    var outlist = opt.outlist, indeparr = opt.indeparr, outodr = opt.outodr, column = opt.column, tabname = opt.tabname
        , tabsetting = opt.tabsetting, container = opt.container, dt = opt.dt, id = "";
    if (opt.hasOwnProperty("id")) id = opt.id;
    var dvoutbar = $("<div style='width:100%'></div>");
    container.prepend(dvoutbar);
    var odate = "";
    var tmp = findopencputmp(tabname);
    if (tmp.hasOwnProperty('date')) odate = tmp.date;
    if (odate != "") odate = friendlydate(odate);
    var date = $("<div style='float:left;'><span id='spopencputmp' >updated:" + odate + "</span></div>");
    date.prependTo(dvoutbar);
    var reload = $("<div style='margin:0 5px 0 5px;float:left;'> <i class='fa fa-refresh imdim'/></div>");
    reload.prependTo(dvoutbar);
    radio(opt);
    chgcolor(column);
    $(".fa-refresh").on("click", function () {
        opt.reload = true;
        if (showpredictlist)
            opencpuRun(opt, predarr);
        else {
            //reload opencpu
            swal({
                title: "Request Remodel",
                text: "Are you sure to request model again ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, reload it!",
                closeOnConfirm: true
            },
            function () {
                opencpuRun(opt);
            });
        }
    });
    function radio(opt) {
        var dv = $("<div style='float:right' class='widget'/>");
        for (var i = 1; i <= 4; i++) {
            var id = "radio" + i, awesome;
            switch (i) {
                case 1:
                    awesome = "reorder";
                    break;
                case 2:
                    awesome = "th-large";
                    break;
                case 3:
                    awesome = "th";
                    break;
                case 4:
                    awesome = "calendar";
                    break;

            }
            dv.append($("<label for='" + id + "'>" + i + "</label><input class='rcol' type='radio' name='" + id + "' id='" + id + "'/>"));
        }
        dvoutbar.append(dv);
        $(".rcol").checkboxradio({
            icon: false
        });

        $(".rcol").on("click", function (e) {
            var id = e.currentTarget.id;
            var clnum = id.replace("radio", "");
            rcolclick(clnum);
        })
    }
    function rcolclick(num) {
        chgcolor(num);
        $("#statsortable-style").remove();
        opt.column = num;
        opencpuRun(opt);
    }
    function chgcolor(num) {
        $(".rcol").prev("label").removeClass("ui-state-active");
        setTimeout(function () { $("#radio" + num).prev("label").addClass("ui-state-active"); }, 100);
    }
}
function responsivediv(objarr, indeparr, tabsetting, colnum, container, id, dtlist,wth1) {
    
    var wth = container.width();
    if (wth == null) wth = wth1;
  
    var height = "height:600px";
    if (tabsetting[0][1] == "true")
        height = "height:auto;overflow:hidden";
    else height = "height:" + tabsetting[1][1] + ";overflow:auto";
    var style = " .column {width: " + wth + "px;" + height + ";     }";
    style += ".portlet {    float: left; margin:5px 5px 0 0;   }";
    switch (colnum) {
        case '1':
            style += ".col1{width:99%}";
            style += ".col2{width:99%;}";
            style += ".col3{width:99%;}";
            style += ".col4{width:99%;}";
            break;
        case '2':
            style += ".col1{width:49%}";
            style += ".col2{width:99%;}";
            style += ".col3{width:99%;}";
            style += ".col4{width:99%;}";
            break;
        case '3':
            style += ".col1{width:32%}";
            style += ".col2{width:65%}";
            style += ".col3{width:99%}";
            style += ".col4{width:99%}";
            break;
        case '4':
            style += ".col1{width:24.3%}";
            style += ".col2{width:49%}";
            style += ".col3{width:74%}";
            style += ".col4{width:99%}";
            break;
    }
    style += ".portlet-header {    min-height:25px;    position: relative;  }";
    style += ".portlet-toggle {    position: absolute;    top: 50%;    right: 0;    margin-top: -8px;  }";
    style += ".portlet-content {    padding: 5px;height:100%  }";
    style += ".portlet-placeholder {    border: 1px dotted blue;    margin: 0 1em 1em 0;    height: 550px;  }";
    style += ".ui-resizable-helper { border: 2px dotted #00F; }";
    styleInsert("statsortable-style", style);
    if ($(".column").length == 0) {
        var col = $("<div class='column'/>").appendTo(container);
        objarr.sort(function (a, b) {
            return (parseInt(a.odr) > parseInt(b.odr)) ? 1 : -1;
        });
        $(objarr).each(function (i, k) {
            if (k.hasOwnProperty("url")) {
                var portlet = $("<div class='portlet' />").appendTo(col);
                var imgwth = calwidth(wth, colnum, k.column);
                portlet.addClass("col" + k.column);
                var porthead = $("<div class='portlet-header'/>").appendTo(portlet);
                var portcont = $("<div class='portlet-content'/>").appendTo(portlet);;
                porthead.append($("<span style='padding:0 0 0 10px'>" + k.name + "</span>"));
                portcont.append($("<div style='padding:0 0 0 5px'>" + k.desc + "</span>"));
                porthead.attr("value", JSON.stringify(k));
                switch (k.type) {
                    case "graph":
                        var simg = k.url + "/png?width=" + imgwth.width + "&height=" + imgwth.height;
                        var aa = $('<a/>', {
                            href: k.url,
                            "data-lightbox": "image-1",
                            "data-title": "img"
                        }).appendTo(portcont);
                        $('<img/>', {
                            id: 'chartResults',
                            class: "innercontent",
                            src: simg
                        }).appendTo(aa);
                        break;
                    case "text": case "predict":
                        $('<pre/>', {
                            id: 'statResults' + i,
                            class: "innercontent",
                            style: 'word-wrap: break-word; white-space: pre-wrap;font-size:12px;'
                        }).appendTo(portcont);
                        $("#statResults" + i).load(k.url, function (data) {
                            $("#statResults" + i).html(data)
                        });
                        break;
                }
                if (k.type == "predict") {
                    var dv = $("<div class='imdim' style='background-color:#A2E9FF;height:25px;padding:5px;border-radius:5px 5px 0 0;width:" + wth + "'><span><i class='fa fa-caret-square-o-down fa-lg'/>&nbsp;predict setting</span></div>");
                    portcont.append(dv);
                    dv.on("click", function () {
                        if ($(this).find("i").attr("class") == "fa fa-caret-square-o-down fa-lg") {
                            $(this).find("i").attr("class", "fa fa-caret-square-o-up fa-lg");
                            var opt = { tbid: "tbpredict", addid: "inpaddpredict", containid: 'statResults' + i, indeparr: indeparr, code: k.code, rstatid: id, dtlist: dtlist };
                            if ($("#" + opt.tbid).length == 0) {
                                predictopt(opt);
                            }
                            else
                                $("#tbalt").show();
                        }
                        else {
                            $(this).find("i").attr("class", "fa fa-caret-square-o-down fa-lg");
                            $("#dvpop").hide(); $("#tbalt").hide();
                        }
                    });
                }

            }
        });
    }
}
function responsiveAfter(colnum) {
    //colnum=parseInt(colnum);
    //exec after responsive div created 
    $(".column").sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all"
    });
    $(".portlet")
      .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
      .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all immove")
        .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle imdim'></span>");

    $(".portlet-toggle").on("click", function () {
        var icon = $(this), pt = icon.closest(".portlet");
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        pt.find(".portlet-content").toggle();
    });

    $(".portlet").resizable({
        containment: ".column",
        animate: true,
        alsoResize: "innercontent",
        helper: "ui-resizable-helper",
        //maxHeight: 300,
        //maxWidth: 580,
        stop: function (event, ui) {
            var x = $(event.target).width();
            setTimeout(function () {
                var num = chkwidth($(event.target).width(), colnum);
                for (var i = 1; i <= 4; i++) {
                    $(event.target).removeClass('col' + i);
                }
                $(event.target).addClass('col' + num);
                $(event.target).removeAttr("style");
                var imgwth = calwidth($(".column").width(), colnum, num);
                $(event.target).find(".portlet-content>a>img").css({ width: imgwth.width });
                //header value update
                var val = $(event.target).find(".portlet-header").attr("value"), code;
                if (val != "") {
                    val = JSON.parse(val);
                    val.column = num;
                    code = val.code;
                    $(event.target).find(".portlet-header").attr("value", JSON.stringify(val));
                }
            }, 1000);
        }
    });
    //checkbox change from predictlist
    $(".fa-caret-square-o-down").click();
    if (showpredictlist) {
        $("#dvpop").hide(); $("#tbalt").show(); //$(".fa-caret-square-o-down").click();
    }
    showpredictlist = false;

    function chkwidth(curwth, colnum) {
        var ttlwth = $(".column").width();
        var num = Math.ceil(curwth / ttlwth * parseInt(colnum));
        return num;
    }
}
function findopencputmp(tabname) {
    if (typeof tabname == "undefined") tabname = $("#tab-grid>ul>.ui-state-active").attr("arial-controls");
    var dtt = $.grep(opencputmp, function (a) {
        return a['tabname'] == tabname;
    });
    if (dtt.length > 0)
        return dtt[0];
    else
        return false;
}
function updateopencputmp(obj) {
    var chkexist = false;
    $(opencputmp).each(function (i, k) {
        if (k.tabname == obj.tabname) {
            opencputmp.splice(i, 1, obj);
            chkexist = true;
        }
    });
    if (!chkexist)
        opencputmp.push(obj);
}
function calwidth(wth, ttlnum, curnum) {
    if (ttlnum < curnum) curnum == ttlnum;
   // var wth = $(".column").width();
    var ratio = parseInt(curnum) / parseInt(ttlnum);
    var margin = 80 * ratio;
    var hargin = 70 * ratio;
    var set = {};
    set.width = Math.round(wth * ratio) - margin;
    set.height = Math.round(wth * ratio) - hargin;
    return set;
}
//save rstat
function rstatTabSave() {
    var ctab = $("#tab-grid>ul>li[class*='ui-state-active']");
    var set = {};
    set.index = ctab.index();
    set.id = ctab.find("a").attr("href").replace("#", "");
    set.name = ctab.find("a").text();
    set.column=$(".rcol").prev(".ui-state-active").text();
    set.tabname = ctab.find("a").text();
    //variable
    var varlist = [], set1;
    $("#tbvar1>tbody>tr").each(function (i, k) {
        set1 = {};
        set1.varname = $(k).find("td>div>label").text();
        set1.vartype = $(k).find("td>div>span").text();
        set1.imgid = $(k).find("td>ul>li>img").attr("id");
        set1.imgsrc = $(k).find("td>ul>li>img").attr("src");
        varlist.push(set1);
    });
    set.predictarr = predarr;
    set.varlist = varlist;
    var out = saveTable("tbstatmodel1", false, true);
    set.outlist = out;
    set.outorder = outodr();
    set.cmd = $("#txcmd").val();
    var sett = saveTable("rtabsetting", false, true);
    set.tabsetting = sett;
    if ($("#selstat").val()!=null)
        set.modelcode = $("#selstat").val();
    
    ctab.attr("value", JSON.stringify(set));
    function outodr() {
        var odr = [];
        $(".column .portlet-header").each(function (i, k) {
            var set = JSON.parse($(k).attr("value"));
            set.odr = i;
            odr.push(set);
        });
        return odr;
    }
}
function rstatEditSave(id, options) {
    var setting = {},  src = "";
    //if (options.hasOwnProperty("src"))
    //    src = options.src;

    var combine = saveData(true);
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = id;
    }
    rstatTabSave();
    var tablist = [];
    $('#tab-grid>ul:nth-child(1)>li').each(function (i, k) {
        if(typeof $(k).attr("value")!="undefined" && $(k).attr("value")!="")
            tablist.push(JSON.parse($(k).attr("value")));  
    });
    combine.tablist = tablist;
    combine.opencputmp = opencputmp;

    if ($(".dnd").length > 0)
    combine.eventlist = dndevtlist("rstat");
    if (combine != null) {
        combine.ctrtype = 'rstat';
        commonsave(id, src, combine, options);
    }
    function makeArray(list){
        var rtn=[];
        $(list).each(function(i,k){
            rtn.push($(k).contents().get(0).nodeValue);
        });
        return JSON.stringify(rtn);
    }
}
function rstatOpencputmpsave() {

}
//#endregion

//#region pivottable
var pivotset,styval,cstyval;
function pivotInit(id, options) {
  
    var ctr, gcontain = $("#" + id), data;
    if (typeof options != "undefined"){
        if (options.hasOwnProperty("gdt")) ctr = options.gdt;
        else
            ctr = options;
        if (options.hasOwnProperty("contain"))
            gcontain = options.contain;
    }
    else
        ctr = readdata(id, "gdt");
    gcontain.empty();
    // var ctr = selectimctable(menuid, subid, id);//var ctr = selectimc("imctable", pathname);
    pivotInit.datasrc = datasrc;
    //if (id == "pivotpreview") {
    //    jsonReadAjax("imcdata", "", "code", ctr.data.datacode, pivotInit.datasrc, [gcontain, ctr]);
    //   // datasrc(ctr.data, gcontain, ctr);
    //}
    //else
    if (typeof ctr != "undefined" && ctr.hasOwnProperty("data")) {
        var code = ctr.data.datacode;
        if (ctr.data.hasOwnProperty("code"))  code = ctr.data.code;
        jsonReadAjax("imcdata", "", "code", code, pivotInit.datasrc, [gcontain, ctr]);
    }



    //if (typeof ctr !="undefined" && ctr.hasOwnProperty("data")) {
    //    if (ctr.data.hasOwnProperty("datalist"))
    //        datasrc(ctr.data, id, ctr);
    //    else
    //        jsonReadAjax("imcdata", "", "code", ctr.data.datacode, pivotInit.datasrc, [id, ctr]);
    //}
    function datasrc(data, gcontain, ctr) {
        var dt;
        var id = gcontain.attr("id");
        dt = datalistreturn(data);
        jsonQueryCheck(data, pivotInit.datasrc, [gcontain, ctr]);
        if (typeof ctr != "undefined") {
            var  rows = "[]", cols = "[]", vals = "[]", render = "", hidden = '', aggregate = "", rendername = "", derieveddate = "", numbergrp = "",filter="";
            var st = ctr.setting;
            if (st) {
                if (st.hasOwnProperty("rows")) rows = st.rows;
                if (st.hasOwnProperty("cols")) cols = st.cols;
                if (st.hasOwnProperty("vals")) vals = st.vals;
                if (st.hasOwnProperty("render")) render = st.render;
                if (st.hasOwnProperty("hiddenfield")) hidden = st.hiddenfield;
                if (st.aggregate != "") aggregate = st.aggregate;
                if (st.hasOwnProperty("rendername")) rendername = st.rendername;
                if (st.hasOwnProperty("derieveddate")) derieveddate = st.derieveddate;
                if (st.hasOwnProperty("numbergrp")) numbergrp = st.numbergrp;
            }
            //if (ctr.hasOwnProperty("data")) filter = ctr.data.filter;
            if (ctr.hasOwnProperty("data") && id!="pivotpreview") {
                filter = findfilter(ctr.data);
                dt = applyFilter(dt, filter);
            }
        }
        //if (data != "" && data.hasOwnProperty("datalist")) {
        //    dt = applyFilter(data.datalist, filter);
        //}
        //else
        if (dt == "undefined")
            return false;
        var opt = {};
        var opt1 = {
            //aggregators: {
            //    "Mean Temp (Celsius)":
            //    function () { return tpl.average()(["Mean Temp (C)"]) },
            //    "Max Temp (Celsius)":
            //        function () { return tpl.max()(["Max Temp (C)"]) },
            //    "Min Temp (Celsius)":
            //        function () { return tpl.min()(["Min Temp (C)"]) },
            //    "Total Rain (mm)":
            //        function () { return tpl.sum()(["Total Rain (mm)"]) },
            //    "Total Snow (cm)":
            //        function () { return tpl.sum()(["Total Snow (cm)"]) }
            //},
            //derivedAttributes: {
            //    "year": dateFormat("Date", "%y", true),
            //    "month": dateFormat("Date", "%m", true),
            //    "day": dateFormat("Date", "%d", true),
            //    "month name": dateFormat("Date", "%n", true),
            //    "day name": dateFormat("Date", "%w", true)
            //},
            sorters: function (attr) {
                if (attr == "month name") {
                    return sortAs(["Jan", "Feb", "Mar", "Apr", "May",
                        "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
                }
                if (attr == "day name") {
                    return sortAs(["Mon", "Tue", "Wed", "Thu", "Fri",
                        "Sat", "Sun"]);
                }
            },
            hiddenAttributes: ["Date", "Max Temp (C)", "Mean Temp (C)",
                "Min Temp (C)", "Total Rain (mm)", "Total Snow (cm)"],
            renderers: $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.c3_renderers
                //$.pivotUtilities.export_renderers,
                 //$.pivotUtilities.gchart_renderers
                ),
            rows: ["year", "month name"],
            cols: ["day name"]
        }

        var renderers = $.extend($.pivotUtilities.renderers
           , $.pivotUtilities.c3_renderers
          , $.pivotUtilities.d3_renderers
           //,$.pivotUtilities.gchart_renderers
           );

        opt.rows = JSON.parse(rows);
        opt.cols = JSON.parse(cols);
        opt.vals = JSON.parse(vals);
        opt.renderers = renderers;
        opt.aggregatorName = aggregate;
        opt.rendererName = rendername;
        opt.onRefresh = function (config) {
            var config_copy = JSON.parse(JSON.stringify(config));
            //delete some values which are functions
            delete config_copy["aggregators"];
            delete config_copy["renderers"];
            //delete some bulky default values
            delete config_copy["rendererOptions"];
            delete config_copy["localeStrings"];
            pivotset = (JSON.stringify(config_copy, undefined, 2));
        }
        var wth = $("#" + id).closest("td").css("width"), ht = $("#dvtable").height();
        var sty1 = { "overflow-x": "auto", "width": wth };
        if (id == "pivotpreview") {
            sty1["overflow-y"] = "hidden";
            sty1["max-height"] = ht;
            // $("#"+id).wrap($("<div style='overflow:hidden;zoom:1;'/>"))
        }
        $("#" + id).pivotUI(dt, opt).css(sty1);
        var container = $("#tab-Contain").parent();
        var bar = expandcollapsemake($("#" + id), container)
        
        $("#" + id).prepend(bar);
        if (ctr.hasOwnProperty("eventlist")) {
            var event = ctr.eventlist;
        actionbutton(data,id,ctr, $("#"+id));
    }
    }
}
function pivotInsert(id, opt) {
    //edit
    var td = $("#" + id).find(".pvtTable>tr>td").filter(".pvtVal");
   
    switch (opt.type) {
        case "edit":
            var wth = $(td).last().css("width")
            var tarr = titlearray(id);
            $(td).each(function (i, k) {
                var val = $(k).text();
                var inp = $("<input />");
                inp.val(val);
                inp.css({ "width": wth });
                if(!opt.hasOwnProperty("editfield") | inputcheck($(k),opt.editfield)) {
                    $(k).empty();
                    $(k).append(inp);
                    inp.on("blur", function (e) {
                        var rttl = 0, cttl = 0, gttl = 0;
                        var cl = cellfinder($(k));
                        var r = "row" + cl.rindex, c = "col" + cl.cindex
                        $(this).parent().attr("data-value", $(this).val())
                        $([c, r, ""]).each(function (a, b) {
                            var cl = "";
                            if (b != "")
                                 cl = "." + b;
                            var rowsib = $("#" + id).find(".pvtVal" + cl);
                            var ttl = addttl(rowsib).toFixed(2);
                            if(b!="")
                            $("#" + id).find(".pvtTotal."+b.substring(0,3)+"Total[data-for='" + b+ "']").text(ttl);
                            else
                            $("#" + id).find(".pvtGrandTotal").text(ttl);
                        });
                      
                    });
                }
            });
            function addttl(cells) {
                var ttl = 0;
                $(cells).each(function (i, k) {
                   
                    var vv = $(k).attr("data-value");
                    if ($.isNumeric(vv))
                        ttl = ttl + parseFloat(vv);
                });
                if ($(".pvtAggregator").val() == "avg")
                    ttl = ttl / cells.length;
                return ttl;
            }
            function inputcheck(cell, editfield) {
                //editfield:[{fieldname:fieldvalue}]
                var c = cellfinder(cell);
                var ctitle = findtitle(tarr, c.rindex, c.cindex);
                var chkexist = false;
                $(editfield).each(function (i, k) {
                    var key = Object.keys(k);

                    if (ctitle[key] ==userfilter(k[key])) {
                        chkexist = true;
                        return false;
                    }
                });
                return chkexist;
            }
            break;
        case "cancel":
            $(td).each(function (i, k) {
                var val = $(k).find('input').val();
                $(k).empty();
                $(k).text(val);
            });
            break;
        case "title":
            var tarr = [];
            titlearray(id);
            break;
        case "save":
            save(id);
            break;
    }
    function titlearray(id) {
        //find colname,rowname by index
        var rtn,tarr=[], ttlarr = [];
        var cname = [];
        var tf = td.first();
        //find number of title colds,rows
        var trlist = $("#" + id).find(".pvtTable>tr");
        var rs, cs, tobj = {};
        $(trlist).each(function (i, k) {
            if ($(k).find('td').length > 0) {
                cs = i;
                rs = $(k).find('th').length
                return false;
            }
        });
        //tarr : col,row title array
        //tobj:type(col,row),index,name,list
       
        //row title
        $(trlist).each(function (i, k) {
            var colarr = [], tobj = {};
            if ($(k).find('td').length == 0) {
                tobj["type"] = "col";
                tobj["index"] = i;
                tobj["name"] = $(k).find(".pvtAxisLabel").text();
                var cvallist = $(k).find(".pvtColLabel");
                if (cvallist.length > 0) {
                    $(cvallist).each(function (a, b) {
                        var repeat = parseInt($(b).attr("colspan"));
                        var arr = Array(repeat).fill($(b).text());
                        colarr = $.merge(colarr, arr);
                    });
                    tobj["list"] = colarr;
                    tarr.push(tobj);
                }
            }
        });
       //col title
        var arr = [], rnum;
        var rtn = [];
        $(trlist).each(function (i, k) {
            if ($(k).find('td').length > 0) {
                var th = $(k).find(".pvtRowLabel")
                if (th.length > 0) {
                    insert(th);
                    var replace = [];
                    th.each(function (a, b) {
                        if ($(b).attr("rowspan") > 1) {
                            replace.push($(b).text());
                        }
                    });
                    if (replace.length > 0) {
                        var sindex = rs - replace.length - 1;
                        $(replace).each(function (a, b) {
                            arr.splice(a + sindex, 1, b);
                        });
                    }
                }
            }
        });
        //insert row title to tarr
        $($(".pvtRows").find(".pvtAttr")).each(function (i, k) {
            var tobj = {};
            tobj["type"] = "row";
            tobj["index"] = i;
            tobj["name"] = $(k).contents().get(0).nodeValue;
            var list = [];
            $(ttlarr).each(function (a, b) {
                list.push(b[i]);
            });
            tobj["list"] = list;
            tarr.push(tobj);
        });
        return tarr;

        
        function insert(tr) {
            var narr = [];
            var num = rs - tr.length
            if (num > 0)
                for (var i = 0; i < num; i++) {
                    if (arr.length > i)
                        narr.push(arr[i])
                }
            tr.each(function (a, b) {
                narr.push($(b).text());
            });
            ttlarr.push(narr)
        }
       
       
    }
    function findtitle(tarr, rindex, cindex) {
        rtn = {};
        $(tarr).each(function (i, k) {
            switch (k.type) {
                case "col":
                    rtn[k.name] = k.list[cindex]
                    break;
                case "row":
                    rtn[k.name] = k.list[rindex]
                    break;
            }
        })
        return rtn;
    }
    function cellfinder(cell){
        var rtn={};
        var cls = cell.attr("class").split(" ");
        var rix = cls[1].replace("row","");
        var cix = cls[2].replace("col", "");
        if (rix != "") rix = parseInt(rix);
        if (cix != "") cix = parseInt(cix);
        rtn.rindex=rix;
        rtn.cindex=cix;
        return rtn;
    }
    function save(id) {
        //input find
        var arrout = [], set = {};
        var tarr = titlearray(id);//pivotInsert(id, { type: "title" });
        var inplist = $("#" + id).find(".pvtVal").find("input").parent();
        $(inplist).each(function (i, k) {
          var c=cellfinder($(k));
            set = findtitle(tarr, c.rindex, c.cindex)
            set[$(".pvtAttrDropdown").val()]=$(k).find("input").val();
            arrout.push(set);
        });
        return arrout;
    }
    switch (opt.type) {
        case "save":
            return save(id);
            break;
        case "title":
            return titlearray(id);
            break;
    }
}
function editablefield(sp) {
    var srcdata = JSON.parse($("#spdlist").text());
    var fieldlist = [], srcdt = [];
    if (typeof srcdata != "undefined" && srcdata != "") srcdt = srcdata[0];

    var field = ["", "code", "name"];
    var format1 = ["yyyy-MM-dd", "yy-MM-dd", "yyyy-MM-dd hh:mm:ss"];
    var format2 = ["0", "00", "0.00"];
    cssInsert("multiple-select-css", "/js2/jquery-multiple-select/multiple-select.css");
    jscriptInsert("multiple-select-js", "/js2/jquery-multiple-select/jquery.multiple.select.js");
    styleInsert("li", "li{margin-bottom:0 !important;}");
    var data = [];
    var head = [makeCtr(["span", "Field", , , ]), makeCtr(["span", "Value", , , ])];
    data.push(head);
    $.each(srcdt, function (fname, value) {
        //string인 경우
        var valuelist = [], format = "";
        //fixed values:string, time type
        var fixedStr = ["$comp", "$name", "$id", "$boss", "$division", "$position"];
        var fixedPeriod = ["$thisYear", "$thisQuarter", "$thisMonth", "$thisWeek", "$Today", "$Yesterday", "$Tomorrow"];
        var ftype = fieldTypeFind(srcdata, fname);
        if (ftype.type == "string") valuelist = ftype.valuelist.concat(fixedStr);
        if (ftype.type == "datetime") format = makeCtr(["select", "N/A;" + format1.join(";"), "selFormat" + fname, "width:60px", ]);
        var valfield = makeFilterRow("", fname, ftype.type, valuelist);
        var fn = fname;
        if (fname.length > 25) fn = fname.substring(0, 25) + "...";
        var fname1 = "<span title=" + fname + ">" + fn + "</span>";
        var cb = false, displayname = "";
        var row = [fname1, valfield];
        data.push(row);
    });

    var tb = makeTable("pivot123", data, "general");
    setTimeout(function () {
        $(".multiselect").multipleSelect({
            width: 150
            , styler: function (value) {
                if ($.inArray(value, ["$comp", "$name", "$id", "$boss", "$division", "$position"]) > -1) {
                    return 'background-color: #F7F3F7; color: #181C18;';
                }
            }
        });
        var field = sp.text();
        if (field != "" && field!="edit all") {
            field = JSON.parse(field);
            $(field).each(function (i, k) {
                $("#sel" + k[0]).multipleSelect("setSelects", k[1]);
            })
        }
        $("input[id^='date_']").datepicker({ dateFormat: 'yy-mm-dd' });
    }, 500);

    var dv = $("<div/>");
    dv.append(tb);
    dv.dialog({
        width: '300',
        minHeight: '400',
        autoResize: false,
        appendTo: "#dvtable",
        modal: false,
        autoOpen: true,
        title: "Edit Field Selection",
        position: top,
        stack: false,
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
             {
                 text: "Clear",
                 icons: {
                     primary: "ui-icon-trash"
                 },
                 click: function () {
                     $(this).dialog('destroy').remove();
                     sp.text("edit all");
                 }
             },
        {
            text: "Apply",
            icons: {
                primary: "ui-icon-check"
            },
            click: function () {
                var arr1 = saveTable("pivot123"), arr = [];
                $(arr1).each(function (i, k) {
                    if (typeof k[1] == "object" && k[1].length > 0)
                        arr.push([k[0], k[1]]);
                });
                $(this).dialog('destroy').remove();
                sp.text(JSON.stringify(arr));
            }
        },
        {
            text: "Close",
            icons: {
                primary: "ui-icon-close"
            },
            click: function () {
                $(this).dialog('destroy').remove();
            }
        }
        ]
    });
    function eedit(ed) {
        var rtn = ed;
        if (ed.length > 20)
            rtn = ed.substring(0, 20) + "...";
        return rtn;
    }
}
function expandcollapsemake(element, container) {
    var bar = $("<div style='text-align:right;height:28px;padding:8px 8px 0 0;margin-bottom:5px;' />");//margin-bottom:5px;border-bottom:1px #BABABA solid; class='ui-widget-header'
    var rebtn = $("<i id='irebtn' class='imdim fa fa-search-plus fa-lg' />");
    bar.append(rebtn);
    rebtn.click(function () {
        expandcollapsediv(element, container);
    });
    return bar;
}
function expandcollapsediv(element,container) {
    var wth = element.parent().width();
    if (element.width() == $(window).width()) {
        container.removeAttr("style");
        element.removeAttr("style");
        container.attr("style", cstyval);
        element.attr("style", styval);
        $("#irebtn").removeClass("fa-times-circle").addClass("fa-search-plus");
        $("#irebtn").parent().removeClass("ui-widget-header")
    }  
    else {
        //container move top:0,left:0,position:absolute
        styval = element.attr("style");
        cstyval = container.attr("style");
        element.removeAttr("style");
        element.css({ position: "absolute", left: 0, top: 0, width: $(window).width(), height: $(document).height(), "background-color": "white", "z-index": 10000 });
        var sty = { position: "absolute", left: -5, top: 0 };
        if (container.attr("id") == "dveditback")
            sty.top = -25;
        container.css(sty);
        $("#irebtn").removeClass("fa-search-plus").addClass("fa-times-circle");
        $("#irebtn").parent().addClass("ui-widget-header");
    }

}
function pivotEdit(id,options) {
    var cstyle, arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type;

    if (typeof options != "undefined") {
        if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (options.hasOwnProperty('type')) type = options.type
        if (options.hasOwnProperty('gdt')) gdt = options.gdt;
        if (options.hasOwnProperty('ctrid')) id = options.ctrid;
        if (options.hasOwnProperty('code')) code = options.code;
        if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
        if (options.hasOwnProperty('archive')) archive = options.archive;
        if (src == "temp") {
            //if(!options.hasOwnProperty("archive"){

            //}
        }
    }
    else {
        gdt = editDataFind(id, options);
        options = editoptionmake("pivot", id, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
    }
    if (typeof gdt != "undefined") {
        //common thru type
        if (gdt.hasOwnProperty("code")) code = gdt.code;
        if (gdt.hasOwnProperty("name")) name = gdt.name;
        if (gdt.hasOwnProperty("desc")) desc = gdt.desc;
        if (gdt.hasOwnProperty("archive")) {
            options.archive = archive;
            archive = gdt.archive;
        }
    }
    var conarr = {};
    conarr.id = "dveditback";// "container" + id;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting", "Action","Data","Style"];
    var content = [];
    content.push("<table width='100%'><tr><td style='width:100px;vertical-align:top;'><div id='dvtable' ></div></td>" +
        "<td  style='vertical-align:top;padding-left:5px;'><div id='pivotpreview' class='pivot'/></td></tr><tr><td id='tbbtn' colspan='2'></td></tr></table>");
    //2nd Tab action
    content.push("<div id='dndcontain_pivot' class='dndcontain'  />");
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    if ($.inArray(src, ["list", "externalsavelist"]) > -1) {
        archivegdtReload(tab);
        funStop();
    }
    else {
        //container create
        var conarr = {};
        conarr.id = "dveditback";
        conarr.body = tab;
        var container = makeContainer(conarr);
    }
    $("#tbbtn").append(editbutton(options));
  
    pivotEditTable(id, gdt);
    var action = true;
    //tabclick event
    var tabb = $('#' + tabarr.id),first=true,dtfirst=true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    var combine = {};
                    var setting = {}
                    var jqset = saveTable("tes14");
                    $.each(jqset, function (i, k) {
                        var name = k[0].toLowerCase();
                        switch (typeof k[1]) {
                            case "object":
                                setting[name] = JSON.stringify(k[1]);
                                break;
                            case "string":
                                switch (name) {
                                    case "numbergrp":
                                        setting[name] = k[1] + ";" + k[2];
                                        break;
                                    default:
                                        setting[name] = k[1];
                                        break;
                                }
                                break;
                            case "boolean":
                                if (k[1])
                                    setting[name] = k[2];
                                break;
                                break;
                        }
                    });

                    combine.setting = setting;
                    combine.data = JSON.parse($("#spdataajax").text());
                    $("#tes14").remove();
                    pivotEditTable(id, combine);
                    pivotInit("pivotpreview", combine);
                    var twth=$("#tab-Contain").width();
                    var lwth = $("#pivotpreview").closest("td").siblings().width();
                    $("#pivotpreview").css({ width: twth - lwth-50 });
                    break;
                case 1:
                    if (action ) {
                        dndboxInit(gdt,"pivot");
                        action = false;
                    }
                    break;
                case 2:
                    if (dtfirst) {
                        dataTabClick(id, options);
                       // dtfirst = false;
                    }
                    break;
                case 3:
                    if (first)
                        cssEditInit("Style", id, "pivot");
                    first = false;
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['pivotedit', 'action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'pivotedit');
    helpinsert();
    //button init
    $("input[type='button']").button();
    $("button").button();
    //remove padding of setting tab
    $("#dvtable").parent().closest("div").css({ "padding": "10px 0 0 0" });
    setTimeout(function () { pivotInit("pivotpreview", gdt); }, 1000);
    $("input[value='Save']").click(function () {
        pivotEditSave(id, options);
    });
}
function pivotEditTable(id, gdt) {
    pivotEditTable.datasrc = datasrc;
 
    if ($("#spdataajax").length == 0) {
        if (typeof gdt != "undefined" && gdt != "" && gdt.hasOwnProperty("data")) {
            jsonReadAjax("imcdata", "", "code", gdt.data.datacode, pivotEditTable.datasrc, [id, gdt]);
        }
        //else
        //    datasrc("", id, gdt);
    }
    else {
        var data = JSON.parse($("#spdataajax").text());
        datasrc(data, id, gdt);
    }

    function datasrc(data, id, gdt) {
       
        jsonQueryCheck(data, pivotEditTable.datasrc, [id, gdt]);
        var rows = "", cols = "", vals = "", render = "", hidden = '', aggregate = "", rendername = "", derieveddate = "", numbergrp = "",editable="",editable1="",num="", flist = [];
      if (data != ""){
          var dt = datalistreturn(data);
              if (dt.length > 0) {
                  var fieldlist = Object.keys(dt[0]);
                  flist = fieldlist.join(";");
              }
              $("#spdataajax").text(JSON.stringify(data));
              $("#spdlist").text(JSON.stringify(dt));
          }
          else
              return false;

        if (typeof gdt != "undefined") {
            var st = gdt.setting;
                //if (st.hasOwnProperty("rows")) rows = st.rows;
                //if (st.hasOwnProperty("cols")) cols = st.cols;
                //if (st.hasOwnProperty("vals")) vals = st.vals;
                if (st.hasOwnProperty("render")) render = st.render;
                if (st.hasOwnProperty("hiddenfield")) hidden = st.hiddenfield;
                //if (st.aggregate != "") aggregate = st.aggregate;
                if (st.hasOwnProperty("rendername")) rendername = st.rendername;
                if (st.hasOwnProperty("derieveddate")) derieveddate = st.derieveddate;
                if (st.hasOwnProperty("editable")) editable = st.editable;
                if (st.hasOwnProperty("numbergrp")) { 
                    var numgrp = st.numbergrp;
                    if (numgrp != "") {
                        numgrp = numgrp.split(";");
                        numbergrp = numgrp[0];
                        num = numgrp[1];
                    }
                }

            
        }
        var agg = "Count;Count Unique Values;List Unique Values;Sum;Integer Sum;Average;Minimum;Maximum;Sum over Sum;80% Upper Bound;80% Lower Bound;Sum as Fraction of Total;Sum as Fraction of Rows;Sum as Fraction of Columns;Count as Fraction of Total;Count as Fraction of Rows;Count as Fraction of Columns";
        var rend = "Table;Table Barchart;Heatmap;Row Heatmap;Col Heatmap";
        $.pivotUtilities.renderers,
                       $.pivotUtilities.c3_renderers,
                       $.pivotUtilities.export_renderers
        var data1 = [
            [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
            , ["hiddenField", makeCtr(["select:multiselect", flist, "selhidden", "inp", ])]
            , ["derievedDate", makeCtr(["select:multiselect", "year;month;day;month name;day name", "selderieveddate", "inp", ])]
            , ["NumberGrp", makeCtr(["select", "select ,;" + flist, "selnumber", "height:26px;width:90px", ]) + "&nbsp;" + makeCtr(["input", num, "inpNumber", "width:30px", ])]
            , ["Editable", makeCtr(["input:checkbox", , "cbeditable", "", ]) + makeCtr(["span", editable, "dveditable", "qtipedit|display:none; overflow:hidden;text-overflow:ellipsis;width:50px", "onclick:editablefield($(this))"])]
        ]
        var tb = makeTable("tes14", data1, "general");
        var foot = ['<input type="button" value="reload"  style="padding:0 3px 0 3px;margin:3px;" id="reloadpivot"/>|{"colspan":"2","style":"text-align:right;"}'];
        var tb1 = appendFooter(tb, foot);

        $("#dvtable").append(tb1);
        $("#inpNumber").attr("placeholder", "Number interval");
        setTimeout(function () {
            $(".multiselect").multipleSelect({
                width: 150
            });
            if (hidden != "") $("#selhidden").multipleSelect("setSelects", JSON.parse(hidden));
            if (numbergrp != "") $("#selnumber").val(numbergrp);
            if (derieveddate != "") $("#selderieveddate").multipleSelect("setSelects", JSON.parse(derieveddate));
            $("#reloadpivot").click(function () {
                pivotEditTableReload();
            });
            if (editable != "") {
                $("#cbeditable").attr('checked', true);//.trigger('change');
                $("#dveditable").text(editable).show()
                //create edit,cancel,save action
                //actioninsert();
            }
           // $("#dveditable.qtipedit")
            $("#cbeditable").on("change", function () {
                switch ($(this).is(":checked")) {
                    case true:
                        $(this).next().show();
                        if ($(this).next().text() == "") {
                            $(this).next().text("edit all");
                        };
                     actioninsert();
                        break;
                    case false:
                        $(this).next().hide();
                        dndautoInsert(false);
                         action = true;
                        break;
                }
            })
            $("#dveditable").css({ width: $("#dveditable").closest("td").css("width")})
           $("input[type='button']").button();
        }, 1000);
        function actioninsert() {
            var insarr = [], cd = "bt" + idMake();
            insarr.push({ buttonname: "Edit", display: "show", script: "pivotInsert('$curid',{type:'edit'});$(this).hide();$('#" + cd + "_2').show();$('#" + cd + "_3').show();" });
            insarr.push({ buttonname: "Save", display: "hide", command: "save" });
            insarr.push({ buttonname: "Cancel", display: "hide", script: "pivotInsert('$curid',{type:'cancel'});$(this).hide();$('#" + cd + "_1').show();$('#" + cd + "_2').hide();" });
            dndautoInsert(true, cd, insarr, data, "pivot");
            action = false;
        }
    }
    

}
function pivotEditTableReload() {
    var d1 = $("#spdlist").text();
    var list = [ "selhidden","selnumber"];
    if (d1 != "") {
        var dt = JSON.parse(d1);
        var items = Object.keys(dt[0]);
        $.each(list, function (j, k) {
            $.each(items, function (i, item) {
                $('#' + k).append($('<option>', {
                    value: item,
                    text: item
                }));
            });
            if (k != "selnumber") {
                $("#" + k).multipleSelect({ width: 150 });
                $("#" + k).removeClass("inp").addClass("multiselect");
            }
        });
        var fixlist = [];
        fixlist.push({ id: "selderieveddate", optlist: "year;month;day;month name;day name" });
       // fixlist.push({ id: "selrender", optlist: "default,renderers;c3,c3_renderers;d3,d3_renderers;export,export_renderers" });
        $(fixlist).each(function (i, k) {
            var parent = $("#" + k.id).parent();
            var sel = makeCtr(["select:multiselect", k.optlist, k.id, "height:26px;", ]);
            parent.empty();
            parent.append($(sel));
        });
        $(".multiselect").multipleSelect({
            width: 150
        });
    }
    else
        sweetmsgautoclose("Ooops!!", "No data assigned. ")
}
function pivotEditSave(id, options) {
    var setting = {},  src = "";
    if (options.hasOwnProperty("src"))
        src = options.src;
    var combine = saveData(true);

    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = id;
    }

    var setting = {}
    var jqset = saveTable("tes14");
    $.each(jqset, function (i, k) {
        var name=k[0].toLowerCase();
        switch (typeof k[1]) {
            case "object":
                setting[name] = JSON.stringify(k[1]);
                break;
            case "string":
                switch (name) {
                    case "numbergrp":
                        setting[name] = k[1] + ";" + k[2];
                        break;
                    default:
                        setting[name] = k[1];
                        break;
                }
                break;
            case "boolean":
                if(k[1])
                setting[name] = k[2];
                break;
                break;
        }
    });
    //setting from pivottable
    setting.aggregate = $(".pvtAggregator").val();
    setting.rendername = $(".pvtRenderer").val();
    setting.cols=makeArray($(".pvtCols").find("span[class='pvtAttr']"));
    setting.rows=makeArray($(".pvtRows").find("span[class='pvtAttr']"));
    setting.unused = makeArray($(".pvtUnused").find("span[class='pvtAttr']"));
    if ($(".pvtAttrDropdown").length > 0) {
        var val1 = [];
        $($(".pvtAttrDropdown")).each(function (i, k) { val1.push($(k).val()) });
        setting.vals = JSON.stringify(val1);
    }
   
    combine.setting = setting;
    if ($(".dnd").length > 0)
    combine.eventlist = dndevtlist("pivot");
    if (combine != null) {
        combine.ctrtype = 'pivot';
        commonsave(id, src, combine, options);
        
    }
    function makeArray(list){
        var rtn=[];
        $(list).each(function(i,k){
            rtn.push($(k).contents().get(0).nodeValue);
        });
        return JSON.stringify(rtn);
    }
}
//#endregion

//#region jqGrid
//#region jqgrid execute
var currPage = "1",checkpage = false;
function RenderGrid(gridid, gt, comp, model) {
    jQuery("#" + gridid).jqGrid({
        colNames: gt.colNames,
        colModel: gt.colModel,
        datatype: "local",
        data: gt.setting.data,
        height: "auto",
        gridview: true,
        hoverrows: true,
        autowidth: true,
        rowNum: gt.setting.rowNum,
        rowList: [10, 20, 30],
        pager: gt.setting.pager,
        toolbarfilter: true,
        //                loadtext: "Loading..!!.",
        //                emptyrecords: "No records to view",
        viewrecords: true,
        multiselect: gt.setting.multiselect,
        grouping: gt.setting.group,
        groupingView: gt.setting.grpview,
        footerrow: true,
        userDataOnFooter: true,
        onPaging: function (action) {
            if (currPage != $('#' + gridid).getGridParam('page'))
                checkpage = true;
            currPage = $('#' + gridid).getGridParam('page');
        },
        onClickGroup: function (hid, collapsed) {
            if (!checkpage)//paging이 아닌 경우만실행
                expandcollapseSave(gridid,hid, collapsed);
        },
        gridComplete: function () {
            expandcollapseApply(gridid);
            jqRowCustomButton(gridid);
            checkpage = false;
            jqPagerSaveAllToggle('');
        },
        caption: gt.setting.cap,
        autowidth: true,
        editurl: "clientArray"
    });

//    jQuery("#jqgrid").jqGrid('setCaption',"New Caption");
    jQuery("#" + gridid).jqGrid('sortableRows');
    jQuery("#" + gridid).jqGrid('setGroupHeaders', {
        useColSpanStyle: gt.colspan,
        groupHeaders: gt.colhead
    });

    jQuery("#chngroup").change(function () {
        var vl = $(this).val();
        if (vl) {
            if (vl == "clear") {
                jQuery("#"+gridid).jqGrid('groupingRemove', true);
            } else {
                jQuery("#" + gridid).jqGrid('groupingGroupBy', vl);
            }
        }
    });

    $('.pdiv').resize(function () {
        $("#"+gridid).jqGrid('setGridWidth', $('.pdiv').width() - 5, true)
    }).trigger('resize');
    /* Add tooltips */
    jQuery('.navtable .ui-pg-button').tooltip({
        container: 'body'
    });

    jqPagerCustomButton(gridid, gt.setting.pager, comp, model);
    //jqPagerAllRowAction(gridid,type);
    jqPagerAdd(gridid, gt.setting.pager, [true, true, true,false,false])
    jqRowCustomButton(gridid);
    expandCollapseAll(gridid);

//#endregion

//여기까지 RenderGrid() block
}
function jqgridInit(id, options, callback, param) {
    //var gridid = "jqac0";
    var gdt, event,datacode = "";
    jqgridInit.creategrid = creategrid;
    
    var contain = $("#" + id);
    //contain.empty();
    var tb=$("<table id='jq" + id + "'/>");
    var pg=$("<div id='pg" + id + "'/>");
    if (typeof options != "undefined") {
        if (options.hasOwnProperty("contain")) {
            contain = options.contain;
            //contain.empty();
            tb = $("<table id='jq1" + id + "'/>");
            pg = $("<div id='pg1" + id + "'/>");
        }
        if (options.hasOwnProperty("gdt")) gdt = options.gdt;
    }
    contain.append(tb).append(tb.next());
    if (typeof gdt == "undefined") {
        if ($("#archivegdt").text() != "")
            gdt = JSON.parse($("#archivegdt").text());
        else
            gdt = readdata(id, "gdt");
    }
    if (typeof gdt != "undefined") {
        if (gdt.hasOwnProperty("eventlist")) event = gdt.eventlist;
        if (gdt.hasOwnProperty("data")) {
            datacode = gdt.data.datacode;
            filter = findfilter(gdt.data);;
        }
    }
    tb.jqGrid("GridUnload");
    tb.css("margin", "5px 0 0 0");
    if(tb.parent().css("width")=="")
    tb.parent().css("width", "100%");
    styleInsert("jqgrid_style1", ".ui-jqgrid .ui-jqgrid-bdiv { position: relative; margin: 0em; padding:0; overflow-x:hidden; overflow-y:auto; text-align:left;}");
    var gridid = tb.attr('id');
    var pagerid =  tb.next().attr("id");
    if (typeof (gdt) != "undefined" && gdt.hasOwnProperty('setting') && gdt.hasOwnProperty("data")) {
        var data = gdt.data,datacode;
        if (data.hasOwnProperty("code")) datacode = data.code;
        else if (data.hasOwnProperty("datacode")) datacode = data.datacode;
        jsonReadAjax("imcdata", "", "code", datacode, jqgridInit.creategrid, [tb,gdt,callback,param,filter]);
    }
    else
        RenderGridBlank(gridid, pagerid);
    function creategrid(data, tb,ctr,callback,param,filter) {
        var dt = datalistreturn(data);
        if (ctr.hasOwnProperty('data')) 
            dt = applyFilter(dt, ctr.data.filter);
        if (filter != "")
            dt = applyFilter(dt, filter);
      
        if (ctr.setting.hasOwnProperty('data'))
            ctr.setting.data = JSON.stringify(dt);
        else
            ctr.setting = $.extend({ "data": JSON.stringify(dt) }, ctr.setting);

        var setting = ctr.setting;
        setting.colNames = ctr.colNames;
        setting.colModel = ctr.colModel;
        setting.data = dt;
        setting.pager = "#" + setting.pager.replace("#","");
        //setting.width= null;
        //setting.shrinkToFit = false;
       // setting.autowidth = true;
        var setlist = Object.keys(setting);
        $(setlist).each(function (i, k) {
            if (setting[k] == "")
                delete setting[k];
        })
        tb.jqGrid(setting);
        var gridid = tb.attr("id");
        var pagerid = tb.next().attr("id");
        var wth=$('#gbox_' + gridid).parent().width();
        tb.setGridWidth(wth);
        if (ctr.hasOwnProperty("event"))
            jqEventInit(gridid, pagerid, ctr.event);
        if (typeof callback === "function") {
            callbackexewithparam(callback, param);
        }
    }
   
}
function jqEventInit(gridid,pagerid,event) {
    //외부function
    //var ctr = selectimctable(menuid, subid, gridid),
    var func = [], onclick = [], remoteUpdate = [], localUpdate = [], opt = {};
    //pager
    if (event.hasOwnProperty("pager")) {
        //select pager func & onclick
        var flist = ["edit", "add", "del", "search", "refresh"];
        var sel = [];
        $(event.pager).each(function (i, k) {
            sel.push(k.title);
        });
        $(flist).each(function (i, k) {
            if ($.inArray(k, missingArray(flist, sel)) == -1) {
                func.push(true);
                $(event.pager).each(function (j, l) {
                    if (k == l.title) {
                        remoteUpdate.push(l.remoteUpdate);
                        localUpdate.push(l.localUpdate);
                    }
                });
            }
            else {
                func.push(false);
                remoteUpdate.push("");
                localUpdate.push("");
            }
        });
        if (event.hasOwnProperty("setting")) {
            if (event.setting.inline) {
                jqPagerAdd(gridid, pagerid, [false, false, false, false, false], []);
                var inlineparams = {
                    add: func[1],
                    edit: func[0],
                    del: func[2],
                    save: true,
                    cancel: true
                };
                $("#" + gridid).jqGrid('inlineNav', "#" + pagerid, inlineparams);
            }
            else {
                if (func.length > 0)
                    jqPagerAdd(gridid, pagerid, func,localUpdate,remoteUpdate);
            }
        }
    }
    //custom pager
    if (event.hasOwnProperty("pagercustom")) {
        if(event.pagercustom.length>0)
        $(event.pagercustom).each(function (i, k) {
            jqPagerCustom(gridid,pagerid,k);
        });
    }
    //custom row
    if (event.hasOwnProperty("row")) {
        if (event.row.length > 0)
        jqRowCustom(gridid, event.setting.addedcolumn ,event.row);
    }
}
function RenderGridBlank(gridid, pagerid) {
    $("#" + gridid).jqGrid(
    { colNames: ["noList"], colModel: [{ name: "noList"}], pager: "#" + pagerid, width:null }
    );
    $("#" + gridid).parents('div.ui-jqgrid-bdiv').css("height", "10px");
    jqPagerAdd(gridid, pagerid, [false, false, false, false, false]);
    jqPagerCustomButton(gridid, pagerid, "1", "no");
}
function jqEditAjaxSave(jqname, jqsetting) {
    imcsetting("imctable", jqname, jqsetting);
    jqgridAjaxUpdate(jqname, JSON.stringify(jqsetting));
}
function jqgridAjaxDel(name) {
    var param = "{'name':'" + name + "'}";
    AjaxGeneral("/WebService.asmx/jqgridDataDel", param);
}
function jqAuto(gridid, pagerid, datasrc,opt) {
    //gridid,pagerid,data만으로 구성되는 data display용 jqgrid
    $("#" + gridid).jqGrid("GridUnload");
    if (datasrc.length == 0) {
        RenderGridBlank(gridid, pagerid);
        return false;
    }
    var colmodel = []; var colname = [];
    $.each(datasrc[0], function (fname, value) {
        colname.push(fname);
        colmodel.push({ name: fname });
    });
    //opt:option 추가 사항
    var options={
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: datasrc,
        height: "auto",
        autowidth: true,
        rowNum: 5,
        rowList: [5,10, 20, 30],
        pager: "#" + pagerid,
        //caption: "Data View",
        sortable: true
    };

    if(typeof(opt)!="undefined" && opt !="")
    $.each(opt,function(code,val){
        options[code]=eval(val);
    });
    jQuery("#" + gridid).jqGrid(options);
}
//#endregion

//#region jqGrid 외부function
var exp = [];
function expandcollapseSave(gridid, hid, collapsed) {
    $("tr[id^='" + gridid + "ghead_']").each(function () {
        var status = {};
        if ($(this).attr("id") == hid) {
            var name = $(this).find('span').next("b").text().substring(0, 5);
            for (i in exp) {
                if (exp[i]["name"] == name)
                    exp.splice(i, 1);
            }

            status["name"] = name;
            status["st"] = collapsed;
            exp.push(status);
        }
    });
}
function expandCollapseAll(gridid) {
    //maintain group expansion
    if ($('.ui-icon-circlesmall-minus').length == 0) {
        $("#" + gridid + " .ui-icon-circlesmall-plus").trigger("click");
    }
    else {
        $("#" + gridid + " .ui-icon-circlesmall-minus").trigger("click");
    }
    //expandcollapseSave();
}
function expandcollapseApply(gridid) {
    $("tr[id^='" + gridid + "ghead_']").each(function () {
        var st = false;
        if ($(this).next("tr").css("display") == "none") {
            st = true;
        }
        for (i in exp) {
            if (exp[i].name == $(this).find('span').next("b").text().substring(0, 5) && exp[i].st != st) {
                jQuery('#' + gridid).jqGrid('groupingToggle', $(this).attr("id"))
            }
        }

    });
}
function jqGridPaging(gridid) {
    if (currPage != $('#' + gridid).getGridParam('page'))
        checkpage = true;
    currPage = $('#' + gridid).getGridParam('page');
}
function testt(postdata) {
    console.log(postdata);
}
function localUpdate(gridid, keyarr, dtarr) {

//    if (type == "string") {
//        keyarr = JSON.parse(keyarr);
//        dtarr = JSON.parse(dtarr);
//    }
    console.log(gridid, keyarr, dtarr);
    var datacode = selectimctable(menuid, subid, gridid).datacode;
    var data = selectimcdata("imcdata", datacode);

    if (keyarr != "" && keyarr.length > 0) {
        $(data.datalist).each(function (i, k) {
            var cnt = 0;
            $(keyarr).each(function (j, l) {
                if (k[l.name] == l.value) {
                    cnt++;
                }
            });
            if (cnt == keyarr.length) {
                if (typeof dtarr != "undefined" && dtarr != "")
                    data.datalist.splice(i, 1, dtarr); //update
                else
                    data.datalist.splice(i, 1); //delete
            }
        });
    }
    else {
        data.datalist.push(dtarr);      //insert
        console.log("insert")
    }
    updateimcdata(data);
    setTimeout(function () {
       // $("#" + gridid).jqGrid("GridUnload");
        jqgridInit(gridid);
    }, 0);
}
function jqPagerAdd(gridid, pagerid, btnarr, localarr,remotearr) {
    var keylist = [], key = {}, kc = [];
    var ctr = selectimctable(menuid, subid, gridid);
    if(typeof(ctr)!="undefined")
    var data = selectimcdata("imcdata", ctr.datacode);

    if(ctr !=null)
        if (ctr.hasOwnProperty("event") && ctr.event.hasOwnProperty("setting")
            && ctr.event.setting.hasOwnProperty("keycolumn") && ctr.event.setting.keycolumn != "undefined") {
        kc = data.keycode;
    }
    //onclickSubmit시 발생하는 function 내역
    var set = { closeOnEscape: true, closeAfterEdit: true, reloadAfterSubmit: true
    , drag: true, jqModal: true, url: 'clientArray',savekey:[true,13]
    };
    jQuery("#" + gridid).jqGrid('navGrid', "#" + pagerid, {
        edit: btnarr[0],
        add: btnarr[1],
        del: btnarr[2],
        search: btnarr[3],
        refresh: btnarr[4]
    },
    $.extend(set,
    {//edit
        editCaption: "Edit Comment", edittext: "Edit", recreateForm: false,
        onclickSubmit: function (params, postdata) {

            //            if (typeof funcarr != "undefined" && funcarr[0] != "" && funcarr[0] != null)
            //                eval(funcarr[0]);
            if (typeof localarr != "undefined" && localarr[0] == "Yes") {

                $(kc).each(function (i, k) {
                    key.name = k;
                    key.value = postdata[k];
                    keylist.push(key);
                });

                delete postdata[gridid + "_id"];
                localUpdate(gridid, keylist, postdata);
            }
            if (typeof remotearr != "undefined" && remotearr[0] == "Yes") {
                remoteUpdate(gridid, "update", postdata);
            }
        }
    }),

    {//Add
        addCaption: "Add Comment", closeOnEscape: true, closeAfterAdd: true, reloadAfterSubmit: true
        , jqModal: true, bottominfo: "Fields marked with (*) are required", url: 'clientArray',
        onclickSubmit: function (response, postdata) {
            console.log(postdata, gridid, localarr)

            if (typeof localarr != "undefined" && localarr[1] == "Yes") {
                //                 $(kc).each(function (i, k) {
                //                    key.name=k;
                //                    key.value= postdata[k];
                //                    keylist.push(key);
                //                });
                delete postdata[gridid + "_id"];
                localUpdate(gridid, "", postdata);
            }
            if (typeof remotearr != "undefined" && remotearr[1] == "Yes") {
                remoteUpdate(gridid, "insert", postdata);
            }
        }
    },
    {//Delete
        url: "clientArray", caption: "Delete Comment", closeOnEscape: true, reloadAfterSubmit: true, jqModal: true,
        onclickSubmit: function (response, postdata) {
            if (postdata != null) {
                var rowdata = $('#' + gridid).jqGrid('getRowData', postdata);
                if (typeof localarr != "undefined" && localarr[2] == "Yes") {
                    $(kc).each(function (i, k) {
                        key.name = k;
                        key.value = rowdata[k];
                        keylist.push(key);
                    });
                    localUpdate(gridid, keylist);
                }
                if (typeof remotearr != "undefined" && remotearr[2] == "Yes") {
                    remoteUpdate(gridid, "delete", rowdata);
                    //console.log(gridid,rowdata)
                }
            }
        }
    }
    );
}
function GetResponseData(resp) {
    var json = resp.responseText;  //format is {errno:(int),errmsg:"",query:""}
    var result = eval("(" + json + ")");
    return [result.errno, result.error, ""];
}
function jqPagerCustomExpand(gridid, pagerid) {
    //pager custom button:expand/collapse all
    $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
        caption: "",
        buttonicon: "ui-icon-carat-2-n-s",
        onClickButton: function () {
            expandCollapseAll(gridid);
        },
        position: "last"
    });
}
function jqPagerCustom(gridid, pagerid, options) {
    //#region  options
    /*
    {
        caption: "",
        buttonicon: "ui-icon-wrench",
        onClickButton: function () {
            jqEdit(gridid,pagerid);
        },
        position: "last"
    }
    */
    //#endregion
    var jq = $("#" + gridid), pg = "#" + pagerid;
    var set={};
    set.caption=options.title;
    set.buttonicon=options.icon;
    set.onClickButton = (function () { eval(options.onclick); });
    set.position=options.position;
    jq.jqGrid("navButtonAdd", pg, set);
}
function jqPagerCustomButton(gridid, pagerid,comp,model) {
    if (comp == "1" && model !="yes") {

        //pager custom button:self setting
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption: "",
            buttonicon: "ui-icon-wrench",
            onClickButton: function () {
                jqEdit(gridid.replace("jq",""));
            },
            position: "last"
            //'cloneToTop':true
        });
    }
    if (model == "yes") {
        //edit all at once
        $("#ui-icon-calculator").remove();
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption: "",
            buttonicon: "ui-icon-calculator",
            id: "ui-icon-calculator",
            onClickButton: function () {
                jqPagerAllRowAction(gridid, 'edit');

                if ($('#' + pagerid + ' :has(".ui-icon-disk")').length == 0) {
                    //save all at once
                    $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
                        caption: "",
                        buttonicon: "ui-icon-disk",
                        onClickButton: function () {
                            jqPagerAllRowAction(gridid, 'save');
                        },
                        position: "last"
                    });
                    //cancel edit all at once
                    $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
                        caption: "",
                        buttonicon: "ui-icon-arrowreturn-1-w",
                        onClickButton: function () {
                            jqPagerAllRowAction(gridid, 'restore');
                        },
                        position: "last"
                    });
                }
            },
            position: "last"
        });

    }
}
function jqPagerSaveAllToggle(type) {
    //editAll<->saveAll/restoreAll toggle
    switch (type) {
        case "edit":
            $('.ui-icon-calculator').hide();
            $('.ui-icon-arrowreturn-1-w').show();
            $('.ui-icon-disk').show();
            break;
        default:
            $('.ui-icon-calculator').show();
            $('.ui-icon-arrowreturn-1-w').hide();
            $('.ui-icon-disk').hide();
            break;
    }
}
function jqPagerAllRowAction(gridid, type) {
    var ids = $("#" + gridid).getDataIDs();
    for (var i = 0; i < ids.length; i++) {
        switch (type) {
            case "edit":
                $("#" + gridid).editRow(ids[i], true);
                break;
            case "restore":
                $("#" + gridid).restoreRow(ids[i], true);
                break;
            case "save":
                $("#" + gridid).saveRow(ids[i], true);
                break;
        }
    };
    jqPagerSaveAllToggle(type);
    if (type == "save") {
        if (gridid == "jqgridedit")
            jqEditSave();
        else
            jqCreateColmodel(gridid);
    }

}
function jqRowCustomButton(gridid) {
    var jq = $("#" + gridid);
    var ids = jq.jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var cl = ids[i];
        var dt = jq.jqGrid('getRowData', cl);
        be = "<span class='ui-icon ui-icon-pencil imexpand' value='E' onclick=\"" + jq + ".editRow('" + cl + "');\"  />";
        se = "<span class='ui-icon ui-icon-disk imexpand' onclick=\"" + jq + ".saveRow('" + cl + "', false,'clientArray');\"  />";
        ce = "<span class='ui-icon ui-icon-arrowreturn-1-w imexpand' onclick=\"" + jq + ".restoreRow('" + cl + "');\" />";
        ce1 = "<span class='ui-icon ui-icon-pencil imexpand' onclick=\"alert('" + dt.leadcode + "');\" />";

        //jq.jqGrid('setRowData', ids[i], { act: ce1 });
    }
}
function jqRowCustom(gridid, colid, rowevent) {
//    var ids = jQuery("#jqac0").jqGrid('getDataIDs');
//    for (var i = 0; i < ids.length; i++) {
//        var cl = ids[i];
//        be = "<input style='height:22px;width:20px;' type='button' value='E' onclick=\"jQuery('#jqac0').editRow('" + cl + "');\"  />";
//        se = "<input style='height:22px;width:20px;' type='button' value='S' onclick=\"jQuery('#jqac0').saveRow('" + cl + "');\"  />";
//        ce = "<input style='height:22px;width:20px;' type='button' value='C' onclick=\"jQuery('#jqac0').restoreRow('" + cl + "');\" />";
//        jQuery("#jqac0").jqGrid('setRowData', ids[i], { good1: be + se + ce });
//    }

 var keylist = [], key = {}, kc = [];
    var ctr = selectimctable(menuid, subid, gridid);
    if(typeof(ctr)!="undefined")
    var data = selectimcdata("imcdata", ctr.datacode);

    if(ctr !=null)
    if(typeof ctr.event.setting.keycolumn !="undefined"){
        kc = data.keycode;
    }
    //if edit checked, insert restore,save
    $(rowevent).each(function (i, k) {
        if(k.id=="edit")

            $(["save","restore"]).each(function(j,l){
             var set={};
             set.title=l;
             set.id=l;
             set.icon="ui-icon-disk";
             if(l=="restore") set.icon="ui-icon-arrowreturnthick-1-w";
             set.localUpdate=k.localUpdate;
             set.remoteUpdate=k.remoteUpdate;
            rowevent.push(set);
            });
    });

    var jq = $("#" + gridid);
    var ids = jq.jqGrid('getDataIDs');
    var rtn="";
    for (var i = 0; i < ids.length; i++) {
        var cl = ids[i];
        var tb = $("<table style='border:solid 0 transparent;'/>"), tr = $("<tr />"), td = $("<td />");
        tb.append(tr);
        $(rowevent).each(function (i, k) {
            td = $("<td />");
            tr.append(td);
            td.append(createicon(gridid, k, cl));
        });
        var set = {};
        set[colid] = tb.prop('outerHTML');
        jq.jqGrid('setRowData', cl, set);
    }
    function createicon(gridid, opt, rowid) {
        var rtn1 = "", sp, title = "",id="", onclick = "";
        sp = $("<span />");
        sp.attr("class", "imexpand ui-icon " + opt.icon);
        //if (opt.hasOwnProperty("remoteUpdate") && opt.remoteUpdate == "Yes") remoteUpdate =remoteUpdate(gridid, "update", postdata) ;
        if (opt.hasOwnProperty("id")) id = opt.id;
        if (opt.hasOwnProperty("title")) title = opt.title;
        if ($.inArray(id, ["edit"]) > -1) {

            sp.attr("onclick", "$('#" + gridid + "')." + id + "Row('" + rowid + "', true, TheOnEditFunction);" + onclick);
            sp.attr("id", "btn_" + id + "_" + rowid);

        }
        else if ($.inArray(id, ["del"]) > -1) {

            onclick = "afterdelfunc('"+gridid+"', '"+rowid+"');";
            sp.attr("onclick", onclick+";$('#" + gridid + "')." + id + "RowData('" + rowid + "');");
            sp.attr("id", "btn_" + id + "_" + rowid);
        }
        else if ($.inArray(id, ["save", "restore"]) > -1) {
         onclick = "setglobal('"+gridid+"')";
            sp.attr("onclick", "setglobal('"+gridid+"');$('#" + gridid + "')." + id + "Row('" + rowid + "', DisplayEditButton,'','',aftersavefunc);");

            sp.attr("id", "btn_" + id + "_" + rowid);
            sp.css("display", "none");
        }
        else
            sp.attr("onclick", onclick);
        rtn1 = sp; //.prop('outerHTML');

        return rtn1;
    }



}
function setglobal(gridid) {
    grid = gridid;
}
var grid = "";
function aftersavefunc(id, response, options) {
    console.log(id, response, options, grid);
    var postdata = $("#" + grid).jqGrid('getRowData', id);
    var keylist = [], key = {}, kc = [];
    var ctr = selectimctable(menuid, subid, grid);
    if (typeof (ctr) != "undefined")
        var data = selectimcdata("imcdata", ctr.datacode);

    if (ctr != null)
        if (typeof ctr.event.setting.keycolumn != "undefined") {
            kc = data.keycode;
        }
    key.name = kc[0];
    key.value = postdata[kc[0]];
    keylist.push(key);
    if (ctr.hasOwnProperty("event")) {
        $(ctr.event.row).each(function (i, k) {
            if (k.id == "edit") {
                if (k.localUpdate == "Yes")
                    localUpdate(grid, keylist, postdata);
                if (k.remoteUpdate == "Yes") {
                    remoteUpdate(grid, "update", postdata);
                    console.log(grid,postdata);
                }
            }
        });
    }


}
function afterdelfunc(gridid,id) {
    var postdata = $("#" + gridid).jqGrid('getRowData', id);
    var keylist = [], key = {}, kc = [];
    var ctr = selectimctable(menuid, subid, gridid);
    if (typeof (ctr) != "undefined")
        var data = selectimcdata("imcdata", ctr.datacode);

    if (ctr != null)
        if (typeof ctr.event.setting.keycolumn != "undefined") {
            kc = data.keycode;
        }
    key.name = kc[0];
    key.value = postdata[kc[0]];
    keylist.push(key);
    if (ctr.hasOwnProperty("event")) {
        $(ctr.event.row).each(function (i, k) {
            if (k.id == "del") {
                if (k.localUpdate == "Yes")
                    localUpdate(gridid, keylist, "");
                if (k.remoteUpdate == "Yes")
                    remoteUpdate(gridid, "delete", postdata);
            }
        });
    }
}
function TheOnEditFunction(rowid) {
    //alert("rowid is " + rowid);
    $("#btn_save_" + rowid).show();//.css("visibility", "visible");
    $("#btn_restore_" + rowid).show(); //.css("visibility", "visible");
    $("#btn_edit_" + rowid).hide();
    if($("#btn_del_" + rowid).length>0)
    $("#btn_del_" + rowid).hide();
    console.log(rowid);//,response,options);
}
function DisplayEditButton(rowid,response,options) {
    //alert("rowid is " + rowid);
    $("#btn_save_" + rowid).hide();//.css("visibility", "hidden");
    $("#btn_restore_" + rowid).hide();//.css("visibility", "hidden");
    $("#btn_edit_" + rowid).show();
    if ($("#btn_del_" + rowid).length > 0)
    $("#btn_del_" + rowid).show();
}
function jqGridResizeWidth(gridid) {
    //find parent div
    var outerdiv = gridid.replace("jq", "");
    // window에 resize 이벤트를 바인딩 한다.
    $(window).bind('resize', function () {
        var dv = $("#" + gridid).parent();
        // 그리드의 width를 div 에 맞춰서 적용
        $('#' + gridid).setGridWidth(dv.width(), false); //Resized to new width as per window
    }).trigger('resize');
}
function selchange(selid, gridid) {
    $("#" + selid).change(function () {
        var vl = $(this).val();
        if (vl) {
            if (vl == "clear") {
                jQuery("#" + gridid).jqGrid('groupingRemove', true);
            } else {
                jQuery("#" + gridid).jqGrid('groupingGroupBy', vl);
            }
        }
    });
}
//#endregion jqGrid 외부function
//#region jqEdit,jqSave
function jqRender() {
    //Render button click

    //jqEditSave();
    var jqset = saveTable("tes1");
    var grid = $("#" + jqset[0][1]);
    if (grid.length) {
        grid.jqGrid('GridUnload');
        var cmd = $("#txCodeshow").val();
        cmd = cmd.replace("\"dpick\"", "dpick");
        cmd = cmd.replace("\"dtpick\"", "dtpick");
        eval(cmd);
    }
}
function jqRenderParse() {
    var jqset = saveTable("tes1");
    //get colname,colmodel from Model
    //if grouping true: groupingView:["groupField","groupText","groupColumnShow","groupSummary","groupSort","groupOrder"]
    var grp = false,groupingView = {};
    $(jqset).each(function (i, k) {
        if (i == 0) return true;
        if (k[0].indexOf("group") == 0) {
            switch (k[0]) {
                case "grouping":
                    set[k[0]] = k[1];
                    if (k[1]) {
                        set.groupingView = {};
                        grp = true;
                    }
                    break;
                default:
                    if (grp)
                        set.groupingView[k[0]] = k[1];
                    break;
            }
        }
        else
            set[k[0]] = k[1];
    });

}
function selectTab(tabName) {
    $("#tab-Contain").tabs("option", "active", $(tabName).index());
}
var jqgdt;
function jqEdit(id, options) {
    var gridid = 'jq' + id, pagerid = 'pg' + id;
    var cstyle, arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type;
    if (typeof options != "undefined") {
        if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (options.hasOwnProperty('type')) type = options.type
        if (options.hasOwnProperty('gdt')) gdt = options.gdt;
        if (options.hasOwnProperty('ctrid')) id = options.ctrid;
        if (options.hasOwnProperty('code')) code = options.code;
        if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
        if (options.hasOwnProperty('archive')) archive = options.archive;
        if (src == "temp") {
            //if(!options.hasOwnProperty("archive"){

            //}
        }
    }
    else {
        gdt = editDataFind(id, options);
        options = editoptionmake("jqgrid", id, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
    }

    if (typeof gdt != "undefined") {
        //common thru type
        if (gdt.hasOwnProperty("code")) code = gdt.code;
        if (gdt.hasOwnProperty("name")) name = gdt.name;
        if (gdt.hasOwnProperty("desc")) desc = gdt.desc;
        if (gdt.hasOwnProperty("archive")) {
            options.archive = archive;
            archive = gdt.archive;
        }
        jqgdt = gdt;
    }
    //container create
    var conarr = {};
    conarr.id = "dveditback";
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Table", "Model", "Event", "Data", "Style"];
    var content = [];

    //1st Tab
    content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
    "<td style='vertical-align:top;'><div id='dvtx' style='display:block;padding:5px;'>" +
    "<textarea id='txCodeshow' rows='20' cols='13' style='width:100%;overflow-y:auto;'></textarea></div></td></tr><tr><td id='tbbtn' colspan='2'></td></tr></table>");
    //2nd Tab
    btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input type='button' value='Reload'  onclick=\"jqEditGridModel()\"/>";
    btn += "<input type='button' value='Save'  onclick=\"jqEditSave();\"/></div>";
    content.push("<table id='jqgridedit' ></table><div id='jqpageedit'></div>" + btn);
    //3rd Tab
    var dv = $("<div style='padding:5px 0 5px 0;' />");
    dv.append(jqEditEvent(gridid));
    btn = $("<div style='padding:5px;text-align:right;'><input type='button' value='Save' onclick=\"jqEventSave('" + gridid + "');\"/></div>;");
    dv.append(btn);
    content.push(dv);
    //4th Tab
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);
    if (src.indexOf("list") > -1) {
        archivegdtReload(tab);
    }
    else {
        var conarr = {};
        conarr.id = "dveditback";// "container" + id;
        //container complete
        conarr.body = tab;
        var container = makeContainer(conarr);
    }
    $("#tbbtn").append(editbutton(options));
    var columnlist = [];
    var chk = jscriptInsert("multiple-select-js", "/js2/jquery-multiple-select/jquery.multiple.select.js");
    jqEdit.datasrc = datasrc;
    if (typeof (gdt) != "undefined") {
        if(gdt.hasOwnProperty("data")){
            var datacode=gdt.data.datacode;
            if (gdt.data.hasOwnProperty("code")) datacode = gdt.data.code;
            jsonReadAjax("imcdata", "", "code", datacode, jqEdit.datasrc, [gdt, options])
        }
        else
            datasrc("",gdt)
    }
    else
        datasrc("", gdt);
    function datasrc(imcdata, gdt,options) {
        var dt;
        if (imcdata != "") {
            var src = datalistreturn(imcdata);
            var filter = [];
            if (!gdt.hasOwnProperty('filter')) filter = gdt.data.filter;
            else filter = imcdata.filter;
            dt = applyFilter(src, filter);
        }
        if (typeof dt != "undefined" && dt.length > 0) {
            var firstrow = [];
            firstrow = dt[0];
            $.each(firstrow, function (i, k) {
                columnlist.push(i);
            });
             jqEditTable(gridid, pagerid, gdt);
            if (!gdt.hasOwnProperty('setting')) {
                gdt.setting = jqEditDefault(gridid);
                var colname = [];
                var colmodel = [];
                var list = {};
                $.each(firstrow, function (i, k) {
                    colname.push(i);
                    colmodel.push({ "name": i });
                });
                gdt.colNames = colname;
                gdt.colModel = colmodel;
            }

            gdt.setting = $.extend({ "data": JSON.stringify(dt) }, gdt.setting);

            jqEditGridModel(gdt);
            var out = jqCommand(gridid, pagerid, gdt,dt);
            $("#txCodeshow").val(out.replace(":asc,", ""));
            styleInsert("editdata", "#txCodeshow {resize:vertical;}");
           // $("#tab-Contain").tabs("option", "active", 0);
        }
        else {
            var imsi = {};
            imsi.pager = pagerid;
            jqEditTable(gridid, pagerid, imsi);
        }
        var tabb = $('#' + tabarr.id);
        var first = true, model = true,dt=true;
        tabb.tabs({
            activate: function (event, ui) {
                var $activeTab = tabb.tabs('option', 'active');
                switch ($activeTab) {
                    case 0:
                        var wth = $("#dvtx").css("width").replace("px", "");
                        $("#jqpreview").setGridWidth(wth);
                        break;
                    case 1:
                        if (model) {
                        setTimeout(function(){jqEditGridModel(gdt);},1000);
                            model = false;
                       }
                        break;
                    case 3:
                        if(dt){
                            dataTabClick(id, options);
                            dt=false;
                        }
                        
                        break;
                    case 4:
                        //3rd Tab style
                        if (first) {
                            if (typeof id == 'undefined') id = code;
                            cssEditInit("Style", id, "jqgrid");
                            first = false;
                        }
                        break;
                }
                var dtid = 'admin&2&j160112153427';
                if ($("#spdataajax").length > 0) dtid = 'data_select';
                var hp = ['jqgridedit','jqgrid_model', 'jqgrid_edit', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
                tabb.attr("help", hp[$activeTab]);
            }
        });
        tabb.addClass('helpinsert');
        tabb.attr("help", 'jqgridedit');
        helpinsert();
        //button init
        $("input[type='button']").button();
        $("button").button();
        var event = "";
        if (typeof gdt != "undefined" && gdt.hasOwnProperty("event")) event = gdt.event;

        jqEventInject("grid1", "pggrid1", event);
        jqEventInject("grid2", "pggrid2", event);
        jqEventInject("grid3", "pggrid3", event);

        //preview/code
        var accord = $("<div />").accordion({
            event: "click",
            collapsible: true,
            active: 0,
            beforeActivate: function (event, ui) {
                switch (ui.newHeader.context.innerText.toLowerCase()) {
                    case "preview":
                        setgridwidth("jqpreview", $("#dvtx").css("width"))
                        break;
                }
            }
        });
        $("#jqpreview").parent().remove();
        var dvpreview = $("<div />");
        //dvpreview.attr("id", id);
        //dvpreview.attr("class", "jqgrid");
        var gridid1 = "jqpreview";
        var pagerid1 = "pgpreview";
        dvpreview.append($("<table id='jqpreview' />"));
        dvpreview.append($("<div id='" + pagerid1 + "' />"));
        var accord1 = accordmake1(accord, "Preview", dvpreview.outerHTML());
        accord1 = accordmake1(accord1, "Code", "");
        $("#dvtx").append(accord1);
        //jqgridInit(gridid1, id);
        //$("#dvtx").empty();
        jqgridInit("jqpreview", { gdt: gdt }, setgridwidth, ["jqpreview",$("#dvtx").width()]);
       
        accord.find('div').last().css("overflow-x", "hidden").append($("#txCodeshow"));
        accord.accordion("refresh");
      
    }
}
function setgridwidth(gridid, wth) {
    $("#" + gridid).setGridWidth(wth);
}
function jqEditTable(gridid,pagerid, ctr) {
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle",sty);
    //checkbox toggle,show()hide() children
    var dt = "", num = 10,caption="",height="auto",gridview=false,multiselect=false;
    //groupingView
    var grouping=false,gcol = "", gsummary = "", gsort = "", godr = "asc", gtext = "<b>{0} - {1} Item(s)</b>", gfield = "";
    var gridview = true, autowidth = true, rowList = [10, 20, 30], toolbarfilter = true, loadtext = "Loading..!!.",width="";
    var emptyrecords = "No records to view", viewrecords = true, userDataOnFooter = true, datatype = "local", editurl = "clientArray";

    if (typeof ctr !="undefined") {
        if (ctr.hasOwnProperty("setting")) {
            var st = ctr.setting;
            dt = st.data;
            if(st.hasOwnProperty("caption"))caption = st.caption;
            if(st.hasOwnProperty("multiselect"))multiselect=st.multiselect
            if (st.rowNum != "") num = parseInt(st.rowNum);
            if(st.hasOwnProperty("grouping"))grouping = st.grouping;
            var grp = st.groupingView;
            gfield = "--select--,'';";
            if(ctr.hasOwnProperty("colNames") && ctr.colNames !="")
                $.each(ctr.colNames, function (i, k) {
                    if (k != "") {
                            gfield += k + "," + k + ";";
                    }
                });
                if (gfield != "") gfield = gfield.substring(0, gfield.length - 1);
                if (grouping) {
                $("#selgroupField").val(grp.groupField);
                gcol = grp.groupColumnShow;
                gsummary = grp.groupSummary;
                gsort = grp.groupSort;
                godr = grp.groupOrder;
                if (grp.groupText) gtext = grp.groupText;
            }
                if(st.hasOwnProperty("autowidth"))autowidth = st.autowidth;
                if(st.hasOwnProperty("width"))width = st.width;
                if(st.hasOwnProperty("height"))height = st.height;
                if(st.hasOwnProperty("gridview"))gridview = st.gridview;
                if(st.hasOwnProperty("rowList"))rowList = st.rowList;
                if(st.hasOwnProperty("toolbarfilter"))toolbarfilter = st.toolbarfilter;
                if(st.hasOwnProperty("loadtext"))loadtext = st.loadtext;
                if(st.hasOwnProperty("emptyrecords"))emptyrecords = st.emptyrecords;
                if(st.hasOwnProperty("viewrecords"))viewrecords = st.viewrecords;
                if(st.hasOwnProperty("userDataOnFooter"))userDataOnFooter = st.userDataOnFooter;
                if(st.hasOwnProperty("datatype"))datatype = st.datatype;
                if(st.hasOwnProperty("editurl"))editurl = st.editurl;
        }
    }

    if ($("#tes1").length == 0) {
        var data = [
            [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
        , ["grid", makeCtr(["input", gridid, , "inp", ])]
        , ["pager", makeCtr(["input", pagerid, , "inp", ])]
        //, ["data", makeCtr(["input", dt, , "inp1",])]
        , ["rowNum", makeCtr(["input", num, , "inp", ])]
        , ["caption", makeCtr(["input", caption, , "inp", ])]
        , ["multiselect", makeCtr(["input:checkbox", multiselect, , ])]
        , [makeCtr(["span", "grouping", , "expcol", , ]), makeCtr(["input:checkbox", grouping, "ingrp", , "onclick:toggle($(this))"])]
        , [makeCtr(["span", "groupField", , "indent ingrp", ]), makeCtr(["select", gfield, "selgroupField", , ])]
        , [makeCtr(["span", "groupText", , "indent ingrp", ]), makeCtr(["input", gtext, "", "inp", ])]
        , [makeCtr(["span", "groupColumnShow", , "indent ingrp", ]), makeCtr(["input:checkbox", gcol, , , ])]
        , [makeCtr(["span", "groupSummary", , "indent ingrp", ]), makeCtr(["input:checkbox", gsummary, , , ])]
        , [makeCtr(["span", "groupSort", , "indent ingrp", ]), makeCtr(["input:checkbox", gsort, , , ])]
        , [makeCtr(["span", "groupOrder", , "indent ingrp", ]), makeCtr(["select", "asc,asc;desc,desc", godr, "inp", ])]
        , ["autowidth", makeCtr(["input:checkbox", autowidth, , , ])]
        , ["width", makeCtr(["input", width, , "inp", ])]
        , ["height", makeCtr(["input", height, , "inp", ])]
      , ["gridview", makeCtr(["input:checkbox", gridview, , , ])]
      , ["rowList", makeCtr(["input", rowList, , "inp", ])]
      , ["toolbarfilter", makeCtr(["input:checkbox", toolbarfilter, , , ])]
      , ["loadtext", makeCtr(["input", loadtext, , "inp", ])]
      , ["emptyrecords", makeCtr(["input", emptyrecords, , "inp", ])]
      , ["viewrecords", makeCtr(["input:checkbox", viewrecords, , , ])]
      , ["userDataOnFooter", makeCtr(["input:checkbox", userDataOnFooter, , , ])]
      , ["datatype", makeCtr(["input", datatype, , "inp", ])]
      , ["editurl", makeCtr(["input", editurl, , "inp", ])]
        ]
        var tb = makeTable("tes1", data, "general");

        $("#dvtable").append(tb);
        $('.indent').parent().parent().hide();
    }
}
function toggle(that) {
    var id = that.attr("id");
    var chk = that.is(':checked');
    var child = $('.indent.' + id).parent().parent();
    if (chk) child.show(); else child.hide();
}
function groupFieldLoad(gridid) {
    var gfield = "--select--,'';";
    $("#selgroupField")
    selectimctable(menuid, subid, gridid);
    $.each(ctr.colNames, function (i, k) {
        if (k != "") {
            gfield += k + "," + k + ";";
        }
    });
    if (gfield != "") gfield = gfield.substring(0, gfield.length - 1);
}
function jqEditGrid(rowlist,colModel,selected) {
    //edit창중 jqgrid부분
//    console.log(rowlist,colModel)
    //column name 추출
    var arrdt = []; var colmodel = []; var rowindex = [];
    if(selected !="")
    $(rowlist).each(function(i,k){
        if($.inArray( k, selected ) >-1)
            rowindex.push(i);
    });

    var colname = ['field', 'name', 'editable', 'edittype', 'editoptions', 'hidden', 'edithidden', 'width', 'align', 'format', ''];
    for (j in rowlist) {
        var row = {};
        var exists = false;
        row.field = rowlist[j];
        $.each(colModel, function (i, js) {
            if (js.name == row.field) {
                row.name = row.field;
                row.editable = js.editable;
                row.edittype = js.edittype;
                row.editoptions = JSON.stringify(js.editoptions);
                row.hidden = js.hidden;
                row.edithidden = js.edithidden;
                row.width = js.width;
                row.align = js.align;
                row.format = js.format;
                row.action = "";
                exists = true;
            }
        });
        if (!exists)
            row = { field: rowlist[j], name: rowlist[j], editable: "", edittype: "", editoptions: "", hidden: "", edithidden: "", width: "", align: "", format: "", action: "" };
        if (typeof row.name != "function")
        arrdt.push(row);
    }
    for (i in colname) {
        var list = {};
        list.name = colname[i];
        list.editable = true;
        switch (colname[i]) {
            case "field":
                list.editable = false;
                list.width = 50;
                break;
            case "name":
                list.width = 60;
                list.editoptions = { size:8};
                break;
            case "width":
                list.width = 30;
                list.editoptions = { size: 2 };
                break;
            case "hidden": case "edithidden": case "editable":
                list.edittype = "checkbox";
                list.formatter = "checkbox";
                list.width = 20;
                list.editoptions = { value: "Yes:" };
                break;
            case "align":
                list.edittype = "select";
                list.width = 50;
                list.editoptions = { value: "Left:left;Center:center;Right:right" };
                break;
            case "edittype":
                list.edittype = "select";
                list.width = 70;
                list.editoptions = { value:":;text:text;select:select;checkbox:checkbox;textarea:textarea;date:Date;datetime:DateTime"
                , dataEvents: [{ type: 'change', fn: function (e) {
                    var rowid = $(e.target).attr("rowid");
                    var opt = $('#' + rowid + '_editoptions');
                    //console.log($(e.target).attr("rowid"), $(e.target).attr("id"), $('#editoption').val(), $(e.target).val());
                    switch ($(e.target).val()) {
                        case "date":
                            opt.val('{ "dataInit": "dpick" }');
                            break;
                        case "datetime":
                            opt.val('{ "dataInit": "dtpick" }');
                            break;
                        case "select":
                            opt.val('{ "value": "val:txt;로 입력!!" }');
                            break;
                        case "textarea":
                            opt.val("{rows:'5',cols:'2'}");
                            break;
                    }
                }
                }]
                };
                break;
            case "editoptions": case "format":
                list.edittype = "textarea";
                list.width = 90;
                list.editoptions = {rows:'2',cols:'12'};
                break;
            case "":
                list.width = 50;
                list.fixed = true;
                list.sortable = false
                list.resize = false;
                list.formatter = 'actions';
                list.formatoptions = { size:12,keys: true };
                list.editable = false;
                break;
        }
        if(typeof list.name!="function")
        colmodel.push(list);
    }
    console.log(colname,colmodel)
    //console.log(colname,JSON.stringify(colmodel))
    jQuery("#jqgridedit").jqGrid("GridUnload");
    jQuery("#jqgridedit").jqGrid({
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: arrdt,
        height: "auto",
        autowidth:true,
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: "#jqpageedit",
        caption: "Data Model Edit",
        autowidth: true,
        editurl: "clientArray",
        multiselect: true,
        sortable:true,
        loadComplete: function () {
            $.each(rowindex, function (i, k) {
                $("#jqgridedit").setSelection(k + 1);
            });
        }
    });
    jQuery("#jqgridedit").sortableRows();

    jqPagerAdd("jqgridedit", "jqpageedit", [false, false, false, false, false], []);
    //jqPagerAdd("jqgridedit", "jqpageedit", [true,true,true, false, false], []);
    $("#jqgridedit").jqGrid("inlineNav", "#jqpageedit", { addParams: { position: "last"} });
    jqPagerCustomButton("jqgridedit", "jqpageedit", "1", "yes");
    //jqPagerAllRowAction(gridid,type);
    jqRowCustomButton("jqgridedit");
}
function jqEditDefault(gridid) {
    //default setting 값
    var json = {};
    json.height = "auto";
    json.gridview = true;
    //json.hoverrows = true;
    json.autowidth = true;
    json.rowList = "[10, 20, 30]";
    json.toolbarfilter = true;
    json.loadtext = "Loading..!!.",
    json.emptyrecords = "No records to view",
    json.viewrecords = true;
    //json.footerrow = true;
    json.userDataOnFooter = true;
    json.datatype = "local";
    json.editurl = "clientArray";
//    json.onClickGroup = function (hid, collapsed) {
//        if (!checkpage)//paging이 아닌 경우만실행
//            expandcollapseSave($gid, hid, collapsed);
//    };
//    json.onPaging = function (action) {
//        jqGridPaging($gid);
//    };
//    json.gridComplete = function () {
//        expandcollapseApply($gid);
//        jqRowCustomButton($gid);
//        checkpage = false;
//        jqPagerSaveAllToggle('');
//    };
    return json;
}
function idfinder() {
    //find id whether control or archive
    var id = $("#lbCtr").text();
    if (id == "") {
        src = "list";
        var ardt = $("#sparchive").text();
        if (ardt != "") {
            id = JSON.parse(ardt).code;
        }
    }
    else if (id == "undefined")
        id = "";
    return id;
}
function jqEditSave(options) {
    var src = "", combine;
    var id = idfinder();
    if ($("#archivegdt").text() != "")
        combine = JSON.parse($("#archivegdt").text());
    //else
    //    combine = readdata(id, "gdt", options);
    if (typeof (combine) == "undefined" | combine == "") {
        combine = {};
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = id;
    }
    if (typeof options != "undefined" && options.hasOwnProperty("src")) src = options.src;
   
    var jqset = saveTable("tes1");
    var setlist = Object.keys(jqset)
    $(jqset).each(function (i, k) {
        if (k[1] == "")
            jqset.splice(i,1)
    })
    var gridid = jqset[0][1]
    var pagerid = jqset[1][1]

    var setting = {} ; var grouping = {}, ar;
    var arrlist = ["groupField", "groupColumnShow", "groupText", "groupOrder", "rowList"];
    //setting.data = "";
   // console.log(JSON.stringify(jqset))
    $.each(jqset, function (i, arr) {
        if ((arr[0].indexOf("group") == -1 || arr[0] == "grouping") && arr[0] != "grid") {
            if ($.inArray(arr[0], arrlist) > -1) {
                if (arr[0] == "rowList") {
                    var list = [];
                    $(arr[1].split(',')).each(function (j, l) {
                        list.push(parseInt(l));
                    });
                    setting.rowList = list;
                }
                else
                    setting[arr[0]] = [arr[1]];
            }
            else
                setting[arr[0]] = arr[1];
        }
        else if (arr[0] != "grid") {
            if ($.inArray(arr[0], arrlist) > -1)
                grouping[arr[0]] = [arr[1]];
            else
                grouping[arr[0]] = arr[1];
        }
    });
    if (setting.grouping)
        setting["groupingView"] = grouping;// JSON.stringify(grouping);
   
    combine.setting = setting;
    var datacode = "";
    if ($("#spdataajax").text() != "") {
        var data = JSON.parse($("#spdataajax").text());      
        delete data.datalist;
        combine.data = data;
        var datalist = JSON.parse($("#spdlist").text());
        combine.setting.data = datalist

        var out = jqCommand(gridid, pagerid, combine, datalist);
        //change setting.data from real datalist to datacode
        var ncombine = combine;
        ncombine.data.datalist = datalist;
        $("#jqpreview").empty();
        $("#jqpreview").next().empty();
        jqgridInit("jqpreview", { gdt: ncombine });//,setgridwidth, ["jqpreview", wth]);
        //jqgridInit("jqpreview", { gdt: ncombine }, setgridwidth, ["jqpreview", $("#dvtx").width()]);

    }
    //else if (combine.hasOwnProperty("data")) {
    //    if (combine.data.hasOwnProperty("datacode")) datacode = combine.data.datacode;
    //    else if (combine.data.hasOwnProperty("code")) datacode = combine.data.code;
    //}
    //if ($("#spDatacode").text()!="")
    //datacode = $("#spDatacode").text();
  
   
    var model = jqCreateColmodel("jqgridedit");
    combine.colNames = model.colNames;
    combine.colModel = model.colModel;
    combine.ctrtype = 'jqgrid';
    commonsave(id, src, combine, options);
    console.log(out)
    $("#txCodeshow").val(out.replace(":asc,", ""));

    //jqEditSave.datasrc = datasrc;
    // jsonReadAjax("imcdata", "", "code", datacode, jqEditSave.datasrc, [combine,src]);
   
    function datasrc(imcdata, combine,src) {
        var dtt;
        if (imcdata != "") {
            var dtsrc = imcdata.datalist;
            var filter = [];
          
            if (typeof combine!="undefined" && combine!="" && combine.hasOwnProperty('data')) filter = combine.data.filter;
            else filter = imcdata.filter;
            dtt = applyFilter(dtsrc, filter);
            var data = {};
            data.datacode = imcdata.code;
            data.filter = filter;
            combine.data = data;
        }

        if(combine.hasOwnProperty("setting"))
            combine.setting.data = JSON.stringify(dtt);
       
      
    }
   
}
function jqEditGridModel(gdt) {
    var datacode, filter;
    if (typeof gdt == "undefined") {
        if ($("#archivegdt").text() != "")
            gdt = JSON.parse($("#archivegdt").text());
        else if ($("#lbCtr").text() != "") {
            gdt = selectimctable(menuid, subid, $("#lbCtr").text());
        }
    }
    console.log(gdt)
    if (typeof gdt != "undefined" && gdt.hasOwnProperty("data")) {
        if (gdt.data.hasOwnProperty('datacode')) datacode = gdt.data.datacode;
        else if (gdt.data.hasOwnProperty('code')) datacode = gdt.data.code;
        filter = gdt.data.filter;
    }

    if ($("#spDatacode").text() != "") {
        datacode = $("#spDatacode").text();
        //add filter
    }
    jqEditGridModel.jqModeldata = jqModeldata;
    console.log(datacode)
    jsonReadAjax("imcdata", "", "code", datacode, jqEditGridModel.jqModeldata,[gdt,filter]);
    function jqModeldata(data, gdt, filter) {
        var rtn = {};
        if (data != "") {
           
            var src = datalistreturn(data);//data.datalist;
            if (typeof filter == "undefined") filter = data.filter;
            var dtt = applyFilter(src, filter);
            var colname = [];
            var colmodel = [];
            if ($("#jqgridedit tr").length == 0) {
                var col = jqCreateColmodel("jqgridedit");
                rtn.colname = col.colNames;
                rtn.colmodel = col.colModel;
            }
            $("#jqgridedit tr").empty();
            var list = {};
            $.each(dtt[0], function (i, k) {
                colname.push(i);
                colmodel.push({ "name": i });
            });
            rtn.colname = colname;
            rtn.colmodel = colmodel;
            console.log(JSON.stringify(rtn))
        }
        if (typeof gdt != "undefined") {
            gdt.data = data;
            jqgdt = gdt;
        }
        if (typeof (jqgdt) != "undefined" && jqgdt.hasOwnProperty("colNames"))
            var selected = jqgdt.colNames;
        else
            selected = "";
        jqEditGrid(rtn.colname, rtn.colmodel, selected);
     
    }
    
}
function jqCommand(gridid, pagerid, ctr,datalist) {
    var txtform = ["datatype", "height", "pager", "caption",  "editurl", "loadtext", "emptyrecords", "groupField", "groupOrder", "groupText"];
    var gid = "$(\"#" + gridid + "\")";
    //ctr=jsonData(ctr);//data를 real로 교체
    var out = "var currPage = '1';var checkpage = false;\n";
    out += gid + ".jqGrid({\n";
    //out += "gridid:'" + gridid + "',\n";
    out += "colNames:" + JSON.stringify(ctr.colNames) + "\n";
    out += ",colModel:" + jsonEnter(ctr.colModel) + "\n";
    //out += ",data:" + JSON.stringify(datalist) + "\n";
    if(typeof ctr=="undefined" && ctr.hasOwnProperty("setting"))
    out += jsonCleaning(ctr.setting, txtform);

    out += "});\n"; //jqgrid close

    //외부function
    //var ctr = selectimctable(menuid, subid, gridid),
    var event = "",func=[],onclick=[],opt={};
    if (ctr.hasOwnProperty("event")) {
        event = ctr.event;
        //pager
        if (ctr.event.hasOwnProperty("pager")) {
            //select pager func & onclick
            var flist = ["edit", "add", "del", "search", "refresh"];
            var sel=[];
            $(event.pager).each(function(i,k){
                sel.push(k.title);
            });
            $(flist).each(function (i, k) {
                if ($.inArray(k, missingArray(flist, sel)) == -1) {
                    func.push(true);
                    $(event.pager).each(function (j, l) {
                        if (k == l.title) {
                                onclick.push(l.onclick);
                        }
                    });
                }
                else {
                    func.push(false);
                    onclick.push("");
                }
            });


            if(func.length>0)
                out += "jqPagerAdd('" + gridid + "','" + pagerid + "'," + JSON.stringify(func) + "," + JSON.stringify(onclick) + ");\n";

//            if (event.hasOwnProperty("setting")) {
//                if(event.setting.inline)
//                    jqPagerAdd(gridid, pagerid, [false, false, false, false, false], []);
//                var inlineparams = {
//                    add: true,
//                    edit: true,
//                    del: true,
//                    save: true,
//                    cancel: true
//                };
//                jq.jqGrid('inlineNav', "#" + pagerid, inlineparams);
//            }
        }
        //custom pager
        if (ctr.event.hasOwnProperty("pagercustom")) {
            $(event.pagercustom).each(function (i, k) {
                out += "jqPagerCustom('" + gridid + "','" + pagerid + "', " +JSON.stringify(k)+ ");\n";
            });
        }
        //custom row
        if (ctr.event.hasOwnProperty("row")) {
            out += "jqRowCustom('" + gridid + "','"+ctr.event.setting.addedcolumn+"', " + JSON.stringify(ctr.event.row) + ");\n";
        }
    }
    var outerdiv = gridid.replace("jq", "");
    out += "$(window).bind('resize', function () {" +
            "$('#" + gridid +"').setGridWidth($('#" + outerdiv +"').width(), false);" +
        "}).trigger('resize');\n";

    out = jsonReplace(out, "$gid", "'" + gridid + "'"); //gridid로 교체

    function jsonCleaning(json, txtform) {
        //json:json file, txtform:boolean,array가 아닌text형
        //comma,\n,""부착
        var rtn = "";
        var el = "",json1={};
        var newjson = Object.keys(json);
        $(newjson).each(function (i, k) {
            if (json[k] != "")
                json1[k] = json[k];
        });
        $.each(json1, function (name, val) {
            var el = val;
            if (arraychkexist(txtform, name))
                el = "\"" + val + "\"";

            if (name == "data" && val.indexOf("]") > -1) {
                rtn += "," + name + ":" + val;
            }
            else {
                if ($.inArray(name, ["rowList","groupingView"]) > -1)
                    el = JSON.stringify(el);
                rtn += "," + name + ":" + el;
            }

            rtn += "\n";
        });
        return rtn;
    }
    function jsonData(json) {
        $.each(json, function (name, val) {
            if (name == "data") {
                json.data = JSON.stringify(datalist);
            }
        });
        return json;
    }
    function jsonEnter(json) {
        //array element에 enter부여해서 가독성제고
        var rtn = "[";
        if (typeof json!="undefined" && json.length > 0)
            $.each(json, function (name, val) {
                rtn += JSON.stringify(val) + ",\n";
                rtn = rtn.replace("\"dpick\"", "dpick");
                rtn = rtn.replace("\"dtpick\"", "dtpick");
                rtn = rtn.replace("\"edittype\":\"DateTime\"", "\"edittype\":\"text\"");
                rtn = rtn.replace("\"edittype\":\"Date\"", "\"edittype\":\"text\"");
            });
        rtn = rtn.substring(0, rtn.length - 2);
        rtn += "]";
        return rtn;
    }
    function jsonReplace(txt, bef, aft) {
        //text내의 string replace
        var spl = txt.split(' ');
        var rtn = "";
        $.each(spl, function (name, val) {
            rtn += " " + val.replace(bef, aft).replace(bef, aft).replace(bef, aft);
        });
        return rtn;
    }

    return out;
}
function reloadTable(data) {
//    if (data == '') data = $("#lbDatacode").html();
//    var dt = selectData(data);
//    var columnlist = [];
//    $.each(dt[0], function (i, k) {
//        columnlist.push(i);
//    });
//
//    $("#jqgridedit").jqGrid("GridUnload");

//    jqEditGrid(columnlist, "");
}
function jqCreateColmodel(mgrid) {
    //jqgrid authoring내역을 sessionStorage저장
    var rtn = {};
    var colNames = [];
    var colModel = [];
    // var myIDs = $('#jqgridedit').jqGrid('getDataIDs');
    //$("#tab-Contain").tabs("option", "active", 1);
    var myIDs = $('#' + mgrid).jqGrid('getGridParam', 'selarrrow');
    //order chg as grid
    var odr = [];
    $("#jqgridedit tr").each(function (i, k) {
        if (typeof $(k).attr("id") != "undefined")
            if ($.inArray($(k).attr("id"), myIDs) > -1)
                odr.push($(k).attr('id'))
    });

    for (var i = 0; i < odr.length; i++) {
        var myRow = $('#' + mgrid).jqGrid('getRowData', odr[i]);
        var list = {};
        list.name = myRow.name;
        if (myRow.hidden != "")
            list.hidden = (myRow.hidden = "yes") ? true:false;
        if (myRow.edithidden != "")
            list.editrule = (myRow.edithidden = "yes") ? { edithidden: true} : { edithidden: false };
        if (myRow.width != "")
            list.width = parseInt(myRow.width);
        if (myRow.align != "" && myRow.align != "left")
            list.align = myRow.align;
        if (myRow.editable != "")
            list.editable = (myRow.editable = "yes") ? true : false;
        if (myRow.edittype != "")
            switch (myRow.edittype) {
                case "datetime":
                    list.edittype = "text";
                    list.editoptions = { "dataInit": "dtpick" };
                    break;
                case "date":
                    list.edittype = "text";
                    list.editoptions = { "dataInit": "dpick" };
                    break;
                default:
                    list.edittype = myRow.edittype;
                    break;
            }

        if (myRow.editoptions != "") {
            var obj = eval("(" + myRow.editoptions + ")");

            list.editoptions = obj;
        }
        if (myRow.format != "")
            list.format = myRow.format;
        colModel.push(list);
        colNames.push(myRow.field);
    }
    rtn.colNames = colNames;
    rtn.colModel = colModel;
    return rtn;
}
//jqEditEvent
function jqEditEvent(gridid) {
    //var accord1 = $("<div id='dvEvent' style='padding:5px;'/>");
    accordioncss();
    var inp = "", sel = "";
    var ctr = selectimctable(menuid, subid, gridid);
    if (typeof ctr != "undefined" && ctr.hasOwnProperty('colModel') && ctr.colModel !="") {
        var src = ctr.colModel;
        sel = makeSelect(src, ["", "name", "name"])
        sel = sel.clone().html();
    }
    var accord = $("<div id='jqaccordion' style='padding:5px;'/>");
    //$("#dvEvent").append(accord);
    accord.append("<h3>Pager</h3>");
    accord.append("<div style='padding:10px 0 5px 0;'>"+
    "<div>Inline:<input type='checkbox' id='cbInline'/></div>"+
    "<div>key:<select id='selKeycolumn'><option>select...</option>" + sel + "</select></div>"+
    "<table id='grid1'></table><div id='pggrid1'></div></div>");
    accord.append("<h3>Pager Custom</h3>");
    accord.append("<div style='padding:10px 0 5px 0;'><table id='grid2'></table><div id='pggrid2'></div></div>");
    accord.append("<h3>Row Custom</h3>");

    accord.append("<div style='padding:10px 0 5px 0;'>" +
    "<div style='padding-bottom:3px'>Column: <select id='selAdded'><option>select...</option>" + sel + "</select></div>" +
    "<table id='grid3'></table><div id='pggrid3'></div></div>");

    accord.accordion({
        event: "click",
        collapsible: true,
        active: 0,
        heightStyle: "content"
    });
    //inline,column added
    setTimeout(function () {
        if(typeof ctr !="undefined")
        if (ctr.hasOwnProperty("event"))
            if (ctr.event.hasOwnProperty("setting")) {
                var chk = ctr.event.setting.inline;
                if (chk) $("#cbInline").attr('checked', true);
                else $("#cbInline").attr('checked', false);
                $("#selAdded").val(ctr.event.setting.addedcolumn);
                $("#selKeycolumn").val(ctr.event.setting.keycolumn);
            }
    }, 0);
    return accord;
}
function jqEventInject(gridid, pagerid, event) {

    var arrindex = [];
    var colmodel = [];
    switch (gridid) {
        case "grid1":
            var colname = ["title", "localUpdate", "remoteUpdate", ""];
            colmodel.push({ name: 'title', width: 55 });
            colmodel.push({ name: 'localUpdate', editable: true, edittype: "checkbox", formatter: "checkbox", width: 100 });
            colmodel.push({ name: 'remoteUpdate', editable: true, edittype: "checkbox", formatter: "checkbox", width: 100 });
            var datasrc = [{ title: "edit" }, { title: "add" }, { title: "del" }, { title: "search" }, { title: "refresh"}];
            $(event.pager).each(function (i, k) {
                $(datasrc).each(function (j, l) {
                    if (k.title == l.title) {
                        arrindex.push(j + 1);
                        if (k.hasOwnProperty("remoteUpdate"))
                            datasrc[j].remoteUpdate = k.remoteUpdate;
                        if (k.hasOwnProperty("localUpdate"))
                            datasrc[j].localUpdate = k.localUpdate;
                    }
                });
            });
            break;
        case "grid2":
            colname = ["Title", "icon", "Postion", "remoteUpdate", ""];
            colmodel.push({ name: 'title', width: 100, editable: true, edittype: "text" });
            colmodel.splice(1, 0, { name: 'icon', width: 150, editable: true, edittype: "text", editoptions: { size: 20} });
            colmodel.splice(2, 0, { name: 'position', width: 50, editable: true, edittype: "select", editoptions: { value: "null:Left;last:Right"} });
            var remotedata = "";

            colmodel.splice(3, 0, { name: 'remoteUpdate', width: 150, editable: true, edittype: "select", editoptions: { value: remotedata} });
            datasrc = event.pagercustom;
            break;
        case "grid3":
            colname = ["Title", "id", "icon","localUpdate", "remoteUpdate", ""];

            colmodel.push({ name: 'title', width: 100, editable: true, edittype: "text" });

            colmodel.splice(1,0,{ name: 'id', hidden:false });
            colmodel.splice(2, 0, { name: 'icon', width: 150, editable: true, edittype: "text", editoptions: { size: 20} });
            colmodel.splice(3, 0,{ name: 'localUpdate', editable: true, edittype: "checkbox", formatter: "checkbox", width: 100 });
            colmodel.splice(4, 0, { name: 'remoteUpdate', editable: true, edittype: "checkbox", formatter: "checkbox", width: 100 });
            datasrc = [{ id: "edit", title: "edit", icon: "ui-icon-pencil" }, { id: "del", title: "delete", icon: "ui-icon-trash" }];
            var defaultid = ["edit", "del"];
            $(event.row).each(function (i, k) {
                if ($.inArray(k.id, defaultid) == -1)
                    datasrc.push(k);
                $(datasrc).each(function (j, l) {
                    if (k.id == l.id) {
                        arrindex.push(j + 1);
                        if (k.hasOwnProperty("remoteUpdate"))
                            datasrc[j].remoteUpdate = k.remoteUpdate;
                        if (k.hasOwnProperty("localUpdate"))
                            datasrc[j].localUpdate = k.localUpdate;
                    }
                });
            });
            break;
    }
    colmodel.push({
        name: 'myac'
                , width: 50
                , fixed: true
                , formatter: 'actions'
                , formatoptions: { keys: true }
    });
    //opt:option 추가 사항
    var opt = {
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: datasrc,
        height: "auto",
        autowidth: true,
        editurl: "clientArray",
        rowNum: 5,
        rowList: [5, 10, 20, 30],
        emptyrecords: "Nothing to display",
        pager: pagerid
    };
    switch (gridid) {
        case "grid1":
            opt.multiselect = true;
            break;
        case "grid2": case "grid3":
            opt.onCellSelect = function (rowid, index, contents) {
                var cm = $(this).jqGrid("getGridParam", "colModel");
                if ($(contents).attr("name") == "icon") {
                    faLoad($(contents).attr("id"), "", "jquery");
                }
            }
            break;

    }
    if (gridid == "grid3") {
        opt.multiselect = true;
    }
    //jqGridCustom(gridid, opt);
    var jq = $("#" + gridid);
    jq.jqGrid("GridUnload");
    jq.jqGrid(opt);
    switch (gridid) {
        case "grid2": case "grid3":
            jqPagerAdd(gridid, pagerid, [false, false, false, false, false], []);
            var inlineparams = {
                //                addParams: { useFormatter: false },
                //                editParams: {
                //                    aftersavefunc: function (id) {
                //                        var rowData = jQuery('#'+gridid).jqGrid('getRowData', id);
                //                    }
                //                },
                add: true,
                edit: true,
                save: true,
                cancel: true,
                del: true,
                addParams: { position: "last" }
            };

            jq.jqGrid('inlineNav', "#" + pagerid, inlineparams);
            break;
    }
    switch (gridid) {
        case "grid1":
            $(arrindex).each(function (i, k) {
                jq.jqGrid("setSelection", k);
            });
            break;
        case "grid3":
        $(arrindex).each(function (i, k) {
            $("#grid3 tr").eq(k).trigger("click");
        });
            break;
    }
}
function jqGridCustom(gridid, opt) {
    var jq = $("#" + gridid);
    //jq.jqGrid("GridUnload");
    jq.jqGrid(opt);
}
function jqEventSave(gridid) {
    var event = {}, setting={},elist = [], ename = ["pager", "pagercustom", "row"];
    for (var j = 0; j < 3; j++) {
        var jq = $("#grid" + [j + 1]);
        event[ename[j]] = [];
        //if has checkbox
        if (jq.jqGrid('getGridParam', 'multiselect'))
            var myIDs = jq.jqGrid('getGridParam', 'selarrrow');
        else
            myIDs = jq.getDataIDs(); //all row index as array
        for (i in myIDs) {
            var myRow = jq.jqGrid('getRowData', myIDs[i]);
            $(myRow).each(function (i, k) {
                if(event[ename[j]]=="row")
                if(typeof k.id=="undefined") k.id=k.title;
                event[ename[j]].push(k);
            })
        }
    }
    setting.inline = $("#cbInline").is(":checked");
    setting.keycolumn = $("#selKeycolumn").val();
    setting.addedcolumn = $("#selAdded").val();
    event.setting = setting;

    var ctr = selectimctable(menuid, subid, gridid);
    ctr.event = event;
    updateimctable(menuid, subid, gridid, ctr);
}
//jqEditEvent end
function dtpick(element, opt) {
    //date & time
    $(element).datetimepicker({
        changeYear: true,
        changeMonth: true,
        showButtonPanel: true,
        dateFormat: 'yyyy/MM/dd',
        defaultDate: new Date($(element).val()),
        minDate: new Date(1990, 0, 1),
        maxDate: new Date(2020, 0, 1),
        onSelect: function (value, date) {
            var mth = date.selectedMonth + 1;
            $(element).val(date.selectedYear + "/" + mth + "/" + date.selectedDay);
        },
        showOn: 'focus'
    });
}
function dpick(element, opt) {
    //date only
    $(element).datepicker({
        changeYear: true,
        changeMonth: true,
        showButtonPanel: true,
        dateFormat: 'yyyy/MM/dd',
        defaultDate: new Date($(element).val()),
        minDate: new Date(1990, 0, 1),
        maxDate: new Date(2020, 0, 1),
        onSelect: function (value, date) {
            var mth = date.selectedMonth + 1;
            $(element).val(date.selectedYear + "/" + mth + "/" + date.selectedDay);
        },
        showOn: 'focus'
    });
}
//#endregion
//#endregion
