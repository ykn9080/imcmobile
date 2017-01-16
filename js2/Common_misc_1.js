
//#region multilanguage
function multilangParser(data) {
    var rtn = [];
    // var el = $(data).find('[lang]')
    var domlist = ['span', 'label', 'input', 'button', 'option', 'textarea', 'img', 'a', 'i','p'];
    $(domlist).each(function (a, b) {
        var el = (data).find(b)
        $(el).each(function (i, k) {
            if ($(k).css("display") != "none") {
                if ($(k).attr("title"))
                    rtn.push($(k).attr("title"))

                switch ($(k).get(0).tagName.toLowerCase()) {
                    case "span":
                        var txt = $(k).text();
                        if (txt.substring(0, 1) == "(" && txt.substring(txt.length - 1) == ")")
                            rtn.push(txt);
                        else if (txt.length<100 && typeof $(txt).get(0) == "undefined")//if text, not dom object
                            rtn.push(txt);
                        break;
                    case "button": case "option": case "a": case "p":
                        rtn.push($(k).text());
                        break;
                    case "input":
                        if ($(k).attr("type") != "hidden")
                            rtn.push($(k).val());
                        break;
                    case "textarea":
                        rtn.push($(k).val());
                        break;
                    case "img":
                        if (typeof $(k).attr("alt") != "undefined")
                            rtn.push($(k).attr("alt"));
                        break;

                }
            }
        });
    });

    return removeblankarr(rtn);
}
function multilangInject() {
    // var el = $(data).find('[lang]')
    var langlist = [],exlist=[];
    if (jsonlang == "") multilangReadAjax();
    if(jsonlang !=""){
        var lang1=JSON.parse(jsonlang);
        langlist=(Object.keys(lang1.token))
    }
    //add lang="en"
    var data = (document.documentElement.innerHTML);
    var exclude = $(data).find("[lang='en']");
    if (exclude.length > 0) {
        $(exclude).each(function (i, k) {
            $.merge(exlist, $(k).find("*"));
        });
    }
    var domlist = ['label', 'input', 'button', 'option', 'textarea', 'img', 'a', 'i', 'p', 'span'];
    $(domlist).each(function (a, b) {
        var el = $(data).find(b)
        $(el).each(function (i, k) {
            var txt = "";
            if ($(k).css("display") != "none") {
                if ($(k).attr("title")) {
                    txt = $(k).attr("title");
                    if ($.inArray(txt, langlist) > -1)
                        $(k).attr("lang", "en");
                }
                switch ($(k).get(0).tagName.toLowerCase()) {
                    case "span": case "button": case "option": case "a":case "p":
                        txt = $(k).text();
                        break;
                    case "input":
                    case "textarea":
                        txt = $(k).val();
                        break;
                    case "img":
                        if (typeof $(k).attr("alt") != "undefined")
                            txt = $(k).attr("alt");
                        break;

                }

                if ($.inArray(txt, langlist) > -1 && $.inArray(k,exlist)==-1) {
                    var target=$($('body').find(b)[i]);
                    //var wrap=$("<div/>");
                    //wrap.insertAfter(target);
                    //var cl = target.clone().attr('lang', 'en');
                    //wrap.append(cl);
                    //cl.unwrap();
                    // target.remove();
                    target.attr('lang','en')
                }
            }
        });
    });
}
function multilangBuild(list) {
    var popup = [], url = "default.aspx", s = 0, langlist = [], donelist = [];
    $("body").append($("<div id='dvIfdata' style='z-index:104;'></div>"));
    jQuery.fn.reverse = [].reverse;
    //list = list.unshift(list[0]);
    $(list).each(function (j, k) {
        if (k[0] == "iframe") {
            url = k[1];

            $("#dvIfdata").empty();
            funLoading(true);
            s = s + 5000;
            $("#dvIfdata").html("<iframe id=\"ifData\" src='" + url + "' width='100%' height='500px'/>");
            setTimeout(function () { funStop(); datain(k, langlist, j, list);  }, s);
        }
        else {
            url = "default.aspx";
            if ($("#ifData").length > 0) {
                s = s + 2000;
                setTimeout(function () { datain(k, langlist, j, list); }, s);
            }
            else {
                funLoading(true);
                var s1 = 3000;
                if (j == 0) s1 = 7000;
                s += s1;
                $("#dvIfdata").html("<iframe id=\"ifData\" src='" + url + "' width='100%' height='500px'/>");
                setTimeout(function () { funStop(); datain(k, langlist, j, list); }, s);
            }
        }
         if (j == list.length - 1)
            setTimeout(function () {
                wordlist = langlist;
                multilangList($("#selCountry").val())
                $("#dvIfdata").remove();
            }, s + 3000);
    });

    function datain(k,langlist,j,list) {
        var data;
        var ifwin = $('#ifData')[0].contentWindow;

        switch (k[0]) {
            case "iframe":

                break;
            case "user":
                var id = k[1].split('^');
                ifwin.menuPopup("",id[0],id[1])
                ifwin.initDisplay();
                break;
            case "admin":
                ifwin.adminpage(k[1]);
                break;
            case "edit":
                eval("ifwin." + k[1] + "()");
                break;
        }
        var rt = multilangParser($('#ifData').contents().find('body'));
        $(rt).each(function (a, c) {
            if ($.inArray(c, langlist) == -1 && typeof c != "undefined" && c.length > 1) {
                langlist.push(c);
            }
        });

    }
}
var jsonlist = "";
function multilangList1() {
    multilangReadAjax();
    var country = $("#selCountry").val();
    setTimeout(function () {
        multilangTable(country, "imsi").insertAfter($("#tbLanglist"));

        $("#tbLanglist").remove();
        $("#imsi").attr("id", "tbLanglist");
        delRowdelegate("tbPagelist");
        runAfterTableCreate("tbLanglist");
        googletranInit();
        var inp = makeCtr(["input", , , "width:99%", ]);
        $("#inptbLanglistadd").on("click", function () {
            if ($('.paging-nav').length == 1)
                $("#tbLanglist").paging("destroy");
            appendTableRow($('#tbLanglist'), [inp, inp, makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
            $('#tbLanglist>tbody>tr:last').find('input').first().blur(function () {
                googletranSingle($('#tbLanglist>tbody>tr').length - 1, $(this).val());
            });
            delRowdelegate('tbLanglist');//
            runAfterTableCreate("tbLanglist", { activepage: "last" });
        });
        $("#inpreset").on("click", function () {
            //sweetmsgconfirm("Delete All", "Click to all row deleted.", "", "$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();");
            sweetmsgconfirm("$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();", { title: "Delete All", body: "Are you sure to delete all rows ?",cookiekey:"inpreset" });
        });
    }, 1000);

}
function multilangList(country) {
    //if(typeof country)
    if ($("#dvLang").length > 0) {

        multilangTable(country, "imsi").insertAfter($("#tbLanglist"));
        $("#tbLanglist").remove();
        $("#imsi").attr("id", "tbLanglist");
        delRowdelegate("tbLanglist");
        runAfterTableCreate("tbLanglist");
        googletranInit();

        var inp = makeCtr(["input", , , "width:99%", ]);
        $("#inptbLanglistadd").on("click", function () {
            if ($('.paging-nav').length == 1)
                $("#tbLanglist").paging("destroy");
            appendTableRow($('#tbLanglist'), [inp, inp, makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
            $('#tbLanglist>tbody>tr:last').find('input').first().blur(function () {
                googletranSingle($('#tbLanglist>tbody>tr').length - 1, $(this).val());
            });
            delRowdelegate('tbLanglist');//
            runAfterTableCreate("tbLanglist", { activepage: "last" });
        });
        $("#inpreset").on("click", function () {
            // sweetmsgconfirm("Delete All", "Click to all row deleted.", "", "$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();");
            sweetmsgconfirm("$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();", { title: "Delete All", body: "Are you sure to delete all rows ?",cookiekey:"inpreset" });
        });
        return false;
    }

    if (typeof country == "undefined") country = "jp";

    var countrylist = makeCtr(["select", "--select--,;" + jsonlist, "selCountry", "inp", "onchange:multilangList1()"]);
    var dia = $("<div id='dvLang' style='margin:0 20px 0 20px'/>");
    dia.appendTo($("#dvadmin"));
    var dvct = $("<div style='float:right;padding:5px 0 0 0'/>").append($("<label style='margin-right:5px;' for='selCountry'>Language:</label>")).append(countrylist)
        .append(newcountry())
    .append($("<i class='fa fa-rotate-right fa-lg imdim' style='margin:0 5px 0 5px;' onclick='multilangPage()' />"));
    //var dvpg = $('<div style="float:left" id="dvPage"><input type="radio" id="radio1"  checked="checked"><label for="radio1">language</label><input type="radio" id="radio2"><label for="radio2">page</label></div>');
    var dvpg = $(makeCtr(["select", "Language;Page", "selType", "language1", "onchange:toggleLang()"]));
    dia.append(dvpg);
    dia.append(dvct);

    var tb2 = multilangTable(country, 'tbLanglist');
    dia.append($("<div />").append(tb2));
    delRowdelegate("tbLanglist");
    runAfterTableCreate("tbLanglist");
    //dia.append($("<div />").append(multilangPage().tb));
    //runAfterTableCreate("tbPagelist");

    dia.append($("<div style='margin:5px 5px 0 0;text-align:right;'><input id='inplangsave' type='button' value='Save' onclick='multilangSaveAjax();'/><input type='button' lang='en'  value='Cancel'/></div>"));

    $("#selCountry").val(country);
    $("#dvPage").buttonset();
    $("#tbPagelist").parent().hide();

    $("#inplangsave").button();
    $("#dvLang").parent().css("z-Index", 1301);
    function newcountry() {
        //language
        var opt = { filename: "selSet", text: "long", size: 32 };
        var countrylist = nationalFlag(opt).select;

        var alllist = "";
        var toplist = $("<div style='padding:0px;z-index:3000;min-hight:300px;overflow:hidden;'><div style='float:left;'><label>Add New Country</label></div><div style='float:right;'><i class='fa fa-times-circle fa-lg imdim' onclick=\"$('#dvCountry').hide();\"/></div></div><div style='clear:both'/>")
        var btn = $("<div style='text-align:right;padding-top:10px;'><input type='button' style='margin:10px 5px 0 0;' value='Apply' onclick='multilangAdd();'/><input type='button'  style='margin:10px 0 0 0;' value='Cancel' onclick=\"$('#dvCountry').hide();\"/></div>");
        var clist = $("<div style='width:250px;height:100px;display:none;position:absolute;padding:20px;background-color:white;z-index:10' class='roundbox' id='dvCountry'/>").append(toplist).append($(countrylist)).append(btn)
        return $('<i class="fa fa-plus-circle fa-lg imdim" style="margin-left:5px" onclick="$(\'#dvCountry\').show()"/>' + clist.prop('outerHTML'));
    }

    googletranInit();
    setTimeout(function () {
        nationalFlagAfterCreated();
        var inp = makeCtr(["input", , , "width:99%", ]);
        $("#inptbLanglistadd").on("click", function () {
            if ($('.paging-nav').length == 1)
                $("#tbLanglist").paging("destroy");
            appendTableRow($('#tbLanglist'), [inp, inp, makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
            $('#tbLanglist>tbody>tr:last').find('input').first().blur(function () {
                googletranSingle($('#tbLanglist>tbody>tr').length - 1, $(this).val());
            });
            delRowdelegate('tbLanglist');//
            runAfterTableCreate("tbLanglist", { activepage: "last" });
        });
        $("#inpreset").on("click", function () {
            //sweetmsgconfirm("Delete All", "Click to all row deleted.", "", "$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();");
            sweetmsgconfirm("$('#tbLanglist>tbody>').empty();$('#pgLanglist').remove();", { title: "Delete All", body: "Are you sure to delete all rows ?", cookiekey: "inpreset" });

        });
        $("#tbLanglist>thead>tr>th:nth-child(3)").css("width", "20px");
        $("input[type='button']").button();
    }, 2000);

}
function multilangAdd() {
    //add new country for translation;

    var country = $('#selSet').data('ddslick').selectedData.value;
    if (jsonlist == "") jsonlist += country;
    //country insert
    if (jsonlist != "" && $.inArray(country, jsonlist.split(";")) == -1) {
        funLoading(true);
        jsonlist += ";" + country;
        var countrylist = makeCtr(["select", "--select--,;" + jsonlist, "selCountry1", "inp", "onchange:multilangList1()"]);
        $(countrylist).insertAfter($("#selCountry"));
        $("#selCountry").remove();
        $("#selCountry1").attr("id", "selCountry");
    }
    else {
        sweetmsgautoclose("Ooops!","The country already exist!!")
        return false;
    }
    $('#dvCountry').hide();
    setTimeout(function () {
        $("#selCountry").val(country);
        jsonlang = "";
        multilangList(country);
        funStop();
    }, 2000);
}
var wordlist = [];
function multilangPage() {
    var multi = selectimc("imcsetting", "multilanguage");
    var nplist = selectimc("imctable", "submenu"), pg, page = [], page1 = [];
    var adminlist = selectimc("imctable", "adminsubmenu");
    if (multi.hasOwnProperty("pagelist"))
        page = multi.pagelist;
        $(page).each(function (i, k) {
            page1.push(k[1]);
        })


        var editlist = ['ajqEdit', 'bselectEdit', 'cjstreeEdit', 'dgooglechartEdit', 'efullCalendarEdit', 'fcontentEdit', 'gmapEdit', 'hiframeEdit'];
    $(editlist).each(function (i, k) {
        pg = ["edit", k.substring(1)];
        if ($.inArray(k.substring(1), page1) == -1)
            page.push(pg);
    });

    $(adminlist).each(function (i, k) {
        if (k.hasOwnProperty("href")) {
            pg = ["admin", k.href];
        }
        if ($.inArray(k.href, page1) == -1)
            page.push(pg);
    });


     $(nplist).each(function (i, k) {
        if (!k.hasOwnProperty("href"))
            pg =["user", k.menuid + "^" + k.subid];
        if ($.inArray(k.menuid + "^" + k.subid, page1) == -1)
            page.push(pg);
    });
    $(nplist).each(function (i, k) {
        if (k.hasOwnProperty("useiframe"))
            pg = ["iframe", k.href];

        if ($.inArray(k.href, page1) == -1)
            page.push(pg);
    });

    page = page.filter(Boolean);
    page = $.unique(page);
    sleep(1000);
    // data field list
    var data = [];
    data.push([makeCtr(["input:checkbox", , "selectAll", , ]), makeCtr(["span", "type", , , ]), makeCtr(["span", "page", , , ]), ""]);
    if (page.length > 0) {

        $(page).each(function (i, k) {
            data.push([makeCtr(["input:checkbox", , , , ]), makeCtr(["span", k[0], , "width:99%", ]), makeCtr(["span", k[1], , "width:99%", ]), makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
        });
    }
    var tb2 = makeTable("tbPagelist", data, "general");
    var foot = ['<input type="button" lang="en" class="btnRoundsmall" value="add"  style="padding:0px 3px 0 3px;margin:5px" id="inpaddrow2"/>|{"colspan":"4","style":"text-align:right;"}'];
    var tb2 = appendFooter(tb2, foot);
    var rtn = {};
    rtn.tb = tb2;
    rtn.page = page;
    $("<div/>").append(tb2).dialog({
        height: 'auto'
         , width: 650
         , modal: true
         , minHeight: 'auto'
         , title: "Select pages to translate"
         , stack: false
         , close: function (event, ui) {
             if ($("#pgLanglist").length == 0)
             $(this).dialog('destroy').remove();
         },
        buttons: [
            {
                text: "Apply",
                icons: {
                    primary: "ui-icon-check"
                },
                click: function () {
                    var newlist = [], list = saveTable("tbPagelist",false,true);
                    $(list).each(function (i, k) {
                       if(k[0]) newlist.push([k[1],k[2]]);
                    });
                    multilangBuild(newlist);
                    runAfterTableCreate("tbLanglist");
                    $(this).dialog('destroy').remove();
                }
            },
            {
                text: "Close",
                icons: {
                    primary: "ui-icon-close"
                },
                click: function () {
                    if($("#pgLanglist").length==0)
                        runAfterTableCreate("tbLanglist");
                         $(this).dialog('destroy').remove();
                }
            }
        ]
    });
    $("#inpaddrow2").on("click", function () {
        //destory paging
        if ($('#pgLanglist').length == 1) $("#tbLanglist").paging("destroy");
        if ($('#pgPagelist').length == 1) $('#tbPagelist').paging("destroy");

        var inp = makeCtr(["input", , , "width:99%", ]);
        appendTableRow($('#tbPagelist'), [makeCtr(["input:checkbox", , , , ]), inp, inp, makeCtr(["i", "fa fa-minus-square imdim", , "", ""])]);
        delRowdelegate('tbPagelist');
        runAfterTableCreate("tbPagelist", { activepage: "last", pagenum: 10 });


    })
    $('#selectAll').click(function (e) {
        $(this).closest('table').find('td input:checkbox').prop('checked', this.checked);
    });
    delRowdelegate("tbPagelist");
    runAfterTableCreate("tbPagelist", { pagenum: 10 });

    return rtn;
}
function multilangTable(country, tbid) {
    var list = [], enlist = [], data = [];
    if (jsonlang != "") {
        var jlang = JSON.parse(jsonlang).token;
        for (var key in jlang) {
            var set = [];
            set.push(key, jlang[key]);
            list.push(set);
            enlist.push(key);
        }
    }
    var tblist = saveTable("tbLanglist", false, true);
    $(tblist).each(function (i, k) {
        wordlist.push(k[0]);
    });
    $(wordlist).each(function (i, k) {
        if ($.inArray(k, enlist) == -1)
            list.push([k, ""]);
    });
    // data field list
    data.push([makeCtr(["span", "en", , , ]), makeCtr(["span", country, , , ]), makeCtr(["span", , ,"width:20px" , ])]);
    if (list.length > 0) {
        $(list).each(function (i, k) {
            data.push([makeCtr(["div", k[0], , "imdim", "onclick:googletranSingle(" + i + ",'" + k[0] + "')"]), makeCtr(["input", k[1], , "width:99%", ]), makeCtr(["i", "fa fa-times-square imdim", , "width:10px", ""])]);
        });
    }
    if (typeof tbid == "undefined" | tbid == '') tbid = "tbLanglist";
    var tb2 = makeTable(tbid, data, "general");

    var foot = ['<div class="dvtran"></p><div class="dvtranctr" /></div>'
        , '<div style="text-align:right"><input type="button" class="btnRoundsmall" value="translate" onclick="googletranTable()" style="padding:0 3px 0 3px;margin:2px;" id="inptrans"/>'
        + '<input id="inptbLanglistadd" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:2px;"/></div>'
         ,'<input id="inpreset" type="button" class="btnRoundsmall" value="reset"  style="padding:0 3px 0 3px;margin:2px;"/>'];
    tb2 = appendFooter(tb2, foot);
    tb2.attr("uselang", "none");
    return tb2;

}
function toggleLang() {
    if ($(".language1").val() == "Page") {
        $("#tbPagelist").parent().show();
        $("#tbLanglist").parent().hide();
    }
    else {
         $("#tbPagelist").parent().hide();
        $("#tbLanglist").parent().show();
    }
}
function multilangLocalSave(){
    var lang = [{ "en": "Save", "kr": "저장" }];
    var ct=$("#selCountry").val();
    var multi = selectimc("imcsetting", "multilanguage");
    if (multi.hasOwnProperty("langlist")) {
        var curlang = multi.langlist;
        var curpage = multi.pagelist;
    }
    switch ($("#selType").val()) {
        case "Language":
            var lang = saveTable("tbLanglist", true);
            $(lang).each(function (i, k) {
                var chkexist = false;
                $(curlang).each(function (j, l) {
                    if (l.en == k[0]) {
                        l[ct] = k[1];
                        chkexist = true;
                    }
                })
                if (!chkexist && k[1]!="") {
                    var set = {};
                    set.en = k[0];
                    set[ct] = k[1];
                    curlang.push(set);
                }
            });
            break;
        case "Page":
            var page = saveTable("tbPagelist", true);
            $(page).each(function (i, k) {
                if ($.inArrary(k[0], curpage) == -1)
                    curpage.push(k);
            });
            break;
    }
    imcsetting("imcsetting", "multilanguage", JSON.stringify(multi));

}
function multilangSaveAjax() {
    var language = $("#selCountry").val();
    var set = {};
    set.token = {}, set.regex = [];
    var lang = saveTable("tbLanglist",false, true);
    $(lang).each(function (i, k) {
        set.token[k[0]] = k[1];
    });

    var path = "/JS2/jquery-lang-js-master/js/langpack/";
    path += language + ".json";
    $.ajax({
        url: webserviceprefix+"/WebService.asmx/SaveDataPost",
        type:"post",
        //data: { path: JSON.stringify(path), str: JSON.stringify(JSON.stringify(set)) },
        data: JSON.stringify({ path: path, str: JSON.stringify(set) }),
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (data, status) {
            console.log("success" + data.d)
        },
        error: function (response) {
            var r = jQuery.parseJSON(response.responseText);
            console.log("Message: " + r.Message);
            console.log("StackTrace: " + r.StackTrace);
            console.log("ExceptionType: " + r.ExceptionType);
        }

    });
}

function mtran(txt) {
    var curlang = $.cookie("langCookie");
    if (curlang != "en" &&  Lang.prototype.pack.hasOwnProperty("curlang") && Lang.prototype.pack[curlang].hasOwnProperty("token")) {
        var rtn = Lang.prototype.pack[curlang].token[txt];
        if (typeof rtn == "undefined")
            rtn = txt;
    }
    else rtn = txt;
    return rtn;
}
var tranresult = [];
function langload(lg) {
    lang.dynamic(lg, '/JS2/jquery-lang-js-master/js/langpack/' + lg + '.json');

    lang.loadPack(lg);
    window.lang.change(lg);
    $.cookie('langCookie', lg, { expires: 365 });

    var imgsrc = Lang2CountryConvert(lg);
    if (lg == "en") imgsrc = "us";
    var img = $("<img style='vertical-align:top;margin-left:3px;' src='/images/flags/flags_iso/16/" + imgsrc + ".png' />");
    $("#splang").empty();
    $("#splang").append(img);
    setTimeout(function () {
        multilangInject();
    }, 500);
}
function googleTranslateElementInit() {
    //google translate
    new google.translate.TranslateElement({
        //defaultLanguage: 'en',
        //pageLanguage: 'en',
        //includedLanguages: 'de,nl,en,es,it,fr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: true,
        multilanguagePage: true
    }, 'google_translate_element');
}
function googletranSingle(nth, src) {
    var ft = $("#dvtransrc").find("font");
    if (ft.length > 0)
        $('a.goog-te-gadget-link')[0].click();
    $("#dvtransrc").text(src);
    $('a.goog-te-gadget-link')[0].click();

    setTimeout(function () {
        var tresult=$($(".dvtran").find("font").find("font")[0]).text();

        $($('#tbLanglist').find('tbody tr')[nth]).find('input').last().val(tresult);
            }, 300);

}
function googletranTable(options) {
    tranresult = [];
    var list = saveTable("tbLanglist", true);
    var list1 = [];
    if (typeof options != "undefined") {
        if (options.blankonly) {
            $(list).each(function (i, k) {
                if (k[1] == "")
                    list1.push(k);
            });
            list = list1;
        }
    }
    funLoading(true);
    $(list).each(function (i, k) {
        setTimeout(function () {
            var ft = $("#dvtransrc").find("font");
            if (ft.length > 0)
                $('a.goog-te-gadget-link')[0].click();
            $("#dvtransrc").text(k[0]);
            $('a.goog-te-gadget-link')[0].click();

            setTimeout(function () {
                tranresult.push($($(".dvtran").find("font").find("font")[0]).text());
               if (i == list.length - 1) {
                    funStop();
                    googletranExe(tranresult);
                    setTimeout(function(){
                        //runAfterTableCreate("tbLanglist");
                        delRowdelegate("tbLanglist");
                    },0);
                }
            }, 300);
        }, 400 * i);
    });
}
function googletranExe(result) {
    $('#tbLanglist').find('tbody tr').each(function (i, trr) {
        $(trr).find("td").each(function (j, tdd) {
            if (j == 1)
                $($(tdd).find('input')).val(result[i]);
        });
    });
}
function googletranInit() {
    if ($("#dvtransrc").length == 0)
        $(".dvtran").prepend($("<div id='dvtransrc'/>"));

    $(".dvtranctr").attr("lang", $("#selCountry").val());
    $("#gtran").remove();
    jscriptInsert("gtran", "//translate.google.com/translate_a/element.js?cb=googleSectionalElementInit&ug=section&hl=" + $("#selCountry").val());
    setTimeout(function () { googleSectionalElementInit(); }, 2000);
    function googleSectionalElementInit() {
        //google translate
        new google.translate.SectionalElement({
            sectionalNodeClassName: 'dvtran',
            controlNodeClassName: 'dvtranctr',
            background: '#f4fa58'
        }, 'google_sectional_element');
    }
}
//#endregion

//#region misc
var selecticon = "";
function faLoad(receiver, iconname, type) {
    faLoad.iconlist = iconlist;
    jsonReadAjax("imcicon", "", "", "", faLoad.iconlist, [receiver, iconname, type]);
    function iconlist(iconlist, receiver, iconname, type) {
        //font-awesome icon list
       // var fa = ["fa-adjust", "fa-adn", "fa-align-center", "fa-align-justify", "fa-align-left", "fa-align-right", "fa-ambulance", "fa-anchor", "fa-android", "fa-angellist", "fa-angle-double-down", "fa-angle-double-left", "fa-angle-double-right", "fa-angle-double-up", "fa-angle-down", "fa-angle-left", "fa-angle-right", "fa-angle-up", "fa-apple", "fa-archive", "fa-area-chart", "fa-arrow-circle-down", "fa-arrow-circle-left", "fa-arrow-circle-o-down", "fa-arrow-circle-o-left", "fa-arrow-circle-o-right", "fa-arrow-circle-o-up", "fa-arrow-circle-right", "fa-arrow-circle-up", "fa-arrow-down", "fa-arrow-left", "fa-arrow-right", "fa-arrow-up", "fa-arrows", "fa-arrows-alt", "fa-arrows-h", "fa-arrows-v", "fa-asterisk", "fa-at", "fa-automobile", "fa-backward", "fa-ban", "fa-bank", "fa-bar-chart", "fa-bar-chart-o", "fa-barcode", "fa-bars", "fa-beer", "fa-behance", "fa-behance-square", "fa-bell", "fa-bell-o", "fa-bell-slash", "fa-bell-slash-o", "fa-bicycle", "fa-binoculars", "fa-birthday-cake", "fa-bitbucket", "fa-bitbucket-square", "fa-bitcoin", "fa-bold", "fa-bolt", "fa-bomb", "fa-book", "fa-bookmark", "fa-bookmark-o", "fa-briefcase", "fa-btc", "fa-bug", "fa-building", "fa-building-o", "fa-bullhorn", "fa-bullseye", "fa-bus", "fa-cab", "fa-calculator", "fa-calendar", "fa-calendar-o", "fa-camera", "fa-camera-retro", "fa-car", "fa-caret-down", "fa-caret-left", "fa-caret-right", "fa-caret-square-o-down", "fa-caret-square-o-left", "fa-caret-square-o-right", "fa-caret-square-o-up", "fa-caret-up", "fa-cc", "fa-cc-amex", "fa-cc-discover", "fa-cc-mastercard", "fa-cc-paypal", "fa-cc-stripe", "fa-cc-visa", "fa-certificate", "fa-chain", "fa-chain-broken", "fa-check", "fa-check-circle", "fa-check-circle-o", "fa-check-square", "fa-check-square-o", "fa-chevron-circle-down", "fa-chevron-circle-left", "fa-chevron-circle-right", "fa-chevron-circle-up", "fa-chevron-down", "fa-chevron-left", "fa-chevron-right", "fa-chevron-up", "fa-child", "fa-circle", "fa-circle-o", "fa-circle-o-notch", "fa-circle-thin", "fa-clipboard", "fa-clock-o", "fa-close", "fa-cloud", "fa-cloud-download", "fa-cloud-upload", "fa-cny", "fa-code", "fa-code-fork", "fa-codepen", "fa-coffee", "fa-cog", "fa-cogs", "fa-columns", "fa-comment", "fa-comment-o", "fa-comments", "fa-comments-o", "fa-compass", "fa-compress", "fa-copy", "fa-copyright", "fa-credit-card", "fa-crop", "fa-crosshairs", "fa-css3", "fa-cube", "fa-cubes", "fa-cut", "fa-cutlery", "fa-dashboard", "fa-database", "fa-dedent", "fa-delicious", "fa-desktop", "fa-deviantart", "fa-digg", "fa-dollar", "fa-dot-circle-o", "fa-download", "fa-dribbble", "fa-dropbox", "fa-drupal", "fa-edit", "fa-eject", "fa-ellipsis-h", "fa-ellipsis-v", "fa-empire", "fa-envelope", "fa-envelope-o", "fa-envelope-square", "fa-eraser", "fa-eur", "fa-euro", "fa-exchange", "fa-exclamation", "fa-exclamation-circle", "fa-exclamation-triangle", "fa-expand", "fa-external-link", "fa-external-link-square", "fa-eye", "fa-eye-slash", "fa-eyedropper", "fa-facebook", "fa-facebook-square", "fa-fast-backward", "fa-fast-forward", "fa-fax", "fa-female", "fa-fighter-jet", "fa-file", "fa-file-archive-o", "fa-file-audio-o", "fa-file-code-o", "fa-file-excel-o", "fa-file-image-o", "fa-file-movie-o", "fa-file-o", "fa-file-pdf-o", "fa-file-photo-o", "fa-file-picture-o", "fa-file-powerpoint-o", "fa-file-sound-o", "fa-file-text", "fa-file-text-o", "fa-file-video-o", "fa-file-word-o", "fa-file-zip-o", "fa-files-o", "fa-film", "fa-filter", "fa-fire", "fa-fire-extinguisher", "fa-flag", "fa-flag-checkered", "fa-flag-o", "fa-flash", "fa-flask", "fa-flickr", "fa-floppy-o", "fa-folder", "fa-folder-o", "fa-folder-open", "fa-folder-open-o", "fa-font", "fa-forward", "fa-foursquare", "fa-frown-o", "fa-futbol-o", "fa-gamepad", "fa-gavel", "fa-gbp", "fa-ge", "fa-gear", "fa-gears", "fa-gift", "fa-git", "fa-git-square", "fa-github", "fa-github-alt", "fa-github-square", "fa-gittip", "fa-glass", "fa-globe", "fa-google", "fa-google-plus", "fa-google-plus-square", "fa-google-wallet", "fa-graduation-cap", "fa-group", "fa-h-square", "fa-hacker-news", "fa-hand-o-down", "fa-hand-o-left", "fa-hand-o-right", "fa-hand-o-up", "fa-hdd-o", "fa-header", "fa-headphones", "fa-heart", "fa-heart-o", "fa-history", "fa-home", "fa-hospital-o", "fa-html5", "fa-ils", "fa-image", "fa-inbox", "fa-indent", "fa-info", "fa-info-circle", "fa-inr", "fa-instagram", "fa-institution", "fa-ioxhost", "fa-italic", "fa-joomla", "fa-jpy", "fa-jsfiddle", "fa-key", "fa-keyboard-o", "fa-krw", "fa-language", "fa-laptop", "fa-lastfm", "fa-lastfm-square", "fa-leaf", "fa-legal", "fa-lemon-o", "fa-level-down", "fa-level-up", "fa-life-bouy", "fa-life-buoy", "fa-life-ring", "fa-life-saver", "fa-lightbulb-o", "fa-line-chart", "fa-link", "fa-linkedin", "fa-linkedin-square", "fa-linux", "fa-list", "fa-list-alt", "fa-list-ol", "fa-list-ul", "fa-location-arrow", "fa-lock", "fa-long-arrow-down", "fa-long-arrow-left", "fa-long-arrow-right", "fa-long-arrow-up", "fa-magic", "fa-magnet", "fa-mail-forward", "fa-mail-reply", "fa-mail-reply-all", "fa-male", "fa-map-marker", "fa-maxcdn", "fa-meanpath", "fa-medkit", "fa-meh-o", "fa-microphone", "fa-microphone-slash", "fa-minus", "fa-minus-circle", "fa-minus-square", "fa-minus-square-o", "fa-mobile", "fa-mobile-phone", "fa-money", "fa-moon-o", "fa-mortar-board", "fa-music", "fa-navicon", "fa-newspaper-o", "fa-openid", "fa-outdent", "fa-pagelines", "fa-paint-brush", "fa-paper-plane", "fa-paper-plane-o", "fa-paperclip", "fa-paragraph", "fa-paste", "fa-pause", "fa-paw", "fa-paypal", "fa-pencil", "fa-pencil-square", "fa-pencil-square-o", "fa-phone", "fa-phone-square", "fa-photo", "fa-picture-o", "fa-pie-chart", "fa-pied-piper", "fa-pied-piper-alt", "fa-pinterest", "fa-pinterest-square", "fa-plane", "fa-play", "fa-play-circle", "fa-play-circle-o", "fa-plug", "fa-plus", "fa-plus-circle", "fa-plus-square", "fa-plus-square-o", "fa-power-off", "fa-print", "fa-puzzle-piece", "fa-qq", "fa-qrcode", "fa-question", "fa-question-circle", "fa-quote-left", "fa-quote-right", "fa-ra", "fa-random", "fa-rebel", "fa-recycle", "fa-reddit", "fa-reddit-square", "fa-refresh", "fa-remove", "fa-renren", "fa-reorder", "fa-repeat", "fa-reply", "fa-reply-all", "fa-retweet", "fa-rmb", "fa-road", "fa-rocket", "fa-rotate-left", "fa-rotate-right", "fa-rouble", "fa-rss", "fa-rss-square", "fa-rub", "fa-ruble", "fa-rupee", "fa-save", "fa-scissors", "fa-search", "fa-search-minus", "fa-search-plus", "fa-send", "fa-send-o", "fa-share", "fa-share-alt", "fa-share-alt-square", "fa-share-square", "fa-share-square-o", "fa-shekel", "fa-sheqel", "fa-shield", "fa-shopping-cart", "fa-sign-in", "fa-sign-out", "fa-signal", "fa-sitemap", "fa-skype", "fa-slack", "fa-sliders", "fa-slideshare", "fa-smile-o", "fa-soccer-ball-o", "fa-sort", "fa-sort-alpha-asc", "fa-sort-alpha-desc", "fa-sort-amount-asc", "fa-sort-amount-desc", "fa-sort-asc", "fa-sort-desc", "fa-sort-down", "fa-sort-numeric-asc", "fa-sort-numeric-desc", "fa-sort-up", "fa-soundcloud", "fa-space-shuttle", "fa-spinner", "fa-spoon", "fa-spotify", "fa-square", "fa-square-o", "fa-stack-exchange", "fa-stack-overflow", "fa-star", "fa-star-half", "fa-star-half-empty", "fa-star-half-full", "fa-star-half-o", "fa-star-o", "fa-steam", "fa-steam-square", "fa-step-backward", "fa-step-forward", "fa-stethoscope", "fa-stop", "fa-strikethrough", "fa-stumbleupon", "fa-stumbleupon-circle", "fa-subscript", "fa-suitcase", "fa-sun-o", "fa-superscript", "fa-support", "fa-table", "fa-tablet", "fa-tachometer", "fa-tag", "fa-tags", "fa-tasks", "fa-taxi", "fa-tencent-weibo", "fa-terminal", "fa-text-height", "fa-text-width", "fa-th", "fa-th-large", "fa-th-list", "fa-thumb-tack", "fa-thumbs-down", "fa-thumbs-o-down", "fa-thumbs-o-up", "fa-thumbs-up", "fa-ticket", "fa-times", "fa-times-circle", "fa-times-circle-o", "fa-tint", "fa-toggle-down", "fa-toggle-left", "fa-toggle-off", "fa-toggle-on", "fa-toggle-right", "fa-toggle-up", "fa-trash", "fa-trash-o", "fa-tree", "fa-trello", "fa-trophy", "fa-truck", "fa-try", "fa-tty", "fa-tumblr", "fa-tumblr-square", "fa-turkish-lira", "fa-twitch", "fa-twitter", "fa-twitter-square", "fa-umbrella", "fa-underline", "fa-undo", "fa-university", "fa-unlink", "fa-unlock", "fa-unlock-alt", "fa-unsorted", "fa-upload", "fa-usd", "fa-user", "fa-user-md", "fa-users", "fa-video-camera", "fa-vimeo-square", "fa-vine", "fa-vk", "fa-volume-down", "fa-volume-off", "fa-volume-up", "fa-warning", "fa-wechat", "fa-weibo", "fa-weixin", "fa-wheelchair", "fa-wifi", "fa-windows", "fa-won", "fa-wordpress", "fa-wrench", "fa-xing", "fa-xing-square", "fa-yahoo", "fa-yelp", "fa-yen", "fa-youtube", "fa-youtube-play"];
        var fa = [];
        $(iconlist).each(function (i, k) {
            fa.push(k.icon);
        })
       
        var ui = ["ui-icon-carat-1-e", "ui-icon-carat-1-se", "ui-icon-carat-1-s", "ui-icon-carat-1-sw", "ui-icon-carat-1-w", "ui-icon-carat-1-nw", "ui-icon-carat-2-n-s", "ui-icon-carat-2-e-w", "ui-icon-triangle-1-n", "ui-icon-triangle-1-ne", "ui-icon-triangle-1-e", "ui-icon-triangle-1-se", "ui-icon-triangle-1-s", "ui-icon-triangle-1-sw", "ui-icon-triangle-1-w", "ui-icon-triangle-1-nw", "ui-icon-triangle-2-n-s", "ui-icon-triangle-2-e-w", "ui-icon-arrow-1-n", "ui-icon-arrow-1-ne", "ui-icon-arrow-1-e", "ui-icon-arrow-1-se", "ui-icon-arrow-1-s", "ui-icon-arrow-1-sw", "ui-icon-arrow-1-w", "ui-icon-arrow-1-nw", "ui-icon-arrow-2-n-s", "ui-icon-arrow-2-ne-sw", "ui-icon-arrow-2-e-w", "ui-icon-arrow-2-se-nw", "ui-icon-arrowstop-1-n", "ui-icon-arrowstop-1-e", "ui-icon-arrowstop-1-s", "ui-icon-arrowstop-1-w", "ui-icon-arrowthick-1-n", "ui-icon-arrowthick-1-ne", "ui-icon-arrowthick-1-e", "ui-icon-arrowthick-1-se", "ui-icon-arrowthick-1-s", "ui-icon-arrowthick-1-sw", "ui-icon-arrowthick-1-w", "ui-icon-arrowthick-1-nw", "ui-icon-arrowthick-2-n-s", "ui-icon-arrowthick-2-ne-sw", "ui-icon-arrowthick-2-e-w", "ui-icon-arrowthick-2-se-nw", "ui-icon-arrowthickstop-1-n", "ui-icon-arrowthickstop-1-e", "ui-icon-arrowthickstop-1-s", "ui-icon-arrowthickstop-1-w", "ui-icon-arrowreturnthick-1-w", "ui-icon-arrowreturnthick-1-n", "ui-icon-arrowreturnthick-1-e", "ui-icon-arrowreturnthick-1-s", "ui-icon-arrowreturn-1-w", "ui-icon-arrowreturn-1-n", "ui-icon-arrowreturn-1-e", "ui-icon-arrowreturn-1-s", "ui-icon-arrowrefresh-1-w", "ui-icon-arrowrefresh-1-n", "ui-icon-arrowrefresh-1-e", "ui-icon-arrowrefresh-1-s", "ui-icon-arrow-4", "ui-icon-arrow-4-diag", "ui-icon-extlink", "ui-icon-newwin", "ui-icon-refresh", "ui-icon-shuffle", "ui-icon-transfer-e-w", "ui-icon-transferthick-e-w", "ui-icon-folder-collapsed", "ui-icon-folder-open", "ui-icon-document", "ui-icon-document-b", "ui-icon-note", "ui-icon-mail-closed", "ui-icon-mail-open", "ui-icon-suitcase", "ui-icon-comment", "ui-icon-person", "ui-icon-print", "ui-icon-trash", "ui-icon-locked", "ui-icon-unlocked", "ui-icon-bookmark", "ui-icon-tag", "ui-icon-home", "ui-icon-flag", "ui-icon-calculator", "ui-icon-cart", "ui-icon-pencil", "ui-icon-clock", "ui-icon-disk", "ui-icon-calendar", "ui-icon-zoomin", "ui-icon-zoomout", "ui-icon-search", "ui-icon-wrench", "ui-icon-gear", "ui-icon-heart", "ui-icon-star", "ui-icon-link", "ui-icon-cancel", "ui-icon-plus", "ui-icon-plusthick", "ui-icon-minus", "ui-icon-minusthick", "ui-icon-close", "ui-icon-closethick", "ui-icon-key", "ui-icon-lightbulb", "ui-icon-scissors", "ui-icon-clipboard", "ui-icon-copy", "ui-icon-contact", "ui-icon-image", "ui-icon-video", "ui-icon-alert", "ui-icon-info", "ui-icon-notice", "ui-icon-help", "ui-icon-check", "ui-icon-bullet", "ui-icon-radio-off", "ui-icon-radio-on", "ui-icon-play", "ui-icon-pause", "ui-icon-seek-next", "ui-icon-seek-prev", "ui-icon-seek-end", "ui-icon-seek-first", "ui-icon-stop", "ui-icon-eject", "ui-icon-volume-off", "ui-icon-volume-on", "ui-icon-power", "ui-icon-signal-diag", "ui-icon-signal", "ui-icon-battery-0", "ui-icon-battery-1", "ui-icon-battery-2", "ui-icon-battery-3", "ui-icon-circle-plus", "ui-icon-circle-minus", "ui-icon-circle-close", "ui-icon-circle-triangle-e", "ui-icon-circle-triangle-s", "ui-icon-circle-triangle-w", "ui-icon-circle-triangle-n", "ui-icon-circle-arrow-e", "ui-icon-circle-arrow-s", "ui-icon-circle-arrow-w", "ui-icon-circle-arrow-n", "ui-icon-circle-zoomin", "ui-icon-circle-zoomout", "ui-icon-circle-check", "ui-icon-circlesmall-plus", "ui-icon-circlesmall-minus", "ui-icon-circlesmall-close", "ui-icon-squaresmall-plus", "ui-icon-squaresmall-minus", "ui-icon-squaresmall-close", "ui-icon-grip-dotted-vertical", "ui-icon-grip-dotted-horizontal", "ui-icon-grip-solid-vertical", "ui-icon-grip-solid-horizontal", "ui-icon-gripsmall-diagonal-se", "ui-icon-grip-diagonal-se"];

        if (type == "jquery") fa = ui;
        var st = ".ul{ margin-bottom:10px;  overflow:hidden;  border-top:1px solid #ccc;line-height:1.6em;width:100%}";
        st += ".li{    border-bottom:1px solid #ccc;  float:left;  display:inline;width:100%}";
        st += ".ldouble li  { width:50%;} .ltriple li  { width:33.333%; }.lquad li    { width:25%; }";
        st += ".lsix li     { width:16.666%;float:left;display:inline; }.leight li     { width:12.5%;float:left;display:inline; }";
        st += ".ltwelve li     { width:8.333%;float:left;display:inline; }";
        st += ".l25 li     { width:4%;float:left;display:inline;height:1.4em }";
        styleInsert("jqm_style", st);
        var ul, li, dv, i, sp, a, seltrim;
        if ($("#dialog").length > 0) {
            $("#dialog").remove();
        }

        var box = $("<div id='dialog'  />").dialog({
            autoOpen: true,
            show: "fade",
            hide: "fade",
            modal: false,

            width: '800px',
            resizable: true,
            title: 'icon select'
        });

        //search
        var search = $("<div />");
        search.css("float", "right");
        var inp = $("<input type='search'/>"), sbtn = $("<input id='inpsearch' type='button' style='margin-left:5px' value='search'/>");
        search.append(inp).append(sbtn);
        box.append(search);
      

        dv = $("<div />");
        dv.css("float", "left");
        if (type == 'jquery') {
            var dv = $("<div />"); dv.css("float", "left"); dv.append("<em>selection: </em>"); box.append(dv);
            var dv1 = $("<div />"); dv1.css("float", "left"); dv1.append("<span style='vertical-align:middle;'><label id='lbIcon1' /></span>"); box.append(dv1);
        }
        else {
            dv.append("<em>selection: </em><i style='vertical-align:middle;'/>&nbsp;<label id='lbIcon1' />");
            box.append(dv);
        }
        box.append($(makeCtr(["select", "1x,;lg,fa-lg;2x,fa-2x;3x,fa-3x;4x,fa-4x;5x,fa-5x", "selIcon", "margin:0 5px 0 5px;height:25px", ""])));
        box.append("<button id='btnicon' >Select</button>");
        box.append("<div style='clear:both;'/>");
        box.append($("<hr />"));

        var ul = makelist(fa);
        box.append(ul);
       
        if (receiver != "") {
            var tag = findtagName(receiver);
            if (tag == "INPUT") seltrim = $("#" + receiver).val();
            else if (tag == "LABEL" | tag == "SPAN") seltrim = $("#" + receiver).text();
          
            var icon = iconsplit(seltrim);
            $("#selIcon").val(icon.size)
            if (type == "jquery") {
                seltrim1 = "ui-icon " + seltrim;
                $("#lbIcon1").parent().attr("id", "imsi");
                $("#imsi").text(seltrim);
                $("#imsi").attr("class", seltrim1);
            }
            else {
                $("#lbIcon1").prev().attr("class", icon.selecticon);
                $("#lbIcon1").text(icon.selname);
            }
        }
        //size change
        $("#selIcon").on("change", function () {
            $("#lbIcon1").prev().attr("class", "fa " + $("#lbIcon1").text() + " " + $("#selIcon").val());
        })
        //apply to parent page
        $("#btnicon").click(function () {
            if (receiver != "") {
                selname = $("#lbIcon1").text();
                size = $("#selIcon").val();
                switch ($("#" + receiver).prop("tagName")) {
                    case "LABEL": case "SPAN":
                        $("#" + receiver).text(selname + " " + size);
                        $("#" + receiver).prev().attr("class", "fa " + selname + " " + size);
                        break;
                    case "INPUT":
                        $("#" + receiver).val("fa " +selname+ " " + size);
                        break;
                }
            }
            $("#dialog").remove();
        });

        //search
        sbtn.bind("click blur",function () {
            $('.l25.li').remove();
            var keywd = $("#inpsearch").prev().val();
            fa = [];
            $(iconlist).each(function (i, k) {
                if(keywd=="")
                    fa.push(k.icon);
                else if (k.icon.indexOf(keywd)>-1)
                fa.push(k.icon);
            })
            var ul = makelist(fa);
            box.append(ul);
            iconclick();
        });
        setTimeout(function () {
            $("#dialog").parent().css({ "z-Index": 1331, top: 50, left: 50, height: "800px" });
            iconclick();
            $("button, input:button").button();
            $("#dialog").keydown(function (event) {
                if (event.keyCode == 13) {
                    var sbtn=$(this).parent().find("input[value='search']")
                    sbtn.trigger("click");
                    sbtn.prev().on('click focusin', function () {
                        this.value = '';
                    });
                    return false;
                }
            });
        }, 200);
    }
    function findtagName(controlname) {
        if (controlname != "") {
            return $("#" + controlname).prop("tagName");
        }
    }
    function makelist(fa1) {
        //make icon list
        ul = $("<ul class='l25 li'/>");
        li = $("<li/>");
        dv = $("<div/>");
        $.each(fa1, function (i, k) {
            if (type == "jquery") {
                li = $("<li class='imdim '  style='margin-right:2px;'/>");
                li.attr("title", k);
                i = $("<span/>");
                i.attr("class", "ui-icon " + k);
            }
            else {
                li = $("<li class='imdim'/>");
                i = $("<i/>");
                i.attr("class", "fa " + k + " fa-lg");
            }
            li.append(i);
            ul.append(li);
        });
        return ul
    }
    function iconsplit(seltrim1) {
        //icon parsing
        var size = "", selname, selecticon = seltrim1;

        var selsplit = seltrim1.split(' ');
        if (selsplit[0] == 'fa') {
            selname = selsplit[1];
            if (selsplit.length == 3)
                size = selsplit[2];
        }
        else {
            selname = selsplit[0];
            selecticon = "fa " + selname;
            if (selsplit.length == 2) {
                size = selsplit[1];
                selecticon += " " + size;
            }
        }
        return { selecticon: selecticon, selname: selname, size: size }
    }
    function iconclick() {
        //icon click eventhandler 
        $('.l25 li').click(function () {
            if (type == "jquery") {
                selecticon = $(this).find('span').attr("class");
                seltrim = selecticon.replace("ui-icon ", "");
            }
            else {
                icon = iconsplit($(this).find('i').attr("class"));
                $("#lbIcon1").text(icon.selname);
                $("#lbIcon1").prev().attr("class", icon.selecticon);
                $("#selIcon").val(icon.size)
            }
        });
    }
}
function accordion_expandAll() {
    $('.exp h3').removeClass('ui-state-default')
        .addClass('ui-state-active')
        .removeClass('ui-corner-all')
        .addClass('ui-corner-top')
        .attr('aria-expanded', 'true')
        .attr('aria-selected', 'true')
        .attr('tabIndex', 0)
    .find('span.ui-icon')
        .removeClass('ui-icon-triangle-1-e')
        .addClass('ui-icon-triangle-1-s')
    .closest('h3').next('div')
        .show();

    $('.expand').text('collapse all').unbind('click').bind('click', accordion_collapseAll);

    $('.exp h3').bind('click.collapse', function () {
        accordion_collapseAll();
        $(this).click();
    });
}
function accordion_collapseAll() {
    $('.exp h3').unbind('click.collapse');
    $('.exp h3').removeClass('ui-state-active')
            .addClass('ui-state-default')
            .removeClass('ui-corner-top')
            .addClass('ui-corner-all')
            .attr('aria-expanded', 'false')
            .attr('aria-selected', 'false')
            .attr('tabIndex', -1)
        .find('span.ui-icon')
            .removeClass('ui-icon-triangle-1-s')
            .addClass('ui-icon-triangle-1-e')
        .closest('h3').next('div')
            .hide();
    $('.expand').text('expand all').unbind('click').bind('click', accordion_expandAll);
    $('.exp').accordion('destroy').accordion();
}
function iffileup(rtnurl) {
    var comp = getlogin().comp;
    var url = "/controls/imc/share/uploadpopup.aspx?rtnctr=" + rtnurl + "&comp=" + comp + "&file=";
    Popup(url, "upload", "350", "250");
}

//#region cookie noask
function closenoask(name) {
    setCookie("noaskdel_" + name, true, 1);
}
function checkCookie(name) {
    if (getCookie("noaskdel_" + name) == "true")
        return true;
    else
        return false;
}
function delCookie(name) {
    $.cookie('noaskdel_' + name, '', { expires: -1 });
}
function saveNoask() {
    var list = saveTable("tbnoaskdel", false, true), ck = [];
    $(list).each(function (i, k) {
        ck.push({ name: k[0], inuse: k[1] });
        if (k[1])
            $.cookie("noaskdel_" + name, true, { expires: 365 });
        else {
            delCookie(name);
        }
    });
    return ck;
    //var ps = selectimc("imcsetting", "personal");
    //ps.cookie = ck;
    //imcsetting("imcsetting", "personal", JSON.stringify(ps));
}
function noaskdelList(ckdt) {
    var data = [[makeCtr(["span", "Cookie", , , ]), makeCtr(["span", "Use", , , ])]];
    var ck = document.cookie.split(";"), ps, ckdt,cklist=[];

    var list = []; $(ck).each(function (i, k) {
        if (k.indexOf("noaskdel_") > -1) {
            var kk = k.split("=");
            var name = kk[0].replace("noaskdel_", "").replace(" ", "");
            list.push(name);
            var chk = JSON.parse(kk[1]);
            data.push([makeCtr(["span", name,, , ""]), makeCtr(["input:checkbox", chk,,,])]);
        }
    });
    var tb2 = makeTable("tbnoaskdel", data, "general");
    if ($(tb2).find("tbody>tr").length == 0)
        tb2 = appendFooter(tb2, ['No cookie avaiable |{"colspan":"2","style":"text-align:center;"}']);
   
    return tb2;
}
function reloadnoaskList() {
    $("#tbnoaskdel").attr("id", "imsi12");
    var tb = noaskdelList();
    noaskdelList().insertAfter($("#imsi12"));
    $("#imsi12").remove();
}
//#endregion

function makeDialog(content) {
    content.dialog({
        height: 'auto'
          , width: 500
          , modal: true
          , minHeight: 'auto'
          , title: "Style Make"
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
                    var newlist = [], list = saveTable("tes3");
                    $(list).each(function (i, k) {
                        if (i != list.length - 1)
                            newlist.push(k);
                        else
                            var inp = k;
                    })
                    if (typeof inp[1] != "undefined") {
                        newlist = makeStrToArray(newlist, inp[1]);
                    }
                    $("#sp" + ctr + "style").text(JSON.stringify(newlist));
                    $(this).dialog('destroy').remove();
                    $("#dveditback").show();
                }
            },
            {
                text: "Close",
                icons: {
                    primary: "ui-icon-close"
                },
                click: function () {
                    $(this).dialog('destroy').remove();
                    $("#dveditback").show();
                }
            }
        ]
    });
}
function makeStrToArray(arrlist,inp) {

    var list = inp.split(';');
    $(list).each(function (i, k) {
        var st = k.split(':');
        arrlist.push([st[0], st[1]]);
    });
    return arrlist;
}
function applycss(that,ctr) {
    var list = selectimc("imcsetting", "css");
    $(list).each(function (i, k) {
        if (k.name == that) {
           styleBuild(ctr, JSON.stringify(k.list));
        }
    });
}

function launchEditor(id, src) {
    jscriptInsert("aviary","http://feather.aviary.com/imaging/v2/editor.js");
    sleep(1);
    //photo editor avariy
    var featherEditor = new Aviary.Feather({
        apiKey: '69f67e44f7a24e6ba0a80ed1c4c0dd0f',
        theme: 'dark', // Check out our new 'light' and 'dark' themes!
        tools: 'all',
        appendTo: '',
        onSave: function (imageID, newURL) {
            var img = document.getElementById(imageID);
            img.src = newURL;
        },
        onError: function (errorObj) {
            alert(errorObj.message);
            swal({ title: "Error!", text: errorObj.message, imageUrl: "/images/warning.png" });
        }
    });
    featherEditor.launch({
        image: id,
        url: src
    });
    return false;
}
function editImage(imgsrc) {
    //imgsrc="http://www.imcmaster.xyz/data/document/acuvue/file.png";
    var img = $("<img id='image1'/>");
    img.attr("src", imgsrc);
    $("document").append(img);
    launchEditor(img.attr("id"), imgsrc);
}
var isoflag = [];
function nationalFlag(option) {
    //option:{size:"16",list:['en','kr'],filename:'selSet',text:"short"}
    //(ex:size(flag img size:16,24,32,48/ list= show flag value:["en","kr"]/filename:select id/text:short('EN','KR'),long('English','Korean')
    var ct1 = [{ "Code": "AF", "Name": "Afghanistan" }, { "Code": "AL", "Name": "Albania" }, { "Code": "DZ", "Name": "Algeria" }, { "Code": "AS", "Name": "American" }, { "Code": "AD", "Name": "Andorra" }, { "Code": "AO", "Name": "Angola" }, { "Code": "AI", "Name": "Anguilla" }, { "Code": "AQ", "Name": "Antarctica" }, { "Code": "AG", "Name": "Antigua" }, { "Code": "AR", "Name": "Argentina" }, { "Code": "AM", "Name": "Armenia" }, { "Code": "AW", "Name": "Aruba" }, { "Code": "AU", "Name": "Australia" }, { "Code": "AT", "Name": "Austria" }, { "Code": "AZ", "Name": "Azerbaijan" }, { "Code": "BS", "Name": "Bahamas" }, { "Code": "BH", "Name": "Bahrain" }, { "Code": "BD", "Name": "Bangladesh" }, { "Code": "BB", "Name": "Barbados" }, { "Code": "BY", "Name": "Belarus" }, { "Code": "BE", "Name": "Belgium" }, { "Code": "BZ", "Name": "Belize" }, { "Code": "BJ", "Name": "Benin" }, { "Code": "BM", "Name": "Bermuda" }, { "Code": "BT", "Name": "Bhutan" }, { "Code": "BO", "Name": "Bolivia" }, { "Code": "BA", "Name": "Bosnia" }, { "Code": "BW", "Name": "Botswana" }, { "Code": "BV", "Name": "Bouvet" }, { "Code": "BR", "Name": "Brazil" }, { "Code": "IO", "Name": "British" }, { "Code": "VG", "Name": "British" }, { "Code": "BN", "Name": "Brunei" }, { "Code": "BG", "Name": "Bulgaria" }, { "Code": "BF", "Name": "Burkina" }, { "Code": "BI", "Name": "Burundi" }, { "Code": "KH", "Name": "Cambodia" }, { "Code": "CM", "Name": "Cameroon" }, { "Code": "CA", "Name": "Canada" }, { "Code": "CV", "Name": "Cape" }, { "Code": "KY", "Name": "Cayman" }, { "Code": "CF", "Name": "Central" }, { "Code": "TD", "Name": "Chad" }, { "Code": "CL", "Name": "Chile" }, { "Code": "CN", "Name": "China" }, { "Code": "CX", "Name": "Christmas" }, { "Code": "CC", "Name": "Cocos" }, { "Code": "CO", "Name": "Colombia" }, { "Code": "KM", "Name": "Comoros" }, { "Code": "CD", "Name": "Congo" }, { "Code": "CG", "Name": "Congo" }, { "Code": "CK", "Name": "Cook" }, { "Code": "CR", "Name": "Costa" }, { "Code": "CI", "Name": "Cote" }, { "Code": "CU", "Name": "Cuba" }, { "Code": "CY", "Name": "Cyprus" }, { "Code": "CZ", "Name": "Czech" }, { "Code": "DK", "Name": "Denmark" }, { "Code": "DJ", "Name": "Djibouti" }, { "Code": "DM", "Name": "Dominica" }, { "Code": "DO", "Name": "Dominican" }, { "Code": "EC", "Name": "Ecuador" }, { "Code": "EG", "Name": "Egypt" }, { "Code": "SV", "Name": "El" }, { "Code": "GQ", "Name": "Equatorial" }, { "Code": "ER", "Name": "Eritrea" }, { "Code": "EE", "Name": "Estonia" }, { "Code": "ET", "Name": "Ethiopia" }, { "Code": "FO", "Name": "Faeroe" }, { "Code": "FK", "Name": "Falkland" }, { "Code": "FJ", "Name": "Fiji" }, { "Code": "FI", "Name": "Finland" }, { "Code": "FR", "Name": "France" }, { "Code": "GF", "Name": "French" }, { "Code": "PF", "Name": "French" }, { "Code": "TF", "Name": "French" }, { "Code": "GA", "Name": "Gabon" }, { "Code": "GM", "Name": "Gambia" }, { "Code": "GE", "Name": "Georgia" }, { "Code": "DE", "Name": "Germany" }, { "Code": "GH", "Name": "Ghana" }, { "Code": "GI", "Name": "Gibraltar" }, { "Code": "GR", "Name": "Greece" }, { "Code": "GL", "Name": "Greenland" }, { "Code": "GD", "Name": "Grenada" }, { "Code": "GP", "Name": "Guadaloupe" }, { "Code": "GU", "Name": "Guam" }, { "Code": "GT", "Name": "Guatemala" }, { "Code": "GN", "Name": "Guinea" }, { "Code": "GW", "Name": "Guinea-Bissau" }, { "Code": "GY", "Name": "Guyana" }, { "Code": "HT", "Name": "Haiti" }, { "Code": "HM", "Name": "Heard" }, { "Code": "VA", "Name": "Holy" }, { "Code": "HN", "Name": "Honduras" }, { "Code": "HK", "Name": "Hong" }, { "Code": "HR", "Name": "Hrvatska" }, { "Code": "HU", "Name": "Hungary" }, { "Code": "IS", "Name": "Iceland" }, { "Code": "IN", "Name": "India" }, { "Code": "ID", "Name": "Indonesia" }, { "Code": "IR", "Name": "Iran" }, { "Code": "IQ", "Name": "Iraq" }, { "Code": "IE", "Name": "Ireland" }, { "Code": "IL", "Name": "Israel" }, { "Code": "IT", "Name": "Italy" }, { "Code": "JM", "Name": "Jamaica" }, { "Code": "JP", "Name": "Japan" }, { "Code": "JO", "Name": "Jordan" }, { "Code": "KZ", "Name": "Kazakhstan" }, { "Code": "KE", "Name": "Kenya" }, { "Code": "KI", "Name": "Kiribati" }, { "Code": "KP", "Name": "Korea" }, { "Code": "KR", "Name": "Korea" }, { "Code": "KW", "Name": "Kuwait" }, { "Code": "KG", "Name": "Kyrgyz" }, { "Code": "LA", "Name": "Lao" }, { "Code": "LV", "Name": "Latvia" }, { "Code": "LB", "Name": "Lebanon" }, { "Code": "LS", "Name": "Lesotho" }, { "Code": "LR", "Name": "Liberia" }, { "Code": "LY", "Name": "Libyan" }, { "Code": "LI", "Name": "Liechtenstein" }, { "Code": "LT", "Name": "Lithuania" }, { "Code": "LU", "Name": "Luxembourg" }, { "Code": "MO", "Name": "Macao" }, { "Code": "MK", "Name": "Macedonia" }, { "Code": "MG", "Name": "Madagascar" }, { "Code": "MW", "Name": "Malawi" }, { "Code": "MY", "Name": "Malaysia" }, { "Code": "MV", "Name": "Maldives" }, { "Code": "ML", "Name": "Mali" }, { "Code": "MT", "Name": "Malta" }, { "Code": "MH", "Name": "Marshall" }, { "Code": "MQ", "Name": "Martinique" }, { "Code": "MR", "Name": "Mauritania" }, { "Code": "MU", "Name": "Mauritius" }, { "Code": "YT", "Name": "Mayotte" }, { "Code": "MX", "Name": "Mexico" }, { "Code": "FM", "Name": "Micronesia" }, { "Code": "MD", "Name": "Moldova" }, { "Code": "MC", "Name": "Monaco" }, { "Code": "MN", "Name": "Mongolia" }, { "Code": "MS", "Name": "Montserrat" }, { "Code": "MA", "Name": "Morocco" }, { "Code": "MZ", "Name": "Mozambique" }, { "Code": "MM", "Name": "Myanmar" }, { "Code": "NA", "Name": "Namibia" }, { "Code": "NR", "Name": "Nauru" }, { "Code": "NP", "Name": "Nepal" }, { "Code": "AN", "Name": "Netherlands" }, { "Code": "NL", "Name": "Netherlands" }, { "Code": "NC", "Name": "New" }, { "Code": "NZ", "Name": "New" }, { "Code": "NI", "Name": "Nicaragua" }, { "Code": "NE", "Name": "Niger" }, { "Code": "NG", "Name": "Nigeria" }, { "Code": "NU", "Name": "Niue" }, { "Code": "NF", "Name": "Norfolk" }, { "Code": "MP", "Name": "Northern" }, { "Code": "NO", "Name": "Norway" }, { "Code": "OM", "Name": "Oman" }, { "Code": "PK", "Name": "Pakistan" }, { "Code": "PW", "Name": "Palau" }, { "Code": "PS", "Name": "Palestinian" }, { "Code": "PA", "Name": "Panama" }, { "Code": "PG", "Name": "Papua" }, { "Code": "PY", "Name": "Paraguay" }, { "Code": "PE", "Name": "Peru" }, { "Code": "PH", "Name": "Philippines" }, { "Code": "PN", "Name": "Pitcairn" }, { "Code": "PL", "Name": "Poland" }, { "Code": "PT", "Name": "Portugal" }, { "Code": "PR", "Name": "Puerto" }, { "Code": "QA", "Name": "Qatar" }, { "Code": "RE", "Name": "Reunion" }, { "Code": "RO", "Name": "Romania" }, { "Code": "RU", "Name": "Russian" }, { "Code": "RW", "Name": "Rwanda" }, { "Code": "SH", "Name": "St." }, { "Code": "KN", "Name": "St." }, { "Code": "LC", "Name": "St." }, { "Code": "PM", "Name": "St." }, { "Code": "VC", "Name": "St." }, { "Code": "WS", "Name": "Samoa" }, { "Code": "SM", "Name": "San" }, { "Code": "ST", "Name": "Sao" }, { "Code": "SA", "Name": "Saudi" }, { "Code": "SN", "Name": "Senegal" }, { "Code": "CS", "Name": "Serbia" }, { "Code": "SC", "Name": "Seychelles" }, { "Code": "SL", "Name": "Sierra" }, { "Code": "SG", "Name": "Singapore" }, { "Code": "SK", "Name": "Slovakia" }, { "Code": "SI", "Name": "Slovenia" }, { "Code": "SB", "Name": "Solomon" }, { "Code": "SO", "Name": "Somalia" }, { "Code": "ZA", "Name": "South" }, { "Code": "GS", "Name": "South" }, { "Code": "ES", "Name": "Spain" }, { "Code": "LK", "Name": "Sri" }, { "Code": "SD", "Name": "Sudan" }, { "Code": "SR", "Name": "Suriname" }, { "Code": "SJ", "Name": "Svalbard" }, { "Code": "SZ", "Name": "Swaziland" }, { "Code": "SE", "Name": "Sweden" }, { "Code": "CH", "Name": "Switzerland" }, { "Code": "SY", "Name": "Syrian" }, { "Code": "TW", "Name": "Taiwan" }, { "Code": "TJ", "Name": "Tajikistan" }, { "Code": "TZ", "Name": "Tanzania" }, { "Code": "TH", "Name": "Thailand" }, { "Code": "TL", "Name": "Timor-Leste" }, { "Code": "TG", "Name": "Togo" }, { "Code": "TK", "Name": "Tokelau" }, { "Code": "TO", "Name": "Tonga" }, { "Code": "TT", "Name": "Trinidad" }, { "Code": "TN", "Name": "Tunisia" }, { "Code": "TR", "Name": "Turkey" }, { "Code": "TM", "Name": "Turkmenistan" }, { "Code": "TC", "Name": "Turks" }, { "Code": "TV", "Name": "Tuvalu" }, { "Code": "VI", "Name": "US" }, { "Code": "UG", "Name": "Uganda" }, { "Code": "UA", "Name": "Ukraine" }, { "Code": "AE", "Name": "United" }, { "Code": "GB", "Name": "United" }, { "Code": "UM", "Name": "United" }, { "Code": "US", "Name": "United" }, { "Code": "UY", "Name": "Uruguay" }, { "Code": "UZ", "Name": "Uzbekistan" }, { "Code": "VU", "Name": "Vanuatu" }, { "Code": "VE", "Name": "Venezuela" }, { "Code": "VN", "Name": "Viet" }, { "Code": "WF", "Name": "Wallis" }, { "Code": "EH", "Name": "Western" }, { "Code": "YE", "Name": "Yemen" }, { "Code": "ZM", "Name": "Zambia" }, { "Code": "ZW", "Name": "Zimbabwe" }];
    var ct = []; $(ct1).each(function (i, k) {
        var set = {};
        set.countrycode = k.Code.toLowerCase();
        set.countryname = k.Name;
        set.langcode = k.Code.toLowerCase();
        switch (k.Code.toLowerCase()) {
            case "cn":
                set.langcode = "zh-cn";
                set.countryname = k.Name.toLowerCase() + "(zh-cn)";
                ct.push(set);
                set = {};
                set.countrycode = k.Code.toLowerCase();
                set.langcode = "zh-tw";
                set.countryname = k.Name.toLowerCase() + "(zh-tw)";
                ct.push(set);
                break;
            case "jp":
                set.langcode = 'ja';
                ct.push(set);
                break;
            case "us":
                set.langcode = "en";
                set.countryname = "English";
                ct.push(set);
                break;
            default:
                ct.push(set);
                break;
        }

    });

    var ctlist = [], namelist = [], flaglist = [];
    var size = "16", list = ctlist, filename = "selFlag", seltxt = "Select language", rtntype = "";
    var folder = "/images/flags/flags_iso/";
    if (typeof option != "undefined" && option.hasOwnProperty("size")) size = option.size;
    if (typeof option != "undefined" && option.hasOwnProperty("list")) list = option.list;
    if (typeof option != "undefined" && option.hasOwnProperty("filename")) filename = option.filename;
    if (typeof option != "undefined" && option.hasOwnProperty("selectText")) seltxt = option.selectText;

    $(ct).each(function (i, k) {
        ctlist.push(k.countrycode.toLowerCase());
        flaglist.push(k.langcode + "," + k.countryname + "," + folder + size + "/" + k.countrycode + ".png,");
    });

    var outlist, outlist1 = [];
    var path = "/images/flags/flags_iso/"+size+"/";
   
    return {flaglist:flaglist,select:$(makeCtr(["select:selectimage", flaglist.join(";"), filename, "", "inp", ]))};


    function flagname(countrycode,langcode) {
        var rtn="";
        if (typeof option != "undefined" && option.hasOwnProperty("text"))
            $(ct).each(function (i, k) {
                if (k.Code.toLowerCase() == countrycode) {


                    switch (option.text) {
                        case "short":
                            rtn = countrycode.toUpperCase();
                            break;
                        case "long":
                            rtn = k.Name;
                            break;
                    }

                    if (countrycode == "en") rtn = "English";

                    if (countrycode != langcode)
                        rtn += "(" + langcode + ")";
                }
            });

            return rtn;
    }
}
var convertlist = ["en:us", "cn:zh-cn","cn:zh-tw","jp:ja"];
function Country2LangConvert(country) {
    //convert iso country code to google language translate code(ex:cn->zh-cn)
   var langlist="";
   var langArr=[];
    langArr = [country];
    $(convertlist).each(function (a, b) {
        b = b.split(":");

        if (b[0] == country) langArr.push(b[1]);
    });
    return langArr;
}
function Lang2CountryConvert(langcode) {
    //reverse convert of nationalFlagLangConvert(ex:zh-cn->cn)
    //var convertlist = ["en:us", "cn:zh-cn"], countrycode;
    countrycode = langcode;
    $(convertlist).each(function (a, b) {
        b = b.split(":");

        if (b[1] == langcode) countrycode=b[0]
    });
    return countrycode;
}
function nationalFlagAfterCreated(opt) {
    var id = "selSet", wth = 250, ht = 200, seltxt = "Select language..";
    if (typeof opt != "undefined") {
        if (opt.hasOwnProperty("id")) id = opt.id;
        if (opt.hasOwnProperty("width")) wth = opt.width;
        if (opt.hasOwnProperty("height")) ht = opt.height;
        if (opt.hasOwnProperty("selectText")) seltxt = opt.selectText;
    }
    var sty = "#" + id + " .dd-selected{padding:2px !important;}";
    sty += "#" + id + " .dd-option-text{line-height:30px !important;}"
    sty += "#" + id + " .dd-option{padding:2px !important;}"
    sty += "#" + id + " .dd-selected-text{line-height:30px; !important;}"
    sty += "#" + id + ".dd-container{float:left !important;}"
    sty += ".li{margin-bottom:0 !important;}"
    //sty += "#"+id+" .dd-select{width:100% !important;}"
    styleInsert("dd-selected-" + id, sty);

    $('#'+id).ddslick({
        width: wth,
        height: ht,
        selectText:seltxt,
        imagePosition: "left",
        onSelected: function (selectedData) {
            //callback function: do something with selectedData;
            var sel=selectedData.selectedData.value;
            if (sel == "us") {
                sel = "en";
                var indx = 0;
            }
            //else {
            //    $(set).each(function (i, k) {
            //        if (k == sel) {
            //            indx = i;
            //        }
            //    });
            //}
            //window.lang.change(sel);
            //$.cookie('langCookie', sel, {
            //    expires: 365
            //});
            $('#'+id).ddslick('select', { index: indx });
        }
    });
}
function personalSetting(dt) {
    var st = $("#dvadmin");
    var opt = { filename: "selSet", text: "long", size: 32, selectText: "Select language", };
    //if (dt != "") {
    //    var jarr = jsonlist.split(';');
    //    opt.list = jarr;
    //}
    var gtrans = false, cookie = "",connectstr="";
    if (typeof dt != "undefined" && dt != "") {
        if (dt.hasOwnProperty("use_googletrans")) gran = dt.use_googletrans;
        if (dt.hasOwnProperty("Initial_language")) opt.list = dt.Initial_language;
        if (dt.hasOwnProperty("cookie")) cookie = dt.cookie;
        if (dt.hasOwnProperty("connectstring")) connectstr = dt.connectstring;
    }
    var data = [
       [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
      , ["use_googletrans", makeCtr(["input:checkbox", dt.use_googletrans, "cbgtrans", "inp", ])]
       , ["Initial_language", nationalFlag(opt).select.prop('outerHTML')]
       , ["cookie", noaskdelList(cookie).prop('outerHTML')]
       , ["connectstring", connectList(connectstr).prop('outerHTML')]
    ]
   
    var tb = makeTable("personal", data, "general");
    st.append(tb);
    st.append($("<div style='margin-top:10px;text-align:right'><input type='button' onclick='personalSave()' value='Save'/></div>"));

    $("#selSet").val($.cookie("langCookie"));
    var filename = "selSet";
    var sty = "#" + filename + " .dd-selected{padding:2px !important;}";
    sty += "#" + filename + " .dd-option-text{line-height:30px !important;}"
    sty += "#" + filename + " .dd-option{padding:2px !important;}"
    sty += "#" + filename + " .dd-selected-text{line-height:30px; !important;}"
    sty += "#" + filename + ".dd-container{float:left !important;}"
    sty += ".li{margin-bottom:0 !important;}"
    //sty += "#"+filename+" .dd-select{width:100% !important;}"
    styleInsert("dd-selected-" + filename, sty);

    $('#selSet').ddslick({
        width: 250,
        height:200,
        imagePosition: "left",
        onSelected: function (selectedData) {
            //callback function: do something with selectedData;
            var sel=selectedData.selectedData.value;
            //if (sel == "us") {
            //    sel = "en";
            //    var indx = 0;
            //}
            //else {
            //    $(set).each(function (i, k) {
            //        if (k == sel) {
            //            indx = i;
            //        }
            //    });
            //}
            //window.lang.change(sel);
            //$.cookie('langCookie', sel, {
            //    expires: 365
            //});
            //$('#selLang').ddslick('select', { index: indx });
        }
    });
    $("#selSet").parent().prepend($("<div style='float:right;margin-left:5px;vertical-align:top;'><button it='btnmulti' class='btnRoundsmall' onclick='multilangList();' >edit</button></div>)"));
    $("#" + filename + " .dd-selected-text").css("line-height", "30px");
    $("#tbnoaskdel").css({ "width": "60%", "margin": "10px" });
    $("#tbnoaskdel").find("input[type='checkbox']").on("click", function () {
        var cname = $(this).closest("tr").find("span").text();
        var chk = $(this).is(":checked");
        if (chk) {
            setCookie("noaskdel_" + cname, true, 1);
        }
        else
            setCookie("noaskdel_" + cname, false, 1);
    })

    var personal = selectimc("imcsetting", "personal");
    if (typeof personal != "undefined") {
        if (personal.hasOwnProperty("use_googletrans")) $("#cbgtrans").attr("checked", JSON.parse(personal.use_googletrans));
        if (personal.hasOwnProperty("Initial_language")) {
            var i=$('#selSet li:has(input[value="' + personal.Initial_language + '"])').index();
            $('#selSet').ddslick('select', { index: i });//(personal.Initial_language
        }
    }
    setTimeout(function () {
        $("input[type='button']").button();
        $('button').button();
        $("#tbconnect>tfoot").find("button").click(function () {
            connectstringEdit("mssql", { rtnid: "tbconnect" });
        });
        connectRowEvent();
        funStop();
    }, 0);
   
}
function personalSave() {
    var set={}, ps = saveTable("personal", true);
    $(ps).each(function (i, k) {
        if(i<4)
        set[k[0]] = k[1];
    });
    set["cookie"] = saveNoask();
    set["connectstring"]=connectstringSave();
    var storename = 'imcsetting', dataname = 'preference';
    imcsetting(storename, dataname, JSON.stringify(set));
    jsonUpdateAjax(storename, dataname, JSON.stringify(set), "", "");
   //remoteimcupdate("imcsetting");

}

//#endregion

//#region dynamic Table
function makeTableMapping(gdt, fieldlist) {
    //fieldlist=[[fieldname,mappingfield]]
    //var gdt = selectimcdata("imcdata", "dt16022311284")
    var data = [];
    var dt = applyFilter(dt, gdt.filter);
    var list = Object.keys(dt[0]);

    // data field list
    data.push([makeCtr(["span", "field", , , ]), makeCtr(["span", "mapping", , , ])]);
    if (fieldlist.length > 0) {
        $(fieldlist).each(function (i, k) {
            var sel = makeCtr(["select", makelist(list, k[1]), , , ]);
            data.push([k[0],sel]);
        });
    }
    function makelist(list, mappedfield) {
        var output=[];
        $(list).each(function (i, k) {
            if(k==mappedfield)
                output.push(k + "," + k + ",selected:true");
            else
            output.push(k);
        });
        return output.join(";");
    }
    var tb2 = makeTable("tb22", data, "general");
    return tb2;
}
function makeTableTable(country, tbid) {
    var list = [], enlist = [], data = [];
    if (jsonlang != "") {
        var jlang = JSON.parse(jsonlang).token;
        for (var key in jlang) {
            var set = [];
            set.push(key, jlang[key]);
            list.push(set);
            enlist.push(key);
        }
    }
    var tblist = saveTable("tbLanglist", false, true);
    $(tblist).each(function (i, k) {
        wordlist.push(k[0]);
    });
    $(wordlist).each(function (i, k) {
        if ($.inArray(k, enlist) == -1)
            list.push([k, ""]);
    });
    // data field list
    data.push([makeCtr(["span", "title", , , ]), makeCtr(["span", "control", , , ]), makeCtr(["span", , , "width:20px", ])]);
    if (list.length > 0) {
        $(list).each(function (i, k) {
            data.push([makeCtr(["div", k[0], , "imdim", "onclick:googletranSingle(" + i + ",'" + k[0] + "')"]), makeCtr(["input", k[1], , "width:99%", ]), makeCtr(["i", "fa fa-minus-square imdim", , "width:20px", ""])]);
        });
    }
    if (typeof tbid == "undefined" | tbid == '') tbid = "tbLanglist";
    var tb2 = makeTable(tbid, data, "general");

    var foot = ['<div class="dvtran"></p><div class="dvtranctr" /></div>'
        , '<div style="text-align:right"><input type="button" class="btnRoundsmall" value="translate" onclick="googletranTable()" style="padding:0 3px 0 3px;margin:2px;" id="inptrans"/>'
        + '<input id="inptbLanglistadd" type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;margin:2px;"/></div>'
         , '<input id="inpreset" type="button" class="btnRoundsmall" value="reset"  style="padding:0 3px 0 3px;margin:2px;"/>'];
    tb2 = appendFooter(tb2, foot);
    tb2.attr("uselang", "none");
    return tb2;

}
function rowindexreorder(tbid) {
    //for callback after delete row reorder rowindex
    $("#" + tbid + ">tbody>tr>td:nth-child(1)>span").each(function (i, k) {
        $(k).text(i + 1);
    })
}
function rowseqnumber(tbid) {
    style = "table#" + tbid + "{  counter-reset: rowNumber;}";
    style += "table#" + tbid + " tr > td:first-child  { counter-increment: rowNumber; }";
    style += "table#" + tbid + " tr td:first-child::before  { content: counter(rowNumber); min-width: 1em; margin-right: 0.5em;    }";
    styleInsert("rowseq-style", style);
}
function tbcolindexbytitle(tbid, title) {
    //find column index by table id and head title
    var colindex;
    $("#"+tbid+">thead>tr>th>span").each(function (i, k) {
        if ($(k).text() == title)
            colindex = i;
    });
    return colindex;
}
function chkalltoggle(cls) {
    var checked = $("#all" + cls).prop("checked");
    $("." + cls).prop('checked', checked);
    $("." + cls).trigger('click');
    $("." + cls).trigger('click');
   
}
function makeForm1(id, data) {
    /* table with form control dynamic creation

    */


    var table = $("<table width='100%' />");
  
    if (id != "") table.attr("id", id);
    var tbody = $("<tbody />");
    table.append(tbody);
    $.each(data, function (rowIndex, r) {
        var row = $("<tr/>");
                tbody.append(row);
        $.each(r, function (colIndex, c) {
            var cell = $("<td/>");
            if (colIndex == 0)
                cell.css("width","100px")
            if (typeof c != "undefined" && c.indexOf("|") > -1) {
                var csp = c.split('|');
                if (csp.length > 1) {
                    row.append(cell.html(csp[0]));
                    $.each($.parseJSON(csp[1]), function (k, v) {
                        cell.attr(k, v);
                    });
                }
            }
            else
                row.append(cell.html(c));
        });
    });
    return table;
}
function makeForm(id,data) {
    var form = $("<form width='100%' />");

    if (id != "") form.attr("id", id);
    var ul = $("<ul style='list-style-type: none;'/>").appendTo(form), li;
    $.each(data, function (rowIndex, r) {
        li = $("<li/>").appendTo(ul);
        $.each(r, function (colIndex, c) {
            
            if (typeof c != "undefined" && c.indexOf("|") > -1) {
                var csp = c.split('|');
                if (csp.length > 1) {
                    li.append($(csp[0]));
                    li.append($(csp[1]));
                    $.each($.parseJSON(csp[1]), function (k, v) {
                        $(csp[1]).attr(k, v);
                    });
                }
            }
            else
                li.append($(c));
        });
    });
    return form;
}
function makeCtr_img(startid, nextrownum) {
    var img = $("<img src='/images/splus.gif' class='imbtn' style='vertical-align:middle;;'/>");
    img.attr("onclick", "makeCtr_img1('" + startid + "'," + nextrownum + ")");

    return img.prop('outerHTML');
}
function makeCtr_img1(startid, nextrownum) {
    var ctr = $("#" + startid);
    var tr = $(ctr.parent().parent());
    var img = $($(tr.children()[0]).find("img"));
    var sib = tr.nextAll();
    var tbid = $(tr.parent().parent()).attr("id");
    switch (img.attr("src")) {
        case "/images/splus.gif":
            img.attr("src", "/images/sminus.gif");
            break;
        case "/images/sminus.gif":
            img.attr("src", "/images/splus.gif");
            break;
    }
    $(sib).each(function (i, k) {
        if (i < nextrownum)
            $(k).toggle();
    });
}
function togglechg(id1, id2) {
    $([id1,id2]).each(function (i, k) {
        $("#" + k).toggle();
      
    })
}
function togglechgi(id1, id2) {
    if ($("." + id1).length > 0) {
        var cls = $("." + id1).attr("class").replace(id1, id2);
        $("." + id1).attr("class", cls)
    }
    else {
        var cls = $("." + id2).attr("class").replace(id2, id1);
        $("." + id2).attr("class", cls)
    }
}
function InsertSelected(list, val, placeholder) {
    //create select with datatable
    var rtn = [];
    if (typeof list == "undefined") return false;
    $.each(list, function (i, k) {
        if (i == val) {
            rtn.push(i + "," + i + ",selected,selected");
        }
        else
            rtn.push(i + "," + i);
    });
    if (typeof placeholder == "undefined") placeholder = "select";
    rtn.unshift(placeholder + ",");
    return rtn.join(';');
}
function runAfterTableCreate(id, option) {
    var pagenum = 10, activepage = 0, inputpadding = 0, width = '100%';
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("pagenum")) pagenum = option.pagenum;
        if (option.hasOwnProperty("activepage")){
            activepage = option.activepage;
            if(activepage=="last"){
                activepage=parseInt(($("#"+id+" tbody>tr").length-1)/pagenum);
            }
        }
        if (option.hasOwnProperty("inputpadding")) inputpadding = option.inputpadding;
        if (option.hasOwnProperty("width")) width = option.width;
    }
    var tb = $('#' + id);
    var limit = Math.ceil(($("#" + id + " tbody>tr").length - 1) / pagenum);
    if (limit > 10) limit = 10;
    if (tb.find("tbody>tr").length > pagenum) {
        var opt = {
            perPage: pagenum
        , limitPagination: limit
        };
        paginathing(tb,opt)
        //tb.paging({
        //    limit: pagenum,
        //    rowDisplayStyle: 'block',
        //    activePage: activepage,
        //    rows: []
        //});
        $("#" + id + " input").css("padding", inputpadding);
        hideAfterTablecreated(id);
        $("#" + id + ".roundbtn").button();
        tb.css("width", width);

        ////because activePage not working!!!
        //var rnum = tb.find("tbody>tr").length;
        //var tpage = parseInt(rnum / pagenum);
        //tb.find("tbody>tr").each(function (i, k) {
        //    if (i < pagenum * activepage || i>=pagenum*(activepage+1))
        //        $(k).css({ "display": "none" });
        //    else
        //        $(k).css({ "display": "table-row" });

        //});
        ////pager highlight
        //$(".paging-nav").children().attr('class', "");
        //$($(".paging-nav").children()[activepage + 1]).attr('class', "selected-page");
    }
}
function hideAfterTablecreated(id) {
    //initiate expand collapse status to collapsed
    var tr = $("#" + id).find("tbody").children()
    var n = 0;
    $(tr).each(function (i, k) {
        var td = $(k).children()[0];
        var img = $(td).find("img")[0];
        var start = false;
        if (typeof img != "undefined" && img != "" && img != "undefined") {
            var imgcl = $(img).attr("onclick");
            if(imgcl!="" && typeof imgcl!="undefined"){
            n = parseInt($(img).attr("onclick").toString().replace(/.*\(|\).*/ig, "").split(',')[1]);
            $(img).attr("src", "/images/splus.gif")
            start = true;
        }
        }
        if (n > 0 && !start) {
            $(k).css({ "display": "none" });
            $(k).addClass("expandcollapse");
            $(td).css("padding-left", "15px");
            n--;
        }
    })
    styleInsert("expandcollapse", ".expandcollapse{ margin-left:5px;}");
}
function prependTableRow(table, rowData) {
    var row = $("<tr/>");
    var prevtr = $(table.find('tbody>tr:nth-child(1)')).attr("style"); 
    var secondtr = table.find('tbody>tr:nth-child(2)').css("background-color");
    if (typeof prevtr == "undefined")
        row.css("background-color", secondtr);

    var firstRow = row.prependTo(table.find('tbody:first'));
    $("tr:even").css("class", "even");

    $.each(rowData, function (colIndex, c) {
        var cell = $("<td  style='padding:3px ;border: 1px solid #D3D3D3;border-collapse:collapse;'/>");
        if (c.indexOf("|") > -1) {
            var csp = c.split('|');
            if (csp.length > 1) {
                firstRow.prepend(cell.html(csp[0]));
                $.each($.parseJSON(csp[1]), function (k, v) {
                    cell.attr(k, v);
                });
            }
        }
        else
            firstRow.prepend(cell.html(c));
    });
    return table;
}
function deleteTableColumn(thiss, rowIndex) {
    var table = thiss.parent();
    $(table + " tr:eq(" + rowIndex + ")").remove();
    return table;
}
function appendTableColumn(tb, cindex,title,insertobj) {
   tb.find('tr').each(function () {
       $(this).find('td').eq(cindex - 1).after(insertobj);
       $(this).find('th').eq(cindex - 1).after(title);
       if ($(this).attr("class") == "foot") {
           var cols = $(this).find('td').attr('colspan');
           $(this).find('td').attr('colspan', cols + 1);
       }
   });
}
function delRowdelegate(tbid, options) {
    //because row index chages  by deleting row, preassign
    //tdindex:which td?, controlindex:if multiple ctr at tdindex, which ctr?
    var title = "Row delete?"
        , text = "Are you sure to delete row?"
        ,cookiekey=tbid+"_delete_row"
    ,text = "<div>" + text + "</div><div style='margin:0'><a  class='linkbtn' onclick=\"closenoask('" + cookiekey + "');$(this).css({color:'blue'})\">Don't ask</a></div>"

        , confirm = "Yes, do it!"
        , cancel = "No, cancel!", tdindex = $("#" + tbid + ">tbody>tr>td").last().index(),controlindex,callback,callbackoption;

    if (typeof options != "undefined") {
        if (options.hasOwnProperty("title")) title = options.title;
        if (options.hasOwnProperty("text")) title = options.text;
        if (options.hasOwnProperty("confirm")) title = options.confirm;
        if (options.hasOwnProperty("cancel")) title = options.cancel;
        if (options.hasOwnProperty("tdindex")) tdindex = options.tdindex;
        if (options.hasOwnProperty("controlindex")) controlindex = options.controlindex;
        if (options.hasOwnProperty("callback")) callback = options.callback;
        if (options.hasOwnProperty("callbackoption")) callbackoption = options.callbackoption;
    }
    $("#" + tbid + " tbody>tr>td:nth-last-child(1)").click(function (e) {
        var cindex = $(this).index();
        var rindex = $(this).parent().index();
        if (rindex !=-1 && cindex == tdindex) {
            if (checkCookie(tbid + '_delete_row')) {
                $("#" + tbid + ">tbody>tr:eq(" + rindex + ")").remove();
            }
            else {
                swal({
                    title: title, text: text, html: true, type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55"
                  , confirmButtonText: confirm, cancelButtonText: cancel
                  , closeOnConfirm: true, closeOnCancel: true
                }
              , function (isConfirm) {
                  if (isConfirm) {
                      $("#" + tbid + ">tbody>tr:eq(" + rindex + ")").remove();
                      if (typeof callback != "undefined") {
                          console.log(callback,callbackoption)
                          callback(callbackoption[0]);
                      }
                  }
              });
            }
        }
    });
}
function rowSortable(tb, options) {
    if (typeof options != "undefined") {
        if (options.hasOwnProperty("callback")) callback = options.callback;
        if (options.hasOwnProperty("callbackoption")) callbackoption = options.callbackoption;
    }
   //odd background-color
    var bgcl = tb.find('tbody>tr:nth-child(2)').css("background-color");
    //make row droppable
    tb.find("tbody").sortable({
        // items: "> tr:not(:first)",
        appendTo: "parent",
        helper: "clone",
        update: function (event, ui) {
            evenoddcolor(tb, bgcl)
            if (typeof callback != "undefined") {
                console.log(callback, callbackoption)
                callback(callbackoption[0]);
            }
        }
    }).disableSelection();
    //tr background-color

}
function evenoddcolor(tb,bgcl) {

    $.each(tb.find("tbody>tr"), function (rowIndex, r) {
        if (rowIndex % 2 != 0)
            $(r).css("background-color", bgcl);
        else
            $(r).removeAttr("style");
    });
}
function appendFooter(table, data) {
    //cssInsert("bootstrap-css", "/js2/bootstrap/css/bootstrap.css");
    var row = $("<tr/>");
    row.addClass('foot');
    $.each(data, function (colIndex, c) {
        var cell = $("<td/>");
        if (c.indexOf("|") > -1) {
            var csp = c.split('|');
            if (csp.length > 1) {
                row.append(cell.html(csp[0]));
                var tt = csp[1].replace('"', '');
                $.each($.parseJSON(csp[1]), function (k, v) {
                    cell.attr(k, v);
                });
            }
        }
        else
            row.append(cell.html(c));
    });

    var foot = table.find('tfoot');
    if (!foot.length) foot = $('<tfoot class=\"ui-widget-header\">').appendTo(table);
    foot.append(row);

//    //insert page no good !!!!!!!
//    var page= $("<tr/>");
//    cell = $("<td colspan='" + colCount(table) + "'/>");
//    cell.append($("<div/>"));
//    page.append(cell);
//    foot.append(page);

    return table;
}
function colCount(table) {
    var colCount = 0;
    $(table).find('tr:nth-child(1) td').each(function () {
        if ($(this).attr('colspan')) {
            colCount += +$(this).attr('colspan');
        } else {
            colCount++;
        }
    });
    return colCount;
}
function appendPage(table) {
    var foot = table.find('tfoot');
    if (!foot.length) foot = $('<tfoot class=\"ui-widget-header\">').appendTo(table);

    //insert page
    var page= $("<tr/>");
    cell = $("<td colspan='"+colCount(table)+"'/>");
    cell.append($("<div class='pagination pagination-centered hide-if-no-paging'/>"));
    page.append(cell);
    foot.append(page);
    $(table).footable();
    return table;
}
$('#tbFilter').find('tbody tr').each(function (i, trr) {
    if (i == 1) {
        $(trr).children().each(function (j, tdd) {
        });
    }
});

function paginated(id, rownum, pagernum) {
    if (typeof rownum == "undefined" | rownum == "") rownum = 10;
    if (typeof pagernum == "undefined" | pagernum == "") pagernum = 10;
    var tb,dvpg;
    if (typeof id == "object") {
        tb = id;
        id="tbpg"+idMake();
        tb.attr("id", id);
        dvpg = $("#pg");
    }
    else {
        tb = $('#' + id);
        dvpg = $("#pg" + id);
    }
    tb.each(function () {
        var currentPage = 0;
        var numPerPage = rownum;
        var $table = $(this);
        $table.bind('repaginate', function () {
            $("#"+id+">tbody>tr").hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        });
        $table.trigger('repaginate');
        var numRows =  $("#"+id+">tbody>tr").length;
        var numPages = Math.ceil(numRows / numPerPage);
        if (numPages >= 1) {
            $table.parent().find(".pager").remove();
            var $pager = $("<div class='pager'></div>");
            for (var page = 1; page <= numPages; page++) {
                $('<span class="page-number"></span>').text(page).bind('click', {
                    newPage: page-1
                }, function (event) {
                    currentPage = event.data['newPage'];
                    $table.trigger('repaginate');
                    $(this).addClass('active').siblings().removeClass('active');
                }).appendTo($pager).addClass('clickable');
            }
            $pager.insertAfter($table).find('span.page-number:first').addClass('active');
        }
    });
    var str="div.pager {text-align: center; margin: 0.3em 0;}";
    str += " div.pager span { display: inline-block;width: 1em; height: 1em; line-height: 1;text-align: center;cursor: pointer;color: #383838;margin-right: 0.2em;}";
    str += " div.pager span.active { color:#800000;font-weight:bold;text-decoration:underline}";
    styleInsert("paginated", str);

}
function saveTable1(id) {
    var array = []; var arr = [];
    $('#' + id).find('tbody tr').each(function (i, trr) {
        arr = [];
        $(trr).find("td").each(function (j, tdd) {
            var inputEl = $(tdd).children().get(0);
            if (typeof inputEl !== "undefined") {
                switch (inputEl.tagName) {
                    case "SPAN":
                        if ($(inputEl).attr("class") == "container") {
                            arr.push($($(inputEl).children()[0]).val());
                        }
                        else if(typeof $(inputEl).attr("title")!="undefined" && $(inputEl).attr("title")!="")
                            arr.push($(inputEl).attr("title"));
                        else
                            arr.push($(inputEl).text());
                        break;
                    case "SELECT":
                        if ($(inputEl).attr('class') == 'multiselect') {
                            arr.push($(inputEl).multipleSelect('getSelects'));
                        }
                        else
                            arr.push($(inputEl).val());
                        break;
                    case "INPUT":
                        if ($(inputEl).attr('type') == 'checkbox') {
                            var chk = $(inputEl).is(':checked');
                            if (chk) { arr.push(true); } else { arr.push(false); }
                        }
                        else {
                            if ($(inputEl).siblings().length > 0 && $(inputEl).siblings().prop("tagName") == "INPUT") {
                                arr.push($(inputEl).val() + ":" + $(inputEl).siblings().val());
                            }
                            else
                                arr.push($(inputEl).val());
                        }
                        break;
                }
            }
            else {
                arr.push($(tdd).text());
            }
        })
        if (arr.length > 0)
            array.push(arr);
    });
    return array;
}
function saveTable(id, removeblank, saveallfield) {
    //removeblank: true,false, saveallfield:true,false(true==save all column, false=not save first column)
    if (typeof removeblak == "undefined") removeblank = false;
    if (typeof saveallfield == "undefined") saveallfield = false;
    var array = []; var arr = [];
    $('#' + id+'>tbody>tr').each(function (i, trr) {
            arr = [];
            $(trr).children().each(function (j, tdd) {
                var inputEl; var num = 0;
                if (saveallfield) num = -1;
                if (j != num) {
                    inputArr = $(tdd).children();
                    if (inputArr.length == 0 && $(tdd).text() != "")
                        //in case td has text title
                        arr.push($(tdd).text());
                    $(inputArr).each(function (s, m) {
                        inputEl = m;
                        if (typeof inputEl !== "undefined" ){//&& s<2) {
                            switch (inputEl.tagName) {
                                case "DIV":
                                    if ($(inputEl).attr('class') == 'dd-container') {
                                        arr.push($("#" + $(inputEl).attr("id") + " .dd-selected-value").val());
                                    }
                                    else
                                        arr.push($(inputEl).text());
                                    break;
                                case "TEXTAREA":
                                    arr.push($(inputEl).val());
                                    break;
                                case "LABEL": case "SPAN":
                                    if ($(inputEl).attr("class") == "container") {
                                        arr.push($($(inputEl).children()[0]).val());
                                    }
                                    else
                                        arr.push($(inputEl).text());
                                    break;
                                case "SELECT":
                                    if ($(inputEl).attr('class') == 'multiselect') {
                                        arr.push($(inputEl).multipleSelect('getSelects'));
                                    }
                                    else
                                        arr.push($(inputEl).val());
                                    break;
                                case "INPUT":
                                    if ($(inputEl).attr('type') == 'checkbox') {
                                        var chk = $(inputEl).is(':checked');
                                        if (chk) { arr.push(true); } else { arr.push(false); }
                                    }
                                    else if ($(inputEl).attr('type') == 'color' && $(inputEl).attr("value") == "") { arr.push(""); }
                                    else {
                                        if ($(inputEl).siblings().length > 0 && $(inputEl).siblings().prop("tagName") == "INPUT") {
                                            arr.push($(inputEl).val() + ":" + $(inputEl).siblings().val());
                                        }
                                        else
                                            arr.push($(inputEl).val());
                                    }
                                    break;
                           
                            }
                        }
                    });

                }
                else {
                    arr.push($(tdd).text());
                }
            })
            if (arr.length > 0)
                array.push(arr);
        
    });
    var arr = [];
    if (removeblank) {
        $(array).each(function (i, k) {
            if (k[1] != "" && typeof k[1] != "undefined")
                arr.push(k);
        });
        array = arr;
    }
    return array;
}
//#endregion

//#region drag & drop box
function dndboxInit(gdt, ctrtype) {
    var dndcontain = $("#dndcontain_" + ctrtype), evlist = "", datacode;
    if (typeof gdt != "undefined" && gdt.hasOwnProperty("eventlist"))
        evlist = gdt.eventlist;
    if ($("#spDatacode").text() != "") datacode = $("#spDatacode").text()
    else if (gdt.hasOwnProperty("data")) {
        if(gdt.data.hasOwnProperty("datacode"))
            datacode = gdt.data.datacode;
        else if (gdt.data.hasOwnProperty("code"))
            datacode = gdt.data.code;
    }

    dndcontain.append(makedndbox(dndcontain, evlist, dndbatchInsert, actionclick, [datacode, dndcontain,ctrtype]));
    //dndboxInit(evlist, actionclick, dndcontain, [datacode, dndcontain]);
    var reload=$("<i class='fa fa-rotate-right fa-lg imdim' style='padding-top:10px;float:right'/>");
    reload.prependTo(dndcontain);
    reload.click(function () {
        reloadAction(gdt,ctrtype);
    });
}
function reloadAction(gdt, ctrtype) {
    //when change db src, reset action
    if (typeof gdt != "undefined") {

        var dndcontain = $("#dndcontain_" + ctrtype), evlist = "", datacode;
        dndcontain.empty();
        if (typeof gdt != "undefined" && gdt.hasOwnProperty("eventlist"))
            evlist = gdt.eventlist;
        if ($("#spDatacode").text() != "") datacode = $("#spDatacode").text();
        else if (gdt.hasOwnProperty("data")) datacode = gdt.data.datacode;
        dndcontain.append(makedndbox(dndcontain, evlist, dndbatchInsert, actionclick, [datacode, dndcontain,ctrtype]));
        var reload = $("<i class='fa fa-rotate-right fa-lg imdim' style='padding-top:10px;float:right'/>");
        reload.prependTo(dndcontain);
        reload.click(function () {
            reloadAction(gdt, ctrtype);
        });
    }
    else {
        var id = $("#lbCtr").text();
        if (id != "") {
            if ($("#spdataajax").text() != "")
            {
                var set = {};
                set.data = JSON.parse($("#spdataajax").text());
                reloadAction(set,ctrtype)
            }
            var imc = selectimctable(menuid, subid, id);
            if(typeof imc!="undefined")
            reloadAction(imc, ctrtype);
        }
        else {
            var ardt = $("#sparchive").text();
            if (ardt != "") {
                ardt = JSON.parse(ardt);
                jsonReadAjax("imclist", ardt.type, "code", ardt.code, reloadAction,[ctrtype]);
            }
        }
    }
}
function makedndbox(dvcontain,elist, callback, parentcallback,optarr) {
    //add div  onclick
    var sty = ".dnd{width: 100% border-bottom:solid 0px #AEAEAE;max-height:22px;float:left; }";
    sty += ".dndul { list-style-type: none; display: inline-block;margin:0;padding:0; }";
    sty += ".dndli { padding: 1px; width: 20px;text-align:center;border:solid 1px black;margin-right:3px; height: 20px; float:left;font-size: 1em;cursor:pointer; display: inline-block;}";
    sty += ".selectlii {color:white !important;background-color:black !important;}";
    sty += ".newaddli{border:dashed 2px yellow !important;}";
    sty += ".dndcontain{overflow:hidden;min-height:35px;margin-top:10px;vertical-align:bottom}";
    styleInsert("dnd-css", sty);

    var dv = $("<div style='width:100%;padding:10px;'/>");
    var contain = $(".dnd");
    var trash = $(".fa-trash");
    var ul = $(".dnd").find("ul");
   // if (contain.length == 0) {
        contain = $("<div class='dnd' />").droppable({
            drop: function (event, ui) { console.log('hi', event) }
        });
        ul = $("<ul class='dndul'/>").sortable({
            revert: false,
            placeholder: "ui-state-highlight"
        });
        contain.append(ul);
        trash = $("<i class='fa fa-trash fa-2x' style='float:left;padding-right:10px'/>");
        contain.appendTo(dvcontain);
        trash.prependTo(dvcontain);
        trash.droppable({
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                //$(this).addClass("ui-state-highlight")
                if ($("#" + ui.draggable.context.id).siblings().length == 1) {
                    swal({
                        title: "Warning", text: "Delete row completely?", html: true, type: "warning", showCancelButton: true, confirmButtonColor: "#DD6B55"
                 , confirmButtonText: "Yes", cancelButtonText: "No"
                 , closeOnConfirm: true, closeOnCancel: true
                    }
             , function (isConfirm) {
                 if (isConfirm) {
                     $("#" + ui.draggable.context.id).remove(); $("#tbBtn").parent().remove();
                 }
             });
                }
                else {
                    $("#" + ui.draggable.context.id).remove(); $("#tbBtn").parent().remove()
                }
            }
        });
      
   // }
        $("<div style='clear:both;'/>").insertAfter(dvcontain);
       
    ul.disableSelection();
    //add more button
    addbtn = $("<div id='dvaddbox' style='float:left;padding:2px 7px 0 0;'></div>");
    addbtn.attr("title", "add more contorls in a row");
    addbtn.append($("<i style='color:#797979;'  class='fa fa-plus-square fa-2x imdim'/>"));
    dvcontain.prepend(addbtn);
    addbtn.on("click", function () {
        var num = 1;
        $(ul.find("li")).each(function (i, k) {
            var val = $(k).attr("val");
            if (typeof val != "undefined") {
                val = JSON.parse(val);
                if (val.hasOwnProperty("subseq"))
                    if (parseInt(val.subseq) >= num)
                        num = parseInt(val.subseq) + 1;
            }
        });
        addli(ul, num,num,"", parentcallback,optarr);
    });
    $(".dnd").parent().css('style', 'margin:10px 20px 10px 0;');
    if (typeof callback == "function" && typeof elist != "") {
        ul.empty();
        callback(ul, elist, parentcallback,optarr);
    }
}
function dndbatchInsert(ul, elist, parentcallback,optarr) {
    //callbacked from makedndbox
    $(elist).each(function (i, k) {
        var btnname = "";
        if (k.hasOwnProperty("ButtonName")) btnname = k.ButtonName;
        else if (k.hasOwnProperty("buttonname")) btnname = k.buttonname;
       
        addli(ul, btnname, k.subseq, k, parentcallback,optarr);
    });
    ul.find("li").css("width", "100px");
    $("button").button();
    setTimeout(function () {
        ul.children().first().click();
    }, 500);
}
function dndautoInsert(insert, code, insertarray, data, ctrtype) {
    //auto insert or remove predifined action button for pivot, form
    switch (insert) {
        case true:
           var ss = {}, elist = [];
            $(insertarray).each(function (i, k) {
                var n = i + 1;
                var btn = { seq: n, subseq: n, code: code + "_" + n, type: "button", position: "bottomright", insert: true };
                var keys=Object.keys(k);
                $(keys).each(function (j, p) {
                    btn[p] = k[p];
                })
                elist.push(btn);
            });
            ss.eventlist = elist;
            ss.data = data;

            $("#dndcontain_" + ctrtype).empty();
            dndboxInit(ss, ctrtype); action = false;
            $(insertarray).each(function (j, p) {
                if ($.inArray(p.command, ["save", "update"]) > -1) {
                    $(".dndli:contains('Save')").click();
                    $("#selcommand").val("update").trigger("change");
                }
            });
          
            break;
        case false:
            $(".dndli").each(function (i, k) {
                var val = $(k).attr("val");
                if (val != "") {
                    val = JSON.parse(val);
                    if (val.hasOwnProperty("insert"))
                        $(k).remove();
                }
            })
            $("#tbBtn").parent().remove();
            action = true;
            break;
    }
}
function addli(ul, title, num, val, parentcallback, optarr) {
    var li = $("<li class='dndli'></li>");
    li.attr("id", "dnd" + num);
    if (title == "") title = num;
    li.text(title);
    if (val == "")
        val = { subseq: num ,code:"bt"+idMake()};
    li.attr("val", JSON.stringify(val));
    ul.append(li);
    $("button").button();
    //parentcallback(JSON.stringify(val));
    attachoption(parentcallback, JSON.stringify(val), optarr)
    setTimeout(function () {
        selectedli(li);
        //eventhandler when click btn
        li.on("click", function () {
            selectedli($(this));
            if (typeof parentcallback == "function") {
                //parentcallback($(this).attr("val"));
                attachoption(parentcallback, $(this).attr("val"), optarr)
            }
        });
    }, 100);
    return li;
}
function selectedli(that) {
    that.siblings().removeClass("selectlii");
    that.addClass("selectlii");
}
function attachoption(parentcallback, inputval, optarr) {
    if (typeof optarr == "undefined")
        parentcallback(inputval);
    else
    switch (optarr.length) {
        case 0:
            parentcallback(inputval);
            break;
        case 1:
            parentcallback(inputval,optarr[0]);
            break;
        case 2:
            parentcallback(inputval, optarr[0], optarr[1]);
            break;
        case 3:
            parentcallback(inputval, optarr[0], optarr[1], optarr[2]);
            break;
    }
}
function dndevtlist(ctrtype) {
    //ctrtype:form,pivot
    var eventlist = [];
    if ($("#dndcontain_"+ctrtype).find(".dndli").length > 0) {
        $("#dndcontain_"+ctrtype).find(".dndli").each(function (i, k) {
            eventlist.push(JSON.parse($(k).attr("val")));
        });
    }

    return eventlist;
}
var datartnctr=""//control that can return datacode
function actionclick(val, datacode, dndcontain, ctrtype) {
    //callbacked from dndboxInit
    //all data temporary saved to attr:val within li
    //data list for mapping
    $("#tbBtn").parent().remove();
    actionclick.commandlist = commandlist;
    actionclick.showhidedatamap = showhidedatamap;
    var fieldlist = [],btnlist=[];
    var dtt = $("#spdataajax").text();
    var dt1 = $("#spdlist").text();
    if (dt1 != "" && dt1 != "[]") {
        var dt2 = JSON.parse(dt1)[0];
        dtt = JSON.parse(dtt);
        fieldlist=Object.keys(dt2);
    }
    if (typeof val != "undefined" && val != "") val = JSON.parse(val)
    // val = JSON.parse($(".dndul .selectlii").attr("val"));
    var seq = '1', code = "", type = "button", position = "bottomright", linkfield = "", display = "show",callback="", icon = "", name = '', data = '', keycode = '', local = ''
        , url = '', sdata = '', script = "", saveplace = "", commandtype = "", connectstring = "", dtype = "", command = "", dataset = datacode, mapping = "",jsonscheme=[], reloadlist = [];
   

    if (val.hasOwnProperty("subseq")) seq = val.subseq;
    if (val.hasOwnProperty("code")) code = val.code;
    else code = "bt" + idMake();
    if (val.hasOwnProperty("type")) type = val.type;
    if (val.hasOwnProperty("position")) position = val.position;
    if (val.hasOwnProperty("linkfield")) linkfield = val.linkfield;
    if (val.hasOwnProperty("display")) display = val.display;
    if (val.hasOwnProperty("buttonname")) name = val.buttonname;
    if (val.hasOwnProperty("callback")) callback = val.callback;
    if (val.hasOwnProperty("icon")) icon = val.icon;
    if (val.hasOwnProperty("script")) script = val.script;
    if (val.hasOwnProperty("dtype")) dtype = val.dtype;
    if (val.hasOwnProperty("commandtype")) commandtype = val.commandtype;
    if (val.hasOwnProperty("connectstring")) connectstring = val.connectstring;
    if (val.hasOwnProperty("command")) command = val.command;
    if (val.hasOwnProperty("data")) data = val.data;//JSON.stringify(saveTable("tbform"))
    if (val.hasOwnProperty("keycode")) keycode = val.keycode;
    if (val.hasOwnProperty("local")) local = val.local;
    if (val.hasOwnProperty("serverurl")) url = val.serverurl;
    if (val.hasOwnProperty("serverdata")) sdata = val.serverdata;
    if (val.hasOwnProperty("dataset")) dataset = val.dataset;
    if (val.hasOwnProperty("mapping")) mapping = val.mapping;
    if (val.hasOwnProperty("jsonscheme")) jsonscheme = val.jsonscheme;
    if (val.hasOwnProperty("reloadlist")) reloadlist = val.reloadlist;

    if ($("#tbBtn").length == 0) {
        var data1 = [];
        //$("#tbBtn").parent().remove();
        var dv1 = $("<div class='roundbox' style='padding:10px;clear:both;'/>");
        data1.push([makeCtr(["label", "Seq", , "width:100px", ]), makeCtr(["label", seq, "lbSeq",, ])]);
        data1.push([makeCtr(["label", "Code", , "width:100px", ]), makeCtr(["label", code, "lbCode", , ])]);
        data1.push([makeCtr(["label", "Type", , "imdim", ]), makeCtr(["select", "select,;button;icon;link", "seltype", "height:25px", ""])]);
        data1.push([makeCtr(["label", "Position", , "imdim", ]), makeCtr(["select", "select,;topright;topleft;bottomleft;bottomright", "selposition", "height:25px", ""])]);
        data1.push([makeCtr(["label", "Linkfield", , "imdim", ]), makeCtr(["select:multiselect",  fieldlist.join(";"), "sellinkfield", "height:25px;", ""])]);
        data1.push([makeCtr(["label", "Display", , "imdim", ]), makeCtr(["select", "show;hide;hover", "seldisplay", "height:25px;", ""])]);
        data1.push([makeCtr(["label", "Icon", , "imdim", ]), makeCtr(["i", , , icon, ]) + "&nbsp;" + makeCtr(["span", icon, "lbicon", "inp", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnediticon", "", "onclick:faLoad('lbicon','" + icon + "')"])]);
        data1.push([makeCtr(["label", "Command", , "imdim", ]), makeCtr(["select", , "selcommand", "height:25px", ""])]);
        data1.push([makeCtr(["label", "ButtonName", , "imdim", ]), makeCtr(["input", name, 'inpbname', "width:99%", "onkeypress:buttonupdate($(this).val())"])]);
        data1.push([makeCtr(["label", "Callback", , "imdim", ]), makeCtr(["select","", "selcallback", "height:25px;", ""])]);
        var sty = "-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width:100%;overflow:hidden";
        //$("#tbBtn>tbody>tr").last().find("textarea").attr("onkeyup", "auto_grow($(this))");//make textarea auto scrolling expand
        data1.push([makeCtr(["label", "Commandtype", , , ]), makeCtr(["span", commandtype, "spcommandtype", , "onchange:buttonupdate($(this).val())"])]);
        data1.push([makeCtr(["label", "ConnectString", , , ]), makeCtr(["span", connectstring, "spconnectstring", , ])]);
        data1.push([makeCtr(["label", "Script", "helpicon", "qtipinfo", ]), makeCtr(["textarea", script, "txScript", sty, "onkeyup:auto_grow($(this))"])]);
        data1.push([makeCtr(["label", "Dataset", , , ]), makeCtr(["span", dataset, "lbactiondatacode", "qtipedit", ])]);
        data1.push([makeCtr(["label", "Mapping", , , ]), makeCtr(["span", , "spmap", , ""])]);

        var tb3 = makeTable("tbBtn", data1, "", { hasthread: false, hasbackgroundcolor: false, hasborder: false });
        tr = $("<tr/>");
        tb3.find("tbody").append(tr);
        var btn = '<div style="padding:10px 5px 0 0;text-align:right;"><button type="button" >Save</button></div>';
        dv1.append(tb3); dv1.append(btn);
        dndcontain.append(dv1);
        $("button").button();
       
        $("#seltype").on("change", function () {
            showhide($(this).val());
        });
        $("#lbactiondatacode").bind("triggerevent", function () {
            //when select dataset to insert/update trigger
            if($("#selcommand").val()=="") command=$("#selcommand").val();
            jsonReadAjax("imcdata", "", "code", $(this).text(), actionclick.commandlist, [command]);
        });
        $("#lbactiondatacode").click(function () {
            var contain = $("<div id='dvtempdata'/>");
            $("#tbData").appendTo(contain);
            var opt = makedialogoption();
            opt.appendTo = "#tab-Contain";
            opt.title = "Data List";
            opt.height = 450;
            opt.close = function (event, ui) {
                $("#Data").append($(makeDatasrc()))
                $(this).dialog('destroy').remove();
            }
            opt.buttons = [];
            contain.dialog(opt);
            datartnctr = $(this);
            jsonReadAjax("imcdata", "", "code", $(this).text(), editDatacodecallback);
        });
    }
   
     if (url != "") {
        if ($('#selHref option[value=' + url + ']').length > 0)
            $("#selHref").val(url);
        else
            $("#inpHref").val(url)
     }

    $("#lbSeq").text(seq);
    $("#inpbname").val(name);
    $("#txScript").val(cleanup(script,""));
    $("#seltype").val(type);
    $("#selposition").val(position);
  
    $("#seldisplay").val(display);
    $("#lbCode").text(code);
    $("#lbicon").text(icon);
    $("#lbicon").prev().attr("class","fa "+icon)
    //if(reloadlist!="")
    //reloadpagelist(JSON.parse(reloadlist))
    showhide(type);
    var txt = "$curid:current id,$nextbtn,$nextbtn2, $prevbtn,$prevbtn2, $name: staffname, $id:staffid, $comp:companycode, $boss:bossid, $division:division";
    var opt = { title: "Script Help", "font-size": 14, show:"click"};
    qtip($("#helpicon"), txt, opt);

    //#region add new localStorage
    function newlocal(lname) {
        $("<span style='margin-right:20px;' id='dvnewlocal1'/>").append($("<label style='margin-right:10px;'>" + lname
           + "</label><i onclick=\"$('#sellocal').show();$('#sellocal').prop('selectedIndex', 0);$(this).parent().remove();$('#dvnewlocal').parent().remove()\" class='fa fa-times-circle imexpand'/>"))
               .insertBefore($("#btnnewlocal"));
        $("#sellocal").hide();
    }
    var data1 = []; var localarr = [];

    $(Object.keys(localStorage)).each(function (i, k) {
        if (k != "imcdata" && k != "formlist") {
            localarr.push(k);
        }
    });

    data1.push([makeCtr(["label", "Parent", , "width:100px", ]), makeCtr(["select", "None,none;" + localarr.join(';'), "selnewlocal", "width:99%", ])]);
    data1.push([makeCtr(["label", "Name", , "width:100px", ]), makeCtr(["input", , "inpnewlocal", , "width:99%", ])]);
    var tb2 = makeTable("tbnewlocal", data1, "", { hasthread: false, hasbackgroundcolor: false, hasborder: false });
    var dia = $("<div id='dvnewlocal'/>").append(tb2);
    $("#btnnewlocal,#btnnewlocal1").on("click", function () {
        if ($("#dvnewlocal").length > 0)
            $("#dvnewlocal").parent().show();
        else {
            dia.dialog({
                height: 'auto'
                 , width: 400
                , appendTo: "#tbBtn"
                 , modal: false
                 , minHeight: 'auto'
                 , title: "New Local"
                 , stack: false
                 , close: function (event, ui) {
                     $("#inpnewlocal").val("");
                     $(this).dialog('destroy').remove();
                 },
                open: function () {
                    var lname = $("#dvnewlocal1").find("label").text();
                    if (lname != "") {
                        var ll = lname.split('/');
                        switch (ll.length) {
                            case 1:
                                $("#inpnewlocal").val(ll[0]);
                                break
                            case 2:
                                $("#inpnewlocal").val(ll[1]);
                                $("#selnewlocal").val(ll[0]);
                                break;
                        }
                    }
                }
                , buttons: [
                    {
                        text: "Create",
                        icons: {
                            primary: "ui-icon-check"
                        },
                        click: function () {
                            if ($("#inpnewlocal").val() != "") {
                                $("#dvnewlocal").parent().hide();
                                $("#dvnewlocal1").remove();
                                var sel = $("#selnewlocal").val() + "/";
                                if (typeof $("#selnewlocal").val() == "undefined" | sel == "/") sel = "";
                                newlocal(sel + $("#inpnewlocal").val());
                                //$("<span style='margin-right:20px;' id='dvnewlocal1'/>").append($("<label style='margin-right:10px;'>" + sel + $("#inpnewlocal").val()
                                //    + "</label><i onclick=\"$('#sellocal').show();$('#sellocal').prop('selectedIndex', 0);$(this).parent().remove();$('#dvnewlocal').parent().remove()\" class='fa fa-times-circle imexpand'/>")).insertBefore($("#btnnewlocal"));

                            }
                            else
                                sweetmsgautoclose("Missing Field", "You missed fillin Name!!");
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
    });
    if ($("#sellocal").prop('selectedIndex') == 0 && local != "")
        newlocal(local);
    //#endregion

    //click save button
    $("#tbBtn").parent().find("button").last().on("click", function () {
        var aform = saveTable("tbBtn", true, false);
        var hidelist = [];
        $("#tbBtn>tbody>tr").each(function (i, k) {
            if ($(k).css("display") == "none")
                hidelist.push($(k).find("label").first().text().toLowerCase());
        })
        var set = {},name;
        $(aform).each(function (i, k) {
            if (k[0] == "Code") name = k[0];
            else
                name = k[0].toLowerCase();
            if($.inArray(name,hidelist)==-1)
            switch (name) {
                case "seq":
                    set[name] = k[1];
                    set["subseq"] = k[1];
                    break;
                case "Code":case "code": case "buttonname": case "data": case "keycode": case "type": case "command": case "commandtype":
                case "connectstring": case "script": case "position": case "dataset":case "icon":case "display":case "callback":
                    set[name.toLowerCase()] = k[1];
                    break;
                case "linkfield":
                    set[name.toLowerCase()] = $("#sellinkfield").multipleSelect("getSelects");
                    break;
                case "local":
                    var val = $("#sellocal").val();
                    if ($("#dvnewlocal1").length > 0) {
                        val = $("#dvnewlocal1").find("label").text();
                    }
                    set[name] = val;
                    break;
                case "serverurl":
                    if (k[1] != "")
                        set[name] = k[1];
                    else
                        set[name] = k[2];
                    break;
                case "serverdata":
                    set[name] = saveTable1("tbajaxparam")
                    break;
                case "mapping":
                    set[name] = saveTable1("tbparammap");
                    if($("#tbjsonmap").length>0)
                    set["jsonscheme"] = saveTable1("tbjsonmap");
                    break;
                case "saveplace":
                    var sc = [];
                    $("#cbsaveplace").find("input:checked").each(function (i, ob) {
                        sc.push($(ob).val());
                    });
                    if (sc.length > 0)
                        set[name] = sc.join(",");
                    break;
                case "reloadlist":
                    var list=[]
                    $("#tbapplytable>tbody>tr").each(function (a, b) {
                        $(b).find('td').each(function (c, d) {
                            if (c == 5) {
                                var set = $(d).find("span").text();
                                if (set != "")
                                    list.push(JSON.parse(set));
                            }
                        });
                    });

                    set["reloadlist"]=list;
                    break;
               // case "script":
                    //var command=$("#selcommand").val();
                    //set[name] = scriptmake(k[1],command,ctrtype);
                 //   break;
            }
        });
        console.log(set)
        if (!chkcommand(set.command)) {
            delete set.mapping;
            delete set.dataset;
        }
        var slist=Object.keys(set);
        $(slist).each(function (i, k) {
            if (set[k] == "" | set[k] == null)
                delete set[k];
        });
       
        var curdnd = $(".dndli.selectlii").attr("val");
        if (typeof curdnd!="undefined" && curdnd != "") {
            curdnd = JSON.parse(curdnd);
            if (curdnd.hasOwnProperty("insert"))
                set.insert = true;
        }
        dndcontain.find(".dndli.selectlii").attr("val", JSON.stringify(set));
        funStop();
        function complete(aform) {
            var rtn = true;
            $(aform).each(function (i, k) {
                if (k[0].toLowerCase() == "mapping") {
                    var mlist = saveTable1("tbparammap");
                    var dt1 = $.grep(mlist, function (a) {
                        return a[a.length - 1] == true;
                    });
                    if (dt1.length == 0)
                        rtn += "Keycode,";
                }
                else {
                    if (k[1] == "") rtn += k[0] + ",";
                }
            });
            return rtn;
        }
    })
    setTimeout(function () {
        actsiblinglist();
        $("#selcallback").val(callback);
        $("#inpbname").on("keyup", function () {
            dndcontain.find(".selectlii").text($(this).val());
        });
        $("#tbBtn td").first().css("width", "120px");
        $("#inpajaxparamadd").on("click", function () {
            var inp = makeCtr(["input", , , "width:99%", ]);
            if ($('.paging-nav').length == 1)
                $("#tbajaxparam").paging("destroy");
            appendTableRow($('#tbajaxparam'), [inp, inp, makeCtr(["i", "fa fa-times-circle imdim", , "", ""])]);
            delRowdelegate('tbajaxparam');
            runAfterTableCreate("tbajaxparam", { activepage: "last" });
        });
        // lbactiondatacode differ from datacode
        if (command != "") {//$("#lbactiondatacode").text() != "" && 
            if (typeof dtt == "object")
                commandlist(dtt, command);
            else
            jsonReadAjax("imcdata", "", "code", $("#lbactiondatacode").text(), actionclick.commandlist, [command]);
        }
        else
            commandlist();
    }, 1000);
    setTimeout(function () {
        //if(ctrtype!="form")//don't know why form multipleSelect without trigger!!!!
        if ($("#sellinkfield").siblings().find(".multiselect").length == 0) {
            $("#sellinkfield").multipleSelect({ width: 200 });
            if (linkfield != "") $("#sellinkfield").multipleSelect("setSelects", linkfield);
        }
    }, 3000);

    function showhide(typeval) {
        var pos = $("#selposition"), icon = $("#lbicon"), link = $("#sellinkfield"), disp = $("#seldisplay"), name = $("#inpbname");
        $([pos, icon, link, disp, name]).each(function (i, k) {
            k.closest("tr").hide();
        })
        var slist = [];
        switch (typeval) {
            case "button":
                slist = [pos, disp, name,link];
                pos.val(position);
                break;
            case "icon":
                slist = [pos, icon, disp,name,link];
                pos.val(position);
                break;
            case "link":
                slist = [link];
                break;
        }
        $(slist).each(function (i, k) {
            k.closest("tr").show();
        });
    }
    function locallist(local) {
        var dv = $("<div />");
        var localarr = Object.keys(localStorage);
        var ul = $("<select id='sellocal'/>"), li = $("<li/>"), grp = $("<optgroup/>"), selected = "";
        li = $("<option  value='' disabled selected>Select localStorage</option>");
        ul.append(li);
        $(localarr).each(function (i, k) {
            selected = "";
            if ($.inArray(k, ["formlist", "imcdata"]) == -1) {
                grp = $("<optgroup />");
                grp.attr("label", k);
                ul.append(grp);
                var kk = JSON.parse(localStorage.getItem(k));
                $(Object.keys(kk)).each(function (a, b) {
                    if (b == local) selected = "selected";
                    li = $("<option value='" + b + "' " + selected + ">&nbsp;&nbsp;-" + b + "</option>");
                    grp.append(li);
                    selected = "";
                });
            }
            else {
                if (k == local) selected = "selected";
                li = $("<option value='" + k + "' " + selected + ">" + k + "</option>");
                ul.append(li);
            }
        });
        var btn = $("<i style='margin-left:5px' title='add new localStorage'  id='btnnewlocal' class='fa fa-plus-square imdim'/><span id='btnnewlocal1' class='linkbtn' title='add new localStorage'>add</span>");
        dv.append(ul).append(btn).append(dia);

        return dv;
    }
    function ajaxfunc(list) {
        var data = [];
        data.push([makeCtr(["span", "name", , , ]), makeCtr(["span", "value", , , ]), makeCtr(["span", , , "width:20px", ])]);
        if (typeof list != "undefined" && list.length > 0) {
            $(list).each(function (i, k) {
                data.push([makeCtr(["input", k[0], , "imdim", "width:99%"]), makeCtr(["input", k[1], , "width:99%", ]), makeCtr(["i", "fa fa-times-square imdim", , "width:10px", ""])]);
            });
        }
        var tb2 = makeTable("tbajaxparam", data, "general");

        var foot = ['<input type="button" class="btnRoundsmall" value="add" style="padding:0 3px 0 3px;" id="inpajaxparamadd"/>|{"colspan":"3","style":"text-align:right;padding:5px;"}'];
        var tb3 = appendFooter(tb2, foot);

        return tb3;
    }
    function commandlist(dt, command) {
        $("#selcommand").empty();
        var datatype; $("label:contains('Reloadlist')").closest('tr').remove();
        if (typeof dt != "undefined" && dt.hasOwnProperty("dtype")) datatype = dt.dtype;
        if (typeof dt != "undefined" && dt.hasOwnProperty("querylist")) {
            $(dt.querylist).each(function (i, k) {
                $("#selcommand").append($("<option value='" + k.sqlcommand + "'>" + k.buttonname + "</option>"));
            });
            $("#selcommand").append($("<option value='" + command + "'>" +command + "</option>"));
            if ($("#spdtimsi").length > 0) $("#spdtimsi").remove();
            $("<span id='spdtimsi' style='display:none'>" + JSON.stringify(dt) + "</span>").insertAfter($("#tbBtn"));
        }
        else {
            //in case of excel, input,json/xml base data 
            //or the database which doesn't define querylist
            //field list becomes parameters to map
            //update,insert,delete to imcfile
            $(["select...,", "update", "delete","load","custom"]).each(function (i, k) {
                if (i == 0) var opt = $("<option value='' disabled selected>Select</option>");
                else {
                    var kk = k.split(",");
                    var name = kk[0],val=kk[0]
                    if (kk.length > 1) val = kk[1];
                    opt = $("<option value='" + val + "'>" + name + "</option>");
                }
                $("#selcommand").append(opt);
                $("#spconnectstring").closest("tr").hide();
                $("#spcommandtype").closest("tr").hide();
                $("#cbsaveplace").closest("tr").hide();
            });
        }
        $("#selcommand").val(command);
        var first = true;
        jsonReadAjax("imcdata", "", "code", $("#lbactiondatacode").text(), showhidedatamap, [command]);
       // showhidedatamap(command);
        $("#selcommand").on("change", function () {
            var txt = $("#selcommand option:selected").text().capitalize();
            $("#inpbname").val(txt);
            dndcontain.find(".selectlii").text(txt).css("width", "100px");
            $("#txScript").val("");
            if (chkexist($("#selcommand").val())) 
                sweetmsgautoclose("Warn", "There exists same command!");
            jsonReadAjax("imcdata", "", "code", $("#lbactiondatacode").text(), showhidedatamap, [$(this).val()]);
           // showhidedatamap();
            function chkexist(cval) {
                var rtn = false;
                if(cval!="" && typeof cval!="undefined")
                    dndcontain.find(".dndli:not('.selectlii')").each(function (i, k) {
                    var val = JSON.parse($(k).attr("val")).command;
                    if (typeof val != "undefined" && val == cval) {
                        rtn = true;
                    }
                });
                return rtn;
            }
        });
       
    }
    function showhidedatamap(data1, command1) {
        var datatype,script1=script;
        if (data1.hasOwnProperty("dtype")) datatype = data1.dtype;
        $("#lbactiondatacode").closest("tr").hide();
        $("#spmap").closest("tr").hide();
        $("#spconnectstring").closest("tr").hide();
        $("#spcommandtype").closest("tr").hide();
        switch (command1) {
            case "save": case "update": case "delete": case"select":
                $("#lbactiondatacode").closest("tr").show();
                $("#spmap").closest("tr").show();
                if (datatype == "database") {
                    $("#spconnectstring").closest("tr").show();
                    $("#spcommandtype").closest("tr").show();
                    if (data1.hasOwnProperty("querylist")){
                        $(data1.querylist).each(function(i,k){
                            if(k.sqlcommand==$("#selcommand").val())
                                script=k.query;
                        });
                    }
                }
                $("#txScript").val(scriptmake(script, command1, ctrtype));
                commandhandler(data1, command1, datatype, true);
                break;
            case "load":
                if ($("label:Contains('Reloadlist')").length == 0) {
                    var tr = $("<tr><td style='padding:3px ;border-collapse:collapse;vertical-align:top;'><label>Reloadlist</label></td><td id='tdtable'></td></tr>")
                    tr.insertAfter($("#selcommand").closest("tr"));
                    var id = findcurid1(), applyto = "";
                    var evt = $(".dndli.selectlii").attr("val");
                    if (evt != "") {
                        evt = JSON.parse(evt);
                        if (evt.hasOwnProperty("reloadlist"))
                            applyto = evt.reloadlist;
                    }
                    var paramname = menuid + ":" + subid + ":" + id;
                    var tb = reloadpagelist(applyto);
                    $("#tdtable").append(tb);
                    tb.find("tfoot>tr>td>input").first().on("click", function () {
                        reloadmenutree($("#lbCtr").text(), true)
                    });
                }
                break;
            default:
                $("label:Contains('Reloadlist')").closest("tr").remove();
                break;
        }
    }
    function scriptmake(curscript, command, ctrtype) {
        //complete script adding embedded program
        var curdata = $("#spdtimsi").text();
        if (curdata != "") curdata = JSON.parse(curdata);
        var rtn = "";
        if (curdata.dtype == "database")
            $(curdata.querylist).each(function (i, k) {
                if (k.sqlcommand == command) {
                    rtn = cleanup(curscript, k.query);
                }
            })
        else
            switch (command) {
                case "update":
                    switch (ctrtype) {
                        case "pivot":
                            //origin data
                            var param = saveTable("tbparammap"), keycode = "";
                            var dt = $.grep(param, function (a) {
                                return a[2] == true;
                            });
                            if (dt.length > 0) keycode = dt[0][0];
                            var str = "", datacode = $("#lbactiondatacode").text();
                            str += "//region insert from program";
                            str += " var newdt = pivotInsert('$curid', { type: 'save' })";
                            str += " updatedataset('" + datacode + "', newdt,'" + JSON.stringify(param) + "')";
                            str += "//endof region";
                            rtn = cleanup(curscript, str);
                            break;
                        case "form":
                            break;
                    }
                    break;
                case "delete":
                    break;
                default:
                    rtn = curscript;
                    break;
            }
        if (curscript != "") rtn = curscript;
        return rtn;
    }
    function chkcommand(command1){
        if ($.inArray(command1, ['save','update', 'delete']) > -1)
            return true;
        else
            return false;
    }
    function commandhandler(dt, command, datatype, first) {
        var filter1;
        if (typeof datatype == "undefined" && typeof dt == "object") datatype = dt.dtype;
      
        if (datatype == "database") {
            $("#spmap").empty()
            $(dt.querylist).each(function (i, k) {
                if (k.sqlcommand == command) {
                    if (first)
                        $("#spmap").append(commandmaptable(k.param,k.filter))
                    var str = "//region insert from program \n" + k.query + "\n//endof region\n";
                    // $("#txScript").val(cleanup($("#txScript").val(), str));
                    var con = dt.connection.split(";");
                    if (con[0].indexOf("DBtype") > -1) {
                        con.splice(0, 1);
                    }
                    $("#spconnectstring").text(con.join(";"));
                    $("#spcommandtype").text(k.dtype);
                }
            });
            //jsonscheme mapping
            var datalist = datalistreturn(dt);
            if (jsonscheme.length == 0) {
                $(Object.keys(datalist[0])).each(function (i, k) {
                    jsonscheme.push([k, '', false]);
                });
                jsonscheme=applyFilter(jsonscheme,dt.filter)
            }
            $("#spmap").append(commandjsontable(jsonscheme,filter1));
            $("<div id='dvparammap' style='font-weight:bold;font-size:smaller;background-color:#DFDFDF;padding:2px;'>DB Parameters vs Field Mapping</div>").insertBefore($("#tbparammap"));
            $("#tbparammap").css({ "margin-bottom": "15px" })
            $("<div  id='dvfieldmap' style='font-weight:bold;font-size:smaller;background-color:#DFDFDF;padding:2px;'>Database vs Field Mapping</div>").insertBefore($("#tbjsonmap"));
        }
        else {
            var dtlist = [], dlist = [];
            if (typeof dt != "undefined" && dt.hasOwnProperty("datalist") && dt.datalist.length > 0) dtlist = Object.keys(dt.datalist[0]);
            $(dtlist).each(function (i, k) {
                dlist.push([k, ""]);
            });
            if (first)
                $("#spmap").empty().append(commandmaptable(dlist,dt.filter));
        }
    }
    function commandmaptable(param,filter) {
        var inputlist = [], dblist = [];

        inputlist = fieldnamelist(ctrtype);
        var pname = "Parameters";
        if ($("#spconnectstring").text() == "") pname = "DataField";

        var data = [[makeCtr(["span", pname, , , ]), makeCtr(["span", "Field", , , ]), makeCtr(["span", "Keycode", , , ])]];
        if (typeof param !="undefined" && param.length>0 && param[0].length == 3)
            data = [[makeCtr(["span", "Parameters", , , ]), makeCtr(["span", "Field", , , ]), makeCtr(["span", "Type", , , ]), makeCtr(["span", "Keycode", , , ])]];
        if (param != "") {
            $(param).each(function (i, k) {
                if (param[0].length == 3)
                    data.push([k[0], makeCtr(["select", inputlist.join(";") + ";custom", "", "", ]), k[2], makeCtr(["input:checkbox", , "", "", ""])]);
                else
                    data.push([k[0], makeCtr(["select", inputlist.join(";") + ";custom", "", "", ]), makeCtr(["input:checkbox", , "", "", ""])]);
            });
        }
        var tb = makeTable("tbparammap", data, "general");
        var foot = ['<input type="button" class="btnRoundsmall" value="reload"  style="padding:0 3px 0 3px;"/>|{"colspan":"' + data[0].length + '","style":"text-align:right;padding:5px;"}'];
        tb = appendFooter(tb, foot);
        
        $(tb.find("tfoot>tr>td>input")).on("click", function () {
            jsonReadAjax("imcdata", "", "code", $("#lbactiondatacode").text(), actionclick.commandlist, [command]);
        });
        //$(tb.find("tbody>tr>td:nth-child(2)>select")).each(function (i, k) {
        //    toggleSelect($(this))
        //});
        $(tb.find("tbody>tr")).each(function (i, k) {
            var tx = $(k).find("td").first().text();
            $(k).find("select").val(tx);
        })

        $(mapping).each(function (i, k) {
            $(tb).find("tbody>tr").each(function (a, b) {
                if (i == a) {
                    //$(b).find("select").val(k[1]);
                    toggleSelect($(b).find("select"), k[1]);
                    $(b).find("input:checkbox").prop("checked", k[k.length - 1]);
                }
                else
                    toggleSelect($(b).find("select"));
            })
        })

        return tb;
    }
    function commandjsontable(jsonscheme,filter) {
        var inputlist = [], dblist = [];
        
        inputlist = fieldnamelist('form');
        var data = [[makeCtr(["span", "DataField", , , ]), makeCtr(["span", "Field", , , ]), makeCtr(["span", "Keycode", , , ])]];
        if (jsonscheme != "") {
            $(jsonscheme).each(function (i, k) {
                data.push([k[0], makeCtr(["select", inputlist.join(";") + ";custom", "", "", ]), makeCtr(["input:checkbox", , "", "", ""])]);
            });
        }
        var tb = makeTable("tbjsonmap", data, "general");
        var foot = ['<input type="button" class="btnRoundsmall" value="reload"  style="padding:0 3px 0 3px;"/>|{"colspan":"' + data[0].length + '","style":"text-align:right;padding:5px;"}'];
        tb = appendFooter(tb, foot);
       
        $(tb.find("tfoot>tr>td>input")).on("click", function () {
            jsonReadAjax("imcdata", "", "code", $("#lbactiondatacode").text(), actionclick.commandlist, [command]);
        });
        //$(tb.find("tbody>tr>td:nth-child(2)>select")).each(function (i, k) {
        //    toggleSelect($(this))
        //});
        $(tb.find("tbody>tr")).each(function (i, k) {
            var tx = $(k).find("td").first().text();
            $(k).find("select").val(tx);
        })

        $(jsonscheme).each(function (i, k) {
            $(tb).find("tbody>tr").each(function (a, b) {
                if (i == a) {
                    $(b).find("select").val(k[1]);
                    toggleSelect($(b).find("select"), k[1]);
                    $(b).find("input:checkbox").prop("checked", k[2]);
                }
                else
                    toggleSelect($(b).find("select"));
            })
        })

        return tb;
    }
    function cleanup(curstr, newstr) {
        var rtn = "";
        var fs = curstr.indexOf("/"), ed = curstr.lastIndexOf("/") + 14;
        if (fs == -1) {
            if (newstr != "" && curstr != "") newstr = "\n" + newstr;
            rtn = curstr + newstr;
        }
        else
            rtn = curstr.substring(0, fs) + newstr + curstr.substring(ed);
        return rtn;
    }
    function actsiblinglist() {
        //for callback list, action list except me
        var list = [{ text: "select", value: "" }];
        $('#selcallback').empty();
        $($(".selectlii").siblings()).each(function (i, k) {
            var vl = JSON.parse($(k).attr("val"));
            list.push({text:vl.buttonname,value: vl.code});
        });
        $.each(list, function (i, item) {
            $('#selcallback').append($('<option>', {
                value: item.value,
                text: item.text
            }));
        });
    }
}
function fieldnamelist(ctrtype) {
    //make table field name list
    inputlist = [];
    switch (ctrtype) {
        case "form":
            var list = $("#splistdata").text();
            if (list != "") list = JSON.parse(list);

            if (list.hasOwnProperty("ctrlist"))
                $.each(list.ctrlist, function (i, k) {
                    if ($.inArray(k.ctrtype, ["select","selectimage","multiselect"]) > -1) {
                        inputlist.push(k.title + ":text" + "," + k.title + ":text");
                        inputlist.push(k.title + ":value" + "," + k.title + ":value");
                    }
                    else if ($.inArray(k.ctrtype, ["button", "i"]) == -1 && k.title != "")
                        inputlist.push(k.title + "," + k.title);
                });

            break;
        default:
            var dt1 = $("#spdlist").text();
            if (dt1 != "" && dt1 != "[]") {
                var dt2 = JSON.parse(dt1)[0];
                inputlist = Object.keys(dt2);
            }
            break;
    }
    inputlist.unshift("select,");
    return jQuery.unique(inputlist)
}
//click to reload or popup control
function reloadpagelist(applylist) {
    var mapfield = "", loadtype = "";
    var data = [[makeCtr(["span", "Seq", , , ]), makeCtr(["span", "Pagename", , , ]), makeCtr(["span", "Control", , , ]), makeCtr(["span", "Mapping", , , ]), makeCtr(["span", "Action", , , ]), makeCtr(["span", "", , , ]), makeCtr(["i", "fa fa-pencil", , , ]), makeCtr(["i", "fa fa-trash", , , ])]];
    if (typeof applylist != "undefined" && applylist != "") {
        $(applylist).each(function (i, k) {
            mapfield = "", loadtype = "",func="";
            if (k.hasOwnProperty("mapfield") && k.mapfield != "null") mapfield = k.mapfield;
            if (k.hasOwnProperty("loadtype") && k.loadtype != "null") loadtype = k.loadtype;
            if (k.hasOwnProperty("function") && k.function != "null") func = k.function;
            data.push([k.seq.toString(), k.pagename, makeCtr(["span", k.ctrtype, , "font-size:8px;color:red;margin-right:5px;", ]) + k.dvid, mapfield, loadtype
                , makeCtr(["span", JSON.stringify(k), , "display:none", ]), makeCtr(["i", "fa fa-pencil imdim", , "", ]), makeCtr(["i", "fa fa-trash imdim", , "", ])]);
        });
    }
    var tb = makeTable("tbapplytable", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="add"  style="padding:0 3px 0 3px;"/>|{"colspan":"' + 8 + '","style":"text-align:right;padding:5px;"}'];
    tb = appendFooter(tb, foot);
    setTimeout(function () { reloadeventhander(); }, 1000);
    return tb;
}
function reloadinsert(row) {
    $(row).each(function (i, k) {
        var append = [k.seq, k.pagename, makeCtr(["span", k.ctrtype, , "font-size:8px;color:red;margin-right:5px;", ]) + k.dvid, "", "", makeCtr(["span", JSON.stringify(k), , "display:none", ]), makeCtr(["i", "fa fa-pencil", , , ]), makeCtr(["i", "fa fa-trash", , , ])];
        appendTableRow($("#tbapplytable"), append);
        reloadeventhander();

    });
}
function reloadedit(rowdt) {
    reloadedit.datasrc = datasrc;
    var gdt = selectimctable(rowdt.menuid, rowdt.subid, rowdt.dvid);
    if (rowdt.hasOwnProperty("data")) {
        var dtcode = rowdt.data.datacode;
        jsonReadAjax("imcdata", "", "code", dtcode, reloadedit.datasrc, [rowdt])
    }
    else if (typeof gdt != "undefined" && gdt.hasOwnProperty("data")) {
        var dtcode = gdt.data.datacode;
        jsonReadAjax("imcdata", "", "code", dtcode, reloadedit.datasrc, [rowdt])
    }
    else
        datasrc("", rowdt);
    function datasrc(data, rowdt) {
        var list = "",childdata="";
        if (data != "") {
            list = datalistreturn(data);
            childdata = data.code;
        }
        console.log(data,childdata)
        var field = [], field1 = [];
        if (list.length > 0)
            $.each(list[0], function (i, k) {
                var set = {}; set.value = i; set.text = i;
                field.push(set);
                field1.push(i);
            });
        if ($("#dvParam").length > 0) $("#dvParam").remove();
        var dv = $("<div id='dvParam' style='text-align:left;margin:10px 5px 0 0;background-color:#F2F5F7'></div>");

        //mapping table
        //var sel = makeSelect(field, ["", "value", "text"]);
        //$(sel).attr("id", "selParam1");
        //$(sel).prepend("<option>select...</option>");

        var keyarray = $("#sellinkfield").multipleSelect("getSelects");
        var keydata = [[makeCtr(["span", "Parent", , , ]), makeCtr(["span", "Child", , , ])]];
        if (keyarray.length > 0) {
            $(keyarray).each(function (i, k) {
                keydata.push([k, makeCtr(["select", field1.join(";") + ";custom", "", "", ])]);
            });
        }
        var tbkeymap = makeTable("tbkeymap", keydata, "general");
        function keymapdata() {
            saveTable1("tbkeymap")
        }

        //Load type
        var lt = [];
        $.each(['reload', 'popup', 'replace','sidebyside','pagemove'], function (i, k) {
            var set = {}; set.value = k; set.text = k;
            lt.push(set);
        });
        var ltype = makeSelect(lt, ["", "value", "text"]);
        $(ltype).attr("id", "seltype1");
        var mapfield = "", loadtype = "", func = "", wth = "";
        var sty = "width: 100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;";
        if (rowdt.hasOwnProperty("mapfield")) mapfield = rowdt.mapfield;
        if (rowdt.hasOwnProperty("loadtype")) loadtype = rowdt.loadtype;
        if (rowdt.hasOwnProperty("function")) func = rowdt.function;
        if (rowdt.hasOwnProperty("width")) wth = rowdt.width;
        //var btn = $("<button class='btnRoundsmall' style='margin-left:5px' onclick=\"saveParam('" + pageid + "','" + dvid + "','" + paramname + "')\"> Save </button>");
        //dv.append($("<div style='text-align:center;text-decoration:underline;'>Mapping Field for " +pagename+"("+ dvid + ")</div>"));
        var tb = $("<table />"), tr = $("<tr />"), td = $("<td style='width:80px'/>");
        dv.append(tb);
        tb.append(tr); tr.append(td); td.append($("<label for='lbPage'> Page: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<label id='lbPage'> " + rowdt.pagename + "</label>"));
        tr = $("<tr />"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='lbControl'> Control: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<span style='color:red;margin-right:5px;font-size:8px;'>" + rowdt.ctrtype + "</span><label id='lbControl'>" + rowdt.dvid + "</label>"));
        tr = $("<tr />"), td = $("<td style='vertical-align:top'/>");
        tb.append(tr); tr.append(td); td.append($("<label for='tbkeymap'> Map Field: </label>"));
        td = $("<td />"); tr.append(td); td.append(tbkeymap);

        tr = $("<tr />"), td = $("<td style='vertical-align:top' />");
        tb.append(tr); tr.append(td); td.append($("<label for='txFunc'> Function: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<textarea style='" + sty + "' id='txFunc'/>"));

        tr = $("<tr />"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='seltype1'> Load Type: </label>"));
        td = $("<td/>"); tr.append(td); td.append(ltype);
        tr = $("<tr style='display:none'/>"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='seltype1'> width: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<input value='600'/><span>px</span>"));//.append($(makeCtr(["select", "px;%", "", "margin-left:5px", ""])));
        dv.dialog(opt());

        var set;
        function opt() {
            var dialogset = {};
            dialogset.title = "Mapping Field";
            dialogset.width = 400;
            //button
            dialogset.buttons = [];
            set = {};
            set.text = "Save";
            set.icons = { primaray: "ui-icon-disk" };
            set.click = function () {
                rowdt.mapfield = saveTable1("tbkeymap");
                rowdt.loadtype = $(ltype).val();
                if ($("#txFunc").val() != "")
                    rowdt.function = $("#txFunc").val();
                if ($(ltype).val() == "popup") {
                    var wth = $(ltype).closest("tr").next().find("input");
                    rowdt.width = wth.val();
                }
                var append = [rowdt.seq, rowdt.subid, rowdt.dvid, makeCtr(["span", JSON.stringify(rowdt), , "display:none", ]), makeCtr(["i", "fa fa-pencil", , , ]), makeCtr(["i", "fa fa-trash", , , ])];
                var chkexist = false;
                $("#tbapplytable>tbody>tr").each(function (a, b) {
                    var seq = $(b).find("td:nth-child(1)").text();
                    if (seq == rowdt.seq) {
                        $(b).find('td').each(function (c, d) {
                            switch (c) {
                                case 3:
                                    // $(d).text($(sel).val());
                                    break;
                                case 4:
                                    $(d).text($(ltype).val());
                                    break;
                                case 5:
                                    $(d).find("span").text(JSON.stringify(rowdt));
                                    break;
                            }
                        });
                        chkexit = true;
                    }
                });
                $(this).dialog("destroy");
                //if (!chkexist)
                //    appendTableRow($("#tbapplytable"), append);
                reloadeventhander();
            }
            dialogset.buttons.push(set);

            set = {};
            set.text = "Close";
            set.icons = { primaray: "ui-icon-close" };
            set.click = function () { $(this).dialog("destroy") }
            dialogset.buttons.push(set);
            //dialogset.modal = true;
            //confine
            //dialogset.position = { my: "center", at: "center", of: "#dvtable" };
            return dialogset;
        }

        //$("#selParam1").val(mapfield);
        $("#tbkeymap>tbody>tr").each(function (a, b) {
            var pcode = $(b).find('td').first().text();
            $(mapfield).each(function (c, d) {
                if (d[0] == pcode)
                    $(b).last('td').find('select').val(d[1]);
            })
        })
        // if (mapfield != "") $("#selhidden").multipleSelect("setSelects", JSON.parse(mapfield));
        $("#seltype1").val(loadtype);
        if (loadtype == "popup") {
            $("#seltype1").closest("tr").next().show();
            $("#seltype1").closest("tr").next().find("input").val(wth);
        }
        $("#seltype1").on("change", function () {
            $(this).closest("tr").next().hide();
            if ($(this).val() == "popup") {
                $(this).closest("tr").next().show();
            }
        });
        $("#txFunc").val(func);
        dv.parent().css("z-Index", 400);
    }
}
function reloadeventhander() {
    //register eventhandler of reloadpagelist
    $("#tbapplytable>tbody>tr").each(function (a, b) {
        $(b).find("td>i").first().on("click", function () {
            var tx = $(b).find("td>i").first().closest("td").prev().find("span").text();
            reloadedit(JSON.parse(tx));
        });
    });
    delRowdelegate("tbapplytable");
        
}
function reloadmenutree(id, currentpage) {
    //dialog setting
    if ($("#show").length > 0)
        $("#show").dialog("destroy");
    var menubox = $("<div id='show' style='z-index:400'></div>");
    var mlistsel = $("<span>Menu List: </span> "+makeCtr(["select", "All,all;Current,current", "selmlist", "height:23px;margin-right:5px", ""]));
    menubox.append(mlistsel);
    menubox.append($("<div id='show1'/>"));
    menubox.dialog(dialogopt());
   
    //jstree setting
    var jsopt = { textbox: "inNodetext1", valuebox: "inNodevalue1", display: "pop" };
    jsopt.plugin = ["checkbox", "contextmenu"];
    $("<input id='inNodetext1' type='hidden' />").appendTo($('body'));
    $("<input id='inNodevalue1' type='hidden' />").appendTo($('body'));
    var data = menutreedata(id,currentpage);
    loadtreewithdata1("show1", data, jsopt);
    var jstree1 = $('#show1');
   
    $("#show").parent().css("z-Index", 400);

    //checkbox checked
    setTimeout(function () {
        $.each(menutree_selected(), function (i, k) {
            jstree1.jstree("select_node", "#" + JSON.stringify(k));
        });
        $("#dvParam").remove();
        if (currentpage) $("#selmlist").val("current");
        $("#selmlist").on("change", function () {
            var cp = false;
            if ($(this).val() == "current") cp = true;
            reloadmenutree(id, cp);
        });
    }, 300);

    var set;
    function dialogopt() {
        var dialogset = {};
        dialogset.title = "Control List";
        //button
        dialogset.buttons = [];
        set = {};
        set.text = "Save";
        set.icons = { primaray: "ui-icon-disk" };
        set.click = function () {
            var applytolist = [], maxseq = 0;;

            var selarr = $('#show1').jstree(true).get_selected();
            $(selarr).each(function (a, b) {
                if (checkJSON(b)) {
                    var set = JSON.parse(b), chk = true;
                    $(menutree_selected()).each(function (i, k) {
                        if (k.dvid == set.dvid) {
                            chk = false;
                        }
                    });
                    if (chk) {
                        if ($("#tbapplytable>tbody>tr").length == 0) maxseq++;
                        else
                            $("#tbapplytable>tbody>tr").each(function (i, k) {
                                var cnum = parseInt($(k).find("td").first().text());
                                if (cnum >= maxseq)
                                    maxseq = cnum + 1;
                            });
                        set.seq = maxseq;
                        set.menutoggle = menutoggle;
                        applytolist.push(set);
                    }
                }
            });
            $(this).dialog("destroy")
            console.log(applytolist)
            reloadinsert(applytolist);
        };
        dialogset.buttons.push(set);
        set = {};
        set.text = "Close";
        set.icons = { primaray: "ui-icon-close" };
        set.click = function () { $(this).dialog("destroy") }
        dialogset.buttons.push(set);
        dialogset.modal = true;
        //confine
        //dialogset.position = { my: "center", at: "center", of: "#dvtable" };
        return dialogset;
    }
}
function menutreedata(id,currentpage) {
    //menutree data make
    //show current page submenu & control list
    var data = [];
    console.log(id,currentpage)
    data.push({ id: "0", text: "Menu", parent: "#", icon: "fa fa-home" });
    $(["", "admin", "open"]).each(function (a, b) {
        var mpage = menuMy("menu", b).filter(function (v) { return v !== '' });;
        var spage = menuMy("submenu", b).filter(function (v) { return v !== '' });;
        var control = menuMy("control", b).filter(function (v) { return v !== '' && v.menuid!==false });

        var ctr = selectimctable(menuid, subid, id);
        var title = b;
        if (b == "") title = "main";
        var selectedlist = menutree_selected();
        if (typeof spage != "undefined" && spage != "") {
            data.push({ id: title, text: title, parent: "0", icon: "fa fa-home" });
            $.each(mpage, function (s, o) {
                set = {};
                set.id = o.menuid+b;
                set.text = o.title;
                set.parent = title;
                set.icon = "fa fa-columns";
                data.push(set);
            });
            $.each(spage, function (s, o) {
                set = {};
                set.id = o.subid;
                set.text = o.text;
                set.parent = o.menuid+b;
                set.icon = "fa fa-columns";
                data.push(set);
            });
            if (typeof (control) != "undefined") {
                //data.push({ "id": subid, "text": "Top", "parent": "#" });
                $.each(control, function (j, l) {
                    if (l != null && l != "" && typeof l.subid != "undefined" && typeof l.dvid != "undefined" ) {
                        set = {};
                        var ctype = "", mtitle = "", stitle = "";
                        if (l.hasOwnProperty("ctrtype")) ctype = l.ctrtype;
                        var mp = "", sp = "";
                        
                        $(mpage).each(function (x,y) {
                            if (b.menuid+b == l.menuid+b)
                                mp = y;
                        })
                        $(spage).each(function (x,y) {
                            if (b.subid == l.subid)
                                sp =y;
                        })

                        if (sp!="" && mp.hasOwnProperty("title")) mtitle = mp.title;
                        if (sp!="" && sp.hasOwnProperty("text")) stitle = ">" + sp.text;
                        var obj = { menuid: l.menuid, subid: l.subid, dvid: l.dvid, ctrtype: ctype, pagename: mtitle + stitle };
                        set.id = JSON.stringify(obj);
                        set.text = ctype + " " + l.dvid;
                        set.parent = l.subid;
                        switch (ctype) {
                            case "jqgrid":
                                set.icon = "fa fa-table";
                                break;
                            case "jstree":
                                set.icon = "fa fa-dribbble";
                                break;
                            case "googlechart":
                                set.icon = "fa fa-bar-chart";
                                break;
                            case "fullcalendar":
                                set.icon = "fa fa-calendar";
                                break;
                            case "content":
                                set.icon = "fa fa-list-alt";
                                break;
                            case "map":
                                set.icon = "fa fa-file-photo-o ";
                                break;
                            case "ifrm":
                                set.icon = "fa fa-desktop";
                                break;
                            case "pivot":
                                set.icon = "fa fa-table ";
                                break;
                            case "form":
                                set.icon = "fa fa-file-text-o ";
                                break;
                            default:
                                set.icon = "fa fa-paw";
                                break;

                        }
                        if ($.inArray(obj, selectedlist) > -1)
                            set.state = { opened: true, selected: true }
                        data.push(set);
                    }
                });
            }
        }
    })
    //console.log(data)
    var newdt = [];
    if (currentpage)
        $(data).each(function (i, k) {
            if (k.parent == subid | k.id == subid) {
                if (k.id == subid)k.parent = "#";
                newdt.push(k);
            }
            data = $.unique(newdt);
        });
    console.log(data)
    //$(data).each(function (i, k) {
    //    if ($.inArray(JSON.parse(k.id),selectedlist) > -1)
    //        k.state = { opened: true, selected: true }
    //});
    return data;
}
function menutree_selected() {
    //extract id from current reloadlist 
    var applytolist = [];
    $("#tbapplytable>tbody>tr").each(function (a, b) {
        $(b).find('td').each(function (c, d) {
            if (c == 5) {
                var obj = $(d).find("span").text();
                if (obj != "") {
                    var nbj = {};
                    obj = JSON.parse(obj);
                    nbj.menuid = obj.menuid;
                    nbj.subid = obj.subid;
                    nbj.dvid = obj.dvid;
                    nbj.ctrtype = obj.ctrtype;
                    nbj.pagename = obj.pagename;
                    applytolist.push(nbj);
                }
            }
        });
    });
    return applytolist;
}

//#region css styling
var clientid = "", selcode = "";
function cssEditInit(dvcss, ctrid,ctrtype) {
   // cssEditInit.archivecss=archivecss;
    //retrieve cssdata by id, insert it to dvcss
    //if just selected from archive, inject rtn from formedit (or other edit function)
    selcode = "";
    if ($("#dvCsscontain").length > 0) $("#dvCsscontain").remove();
    var dvcontain = $("<div id='dvCsscontain'/>");
    dvcontain.append($("<span />"));
    //dvcontain.append(dv); 
    $("#" + dvcss).append(dvcontain);
   
    //list or edit diverge
    var rtn = findcssdt(ctrid, ctrtype);

    if (rtn==true) 
        jsonReadAjax("imcsetting", "csslist", "", '', cssList);
    else if (rtn==false) 
        jsonReadAjax("imclist", ctrtype, "code", ctrid, cssEditInitarchivecss, [ctrtype]);
    else {
        switch (rtn.type) {
            case "csscode":
                selcode = rtn.csscode;
                jsonReadAjax("imcsetting", "csslist", "", '', cssList,[ctrtype]);
                $("#dvCsscontain").find("span").first().text(JSON.stringify({ "csscode": rtn.csscode }))
                break;
            case "css":
                selcode = rtn.dt.code;
                jsonReadAjax("imcsetting", "csslist", "", '', cssList,[ctrtype]);
                $("#dvCsscontain").hide();
                cssEdit(rtn.dt);
                break;
        }
    }
}
function cssEditInitarchivecss(cdt,  ctrtype) {
    var rtn = {};
    if (cdt.hasOwnProperty("css")) {
        rtn.dt = cdt.css;
        rtn.type = "css";
    }
    else if (cdt.hasOwnProperty("csscode")) {
        rtn.type = "csscode";
        rtn.csscode = cdt.csscode;
    }
    if (rtn.hasOwnProperty("type"))
        switch (rtn.type) {
            case "csscode":
                selcode = rtn.csscode;
                jsonReadAjax("imcsetting", "csslist", "", '', cssList);
                $("#dvCsscontain").find("span").first().text(JSON.stringify({ "csscode": rtn.csscode }))
                break;
            case "css":
                cssEdit(rtn.dt);
                break;
        }
    else {
        jsonReadAjax("imcsetting", "csslist", "", '', cssList);
        //$("#" + dvcss).find("span").first().text(JSON.stringify({ "csscode": rtn.csscode }))
    }
      

}

function makertn(cssdt) {
    var rtn = false;
    if (typeof cssdt != "undefined") {
        rtn = {};
        rtn.dt = cssdt;
        rtn.type = "csscode";
    }
    return rtn;
}
    
function cssListReturn() {
//when from edit to list back to previous edit setting
    if ($("#lbCtr").text()== "" && $("#sparchive").text() == "") {
        jsonReadAjax("imcsetting", "csslist", "", "", cssList);
    }
    else {
         var dvcontain = $("#dvCsscontain");
         var val = $("#inpcssdt").val();
         jsonReadAjax("imcsetting", "csslist", "", "", cssList);
         dvcontain.append($("<div style='text-align:right'><button>Return</button></div>"))
         dvcontain.find("button").on("click", function () {
             if(val!="")val=JSON.parse(val);
                 cssEdit(val)
         });
         $("button").button();
    }
}  
function cssList(dt,ctrtype) {
    //dvcss:container id that append css list or css edit
    var datasrc = "", set, dvcontain = $("#dvCsscontain"),cssset="";
    if ($("#dvCsscontain").find("span").length > 0)
        cssset=$("#dvCsscontain").find("span").first().text();
   
    dvcontain.empty();
    dvcontain.append($("<span>"+cssset+"</span>"));
    //var dt = selectimc("imcsetting", "csslist");
    var datasrc = JSON.parse(JSON.stringify(dt, ['domtype', 'code', 'name', 'desc']));
    var gridid = "tbList";
    var pagerid = "dvListpager";
    var dvjq = $("<table width='100%'/>"), tr = $("<tr/>"), td = $("<td style='vertical-align:top;'/>");
    dvjq.append(tr);
    tr.append(td);
   // var img1 = $("<i class='fa fa-picture-o fa-2x imdim' onclick=\"togglechg('dvgallery', 'gbox_tbList')\"/>");
   // td.append($("<div id='dvcsstojson' style='display:none'><div style='float:left'><label>Class List</label></div></div><div style='clear:both'/>"));
        var domlist1=["table","form"];
        td.append($("<div style='text-align:right;padding:3px;'>"+makeCtr(["select", "select,;"+domlist1.join(';'), "sellisttype", "height:23px;margin-right:5px", ""])
    + "<i class='fa fa-th-large fa-2x imdim' style='vertical-align:bottom' /></div>"));
    var gdv = $("<div id='dvgallery' style='display:none;'/>");
    td.append(gdv);
    var fdv=$("<div id='dvformgrid'/>");
    //td.append(fdv);
    td.append($("<table id='" + gridid + "'/>"));
    td.append($("<div id='" + pagerid + "' />"));
    tr = $("<tr/>"), td = $("<td/>");
    tr.append(td); dvjq.append(tr);
    dvcontain.append(dvjq);
    dvcontain.append($("<span id='spcssdt' style='display:none;'>" + JSON.stringify(dt) + "</span>"));
    var ds1 = "";
    if (datasrc == "") {
        datasrc = [{ type:"",sname: "", sdesc: "", style: "" }];
        ds1 = true;
    }
    if (typeof ctrtype != "undefined" && ctrtype != "") {
        datasrc = $.grep(datasrc, function (a) {
            return a.domtype == ctrtype;
        });
        $("#sellisttype").val(ctrtype);
    }
    cssListGrid(datasrc, gridid, pagerid, "css",ctrtype);
    cssListGallery(dt,ctrtype);
    $("#sellisttype").on("change", function () {
        funLoading(true);
        cssListGridreload($(this).val(), dt);
    });
    $("#sellisttype").next().on("click", function () {
        funLoading(true);
        togglechg('dvgallery', 'gbox_tbList');
        togglechgi('fa-th-large', 'fa-list-alt');
        //if(typeof $(this).prev().val()!="undefined")
        cssListGridreload($(this).prev().val(), dt);
    });
    $("#" + gridid).find(".ui-icon-pencil").on("click", function () {
        var code = $(this).closest("tr").find("td:nth-child(3)").text();
        jsonReadAjax("imcsetting", "csslist", "code", code,cssEdit);
    });
}
function cssListGridreload(domtype,dt) {
    var gridid = "tbList";
    var pagerid = "dvListpager";
    
    if(typeof domtype!="undefined" && domtype!="")
        dt  = $.grep(dt, function (a) {
            return a.domtype == domtype;
        });
    var datasrc = JSON.parse(JSON.stringify(dt, ['domtype', 'code', 'name', 'desc']));

    //current open
    gallery = $("#dvgallery").css("display")

    if (gallery == "block")
        cssListGallery(dt);
    else
        cssListGrid(datasrc, gridid, pagerid, "css")
    funStop();
}
function cssListGrid(datasrc, gridid, pagerid, clevel,ctrtype) {
    $("#" + gridid).jqGrid("GridUnload");
    var colmodel = []; var colname = []; var list = [];
    var li = [], li1 = [];
    
    if (datasrc.length > 0) {
        $.each(datasrc, function (i, k) {
            li.push(k);
        });
        $.each(li, function (fn, v) {
            $.each(v, function (i, vv) {
                if (!arraychkexist(list, i))
                    list.push(i);
            });
        });
        $.each(list, function (i, fname) {
            if (fname == "updateinterval") fname = fname.replace("update", "");
            colname.push(fname);
            var opt = { name: fname };
            colmodel.push(opt);
        });
        colname.push('');
        colmodel.push({ name: 'edit', width: 15, sortable: false });
        colname.unshift('');
        colmodel.unshift({ name: 'sel', width: 15, sortable: false });
        if (clevel == "style") {
            colmodel.push({ name: 'del', width: 15, sortable: false });
            colname.push('');
        }
        //opt:option 추가 사항
        var options = {
            colNames: colname,
            colModel: colmodel,
            datatype: "local",
            data: li,
            height: "auto",
            autowidth: true,
            shrinkToFit: true,
            rowNum: 10,
            rowList: [5, 10, 20, 30],
            pager: pagerid,
            //caption: "Data View",
            sortable: true
            //onCellSelect: function (rowid, iCol) {
            //    console.log(rowid,iCol)
            //    //var list = jQuery("#" + gridid).getRowData(rowid);
            //    //var namelist = Object.keys(list);
            //    //console.log(namelist,namelist[iCol],iCol);
            //    //switch (namelist[iCol]) {
            //    //    case "edit":
            //    //        switch (clevel) {
            //    //            case "css":
            //    //                console.log(list.code)
            //    //               // var dt = selectimc("imcsetting", "csslist", "code", list.code);
            //    //                jsonReadAjax("imcsetting", "csslist", "code", list.code, cssEdit);
            //    //                //cssEdit(dt);
            //    //                break;
            //    //            case "style":
            //    //                addstyleBuild(list.style, list.sname);
            //    //                break;
            //    //        }
            //    //        break;
            //    //    case "del":
            //    //        delstyle($("#inpcssCode").val(),list.sname);
            //    //        break;
            //    //}
            //}
            ,gridComplete: function () {
                var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var rowarr = jQuery("#" + gridid).getRowData(cl);
                    var selicon = 'ui-icon-check',style="";
                    if (rowarr.code == selcode) {
                        selicon = ' ui-icon-circle-check';
                        style = "style='color:red'";
                    }
                    be = "<i class='fa  fa-check fa-lg imdim' style='color:gray'  onclick=\"selectcss('" + rowarr.code + "');\"  />";
                    if (rowarr.code == selcode) {
                        be = "<i class='fa fa-check fa-lg imdim' style='color:red' onclick=\"selectcss('" + rowarr.code + "');\"  />";
                    }
                    ce = "<span class='ui-icon ui-icon-trash'   />";
                    ae = "<span class='ui-icon ui-icon-pencil'   />";
                    switch (clevel) {
                        case 'style':
                            //ae = "<span class='ui-icon ui-icon-pencil'   onclick=\"" + editCss(rowarr.sname) + "\" />";
                            ae = "<span class='ui-icon ui-icon-pencil'/>";
                            ce = "<span class='ui-icon ui-icon-trash' onclick=\"delstyle($('#inpcssCode').val(),'" + rowarr.sname + "');\"  />";
                            var ctr = { edit: ae, del: ce };
                            break;
                        case 'css':
                            //ae = "<span class='ui-icon ui-icon-pencil'   />";
                            if ($("#lbCtr").text() == "" && $("#sparchive").text()=="")
                                be = "";
                            ae = "<span class='ui-icon ui-icon-pencil' onclick=\"jsonReadAjax('imcsetting', 'csslist', 'code', '" + rowarr.code + "', cssEdit);\" />";
                            var ctr = { edit: ae, sel: be };

                            break;
                    }
                    jQuery("#" + gridid).jqGrid('setRowData', ids[i], ctr);
                   
                }
            }
        };
        jQuery("#" + gridid).jqGrid(options);
        jQuery("#" + gridid).jqGrid('navGrid', '#' + pagerid, { edit: false, add: false, del: false, refresh: false, search: false });
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption:"add",
            buttonicon: "ui-icon-plus",
            onClickButton: function () {
                switch (clevel) {
                    case "css":
                        cssEdit();
                        break;
                    case "style":
                        addstyleBuild("", "");
                        break;
                }
            }
        });
    }
    if (clevel == "style") {
        var wth = $("#StyleList").width();
        if (wth == 0) wth = 750;
        $("#" + gridid).setGridWidth(wth, true);
        $("#tbList1").find(".ui-icon.ui-icon-pencil").on("click", function () {
            var sname = $(this).closest("tr").find("td:nth-child(2)").text(),
                style = $(this).closest("tr").find("td:nth-child(3)").text();
            addstyleBuild(style, sname);
        });
    } 
}
var hlist = [];
function cssListGallery(dt,ctrtype) {
    cssListGallery.process = process;
    hlist = [], urllist = [];
    $(dt).each(function (i, k) {
        if (k.hasOwnProperty("htmlurl")) {
            urllist.push(k);
        }
    });
    if(urllist.length>0){
        $(urllist).each(function (i, k) {
            $.ajax({
                url: webserviceprefix+"/WebService.asmx/ReadData",
                data: { path: JSON.stringify(k.htmlurl) },
                contentType: "application/json; charset=utf-8",
                dataType: "JSON",
                success: function (data, status) {

                    if (data.d != "") {

                        var set = {};
                        set.code = k.code;
                        set.html = data.d;
                        hlist.push(set);

                    }
                    if (i == urllist.length - 1) {
                        cssListGallery.process(dt, ctrtype,hlist);
                    }
                }
            });
        });
    }
    else
        process(dt, ctrtype)
    function process(dt,ctrtype, hlist) {
        $("#sortable-css").remove();
        var perpage = 8;
        if ($("#dvCsscontain").parent().attr("id") == "Style") {
            var sty = "#sortable { list-style-type: none; margin: 0; padding: 0; width: 810px; }";
            sty += "#sortable li { margin: 3px 3px 3px 0; padding-right: 5px; float: left; width: 400px;height:450px}";//width: 245px;height:300px
            perpage = 2;
        }
        else {
            var sty = "#sortable { list-style-type: none; margin: 0; padding: 0; width: 1000px; }";
            sty += "#sortable li { margin: 3px 3px 3px 0; padding-right: 5px; float: left; width: 490px;height:450px}";//width: 245px;height:300px
        }
        sty += ".heading{margin-bottom:5px;background-color:#333333;padding:5px;border-bottom:solid 1px #BABABA;width:100%}";
        sty += ".heading span{color:white;white;font-size:14px;}";
        styleInsert("sortable-css", sty);

        $("#dvgallery").empty();
        var dv = $("<div id='main'/>"), ul = $("<ul id='sortable'/>"), li = $("<li/>");
        if (typeof ctrtype != "undefined" && ctrtype != "") {
            dt = $.grep(dt, function (a) {
                return a.domtype == ctrtype;
            });
            $("#sellisttype").val(ctrtype);
        }
        $(dt).each(function (i, k) {
            if (k.hasOwnProperty("domtype") && k.domtype != '') {
                var cssurl = k.cssurl;
                $("#domsample-css-" + k.name).remove();
                if (cssurl != "") {
                    cssInsert("domsample-css-" + k.name, cssurl);
                }
                else {
                    var css = cssattachcssname(k.cssscript, k.name);
                    CSSJSON.toHEAD(css, "domsample-css-" + k.name);
                }
                if (k.hasOwnProperty("htmlsample") && k.htmlsample != "")
                    contain = $(k.htmlsample);
                else if (k.hasOwnProperty("htmlurl") && k.htmlurl != "") {
                    //find sample html by url
                    var html;
                    $(hlist).each(function (a, b) {
                        if (b.code == k.code) {
                            html =b.html;
                            return false;
                        }
                    });
                    contain = $(html);
                }
                else
                    contain = sampledommake(k.domtype, k.domdetail);

                contain.addClass(k.name);
                contain.css({ margin: "5px 0 0 0"});//,transform:"scale(0.7,0.7) translate(-0px,-40px)"
                li = $("<li class='imdim' />");
                li.append(contain);
                li.prepend($("<div class='heading'>" +
                    "<span  code='" + k.code + "'><i class='fa fa-check fa-lg imdim'/>&nbsp;" + k.name + "</span><i style='float:right;margin:3px 3px 0 0;color:white' class='fa fa-pencil fa-lg imdim' code='" + k.code + "'/></div>"));
                ul.append(li);
            }
        });

        dv.append(ul);
        var pagenum = Math.ceil(dt.length / 6);
        if (pagenum > 10) pagenum = 10;
        var opt = {
            perPage: perpage
        , limitPagination: pagenum
            , containerClass: "panel-footer"
            // , insertAfter: "#sortable"
        };
        paginathing(ul, opt);
        $(ul.find("li>div")).each(function (i, k) {
            if ($(k).find("span").attr("code") == selcode)
                $(k).find("i").first().css({ color: "red" });
        })
       
        $("#dvgallery").append(dv);
        $(".heading").find("span").on("click", function () {
            $(".heading").find("i").css({ color: "white" });
            var code = $(this).attr("code");
            selectcss(code);
            $(this).find("i").css({ color: "red" });
        });
        $(".heading").find("i").on("click", function () {
            var code = $(this).attr("code");
            jsonReadAjax("imcsetting", "csslist", "code", code, cssEdit);
        });
    }
}
function localcssfind(code) {
    var css = $("#spcssdt").text(),rtn="";
    if (css != "") {
        var dt = JSON.parse(css);
        $(dt).each(function (i, k) {
            if (k.code == code) {
                rtn = k;
                return false;
            }
        })
    }
    return rtn;
}
function cssEdit(datasrc) {
    var sty = "textarea { -webkit-box-sizing: border-box;	-moz-box-sizing: border-box;box-sizing: border-box;width: 100%;}";
    styleInsert("stytextarea", sty);
    $('#dvName>label,#dvCrumbs>span').text("CSSEdit");
    var dt, clevel, code = "", title = "", desc = "", domtype = "", domdetail = "", stylelist = ""
        , cssscript = "", htmlsample = "", htmlurl = "", dvcontain = $("#dvCsscontain"), cssurl = "", archivesave = false;
    var cssset = "";
    if ($("#dvCsscontain").find("span").length > 0)
        cssset = $("#dvCsscontain").find("span").first().text();
    if ($("#dvCssedit").length == 0) $("<div id='dvCssedit'/>").insertAfter($("#dvCsscontain"));
    var dvedit = $("#dvCssedit");
    dvcontain.hide();
    dvedit.empty();
    dvedit.append($("<span>" + cssset + "</span>"));
    if (typeof datasrc != "undefined" && datasrc!="") {
        if (datasrc.hasOwnProperty("code")) code = datasrc.code;
        if (datasrc.hasOwnProperty("name")) title = datasrc.name;
        if (datasrc.hasOwnProperty("desc")) desc = datasrc.desc;
        if (datasrc.hasOwnProperty("domtype")) domtype = datasrc.domtype;
        if (datasrc.hasOwnProperty("domdetail")) domdetail = datasrc.domdetail;
        if (datasrc.hasOwnProperty("stylelist")) stylelist = datasrc.stylelist;
        if (datasrc.hasOwnProperty("cssscript")) cssscript = datasrc.cssscript;
        if (datasrc.hasOwnProperty("cssurl")) cssurl = datasrc.cssurl;
        if (datasrc.hasOwnProperty("htmlsample")) htmlsample = datasrc.htmlsample;
        if (datasrc.hasOwnProperty("htmlurl")) htmlurl = datasrc.htmlurl;
        if (datasrc.hasOwnProperty("archivesave")) archivesave = datasrc.archivesave;
    }
    //summary
    var tbsummary = $("<table width='100%'/>"), tr, td; dvedit.append(tbsummary);
    var domlist = "table;form; ul;button;div";
    $(["Title","Desc","DomType","Style List"]).each(function(i,k){
        tr = $("<tr/>"), td = $("<td style='vertical-align:top;width:120px'/><td style='vertical-align:top'/>");tbsummary.append(tr);    tr.append(td);
        td.first().append($("<label>"+k+"</label>"));
        switch(i){
            case 0:
                td.last().append($("<input style='width:100%' id='inpcssTitle'/><input style='display:none' id='inpcssCode'/><input style='display:none' id='inpcssdt'/>"));
                break;
            case 1:
                td.last().append($("<input style='width:100%' id='inpcssDesc'/>"));
                break;
            case 2:
                td.last().append($(makeCtr(["select", "select,;"+domlist, "seldomtype", "height:23px;margin-right:5px", "onchange:applydomtype($(this).val())"])+makeCtr(["input",,,"display:none",])));
                break;
        }
    });
    $("#inpcssCode").val(code);
    $("#inpcssTitle").val(title);
    $("#inpcssDesc").val(desc);
    $("#seldomtype").val(domtype);
    if ($.inArray(domtype, ["form"] > -1)) {
        $("#seldomtype").next().val(domdetail).show();
    }
    if(datasrc!="")
    $("#inpcssdt").val(JSON.stringify(datasrc));
    //tab
    var tabarr = {};
    if ($("#tab-css").length > 0) {
        $("#tab-css").remove();
    }
    tabarr.id = "tab-css";
    tabarr.head = ["StyleList", "CssScript", "Sample"];
    var content = [];
    //grid
    var gridid = "tbList1";
    var pagerid = "dvListpager1";
    var tbgrid = $("<table width='100%'/>"), tr, td;
    tr = $("<tr/>"), td = $("<td style='vertical-align:top;'/>"); tbgrid.append(tr); tr.append(td);
    td.append($("<div id='dvcsstojson' style='display:none'><div style='float:left'><label>Class List</label></div></div><div style='clear:both'/>"));
    td.append($("<table id='" + gridid + "'/>"));
    td.append($("<div id='" + pagerid + "' />"));
    tr = $("<tr/>"), td = $("<td/>");
    tr.append(td); tbgrid.append(tr);
    td.append($("<div style='margin-bottom:5px;'><span> or input css url...</span><input style='width:80%;margin-left:10px' id='inpcssurl'/></div>"));
     ///css script
    var tbcss = $("<table width='100%'/>"), tr1 = $("<tr/>"), td1 = $("<td/><td/><td/>");
    tbcss.append(tr1); tr1.append(td1);
    tbcss.find("td:nth-child(1)").append($("<div>JSON</div><textarea id='txjson' cols='45' rows='20'/>")).hide();
    tbcss.find("td:nth-child(2)").append($("<i title='Convert css script to style table' class='fa fa-arrow-circle-left fa-3x imdim'/>" +
        "<div style='height:10px'/><i title='Convert styles in table to CSS script'  class='fa fa-arrow-circle-right fa-3x imdim'/>")).hide();
    tbcss.find("td:nth-child(3)").append($("<div><i onclick=\"$(this).closest('td').prev().toggle();\" class='fa fa-caret-square-o-left imdim'/>&nbsp;CSS</div>" +
        "<textarea id='txcss' cols='90' rows='20'/>"));
    content.push(tbgrid.outerHTML());
    content.push(tbcss.outerHTML() + "");
    var samlink = "<span class='linkbtn' onclick='$(this).next().toggle();'><i class='fa fa-caret-square-o-down'/> html</span>"+
        "<div style='display:none;'><textarea id='txhtmlsample' rows='10' onblur=\"applydomtype('showsample')\"/>"+
        "<span> or html url...</span><input style='width:70%;height:25px;margin:3px' onblur=\"applydomtype('showsampleurl')\"/></div>";
    content.push(samlink+"<div id='dvdomsample' />");
    tabarr.content = content;
    var tab = makeTab(tabarr);
    dvedit.append(tab);
    //data update
   
    $("#txcss").val(cssscript);
    if (htmlsample != "") {
        $("#txhtmlsample").val(htmlsample);
        domtype = 'showsample';
    }
    else if (htmlurl != "") {
        $("#txhtmlsample").next().next().val(htmlurl);
        domtype = 'showsampleurl';
    }
        
    applydomtype(domtype);
    $("#inpcssurl").val(cssurl);
    if (cssscript == "" && stylelist != "") $("#txcss").val(tabletocss(stylelist));
    $(".fa-arrow-circle-right").on("click", function () {
        $("#txcss").val(tabletocss(stylelist));
    });
    $(".fa-arrow-circle-left").on("click", function () {
        var css = $("#txcss").val();
        var stylelist = csstotable(css);
        var cssdt = JSON.parse(addnewdt());
        cssdt.stylelist = stylelist;
        $("#inpcssdt").val(JSON.stringify(cssdt));
        var gridid = "tbList";
        var pagerid = "dvListpager";
        cssListGrid(stylelist, gridid, pagerid, "style")
    });
    //tabclick event
    var tabb = $('#' + tabarr.id);
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 2:
                    //domtype=$("#seldomtype").val();
                    //if(domtype!="")
                    applydomtype(domtype);
                    break;
            }
            var hp = ['css_stylelist', 'css_script', 'css_sample'];
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'css_stylelist');
    helpinsert();
    //button
    var btndv = $("<div style='text-align:right;padding:15px 0 10px 0'/>").appendTo(dvedit);
    btndv.append($("<input type='button' value='Save' onclick=\"savecss('" + code + "');\"/>"));
    //btndv.append($("<input type='button' value='List' onclick='cssListReturn()'/>"));
    btndv.append($("<input type='button' value='List' onclick=\"$('#dvCsscontain').show();$('#dvCssedit').remove();$('#dvName>label,#dvCrumbs>span').text('CSSList');\"/>"));
    if ($("#lbCtr").text() == "") {
        btndv.prepend($("<input type='button' value='Delete' onclick=\"confirmdel('" + code + "');\"/>"));
    }
    if ($("#lbCtr").text() != "" | $("#sparchive").text() != "") {
        var chkbx = $("<input id='cbarchivecss' type='checkbox'/>");
        var sparch = $("<span id='sparchivecss' style='display:none;'/>");
        var dialog = $("<i style='margin-right:10px;vertical-align:middle;' class='fa fa-caret-square-o-up fa-2x imdim'/>");
        btndv.prepend(dialog);
        btndv.append(sparch);
        btndv.prepend($("<label for='charchive'   style='margin-right:10px;'>Save to csslist</label>"));
        btndv.prepend(chkbx);
        if (archivesave) $("input:checkbox[id='cbarchivecss']").attr("checked", true);
        ardt = {};
        ardt.type = "css";
        ardt.code = code;
        ardt.name = title;
        ardt.desc = desc;
        sparch.text(JSON.stringify(ardt));
        chkbx.on("change", function () {
            
        });
        dialog.click(function () { archivepop(sparch); });
      
    }
    var ds1 = "";
    if (stylelist == "") {
        stylelist = [{ sname: "", style: "" }];
        ds1 = true;
    }
    cssListGrid(stylelist, gridid, pagerid, "style",datasrc);
    $("input:button").button();
    $("#btncsstotable").on("click", function () {
        var tb = $("<table width='100%'/>"), tr = $("<tr/>"), td = $("<td/><td/><td/><td/>");
        tb.append(tr); tr.append(td);
        tb.find("td:nth-child(1)").append($("<i class='fa fa-chevron-circle-right fa-2x imdim'/><div style='height:10px'/><i class='fa fa-chevron-circle-left fa-2x imdim'/>"));
        tb.find("td:nth-child(2)").append($("<div>JSON</div><textarea id='txjson1' cols='50' rows='20'/>"));
        tb.find("td:nth-child(3)").append($("<i class='fa fa-chevron-circle-right fa-2x imdim'/><div style='height:10px'/><i class='fa fa-chevron-circle-left fa-2x imdim'/>"));
        tb.find("td:nth-child(3)").append($("<div>CSS</div><textarea id='txcss1' cols='50' rows='20'/>"));
        tr = $("<tr/>"), td = $("<td colspan='3'>comment:<input  id='inpcomment1' style='width:90%'/></td>");
        tb.append(tr); tr.append(td);
        tb.dialog({
            height: 'auto'
            , width: 1000
            , modal: false
            , minHeight: 'auto'
            , title: "Css to Table Converter"
            , stack: false
            , close: function (event, ui) {
                $(this).dialog('destroy').remove();
            },
            buttons: [
                {
                    text: "Convert",
                    icons: {
                        primary: "ui-icon-check"
                    },
                    click: function () {
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
        $(".fa-chevron-circle-right").on("click", function () {
            var json = $("#txjson1").val();
            $("#inpcomment1").val(comment(json));
            if (json != "") json = JSON.parse(json);
            var css = CSSJSON.toCSS(json);
            $("#txcss1").val(css);
        });
        $(".fa-chevron-circle-left").on("click", function () {
            var css = $("#txcss1").val();
            $("#inpcomment1").val(comment(css));
            var json = CSSJSON.toJSON(css);
            $("#txjson1").val(JSON.stringify(json));
        });
    })
}
function comment(val) {
    val = val.replace("/*", "<!--").replace("*/", "-->");
    var dv = $("<div/>"); dv.html(val); var ss = dv.comments();
    return ss.html();
}
function csstotable(cssscript) {
    //css script to stylelist
    var json = CSSJSON.toJSON(cssscript);
    var snamelist=Object.keys(json.children),stylelist=[],set;
    
    $(snamelist).each(function(i,k){
        set={};
        set.sname = k;
        var list = "";
        var att=json.children[k].attributes;
       
        $(Object.keys(att)).each(function (a, b) {
            list+=b+":"+att[b]+";";
        });
        set.style=list;
        stylelist.push(set);
    })
    return stylelist;

}
function tabletocss(stylelist) {
   //stylelist table to css script
    var json={"children":{}, "attributes":{}};
    $(stylelist).each(function (i, k) {
        var sname = k.sname, sty = k.style, set = {};
        if (sty != "") sty = sty.split(";");
        $(sty).each(function (a, b) {
            if (b != "") {
                var aa = b.split(":");
                set[aa[0]] = aa[1];
            }
        });
        var ch = json.children;
        ch[sname] = {};
        ch[sname].children = {};
        ch[sname].attributes = set;

    });
   
    var css = CSSJSON.toCSS(json);
    return css;
}

function applydomtype(domtype) {
    var contain;
    $("#dvdomsample").empty();
    var cssurl=$("#inpcssurl").val();
    $("#domsample-css").remove();
    if (cssurl != "") {
        cssInsert("domsample-css", cssurl);
    }
    else {
        var css = cssattachcssname($("#txcss").val(), $("#inpcssTitle").val());
        CSSJSON.toHEAD(css, "domsample-css");
    }
    if (clientid != "") {
        formInit(clientid, {formsample:true});
        $("#dvdomsample").addClass($("#inpcssTitle").val());
    }
    else{
        contain = sampledommake(domtype);
        if (domtype != "showsampleurl" && typeof contain!="undefined") {
            contain.addClass($("#inpcssTitle").val());
            $("#dvdomsample").append(contain);
        }
    }
  
}
function sampledommake(domtype,domscheme){
    var contain;
    switch (domtype) {
        case "table":
            var tb = $("<table width='100%'/>"), tr = $("<tr/>"), td = $("<td/>");
            var data = [
              [makeCtr(["span", "Option", , "width:150px", ]), makeCtr(["span", "Value", , "width:150px", ])]//headers
             , ["widget", makeCtr(["select", "Tab;None", "selwidget", "inp", ""])]
             , ["show num", makeCtr(["input:number:1", "", "selshownum", "text-align:right;padding:0", ""])]
             , ["css", makeCtr(["select", "select,;normal;italic;inherit;initial;oblique", "selstyle", "inp", ""])]
             , ["layout", makeCtr(["input:color", "", "inpcolor", "width:150px", ""])]
            ];
            var tb = makeTable("tes34", data, "general1");
            var foot = ['<input type="button" class="btnRoundsmall" style="padding:0 3px 0 3px;"/>|{"colspan":"2","style":"text-align:right;padding:5px;"}'];
            contain = appendFooter(tb, foot);
          
            break;
        case "form":
            var fm;
            switch (domscheme) {
                default:
                    fm = $("<form><h1>HeadLine</h2><label><span>name</span><input /></label></form>");
                    break;
                case "<input/>":
                    fm = $("<form><h1>HeadLine</h2><input placeholder='name'/></form>");
                    break;
            }
            contain = $(fm);
            break;
        case "ul":
            contain= $("<ul/>"); list = ["News", "Things", "Staff"];
            $(list).each(function (i, k) {
                var li = $("<li>" + k + "</li>");
                contain.append(li);
            });
            break;
        case "showsample":
            var sam = $("#txhtmlsample");
            sam.parent().hide();
            contain=$(sam.val());
            break;
        case "showsampleurl":
            var sam = $("#txhtmlsample"), url = sam.next().next().val();
            $.ajax({
                url: webserviceprefix+"/WebService.asmx/ReadData",
                data: { path: JSON.stringify( url) },
                contentType: "application/json; charset=utf-8",
                dataType: "JSON",
                success: function (data, status) {
                    if (data.d != "") {
                        sam.parent().hide();
                        contain = $(data.d);
                        contain.addClass($("#inpcssTitle").val());
                        $("#dvdomsample").append(contain);
                    }
                }
            });
            break;
    }
    return contain;
}
function toggleshow(type) {
    switch (type) {
        case "direct input":
            $($("#inpcssurl").parent()).hide();
            $("#gbox_tbList").show();
            break;
        case "css link":
            $($("#inpcssurl").parent()).show();
            $("#gbox_tbList").hide();
            break;
    }
}
function confirmdel(code) {
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
            delcss(code);
        }
    });

}

function delcss(code) {
    jsonDelAjax("imcsetting", "csslist", "code", code, cssList);
    var cssdt = selectimc("imcsetting", "csslist");
    $(cssdt).each(function (i, k) {
        if (k.code == code) {
            cssdt.splice(i, 1);
        }
    });
    imcsetting("imcsetting", "csslist", JSON.stringify(cssdt));
}
function delstyle(code, sname) {
    var cssdt = $("#inpcssdt").val();

    if (cssdt == "") cssdt = {};
    else cssdt = JSON.parse(cssdt);
    $(cssdt.stylelist).each(function (i, k) { 
        if (k.sname == sname)
            cssdt.stylelist.splice(i, 1);
    });
    $("#inpcssdt").val(JSON.stringify(cssdt));
    var gridid = "tbList";
    var pagerid = "dvListpager";
    $("#txcss").val(tabletocss(cssdt.stylelist));
    cssListGrid(cssdt.stylelist, gridid, pagerid, "style");
    //var chk = { override: false };
    //var ctr = selectimctable(menuid, subid, clientid);
    //if (ctr.hasOwnProperty("cssoverride")) {
    //    var overr = ctr.cssoverride;
    //    $(overr).each(function (i, k) {
    //        if (k.sname == sname) {
    //            chk.override = true;
    //        }
    //    });
    //}
    //if (clientid != "" && !chk.override) {
    //    txt = "Cannot delete!";
    //    swal({
    //        title: "<span style='color:#F8BB86;font-style:normal;'>Error!<span>"
    //       , text: txt
    //       , timer: 1500
    //       , showConfirmButton: false
    //       , html: true
    //    });
    //}
    //else {
    //    if (chk.override) {
    //        txt = "Return to original setting";
    //    }
    //    else
    //        txt = "You will not be able to recover this file!";
    //    swal({
    //        title: "Are you sure?"
    //        , text:txt
    //        , type: "warning"
    //        , showCancelButton: true
    //        , confirmButtonColor: "#DD6B55"
    //        , confirmButtonText: "Yes, delete it!"
    //        , cancelButtonText: "No, never!"
    //        , closeOnConfirm: true
    //        , closeOnCancel: true
    //    },
    //    function (isConfirm) {
    //        if (isConfirm) {
    //            var cssdt = selectimc("imcsetting", "csslist");
    //            var sty = "";
    //            $(cssdt).each(function (i, k) {
    //                if (k.code == code) {
    //                    sty = k.stylelist;
    //                }
    //            });
    //            if (chk.override) {
    //                var ll = selectimctable(menuid, subid, clientid);
    //                $(ll.cssoverride).each(function (i, k) {
    //                    if (k.sname == sname)
    //                        ll.cssoverride.splice(i, 1);
    //                });
    //                //if(ll.cssoverride.length==0)
    //                //delete ll.cssoverride;
    //                updateimctable(menuid, subid, clientid, ll);
    //            }
    //            else {
    //                $(sty).each(function (j, l) {
    //                    if(l.sname==sname)
    //                    sty.splice(j, 1);
    //                });
    //                imcsetting("imcsetting", "csslist", JSON.stringify(cssdt));
    //            }
    //            var gridid = "tbList";
    //            var pagerid = "dvListpager";

    //            var styl = savestyle();
    //            if (styl == "") styl = [{ sname: "", sdesc: "", style: "" }];
    //            cssListGrid(styl, gridid, pagerid, "style");
    //        }
    //    });
    //}
}
function savecss(code) {
    savecss.reloadcssslist = reloadcsslist;
    var cssdt = $("#inpcssdt").val();
    if (cssdt == "" | typeof cssdt == "undefined") cssdt = {};
    else cssdt = JSON.parse(cssdt);
    var styl = [];
    if (code == "" | typeof code == "undefined")
        cssdt.code = "cs" + idMake();
    cssdt.name = $("#inpcssTitle").val();
    cssdt.desc = $("#inpcssDesc").val()
    cssdt.domtype = $("#seldomtype").val();
    if ($("#seldomtype").next().css("display")!="none")
    cssdt.domdetail = $("#seldomtype").next().val();
    cssdt.cssscript = $("#txcss").val();
    cssdt.cssurl = $("#inpcssurl").val();
    if ($("#lbCtr") != null && $("#lbCtr").text() != "") {
        var ctr = selectimctable(menuid, subid, $("#lbCtr").text());
        updateimctable(menuid, subid, $("#lbCtr").text(), replacecss(ctr, cssdt));
        if ($("#dvCsscontain").find("span").length > 0)
            $("#dvCsscontain").find("span").first().text(JSON.stringify({ "css": cssdt }));
        sweetmsgautoclose("Success!", "Applied as css.")
    }
    else {
        if ($("#sparchive") != null && $("#sparchive").text() != "" && $("#dvCsscontain").find("span").length > 0) {
            $("#dvCsscontain").find("span").first().text(JSON.stringify({ "css": cssdt }));
            sweetmsgautoclose("Success!", "Applied as css.")
        }
        else {
            if ($("#txhtmlsample").val() != "")
                cssdt.htmlsample = $("#txhtmlsample").val();
            else
                delete cssdt.htmlsample;
            if ($("#txhtmlsample").next().next().val() != "")
                cssdt.htmlurl = $("#txhtmlsample").next().next().val();
            else
                delete cssdt.htmlurl;
            jsonUpdateAjax("imcsetting", "csslist", JSON.stringify(cssdt), "code", cssdt.code, reloadcsslist);
        }
    }
   
    //save css to csslist
    if ($("#cbarchivecss").is(":checked")) {
        var ardt = JSON.parse($("#sparchivecss").text());
        var cssdt = JSON.parse($("#inpcssdt").val());
        cssdt.code = ardt.code;
        cssdt.name = ardt.name;
        cssdt.desc = ardt.desc;
        //updateimc("imcsetting", "csslist", cssdt, "code", ardt.code);
        jsonUpdateAjax("imcsetting", "csslist", cssdt, "code", cssdt.code);
    }

    function replacecss(ctr, cssdt) {
        ctr.css = cssdt;
        if (ctr.hasOwnProperty("csscode")) {
            delete ctr.csscode;
        }
        return ctr;
    }
    function reloadcsslist(dt) {
        if (dt != null && dt.hasOwnProperty("csslist"))
            cssList(dt.csslist);
    }
}

function selectcss(code) {
    selectcss.selectajax = selectajax;
    selectcss.deletecss = deletecss;
    jsonReadAjax("imcsetting", "csslist", "code", code, selectcss.selectajax,[code]);
    function selectajax(cssdt, csscode) {
        var txt, title;
        if (cssdt == "") {
            txt = "No css data!";
            title = "Fail!";
            sweetmsg(title, txt);
            return false;
        }
        selcode = csscode;
        txt = "Applies as css style";
        title = "Success!";
        sweetmsgautoclose(title, txt);

        if ($("#lbCtr").text() != "") {
            var ctr = selectimctable(menuid, subid, $("#lbCtr").text());
            ctr.csscode = csscode;
            delete ctr.css;
            updateimctable(menuid, subid, $("#lbCtr").text(), ctr);
            if ($("#dvCsscontain").find("span").length > 0)
                $("#dvCsscontain").find("span").first().text(JSON.stringify({ "csscode": csscode }));
            $($("#tbList").find("tr")).each(function (i, k) {
                if ($(k).find("td:nth-child(3)").text() == csscode) {
                    $(k).find("td>i").first().css({ "color": "red" });
                }
                else
                    $(k).find("td>i").first().css({ "color": "#808080" });
            })
        }
        else if ($("#sparchive").text() != "") {
            var ardt = JSON.parse($("#sparchive").text());
            jsonReadAjax("imclist", ardt.type, "code", ardt.code, selectcss.deletecss, [csscode]);
        }
    }
    function deletecss(ctr,csscode){
        ctr.csscode = csscode;
        if (ctr.hasOwnProperty("css")) {
            delete ctr.css;
        }
        jsonUpdateAjax("imclist", ctr.type, JSON.stringify(ctr), "code", ctr.code);
        if ($("#dvCsscontain").find("span").length > 0)
            $("#dvCsscontain").find("span").first().text(JSON.stringify({ "csscode": csscode }));
        jsonReadAjax("imcsetting", "csslist", "", "", cssList);
    }
}

function selectcssajax(cssdt, csscode) {
    var txt, title;//,cssdt = selectimc("imcsetting", "csslist", "code", code);
    if (cssdt == "") {
        txt = "No css data!";
        title = "Fail!";
        sweetmsg(title, txt);
        return false;
    }
    // cssEdit(cssdt);
    selcode = csscode;
    txt = "Applies as css style";
    title = "Success!";
    sweetmsgautoclose(title, txt);

    if ($("#lbCtr").text() != "") {
        var ctr = selectimctable(menuid, subid, $("#lbCtr").text());
        ctr.csscode = csscode;
        delete ctr.css;
        updateimctable(menuid, subid, $("#lbCtr").text(), ctr);
        jsonReadAjax("imcsetting", "csslist", "", "", cssList);
    }
    else if ($("#sparchive").text() != "") {
        var ardt = JSON.parse($("#sparchive").text());
        //var ctr = selectimc("imclist", "", "code", ardt.code);
        jsonReadAjax("imclist", ardt.type, "code", ardt.code, selectcss.deletecss, [csscode]);

    }


}
function combinecss(list) {
    var over = "",styl="";
    var rtn = list;

    if (clientid != "") {
        if (list.hasOwnProperty("stylelist")) {
            styl = list.stylelist;
            var ns = [];
            $(styl).each(function (i, k) {
                    k.type = "";
                    ns.push(k);
            });
            styl = ns;
        }
        rtn = list;
        var ctr = selectimctable(menuid, subid, clientid);
        if (typeof ctr !="undefined" && ctr.hasOwnProperty("cssoverride"))
            over = ctr.cssoverride;
        if (over != "") {
            //1. styl & over: update styl with over
            var stylid = [], overid = [], sameid = [], finalarr = [];
            $(styl).each(function (i, k) {
                stylid.push(k.sname);
            })
            $(over).each(function (i, k) {
                overid.push(k.sname);
                k.type = "Override";
                finalarr.unshift(k);
            })

            //2. over: new insert over
            var diff2 = $(stylid).not(overid).get();
            $(styl).each(function (i, k) {
                if ($.inArray(k.sname, diff2) > -1) {
                    k.type = "";
                    finalarr.unshift(k);
                }
            });
            list.stylelist = finalarr;
            rtn = list;
        }
    }
    return rtn;
}
function makeselStylelist(ctrid) {

    var ctr = selectimctable(menuid, subid, ctrid);
    if (typeof ctr == "undefined") return false;
    var csscode = '',list,rtn=[];
    if (ctr.hasOwnProperty("csscode")) { csscode = ctr.csscode; }
    if (csscode != "") {
        clientid = ctrid;
        var clist = selectimc("imcsetting", "csslist");
        $(clist).each(function (i, k) {
            if (k.code == csscode) {
                list = combinecss(k).stylelist;
                return false;
            }
        })
    }
    $(list).each(function (i, k) {
        var name = k.sname;
        switch (k.stype) {
            case "class":
                name ="."+name;
                break;
            case "id":
                name = "#" + name;
                break;
        }
        rtn.push(name+","+name);
    });

    if (typeof placeholder == "undefined") placeholder = "select";
    rtn.unshift("select,");

    clientid = "";
    return rtn.join(';');

}

function styleBuild(style, showtext) {
    //showtext:true/false, right side script textarea
    var sty = "#dvcodechg{display:none;float:right;text-align:center;vertical-align:middle;padding:10px;border:solid 1px gray;width:150px;height:80px;position:absolute;left:250px;top:50px;background-color:white;}";
    sty += "textarea#txStyle {margin:0 0px 0 5px; height:auto;line-height:1.5;padding:15px 15px 30px; border-radius:3px;" +
        "border:1px solid #F7E98D;font:13px Tahoma;}";
    styleInsert("stytext", sty);
    $("#dvStyle").remove();
    var dia = $("<div id='dvStyle'/>");
    var kup = "onchange:codechg('forward');onkeyup:codechg('forward')";
    var chg = "onchange:codechg('forward')";
    var kup1 = "onkeyup:codechg('forward')"
    var css1 = "margin:0 0 0 3px;height:23px";
    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
       , ["font-family", makeCtr(["select", "select,;dotum;malgun gothic,malgun_gothic;gulim;gothic;Helvetica;Verdana;sans-serif;Times New Roman,Times_New_Roman;Palatino;Bookman;serif", "selfontfamily", "inp", chg])]
       , ["font-size", makeCtr(["input:number:0.1", "", "selfontsize", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["font-style", makeCtr(["select", "select,;normal;italic;inherit;initial;oblique", "selstyle", "inp", chg])]
       , ["color", makeCtr(["input:color", "", "inpcolor", "width:150px", chg])]
        , ["display", makeCtr(["select", "select,;inline;block;none", "seldisplay", "inp", chg])]
        , ["visibility", makeCtr(["select", "select,;visible;hidden;collapse", "selvisibility", "inp", chg])]
      
       , [makeCtr_img("inppadding", 4) + "padding", makeCtr(["input", "", "inppadding", "width:100px", kup1]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["padding-top", makeCtr(["input:number", "", "inppaddingtop", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["padding-right", makeCtr(["input:number", "", "inppaddingright", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["padding-bottom", makeCtr(["input:number", "", "inppaddingbottom", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["padding-left", makeCtr(["input:number", "", "inppaddingleft", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , [makeCtr_img("inpmargin", 4) + "margin", makeCtr(["input", "", "inpmargin", "width:100px", kup1]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["margin-top", makeCtr(["input:number", "", "inpmargintop", "text-align:right", kup]) + +makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["margin-right", makeCtr(["input:number", "", "inpmarginright", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["margin-bottom", makeCtr(["input:number", "", "inpmarginbottom", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["margin-left", makeCtr(["input:number", "", "inpmarginleft", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["background-color", makeCtr(["input:color", "", "inpbackgroundcolor", "width:50px", "onkeyup:codechg('forward');onchange:codechg('forward')"])]
       , [makeCtr_img("inpheight", 2) + "height", makeCtr(["input:number", "", "inpheight", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["min-height", makeCtr(["input:number", "", "inpminheight", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["max-height", makeCtr(["input:number", "", "inpmaxheight", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , [makeCtr_img("inpwidth", 2) + "width", makeCtr(["input:number", "", "inpwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["min-width", makeCtr(["input:number", "", "inpminwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["max-width", makeCtr(["input:number", "", "inpmaxwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["vertical-align", makeCtr(["select", "select,;top;middle;bottom", "selverticalalign", "inp", chg])]
       , ["horizontal-align", makeCtr(["select", "select,;left;center;right", "selhorizontalalign", "inp", chg])]
       , ["text-align", makeCtr(["select", "select,;left;center;right", "seltextalign", "inp", chg])]
       , [makeCtr_img("inpborder", 7) + "border", makeCtr(["input", "", "inpborder", "width:100px", kup1])]
       , ["border-style", makeCtr(["select", "select,;none;hidden;dotted;dashed;solid;double;groove;ridge;inset;outset;initial;inherit", "selborderstyle", "inp", chg])]
       , ["border-width", makeCtr(["input:number", "", "inpborderwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["border-color", makeCtr(["input:color", "", "inpbordercolor", "width:50px", chg])]
       , [makeCtr_img("inpbordertop", 3) + "border-top", makeCtr(["input", "", "inpbordertop", "text-align:right", kup1])]
       , ["border-top-style", makeCtr(["select", "select,;none;hidden;dotted;dashed;solid;double;groove;ridge;inset;outset;initial;inherit", "selbordertopstyle", "inp", chg])]
       , ["border-top-width", makeCtr(["input:number", "", "inpbordertopwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["border-top-color", makeCtr(["input:color", "", "inpbordertopcolor", "width:50px", chg])]
       , [makeCtr_img("inpborderright", 3) + "border-right", makeCtr(["input", "", "inpborderright", "text-align:right", kup1])]
       , ["border-right-style", makeCtr(["select", "select,;none;hidden;dotted;dashed;solid;double;groove;ridge;inset;outset;initial;inherit", "selborderrightstyle", "inp", chg])]
       , ["border-right-width", makeCtr(["input:number", "", "inpborderrightwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["border-right-color", makeCtr(["input:color", "", "inpborderrightcolor", "width:50px", kup1])]
       , [makeCtr_img("inpborderbottom", 3) + "border-bottom", makeCtr(["input", "", "inpborderbottom", "text-align:right", kup1])]
       , ["border-bottom-style", makeCtr(["select", "select,;none;hidden;dotted;dashed;solid;double;groove;ridge;inset;outset;initial;inherit", "selborderbottomstyle", "inp", chg])]
       , ["border-bottom-width", makeCtr(["input:number", "", "inpborderbottomwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["border-bottom-color", makeCtr(["input:color", "", "inpborderbottomcolor", "width:50px", chg])]
       , [makeCtr_img("inpborderleft", 3) + "border-left", makeCtr(["input", "", "inpborderleft", "text-align:right", kup1])]
       , ["border-left-style", makeCtr(["select", "select,;none;hidden;dotted;dashed;solid;double;groove;ridge;inset;outset;initial;inherit", "selborderleftstyle", "inp", chg])]
       , ["border-left-width", makeCtr(["input:number", "", "inpborderleftwidth", "text-align:right", kup]) + makeCtr(["select", "px;em;%", "", "margin:0 0 0 3px;height:23px", chg])]
       , ["border-left-color", makeCtr(["input:color", "", "inpborderleftcolor", "width:50px", chg])]
    ];
    var tb = makeTable("tes3", data, "general");
    //var foot = ['<input type="button" class="btnRoundsmall" value="save as css" onclick="savecss()" style="padding:0 3px 0 3px;" id="btnSavecss"/>|{"colspan":"2","style":"text-align:right;padding:5px;"}'];
    //var tb1 = appendFooter(tb, foot);

    var ttb = $("<table cellpadding='1' style='width:100%'/>");
    var tr = $("<tr />");
    var td = $("<td rowspan='2' style='width:45%;vertical-align:top;' />");
    ttb.append(tr);
    tr.append(td);
    td.append($("<div><label>Style:</label><div style='float:right;padding:0 10px 0 0;'><i style='color:#FF0087' onmouseover=\"$('#dvcodechg').show()\"  class='fa fa-retweet imbtn'/></div><div>"));
    td.append($("<div  id='dvcodechg' class='roundbox1'  onmouseenter=\"$('#dvcodechg').show()\" onmouseleave=\"$('#dvcodechg').hide()\" >" +
        "<button style='margin-bottom:5px;'>Table<i onclick=\"codechg('forward');$('#dvcodechg').hide();\" style='margin:0 5px 0 5px;' class='fa fa-arrow-right'>&nbsp;Script</i></button>" +
        "<button>Table<i onclick=\"codechg('backward');$('#dvcodechg').hide();\" style='margin:0 5px 0 5px;' class='fa fa-arrow-left'>&nbsp;Script</i></button></div>"));
    td.append(tb);
    if (showtext) {
        td = $("<td style='vertical-align:top;' />");
        td.append($("<div><label>Css Script:</label></div>"));
        td.append($("<textarea rows='13' cols='50' onkeyup=\"codechg('backward');\" id='txStyle' />"));
        tr.append(td);
    }
    //css applied sample

    tr = $("<tr />");
    td = $("<td style='vertical-align:top;'/>");
  
    td.append($("<label>Sample:</label>"));
    var dv= $("<div style='border:solid 1px #F7E98D;width:100%'/>");
    //dv.append($("<div id='dvsamplestyle'>sample area/>"));
    td.append(dv);
    tr.append(td);
    ttb.append(tr);

    dia.append(ttb);

    return dia;
}
function styleBuildInline(style) {
   // var style=$("#inpstyle").val();
    var dia = styleBuild(style,true);
    dia.dialog({
        autoOpen: true,
        modal: true,
        height: "auto",
        resize: "auto",
        width: 800,
        title: "Style Edit",
        close: function (event, ui) {
            $(this).dialog('destroy').remove();
        },
        buttons: [
            {
                text: "Apply",
                click: function () {
                    $("#inpstyle").val($("#txStyle").val());
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
    dia.parent().css("z-index", 10000);
    dia.css("margin-top", "20px");

    $("#txStyle").val(style);
    $("#txStyle").css("width", "95%");
    codechg('backward'); codechg('forward');
    runAfterTableCreate('tes3');
}
function addnewdt() {
    var code = $("#inpcssCode").val();
    var cssdt = $("#inpcssdt").val();
    if (code == "") {
        cssdt = {};
        cssdt.code = "cs" + idMake();
        cssdt.name = $("#inpcssTitle").val();
        cssdt.desc = $("#inpcssDesc").val();
        cssdt.domtype = $("#seldomtype").val();
        cssdt.cssscript = $("#txcss").val();
        cssdt.stylelist = [];
        code = cssdt.code;
        cssdt = JSON.stringify(cssdt);
    }
    return cssdt;
}
function addstyleBuild(style, title) {
    //cssList 부속파일
    var singleload = false;
    var code = $("#inpcssCode").val();
    var cssdt = addnewdt();
    
    var dvcss = $("#dvCssedit").parent().attr("id");
    var dvcontain = $("#dvCssedit");
    cssset = "";
    if ($("#dvCssedit").find("span").length > 0)
        cssset = $("#dvCssedit").find("span").first().text();

    dvcontain.empty();
    dvcontain.append($("<span>" + cssset + "</span>"));
  
    var dv = $("<div id='dvCss'/>");
    dvcontain.append(dv);
    singleload = true;
    var gridid = "tbList";
    var pagerid = "dvListpager";
    var dv = styleBuild(style, true);
    dv.css("margin-top", "20px");
    $("#dvCss").prepend(dv);
    runAfterTableCreate('tes3');
    var sty = [], sty1 = "";
    if (style != "" && typeof style !="undefined"){
        sty1 = style.split(";");
    $(sty1).each(function (i, k) {
        if (k != "")
            sty.push(k + ";");
    });
    
    $("#txStyle").val(sty.join("\n"));
    }
    $("#txStyle").css("width", "95%");
   
    dv.prepend($("<div style='margin-bottom:10px;display:none'><span style='width:100px;margin-right:47px;'><label>Desc:</label></span><input style='width:85%' id='inpstyDesc'/> </div>"));
    dv.prepend($("<div style='margin-bottom:5px;'><span style='width:100px;margin-right:50px'><label>Name:</label></span><input style='width:85%' id='inpstyTitle'/><input style='display:none' id='inpstyCode'/> </div>"));
   
    $("#inpstyTitle").val(title);
    $("#inpstyCode").val(title);

    var cid = "";
    if (dvcss != "") cid = "#" + dvcss;
    if (cid != "") {
        $("#dvCss").find("div").last().remove();
        $(cid).append($("#dvCssedit"));

        var btndv = $("<div style='text-align:right;padding:15px 0 10px 0'/>").appendTo(dv);
        btndv.append($("<input type='button' value='Save' />"));
        btndv.append($("<input type='button' value='Cancel'/>"));
    }
    $("#inpstyTitle").on("keyup", function () {
        var title= "<span style='color:#F8BB86'>Error<span>";
        var body= "You can't use number as first character!!";
        var firstchar=$(this).val().substring(0, 1);
        if ($.isNumeric(firstchar)) {
            sweetmsg(title, body);
            var val=$(this).val();
            $(this).val(val.replace(firstchar,""));
        }
    })
    $("input:button").button();
    $("input[value='Save']").on("click", function () {
        styleBuildSave(code,  cssdt);
    });
    $("input[value='Cancel']").on("click", function () {
        if (cssdt != "" && typeof cssdt != "undefined")
            cssdt = JSON.parse(cssdt);
       

        cssEdit(cssdt);
    });

    codechg('backward');// codechg('forward');
}
function styleBuildSave(code, cssdt) {
    if (cssdt != "" && typeof cssdt != "undefined")
        cssdt = JSON.parse(cssdt);
    
    cssdt.stylelist = makestyle(cssdt.stylelist);
    var cssscript = tabletocss(cssdt.stylelist);
    cssdt.cssscript = cssscript;
    cssEdit(cssdt);
    setTimeout(function () {
        $("#txcss").val(cssscript);
    }, 1000);
    function makestyle(ss) {
        var chkexist = false;
        var stylesave = styleTableSave("tes3", true);
        var stylescript = $.trim($("#txStyle").val()).replace(/[\n\r]/g, '');
        $(ss).each(function (i, k) {
            if (k.sname == $("#inpstyCode").val())
                chkexist = true;
        });
        if ($("#inpstyCode").val() == "" | !chkexist)
            ss.push({ sname: $("#inpstyTitle").val(), style: stylescript })
        else
            $(ss).each(function (j, l) {
                if (l.sname == $("#inpstyCode").val()) {
                    l.sname = $("#inpstyTitle").val();
                    l.style  = stylescript;
                }
            });
        return ss
    }   
}
function codechg(type) {
    switch (type) {
        case "forward":
            var script = "", lastfix = "",newsc=[];
            var sc = saveTable("tes3", true);
            $(sc).each(function (i, k) {
                if (k[1] != "")
                    newsc.push(k);
            });
            $(newsc).each(function (i, k) {
                lastfix = "";
                if (k != "" ) {
                    if (typeof k[2] != "undefined") lastfix = k[2];
                    if (k[1].toUpperCase() != "#FFFFFE")//prevent input:color display as black(#00000)
                        script += k[0] + ":" + k[1].replace("_"," ") + lastfix + ";\n";
                }
            })
            $("#txStyle").val(script);
            break;
        case "backward":
            var sty = $("#txStyle").val();
            if (typeof sty!="undefined" && sty != "") {
                var newsty = [];
                sty = sty.split(';');

                $(sty).each(function (i, k) {
                    if (k != "" && k.indexOf(":")>-1) {
                        var ssty = k.replace(/<br>|<BR>/g, "").replace("\n", "");
                        ssty = ssty.split(':');
                        var last = checklast(ssty[1]);
                        if (last != "")
                            newsty.push([$.trim(ssty[0]), ssty[1].replace(" ", "_").replace(last, ""), last]);
                        else
                            newsty.push([$.trim(ssty[0]), ssty[1].replace(" ", "_")]);
                    }
                })
                if (newsty.length > 0)
                    updateStyle("tes3", newsty);
            }
            break;
    }
    function checklast(val) {
        var rtn="";
        var chk1 = val.match(/px$/);
        var chk2 = val.match(/em$/);
        var chk3 = val.match(/%$/);
        if (chk1 != null) rtn = chk1[0];
        if (chk2 != null) rtn = chk2[0];
        if (chk3 != null) rtn = chk3[0];
        return rtn;
    }
    var cname = $("#inpstyTitle").val();
    if ($("#dvsamplestyle").length <= 0);
    $("#dvStyle").find("table td").last().find("div").append($("<div id='dvsamplestyle'>sample area</div>"));
    if (typeof cname!="undefined" && cname.length>0 && cname.substr(0, 1) != "." && cname.substr(0, 1) != "#")
$("#dvsamplestyle").append($("<"+cname+"/>")).attr("style", $("#txStyle").val());
    else
    $("#dvsamplestyle").attr("style", $("#txStyle").val());
}
function updateStyle(tbid, stylearray) {
    var tr = $("#" + tbid).find("tbody").children();
    $(tr).each(function (i, k) {
        var styleval = findval($($(k).children()[0]).text());
        if (styleval.length > 0) {
            var td2 = $(k).children()[1];
            var ctr1 = $(td2).children();
            $(ctr1[0]).val(styleval[0]);
            if (styleval.length > 1)
                $(ctr1[1]).val(styleval[1]);
        }
    });
    function findval(stylename) {
        var rtn = [];
        $(stylearray).each(function (i, k) {
            if (k[0] == stylename) {
                rtn.push(k[1]);
                if (k.length > 2)
                    rtn = [k[1], k[2]];
            }
        });
        return rtn;
    }
}
function styleTableSave(id, removeblank) {
    var sc = saveTable(id, true,false);
    var sty = "";
    $(sc).each(function (i, k) {
        var lastfix = "";
        if (typeof k[2] != "undefined") lastfix = k[2];
        //if (typeof k[1]!="null" && k[1].toUpperCase() != "#FFFFFE" && k[1]!="")//prevent input:color display as black(#00000)
        //    sty += k[0] + ":" + k[1] + lastfix + ";";
    });
    return sty;
}


function trstyleInsert(option) {
    //select class from control, if no css assigned, show css stylebuilder for style creation
    //option(ctrid,ctrtype,style)
    var rtn = "", cssover = "", ctrid = "", type = "", style = "", slist = [], clas = "", disp1 = "", disp2 = "";
    rtn += "<i style='margin-right:5px;padding:4px;color:white;background-color:#797979'"+
        "class='fa fa-refresh imdim roundbutton' onclick=\"$('#spinput').toggle();$('#selcss').toggle();\"/>";
    var dv = $("<div/>");
    if (typeof option != "undefined") {
        if (option.hasOwnProperty("class")) clas = option.class;
        if (option.hasOwnProperty("ctrid")) ctrid = option.ctrid;
        if (option.hasOwnProperty("style")) style = option.style;
        if (option.hasOwnProperty("ctrid")) {
            switch (option.type) {
                case "formlist":
                    var flist = localStorage.getItem("formlist");
                    if (flist != "") {
                        flist = JSON.parse(flist);
                        var dt = $.grep(flist, function (a) {
                            return a.code == option.ctrid;
                        });
                        if (dt.hasOwnProperty("cssoverride")) {
                            cssover = dt.cssoverride;
                        }
                    }
                    break;
                default:
                    var dt = selectimctable(menuid, subid, option.ctrid);
                    if (typeof dt!="undefined" && dt.hasOwnProperty("cssoverride")) {
                        cssover = dt.cssoverride;
                    }
                    break;
            }
            if (cssover != "") {
                $(cssover).each(function (i, k) {
                    var val = k.sname;
                    if (k.sname == clas) val += ",,selected:true";
                    slist.push(val);
                });
                if (style != "") disp2 = "display:none";
                rtn += makeCtr(["select", "Select style,;" + slist.join(';'), "selcss", "height:25px;"+disp2, ""]);
            }
        }
        if (style == "" && ctrid != "") disp2 = "style=display:none";
        var val = "";
        if (style != "") val = "value='"+style+"'";
        rtn += "<span id='spinput' " + disp2 + "><input id='inpstyle' "+val+" style='width:620px'/>";
        rtn += "<i style='margin:0 2px 0 5px;padding:4px;color:#800000' onclick=\"styleBuildInline($('#inpstyle').val())\" class='fa fa-magic roundbutton imbtn'></i><span>";
    }
    return rtn;
}

//#endregion

//#region event
var eventparam = {};
function eventInit(id, param) {
    eventparam = {};
    var control = selectimctable(menuid, subid, id), event;
    var sub = selectimctable(menuid, subid);
    if (typeof control != "undefined" && control.hasOwnProperty("event")) {
        event = control.event;
        switch (event.page) {
            case "other":
                var url = $(location).attr('pathname');
                var para = $(location).attr('search');
                url += replaceparam(para, event.value, param);
                window.history.replaceState('sss', 'Title', url);
                subid = event.applyto;
                initDisplay();
                break;
            case "current":
                eventparam[event.value] = param;
                if (event.hasOwnProperty("applyto")) {
                    $.each(event.applyto, function (i, k) {
                        if (k != "" && k.hasOwnProperty("control")) {
                            var dvid = k.control;
                            switch (controltype(sub, dvid)) {
                                case "Grid":
                                    jqgridInit(dvid);
                                    break;
                                case "Chart":
                                    googlechartInit(dvid);
                                    break;
                                case "Select":
                                    selectInit(dvid);
                                    break;
                                case "Tree":
                                    jstreeInit(dvid);
                                    break;
                            }
                        }
                    });

                }
                break;
        }
    }
    function replaceparam(paramall, pname, pvalue) {
        var rtn = "";
        if (paramall.indexOf(pname) > -1) {
            $.each(paramall.split('&'), function (i, k) {
                var p = k.split('=');
                if (p[0] == pname)
                    rtn += "&" + p[0] + "=" + pvalue;
                else if (p[0] == "?" + pname)
                    rtn += p[0] + "=" + pvalue;
                else if (k.length > 0 && k.substring(0, 1) == "?")
                    rtn += k;
                else
                    rtn += "&" + k;
            });
        }
        return rtn;
    }
    function controltype(sub, id) {
        var txt = "";
        if (sub.hasOwnProperty("table"))
            $(sub.table).each(function (i, k) {
                $(k).each(function (j, l) {
                    if (l.hasOwnProperty("dv")) {
                        $(l.dv).each(function (a, b) {
                            if (id.indexOf(b.id) > -1)
                                txt = b.txt;
                        });
                    }
                });
            });
            return txt;
    }
}
function eventEdit(id) {
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle", sty);

    var name = menuid + ":" + subid + ":" + id, paramname = "#" + name, usebtn = "", btntext = "OK", page = "", btnposition = "", applyto = "",applyto1="";
    var event = eventEditLoad(id);
    if (event.hasOwnProperty("value")) paramname = event.value;
    if (event.hasOwnProperty("name")) name = event.name;
    if (event.hasOwnProperty("button")) usebtn = event.button;
    if (event.hasOwnProperty("Text")) btntext = event.Text;
    if (event.hasOwnProperty("page")) page = event.page;
    if (event.hasOwnProperty("Place")) btnposition = event.Place;
    if (event.hasOwnProperty("applyto")) {
        applyto = event.applyto;
        if(applyto !="")
        applyto1 = JSON.stringify(applyto);
    }
    var data = [
        [makeCtr(["span", "Option", , , "width:50px"]), makeCtr(["span", "Value", , , ])]//headers
        , ["value", makeCtr(["span", paramname, "", "inp", ])]
        , ["name", makeCtr(["input", name, "", "inp", ])]
        , ["button", makeCtr(["input:checkbox", usebtn, "inbtn", , "onclick:toggle($(this))"])]
        , [makeCtr(["span", "Text", , "indent inbtn", , ]), makeCtr(["input", btntext, "", "inp", ])]
        , [makeCtr(["span", "Place", , "indent inbtn", , ]), makeCtr(["select", "right,right;btm right,bottom_right;btm left,bottom_left", "", "inp", ])]
        , ["page", makeCtr(["select", "current,current;other,other", "rdPage", "inp", ])]
        , ["", makeCtr(["span", applyto1, "spCtrlist", "display:none", ])]
    // , ["applyto", makeCtr(["span", JSON.stringify(applyto), "spCtrlist",, ]) + "<i class='fa fa-pencil' onclick=\"reloadmenutree('" + id + "','" + paramname + "')\"/>"]
    ]
    var tb = makeTable("event112", data, "general");
    var dv = $("<div style='padding:10px 0 0 5px;width:100%;'/>");
    var dvleft = $("<div style='float:left'/>"), dvright = $("<div style='float:left;margin-left:10px;'/>");


    dv.append(dvleft);
    dv.append(dvright);
    dvright.append($("<table id='tbapplyto'/><div id='pgapplyto'/>"));

    dvleft.append(tb);
    var btn = $("<div style='clear:both;text-align:right;padding:5px'><input type='button' value='Save'  onclick=\"eventEditSave('" + id + "');\"/></div>");
    dv.append(btn);
//    $("#dvtable").append($("<div style='margin-top:5px'/>"));
    //    $("#dvtable").append(tb);

    if (applyto != "") {
        applytoTable(id, applyto, paramname);
    }
    else {
        setTimeout(function () { applytoTable(id, "", paramname); }, 0);
    }

    $('.indent').parent().parent().hide();
    if (page != "") $("#rdPage").val(page);
    if (usebtn) toggle($("#inbtn"));


    return dv;
}
function eventEditSave(id) {
    var event = {}, control = selectimctable(menuid, subid, id);
    if (typeof (control) != "undefined") {
        if (control.hasOwnProperty("event"))
            event = control.event;
        else {
            var arr = saveTable("event112");
            $(arr).each(function (index, val) {
//                if (val[0] != "applyto" && val[0] != "")
//                            event["applyto"] = JSON.parse(val[1]);
                //                            else
                if (val[0] != "applyto" && val[0] != "")
                    event[val[0]] = val[1];
            });
            control.event = event;
            updateimctable(menuid, subid, id, control);
        }
    }


    //event = selectimctable(menuid, subid, id).event;

    //applytoTable(id, event.applyto, event.value);
}
function eventEditLoad(id) {
    var event = {}, control = selectimctable(menuid, subid, id);
    if (typeof (control) != "undefined") {
        if (control.hasOwnProperty("event"))
            event = control.event;
    }
    return event;
}

function applytoTable(id, applyto, paramname) {
    var data = [], set = {};
    jQuery("#tbapplyto").jqGrid("GridUnload");
    $(applyto).each(function (i, k) {
        if (typeof k.control != "undefined" && k.control != null) {
            set = {};
            var submenu=selectimctable(k.menuid, k.subid, "");
            set.page = submenu.text;
            set.menuid = k.menuid;
            set.subid = k.subid;
            set.control = k.control;
            set.function = k.function;
            set.dialog = k.dialog;
            set.mapfield = findParam(k.subid, k.control, paramname);
            data.push(set);
        }
    });
    //var data = [{ "page": "page1", "control": "jqac0", "menuid": "1", "subid": "j1_1", "dialog": true, "mapfield": "prod"}];
    setTimeout(function () {
        jQuery("#tbapplyto").jqGrid({
            datatype: "local",
            data: data,
            colNames: ['menuid', 'Pageid', 'Page', 'Control', 'Popup', 'Mapping', '', ''],
            colModel: [
                        { name: 'menuid', hidden: false },
                        { name: 'subid', hidden: false },
                        { name: 'page', width: 200 },
                        { name: 'control', width: 200 },
                        { name: 'dialog' },
                        { name: 'mapfield', width: 200 },
                        { name: 'act1', width: 50 },
                        { name: 'act2', width: 50 }
               ],
            rowList: [10, 20, 30],
            pager: '#pgapplyto',
            emptyrecords: "No records to view",
           width:650,
            height: 100,
            gridComplete: function () {
                var ids = jQuery("#tbapplyto").jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var d = data[cl - 1];
                    //pageid, pagename, dvid, paramname
                    be = "<i class='fa fa-pencil imdim' onclick=\"showField('" + ids + "','" + d.subid + "','" + d.page + "','" + d.control + "','" + d.dialog + "','" + d.mapfield + "','" + paramname + "');\"  />";
                    de = "<i class='fa fa-trash imdim' onclick=\"delapplyto('" + id + "','" + d.subid + ":"+d.control+"','" + paramname + "');\"  />";
                    jQuery("#tbapplyto").jqGrid('setRowData', ids[i], { act1: be, act2: de });
                }
            },
            caption: "Event Apply List "
        });
        jQuery("#tbapplyto").jqGrid('navGrid', '#pgapplyto', { edit: false, add: false, del: false, search: false, refresh: false });
        jQuery("#tbapplyto").jqGrid('navButtonAdd', '#pgapplyto', {
            caption: "add",
            buttonicon: "ui-icon-plus",
            onClickButton: function () {
                //eventEditSave(id);
                applytolist(id, paramname);
            }
        });
        jQuery("#tbapplyto").setGridWidth(400);
    }, 0);
}
function delapplyto(ctrid, eventid, paramname) {
    var ctr = selectimctable(menuid, subid, ctrid);
    $(ctr.event.applyto).each(function (i, k) {
        if (k.id == eventid) {
            ctr.event.applyto.splice(i, 1);
            return false;
        }
    });
    updateimctable(menuid, subid, ctrid, ctr);
    applytoTable(ctrid, ctr.event.applyto, paramname);
}
function showField(rowid,pageid, pagename, dvid, dialog, mapfield, paramname) {
    showField.datasrc = datasrc;
    var gdt = selectimctable(menuid, pageid, dvid);
    if (typeof gdt != "undefined" && gdt.hasOwnProperty("data")) {
        var dtcode = gdt.data.datacode;
        jsonReadAjax("imcdata", "", "code", dtcode, showField.datasrc, [rowid,pageid, pagename, dvid, dialog, mapfield, paramname])
    }
    else
        datasrc("", rowid,pageid, pagename, dvid, dialog, mapfield, paramname);
    function datasrc(data, rowid,pageid, pagename, dvid, dialog, mapfield, paramname) {
        var list = datalistreturn(data);
        var field = [];
        if(list.length>0)
        $.each(list[0], function (i, k) {
            var set = {}; set.value = i; set.text = i;
            field.push(set);
        });
        if ($("#dvParam").length > 0) $("#dvParam").remove();
        var dv = $("<div id='dvParam' style='text-align:left;margin:10px 5px 0 0;background-color:#F2F5F7'></div>");

        //mapping table
        var sel = makeSelect(field, ["", "value", "text"]);
        $(sel).attr("id", "selParam1");
        $(sel).prepend("<option>select...</option>");
        //Load type
        var lt = [];
        $.each(['reload','popup','pagemove'], function (i, k) {
            var set = {}; set.value = k; set.text = k;
            lt.push(set);
        });

        //var btn = $("<button class='btnRoundsmall' style='margin-left:5px' onclick=\"saveParam('" + pageid + "','" + dvid + "','" + paramname + "')\"> Save </button>");
        //dv.append($("<div style='text-align:center;text-decoration:underline;'>Mapping Field for " +pagename+"("+ dvid + ")</div>"));
        var tb = $("<table />"), tr = $("<tr />"), td = $("<td style='width:80px'/>");
        dv.append(tb);
        tb.append(tr); tr.append(td); td.append($("<label for='lbPage'> Page: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<label id='lbPage'> " + pagename + "</label>"));
        tr = $("<tr />"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='lbControl'> Control: </label>"));
        td = $("<td />"); tr.append(td); td.append($("<label id='lbControl'> " + dvid + "</label>"));
        tr = $("<tr />"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='selParam1'> Map Field: </label>"));
        td = $("<td />"); tr.append(td); td.append(sel);
      

        tr = $("<tr />"), td = $("<td />");
        tb.append(tr); tr.append(td); td.append($("<label for='selParam1'> Load Type: </label>"));
        td = $("<td />"); tr.append(td); td.append($(makeSelect(lt, ["", "value", "text"])));
         //tr = $("<tr />"), td = $("<td />");
         //tb.append(tr); tr.append(td); td.append($("<label for='cbDialog'>Show: </label>"));
         //td = $("<td />"); tr.append(td); td.append($("<input type='checkbox' id='cbDialog'/>"));

        dv.dialog(opt());

        var set;
        function opt() {
            var dialogset = {};
            dialogset.title = "Mapping Field";
            dialogset.width = 400;
            //button
            dialogset.buttons = [];
            set = {};
            set.text = "Save";
            set.icons = { primaray: "ui-icon-disk" };
            set.click = function () {
                eventEditSave($("#lbCtr").text());
                saveParam(pageid, dvid, paramname);
                updateDialog(menuid, pageid, dvid, paramname);
                $(this).dialog("destroy");
                var newapp = $("#spCtrlist").val();
                applytoTable($("#lbCtr").text(), JSON.parse(newapp), paramname);
            }
            dialogset.buttons.push(set);

            set = {};
            set.text = "Close";
            set.icons = { primaray: "ui-icon-close" };
            set.click = function () { $(this).dialog("destroy") }
            dialogset.buttons.push(set);
            //dialogset.modal = true;
            //confine
            //dialogset.position = { my: "center", at: "center", of: "#dvtable" };
            return dialogset;
        }
        setTimeout(function () {
            if (dialog == "true") {
                $("input:checkbox[id='cbDialog']").attr("checked", true);
            }
            else $("input:checkbox[id='cbDialog']").attr("checked", false);
            dv.parent().css({ "z-index": 400 });
            console.log(dv.parent())
        }, 500);
        $("#selParam1").val(mapfield);
    }
}
function updateDialog(menu,pageid,dvid,paramname){
    var chk = $("#cbDialog").is(":checked");
    //var ctr = selectimctable(menuid, subid, $("#lbCtr").text());
    var ctr = selectimctable(menuid, subid,dvid);
    if(typeof ctr !="undefined"){
        if (!ctr.hasOwnProperty("event")) ctr.event = {};
        if (!ctr.event.hasOwnProperty("applyto")) ctr.event.applyto=[];
        if (ctr.event.applyto.length > 0) {
            var app = ctr.event.applyto;
            var newapp = [];
            $(app).each(function (i, k) {
                if (typeof k.control != "undefined")
                    if (k.id == pageid + ":" + dvid) {
                        k.dialog = chk;
                        newapp.push(k);
                    }
                    else {
                        newapp.push(k);
                    }
                else {
                    newapp.push(k);
                }

            });
            ctr.event.applyto = newapp;
           
         }
         else
             ctr.event.applyto.push();
     }
     updateimctable(menuid, subid, $("#lbCtr").text(), ctr);
     $("#spCtrlist").val(JSON.stringify(newapp));
     
}
function saveParam(pageid,dvid,paramname) {
    var mapfield = $("#selParam1").val();
    var dtcode = selectimctable(menuid, pageid, dvid);
    var f = dtcode.data.filter
    //delete all paramname
    $(f).each(function (i, k) {
        if ($.inArray(paramname, k[2]) > -1) {
            k[2].splice($.inArray(paramname, k[2]), 1);
        };
    });
    var none = true, nomapfield = true;
    $(f).each(function (i, k) {
        if (k[0] == mapfield) {
            nomapfield = false;
            if ($.inArray(paramname, k[2]) == -1) {
                k[2].push(paramname);
                none = false;
            }
        }
    });

    if (nomapfield) f.push([mapfield,'',[paramname]]);
    updateimctable(menuid, pageid, dvid, dtcode);
    var ctr = selectimctable(menuid, subid, $("#lbCtr").text());


    //applytoTable($("#lbCtr").text(),ctr.event.applyto, paramname);
}
function findParam(pageid, dvid, paramname) {
    var rtn = "";
    var dtcode = selectimctable(menuid, pageid, dvid);
    if (typeof dtcode != "undefined") {
        var f = dtcode.filter;
        $(f).each(function (i, k) {
            //[["value","",["#1:j1_1:bc0"]],["yr","",["#1:j1_1:bc0"]],["period","",["#1:j1_1:bc0"]]]
            if ($.inArray(paramname, k[2]) > -1) {
                rtn = k[0];
                return false;
            }
        });
    }
      return rtn;
}
function removeParam(pageid,dvid, paramname) {
    var dtcode = selectimctable(menuid, pageid, dvid);
    if (typeof dtcode != "undefined") {
        var f = dtcode.filter;
        $(f).each(function (i, k) {

            $.each(k[2], function (j, l) {
                if (l == paramname)
                    k[2].splice(j, 1);
            });

        });
        updateimctable(menuid, pageid, dvid, dtcode);

    }
}
//#endregion

//#region help
function helpInit(id)  {
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

        var src = "", width = "100^%", height = "100^%", scrolling = "no";
        var frm = $("<help frameborder='0' />");
        if (ctr.hasOwnProperty("setting")) {
            var setting = ctr.setting;
            if (setting.hasOwnProperty("src")) src = setting.src
            if (setting.hasOwnProperty("width")) width = setting.width;
            if (setting.hasOwnProperty("height")) height = setting.height;
            if (setting.hasOwnProperty("scrolling")) scrolling = setting.scrolling;
        }

        frm.attr("src", src.replace("^",""));

        $([["width", width], ["height", height], ["scrolling", scrolling]]).each(function (i, k) {
            var kk = k[1].replace("^", "");
            if (k[0] == "height" && k[1] == "100^%") frm.attr("onload", "resizehelp1(this,'"+id+"');$('#dvloading').hide();$('#imgLoading').remove();");
            else
            frm.attr(k[0], kk);
        })
        $("#" + id).append(frm);
    }

}

function resizehelp1(obj,id) {
    var h=obj.contentWindow.document.body.scrollHeight + 'px'
    obj.style.height = h;
    $("#" + id).css("height", h);
}

function helpEdit(id) {
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
    btn += "<input type='button' value='Render'  onclick=\"helpEditSave();initDisplay('',selectimctable(menuid,subid));$('#" + conarr.id + "').remove();$('.fade').remove()\"/>&nbsp;";
    btn += "<input type='button' value='Save'  onclick=\"helpEditSave();\"/>&nbsp;";
    btn += "<input type='button' value='Cancel'  onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();menutoggle='admin';\"/></div>";
    btn += "<label style='display:none' id='lbCtr'>" + id + "</label>";

    var code = "Code:<label id='lbhelpcode'>" + id + "</label>";
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
    //var datacode = "";
    //if (typeof (gdt) != "undefined") {
    //    datacode = gdt.datacode;
    //    var src = selectimcdata("imcdata", gdt.datacode).datalist;
    //    if (typeof src == "undefined") {
    //        dataListAjax(datacode, false);
    //        sleep(2000);
    //        src = selectimcdata("imcdata", gdt.datacode).datalist;
    //    }

    //}

    helpEditTable(id, gdt);
    //tabclick event
    var tabb = $('#' + tabarr.id);
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    helpEdit(id);
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

function helpEditTable(id, gdt) {
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
function helpEditSave() {
    var jsid = $("#lbhelpcode").html();
    var combine = selectimctable(menuid, subid, jsid);
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = jsid;
    }

    if (combine == "") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
    }
    var setting = {}
    var jqset = saveTable("tes1");
    $.each(jqset, function (i, k) {
        var k2 = "";
        if (typeof k[2] != "undefined") k2 = "^"+k[2];
        setting[k[0]] = k[1]+k2;
    });

    combine.setting = setting;
    if (combine != null)
        updateimctable(menuid, subid, jsid, combine);

}
function qtip(ctr, text, opt) {
    //opt:title,hide,widget,position:top left,top right,bottom left,bottom right;
    //sample {title:"sss",hide:true,widget:true,position:"bottom right",show:'click' }
    var set = {};
    set.content = {};
    set.content.text = text;
    
    set.position = {};
    var pos = set.position
    pos.my = "bottom right";
    pos.at = "bottom right";
    pos.target = 'mouse';
    pos.viewport = ctr;
    pos.adjust = {
        mouse: false,
        scroll: false
    }
    set.style = {};
    set.style.widget = true;
    set.style.def = false;
//set.show= { when: { event: 'click' } };
    //set.show= { effect: { type: 'fade' } };
    //set.show= { solo: true };
    //set.hide= { when: 'mouseout', fixed: true };

    if (typeof opt != "undefined") {
        if (opt.hasOwnProperty("title")) set.content.title = opt.title;
        
        if (opt.hasOwnProperty("hide")) {
            set.hide = {};
            set.hide.event=true;
            set.content.button = true;
        }
        if (opt.hasOwnProperty("widget")) {
            if (!opt.widget) {
                set.style.widget = opt.widget;
                set.style.def = true;
            }
        }
        if (opt.hasOwnProperty("show")) 
            set.show= opt.show;
        if (opt.hasOwnProperty("position")) {
           pos.my = opt.position;
           pos.at = opt.position;
        }
    }

    ctr.qtip(set
    //{ // Grab some elements to apply the tooltip to
    //    content: {
    //        title: title,
    //        text: text,
    //        button: true
    //    },
    //    hide: {
    //        event: false
    //    },
    //    style: {
    //        widget: true, // Use the jQuery UI widget classes
    //        def: false // Remove the default styling (usually a good idea, see below)
    //    },
    //    position: {
    //        my: 'bottom center',
    //        at: 'top center',
    //        target: 'mouse',
    //        viewport: ctr,
    //        adjust: {
    //            mouse: false,
    //            scroll: false
    //        }
    //    }
    //}
      
    );

   


    if (typeof opt != "undefined" && opt.hasOwnProperty("font-size")) {
        setTimeout(function () {
            $(".qtip-content").css("font-size", opt["font-size"]);
            $(".qtip-title").css("font-size", parseInt(opt["font-size"]) + 4);
        }, 1000);
       
    }
}

function helpclick(code,mtogg) {
    if (typeof mtogg == "undefined") mtogg = menutoggle;
    if(typeof code=="undefined") code = mtogg + "&" + menuid + "&" + subid;
    helpshow(code); return false;
}

function helpshow(code,content) {
    //var content = selectimc("imchelp", "", "code", hcode);
    helpshow.process = process;
    if (code=="" | typeof content != "undefined")
        process(content);
    else
        jsonReadAjax("imchelp", "", "code", code,helpshow.process,[code]);
    function process(content, code) {
        var subcode = "";
        if (code == "helpedit") {
            subcode = 1;
            $("#dvhelpedit").dialog('destroy').remove();
        }
        var contain = $("<div id='dvhelpedit'"+subcode+" />");
        mtogg = "",hpcd="";
        var dv = $("<div id='dvcontent'" + subcode + "/>");
        contain.append(dv);
        contain.dialog({
            height: 'auto'
             , width: 650
            // , modal: true
             , minHeight: 'auto'
             , title: "Help edit"
             , stack: false
             , dialogClass: 'help-dialog'
             , close: function (event, ui) {
                 $(this).dialog('destroy').remove();
             },
            buttons: [
                {
                    text: "Edit",
                    icons: {
                        primary: "ui-icon-check"
                    },
                    click: function () {
                        if ($('.help-dialog .ui-button-text:contains(Edit)').length == 1) {
                            dv.empty()
                            editmode(dv, content);
                        }
                        else {
                            var jsondt = editsave();
                            jsonUpdateAjax("imchelp", "", JSON.stringify(jsondt), "code", code);
                        }
                    }
                },
                {
                    text: "Close",
                    icons: {
                        primary: "ui-icon-close"
                    },
                    click: function () {
                        if ($('.help-dialog .ui-button-text:contains(Cancel)').length > 0) {
                            content = editsave();
                            helpshow("", content);
                        }
                            $(this).dialog('destroy').remove();
                        
                    }
                }
            ]
        });
        contain.parent().css("z-index", 5000);
        $("#dvhelpedit").addClass('helpinsert').attr("help", 'helpedit');
        helpinsert();
        if(content!="")
            readmode(dv, content, code);
        else
            editmode(dv, content, code);
    }
    function editsave() {
        var jsondt = {};
        jsondt.title = $("#inptitle").val();
        jsondt.code = code;
        if ($("#inpcode").length > 0)
            jsondt.code=$("#inpcode").val();
        
        // jsondt.pcode = pcode;
        var txt = tinyMCE.activeEditor.getContent();
        jsondt.content = txt;
        return jsondt;
    }
    function editmode(dv, content, hrcode) {
        var txt = '', title = "",code="", pcode = "#";
        if (content != "" && typeof content!="undefined") {
            if (content.hasOwnProperty('title')) title = content.title;
            if (content.hasOwnProperty('pcode')) pcode = content.pcode;
            txt = content.content;
            hrcode = content.code;
        }
        else {
            var menu = hrcode.split("&");
            if (menu.length > 2) {
                menutoggle = menu[0];
                var mm = selectimctable(menu[1], menu[2]);
                if(typeof mm!="undefined")
                title = mm.text;
            }
        }
        var codeinsert = "<span>" + hrcode + "</span>";
       //if(code=="") codeinsert="<input id='inpcode' style='width:80%'></input>";
        dv.append($("<label style='width:80px'>Code</label>"+codeinsert+"<div/>"));
        dv.append($("<label style='width:80px'>Title</label><input id='inptitle' style='width:80%'></input><div/>"));
        dv.append($("<label style='width:80px'>Content</label><textarea id='txHelp'/>"));
        dv.find("label:contains('Title')").next().val(title);
        //var tx = $("<textarea id='txHelp'/>");
        // tx.append(txt);

        //dv.append(tx);
        contenttinyMCE(txt, "#txHelp", [])
        $('.help-dialog .ui-button-text:contains(Edit)').text('Save');
        $('.help-dialog .ui-button-text:contains(Close)').text('Cancel');
    }
    function readmode(dv,content,hrcode) {
        var txt = '', code = '', title = "", pcode = "#";
        if (content != "" && typeof content!="undefined") {
            if (content.hasOwnProperty('title')) title = content.title;
            if (content.hasOwnProperty('pcode')) pcode = content.pcode;
            txt = content.content;
            hrcode = content.code;
        }

        dv.append($("<label style='width:80px'>Code</label><span>" + hrcode + "</span><div/>"));
        dv.append($("<label style='width:80px'>Title</label><span>" + title + "</span><div/>"));
        dv.append($("<label style='width:80px'>Content</label><span></span>"));
        dv.find("label:contains('Content')").next().html(txt);
       
    }
}
function helpinsert() {
    // if dialog and div added class='helpinsert' and attribute help='helpid', add question button
    var hbtn=$('<button  class="ui-button ui-widget ui-corner-all ui-button-icon-only" title="help"><span class="ui-icon ui-icon-help"></span></button>');
    $(".helpinsert").each(function (i, k) {
        if ($(k).parent().attr("role") == "dialog") {
            var nbtn = hbtn;
            var closebtn = $(k).parent().find($(".ui-dialog-titlebar-close"));
            var closecss={ position: 'absolute', right: '2em', top: '50%', width: '20px', margin: '-10px 0 0 0', padding: '1px', height: '20px' }
            nbtn.button().css(closecss);
             nbtn.insertBefore(closebtn);
            nbtn.on("click", function () {
                helpshow($(k).attr("help")); return false;
            });
        }
        else if ($(k).find("ul").attr("role") == "tablist" && $(k).find("ul").find(".ui-button").length==0) {
            var nbtn = hbtn;
            nbtn.button().css({ position: 'relative',float:"right",margin:"5px",height:"20px",padding:"1px",width:"20px" })
               .appendTo($(k).find("ul[role='tablist']")[0]);
            nbtn.on("click", function () {
                helpshow($(k).attr("help"));
                console.log($(k).attr("help")); return false;
            });
        }
    });
}
//#endregion

//#region permission
function permissionfilter(menu) {
    menu = selectimc("imctable", menutoggle + "menu");
    var user = getlogin();
    var complevel="basic"
    if (typeof user != "undefined" && user != "") {
        $(menu).each(function (i, k) {

        });
    }
}
function complist() {

}
//#endregion