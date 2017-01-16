//#region map
function infowindowStyle() {
  // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');
    var iwBackground = iwOuter.prev();
    // Removes background white & shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();
    iwCloseBtn.css({ opacity: '1', right: '70px', top: '30px',  border: '1px solid #BCBCBC', 'border-radius': '1px' });
    iwCloseBtn.hover( function () {$(this).css({opacity: '0.7'});}, function () {$(this).css({ opacity: '1' });});
}
function infowindowCreate(id, markerid) {
    var ctrtype = "map";
    var arrlist = selectimctablearray(menuid, subid, id + "_" + ctrtype + "_");
    $(infowin).each(function (j, l) {
        var chkexist = false;
        $(arrlist).each(function (i, k) {
            if (l[1] == k.dvid.replace(id + "_" + ctrtype + "_", "")) {
                insertMapRow(id, l);
                chkexist = true;
            }
        });
        if (!chkexist) insertMapRow(id, l);
    });
}
function createInfoWindowContent(latLng, zoom) {
  var scale = 1 << zoom;

  var worldCoordinate = project(latLng);

  var pixelCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale),
      Math.floor(worldCoordinate.y * scale));

  var tileCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale / TILE_SIZE),
      Math.floor(worldCoordinate.y * scale / TILE_SIZE));

  return [
    'Chicago, IL',
    'LatLng: ' + latLng,
    'Zoom level: ' + zoom,
    'World Coordinate: ' + worldCoordinate,
    'Pixel Coordinate: ' + pixelCoordinate,
    'Tile Coordinate: ' + tileCoordinate
  ].join('<br>');
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  var siny = Math.sin(latLng.lat() * Math.PI / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
      TILE_SIZE * (0.5 + latLng.lng() / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
function attachSecretMessage(marker, secretMessage) {
//    var infowindow = new google.maps.InfoWindow({
//        content: secretMessage
//    });

//    marker.addListener('click', function () {
//        infowindow.open(marker.get('map'), marker);
//    });
//}
//var southWest = new google.maps.LatLng(-31.203405, 125.244141);
//  var northEast = new google.maps.LatLng(-25.363882, 131.044922);

//  // Display the area between the location southWest and northEast.
//  map.fitBounds(new google.maps.LatLngBounds(southWest, northEast));

//  // Add 5 markers to map at random locations.
//  // For each of these markers, give them a title with their index, and when
//  // they are clicked they should open an infowindow with text from a secret
//  // message.
//  var secretMessages = ['This', 'is', 'the', 'secret', 'message'];
//  var lngSpan = northEast.lng() - southWest.lng();
//  var latSpan = northEast.lat() - southWest.lat();
//  for (var i = 0; i < secretMessages.length; ++i) {
//    var marker = new google.maps.Marker({
//      position: {
//        lat: southWest.lat() + latSpan * Math.random(),
//        lng: southWest.lng() + lngSpan * Math.random()
//      },
//      map: map
//    });
//    attachSecretMessage(marker, secretMessages[i]);
  }
function mapEdit(id, options) {
        pos = [];
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
            gdt = readdata(id, 'gdt', options);//editDataFind(id, options);
            options = editoptionmake("map", id, gdt);
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
        tabarr.head = ["Map","Action", "Data", "Style"];
        var map = [];
        var msg = "";
        //1st Tab
       
    map.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
    "<td><div/></td><tr><td id='tbbtn' colspan='2'></td></tr></table>");
    //2nd Content
    map.push("<div id='dndcontain_map' class='dndcontain'  />");
    //3rd Tab
    map.push(makeDatasrc());
    tabarr.content = map;
    var tab = makeTab(tabarr);

    if ($.inArray(src, ["list", "externalsavelist"]) > -1){
        archivegdtReload(tab);
    }
    else {
        //container complete
        conarr.body = tab;
        var container = makeContainer(conarr);
    }
    if(typeof gdt!="undefined" && gdt !="")
    mapInit($("#dvtable").parent().siblings().find("div"), { gdt: gdt });
   
    $("#tbbtn").append(editbutton(options));
    //jqgrid scheme & srcdata
    var datacode = "", tb1;

    mapEdit.datasrc = datasrc;
    if (typeof (gdt) != "undefined") {
        if (gdt.hasOwnProperty("data")){
            var datacode = "";
            if (gdt.data.hasOwnProperty("datalist"))
                datasrc(gdt.data, id, gdt, options);
            else {
            
            if( gdt.data.hasOwnProperty("datacode"))datacode=gdt.data.datacode;
            else if (gdt.data.hasOwnProperty("code")) datacode = gdt.data.code;
            if(datacode!="")
                jsonReadAjax("imcdata", "", "code", datacode, mapEdit.datasrc, [id, gdt, options])
            else
                datasrc("",id,gdt,options)
            }
        }

        else
            datasrc("",id, gdt,options)

    }
    else
        datasrc("", id, gdt, options);

    function datasrc(imcdata,id, gdt, options) {
        var dt,tb1;
        if (imcdata != "") {
            var src = datalistreturn(imcdata);
            var filter = findfilter(data);
            dt = applyFilter(src, filter);

            var setting;
            if (gdt.hasOwnProperty('setting')) setting = gdt.setting;
            tb1 = mapFieldTable(id, dt, setting);
            console.log(dt,imcdata)
        }
        else
         tb1 = mapFieldTable(id, "","");
        var tb2 = mapEditTable(id, "", options);
        if (typeof gdt != "undefined" && gdt.hasOwnProperty("setting")) {
            var tb2 = mapEditTable(id, gdt, options);
        }
        // var tb3 = mapInfowinList(id,gdt);
        var accord = $("#accordion1");
        if (accord.length == 0) {
            var accord = $("<div/>");
            accord.attr("id", "accordion1");
            accord.append("<h3>Setting</h3>");
            accord.append("<div>" + tb2.prop('outerHTML') + "</div>");
            if (typeof gdt != "undefinded") {
                accord.append("<h3>Data Scheme</h3>");
                var cont = "no dataset selected!!";
                if (typeof tb1 != "undefined")
                    cont = tb1.prop('outerHTML');
                accord.append("<div>" + cont + "</div>");
            }
        }
        accord.accordion({
            event: "click",
            collapsible: true,
            autoHeight: true,
            heightStyle: "map",
            active: 0,
            beforeActivate: function (event, ui) {
                console.log(ui.newHeader,ui.newHeader.context)
                switch (ui.newHeader.context.innerText.toLowerCase()){
                 case    "setting": 
                 if($("#selcenter").children().length == 0) {
                    latlnglist(id, gdt);
                    console.log(id, JSON.stringify(gdt))
                }
                break;
             case "data scheme":
 //            if(typeof gdt !="undefined" && gdt.data.datacode!=$("#spDatacode").text()){
 //                gdt.data.datacode==$("#spDatacode").text();
 //                gdt.data.filter=[];
 //                 $("#accordion1").accordion({ active: index });
 //jsonReadAjax("imcdata", "", "code", $("#spDatacode").text(), mapEdit.datasrc, [gdt, options]);
 //            }
             
             break;
            }
            }
        });

        accordioncss();
        $("#dvtable").empty();
        $("#dvtable").append(accord);
        $('.indent').parent().parent().hide();

        //external button attach
        //[rtnctrid,rtngdt,rtntype,extid,extgdt,exttype,misc]
        var extid = 'ext1', type = 'map', extgdt,extctrtype="content";
        if (typeof gdt != "undefined") {
            extgdt = externalFind(gdt, extid);
            if(extgdt!="" && extgdt.hasOwnProperty("ctrtype"))
             extctrtype=extgdt.ctrtype
            var opt1 = [id, options, type, extid, extgdt, extctrtype];
            externalAttach(options, opt1);
            externalremove(extid, options, opt1);
        }

        var st = "", mapmode = "map", detailshow = "", markerimage = "", zoomlevel = "", center = ""
            , toolkit = "", markeraction = "", toolkit = [], contentid = "";
        if (gdt != null) {
            if (gdt.hasOwnProperty("setting")) {
                st = gdt.setting;
                if (st.mapmode != "") mapmode = st.mapmode;
                if (st.detailshow != "") detailshow = st.detailshow;
                if (st.markerimage != "") markerimage = st.markerimage;
                if (st.zoom != "") zoomlevel = st.zoom;
                if (st.hasOwnProperty("center")) center = st.center;
                if (st.hasOwnProperty("toolkit")) toolkit = st.toolkit;
                if (st.markeraction != "") markeraction = st.markeraction;
                if (st.content != "") contentid = st.content;
            }
        }
        $("#selmode").val(mapmode);
        $("#seldetail").val(detailshow);
        $("#selmarkerimage").val(markerimage);
        $("#selmarkeraction").val(markeraction);
        $("#selzoom").val(zoomlevel);
       
        $("#spcontent").text(contentid);
        runAfterTableCreate("mapsetting");
        setTimeout(function () {
            $(".multiselect").multipleSelect({
                width: 150
            });
            $("#seltoolkit").multipleSelect("setSelects", toolkit);//.val(toolkit);
        }, 0);
        $("button").button();
        //tabclick event
        var tabb = $('#' + tabarr.id);
        var first = true,first1=true,action=true;
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
                            dndboxInit(gdt, 'map');
                            action = false;
                        }
                        break;
                    case 2:
                        if (first1) {
                            dataTabClick(id, options);
                            first1 = false;
                        }
                        break;
                    case 3:
                        //3rd Tab style
                        if (first) {
                            if (typeof id == 'undefined') id = code;
                            cssEditInit("Style", id, "map");
                            first = false;
                        }
                        break;
                }
                var dtid = 'admin&2&j160112153427';
                if ($("#spdataajax").length > 0) dtid = 'data_select';
                var hp = ['mapedit', 'action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
                tabb.attr("help", hp[$activeTab]);
            }
        });
        tabb.addClass('helpinsert');
        tabb.attr("help", 'mapedit');
        helpinsert();
        $("input[type='button']").button();
        $('.selectimage').ddslick({
            width: 150,
            imagePosition: "left",
            selectText: "Select a image",
            onSelected: function (selectedData) {
                //callback function: do something with selectedData;
            }
        });
        //if (gdt.setting.hasOwnProperty("infowindow"))
        //    mapInfowinbyorder(id, "map", gdt.setting.infowindow);
        latlnglist(id, gdt)
        $("#selcenter").val(center);
        if ($("#selcenter").length==0)
        $("#selcenter").on("click", function () {
            var mm = saveTable("fieldmap");
            var dlist = $("#spdlist").text();
            if (dlist != "") {
                dlist = JSON.parse(dlist);
                relatlist(dlist, mm);
            }
        });
        if (typeof index != "undefined")
            $("#accordion1").accordion({ active: index });
    }
}
function mapEditTable(id, gdt, option) {
    //dropdown with image
    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["mapmode", makeCtr(["select", "ROADMAP;TERRAIN;HYBRID;SATELLITE", "selmode", "inp", ])]
    , ["detailshow", makeCtr(["select", "dialog;side", "seldetail", "inp", ])]
    , ["markerimage", makeCtr(["select:selectimage", "0,,/images/marker.png,;1,,/images/office-building-32.png,;2,,/images/Person-Male.png,", "selmarkerimage", "", "inp", ])]

    , ["center", makeCtr(["select", "", "selcenter", "inp", ])]
    , ["zoom", makeCtr(["select", "select,;1;2;3;4;5;6;7;8;9;10;11;12;13;14;15;16;17;18;19;20;21", "selzoom", "inp", ])]
    , ["markeraction", makeCtr(["select", "select,;show detailpage,detail;url Link,url", "selmarkeraction", "inp", ])]
    , ["toolkit", makeCtr(["select:multiselect", "streetview;search;reload", "seltoolkit", "inp", ])]
     ,["content", makeCtr(["span",,"dvext1",,])]
   // , ["content", makeCtr(["span", "", "spcontent", "min-width:50px", ]) + "&nbsp;<span class='imexpand' onclick=\"mapcontentEdit('" + id + "')\"><i style='color:#D6276D' class='fa fa-image fa-2x' /></span>"]
    ]
   
    var tb = makeTable("mapsetting", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="reloadTable(\"\")" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","style":"text-align:right;"}'];
    var tb2 = appendFooter(tb, foot);
  
    return tb2;
}

function mapFieldTableReload(){
    var datacode=$("#spDatacode").text();
    mapFieldTableReload.datasrc=datasrc;
    jsonReadAjax("imcdata","","code",datacode,mapFieldTableReload.datasrc)
    function datasrc(dt){
        if(dt!="" && dt.hasOwnProperty("datalist")){
              var field=Object.keys(dt.datalist[0]);
        $($("#fieldmap").find("select")).each(function(i,k){
            $(k).empty().append($("<option>n/a</option>")); 
            $(field).each(function(a,b){
                 $(k).append($("<option value='"+b+"'>"+b+"</option>")); 
            });
        });
        }
    }
}
function setMakersMultiple() {

}
function latlnglist(id,gdt) {
    //make latlng field
    var rtn = "", name = "", lat = "", lng = "", rtn1 = [],mm,srcdata;
    latlnglist.datasrc=datasrc;
    if (gdt != null) {
        var dlist = $("#spdlist").text();
        if (gdt.hasOwnProperty("data") && gdt.data.hasOwnProperty("datalist"))
            datasrc(gdt.data.datalist, id, gdt);
        else if (dlist != ""){
            srcdata = JSON.parse(dlist);
            datasrc(srcdata, id, gdt);
        }
        else
            if (gdt.hasOwnProperty("data") && gdt.data.hasOwnProperty("datacode")) {
                jsonReadAjax("imcdata", "", "code", gdt.data.datacode, latlnglist.datasrc, [id, gdt])
            }
    }
    function datasrc(dsrc, id, gdt) {
        if (gdt != null) {
            if (dsrc != "") {
                if (dsrc.hasOwnProperty("datalist"))
                    srcdata = dsrc.datalist;
                else
                    srcdata = dsrc;
            }
            console.log(srcdata)
            var mm = saveTable("fieldmap");
            if (mm.length > 0 && mm[0][1] != "" && mm[1][1] != "" && mm[2][1] != "" && mm[3][1] != "")
                mm = saveTable("fieldmap");

            else if (gdt.hasOwnProperty("setting") && gdt.setting.hasOwnProperty("fieldmap"))
                mm = gdt.setting.fieldmap;
            relatlist(srcdata,mm);
        }
    }
}
function relatlist(srcdata,mm) {
    var rtn = [];

    $(mm).each(function (j, s) {
        switch (s[0]) {
            case "LocName":
                name = s[1];
                break;
            case "Lat":
                lat = s[1];
                break;
            case "Lng":
                lng = s[1];
                break;
        }
    });
    $(srcdata).each(function (i, k) {
        if (name != "" && k[lat]!="" && k[lng]!="")
            rtn.push(k[name] + "," + k[lat] + "^" + k[lng]);
    })
   
    if (rtn.length > 0) {
        $("#selcenter").empty();
        $(rtn).each(function (a, b) {
            var li = b.split(",")
            $("#selcenter").append($("<option value='" + li[1] + "'>" + li[0] + "</option>"));
        });
    }
}

