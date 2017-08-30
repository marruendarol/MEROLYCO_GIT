// common variables
var iBytesUploaded = 0;
var iBytesTotal = 0;
var iPreviousBytesLoaded = 0;
var iMaxFilesize = 104857600; // 1MB
var oTimer = 0;
var sResultFileSize = '';
var finalfile = "";
var fileBuffer;
var fileName;
var fileComplete;

var ctrl_uploadRack = {
	// Obj Vars
	callback : function(){},
	fileSelected: function(folder,id){
		console.log(folder,id,"folder y ID que entro")
		 var oFile = document.getElementById('uploadedfile_' + id).files[0];
    	 ctrl_uploadRack.fileBuffer = oFile;
    	 ctrl_uploadRack.startUpload(folder,id)
    	 
    	
	},
	startUpload : function(folder,id){

		console.log(folder,id,"folder y ID que entro")
		$('.buttonUpload').hide();
		console.log(document.getElementById('upload_form_' + id),"VBN",'upload_form_' + id)

		$('#statusUpload_' + id).empty().append('<i style="color:green;float:left;margin-right:10px;" class="fa fa-cog fa-spin"></i><label1 id="perc">Preparando archivo....</label1> ')
		$('.buttonUpload' + id).hide();

		var vFD = new FormData(document.getElementById('upload_form_' + id)); 
		console.log(vFD,"vfd");
		fileName = utils.generateUUID();
		
		var oXHR = new XMLHttpRequest();    
	    oXHR.upload.addEventListener('progress', function(evt) { ctrl_uploadRack.uploadProgress(evt,id) } , false);
	    oXHR.addEventListener('load',	ctrl_uploadRack.uploadFinish.bind(null,event,id,oXHR) , false);
	    oXHR.addEventListener('error',	ctrl_uploadRack.uploadError.bind(null, event,id,oXHR) , false);
	    oXHR.addEventListener('abort',	ctrl_uploadRack.uploadAbort.bind(null, event,id,oXHR), false);
	     var parts = document.URL.split("/");
	     var foo = parts.pop();
	     //filetype
	    var str = ctrl_uploadRack.fileBuffer.name.split('.').pop();
	    var n = str.lastIndexOf('/');
	    var result = str.substring(n + 1);
	    var fileType = ""
	    console.log(ctrl_uploadRack.fileBuffer,"fiekl")
	    var params = "folder=" + folder + "&fileName=" +  fileName + "&fileExtension=." + str ;
	    fileComplete = fileName +"." + result;
	    oXHR.open('POST', '../user/uploadRackspace?' + params);
	   	oXHR.send(vFD);
    	// set inner timer
    	oTimer = setInterval(function(){ctrl_uploadRack.doInnerUpdates(id)}, 300);
	},
	doInnerUpdates : function(){
		var iCB = iBytesUploaded;
	    var iDiff = iCB - iPreviousBytesLoaded;

	    // if nothing new loaded - exit
	    if (iDiff == 0)
	        return;

	    iPreviousBytesLoaded = iCB;
	    iDiff = iDiff * 2;
	    var iBytesRem = iBytesTotal - iPreviousBytesLoaded;
	    var secondsRemaining = iBytesRem / iDiff;

	    // update speed info
	    var iSpeed = iDiff.toString() + 'B/s';
	    if (iDiff > 1024 * 1024) {
	        iSpeed = (Math.round(iDiff * 100/(1024*1024))/100).toString() + 'MB/s';
	    } else if (iDiff > 1024) {
	        iSpeed =  (Math.round(iDiff * 100/1024)/100).toString() + 'KB/s';
	    }



	    document.getElementById('speed_' + ids).innerHTML = ""//iSpeed;
	    document.getElementById('remaining_' + ids).innerHTML = ""//'| ' + secondsToTime(secondsRemaining);        
	},
	uploadProgress : function(e,ids){
		console.log(e,"progresss")
		var loaded = e.loaded
		var total  = e.total;
		var perc = Math.round((loaded * 100) / total);
		console.log(perc);
		 $('#perc').text('Subiendo Archivo.... ' + perc + " %")
	},
	uploadFinish: function(e,id,a){
		console.log("uploadfinisgh..... ",e,a)
		ctrl_uploadRack.callback(fileComplete,id,a.response);
		$('#buttonUpload_' + id).show();
		$('#statusUpload_'+id).hide();
	},
	uploadError : function(e){
		console.log("error",e)
	},
	uploadAbort : function(e){
		console.log("abort",e)
	}
}




function secondsToTime(secs) { // we will use this function to convert seconds in normal time format
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if (hr < 10) {hr = "0" + hr; }
    if (min < 10) {min = "0" + min;}
    if (sec < 10) {sec = "0" + sec;}
    if (hr) {hr = "00";}
    return hr + ':' + min + ':' + sec;
};

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};