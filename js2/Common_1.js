//#region login
function menuTree(treediv,options) {
    var nav, ul, li, ah, i, dv, data, img, btn,htitle,list="";
    var jstree = $('#' + treediv);
    var ttllist = menuMy("submenu");//selectimc("imctable", menutoggle+"submenu");
    if (typeof ttllist !="undefined")
    list = $.grep(ttllist, function (a) {
        return a.menuid == menuid;
    });
    switch (treediv) {
        case "imcMenu":
            htitle=$('#selTopmenu option:selected').text();
            break;
        case "dvtable":
            htitle = $("#inpTitle").val();
            break;
    }
    if (typeof htitle=="undefined" | htitle=="") htitle = "Top Menu";
    var data = [{ id: menuid, text:htitle, parent: "#", icon: "fa fa-home" }];
    if (list.length > 0)
    //    data.push({ id: "j" + menuid+"_1", text: "new page", parent: menuid, icon: "fa fa-question-circle" })
    //else
        $.each(list, function (i, k) {
            if (k != null && k.menuid == menuid) {
                var set = {};
                set.id = k.subid;
                if (k.hasOwnProperty("text")) set.text = k.text;
                if (k.hasOwnProperty("parent")) set.parent = k.parent;
                if (k.hasOwnProperty("icon")) set.icon = "fa " + k.icon;
                if (k.hasOwnProperty("href")) set.href = k.href;
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
            , "initially_open": ["root"]
        }
        , "dnd": {
            "drop_finish": function () {
                //alert("DROP");
                swal({ title: "DROP!", text: "I will close in 2 seconds.", timer: 2000, showConfirmButton: false });
            },
            "drag_check": function (data) {
                if (data.r.attr("id") == "phtml_1") {
                    return false;
                }
                return {
                    after: false,
                    before: false,
                    inside: true
                };
            },
            "drag_finish": function (data) {
                //alert("DRAG OK");
                swal({ title: "Drag OK!", text: "I will close in 2 seconds.", timer: 2000, showConfirmButton: false });
            }
        }
        , "plugins": ["contextmenu", "types", "dnd", "json_data"]
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
        , "contextmenu": {
            "items": customMenu1
        }
    })
    .on("loaded.jstree", function (event, data) {
        //$(this).jstree("open_all");
        var depth = 3;
        data.instance.get_container().find('li').each(function (i) {
            if (data.instance.get_path($(this)).length <= depth) {
                data.instance.open_node($(this));
            }
        });
        $($("#" + treediv).find("i")[0]).css("display", "none");
    })
    .on('changed.jstree', function (event, data) {
        ////contextmenu일경우 작동 방지
        var evt = window.event;
        if (typeof (evt) != "undefined") {
            var button = evt.which || evt.button;
            if (button != 1 && (typeof button != "undefined")) return false;
        }
        var node = data.instance.get_node(data.selected[0]);
        subid = node.id;
        $("#inpName").val(node.text);
        $("#inpId").val(node.id);
        $("#inpParent").val(node.parent);
        $("#lbicon").text(node.icon);
        if (node.hasOwnProperty("icon") && node.icon != "")
            $("#lbicon").prev().attr("class", node.icon + " fa-lg");
        switch (treediv) {
            case "dvtable":
                setTimeout(function(){menuEditDialog(event, node)},0);
                break;
            case "imcMenu":
                initEdit(); redips.init(); menuEditReload();
                break;
        }
        menuopen();
        //$("#inNodename").val(node.text);
    })
    .on('delete_node.jstree', function (e, data) {
        if (delsure) {
            updateimctable(menuid, data.node.id, "", "");
            var control = menuMy("control");//selectimc("imctable", menutoggle+"control");
            $(control).each(function (i, k) {
                if (k != null)
                    $(k).each(function (j, l) {
                        if (l.menuid = menuid && l.subid == data.node.id)
                            control.splice(i, 1);
                    });
            });
            imcsetting("imctable", menutoggle+"control", JSON.stringify(control));
            delsure = false;
        }
        //resettree();
        ////menuid, data.node.id, ""
        //var button = e.which || e.button;
        //if (button != 1 && (typeof button != "undefined")) return false;
    })
    .on('create_node.jstree', function (e, data) {
        //update_item('new', data.node.parent, 0, data.node.text);
        var rdt = {};
        rdt.menuid = menuid;
        rdt.subid = data.node.id;
        rdt.table = [];
        rdt.text = data.node.text;
        rdt.parent = data.node.parent;
        if (menutoggle == "template")
            rdt.templatetype == templatetype;
        //if(menutoggle!="template")
        //updateimctable(menuid, data.node.id, "", rdt);
    })
    .on("move_node.jstree", function (e, data) {

        //console.log(data.node.id, data.old_parent, data.parent, data.old_position, data.position);
         var nd = selectimctable(menuid, data.node.id);
         //////parentnode change
         nd.parent = data.parent;
         updateimctable(menuid, data.node.id, '', nd);
         //////order change////
         //current node
         var alltree = jstree.jstree(true).get_json('#', { flat: true });
         var odr = [];
         $.each(alltree, function (i, k) { if (k.id != "0") odr.push(k.id); });
         //submenu order change하여 갈아끼기
         var sublist = menuMy("submenu");//selectimc("imctable", menutoggle+"submenu");
         sublist = jstreeOrder(sublist, odr, "subid");
         var imctb = localStorage.getItem("imctable");
         if (imctb != "") {
             imctb = JSON.parse(imctb);
             var imc = updateimcJson(imctb, menutoggle+"submenu", sublist);
             localStorage.setItem("imctable", JSON.stringify(imc));
         }
     });
        //newly create할 때만 생성, node create후 reload할 때는 중지
        switch (options.display) {
            case "textbox":
                makejstreediv(treediv, {textbox:"inNodename", valuebox:"inNodeid"});

                $(".ddlTextbox").attr("style", "padding:1px;margin-top:3px;");
                $(".ddlDiv").attr("style", "width:180px;height:350px;margin-top:30px;");
                dv = $("<div style='text-align:right;padding:2px;background-color:#DBDBDB;'/>");
                btn = $("<button>Edit</button>").button({
                    icons: {
                        primary: "ui-icon-pencil"
                    },
                    text: false
                })
                .css("font-size", "1em")
                .click(function (event) {

                    event.preventDefault();
                    var container = $(".ddlDiv"); container.css("visibility", "hidden");
                    menuEdit();
                });
                dv.append(btn);
                btn = $("<button>Edit</button>").button({
                    icons: {
                        primary: "ui-icon-multiple"
                    },
                    text: false
                })
                .css("font-size", "1em")
                .click(function (event) {
                    event.preventDefault();
                    var container = $(".ddlDiv"); container.css("visibility", "hidden");
                });
                dv.append(btn);
                $(".ddlDiv").prepend(dv);
                //$("#imcMenu").selectmenu();
                //current subdiv 표시
                $.each(data, function (i, k) {
                    if (k.subid == subid)
                        $("#inNodename").val(k.text);
                });
                break;
        }
        function customMenu1($node) {
        var tree = jstree.jstree(true);
        var items = {
            "Create": {
                "separator_before": false,
                "separator_after": false,
                "label": "Create",
                "action": function (obj) {
                    $node = tree.create_node($node);
                    tree.edit($node);
                }
            },
            "Edit": {
                "separator_before": false,
                "separator_after": false,
                "label": "Edit",
                "action": function (obj) {
                    menuEditDialog(obj.position, $node);
                }
            },
            "Delete": {
                "separator_before": false,
                "separator_after": false,
                "label": "Remove",
                "action": function (obj) {
                swal({
                    title: "Are you sure to remove this category?"
                    ,text: "You will not be able to recover this file!"
                    ,   type: "warning"
                    ,   showCancelButton: true
                    ,   confirmButtonColor: "#DD6B55"
                    ,   confirmButtonText: "Yes, delete it!"
                    ,   cancelButtonText: "No, never!"
                    ,   closeOnConfirm: true
                    ,   closeOnCancel: true },
                    function (isConfirm) {
                        if (isConfirm) {
                            delsure = true;
                            tree.delete_node($node);
                            setTimeout(function () { $("#dvNodeedit").parent().empty(); $("#dvNodeedit").hide(); }, 500);
                            setTimeout(function () { $("#dvNodeedit").empty(); }, 1000);
                        }
                });
                }
            }
        }
        return items;
        }

        function customMenu2(node) {
            var items = {
                'item1': {
                    'label': 'item1',
                    'action': function () { /* action */ }
                },
                'item2': {
                    'label': 'item2',
                    'action': function () { /* action */ }
                }
            }

            if (node.type === 'level_1') {
                delete items.item2;
            } else if (node.type === 'level_2') {
                delete items.item1;
            }

            return items;
        }
}
var delsure = false;
function jstreeOrder(json, orderlist,keyname) {
    var rtn = [];
    $.each(orderlist, function (i, k) {
        $.each(json, function (j, l) {
            if(l !=null)
            if (l[keyname] == k)
                rtn.push(l);
        });
    });
    return rtn;
}
function menuopen() {
    //if menuopen checked: make menu/table style float, else remove style

    var mstyle = selectimctable(menuid, '', '');

    $("#dvMenu1").removeAttr("style");
    $("#tableinsert").removeAttr("style");
    if (typeof (mstyle) != "undefined" && mstyle != "") {
        if (mstyle.menuopen | mstyle.keepopen | pinstatus) {
            $("#menu").attr("class", "show");
        }
    }
}