function mapcontentEdit(id) {
    var cid = "c" + idMake();
    var opt = { parent: id, type: "map", rtnid: "spcontent" };
    var ctr = selectimctable(menuid, subid, id);
    if(typeof ctr !="undefined")
    if (ctr.hasOwnProperty("setting") && ctr.setting.hasOwnProperty("content"))
        cid = ctr.setting.content;
    else {
        var set = {};
        set.menuid = menuid;
        set.subid = subid;
        set.dvid = cid;
        if (ctr.hasOwnProperty("datacode")) set.datacode = ctr.datacode;
        if (ctr.hasOwnProperty("filter")) set.filter = ctr.filter;
        if (ctr.hasOwnProperty("field")) set.field = ctr.field;
        updateimctable(menuid, subid, cid, set);
    }
    $('#dveditback').remove(); $('.fade').remove(); editorRemove();
    contentEdit(cid, opt);
}
function mapFieldTable(id, dt,setting) {
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;Width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle", sty);
    var locid = "locid", locname = "locname", lat="lat",lng = "lng", address1 = "address1", address2 = "address2",markerimg="markerimg";
    if (dt != "" && typeof dt != "undefined" ) {
        //var imcdata = selectimc("imcdata", gdt.datacode);
        //var src = selectimcdata("imcdata", gdt.datacode).datalist;
        //var dt = src;
        //if (typeof gdt.filter != "undefined" && gdt.filter.length > 0)
        //    dt = applyFilter(src, gdt.filter);
        var columnlist = [];
        $.each(dt[0], function (i, k) {
            columnlist.push(i + "," + i);
        });
        columnlist.unshift("select,");
        if (typeof setting!="undefined") {
            if (setting.hasOwnProperty("fieldmap")) {
                var st = setting.fieldmap;
                $(st).each(function (i, k) {
                        switch (k[0].toLowerCase()) {
                            case "locid":
                                locid = k[1];
                                break;
                            case "locname":
                                locname = k[1];
                                break;
                            case "lat":
                                lat = k[1];
                                break;
                            case "lng":
                                lng = k[1];
                                break;
                            case "address1":
                                address1 = k[1];
                                break;
                            case "address2":
                                address2 = k[1];
                                break;
                            case "markerimg":
                                markerimg = k[1];
                                break;
                        }
                });
            }
        }
    }

    if (typeof dt != "undefined") {
        var data = [
            [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
        , ["LocId", makeCtr(["select", InsertSelected(dt[0], locid, "n/a"), "selLocid", "inp", ])]
        , ["LocName", makeCtr(["select", InsertSelected(dt[0], locname, "n/a"), "selLocname", "inp", ])]
        , ["Lat", makeCtr(["select", InsertSelected(dt[0], lat, "n/a"), "selLat", "inp", ])]
        , ["Lng", makeCtr(["select", InsertSelected(dt[0], lng, "n/a"), "selLng", "inp", ])]
        , ["Address1", makeCtr(["select", InsertSelected(dt[0], address1, "n/a"), "selAddr1", "inp", ])]
        , ["Address2", makeCtr(["select", InsertSelected(dt[0], address2, "n/a"), "selAddr2", "inp", ])]
        , ["markerimg", makeCtr(["select", InsertSelected(dt[0], markerimg, "n/a"), "selMarkerimg", "inp", ])]
        ]
        var tb = makeTable("fieldmap", data, "general");
        var foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="mapFieldTableReload()" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","class":"ui-widget-footer"}'];
        var tb1 = appendFooter(tb, foot);
    }
    return tb1;
}
function mapEditSave(id, options) {
    var combine = saveData(true);
    var jqset = saveTable("mapsetting");
    var setting = {};
    //setting.data = "";
    $.each(jqset, function (i, arr) {
        if (arr[1] != "") {
                setting[arr[0]] = arr[1];
        }
    });
    setting.fieldmap = saveTable("fieldmap");
    combine.setting = setting;
    var external = externalsave();
    if (external.length > 0) {
        combine.external = external;
    }
    combine.ctrtype = 'map';
    if ($(".dnd").length > 0)
        combine.eventlist = dndevtlist("map");
    var rtn = commonsave(id, options.src, combine, options);

    combine.data = JSON.parse($("#spdataajax").text());
    $("#dvtable").parent().siblings().find("div").empty();
    mapInit($("#dvtable").parent().siblings().find("div"), { gdt: combine });
    return rtn;
}
function mapInfowinList(id,gdt) {
    if ($("#tes88").length > 0)
        $("#tes88").remove();

    var data = [
        [makeCtr(["span", "Seq", , , ]), makeCtr(["span", "Code", , , ]), makeCtr(["span", "Description", , , ]), makeCtr(["span", "", , , ])]//headers
    ];
    var tb = makeTable("tes88", data, "general");
    $("#tes88").attr("data-page-navigation", ".pagination");
    $("#tes88").attr("data-page-size", "5");
    var str = '<ul class="pagination" style="margin:0"></ul>';
    str += '<div style=\"text-align:right;padding:3px;\">';
    str += '<input type="button" class="btnRoundsmall" value="add" onclick="insertMapRow(\''+id+'\',\'\',\'\',\'\')" style="padding:0 3px 0 3px;" id="btnFixed"/>';
    // str += '<input type="button" class="btnRoundsmall" value="reset" onclick="if(confirm(\'Reset All Rows?\'))resetRow(\'' + calid + '\',\'' + id + '\')" style="padding:0 3px 0 3px;"/>';
    str += '</div>';
    str += '|{"colspan":"4","class":"ui-widget-footer"}';
    var foot = [str];

    var tb1 = appendFooter(tb, foot);
    //if (gdt != null && gdt.hasOwnProperty("setting") && gdt.setting.hasOwnProperty("infowindow")) {
    //selectimctable에서 id+number+map으로 구성된 모든 내용을 가져온후

    return tb1;
}
function mapInfowinbyorder(id,ctrtype,infowin) {
    var arrlist = selectimctablearray(menuid, subid, id + "_" + ctrtype + "_");
    $(infowin).each(function (j, l) {
        var chkexist = false;
        $(arrlist).each(function (i, k) {
            if (l[1] == k.dvid.replace(id + "_" + ctrtype + "_", "")) {
                insertMapRow(id, l);
                chkexist = true;
            }
        });
        if (!chkexist) insertMapRow(id, l);
    });
    sequencemake();
}
function mapInfoLoad(id) {

    $("#lbDatacode_mycal").text(mycal.datacode);
    //find mapping code for mycal(code,name) from datalist
    var code = "", name = "", colorlist = [];
    $(mycal.field).each(function (j, l) {
        if (l[2] == "code" | l[1] == "code")
            code = l[1];
        else if (l[2] == "name" | l[1] == "name")
            name = l[1];
    });
    console.log(JSON.stringify(colorlist))
    if (mycal.hasOwnProperty("colorlist") && mycal.colorlist.length > 0)
        colorlist = mycal.colorlist;
    else if (mycal.hasOwnProperty("datacode") && mycal.datacode != "") {
        var dt = selectimcdata("imcdata", mycal.datacode).datalist;
        dt = applyFilter(dt, mycal.filter);
        $(dt).each(function (i, k) {
            colorlist.push([k[code], k[name], mycal.color]);
        });
    }
    if (colorlist.length > 0) {
        $(colorlist).each(function (i, k) {
            insertRow(k[0], k[1], k[2]);
        });
    }
}
function insertMapRow(id,rowarray) {
    var i = $("#tes88 tbody").children().length + 1;
    var seq = "";
    var rowid = rowarray[0];
    var desc = rowarray[1];
    if ($.trim(rowid) == "") {
        rowid = "r"+i;
        seq=i;
    }
    if (typeof desc == "undefined") desc = "";
    var btn = "<button onclick=\"mapInfowindow('" + id + "','" + rowid + "')\" class='btnRoundsmall'><i class='fa fa-pencil'></i></button>";
    var del = "<button onclick=\"if(confirm('Delete ?'))$(this).closest('tr').detach()\" class='btnRoundsmall'><i class='fa fa-times'></i></button>";
    var up = "<button onclick=\"orderchg('up',this)\" class='btnRoundsmall'><i class='fa fa-arrow-up'></i></button>";
    var dn = "<button onclick=\"orderchg('down',this)\" class='btnRoundsmall'><i class='fa fa-arrow-down'></i></button>";
    var rowData = [makeCtr(["div", seq, , "", ,'width:10px' ]), makeCtr(["span", rowid, , "inp", , ]), makeCtr(["input", desc, "", "inp", ]) , btn+ up+ dn+ del];
    appendTableRow($("#tes88"), rowData);
}
function sequencemake() {
    var dvlist = $("#tes88 tbody tr td").find("div");
    $(dvlist).each(function (i, k) {
        $(k).text(i + 1)
    })
}
function orderchg(updown, that) {
    var row=$(that).closest("tr");
        switch (updown) {
            case "up":
                var previous = row.prev();
                if (previous.is("tr")) {
                    row.detach();
                    previous.before(row);
                    row.fadeOut();
                    row.fadeIn();
                }
                break;
            case "down":
                var next = row.next();
                if (next.is("tr")) {
                    row.detach();
                    next.after(row);
                    row.fadeOut();
                    row.fadeIn();
                }
                break;
            case "del":
                    row.detach();
                break;
        }
        sequencemake();
}
function mapInfowindow(id,code) {
    mapEditSave(id); $('#dveditback').remove(); $('.fade').remove();
    contentEdit(id + "_map" + "_" + code);
}
//#endregion

//#region googleChart
//#region old google chart
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
function drawChart(json, keyname, chtdiv, opt, ctype,cursor) {
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
    }
    data = new google.visualization.DataTable(list);
    var options = eval("(" + opt + ")");
    if (options.width == ""){
            if (chtdiv != "")
                options.width = document.getElementById(chtdiv).offsetWidth;
            else
                options.width = "600";
        }
    if (options.height == "") {
        if (chtdiv != "")
            options.height = document.getElementById(chtdiv).offsetHeight;
        else
            options.height = "380";
    }
    //Chart background
    var container;
    if (chtdiv == "") {
        container = document.createElement('div');
        container.setAttribute("id", "dvContainer");
    }
    else
        container = document.getElementById(chtdiv);

    var h = parseInt(options.height) + 20;
    if (chtdiv == "") {
        //chart생성
        var e = window.event;
        if(cursor=="")
            cursor = getPositionOffset(e,options.width, options.height);
        else
            cursor= eval("(" + cursor + ")");
        container.setAttribute("class", "msgbox");

         document.getElementsByTagName("form")[0].appendChild(container);
        //차트dropdownlist용 div생성
        var ddldiv = document.createElement('div');
        ddldiv.setAttribute("style", "float:left;");
        var dd = document.createElement("select");//dropdownlist
        dd.name = "name";
        dd.id = "selCtype";
        var chartlist=["line","column","bar","area","pie","donut","bubble","scatter"];
        for (var i = 0; i < chartlist.length; i++) {
            dd.options[i] = new Option(chartlist[i],chartlist[i]);
        }
        dd.value = ctype;
        if (keyname != "") list = JSON.stringify(list);
        dd.setAttribute("onchange", "select('" + list + "','" + JSON.stringify(options) + "','" + JSON.stringify(cursor) + "')");
        ddldiv.appendChild(dd);

        //clear both용 div
        var cleardiv = document.createElement('div');
        cleardiv.setAttribute("style", "clear:both;");

        //close button용 div
        var closediv = document.createElement('div');
        closediv.setAttribute("style", "float:right;");

        //buttons
        var newopt = {};
        cur = {};
        newopt.title = options.title;
        newopt.hAxis = options.hAxis;
        newopt.crosshair = options.crosshair;
        var maximg = document.createElement("img"); //close img
        maximg.setAttribute("style", "padding:0 3px 4px 0;");
        maximg.setAttribute("class", "imdim");
        var inwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var inheight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (parseInt(options.width) == inwidth-20) {
            maximg.setAttribute("src", "/images/restoredown.gif");
            newopt.width = "600";
            newopt.height = "380";
            cur.x = screen.width / 2 - 300;
            cur.y = 100;
            container.setAttribute("class", "");
            container.setAttribute("style", "width:" + options.width + "px;height:" + options.height + "px;display:block;position:absolute;background-color:#292C31;z-index:1000;left:" + cursor.x + "px;top:" + cursor.y + "px");
        }
        else {
            maximg.setAttribute("src", "/images/maximize.gif");
            newopt.width = inwidth-20;
            newopt.height = inheight-20 ;
            cur.x = 0;
            cur.y = 0;
            container.setAttribute("style", "width:" + options.width + "px;height:" + h + "px;display:block;position:absolute;background-color:#292C31;z-index:1000;left:" + cursor.x + "px;top:" + cursor.y + "px");
        }
        maximg.setAttribute("onclick", "document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));drawChart('" + list + "','', '','" + JSON.stringify(newopt) + "', '" + ctype + "','"+JSON.stringify(cur)+"')");

        closediv.appendChild(maximg);
        var closeimg = document.createElement("img"); //close img
        closeimg.setAttribute("src", "/images/closegray.png");
        closeimg.setAttribute("style", "padding:0 1px 3px 0;");
        closeimg.setAttribute("class", "imdim");
        closeimg.setAttribute("onclick", "document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));");
        closediv.appendChild(closeimg);

        //top float할 div생성한후 append
        var floatdiv = document.createElement('div');
        floatdiv.appendChild(ddldiv);
        floatdiv.appendChild(closediv);
        floatdiv.appendChild(cleardiv);

        //fade용 바탕 div
        var fade = document.createElement("div");
        fade.setAttribute("id", "dvFade11");
        fade.setAttribute("class", "fadewhite");
        fade.setAttribute("style", "z-index:999;display:block;");
        fade.setAttribute("onclick", "document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));");
        document.getElementsByTagName("form")[0].appendChild(fade);

        //edit button
        var editimg = document.createElement("img"); //close img
        editimg.setAttribute("class", "imdim");
        editimg.setAttribute("style", "margin:0 0 0 3px;");
        editimg.setAttribute("src", "/images/icon/table_edit.png");
        editimg.setAttribute("onclick", "GoogleChartEdit(document.getElementById('dvContainer'),'" + list + "','" + opt + "','" + ctype + "','" + cursor + "');");

        //editimg.setAttribute("onclick", "myPopup('" + href + "', '800px', '600px', 'yes')");
        ddldiv.appendChild(editimg);
    }
    else {
        if (keyname == "")//single일 경우(gridview내 차트는 외곽선없앰
        container.setAttribute("style", "border:solid 1px gray;margin-top:10px;width:" + options.width + "px;height:" + h + "px;display:block;");
    }

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

    //event handler
    google.visualization.events.addListener(chart, 'select', selectHandler);
    if (chtdiv == "") {
        container.insertBefore(floatdiv, container.childNodes[0]);
    }
    else if(keyname ==""){
        var span = document.createElement("div");
        span.setAttribute("style", "text-align:right;width:95%;");
        var magnifyimg = document.createElement("img");
        magnifyimg.setAttribute("src", "/images/magnify1.png");
        magnifyimg.setAttribute("style", "margin:-5px;");
        magnifyimg.setAttribute("class", "imdim");
        options.width = "600";
        options.height = "380";

        magnifyimg.setAttribute("onclick", "drawChart('" + list + "','', '','" + JSON.stringify(options) + "', '" + ctype + "','')");
        span.appendChild(magnifyimg);
        container.appendChild(span);
    }
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
            for (var j = 0; j < 2; j++) {
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

    //fade용 바탕 div
    var fade = document.createElement("div");
    fade.setAttribute("id", "dvFade12");
    fade.setAttribute("class", "fadewhite");
    fade.setAttribute("style", "z-index:999;display:block;");
    fade.setAttribute("onclick", "document.getElementById('" + container + "').parentNode.removeChild(document.getElementById('" + container + "'));document.getElementById('dvFade12').parentNode.removeChild(document.getElementById('dvFade12'));");
    document.getElementsByTagName("form")[0].appendChild(fade);
    return floatdiv;
}
function GoogleChartRead(opt) {
     var options = eval("(" + opt + ")");
     var val = "";
     val += ",,,break,2;";
     val += "Title,title," + options.title + ",input,;";
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
function GoogleChartEdit(container,list,opt,ctype,cur) {
    var width = 600;
    var height = 400;
    var top = cur.x;
    var left = cur.y;
    if (container != "") {
        width = container.offsetWidth;
        height = container.offsetHeight;
        top = parseInt(container.style.top.replace(" px", ""));
        left = parseInt(container.style.left.replace(" px", ""));
    }

    var editor = document.createElement('div');
    editor.setAttribute("id", "dvChartEdit");
    editor.setAttribute("class", "msgbox");
    editor.setAttribute("style", "position:absolute;width:" + width + "px;height:" + height + "px;top:" + top + "px;left:" + left + "px;background-color:#292C31;z-index:1001;");
    document.getElementsByTagName("form")[0].appendChild(editor);

    //topbar삽입
    editor.appendChild(TopBar('dvChartEdit','Edit'));//div명, topbar title
    //table area
    var dvChartedit = document.createElement('div');
    dvChartedit.setAttribute("style", "width:" + (width-10) + "px;height:" + (height - 45) + "px;background-color:white;z-index:1002;padding:15px 5px 5px 5px;");
    editor.appendChild(dvChartedit);
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
    var cancel = "document.getElementById('dvChartEdit').parentNode.removeChild(document.getElementById('dvChartEdit'));document.getElementById('dvFade12').parentNode.removeChild(document.getElementById('dvFade12'));";
    cancelbtn.setAttribute("onclick", cancel);
    btmdiv.appendChild(cancelbtn);

    //apply btn추가
    var applybtn = document.createElement("input");
    applybtn.setAttribute("value", "Apply");
    applybtn.setAttribute("style", "width:60px;text-align:center;");
    applybtn.setAttribute("class", "button");
    var closechart = "document.getElementById('dvContainer').parentNode.removeChild(document.getElementById('dvContainer'));document.getElementById('dvFade11').parentNode.removeChild(document.getElementById('dvFade11'));";

    var cursor = getPositionOffset(window.event, width, height);
    applybtn.setAttribute("onclick", "drawChart('" + list + "','', '',JSON.stringify(GoogleChartSave()) , '" + ctype + "','" + JSON.stringify(cursor) + "');" + closechart + cancel);
    btmdiv.appendChild(applybtn);

    td.appendChild(btmdiv);
    tr.appendChild(td);
    table.appendChild(tr);

    dvChartedit.appendChild(table);

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
    //alert('You selected ' + message);
    swal({ title: "You selected"+message, text: "I will close in 2 seconds.", timer: 2000, showConfirmButton: false });
}
function getPositionOffset(e, boxw, boxh) {
    //window를 9등분해서 위치에 따라 div의 위치를 바꿈
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
    return obj;
}
function isEven(num) { return (num % 2 == 0) ? true : false; }
function assign(obj, keyPath, value) {
    /*--------------------------------------------------------------
////assign내역////
obj: 값을 담을 JSON object
keyPath:array로 구성 예(vAxis.color)
value:keyPath의 값
---------------------------------------------------------------*/
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
    var cn = div.childNodes[0]; //node:div 안의 첫번째자식
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
            rtn = cn.value
            break;
    }
    return rtn;
}
//#endregion
//#region from Mobile
function assign(obj, keyPath, value) {
    /*--------------------------------------------------------------
////assign내역////
obj: 값을 담을 JSON object
keyPath:array로 구성 예(vAxis.color)
value:keyPath의 값
---------------------------------------------------------------*/
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
    var cn = div.childNodes[0]; //node:div 안의 첫번째자식
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
            rtn = cn.value
            break;
    }
    return rtn;
}
function makeGoogleDataTable(data, axislist, series, valuelist, filterlist, sortlist) {
    //based on raw data create chart data for google
    var grpby = [];
    var val = [];
    var row = [];
    //create datatable
    var googledt = new google.visualization.DataTable();
    var al = axislist.split(',');
    var sl = series;
    var vl = valuelist.split(';');
    var axistype = "";
    //googledt column create:axis,value
    for (var t in al) {
        //add axis column
        if (typeof data == "undefined")
            googledt.addColumn('string', al[t]);
        else{
        var d = new Date(data[0][al[t]]);
        if (d instanceof Date && d != "Invalid Date") 
            googledt.addColumn('date', al[t]);
        else if(typeof al[t]!="function")
            googledt.addColumn('string', al[t]);
        }
    }
    //if series
    var serieslist = "";
    if (sl != "") {
        //series value distict extract
        ser = [];
        for (i in data) {
            ser.push(data[i][sl]);
        }
        ser = $.unique(ser); //refer common.js(uniques)
        //series column
        var tt = vl[0].split(',');
        var aggregation = tt[1];
        for (j in ser) {
            //add axis column
            googledt.addColumn('number', ser[j]);
            serieslist += ser[j] + "," + aggregation + ";";
        }
        //add row
        for (i in data) {
            row = [];
            //x axis row data insert
            var d = new Date(data[i][al[0]]);
            if (d instanceof Date && d != "Invalid Date") {
                row.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            }
            else
                row.push(data[i][al[0]]);

            for (j in ser) {
                if (data[i][sl] == ser[j])
                    row.push(parseFloat(data[i][tt[0]]));
                else
                    row.push(0);

            }
            googledt.addRow(row)
        }

        serieslist = serieslist.substring(0, serieslist.length - 1);
    }
    else {
        //value column

        for (var t in vl) {
            //add value column
            if (vl[t] != "" && typeof vl[t]!="function") {
                var tt = vl[t].split(',');
                googledt.addColumn('number', tt[0]);
            }
        }
        //googledt row insert
        for (i in data) {
            row = [];
            var d = new Date(data[i][al[0]]);
            if (d instanceof Date && d != "Invalid Date") {
                row.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
                axistype = "date";
            }
            else
                row.push(data[i][al[0]]);

            for (var t in vl) {
                if (vl[t] != "" && typeof vl[t] != "function") {
                    var tt = vl[t].split(',');
                    row.push(parseFloat(data[i][tt[0]]));
                }
            }
            googledt.addRow(row)
        }
    }
    //groupby
    //axis field

    var axisarray = [];
    var axarr = axislist.split(',');
    $(axarr).each(function (i, k) {
        axisarray.push(parseInt(i));
    });
   
    //value field
    if (sl != "") valuelist = serieslist;
    var valarray = googleGroupbyValueArray(axislist, valuelist);


    //google groupby
    var result = google.visualization.data.group(googledt, axisarray, valarray);
    return result;

}
function googleSortArray(sortlist, json) {
    //SORTING: data=googledata,sortlist=column Index+","+sort order;(comma & semicolon)

    var sortout = [];
    var srt = sortlist.split(';');
    for (i in srt) {
        var st = {};
        var srtt = srt[i].split(',');
        //st.column = parseInt(srtt[0]);
        var index = colindex(srtt[0], json);
        if (typeof(index) != "undefined") {
            st.column = index;
            switch (srtt[1]) {
                case "desc":
                    st.desc = true;
                    break;
                case "asc":
                    st.desc = false;
                    break;
            }
            sortout.push(st);
        }
    }

    function colindex(sr, json) {
        output = json;
        json = JSON.parse(JSON.parse(JSON.stringify(json))).cols;

        var out;
        $.each(json, function (i, k) {
            if (sr == k.label)
                out = i;
        });

        return out
    }
    return sortout;
}
var output;
function googleFilterArray(filterlist) {
    var srt = filterlist.split(';');
    var filterout = [];

    for (i in srt) {
        var st = {};
        var srtt = srt[i].split(',');
        st = {};
        st.column = parseInt(srtt[0]);
        var d = new Date(srtt[1]);
        if (srtt[2] == "") {
            st.value = srtt[1];
        }

        else {

            if ($.isNumeric(srtt[1])) {
                st.minValue = parseFloat(srtt[1]);
                st.maxValue = parseFloat(srtt[2]);
            }
            else if (d instanceof Date && d != "Invalid Date") {
                st.minValue = new Date(srtt[1]);
                st.maxValue = new Date(srtt[2]);
            }
        }


        filterout.push(st);
    }



    return filterout;
}
function googleGroupbyValueArray(axislist, valuelist) {
  
    var val = [];
    var vset = {};
    var vl = valuelist.split(';');
    for (var t in vl) {
        var tt = vl[t];
        if (typeof tt == "string") {
            tt = tt.split(',');
            var index = axislist.split(',').length + parseInt(t);
            var aggregate = tt[1];
            var labelname = tt[0];

            switch (aggregate) {
                case "sum":
                    val.push({ 'column': index, 'type': 'number', 'label': labelname, 'aggregation': google.visualization.data.sum });
                    break;
                case "avg":
                    val.push({ 'column': index, 'type': 'number', 'label': labelname, 'aggregation': google.visualization.data.avg });
                    break;
            }
        }
    }

    return val;
}
function OfflineChartdtList() {
    // chart list for single user
    //title,tsize,tfontname,tcolor,tbold,titalic
    //,width,height
    //,haxis(title,hsize,hfontname,hcolor,hbold,hitalic)
    //,vaxis(title,vsize,vfontname,vcolor,vbold,vitalic),legendposition
    //,filterlist,sortlist
    var List = [];
    //order data
    var srcname = "chart_sales"
    var opt_tit = ",14,malgun gothic,,,";
    var opt_wh = "100%,";
    var opt_vax = "mth,12,,,,";
    var opt_hax = "yr,10,,,,";
    var opt_leg = "top";
    //var optionlist=opt_tit+","+opt_wh+","+opt_vax+","+opt_hax+","+opt_leg;
    var xaxis = "odate";
    var xformat = "M/d";
    var series = "prodname";
    var vallist = "rev,sum";
    var filterlist = "";
    var sortlist = "0,false";
    var dt = createChartdt(List, "거래선별 실적", srcname, xaxis, xformat, series, vallist, "Column", opt_tit, opt_wh, opt_vax, opt_hax, opt_leg, filterlist, sortlist);
    List.push(dt);

    //marketinfo data
    //data=makeMarketinfoData();
    srcname = "chart_marketinfo";
    var opt_tit = ",16,,,,";
    var opt_wh = "100%,";
    var opt_vax = ",12,,,,";
    var opt_hax = ",12,,,,";
    var opt_leg = "left";
    //var optionlist=opt_tit+","+opt_wh+","+opt_vax+","+opt_hax+","+opt_leg;

    //optionlist=',16,,,,,100%,,,12,,,,,,12,,,,,left';
    xaxis = "infoname";
    xformat = "";
    series = "";
    vallist = "num,sum";
    filterlist = "";
    sortlist = "1,true";
    dt = createChartdt(List, "정보유형별구성", srcname, xaxis, xformat, series, vallist, "Pie", opt_tit, opt_wh, opt_vax, opt_hax, opt_leg, filterlist, sortlist);
    List.push(dt);
    return List;
}
function createChartdt(List, title, srcname, axislist, xformat, series, valuelist, ctype, opt_tit, opt_wh, opt_vax, opt_hax, opt_leg, filterlist, sortlist) {
    var dlist = {};

    dlist.id = "CT" + (1000 + List.length + 1);
    dlist.srcname = srcname;
    dlist.axis = axislist;
    dlist.xformat = xformat;
    dlist.series = series;
    dlist.value = valuelist;
    dlist.opt_tit = opt_tit;
    dlist.opt_wh = opt_wh;
    dlist.opt_vax = opt_vax;
    dlist.opt_hax = opt_hax;
    dlist.opt_leg = opt_leg;
    dlist.title = title;
    dlist.ctype = ctype;
    dlist.filterlist = filterlist;
    dlist.sortlist = sortlist;

    return dlist;
}
var w = $(window).width();
var h = $(window).height();
function createOption(opt_tit, opt_wh, opt_vax, opt_hax, opt_leg) {
    //optlist='test,100%,,mth,10,FF0000,yr,10,FF0000';
    var ht = $(window).height() - 100;
    var wth = "100%";
    var opt = opt_tit.split(',')
    var title = opt[0];
    var tsize = opt[1];
    if (opt[1] == "") tsize = 16;
    var tfname = opt[2];
    var tcolor = opt[3];
    if (tcolor == "") tcolor = "#1C1C1C";
    var tbold = opt[4];
    if (opt[4] == "") tbold = "false";
    tbold = getBool(tbold);
    var titalic = opt[5];
    if (opt[5] == "") titalic = "false";
    titalic = getBool(titalic);
    //orientation a step behind thus reverse!!
    /*
    if(window.orientation!=0)
    if(w>h)ht=w;
    else
    if(w<h)ht=w;*/

    /*
    if(opt[6]!="")wth=opt[6];
    if(opt[7]!="")ht=opt[7];*/
    opt = opt_vax.split(',')
    var vtitle = opt[0];
    var vsize = opt[1];
    if (opt[1] == "") tsize = 12;
    var vfname = opt[2];
    var vcolor = opt[3];
    if (opt[3] == "") vcolor = "#1C1C1C";
    var vbold = opt[4];
    if (opt[4] == "") vbold = "false";
    vbold = getBool(vbold);
    var vitalic = opt[5];
    if (opt[5] == "") vitalic = "false";
    vitalic = getBool(vitalic);

    opt = opt_hax.split(',')
    var htitle = opt[0];
    var hsize = opt[1];
    if (opt[1] == "") hsize = 12;
    var hfname = opt[2];
    var hcolor = opt[3];
    if (opt[3] == "") hcolor = "#1C1C1C";
    var hbold = opt[4];
    if (opt[4] == "") hbold = "false";
    hbold = getBool(hbold);
    var hitalic = opt[5];
    if (opt[5] == "") hitalic = "false";
    hitalic = getBool(hitalic);

    opt = opt_leg.split(',')
    var legend = "none";
    if (opt[0] != "") legend = opt[0];

    //if xaxis data format is datetime && not bar chart apply xformat
    var fname = valaxis().axis;
    var srcname = valaxis().src;
    var data = defaultData(srcname);
    var d = new Date(data[0][fname]);
    var vformat = "";
    var xformat = "";
    if (d instanceof Date && d != "Invalid Date") {

        switch (valaxis().ctype) {//charttype
            case "Bar":
                vformat = valaxis().xformat;
                break;
            default:
                xformat = valaxis().xformat;
                break;
        }
    }

    var combine = '{"title":"' + title + '","titleTextStyle": {"color": "' + tcolor + '","fontSize": ' + tsize + ',"fontName": "' + tfname + '","bold":' + tbold + ',"italic":' + titalic + '},"width":"' + wth + '","height":"' + ht + '"';
    //combine +=',"chartArea": {"left":10,"top":10,"width": "50%", "height": "70%"}';
    combine += ',"hAxis":{"title":"' + htitle + '","format": "' + xformat + '","textStyle":{"color":"' + hcolor + '","fontSize":' + hsize + ',"fontName": "' + hfname + '","bold":' + hbold + ',"italic":' + hitalic + '}}';
    combine += ',"vAxis":{"title":"' + vtitle + '","format": "' + vformat + '","textStyle":{"color":"' + vcolor + '","fontSize":' + vsize + ',"fontName": "' + vfname + '","bold":' + vbold + ',"italic":' + vitalic + '}}';
    combine += ',"legend":{"position":"' + legend + '","color":"#808080"},"gridline":{"color":"#808080"},"crosshair":{"trigger":"none"}}';
    //combine +=',""';

    return JSON.parse(combine);
}
function valaxis() {
    //returns lots of attributes of localStorage(googlechart)
    //e.g: valaxis().srcname;
    var chartlist = localStorage.getItem("googlechart");

    var axis = "";
    var xformat = "";
    var ser = "";
    var vallist = "";
    var srcname = "";
    var ctype = "";
    var sortlist = "";
    var filterlist = "";
    var axistype = "string";
    if (chartlist !== null) {
        var cht = JSON.parse(chartlist).data;
        for (i in cht) {
            if (cht[i].id == $("#inId").val()) {
                axis = cht[i].axis;
                xformat = cht[i].xformat;
                if (cht[i].series !== null)
                    ser = cht[i].series;
                vallist = cht[i].value;
                srcname = cht[i].srcname;
                ctype = cht[i].ctype;
                sortlist = cht[i].sortlist;
                filterlist = cht[i].filterlist;
            }
        }
    }
    var data = defaultData(srcname);
    var al = axis.split(',');
    var d = new Date(data[0][al[0]]);
    if (d instanceof Date && d != "Invalid Date") {
        axistype = "date";
    }

    return { axis: axis, series: ser, val: vallist, src: srcname, xformat: xformat, ctype: ctype, sortlist: sortlist, filterlist: filterlist, axistype: axistype }
}
function LaySort(a, b) {
    if (a.pos == b.pos) { return 0 } return a.pos > b.pos ? 1 : -1;
}
//#endregion
//#region from Mobile chart.html
    $("#tgl").click(function(){
                //$("#dvGoalChart").toggle();
                //$("#dvTable").toggle();
                //if(valaxis().axistype!="date")
                //$("#dvAxis").toggle();
                //$('div[id^="dvValue"]').toggle();
                if(paramshow=="none")
                        paramshow="block";
                else
                        paramshow="none";

                drawChart1();

                $("#dvTable").css("width","95%")
        });
        function googlechartRead(){
                var chartlist=localStorage.getItem("googlechart");
                if(chartlist !==null){
                        var cht=JSON.parse(chartlist).data;
                }
                return cht;
        }
        function chartEditRead(){
                //data,charttype,title,haxis,vaxis,legend
                var cht=googlechartRead();
                for(i in cht){
                        if(cht[i].id==$("#inId").val()){

                                $("#lbCharttype").html(cht[i].chartType);

                                var ops=cht[i].options;
                                $("#lbTitle").html(ops.title);

                                $("#lbVertical").html(ops.vAxis.title);
                                $("#lbHorizontal").html(ops.hAxis.title);
                                $("#selLegend").val(ops.legend.position);

                                populatePure("#selSrc",defaultDatasrc(),valaxis().src,cht[i].srcname);
                                $("#lbData").html($("#selSrc option:selected").text());
                                sortEdit();
                                var txt="";
                                $( "#olSort li" ).each(function( index ) {
                                txt += $(this).find('select option:selected').eq(0).text().capitalize()+" ";
                                txt += $(this).find('select option:selected').eq(1).text().toLowerCase()+",";
                            });
                            if(txt !="")txt=txt.substring(0,txt.length-1);
                            $("#lbSort").html(txt);
                            filterEdit();
                        }
                }
        }
        var chktime=0;
    function optionRead(){

        //title,tsize,tfontname,tcolor,tbold,titalic
        //,width,height
        //,haxis(title,hsize,hfontname,hcolor,hbold,hitalic)
        //,vaxis(title,vsize,vfontname,vcolor,vbold,vitalic),legendposition
              var legend="none",ctype="";
              var cht=googlechartRead();
                  for(i in cht){
                          if(cht[i].id==$("#inId").val()){

                                      ops=cht[i].options;
                                      ctype=cht[i].chartType;
                                      legend=ops.legend.position;
                                      switch($('#titlefrom').val()){
                                          case "mp": default:
                                                  var title=ops.title;
                                              var fontsize=ops.titleTextStyle.fontSize;
                                              if (fontsize=="")fontsize=16;
                                                  var fontname=ops.titleTextStyle.fontName;
                                                  if (fontname=="")fontname="arial";
                                              var color=ops.titleTextStyle.color;
                                              var bold=ops.titleTextStyle.bold;
                                              var italic=ops.titleTextStyle.italic;
                                          break;
                                          case "vx":
                                              title=ops.vAxis.title;
                                              fontsize=ops.vAxis.titleTextStyle.fontSize;
                                                  if (fontsize=="")fontsize=10;
                                              fontname=ops.vAxis.titleTextStyle.fontName;
                                              if (fontname=="")fontname="arial";
                                              color=ops.vAxis.titleTextStyle.color;
                                              bold=ops.vAxis.titleTextStyle.bold;
                                              italic=ops.vAxis.titleTextStyle.italic;
                                      break;
                                          case "hx":
                                                  title=ops.hAxis.title;
                                              fontsize=ops.hAxis.titleTextStyle.fontSize;
                                                  if (fontsize=="")fontsize=10;
                                              fontname=ops.hAxis.titleTextStyle.fontName;
                                              if (fontname=="")fontname="arial";
                                              color=ops.hAxis.titleTextStyle.color;
                                              bold=ops.hAxis.titleTextStyle.bold;
                                              italic=ops.hAxis.titleTextStyle.italic;
                                          break;
                                  }
                                  $("#selLegend").val(legend);
                                  $("#lbCharttype").html(ctype);
                                  //common default value
                              if (color=="")color="#000000";
                              if (bold=="")bold="false";
                              if (italic=="")italic="false";

                              $("#inTitle1").val(title);
                                $("#color1").val(color);
                                        $("#color1").change();

                                   if(chktime==0){
                                           $('input[name=cbBold]').attr('checked', getBool(bold));
                                           $('input[name=cbItalic]').attr('checked', getBool(italic));
                                   }

                                   else{
                                           $( "input[name=cbBold]" ).prop( "checked", getBool(bold) ).checkboxradio( "refresh" );
                                           $( "input[name=cbItalic]" ).prop( "checked", getBool(italic) ).checkboxradio( "refresh" );
                                   }

                              populatePure("#selSize","10,10px;12,12px;14,14px;16,16px;18,18px;20,20px;24,24px",fontsize,"");
                              $("#selSize").enhanceWithin();
                              populatePure("#selFont","arial,Arial;sanssarif,SansSarif;gulim,Gulim;dotum,Dotum;malgun gothic,MalgunGothic",fontname,"");

                              switch(ctype){
                                      case "PieChart": case "doughnut":
                                                $('#selLegend').append("<option value='labeled'>Labeled</option>")
                                                selectrefresh(selLegend);
                                        break;
                                        default:
                                        if( $("#selLegend option[value='labeled']").length ){
                                                $("#selLegend option[value='labeled']").remove();
                                                selectrefresh(selLegend);
                                        }

                                        break;
                                }


                    }
            }

            chktime++;
    }
    function optionUpdate(){
              var cht=googlechartRead();
                      for(i in cht){
                              if(cht[i].id==$("#inId").val()){

                                        ops=cht[i].options;
                                      cht[i].chartType=$("#lbCharttype").html();
                                      ops.legend={};
                                      ops.legend.position=$("#selLegend").val();

                                      switch($('#titlefrom').val()){
                                              case "mp": default:
                                                      cht[i].title=$("#inTitle1").val();
                                                      ops.title=$("#inTitle1").val();
                                                      ops.titleTextStyle={};
                                                      ops.titleTextStyle.color=$("#color1").val();
                                                      ops.titleTextStyle.fontSize=$("#selSize").val();
                                                      ops.titleTextStyle.fontName=$("#selFont").val();
                                                      ops.titleTextStyle.bold=false;
                                                      if($('input:checkbox[name=cbBold]').is(':checked')) ops.titleTextStyle.bold=true;
                                                      ops.titleTextStyle.italic=false;
                                                      if($('input:checkbox[name=cbItalic]').is(':checked')) ops.titleTextStyle.italic=true;

                                              break;
                                              case "vx":
                                                      ops.vAxis={};
                                                      ops.vAxis.title=$("#inTitle1").val();
                                                      ops.vAxis.titleTextStyle={};
                                                      ops.vAxis.titleTextStyle.color=$("#color1").val();
                                                      ops.vAxis.titleTextStyle.fontSize=$("#selSize").val();
                                                      ops.vAxis.titleTextStyle.fontName=$("#selFont").val();
                                                      ops.vAxis.titleTextStyle.bold=false;
                                                      if($('input:checkbox[name=cbBold]').is(':checked')) ops.vAxis.titleTextStyle.bold=true;
                                                      ops.vAxis.titleTextStyle.italic=false;
                                                      if($('input:checkbox[name=cbItalic]').is(':checked')) ops.vAxis.titleTextStyle.italic=true;

                                              break;
                                              case "hx":
                                                      ops.hAxis={};
                                                      ops.hAxis.title=$("#inTitle1").val();
                                                      ops.hAxis.titleTextStyle={};
                                                      ops.hAxis.titleTextStyle.color=$("#color1").val();
                                                      ops.hAxis.titleTextStyle.fontSize=$("#selSize").val();
                                                      ops.hAxis.titleTextStyle.fontName=$("#selFont").val();
                                                      ops.hAxis.titleTextStyle.bold=false;
                                                      if($('input:checkbox[name=cbBold]').is(':checked')) ops.hAxis.titleTextStyle.bold=true;
                                                      ops.hAxis.titleTextStyle.italic=false;
                                                      if($('input:checkbox[name=cbItalic]').is(':checked')) ops.hAxis.titleTextStyle.italic=true;

                                              break;
                                      }
                                      googlechartUpdate(cht);
                              }
                      }

    }
        function arraytoCSV(arr){
                var csv="";
                for(i in arr){
                        csv +=arr[i]+",";
                }
                return csv.substring(0, csv.length-1);
        }
        var chartEditor = null,chartdiv;
    function googleDataAjax(){

                var comp1=localStorage.getItem("login");
                var obj = eval("(" + comp1 + ")");
                  var comp=obj.comp;
                  var staff=obj.id;
                $.ajax({
                url: webserviceprefix+"/WebService.asmx/googleDataRequest",
                data: { comp: JSON.stringify(comp),staff: JSON.stringify(staff) },
                contentType: "application/json; charset=utf-8",
                dataType: "JSON",
                success: function (data, status) {
                        //if(JSON.stringify(data)!="{\"d\":\"ChartList fail\"}"){
                                //updategoogleData(data.d);
                                //alert(data.d)
                                localStorage.setItem("googledata",data.d);
                },
                error: function (response) {
                            var r = jQuery.parseJSON(response.responseText);
                            alert("Message: " + r.Message);
                            alert("StackTrace: " + r.StackTrace);
                            alert("ExceptionType: " + r.ExceptionType);
                }

        });


        }
        function updategoogleData(ondata){
                var exist=false;
                var data1=localStorage.getItem("googledata");
                var data = eval("(" + data1 + ")");

                ondata=JSON.parse(ondata);
                localStorage.setItem("googledata",JSON.stringify(ondata));
        }
        function updategoogleChart(ondata){
                var exist=false;
                var data=[];
                var set={};
                ondata=JSON.parse(ondata).data;

                for(i in ondata){
                        exist=false;
                        if(!exist){
                                data.push(convertGoogle(ondata[i]));
                        }
                }
                set.data=data;
                set.updated=new Date();
                localStorage.setItem("googlechart",JSON.stringify(set));

        }
        function convertGoogle(data){
                //googlechart list
                var set={};
                set.id=data.rdcode;
                set.srcname=data.SProcedure;
                var va=data.field;
                va=va.split(';');
                set.series="";
                for(i in va){
                        var v=va[i].split(',');
                        switch(v[0]){
                                case "dvCt1":
                                        set.axis=v[1];
                                break;
                                case "dvCt2":
                                        set.value=v[1]+","+data.Groupby;
                                break;
                                case "dvCt3":
                                        set.series=v[1];
                                break;
                        }
                }
                //////options////
                var ops=set.options={};
                //width
                ops.width="100%";
                //title
                ops.title=data.name;
                var ts=ops.titleTextStyle={};
                ts.fontSize=16;

                //vAxis
                var vx=ops.vAxis={};
                var vxts=vx.titleTextStyle={};
                vxts.fontSize=10;
                //hAxis
                var hx=ops.hAxis={};
                hx.title=data.Xtitle;
                var hxts=hx.titleTextStyle={};
                hxts.fontSize=10;
                //legend
                var legend=ops.legend={};
                legend.position=data.LegendPosition;
                //chartype
                var ctype=data.Charttype; if(ctype=="" | typeof data.Charttype == "undefined") ctype="line";
                set.chartType=convertCtype(ctype);
                /*
                set.opt_tit=data.name+",16,,,,";
                set.opt_wh="100%,";
                set.opt_vax=",12,,,,";
                set.opt_hax=data.Xtitle+",12,,,,";
                set.opt_leg=data.LegendPosition;
                set.title=data.name;
                set.ctype=convertCtype(data.Charttype);
                */
                var srt=data.Sorting;
                var collist="";
                var indx=0;
                collist=0+","+set.axis+";";
                indx++;
                if(set.series!=""){
                        collist+=1+","+set.series+";";
                        indx++;
                }
                var value="";
                if(set.value !="")val=set.value.split(';');
                for(j in val){
                        var v=val[j].split(',');
                        collist +=indx+","+v[0]+";";
                        indx++
                }
                if(collist !="")
                        collist=collist.substring(0,collist.length-1);

/*
                        collist: 0,chname;1,rev srtname: rev desc
                                collist: 0,infoname;1,num srtname: num desc
                                collist: 0,leadname;1,exprev srtname: */

                var srtname="";
                if(srt !=""){
                        srt=srt.split(' ');
                        var col=collist.split(';');
                        for(j in srt){
                                var sr=srt[j].split(',')
                                for(k in col){
                                        var co=col[k].split(',');

                                        if(sr[0]==co[1]){
                                                srtname+=co[0]+",";
                                                switch(sr[1]){
                                                        case "desc":
                                                                srtname +="false;";
                                                                break;
                                                        default:
                                                                srtname +="true;";
                                                                break;
                                                }
                                        }
                                }
                        }
                }
                if(srtname !="")srtname=srtname.substring(0,srtname.length-1);

                set.sortlist=srtname;
                set.filterlist="";
        return set;
}
    function convertCtype(ctype) {
        var rtn = ctype;
        if (rtn.indexOf("Chart") == -1) {
            rtn.substring(0, 1).toUpperCase() + rtn.substring(1) + "Chart";
        }
        return rtn;
    }
