/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/
var ctrl_registro = {
	data : {},
	pageDiv : "#registroP",
	card : {},
	life : "",
	init : function(data,template){
		ctrl_registro.data = data;
		ctrl_registro.render();
	},
	render : function(){

		$(ctrl_registro.pageDiv).empty();

		var mainObj = template.render('#registroT',ctrl_registro.pageDiv,{},null)

		$(document).foundation();  // Refresh for tooltips

		mainObj.on('validate',function(){
			jqm.showLoader("verificando tarjeta...");
			ctrl_registro.create();
			//ctrl_registro.validateCard($("#card").val(),$("#ccv").val());
		});	

		mainObj.on('cancelar',function(){
			$.mobile.changePage( "#firstP" );
		});

		$(ctrl_registro.pageDiv).trigger("create");

			$("#movil").mask("99-9999-9999");

		  	 myScroll = new IScroll('#wrapperReg',{  
		 	click:true,
		 	useTransform: true,
		 	onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) {
                target = target.parentNode;
            }
            if (target.tagName != 'SELECT' && target.tagName != 'INPUT'
                && target.tagName != 'TEXTAREA'
            ) {
                e.preventDefault();
            }
        }
		 	 })
 	 
		  	 

	},
	validateCard : function(idCard,ccv){
		ctrl_registro.card = idCard;
		ctrl_registro.ccv = ccv;
		var params = {idCard:idCard,ccv : ccv};
		dbC.query("/api/checkCard","POST",params,ctrl_registro.validReturn)
	},
	tsPlus : function(dias){
		var today = new Date();
		var tomorrow = new Date(today);
			tomorrow.setDate(today.getDate()+parseInt(dias));
		console.log(tomorrow , dias)
		return utils.generateTS(tomorrow);
	},
	validReturn : function(response){

		console.log(response)
		jqm.hideLoader();

		console.log(response)

		if(response.length==1 && response[0].estatus=="0" ){
			ctrl_registro.life = ctrl_registro.tsPlus(response[0].dias); 
			ctrl_registro.create();	

		}

		if(response.length==0){
			jqm.popup( {text:"El ID de la tarjeta o el CCV no es válido.",title:"Error."})

		}
		
		if(response.length==1 && response[0].estatus=="1"){
			jqm.popup( {text:"Esa ya ha sido registrada. verifique de nuevo o pongase en contacto con su proveedor",title:"Error."})	
		}
	},
	getDataObj :function(){
		var dataObj = {};
		var errs = [];
		dataObj.nombre		  	= $("#nombre").val(); 
		dataObj.username 	 	= $("#email").val(); 
		dataObj.password	 	= $("#pass").val(); 
		dataObj.movil	     	= $("#movil").val(); 
		dataObj.cpass		  	= $("#cpass").val(); 
		dataObj.code		  	= $("#code").val(); 
		dataObj.origen		  	= $("#origen").val(); 

		ctrl_registro.username = dataObj.username;
		ctrl_registro.password = dataObj.password;

		if(dataObj.nombre.length<2) { errs.push("Nombre requerido")}
		if(dataObj.username.length<2) { errs.push("Correo electrónico Requerido")}
		if(dataObj.password.length<2) { errs.push("Contraseña requerida")}
		if(dataObj.password!=dataObj.cpass) { errs.push("Las contraseñas no coinciden")}


		if(errs.length==0){
			return dataObj;
		}else{
			jqm.hideLoader();
			jqm.popup( {text:errs.toString(),title:"Error."})
		}

    	
	},
	create:function(){
		jqm.showLoader("creando usuario...");
		// Client Obj
		var item = {	ts 			: utils.generateTS(),
						id 			: utils.generateUUID()};

		var params = {}
		params.dataB = ctrl_registro.getDataObj(); 
		params.dataB.clients = [item];
		params.dataB.userID = "internet"
		params.dataB.estRCD = 1;
		dbC.query("/api/createUserMobile","POST",params,ctrl_registro.create_Return)
	},
	create_Return : function(data){
		jqm.hideLoader();
		switch (data.res){
			case 4 : jqm.popup( {text:"Ese correo ya ha sido previamente registrado.",title:"Error."});break;
			case 0 : jqm.popup( {text:"El código no es válido.",title:"Error."});break;
			case 1 : jqm.popup( {text:"El código ya ha sido usado.",title:"Error."});break;
			case 2 : jqm.popup( {text:"Usuario creado con éxito.",title:"Error."});
					ctrl_loginS.checkLogin({username:ctrl_registro.username,password:ctrl_registro.password});
					break;
		}
		
		//	var params = {idCard:ctrl_registro.card, username : $("#email").val() }
		//dbC.query("/api/updateCard","POST",params,ctrl_registro.updateCardRet)	
		//}
		
	},
	updateCardRet : function(){
		console.log(ctrl_registro.username)
		console.log(ctrl_registro.pass)
		
	}
}