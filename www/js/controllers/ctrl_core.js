/**********************************************************
*	CORE CONTROLLER
***********************************************************/

var ctrl_core = {

	path : "",
	id 	 : "",
	loadedControllers : [],
	init : function(){	
		ctrl_core.routeListeners();


		var username= window.localStorage.getItem("username");
		if(username!=undefined){
			    // ctrl_loginS.initSocket()
			   //  alert("main")
				$.mobile.changePage("#mainScreen")
			}else{
				  var params = { init : 'ctrl_loginS.init' }
	    	   ctrl_core.loadController("./js/controllers/ctrl_loginS.js",params);
			}

	},
	loadController : function(controllerURL,params,reload){
		
		if(reload || ctrl_core.loadedControllers.indexOf(controllerURL)==-1){
			$.ajax({
	        type: "GET",
	        url: controllerURL,
	        dataType: "script",
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(textStatus, errorThrown);
	        },
	        success:function(e){
	         	eval(params.init)(params);
	        }
    		});
		}else{
			eval(params.init)(params);
		}
		ctrl_core.loadedControllers.push(controllerURL)
		
	},
	routeListeners : function(){


		$(document).on("pagebeforeshow","#initialBlank", function() {
	       	
	    });

		$(document).on("pagebeforeshow","#login", function() {
	        	        var params = { init : 'ctrl_loginS.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_loginS.js",params);
	    });

		$(document).on("pagebeforeshow","#insertCard", function() {
	        var params = { init : 'ctrl_anadir.init', }
	    	ctrl_core.loadController("./js/controllers/ctrl_anadir.js",params);
	    });

	    $(document).on("pagebeforeshow","#calendar", function() {
	        var params = { init : 'ctrl_agendaM.init', }
	    	ctrl_core.loadController("./js/controllers/ctrl_agendaM.js",params);
	    });

	    $(document).on("pagebeforeshow","#recuperar", function() {
	        var params = { init : 'ctrl_recuperar.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_recuperar.js",params);
	    });

	
		$(document).on("pagebeforeshow","#mainScreen", function() {
	        var params = { init : 'ctrl_home.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_home.js",params);
	    });

	    $(document).on("pagebeforeshow","#list", function() {
	    	console.log("invocando list")
	      	var params = { init : 'ctrl_list.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_list.js",params);
	    });



	    // Expedientes -----------------------------------------------------------------

	     $(document).on("pagebeforeshow","#listDesc", function() {
	      	var params = { init : 'ctrl_listDesc.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listDesc.js",params);
	    });



	    $(document).on("pagebeforeshow","#listProductos", function() {
	      	var params = { init : 'ctrl_listProductos.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_listProductos.js",params);
	    });

	    $(document).on("pagebeforeshow","#detailProductos", function() {
	      	var params = { init : 'ctrl_detail.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_detailProducto.js",params);
	    });

	      $(document).on("pagebeforeshow","#busProductos", function() {
	      	var params = { init : 'ctrl_busProductos.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_busProductos.js",params);
	    });

	    //----------------------------------------------------------------------------


	    $(document).on("pagebeforeshow","#mapa", function() {
	      	var params = { init : 'ctrl_mapa.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_mapa.js",params);
	    });

	    $(document).on("pagebeforeshow","#infoSuc", function() {
	      	var params = { init : 'ctrl_info.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_info.js",params);
	    });

	    $(document).on("pagebeforeshow","#contacto", function() {
	      	var params = { init : 'ctrl_contacto.init' }
	    	ctrl_core.loadController("./js/controllers/ctrl_contacto.js",params);
	    });

	  
	}

}