//#endregion

//#region googlechart edit
function googlechartEdit(pageid, options) {
    var cstyle, arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type;
    if (typeof options != "undefined") {
        if (options.hasOwnProperty('src')) src = options.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (options.hasOwnProperty('type')) type = options.type
        if (options.hasOwnProperty('gdt')) gdt = options.gdt;
        if (options.hasOwnProperty('ctrid')) id = options.ctrid;
        if (options.hasOwnProperty('code')) code = options.code;
        if (options.hasOwnProperty('rtnid')) rtnid = options.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
    }
    else {
        gdt = editDataFind(pageid, options);
        options = editoptionmake("googlechart", pageid, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
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
        if ($("#spdataajax").text() != "") {
            options.gdt.data = JSON.parse($("#spdataajax").text());
            options.gdt.data.datacode = options.gdt.data.code;
        }
    }
    else if ($("#spdataajax").text() != "") {
        options.gdt = {};
        options.gdt.data = JSON.parse($("#spdataajax").text());
        options.gdt.data.datacode = options.gdt.data.code;
    }
    chartdiv = pageid.replace("chart","");
    var conarr = {};
    conarr.id = "dveditback";// "container"+pageid;
    $("#dvchartedit").remove(); $('.fade').remove();
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting", "Action","Data","Style"];
    tabarr.options=["sortable"]
    var content = [];

    var chtlist = "<div id='dvChartlist'><table id='tbChartlist'></table><div id='dvChartlistpager'></div></div>";
    var chtdesign="<div id='dvChartDesign' style='padding:5px 0 5px 0;'></div>";
    var btnbottom = "<div id='tbbtn' style='clear:both;margin-top:10px'/>";
    content.push(chtdesign + chtlist+btnbottom);
    //content.push(eventEdit(pageid));
    content.push("<div id='dndcontain_googlechart' class='dndcontain'  />");
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);
    if ($.inArray(src,["list","externalsavelist"]) > -1) {
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
    googlechartDesign(pageid, options);
    googlechartDesignGrid(pageid,options);

    //tabclick event
     var tabb = $('#' + tabarr.id);
     var first = true,dtfirst=true,action=true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    if (options.hasOwnProperty("gdt") && options.gdt.hasOwnProperty("data")) {
                        var cdata = options.gdt.data;
                        //if datacode changed update....
                        options.gdt.data.datacode = $("#spDatacode").text();
                        if (cdata.datacode != $("#spDatacode").text()) {
                            cdata.datacode = $("#spDatacode").text();
                            cdata.filter = saveFilter("tbFilter");
                            var field = saveTable1("tbFilter");
                            var f = [], set = {};
                            $(field).each(function (i, k) {
                                if (k[5]) {
                                    f.push([k[5], k[0], k[4]]);
                                }
                            });
                            cdata.field = f;
                        }
                    }
                    else if ($("#spdataajax").text() != "") {
                        options.gdt = {};
                        options.gdt.data = JSON.parse($("#spdataajax").text());
                        options.gdt.data.datacode = options.gdt.data.code;
                    }
                    googlechartDesign(chartdiv,options);
                    googlechartDesignGrid(chartdiv,options);
                    break;
                case 1:
                    var dcode = "";
                    if (gdt.hasOwnProperty("data")) dcode = gdt.data.datacode;
                    if (dcode != $("#spDatacode").text()) reloadAction();
                    //3rd action
                    if (action) {
                        dndboxInit(gdt, 'googlechart');
                        action = false;
                    }
                case 2:
                    if (dtfirst) {
                        dataTabClick(pageid, options);
                        dtfirst = false;
                    }
                    break;
                case 3:
                    //3rd Tab style
                    if (first) {
                        if (typeof id == 'undefined') id = code;
                        cssEditInit("Style", id,"googlechart");
                        first = false;
                    }
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['googlechartedit', 'action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'googlechartedit');
    helpinsert();

    //button init
    $("input[type='button']").button();
    $("button").button();
    $("#" + pageid).removeClass("roundbox1");
}
function googlechartEditSave(id,options) {
    //var ids = $("#jqtable").jqGrid('getDataIDs');
    //for (i in ids) { var list = $("#jqtable").getRowData(ids[i]);  }
//    var cht = googlechartRead();
//    for (i in cht) {
//        if (cht[i].id == $("#inId").val()) {
//            cht[i].options = opt;
//            cht[i].options.width = "100%";
//            cht[i].chartType = editor.chartType;
//        }
//    }
    //googlechartUpdate(cht);
    //UpdateChartObject('layout', design);
    googlechartDesignSave(id,options);
}
function googlechartDesign(id,options) {
    var datacode = "";

    //filed data create
    var gdt, dataobj,dt=[];
    //dataobj=readdata(id,'',options);
    //gdt=readdata(id,"gdt",options)
    if (options.hasOwnProperty("gdt")) {
        gdt = options.gdt;
        if (gdt.hasOwnProperty("data"))
            dataobj = gdt.data;
    }
    
    if ($("#spdlist").text() != "") {
         dt = JSON.parse($("#spdlist").text())
    }
    $("#dvChartDesign").show();
    $("#dvChartlist").hide();
    $("#inpList_cht").attr("onclick", "multipleEdit('')");
    $("#inpList_cht").attr("value", "New");
    //$("#inpCancel_cht").hide();
    $("#inpSave_cht").hide();

    var left = $("#dvChartDesign");
    left.empty();
    var style = " #ulsrc, #ulValue,#ulAxis, #ulSeries { border: 1px solid gray;list-style-type: none;margin: 0; padding: 5px 5px 0 0;float: left;margin-right: 10px;}";
    style += "#ulsrc{min-height:150px;max-height:300px;overflow-y:scroll;overflow-x: hidden; width: 180px;}";
    style += "#ulValue{min-height:35px;width:260px;padding-left:55px;background-image: url('/images/bg_value.png');background-repeat:no-repeat; !important;}";
    style += "#ulAxis{min-height:35px;width:260px;padding-left:55px;background-image: url('/images/bg_x.png');background-repeat:no-repeat; !important;}";
    style += "#ulSeries {min-height:35px;width:260px;padding-left:55px;background-image: url('/images/bg_series.png');background-repeat:no-repeat; !important;}";
    style += "#ulsrc li, #ulValue li,#ulAxis li, #ulSeries li {margin: 0 5px 5px 5px;padding: 2px;font-size: 1em;width: 150px;cursor:pointer;}";
    style += "#ulsrc li.ui-sortable-helper, #ulValue li.ui-sortable-helper,#ulAxis li.ui-sortable-helper, #ulSeries li.ui-sortable-helper {cursor:move;}";
    style += ".editimg{opacity:1}";
    style += ".editimg:hover{cursor:pointer;background: url(/images/pencil-icon.png) no-repeat;opacity:0.3;}";
    styleInsert("chartdrop-style", style);

    //columnlist,columntype push to list

    var list = [], imsi = [];
    var ulsrc = $("<ul id='ulsrc' class='connectedSortable'></ul>"),
        ulValue = $("<ul id='ulValue' class='connectedSortable'></ul>"),
        ulAxis = $("<ul id='ulAxis' class='connectedSortable'></ul>"),
        ulSeries = $("<ul id='ulSeries' class='connectedSortable'></ul>"),
        jqgrid = "<table id='jqtable'/><div id='jqpager'/>",
        chtimg = "<img src='/images/chart/google/linechart.png' style='height:200px' class='imexpand'/>",

        dvcht = $("<div id='dvChtedit' style='height:200px;position:relative;'  class='editimg'>" + chtimg + "</div>"),

    li, dv, tb, tr, td, left, chk = false;
    if (dt.length > 0) {
        $.each(dt[0], function (i, k) {
            var ftype = fieldTypeFind(dt, i);
            imsi = [];
            var img;
            switch (ftype.type) {
                case "string":
                    img = "string1.gif";
                    break;
                case "datetime":
                    img = "datetime.png";
                    break;
                case "number":
                    img = "int.gif";
                    break;
                case "boolean":
                    img = "checkbox1.png";
                    break;
            }
            imsi.push(ftype.type, img, i)
            list.push(imsi);
        });
        //fieldlist box create
        $.each(list, function (i, k) {
            li = $("<li class='ui-state-default'></li>");
            li.html("<img style='padding-right:3px;' id='" + k[0] + "'  src='/images/" + k[1] + "'/>" + k[2]);
            if (typeof gdt != "undefined" && gdt.hasOwnProperty('layout') && gdt.layout.length > 0)
                $.each(gdt.layout, function (j, l) {
                    if (k[2] == l.field) {
                        switch (l.type) {
                            case "Value":
                                ulValue.append(li);

                                break;
                            case "Axis":
                                ulAxis.append(li);

                                break;
                            case "Series":
                                ulSeries.append(li);

                                break;
                        }
                        return false;
                    }
                    else
                        ulsrc.append(li);
                });
            else
                ulsrc.append(li);
        });
    }
   //table layout
    dv = $("<div></div>");
    left.append(dv);
    dv.append(ulsrc);
    tb = $("<table width='580px'/>");
    tr = $("<tr />");
    td = $("<td>" + ulValue.outerHTML() + "</td>");
    tb.append(tr);
    tr.append(td);

    tr = $("<tr />");
    tb.append(tr);
    td = $("<td>");
    td.append(dvcht);
    tr.append(td);

    tr = $("<tr />");
    tb.append(tr);
    td = $("<td style='vertical-align:top;'>" + ulSeries.outerHTML() + "</td>");
    tr.append(td);

    tr = $("<tr />");
    tb.append(tr);
    td = $("<td>" + ulAxis.outerHTML() + "</td>");
    tr.append(td);
    dv = $("<div></div>");
    dv.append(tb);
    var dv1 = $("<div>" + jqgrid + "</div>");
    //var dv1 = $("<div style='clear:both'>" + jqgrid + "</div>");
    //dv.append(dv1);
    //left.append(dv);

    var arr = {};// {id,header,content,options}
    arr.id = "accord1";
    arr.head = ["Layout", "Table"];
    var content = [];
    content.push(dv.outerHTML());
    content.push(dv1.outerHTML());
    arr.content = content;
    var wrap = $("<div style='float:left;'/>");
    wrap.append(makeAccordion(arr));
    left.append(wrap);
    if (typeof (gdt) != "undefined") {
        if (gdt.hasOwnProperty('layout') && gdt.layout.length > 0) {
            $("#dvChtedit").empty();
            
            drawChart1('dvChtedit',gdt);
        }
    }
    $("#ulsrc, #ulValue,#ulAxis, #ulSeries").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();
    $(".connectedSortable").droppable({
        drop: dropCallback,
        greedy: true

    });
    function dropCallback(e, ui) {
        setTimeout(googlechartDesignGrid, 0);
    }
    $("#dvChtedit").click(function () {
        if (options.hasOwnProperty("src")) gdt.src = options.src;
        if (gdt.data.hasOwnProperty("datacode") && gdt.data.datacode == "undefined" && $("#spdataajax").text()!="")
            gdt.data=JSON.parse($("#spdataajax").text())
        checkAllset(id, gdt);//onclick=\"checkAllset('" + id + "');\"
    });
}
function checkAllset(pageid, options) {
    var ulValue = $("#ulValue"), ulAxis = $("#ulAxis");
    var chk = false;
    var ullist=[ulValue,ulAxis];
    $.each(ullist, function (i, k) {
        if ($(k).children().length > 0)
            chk = true;
        else
            chk = false;
    });
    if (chk) {
        options.stay = true;
        googlechartDesignSave(pageid, options);
        console.log(options)
        drawChart1('edit',options);
        }
        else{
        styleInsert("dialog-css",".ui-dialog { z-index: 1000 !important ;}");
       var dia = $("<div id='dvdia' title='Alert'>" +
      "<p>Please Complete Variable setting !!</p>" +
    "</div>");
       dia.appendTo('body');
       dia.dialog({
           buttons: {
               Ok: function () {
                   $(this).dialog("close");
               }
           }
       });
    }
}
function googlechartDesignGrid(id,options) {
    var list = ["#ulValue", "#ulAxis", "#ulSeries"];
    console.log(id,options)
    var columnlist = [];
    for (i in list) {
        var rtn = $(list[i]).find('li');
        $.each(rtn, function (j, k) {
            var imsi = [];
            if (typeof $(list[i]).attr("id") != "undefined") {
                var type = $(list[i]).attr("id").substring(2);
                imsi.push($(k).text(), type, $($(k)[0].innerHTML).attr("id"));
                columnlist.push(imsi);
            }
        });
    }
    var gridid = "jqtable";
    var pagerid = "jqpager";

    //gridid,pagerid,data만으로 구성되는 data display용 jqgrid
    $("#" + gridid).jqGrid("GridUnload");
    var colmodel = [], colname = [], list = [], arrdt = [];
    var colname = ['field', 'type', 'datatype', 'Format', 'Sort', 'asc', 'order', 'Sum', ''];

    var gdt, dataobj;
    gdt = readdata(id, "gdt", options);
  

    for (j in columnlist) {
        var row = {};
        var exist = false;
        if (typeof gdt != "undefined" && gdt.hasOwnProperty('layout')) {
            $.each(gdt.layout, function (i, k) {
                if (k.field == columnlist[j][0] && k.type == columnlist[j][1]) {
                    row = k;
                    exist = true;
                    return false;
                }
            });
        }
        if (!exist) {
            var sum = '';
            var format = '';

            if (columnlist[j][1] == "Value") sum = 'sum';
            switch (columnlist[j][2]) {
                case "datetime":
                    format = "yy/MM/dd";
                    break;
                case "number":
                    format = "0";
                    break;
            }
            row = { field: columnlist[j][0], type: columnlist[j][1], datatype: columnlist[j][2], Format: format, Sort: "", asc: "", order: "", Sum: sum, action: "" };
        }
        if (typeof columnlist[j][0] != "undefined")
            arrdt.push(row);
    }


    for (i in colname) {
        var list = {};
        list.name = colname[i];
        list.editable = true;
        switch (colname[i]) {
            case "field": case "type": case "datatype":
                list.editable = false;
                list.width = 50;
                break;
            case "Format":
                list.edittype = "select";
                list.width = 60;
                list.editoptions = { value: "Left:left;Center:center;Right:right" };
                break;
            case "Sort":
                list.edittype = "checkbox";
                list.formatter = "checkbox";
                list.width = 30;
                list.editoptions = { value: "Yes:" };
                break;
            case "asc":
                list.edittype = "select";
                list.width = 60;
                list.editoptions = { value: "Asc:asc;Desc:desc" };
                break;
            case "order":
                list.editable = true;
                list.width = 30;
                break;
            case "Sum":
                list.edittype = "select";
                list.width = 60;
                list.editoptions = { value: "Sum:sum;Avg:avg" };
                break;

            case "":
                list.width = 50;
                list.fixed = true;
                list.sortable = false
                list.resize = false;
                list.formatter = 'actions';
                list.formatoptions = { size: 12, keys: true,delbutton:false };
                list.editable = false;
                break;
        }
        if(list.hasOwnProperty("name") && typeof list.name!="function")
        colmodel.push(list);
    }
    var options = {
        colNames: colname,
        colModel: colmodel,
        datatype: "local",
        data: arrdt,
        height: "auto",
        autowidth: true,
        rowNum: 5,
        rowList: [5, 10, 20, 30],
        pager: pagerid,
        //caption: "Data View",
        sortable: true,
        onSelectRow: function (rowid) {
            var val = "<option value='0'>0</option><option value='0.0'>0.0</option><option value='0.00'>0.00</option><option value='%'>%</option>";
            var dtime = "<option>select</option><option value='dayofyear'>DayofYear</option><option value='month'>Month</option>" +
                        "<option value='year'>Year</option><option value='yy/MM'>yy/MM</option><option value='yy/MM/dd'>yy/MM/dd</option><option value='MM/dd'>MM/dd</option>";

            var celValue = $(this).jqGrid('getCell', rowid, 'datatype');
            switch (celValue) {
                case "number":
                    $('#' + rowid + '_Format')[0].innerHTML = val;
                    break;
                case "datetime":
                    $('#' + rowid + '_Format')[0].innerHTML = dtime;
                    $('#' + rowid + '_Sum')[0].innerHTML = "<option>N/A</option>";
                    break;
                case "string":
                    $('#' + rowid + '_Format')[0].innerHTML = "<option>N/A</option>";
                    $('#' + rowid + '_Sum')[0].innerHTML = "<option>N/A</option>";
                    break;
            }
        },
        gridComplete: function () {

        }
    };
    jQuery("#" + gridid).jqGrid(options);
    jQuery("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
        caption: "Edit",
        buttonicon: "ui-icon-circle-plus",
        onClickButton: function () {
            var ids = $("#" + gridid).jqGrid('getDataIDs');
            for (var i = 0; i < ids.length + 1; i++) { var list = $("#" + gridid).getRowData(ids[i]); }
        }
    });

}
function googlechartDesignSave(id,options) {
    var gridid = "jqtable";
    var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
    var design = [],set;
    for (var i = 0; i < ids.length; i++) {
        var cl = ids[i];
        var rowarr = jQuery("#" + gridid).getRowData(cl);
        set = {};
        $.each(rowarr, function (i, k) {
            set[i] = k;
        });
        design.push(set);
    }
    UpdateChartObject(id,'layout', design,options);
}
function UpdateChartObject(id,objname,objdata,options) {
    var setting = {}, grid = [], design = {}, tab = [], optjson, src = "";

    if (typeof options !='undefined' && options.hasOwnProperty("src"))
        src = options.src;
    var combine = saveData(true);
    combine[objname] = objdata;
    combine.ctrtype = 'googlechart';
    if ($(".dnd").length > 0)
        combine.eventlist = dndevtlist("googlechart");
    console.log('id',id,'src', src,'combine', combine,'options', options);
    commonsave(id, src, combine, options);
}
//#endregion

//#region multiple control select
function multipleEdit(pageid) {

    //chartid from pageid
    var gdt = imctableAjaxRead(pageid);
    var datacode = "", chartid;
    if (typeof(gdt)!="undefined" && gdt.datacode) datacode = gdt.datacode;
    var chartid = gdt.chartid;
    var stype = 'portlet'; //  get.stype;
    var conarr = {};
    conarr.id = "dvchartedit";
    $("#" + conarr.id).remove(); $('.fade').remove();
    //tab create
    var content = [];
    var btn = "<div style='padding:5px;text-align:right;'>";
    btn += "<input id='inList_cht' type='button' value='List' class='btnRoundsmall' onclick=\"googlechartList();\"/>";
    btn += "<input id='inSave_cht' type='button' value='Render' class='btnRoundsmall' onclick=\"chartSave();\"/>&nbsp;";
    btn += "<input id='inSave_cht' type='button' value='Save' class='btnRoundsmall' onclick=\"chartSave();\"/>&nbsp;";
    btn += "<input id='inpCancel_cht' type='button' value='Cancel' class='btnRoundsmall' onclick=\"$('#" + conarr.id + "').remove();$('.fade').remove();menutoggle='admin';\"/></div>";

    var code = "<div>Code:<label id='lbcode'>" + pageid + "</label></div>";
    var edit = "Display:<select onchange='multipleTypechange($(this).val())'><option value='portlet'>None</option><option value='tab'>Tab</option><option value='accordion'>Accordion</option></select><div id='dvCharteditbody' style='height:100px;padding:5px;'></div>";
    var btnbottom = "<div style='clear:both;text-align:right;'>" + btn + "</div>";
    var chtlist = "<div id='dvChartlist'><table id='tbChartlist'></table><div id='dvChartlistpager'></div></div>";
    var chtdesign = "<div id='dvChartDesign' style='padding:5px 0 5px 0;background-color:white;'>" + code + edit + btnbottom + "</div>";
    setTimeout(function () { multipleTypechange('portlet') }, 0);

    //container complete
    conarr.body = chtdesign + chtlist;
    var container = makeContainer(conarr);

}
var chtlist = [];
function multipleTypechange(type) {
    var dvc, dvh, dv, style;

    $("#dvCharteditbody").empty();
    switch (type) {
        default: case 'portlet':
            style = ".column {width: 270px;float: left;padding-bottom: 100px; }";
            style += ".portlet {    margin: 0 1em 1em 0;padding: 0.3em;}";
            style += ".portlet-header {    padding: 0.2em 0.3em;margin-bottom: 0.5em;position: relative;  }";
            style += ".portlet-toggle {    position: absolute;top: 50%;right: 0;margin-top: -8px;  }";
            style += ".portlet-content {    padding: 0.4em;  }";
            style += ".portlet-placeholder {    border: 1px dotted black;margin: 0 1em 1em 0;height: 50px;  }";
            styleInsert("portlet-css", style);
            dvc = $("<div/>");
            dvc.attr("class", "column");
            dvc.append(dvh);
            $.each(chtlist, function (i, k) {
                dvh = $("<div/>");
                dvh.attr("class", "portlet");
                dv = $("<div/>");
                dv.attr("class", "portlet-header");
                dv.text(k.title);
                dvh.append(dv);
                dv = $("<div/>");
                dv.attr("class", "portlet-content");
                dv.text(k);
                dvh.append(dv);
                dvc.append(dvh);
            });
            $("#dvCharteditbody").append(dvc);
            $(".column").sortable({
                connectWith: ".column",
                handle: ".portlet-header",
                cancel: ".portlet-toggle",
                placeholder: "portlet-placeholder ui-corner-all",
                stop: function (event, ui) {

                },
                //tab order change & save state
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
            break;
        case 'tab':
            var tabarr = {}
            tabarr.id = "tab-stype";
            tabarr.head = [];
            tabarr.content = [];
            tabarr.options = ["sortable"];
            $.each(chtlist, function (i, k) {
                tabarr.head.push(k.title);
                tabarr.content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td></tr></table>");
            });
            $("#dvCharteditbody").append(makeTab(tabarr));
            break;
        case 'accordion':
            var tabarr = {}
            tabarr.id = "accord1";
            tabarr.head = [];
            tabarr.content = [];
            tabarr.options = ["sortable"];
            $.each(chtlist, function (i, k) {
                tabarr.head.push(k.title);
                tabarr.content.push("<table width='100%'><tr><td style='width:200px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td></tr></table>");
            });
            $("#dvCharteditbody").append(makeAccordion(tabarr));
            break;
    }
}
function multipleChartselect(gridid) {
    chtlist = [];
    var ids = $("#" + gridid).jqGrid('getGridParam', 'selarrrow');
    for (i in ids) {
        chtlist.push($("#" + gridid).getRowData(ids[i]));
    }
    multipleEdit('');
}
//#endregion
//#endregion

//#region jstree edit
function jstreeEdit(jsid,option) {
    var cstyle, arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type;
    if (typeof option != "undefined") {
        if (option.hasOwnProperty('src')) src = option.src;//list:from archivelist,temp:return from list to previous status without new selection,undefined:normal edit from imctable
        if (option.hasOwnProperty('type')) type = option.type
        if (option.hasOwnProperty('gdt')) gdt = option.gdt;
        if (option.hasOwnProperty('ctrid')) jsid = option.ctrid;
        if (option.hasOwnProperty('code')) code = option.code;
        if (option.hasOwnProperty('rtnid')) rtnid = option.rtnid;//previous control id that moved to current stage(ex: mapedit->contentEdit)
        if (option.hasOwnProperty('archive')) archive = option.archive;
        if (src == "temp") {
            //if(!option.hasOwnProperty("archive"){

            //}
        }
    }
    else {
        gdt = editDataFind(jsid, option);
        option = editoptionmake("jstree", jsid, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
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
    }

    var conarr = {};
    conarr.id = "dveditback";// "container"+jsid;
    //tab create
    var tabarr = {};
    if ($("#tab-Contain").length > 0) {
        $("#tab-Contain").remove();
        $("#EditTab").remove();
    }
    tabarr.id = "tab-Contain";
    tabarr.head = ["Setting", "Action","Data","Style"];
    var content = [];

    content.push("<table width='100%'><tr><td style='width:250px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
    "<td style='vertical-align:top;'><div style='margin:0 0 10px 0'><button type='button' id='btnpreview'>Preview</button></div><div id='dvtx' style='display:block;padding:5px;'>" +
    "<textarea id='txjsedit' rows='20' cols='13' style='width:100%;'></textarea></div></td></tr><tr><td id='tbbtn' colspan='2'></td></tr></table>");
    //content.push(eventEdit(jsid));

    content.push("<div id='dndcontain_jstree' class='dndcontain'  />");
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);

    if (src.indexOf("list")>-1) 
        archivegdtReload(tab);
    else {
        var conarr = {};
        conarr.id = "dveditback";// "container" + id;
        //container complete
        conarr.body = tab;
        var container = makeContainer(conarr);
    }
    $("#tbbtn").append(editbutton(option));
    //jqgrid scheme & srcdata
    // var gdt = imctableAjaxRead(jsid);
    var datacode = "",gdtdt;
    if (typeof (gdt) != "undefined" && gdt.data) {
        gdtdt = gdt.data;
        datacode = gdtdt.datacode;
    }

    //tabclick event
    var tabb = $('#' + tabarr.id),dtsrc=true;
    var first = true,first1=true,action=true;
    tabb.tabs({
        activate: function (event, ui) {
            var $activeTab = tabb.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                        $("#dvtable").siblings().remove();
                        var bttn = $("<div class='imdim' style='float:right;'><i class='fa fa-rotate-right'/>&nbsp;reload</div>");
                        if ($("#dvtable").find(".fa-rotate-right").length==0)
                        $("#dvtable").prepend(bttn);
                        $(".fa-rotate-right").parent().click(function () {
                            $("#dvtable").empty();
                            var gdt1 = readdata(jsid, 'gdt', option);
                            if ($("#spDatacode").text() != "") datacode = $("#spDatacode").text();
                            jsonReadAjax("imcdata", "", "code", datacode, jstreeEditTable, [jsid, gdt]);
                            // jstreeEditTable(jsid, gdt1);
                            $("#dvtable").prepend(bttn);
                        });

                        break;
                case 1:
                    var dcode = "";
                    if (gdt.hasOwnProperty("data")) dcode = gdt.data.datacode;
                    if (dcode != $("#spDatacode").text()) reloadAction();
                    //3rd action
                    if (action) {
                        dndboxInit(gdt, 'jstree');
                        action = false;
                    }
                case 2:
                    if (dtsrc) {
                        dataTabClick(jsid, option);
                        dtsrc = false;
                    }
                   
                    break;
                case 3:
                    //3rd Tab style
                    if (first) {
                        if (typeof id == 'undefined') id = code;
                        cssEditInit("Style", id,option.type);
                        first = false;
                    }
                    break;
            }
            var dtid = 'admin&2&j160112153427';
            if ($("#spdataajax").length > 0) dtid = 'data_select';
            var hp = ['jstreeedit', 'action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
            tabb.attr("help", hp[$activeTab]);
        }
    });
    tabb.addClass('helpinsert');
    tabb.attr("help", 'jstreeedit');
    helpinsert();
    //button init
    $("input[type='button']").button();
    $('button').button();
    //jstreePreview(gdt);
    $('#btnpreview').on("click", function () { 
        jstreePreview(gdt);
    });
    if (datacode != "")
        jsonReadAjax("imcdata", "", "code", datacode, jstreeEditTable, [jsid, gdt]);
    else
        jstreeEditTable("", jsid, gdt);
}
function jstreeEditTable(data,jsid, gdt) {
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle", sty);
    var parent = "", topnode = "",topname="Top", iconpic="",value = "", text = "", width = "150", textbox = "tx"+jsid, valuebox = "inp"+jsid, display = "none", plugin = "", icon = "",dt,dtfst,datacode;
    if (data != "") {
        if (data.hasOwnProperty("code")) datacode = data.code;
        else datacode = data.datacode;
        dt = datalistreturn(data);
        if(dt.length>0)dtfst=dt[0]
        var columnlist = [];
        $.each(dtfst, function (i, k) {
            columnlist.push(i + "," + i);
        });
        columnlist.unshift("select,");
        var st = gdt.setting;
        if (st) {
            if (st.parent != "") parent = st.parent;
            if (st.topnode != "") topnode = st.topnode;
            if (st.topname != "") topname = st.topname;
            if (st.iconpic != "") iconpic = st.iconpic;
            if (st.value != "") value = st.value;
            if (st.text != "") text = st.text;
            if (st.width != "") width = st.width;
            if (st.textbox != "") textbox = st.textbox;
            if (st.valuebox != "") valuebox = st.valuebox;
            if (st.display != "") display = st.display;
            if (st.plugin != "") plugin = st.plugin;
            if (st.icon != "") icon = st.icon;
        }
    }
    function makevaluefield(dt, colfield) {
        var rtn=[];
        $(dt).each(function (i, k) {
            rtn.push(k[colfield]);
        });
        return rtn;
    }
    //makeCtr(type, value, id, clas, style,attribute)

    //options={placeholder:"-- select --",selected:[code array],disabled:[code array],multiple:false,
    // width:200,multiplewidth:55,selectAll:false,single:true,position:top,filter:true,isOpen:true,keepOpen:true, styler: function(value) {
    //if (value == '1') {return 'background-color: #ffee00; color: #ff0000;';}}}
    //plugin(contextmenu,types,dnd,json_data,checkbox),display(popup,dropdown,none),icon(default,iconname,url),ajax(true/false),

    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["parent", makeCtr(["select", InsertSelected(dtfst, parent), "selParent", "ingrp", ""])]
    , ["topnode", makeCtr(["span", , "spTopnode", "container", ])]
    , ["topname", makeCtr(["input", topname, "inTopname", "inp", ])]
    , ["value", makeCtr(["select", InsertSelected(dtfst, value), "selValue", "inp", ])]
    , ["text", makeCtr(["select", InsertSelected(dtfst, text), "selText", "inp", ])]
    , ["icon", makeCtr(["select", InsertSelected(dtfst, icon), "selIconfield", "inp", "onchange:insertIconTable('" + datacode + "',$(this),'')"])]
    , ["iconpic", makeCtr(["input", iconpic, "iniconpic", "width:60%;", ]) + "&nbsp;" + makeCtr(["i", "fa fa-external-link-square imdim", , "", "onclick:iconDialog(this,'" + jsid + "')"])]
    , ["width", makeCtr(["input", width, "", "inp", ])]
    , ["textbox", makeCtr(["input", textbox, "", "inp", ])]
    , ["valuebox", makeCtr(["input", valuebox, "", "inp", ])]
    , ["display", makeCtr(["select", "select,;dialog;dropdown;none", "selDisplay", "inp", ])]
    , ["plugin", makeCtr(["select", "checkbox;contextmenu;dnd;massload;search;sort;state;types;unique;wholerow", "selPlugin", "multiselect", ])]
    ]
    var tb = makeTable("tes1", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="reloadTable(\"\")" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","style":"text-align:right;"}'];
    var tb1 = appendFooter(tb, foot);

    $("#dvtable").append(tb1);
    $("#selParent").val(parent);
    $("#selValue").val(value);
    $("#selText").val(text);
    $("#selIconfiled").val(icon);
    $("#selDispaly").val(display);

    $('.indent').parent().parent().hide();
    setTimeout(function () {
        $(".multiselect").multipleSelect({
            width: 150
        });
    }, 0);
    setTimeout(function () {
        if(plugin!="")
        $("#selPlugin").multipleSelect("setSelects", plugin);
        $("#selDisplay").val(display);
        if(datacode!="" && typeof datacode !="undefined")
            findTopnode(datacode, $("#selParent"), topnode);
        $("#selParent").on("change", function () {
            if ($("#spDatacode").text() != "")
                datacode = $("#spDatacode").text();
            findTopnode(datacode, $("#selParent"), '');
        });
    }, 100);
}
function iconDialog(that,jsid) {
    var top = "", def = "", parent = "";
    if ($("#dvIcon").length > 0) $("#dvIcon").remove();
    var dv = $("<div id='dvIcon' style='z-index:103;'/>");

    //default icon setting
    var iconpic = $("#iniconpic").val();
    if (iconpic != "undefined" && iconpic != "") {
        iconpic = JSON.parse(iconpic);
        if (iconpic.hasOwnProperty("Top")) top = iconpic.Top;
        if (iconpic.hasOwnProperty("Default")) def = iconpic.Default;
        if (iconpic.hasOwnProperty("Parent")) parent = iconpic.Parent;
    }
    var data = [
        [makeCtr(["span", "Position", , , ]), makeCtr(["span", "icon/url", , , ])]//headers
   , ["Top", makeCtr(["input", top, "inTopicon1", "", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "", "btnRoundsmall", "onclick:faLoad('inTopicon1')"])]
   , ["Default", makeCtr(["input", def, "inDeficon1", "", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "", "btnRoundsmall", "onclick:faLoad('inDeficon1')"])]
   , ["Parent", makeCtr(["input", parent, "inParenticon1", "", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "", "btnRoundsmall", "onclick:faLoad('inParenticon1')"])]
   ];
    var tb = makeTable("tbIcon1", data, "");
    dv.append($("<div style='margin-top:10px;'>icon by position</div>"));
    dv.append(tb);

    //icon field지정시
    data = [];
    var valuelist = [];
    //var gdtdata=readdata(jsid)
    //var datacode = gdtdata.datacode;
    //var dt = selectimcdata("imcdata", datacode).datalist;
    var dsc = $("#spdataajax").text();
    var dtlist = $("#spdlist").text();
    if(dsc!=""){
        var dt = applyFilter(JSON.parse(dtlist),JSON.parse(dsc).filter);
        var ftype = fieldTypeFind(dt, $("#selIconfield").val());
        $($.unique(ftype.valuelist)).each(function (i, k) {
            var iconval = ""; if (iconpic.hasOwnProperty(k)) iconval = iconpic[k];
            var row = [k, makeCtr(["input", iconval, "in" + k, , ]) + "&nbsp;"
            + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnediticon", "btnRoundsmall", "onclick:faLoad('in" + k + "')"])]
            data.push(row);
        });
        data.unshift([makeCtr(["span", "types", , , ]), makeCtr(["span", "icon/url", , , ])]); //headers
    }
    var tb = makeTable("tbIcon2", data, "general");
    dv.append($("<div style='margin-top:10px;'>icon type setting</div>"));
    dv.append(tb);

    //dialog
    dv.dialog({
        width: 350,
        autoResize: true,
        appendTo:"#Setting",
        modal: true,
        autoOpen: true,
        title: "icon setting",
        position: top,
        stack: false,
        close: function (event, ui) {
            $("#container" + jsid).show();
            $(this).dialog('destroy').remove();
        },
        buttons: [
        {
            text: "Apply",
            icons: {
                primary: "ui-icon-check"
            },
            click: function () {
                var arr1 = saveTable("tbIcon1"), arr2 = saveTable("tbIcon2"), iconpic1 = {};
                $($.merge(arr1, arr2)).each(function (index, val) {
                    iconpic1[val[0]] = val[1];
                });
                $("#iniconpic").val(JSON.stringify(iconpic1));
                $(this).dialog('destroy').remove();
                $("#container" + jsid).show();
            }
        },
        {
            text: "Close",
            icons: {
                primary: "ui-icon-close"
            },
            click: function () {
                $(this).dialog('destroy').remove();
                $("#container" + jsid).show();
            }
        }
  ]
    });


    $("#dvIcon").parent().css("z-Index", 1300);
    $("#dvIcon").parent().css("left", centerpos($("#dvIcon")).width);
    $("#dvIcon").parent().css("top", centerpos($("#dvIcon")).height);
    $("#dvIcon").parent().css("position", "fixed");
    $("#container" + jsid).hide();
}
function centerpos(that) {
    var w = window.innerWidth / 2;
    var h = window.innerHeight / 2;
    w = w-parseInt($(that).css("width").replace("px",""))/2;
    h = h - parseInt($(that).css("height").replace("px", ""))/2;

    return { width: w, height: h };
}
function findTopnode(datacode, that, selected) {
    findTopnode.datasrc = datasrc;
    var valuelist = [{ text: "No select", value: "" }];
    //jsonReadAjax("imcdata", "", "code", datacode, findTopnode.datasrc, [that, selected]);
    var dsrc = $("#spdataajax").text();
    if(dsrc!="")datasrc(JSON.parse(dsrc),that,selected)
    function datasrc(dtsrc, that, selected) {
        // var dt = dtsrc.datalist;
        var dtlist = $("#spdlist").text();
        if (dtlist != "") dtlist = JSON.parse(dtlist);
        var dt = applyFilter(dtlist, dtsrc.filter);// datalistreturn(dtsrc);
        var ftype = fieldTypeFind(dt, that.val());
        $($.unique(ftype.valuelist)).each(function (i, k) {
            var set = {};
            set.text = k;
            set.value = k;
            if (k != "#")
                valuelist.push(set);
        });
        var sel = makeSelect(valuelist, ["", "value", "text"]);
        //$(sel).attr("onchange", "findNodeName('"+datacode+"',$(this))");
        $("#spTopnode").empty();
        $("#spTopnode").append($(sel));
        $(sel).val(selected);
    }
}
function insertIconTable(datacode, that) {
    var data = [];
    var valuelist = [];
    var dt = selectimcdata("imcdata", datacode).datalist;
    var ftype = fieldTypeFind(dt, that.val());
    $($.unique(ftype.valuelist)).each(function (i, k) {
        var row = [k, makeCtr(["i", , , "in"+k, ])+"&nbsp;"+makeCtr(["input", "", "in"+k, "width:40%", ]) + "&nbsp;" + makeCtr(["button", "<i class='fa fa-external-link-square'/>", "btnediticon", "btnRoundsmall", "onclick:faLoad('in"+k+"','')"])]
       data.push(row);
    });

    var tb = makeTable("tes2", data, "general");
    $("#spIcon").empty();
    $("#spIcon").append(tb);
}
function jstreeEditSave(id, options) {
    var src = "";
    if (typeof options != "undefined" && options.hasOwnProperty("src")) src = options.src;
    var combine = saveData(true);
    //var id = $("#lbCtr").text(), code = $("#lbformid").text();
    //if (id == "") src = "list";
    //if (typeof options !="undefined" && options.hasOwnProperty("src")) src = options.src;
    //var combine = selectimctable(menuid, subid, id);
    //if (combine == "" | typeof (combine) == "undefined") {
    //    var combine = {};
    //    combine.data = { datacode: $("#lbDatacode").html() };
    //    combine.menuid = menuid;
    //    combine.subid = subid;
    //    combine.dvid = id;
    //}

    var jqset = saveTable("tes1");
    var setting = {}
    $.each(jqset, function (i, k) {
        setting[k[0]] = k[1];
    });
    combine.setting = setting;
    combine.ctrtype = 'jstree';
    if ($(".dnd").length > 0)
        combine.eventlist = dndevtlist("jstree");
    if (combine != null)
        commonsave(id, src, combine, options);

}
//#endregion

//#region fullCalendar Edit
function fullCalendarEdit(id, options) {
    fullCalendarInit.datasrc = datasrc;
    var cstyle, arattach = "", archive = "", src = '', code = '', name = '', desc = '', gdt, type,contain;
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
        options = editoptionmake("fullcalendar", id, gdt);//{ ctrid: id, type: "content", gdt: gdt };//
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
   
        var ctrdt, datacode = "", filter = "";
        if (gdt.hasOwnProperty("data")) {
            ctrdt = gdt.data;
            if (ctrdt.hasOwnProperty("datacode")) {
                datacode = ctrdt.datacode;
                filter = ctrdt.filter;
            }
        }
        if (datacode != "")
            jsonReadAjax("imcdata", "", "code", datacode, fullCalendarInit.datasrc, [id, gdt, filter]);
        else
            datasrc("", id, gdt, filter);
    }
    function datasrc(data, dvid, gdt, filter) {
        var dt=""
        if (data != "") {
             dt = datalistreturn(data);
            if (filter != "")
                dt = applyFilter(dt, filter);
            $("#spdataajax").text(JSON.stringify(data));
            $("#spdlist").text(JSON.stringify(dt));
        }

        //tab create
        var tabarr = {};
        if ($("#tab-Contain").length > 0) {
            $("#tab-Contain").remove();
        }
        tabarr.id = "tab-Contain";
        tabarr.head = ["Setting", "Action", "Data", "Style"];
        var content = [];

        content.push("<table width='100%'><tr><td style='width:250px;vertical-align:top;'><div id='dvtable' style='padding:5px 0 5px 0;'></div></td>" +
        "<td style='vertical-align:top;'><div id='dvtx12' style='display:block;padding:5px;'></div>" +
        "<div style='width:100%;padding:0 0 0 10px'></div></td></tr><tr><td id='tbbtn' colspan='2'></td></tr></table>");
       // content.push(eventEdit(id).outerHTML());

        content.push("<div id='dndcontain_fullcalendar' class='dndcontain'  />");
        content.push(makeDatasrc());
        tabarr.content = content;
        var tab = makeTab(tabarr);

        if (src.indexOf("list") > -1) {
            $("#dvadmin").empty().append(tab);
        }
        else {
            var conarr = {};
            conarr.id = "dveditback";// "container" + id;
            //container complete
            conarr.body = tab;
            var container = makeContainer(conarr);
        }
        $("#tbbtn").append(editbutton(options));

        //tabclick event
        var tabb = $('#' + tabarr.id);
        var first = true,action=true;
        tabb.tabs({
            activate: function (event, ui) {
                var $activeTab = tabb.tabs('option', 'active');
                switch ($activeTab) {
                    case 0:
                        //fullCalendarEdit(id, options);
                        break;
                    case 1:
                        var dcode = "";
                        if (gdt.hasOwnProperty("data")) dcode = gdt.data.datacode;
                        if (dcode != $("#spDatacode").text()) reloadAction();
                        //3rd action
                        if (action) {
                            dndboxInit(gdt, 'fullcalendar');
                            action = false;
                        }
                    case 2:
                        dataTabClick(id, options);
                        break;
                    case 3:
                        //3rd Tab style
                        if (first) {
                            if (typeof id == 'undefined') id = code;
                            cssEditInit("Style", id, "fullcalendar");
                            first = false;
                        }
                        break;
                }
                var dtid = 'admin&2&j160112153427';
                if ($("#spdataajax").length == 0) dtid = 'data_select';
                var hp = ['calendaredit','action', dtid, 'admin&2&j160112163349'];//[formedit,action,data,css]
                tabb.attr("help", hp[$activeTab]);
            }
        });
        tabb.addClass('helpinsert');
        tabb.attr("help", 'calendaredit');
        helpinsert();

        calEditTable(id, gdt,dt);
        $("#dvtx12").next().attr("id", id);
        fullCalendarInit(id, { gdt:gdt,contain: $("#dvtx12").next() });
        //button init
        $("input[type='button']").button();
        $("button").button();
    }
}
function calEditTable(calid, gdt, dt) {
    calEditTable.reload = reload;
    //makeCtr(type, value, id, clas, style,attribute)
    var sty = ".indent{padding-left:5px;}";
    sty += ".inp{padding:2px;width:150px;}";
    sty += ".inp1{padding:2px;width:100px;}";
    sty += ".expcol{background-image: url('/images/expand.gif');}";
    styleInsert("dynamictablestyle", sty);

    //calEditTable.datasrc = datasrc;

    //if ($("#spdataajax").length == 0) {
    //    if (typeof gdt != "undefined" && gdt != "" && gdt.hasOwnProperty("data")) {
    //        jsonReadAjax("imcdata", "", "code", gdt.data.datacode, calEditTable.datasrc, [calid, gdt]);
    //    }
    //    else
    //        datasrc("", calid, gdt);
    //}
    //else {
    //    var data = JSON.parse($("#spdataajax").text());
    //    datasrc(data, calid, gdt);
    //}

    //function datasrc(data, id, gdt) {
    //    jsonQueryCheck(data, calEditTable.datasrc, [id, gdt]);
    var id = "id", title = "title", start = "start", end = "end", allday = "allDay", color = "backgroundColor", staff = "staff", mycal = "mycal", sdesc = "sdesc", invitestaff = "invitestaff", recurrence = "recurrence1",
reminder = "reminder", width = "", firstday = 0, alldayslot = true, alldaytext = "종일", defaultview = "month", sidebarshow = false;
    var dtfst;
    //if (data != "") {
    //    var dt = datalistreturn(data);
    //    if (dt.length > 0) {
    //        var fieldlist = Object.keys(dt[0]);
    //        flist = fieldlist.join(";");
    //    }
    //    $("#spdataajax").text(JSON.stringify(data));
    //    $("#spdlist").text(JSON.stringify(dt));
    //}
    //else
    //    return false;

    //if (typeof gdt != "undefined" && gdt.hasOwnProperty("data")) {
    //    gdtdt = gdt.data;
    //    var src = selectimcdata("imcdata", gdtdt.datacode).datalist;
    //    var dt = src;
    //    if (gdtdt.filter.length > 0)
    //        dt = applyFilter(src, gdtdt.filter);
    var columnlist = [];
    if (dt != "") {
        dtfst = dt[0];
        $.each(dtfst, function (i, k) {
            columnlist.push(i + "," + i);
        });
    }
    columnlist.unshift("select,");
    if (gdt.hasOwnProperty("setting")) {
        if (gdt.setting.hasOwnProperty("field")) {
            var st = gdt.setting.field;
            if (st) {
                if (typeof st.id != "undefined" && st.id != "") id = st.id;
                if (typeof st.title != "undefined" && st.title != "") title = st.title;
                if (typeof st.start != "undefined" && st.start != "") start = st.start;
                if (typeof st.end != "undefined" && st.end != "") end = st.end;
                if (typeof st.allday != "undefined" && st.allday != "") allday = st.allday;
                if (typeof st.color != "undefined" && st.color != "") color = st.color;
                if (typeof st.staff != "undefined" && st.staff != "") staff = st.staff;
                //if (typeof st.mycal != "undefined"  && st.id !="") chan = st.Channel;
                if (typeof st.desc != "undefined" && st.desc != "") sdesc = st.desc;
                if (typeof st.invitestaff != "undefined" && st.invitestaff != "") invite = st.invitestaff;
                if (typeof st.recur != "undefined" && st.recur != "") recurrence = st.recur;
                if (typeof st.reminder != "undefined" && st.reminder != "") reminder = st.reminder;
                if (typeof st.mycal != "undefined" && st.mycal != "") mycal = st.mycal;
            }
        }
        if (gdt.setting.hasOwnProperty("options")) {
            st = gdt.setting.options;
            if (st) {
                if (typeof st.Width != "undefined") width = st.Width;
                if (typeof st.Firstday != "undefined") firstday = st.Firstday;
                if (typeof st.AllDaySlot != "undefined") alldayslot = st.AllDaySlot;
                if (typeof st.AllDayText != "undefined") alldaytext = st.AllDayText;
                if (typeof st.defaultView != "undefined") defaultview = st.defaultView;
                if (typeof st.sideBarShow != "undefined") sidebarshow = st.sideBarShow;
            }
        }
    }

    var data = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["ID", makeCtr(["select", InsertSelected(dtfst, id), "selId", "inp", ])]
    , ["Title", makeCtr(["select", InsertSelected(dtfst, title), "selTitle", "inp", ])]
    , ["Start", makeCtr(["select", InsertSelected(dtfst, start), "selStart", "inp", ])]
    , ["End", makeCtr(["select", InsertSelected(dtfst, end), "selEnd", "inp", ])]
    , ["AllDay", makeCtr(["select", InsertSelected(dtfst, allday), "selAllDay", "inp", ])]
    , ["Color", makeCtr(["select", InsertSelected(dtfst, color), "selColor", "inp", ])]
    , ["Staff", makeCtr(["select", InsertSelected(dtfst, staff), "selStaff", "inp", ])]
    //, ["Channel", makeCtr(["select", InsertSelected(dtfst, chan), "", "inp", ])]
    , ["Desc", makeCtr(["select", InsertSelected(dtfst, sdesc), "selDesc", "inp", ])]
    , ["Invite", makeCtr(["select", InsertSelected(dtfst, invitestaff), "selInvite", "inp", ])]
    , ["Recur", makeCtr(["select", InsertSelected(dtfst, recurrence), "selRecur", "inp", ])]
    , ["Reminder", makeCtr(["select", InsertSelected(dtfst, reminder), "selReminder", "inp", ])]
    ]
    var tb = makeTable("tes1", data, "general");
    var foot = ['<input type="button" class="btnRoundsmall" value="reload" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","class":"ui-widget-footer"}'];
    var tb1 = appendFooter(tb, foot);

    var data1 = [
        [makeCtr(["span", "Option", , , ]), makeCtr(["span", "Value", , , ])]//headers
    , ["Width", makeCtr(["input", width, "", "inp", ])]
    , ["Firstday", makeCtr(["select", "Sun,0;Mon,1", "selfirstday", "inp", ])]
    , ["AllDaySlot", makeCtr(["input:checkbox", alldayslot, "ingrp", , ])]
    , ["AllDayText", makeCtr(["input", alldaytext, "", "inp", ])]
    , ["defaultView", makeCtr(["select", "Month,month;Week,agendaWeek;Day,agendaDay", "seldefview", "inp", ])]
    , ["sideBarShow", makeCtr(["input:checkbox", sidebarshow, "ingrp", , ])]
    ]

    tb = makeTable("tes2", data1, "general");
   // foot = ['<input type="button" class="btnRoundsmall" value="reload" onclick="reloadTable(\"\")" style="padding:0 3px 0 3px;" id="btnFixed"/>|{"colspan":"2","class":"ui-widget-footer"}'];
    var tb2 = tb;//appendFooter(tb, foot);


    var accord = $("#accordion1");
    if (accord.length == 0) {
        var accord = $("<div/>");
        accord.attr("id", "accordion1");
        accord.append("<h3>Data Scheme</h3>");
        accord.append("<div>" + tb1.prop('outerHTML') + "</div>");
        accord.append("<h3>Setting</h3>");
        accord.append("<div>" + tb2.prop('outerHTML') + "</div>");
        accord.append("<h3>mycal</h3>");
        accord.append("<div id='accordmycal'><table id='tbmycal'/><div id='pgmycal' /></div>");
    }
    accord.accordion({
        event: "click",
        collapsible: true,
        autoHeight: true,
        heightStyle: "content",
        active: 0
    });

    accordioncss();

    $("#dvtable").append(accord);
    $('.indent').parent().parent().hide();
    setTimeout(function () {
        $("#selId").val(id);
        $("#selTitle").val(title);
        $("#selStart").val(start);
        $("#selEnd").val(end);
        $("#selAllDay").val(allday);
        $("#selColor").val(color);
        $("#selStaff").val(staff);
        $("#selDesc").val(sdesc);
        $("#selInvite").val(invitestaff);
        $("#selRecur").val(recurrence);
        $("#selReminder").val(reminder);
        $("#seldefview").val(defaultview);
        $("#selfirstday").val(firstday);
        $("#btnFixed").on("click", function () {
            var data = JSON.parse($("#spdataajax").text());
            var datacode;
            if (data.hasOwnProperty("code")) datacode = data.code;
            else if (data.hasOwnProperty("datacode")) datacode = data.datacode;
            jsonReadAjax("imcdata", "", "code", datacode, calEditTable.reload, [calid, gdt]);
        });
    }, 1000);
    function reload(data, calid, gdt) {
        if (data != "") {
           var dt = datalistreturn(data);
            //if (filter != "")
            //    dt = applyFilter(dt, filter);
            $("#spdataajax").text(JSON.stringify(data));
            $("#spdlist").text(JSON.stringify(dt));
            $("#accordion1").remove();
           
            data.datacode = data.code;
            delete data.code;
            gdt.data = data;
            calEditTable(calid, gdt, dt);

            $("#dvtx12").next().empty();
          fullCalendarInit(calid, { gdt: gdt, contain: $("#dvtx12").next() });
        }
    }
    mycalTable(calid);

}
function mycalTable(calid) {
    var data = [], set = {},mycal="";
    var ctr = selectimctable(menuid, subid, calid);
    if (typeof ctr != "undefined" && ctr.hasOwnProperty('setting')) {
        var field = ctr.setting.field;
        if (field.hasOwnProperty("mycal"))
            mycal = field.mycal;
        $(mycal).each(function (i, k) {
            set = {}, fieldstr = "";
            set.title = k.title;
            set.id = k.id;
            set.datacode = k.datacode;
            $(k.field).each(function (j, l) {
                fieldstr += l[1] + " ";
            });
            set.field = fieldstr;
            set.filter = JSON.stringify(k.filter);
            data.push(set);
        });
    }
    if (mycal != "") {
//        $("#tbmycal").parent().find($("button")).remove();
        jQuery("#tbmycal").jqGrid("GridUnload");
        jQuery("#tbmycal").jqGrid({
            datatype: "local",
            data: data,
            colNames: ['mycalname', 'Datacode', 'Field','Filter','id', '', ''],
            colModel: [
                        { name: 'title', width: 100 },
                        { name: 'datacode', width: 100 },
                        { name: 'field',width:110 },
                           { name: 'filter', hidden: true },
                { name: 'id', hidden: true },
                           { name: 'a1', width: 20 },
                           { name: 'a2',width:20 }
                   ],
            rowList: [10, 20, 30],
            pager: '#pgmycal',
            emptyrecords: "No records to view",
            width: 330,
            height: 100,

            gridComplete: function () {
                var ids = jQuery("#tbmycal").jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    //var d = data[cl - 1];
                    var rowarr = jQuery("#tbmycal").getRowData(cl);
                    //pageid, pagename, dvid, paramname
                    be = "<i class='fa fa-pencil imdim' onclick=\"mycalDialog('" + calid + "','" + rowarr.id + "');\"  />";
                    de= "<i style='margin-left:5px;' class='fa fa-trash imdim' onclick=\"mycalDel('" +calid+"','" + rowarr.id+  "');\"  />";
                    jQuery("#tbmycal").jqGrid('setRowData', ids[i], { a1: be,a2:de });
                }
            }
        });
        jQuery("#tbmycal").jqGrid('navGrid', '#pgmycal', { edit: false, add: false, del: false, search: false, refresh: false });
        jQuery("#tbmycal").jqGrid('navButtonAdd', '#pgmycal', {
            caption: "add",
            buttonicon: "ui-icon-plus",
            onClickButton: function () {
                var id = 1;
                if (jQuery("#tbmycal").length > 0) {
                    var ids = jQuery("#tbmycal").jqGrid('getDataIDs');
                    id = ids.length + 1;
                }
                mycalDialog(calid, id);
                $("#container" + calid).hide();
            }
        });
        jQuery("#tbmycal").setGridWidth(300);
    }
    else {
//        $("#tbmycal").jqGrid(
//            { colNames: ["noList"], colModel: [{ name: "noList"}], pager: "#pgmycal", width:270 }
//        );
        $("#tbmycal").parents('div.ui-jqgrid-bdiv').css("height", "10px");
        $("<button onclick=\"mycalDialog('"+calid+"','1')\">Add New Calendar</button>").button().width(270).appendTo($("#accordmycal"));

    }
}
function mycalDel(calid, id) {
    var list = selectimctable(menuid, subid, calid);
    var mycal = list.setting.field.mycal;
    $(mycal).each(function (i, k) {
        if (k.id == id) {
            mycal.splice(i, 1);
        }
    });
    updateimctable(menuid, subid, calid, list);
    mycalTable(calid);
}
function mycalDialog(calid,id) {
    var filter = [], field = [], mycal = "",ser="",title="",color="",datacode="";
    var ctr = selectimctable(menuid, subid, calid);
    if (ctr.hasOwnProperty("setting"))
        if (ctr.setting.hasOwnProperty("field"))
            if (ctr.setting.field.hasOwnProperty("mycal"))
                ser = ctr.setting.field.mycal;
    if (ser != "")
        $(ser).each(function (i, k) {
            if (k.id == id) {
                title = k.title;
                color = k.color;
                field = k.field;
                filter = k.filter;
                datacode = k.datacode;
                mycal = k;

                return false;
            }
        });
    $("#container" + calid).hide();
    if ($("#dvDia").length > 0) $("#dvDia").remove();
    //var dtsrc = $(makeDatasrc());
    var dia = $("<div id='dvDia'/>");
    //mycal setting

    //tab 사용시
    cssInsert("tab", "/App_Themes/tab/tabs-min.css");
    var tabarr = {};
    tabarr.id = "tabs-mycal";
    //tabarr.class="tabs-min";
    tabarr.head = ["Calendar", "Data"];
    var content = [];
    content.push(mycalMake(calid,id,mycal));
    content.push(makeDatasrc());
    tabarr.content = content;
    var tab = makeTab(tabarr);
    tab.tabs({
        activate: function (event, ui) {
            var $activeTab = tab.tabs('option', 'active');
            switch ($activeTab) {
                case 0:
                    var ctr = selectimctable(menuid, subid, calid);
                    var mycal = ctr.setting.field.mycal;
                    if ($("#lbDatacode").text() != $("#lbDatacode_mycal").text()) {
                        $("#tes33").empty();
                        $(mycal).each(function (i, k) {
                            if (k.id == $("#lbId").text()) {
                                mycalLoad(k);
                                return false;
                            }
                        });
                    }
                    $("#tes33").show();
                    break;
                case 1:
                    $('#accordion').accordion("refresh");
                    break;
            }
        }
    });
   dia.append(tab);
   dia.dialog({
        height: 'auto'
        , width: 800
        , modal: true
        , minHeight: 'auto'
        , title: "Calendar Make"
        , stack: false
        , close: function (event, ui) {
            mycalDialogClose(calid);
            $("#container" + calid).show();
        }
    });
    //dialog+tab을 하나로 만드는 코드
    dia.parent().find('.ui-dialog-titlebar-close').prependTo('#tabs-mycal');
    dia.closest('.ui-dialog').children('.ui-dialog-titlebar').remove();
    var tabid = $("#tabs-mycal");
    tabid.find('.ui-dialog-titlebar-close').css({ top: '20px', margin: '-10px 5px 0 0' });
    dia.css({ padding: 0 });

    btntype = "dialog";
    if (datacode == "") {
        jsonReadAjax('imcdata', '', '', '', dataList);
    }
    else {
        editDatacode(datacode, field, filter);
        paginathing("#tes33");
    }
    $("#dvDia").parent().css("z-Index", 1300);
    mycalInit(id);
    mycalLoad(mycal);
}
function mycalDialogClose(calid) {
    $("#dvDia").dialog('destroy').remove();
    //refresh해야 Datatab내용이 뜸
    selectTab("Data");
    $("#tab-Contain").tabs("option", "active", 0);
    $('#accordion1').accordion({ active: 2 });
    $('#container' + calid).show();
}
function showColor(inp1) {
    //color
    if ($("#diaColor").length > 0) $("#diaColor").dialog("destroy");
    var contain = $("<div  id='diaColor'/>");
    var tb = $("<table  cellspacing='2' id='dvColor'/>");
    var tr = $("<tr style='height:15px;'/>");tb.append(tr);contain.append(tb);
    var cl = ["#FFFFE0", "#FF6961", "#836953", "#FFB347", "#966FD6", "#CFCFC4", "#77DD77", "#03C03C", "#779ECB", "#F49AC2", "#FDFD96", "#DEA5A4", "#B39EB5", "#FFD1DC", "#CB99C9", "#B19CD9", "#C23B22", "#AEC6CF"];
    $(cl).each(function (i, k) {
        var td = $("<td class='imdim' onclick=\"fillColor('" + $(inp1).prev().attr('id') + "','" + k + "')\" style=\"width:15px;background-color:" + k + ";\"/>");
        tr.append(td);
    });
    contain.dialog();

//    //$("#dvColor").toggle();
//    if ($('#dvColor:visible').length == 0) {
//        $("#dvColor").show();
//    }
//    else {
//        documentreadyInsert("mycal", "$('#dvDia').click(function () { if ($('#dvColor:visible').length == 1) $('#dvColor').hide(); });");
//
//    }
}
function mycalMake(calid, id,mycal) {
    var title = "", color = "", datacode = "";
    if (mycal != "" && mycal.length > 0) {
        var color = mycal.color, datacode = mycal.datacode;
    }
    //dialog setting
    var sdt = $("<div id='dvmycal1'/>");
    //form
    var edit = $("<table width='100%'/>").appendTo(sdt);
    edit.append($("<tr><td style='width:150px;'><label for='lbId'>ID:</label></td><td colspan='2'><label id='lbId' /></td></tr>"));
    edit.append($("<tr><td><label for='inpCalname'>Calendar Name:</label></td><td colspan='2'><input id='inpCalname' /></td></tr>"));
    edit.append($("<tr title='drag&drop이 한번만 가능'><td><label for='cbOnce'>Use Once:</label></td><td colspan='2'><input type='checkbox' id='cbOnce' /></td></tr>"));
    edit.append($("<tr title='drag&drop할수 있음'><td><label  for='cbDrag'>Drag&Drop:</label></td><td colspan='2'><input type='checkbox' id='cbDrag' /></td></tr>"));
    edit.append($("<tr title='group별 기본색'><td><label for='inpColor'>Color:</label></td><td><input style='height:15px;' type='color' id='inpColor' />" +
    "<button style='margin-left:5px;' onclick='showColor(this)' class='btnRoundsmall'><i class='fa fa-external-link-square'></i></button></td></tr>"));
    // edit.append($("<tr><td style='vertical-align:top;'><label for='selShare'>Share:</label></td><td colspan='2'>" + contain2.clone().html() + "</td></tr>"));


    //Series list
    var blanklist = seriesListBlank(calid,id);
    var contain1 = $("<div  />");
    contain1.append(blanklist);
    var imgdatacode = '';
    if (datacode != "")
        imgdatacode = "<img onclick=\"if(confirm(\'Delete series setting?\'))delSeries('" + calid + "','" + id + "')\" class='imdim' src='/images/close.jpg'  style='margin-left:10px;' />";
    edit = $("<table id='tbdata' width='100%'/>").appendTo(sdt);
    edit.append($("<tr><td style='width:90px;'><label for='lbDatacode_mycal'>Datacode:</label></td><td colspan='2'><label id='lbDatacode_mycal' >" + datacode + "</label><img onclick=\"if(confirm(\'Delete series setting?\'))delSeries('" + calid + "','" + id + "')\" class='imdim' style='margin-left:10px;' src='/images/close.jpg' /></td></tr>"));
    edit.append($("<tr><td style='vertical-align:top;'><label for='tes33'>Series:</label></td><td colspan='2'>" + contain1.clone().html() + "</td></tr>"));
    if (datacode == "") {
        $("#tes33").hide();
    }

    //    //sharelist
    //    var contain2 = $("<div id='dvStafflist' />"), jsopt = { textbox: "inNodetext1", valuebox: "inNodevalue1", display: "pop" };
    //    $("<input id='inNodetext1' type='hidden' />").appendTo($('body'));
    //    $("<input id='inNodevalue1' type='hidden' />").appendTo($('body'));
    //    var stafflist = selectimcdata("imcdata", "dt150624050207").datalist;
    //    loadtreewithdata1("dvStafflist", stafflist, jsopt);

    //button
    var btnlist = $("<div style='text-align:right;padding:20px 5px;'/>");
    var btnsave = $("<button style='margin-left:5px;' onclick=\"mycalSave();mycalDialogClose('" + calid + "');\" class='btnRoundsmall'><i class='fa fa-floppy-o' style='margin-right:5px;'></i>Save</button>");
    var btncancel = $("<button style='margin-left:5px;' onclick=\"mycalDialogClose('" + calid + "'); \" class='btnRoundsmall'><i class='fa fa-times' style='margin-right:5px;'></i>Cancel</button>");
    btnlist.append(btnsave.button());
    btnlist.append(btncancel.button());
    btnlist.appendTo(sdt);

    return sdt;
}
function seriesListBlank(calid,id) {
    if ($("#tes33").length > 0)
        $("#tes33").remove();

    var data = [
        [makeCtr(["span", "Code", , , ]), makeCtr(["span", "Name", , , ]), makeCtr(["span", "Color", , , "width:50px"]), makeCtr(["span", "", , , "width:15px"])]//headers
    ];
    var tb = makeTable("tes33", data, "general");
    $("#tes33").attr("data-page-navigation", ".pagination");
    $("#tes33").attr("data-page-size", "2");
    var str = '<ul class="pagination"></ul>';
    str += '<div style=\"text-align:right;padding:3px;\">';
    str += '<input type="button" class="btnRoundsmall" value="add" onclick="insertRow(\'\',\'\',\'\')" style="padding:0 3px 0 3px;" id="btnFixed"/>';
    str += '<input type="button" class="btnRoundsmall" value="reset" onclick="if(confirm(\'Reset All Rows?\'))resetRow(\'' + calid + '\',\'' + id + '\')" style="padding:0 3px 0 3px;"/>';
    str +='</div>';
    str +='|{"colspan":"4","class":"ui-widget-footer"}';
    var foot = [str];

    var tb1 = appendFooter(tb, foot);
    return tb1;
}
function delSeries(calid, id) {
    var ctr = selectimctable(menuid, subid, calid);
    var mycal = ctr.setting.field.mycal;
    $(mycal).each(function (i, k) {
        if (k.id == id) {
            k.datacode = "";
            delete k.colorlist;
            delete k.filter;
            delete k.field;
        }
    });
    updateimctable(menuid, subid, calid, ctr);
    mycalDialog(calid, id);
}
function mycalLoad(mycal) {
    var  colorlist = [];
    $("#inpCalname").val(mycal.title);
    $("#inpColor").val(mycal.color);
    $("input:checkbox[id='cbOnce']").attr("checked", false);
    $("input:checkbox[id='cbDrag']").attr("checked", false);
    if(mycal.once)
        $("input:checkbox[id='cbOnce']").attr("checked", true);
    if(mycal.drag)
        $("input:checkbox[id='cbDrag']").attr("checked", true);
    if ((mycal.hasOwnProperty("datacode") && mycal.datacode != "") | (mycal.hasOwnProperty("colorlist") && mycal.colorlist.length>0))
        mycalSeriesLoad(mycal);
}
function mycalSeriesLoad(mycal) {

        $("#lbDatacode_mycal").text(mycal.datacode);
    //find mapping code for mycal(code,name) from datalist
    var code = "", name = "",colorlist=[];
    $(mycal.field).each(function (j, l) {
        if (l[2] == "code" | l[1] == "code")
            code = l[1];
        else if (l[2] == "name" | l[1] == "name")
            name = l[1];
    });
    if (mycal.hasOwnProperty("colorlist") && mycal.colorlist.length > 0)
        colorlist = mycal.colorlist;
    else if (mycal.hasOwnProperty("datacode") && mycal.datacode != "") {
        var dt = selectimcdata("imcdata", mycal.datacode).datalist;
        dt = applyFilter(dt, mycal.filter);
        $(dt).each(function (i, k) {
            colorlist.push([k[code], k[name], mycal.color]);
        });
    }
    if (colorlist.length > 0) {
        $(colorlist).each(function (i, k) {
            insertRow(k[0], k[1], k[2]);
        });
    }
}
function mycalInit(id) {
    $("#lbId").text(id);
    $("#inpCalname").val("");
    $("input:checkbox[id='cbOnce']").attr("checked", false);
    $("input:checkbox[id='cbDrag']").attr("checked", false);
    $("#inpColor").val("#EBECEC");
    $("#lbDatacode_mycal").text("");

}
function fillColor(inp1, cl) {
    $("#" + inp1).val(cl);
    if (inp1 == "inpColor" && $("#tes33 tbody tr").length>0) {
        var result = window.confirm('Change All Element?');
        if (result)
            $('input[id^="inpCol"]').val(cl);
    }
    $("#diaColor").dialog("destroy");
}
function delrow(tableid,code) {
    //find rowIndex from code
    var rowIndex = "";
    $("#"+tableid+" tbody tr").each(function (i, k) {
        if ($(k).find("td span").text() == code) {
            rowIndex = i+1;
            return false;
        }
    });
    if(rowIndex !="")
    $("#" +tableid+ " tr:eq(" + rowIndex + ")").remove();
}
function insertRow(rowid, name, color) {
    var i=$("#tes33 tbody").children().length+1;
    if ($.trim(rowid) == "") rowid = i;
    if (typeof name == "undefined") name = "";
    if (color=="") color = "#ebecec";
    var btn = "<button onclick='showColor(this)' class='btnRoundsmall'><i class='fa fa-external-link-square'></i></button>";
    var del = "&nbsp;<button onclick=\"delrow('" + rowid + "')\" class='btnRoundsmall'><i class='fa fa-times'></i></button>";
    var rowData = [makeCtr(["span", rowid, , "inp", , ]), makeCtr(["input", name, "", "inp", ]), makeCtr(["input:color", color, "inpCol" + i, "inp", "width:50px;height:11px;padding:1px"]) + btn, del];
    appendTableRow($("#tes33"), rowData);
}
function resetRow(calid,id) {
    $("#tes33 tbody").empty();
    var ctr = selectimctable(menuid, subid, calid);
    var ser = ctr.setting.field.mycal;
    $(ser).each(function (i, k) {
        if (k.id == id) {
            k.colorlist = [];
            mycalSeriesLoad(k);
            return false;
        }
    });
}
function mycalSave() {
    var id = $("#lbId").text();
    var dtcode = $("#lbDatacode_mycal").text();
    var title=$("#inpCalname").val();
    var cbonce = $("#cbOnce").is(":checked");
    var cbdrag = $("#cbDrag").is(":checked");

    var color = $("#inpColor").val();
    //colorlist
    var clist = [],cset;
    $("#tes33 tbody tr").each(function (i, k) {
        cset = {};
        cset.code = $(k).find('span').text();
        cset.name = $(k).find("td input").val();
        cset.color=$(k).find("td input[id^='inpCol']").val();
        clist.push([cset.code,cset.name,cset.color]);
    });
    var colorlist = saveTable("tes33");
    var dt = saveData_dialog();
    var set = {};
    set.id = id;
    set.datacode = dtcode;
    if (typeof dt != "undefined") {
        set.filter = dt.filter;
        set.field = dt.field;
    }
    set.title=title;
    set.once=cbonce;
    set.drag=cbdrag;
    set.color=color;
    set.colorlist=clist;

    var ctr = selectimctable(menuid, subid, $("#lbCtr").text());
    var mycal = "";
    if (ctr.hasOwnProperty("setting"))
        if (ctr.setting.hasOwnProperty("field"))
            if (ctr.setting.field.hasOwnProperty("mycal"))
                mycal = ctr.setting.field.mycal;

    if (mycal.length > 0) {
        var chk = false;
        $(mycal).each(function (i, k) {
            if (k.id == id) {
                mycal.splice(i, 1, set);
                chk = true;
                return false;
            }
        });
        if (!chk) {
            mycal.push(set);
        }
    }
    else if (mycal.length == 0) {
        ctr.setting.field.mycal.push(set);
    }
    else {
        if (!ctr.setting.field.hasOwnProperty("mycal"))
            ctr.setting.field.mycal.push([set]);
    }
    updateimctable(menuid, subid, $("#lbCtr").text(), ctr);

}
function calEditSave(id, options) {
    var src = "";
    if (typeof options != "undefined" && options.hasOwnProperty("src")) src = options.src;
    var combine = saveData(true);
    var jqset = saveTable("tes1");
  
    if (combine == "" | typeof (combine) == "undefined") {
        var combine = {};
        combine.datacode = $("#lbDatacode").html();
        combine.menuid = menuid;
        combine.subid = subid;
        combine.dvid = calid;
    }
    //mycal save in advance !!
    var mycal = [];
    if (combine.hasOwnProperty("setting"))
        if (combine.setting.hasOwnProperty("field"))
            if (combine.setting.field.hasOwnProperty("mycal"))
                mycal = combine.setting.field.mycal;
    var setting = {}, set = {};
    setting.field = {};
    $.each(jqset, function (i, k) {
        setting.field[k[0].toLowerCase()] = k[1];
    });
    setting.field.mycal = mycal;
    setting.options = {};
    jqset = saveTable("tes2");
    $.each(jqset, function (i, k) {
        setting.options[k[0]] = k[1];
    });
    combine.setting = setting;

    combine.ctrtype = 'fullcalendar';
    if ($(".dnd").length > 0)
        combine.eventlist = dndevtlist("fullcalendar");
    commonsave(id, options.src, combine, options);

}
//#endregion