//#region map
function mapInit(id, option) {
    if (typeof option !="undefined" && option.hasOwnProperty("gdt")) {
        console.log(id, JSON.stringify(option.gdt)); return false;
    }
    var gdt, latlng = {}, filter = "", contain ;
    if (typeof id != "object") contain = $("#" + id);
    if (typeof option != "undefined" && option.hasOwnProperty("gdt")) {
        gdt = option.gdt;
      
        if (gdt.hasOwnProperty("data"))
            filter = findfilter(gdt.data);
        if (option.hasOwnProperty("contain"))
            contain = option.contain;
    }
  
    if (typeof gdt == "undefined")
        gdt = readdata(id, "gdt", option);
   
    mapInit.process = process;
    mapInit.markerreplace = markerreplace;
    if (typeof gdt!="undefined" && gdt.hasOwnProperty("data")) {
        var curdt = gdt.data;
        if (curdt.hasOwnProperty("datacode")) var datacode = curdt.datacode;
        else if (curdt.hasOwnProperty("code")) var datacode = curdt.code;
        if (datacode != "") {
            jsonReadAjax("imcdata", "", "code", datacode, mapInit.process, [id,gdt,filter,contain,datacode]);
        }
    }
   
    function process(dsrc, id, gdt, filter, contain,datacode) {
    
        var dt = "",dtorigin="";
        if (dsrc != "") {
         
            dtorigin = datalistreturn(dsrc);
            dt = dtorigin;
        }
        if (filter != "") dt = applyFilter(dtorigin, filter);
        if (typeof id == "object") {
            var dv = id;
            id = "dvpreview";
            dv.attr("id", id);
        }
        else {
            dv = contain
           // id = dv.attr("id");
        }
       dv.empty();
        dv.attr("style", "width:100%;height:400px;");
        // dv.attr("class", "roundbox");
       
        var mapmode = "ROADMAP", zoomlevel = 11, markerurl = "/images/marker.png",toolkit=[];
        var latlng = { lat: -33.8, lng: 151.25 };
        var markerarray = [
      ['Bondi Beach', -33.890542, 151.274856, 4],
      ['Coogee Beach', -33.923036, 151.259052, 5],
      ['Cronulla Beach', -34.028249, 151.157507, 3],
      ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      ['Maroubra Beach', -33.950198, 151.259302, 1]
          ];
        var latlng = { lat: 37.366905, lng: 127.107693 };
       //var markerarray= [["Key Acc",37.366905,127.107693,1],["IO",37.366905,127.107693,2],["FMS",37.385997,127.119475,3],["KBY",37.575548,126.984747,4],["GRC",37.56482,126.966996,5]]
        if (typeof gdt != "undefined" && gdt.hasOwnProperty("setting")) {
            var st = gdt.setting;
            if (st.hasOwnProperty("center")) {
                var cnt = gdt.setting.center;
                if (cnt != "" && typeof cnt != "undefined" && cnt != null) {
                    cnt = cnt.split("^");
                    latlng.lat = parseFloat(cnt[0]);
                    latlng.lng = parseFloat(cnt[1]);
                }
            }
            
            //"{"mapmode":"map","detailshow":null,"markerimage":null,"markerimage":"0","center":"36.844461^127.265625","markeraction":"detail","content":"c16020481245"
            if (st.hasOwnProperty("mapmode")) mapmode = st.mapmode;
            if (st.hasOwnProperty("zoom")) zoomlevel = parseInt(st.zoom);
            if (st.hasOwnProperty("toolkit")) toolkit = st.toolkit;
            if (st.hasOwnProperty("markerimage")) {
                var mimg = ["/images/marker.png", "/images/office-building-32.png","/images/person-male.png"];
                $(mimg).each(function (i, k) {
                    if (st.markerimage == i)
                        markerurl = k;
                });
            }
            if (st.hasOwnProperty("fieldmap")) {
                //srcdata
                var  fmap = gdt.setting.fieldmap, name, lat, lng, add1, add2, locid, markerimg;
                $(fmap).each(function (j, s) {
                    switch (s[0]) {
                        case "LocId":
                            locid = s[1];
                            break;
                        case "LocName":
                            name = s[1];
                            break;
                        case "Lat":
                            lat = s[1];
                            break;
                        case "Lng":
                            lng = s[1];
                            break;
                        case "Address1":
                            add1 = s[1];
                            break;
                        case "Address2":
                            add2 = s[1];
                            break;
                        case "markerimg":
                            markerimg = s[1];
                            break;
                    }
                });

            }

            markerarray = makemarkerarray(dt, lat, lng,locid, markerimg);
          
        }
        if (filter != "" && typeof contain!="undefined") {
            //if filter applied or only single spot displayed, move center
            switch (markerarray.length) {
                case 0:
                    if (id.indexOf("popupdv") > -1) $("#" + id).dialog('destroy').remove();
                    else
                        markerarray = makemarkerarray(dtorigin, lat, lng,locid, markerimg);
                    sweetmsgautoclose("Ooops!", "Map information is not available!!", { timer: 1000 });
                   
                    break;
                default:
                    var m0 = markerarray[0];
                    latlng.lat = parseFloat(m0[1]);
                    latlng.lng = parseFloat(m0[2]);
                    zoomlevel = 16;
                    break;
            }
        }

        var btnappend = $("<input id='append" + id + "' type='button' style='display:none'></input>");
        var btnclear = $("<input id='clear" + id + "' value='clear' type='button' style='display:none'></input>");
        var btndraggable = $("<input id='draggable" + id + "' value='draggable' type='button' style='display:none'></input>");
        
        dv.closest('tr').prepend(btnappend);
        dv.closest('tr').prepend(btnclear);
        dv.closest('tr').prepend(btndraggable);

        //var chicago = new google.maps.LatLng(-25.363, 131.044);
        map = new google.maps.Map(document.getElementById(id), {
            center: latlng,
            zoom: zoomlevel,
            mapTypeId: google.maps.MapTypeId[mapmode]
        });
        setMarkers(id, map, markerarray, markerurl);
        google.maps.event.addListener(map, 'dblclick', function (event) {
            placeMarker(id, event.latLng);
            position = event.latLng;
        });

        $(toolkit).each(function (i, k) {
            switch (k) {
                case "streetview":
                    streetView(id,latlng,map);
                    break;
                case "search":
                    geoSearch(id);
                    break;
                case "reload":
                    var withsearch = true;
                    if ($.inArray("search", toolkit) == -1) withsearch = false;
                    OriginalReload(dsrc, id, gdt, contain,withsearch);
                    break;
            }
        })
       // btn1.hide(); btn2.hide();
        $(btnappend).click(function (e) {
            jsonReadAjax("imcdata", "", "code", datacode, mapInit.markerreplace, [id, map,filter,markerurl,lat,lng,locid,markerimg]);
        });
        $(btndraggable).click(function (e) {
            btnclear.click();
            markerurl = "/images/marker.png";
            var opt = { draggable: true };
            setMarkers(id, map, markerarray, markerurl,opt);
        });
    }
    var map, marker;
    var TILE_SIZE = 256;
    //search
    function makemarkerarray(dt, lat, lng, locid,markerimg) {
        var markerarray = [];
        $(dt).each(function (i, k) {
            if (k[lat] != "" && k[lng] != "") {
                var arr = [k[name], parseFloat(k[lat]), parseFloat(k[lng]), i + 1, k[locid], locid, k[markerimg]];
                markerarray.push(arr);
            }
        });
        return markerarray;
    }
    function geoSearch(id) {
        var dv = $("<div />"), inp = $("<input id='address' style='margin-right:2px;width:130px;'/>"), btn = $("<input type='button' id='submit' value='Search'/>");
        dv.append(inp);
        dv.append(btn);
        dv.css({ position: "absolute", top: "10px", right: "1%", zIndex: "1" });
        $("#" + id).append(dv);
        $("#" + id).css("position", "relative");
        $("#submit").button();
        //click submit search address
        document.getElementById('submit').addEventListener('click', function () {
            var address = document.getElementById('address').value;
            geoSearchReload(id, address, map);
        });
        //when click enter search address w/out postback
        $(document).keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                $("#submit").click();
                return false;
            }
        });
    }
    function OriginalReload(dsrc, id, gdt, contain,withsearch) {
        var dv = $("<div />"), btn = $("<div style='width:27px;height:27px;background-color:white;border:solid 1px #A9A9A9;padding:5px 0 0 4px' class='imdimmer'><i class='fa fa-university fa-lg ' style='color:#EC9620' title='back to initial'/></div>");
        dv.append(btn);
        var rgt = "216px";
        if(!withsearch)rgt="10px"
        dv.css({ position: "absolute", top: "10px", right: rgt, zIndex: "1" });
        $("#" + id).append(dv);
        $("#" + id).css("position", "relative");
        //click submit search address
        btn.on("click", function () {
            mapInit.process(dsrc, id, gdt, "", contain);
        })
    }
    function placeMarker(id,location) {
        var marker = new google.maps.Marker({
            position: location,
            draggable: true,
            map: map
        });

        map.setCenter(location);
        marker.addListener('click', function (e) {
            if (infowindow) 
                infowindow.close();
            position = e.latLng;
            reloadexe(id, [{ code: "code", value: [] }], 'link');
        });
        google.maps.event.addListener(marker, 'dragend', function (evt) {
            position = evt.latLng;
        });
        $("#clear" + id).click(function () {
            marker.setMap(null);
        })
    }
    function markerreplace(dsrc, id, map,filter,markerurl,lat,lng,locid,markerimg) {
        if (dsrc != "") {
            var dtorigin = datalistreturn(dsrc);
            var dt = dtorigin;
        }
        if (filter != "") dt = applyFilter(dtorigin, filter);
        var markerarray = makemarkerarray(dt, lat, lng, locid, markerimg);
        setMarkers(id, map, markerarray, markerurl);
    }
}

