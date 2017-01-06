//Photo
	 	var imgjson=[];
	  	function captureCamera(src){
	  		var media="";
	  		var option={};
	  		option.quality=50;
			option.destinationType=Camera.DestinationType.FILE_URI;
			switch(src){
				case "camera":
				option.sourceType=Camera.PictureSourceType.CAMERA;
				option.allowEdit = false;
				option.saveToPhotoAlbum=true;
				option.targetWidth= 300;
  				option.targetHeight= 300;
				break;
				case "library":
				option.sourceType=navigator.camera.PictureSourceType.PHOTOLIBRARY;
				break;
			}
			navigator.camera.getPicture( cameraSuccess, cameraError, option );
		}
			
		function cameraSuccess(imageURI) {
			
		   	$("#imgurl").html(imageURI);
			
			var pic=document.createElement("img");
			pic.setAttribute("src",imageURI);
			var wsize= $('[data-role="page"]').width()-80;
			pic.setAttribute("style","max-width:"+wsize+"px");
			var contain=document.getElementById("container");
			$("#container").empty();
			$("#txComment").val("");
			contain.appendChild(pic);

  			console.log(imageURI)
  			//alert(imageURI)
  			var fname=imageURI.substr(imageURI.lastIndexOf("/")+1);
		   	$("#imgsrc").html(fname);
  			imgSave(imageURI,fname,"img","");
  			//$.mobile.changePage("#imglist");
  			$.mobile.changePage("#imgshow");
  			window.resolveLocalFileSystemURL(imageURI, moveFile, fail); 
		}
		
		 function success(entry) {
        	alert("New Path: " + entry.fullPath);
	    }
	    function fail(error) {
	        alert(error.code);
	    }
	    function moveFile(fileEntry) {
	    	
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) 
			{ 
				fileSys.root.getDirectory("imcmobile", {create: true, exclusive: 
				false}, function(dir) { 
					fileEntry.copyTo(dir, fileEntry.name, onCopySuccess, fail); 
					//imcdir=dir.nativeURL;
					
				}, movefail); 
			}, movefail); 
		}
		function onCopySuccess(entry) {
			console.log(entry.fullPath)
			
		}
		function movefail(error) {
			console.log(error.code);
		}
	   
	

		function onErrorLoader1(message) {
		    alert('1:error to move to Failed because: ' + JSON.stringify(message));
		}

		function cameraError(message) {
		    alert('Failed because: ' + message);
		}
	
		function  makePhotoList1(){
			imgjson=[];
			var save={};
			var list=""
			imgjson.push({"url":"capture/a.mp4","filename":"a.mp4","imgtype":"video","comment":"hi"});
			imgjson.push({"url":"capture/hyun.mp3","filename":"hyun.mp4","imgtype":"audio","comment":"felling good"});
			imgjson.push({"url":"images/top_schedule.png","filename":"top_schedule.png","imgtype":"img","comment":"좋은 아침입니다"});
			imgjson.push({"url":"images/banner1.jpg","filename":"banner1.jpg","imgtype":"img","comment":"특종보고!"});
			console.log(imgjson);
			makePhotoList(imgjson);
		}
	    function imgSave(imgURI,filename,imgtype,comment){
	    	var save={};
	    	var js="";
	    	save.url=imgURI;
	    	if(imgtype=="barcode"){
	    		 var json1 = JSON.parse(imgURI);
	    		 if(json1["valid"]=="true"){
				  	js =json1["valid"]+",";
				  	js +=json1["number"]+",";
				  	js +=json1["itemname"]+",";
				  	js +=json1["alias"]+",";
				  	js +=json1["description"]+",";
				  	js +=json1["avg_price"]+",";
				  	js +=json1["rate_up"]+",";
				  	js +=json1["rate_down"];
			    }
			     save.url=js;
	    	}
	    	
	    	save.filename=filename;
	    	save.imgtype=imgtype
	    	save.comment=comment;
	    	imgjson.push(save);
	    	makePhotoList(imgjson);
	    }
	    function imgRemove(imgURI){
			 for (var i = imgjson.length - 1; i >= 0; i--) {
		        if (imgjson[i]['url'] == imgURI) {
		            imgjson.splice(i, 1);
		        }
		    }
		    makePhotoList(imgjson);
	    }
	    
	    
		function uploadAll(){
			var filename="";
			for(i in imgjson){
				if(imgjson[i]["imgtype"]!="barcode" && imgjson[i]["imgtype"]!="qrcode"){
				uploadPhoto(imgjson[i]["url"]);
				filename +=imgjson[i]["url"]+"     ";
				}
			}
		}
		
		function makePhotoList(data){
			//$("#imglistview"+' li').remove();
			$("#imglistview"+' li').remove();
			for (i in data) {
				if(data[i]["filename"] !=null ){
		        var li = document.createElement( "li" );
		        li.id=data[i]["filename"];
		        // image,video,audio
				var pic;
				var src;
				var size;
				switch(data[i]["imgtype"]){
					case "img":
						pic=document.createElement("img");
						pic.id=data[i]["filename"];
						pic.setAttribute("src",data[i]["url"]);
						//if(pic.width>150)
						pic.setAttribute("style","max-width:150px;");
					break;
					case "audio":
						pic=document.createElement("img");
						pic.id=data[i]["filename"];
						pic.setAttribute("src","images/mp3.png");
						pic.setAttribute("style","width:50px;");
						var pic1=document.createElement("audio");
						pic1.setAttribute("src",data[i]["url"]);
					break;
					case "video":
/*
						pic=document.createElement("video");
						src=document.createElement("source");
						pic.appendChild(src);
						src.setAttribute("src",data[i]["url"]);
						src.setAttribute("type","video/mp4");
						pic.setAttribute("controls","controls");
						
*/
						pic=document.createElement("img");
						pic.src="images/video.jpg";
						pic.setAttribute("style","width:150px;");
					break;
					case "qrcode":
						var pic=document.createElement("img");
						var siteurl="http://qrickit.com/api/qr?d="+data[i]["filename"];
						pic.setAttribute("src",siteurl);
						pic.setAttribute("onError","this.onerror=null;this.src='images/homepage.png';");
						//pic.setAttribute("onclick","openInAppBrowserBlank('')")
					break;
					case "barcode":
						var pic=document.createElement("img");
						var siteurl="http://www.searchupc.com/drawupc.aspx?q="+data[i]["filename"];
						pic.setAttribute("src",siteurl);
						pic.setAttribute("onError","this.onerror=null;this.src='images/barcode.jpg';");
						//pic.setAttribute("onclick","openInAppBrowserBlank('http://www.google.com/#q="+data[i].filename+"')")
					break;
				}
				  //size=gotPhoto(data[i]["url"]);
				  var dv1 = document.createElement( "div" );
				  var dv2 = document.createElement( "div" );
				  var dv3 = document.createElement( "div" );
				  dv2.setAttribute("style","padding:3px;");
				  dv1.appendChild(dv2);
				  dv2.appendChild(pic);
				  
				  dv2 = document.createElement( "div" );
				  dv2.innerHTML=data[i]["comment"];
				  dv2.setAttribute("style","padding:3px;vertical-align:top;color:black;white-space:pre-line;");
				 
				  dv1.appendChild(dv2);
				  var a1=document.createElement("a");
				  a1.appendChild(dv1);
				  li.appendChild(a1);
					
				  a1=document.createElement("a");
				  a1.setAttribute("data-icon","delete");
				  a1.setAttribute("onclick","if(confirm('delete image ?')==true){imgRemove('"+data[i]['url']+"')}else return;");
				  li.appendChild(a1);
				  
				$("#imglistview").append( li );
			}
		   }
		   if ( typeof $( "#imglistview" ).listview() !== "undefined" )
			$('#imglistview').listview('refresh');
			
		}	
		function file_get_ext(filename){
	    	return typeof filename != "undefined" ? filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase() : false;
	    }
	    function gotPhoto(imageUri) {
		    window.resolveLocalFileSystemURI(imageUri, function(fileEntry) {
		        fileEntry.file(function(fileObj) {
		            alert("Size = " + fileObj.size);
		            return fileObj.size;
		        });
		    });
		}
		function uploadPhoto(imageURI) {  
		   var options = new FileUploadOptions();  
		   options.fileKey="file";  
		   var filenameonly=imageURI.substr(imageURI.lastIndexOf('/')+1); 
		   options.fileName= filenameonly;
		   var mime="";
		   switch(file_get_ext(imageURI)){
		   	case "jpg": 
		   		mime="image/jpeg";  
		   	break;
		   	case "":
		   		mime="image/jpeg";  
		   		options.fileName=filenameonly+".jpg"
		   	break;
		   	case "mp3": case "3ga":
		   		mime="audio/mpeg";  
		   	break;
		   	case "mp4":
		   		mime="video/mp4";  
		   	break;
		   }  
		   options.mimeType=mime;
			var params = {};
			var login=localStorage.getItem("login");
			var obj = eval("(" + login + ")");
			params.comp = obj.comp;
			params.nameonly=filenameonly;
			options.params = params;

		   var ft = new FileTransfer();  
		   $.mobile.loading( 'show', {
				text: 'Uploading Files...',
				textVisible: true,
				theme: 'b',
				html: ""
			});
		   ft.upload(imageURI, encodeURI("http://mobile.imcmaster.co.kr/WebService.asmx/UploadFile"), win, fail, options);  
		   
		 }
		
		 function win(r) {  
		 	$.mobile.loading('hide');
		   console.log("Code = " + r.responseCode);  
		   console.log("Response = " + r.response);  
		   console.log("Sent = " + r.bytesSent);  
		   
		   msgshow(r.responseCode+"/"+r.response+"/"+r.byteSent);
		 }  
		 function fail(error) {  
		 	$.mobile.loading('hide');
		   msgshow("An error has occurred: Code = " + error.code);  
		   console.log("upload error source " + error.source);  
		   console.log("upload error target " + error.target);  
		 } 
		 
	
