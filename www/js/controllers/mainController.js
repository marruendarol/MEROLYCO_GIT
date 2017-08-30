/**********************************************************
*	MAIN CONTROLLER
***********************************************************/
//keytool -genkey -v -keystore com.lyco.merolyco -alias merolyco -keyalg RSA -keysize 2048 -validity 1000000

 //jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore com.lyco.merolyco android-release-unsigned.apk merolyco

 // zipalign -v 4 android-release-unsigned.apk releaseMerolyco.apk 


var serverURL = "https://merolyco.com/";
//var serverURL = "http://192.168.100.15:3030";
var paramsPage = {}
var scrolls = false;

var mainC = {
	init: function(callback){
		mainC.initFoundation();
		mainC.loadTemplateFile(callback)
	},
	initFoundation : function(){
		$(document).foundation();
		$(document).foundation('alert','events');

		// Abide Validation
		$(document).foundation('abide', {
	      patterns: {
	        short_field: /^.{,40}$/,
	        long_field: /^.{,72}$/
	      }
    	}); 
	},
	loadTemplateFile: function(callback){
		$("#templateLoader").load("./templates/views.html",function(){
			callback();
		}); 
	},
	comboArray : function(extra){
		$(extra.div).append('<option value="" disabled selected>'+extra.placeholder+'</option>')
		for (var a in extra.arr){
			$(extra.div).append('<option value="'+ extra.arr[a][extra.value] +'">' + extra.arr[a][extra.label] +'</option>')
		}
		if(extra.defaultVal!=null){
			$(extra.div).val(extra.defaultVal);
		}
	},
	clickAnim : function(el){
		$(el).animate({backgroundColor: '#666'},200, function(){ $(el).animate({backgroundColor: '#000'}, 'slow', function(){  }) })
	}
}

function showLoading( on, text ) {  // on: true|false
 try {
    setTimeout( function() {
      if ( on )
        $.mobile.loading( "show",  {
		  text: text || "",
		  textVisible: true,
		  theme: "z",
		  html: "<span class='ui-icon ui-icon-loading'></span><div class='loadTitle'>"+ text +"</div>"
		} );
      else {
        //$.mobile.loading( "hide" );  // does not seem to work (e.g. using with GWT and jQM 1.4.3)
        $.mobile.loading( "hide")
        $('.ui-loader').remove();  // removes the loader div from the body
      }       
    }, 1); 
	}catch(e){}
}



var jqm = {
	showLoader : function(text){
		
		showLoading(true,text)
	},
	hideLoader : function(){
		console.log("hidding ")
		showLoading(false)
	},
	popup : function(params){
		
		$('#pop_Title').html(params.title)
		$('#pop_text').html(params.text)
		$( "#pop1" ).popup( "open" );

		$( "#pop1" ).on( "popupafterclose", function( event, ui ) {
			params.callback()

		} );

	}
}

/**********************************************************
*	FOUNDATION CONTROLLERS
***********************************************************/
var foundationJS = {
	createAlert : function(msg,div,tipo){
		template.render('#alertT',div,{msg:msg,tipo:tipo});
	}
}


/**********************************************************
*	TEMPLATE RENDERER
***********************************************************/
var template = {
	render: function(template,output,data,callback,partials){
		var options = {
		  el: output,
		  template:  template,
		  partials: partials,
		  data : data
		}
		// BIND HELPERS
		for (var a in rh){
			options.data[a] = rh[a];
		}
		var ractive = new Ractive(options);
		// IF CALLBACK
		if(callback) { callback()};
		return ractive;
	},
	setListeners : function(){

	},
	update: function(){

	},

}


/**********************************************************
*	DATABASE CONTROLLER
***********************************************************/
var dbC = {
	query : function(url,type,params,callback,errorCB,extra){
		 $.ajax({
	        type: type,
	        data: params,
	        crossDomain: true,
            url: serverURL + url,
	        dataType: 'JSON',
	        }).done(function( response ) {
        		if(callback) { callback(response,extra) }
	        }).fail(function( response ) {
	        	alert("Revise su conexión a internet")
	           	console.log("fail query",response,extra);
	           	if(errorCB) { errorCB(response,extra) }
	    }); 
	}
}