function changesubid(id) {
    subid = id;
    //check thumbTab before reload menu

    initDisplay('', '');
    //maintain thumbTab status
//    if (pinstatus) {
//        $("#menu").toggleClass("show");
//      $("#thumbTab").removeClass("thumbTab").addClass("thumbTab on");
//      $("#thumbTab").attr("src", "/images/pindown.png");
//    }
}
function menuData() {
    var data = [];

    var mainlist = menuMy("menu");//selectimc("imctable", "menu");
    var ttllist = menuMy("submenu");//selectimc("imctable", "submenu");
    $.each(mainlist, function (i, k) {
        if (k != null) {
            var set = {};
            set.parent = "#";
            set.id = k.menuid;
            if (k.hasOwnProperty("title")) set.text = k.title;
            set.icon = "fa fa-folder";
            data.push(set)
        }
    });
    $.each(ttllist, function (i, k) {
        if (k != null) {
            var set = {};
            set.id = k.subid;
            if (k.hasOwnProperty("text")) set.text = k.text;
            if (k.hasOwnProperty("parent")) set.parent = k.parent;
            if (k.hasOwnProperty("icon")) set.icon = "fa " + k.icon;
            data.push(set)
        }
    });
    return data;
}
var menutoggle = "",templatetype = "common";
function menuEditInit() {
    if (menutoggle == "template"){
        if (localStorage.getItem("imctemplate") == null) {
            localStorageinit({ include: ['imctemplate'] });
        }
        
        setTimeout(function () { menuEdit(); }, 1000);
    }
    else {
        menuEdit(); //initbtn()
    }

    $("#dveditback").css({ "top": 0, "left": "5px" });
}
//global param for click/dblclick
var DELAY = 700, clicks = 0, timer = null;
function menuEdit() {
    var conarr = {};
    conarr.id = "dveditback";// "dvmenuedit";
    //tab create
    conarr.parent = "dvadmin";
    var tabarr = {};
    if ($("#tab-Menu").length > 0) {
        $("#tab-Menu").remove();
        $("#EditTab").remove();
    }
     //if (menutoggle == "adminmenu") return false;
    tabarr.id = "tab-Menu";
    tabarr.head = ["Setting", "Data","Style"];
    var content = [];
    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input  id='openinit' type='button' value='Init' class='btnRoundsmall' style='margin-right:5px' onclick=\"menuInit();$('#dvadmin').empty()\"/>"
    btn += "<input  id='menuSave' type='button' value='Save' class='btnRoundsmall' style='margin-right:5px' onclick=\"menuEditSave();\"/>";
    btn += "<input id='menuCancel' type='button' value='Close' class='btnRoundsmall'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();menutoggle='admin';\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + menuid + "</label>";
    var code = "Code:<label id='lbMenucode'>" + menuid + "</label>";
    code += "<span  class='imcolor' onclick=\"addnode();\"><i class='fa fa-plus-square fa-lg' style='color:#6E8298;margin:0 3px 0 5px;'/><small>add</small></span>";
    code += "<span  class='imcolor' style='margin-left:10px;' onclick=\"resetTab();\"><i class='fa fa-undo fa-lg' style='color:#6E8298;margin:0 3px 0 5px;'/><small>reset</small></span>";
    var tb = "<table width='100%'><tr><td colspan='2'>" + btnlist().prop('outerHTML'); + "</td></tr>";
    tb += "<tr><td style='width:55%;vertical-align:top;'>" + code + "<div id='dvbefore'/><div id='dvtable' style='padding:5px 0 5px 0;'></div></td>";
    tb += "<td style='vertical-align:top;'><div id='dvMenusetting'/><div id='dvNodeedit'/>";
   tb+= "<tr><td colspan='2'>" + btn + "</td></tr></table>";

    content.push(tb);
    content.push(makeDatasrc());
    
    tabarr.content = content;
    var tab = makeTab(tabarr);
    //container complete
    conarr.body = tab;
    var container =makeContainer(conarr);
  
   menuTree("dvtable", {display: "" });
   menuEditTable();
   menuTemplate(); 
   $('input[type = "button"]').button();

    //tabclick event
    var tabb = $('#' + tabarr.id),first=true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                   // selectEdit(selid);
                    break;
                case 1:
                    dataTabClick(menuid);
                    break;
                case 2:
                    //3rd Tab style
                case 3:
                    if (first)
                        //cssEditInit("Style", "", "");
                    first = false;
                    break;
            }
        }
    });
  
    var sid = "1";
    if (menutoggle == "open") sid = 'open';
    $("#ulmenu>li").each(function (i, k) {
        if (i == 0)
            selectedmenu($(k), "init");
    });
   
    //right float button insert
    var ic = "user", title = "user edit menu";
    $("#dvtemplatecontain").hide();
    switch (menutoggle){
        case "admin":
            ic = "wrench";
            title = "admin edit menu";
            break;
        case "open":
            ic = "users";
            title = "before login edit menu";
            break;
        case "template":
            ic = "mortar-board";
            title = "create service temlate like crm,sales etc";
            $("#dvtemplatecontain").show();
            break;
    }
    var setbtn = $("<div style='float:right;padding:2px 7px 0 0;'></div>");
    setbtn.attr("title", "user edit menu");
    setbtn.append(
    $('<i/>', {
        id: 'itoggle',
        title: title,
        class: 'fa fa-' + ic + ' fa-2x imdim',
        style:'color:gray;'
    })
    );
    //use both of click,dblclick
    setbtn.on("click", function (e) {
        clicks++;  //count clicks
        if (clicks === 1) {
            timer = setTimeout(function () {
                setbtndialog();
                clicks = 0;  //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer);  //prevent single-click action
            menutoggling(); menuEditInit();  //perform double-click action
            clicks = 0;  //after action performed, reset counter
        }
    }).dblclick(function (e) {
        e.preventDefault();
    });
    $($("#tab-Menu").find("ul")[0]).append(setbtn);
    if(menutoggle=="template")
        setTimeout(function () { $("#seltemplate").val(templatetype); }, 100);

    setTimeout(function () {
        $("#ulmenu").sortable({
            revert: true,
            // items: "li:not(#1)",
            stop: function (event, ui) {
                if (!ui.item.data('tag') && !ui.item.data('handle')) {
                    ui.item.data('tag', true);
                    // ui.item.fadeTo(400, 0.1);
                }
            }
        });
        $("#ulmenu").disableSelection();
    }, 500);
    function btnlist() {
        var sty = "#dvbtnmenu{width: 100%; margin-bottom:10px;border-bottom:solid 1px #AEAEAE;min-height:30px }";
        sty += "#ulmenu { list-style-type: none; }";
        sty += " #ulmenu li { padding: 1px; width: 100px;text-align:center; height: 27px; float:left;font-size: 1em;cursor:pointer;";
        sty +="-moz-border-radius-topleft: 50px;border-top-left-radius: 5px;; -moz-border-radius-topright: 50px;border-top-right-radius: 5px;}";
        sty += ".selectli {min-height:36px !important;border-top:solid 5px #800000 !important;margin-top:-9px !important;}";
        sty += ".newaddli{border:dashed 2px yellow !important;}";
        styleInsert("dvbtnmenu", sty);
      
        var contain = $("<div id='dvbtnmenu'/>").droppable({
            drop: function (event, ui) { }
        });
        var ul = $("<ul id='ulmenu'/>");
        var mlist = menuMy("menu");
       // if (menutoggle == "template") mlist = selectimc("imctemplate", menutoggle + "menu");
        if (typeof mlist != "undefined" && mlist != "") {
           // mlist.sort(srt);
            mlist.sort(function (a, b) {
                return parseFloat(a.odr) - parseFloat(b.odr);
            });
            $(mlist).each(function (i, k) {
                var title = "new menu"; if (k.hasOwnProperty("title")) title = k.title;
                var delicon = delbtn(k.menuid);
                //if (k.menuid.replace(menutoggle, "") == "1") delicon = "";
                var li = $("<li class='ui-state-default' id='" + k.menuid + "'>" + title + delicon + "</li>");
                li.attr("onclick", "selectedmenu($(this));");
                ul.append(li)
                contain.append(ul);
            });
        }
        else {
            var li = $("<li class='ui-state-default' id='"+menutoggle+findmaxnum()+"'>new menu</li>");
            li.attr("onclick", "selectedmenu($(this));");
            ul.append(li)
            contain.append(ul);
        }
         var addtab = "<i id='iadd' class='fa fa-plus-square fa-2x imdim' style='color:#800000' onclick='addbtn()'/>";
        contain.append($("<div style='float:right;margin:0 5px 10px 0;padding-bottom:10px;'>"+addtab+"</div>"));
        function srt(a, b) {
            if (a.odr == b.odr) { return 0 } return a.odr > b.odr ? 1 : -1;
        }
       
        return contain;
    }
    function menuTemplate() {
        var templatelist = "common;crm";
        var contain = $("<div id='dvtemplatecontain' style='margin-bottom:5px;display:none'/>");
        contain.append($("<span style='margin:right:5px'>Template:</span>"));
        var sel = makeCtr(["select", templatelist, "seltemplate", "inp","onchange:templatetype=$(this).val();menuEdit()" ]);
        contain.append($(sel));
        contain.append($("<i class='fa fa fa-plus-square fa-lg imdim' style='margin:0 5px 0 5px;'/>"))
        contain.append($("<i class='fa fa fa-pencil-square fa-lg imdim'/>"))
        $("#dvMenusetting").prepend(contain);
       
        contain.find('.fa-pencil-square').click(function () { edittemplate($("#seltemplate").val()) });
        contain.find('.fa-plus-square').click(function () { edittemplate('') });
        function edittemplate(code) {
            var name = "", desc = "";
            if (code == "") code = "template" + idMake();
            var data = [
              [makeCtr(["span", "Type", , , ]), makeCtr(["span", "Value", , , ])]//headers
              , ["code", makeCtr(["input", code, "inpTitle", "", ])]
              , ["name", makeCtr(["input", name, "inpTitle", "", ])]
              , ["desc", makeCtr(["input", desc, "inpTitle", "", ])]
            ];

            var tb = makeTable("tbtemplateedit", data, "general");
            tb.dialog({
                height: 'auto'
             , width: 400
             , modal: false
             , minHeight: 'auto'
             , title: "Template edit"
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
                            var permit = saveTable("tbtemplateedit"), rtn = [], rtn1 = [];
                            $(permit).each(function (i, k) {
                                console.log(k[1])
                                if (typeof k[1] != "undefined")
                                    rtn.push(k[1]);
                                var txt = $('#sel' + k[0] + ' option:selected').text();
                                if (txt != "select")
                                    rtn1.push(txt);
                            });
                            if (rtn.length > 0) {
                                $("#" + inpid).val(rtn.join(','));
                                $("#" + lbid).text(rtn1.join(','));
                            }
                            $(this).dialog('destroy').remove();
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
            }).parent().css({ "z-Index": 300, top: 250 });;
        }
    }
    function setbtndialog() {
        var templatepkg = ["common", "crm"];
        var data = [
           [makeCtr(["div", "Type", , , ]), makeCtr(["div", "Value", , , ])]//headers
       , ["add", makeCtr(["select:multiselect", templatepkg.join(";"), "selpkg", "inp", ""])]
       , ["before", makeCtr(["select", "append;reset", "selbefore", "inp", ""])]
        ];
        var tb = makeTable("tbsetbtn", data, "general");
        var dv = $("<div/>");
        dv.append(tb);
        dv.dialog({
            position: { my: "left", at: "top", of: "#tab-Menu" },
            width: 310,
            height: 300,
            modal: false,
            appendTo: "#tab-Menu",
            open: function () {
                $("#selpkg").multipleSelect({ width: 200 });
            },
            close: function (event, ui) {
                $(this).dialog('destroy').remove();
            },
            buttons: {
                Apply: function () {
                    var menuarr = $("#selpkg").multipleSelect("getSelects");
                    var befinsert = $("#selbefore").val();
                    menubatchinsert(menuarr, befinsert);
                    $(this).dialog('destroy').remove();
                },
                Cancel: function () {
                    $(this).dialog('destroy').remove();
                    $("#dvNodeedit").empty();
                }
            }
        });
        dv.dialog("moveToTop");
    }
}
function findmaxnum() {
    var storename = 'imctable', rtn = 1;
    if (menutoggle == "template") storename = "imctemplate";
    var mlist1 = selectimc(storename, menutoggle + "menu");
    if (mlist1 != "")
        $(mlist1).each(function (i, k) {
            var num = parseInt(k.menuid.replace(menutoggle, ""))
            if (num >= rtn)
                rtn = num + 1;
        });
    return rtn;
}
function menutoggling(that) {
    if (getlogin().group == "SystemAdmins") {
        switch (menutoggle) {
            case "":
                menutoggle = "admin";
                menuid = 'admin1';
                break;
            case "admin":
                menutoggle = "open";
                menuid = 'open1';
                break;
            case "open":
                menutoggle = "template";
                menuid = 'template1';
                break;
            case "template":
                menutoggle = "";
                break;
        }
       
    }
}
function menubatchinsert(arr,befinsert) {
    menubatchinsert.rtnfunc = rtnfunc;
    jsonReadallAjax("imctemplate", menubatchinsert.rtnfunc,[arr.join(","),befinsert]);
   
    function rtnfunc(dt,arrjoin,befinsert) {
        var imctb = localStorage.getItem("imctable");
        if (imctb == null) localStorage.setItem("imctable", "{}");
        if (imctb != "")
            imc = JSON.parse(imctb);

        var arr = arrjoin.split(','),dtt;
        var list = ["menu", "submenu", "control"];
        $(list).each(function (i, k) {
            dtt=dt["template"+k];
            $(dtt).each(function(a,b){
                if ($.inArray(b.templatetype, arr) > -1) {
                    if(menutoggle!="open") b.comp = getlogin().comp;
                    if (b.hasOwnProperty("menuid")) b.menuid = b.menuid.replace("template", menutoggle);
                    if (b.hasOwnProperty("parent")) b.parent = b.menuid.replace("template", menutoggle);
                    if (b.hasOwnProperty("subid")) b.subid = menutoggle + b.subid;
                    if (b.hasOwnProperty("dvid")) b.dvid = menutoggle + b.dvid;
                    switch (befinsert) {
                        case "reset":
                            imc[menutoggle+k] = [];
                            break;
                    }
                    imc[menutoggle + k].push(b);
                }
            });
           
        });
        localStorage.setItem("imctable", JSON.stringify(imc));
        jsonSaveAjax("imctable", JSON.stringify(imc));
        menuEdit();
    }
}
function addnode() {
    var parent = menuid;
    var node = { id: "j"+idMake(), text: "new page" };
    $('#dvtable').jstree('create_node', parent, node, 'last');
}
function removenode(id) {
    $('#dvtable').jstree("delete_node", "#"+id);
    updateimctable(menutoggle + menuid, id, "", "");
    var control = selectimc("imctable", menutoggle+"control");
    $(control).each(function (i, k) {
        if (k != null)
            $(k).each(function (j, l) {
                if (l.subid == id)
                    control.splice(i, 1);
            });
    });
    imcsetting("imctable", menutoggle+"control", JSON.stringify(control));
}
function resetTab() {
    if (checkCookie('Reset_Tab_Content'))
        execode();
    else
    swal({
        title: "Are you sure?"
        , text: "<div>You will not be able to recover this file!</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('Reset_Tab_Content');\">Don't ask</a></div>"
        , type: "warning"
        , showCancelButton: true
        , confirmButtonColor: "#DD6B55"
        , confirmButtonText: "Yes, reset it!"
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
        var list = [menutoggle+"submenu", "control"];
        var imctb = localStorage.getItem("imctable");
        var imc = JSON.parse(imctb);
        $(list).each(function (i, k) {
            var sel = selectimc("imctable", k);
            var s = '', c = '', adjust = 0;
            $(sel).each(function (j, l) {
                if (typeof l != "undefined" && l != null && l.hasOwnProperty("menuid") && l.menuid == menuid) {
                    sel.splice(j - adjust, 1);
                    adjust++;
                }
            });
            imc[k] = sel;
        });
        localStorage.setItem("imctable", JSON.stringify(imc));
        //menuid = 1;
        menuEdit();
    }
}
function selectedmenu(that,init) {
    var id = that.attr("id");
    if (id == menuid && init!="init") return false;

    $(that.siblings()).each(function (i, k) {
        $(k).removeClass("selectli");
    });
    that.addClass("selectli");
    $('#lbMenucode').text(id);
    menuid = id;
    resettree();
    menuEditTable();
    menuTree('dvtable', { display: '' });
    $("#inpTitle").on("keyup", function () {
        var txt = $(this).val();
        that.html(txt + delbtn(id));
        //$("#lbMenucode").text(txt);
    });
}
function resettree() {
    var treediv = "dvtable";
    $("#" + treediv).remove();
    $("<div id='" + treediv + "' style='padding:5px 0 5px 0;'/>").insertAfter($("#dvbefore"));

}
function retree(val) {
    menuid = val;
    //if(menutoggle !="open")
    //menutoggle = "";
    clearDiv('imcMenu');
    menuTree('imcMenu', { display: '' });
    //menutoggle = "admin";

}
function delbtn(id) {
    //delete button at topmenu tab
    var rtn = "<i style='float:right;margin:5px 2px 0 5px' onclick=\"menuid='" + id + "';menuEditDel()\" class='fa fa-remove imcolor'/>";
    return rtn;
}
function addbtn() {
    var mlist;// = menuMy("menu");
    var storename = 'imctable';
    if (menutoggle == "template") {
        storename = 'imctemplate';
    }
    mlist = selectimc(storename, menutoggle + "menu");
    //find maxnumber
    var num = 0;
 
    $(mlist).each(function (i, k) {
        if (parseInt(k.menuid.replace(menutoggle,"")) >= num)
            num = parseInt(k.menuid.replace(menutoggle,"")) + 1;
    });
    var newbtn = $("<li class='ui-state-default newaddli' id='"+menutoggle + num + "'>new menu"+delbtn(menutoggle+num)+"</li>");
    newbtn.attr("onclick", "selectedmenu($(this));");
    newbtn.appendTo($("#ulmenu"));
    selectedmenu(newbtn);
}
function menuEditDialog(e, node) {
    menuEditDialog.process = process;
    $("#dvNodeedit").empty();
    var urls = [], urls1 = [];
    urls.push("N/A,");
    $(extlink).each(function (i, k) {
        urls.push(k.name + "," + k.url);
        urls1.push(k.url);
    });
    var data = [
        [makeCtr(["div", "Type", , , ]), makeCtr(["div", "Value", , , ])]//headers
    , ["parent", makeCtr(["div", node.parent, "spParent", "", ])]
    , ["id", makeCtr(["div", node.id, "spId", "", ])]
    , ["name", makeCtr(["input", node.text, "inpName", "inp", ])]
    , ["icon", makeCtr(["i", , , node.icon, ]) + "&nbsp;" + makeCtr(["span", node.icon, "lbicon", "inp", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnediticon", "btnRoundsmall", "onclick:faLoad('lbicon','" + node.icon + "')"])]
    , ["href", makeCtr(["select", urls.join(";"), "selHref", "inp", ""]) + makeCtr(["input", , "inpHref", "display:none;width:150px", ]) + " use iframe:" + makeCtr(["input:checkbox", node.useiframe, "cbUseiframe", , ]) + makeCtr(["button", "<i class='fa fa-exchange'/>", "btn", "btnRoundsmall", "onclick:togglechg('inpHref','selHref')"])]
    , ["help", makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnedithelp", "btnRoundsmall", ])]
    ]
    if(getlogin()!="" && $.inArray(getlogin().group, ["CommonAdmins", "SystemAdmins"]) > -1)
        data.push( ["permission", makeCtr(["span", node.original.permissionname, "lbPermission", "inp", ]) + makeCtr(["input", node.original.permission, "inpPermission", "display:none", ]) + "&nbsp;" +
            makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnAuthorize", "btnRoundsmall", "onclick:menuPermission('lbPermission','inpPermission')"])]);
    var tb = makeTable("tbNode", data, "general");
    if (e == null | e == '') e = window.event;
    $("#dvNodeedit").append(tb);
    $("#dvNodeedit").dialog({
        position: [e.x, e.y],
        width: "410px",
        modal:true,
        appendTo: "#dvtable",
        open: function () {
            $('.ui-dialog-titlebar-close').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only');
            $('.ui-dialog-titlebar-close').append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
            $("#tbNode").css("width", "100%");
            $("#dvNodeedit").parent().css("margin", "20px 0 0 20px");
        },
        close: function (event, ui) {
            $(this).dialog('close');
        },
        buttons: {
            Delete: function () {
                swal({
                    title: "Are you sure?"
           , text: "<div>You will not be able to recover this file!</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('Remove_Tab');\">Don't ask</a></div>"
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

                   removenode(node.id);

                   setTimeout(function () {
                       $("#dvNodeedit").dialog('destroy').remove();
                   }, 0);

               }
           });
            },
            "Save": function () {
                menuDialogSave();
                $(this).dialog('close');
            },
            Cancel: function () {
                $(this).dialog('close');
                $("#dvNodeedit").empty();
            }
        }
    });
    $("#dvNodeedit").addClass('helpinsert').attr("help", 'menudialog');
    helpinsert();
    if (node.hasOwnProperty("href")) {
        if ($.inArry(node.href, urls1) > -1) $("#selHref").val(node.href);
        else $("#inpHref").val(node.href);
    }
    $("#dvNodeedit").parent().css({ "z-Index": 300, top: 100 });
    $("#btnedithelp").on("click", function () {
        jsonReadAjax("imchelp", "", "code", node.id, menuEditDialog.process)
    });
    function process(dt) {
        contentEdit("", { gdt: dt, src: "help" });
    }
   // $($("#dvNodeedit").parent()).find(".ui-dialog-titlebar").hide();
    if (node.hasOwnProperty("original")) {
        if (node.original.hasOwnProperty("href")) {
            $("#inpHref").val(node.original.href).show();
            $("#selHref").hide();
        }
        if (node.original.hasOwnProperty("useiframe")) {
            $("input:checkbox[id='cbUseiframe']").attr("checked", node.original.useiframe);
        }
    }
}
function menuEditTable() {
    //dvMenusetting
    var menu = "", menulist = menuMy("menu");//selectimc("imctable", menutoggle + "menu");
    $(menulist).each(function (i, k) {
        if(k.menuid==menuid)
         menu=k;
    });
    var ti='', pll='',pl='',de='',w = '', mo = '', ko = '', po = '', bc = '', fs = '',pv='',pn='';
    if (typeof (menu) != "undefined" && menu != "") {
        ti = menu.title;
        pl = menu.page;
        de = menu.default;
        w = menu.width;
        mo = menu.menuopen;
        ko = menu.keepopen;
        po = menu.position;
        bc = menu.backcolor;
        fs = menu.fontsize;
        pn = menu.permissionname;
        pv = menu.permission;
    }
    else {
        w = 150;
        mo = false;
        ko = false;
        po = "left";
        bc = "#4A6184";
        fs = "18";
    }
    var temp = "";
    if ($("#dvtemplatecontain").length > 0)
         temp = $("#dvtemplatecontain");
    $("#dvMenusetting").empty();
    if(temp!="")
    $("#dvMenusetting").append(temp)
    var urls = [], page1 = ["N/A,"];
    $(extlink).each(function (i, k) {
        urls.push(k.grp);
    })
    urls = $.unique(urls);
    pll = "N/A,;" + urls.join(";");
    var pagelist = menuMy("submenu");//selectimc("imctable", menutoggle+"submenu");
    if (typeof pagelist != "undefined") {
        pagelist = $.grep(pagelist, function (a) {
            return a.menuid == menuid;
        });
         $(pagelist).each(function (i, k) {
            page1.push(k.text + "," + k.subid);
        });
    }
    var data = [
    [makeCtr(["span", "Type", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["title", makeCtr(["input", ti, "inpTitle", "", ])]
    , ["page", makeCtr(["select", pll, "selPage", "", "onchange:menuPageinsert($(this))"])]
    , ["default", makeCtr(["select", page1.join(";"), "selDefault", "", ""])]
    , ["width", makeCtr(["input", w, "inpWidth", "", ])]
    , ["menuOpen", makeCtr(["input:checkbox",mo , "cbmenuOpen", , ])]
    , ["keepOpen", makeCtr(["input:checkbox",ko , "cbkeepOpen", , ])]
    , ["Position", makeCtr(["select", "left,left;top,top;right,right;bottom,bottom", "selPosition", "inp", ])]
    , ["BackColor", makeCtr(["input:color", bc, "inpColor", "inp", ])]
    , ["Font-Size", makeCtr(["span", "example", "spFontsize", "font-family:Lato, sans-serif;text-align:justify;font-size:14px;", ])
    + "&nbsp;"+makeCtr(["button", "<i class='fa fa-chevron-circle-up'/>", "", "", "onclick:$('#spFontsize').css('font-size',parseInt($('#spFontsize').css('font-size')) + 2)"])
    + "&nbsp;" + makeCtr(["button", "<i class='fa fa-chevron-circle-down'/>", "", "", "onclick:$('#spFontsize').css('font-size',parseInt($('#spFontsize').css('font-size')) - 2)"])
    ]
    , ["mainmenu", makeCtr(["select", "select,;core;clean;simple;mint;blue", "selmainmenu", "inp", ])]
    , ["topmenu", makeCtr(["select", "select,;core;clean;simple;mint;blue", "seltopmenu", "inp", ])]
    , ["theme","<div id='switcher' class='switcher' style='padding-top:5px;'/>"]
    ];
    if (getlogin() != "" && $.inArray(getlogin().group, ["CommonAdmins", "SystemAdmins"]) > -1)
        data.push(["permission", makeCtr(["span", pn, "lbPermission1", "inp", ]) + makeCtr(["input", pv, "inpPermission1", "display:none", ]) + "&nbsp;" +
        makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnAuthorize", "btnRoundsmall", "onclick:menuPermission('lbPermission1','inpPermission1')"])]
);
    var tb = makeTable("tbMenusetting", data, "general");
    $("#dvMenusetting").append(tb);

    $("#tbMenusetting").css("width", "100%");
    if (ti != "") $("#inpTitle").val(ti);
    if (pl != "") $("#selPage").val(pl);
    if (de != "") $("#selDefault").val(de);
    if (po != "") $("#selPosition").val(po);
    if (bc != "") $("#inpColor").val(bc);
    if (fs != "") $("#spFontsize").css("font-size", fs);
    if (pn != "") $("#lbPermission1").text(pn);
    if (pv != "") $("#inpPermission1").val(pv);

    //themeroller init
    var theme = "cupertino";
    //var menu = selectimctable(menuid);
    if (typeof menu !="undefined" && menu.hasOwnProperty("theme")) theme = menu.theme;
    $("#switcher").themeswitcher({
        imgpath: "/js2/jquery-themeroller/images/",
        loadTheme: theme
    });

    $("#progressbar").progressbar({
        value: 37
    });
    $("#slider").slider({
        value: 37
    });

}

function menuPageinsert(that) {
    //delete group objects
    var storename = 'imctable';
    if (menutoggle == 'template') storename = 'imctemplate';
    var imctb = localStorage.getItem(storename);
    var imc = JSON.parse(imctb);
    var sel = menuMy("submenu");//selectimc("imctable", menutoggle + "submenu");
    var adjust = 0;
    $(sel).each(function (j, l) {
        if (typeof l != "undefined" && l != null && l.hasOwnProperty("menuid") && l.menuid == menuid) {
            if (l.subid.indexOf("j" + menuid + "_b") >= 0) {
                sel.splice(j - adjust, 1);
                adjust++;
            }
        }
    });
    imc[menutoggle+"submenu"] = sel;
    localStorage.setItem(storename, JSON.stringify(imc));

    //insert batch object
    var list = [];
    if (that.val() != "") {
        $(extlink).each(function (i, k) {
            if (k.grp == that.val()) {
                list.push(k);
            }
        })

        $(list).each(function (i, k) {
            var rdt = {};
            rdt.menuid = menuid;
            rdt.subid = "j" + menuid + "_b" + i;
            rdt.text = k.name;
            rdt.parent = menuid;
            rdt.useiframe = true;
            rdt.icon = "fa-align-justify";
            rdt.href = k.url;
            updateimctable(menuid, rdt.subid, "", rdt);
            setTimeout(function () { iframeInsert(menuid, rdt.subid); }, 400);
        });
    }
    //tree update
    clearDiv("dvtable");
    $("#dvNodeedit").empty();
    //tree insert
    setTimeout(function () { menuTree("dvtable", { display: "" }); }, 100);
}
function menuDialogSave() {
    var rdt = {},imc;
    var useiframe = $("input:checkbox[id='cbUseiframe']").is(":checked");
     rdt.comp = getlogin().comp;
    rdt.menuid = menuid;
    if (menutoggle == 'template') {
        rdt.templatetype = templatetype;
    }
    rdt.subid = $("#spId").text();
    rdt.text = $("#inpName").val();
    var p = $("#spParent").text();
    if (p == "" | p == "undefined") p = menuid;
    rdt.parent = p;
    rdt.icon = $("#lbicon").text().replace("fa ", "");
    var self = $("#selHref").val(), inpf = $("#inpHref").val();
    var hrf = (self == "") ? inpf : self;
    if (hrf != "") {
        rdt.href = hrf;
        rdt.useiframe = useiframe;
    }
    rdt.permissionname = $("#lbPermission").text();
    rdt.permission = $("#inpPermission").val();
    var storename = 'imctable';
    if (menutoggle == "template") {
        storename = 'imctemplate';
        var imctb = localStorage.getItem(storename);
        if (imctb == null) localStorage.setItem(storename, "{}");
        if (imctb != "")
             imc = JSON.parse(imctb);
        if (imc.hasOwnProperty(menutoggle + 'submenu')) {
            var submenu = imc[menutoggle + 'submenu'], keylist = [],  chkexist = false;;
            $(submenu).each(function (x, y) {
              
                if (y.menuid == menuid && y.subid == $("#spId").text()) {
                    submenu.splice(x, 1, rdt);
                    chkexist = true;
                }
            });
            if (!chkexist)
                submenu.push(rdt);
        }
        localStorage.setItem(storename, JSON.stringify(imc));
        jsonSaveAjax(storename, JSON.stringify(imc));

        //updateimc(storename, menutoggle + 'submenu', rdt, "subid", $("#spId").text());
        //jsonUpdateAjax(storename, menutoggle + 'submenu', JSON.stringify(rdt), "subid", $("#spId").text());
    }
    else {
        updateimctable(menutoggle + menuid, $("#spId").text(), "", rdt);
        remoteimcupdate(storename);
    }
   //tree update
    clearDiv("dvtable");
    $("#dvNodeedit").empty();
    //tree insert
    setTimeout(function () { menuTree("dvtable", { display: "" }); }, 100);

    //iframe insert
    var chkexist = false;
    var mymenu=menuMy("submenu");//
    if (useiframe && hrf !="") {
        $(mymenu).each(function (i, k) {
            if (menuid == k.menuid && subid == k.subid && k.dvid == "hc0")
                chkexist = true;
        });
        if (!chkexist)
            iframeInsert(menuid,subid);
    }
}
function iframeInsert(mid,sid) {
    var href="";
    var imctb = localStorage.getItem("imctable");
    imctb = JSON.parse(imctb);

    //submenu: add table
    var sublist = imctb.submenu;
    $(sublist).each(function (i, k) {
        if (mid == k.menuid && sid == k.subid) {
            k.table = [[{ "id": 0, "style": "vertical-align:top;:", "dv": [{ "id": "hc0", "clas": "drag blue1 ifrm", "style": "width: 650px; border-style: solid; cursor: move;", "txt": "ifrm" }] }]];
            k.width = "660px";
            href=k.href;
        }
    });

    //control:insert
    var ctrlist = imctb.control;
    ctrlist.push({ "datacode": "", "menuid": mid, "subid": sid, "dvid": "hc0", "setting": { "src": href + "^", "width": "100^%", "height": "100^%", "scrolling": "no"} });

    localStorage.setItem("imctable", JSON.stringify(imctb));
    ////remote upload
    //if (remote)
    //    localStorageUpAjax(getlogin().comp, getlogin().id, "imctable", JSON.stringify(imctb));
}
function clearDiv(id) {
    //before remove create another div and rename
    $("#"+id).after($("<div id='"+id+"1'/>"));
    $("#" + id).remove();
    $("#"+id+"1").attr("id", id);
}
function menuPermission(lbid,inpid) {
    $("#dvPermission").remove();
    var dvcontain = $("<div id='dvPermission'/>");
    var usergrp = "User,CommonUsers;Admin,CommonAdmins";
    if (getlogin().comp == "1")
        usergrp += ";imc,SystemAdmins";
    var data = [
      [makeCtr(["span", "Option", , "width:150px", ]), makeCtr(["span", "Value", , "width:150px", ])]//headers
     , ["group", makeCtr(["select", usergrp, "selgroup", "inp", ""])]
    ];
    if (getlogin().comp == "1")
        data.push(["svclevel", makeCtr(["select", "select,;free,SL00000001;basic,SL00000002;Enterprise,SL00000003;Unlimited,SL00000004", "selsvclevel", "inp", ""])]);
    
    var tb = makeTable("tbPermission", data, "general1"),confine="";
    switch (lbid){
        case "lbPermission":
            confine="#dvtable";
            break;
        case "lbPermission1":
            confine="#dvMenusetting";
            break;
    }


    dvcontain.append(tb);
    //styleInsert("general1", ".general1{width:350px}");
    dvcontain.dialog({
        height: 'auto'
         , width: 400
        ,appendTo: confine
    //,open: function () {
    //    $('.ui-dialog-titlebar-close').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only');
    //    $('.ui-dialog-titlebar-close').append('<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span>');
    //    //$("#tbNode").css("width", "100%");
    //   // $("#dvCsscontain").parent().css("margin", "20px 0 0 20px");
    //}
         , modal: false
         , minHeight: 'auto'
         , title: "Menu Access Authorization"
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
                    var permit = saveTable("tbPermission"),rtn=[],rtn1=[];
                    $(permit).each(function (i, k) {
                        console.log(k[1])
                        if(typeof k[1]!="undefined")
                        rtn.push(k[1]);
                        var txt = $('#sel' + k[0] + ' option:selected').text();
                        if(txt!="select")
                        rtn1.push(txt);
                    });
                    if (rtn.length > 0) {
                        $("#" + inpid).val(rtn.join(','));
                        $("#" + lbid).text(rtn1.join(','));
                    }
                    $(this).dialog('destroy').remove();
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
    }).parent().css({ "z-Index": 300, top: 250 });;
    dvcontain.addClass('helpinsert').attr("help", 'menuaccess');
    helpinsert();
    $("#selsvclevel>option").first().css({ "display": "none" });
    //assign value
    var permit = $("#" + inpid).val();
    if (permit != "") {
        permit = permit.split(',');
        $("#selgroup").val(permit[0]);
        $("#selsvclevel").val(permit[1]);
    }
}
function menuEditSave() {
    //menu setting
    var set = {};
    set.menuid = menuid;
      var storename = 'imctable';
    if (menutoggle == "template") {
        storename = 'imctemplate';
        set.templatetype = $("#seltemplate").val();
    }
    set.comp = getlogin().comp;
    set.title = $("#inpTitle").val();
    set.page = $("#selPage").val();
    set.default = $("#selDefault").val();
    set.contType = $("#selConttype").val();
    set.width = $("#inpWidth").val();
    if ($("#cbmenuOpen").is(":checked")) set.menuopen = true; else set.menuopen = false;
    if ($("#cbkeepOpen").is(":checked")) set.keepopen = true; else set.keepopen = false;
    set.position = $("#selPosition").val();
    set.backcolor = $("#inpColor").val();
    set.fontsize = $("#spFontsize").css("font-size");
    var  curtheme = $(".jquery-ui-switcher-title").text().replace("Theme: ", "").toLowerCase().replace(" ", "-");
    set.theme = curtheme;
    set.permissionname = $("#lbPermission1").text();
    set.permission = $("#inpPermission1").val();

    var imctb = localStorage.getItem(storename);
    if (imctb == null) localStorage.setItem(storename, "{}");
    if (imctb != "")
        imc = JSON.parse(imctb);
      if (imc.hasOwnProperty(menutoggle + 'menu')) {
          var menu = imc[menutoggle + 'menu'], keylist = [];

        
          if (menu.length == 0)
              menu.push(set);
          $("#ulmenu>li").each(function (i, k) {
              keylist.push($(k).attr("id"));
          });

        $("#ulmenu>li").each(function (i, k) {
            var chkexist = false;
            $(menu).each(function (x, y) {
                if ($.inArray(y.menuid, keylist) == -1 && menutoggle=='template' &&  y.templatetype==templatetype) {
                    menu.splice(x, 1);
                }
                if (y.menuid == set.menuid) {
                    menu.splice(x, 1, set);
                    chkexist = true;
                }
            });
            if (!chkexist) {
                menu.push(set);
            }
        });
          //reorder
        $("#ulmenu>li").each(function (i, k) {
            $(menu).each(function (x, y) {
                if (y.menuid == $(k).attr("id")) {
                    y.odr = i;
                }
            });
        });
    }
      localStorage.setItem(storename, JSON.stringify(imc));
      jsonSaveAjax(storename, JSON.stringify(imc));
    //dashed border remove
      var del = "";
      $("#ulmenu").find("li[id^='" + menuid + "']").removeClass("newaddli");
      setTimeout(function () {
          //imcMenu update
          menuEditReload();
      }, 0);

}
function menuEditReload() {
    clearDiv("imcMenu"); menuTree("imcMenu", { display: "" });
    //reappend topmenu
    var topm = menuMy("menu"), list = [], tlist = "";//selectimc("imctable", menutoggle+"menu")
    $(topm).each(function (i, k) {
        list.push(k.title + "," + k.menuid);
    });
    tlist = list.join(";");
    var st = makeCtr(["select", tlist, "selTopmenu", "ddlTextbox|width:90%;padding:5px;margin:5px;", "onchange:retree($(this).val())"]);
    $("#selTopmenu").remove();
    $("<div/>").append(st).insertBefore($("#imcMenu"))
    $("#selTopmenu").val(menuid);

    var curtheme = $(".jquery-ui-switcher-title").text().replace("Theme: ", "").toLowerCase().replace(" ", "-");
    var theme, csshref, menu = selectimctable(menuid);
    if (typeof menu == "undefined") menu = selectimctable(menutoggle + "1");
    if (typeof menu != "undefined" && menu.hasOwnProperty("theme")) theme = menu.theme;

    if (theme != curtheme) {
        $("#jstheme").remove();
        csshref = "/js2/jquery-ui-themes-1.11.4/" + curtheme + "/theme.css";
        cssInsert("jstheme", csshref);
    }
}
function menuEditDel() {
    if (menuid == menutoggle + "1") swal({ title: "You can't delete Home", text: "I will close in 2 seconds.", timer: 2000, showConfirmButton: false });
    else {
        if (checkCookie('Remove_Tab'))
            execode();
        else
        swal({
            title: "Are you sure?"
            , text: "<div>You will not be able to recover this file!</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('Remove_Tab');\">Don't ask</a></div>"
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
    }
    function execode() {
        var list = [menutoggle + "menu", menutoggle + "submenu", menutoggle + "control"];
        var storename = 'imctable';
        if (menutoggle == 'template') storename = 'imctemplate';

        var imctb = localStorage.getItem(storename);
        var imc = JSON.parse(imctb);
        $(list).each(function (i, k) {
            var sel = selectimc(storename, k);
            var m = '', s = '', c = '', adjust = 0;
            $(sel).each(function (j, l) {
                if (typeof l != "undefined" && l != null && l.hasOwnProperty("menuid") && l.menuid == menuid) {
                    sel.splice(j - adjust, 1);
                    adjust++;
                }
            });
            imc[k] = sel;
        });
        localStorage.setItem(storename, JSON.stringify(imc));
        menuid = 1;
        menuEdit();
    }
}
function adminpage(pagename) {
    //for admin menu: create div,insertafter dvTitle,remove `
    $("#tableinsert").remove();
    var clientid='';
    $("#dvadmin").show().empty();
    $("#splistdata").remove();
    if ($("#dvadmin").length == 0)
        $("<div id='dvadmin' style='padding:0 10px 0 5px'/>").insertAfter($("#dvTitle"));
    var x = 0;
    switch (pagename) {
        case "datalist":
            $("#dvadmin").append($(makeDatasrc()));
            jsonReadAjax("imcdata", "", "", "", dataList);
            break;
        case "csslist":
            if ($("#dvCsscontain").length > 0) $("#dvCsscontain").remove();
            $("#dvadmin").append($("<div id='dvCsscontain'/>"));
            jsonReadAjax("imcsetting", "csslist", "", "", cssList);
            break;
        case "content": case "map": case "form": case "googlechart": case "fullcalendar": case "jstree": case "jqgrid": case "pivot":
            menutoggle = "admin";
            jsonReadAjax("imclist", pagename, "", "", archiveList, [{ type: pagename }]);
            //archiveList({type:pagename});
        break;
        case "menu":
            //menutoggle = "";
            menuEditInit();
            //setTimeout(function () { 
            //menutoggle = "admin";
            //mtogg = "admin";
            //}, 500);
            break;
        case "page":
            //menutoggle = "";
            //if (umenuid == "") {
            //    umenuid = "1";
            //    var sub = menuMy("submenu");//selectimc("imctable", "submenu");
            //    if (sub.length > 0)
            //        usubid=sub[0].subid;
            //}
            //menuid = umenuid;
            //subid = usubid;
            $("#dvadmin").empty(); initEdit(); redips.init();
            x = 1000;
            mtogg = "admin";
            break;
        case "openpage":
            setTimeout(function () {
            menutoggle = "open";
                //omenuid = "open1";
                //var sub = selectimc("imctable", "opensubmenu");
                //if (sub.length > 0)
                //    osubid = sub[0].subid;
            omenuid = menuid;
            osubid = subid;
             //menuid = omenuid; subid = osubid; //menuselected();
             $("#dvadmin").empty(); initEdit(); redips.init(); menuEditReload();
            }, 1000);
            x = 1000;
            mtogg = "admin";
            break;
      
        case "language":
            funLoading(true);
            multilangReadListAjax();
            multilangReadAjax();
            //multilangWordmake();
            setTimeout(function () { multilangList(); funStop(); }, 2000);
            x = 2000;
            break;
        case "preference":
            funLoading(true);
            jsonReadAjax("imcsetting","preference","","",personalSetting);
            //setTimeout(function () {
            //    personalSetting();
            //    funStop();
            //}, 2000);
            x = 1200;
            break;
        default:
            //funStop();
            //setTimeout(function () {
            //    menutoggle = "admin";
            //    $("#dvadmin").empty(); initEdit(); redips.init(); menuEditReload();
            //}, 1000);
            //x = 1000;
            //if (pagename != "undefined") {
            //    var option = {};
            //    option.src = pagename;
            //    iframeappend("dvadmin", option);
            //}
            break;
    }
    setTimeout(function () {multilangInject(); },x+1000)
}

//#endregion


//#region connectstring
function connectList(cstr) {
    var data = [];//[[makeCtr(["span", "Cookie", , , ]), makeCtr(["span", "Use", , , ])]];
    var contain = [];
    var dv = $("<div/>");
    if (typeof cstr != "undefined" && cstr != "") {
        $(cstr).each(function (i, k) {
            var nlist = k.data.split(";"), conn = [], tit = [], titcontain = [];
            $(nlist).each(function (a, b) {
                var bb = b.split("=");
                if ($.inArray(bb[0], ["Code", "Title", "DBtype"]) == -1)
                    conn.push(b);
                else {
                    $(["Code", "Title", "DBtype"]).each(function (c, d) {
                        if (d == bb[0])
                            tit.push({ odr: c, val: bb[1] })
                        if (i == 0 && a == 0)
                            titcontain.push(d);
                    });
                }
            });
            if (i == 0) {
                titcontain.push("ConnectStr"); titcontain.push(""); titcontain.push("");
                data.push(titcontain);
            }
            contain = [];
            $(sortJSON(tit, 'odr', '123')).each(function (a, b) {
                contain.push(b.val);
            });
            var constr = conn.join(";");
            if (constr.split("").length > 80) constr = conn.join(";").substring(0, 80) + "....";
            contain.push($("<span title='" + conn.join(";") + "'>" + constr + "</span>").prop("outerHTML"));
            contain.push(makeCtr(["i", "fa fa-pencil", , , ""]));
            contain.push(makeCtr(["i", "fa fa-trash", , , ""]));
            data.push(contain);
        });
    }
    else {
        data.push(["Code","title","DBtype","ConnectStr","",""]);
    }
    var tb = makeTable("tbconnect", data, "general");
    var foot = ['<button type="button" style="padding:0 3px 0 3px;">new</button>|{"colspan":"6","style":"text-align:right;padding:5px;"}'];
    contain = appendFooter(tb, foot);
     
    return contain;
}
function connectRowEvent() {
    //connectList edit & del button click eventhandler
    $("#tbconnect>tbody>tr>td").find(".fa-pencil").click(function (e) {
        var str = "", option = {};
        $($(this).parent().siblings()).each(function (i, k) {

            if (i < 3) {
                var $th = $(k).closest('table').find('th').eq($(k).index());
                var name = $th.text().toLowerCase();
                option[name] = $(k).text();
                str += $(k).text() + ";";
            }
            else if (i == 3) {
                var cstr = $(k).find("span").attr("title").split(";");
                $(cstr).each(function (a, b) {
                    var bb = b.split("=");
                    option[bb[0].toLowerCase()] = bb[1]
                })
            }

        })
        str += $(this).parent().prev().find("span").first().attr("title");
        option.rtnid = "tbconnect";
        connectstringEdit(option.dbtype, option);

    });
    delRowdelegate("tbconnect");
}
function sortJSON(data, key, way) {
    //sorting in general
    //var tit=[{odr:0,name:'abc'},{odr:1,name:'def'}]
    //sortJSON(tit, 'odr', '123')
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}
function connectstringEdit(dbtype,option) {
    var dia = $("<div />"), data1 = [];
    dia.dialog({
        autoOpen: true,
        modal: true,
        height: 400,
        width: 400,
        title: "DB Connection String",
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: "Update",
                click: function () {
                    var list = saveTable("tbconnect1");
                    var str = [], prefix=[],dbtype = "",code="";
                    $(list).each(function (i, k) {
                        if (k != "") {
                            if( i>2)
                                str.push(k[0] + "=" + k[1]);
                            else
                                prefix.push(k[0] + "=" + k[1]);
                            switch(i){
                                case 0:
                                    code=k[1];
                                    break;
                                case 2:
                                    dbtype=k[0] + "=" + k[1];
                                    break;
                            }
                        }
                    });
                    var rtntb = $("#" + option.rtnid);
                    switch (rtntb.prop('tagName').toLowerCase()) {
                        case "table":
                            var codetd = rtntb.find("td:contains('" + list[0][1] + "')");
                            if (codetd.length > 0) {
                                var sib = codetd.parent().children();
                                for (var i = 0; i < 3 ; i++) {
                                    sib.eq(i).text(list[i][1])
                                }
                                sib.eq(3).find("span").attr("title", str.join(";"));
                                sib.eq(3).find("span").text(str.join(";").substring(0, 80) + "...");
                            }
                            else {
                                var contain = [], conn = [];
                                for (var i = 0; i < list.length; i++) {
                                    var li = list[i];
                                    if (i < 3)
                                        contain.push(li[1]);
                                    else {
                                        conn.push(li[0] + "=" + li[1]);
                                    }
                                }
                                var constr = conn.join(";");
                                if (constr.split("").length > 80) constr = conn.join(";").substring(0, 80) + "....";
                                contain.push($("<span title='" + conn.join(";") + "'>" + constr + "</span>").prop("outerHTML"));
                                contain.push(makeCtr(["i", "fa fa-pencil", , , ""]));
                                contain.push(makeCtr(["i", "fa fa-trash", , , ""]));
                                appendTableRow(rtntb, contain);
                                connectRowEvent();
                            }
                            break;
                        case "span": case "label":
                            rtntb.text(dbtype + ";" + str.join(";"));
                            rtntb.attr("title", dbtype + ";" + str.join(";"));
                            var json = { code: code, data: prefix.join(";") + ";" + str.join(";") };
                            console.log(JSON.stringify(json), prefix.join(";"), str.join(";"), code)
                            if ($("#dvsavetoserver").find("input").is(":checked")) {
                                jsonUpdateAjax("imcsetting", "preference.connectstring", JSON.stringify(json), "code", code);
                            }
                            break;
                        case "input": case "textarea":
                            rtntb.val(dbtype+";"+str.join(";"));
                            break;
                    }
                  
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
    var data = [];//[[makeCtr(["span", "Cookie", , , ]), makeCtr(["span", "Use", , , ])]];
    var contain = [],code="",title="";
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("code")) code = option.code;
        if (option.hasOwnProperty("title")) title = option.title;
    }
    data1.push(["", ""]);
    data1.push([makeCtr(["label", "Code", , , ]), code]);
    data1.push([makeCtr(["label", "Title", , , ]), makeCtr(["input",title , ,"width:95%" , ])]);
    data1.push([makeCtr(["span", "DBtype", , "width:100px", ]),
        makeCtr(["select", "select,;mssql;mysql;oracle;ODBC,odbc;", "seldbtype", "width:99%", ""])]);
    var tb = makeTable("tbconnect1", data1, "general");
    dia.append(tb);
    if (typeof dbtype == "undefined") dbtype = "mssql";
    createstring(dbtype, option);
    dia.find("select").on("change", function () {
        createstring($(this).val().toLowerCase(),option);
    });
    function createstring(dbtype, option) {
        var code = "con" + idMake(),codechk="", title = "";
        if (typeof option != "undefined") {
            if (option.hasOwnProperty("code")) {
                code = option.code;
                codechk = option.code;
            }
            if (option.hasOwnProperty("title")) title = option.title;
        }
        var list = {
            "mysql": "server,user,database,port,password", "oracle": "Driver,Server,UID,PWD"
               , "odbc": "Driver,Server,UID,PWD", "mssql": "Data Source,Initial Catalog,User ID,Password"
        };
        $("#tbconnect1>tbody>tr").not(":eq(3)").remove();
        $("#dvsavetoserver").remove();
        $(list[dbtype].split(",")).each(function (i, k) {
            var name = "";
            var k1=k.toLowerCase();
            if (typeof option != "undefined") {
                if (option.hasOwnProperty(k1)) name = option[k1];
            }
            appendTableRow($('#tbconnect1'), [makeCtr(["span", k, , ]), makeCtr(["input",name , "", "width:95%", ])]);
        });
        
        prependTableRow($('#tbconnect1'), [makeCtr(["input",title , "inpname", "width:95%", ]), makeCtr(["span", "Title", , ])]);
        prependTableRow($('#tbconnect1'), [makeCtr(["span", code, "lbid", "", ]), makeCtr(["span", "Code", , ])]);
        $("#seldbtype").val(dbtype);
        var cb = $("<input type='checkbox'/>");
        var lb = $("<span>save to server</span>");
        var dv = $("<div id='dvsavetoserver' style='text-align:right;padding:5px 0 0 0;'/>").append(cb).append(lb);
        cb.on("change", function () {
            $("#tbconnect1>tbody>tr:eq(1)").toggle();
            $("#tbconnect1>tbody>tr:eq(2)").toggle();
        });
        dv.insertAfter($('#tbconnect1'));
        if (option.rtnid == "tbconnect") {
            dv.hide();
        }
        else if (codechk == "") {
            $("#tbconnect1>tbody>tr:nth-child(1)").hide();
            $("#tbconnect1>tbody>tr:nth-child(2)").hide();
        }
        else {
            cb.prop("checked", true);
        }
    }
}
function connectstringSave() {
    var list = $("#tbconnect>tbody>tr");
    var set,constr=[];
    $(list).each(function (i, k) {
        var ch = $(k).children();
        set = {};
        set.code = ch.eq(0).text();
        set.data="";
        for (var i = 0; i < 3; i++) {
            var $th = ch.eq(i).closest('table').find('th').eq(i);
            set.data += $th.text() + "=" + ch.eq(i).text()+";";
        }
        set.data += ch.eq(3).find("span").attr("title");
        constr.push(set);
    });
    return constr;
}
//#endregion

//#region DataSource
function makeDatasrc() {
    var dtcode = "<label for='lbDatacode'>Datacode :</label><label id='lbDatacode'></label><button onclick='deldata()'>Delete</button>";
    var usecode = "<label for='lbCtrcode'>Data for :</label><label id='lbCtrcode'></label>";
    var selsrc = "";//makeCtr(["select", "--select--,;localStorage,localStorage;Remote,remote;직접입력,input", "selSrc", "multiple", "onchange:showbysrc($(this))"]);
    var view = "<div id='dvdataedit' style='padding:5px 0 5px 0;'></div>";
    var list = "<table id='tbDatalist'></table><div id='dvDatalistpager'></div>";
    //tab 사용시
//    cssInsert("/App_Themes/tab/tabs-min.css");
//    var tabarr = {};
//    tabarr.id = "tabs-min";
//    tabarr.class="tabs-min";
//    tabarr.head = ["Source", "Filter", "Ajax"];
//    var content = [];
//    content.push(selsrc);
//    content.push(filter);
//    content.push("");
//    tabarr.content = content;
//    var tab = makeTab(tabarr);
    //    return tab;

    //tab미사용
    if ($("#tbData").length > 0) $("#tbData").remove();
    var tb = $("<table />"), tr, td, lbl, dv, btn;
    tb.attr("id", "tbData");
    tb.attr("style", "width:100%");

    //edit,new tr
    tr = $("<tr/>");
    tr.attr("id", "trDataedit");
    td = $("<td />");
    td.attr("style", "vertical-align:top;");
    td.attr("id", "tdSrc");

    td.append(dv);
    tr.append(td);
    td = $("<td />");
    td.attr("id", "tdEdit");
    td.attr("style", "vertical-align:top;width:500px;");
    td.append($(view));
    tr.append(td);
    tb.append(tr);

    //list tr
    tr = $("<tr />");
    tr.attr("id", "trDatalist");
    td = $("<td />");
    td.attr("colspan", "2");
    td.append($(list));
    tr.append(td);
    tb.append(tr);

   //buton tr
    tr = $("<tr />");
    td = $("<td />");
    td.attr("colspan", "2");
    td.attr("id", "tdBtnlist");
    td.attr("style", "text-align:right;");
    btn = $("<input id='inpCancel' type='button' class='btnRound ui-icon-calculator' value='List' style='margin-left:5px;' onclick='jsonReadAjax('imcdata', '', '', '', dataList);'/>");
    td.append(btn);
    btn = $("<input id='inpApply' style='margin:0 0 0 5px;' type='button' class='btnRound ui-icon-disk' value='Save' onclick='saveData()'/>");
    td.append(btn);
    tr.append(td);
    tb.append(tr);
    //button init
    $("input[type='button']").button();
    return tb.outerHTML();
}
function delData() {
    var ctrid = $("#lbCtr").text();
    var ctr = selectimctable(menuid, subid, ctrid);
    ctr.datacode;
    updateimctable(menuid, subid, ctrid, JSON.stringify(ctr));
}
function getParams() {
    //ex:http://www.example.com/?me=myValue&name2=SomeOtherValue
    //var me = getParam()["me"]; var name2 = getParam()["name2"];
    var vars = [], hash;
    if (window.location.href.indexOf('?') > -1) {
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push("@" + hash[0]);
            vars["@" + hash[0]] = hash[1];
        }
    }
    return vars;
}

function accordmake1(accord,head,content) {
    //if ($("#accordion2").legth > 0) $("#accordion2").remove();
//    var accord = $("<div />").accordion({
//        event: "click",
//        collapsible: true,
//        active: 0
//    });
    accord.append("<h3>"+head+"</h3>");
    accord.append("<div>"+content+"</div>");
    accord.accordion("refresh");

    return accord;
}
function Locallist() {
    //localStorage에 있는 storename/dataname을 select로 생성
    if ($("#selLocal")) {
        $("#selLocal").remove();
        $("label[for='selLocal']").remove();
    }
    var sel = document.createElement('select');
    sel.id = "selLocal";
    sel.setAttribute("onchange", "accordmake();dataEdit('')");
    var optg = document.createElement('optgroup');
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode("--select--"));
    sel.appendChild(opt);
    var locallist = ["imcsetting","googledata"];
    $.each(localStorage, function (i, k) {
        if ($.inArray(i,locallist)>-1) {
            optg = document.createElement('optgroup');
            optg.setAttribute("label", i);
            sel.appendChild(optg);
            var json = localStorage.getItem(i);
            json = JSON.parse(json);
            $.each(json, function (key, data) {
                if (key != "updated") {
                    opt = document.createElement('option');
                    opt.value = key;
                    opt.appendChild(document.createTextNode(key));
                    optg.appendChild(opt);
                }
            })
        }
    });
    lbl = $("<label />");
    lbl.attr("for", "selLocal");
    lbl.html("Local  :  ");
    //convert object to string
    return lbl.outerHTML() + $(sel).outerHTML();
}
function dataEdit(dt) {
//    if (selval == "") {
//        selval = $('#selLocal :selected').val();
//        label = $('#selLocal :selected').parent().attr('label');
    //    }
    var json = "";
    //var jj=selectimcdata("imcdata", selval);
    if (dt.hasOwnProperty("datalist")) {
        json = JSON.stringify(dt.datalist);

        $("#txdataedit").val(json);
        if ($("#indataedit").length == 0) {
            var inp = $("<input id='indataedit' type='hidden'></inpt>");
            $('body').append(inp);
        }
        $("#indataedit").val(json);

        jqAuto("tbdatagrid", "datapager", JSON.parse(json)
            , { width: 475, shrinkToFit: true, fixed: true, autowidth: false });


        //data setting
        var data = [[makeCtr(["span", "Name", , , "width:130px"]), makeCtr(["span", "Value", , , ])]];
        //var dt = selectimcdata("imcdata",selval);// $("#lbDatacode").text());
        //"code":"dt150401080416","comp":"acuvue","title":"ttst","descript":"","dtype":"1","updateinterval":"","keycode":["code"],"sort":[{"sortname":"name","sortorder":"1 ","sortexpression":"asc"}]
        var dtype = "";
        switch (dt.dtype) {
            case "1":
                dtype = "query";
                break;
            case "2":
                dtype = "procedure";
                break;
            default:
                if(dt.hasOwnProperty("dtype"))
                dtype = dt.dtype.toUpperCase();;
                break;
        }
        data.push(["Datacode", makeCtr(["span", dt.code, "spDatacode", "", ])]);
        data.push(["Own comp", dt.comp]);
        data.push(["Title", dt.title]);
        data.push(["Description", dt.descript]);
        data.push(["Data Type", dtype]);
        if (dt.hasOwnProperty("keycode")) data.push(["Key Field", dt.keycode]);
        if (dt.hasOwnProperty("hide")) data.push(["Hidden Field", dt.hide]);
        if (dt.hasOwnProperty("sort")) data.push(["Sorting", JSON.stringify(dt.sort)]);
        data.push(["Last Update", dt.updated]);
        data.push(["Update Interval", dt.updateinterval]);
        var tb = makeTable("event122", data, "general");
        var onclick = "$('#dveditback').hide();";
        switch (dtype.toLowerCase()) {
            case "Input":
                onclick += "dataInputLoad('" + dt.code + "')";
                break;
            case "procedure": case "query": case "":
                onclick += "databaseLoad('" + dt.code + "')";
                break;
            case "excel": case "csv":
                onclick += "dataExcelLoad('" + dt.code + "')";
                break;
            case "json": case "xml":
                onclick += "dataJsonLoad('" + dt.code + "')";
                break;
        }
        // if (dt.dtype == "input") onclick = "dataInputLoad('" + dt.code + "')";
        onclick = "$('#dveditback').hide();datacallback('" + dtype + "', '" + dt.code + "')";
        var foot = ['<input type="button" class="btnRoundsmall" value="edit" onclick="' + onclick + '" style="padding:0 3px 0 3px;" />' +
    '|{"colspan":"2","style":"text-align:right;padding:2px 0 2px 0;"}'];
        var tb1 = appendFooter(tb, foot);
        $("#tdSrc").empty();
        $("#tdSrc").append(tb1).prepend("▶ Data Summary");
    }
}
function accordioncss() {
 style = ".ui-accordion .ui-accordion-content {padding:5px !important;}";
    style += ".ui-accordion .ui-accordion-header-inactive  {margin-top: -10px; !important;}";
    style += ".container {width:100% !important;}";
    style += "h3 {margin:0 !important;}";
    styleInsert("accordion-css", style);
}
function accordmake(dt, filter) {
    $("#dvdataedit").empty();
    if ($("#txdataedit").length == 0) {
        var inp = makeCtr(["textarea", , "txdataedit", "width:99%;height:300px;", ]);
    }
    else {
        //$("#txdataedit").empty();
        $("#tbdatagrid").jqGrid("GridUnload");
    }
    accordioncss();

    var accord = $("#accordion");
    if (accord.length == 0) {
        var accord = $("<div/>").accordion({
            event: "click",
            collapsible: true,
            active: 1,
            heightStyle: "content"
        }); ;
        accord.attr("id", "accordion");
        $("#dvdataedit").append(accord);

        //Filter create
        if ($("#tbFilter").length > 0)
            $("#tbFilter").remove();
        if ($("#dvFilter").length > 0)
            $("#dvFilter").remove();
        //var dt = selectimcdata("imcdata", datacode);
        if (typeof datareturn == "object") dt = datareturn;
        var tb = makeFilter(dt,filter);
        tb.attr("id", "tbFilter");
        $("<div id='dvFilter'/>").append(tb);

        accord.append("<h3>Data Filter</h3>");
        accord.append("<div>" + tb.prop('outerHTML') + "</div>");
        accord.accordion("refresh");

        //datatable
        accord.append("<h3>Data Table</h3>");
        accord.append("<div><table id='tbdatagrid'></table><div id='datapager'></div></div>");
        accord.accordion("refresh");
        //json model
        accord.append("<h3>json model</h3>");
        accord.append("<div style='overflow-y:scroll;overflow-x: hidden;'>" + inp + "</div>");
        accord.accordion("refresh");
    }
    paginathing("#tbFilter");
    //column type dropdown change
    $(".coltypeclass").on("change", function () {
        coltypechg($(this), dt.datalist);
    });
   
    $('#tbFilter').on('change', 'input:checkbox.incb', function () {
        var $inpts = $(this).closest('tr').find('input:text,button,select').prop('disabled', this.checked);
        var fieldname = $(this).closest('tr').find('td:first');
        if (this.checked) {
            fieldname.css("text-decoration", "line-through");
        }
        else
            fieldname.removeAttr('style');
    }).find('input:checkbox.incb').change();
    $("#tbFilter").find("input#inpFilterrefresh").on("click", function () {

        var filtered = applyFilter(dt.datalist, saveFilter("tbFilter"));
        previewData(filtered);
        $("#spdataajax").text(JSON.stringify(appliedFilter()))
        $("#spdlist").text(JSON.stringify(filtered));
    });
    $("#tbFilter").find("input#inpFilterexpand").on("click", function () {
        cloneFilter($("#tbFilter"),dt);
    });
    $("#tbFilter>tbody").sortable();
}
function savemycal() {
    //dialog datasrc save
    var rtn = saveData_dialog();
    var calid = $("#lbCtr").text();
    var id = $("#lbId").text();
    mycalSave();
    if (rtn != "")
        var ctr = selectimctable(menuid, subid, calid), title = "";
    if (!ctr.setting.field.hasOwnProperty("mycal"))
        ctr.setting.field.mycal.push(rtn);
    else {
        var chk = false;
        $(ctr.setting.field.mycal).each(function (i, k) {
            if (k.id == $("#lbId").text()) {
                k.datacode = rtn.datacode;
                k.field = rtn.field;
                k.filter = rtn.filter;
                chk = true;
                return false;
            }
        });
        if (!chk) {
            ctr.setting.field.mycal.push(rtn);
        }
    }
    updateimctable(menuid, subid, $("#lbCtr").text(), ctr);
    mycalDialog(calid, id);
}
function saveData_dialog() {
    //request한 control에 datacode저장
    var rtn = "";
    var reqcode = $("#lbCtr").text();
    if (reqcode != "") {
        var json = {};
        var imctb = selectimctable(menuid, subid, reqcode);
        json.datacode = $("#lbDatacode").html();
        json.filter = saveFilter("tbFilter");
        var field = saveTable("tbFieldselect");
        //json.title = $("#inpTitle").val();
        var f = [], set = {};
        $(field).each(function (i, k) {
            if (k[0]) {
                f.push(k);
            }
        });
        json.field = f;
        rtn = json;
    }
    else
        swal({
            title: "<span style='color:#F8BB86'>Error!<span>"
            , text: "Control code가 지정되지 않았습니다."
            , timer: 2000
            , showConfirmButton: false
            , html: true
        });
    return rtn;
}
var datareturn = "";
function saveDataCallback() {
    selectimctable(menuid, subid, reqcode);
}
function saveData(return_json) {
    //return_json: if true return json
    var data = {},odrlist=[],arcode="",artype="",curdtcode,msgarr,json,datacode="";
    if(data.type=="input")
    data.input = $("#txdataedit").val();
    //request한 control에 datacode저장
    var reqcode = $("#lbCtr").text();
    var archive = $("#sparchive").text();
    if (archive != "") {
        arcode = JSON.parse(archive).code;
        artype = JSON.parse(archive).type;
    }
    if (reqcode != "") {
       // $("#tbFilter").find("input#inpFilterrefresh").trigger("click");
        json = selectimctable(menuid, subid, reqcode);
        if (typeof (json) == "undefined") {
            json = {};
            json.menuid = menuid;
            json.subid = subid;
            json.dvid = reqcode;
        }
        if (json.hasOwnProperty("data")) {
            curdtcode = json.data.datacode;
        }
         if ($("#spDatacode").length>0)
             json.data = datasave(curdtcode);
         updateimctable(menuid, subid, reqcode, json);
       msgarr=["Success!", "Applied as DataSource", , true];
       $("#spdataajax").text(JSON.stringify(json.data));
     
    }


    else if (arcode != "") {
        json=$("#archivegdt").text();
        if (json != "") {
            json=JSON.parse(json);
                if (json.hasOwnProperty("data")) curdtcode = json.data.datacode;
                if ($("#spDatacode").length > 0)
                    json.data = datasave(curdtcode);
                $("#archivegdt").text(JSON.stringify(json));
            }
            else {
                json = JSON.parse(archive);
                json.data = datasave();
                //ar.chartType = "ColumnChart";
                $("#sparchive").text(JSON.stringify(json));
                $("#archivegdt").text(JSON.stringify(json));
            }
            dataajaxinsert(json.data);
            msgarr = ["Success!", "Applied as DataSource", , true];
            sweetalert(msgarr);
        }
    else if (typeof datareturn == "object" | datareturn == "yes") {
        //var set = {};
        //set.datacode = $("#spDatacode").text();
        //set.filter = saveFilter("tbFilter");
        //var field = saveTable1("tbFilter");
        //var f = [];
        //$(field).each(function (i, k) {
        //    if (k[5]) {
        //        f.push([k[5], k[0], k[4]]);
        //    }
        //});
        //set.field = f;
        var set = datasave();
        delete set.colNames;
        delete set.colModel;
        var dlist = $("#txdataedit").val();
        if (dlist != "")
            set.datalist = JSON.parse(dlist);
        datareturn = set;
        msgarr=["Success!", "Saved settting to temporary memory.",3000 , false];
    }
    else
       msgarr=["Error!", "No Control code", 2000, false];
    $(".sweet-alert").find("h2").attr("lang", "en");
    $(".sweet-alert").find("p").attr("lang", "en");
    //if rtnjson==true return json
    if (return_json)
        return json;
    else
        sweetalert(msgarr);
    funStop();
    function sweetalert(opt) {
        //opt:{title:"Success!",text:"Applied as Data Source",timer:1000,confirm:true}
        //["Success!","Applied as DataSource",1000,true]
        if (typeof opt != "undefined" && !return_json) {
            var option = { html: true };
            if (typeof opt[0] != "undefined") option.title = "<span style='color:#F8BB86;font-style:normal;'>" + opt[0] + "<span>";
            if (typeof opt[1] != "undefined") option.text = mtran(opt[1]);
            if (typeof opt[2] != "undefined") option.timer = opt[2];
            if (typeof opt[3] != "undefined") option.showConfirmButton = opt[3];
            
            swal(option);
        }
    }
    function datasave(curdtcode) {
        var dt = {};
        if (curdtcode != datacode) {// $("#lbDatacode").html()) {
            if (dt.hasOwnProperty("colNames")) {
                dt.colNames = "";
                dt.colModel = "";
            }
        }
        return appliedFilter(dt);
    }
}

function appliedFilter(dt) {
    //return data filter 
    if (typeof dt == "undefined")
        dt = {};
    dt.datacode = $("#spDatacode").text();
    dt.filter = saveFilter("tbFilter");
    var field = saveTable1("tbFilter");
    var f = [], set = {};
    $(field).each(function (i, k) {
        if (k[5]) {
            f.push([k[5], k[0], k[4]]);
        }
    });
    dt.field = f;
    return dt;
}
var status = false,ctrcode="",datacode="",dfilter='';
function dataTabClick(id, options) {
    //data를 요청한 jqgrid,jqtree,multi-select등의 control id 전역변수화
    var gdt, dataobj,src,extgdt;
    if (typeof options != "undefined") {
        if (options.hasOwnProperty("src")) src = options.src;
        //if ($.inArray(src, ["externalsave", "externalsavelist"]) > -1) {
        //    if (options.hasOwnProperty("rtngdt")) {
        //        extgdt = options.rtngdt;
        //        if (extgdt.hasOwnProperty("data")) {
        //            dataobj = extgdt.data;
        //            contentdt = dataobj;//for getcolumnlist, declare global param:contentdt;
                  
        //        }
        //    }
        //}

         if (options.hasOwnProperty("gdt")) {
            gdt = options.gdt;
            if (gdt.hasOwnProperty("data")) {
                dataobj = gdt.data;
            }
        }
        else {
            gdt = readdata(id, "gdt");
            dataobj = readdata(id); 
        }
       
    }
    else {
        gdt = readdata(id, "gdt");
        dataobj = readdata(id);
       
    }
    btntype = "";
    ctrcode = id;
    datashow(dataobj);
}
function datashow(dataobj) {
    if (typeof (dataobj) != "undefined") {
        var dfilter = '', filter = "", field = "", datacode = "";
        if (dataobj.hasOwnProperty("filter")) filter = dataobj.filter;
        if (dataobj.hasOwnProperty("field")) field = dataobj.field;
        if (dataobj.hasOwnProperty("datacode")) datacode = dataobj.datacode;
        else if (dataobj.hasOwnProperty("code")) datacode = dataobj.code;
        
        if ($("#tbDatalist tbody").length == 0 | status == false && datacode !="") {
            jsonReadAjax("imcdata", "", "code", datacode, editDatacodecallback, [filter]);
            status = true;
        }
        else
            jsonReadAjax("imcdata", "", "", "", dataList);
    }
    else {
        jsonReadAjax("imcdata", "", "", "", dataList);
    }
}

function editRemote1(datacode) {
    var comp = selectimc("imcsetting", "login").comp;
    var page = "/setting/code/View_Dashboard_data.aspx?comp=" + comp + "&pop=no&hide=yes&code=" + datacode;
    var pagetitle = "Data Source Edit";
    //$("#dvloading").show();
    funLoading(true);

    var $dialog = $("<div id='dvIfdata' style='z-index:104;'></div>")
    .html("<iframe onload=\"$('#dvloading').hide();$('#imgLoading').remove();\" id=\"ifData\" style='border: 0px;'src='" + page + "' width='100%' height='500px'></iframe></div>")
        .dialog({
            autoOpen: true,
            modal: true,
            height: 625,
            width: 900,
            title: pagetitle,
            close: function (event, ui) {
                accordmake();
                $(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: "Data Init",
                    click: function () {
                        setTimeout(function () {
                            dataListAjax(datacode, false);
                        },0);
                    }
                },
                {
                    text: "Update",
                    click: function () {
                        ifApply('update');
                        setTimeout(function () {
                            dataListAjax(datacode, false);
                        }, 2000);
                    }
                },
                {
                    text: "Close",
                    click: function () {
                        accordmake();
                        $(this).dialog('destroy').remove();
                    }
                }
          ]
        });
    $("#dvIfdata").parent().css("z-Index", 1301);
    styleInsert("dvIfdata_style", ".ui-dialog .ui-dialog-content { padding: 0 !important}");
}
function editRemote(datacode,popup) {
    //$(".loaderimage").show();
    var comp = selectimc("imcsetting", "login").comp;
    var page = "/setting/code/View_Dashboard_data.aspx?comp=" + comp + "&pop=no&hide=yes&code=" + datacode;
    var pagetitle = "Remote DataList";
    var $dialog = $("<div id='dvIfdata' style='z-index:104;'></div>")
    .html("<iframe id=\"ifData\" style='border: 0px;'src='" + page + "' width='100%' height='350px'></iframe></div>");
    if (typeof popup == "undefined") {
        $("#tab-Contain").tabs({ disabled: [0, 1] });
        styleInsert("body-style", "html,body { height: 100%}");
        $("#trDatalist td").empty();
        $("#trDatalist td").append($dialog);
    }
//    else {
//        $dialog.dialog('open');
//    }

    $dialog.ready(function () {
        setTimeout(function () { $(".loaderimage").hide(); }, 1500);
        //$(".loaderimage").hide();
    });
//    $("#ifData").contents().find("#inList1").click(function () {
//        this.click();
//        console.log(this);
    //    });
    $("#inpApply").attr("onclick", "ifApply('list')");
    $("#inpApply").attr("value", "List");
    $("#inpApply").button();
    $("#inpCancel").show().button();
    $("#inpCancel").attr("onclick", "ifApply('update')");
    $("#inpCancel").attr("value", "Update");
    var btn = $("<button id='inpReload'  style='margin-left:5px;' onclick='dataListAjax(\"" + datacode + "\",false);'>Data Init</button>");
    $("#tdBtnlist").prepend(btn.button());


}
function ifApply(type) {
    switch (type) {
        case "update":
            setTimeout(function () { $("#ifData").contents().find("#inpUpdate1").click(); }, 0);
            break;
        case "list":
            $("#trDatalist td").empty();
            var list = "<table id='tbDatalist'></table><div id='dvDatalistpager'></div>";
            $("#trDatalist td").append(list);
            jsonReadAjax('imcdata', '', '', '', dataList);
            $("#tab-Contain").tabs('enable', 0);
            $("#tab-Contain").tabs('enable', 1);
            var datasrc = localStorage.getItem("imcdata");
            if (datasrc == '' | datasrc == null) {
                dataListOnlyAjax(true);
            }
            $("#inpReload").remove();
            break;
    }
}
function dataListOnlyAjax(listupdate) {
    var login =selectimc("imcsetting","login");

    var comp = login.comp;//+",1";// obj.comp;
    $.ajax({
        url: webserviceprefix+"/WebService.asmx/DataListOnly",
        data: { comp: JSON.stringify(comp) },
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (data, status) {
            imcdatalistupdate("imcdata", "code", JSON.parse(data.d), 'list');
            if(listupdate)
                jsonReadAjax('imcdata', '', '', '', dataList);
        },
        error: function (response) {
            var r = jQuery.parseJSON(response.responseText);
            alert("Message: " + r.Message);
            alert("StackTrace: " + r.StackTrace);
            alert("ExceptionType: " + r.ExceptionType);
        }

    });
}
function dataListAjax(datacode,reload) {
    var login = selectimc("imcsetting", "login");
    var comp = login.comp;//+",1"; // obj.comp;
    $.ajax({
        url: webserviceprefix+"/WebService.asmx/DataList",
        data: { comp: JSON.stringify(comp), datacode: JSON.stringify(datacode) },
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (data, status) {
            //if(JSON.stringify(data)!="{\"d\":\"ChartList fail\"}"){
            //updategoogleData(data.d);
            //alert(data.d)
            var dtt = JSON.parse(data.d);

            dtt[0].updated = makeDateTime(new Date(), "/");
            imcdataupdate("imcdata", "code", dtt, 'data');
            if (reload) {
                readydt = datacode;
                editDatacode(datacode, [], []);

            }
        },
        error: function (response) {
            var r = jQuery.parseJSON(response.responseText);
            alert("Message: " + r.Message);
            alert("StackTrace: " + r.StackTrace);
            alert("ExceptionType: " + r.ExceptionType);
        }
    });
}
var readydt = "";
function imcdataupdate(storename, key, json, type) {
     var datasrc = localStorage.getItem(storename);
     if (datasrc != "" && datasrc != null) {
         datasrc = eval("(" + datasrc + ")");

         var chk = false;
         $(datasrc).each(function (i, k) {
             if (k[key] == json[0][key]) {
                 datasrc.splice(i, 1, json[0]);
                 chk = true;
                 return false;
             }
         });

         if (!chk)
             datasrc.push(json[0]);
     }
localStorage.setItem(storename, JSON.stringify(datasrc));
}
function imcdatalistupdate(storename, key, json,type) {
    Array.prototype.diff = function (a) {
        return this.filter(function (i) { return a.indexOf(i) < 0; });
    };
    var datasrc = localStorage.getItem(storename);
    if (datasrc != "" && datasrc != null) {
        datasrc = eval("(" + datasrc + ")");
        var oldarr = [],newarr=[];
        $(datasrc).each(function (i, k) {
            oldarr.push(k.code);
        });
        $(json).each(function (i, k) {
            newarr.push(k.code);
        });
        var addarr = newarr.diff(oldarr);
        var substractarr = oldarr.diff(newarr);
//        $(datasrc).each(function (i, k) {
//            if ($.inArray(k.code, substractarr) > -1)
//                datasrc.splice(i, 1);
//        });
        $(json).each(function (i, k) {
            if ($.inArray(k.code, addarr) > -1)
                datasrc.push(k);
        });
    }
    else {
        datasrc = json;
    }
    localStorage.setItem(storename, JSON.stringify(datasrc));
}
function dataList(datasrc) {
    //gridid:another datalist grid , rtnctr: parent page control that receive selected dataset
    if ($("#dvIfdata").length>0)
    $("#dvIfdata").dialog('destroy').remove();
    $("#trDataedit").hide();
    $("#trDatalist").show();
    var curpage = $("#trDatalist").find(".ui-pg-input").val(), pagerid;
    //when database has multiple command fiend select 
    $.each(datasrc, function (i, k) {
        if (i != "updated" && k != null) {
            if (k.hasOwnProperty("querylist") && k.querylist.length>0)
                k.dtype = k.querylist[0].dtype;
        }
    });
    loadfilter="",filter="",field="";
    buttonCollectDataList();
    datasrc = JSON.parse(JSON.stringify(datasrc, ['code', 'comp', 'dtype', 'title', 'descript', 'updateinterval', 'updated']));
    var li = [], li1 = [],gid=gridid;
    $.each(datasrc, function (i, k) {
        if (i != "updated" && k != null) {
            switch (k.dtype) {
                case '1':
                    k.dtype = 'query';
                    break;
                case '2':
                    k.dtype = 'procedure';
                    break;
            }
            li.push(k);
        }
    });
    var  gridid = "tbDatalist";
    var  pagerid = "dvDatalistpager";
    
    //return dataGrid(gridid, pagerid);
    //gridid,pagerid,data만으로 구성되는 data display용 jqgrid
    $("#" + gridid).jqGrid("GridUnload");
    var colmodel = []; var colname = []; var list = [];

    $.each(li, function (fn, v) {
        $.each(v, function (i, vv) {
            if (!arraychkexist(list, i))
                list.push(i);
        });
    });
    $.each(list, function (i, fname) {
        if (fname == "updateinterval") fname = fname.replace("update", "");
        colname.push(fname);
        var opt = { name: fname, width: 100 };
        switch (fname) {
            case "descript":
                opt.width = 150;
                break;
            //case "code":
            case "value": case "connectpool": case "query": case "queryway": case "newline": case "separator": case "comp":
                opt.hidden = true;
                break;
        }
        colmodel.push(opt);
    });
    colname.push('');
    colname.unshift('');
    colmodel.unshift({ name: 'edit', width: 15, sortable: false });
    colmodel.push({ name: 'sel', width: 15, sortable: false });
    //opt:option 추가 사항
    var options = {
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: li,
        height: "auto",
        autowidth: true,
        rowNum: 10,
        rowList: [5, 10, 20, 30],
        pager: pagerid,
        //caption: "Data View",
        sortable: true,
        //onSelectRow: function (rowid) { console.log(jQuery("#" + gridid).getRowData(rowid).code) },
        gridComplete: function () {
            var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                var rowarr = jQuery("#" + gridid).getRowData(cl);
                be = "<span class='ui-icon ui-icon-check'  onclick=\"jsonReadAjax('imcdata', '', 'code', '" + rowarr.code + "', editDatacodecallback);\"  />";
                ae = "<span class='ui-icon ui-icon-pencil'   onclick=\"editRemote1('" + rowarr.code + "');\" />";
                var dtype = rowarr.dtype;
                if (dtype != "") dtype = dtype.toLowerCase();
                ae = "<span class='ui-icon ui-icon-pencil'   onclick=\"$('#dveditback').hide();datacallback('" + dtype + "','" + rowarr.code + "');\" />";
                if (datartnctr != "") {
                    //this is for returning datacode to the control (datartnctr),when click check icon
                    var dia="$('#dvtempdata').remove();datartnctr='';";
                    be = "<span class='ui-icon ui-icon-check'  onclick=\"$('#" + datartnctr.attr('id') + "').text( '" + rowarr.code + "').trigger('triggerevent'); $('#Data').append($(makeDatasrc()));"+dia+";\"  />";
                   
                }
                
                jQuery("#" + gridid).jqGrid('setRowData', ids[i], { sel: ae, edit: be });
            }
        }
    };
    jQuery("#" + gridid).jqGrid(options);
    jQuery("#" + gridid).jqGrid('navGrid', '#' + pagerid, { edit: false, add: false, del: false, refresh: false, search: false });
    jQuery("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, { caption: "reload",
        buttonicon: "ui-icon-arrowrefresh-1-w",
        onClickButton: function () {
            dataListOnlyAjax(true);
            var indx = jQuery("#" + gridid).getGridParam('page');
            jsonReadAjax('imcdata', '', '', '', dataList);
            jQuery("#" + gridid).trigger("reloadGrid", [{ page: indx }]);
        }
    });
    if(typeof curpage!="undefined")
        jQuery("#" + gridid).trigger("reloadGrid", [{ page: curpage }]);
  
    return li;
}
function dataNewpopup() {
    //create new dataset choose alt
    //var sel = $("<select id='seldataoption' placeholder='select one..' onchange='dataNewSelect($(this).val())'><option>select...</option>"+
    //    "<option>Input</option><option>DataBase</option><option>Excel/CSV</option><option>JSON/XML</option></select>");
    var sel=$("<ul id='uldata'/>");
    var list = [{ val: "Input", img: "input", title: "manually input data" }, { val: "DataBase", img: "db", title: "connect database" }
        , { val: "Excel/CSV", img: "excel", title: "upload excel/csv" }, { val: "JSON/XML", img: "xml", title: "upload or link api url" }];
    $(list).each(function(i,k){
        $("<li title="+k.title+"><div style='float:left'><a href='#' onclick=dataNewSelect('" + k.val + "') >"+
            "<img class='imdim' src='/images/connect_" + k.img + ".png'/><div style='text-align:center;'>"
            + k.val + "</div></a><div></li>").appendTo(sel);
    })

    var $dialog = $("<div id='dvdataNewpopup' style='z-index:104;'></div>");
    $dialog.append(sel)
       .dialog({
           autoOpen: true,
           modal: true,
           height: 430,
           width:350,
           title:"Create Dataset",
           close: function (event, ui) {
               $(this).dialog('destroy').remove();
               $("#dveditback").show();
           },
           buttons: [
               {
                   text: "Close",
                   click: function () {
                       $(this).dialog('destroy').remove();
                       $("#dveditback").show();
                   }
               }
           ]
       });

    //sel.css({ width: "95%", margin: "20px 5px" });
    $("#dvdataNewpopup").parent().css("z-Index", 1300);
    $("#dveditback").hide();

    var sty="ul#uldata {padding: 0;} #uldata{width:95%;margin:20px 5px;font-size:14px;font-weight:bold;}";
    sty += "ul#uldata li {display: inline;} ul#uldata img { vertical-align: middle; }";
    sty+="ul#uldata li a {padding: 10px 20px; text-decoration: none;border-radius: 4px 4px 0 0;}";
    sty += ".ui-dialog .ui-dialog-content { padding: 0 !important}";
    styleInsert("datanew_style", sty);
}
function dataNewSelect(that) {
    if ($("#dvdataNewpopup").length > 0)
        $("#dvdataNewpopup").dialog('destroy').remove();
    switch (that) {
        case "Input":
            dataInputLoad("");
            break;
        case "DataBase":
            databaseLoad('');
            break;
        case "Excel/CSV":
            dataExcelLoad();
            break;
        case "JSON/XML":
            dataJsonLoad("")
            break;
    }
    $(".ui-dialog .ui-dialog-content").css("padding", "");
}
var rtndata = "";
function dataJsonLoad(dt) {
    var $dialog = $("<div id='dvdatajson' class='helpinsert' help='datajsonload' style='z-index:107;'></div>")
       .append(editbody())
      .dialog({
          autoOpen: true,
          modal: true,
          height: "auto",
          width: 850,
          title: "JSON/XML Data Register",
          heightStyle: "content",
          open: function () {
              $(this).find('.ui-dialog-titlebar-close').blur();
          },
          close: function (event, ui) {
              $(this).dialog('destroy').remove();
              $("#dveditback").show();
          },
           buttons: [
               {
                   text: "Save",
                   click: function () {
                       var set = localJsonsave();
                       if ($("#spDatacode").length > 0) {
                           $("#dveditback").show();
                           jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code);
                           jsonReadAjax('imcdata', '', 'code', set.code, editDatacodecallback);
                       }
                       else
                           jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code, dataList);
                   }
               },
               {
                   text: "Del",
                   click: function () {
                       swal({
                           title: "Are you sure to delte this data?"
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
                            jsonDelAjax("imcdata", "", "code", $("#lbId").text(), dataList);

                            //deleteimcdata($("#lbId").text());
                            //$("#dveditback").show();
                            //jsonReadAjax('imcdata', '', '', '', dataList);
                            //console.log($(this))
                            //$("#dvdatajson").parent().remove();
                        }
                    });
                   }
               },
               {
                   text: "Close",
                   click: function () {
                       $(this).dialog('destroy').remove();
                       $("#dveditback").show();
                       //if ($("#spDatacode").text() != datacode)//if currnet edit data same with control data
                       //    jsonReadAjax('imcdata', '', '', '', dataList);
                   }
               }
          ]

      }).parent().find('.ui-dialog-titlebar-close').prependTo('#tab-datainput').closest('.ui-dialog').children('.ui-dialog-titlebar').remove();
   // var dt = selectimcdata("imcdata", datacode);
    //var dt=
    //$("#dvdatajson").parent().find('.ui-dialog-titlebar-close').css({ "top": "21px", "display": "none" });

    setTimeout(function () {
        jscriptInsert("xmltojson", "/js2/xml-to-json/jquery.xml2json.js");
        jscriptInsert("jsontoxml", "/js2/xml-to-json/jquery.json2xml.js");
        var sty = ".xmlbox{border:1px gray solid;padding:10px;margin:0 0 10px 0;max-height:150px;overflow:auto;min-height:30px;width:650px !important;}";
        sty += "input#inpparam{ background: #ccc url('/images/icon_cm_write.gif') no-repeat top left;padding-left: 16px;height: 16px;}";
        sty += "#tbParam{width:100%;} table#tbParam tr:nth-child(even) {background-color: #f2f2f2} table#tbParam  td{padding:3px;}";
        sty += "table#tbParam tr td{border: 1px solid #B2B2B2;}";
        styleInsert("xml-css", sty);
        $("#dvdatajson").parent().css("z-Index", 1303);
        $("input:radio[name='choices']").on("change", function () {
            toggle();
        });
        $("input:button[id='inpsubmit']").on("click", function () {
            toggle();
        });
        $("#inpaddrow").on("click", function () {
            appendTableRow($("#tbParam"), ["<input />", "<input />", "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"]);
        });
        $("#inpsubmit1").on("click", function () {
            var url = $("#inpurl").val();
            var title = url.substring(url.lastIndexOf("/") + 1, url.indexOf("?"));
            $("#inpTitle").val(title);
            url += paramMake();
            switch ($("#selajax").val()) {
                case "json":
                    var yqlURL = [
                          "http://query.yahooapis.com/v1/public/yql",
                          "?q=" + encodeURIComponent("select * from json where url='" + url + "'"),
                          "&format=json&callback=?"
                    ].join("");

                    $.getJSON(url, function (data) {
                        $("#accord-data").show();
                        $("#dvjson").html(JSON.stringify(data));
                        var xml = $.json2xml(data);
                        $("#dvxml").text(xml);
                        var tree = $.parseXML(xml);
                        xmltreemake($('#ultreeview li'), tree.firstChild)
                        // this – is an —
                        $('<b>–<\/b>').prependTo('#ultreeview li:has(li)').click(function () {
                            var sign = $(this).text()
                            if (sign == "–")
                                $(this).text('+').next().children().hide()
                            else
                                $(this).text('–').next().children().show()
                        });
                        var css = ".treeview li{list-style: none;}";
                        css += ".treeview  ul { padding-left: 1em; }";
                        css += ".treeview  b { padding-right: 1em;cursor:pointer }";
                        styleInsert("xmltree-css", css);
                        var dtfield = $("#inpdatalist").val(), json1 = data;
                        if (dtfield != "") {
                            $(dtfield.split(".")).each(function (i, k) {
                                json1 = json1[k];
                            });
                            jqAuto("tbData", "pgData", json1, { width: 459, shrinkToFit: true, fixed: true, autowidth: false });
                        }
                    });
                    break;
                case "jsonyql":
                    var yqlURL = [
                          "http://query.yahooapis.com/v1/public/yql",
                          "?q=" + encodeURIComponent("select * from json where url='" + url + "'"),
                          "&format=json&callback=?"
                    ].join("");

                    $.getJSON(yqlURL, function (data) {
                        $("#accord-data").show();
                        $("#dvjson").html(JSON.stringify(data));
                        var xml = $.json2xml(data);
                        $("#dvxml").text(xml);
                        var tree = $.parseXML(xml);
                        xmltreemake($('#ultreeview li'), tree.firstChild)
                        // this – is an —
                        $('<b>–<\/b>').prependTo('#ultreeview li:has(li)').click(function () {
                            var sign = $(this).text()
                            if (sign == "–")
                                $(this).text('+').next().children().hide()
                            else
                                $(this).text('–').next().children().show()
                        });
                        var css = ".treeview li{list-style: none;}";
                        css += ".treeview  ul { padding-left: 1em; }";
                        css += ".treeview  b { padding-right: 1em;cursor:pointer }";
                        styleInsert("xmltree-css", css);
                        var dtfield = $("#inpdatalist").val(), json1 = data;
                        if (dtfield != "") {
                            $(dtfield.split(".")).each(function (i, k) {
                                json1 = json1[k];
                            });
                            jqAuto("tbData", "pgData", json1, {});
                        }
                    });
                    break;
                case "xml":
                    // build the yql query. Could be just a string - I think join makes easier reading
                    var yqlURL = [
                        "http://query.yahooapis.com/v1/public/yql",
                        "?q=" + encodeURIComponent("select * from xml where url='" + url + "'"),
                        "&format=xml&callback=?"
                    ].join("");

                    // Now do the AJAX heavy lifting
                    $.getJSON(yqlURL, function (data) {
                        rtndata = data;

                        var xmlContent = data.results[0];
                        xmlContent = cleanchar(xmlContent);

                        var xmlDoc = $.parseXML(xmlContent);
                        var json;
                        json = $.xml2json(xmlDoc);
                        $("#accord-data").show();
                        $("#dvxml").text(xmlContent);
                        $("#dvjson").text(JSON.stringify(json));
                        var tree = xmlDoc;
                        xmltreemake($('#ultreeview li'), tree.firstChild)
                        // this – is an —
                        $('<b>–<\/b>').prependTo('#ultreeview li:has(li)').click(function () {
                            var sign = $(this).text()
                            if (sign == "–")
                                $(this).text('+').next().children().hide()
                            else
                                $(this).text('–').next().children().show()
                        });
                        var css = ".treeview li{list-style: none;}";
                        css += ".treeview  ul { padding-left: 1em; }";
                        css += ".treeview  b { padding-right: 1em;cursor:pointer }";
                        styleInsert("xmltree-css", css);


                        var dtfield = $("#inpdatalist").val(), json1 = json;
                        if (dtfield != "") {
                            $(dtfield.split(".")).each(function (i, k) {
                                json1 = json1[k];
                            });
                            jqAuto("tbData", "pgData", json1, { });
                        }
                    });
                    break;
            }

        });
        $("#selupdate").on("change",function(){
            if($(this).val()=="custom"){localJsonsave
                $("#spcustom").show();
                $(this).hide();
            }

        });
        $("#lbId").text("dt" + idMake());
        $("#dvresult").append(accord());
        document.getElementById('inpupload').addEventListener('change', readfiles, false);

        setTimeout(function () {
            $("#accord-data").accordion({
                collapsible: true,
                active: 1,
                heightStyle: "content",
                beforeActivate: function (event, ui) {
                   // if (selectimcdata("imcdata", $("#lbId").text()) == "")
                     //if (event.currentTarget.innerText == "Filter & Rename" && $("#tbjsonData").find("tr").length > 1) {
                      //      var dt = localJsonsave();
                          
                        //    // jsonReadAjax("imcdata", "", "code", $("#lbId").text());
                        //    setTimeout(function () {
                        //        if (typeof datareturn == "object") dt = datareturn;
                        //        var tb = makeFilter(dt);
                        //        tb.attr("id", "tbJsonFilter");

                        //        $("#dvJsonfilter").empty().append(tb);
                        //        $("#tbJsonFilter").find("input#inpFilterrefresh").on("click", function () {
                        //            //var dt = $("#dvjsondt").text();
                        //            //if (dt != "") dt = JSON.parse(dt);
                        //            dataJsonTable(dt.datalist);
                        //        });
                        //        $("#tbJsonFilter").find("input#inpFilterexpand").on("click", function () {
                        //            cloneFilter($("#tbJsonFilter"), dt);
                        //        });
                        //        $("#tbJsonFilter>tbody").sortable();
                        //    }, 1000);
                        //}
               }

            }), 0
        });
        $("#accord-data").hide();

        var fieldlist = [];
        dataJsonTable(fieldlist);

        $(".help").on("click", function () {
            var id = $(this).attr("content");
            console.log(id);
            helpInit(id)
        });

        $("#inpurl").val("http://wsf.cdyne.com/WeatherWS/Weather.asmx/GetCityForecastByZIP?zip=22181");
        //$("#inpurl").val("http://api.openweathermap.org/data/2.5/find?q=anyang,kr&type=like&mode=json&appid=ecf364acf2524eb65780b8481d9dbcb0");
        $("#selajax").val('xml')

        setTimeout(function () {
            $("#inptogglexml").buttonset();
            $('#inptogglexml input[type=radio]').change(function () {
                var xml = $("#dvxml"), json = $("#dvjson"),treeview=$("#dvtreeview"),datalist=$("#dvjsondt");
                console.log(this.value)
                switch (this.value) {
                    case "xml":
                        xml.show();
                        json.hide();
                        treeview.hide();
                        datalist.hide();
                        break;
                    case "json":
                        xml.hide();
                        json.show();
                        treeview.hide();
                        datalist.hide();
                        break;
                    case "treeview":
                        xml.hide();
                        json.hide();
                        treeview.show();
                        datalist.hide();
                        break;
                    case "datalist":
                        xml.hide();
                        json.hide();
                        treeview.hide();
                        datalist.show();
                        break;
                }
            });
            $("input:button").button();
        }, 0);
        editdataload();
    }, 500);

    function editbody() {
        var data = [[makeCtr(["span", "Parameter", , , ]), makeCtr(["span", "Value", , , ]), makeCtr(["span", "", , , ])]];//headers
        var tb = makeTable("tbParam", data, "general");
        var foot = ['<input id="inpaddrow" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:3px 5px 0 0" />' +
                    '|{"colspan":"3","style":"text-align:right;padding:3px 0 3px 0;"}'];
        tb = appendFooter(tb, foot);
        var selajax = "<select id='selajax'><option value='json'>Json</option><option value='jsonyql'>Jsonyql</option><option value='xml'>XML</option></select>";
        var updateinterval =
            makeCtr(["select", "No update,none;daily,day;Every load,realtime;Custom input,custom", "selupdate", "inp", ]) +
            "<span id='spcustom' style='display:none;'><input id='inpcustom' style='width:50px;'/>" + makeCtr(["select", "minutes;hours;days", "selperiod", "margin:0 5px 0 5px;height:26px;", ]) +
            "<i class='fa fa-caret-square-o-left fa-lg imdim' onclick=\"$('#spcustom').hide();$('#selupdate').val('none').show()\"/></span>" +
            "<input type='button' style='margin-left:5px;height:22px;padding:0 5px 0 5px;' class='btnRoundsmall' value='update now'/>"+
            "<label id='lbUpdated' style='font-size:10px;margin-left:10px;color:blue;'/>";
        var dv = $("<table style='width:100%'/>");
        var obj = [];
        if(datareturn==""){
        obj.push( $("<tr><td style='width:120px'><i class='fa fa-caret-right'/> ID: </td><td><label id='lbId'></label></td></tr>"));
        obj.push( $("<tr><td><i class='fa fa-caret-right'/> Title: </td><td><input style='width:99%' id='inpTitle' /></td></tr>"));
        obj.push($("<tr><td><i class='fa fa-caret-right'/> Description:  </td><td><input style='width:99%'  id='inpDesc' /></td></tr>"));
        obj.push($("<tr><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Update:  </td><td>" + updateinterval + "</td></tr>"));
        }
        obj.push($("<tr><td><i class='fa fa-caret-right'/> Type:  </td><td>"+selajax+"</td></tr>"));
        obj.push($("<tr><td style='vertical-align:top'><i class='fa fa-caret-right'/> File:  </td><td><input type='file'  id='inpupload' />"+
            "<div style='font-family:Arial;font-size:14px;font-weight:bold;padding:5px;'> or input url </div>" +
            "<input style='width:65%;' id='inpurl' /><span class='linkbtn' style='margin:0 5px  0 5px' onclick=\"$('#dvparam').slideToggle('slow')\"><i class='fa fa-toggle-down'/>Parameter</span>" +
            "<input id='inpsubmit1' type='button' value='Submit'/><div id='dvparam' style='display:none;margin-top:10px;'>" + tb.outerHTML() + "</div></td></tr>"));
        obj.push($("<tr><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Result:  </td><td>" + accord() + "</td></tr>"));

        $(obj).each(function(i,k){
            dv.append(k);
        });

        return dv;
    }
    function editdataload() {
        if (typeof datareturn == "object") dt = datareturn;
        if (dt != "") {
            $("#lbId").text(dt.code);
            $("#inpTitle").val(dt.title);
            $("#inpDesc").val(dt.descript);
            $("#selajax").val(dt.dtype);
            $("#inpupload").val(dt.fileupload);
            $("#inpurl").val(dt.url);
            $("#inpstartfield").val(dt.startnode);
            $("#accord-data").show();
            $("#lbUpdated").text("updated:" + dt.updated);
            var intl=dt.interval.split(",") ;
            if (intl.length == 1) $("#selupdate").val(intl);
            else {
                $("#inpcustom").val(intl[0]);
                $("#selperiod").val(intl[1]);
                $("#spcustom").show();
                $("#selupdate").hide();
            }
            if (dt.datalist.length > 0) {
                $("#dvjsondt").text(JSON.stringify(dt.datalist));

                //$("#dvjsondt").text(JSON.stringify(dt.datalist));
                nodeTable(dt.datalist);
                accordfilterclick(dt);
                ////create filter table
                //var tb = makeFilter(dt,'',);
                //tb.attr("id", "tbJsonFilter");
                //$("#dvJsonfilter").empty().append(tb);
                //paginated("tbJsonFilter");
                //$("#tbJsonFilter").find("input#inpFilterrefresh").on("click", function () {
                //    dataJsonTable();
                //});
                //$("#tbJsonFilter").find("input#inpFilterexpand").on("click", function () {
                //    cloneFilter($("#tbJsonFilter"),dt);
                //});
                //$('#tbJsonFilter').on('change', 'input:checkbox.incb', function () {
                //    var $inpts = $(this).closest('tr').find('input:text,button,select').prop('disabled', this.checked);
                //    var fieldname = $(this).closest('tr').find('td:first');
                //    if (this.checked) {
                //        fieldname.css("text-decoration", "line-through");
                //    }
                //    else
                //        fieldname.removeAttr('style');
                //}).find('input:checkbox.incb').change();
                //$("#tbJsonFilter>tbody").sortable();
                ////edit filter
                //var filter = dt.filter;
                //if (typeof filter == "undefined" | filter == "" | filter.length == 0) filter = []; // dt.filter
                //editFilter("", filter, dt.datalist,$("#tbJsonFilter"));
                ////table create
              
            }
            //parameter
            if (dt.hasOwnProperty("param") && dt.param.length > 0) {
                $('#dvparam').show();
                $(dt.param).each(function (i, k) {
                    appendTableRow($("#tbParam"), ["<input value='"+k[0]+"'/>", "<input value='"+k[1]+"' />", "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"]);
                });
            }
        }
    }
    function cleanchar(field) {
        if (field != "" && typeof field != "undefined") {
            var list = field.split("&lt;");
            for (i in list) {
                field = field.replace('&lt;', '<').replace('&gt;', '>');
            }
        }
        return field;
    }
    function accord() {
        var accord = $("#accord-data");
        if (accord.length == 0) {
            var accord = $("<div/>");
            accord.attr("id", "accord-data");
        }
        else
            accord.empty();
        //json
        accord.append($("<h3>JSON/XML</h3>"));
        var btn = "<div id='inptogglexml'><input type='radio' id='rjson' name='inptogglexml' value='json' checked='checked'><label for='rjson'>JSON</label>" +
                  "<input type='radio' name='inptogglexml' id='rxml' value='xml'><label for='rxml'>XML</label>"+
                  "<input type='radio' name='inptogglexml' id='rtree' value='treeview'><label for='rtree'>Treeview</label>"+
                  " <input type='radio' name='inptogglexml' id='rdt' value='datalist'><label for='rdt'>DataList</label></div>";
        accord.append($("<div>" + btn + "<div class='xmlbox' id='dvxml' style='display:none'/>" +
            "<div class='xmlbox'  id='dvjson'/>"+
            "<div class='xmlbox' id='dvtreeview' style='display:none'>" +
            "<ul class='treeview' id='ultreeview'><li></li></ul></div>"+
            "<div class='xmlbox' id='dvjsondt' style='display:none'/>" +
            "</div>"));
        //datalist
        accord.append($("<h3>DataList</h3>"));
        accord.append($("<div> <i class='fa fa-caret-right'/>Node for Datalist: <i class='fa fa-h-square imdim help' content='001' style='margin:0 5px 0 5px;'/>" +
            "<div><input style='width:85%;margin-right:5px;' id='inpstartfield'/><button onclick='ultreeviewDialog()'><i class='fa fa-pencil fa-x'/></button>"+
            "<button style='margin-left:5px;' onclick='dataJsonCut();'><i class='fa fa-rotate-right fa-x'/></button></div>" +
            "<div id='inpdatalist' style='margin-top:5px;'/><table id='tbjsonData'></table><div id='pgjsonData'></div>"));
        accord.append($("<h3>Filter & Rename</h3>"));
        accord.append($("<div id='dvJsonfilter'></div>"));
        return accord.outerHTML();
    }
    function localJsonsave() {
        getlogin()
        var setting = {}, arr = [];
        setting.code = $("#lbId").text();
        setting.title = $("#inpTitle").val();
        setting.descript = $("#inpDesc").val();
        setting.comp = getlogin().comp;
        setting.dtype = $("#selajax").val();
        setting.fileupload = "";
        setting.url = $("#inpurl").val();
        setting.param = saveTable("tbParam", false, true);
        setting.startnode = $("#inpstartfield").val();
        if ($("#spcustom").css("display") == "block") {
            setting.interval = $("#inpcustom").val()+";"+ $("#selperiod").val();
        }
        else
            setting.interval = $("#selupdate").val();

        setting.updated = makeDateTime(new Date(), "-");

        //var scheme = datajqueryRead($("#tbjsonData"));
        var dtlist = $("#dvjsondt").text();//datajqueryRead($("#tbjsonData"));
        //if (scheme.length > 0) setting.datascheme = scheme;
        //else setting.datascheme = "";
        if (dtlist != "") setting.datalist = JSON.parse(dtlist);
        else setting.datalist = "";

        setting.filter = saveFilter("tbJsonFilter");

        var field = saveTable1("tbJsonFilter");
        var f = [], set = {};
        $(field).each(function (i, k) {
            if (k[5]) {
                f.push([k[5], k[0], k[4]]);
            }
        });
        setting.field = f;
        //if (datareturn == ""){
        //    //updateimcdata(setting);//localupdate
        //    jsonUpdateAjax("imcdata", JSON.stringify(setting), "", "code", setting.code);

        //}
        //else
        if (datareturn != "")
            datareturn = setting;

        return setting;
    }
}

function databaseLoad(dt) {
    console.log(dt)
    var $dialog = $("<div id='dvdatabase' class='helpinsert' help='databaseload' style='z-index:107;'></div>")
       .append(editbody())
      .dialog({
          autoOpen: true,
          modal: true,
          height: "auto",
          width: 850,
          title: "Database Edit",
          heightStyle: "content",
          open: function () {
              $(this).find('.ui-dialog-titlebar-close').blur();
          },
          close: function (event, ui) {
              $(this).dialog('destroy').remove();
              $("#dveditback").show();
          },
          buttons: [
               {
                   text: "Save",
                   click: function () {
                       var set = localJsonsave();
                       if ($("#spDatacode").length > 0) {
                           $("#dveditback").show();
                           jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code);
                           jsonReadAjax('imcdata', '', 'code', set.code, editDatacodecallback);
                       }
                       else
                           jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code, dataList);
                       $(this).dialog('destroy').remove();
                   }
               },
               {
                   text: "Del",
                   click: function () {
                       swal({
                           title: "Are you sure to delte this data?"
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
                            jsonDelAjax("imcdata", "", "code", $("#lbId").text(), dataList);
                            //deleteimcdata($("#lbId").text());
                            //$("#dveditback").show();
                            //jsonReadAjax('imcdata', '', '', '', dataList);
                            //$("#dvdatabase").parent().remove();
                        }
                    });
                   }
               },
               {
                   text: "Close",
                   click: function () {
                       $(this).dialog('destroy').remove();
                       $("#dveditback").show();
                       //if ($("#spDatacode").text() != datacode)//if currnet edit data same with control data
                       //    jsonReadAjax('imcdata', '', '', '', dataList);

                   }
               }
          ]
      }).parent().find('.ui-dialog-titlebar-close').prependTo('#tab-datainput').closest('.ui-dialog').children('.ui-dialog-titlebar').remove();

    jsonReadAjax("imcsetting", "preference", "", "", callbackreturn, ["connectstringmake"]);
    //setTimeout(function () {
    //    editdataload();
    //}, 1000);
    function dbaction(list) {
        var val = JSON.parse(list);
        commandread(val);
        funStop();
    }
    function editbody() {
        var selajax = "<select id='selajax'><option value='query'>Query</option><option value='procedure'>Procedure</option></select>";
        var sqlcommand = "<select id='selcommand'><option value='select'>Select</option><option value='insert'>Insert</option>"+
            "<option value='update'>Update</option><option value='delete'>Delete</option><option value='custom'>Custom</option></select>";
        var updateinterval =
            makeCtr(["select", "No update,none;daily,day;Every load,realtime;Custom input,custom", "selupdate", "inp", ]) +
            "<span id='spcustom' style='display:none;'><input id='inpcustom' style='width:50px;'/>" + makeCtr(["select", "minutes;hours;days", "selperiod", "margin:0 5px 0 5px;height:26px;", ]) +
            "<i class='fa fa-caret-square-o-left fa-lg imdim' onclick=\"$('#spcustom').hide();$('#selupdate').val('none').show()\"/></span>" +
            "<input type='button' style='margin-left:5px;height:22px;padding:0 5px 0 5px;' class='btnRoundsmall' value='update now'/>" +
            "<label id='lbUpdated' style='font-size:10px;margin-left:10px;color:blue;'/>";
        var dv = $("<div/>"), tb = $("<table style='width:100%'/>");
        dv.append(tb)
        var obj = [];
        obj.push($("<tr><td style='width:120px'><i class='fa fa-caret-right'/> ID: </td><td><label id='lbId'></label></td></tr>"));
        obj.push($("<tr><td><i class='fa fa-caret-right'/> Title: </td><td><input style='width:99%' id='inpTitle' /></td></tr>"));
        obj.push($("<tr><td><i class='fa fa-caret-right'/> Description:  </td><td><input style='width:99%'  id='inpDesc' /></td></tr>"));
        obj.push($("<tr><td><i class='fa fa-caret-right'/> Connection:  </td><td><select id='selconn' style='height:20px;margin-right:5px;font-family:FontAwesome;'></select>" +
            "<span id='lbconnect' /></td></tr>"));
        $(obj).each(function (i, k) {
            tb.append(k);
        });
        obj = [], tb = $("<table style='width:98%;margin:5px 0 0 5px;'/>");
        obj.push($("<tr><td style='width:120px'><i class='fa fa-caret-right'/> sqlCommand:  </td><td>" + sqlcommand + "<input style='margin-left:5px;width:550px;'/></td></tr>"));
        obj.push($("<tr><td><i class='fa fa-caret-right'/> CommandType:  </td><td>" + selajax + "</td></tr>"));
        obj.push($("<tr><td style='vertical-align:top'><i class='fa fa-caret-right'/> Proc/Query:  </td><td><textarea style='width:99%'  id='txQuery' /></td></tr>"));
        obj.push($("<tr><td style='vertical-align:top'><i class='fa fa-caret-right'/> Parameters:  </td><td>" +
            "<span class='linkbtn' style='margin:0 5px  0 5px' onclick=\"$('#dvparam').slideToggle('slow')\"><i class='fa fa-toggle-down'/>Parameter</span><span id='spparam'/>" +
            "<div id='dvparam' style='display:none;margin-top:10px;'></div></td></tr>"));
        obj.push($("<tr id='tr1'><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Update:  </td><td>" + updateinterval + "</td></tr>"));
        obj.push($("<tr id='tr2'><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Result:  </td><td>" + accord() + "<div id='dvjsondt' style='display:none'/></td></tr>"));
        $(obj).each(function (i, k) {
            tb.append(k);
        });
        var btn = '<div style="padding:10px 15px 10px 0;text-align:right;"><button type="button" id="btncommandsave" >Update</button></div>';
        var rnddv=$("<div class='roundbox' style='clear:both' />")
        rnddv.append(tb);
        rnddv.append(btn);
        dv.append(rnddv)
        var id = "dndtop" + $(".dndcontain").length;
        var dndcontain = $("<div id='" + id + "' class='dndcontain'  />");

        dndcontain.insertBefore(rnddv);
        if (dt.hasOwnProperty("querylist")) {
            dndboxInit1(dt.querylist, dbaction, dndcontain);
        }
        else {
            contain = dndboxInit1("", dbaction, dndcontain);
        }
        
        return dv;
    }
    function dndboxInit1(elist, parentcallback, dvcontain, optarr) {
        //dvcontain: div for dnd object, optarr:additional parameters for parentcallback
        var dnd = makedndbox(dvcontain, elist, dndbatchInsert, parentcallback, optarr);
        dvcontain.append(dnd);

        return dvcontain;
    }

    function editdataload() {
        $("#dvresult").append(accord());
        $("#accord-data").accordion({
            collapsible: true,
            active: 0,
            heightStyle: "content"
        });
        $("#accord-data").hide();
        if (typeof datareturn == "object") dt = datareturn;
        if (dt != "") {
            $("#lbId").text(dt.code);
            $("#inpTitle").val(dt.title);
            $("#inpDesc").val(dt.descript);
            dt = defconnectset(dt);//revise connectstr with current one;
             
                $("#selconn").val(dt.connection);
                $("#lbconnect").text(dt.connection);
                $("#lbconnect").attr("title", dt.connection);
                if (typeof $("#selconn option:selected").html() == "undefined")
                    $("#selconn").val("");
            
        }
        else {
            $("#lbId").text("dt" + idMake());
            $("#lbconnect").text($("#selconn").val());
            paramtable("query");
            //dndbox init as select command
            addli($(".dndul"), "select",1,"", dbaction);
            var comm = $("#selcommand");
            comm.next().val(comm.val());
            $(".dndul").find("li").first().css("width", "100px").text(comm.val());
        }
        //both new or edit
        $("#selcommand").on("change", function () {
            $(this).next().val($(this).find("option:selected").text());
            $(".selectlii").css("width", "100px").text($(this).val());
            // $(".selectlii.dndli").text($(this).val());
            commanddisplay($(this).val());
        });
        $("#selcommand").next().on("keyup", function () {
            $(".selectlii").text($(this).val());
        });
        var sty = ".xmlbox{border:1px gray solid;padding:10px;margin:0 0 10px 0;max-height:150px;overflow:auto;min-height:30px;width:650px !important;}";
        sty += "input#inpparam{ background: #ccc url('/images/icon_cm_write.gif') no-repeat top left;padding-left: 16px;height: 16px;}";
        sty += "#tbParam{width:100%;} table#tbParam tr:nth-child(even) {background-color: #f2f2f2} table#tbParam  td{padding:3px;}";
        sty += "table#tbParam tr td{border: 1px solid #B2B2B2;}";
        styleInsert("db-css", sty);
        $("#lbconnect").css({ cursor: 'pointer', display: 'inline-block', 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', 'max-width': '520px', 'margin': '0 0 0 5px' });
        $("#dvdatabase").parent().css("z-Index", 1303);
        //eventhandler register
        $("input:radio[name='choices']").on("change", function () {
            toggle();
        });
        $("input:button[id='inpsubmit']").on("click", function () {
            toggle();
        });
        $("#inpsubmit1").on("click", function () {


        });
        $("#selupdate").on("change", function () {
            if ($(this).val() == "custom") {
                $("#spcustom").show();
                $(this).hide();
            }
        });
        $("#selconn").next().on("click", function () {
            var option = {}, con = $("#lbconnect").text();
            if ($("#selconn").val() == "") {
                
                if (con != "") {
                    con = con.split(";");
                    $(con).each(function (a, b) {
                        var bb = b.split("=");
                        option[bb[0].toLowerCase()] = bb[1];
                    });
                }
                option.rtnid = "lbconnect";
                connectstringEdit("mssql", option);
            }
        });
        $("#selconn").on("change", function () {
            $("#lbconnect").text($(this).val());
            $("#lbconnect").attr("title",$(this).val());
            if($(this).val()=="")
                connectstringEdit("mssql", { rtnid: "lbconnect" });
        });
        $("#selajax").on("change", function () {
            paramtable($(this).val().toLowerCase());
        })
        $("input[value='update now']").on("click", function () {
            var data = {};
            data.connection = $("#lbconnect").text();
            data.dtype = $("#selajax").val();
            data.querylist = [];
            data.querylist.push({ sqlcommand: "select", dtype: $("#selajax").val(), query: $("#txQuery").val(), param: saveTable1("tbParam") });
           
            jsonDatabaseAjax(data, callbackreturn, ["datatableload"]);
            //imcdatalist input

            $("#accord-data").show();
        });
       
        $("#txQuery").on("blur", function () {
            var con = $("#lbconnect").text(), dbtype = "", cstr = "";
            if (con != "") {
                var conn = con.split(";");
                cstr = con.replace(conn[0] + ";", "");
                dbtype = conn[0].split("=")[1];
            }
            var querytype=$("#selajax").val().toLowerCase();
            //parse qry string or procedure
            if ($("tbParam").length == 0) paramtable(querytype);
            switch (querytype) {
                case "query":
                    $("#dvparam").show();
                    $("#tbParam>tbody").empty();
                    var qry = $("#txQuery").val();
                    if (qry != "") qry = qry.split(/(?:,=| )+/);
                    $(qry).each(function (i, k) {
                        if (k.indexOf("@") > -1) {
                            var kk = k.split("@");
                            var paramname = cleaningparam(kk[1]);//kk[1].replace(')', '').replace(',', '')
                            var coltype = makeCtr(["select", "varchar;nvarchar;text;int;bigint;tinyint;bit;float;decimal;datetime;smalldatetime", , "coltype", ])
                            append = ["<input value='" +paramname  + "'/>", "<input />", coltype, "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"];
                            appendTableRow($("#tbParam"), append);
                        }
                       })
                    break;
                case "procedure":
                    var param = { dbtype: JSON.stringify(dbtype), connect: JSON.stringify(cstr), spname: JSON.stringify($(this).val()) };
                    ajaxGen(webserviceprefix+"/WebService.asmx/DeriveParam", param, callbackreturn, ["derivedparameter"]);
                    break;
            }

        });
        $(".help").on("click", function () {
            var id = $(this).attr("content");
            console.log(id);
            helpInit(id)
        });

        //dndbox eventhandler
        $("#btncommandsave").click(function () {
            var val = commandsave();
            $(".selectlii").attr("val", JSON.stringify(val));
        })
        //$("#dvdatabase").find(".dndcontain").find("button:contains('Save')")
        function cleaningparam(param) {
            var clist = [")", "(", ","];
            $(clist).each(function (i, k) {
                param = param.replace(k, "");
            });
            return param;
        }
    }
    function cleanchar(field) {
        var list = field.split("&lt;");
        for (i in list) {
            field = field.replace('&lt;', '<').replace('&gt;', '>');
        }
        return field;
    }
    function accord() {
        var accord = $("#accord-data");
        if (accord.length == 0) {
            var accord = $("<div/>");
            accord.attr("id", "accord-data");
        }
        else
            accord.empty();
        accord.append($("<h3>DataList</h3>"));
        accord.append($("<div><div id='inpdatalist' style='margin-top:5px;'/><table id='tbjsonData'></table><div id='pgjsonData'></div>"));
        accord.append($("<h3>Filter & Rename</h3>"));
        accord.append($("<div id='dvJsonfilter'></div>"));
        return accord.outerHTML();
    }
    function paramtable(querytype) {
        //make param table
        var data, tb, foot, append;
        $("#dvparam").empty();
        switch (querytype) {
            case "query":
                var coltype = makeCtr(["select", "varchar;nvarchar;text;int;bigint;tinyint;bit;float;decimal;datetime;smalldatetime", , "coltype", ])
                data = [["Parameter", "Value", "Column Type", ""]];//headers
                foot = ['<input id="inpaddrow" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:3px 5px 0 0" />' +
                  '|{"colspan":"4","style":"text-align:right;padding:3px 0 3px 0;"}'];
                append = ["<input />", "<input />",coltype,  "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"];
                break;
            case "procedure":
                data = [[makeCtr(["span", "Parameter", , , ]), makeCtr(["span", "Value", , , ]), makeCtr(["span", "", , , ])]];//headers
                foot = ['<input id="inpaddrow" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:3px 5px 0 0" />' +
                     '|{"colspan":"3","style":"text-align:right;padding:3px 0 3px 0;"}'];
                append=["<input />", "<input />", "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"];
                break;
        }
       
        var tb = makeTable("tbParam", data, "general");
        tb = appendFooter(tb, foot);
        $("#dvparam").append(tb);
        $("#inpaddrow").on("click", function () {
            appendTableRow($("#tbParam"),append);
        });
       
    }
    function parambatchInsert(paramlist,qrytype){
        //after create param table insert dt.param array 
        var list = "varchar;nvarchar;text;int;bigint;tinyint;bit;float;decimal;datetime;smalldatetime";
        var lsplit = list.split(";"), nlist = [];
        var append, ibtn = "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>";
       // $("#tbParam").empty();
        $(paramlist).each(function (i, k) {
            switch (qrytype) {
                case "query":
                    $(lsplit).each(function (a, b) {
                        if (b == k[2]) {
                            nlist.push(b + "," + b + "," + "selected:selected")
                        }
                        else
                            nlist.push(b);
                    });
                    var coltype = makeCtr(["select", nlist.join(";"), , "coltype", ])
                    append = ["<input value='" + k[0] + "'/>", "<input value='" + k[1] + "' />", coltype, ibtn];
                    break;
                case "procedure":
                    append = ["<input value='" + k[0] + "'/>", "<input value='" + k[1] + "' />", ibtn];
                    break;
            }
            appendTableRow($("#tbParam"), append);
        });
    }
    function localJsonsave() {
        getlogin()
        var setting = {}, arr = [];
        setting.code = $("#lbId").text();
        setting.title = $("#inpTitle").val();
        setting.descript = $("#inpDesc").val();
        setting.comp = getlogin().comp;
        setting.dtype = "database";
        setting.connection = $("#lbconnect").text();
        setting.connectname = $("#selconn :selected").text();
        var qlist = [];
        $("#dvdatabase").find(".dndli").each(function (i, k) {
            var val = $(k).attr("val");
            qlist.push(JSON.parse(val));
        })
        setting.querylist = qlist;
        setting.updated = makeDateTime(new Date(), "-");

        return setting;
    }
    function commandsave() {
        var setting = JSON.parse($(".selectlii").attr("val"));
        setting.buttonname = $("#selcommand").next().val();
        setting.sqlcommand = $("#selcommand").val();
        setting.dtype = $("#selajax").val();
        setting.query = $("#txQuery").val();
        setting.param = saveTable("tbParam", false, true);
        if ($("#spparam").text() != "" && setting.dtype == "Procedure")
            setting.derivedparam = JSON.parse($("#spparam").text());
        if ($("#spcustom").css("display") == "block") {
            setting.interval = $("#inpcustom").val() + ";" + $("#selperiod").val();
        }
        else
            setting.interval = $("#selupdate").val();
        if ($("#selcommand").val() == "select") {
            var dtlist = $("#dvjsondt").text();
            if (dtlist != "") setting.datalist = JSON.parse(dtlist);
            else setting.datalist = "";

            setting.filter = saveFilter("tbJsonFilter");

            var field = saveTable1("tbJsonFilter");
            var f = [], set = {};
            $(field).each(function (i, k) {
                if (k[5]) {
                    f.push([k[5], k[0], k[4]]);
                }
            });
            setting.field = f;
        }
        return setting;
    }
    function commandread(val) {
        //if (val.hasOwnProperty("subseq")) $("#selcommand").next().next().text(val.subseq);
        if (val.hasOwnProperty("buttonname")) $("#selcommand").next().val(val.buttonname);
        if (val.hasOwnProperty("sqlcommand")) {
            $("#selcommand").val(val.sqlcommand);
        }
        else {
            $("#selcommand").val("");
            $("#selcommand").next().val("");
            $("#txQuery").val("");
            $("#spparam").text("");
            $("#selajax").val("query");
            $('#dvparam').hide();
            $("#tbparam>body").empty();
        }
        if(val.hasOwnProperty("dtype"))$("#selajax").val(val.dtype);
        if(val.hasOwnProperty("query"))$("#txQuery").val(val.query);
        if (val.hasOwnProperty("param") && val.param.length > 0) {
            $('#dvparam').show();
            paramtable(val.dtype);
            parambatchInsert(val.param,val.dtype);
        }
        if(val.hasOwnProperty("derivedparam"))$("#spparam").text(JSON.stringify(dt.derivedparam));
        if (val.hasOwnProperty("interval")) {
            var inter = val.interval.split(";");
            if (inter.length == 2) {
                $("#spcustom").css("display", "block");
                $("#inpcustom").val(inter[0]);
                $("#selperiod").val(inter[1]);
            }
            else
                $("#selupdate").val(val.interval);
        }
      
        if (val.hasOwnProperty("datalist") && val.datalist != "") {
            $("#dvjsondt").val(JSON.stringify(val.datalist));
            nodeTable(val.datalist);
                accordfilterclick(val);
            $("#accord-data").show();
            cnt++;
        }
        else
            $("#accord-data").hide();
      
        commanddisplay($("#selcommand").val());
        $("button").button();
        auto_grow($("#txQuery"));
    }
    function commanddisplay(sqlcommand) {
        var tb = $("#selcommand").closest("table>tbody").first();
        if (sqlcommand != "select") {
            $("#tr1, #tr2").hide();
        }
        else {
            $("#tr1, #tr2").show();
        }
    }
    databaseLoad.editbody = editbody;
    databaseLoad.editdataload = editdataload;
    databaseLoad.paramtable = paramtable;
    databaseLoad.dbaction = dbaction;
    databaseLoad.commandread = commandread;
    databaseLoad.commandsave = commandsave;
    databaseLoad.commanddisplay = commanddisplay;
    databaseLoad.parambatchInsert = parambatchInsert;
}   
function accordfilterclick(dt) {
    accordfilterclick.aftmake = aftmake;
    //click $("#accord-data") make filter table
    var tb = makeFilter(dt, '', accordfilterclick.aftmake);
   
    function aftmake(tb, dt) {
        tb.attr("id", "tbJsonFilter");
        $("#dvJsonfilter").empty().append(tb);
        $(".coltypeclass").on("change", function () {
            coltypechg($(this), dt.datalist);
        });
        
        $(".multiselect").multipleSelect({
            width: 150
           , styler: function (value) {
               if ($.inArray(value, ["$comp", "$name", "$id", "$boss", "$division", "$position"]) > -1) {
                   return 'background-color: #F7F3F7; color: #181C18;';
               }
           }
        });
        $("input[id^='date_']").datepicker({ dateFormat: 'yy-mm-dd' });

        var filter = dt.filter;
        if (typeof filter == "undefined" | filter == "") filter = []; // dt.filter
        editFilter("", filter, dt.datalist, $("#tbJsonFilter"));

        $("#tbJsonFilter").find("input#inpFilterrefresh").on("click", function () {
            var dlist = $("#dvjsondt").text();
            if (dlist != "")
                nodeTable(JSON.parse(dlist));
        });
        $("#tbJsonFilter").find("input#inpFilterexpand").on("click", function () {
            cloneFilter($("#tbJsonFilter"), dt);
        });
        $("#tbJsonFilter>tbody").sortable();
    }
}
function coltypechg(that, srcdata) {
    //if column type changed event
    var fformat;
    var tdd = that.first().closest("tr").find("td");
    var fname = tdd.first().find("span").text();
    var ftype = fieldTypeFind(srcdata, fname);
    ftype.type = that.val();
    //string인 경우
    var valuelist = [], format = "";
    //parameter from url
    var paramlist = getParams();
    //fixed values:string, time type
    var fixedStr = ["$comp", "$name", "$id", "$boss", "$division", "$position"];
    var fixedPeriod = ["$thisYear", "$thisQuarter", "$thisMonth", "$thisWeek", "$Today", "$Yesterday", "$Tomorrow"];
   
    if (ftype.type == "string") valuelist = ftype.valuelist.concat(fixedStr).concat(paramlist);
    switch (ftype.type) {
        case "int":
            break;
        case "float":
            fformat = ["0", "00", "0.00"];
            break;
        case "datetime":
            fformat = ["yyyy-MM-dd", "yy-MM-dd", "yyyy-MM-dd hh:mm:ss"];
            break;
    }
    if (typeof fformat != "undefined")
        format = makeCtr(["select", "N/A;" + fformat.join(";"), "selFormat" + fname, "width:60px", ]);
    var valfield = makeFilterRow("", fname, ftype.type, valuelist)
    $(tdd[2]).empty().append(makeOperator("", fname, ftype.type));
    $(tdd[3]).empty().append(valfield);
    $(tdd[4]).empty().append(format);
    $(".multiselect").multipleSelect({
        width: 150
            , styler: function (value) {
                if ($.inArray(value, ["$comp", "$name", "$id", "$boss", "$division", "$position"]) > -1) {
                    return 'background-color: #F7F3F7; color: #181C18;';
                }
            }
    });

    var filtered = applyFilter(srcdata, saveFilter("tbFilter"));
    previewData(filtered);
}
function datacallback(dtype, datacode) {
    console.log(dtype,datacode)
    switch (dtype.toLowerCase()) {
        case "input":
            jsonReadAjax("imcdata", "", "code", datacode, dataInputLoad);
            break;
        case "procedure": case "query": case "":case "database":
            console.log(datacode)
            jsonReadAjax("imcdata", "", "code", datacode, databaseLoad);
            break;
        case "excel": case "csv":
            jsonReadAjax("imcdata", "", "code", datacode,dataExcelLoad);
            break;
        case "json": case "xml":
            jsonReadAjax("imcdata", "", "code", datacode, dataJsonLoad);
            break;
    }
}
function dataExcelLoad(dt) {
    var comp = selectimc("imcsetting", "login").comp;
    var page = "/js2/js-xlsx-master/index.html";
    var pagetitle = "Excel/CSV Upload";
    var dia = $("<div id='dvIfdata' class='helpinsert' help='excelload' style='z-index:104;overflow-x:hidden'></div>");
    var $dialog =dia.append(editbody())
        .dialog({
            autoOpen: true,
            modal: true,
            height: 625,
            width: 900,
            title: pagetitle,
            close: function (event, ui) {
                $(this).dialog('destroy').remove();
                $("#dveditback").show();
            },
            buttons: [
                {
                    text: "Update",
                    click: function () {
                        var set=localJsonsave();
                        //jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code, dataList)
                        if ($("#spDatacode").length > 0) {
                            $("#dveditback").show();
                            jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code);
                            jsonReadAjax('imcdata', '', 'code', set.code, editDatacodecallback);
                        }
                        else
                            jsonUpdateAjax("imcdata", "", JSON.stringify(set), "code", set.code, dataList);
                    }
                },
                 {
                     text: "Delete",
                     click: function () {
                         swal({
                             title: "Are you sure to delte this data?"
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
                                    jsonDelAjax("imcdata", "", "code", $("#lbId").text(), dataList);
                                   // deleteimcdata($("#lbId").text());
                                    //$("#dveditback").show();
                                    //dataList();

                                    //$(this).dialog('destroy').remove();
                                }
                            });
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
    $("#dvIfdata").parent().css("z-Index", 1301);
   
    styleInsert("dvIfdata_style", ".ui-dialog .ui-dialog-content { padding: 0 !important}");
    //var dt = selectimcdata("imcdata", datacode);
    //if(typeof datacode !="undefined")
    //jsonReadAjax("imcdata", "", "code", datacode);
    //var dt = ajaxrtn;
    setTimeout(function () {
        var sty = ".xmlbox{border:1px gray solid;padding:10px;margin:0 0 10px 0;max-height:150px;overflow:auto;min-height:30px;width:650px !important;}";
        sty += "input#inpparam{ background: #ccc url('/images/icon_cm_write.gif') no-repeat top left;padding-left: 16px;height: 16px;}";
        sty += "#tbParam{width:100%;} table#tbParam tr:nth-child(even) {background-color: #f2f2f2} table#tbParam  td{padding:3px;}";
        sty += "table#tbParam tr td{border: 1px solid #B2B2B2;}";
        styleInsert("db-css", sty);
        $("#dvdatabase").parent().css("z-Index", 1303);
        $("input:radio[name='choices']").on("change", function () {
            toggle();
        });
        $("input:button[id='inpsubmit']").on("click", function () {
            toggle();
        });
        $("#inpaddrow").on("click", function () {
            appendTableRow($("#tbParam"), ["<input />", "<input />", "<i class='fa fa-times-circle fa-lg imdim' onclick='paramRowdel($(this))' id='idel'/>"]);
        });
        $("#inpsubmit1").on("click", function () {


        });
        $("#selupdate").on("change", function () {
            if ($(this).val() == "custom") {
                $("#spcustom").show();
                $(this).hide();
            }

        });
       
        if (typeof dt == "undefined")
            var id = "dt" + idMake();
        else {
            id = dt.datacode;
            exceldatalist = dt.datalist;
        }
        $("#lbId").text(id);
        $("#dvresult").append(accord());

        setTimeout(function () {
            $("#accord-data").accordion({
                collapsible: true,
                active: 0,
                heightStyle: "content",
                beforeActivate: function (event, ui) {
                    //if (typeof dt == "undefined")
                    //    if (event.currentTarget.innerText == "Filter & Rename" && $("#tbjsonData").find("tr").length > 1) {
                    //        var dt=localJsonsave();
                    //       // jsonReadAjax("imcdata", "", "code", $("#lbId").text());
                    //        setTimeout(function () {
                    //            //var dt = selectimcdata("imcdata", $("#lbId").text());
                    //            //var dt = ajaxrtn;
                    //            if (typeof datareturn == "object") dt = datareturn;
                    //            var tb = makeFilter(dt);
                    //            tb.attr("id", "tbJsonFilter");

                    //            $("#dvJsonfilter").empty().append(tb);
                    //            $("#tbJsonFilter").find("input#inpFilterrefresh").on("click", function () {
                    //                //var dt = $("#dvjsondt").text();
                    //                //if (dt != "") dt = JSON.parse(dt);
                    //                dataJsonTable(dt.datalist);
                    //            });
                    //            $("#tbJsonFilter").find("input#inpFilterexpand").on("click", function () {
                    //                cloneFilter($("#tbJsonFilter"), dt);
                    //            });
                    //            $("#tbJsonFilter>tbody").sortable();
                    //        }, 1000);
                    //    }

                }
            }), 0
        });
        $("#accord-data").hide();

        var fieldlist = [];
        dataJsonTable(fieldlist);

        $(".help").on("click", function () {
            var id = $(this).attr("content");
            console.log(id);
            helpInit(id)
        });
        $("#selajax").val('query')

        //setTimeout(function () {
        //    $("#inptogglexml").buttonset();
        //    $('#inptogglexml input[type=radio]').change(function () {
        //        var xml = $("#dvxml"), json = $("#dvjson"), treeview = $("#dvtreeview"), datalist = $("#dvjsondt");
        //        console.log(this.value)
        //        switch (this.value) {
        //            case "xml":
        //                xml.show();
        //                json.hide();
        //                treeview.hide();
        //                datalist.hide();
        //                break;
        //            case "json":
        //                xml.hide();
        //                json.show();
        //                treeview.hide();
        //                datalist.hide();
        //                break;
        //            case "treeview":
        //                xml.hide();
        //                json.hide();
        //                treeview.show();
        //                datalist.hide();
        //                break;
        //            case "datalist":
        //                xml.hide();
        //                json.hide();
        //                treeview.hide();
        //                datalist.show();
        //                break;
        //        }
        //    });
        //    $("input:button").button();
        //}, 0);
        editdataload();
        $("#ifData").contents().find("#inpPath").hide();//as last resort, can't hide
    }, 500);

    function editbody() {

        var updateinterval =
        makeCtr(["select", "No update,none;daily,day;Every load,realtime;Custom input,custom", "selupdate", "inp", ]) +
        "<span id='spcustom' style='display:none;'><input id='inpcustom' style='width:50px;'/>" + makeCtr(["select", "minutes;hours;days", "selperiod", "margin:0 5px 0 5px;height:26px;", ]) +
        "<i class='fa fa-caret-square-o-left fa-lg imdim' onclick=\"$('#spcustom').hide();$('#selupdate').val('none').show()\"/></span>" +
        "<input type='button' style='margin-left:5px;height:22px;padding:0 5px 0 5px;' class='btnRoundsmall' value='update now'/>" +
        "<label id='lbUpdated' style='font-size:10px;margin-left:10px;color:blue;'/>";
        var dv = $("<table style='width:100%'/>");
        var iframe = "<iframe onload=\"funStop()\" id=\"ifData\" style='border: 0px;'src='" + page + "' width='100%' height='70px'></iframe>";
        var obj = [];
        if (datareturn == "") {
            obj.push($("<tr><td style='width:120px'><i class='fa fa-caret-right'/> ID: </td><td><label id='lbId'></label></td></tr>"));
            obj.push($("<tr><td><i class='fa fa-caret-right'/> Title: </td><td><input style='width:99%' id='inpTitle' /></td></tr>"));
            obj.push($("<tr><td><i class='fa fa-caret-right'/> Description:  </td><td><input style='width:99%'  id='inpDesc' /></td></tr>"));
            obj.push($("<tr><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Update:  </td><td>" + updateinterval + "</td></tr>"));
        }
        obj.push($("<tr><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Upload:  </td><td>" + iframe + "</td></tr>"));
        obj.push($("<tr><td style='vertical-align:top;'><i class='fa fa-caret-right'/> Result:  </td><td>" + accord() + "</td></tr>"));

        $(obj).each(function (i, k) {
            dv.append(k);
        });

        return dv;
    }
    function editdataload() {
        if (typeof datareturn == "object") dt = datareturn;
        if (dt != "" && typeof dt != "undefined") {
            
            $("#lbId").text(dt.code);
            $("#inpTitle").val(dt.title);
            $("#inpDesc").val(dt.descript);

            $("#accord-data").show();
            $("#lbUpdated").text("updated:" + dt.updated);

            if (dt.datalist.length > 0) {
                dataJsonTable(dt.datalist);
                funStop();
                accordfilterclick(dt)
               //// create filter tablevar dt = selectimcdata("imcdata", $("#lbId").text());
               // var tb = makeFilter(dt);
               // tb.attr("id", "tbJsonFilter");
               // $("#dvJsonfilter").empty().append(tb);
               // paginated("tbJsonFilter");
               // $("#tbJsonFilter").find("input#inpFilterrefresh").on("click", function () {
               //     dataJsonTable();
               // });
               // $("#tbJsonFilter").find("input#inpFilterexpand").on("click", function () {
               //     cloneFilter($("#tbJsonFilter"), dt);
               // });
               // $('#tbJsonFilter').on('change', 'input:checkbox.incb', function () {
               //     var $inpts = $(this).closest('tr').find('input:text,button,select').prop('disabled', this.checked);
               //     var fieldname = $(this).closest('tr').find('td:first');
               //     if (this.checked) {
               //         fieldname.css("text-decoration", "line-through");
               //     }
               //     else
               //         fieldname.removeAttr('style');
               // }).find('input:checkbox.incb').change();
               // $("#tbJsonFilter>tbody").sortable();
               // //edit filter
               // var filter = dt.filter;
               // if (typeof filter == "undefined" | filter == "") filter = []; // dt.filter
               // funLoading(true);
               // editFilter("", filter, dt.datalist, $("#tbJsonFilter"));
               // //table create
               // //$("#dvjsondt").text(JSON.stringify(dt.datalist));
             
            }
            

        }
    }
    function cleanchar(field) {
        var list = field.split("&lt;");
        for (i in list) {
            field = field.replace('&lt;', '<').replace('&gt;', '>');
        }
        return field;
    }
    function accord() {
        var accord = $("#accord-data");
        if (accord.length == 0) {
            var accord = $("<div/>");
            accord.attr("id", "accord-data");
        }
        else
            accord.empty();
        ////json
        //accord.append($("<h3>JSON/XML</h3>"));
        //var btn = "<div id='inptogglexml'><input type='radio' id='rjson' name='inptogglexml' value='json' checked='checked'><label for='rjson'>JSON</label>" +
        //          "<input type='radio' name='inptogglexml' id='rxml' value='xml'><label for='rxml'>XML</label>" +
        //          "<input type='radio' name='inptogglexml' id='rtree' value='treeview'><label for='rtree'>Treeview</label>" +
        //          " <input type='radio' name='inptogglexml' id='rdt' value='datalist'><label for='rdt'>DataList</label></div>";
        //accord.append($("<div>" + btn + "<div class='xmlbox' id='dvxml' style='display:none'/>" +
        //    "<div class='xmlbox'  id='dvjson'/>" +
        //    "<div class='xmlbox' id='dvtreeview' style='display:none'>" +
        //    "<ul class='treeview' id='ultreeview'><li></li></ul></div>" +
        //    "<div class='xmlbox' id='dvjsondt' style='display:none'/>" +
        //    "</div>"));
        //datalist
        accord.append($("<h3>DataList</h3>"));
        accord.append($("<div> <div><i class='fa fa-caret-right'/>Node for Datalist: <i class='fa fa-h-square imdim help' content='001' style='margin:0 5px 0 5px;'/>" +
            //"<div><input style='width:85%;margin-right:5px;' id='inpstartfield'/><button onclick='ultreeviewDialog()'><i class='fa fa-pencil fa-x'/></button>" +
            //"<button style='margin-left:5px;' onclick='dataJsonCut();'><i class='fa fa-rotate-right fa-x'/></button></div>" +
            "<select id='selnode' onchnage='dataJsonTable()'></select><div>"+
            "<div id='inpdatalist' style='margin-top:5px;'/><table id='tbjsonData'></table><div id='pgjsonData'></div>"));
        accord.append($("<h3>Filter & Rename</h3>"));
        accord.append($("<div id='dvJsonfilter'></div>"));
        return accord.outerHTML();
    }
    function localJsonsave() {
        getlogin()
        var setting = {}, arr = [];
        setting.code = $("#lbId").text();
        setting.title = $("#inpTitle").val();
        setting.descript = $("#inpDesc").val();

        setting.comp = getlogin().comp;
        if ($("#spcustom").css("display") == "block") {
            setting.interval = $("#inpcustom").val() + ";" + $("#selperiod").val();
        }
        else
            setting.interval = $("#selupdate").val();

        setting.updated = makeDateTime(new Date(), "-");
        setting.dtype = "excel";
        var dtlist = exceldatalist;
        var fname = $("#inpTitle").val();
        if ($("#selnode").val()!=null && fname.lastIndexOf(".xls") > -1) {
            dtlist = exceldatalist[$("#selnode").val()];
        }

        if (dtlist != "") setting.datalist = dtlist
        else setting.datalist = "";

        setting.filter = saveFilter("tbJsonFilter");

        var field = saveTable1("tbJsonFilter");
        var f = [], set = {};
        $(field).each(function (i, k) {
            if (k[5]) {
                f.push([k[5], k[0], k[4]]);
            }
        });
        setting.field = f;
        if (datareturn != "")
            //updateimcdata(setting);//localupdate
           
            datareturn = setting;
        return setting;
    }
}
var exceldatalist;
function excelread(data) {
    // from  /js2/js-xls-master/index.html result
    $("#accord-data").show();
    exceldatalist = data;
    var filename = $("#ifData").contents().find("#xlf").val();
    var idx = filename.lastIndexOf('\\');
    filename = filename.substr(1 +idx);
     $("#inpTitle").val(filename);
     if (filename.lastIndexOf(".xls") > -1) {
         var sheets = Object.keys(data);
         $(sheets).each(function (i, k) {
             $("#selnode").append($("<option value='" + k + "'>" + k + "</option>"))
         })
     }
     
     dataJsonTable();

    //$("#dvjson").html(JSON.stringify(data));
    //var xx = "<xml>" + OBJtoXML(data) + "</xml>";
    //$("#dvxml").text(xx);
    //var tree = $.parseXML(xx);
    //xmltreemake($('#ultreeview li'), tree.firstChild)
    //// this – is an —
    //$('<b>–<\/b>').prependTo('#ultreeview li:has(li)').click(function () {
    //    var sign = $(this).text()
    //    if (sign == "–")
    //        $(this).text('+').next().children().hide()
    //    else
    //        $(this).text('–').next().children().show()
    //});
    //var css = ".treeview li{list-style: none;}";
    //css += ".treeview  ul { padding-left: 1em; }";
    //css += ".treeview  b { padding-right: 1em;cursor:pointer }";
    //styleInsert("xmltree-css", css);
    var dtfield = $("#inpdatalist").val(), json1 = data;
    if (dtfield != "") {
        $(dtfield.split(".")).each(function (i, k) {
            json1 = json1[k];
        });
        jqAuto("tbData", "pgData", json1, { width: 459, shrinkToFit: true, fixed: true, autowidth: false });
    }  
    //in case excel, click default as below
    //setTimeout(function () {
    //    ultreeviewDialog();
    //    $("#ultreeview1>li>ul>li").click();
    //    $("#ultreeview1").parent().parent().remove();
    //}, 500);

    function OBJtoXML(obj, d) {
        d = (d) ? d : 0;
        var rString = "\n";
        var pad = "";
        for (var i = 0; i < d; i++) {
            pad += " ";
        }
        if (typeof obj === "object") {
            if (obj.constructor.toString().indexOf("Array") !== -1) {
                for (i = 0; i < obj.length; i++) {
                    rString += pad + "<item>" + OBJtoXML(obj[i]) + "</item>\n";
                }
                rString = rString.substr(0, rString.length - 1)
            }
            else {
                for (i in obj) {
                    var val = OBJtoXML(obj[i], d + 1);
                    if (!val)
                        return false;
                    rString += ((rString === "\n") ? "" : "\n") + pad + "<" + i + ">" + val + ((typeof obj[i] === "object") ? "\n" + pad : "") + "</" + i + ">";
                }
            }
        }
        else if (typeof obj === "string") {
            rString = obj;
        }
        else if (obj.toString) {
            rString = obj.toString();
        }
        else {
            return false;
        }
        return rString;
    }
    function JSONtoXML(json) {
        return eval("OBJtoXML(" + json + ");");
    }
}
function ultreeviewDialog() {
    if ($("#dvtreeview1").length > 0) $("#dvtreeview1").parent().show()
    $("<div id='#dvtreeview1'/>").append($("<ul class='treeview' id='ultreeview1'><li></li></ul>")).dialog({
        autoOpen: true,
        modal: true,
        title: "Select start node",
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: "Close",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            }
        ]
    }).css({ "max-height": "350px", overflow: "auto" });
    var xmlContent = $("#dvxml").text();
    var tree = $.parseXML(xmlContent);

    xmltreemake($('#ultreeview1 li'), tree.firstChild)
    // this – is an —
    $('<b>–<\/b>').prependTo('#ultreeview1 li:has(li)').click(function () {
        var sign = $(this).text()
        if (sign == "–")
            $(this).text('+').next().children().hide()
        else
            $(this).text('–').next().children().show()
    });
    $("#dvtreeview1").parent().css("z-index", 10000);
    $("#ultreeview1 li").on("click", function (e) {
        e.stopPropagation();
        $("#inpstartfield").val("");
        var fnodename = stripTextonly($("#ultreeview1").children());
        console.log($(this))
        findparentnode($(this),fnodename);
        dataJsonCut();

         return false;
    })

}
function findparentnode(pnode,fnodename) {
    console.log(pnode.attr("id"),pnode, stripTextonly(pnode), stripTextonly(pnode.parent()))
    //if(pnode.attr('id')!="ultreeview1")
    switch (pnode[0].nodeName) {
        case "LI":

            if (stripTextonly(pnode) != fnodename) {
                var txt = stripTextonly(pnode) + "." + $("#inpstartfield").val();
                $("#inpstartfield").val(txt);
                findparentnode(pnode.parent(), fnodename);
            }
            else
                trimend();
            break;
        case "UL":
            if (pnode.attr("id") != "ultreeview1") {
                findparentnode(pnode.parent(), fnodename);
            }
            else
                trimend();
            break;
    }
    function trimend() {
        txt = $("#inpstartfield").val();
        if (txt.substring(txt.length - 1) == ".") {
            txt = txt.slice(0, -1);
            $("#inpstartfield").val(txt);
        }
    }
}
//datalist make from json
function dataJsonCut() {
    var json = $("#dvjson").text();
    if (json != "") {
        json = JSON.parse(json);
        var node = $("#inpstartfield").val();
        if (node != "") {
            node = node.split('.');
            $(node).each(function (i, k) {
                json = json[k];
            });
        }
        var flat = flattenjson(json);
        $("#dvjsondt").text(JSON.stringify(flat));
        setTimeout(function () {
            if (typeof flat != "undefined") {
                nodeTable(flat);
            }
        }, 0);
    }

}
function dataJsonTable() {
    var flat = exceldatalist;
    var fname=$("#inpTitle").val();
    if (fname.lastIndexOf(".xls") > -1 && $("#selnode").val()!=null) {
         flat = exceldatalist[$("#selnode").val()];
     }
        
    if (typeof flat != "undefined") {
         nodeTable(flat);
    }
}
function nodeTable(flat) {
    var filter = saveFilter("tbJsonFilter");
    $("#dvjsondt").text(JSON.stringify(flat));
    var dt = applyFilter(flat, filter);
    jqAuto("tbjsonData", "pgjsonData", dt, { width: 680, shrinkToFit: true, fixed: true, autowidth: false });
    setTimeout(function () {
        if ($('#gbox_tbjsonData').parent().attr("id") != "wrap") {
            $('#gbox_tbjsonData').wrap('<div id="wrap" />');
            //$("#wrap").css({ 'overflow-x': 'scroll', 'width': '100%' })
            $("#accord-data").find(".ui-accordion-content").css({ "padding": "5px" });
           
        }
    }, 1000);
}
function flattenjson(json) {
    //convert multilevel json to single
    var rtn = [], str;
    $(json).each(function (j, l) {
        var set = {};
        var klist = Object.keys(l);
        $(klist).each(function (i, k) {
            if (typeof l[k] == "object")
                objparser(l, set, k, l[k]);
            else
                set[k] = l[k];
        });
        rtn.push(set);
    });
    function objparser(rowobj, set, name, jj) {
        if (typeof jj == "object") {
            var klist = Object.keys(jj);
            $(klist).each(function (i, k) {
                objparser(rowobj, set, name + "_" + k, jj[k]);
            });
        }
        else
            set[name] = jj;
    }
    return rtn;
}
//xml to treeview
function xmltreemake(node, tree) {
    var children = $(tree).children()
    node.append(tree.nodeName)
    if (children.length) {
        var ul = $("<ul>").appendTo(node)
        children.each(function () {
            var li = $('<li>').appendTo(ul)
            xmltreemake(li, this)
        })
    } else {
        $('<ul><li>' + $(tree).text() + '<\/li><\/ul>').appendTo(node)
    }
}
// convert XML/JSON
function json2xml(o, tab) {
    var toXml = function (v, name, ind) {
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
        }
        else if (typeof (v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
        }
        return xml;
    }, xml = "";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
function xml2json(xml) {

    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xml2json(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xml2json(item));
            }
        }
    }
    return obj;
};
function readfiles(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            $("#textarea1").text(contents).show();
            $("#accord-data").show();
            console.log( "Got the file.n"
                  +"name: " + f.name + "n"
                  +"type: " + f.type + "n"
                  +"size: " + f.size + " bytesn"
                  + "starts with: " + contents.substr(1, contents.indexOf("n"))
            );
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}
function paramRowdel(that) {
    var rowIndex = that.parent().parent().index()+1;
    $("#tbParam tr:eq(" + rowIndex + ")").remove();
}
function paramMake() {
    //initial:parameter string init:? or &;
    var url = $("#inpurl").val();
    var paramexist = false;
    if (url.indexOf("?") > -1) paramexist = true;
    var param = "", connector = "&";
    var tb = saveTable("tbParam", true, true);
    if (tb.length > 0)
        $(tb).each(function (i, k) {
            if (i == 0 && !paramexist) connector = "?"; else connector = "&";
            param += connector + k[0] + "=" + k[1];
        })
    return param;
}
function dataInputLoad(setting) {
    dataInputLoad.delreload = delreload;
    var $dialog = $("<div id='dvdatainput'  style='z-index:107;'></div>")
        .append(dataInputTab())
       .dialog({
           autoOpen: true,
           modal: true,
           height: 425,
           width: 600,
           title: "Direct Input Data",
           heightStyle: "content",
           open: function() {
               $(this).find('.ui-dialog-titlebar-close').blur();
           },
           close: function (event, ui) {
               $(this).dialog('destroy').remove();
           },
           buttons: [
                {
                    text: "Save",
                    click: function () {
                        getlogin()
                        var setting = {},arr=[];
                        setting.code = $("#lbId").text();
                        setting.title = $("#inpTitle1").val();
                        setting.descript = $("#inpDesc").val();
                        setting.comp = getlogin().comp;
                        setting.dtype = "input";
                        setting.updated = makeDateTime(new Date(),"-");

                        var scheme=datajqueryRead($("#dtable1"));
                        var dtlist = datajqueryRead($("#dtable2"));
                        if (scheme.length > 0) setting.datascheme = scheme;
                        else setting.datascheme = "";
                        if (dtlist.length > 0) setting.datalist = dtlist
                        else setting.datalist = "";
                      
                        jsonUpdateAjax("imcdata", "", JSON.stringify(setting), "code", setting.code,dataList);
                    }
                },
                {
                    text: "Del",
                    click: function () {
                        if (confirm("Delete?")) {
                            var code = $("#lbId").text();
                            deleteimcdata(code);
                            var json = JSON.stringify(code);
                            jsonDelAjax("imcdata", "", "code", code, dataInputLoad.delreload);
                        }
                    }
                },
                {
                   text: "Close",
                   click: function () {
                       $(this).dialog('destroy').remove();
                   }
               }
           ]
       }).parent().find('.ui-dialog-titlebar-close').prependTo('#tab-datainput').closest('.ui-dialog').children('.ui-dialog-titlebar').remove();
    $("#dvdatainput").parent().find('.ui-dialog-titlebar-close').css({"top": "21px","display":"none"});
   // $(".ui-dialog .ui-dialog-content").css({ padding: 0 });
    //data scheme

    var jqid = "dtable1";
    var pgid = "pgdtable1";
    var colname = ["Fieldname", "Type", "Length", "Nullable","Keycode"];
    var colmodel = [];
    colmodel.push({ name: 'fieldname', width: 120, editable: true, edittype: "text" });
    colmodel.splice(1, 0, {
        name: 'type', width: 80, editable: true, edittype: "select"
        , editoptions: {
            value: "varchar:Varchar;char:Char;int:Int;float:Float;datetime:DateTime;bool:Bool"
            , dataEvents: [{
                type: 'change', fn: function (e) {
                    var rowid = $(e.target).attr("rowid");
                    var length = $('#' + rowid + '_length');
                    var nullable = $('#' + rowid + '_nullable');
                    nullable.attr("checked", true);
                    switch ($(e.target).val()) {
                        case "varchar": case "char":
                            length.val('50');
                            break;
                        case "int":
                            length.val('8');
                            break;
                        case "float":
                            length.val('8');
                            break;
                        case "datetime":
                            length.val("8");
                            break;
                        case "bool":
                                length.val("1");
                                break;
                    }
                }
            }]
        }
    });
    colmodel.splice(2, 0, { name: 'length', width: 50, editable: true, edittype: "text", editoptions: { size: 5,defaultValue:50 } });
    colmodel.splice(3, 0, {
        name: 'nullable', editable: true, edittype: "checkbox"
        , editoptions: { value: "True:False", defaultValue: "True" }, formatter: "checkbox", formatoptions: { disabled: false }, width: 50
    });
    colmodel.splice(4, 0, {
        name: 'keycode', editable: true, edittype: "checkbox"
        , editoptions: { value: "True:False", defaultValue: "False" }, formatter: "checkbox", formatoptions: { disabled: false }, width: 50
    });
    var data =  [];
    var scheme = "";
    $("#lbId").text("dt"+idMake());
    //dataread
   // var setting = selectimcdata("imcdata", datacode);
    if (setting != "") {
        $("#lbId").text(setting.code);
        $("#inpTitle1").val(setting.title);
        $("#inpDesc").val(setting.descript);
        if (setting.hasOwnProperty("datalist")) data = setting.datalist;
        if (setting.hasOwnProperty("datascheme")) scheme = setting.datascheme;
    }
    dataInputInject(jqid, pgid, colname, colmodel, scheme);

    //data Insert
    dtable2Make(data);

    setTimeout(function () { $("#dvdatainput").parent().css("z-Index", 1303) }, 0);
    //tabclick event
    var tabb = $('#tab-datainput');
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 2:
                    $("#dtable2").jqGrid("GridUnload");
                    dtable2Make(data);
                    break;
            }
            var hp = ['datainput', 'datainput_scheme',  'datainput_insert'];
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'datainput');
    helpinsert();

    styleInsert("datainput", "#tab-datainput{border: none; } .ui-tabs .ui-tabs-panel{padding:0 !important;}  #tab-datainput .ui-dialog .ui-dialog-content{padding:0 !important;} #tab-datainput .ui-dialog .ui-dialog-titlebar-close{top:15px !important;}");
    function delreload() {
        //after delete inputdata reload datalist and self close
        var indx = $('#tbDatalist').getGridParam('page');
        jsonReadAjax('imcdata', '', '', '', dataList);
        $("#tbDatalist").trigger("reloadGrid", [{ page: indx }]);
        swal({
            title: "<span style='color:#F8BB86;font-style:normal;'>Delete Success!<span>"
            , text: "Data set deleted !"
            , timer:1000
            , showConfirmButton: false
            , html: true
        });
        setTimeout(function () {  $("#dvdatainput").dialog('destroy').remove();}, 1500);
    }
}
function dataInputTab() {
    //input field
    var dv = $("<table style='padding:5px;width:100%'/>");
    var inp1 = $("<tr><td style='width:120px'><i class='fa fa-caret-right'/> ID: </td><td><label id='lbId'></label></td></tr>");
    var inp2 = $("<tr><td style='width:120px'><i class='fa fa-caret-right'/> Title: </td><td><input style='width:90%' id='inpTitle1' /></td></tr>");
    var inp3 = $("<tr><td><i class='fa fa-caret-right'/> Description:  </td><td><input style='width:90%'  id='inpDesc' /></td></tr>");
    dv.append(inp1);
    dv.append(inp2);
    dv.append(inp3);


    var tabarr={};
    tabarr.id="tab-datainput";
    tabarr.head=["Summary","DataScheme","DataInput"];
    var content = [];
    content.push(dv.outerHTML());
    content.push("<div style='padding:10px 0 5px 0;'><table id='dtable1'></table><div id='pgdtable1'></div></div>");
    content.push("<div style='padding:10px 0 5px 0;'><table id='dtable2'></table><div id='pgdtable2'></div></div>");
    tabarr.content=content;
    var tab=makeTab(tabarr);

    ////var accord1 = $("<div id='dvEvent' style='padding:5px;'/>");
    //accordioncss();

    //var accord = $("<div id='dtinputaccordion' style='padding:5px;'/>");
    //accord.append("<h3>Data Scheme</h3>");
    //accord.append("<div style='padding:10px 0 5px 0;'><table id='dtable1'></table><div id='pgdtable1'></div></div>");
    //accord.append("<h3>Data Input</h3>");
    //accord.append("<div style='padding:10px 0 5px 0;'><table id='dtable2'></table><div id='pgdtable2'></div></div>");
    //accord.accordion({
    //    event: "click",
    //    collapsible: true,
    //    active: 0,
    //    heightStyle: "content"
    //}).on('accordionactivate', function (event, ui) {
    //    var $activeTab = accord.accordion('option', 'active');
    //    switch ($activeTab) {
    //        case 0:
    //            break;
    //        case 1:
    //            //var inp2 = datajqueryRead($("#dtable2"));
    //            //var data = "";
    //            //dtable2Make(data);
    //            //$("#dvdatainput").dialog('destroy').remove();
    //            //selchgdata("input");
    //            //accord.accordion("option", "active", 1);
    //            break;
    //    }
    //});

    return tab;
}
function dataInputInject(gridid, pagerid, colname, colmodel, data) {
    colname.push('');
    colmodel.push({ name: 'del', width: 15, sortable: false });
    //opt:option 추가 사항
    var opt = {
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: data,
        height: "auto",
        autowidth: false,
        width: 567,
        editurl: "clientArray",
        rowNum: 10,
        rowList: [5, 10, 20, 30],
        emptyrecords: "Nothing to display",
        pager: pagerid,
        sortable: true,
        onCellSelect: function (rowid, iCol) {
            var list = jQuery("#" + gridid).getRowData(rowid);
            var namelist = Object.keys(list);
            switch (namelist[iCol]) {
                case "del":
                    jQuery("#" + gridid).jqGrid('delRowData', rowid);
                   
                    break;

            }
        },
        gridComplete: function () {
            var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                var rowarr = jQuery("#" + gridid).getRowData(cl);
                ce = "<span class='ui-icon ui-icon-trash'  />";
                var ctr = {  del: ce };
                jQuery("#" + gridid).jqGrid('setRowData', ids[i], ctr);
            }
        }
    };

    var jq = $("#" + gridid);
    jq.jqGrid("GridUnload");
    jq.jqGrid(opt);
    jqPagerAdd(gridid, pagerid, [false, false, false, false, false], []);
    var inlineparams = {
        add: true,
        edit: true,
        save: true,
        cancel: true,
        del: true,
        addParams: { position: "last" }
    };

    jq.jqGrid('inlineNav', "#" + pagerid, inlineparams);
}
function datajqueryRead(jq) {
    var rtn = [];
        if (jq.jqGrid('getGridParam', 'multiselect'))
            var myIDs = jq.jqGrid('getGridParam', 'selarrrow');
        else
            myIDs = jq.getDataIDs(); //all row index as array
        $(myIDs).each(function(i,s){
            var myRow = jq.jqGrid('getRowData', s);//myIDs[i]);
            $(myRow).each(function (i, k) {
                delete k.myac;
                delete k.del;
                rtn.push(k);
            })
        })

        return rtn;
}
function dtable2Make(data) {
    var inp1 = datajqueryRead($("#dtable1"));
    var colname = [];
    $(inp1).each(function (i, k) {
        if(k!="undefined")
        colname.push(k.fieldname);
    })
    var colmodel = [];
    $(colname).each(function (i, k) {
        if (k != "undefined")
            colmodel.push({ name: k, width: 70, editable: true, edittype: "text" });
    });
    dataInputInject("dtable2", "pgdtable2", colname, colmodel, data);
}
function dataGrid(gridid,pagerid) {
    var datasrc = localStorage.getItem("imcdata");
    if (datasrc == '' | datasrc == null) {
        dataListOnlyAjax(true);
    }
    datasrc = eval("(" + datasrc + ")");
    datasrc = JSON.parse(JSON.stringify(datasrc, ['code', 'comp', 'dtype', 'title', 'descript', 'updateinterval', 'updated']));
    var li = [], li1 = [];
    $.each(datasrc, function (i, k) {
        if (i != "updated" && k != null) {
            switch (k.dtype) {
                case '1':
                    k.dtype = 'query';
                    break;
                case '2':
                    k.dtype = 'procedure';
                    break;
            }
            li.push(k);
        }
    });
//    var gridid = "tbDatalist1";
//    var pagerid = "dvDatalistpager1";

    //gridid,pagerid,data만으로 구성되는 data display용 jqgrid
    $("#" + gridid).jqGrid("GridUnload");
    var colmodel = []; var colname = []; var list = [];

    $.each(li, function (fn, v) {
        $.each(v, function (i, vv) {
            if (!arraychkexist(list, i))
                list.push(i);
        });
    });
    $.each(list, function (i, fname) {
        if (fname == "updateinterval") fname = fname.replace("update", "");
        colname.push(fname);
        var opt = { name: fname, width: 100 };
        switch (fname) {
            case "descript":
                opt.width = 150;
                break;
            //case "code":
            case "value": case "connectpool": case "query": case "queryway": case "newline": case "separator": case "comp":
                opt.hidden = true;
                break;
        }
        colmodel.push(opt);
    });
    colname.push('');
    colname.unshift('');
    colmodel.unshift({ name: 'edit', width: 15, sortable: false });
    colmodel.push({ name: 'sel', width: 15, sortable: false });
    //opt:option 추가 사항
    var options = {
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: li,
        height: "auto",
        autowidth: true,
        rowNum: 5,
        rowList: [5, 10, 20, 30],
        pager: pagerid,
        //caption: "Data View",
        sortable: true,
        //onSelectRow: function (rowid) { console.log(jQuery("#" + gridid).getRowData(rowid).code) },
        gridComplete: function () {
            var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                var rowarr = jQuery("#" + gridid).getRowData(cl);
                //be = "<span class='ui-icon ui-icon-check'  onclick=\"editDatacode('" + rowarr.code + "','');\"  />";
                    be = "<span class='ui-icon ui-icon-check'  onclick=\"jsonReadAjax('imcdata', '', 'code', '" + rowarr.code + "', editDatacodecallback);\"  />";
                
                if (gridid == "tbDatalist1")
                    be = "<span class='ui-icon ui-icon-check'  onclick=\"seriesFill('" + rowarr.code + "','" + rowarr.title + "','');\"  />";
                //ce = "<span class='ui-icon ui-icon-trash'   onclick=\"delFilter('" + rowarr.code + "');\" />";
                ae = "<span class='ui-icon ui-icon-pencil'   onclick=\"editRemote('" + rowarr.code + "');\" />";
                jQuery("#" + gridid).jqGrid('setRowData', ids[i], { sel: ae, edit: be });
            }
        }
    };
    jQuery("#" + gridid).jqGrid(options);
    jQuery("#" + gridid).jqGrid('navGrid', '#' + pagerid, { edit: false, add: false, del: false, refresh: false, search: false });
    jQuery("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, { caption: "reload",
        buttonicon: "ui-icon-arrowrefresh-1-w",
        onClickButton: function () {
            dataListOnlyAjax(true);
            jsonReadAjax('imcdata', '', '', '', dataList);
        }
    });
    return li;
}
function seriesFill(code,title,filter) {
    $("#lbDatacode_mycal").text(code);
    $("#inpCalname").val(title);
    var dt = selectimcdata("imcdata", code);
    $("#dvFilter_mycal").empty();
    var tb = makeFilter(dt,filter);
    $("#dvFilter_mycal").append(tb);
    $("#dvDatalist1").hide();
    $("#dvDataedit1").show();
}
function editDatacode1() {
    //datareturn has value
    if (datareturn == "yes") {
        jsonReadAjax('imcdata', '', '', '', dataList);
        return false;make
    }
    var rtn = "";
    $("#trDataedit").show();
    $("#trDatalist").hide();
    var dt = datareturn;
    if (dt.dtype == "input") {
        type = "input";
        dt = k;
        return false;
    }
   $("#lbDatacode").text(dt.code);
        if (dt.hasOwnProperty('input')) {
            $("#txdataedit").val(dt.input);
            $("#accordion").accordion({
                active: 1
            });
        }
        else {
            var filter = [];
            if(dt.hasOwnProperty("filter"))filter=dt.filter;

            accordmake(dt,filter);
            dataEdit(dt);

            var dlist = [];
            if (dt.hasOwnProperty("datalist")) dlist = dt.datalist;
            if (dlist.length > 0) {
                setTimeout(function () {
                    $("#dvFilter").css("display", "block");
                    editFilter("", filter, dlist,$("#tbFilter"));
                    previewData(applyFilter(dt.datalist, filter));

                }, 1000);
            }
            else
                $("#dvFilter").css("display", "none");
        }


        buttonCollectLoadFilter();
}
function editDatacode(datacode, filterdata) {
    var rtn = "";
    $("#trDataedit").show();
    $("#trDatalist").hide();
    var dt = "";
    if (datacode != "") {
        var exist = false;
        var data = JSON.parse(localStorage.getItem("imcdata"));
        var type = "";
        $.each(data, function (i, k) {
            if (k.code == datacode) {
                if (k.dtype == "input") {
                    type = "input";
                    dt = k;
                    return false;
                }
                else {
                    dt = k;
                    if (k.hasOwnProperty('datalist') && k.hasOwnProperty("updated")) {
                        if (readydt == datacode | substracttime(k.updated) <= 24) {
                            exist = true;
                            readydt = "";
                        }
                        else if (substracttime(k.updated) > 24) {
                            dataListAjax(datacode, true);
                            //return false;
                        }
                    }
                }
            }
        });
        if(!exist && type !="input")
            dataListAjax(datacode,true);
        $("#lbDatacode").text(dt.code);
       // $("#selSrc").val(dt.type);
        //showbysrc($("#selSrc"));
        if (dt.hasOwnProperty('input')) {
            $("#txdataedit").val(dt.input);
            $("#accordion").accordion({
                active: 1
            });
        }
        else {
            var filter = filterdata;
            if (filter == "" | filter.length == 0) filter = []; // dt.filter
            accordmake(dt,filter);
            dataEdit(dt);

            var dlist = [];
            if (dt.hasOwnProperty("datalist")) dlist = dt.datalist;
            if (dlist.length > 0) {
                setTimeout(function () {
                    $("#dvFilter").css("display", "block");
                    editFilter("", filter, dlist,$("#tbFilter"));
                    previewData(applyFilter(dt.datalist, filter));

                }, 1000);
            }
            else
                $("#dvFilter").css("display", "none");
        }
    }
    else {
        $("#lbDatacode").text('');
        $("#txdataedit").val('');
        $("#tbdatagrid").jqGrid("GridUnload");
        $("#dvFilter").remove();
        $("label[for='selLocal']").remove();
        $("#selLocal").remove();
        $("#selSrc").val('');
    }

        buttonCollectLoadFilter();
}
function editDatacodecallback(dt, filterdata) {
    // jsonReadAjax("imcdata", "", "code", datacode, editDatacodecallback)
    //editDatacodecallback.datalist = datalist;
    //if (!dt.hasOwnProperty("datalist")) {
    //    if ($.inArray(dt.dtype, ["query", "procedure"]))
    //        jsonDatabaseAjax(dt, "", editDatacodecallback.datalist, [dt, filterdata]);
       
    //}
    //function datalist(dlist, dt, filterdata) {
    //    if (dlist != "") {
    //        dt.datalist = dlist;
    //        editDatacodecallback(dt, filterdata);
    //    }
    //}
    var rtn = "",exist=false,filterdlist,selfilter="";
    $("#trDataedit").show();
    $("#trDatalist").hide();
    switch(dt.dtype){
        case "input":
            type = "input";
            break;
        case "procedure": case "query":case "database":
            if (dt.hasOwnProperty("querylist")) {
                $(dt.querylist).each(function (i, k) {
                    if (k.hasOwnProperty("sqlcommand") && k.sqlcommand == "select") {
                        dt.datalist = k.datalist;
                        selfilter = k.filter;
                    }
                });
            }
            break
            default:
                if (dt.hasOwnProperty('datalist') &&(dt.hasOwnProperty("update") | dt.hasOwnProperty("delete"))) {
            if (readydt == datacode | substracttime(dt.updated) <= 24) {
                exist = true;
                readydt = "";
            }
            //else if (substracttime(dt.updated) > 24) {
            //    dataListAjax(datacode, true);
            //    //return false;
            //}
        }
        break;
    }    
    $("#lbDatacode").text(dt.code);
    if (dt.hasOwnProperty('input')) {
        $("#txdataedit").val(dt.input);
        $("#accordion").accordion({
            active: 1
        });
    }
    else {
        var filter;
        if(typeof filterdata!="undefined")filter= filterdata;
        else if (selfilter != "") filter = selfilter;
        else if (typeof filter == "undefined" | filter == "")
            filter = dt.filter
        accordmake(dt, filter);
        dataEdit(dt);
        var dlist = [];
        if (dt.hasOwnProperty("datalist")) dlist = dt.datalist;
        if (dlist.length > 0) {
            setTimeout(function () {
                $("#dvFilter").css("display", "block");
                editFilter("", filter, dlist, $("#tbFilter"));
                filterdlist=applyFilter(dlist, filter);
                previewData(filterdlist);
            }, 1000);
        }
        else
            $("#dvFilter").css("display", "none");
    }
    setTimeout(function () {
        dataajaxinsert(dt, filterdlist);
    }, 1500);
    buttonCollectLoadFilter();
}
function dataajaxinsert(dt, dlist,editcase,param) {
    //insert datasrc 
    //jsonReadAjax("imcdata", "", "code", datacode, dataajaxinsert)
  console.log(dt,editcase,param)
    var datacode="";
    dataajaxinsert.datasrc = datasrc;
    //if (dt == "") {
    //    sweetmsgautoclose("Ooops!!!","No data avaliable!!")
    //}
    {
        $("#spdataajax").remove();
        $("<span id='spdataajax' style='display:none'/>").appendTo($("body"));
        $("#spdataajax").text(JSON.stringify(dt));
        
        if ((dlist != "" && typeof dlist != "undefined") | dt.hasOwnProperty("datalist")) {
            spdlist(dt.datalist, editcase, param);
        }

        else if (dt.hasOwnProperty("datacode")) {
            datacode = dt.datacode;
        }

        else if ( dt.hasOwnProperty("code")) {
            datacode = dt.code;
        }
        if (datacode != "")
            jsonReadAjax("imcdata", "", "code", datacode, dataajaxinsert.datasrc, [dt, editcase, param])
        else {
            switch (editcase) {
                case "edit":
                    editObject.process(param);
                    break;
                case "list":
                    archiveEdit.process(param);
                    break;

            }
        }
    }
    function datasrc(dtsrc, dt, editcase,param) {
        if ($.inArray(dtsrc.dtype, ["procedure", "query", "database"]) > -1) {
            if (dtsrc.hasOwnProperty("querylist")) {
                $(dtsrc.querylist).each(function (i, k) {
                    if (k.hasOwnProperty("sqlcommand") && k.sqlcommand == "select" && k.hasOwnProperty("datalist"))
                        dtsrc.datalist = k.datalist;
                    else
                        jsonQueryCheck(dtsrc,dataajaxinsert.datasrc,[dt,editcase,param]);
                });
            }
        }
        var filterdt = applyFilter(dtsrc.datalist, dt.filter);
        if(typeof editcase !="undefined")
        spdlist(filterdt, editcase,param);
    }
    function spdlist(dlist, editcase,param) {
        $("#spdlist").remove();
        $("<span id='spdlist' style='display:none'/>").appendTo($("body"));
        $("#spdlist").text(JSON.stringify(dlist));
        switch (editcase) {
            case "edit":
                editObject.process(param);
                break;
            case "list":
                archiveEdit.process(param);
                break;

        }
      
    }
}