// Capture,Play, Video
 	function capture(type) {
        switch(type){
        	case "video":
        	navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
        	break;
        	case "audio":
        	navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 1});
        	break;
        	
        }
    }
	
	
	function gotFSs(fileSystem) {
		fileSystem.root.getDirectory("imcmobile", {
			create : true,
			exclusive : false
		}, dirReady, fail);
	}
 	
	function dirReady(entry) {
		window.appRootDir = entry;
	}
	var imcdir="";
	function captureSuccess(mediaFiles) {
       var i, path, len,pic,fname;
       console.log(JSON.stringify(mediaFiles))
	    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
	        path = mediaFiles[i].fullPath;
        	fname=mediaFiles[i].name;
			window.resolveLocalFileSystemURL(path, moveFile, fail); 
			//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFSs, fail);
			//console.log("hi:"+JSON.stringify(window.appRootDir));
			var imcmobile="file:///mnt/sdcard/imcmobile/"+fname;//window.appRootDir["nativeURL"]+fname;
	    }  
	    
	    $("#imgurl").html(path);
	    $("#imgsrc").html(fname);
	    switch(file_get_ext(path))
	    {
	    	case "mp4":
			    pic=document.createElement("video");
				var src=document.createElement("source");
				pic.appendChild(src);
				src.setAttribute("src",path);
				src.setAttribute("type","video/mp4");
				pic.setAttribute("controls","controls");
				pic.setAttribute("style","width:200px;");
				imgSave(imcmobile,fname,"video","");
			break;
			case "3ga": case "mp3":
				pic=document.createElement("audio");
				pic.setAttribute("src",path);
				pic.setAttribute("style","width:150px;");
				imgSave(imcmobile,fname,"audio","");
			break;
		}
		var contain=document.getElementById("container");
			$("#container").empty();
			contain.appendChild(pic);
		
	    //document.location.href="#imglist"; 
	    $.mobile.changePage("#imgshow");
	    
    }
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }
    
    function playVideo(vidUrl) {
	    window.plugins.videoPlayer.play(vidUrl);
	}
	
	
// Audio
    var my_media = null;
    var mediaTimer = null;
    function playAudio(src) {
        // Create Media object from src
        alert(src);
        my_media = new Media(src, onSuccess, onError);

        // Play audio
        my_media.play();

        // Update my_media position every second
        if (mediaTimer == null) {
            mediaTimer = setInterval(function() {
                // get my_media position
                my_media.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            setAudioPosition((position) + " sec");
                        }
                    },
                    // error callback
                    function(e) {
                        console.log("Error getting pos=" + e);
                        setAudioPosition("Error: " + e);
                    }
                );
            }, 1000);
        }
    }
    function pauseAudio() {
        if (my_media) {
            my_media.pause();
        }
    }
    function stopAudio() {
        if (my_media) {
            my_media.stop();
        }
        clearInterval(mediaTimer);
        mediaTimer = null;
    }

    // onSuccess Callback
    //
    function onSuccess() {
        console.log("playAudio():Audio Success");
    }

    // onError Callback 
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' + 
              'message: ' + error.message + '\n');
    }

    // Set audio position
    // 
    function setAudioPosition(position) {
        document.getElementById('audio_position').innerHTML = position;
    }
	