/**********************************************************
*	REACTIVE HANDLERS
***********************************************************/
var rh = {
	checked : function(lvalue,rvalue,defaultVal){
		if(lvalue==undefined && defaultVal){ lvalue = defaultVal; }
		if( lvalue==rvalue ) {
	       return ' checked="checked"'  } else { return "" };
	},
	timeConverter : function(value){
		return utils.timeConverter(value);
	},
	correctCase : function(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},
	roundDist : function(value){
		return value.toFixed(2);
	},
	maskTel : function(value){
		return value.replace(/(.{2})(.{4})(.{4})/,'$1 $2 $3 ');
	},
	restantes : function(value){
		var date1 = new Date(parseInt(value)*1000);
		var date2 = new Date();
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

		if(utils.generateTS()>parseInt(value)){
			return "TARJETA VENCIDA";
		}else{
			return diffDays;
		}

		
	},
	momentoCal : function(val){
	  moment.locale('es');
      var cal = moment.unix(val,'DD/MM/YYYY, h:mm:ss a','es')
      return  cal;
	}, 
    momentoFecha : function(val){
      moment.locale('es');
      var cal = rh.cCase(moment(val).format('DD MMM YYYY'));
      return  cal;
    },
     momentoHora : function(val){
      moment.locale('es');
      var cal = moment(val).format('h:mm:ss a');
      return  cal;
    },
    momentoDate : function(val){
        console.log(val,"VALE")
      moment.locale('es');
      var cal = moment(val).calendar();
      console.log(cal,"CAL")
      return  cal;
    },
	cCase  : function(str){
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()});
	},
	formatMoney : function(val){
		return "$" + parseFloat(val).formatMoney(2,".",",");
	}
}



Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };




var model = {};
model.pedidos = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true, estatus:true, factura:true, interno:true, borrarNota:true, notas:true, guardar:true, del :true},
		 GERENTE 		: { user:true , client:false, sucursal:true,estatus:true, factura:true, interno:true, borrarNota:true , notas:true, guardar:true},
		 ALMACEN 		: { user:true , client:true, sucursal:true , notas:true, internos:true},
		 VENTAS  		: { user:true , client:true, sucursal:true , notas:true},
		 FACTURACION 	: { user:true , client:true, sucursal:true , notas:true,estatus:true,guardar:true},
		 CLIENTE 		: { user:true , client:true, sucursal:false},
		 SUBA 			: { user:true , client:true, sucursal:true,create:true},
		 
	},
	info : {
		name : "Pedidos " ,
		link : "pedidosList",
	}
}
model.catalogo = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:true,des_max:true},
		 GERENTE 		: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:true,des_max:true},
		 ALMACEN 		: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:true,des_max:true},
		 VENTAS  		: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:true,des_max:true},
		 FACTURACION 	: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:false,des_max:true},
		 CLIENTE 		: { user:true , client:true, sucursal:true,clave:false,desc:true,e1:false,e2:false,e3:false,e4:false,e5:false,total:false,precio_pub:true,precio_min:false,des_max:false},
		// COBRAR 	 	: 
		// AUDITORIA  	: 
		 SUBA 			: { user:true , client:true, sucursal:true,clave:true,desc:true,e1:true,e2:true,e3:true,e4:true,e5:true,total:true,precio_pub:true,precio_min:true,des_max:true},
	},
	info : {
		name : "Catálogo" ,
		link : "catalogoList",
	}
}

model.usuarios = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true,del :true},
	},
	info : {
		name : "Usuarios del sistema" ,
		link : "usuariosList",
	}
}
model.clientes = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true},
	},
	info : {
		name : "Clientes" ,
		link : "clientesList",
	}
}
model.sucursales = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true,del :true},
		 SUBA 			: { user:true , client:true, sucursal:true},
	},
	info : {
		name : "Sucursales" ,
		link : "sucursalesList",
	}
}

model.cambio = {
	perms : {
		 ADMIN 	 		: { user:true , client:true, sucursal:true,borrarNota:true, notas:true, guardar:true,  del :false,create:true},
		 GERENTE 		: { user:true , client:true, sucursal:true,borrarNota:false, notas:true, guardar:false,create:false},
		 VENTAS  		: { user:true , client:true, sucursal:false,borrarNota:false, notas:true, guardar:false,create:false},
		 FACTURACION 	: { user:true , client:true, sucursal:true,borrarNota:false, notas:true, guardar:true,create:false},
		 COBRAR 	 	: { user:true , client:true, sucursal:true,borrarNota:false, notas:true, guardar:true,create:true},
		 AUDITORIA  	: { user:true , client:true, sucursal:true,borrarNota:false, notas:true, guardar:false,create:true},
		 SUBA 			: { user:true , client:true, sucursal:true,borrarNota:true, notas:true, guardar:true,  del :false,create:true},
	},
	info : {
		name : "Perfil" ,
		link : "perfil",
	}
}




function getPerms(user){ // Get user Permissions on cata route

	var userType = [0,"ADMIN","GERENTE","ALMACEN","VENTAS","FACTURACION","CLIENTE","COBRAR","PAGAR","AUDITORIA","SUBA"];
	var user = userType[parseInt(user)]
	var usPerms = {};

    for ( var a in model){
        if(model[a].perms[user]!=undefined){
        	usPerms[model[a].info.link] = {info : model[a].info , perms : model[a].perms[user]}
        }
        
    }
    return usPerms
}