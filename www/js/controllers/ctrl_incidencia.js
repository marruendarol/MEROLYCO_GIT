/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_incidencia = {
	data : {},
	pageDiv : "#incidenciaP",
	init : function(data,template){
		ctrl_incidencia.data = data;
		ctrl_incidencia.render();
	},
	render : function(){

		$(ctrl_incidencia.pageDiv).empty();

		var mainObj = template.render('#incidenciaT',ctrl_incidencia.pageDiv,{},null)


		mainObj.on('sendIncidencia',function(){
			console.log("INVICENCAAd")
			ctrl_incidencia.storeInc();
		})

		/*mainObj.on('sendComment',function(){
			
			console.log($('#comentario').val().length)
			if($('#comentario').val().length>2){
			ctrl_incidencia.sendMsg();}
			else{
				jqm.popup( {text:"Mensaje requerido.",title:"Error."})
			}
		});  */ 

		$(ctrl_incidencia.pageDiv).trigger("create");

			mainObj.on('dial',function(e){
			window.open('tel:018002772700', '_system')
			
		})

	},
	storeInc : function(){

		var params = {userId: window.localStorage.getItem("userId") ,
		 			  tipoI : $("#tipoI").val(),
		 			  comment : $('#comIncidencia').val(),
		 			  datosUser : userdata, 
		 			  datosSuc : paramsInc ,
		 		}

		 		console.log(params)

		dbC.query("/api/addIncidencia","POST",params,ctrl_incidencia.incRet)	
		jqm.showLoader("Enviando mensaje...")
	},
	incRet : function(){
		jqm.hideLoader();
		jqm.popup( {text:"Mensaje enviado con exito, un asesor se pondrá en contacto con usted a la brevedad para darle seguimiento.",title:"Enviado."});

	

	},
	sendMsg : function(){
		jqm.showLoader("Enviando mensaje...")
		var msg = "Mensaje de Autotips  " + $('#comentario').val();
		var recipients = "autotips@fte.mx"
		var params = {mail:{msg : msg,recipients:recipients,subject:"Noticación Autotips:" + window.localStorage.getItem("username") + "/ TARJETA:" + window.localStorage.getItem("idCard") }};
		dbC.query("/api/sendNotification","POST",params,ctrl_incidencia.msgRet,params)
	},
	msgRet : function(response){
		jqm.hideLoader();
		$.mobile.changePage( "#contactoListo");
	}
}