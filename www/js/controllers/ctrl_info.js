/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_info = {
	data : {},
	pageDiv : "#infoSucP",

	init : function(data,template){

		console.log(data,"DATA INICIALÑ")
		ctrl_info.data = data;
		ctrl_info.render();
	},
	render : function(){


		var data  = paramsSuc.data 
		estudiosE = data.estudiosE || [];
		data.cargas = [{nombre:"ESTDS",desc:"Archivos EST",folder:"estudios"}];
				
		console.log(data)		

		var mainObj = template.render('#infoT',ctrl_info.pageDiv,data)
		$(ctrl_info.pageDiv).trigger("create");

		mainObj.on('genMap',function(event){
			console.log(event.context)
			mapaObj = event.context;
			$.mobile.changePage( "#mapa");
			//window.location = "#mapa"
		})

		mainObj.on('navigate',function(){
			jqm.showLoader("Localizando...")
			ctrl_info.locRet()
			//navigator.geolocation.getCurrentPosition(ctrl_info.locRet,ctrl_info.onLocationError); 
			
		})

		mainObj.on('selectFileDoc',function(event){
			console.log(event.context.nombre)
            ctrl_uploadRack.callback = ctrl_info.uploadCallBack;

             navigator.camera.getPicture(uploadPhoto, function(message) {
			alert('get picture failed');
			},{
				quality: 50, 
				destinationType: navigator.camera.DestinationType.DATA_URI,
				sourceType: navigator.camera.PictureSourceType.CAMERA
			});


        });

        mainObj.on('removeEstudio',function(event){
	          var con = confirm('Quiere eliminar el documento  '+event.context.idDoc+' permanentemente?');
            if(con === true) {
				var num  = event.index.num;
				that.estudiosE.splice(num, 1);
				var dato = {};
				dato.estudiosE = that.estudiosE;
				socket.emit('updateExp',{room:userRoom,data : dato,_id:paramsSuc.data });
				
			}
		});

        ctrl_info.uploadCallBack = function(response){
           
           console.log(response,"response",ctrl_info.data)
           profilePic =  response;
			
			var valor = parseInt(Math.random(1000000)*100000000);
			
		
			estudiosE.push({idDoc: 'CDOC-'+valor, documento: profilePic.response, fecha: new Date()});

			
			var dato = {};
			dato.estudiosE = estudiosE;
			mainObj.set('estudiosE',estudiosE)
			socket.emit('updateExp',{room:userRoom,data : dato,_id:paramsSuc.data.expId});
			socket.emit('getExpediente',{room:userRoom,curp:paramsSuc.data.curp});
			
        };


		var  myScroll = new IScroll('#wrapperInfo',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })


		setTimeout(function(){ myScroll.refresh() }, 500);
		
		$( '.swipebox' ).swipebox();
	}
}



function uploadPhoto(imageURI) {
            var options = new FileUploadOptions();
            options.chunkedMode = false;
            options.fileKey="file";
            options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";

            options.headers = {
				    Connection: "close"
				};

  
 
            var params = new Object();
            options.folder = "estudios";
            options.fileName = utils.generateUUID();
            options.fileExtension = "jpg";
 
            options.params = params;
           

            var ft = new FileTransfer();
            var params = "folder=" + 'estudios' + "&fileName=" +  options.fileName + "&fileExtension=." + options.fileExtension ;
            ft.upload(imageURI, 'https://104.131.162.87:3000' + "/user/uploadRackspaceMobile?" + params, 
            	function(response){ctrl_info.uploadCallBack(response)}, 
            	function(response){console.log("fail",response)}, options,true);
        }