/**********************************************************
*	MAIN SCREEN CONTROLLER
***********************************************************/

var socket; 
var userRoom = "";


var ctrl_loginS = {
	data : {},
	pageDiv : "#loginP",
	init : function(data,template){
		ctrl_loginS.data = data;
		ctrl_loginS.render();
		
	},
	render : function(){

		$(ctrl_loginS.pageDiv).empty();
		var mainObj = template.render('#loginT',ctrl_loginS.pageDiv,{},null)

		$(document).on('focus', 'input, textarea', function() {
	  try {
		   $("#logoLoginB").hide(); } catch (e) {}
		});

		$(document).on('blur', 'input, textarea', function() {
			try {
		    $("#logoLoginB").show();
		    } catch (e) {}
		});

		mainObj.on('ingresar',function(){
			var user = $('#name').val();
			var pass = $('#password').val();
			jqm.showLoader("ingresando...");
			ctrl_loginS.checkLogin( {login:user,pw:pass,persistent:false})
		});

			mainObj.on('cancelar',function(){
			$.mobile.changePage("#login");
		});



		$(ctrl_loginS.pageDiv).trigger("create");

	},
	checkLogin : function(data){

		var params =  {login:data.username,pw:data.password,persistent:false}
		console.log(params,"PARAMS")

        $.ajax({
            type: 'POST',
		    data:  "data=" +  JSON.stringify(data),
            url: serverURL + 'api/login',
            dataType: 'JSON'
            }).done(function( response ) {
            	if(response.length>0){
            		userdata = response[0]
       
            		window.localStorage.setItem("username", response[0].login);
            		window.localStorage.setItem("password", response[0].pw);
            		window.localStorage.setItem("nombre", response[0].nombre);
            		window.localStorage.setItem("type", response[0].type);

            		$.mobile.changePage("#mainScreen")
            	}else{
            		jqm.hideLoader();
            		jqm.popup( {text:"Usuario y/o contraseña inválido",title:"Ingreso",callback: function(){
            			$.mobile.changePage( "#login", {});
            		}})
            		
            		//$.mobile.changePage( "#login", {});
            	}
            	
        }).fail(function( response, status ,a ) {
	       console.log(response,status,a)
	    });   
	},
	
}