var btntype = "";
function buttonCollectLoadFilter() {
    if ($("#inpTitle").length > 0) {
        $('label[for=inpTitle]').remove();
        $("#inpTitle").remove();
        $('#tdSrc').find('br').remove();
    }
    if ($("#inpCancel1").length > 0)
        $("#inpCancel1").remove();
    switch (btntype) {
        default:
            if (datartnctr != "") {
                $("#inpApply").on("click", function () {
                    $(datartnctr).text($('#spDatacode').text()); datartnctr = "";
                    $(this).closest("div[role='dialog']").remove();
                    $("#Data").append($(makeDatasrc()))
                });
            }
            else
            $("#inpApply").attr("onclick", "funLoading(true);saveData()");
            $("#inpApply").attr("value", "Apply");
            $("#inpCancel").show();
            $("#inpCancel").attr("onclick", "jsonReadAjax('imcdata', '', '', '', dataList);");
            $("#inpCancel").attr("value", "List");
            break;
        case "dialog":
            var ctr = selectimctable(menuid, subid, $("#lbCtr").text()), title = "";
            $("#inpApply").attr("onclick", "savemycal();");
            $("#inpApply").attr("value", "Apply");
            $("#inpCancel").show();
            $("#inpCancel").attr("onclick", "jsonReadAjax('imcdata', '', '', '', dataList)");
            $("#inpCancel").attr("value", "List");
            $("#inpApply").parent().append($("<button style='margin-left:5px' id='inpCancel1' onclick=\"mycalDialogClose('" + $("#lbCtr").text() + "');\" >Cancel</button>").button());

            //$("#lbDatacode").parent().prepend("<label for='inpTitle'>Title Name: </label><input id='inpTitle' value='" + title + "' /><br/>");
            break;

    }
    $("#inpApply").button();
    $("#inpCancel").button();
}
function buttonCollectDataList() {
    if ($("#inpTitle").length > 0) {
        $('label[for=inpTitle]').remove();
        $("#inpTitle").remove();
        $('#tdSrc').find('br').remove();
    }
    if ($("#inpCancel1").length > 0)
        $("#inpCancel1").remove();
    switch (btntype) {

        default:
            $("#inpApply").attr("onclick", "dataNewpopup()");
            //$("#inpApply").attr("onclick", "editRemote1('','')");
            $("#inpApply").attr("value", "New");
            //$("#inpCancel").hide();
            var set = {}, id = "", clas = "";
            id = $("#lbCtr").text().replace("jq", "");
            set.id = id;
            clas = $("#" + id).attr("class");
            if (typeof clas != "undefined") {
                clas = clas.substring(clas.lastIndexOf(" ") + 1);
                set.class = clas;
            }

            $("#inpCancel").attr("onclick", "$('#dveditback').remove(); editObject(" + JSON.stringify(set) + ");selectTab('Data');");
            $("#inpCancel").attr("value", "Cancel");
            break;
        case "dialog":
            $("#inpApply").attr("onclick", "editRemote1('')");

            $("#inpApply").attr("value", "New");

            $("#inpCancel").attr("onclick", "mycalDialogClose('" + id + "');");
            $("#inpCancel").attr("value", "Cancel");
            break;
    }
    $("#inpApply").button();
    $("#inpCancel").button();
}
function delFilter(id) {
    deleteimcsetting("imcdata", id);
    jsonReadAjax('imcdata', '', '', '', dataList);
}
function makeFilter(imctb, filter, callback) {
    var srcdata = imctb.datalist;
    var fieldlist = [], srcdt = [];
    if(typeof srcdata!="undefined" && srcdata!="") srcdt=srcdata[0];
    if (typeof filter == "undefined" | filter=="") filter = imctb.filter;
    if (filter != "" && typeof filter != "undefined" && srcdt.length>0) {
        var fieldodr = [];
        $(filter).each(function (i, k) {
            fieldodr.push(k[0]);
        })
        srcdt = {};
        $(fieldodr).each(function (i, k) {
            srcdt[k] = srcdata[0][k];
        });
    }

    $.each(srcdt, function (i, k) {
        fieldlist.push({ code: i, name: i });
    });

    var field = ["", "code", "name"];
    var format1 = ["yyyy-MM-dd", "yy-MM-dd", "yyyy-MM-dd hh:mm:ss"];
    var format2 = ["0", "00", "0.00"];
    cssInsert("multiple-select-css", "/js2/jquery-multiple-select/multiple-select.css");
    jscriptInsert("multiple-select-js", "/js2/jquery-multiple-select/jquery.multiple.select.js");
    styleInsert("li", "li{margin-bottom:0 !important;}");
    var data = [];
    var head = [makeCtr(["span", "Field", , , ]), makeCtr(["span", "Dtype", , , ]), makeCtr(["span", "Oper", , , ]), makeCtr(["span", "Value", , , ]), makeCtr(["span", "Format", , , ])
        , makeCtr(["span", "Rename", , , ]), makeCtr(["span", "Hide", , , ])];
    data.push(head);
    $.each(srcdt, function (fname, value) {
        //convert '.' to '_'
        fname = fname.replace(".", "_").replace(".", "_").replace(".", "_")
        //string인 경우
        var valuelist = [], format = "",fformat;
        //parameter from url
        var paramlist = getParams();
        //fixed values:string, time type
        var fixedStr = ["$comp", "$name", "$id", "$boss", "$division", "$position"];
        var fixedPeriod = ["$thisYear", "$thisQuarter", "$thisMonth", "$thisWeek", "$Today", "$Yesterday", "$Tomorrow"];
        var ftype = fieldTypeFind(srcdata, fname);
        if (ftype.type == "string") valuelist = ftype.valuelist.concat(fixedStr).concat(paramlist);
        switch (ftype.type){
            case "int":
                break;
            case "float":
                fformat = ["0", "00", "0.00"];
                break;
            case "datetime":
                fformat = ["yyyy-MM-dd", "yy-MM-dd", "yyyy-MM-dd hh:mm:ss"];
                break;
        }
        if(typeof fformat!="undefined")
        format = makeCtr(["select", "N/A;" + fformat.join(";"), "selFormat" + fname, "width:60px", ]);
        var valfield = makeFilterRow("", fname, ftype.type, valuelist)
        var fn = fname;
        if (fname.length > 25) fn = fname.substring(0, 25) + "...";
        var fname1 = "<span title=" + fname + ">" + fn + "</span>";
        var cb = false, displayname = "";
        var coltype = makeCtr(["select", "string;int;float;datetime;bool", "selColtype"+fname, "coltypeclass", ""]);
        var row = [fname1, coltype,makeOperator("", fname, ftype.type), valfield, format, makeCtr(["input", displayname, "inpDisp" + fname, "width:90px", ])
            , makeCtr(["input:checkbox", cb, "cb" + fname, "incb", ""])];
        data.push(row);
    });
   var tb = makeTable("", data, "general");
  // makeTable("", data, "general").dialog();
    var foot = ['<input id="inpFilterexpand" type="button" class="btnRoundsmall" value="expand"  style="padding:0 3px 0 3px;margin-left:5px;" />' +
        '<input id="inpFilterrefresh" type="button" class="btnRoundsmall" value="refresh"  style="padding:0 3px 0 3px;" />' +
    '|{"colspan":"7","style":"text-align:right;padding:3px 0 3px 0;"}'];
    var tb1 = appendFooter(tb, foot);
   
    if (typeof callback == "undefined") {
        setTimeout(function () {
            $(".multiselect").multipleSelect({
                width: 150
                , styler: function (value) {
                    if ($.inArray(value, ["$comp", "$name", "$id", "$boss", "$division", "$position"]) > -1) {
                        return 'background-color: #F7F3F7; color: #181C18;';
                    }
                }
            });
            $("input[id^='date_']").datepicker({ dateFormat: 'yy-mm-dd' });
        }, 1500);
    }
    else
        callback(tb1, imctb);
    return tb1;
}
function makeFilterRow(pre, fieldname, type, valuelist) {
    var rtn = "";
    switch (type) {
        case "string":
            var srcdata1 = [];
            $.each(valuelist, function (i, k) {
                srcdata1.push({ code: k, name: k });
            });
            var sel = makeSelect(srcdata1, ["", "code", "name"]);
            $(sel).attr("id", "sel" + pre + fieldname);
            $(sel).attr("class", "multiselect");
            rtn = $(sel).outerHTML();
            break;
        case "number":case "float": case "int":
            rtn = makeCtr(["input", , "num_" + pre + fieldname, "width:55px;", ]) + makeCtr(["input", , "num_" + pre + fieldname + "_1", "display:none;width:55px;margin-left:5px;", ]);
            break;
        case "datetime":
            rtn = makeCtr(["input:datetime", , "date_" + pre + fieldname, "width:55px;", ]) + makeCtr(["input:datetime", , "date_" + pre + fieldname + "_1", "display:none;width:55px;margin-left:5px;", ]);
            break;
    }

    return rtn;
}
function saveFilter(tb) {
    var filter = saveTable1(tb);
    //column order

    var fsave = [], set = {};
    $.each(filter, function (j, s) {
        var chk = true;// false;
        if (s[6]) chk = true;
        if (s[5] != "") chk = true;
        if (s[4] != "" | s[4] !="N/A") chk = true;
      //  if (typeof s[2] != "undefined" && s[2] != ":") chk = true;
        if ($.isArray(s[3]) && s[3].length > 0 && s[3]!=":") chk=true;

     if (chk) fsave.push(s);
    });
    return fsave;
}