function geocodeAddress(address) {
    var geocoder = new google.maps.Geocoder();
    var ret = "hello";
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            ret = results[0].geometry.location;
        }
    });
    console.log(ret)
    return ret;
}
var mlist = [];
function geoSearchReload(id,address, resultmap) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (mlist.length > 0) {
                //remove all existing marker
                mlist[0].setMap(null);
                mlist = [];
            }
            var latlng = results[0].geometry.location;
            resultmap.setCenter(latlng);
            var marker = new google.maps.Marker({
                map: resultmap,
                position: latlng
            });
            infowindowView(marker, address, latlng);
            mlist.push(marker);
        }
    });
}
//streetView
function streetView(id,latlng,map) {
    createDv(id,"pano");
    var panodv = $("#pano");
    panodv.css({ width: "400px", height: "400px" });
    var panorama = new google.maps.StreetViewPanorama(
         document.getElementById('pano'), {
             position: latlng,
             pov: {
                 heading: 34,
                 pitch: 10
             }
         });
    map.setStreetView(panorama);
}
function createDv(id,newdvid) {
    //var container = $("<div id='container1'/>");
    $("#" + id).wrap("<div id='container1'/>");
    var container = $("#container1");
    //$(id).remove();
    var dv = $("<div/>").css({ float: "left" });
    dv.attr("id", newdvid);
    container.append(dv);
    return dv;
}
//setMarker
var infowindow = "",position="",locname="";
function setMarkers(id,map1, markerarray,url,option) {
    // Adds markers to the map.
    var image = {
        url: url,//'/images/marker.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(32, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };


    //var uluru = { lat: -25.363, lng: 131.044 };
    //var map = new google.maps.Map(document.getElementById('map'), {
    //    zoom: 4,
    //    center: uluru
    //});
    //var infowindow = new google.maps.InfoWindow({
    //    content: contentString
    //});
    //var marker = new google.maps.Marker({
    //    position: uluru,
    //    map: map,
    //    title: 'Uluru (Ayers Rock)'
    //});
    //marker.addListener('click', function () {
    //    infowindow.open(map, marker);
    //});

    var markerarraymade = [];
    for (var i = 0; i < markerarray.length; i++) {
        var arr = markerarray[i];
        if (typeof arr[6] != "undefined") image.url = arr[6];
        if (typeof option == "undefined") option = {};
        option.position = { lat: arr[1], lng: arr[2] };
        option.map = map1;
        if(!option.hasOwnProperty("icon"))
        option.icon = image;
        option.title = arr[0];
        option.zIndex = arr[3];
        // option = {
        //    position: { lat: arr[1], lng: arr[2] },
        //    map: map1,
        //    icon: image,
        //    title: arr[0],
        //    zIndex: arr[3]
        //};
        var marker = new google.maps.Marker(option);
        var latlng = { lat: arr[1], lng: arr[2] };
        //infowindowView(marker, contentString, latlng);
        //var contentstr=infowindowCreate(map1,arr)
        infowindowView(marker, arr[0], latlng,arr[4],arr[0],arr[5],id,map1);
        //streetView(id,latlng);
     
        markerarraymade.push(marker);
    }
    $("#clear" + id).click(function () {
        $(markerarraymade).each(function (i, k) {
            k.setMap(null);
        })
    })
}
//infowindowView
function infowindowView(marker, content, latlng, locid1, name1, locid, id,map) {
    var cntid,gdt,cstyle;
    infowindow = new google.maps.InfoWindow({
        content: name1
    });
    infowindow.open(map, marker);
    marker.addListener('click', function (e) {
        if (infowindow) {
            infowindow.close();
        }
        reloadexe(id, [{ code: "code", value: [locid1] }], 'link');
        position = e.latLng;
        locname = name1;
    });
    marker.addListener("position_changed", function () {
        position = marker.getPosition();
        //for external usage of position info
    });
}
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
            console.log(imcdata)
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
    //returns lots of attributes of sessionStorage(googlechart)
    //e.g: valaxis().srcname;
    var chartlist = sessionStorage.getItem("googlechart");

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
                var chartlist=sessionStorage.getItem("googlechart");
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

                var comp1=sessionStorage.getItem("login");
                var obj = eval("(" + comp1 + ")");
                  var comp=obj.comp;
                  var staff=obj.id;
                $.ajax({
                url: "/WebService.asmx/googleDataRequest",
                data: { comp: JSON.stringify(comp),staff: JSON.stringify(staff) },
                contentType: "application/json; charset=utf-8",
                dataType: "JSON",
                success: function (data, status) {
                        //if(JSON.stringify(data)!="{\"d\":\"ChartList fail\"}"){
                                //updategoogleData(data.d);
                                //alert(data.d)
                                sessionStorage.setItem("googledata",data.d);
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
                var data1=sessionStorage.getItem("googledata");
                var data = eval("(" + data1 + ")");

                ondata=JSON.parse(ondata);
                sessionStorage.setItem("googledata",JSON.stringify(ondata));
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
                sessionStorage.setItem("googlechart",JSON.stringify(set));

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

//#region googlechart execute
function googlechartInit(id, options) {
    $("#" + id).empty();
    chartdiv = id;
    var gdt = "";
        if(typeof options!="undefined")gdt=options.gdt
    drawChart1(chartdiv, gdt);
   
}
var wrapper,cht, data = "";
function drawChart1(mode, opt) {
    var chartid = chartdiv;
    if (typeof opt != "undefined" && opt != "")
        cht = opt;
    else if ($("#lbCtr").text() != "" || chartdiv != "")
        cht = readdata(chartdiv, "gdt");

    else if ($("#archivegdt").text() != "") {
        var agdt = $("#archivegdt").text();
        if (agdt != "")
            cht = JSON.parse(agdt);
    }
    //data
    if (typeof cht != "undefined" && cht.hasOwnProperty("data")) {
        data = cht.data;
    }
    else if ($("#spdataajax").text() != "")
        data = JSON.parse($("#spdataajax").text());

    if (data != "") {
        if (data.hasOwnProperty("datalist") | data.hasOwnProperty("querylist"))
            drawChart2(data, mode, cht, opt)
        else {
            var dcode = ""
            if (data.hasOwnProperty("code")) dcode = data.code
            else if (data.hasOwnProperty("datacode")) dcode = data.datacode
            if (dcode != "")
                jsonReadAjax("imcdata", "", "code", dcode, drawChart2, [mode, cht, opt])
        }
    }
}
function drawChart2(data, mode, cht, opt) {
    //cht: same with gdt(chart info)
    //mode: div id to insert chart(''= chartid)
    var rtn = googlechartdt(cht, data);
    var options = {}, ctype = "ColumnChart", layout, flist = "", slist = "", val = "", ser = "", ax = "", json;
    json = rtn.json, options = rtn.options, ctype = rtn.ctype, flist = rtn.flist, slist = rtn.slist;
    switch (mode) {
        case "edit":
            wrapper = new google.visualization.ChartWrapper({
                'chartType': ctype,
                'dataTable': json,
                containerId: 'dvChart',
                'options': options
            });
            styleInsert("charteditor-style", ".google-visualization-charteditor-dialog {   width:960px;height:560px;border:solid 1px gray;z-index: 402 !important;}");
            chartEditor = new google.visualization.ChartEditor();
            chartEditor.openDialog(wrapper, {});
            google.visualization.events.addListener(chartEditor, 'ok', function () {
                var editor = JSON.parse(JSON.parse(JSON.stringify(chartEditor.getChartWrapper())));
                cht.options = editor.options;
                cht.options.width = "100%";
               // cht.options.height = "100%";
                cht.chartType = editor.chartType;
                var src = "";
                if (typeof opt != "undefined") src = opt.src;
                cht.ctrtype = 'googlechart';

                commonsave(chartdiv, src, cht, opt)
                console.log(opt)
                if(src=="list")
                $("#archivegdt").text(JSON.stringify(cht));
                if ($('#dvChtedit').length)
                    $('#dvChtedit').empty();
                drawChart1('dvChtedit', opt);
            });
            break;
        case "dvChtedit":
            //options.height = "100%";
            $('#dvChtedit').empty();
            console.log(cht, json, data)
            drawDashboard('dvChtedit', cht, json,data);
            break;
        default:
            //options.height = 350;
            drawDashboard(mode, cht, json,data);
            break;
    }
}
function googlechartdt(cht, data) {
    var chartid, options = {}, ctype = "ColumnChart", layout, flist = "", slist = "", val = "", ser = "", ax = "";

    if (typeof cht != "undefined") {
        if (cht.hasOwnProperty("options")) {
            options = cht.options;
            cht.options.height = "100%";
            cht.options.width = "100%";
        }
        //options.width = 500;
        if (cht.hasOwnProperty("chartType")) ctype = cht.chartType;
        if (cht.hasOwnProperty("layout")) {
            layout = axismake(cht.layout);
            //common
            val = layout.value;
            if (layout.hasOwnProperty('axis')) ax = layout.axis;
            if (layout.hasOwnProperty('series')) ser = layout.series;
            flist = layout.filterlist;
            slist = layout.sortlist;
        }

        //var filter = '', dlist;
        //if (data.hasOwnProperty('filter')) filter = data.filter;
        //if (data.hasOwnProperty('datalist')) dlist = data.datalist;
        //var datalist = applyFilter(dlist, filter);
        var datalist = datalistreturn(data);

        var json = makeGoogleDataTable(datalist, ax, ser, val, flist, slist);
    }
    return { json: json, options: options, ctype: ctype, flist: flist, slist: slist }
}
function axismake(layout) {
    var rtn = {}, sort = [], sum, val = [],dir=false;
    $.each(layout, function (i, k) {
        switch (k.type.toLowerCase()) {
            case "value":
                sum = k.Sum
                val.push(k.field + "," + sum);
                break;
            case "axis":
                rtn.axis = k.field;
                rtn.axistype = k.datatype
                break;
            case "series":
                rtn.series = k.field;
                break;
        }
        //sort
        if (k.Sort == "Yes") sort.push(k.field + "," + k.asc);
        if (k.asc == "desc") dir = true;
        //if (k.Sort == "Yes") sort.push(layout.length-1-i+ "," + dir);

    });
    rtn.value = val.join(";");
    rtn.sortlist = sort.join(";");
    rtn.filterlist = "";
    return rtn;
}
var paramshow = "none";
var tb = "",drawcht;
function drawDashboard(dvcht, cht, json,data) {
    if (dvcht == "") dvcht = chartdiv;
    if (typeof dvcht == "object") var gchart = dvcht;
    else
    var gchart = $("#" + dvcht);
    gchart.css("overflow", "hidden");
    var contain = document.createElement('div');
    contain.id = "dvContainer"; //  document.getElementById('dvContainer');
    $("#dvContainer").remove();
    //contain.innerHTML = "";
    gchart.append(contain);
   // gchart.css("width", "99.5%");
    var dvdash = document.createElement('div');
    contain.appendChild(dvdash);
    var dvactr = document.createElement('div');
    dvactr.setAttribute("class", "google-visualization-controls-theme-contrast");
    dvactr.id = "dvAxis";

    var chartid, options, ctype= "ColumnChart", layout;
    chartid = chartdiv;
 
    if (cht.hasOwnProperty("options")) options = cht.options;
    //value control
    if (cht.hasOwnProperty("chartType")) ctype = cht.chartType;
    layout = axismake(cht.layout);
    //common
    var ax = layout.axis;
    var axtype = layout.axistype;
    var ser = layout.series;
    var val = layout.value;
    var filterlist = layout.filterlist;
    var sortlist =  layout.sortlist;

    val = val.split(';');

    if (ser == "")
        for (m in val) {
            dv = document.createElement('div');
            dv.id = "dvValue" + m;
            dv.setAttribute("style", "padding:5px 0 5px 5px;display:" + paramshow + ";");
            dv.setAttribute("class", "google-visualization-controls-theme-contrast");
            dvdash.appendChild(dv);
        }

    //chart
    var dvcht = document.createElement('div');
    dvcht.id = "dvChart";
    //table
    var dvtb = document.createElement('div');
    dvtb.id = "dvTable";
    dvtb.setAttribute("style", "display:" + paramshow + ";padding:5px 0 0 5px;");
    if (axtype == "datetime") {
        dvdash.appendChild(dvcht);
        //dvdash.appendChild(dvactr);
        dvactr.setAttribute("style", "padding:0px 0 5px 5px;display:" + paramshow + ";height:50px;");

    }
    else {
        //dvdash.appendChild(dvactr);
        dvdash.appendChild(dvcht);
        dvactr.setAttribute("style", "padding:5px 0 5px 5px;display:" + paramshow + ";");
    }

    //axis control
    var ctrtype = "CategoryFilter";
    if (axtype == "datetime")
        ctrtype = "ChartRangeFilter";
    var actr = setControl(ctrtype, ax, dvactr);

    drawcht = setChart(ctype, dvcht, options);
    //click event
    var func = function () { selectHandler1(chartid,data,cht) };
    google.visualization.events.addListener(drawcht, 'select'
        ,func);

    tb = setChart("Table", dvtb, "");
    //google.visualization.events.addListener(tb, 'select', selectHandler);
    //dashboard
    var myDashboard = new google.visualization.Dashboard(dvdash);

    if (ser == "")
        for (m in val) {
            var dvval = document.getElementById('dvValue' + m)
            var vctr = setControl("NumberRangeFilter", val[m].split(',')[0], dvval);
            myDashboard.bind(vctr, drawcht);
            //myDashboard.bind(vctr, tb);
        }
    //myDashboard.bind(actr, tb);
        myDashboard.bind(actr, drawcht);
    //series control

    //sort

    var view = new google.visualization.DataView(json);
    //if (sortlist != "")
    // view.setRows(view.getSortedRows(googleSortArray("1,true")));
 //       var sortexp = googleSortArray(sortlist, json);
//        if(sortexp.length>0)
//        view.setRows(view.getSortedRows(googleSortArray(sortlist,json)));
 //       console.log(googleSortArray(sortlist,sortexp))
    if (filterlist != "")
    //filterlist=[{"column":0,"minValue":new Date(2014,10,1),"maxValue":new Date(2014,10,30)}];
    //view.setRows(view.getFilteredRows(filterlist));
    //view.setRows(view.getFilteredRows([{"column": 0, "minValue": "new Date('2014-11-1')"}]));
        view.setRows(view.getFilteredRows(googleFilterArray(filterlist)));

    myDashboard.draw(view);
    var cdv=$("#" + chartdiv),cls=cdv.attr("class");
    cdv.removeClass();
    cdv.addClass(cls);
    //$("#" + chartdiv).css("margin", "3px 0");
}
function selectHandler1(chartid,data,cht) {
    //var selection = drawcht.getChart().getSelection();
    //console.log(data,cht)
    //var dt = drawcht.getDataTable();
    //var message = '';
    //for (var i = 0; i < selection.length; i++) {
    //    var item = selection[i];
    //    if (item.row != null && item.column != null) {
    //        var str = dt.getFormattedValue(item.row, item.column);
    //        message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
    //    } else if (item.row != null) {
    //        var str = dt.getFormattedValue(item.row, 0);
    //        message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
    //    } else if (item.column != null) {
    //        var str = dt.getFormattedValue(0, item.column);
    //        message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
    //            }
    //}
    //if (message == '') {
    //    message = 'nothing';
    //}
    //var xcol = dt.getValue(selection[0].row, 0);
    //var rowcol = selection[0];

    //console.log(JSON.stringify(xcol,rowcol));//, message, dt.getValue(selection[0].row, 0),dt.getValue(0,selection[0].column), selection[0].row, selection[0].column, selection[0], selection)
    // console.log(dt.getValue(selection[0].row, 0), dt.getValue(0, 5), dt.getValue(0, 0), JSON.parse(JSON.stringify(dt)), 'You selected ' + message);
    //var chartdata = selectimctable(menuid, subid, chartdiv);
    //if (chartdata.hasOwnProperty("event")) {
    //    eventInit(chartdiv, dt.getValue(selection[0].row, 0));
    //}


    var selection = drawcht.getChart().getSelection();
    var dt = drawcht.getDataTable();
    //click point row name
    var rname = dt.getValue(selection[0].row, 0),rfield;
    //click point row field
    if (cht.hasOwnProperty("layout")) {
        var lay = cht.layout;
        $(lay).each(function (i, k) {
            if (k.type == "Axis") {
                rfield = k.field;
            }
        });
    }
    var datalist = datalistreturn(data),keycode;
    //find reload mapping linkfield
    if (cht.hasOwnProperty("eventlist")) {
        var ev = cht.eventlist;
        $(ev).each(function (i, k) {
            if (k.command == "load")
                keycode = k.linkfield;
        });
    }
    var mapcode;
    $(datalist).each(function (i, k) {
        if (k[rfield] == rname) {
            mapcode = k[keycode];
        }
    });
    reloadexe(chartid,[{code:keycode,value:[mapcode]}],'link');
}

function modifyCtype(ctype) {
    //    if (ctype.indexOf("Chart") == -1)
    //        ctype += "Chart";
    //    return ctype.capitalize();
    return ctype;
}
function setChartView() {
    var state = columnFilter.getState();
    var row;
    var view = {
        columns: [0]
    };
    for (var i = 0; i < state.selectedValues.length; i++) {
        row = columnsTable.getFilteredRows([{ column: 1, value: state.selectedValues[i]}])[0];
        view.columns.push(columnsTable.getValue(row, 0));
    }
    // sort the indices into their original order
    view.columns.sort(function (a, b) {
        return (a - b);
    });
    chart.setView(view);
    chart.draw();
}
function setControl(ctrtype, filtercolumn, div) {
    // Create a date range slider
    var set = {};
    set.controlType = ctrtype;
    set.containerId = div;
    var opt = {};
    opt.filterColumnLabel = filtercolumn;
    var ui = {};
    ui.labelStacking = 'vertical';
    ui.allowTyping = false;
    ui.allowMultiple = true;
    ui.chartOptions = { chartArea: { width: '80%'} };
    opt.ui = ui;

    set.options = opt;

    var ctr = new google.visualization.ControlWrapper(set);

    return ctr;
}
function setChart(chttype, div, options) {
    var set = {};
    set.chartType = chttype;
    //set.dataTable=createTable();
    /*
    options.sortColumn=1;
    options.sortAscending= false;*/

    //options.chartArea = { left: 10, top: 20, width: "90%", height: "80%" };
    set.options = options;
    set.containerId = div;
    var cht = new google.visualization.ChartWrapper(set);
    return cht;
}
function googlechartList() {
    $("#dvChartDesign").hide();
    $("#dvChartlist").show();
    $("#inpList_cht").attr("onclick", "multipleEdit('')");
    $("#inpList_cht").attr("value", "New");
    $("#inpCancel_cht").hide();
    $("#inpSave_cht").hide();

    var gridid = "tbChartlist";
    var pagerid = "dvChartlistpager";

    $("#dvChartlist").append("<div style='text-align:right;padding-top:5px;'><Button onclick=\"googlechartDesign('')\">New</Button>&nbsp;" +
    "<Button onclick=\"multipleChartselect('" + gridid + "')\" >Select</Button></div>");
    //gridid,pagerid,data만으로 구성되는 data display용 jqgrid
    $("#" + gridid).jqGrid("GridUnload");

    var datasrc = sessionStorage.getItem("googlechart");
    datasrc = eval("(" + datasrc + ")");
    if (datasrc != null) {
        var li = [];
        $.each(datasrc, function (i, k) {
            if (i != "updated")
                li.push(k);
        });


        var colmodel = []; var colname = []; var dtarr = [];
        colname = ["id", "chartType", "title", "value", "axis", "series"]
        $.each(li[0], function (i, v) {
            var imsi = {};
            $.each(colname, function (j, col) {
                $.each(v, function (fname, vv) {
                    if (col == fname) {
                        imsi[fname] = vv;
                    }
                    if (col == "title" && fname == "options")
                        imsi.title = v.options.title;
                });
            });
            dtarr.push(imsi);
        });
        $.each(colname, function (i, fname) {
            var opt = { name: fname, width: 100 };
            switch (fname) {
                case "id":
                    opt.hidden = true;
                    break;
            }
            colmodel.push(opt);
        });
        colname.push('', '');
        colmodel.push({ name: 'edit', width: 15, sortable: false });
        colmodel.push({ name: 'del', width: 15, sortable: false });
        //opt:option 추가 사항
        var options = {
            colNames: colname,
            colModel: colmodel,
            datatype: "local",
            data: dtarr,
            height: "auto",
            multiselect: true,
            autowidth: true,
            rowNum: 5,
            rowList: [5, 10, 20, 30],
            pager: pagerid,
            //caption: "Data View",
            sortable: true,
            //onSelectRow: function (rowid) { console.log(jQuery("#" + gridid).getRowData(rowid).code) },
            gridComplete: function () {
                var selchtids = [];
                $.each(chtlist, function (i, k) {
                    selchtids.push(k.id);
                });
                var ids = jQuery("#" + gridid).jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var rowarr = jQuery("#" + gridid).getRowData(cl);

                    if ($.inArray(rowarr.id, selchtids) > -1)
                        jQuery("#" + gridid).jqGrid('setSelection', cl);
                    ae = "<span class='ui-icon ui-icon-check'  onclick=\"googlechartEdit('" + rowarr.id + "');\"  />";
                    be = "<span class='ui-icon ui-icon-pencil'  onclick=\"googlechartDesign('" + rowarr.id + "');\"  />";
                    ce = "<span class='ui-icon ui-icon-trash'   onclick=\"chartDel('" + rowarr.id + "');\" />";
                    jQuery("#" + gridid).jqGrid('setRowData', ids[i], { edit: ae });
                }
            }
        };
        jQuery("#" + gridid).jqGrid(options);
        $("#" + gridid).jqGrid('navButtonAdd', '#' + pagerid, {
            caption: "Edit",
            buttonicon: "ui-icon-circle-plus",
            onClickButton: function () {
                //multipleEdit('');
            },
            position: "last"
        });
    }
    else
        RenderGridBlank(gridid, pagerid);
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

//#region jstree
//#region jstree exe
function jstreeInit(id, options) {
    var gdt, editmode, contain = $("#" + id);

    if (typeof options != "undefined") {
        if (options.hasOwnProperty("gdt")) gdt = options.gdt;
        if (options.hasOwnProperty("contain")) {
            contain = options.contain;
            gdt.contain = contain;
            //contain.empty();
        }
    }
    var td = contain.closest("td");
    var dv = $("<div class='jstree' style='width:100%'/>");
    dv.attr("id", id);
    //td.empty();
    td.append(dv);
    if(typeof gdt=="undefined") {
        if ($("#archivegdt").text() != "")
            var gdt = JSON.parse($("#archivegdt").text());
        else
            gdt = readdata(id, "gdt");
    }
    
   jstreeInitmake(gdt, id);
}
function jstreeInitmake(ctr, dvid) {
    jstreeInitmake.datasrc = datasrc;
    if (typeof ctr != "undefined") {
        var ctrdt, datacode="",filter="";
        if (ctr.hasOwnProperty("data")) {
            ctrdt = ctr.data;
            if (ctrdt.hasOwnProperty("datacode")) {
                datacode = ctrdt.datacode;
                filter = ctrdt.filter;
            }
        }
        if(datacode!="" )
            jsonReadAjax("imcdata", "", "code", datacode, jstreeInitmake.datasrc, [ctr,filter]);
    }
    function datasrc(dtsrc, ctr,filter) {
        var dt;
        dt = datalistreturn(dtsrc);
        if (filter != "") dt = applyFilter(dt, filter);
        dt = jstreeData(dt, ctr.setting);
        var valuebox = "", display = "";
        if (ctr.hasOwnProperty("setting")) {
            var setting = ctr.setting;
            if (setting.hasOwnProperty("display")) display = setting.display;
            if (setting.hasOwnProperty("valuebox")) valuebox = setting.valuebox;
        }
        var options = jstreeOptionmake(ctr); //ctr.options;
        if (ctr.hasOwnProperty("contain")) options.contain = ctr.contain;
        if ($("#" + dvid).length > 0) {
           // $("#" + dvid).empty();
            loadtreewithdata1(dvid, dt, options); //plugin, textbox, valuebox, type)
        }
        setTimeout(function () {
            $(".jstree-icon.jstree-themeicon").each(function (i, k) {
                var k1 = k;
                var cls = $(k1).attr("class").replace("jstree-icon jstree-themeicon", "").replace("jstree-themeicon-custom", "");
                if ($.trim(cls) == "fa")
                    $(k).css("display", "none");
            });
            if (ctr.hasOwnProperty("eventlist")) {
                var event = ctr.eventlist;
                actionbutton(dtsrc, dvid, ctr, $("#" + dvid));
            }
        }, 3000);
    }
}
function jstreePreview(gdt, dvid) {
    //var gdt = readdata(id, "gdt");
    //if (typeof gdt == "undefined")
    //    jsonReadAjax("imclist", "jstree", "code", id, archivejstree, [dvid]);
    //else
    //    archivejstree(gdt, dvid);
   // function archivejstree(gdt, dvid) {
        var jqset = saveTable("tes1");
        var setting = {}
        if (jqset.length > 0) {
            $.each(jqset, function (i, k) {
                setting[k[0]] = k[1];
            });
        }
        else
            setting = gdt.setting;
     
        var dsc = $("#spdataajax").text();
        if (dsc != "")
            datasrc(JSON.parse(dsc), setting, dvid);
   // }
   
        function datasrc(dtsrc, setting, dvid) {
            // var dt = dtsrc.datalist;
            var dtlist = $("#spdlist").text();
            if (dtlist != "") dtlist = JSON.parse(dtlist);
            //var dt = applyFilterFromData(dtsrc, dtlist);
            //console.log(dt)
        var dt = jstreeData(dtlist, setting);
        if (typeof dvid == "undefined") {
            dvid = "dvtx";
            $("#dvtx").attr("id", "dvtx1");
            $("#dvdvtx").attr("id", "dvtx1");
            $("<div id='dvtx' style='padding:10px 0 0 0'/>").insertAfter($("#dvtx1"));
            $("#dvtx1").remove();
        }
        loadtreewithdata1(dvid, dt, setting);
    }
    jstreePreview.datasrc = datasrc;
   // jstreePreview.archivejstree = archivejstree;
}
function jstreeData(src, setting) {
    //field=["parent","value","text","topnode","topnodename"]
    //extract all data
    var data = [];
    var set = {};
    var pic = {}, top = "", parent = "", def = "", pcode, value;
    if (typeof setting != "undefined") {
        if (setting.hasOwnProperty("iconpic")) {
            if (setting.iconpic != "") {
                pic = JSON.parse(setting.iconpic);
                if (pic.hasOwnProperty("Top")) top = pic.Top;
                if (pic.hasOwnProperty("Parent")) parent = pic.Parent;
                if (pic.hasOwnProperty("Default")) def = pic.Default;
            }
        }
        if (setting.hasOwnProperty("parent")) pcode = setting.parent;
        if (setting.hasOwnProperty("value")) value = setting.value;
        if (setting.hasOwnProperty("topnode") && setting.topnode != "") {
            var  topid = setting.topnode,newsrc = [];
            recurchild(src, topid, pcode,newsrc);
            //include self(topid)
            var selfdt = $.grep(src, function (a) {
                return a[value] == topid;
            });
            if (selfdt.length > 0) {
                var ns = selfdt[0];
                ns[pcode] = "#";
            }
            else {
                ns = {};
                ns[pcode]="#";
                ns[value] = topid;
                ns[setting.text] = "Top";
            }
                
           
            newsrc.push(ns);
            src = newsrc;
        }
        $(src).each(function (i, k) {
            set = {};
            set.id = k[setting.value];//.toLowerCase();
            set.text = k[setting.text];
            set.parent = parentfind(src, k[setting.parent]);//.toLowerCase());
            if (k.hasOwnProperty("icon") && k.icon!="")
                set.icon = "fa " + pic[k.icon];
            else {
                if (def != "")
                    set.icon = "fa " + def;
                if (set.id == 'dv00000010')
               
                if (hasChild(src, set.id) && parent != "") {
                    if (parentfind(src, k[setting.parent]) == "#" && top != "")
                        set.icon = "fa " + top;
                    else
                        set.icon = "fa " + parent;
                }
                if (setting.topnode.toLowerCase() == set.id.toLowerCase() && top != "") set.icon = "fa " + top;
            }
            data.push(set);
        });
        function hasChild(src, node) {
            var chk = false;
            $(src).each(function (i, k) {
                if (setting.hasOwnProperty("parent") && node.toLowerCase() == k[setting.parent].toLowerCase())
                    chk = true;
            });
           
            return chk;
        }
        function parentfind(src, pcode) {
            var rtn = pcode, exist = false;
            $(src).each(function (i, k) {
                if (k[value].toLowerCase() == pcode.toLowerCase())
                    exist = true;
            });
            if (!exist) rtn = "#";
            return rtn;
        }

        //extract below top node
        var jstrdata = [];
        checkparent(data, setting.topnode, jstrdata);
        function checkparent(src, topvalue, jstrdata) {
            //recursively extract children nodes below topvalue
            $(src).each(function (i, k) {
                if (k.parent == topvalue) {
                    jstrdata.push(k);
                    checkparent(src, k.id, jstrdata);
                }
            });
        }
        function recurchild(data, pid, pcode,newsrc) {
            $(data).each(function (i, k) {
                if (k[pcode] == pid) {
                    newsrc.push(k);
                    data.splice(i, 1);
                    recurchild(data, k[value], pcode,newsrc);
                }
            });
        }
    }
    
    // data =  [{"id":"1","text":"Top Menu","parent":"#","icon":"fa fa-home"},{"id":"j4_1","text":"page2","parent":"1","icon":"fa fa-times-circle","permissionname":"","permission":""},{"id":"j16011219161","text":"page2222","parent":"1","icon":"fa fa-align-justify","permissionname":"User,free","permission":"CommonUsers,SL00000001"},{"id":"j6_1","text":"test123","parent":"j16011219161","icon":"fa fa-align-justify","permissionname":"","permission":""}]
    return data;
}
function jstreeOptionmake(ctr) {

    var rtn = {};
    rtn.ajax = true;
   // var ctr = readdata(id,'gdt');
  
    if (ctr.hasOwnProperty("setting")) {
        var parent = "", topnode = "", topname = "Top", value = "", text = "", button = false,  width = "150", textbox = "textlist", valuebox = "valuelist", display = "none", plugin = [], icon = "";
        var st = ctr.setting;
        if (st) {
            if (st.parent != "") parent = st.parent;
            if (st.topnode != "") topnode = st.topnode;
            if (st.topname != "") topname = st.topname;
            if (st.value != "") rtn.value = st.value;
            if (st.text != "") text = st.text;
            if (st.width != "") width = st.width;
            if (st.textbox != "") rtn.textbox = st.textbox;
            if (st.valuebox != "") rtn.valuebox = st.valuebox;
            if (st.display != "") rtn.display = st.display;
            if (st.plugin != "") rtn.plugin = $.merge(plugin,st.plugin);
            if (st.icon != "") rtn.icon = st.icon;
        }
        if (ctr.event) {
            if (ctr.event.hasOwnProperty("button"))
                rtn.button = ctr.event.button;
        }
    }
    return rtn;
}
var jstr, updatejs = 'no', jstreeval; //updatejs:yes일 경우 신규생성, 아니면 jstree reload
function loadtreewithdata1(jstreeid, data, options) {//plugin, textbox, valuebox, type) {
    //jstreeid:<div id="dvprodtree">,data:"prodlist":[{"id":"PD00000000","text":"Product","parent":"#","state":{"opened":true}}
    //,{"id":"PD00000228","text":"원데이아큐브","parent":"PD00000229"}]
    //plugin:["checkbox","DnD"....], textbox:
    //$.mobile.loading('hide');
    if (options.hasOwnProperty("contain"))
        jstr = options.contain;

    else if (typeof options != "undefined" && options.idtype == "object")
        jstr = jstreeid;
    else
        jstr = $('#' + jstreeid);


    var editnode = "";
    var op = {};
    op.core={
            'data': data
            , "check_callback": true
            , "initially_open": ["root"]
        };
    if(options.hasOwnProperty("plugin")) op.plugins= options.plugin;
    if (options.hasOwnProperty("types")) op.types = options.type;
    if (options.hasOwnProperty("contextmenu")) {
        op.contextmenu = {
            "items": options.contextmenu
        };
    }
    jstr.jstree(op);
    jstr.on("loaded.jstree", function (event, data) {
        //$(this).jstree("open_all");
        var depth = 3;
        data.instance.get_container().find('li').each(function (i) {
            if (data.instance.get_path($(this)).length <= depth) {
                data.instance.open_node($(this));
            }
        });
    });
    jstr.on('changed.jstree', function (e, data) {
        var i, r = [];
        var n = [];
        for (i in data.selected) {
            r.push(data.instance.get_node(data.selected[i]).id);
            n.push(data.instance.get_node(data.selected[i]).text);
        }
        if (options.display != "none") {
            var lbl = $("#" + options.textbox);
            switch (lbl.get(0).nodeName) {
                case "LABEL":
                    lbl.text(trimtxt(n, 15));
                    break;
                case "INPUT":
                    lbl.val(trimtxt(n, 15));
                    break;
            }
            jstreeval = r.join(',');
            var val = document.getElementById(options.valuebox);
            val.value = r.join(',');
        }
        var plugin = [], newplugin=[];
        if (options.hasOwnProperty("plugin")){
            plugin = options.plugin;
            $(plugin).each(function (i, k) {
                newplugin.push($.trim(k));
            });
        }
        //children of r
        var cnode = data.node.children;
        var combine = $.merge(r, cnode);    
        reloadexe(jstreeid, [{code:"code",value:combine}],'link'); 
        if (!options.button) {
            //eventInit(jstreeid, data.instance.get_node(data.selected[i]).id);
            setTimeout(function () { eventInit(jstreeid, r.join(',')); }, 0);
        }
    });
    jstr.on('rename_node.jstree', function (e, data) {
        var parent = data.node.parent;
        if (parent == '#') {
            parent = 0;
        }
        if (editnode == data.node.id) {
            update_item('update', data.node.parent, data.node.id, data.node.text);
            editnode = '';
        }
        else
            editnode = data.node.id;
    });
    jstr.on('create_node.jstree', function (e, data) {
            //update_item('new', data.node.parent, 0, data.node.text);
            editnode = data.node.id;

        });
    jstr.on("move_node.jstree", function (e, data) {
        move_item(data.node.id, data.old_parent, data.parent, data.old_position, data.position);
    });
    jstr.on("open_node.jstree", function (e, data) {
        setTimeout(function () {
            $(".jstree-icon.jstree-themeicon").each(function (i, k) {
                var k1 = k;
                var cls = $(k1).attr("class").replace("jstree-icon jstree-themeicon", "").replace("jstree-themeicon-custom", "");
                if ($.trim(cls) == "fa")
                    $(k).css("display", "none");
            });
        }, 0);
    });

    //newly create할 때만 생성, node create후 reload할 때는 중지
    //if (updatejs == "no")
   
    switch (options.display) {
        case "dialog":
            makejstreepop(jstreeid, options.textbox, options.valuebox);
            break;
        case "dropdown":
            makejstreediv(jstreeid, options);
            break;
    }

    function update_item(type, parent, nodeid, text) {
        var ctr = selectimctable(menuid, subid, jstreeid);
        var datacode = ctr.datacode;
        //remote var parent,id,text; parent='test',id='hhh',text='ooo'
        var comp1 = selectimc("imcsetting", "login").comp;
        var data1 = [{ code: nodeid, name: text, value: '', desc: '', parentcode: parent, comp: comp1}];
        data1 = JSON.stringify(data1);
        var data2 = "'" + data1 + "'";
        $.ajax({
            url: "/WebService.asmx/CodemstUpdate",
            data: { data: data2 },
            contentType: "application/json; charset=utf-8",
            dataType: "JSON",
            success: function (rtn) {
                dataListAjax(datacode, false);
                setTimeout(function () {
                    var clone = "<div id='" + jstreeid + "_clone'/>";
                    $('#' + jstreeid).after(clone);
                    $('#' + jstreeid).remove();
                    $("#" + jstreeid + "_clone").attr("id", jstreeid);
                    updatejs = "yes";
                    jstreeInit(jstreeid);
                }, 1000);

            },
            error: function (response) {
                var r = jQuery.parseJSON(response.responseText);
                alert("Message: " + r.Message);
                alert("StackTrace: " + r.StackTrace);
                alert("ExceptionType: " + r.ExceptionType);
            }

        });
    }
    function delete_item(nodeid) {
        $.ajax({
            url: "/WebService.asmx/CodemstDel",
            data: { code: JSON.stringify(nodeid) },
            contentType: "application/json; charset=utf-8",
            dataType: "JSON",
            success: function (data, status) {
                jstreeLocalUpdate(nodeid, "");
            },
            error: function (response) {
                var r = jQuery.parseJSON(response.responseText);
                alert("Message: " + r.Message);
                alert("StackTrace: " + r.StackTrace);
                alert("ExceptionType: " + r.ExceptionType);
            }

        });
    }

    function customMenu1($node) {
        var tree = jstr.jstree(true);
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
            "Rename": {
                "separator_before": false,
                "separator_after": false,
                "label": "Rename",
                "action": function (obj) {
                    tree.rename_node($node);
                    tree.edit($node); //puts the node into edit mode
                }
            },
            "Remove": {
                "separator_before": false,
                "separator_after": false,
                "label": "Remove",
                "action": function (obj) {
                    if (confirm('Are you sure to remove this category?')) {
                        tree.delete_node($node);
                        if (options.ajax)
                            delete_item($node.id);
                        else
                            jstreeLocalUpdate(nodeid, rowdata)
                    }
                }
            }
        }
        return items;
    }

    function jstreeLocalUpdate(nodeid, rowdata) {
        var ctr = selectimctable(menuid, subid, jstreeid);
        var datacode = ctr.datacode;
        var dt = selectimcdata("imcdata", ctr.datacode).datalist;

        $.each(dt, function (i, k) {
            if (k.id == nodeid) {
                switch (rowdata) {
                    case "":
                        dt.splice(i, 1);
                        break;
                    default:
                        dt[i] = rowdata;
                        break;
                }
                return false
            }
        });
        ctr.datalist = dt;
        //local
        var storename = JSON.parse(sessionStorage.getItem("imcdata"));
        $.each(storename, function (i, k) {
            if (k.code == datacode)
                storename[i].datalist = ctr.datalist;
        });
        sessionStorage.setItem("imcdata", JSON.stringify(storename));
    }
    function move_item(nodeid, pparent, cparent, porder, corder) {
        var ctr = selectimctable(menuid, subid, jstreeid);
        var datacode = ctr.datacode;
        var data1 = JSON.stringify([{ code: nodeid, prevparent: pparent, currparent: cparent, prevorder: porder, currorder: corder}]);
        var data2 = "'" + data1 + "'";

        $.ajax({
            url: "/WebService.asmx/CodemstOrderChg",
            data: { data: data2 },
            contentType: "application/json; charset=utf-8",
            dataType: "JSON",
            success: function (data, status) {
                dataListAjax(datacode, false);
            },
            error: function (response) {
                var r = jQuery.parseJSON(response.responseText);
                alert("Message: " + r.Message);
                alert("StackTrace: " + r.StackTrace);
                alert("ExceptionType: " + r.ExceptionType);
            }

        });
    }
    function trimtxt(txt, lth) {
        var rtn = "";
        if (txt.join(',').length > lth) {
            rtn = txt.join(',').substring(0, lth) + "...(Total: " + txt.length + ")";
        }
        else rtn = txt;
        return rtn;
    }
    return jstr;
}
function makejstreediv(jstreeid, options) {
    var dropdiv = $("<div id='dvi" + jstreeid + "' class='ddlDiv'  style='height: 200px;margin-top:20px;'></div>");
    var textbox = options.textbox,valuebox=options.valuebox,plugin=options.plugin;
    $("#" + jstreeid).wrap(dropdiv);
    $("#dvi" + jstreeid).wrap("<div id='dv" + jstreeid + "'></div>");
    $("#dvi" + jstreeid).css("margin", "3px 0");
    var input = document.createElement('input');
    input.id = textbox;
    input.setAttribute("class", "ddlTextbox");
    input.setAttribute("type", "text");
    $(input).on("click",function () {
        var dv = $("#dvi" + jstreeid);
        if (dv.css("visibility") == "visible")
            dv.css("visibility", "hidden");
        else
            dv.css("visibility", "visible");
    })
   // input.setAttribute("onclick", "ToggleTreeView('dvi" + jstreeid + "'); ");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("style", "margin-bottom:5px;");
    var input1 = document.createElement('input');
    input1.id = valuebox;
    input1.setAttribute("style", "display:none");
    document.getElementById("dv" + jstreeid).appendChild(input);
    document.getElementById("dv" + jstreeid).appendChild(input1);
   
    $(document).ready(function () {
        var w = $("#dvi" + jstreeid).parent().parent().width();
        $("#dvi" + jstreeid).css("width", w + "px") - 10;
        $("#dvi" + jstreeid).css("margin-top", "33px");
    });
    $(document).mouseup(function (e) {
        var container = $(".ddlDiv");
        var tbox = $(".ddlTextbox");
        var node = $(".jstree-icon.jstree-ocl");
        if (!container.is(e.target)  // if the target of the click isn't the container...
          && !tbox.is(e.target) && !node.is(e.target) && $(e.target)[0].nodeName != "I"
        ) // ... nor a descendant of the container
        {
            container.css("visibility", "hidden");
        }
        //if ($(e.target)[0].nodeName == "I" | container.is(e.target) | tbox.is(e.target)) {
        //    container.css("visibility", "visible");
        //}
        //else
        //    container.css("visibility", "hidden");
    });
}
function makejstreepop(jstreeid, textbox, valuebox) {
    $("#" + jstreeid).wrap("<div id='dvi" + jstreeid + "'  style='z-index:1001;width:300px;display:none;border:solid 1px #97BCE1;-moz-box-shadow:0 3 3px #000000;" +
        "-webkit-box-shadow:0 3 3px #000000;-moz-border-radius:5px;-webkit-border-radius:5px;padding:5px;background-color:#D0E1F1;height:auto;position:absolute;'></div>");
    $("#dvi" + jstreeid).prepend("<div style='text-align:right;' class='imexpand' onclick=\"$('#fade4').hide();$('#dvi" + jstreeid + "').toggle();\"><img src='/images/closegray.png'/></div>");
    $("#dvi" + jstreeid).draggable();
    //var dv = $("<div style='text-align:right;padding:5px 0 20px 0;'/>");
    //dv.append($("<input type='button' onclick=\"$('#fade4').hide();$('#dvi" + jstreeid + "').toggle();\" value='Close'/>").button());
    //$("#dvi" + jstreeid).append(dv);
    $("#dvi" + jstreeid).wrap("<div id='dv" + jstreeid + "'></div>");

    var lbl = document.createElement('label');
    lbl.id = textbox;
    lbl.setAttribute("class", "popimg");
    //input.setAttribute("disable", "true");
    lbl.setAttribute("onclick", "$('#fade4').show();$('#dvi" + jstreeid + "').toggle();");
    lbl.setAttribute("style", "border:none;height:36px;padding-left:20px;");
    $(lbl).on("click", function (e) {
        $("dvi" + jstreeid).css({ top: e.pageX, left: e.pageY });
    });
    var input = document.createElement('input');
    input.id = valuebox;
    input.setAttribute("style", "display:none");

    var fade = document.createElement('div');
    fade.id = "fade4";
    fade.setAttribute("class", "fade");
    fade.setAttribute("style", "display:none;z-index:1000;");
    fade.setAttribute("onclick", "$('#fade4').hide();$('#dvi" + jstreeid + "').toggle();");

    $("#dv" + jstreeid).prepend(lbl);
    document.getElementById("dv" + jstreeid).appendChild(input);
    document.getElementById("dv" + jstreeid).appendChild(fade);

}
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
//#endregion

//#region fullCalendar
//#region fullCalendar exe
var fulldatalist = [], fulldata, mapfield;
function fullCalendarInit(dvid, options) {
    var gdt, editmode, contain = $("#" + dvid);

    fullCalendarInit.datasrc = datasrc;
    if (typeof options != "undefined") {
        if (options.hasOwnProperty("gdt")) gdt = options.gdt;
        if (options.hasOwnProperty("contain")) {
            contain = options.contain;
            contain.empty();
        }
    }
    if (typeof gdt == "undefined") {
        if ($("#archivegdt").text() != "")
            var gdt = JSON.parse($("#archivegdt").text());
        else
            gdt = readdata(dvid, "gdt");
    }
    if (typeof gdt != "undefined") {
        var ctrdt, datacode = "", filter = "";
        if (gdt.hasOwnProperty("data")) {
            ctrdt = gdt.data;
            if (ctrdt.hasOwnProperty("datacode")) {
                datacode = ctrdt.datacode;
                filter = ctrdt.filter;
            }
        }
        if (datacode != "")
            jsonReadAjax("imcdata", "", "code", datacode, fullCalendarInit.datasrc, [dvid, gdt, filter, contain]);
        else
            datasrc("", dvid, gdt, filter, contain);
    }
    function datasrc(data, dvid, gdt, filter, contain) {
        var dt="",mappeddt="",field="";
        if (data != "") {
            dt = datalistreturn(data);
            fulldatalist = dt;
            if (filter != "")
                dt = applyFilter(fulldatalist, filter);
            fulldata = data;
        }
        if (gdt.hasOwnProperty("setting") && gdt.setting.hasOwnProperty("field")) {
            field = gdt.setting.field;
            mapfield = field;
            mappeddt = calendardatamapping(field, dt);
            //fulldatalist = mappeddt;
        }
        initCalendardata();
        Date.prototype.addMinutes = function (m) {
            this.setMinutes(this.getMinutes() + m);
            return this;
        }
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + days);
            return this
        }
        var extid = "dvExt" + dvid;
        var dropid = "drop-remove" + dvid;
        var wrap = $("<div class='wrap'/>"), ext = "";// = $("<div id='" + extid + "' class='external-events'/>");
        var devider = $("<div class='devider imdimmer' id='devider" + dvid + "' onclick=\"showExternal('" + dvid + "');\" class='imexpand'><img src='/images/Files-Add-List-icon.png' style='width:90%' /></div>");
        //var devider = $("<img class='imexpand' onclick=\"showExternal('" + dvid + "');\" src='/images/icon/application_side_list.png'  />");
        //var cb = $("<p><input id='"+dropid+"' type='checkbox'/><label for='"+dropid+"'>once</label></p>");
        var cal = $("<div id='cal" + dvid + "' />");
        cal.addClass("fullcalendar1");
        ext = makeSidebar(dvid, true,data);
        wrap.append(ext);
        wrap.append(cal);
        contain.empty();
        contain.append(wrap);

        $('#dvPicker' + dvid + ' .ui-datepicker').css({ 'width': '202px' });
        $('#dvPicker' + dvid + ' .ui-datepicker td a').css({ 'height': '12px' });
        var currentMousePos = {
            x: -1,
            y: -1
        };
        $(document).on("mousemove", function (event) {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY;
        });
        var isElemOverDiv = function (trashEl) {
            //var trashEl = jQuery('#calendarTrash');

            var ofs = trashEl.offset();

            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);

            if (currentMousePos.x >= x1 && currentMousePos.x <= x2 &&
                currentMousePos.y >= y1 && currentMousePos.y <= y2) {
                return true;
            }
            return false;
        }
        var  st = "";//,list = readdata(dvid, "gdt");
        if (typeof gdt != "undefined")
            if (gdt.hasOwnProperty("setting")) {
                if (gdt.setting.hasOwnProperty("options")) {
                    st = gdt.setting.options;
                }
            }
        var width = "", firstday = "", alldayslot = true, alldaytext = "종일", defaultview = "month", sidebarshow = false;
        if (st != "") {
            if (st.hasOwnProperty("Width")) width = st.Width;
            if (st.hasOwnProperty("Firstday")) firstday = st.Firstday;
            if (st.hasOwnProperty("AllDaySlot")) alldayslot = st.AllDaySlot;
            if (st.hasOwnProperty("AllDayText")) alldaytext = st.AllDayText;
            if (st.hasOwnProperty("defaultView")) defaultview = st.defaultView;
            if (st.hasOwnProperty("sideBarShow")) sidebarshow = st.sideBarShow;
        }

        cal.fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultDate: new Date(),
            defaultView: defaultview,
            selectable: true,
            editable: true,
            selectHelper: true,
            eventLimit: true, // allow "more" link when too many events
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            firstDay: firstday,                         //---        0. 일요일
            weekends: true,
            allDaySlot: alldayslot,
            allDayText: alldaytext,
            axisFormat: 'hh:mm',
            slotMinutes: 30,
            defaultEventMinutes: 60,
            firstHour: 9,
            buttonText: { today: '오늘', month: '월', week: '주', day: '일' },
            select: function (start, end, allDay) {
                var sd = getLocalTimeFromGMT(start._d); 
                var sd = new Date(sd);
                var outStr = sd.getHours() + ':' + sd.getMinutes() + ':' + sd.getSeconds();
                if (outStr == "0:0:0")
                    sd.setHours(sd.getHours() + 9);
                var ed = new Date(sd);
                ed.setHours(ed.getHours() + 1);
                sd = makeDateTime(sd);
                ed = makeDateTime(ed);
                eventPop(dvid, "", false, sd, ed, "", "");
            },
            eventClick: function (event, jsEvent, view) {
                var st = getLocalTimeFromGMT(event.start);
                var ed = getLocalTimeFromGMT(event.end);
                var id = event._id;
                var allday = event.allDay;
                var repeat = event.recur;
                var resource = event.resource;
                var src = findCalendarSrc(dvid, event._id, dt);

                eventPop(dvid, id, allday, st, ed, resource, repeat, event);
            },
            drop: function (date, allday, id) { // this function is called when something is dropped
                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');
                var copiedEventObject = $.extend({}, originalEventObject);

                var sd = getLocalTimeFromGMT(date);
                var sd = new Date(sd);
                var outStr = sd.getHours() + ':' + sd.getMinutes() + ':' + sd.getSeconds();
                if (outStr == "0:0:0")
                    sd.setHours(sd.getHours() + 9);
                var ed = new Date(sd);
                ed.setHours(ed.getHours() + 1);
                sd = makeDateTime(sd);
                ed = makeDateTime(ed);

                if ($("#" + dropid).is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    //$(copiedEventObject).remove();
                    $(this).remove();
                    //console.log($(this), $(copiedEventObject))
                }

                //eventPop(dvid, "", false, copiedEventObject.start, copiedEventObject.end, $(this).attr("id"), "", copiedEventObject);
                eventPop(dvid, "", false, sd, ed, $(this).attr("id"), "", copiedEventObject);
                //var chname = findimcsettingvalue("code", $(this).attr("id"), "name", selectimc("imcsetting", "mychan"));
                $("#eventTitle").val($(this).text());
            },
            eventDrop: function (event, delta, revertFunc) {
                var allday = event.allDay;
                var st = getLocalTimeFromGMT(event.start);
                var ed = getLocalTimeFromGMT(event.end);

                var id = event.id;
                var resource = event.resource;

                var eventData = {
                    id: id,
                    title: event.title,
                    allDay: event.allDay,
                    start: st,
                    end: ed,
                    recurrence1: event.recurrence1,
                    resource: event.resource
                };
                if (!allday) {
                    if (ed == "1970/01/01 00:00") {
                        var date = new Date(st);
                        eventData.end = makeDateTime(date.addMinutes(60));
                    }
                }
                updateCalendarSrc(dvid, eventData);
            },
            eventResize: function (event, delta, revertFunc) {
                var st = getLocalTimeFromGMT(event.start);
                var ed = getLocalTimeFromGMT(event.end);
                var id = event.id;

                var allday = event.allDay;
                var resource = event.resource;
                var eventData = {
                    id: id,
                    title: event.title,
                    allDay: event.allDay,
                    start: st,
                    end: ed,
                    recurrence1: event.repeat,
                    resource: event.resource
                };
                updateCalendarSrc(dvid, eventData);
                cal.fullCalendar('updateEvents', eventData);
            },
            eventRender: function (event, element, view) {
                //            return (event.ranges(function (range) {
                //                return (event.start.isBefore(range.end) &&
                //                    event.end.isAfter(range.start));
                //            }).length) > 0;

                //            var originalClass = element[0].className;
                //            element[0].className = originalClass + ' hasmenu';
                //            var date = new Date(); //this is your todays date
                //
                //            if (event.start >= date) {
                //                $(element).css("backgroundColor", "#AD616B");
                //                $(element).css("borderColor", "#AD616B");
                //            }
                //             element.qtip({
                //                content: event.sdesc
                //            });
                if (typeof event.recurrence1 != "undefined" && event.recurrence1 != "") {

                    switch (view.name) {
                        case "month":
                            element.find('.fc-title').parent().append($("<span style='float:right;padding:2px 5px 0 0;'><i class=' fa fa-repeat'/></span>"));
                            break;
                        case "agendaDay": case "agendaWeek":
                            element.find('.fc-title').parent().append($("<div style='float:left;padding:2px 5px 0 0;'><i class=' fa fa-repeat'/></div>"));
                            break;
                    }
                }
                //            if (view.name == 'agendaDay') { // If day view
                //                element.find('.fc-time').remove(); // Remove the original time element
                //                element.prepend( // Add start and end
                //                    "<span>" + event.start.format('MMM D') + // Format however you want
                //                    "-</span><span>" + event.end.format('MMM D') + "<i class=' fa fa-repeat'/></span>");
                //            }
            },
            eventDragStop: function (event, jsEvent, ui, view) {
               
                var x = isElemOverDiv($('#dvTrash' + dvid));
                var y = isElemOverDiv($('#calendarTrash' + dvid));
                if (x | y) {
                    cal.fullCalendar('removeEvents', event.id);

                    if (field != "") {
                        var deldata=deleteimcdatalist(fulldata, field.id, event.id);
                     
                        jsonUpdateAjax("imcdata", "", JSON.stringify(deldata), "code", deldata.code);
                        remoteDel(event.id);
                    }
                   
                }
            },
            dayRender: function (day, cell) {
                var originalClass = cell[0].className;
                cell[0].className = originalClass + ' hasmenu';
            },
            eventSources: [{
                events: function (from, to, timezone, callback) {
                    from1 = from;
                    to1 = to;
                    var events = [];
                    var dtlist = makeCalrendardata(dvid, mappeddt);
                    
                    events = getRepeatList(dtlist, from, to);
                    callback(events);
                }
            }]
        });
        //end of calendar
        var caldata1 = [
    {
        // a recurring event
        title: 'Event1',
        start: '10:00',
        end: '14:00',
        dow: [1, 4], // Repeat monday and thursday
        ranges: [{ //repeating events are only displayed if they are within one of the following ranges.
            start: moment().startOf('week'), //next two weeks
            end: moment().endOf('week').add(0, 'd')
        }, {
            start: moment('2015-02-01', 'YYYY-MM-DD'), //all of february
            end: moment('2015-02-01', 'YYYY-MM-DD').endOf('month')
        }],

        exception: ['date', 'dow'],
        backgroundColor: "#FFF880",
        borderColor: "#FFF880",
        textColor: "black"
    },
    {
        // specific date event will be the unique for this day, no Event1
        title: 'Event2',
        start: '2015-06-20T11:00:00',
        end: '2015-06-20T13;00:00',
        backgroundColor: "#609060",
        borderColor: "#609060"
    },
    {
        // specific dow event will be unique for dow 0, no Event1
        title: 'Event3',
        start: '12:00',
        end: '13;00',
        dow: [1, 3],
        backgroundColor: "#9A9A9A",
        borderColor: "#9A9A9A",
        textColor: "black",
        ranges: [{
            start: moment('2015-06-21', 'YYYY-MM-DD'), //all of february
            end: moment('2015-06-21', 'YYYY-MM-DD').endOf('month')
        }]
    }
        ];

        function eventPop(dvid, id, allday, sd, ed, resource, repeat, event) {
            var sname = "", scode = "";
            var resarr = [];
            if (resource != "" && typeof resource != "undefined") resarr = resource.split(',');
            if (typeof resource != "undefined" && resource.length > 0) sname = resource[0]
            if ($("#tbPop").length > 0) $("#tbPop").remove();
            var dvpop = $("<div id='tbPop'/>");
            var calpop = $("<table style='width:100%'/>");
            calpop.append($("<tr><td style='width:60px'></td><td><label id='eventtype'></label></td></tr>"));
            calpop.append($("<tr><td>ID:</td><td><label id='eventid'/></label></td></tr>"));
            calpop.append($("<tr><td>Title:</td><td><input id='eventTitle'/></td></tr>"));
            calpop.append($("<tr><td>All Day:</td><td><input id='allday' type='checkbox' onchange=\"allday_change('" + dvid + "')\"/></td></tr>"));
            calpop.append($("<tr><td>Start:</td><td><input id='startTime' class='dpick'/></td></tr>"));
            calpop.append($("<tr><td>End:</td><td><input id='endTime' class='dpick'/></td></tr>"));
            calpop.append($("<tr><td>Calendar:</td><td><div id='jsCalendar'/></td></tr>"));
            calpop.append($("<tr><td>Repeat:</td><td><input type='checkbox' id='cbRepeat' onclick='cbRepeat_change()' /></td></tr></table>"));
            dvpop.append(calpop);
            var dv = $("<div  class='repeat'/>");
            calpop = $("<table/>");
            dv.append(calpop);
            dvpop.append(dv);

            calpop.append($("<tr><td style='width:60px'>Repeat:</td><td><select id='selRepeat' onclick='selRepeatChange();'/></td></tr>"));
            calpop.append($("<tr><td>Interval:</td><td><select id='selEvery' /><label/></td></tr>"));
            calpop = $("<table  id='trweek' style='display:none'/>");
            dv.append(calpop);
            var wk = "<tr><td style='width:60px'>On Day:</td><td><table><tr>" +
            "<td><label for='weekly_0'><input type='checkbox' class='week' id='weekly_0' />Sun</label></td>" +
            "<td><label for='weekly_1'><input type='checkbox' class='week' id='weekly_1' />Mon</label></td>" +
            "<td><label for='weekly_2'><input type='checkbox' class='week' id='weekly_2' />Tue</label></td>" +
            "<td><label for='weekly_3'><input type='checkbox' class='week' id='weekly_3' />Wed</label></td>" +
            "<td><label for='weekly_4'><input type='checkbox' class='week' id='weekly_4' />Thu</label></td>" +
            "<td><label for='weekly_5'><input type='checkbox' class='week' id='weekly_5' />Fri</label></td>" +
            "<td><label for='weekly_6'><input type='checkbox' class='week' id='weekly_6' />Sat</label></td></tr></table></td></tr>";
            calpop.append($(wk));
            var now = $.datepicker.formatDate('yy/mm/dd', new Date());
            var range = "<tr><td style='vertical-align:top;width:60px;'>End:</td><td><div id='range' style='display:block'>" +
            "<div style='border-bottom: 2px solid #d0d0d0; margin-top:10px; margin-bottom: 10px;'></div>" +
            "<label for='repeat_indefinitely'><input type='radio' name='repeat_range' id='repeat_indefinitely' />Repeat indefinitely</label><br />" +
            "<label for='repeat_until'><input type='radio' name='repeat_range' id='repeat_until' />Repeat until: </label><input id='repeat_until_value' style='width: 130px;' value='" + now + "'/><br />" +
            "<label for='repeat_times'><input type='radio' name='repeat_range' id='repeat_times' />Repeat </label><input id='repeat_times_value' style='width: 20px;' /> time(s).<br />" +
            "</div></td></tr>";
            calpop = $("<table/>");
            dv.append(calpop);
            calpop.append($(range));

            dvpop.dialog({
                width: 550,
                autoResize: true,
                modal: false,
                overlay: {
                    backgroundColor: "#000000",
                    opacity: 0.5
                },
                autoOpen: true,
                title: "Schedule Edit",
                stack: false,
                hide: {
                    effect: "explode",
                    duration: 1000
                },
                buttons: [
                    {
                        text: "Save",
                        icons: {
                            primary: "ui-icon-check"
                        },
                        click: function () {
                            calSave(dvid,event);
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
            dvpop.dialog("option", "position", 'center');
            styleInsert("dialog-css", ".ui-dialog { z-index: 1000 !important ;}");
            $("input:checkbox[id='allday']").attr("checked", allday);
            $("#startTime").val(sd);
            $("#endTime").val(ed);
            dtpick("#startTime");
            dtpick("#endTime");
            dtpick("#repeat_until_value");

            if (id != "") {
                var src = findCalendarSrc(dvid, id,dt);
                //$("#eventid").html(id);
                //$("#eventTitle").val(src.title);
                if (typeof event != "undefined") {
                    $("#eventid").html(event._id);
                    $("#eventTitle").val(event.title);
                }
                $("#eventtype").html("updateEvent");
                allday_change(dvid);
            }
            else {
                id = 'c' + idMake();
                $("#eventid").html(id);
                $("#eventtype").html("renderEvent");
            }
            var ext = selectimc("imcsetting", "mychan");

            populate(ext, "selChan", "select", resource);
            $('.repeat').css("display", "none");
            var rep = "", every = "", rpttype = "", range = "indefinitedly", until = "";
            if (typeof repeat != "undefined" && repeat != "") {
                var repeat = JSON.parse(repeat);
                $("input:checkbox[id='cbRepeat']").attr("checked", true);

                $('.repeat').css("display", "block");
                if (repeat.hasOwnProperty("days")) {
                    $(repeat.days).each(function (i, k) {
                        $($("input:checkbox[class='week']")[k]).attr("checked", true)
                    });
                }
                var ind = 0;
                $("#repeat_until_value").val("");
                $("#repeat_times_value").val("");
                switch (repeat.range) {
                    case "until":
                        $("#repeat_until_value").val(repeat.until);
                        ind = 1;
                        break;
                    case "times":
                        ind = 2;
                        $("#repeat_times_value").val(repeat.times);
                        break;
                }
                $($("input:radio[name='repeat_range']")[ind]).attr("checked", true);
                setTimeout(function () {
                    $("#selRepeat").val(repeat.type);
                    if (repeat.type == "weekly") {
                        $("#trweek").show();
                    }
                    $("#selEvery").val(repeat.every);
                }, 0);
            }

            //calendar jstree
            var data = [], list, jsopt = { textbox: "lbCalendar", valuebox: "inNodevalue2", display: "dialog" };
            jsopt.plugin = ["checkbox"];
            //$("<input id='inNodevalue2' type='hidden' />").appendTo($('body'));
            list = selectimctable(menuid, subid, dvid).setting.field.mycal;

            data.push({ "id": "0", "text": "Top", "parent": "#" });
            $.each(list, function (i, k) {

                var set = {};
                set.id = k.id;
                if (k.hasOwnProperty("title")) set.text = k.title;
                set.parent = "0";
                if ($.inArray(set.id, resarr) > -1)
                    set.state = { opened: true, selected: true };

                if (k.hasOwnProperty("colorlist"))
                    if (k.colorlist.length > 0) {
                        $(k.colorlist).each(function (j, l) {
                            var set = {};
                            set.id = l[0];
                            set.text = l[1];
                            set.parent = k.id;
                            if ($.inArray(l[0], resarr) > -1)
                                set.state = { opened: true, selected: true };
                            data.push(set);
                        });
                    }
                data.push(set);
            });

            loadtreewithdata1("jsCalendar", data, jsopt);
            $("#jsCalendar").jstree("remove", "#0");
            if (typeof resource != "undefined" && resource != "") {
                $("#inNodevalue2").val(resource);
                $("#lbCalendar").text(resource);
                $(resarr).each(function (i, k) {
                    $("#jsCalendar").jstree("select_node", k);
                });
            }
            // end of calendar

            populate([{ code: "daily", name: "Day" }, { code: "weekly", name: "Week" }, { code: "monthly", name: "Month" }], "selRepeat", "select", repeat);
            var date1 = [];
            for (i = 1; i < 30; i++) {
                var set = {};
                set.code = i;
                set.name = i;
                date1.push(set)
            }
            populate(date1, "selEvery", "select", "");
            $("#eventContent").attr('style', 'width:300px;height:300px;padding:20px;display:block;position:absolute;top:50%;left:50%;background-color:white;border:solid 1px black;z-index:1002;');
            $("#eventContent").draggable().resizable();


        }
        /* initialize the external events
        -----------------------------------------------------------------*/
        $("#" + extid + " .fc-event").each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };
            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);
            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
        $('.fc-left').prepend("<div id='calendarTrash" + dvid + "' class='imdimmer'><img src='/images/cal-trash.png' ></img></div>");
        $(".fc-left").prepend(devider);
        //when click calendar next prev button affect datepicker too
        $('.fc-prev-button').click(function () {
            var date1 = cal.fullCalendar('getDate');
            var dt = getLocalTimeFromGMT(date1._d);
            dt = new Date(dt);

            $('#dvPicker' + dvid).datepicker('setDate', dt);
            dpickStyle(dvid);
        });
        $('.fc-next-button').click(function () {
            var date1 = cal.fullCalendar('getDate');
            var dt = getLocalTimeFromGMT(date1._d);
            dt = new Date(dt);
            $('#dvPicker' + dvid).datepicker('setDate', dt.addDays(1));
            dpickStyle(dvid);
        });
        $('.fc-today-button').click(function () {
            var date1 = cal.fullCalendar('getDate');
            var dt = getLocalTimeFromGMT(date1._d);
            dt = new Date(dt);
            $('#dvPicker' + dvid).datepicker('setDate', new Date());
            dpickStyle(dvid);
        });
        $('.fc-toolbar').attr("style", "margin:0;border-top:solid 1px #DEDFDE;border-left:solid 1px #DEDFDE;border-right:solid 1px #DEDFDE;border-top-left-radius:5px;border-top-right-radius:5px;padding:5px 5px 5px 0;background-color:#EFEFEF;");
        if (sidebarshow) setTimeout(function () {
            $("#dvExt" + dvid).show("slow");
            $("#devider" + dvid).hide();;
            var calsize = $("#cal" + dvid).css("width").replace("px", "") - 230;
            $("#cal" + dvid).css("width", calsize);
        }, 0);
    }
}
function datatempsave() {

}
function selRepeatChange() {
    var dd = "";
    $("#trweek").hide();
    switch ($("#selRepeat").val()) {
        case "daily":
            dd = "일";
            break;
        case "weekly":
            dd = "주";
            $("#trweek").show();
            break;
        case "monthly":
            dd = "개월";
            break;
    }
    $("#selEvery").next().text(dd);
}
function cbRepeat_change() {
    $('.repeat').css("display", "none");
    if($("#cbRepeat").is(":checked"))
        $('.repeat').css("display", "block");
}
function allday_change(dvid) {

    var chk = $("#allday").is(":checked"); //.attr('checked');
    if (chk) {
        $("#startTime").attr("disabled", true);
        $("#endTime").attr("disabled", true);
    }
    else {
        $("#startTime").attr("disabled", false);
        $("#endTime").attr("disabled", false);
    }
}
function initCalendardata() {
    var login = getlogin();
    var staff = login.id;
    var param = "{'staff':'" + staff + "'}";
    AjaxAdd("imcsetting", "mychan", "/WebService.asmx/staffChanList", param, "","");
//    param = "{'comp':'" + login.comp + "','staff':'" + staff + "'}";
//    AjaxAdd('imcsetting', 'calendar', '/WebService.asmx/calendarList', param, "", "");

}

function calendardatamapping(field, dt, type) {
    //field:mapping table, dt:original database, type:forward(db->fullcalendar),backward(db<-fullcalendar)
    //convert data by mapping field title
    var newdt = [];
    var tit = Object.keys(field);
    //make mapping pair(name:fullcalendar field, value:original field)
    newset = []; $(tit).each(function (i, k) {
        var set = {};
        set.name = k;
        set.value = field[k];
        newset.push(set)
    })
    var compareval, renameval;
    if (typeof type == "undefined") type = 'forward';
    $(dt).each(function (i, k) {
        for (dtname in k) {
            $(newset).each(function (j, l) {
                if (l.name != l.value) {
                    switch (type) {
                        case "forward"://change to fullcalendar data format
                            compareval = l.value;
                            renameval = l.name;
                            break;
                        case "backward"://from fullcalendar format back to database original
                            compareval = l.name;
                            renameval = l.value;
                            break;
                    }
                    if (compareval == dtname) {
                        k[renameval] = k[dtname];
                        delete k[dtname];
                    }
                }
            });
        }
    });

    return dt;
}

function makeCalrendardata(dvid, dt) {
    var filter = [], datacode = "", caldata = [], cdata;
 
    $(dt).each(function (i, k) {
        if (k.allDay == "True" | k.allDay == "true" | k.allDay == true)
            k.allDay = true;
        else
            k.allDay = false;
        if (k.hasOwnProperty("backgroundColor") && k.backgroundColor != "") {
            k.borderColor = k.backgroundColor;
            k.textColor = textColorFind(k.backgroundColor.toUpperCase());
        }
       
        if (typeof k.start != "undefined" && k.start != "" ) 
            k.start = caldataformat(k.start);
            if (typeof k.end != "undefined" && k.end != "")
            k.end = caldataformat(k.end);
        
    });

    //highlight when mouseover to external
    caldata = hightlightLoop(dvid, dt);

    return caldata;
}
function caldataformat(date) {
    var datesplit = date.split(' ');
    var fixeddate = "",chk="";
    $(datesplit).each(function(i,k){
        if (k == "오전") chk = "am";
        else if (k == "오후") chk = "pm";
    });
    switch (chk) {
        case "am":
            fixeddate = date.replace("오전", "");
            fixeddate += " AM";
            break;
        case "pm":
            fixeddate = date.replace("오후", "");
            fixeddate += " PM";
            break;
        case "":
            fixeddate = date;
            break;
    }
    return fixeddate;
}
function textColorFind(backgroundColor) {
    var textColor = "white";
    if ($.inArray(backgroundColor, ["#CECFC6", "#FFFF94", "#FFD3DE", "#FDFD96", "#FFD1DC"]) > -1)
        textColor = "black";
    return textColor;
}
var from1, to1;
function highlight(dvid,dlist) {
    var cal = $("#cal" + dvid);
    cal.fullCalendar('removeEvents');
    var events = [];
    var dt = makeCalrendardata(dvid,dlist);
    events = getRepeatList(dt, from1, to1);

    cal.fullCalendar('addEventSource', events);
    cal.fullCalendar('rerenderEvents');
}
function hightlightLoop(dvid, dlist) {
    var dvc = $("#dvExtContents" + dvid);
    var resource = [], rtn = [];

    $(dvc.children().find($('input:checked'))).each(function (i, k) {
        resource.push($(k).attr("id").replace("cb", ""));
    });
    $(dvc.children().find($('.colorBox'))).each(function (i, k) {
        var clr = $(k).attr("style");
        if(typeof clr!="undefined")
        resource.push($(k).attr("id"));
    });
    //filter datasrc with list array
    if (resource.length > 0)
        $(dlist).each(function (i, k) {
            if ($.inArray(k.resource, resource) > -1)
                rtn.push(k);
        });
    else
        rtn = dlist;
    return rtn;
}
//function cbAll(dvid) {
//    var dvc = $("#dvExtContents" + dvid);
//    var chk = $("#cbAll" + dvid).is(":checked");
//    $(dvc.children()).each(function (i, k) {
//        var inp = $(k).find($('input'));
//        if(chk)
//            inp.prop('checked', true);
//        else
//            inp.prop('checked', false);
//    });
//    highlight(dvid);
//}
function makeSidebar(dvid, color,data) {
    if ($("#dvExt" + dvid).length > 0)
        $("#dvExt" + dvid).remove();
    var ext = $("<div id='dvExt" + dvid + "'  style='display:none;' class='external-events'/>");
    var topstyle="border-top:solid 1px #DEDFDE;border-left:solid 1px #DEDFDE;border-right:solid 1px #DEDFDE;";
    topstyle +="border-top-left-radius:5px;border-top-right-radius:5px;background-color:#EFEFEF;height:36px;text-align:right;";
    var topimg = "<img src='/images/closeblacknude.png' style='margin:10px 5px 0 0' class='imdim'/>";
    var top = $("<div style='"+topstyle+"' onclick=\"hideExternal('" + dvid + "')\">"+topimg+"</div>").insertBefore(ext);
    ext.append(top);
    var dvcin = $("<div style='border:solid 1px #DEDFDE;border-bottom-right-radius:5px;border-bottom-left-radius:5px;padding:5px;'/>");
    ext.append(dvcin);

    //datepicker
    var picker = $("<div id='dvPicker" + dvid + "' />");
    picker.datepicker({
        inline: true,
        changeYear: true,
        yearRange: "2005:2025",
        changeMonth: true,
        onSelect: function (dateText, inst) {
            var d = new Date(dateText);
            var cal = $('#cal' + dvid);
            var view = cal.fullCalendar('getView');
            cal.fullCalendar('gotoDate', d);
            if (view.name == 'agendaWeek')
                cal.fullCalendar('changeView', 'agendaWeek');
            else
                cal.fullCalendar('changeView', 'agendaDay');
            dpickStyle(dvid);
        },
        onChangeMonthYear: function (year, month, inst) {
            var d = new Date(year + "/" + month + "/1");
            var cal = $('#cal' + dvid);
            var view = cal.fullCalendar('getView');
            cal.fullCalendar('gotoDate', d);
            dpickStyle(dvid);
        }
    });
    dvcin.append(picker);

    //calendar
    var ctr = selectimctable(menuid, subid, dvid); var mycal = "";
    if(typeof ctr !="undefined")
    if (ctr.hasOwnProperty("setting"))
        if (ctr.setting.hasOwnProperty("field"))
            if (ctr.setting.field.hasOwnProperty("mycal"))
                mycal = ctr.setting.field.mycal;

    if (mycal != "") {
        var menu = $("<div/>"), ins = $("<div class='editfont imdim'><i class='fa fa-plus fa-lg'/>add calendar</div>"); menu.append(ins);
        ins = $("<div class='editfont'>Show All</div>"); menu.append(ins);
        var dvc1 = $("<div id='dvExtContents" + dvid + "' />");
        dvc1.append($("<div style='font-size:16px;margin:10px 0 5px 0;' class='over'><div style='float:left'> Calendar</div><div style='float:right;'><img id='imgopen' class='caledit imdimmer' onclick=\"$('#dvEditcal').slideToggle()\" src='/images/dropdownarrow.png'/></div></div><div style='clear:both'/>"));
        dvc1.append($("<div id='dvEditcal' style='display:none;' class='editbox' >" + menu.clone().html() + "</div>"));
        //dvc1.append($("<div style='margin-top:10px;'><input type='checkbox' id='cbAll" + dvid + "' onchange=\"cbAll('" + dvid + "')\" /><label>All</label>"));
         $(mycal).each(function (i, k) {
             dvc1.append(makeSidelist(dvid,k,data));
         });
    }
     documentreadyInsert("body-ready", "$('body').click(function(e){var container=$(\"#imgopen\"); if (!container.is(e.target)) $(\"#dvEditcal\").hide();});");
    dvcin.append(dvc1);
    dvcin.append($("<div id='dvTrash" + dvid + "' tooltip='Trash' style='display:none;margin-bottom:5px;vertical-align:middle;color:#555555;text-align:right;padding:5px;'><img src='/images/cal-trash.png' /></div>"));
    var sty = ".arrow{ background-repeat:no-repeat;font-size:14px;}";
    sty += ".arrowcollapse{ background-image: url('/images/dot02.gif');padding-left:20px;height:20px;background-position:5px 5px; }";
    sty += ".arrowexpand{background-image: url('/images/arrow_down.png');padding-left:20px;height:20px;background-position:0px 5px}";
    sty += ".arrowminus{ background-image: url('/images/collapse1.gif');padding-left:20px;background-position:0px 5px; }";
    sty += ".arrowplus{background-image: url('/images/expand1.gif');padding-left:20px;background-position:0px 5px;}";
    sty += ".colorBox{border:solid 1px #CBCBCB;width:12px;height:12px;margin:0 10px 0 0;font-size:14px;float:left;}";
    sty += ".over{background-color:#transparent;}";
    sty += ".over:hover{background-color:#EFEFEF;cursor:pointer}";
    sty += ".editbox{width:200px;height:100px;background-color:white;border:solid #CFCFCF 1px;position:absolute;z-index:100;left:205px;margin-top:-6px;box-shadow: 3px 3px 2px #888888;padding:10px;}";
    sty += ".editfont{padding:5px;font-size:16px;color:gray;cursor:pointer}";
    sty += ".editfont:hover{text-decoration:underline;color:#797979;}";
    //<img id='img12' style='vertical-align:middle;margin-right:11px;' src='/images/arrow_down.png'/>
    styleInsert("calColor-style", sty);

    return ext;
}
function makeSidelist(dvid,k,data) {
    var color = k.color, field = '',content="";
    var title = k.title, code = "", name = "";
    var wrap = $("<div />");
    if (k.hasOwnProperty("colorlist") && k.colorlist.length > 0) {
        content = $("<div class='arrow arrowminus imdim over' style='margin-top:5px;' onclick=\"toggleExternal1(this)\">" + title + "</div>");
        wrap.append(content);
        var dv = $("<div style='margin:0 0 0 6px' />");
        wrap.append(dv);

        $(k.colorlist).each(function (i, k) {
            var c = k[0];
            var n = k[1];
            var bgcolor = "border-color:" + k[2] + ";background-color:" + k[2] + ";color:" + textColorFind(k[2].toUpperCase());

            var tb = $("<table width='100%' cellpadding='0' ></table>");
            tb.appendTo(dv);
            var tr = $("<tr/>");
            tb.append(tr);
            //tr.append($("<td style='width:5px;height:5px;'><input type='checkbox' class='css-checkbox' id='cb" + c + "' onchange=\"highlight('" + dvid + "')\" /></td>"));
            tr.append($("<td style='width:5px;height:5px;'><div class='arrow imdim over' style='margin-top:3px;' onclick=\"toggleColor(this,'" + k[2] + "','" + dvid + "')\"><div id='" + k[0] + "' class='colorBox'/></div><td>"));
            tr.append($("<td><div  style='margin:0;" + bgcolor + "' class='fc-event ui-draggable ui-draggable-handle extdrag' id='" + k[0] + "' >" + k[1] + "</div></td>"));
            //tr.append($("<td><div class='arrow imdim over' style='margin-top:5px;' onclick=\"toggleColor(this,'" + k[2] + "','" + dvid + "')\"><div id='" + k[0] + "' class='colorBox'/><div class='dvdnd' id='"+k[2]+"' style='float:left;'>" + k[1] + "</div></div><div style='clear:both'/><td>"));
        });
        documentreadyInsert("hover-ready"
        ,"$('.dvdnd').mouseover(function () {$(this).addClass('fc-event ui-draggable ui-draggable-handle extdrag')});"+
         "$('.dvdnd').mouseout(function(){$(this).removeClass('fc-event ui-draggable ui-draggable-handle extdrag');});"
        );
    }
    else {
        content = $("<div class='arrow imdim over' style='margin-top:5px;' onclick=\"toggleColor(this,'" + color + "','" + dvid + "')\"><div id='" + k.id + "' class='colorBox'/><div style='float:left;'>" + title + "</div></div><div style='clear:both'/>");
        wrap.append(content);
    }

    return wrap;
}
function dpickStyle(dvid) {
    setTimeout(function () {
        $('#dvPicker' + dvid + ' .ui-datepicker').css({ 'width': '202px' });
        $('#dvPicker' + dvid + ' .ui-datepicker td a').css({ 'height': '12px' });
    }, 0);
}
function toggleColor(that, color,dvid) {

    var box=$(that).children()[0];
    var rgb = $(box).css("background-color");
    var hex = rgb2hex(rgb);
    if (hex == color)
        $(box).removeAttr("style");
    else
        $(box).css("background-color", color);
    highlight(dvid);
}
function toggleExternal1(that) {
    switch ($(that).attr("class")) {
        case "arrow arrowminus imdim over":
            $(that).attr("class", "arrow arrowplus imdim over");
            break;
        case "arrow arrowplus imdim over":
            $(that).attr("class", "arrow arrowminus imdim over");
            break;

    }
    $(that).next().slideToggle("slow");

}
function showExternal(id) {
    $("#dvExt" + id).show("slow");//.attr("style", "display:block;margin-top:37px;");
    var calsize = $("#cal" + id).css("width").replace("px", "") - 230;
    $("#cal"+id).css("width",calsize);
    $("#devider"+id).hide();
}
function hideExternal(id) {
    $("#dvExt" + id).show("hide");
    document.getElementById('dvExt' + id).removeAttribute("style");
    document.getElementById('cal' + id).removeAttribute("style");
    $("#devider"+id).show();
}
function getLocalTimeFromGMT(sTime) {
    var dte = new Date(sTime);
    dte.setTime(dte.getTime() + dte.getTimezoneOffset() * 60 * 1000);
    var rtn = makeDateTime(dte);
    return rtn;
}
function makeDateTime(d, seperator) {
    var sep = "/";
    if (typeof seperator != "undefined") sep = seperator;
    var yr = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hr = d.getHours();
    var min = d.getMinutes();
    var dt = yr + sep +
            (('' + month).length < 2 ? '0' : '') + month + sep +
            (('' + day).length < 2 ? '0' : '') + day + " " +
            (('' + hr).length < 2 ? '0' : '') + hr + ":" +
            (('' + min).length < 2 ? '0' : '') + min;
    return dt;
}
$(document).contextmenu({
    delegate: ".hasmenu",
    preventContextMenuForPopup: true,
    preventSelect: true,
    menu: [
            { title: "Cut", cmd: "cut", uiIcon: "ui-icon-scissors" },
            { title: "Copy", cmd: "copy", uiIcon: "ui-icon-copy" },
            { title: "Paste", cmd: "paste", uiIcon: "ui-icon-clipboard", disabled: true },
        ],
    select: function (event, ui) {
        // Logic for handing the selected option
    },
    beforeOpen: function (event, ui) {
        ui.menu.zIndex($(event.target).zIndex() + 1);
    }
});
var calsrc = "";
function formatDate(date) {
    now = date;
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
function getRepeatList(dt, from, to) {
    var events = [];
    $(dt).each(function (i, k) {
        if (k.hasOwnProperty("recurrence1") && k.recurrence1 != "") {
            var repeatdates = [];
            repeatdates = getRepeatday(k.start, k.recurrence1, from.toDate(), to.toDate())
            if (repeatdates.length > 0) {
                //end-start diff minutes:
                var min = (new Date(k.end) - new Date(k.start)) / 60 / 1000;
                $(repeatdates).each(function (j, l) {
                    events.push({
                        id: k.id,
                        title: k.title,
                        start: formatDate(new Date(l)),
                        end: formatDate(new Date(l).addMinutes(min)),
                        allDay: k.allDay,
                        recurrence1: k.recurrence1,
                        resource: k.resource,
                        color:k.color
                    });
                   });
            }
        }
        else {
            events.push(k);
        }
    });
    return events;
}
function getRepeatday(start, repeat, from, to) {
    Date.prototype.addMinutes = function (m) {
        this.setMinutes(this.getMinutes() + m);
        return this;
    }
    var rtndt = [];
    repeat = JSON.parse(repeat);
    var type = "", range = "", every = "", until = "", times;
    type = repeat.type;
    range = repeat.range;
    every = repeat.every;

    rtndt.push(start);
    var dt = start;
    var span = "";

    switch (type) {
        case "daily":
            switch (range) {
                case "times":
                    span = parseInt(repeat.times);
                    break;
                case "until":
                    span = DateDiff(start, repeat.until, "day");
                    break;
                case "indefinitely":
                    span = DateDiff(to, start, "day");
                    break;
            }

            for (var i = 0; i < span;i++ ) {

                var newdate = new Date(dt);

                newdate.setDate(newdate.getDate() +every); // minus the date
                dt = new Date(newdate);

                rtndt.push(dt.toString());
            }
            break;
        //           case "weekly":
        //               switch (range) {
        //                   case "times":
        //                       span = parseInt(until);
        //                       break;
        //                   case "until":
        //                       span = DateDiff(start, until, "day");
        //                       break;
        //                   case "indefinitely":
        //                       span = DateDiff(start, to, "day");
        //                       break;
        //               }
        //               for (i in span) {
        //                   dt = dt.addDays(i * every);
        //                   rtndt.push(dt);
        //               }
        //               break;
    }

    return rtndt;
}
function DateDiff(end, start, datetype) {
    //difference b/w enddate, startdate by datetype(day,hour,minute)
    var divide = 1000;
    switch (datetype) {
        case "day":
            divide = divide * 60 * 60 * 24;
            break;
        case "hour":
            divide = divide * 60 * 60;
            break;
        case "minute":
            divide = divide * 60;
            break;
    }
    return (new Date(end) - new Date(start)) / divide
}
function chklength(arr, length) {
    if (arr.length <= length)
        return true;
    else
        return false;
}
function findCalendarSrc(dvid,id,dlist) {
    var list = makeCalrendardata(dvid,dlist);
    for (i in list) {
        if (list[i]['id'] == id) {
            return list[i];
        }
    }
}
function updateCalendarSrc(dvid, eventdata) {
    var cal = $("#cal" + dvid);
   // cal.fullCalendar('removeEvents');
    //updateimcsettingvalue("imcsetting", "calendar", "id", data.id, data);
    var list = selectimctable(menuid, subid, dvid);
    var cdata = fulldatalist;
   
    var li = list.setting.field;
    mappeddt = calendardatamapping(li, cdata);
    var chk = false;

    $(mappeddt).each(function (i, k) {
        if (k.id == eventdata.id) {

            k.title = eventdata.title;
            var ad = "False";
            if (eventdata.allDay == true | eventdata.allDay == "true" | eventdata.allDay == "True")
                ad = "True";

            k.allDay = ad;
            k.start = eventdata.start;
            k.end = eventdata.end;
            k.resource = eventdata.resource;
            k.color = eventdata.backgroundColor;
            //k.borderColor = eventdata.backgroundColor;
            //k.textColor=textColorFind( eventdata.backgroundColor);
            k.recurrence1 = eventdata.recurrence1;
            //            if (typeof recur != "undefined" && recur != "" && recur != '""') {
            //                k.recurrence1 = JSON.stringify(recur);
            //            }
            //            else
            //                k.recurrence1 = "";
            //cdata.datalist.splice(i, 1, k);
            chk = true;
        }
    });
    if (!chk) mappeddt.push(eventdata);

    var cdata1 = calendardatamapping(li, mappeddt,'backward');
    var updata = updateimcdatalist(fulldata, cdata1);
    fulldata = updata;
    fulldatalist = cdata1;
    jsonUpdateAjax("imcdata", "", JSON.stringify(updata), "code", updata.code);

    var recurr = "", resource = "";
    if (eventdata.recurrence1 != "" && eventdata.recurrence1 != "undefined") {
        if (typeof eventdata.recurrence1 == "object")
            recurr = JSON.stringify(eventdata.recurrence1);
        else
            recurr = eventdata.recurrence1;
    }
    var color = "";
    if (typeof eventdata.resource != "undefined" && eventdata.resource != "") resource = eventdata.resource;
    if (typeof eventdata.backgroundColor != "undefined" && eventdata.backgroundColor != "") color = eventdata.backgroundColor;
}
function calSave(dvid, event) {
    var cal = $("#cal" + dvid);
    var id1 = $("#eventid").html();
    var title = $("#eventTitle").val();
    if (title == "") title = "(제목 없음)";
    var allday = "False",allday1=false;
    var chk = $("#allday").is(":checked");
    if (chk) {
        allday = "True", allday1 = true;
    }

    var start = $("#startTime").val();
    var end = $("#endTime").val();
    var resource = $("#inNodevalue2").val();

    var chk = $("#cbRepeat").is(":checked");
    var repeat = "";
    if (chk) {
        repeat = {};
        //{"type":"monthly","days":[3,24],"every":"1","range":"until","until":"12/31/9999 11:59:59 PM"}
        repeat.type = $("#selRepeat").val();
        var wk = [];
        $("input[class='week']").each(function () {
            if (this.checked) {
                wk.push(parseInt($(this).attr("id").replace("weekly_","")));
            }
        });
        repeat.days = wk;
        var every = 1;
        if ($("#selEvery").val() != "") every = parseInt($("#selEvery").val());
        repeat.every = every;
        if ($("input[name='repeat_range']:radio:checked").length > 0) {
            var range = $("input[name='repeat_range']:radio:checked").attr("id").replace("repeat_", "");
            repeat.range = range;
            switch (range) {
                case "until":
                    repeat.until = $("#repeat_until_value").val();
                    break;
                case "times":
                    repeat.times = $("#repeat_times_value").val();
                    break;
            }
        }
        repeat = JSON.stringify(repeat);
    }
    var eventData;
    eventData = {
        id: id1,
        title: title,
        allDay:allday,
        start: start,
        end: end,
        resource: resource,
        recurrence1: repeat
    };
    if (resource != "") {
        var color = findbackgroundcolor(resource);
        eventData.backgroundColor = color.toUpperCase();
    }
    if (typeof event == "undefined") event = eventData;
    else {
        event.title = title
        event.allDay = allday1;
        event.start = start;
        event.end = end;
        event.resource = resource;
        event.recurrence1 = repeat;
        if (resource != "") {
            var color = findbackgroundcolor(resource);
            event.backgroundColor = color.toUpperCase();
        }
    }
   
    var events = cal.fullCalendar('getEventsById', id1);
    switch ($("#eventtype").html()) {
        case "renderEvent":
            eventData.allDay = allday1;
            cal.fullCalendar("renderEvent", eventData, true);
           updateCalendarSrc(dvid, eventData);
          // 
           //cal.fullCalendar('removeEvents');
           //cal.fullCalendar('refetchEvents');
            break;
        case "updateEvent":
            cal.fullCalendar('updateEvent', event);
            updateCalendarSrc(dvid, eventData);
            break;
    }
    remoteSave(id1, title, allday,start, end,resource,color, repeat)
    cal.fullCalendar('unselect');
    $("#eventContent").attr('style', 'display:none');
    function findbackgroundcolor(resource) {

        var mycal = selectimctable(menuid, subid, dvid).setting.field.mycal;
        var rtn = "";
        $(mycal).each(function (i, k) {
            if (k.colorlist.length > 0) {
                $(k.colorlist).each(function (j, l) {
                    if (l[0] == resource.split(',')[0]) {
                        rtn = l[2].toUpperCase();
                        return false;
                    }
                });
            }
            else {
                if (k.id == resource) {
                    rtn = k.color.toUpperCase();
                    return false;
                }
            }
        });
        return rtn;
    }
}
function remoteDel(id) {
    var upparam = makeparam(id);
    var dtype = "", field = "", upd = "", con;

    if (fulldata.hasOwnProperty("dtype")) dtype = fulldata.dtype;
    if (fulldata.hasOwnProperty("querylist")) qlist = fulldata.querylist;
    if (fulldata.hasOwnProperty("connection")) {
        con = fulldata.connection;
        //var num = con.indexOf(";");
        //con = con.substring(num + 1);
    }
    var updatecommand = $.grep(qlist, function (a) {
        return a["sqlcommand"] == "delete";
    });
    if (updatecommand.length > 0) {
        upd = updatecommand[0];
    }
    var plist = Object.keys(upparam)
    if (dtype == "database" && upd != "") {
        var param = [];
        $(upd.param).each(function (i, k) {
            //paramlist=parametername,parametervalue,fieldtype(only query case);.... repeat
            if ($.inArray(k[0], plist) == -1)
                k[1] = userfilter(k[1]);
            if (upparam[k[0]] != "undefined")
                k[1] = userfilter(upparam[k[0]]);
            else
                k[1] = "";
            
        });
        var data = {};
        data.connection = JSON.stringify(con);
        data.querylist = [];
        data.querylist.push({ sqlcommand: "delete", dtype: upd.dtype, query: upd.query, param: upd.param });
        jsonDatabaseAjax(data);
    }
}
function remoteSave(id, title, allday, start, end, resource,color, repeat) {
    var upparam = makeparam(id, title, allday, start, end, resource, color, repeat);
    var dtype = "",field="",upd="",con;

    if (fulldata.hasOwnProperty("dtype")) dtype = fulldata.dtype;
    if (fulldata.hasOwnProperty("querylist")) qlist = fulldata.querylist;
    if (fulldata.hasOwnProperty("connection")) con = fulldata.connection;
    var updatecommand = $.grep(qlist, function (a) {
        return a["sqlcommand"] == "update";
    });
    if (updatecommand.length > 0) {
        upd = updatecommand[0];
    }
   
    var plist=Object.keys(upparam)
    if (dtype== "database" && upd!="") {
        $(upd.param).each(function (i, k) {
            //paramlist=parametername,parametervalue,fieldtype(only query case);.... repeat
            if ($.inArray(k[0], plist) == -1)
                k[1] = userfilter(k[1]);
            else if (upparam[k[0]] != "undefined")
                k[1] = userfilter(upparam[k[0]]);
            else
                k[1] = "";

        });
        var data = {};
        data.connection = JSON.stringify(con);
        data.commandtype = JSON.stringify(upd.dtype);
        data.querylist = [];
        data.querylist.push({ sqlcommand: "update", dtype: upd.dtype, query: upd.query, param: upd.param });
        jsonDatabaseAjax(data);
    }

}
function makeparam(id, title, allday, start, end, resource, color, repeat) {
    var param = {};
    param["id"] = id;
    param["staff"] = getlogin().id;
    param["invite"] = "";
    param["title"] = title;
    param["desc"] = "";
    param["start"] = start;
    param["end"] = end;
    param["resource"] = resource;
    param["color"] = color;
    param["allday"] = allday;
    var recur = "";
    if (repeat != "")
        recur = repeat;
    param["recur"] = recur
    param["reminder"] = "0";
  
    param = calendardatamapping(mapfield, param, 'backward');
    return param;
}

function onSuccess(data) {
    var comp = getlogin().comp;
    var staff = getlogin().id;
//    switch (data.d) {
//        case "salesLeadUpdate":
//            param = "{'comp':'" + comp + "','staff':'" + staff + "'}";
//            AjaxAdd("imcsetting", "leadlist", "LeadList.aspx/salesLeadList", param);
//            break;
//    }
}
function onError(result) {
    //console.log(result);
}
function calCancel() {
    $("#eventContent").attr('style', 'display:none');
}
function selChanChange() {
    if ($("#selChan").val() != "")
        $("#eventTitle").val($("#selChan option:selected").text() + " visit");
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
//#endregion