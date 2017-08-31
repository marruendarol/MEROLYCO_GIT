
var deploy = "DEV"


if(window.StatusBar) {
  // org.apache.cordova.statusbar required
  StatusBar.styleDefault();
}


function forceLower(strInput){
  strInput.value=strInput.value.toLowerCase();
}


function handleClicks(e){
   console.log("ert")
}


// DOM Ready =============================================================

function onDeviceReady(){

   initApp();
}

$(document).ready(function() {



    if(deploy=="DEV"){
        initApp();
    } else {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
});

function initApp(){

       
     

  $.support.cors = true;
      
  $.mobile.allowCrossDomainPages = true;

   $.mobile.pageContainer = $('#container');
   $.mobile.defaultPageTransition = 'slide';
   //$.mobile.defaultHomeScroll = 0;
   $( "#pop1" ).popup();

   		mainC.init(ctrl_core.init)


  $('.bButton').bind( "tap",function(){
      
              // history.go(0)
               //write your code here                 
               $.mobile.back()
          //window.history.back();
          
  })

  $('.hButton').bind( "tap",function(){
      $.mobile.changePage("#mainScreen")
  })

 
}


function getLastKnownLocation(callback,errorF,refresh){
      navigator.geolocation.getCurrentPosition(callback,errorF,{ enableHighAccuracy: true,timeout: 5000, maxAge: 30000 });
}

function openDeviceBrowser (externalLinkToOpen){  window.open(externalLinkToOpen, '_system', 'location=no');}


function onSuccess(location){
  console.log(location)
}

function onError(e){
  
}