function hideFilter(src, filter) {
    var dellist = [];
    $.each(filter, function (j, s) {
        if (s[6]) {
            dellist.push(s[0]);
        }  
    });
    $(src).each(function (i, k) {
        $(dellist).each(function (a, b) {
            delete k[b];
        });
    });
    return src;
}
function cloneFilter(tb, dt) {
    tb.clone().attr("id", tb.attr("id") + "1")
    .dialog({
        autoOpen: true,
        modal: false,
        title: 'Edit Filter',
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: "Close",
                click: function () {
                    $(this).dialog('destroy').remove();
                }
            },
        {
            text: "Update",
            click: function () {
                var filter = saveFilter(tb.attr("id") + "1");
                //var srcdata=selectimcdata("imcdata",datacode).datalist
                var srcdata=dt.datalist
                editFilter("", filter, srcdata, tb);
                $(this).dialog('destroy').remove();
            }
        }
        ]
    })
    .parent().css({ height: $(window).height(), width: $(window).width(), top: 0, left: 0, 'z-index': 1900 });
}
function paramFilter(src) {

}
function parseOperator(left, right, oper, ftype) {
    rtn = false;
    if (ftype == "datetime") {
        left = new Date(left);
        right = new Date(right);
    }

    switch (oper) {
        case "=": if (left - right == 0) rtn = true; break;
        case ">": if (left - right > 0) rtn = true; break;
        case "<": if (left - right < 0) rtn = true; break;
        case ">=": if (left - right >= 0) rtn = true; break;
        case "<=": if (left - right <= 0) rtn = true; break;
        case "<>": if (left != right) rtn = true; break;
        case "": rtn = true;break;
    }
    return rtn;
}
function paramreplace(val) {
    var rtn = "";
    switch (val.substring(0, 1)) {
        case "$":
            var lg = getlogin();
            rtn = lg[val.replace("$", "")]
            break;
        case "@":
            var pa = getParams();
            rtn = pa[val];
            break;
        case "#":
            var se = eventparam;
            if (typeof se != "undefined" && se.hasOwnProperty(val))
                rtn = se[val];
            break;
        default:
            rtn = val;
    }
    return rtn;
}
function previewData(fieldlist) {
    //applyFilter후 Datasrc에서 grid,json model preview

    if (fieldlist.length > 0) {
        jqAuto("tbdatagrid", "datapager", fieldlist, { width: 459, shrinkToFit: true, fixed: true, autowidth: false });
        $("#txdataedit").val(JSON.stringify(fieldlist));
    }
    else {
        $("#txdataedit").val("No data avaliable");
        RenderGridBlank("tbdatagrid", "datapager");
    }


}
function editFilter(pre, filter, srcdata, tb) {
    ff = filter, vv = srcdata;
    if (typeof tb == "undefined") tb = $("#tbFilter");
    if (typeof srcdata != "undefined") var srczero = srcdata[0];
  
    $.each(srczero, function (fn, value) {
        var val = "",coltype="string", oper = "";
        var ftype = fieldTypeFind(srcdata, fn);
      
        if(typeof filter !="undefined" && filter.length>0)
        hidecheck(fn);
        $.each(filter, function (index, s) {
            if (fn == s[0]) {
                fn = fn.replace(".", "_").replace(".", "_").replace(".", "_")
                coltype = s[1];
                oper = s[2];
                val = s[3];
                if (val.length > 0 && val != ":") {
                    switch (ftype.type) {
                        case "string":
                            tb.find("#sel" + pre + fn).multipleSelect("setSelects", val);
                            break;
                        case "number": case "datetime":
                            var prefix = "date";
                            if (ftype.type == "number") prefix = "num";

                            //for avoiding  "id with dot" error
                            var operid = document.getElementById("selop"+pre + fn)
                            var valfrid = document.getElementById(prefix + "_" + fn);
                            var valtoid = document.getElementById(prefix + "_" + fn + "_1");

                            tb.find(operid).val(oper);
                            tb.find(valfrid).val(val.split(":")[0]);
                            if (oper == "bw")
                                tb.find(valtoid).val(val.split(":")[1]);
                            break;
                    }
                }

                //displayname & hide field
                tb.find("#selColtype" + fn).val(s[1]);
                tb.find("#selFormat" + fn).val(s[4]);
                tb.find("#inpDisp" + fn).val(s[5]);
                if (!s[6])
                    showcheck(fn)
               
            }

        });
       
         $(".incb").on("click",function () {
            var fname = $(this).closest('tr').find('td:first');
            var chk = $(this).is(":checked");
            if(chk){
                fname.css("text-decoration", "line-through");
                fname.closest('tr').find('input:text,button,select').prop('disabled', true);
            }
            else {
                fname.css("text-decoration", "none");
                fname.closest('tr').find('input:text,button,select').prop('disabled', false);
            }
                       
        });
    });
    function hidecheck(fn) {
        tb.find("#cb" + fn).prop("checked", true);
        tb.find("#cb" + fn).closest('tr').find('input:text,button,select').prop('disabled', true);
        var fieldname = tb.find("#cb" + fn).closest('tr').find('td:first');
        fieldname.css("text-decoration", "line-through");
    }
    function showcheck(fn) {
        tb.find("#cb" + fn).prop("checked", false);
        tb.find("#cb" + fn).closest('tr').find('input:text,button,select').prop('disabled', false);
        var fieldname = tb.find("#cb" + fn).closest('tr').find('td:first');
        fieldname.css("text-decoration", "none");
    }
}
var ff,vv

