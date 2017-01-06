//Daum Map
	 function pingOutside(){
	 	var q = document.getElementById('q');
		var b = document.getElementById('b');
		var r = document.getElementById('r');
		var apikey= "d480a1668da6ead107eee5bb2be9ee2f0c9d7d86";	
	if (q.value)
	    {
    	  var s={};
	      s = document.createElement('script');
	      s.type ='text/javascript';
	      s.charset ='utf-8';		  
	      s.src = 'http://apis.daum.net/local/geo/addr2coord?apikey=' + apikey + '&output=json&callback=obj.pongSearch&q=' + encodeURI(q.value);	
	      document.getElementsByTagName('head')[0].appendChild(s);
	    }
	}
	
	
	var obj = {
	apikey: "d480a1668da6ead107eee5bb2be9ee2f0c9d7d86",
	init : function()
	{
		obj.q = document.getElementById('q');
		obj.b = document.getElementById('b');
		obj.r = document.getElementById('r');
		if(obj.pingSearch==null)
		obj.b.onclick = obj.pingSearch;
	},
	//naver에 검색요
	// 검색을 요청하는 함수 
 	pingSearch : function()
 	{
	    if (obj.q.value)
	    {
	      obj.s = document.createElement('script');
	      obj.s.type ='text/javascript';
	      obj.s.charset ='utf-8';		  
	      obj.s.src = 'http://apis.daum.net/local/geo/addr2coord?apikey=' + obj.apikey + '&output=json&callback=obj.pongSearch&q=' + encodeURI(obj.q.value);	
	      document.getElementsByTagName('head')[0].appendChild(obj.s);
	    }
 	},
 	// 검색 결과를 뿌리는 함수 
	pongSearch : function(z)
	{
		obj.r.innerHTML = '';
		if(!z.channel || z.channel.item.length <= 0)
		{
			obj.r.innerHTML = "<div class='imdim' style='text-align:right;margin-bottom:10px;'><img onclick='showBtn();' src='images/close-icon.png' /></div>검색 결과가 없습니다.";
			return;
		}
		else
		{
			obj.r.innerHTML="<div class='imdim' style='text-align:right;margin-bottom:10px;'><img onclick='showBtn();' src='images/close-icon.png' /></div>";
			for (var i = 0; i < z.channel.item.length; i++)
			{
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.href="#";
				a.setAttribute("onclick", "addMark1(" + z.channel.item[i].point_y + ", " + z.channel.item[i].point_x + ");");
				a.innerHTML = obj.stripHTMLtag(obj.escapeHtml(z.channel.item[i].title));
				li.appendChild(a);
				obj.r.appendChild(li);
			}
			var dvclose = document.createElement('div');
			dvclose.setAttribute("style","position:absolute;top:270px;left:55px");
			var btnclose=document.createElement('img');
			btnclose.setAttribute("onclick","showBtn();");
			btnclose.setAttribute("src","images/close_msgbox.png");
			btnclose.setAttribute("class","imdim");
			
			dvclose.appendChild(btnclose);
			obj.r.appendChild(dvclose);
		}
	},
	// HTML태그 안 먹게 하는 함수
	escapeHtml : function(str) 
	{
		str = str.replace(/&amp;/g, "&");
		str = str.replace(/&lt;/g, "<");
		str = str.replace(/&gt;/g, ">");
		return str;
	},
	// HTML태그 삭제하는 함수
	stripHTMLtag : function(string) {
		var objStrip = new RegExp();
		objStrip = /[<][^>]*[>]/gi;
		return string.replace(objStrip, "");
	},
	// 특정 좌표에 마커 추가
	addMark : function(lat, lng)
	{
		$("#LatLng").val(lat+","+lng);
		daumMap();
	}
};
	function addMark1(lat,lng){
		console.log(lat,lng);
		$("#LatLng").val(lat+","+lng);
		//daumMap();
		daumAgain();
		showBtn();
	}
	var map;
	var center;
	var marker;
	var iwin;
	
	function daumAgain(){
		var latlng=$("#LatLng").val();
		if(latlng=="")latlng="37.537123, 127.005523";
		var lat=latlng.split(',')[0];
		var lng=latlng.split(',')[1];
		map.setCenter(new daum.maps.LatLng(lat,lng));
		marker.setPosition(new daum.maps.LatLng(lat,lng));
		
		var c=$("#location").val();
		if(iwin !=null)
		iwin.close();
		if(c !=""){
			iwin = new daum.maps.InfoWindow({
		    content:'<p style="margin:7px 12px;font-size:12px">'+c+'</p>'
		 });
			iwin.open(map,marker);
		}
	}
	function daumMapView() {
		var dvmap=document.getElementById('map1');
		var latlng=$("#LatLng").val();
		if(latlng=="")latlng="37.537123, 127.005523";
		var lat=latlng.split(',')[0];
		var lng=latlng.split(',')[1];
		if(dvmap.innerHTML==""){
		  	map = new daum.maps.Map(dvmap, {
		    center: new daum.maps.LatLng(lat, lng),
		    level: 3
		  });
	  var zoomControl = new daum.maps.ZoomControl();
		map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
		var mapTypeControl = new daum.maps.MapTypeControl();
		map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
		
	  var icon = new daum.maps.MarkerImage(
			'images/marker1.png',
			new daum.maps.Size(64, 64),
			new daum.maps.Point(32, 64)
		);
		var icon1 = new daum.maps.MarkerImage(
			'images/marker1.png',
			new daum.maps.Size(64, 64),
			new daum.maps.Point(32, 64)
		);
	  marker = new daum.maps.Marker({
	    position: map.getCenter(),
	    image:icon
	  });
	  
	  marker.setMap(map);
	  
	//Custom Overlay
	var content="<a style='margin:0px 0 0 0px;' onclick=\"createMapContent('view');daumMap()\"  class='imbig'><img src='images/search-red.png'/></a>";
		
		var position = new daum.maps.LatLng(37.595023,127.08600);  
						
		var customOverlay = new daum.maps.CustomOverlay({
			  position: position,
			  content: content,
			  xAnchor: 0.5,
			  yAnchor: 0.91
		});
						 
		customOverlay.setMap(map);
  

	 }
	}
	function daumMap() {
		var dvmap=document.getElementById('map');
		var latlng=$("#LatLng").val();
		if(latlng=="")latlng="37.537123, 127.005523";
		var lat=latlng.split(',')[0];
		var lng=latlng.split(',')[1];
		if(dvmap.innerHTML==""){
	  	map = new daum.maps.Map(dvmap, {
	    center: new daum.maps.LatLng(lat, lng),
	    level: 2
	  });
		var zoomControl = new daum.maps.ZoomControl();
		map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
		var mapTypeControl = new daum.maps.MapTypeControl();
		map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
		
		var icon = new daum.maps.MarkerImage(
			'images/marker1.png',
			new daum.maps.Size(64, 64),
			new daum.maps.Point(32, 64)
		);
		var icon1 = new daum.maps.MarkerImage(
			'images/marker1.png',
			new daum.maps.Size(64, 64),
			new daum.maps.Point(32, 64)
		);
	  marker = new daum.maps.Marker({
	    position: map.getCenter(),
	    image:icon
	  });
	  
	  	
	  marker.setMap(map);
	  marker.setDraggable(true);
	  marker.setTitle("Drag해서 위치를 이동하세요")
	 }
	
	  
	  
	  
	  if($("#location").val()!=""){
	  	
	  	if(iwin !=null)iwin.close();
	  	openiwin($("#location").val());
	  }
	  
	  function openiwin(content){
	  	iwin = new daum.maps.InfoWindow({
	    content:'<p style="margin:7px 12px;font-size:12px">'+content+'</p>'
	  });
	  iwin.open(map,marker);
	  }
	  //document.getElementById("new").setAttribute("data-role","");
	  document.location.href="#new123";
	  
	  daum.maps.event.addListener(marker,"dragend",function(){
	    center = marker.getPosition();
	    $("#LatLng").val(center.getLat()+","+center.getLng());
	    var url = "http://apis.daum.net/local/geo/coord2addr";
	    url += "?apikey=d480a1668da6ead107eee5bb2be9ee2f0c9d7d86";
	    url += "&longitude="+center.getLng();
	    url += "&latitude="+center.getLat();
	    url += "&output=json";
	    url += "&callback=?";
	    $.getJSON(url,function(data) {
	    	if(iwin !=null)iwin.close();
	    	var cont=$("#location").val();
	    	if(cont !="")cont+="<br />";
	    	cont +=data.fullName;
	    	openiwin(cont);     
		           
	    }).error(function(XMLHttpRequest, textStatus, errorThrown){          
	      alert(textStatus);
	    });
	  
	    
	    //document.getElementById("message").innerHTML = "latitude : " + center.getLat() + "<br />longitude: " + center.getLng();
	  });
	  
	}
	
	function searchMap(){
		var oScript = document.createElement('script');
	    oScript.type ='text/javascript';
	    oScript.charset ='utf-8';          
	    
		var keywd=$("#mapsearch").val();
		var url = "http://apis.daum.net/local/geo/coord2addr";
	    url += "?apikey=d480a1668da6ead107eee5bb2be9ee2f0c9d7d86";
	    url += "&q="+encodeURI(keywd);
	    url += "&output=json";
	    url += "&callback=pongSearch";
	    oScript.src =url;
	    document.getElementsByTagName('head')[0].appendChild(oScript);
	}
	
	function showList(){
   		$("#btnSearch").css("display","none");
   		$("#r").css("display","block");   		
   	}
   	function showBtn(){
   		$("#btnSearch").css("display","block");
   		$("#r").css("display","none");
   	}
   

	//-- End of Daum Map
