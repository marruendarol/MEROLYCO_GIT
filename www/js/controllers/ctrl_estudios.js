/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_estudios = {
	data : {},
	pageDiv : "#estudiosP",

	init : function(data){

		socket.removeListener('expData');		
		socket.on('expDataEstudios'+ paramsSuc.data.info.curp, function(response){
			if (response.length > 0 ) {

					var data  = paramsSuc.data 
	
					data.estudiosA = response;
					//data.estudiosE.sort(utils.sortobjkey('fecha'))
					data.estudiosA.reverse()

					console.log(data,"DATA")

					var mainObj = template.render('#estudiosT',ctrl_estudios.pageDiv,data)
					$(ctrl_estudios.pageDiv).trigger("create");

					var  myScroll = new IScroll('#wrapperInfo',{  
					 click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })


					setTimeout(function(){ myScroll.refresh() }, 500);

					
				$( '.swipebox' ).swipebox();

			}else{
			


			}
		});

		socket.emit('getEstudios',{room:userRoom,curp:paramsSuc.data.info.curp});

	},

}