function makeOperator(pre,fname,type){
    var val = "";
    switch (type) {
        case "bool":
            val = "select,;=,=;<>,Not";
            break;
        case "number":case "int": case "float":
        case "datetime":
            val = "select,;=,=;>=,>=;<=,<=;>,>;<,<;Not,<>;B/W,bw;---------,,disabled:,role:separator;Input,inputbox";
            break;
    }
    if (val != "") val = makeCtr(["select", val,"selop"+pre+fname , , "onchange:showFromto('"+pre+fname+"',$(this))"]);
    return val;
}
function showFromto(fname, that) {
    var oper=["=",">=","<=",">","<","<>","bw"];
    if (that.val() == "bw") {
        $("#num_" + fname+"_1").show();
        $("#date_" + fname+"_1").show();
    }
    else if (that.val() != "date" && that.val() != "inputbox") {
        $("#num_" + fname+"_1").hide();
        $("#date_" + fname + "_1").hide();
    }
    var ids = ["date_" + fname, "num_" + fname,"date_" + fname+"_1", "num_" + fname+"_1" ];
    if (that.val() == "inputbox") {
        var option = $('<option></option>').attr("value", "date").text("Date");
        $("#" + that.attr("id") + " option:selected").remove();
        that.append(option);
        $.each(ids, function (i, k) {
            if ($("#" + k).length > 0) {
                $("#" + k).datepicker("destroy");
                $("#" + k).attr("onclick", "showDialog1($(this))");
            }
        });
    }
    else if (that.val() == "date") {

        var option = $('<option></option>').attr("value", "inputbox").text("Input");
        $("#" + that.attr("id") + " option:selected").remove();
        that.append(option);
        $.each(ids, function (i, k) {
            if ($("#" + k).length > 0) {
            if(k.indexOf("date")>-1)
            $("#" + k).datepicker();
            document.getElementById(k).removeAttribute("onclick");
            }
        });
    }
}
function showDialog1(that) {
    var fixedPeriod = ["$thisYear", "$thisQuarter", "$thisMonth", "$thisWeek", "$Today", "$Yesterday", "$Tomorrow"];
    var newperiod = "--select period--,;";
    $.each(fixedPeriod, function (i, k) {
        newperiod += k.replace("$", "").replace("this","This ") + "," + k + ";";
    });
    if (newperiod != "") newperiod = newperiod.substring(0, newperiod.length - 1);
    var sel =  makeCtr(["select",newperiod, "selPeriod", "margin-bottom:5px", "onchange:copyval($(this))"]);

    var tool = "오늘을 기준으로 상대적기간 지정가능";
    var inp = makeCtr(["input", , "inpPeriod", , "width:300px", "tooltip:" + tool]);
    $(document).tooltip();
    var dv = $("<div/>");
    dv.append(sel);
    dv.append("<div/>");
    dv.append(inp);
    dv.append("<div>*add or substract to change period</div>");
    dv.attr("id", "dvDialog");
    dv.attr("style", "display:none;");
    dv.dialog(
    {
        width: 300,
        height: 200,
        autoOpen: true,
        title: "Period setting",
        position: top,
        open: function (event, ui) {
            console.log(that);
        },
        buttons: [
        {
            text: "Apply",
            icons: {
                primary: "ui-icon-check"
            },
            click: function () {
                that.val($("#inpPeriod").val());
                $(this).dialog('destroy').remove();
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
}
function copyval(that) {
    $('#inpPeriod').val(that.val());
}
//#endregion
