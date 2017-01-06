//Read Image Directory File
var loclist="";
function FileListup(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS1, fileSystemFail);
}
function gotFS1(fileSystem) {
   fileSystem.root.getDirectory("imcmobile", {create: false, exclusive: false}, gotFS, fail); 
}
function gotFS(parent) {
	//alert(parent.name);
  
    var reader = parent.createReader();
      reader.readEntries(gotList, fail);    
  
}
function gotList(entries) {
	loclist="";
    var i;
    for (i=0; i<entries.length; i++) {
    	loclist += entries[i].name+",";
	}
	if(loclist !="") loclist=loclist.substr(0,loclist.length-1);
}

function ImageDownAjax() {
	var comp1=localStorage.getItem("login");
	var obj = eval("(" + comp1 + ")");
	var comp=obj.comp;
	$.mobile.loading( 'show', {
		text: 'Downloading Files...',
		textVisible: true,
		theme: 'b',
		html: ""
	});
	$.ajax({
        url: "http://mobile.imcmaster.co.kr/WebService.asmx/MakeZipFile",
        //data: { comp: JSON.stringify(comp),loclist:locallist},
        data:{comp:JSON.stringify(comp),loclist:JSON.stringify(loclist)},
        contentType: "application/json; charset=utf-8",
        dataType: "JSON",
        success: function (data, status) {	
			if(JSON.stringify(data)!="{\"d\":\"fail\"}"){
				msgshow("success(delete list) :  "+data.d)
				imageSave();
				imageDel(data.d);
				$.mobile.loading('hide');
	    	}
    		else{
    	 		msgshow("Failed!");
    	 		$.mobile.loading('hide');
    	 	}
            },
            error: function () { mswshow("Error!"); $.mobile.loading('hide');} 
    });
}    

function imageSave(){
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
}
function fileSystemSuccess(fileSystem) {

	var log=localStorage.getItem("login");
    var obj = eval("(" + log + ")");
    var directoryEntry = fileSystem.root; // to get root path to directory
    directoryEntry.getDirectory("imcmobile", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail);
    var rootdir = fileSystem.root;
    var remoteurl="http://www.imcmaster.co.kr/data/document/"+obj.comp+"/mobile.zip";
    var localurl = "file:///mnt/sdcard/imcmobile/";
    var localurlonly = "file:///mnt/sdcard/imcmobile/";
    localurl =localurl+remoteurl.substr(remoteurl.lastIndexOf("/")+1);
    var listall;
    var fileTransfer = new FileTransfer();
   		fileTransfer.download(  encodeURI(remoteurl),localurl,
        function(entry) {
				//unzip
               zip.unzip(localurl, localurlonly, function(){
			        alert('All done');
			    });
 				//del zip file
		       window.resolveLocalFileSystemURL(localurl, onResolveSuccess, fail);
		       //
		       
        },
        function(error) {
            alert("download error source " + error.source);
            alert("download error target " + error.target);
            alert("upload error code" + error.code);
        }
    );

}
function onDirectorySuccess(parent) {
    console.log(parent);
}
 
function onDirectoryFail(error) {
    alert("Unable to create new directory: " + error.code);
}
 
function fileSystemFail(evt) {
    console.log(evt.target.error.code);
}
// remove file system entry
function imageDel(delList){
   //del zip file
   var delimg="file:///mnt/sdcard/imcmobile/";
   for(i in delList){
   window.resolveLocalFileSystemURL(delimg+delList[i], onResolveSuccess, fail);
   }
}
function onResolveSuccess(fileEntry) {
    fileEntry.remove();
    
}

function fail(evt) {
    console.log(evt.target.error.code);
}
