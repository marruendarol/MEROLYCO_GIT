/**********************************************************
*	LOGIN CONTROLLER
***********************************************************/

var socket; 
var userRoom = "";



$(document).ready(function() {
    mainC.initFoundation();
    ctrl_login.init();
});

var ctrl_login = {
	init : function(){
		ctrl_login.render()
		//ctrl_login.checkSession();
	},
	checkSession: function(){
		 $.ajax({
	        type: 'POST',
	        data: {},
	        url: serverURL + 'user/session',
	        dataType: 'JSON'
	        }).done(function( response ) {
        		if(response.status=="EXPIRED"){
        			ctrl_login.render()
        		}else{
        			ctrl_login.redirect();
        		}
	        }).fail(function( response ) {
	           	console.log("fail session",response)
	           	ctrl_login.render();
	    }); 
	},
	login: function(username,password,persistent){
		var params = {username:username,password:password,persistent:persistent};
	    $.ajax({
	        type: 'POST',
	        data: params,
	        url: serverURL + '/user/acceso',
	        dataType: 'JSON'
	        }).done(function( response ) {
	           if(response.length==0){
	                ctrl_login.loginError();
	           } else {
	   				ctrl_login.redirect(response[0].defaultSecc);  // Manda a Route Default
	           }  
	        }).fail(function( response ) {
	           	ctrl_login.loginError()
	    });   
	},
	initSocket : function(){

    	socket.on('connect', function () { 
    		console.log("connecting remote",userRoom)
    		socket.emit('create',userRoom);  

    		socket.on('joined', function(response){
    			//console.log("4- Socket join")
    			createGrowl("Group info","Conectado a cliomedic",false,'bg_ok','conn');
      		});

	        socket.on('reconnect_error', function(err) {  //Fired upon a reconnection attempt error.Parameters:
	        	console.log(err)
	        	createGrowl("App info","No se pudo reconectar al servidor.",false,'bg_error','errorreconexion');
	        });

	         socket.on('error', function(err) {  // Fired upon a connection error
	        	createGrowl("App info","Error de conección. intentando reconectar...",false,'bg_error',"errorconexion");
	        });

	        socket.on('reconnect', function(err) {  //Fired upon a reconnection 
	        	createGrowl("App info","Reconectado a servidor...",false,'bg_ok','reconectado');
	            
	        });
    	});
    },
	loginError:function(){
		foundationJS.createAlert('Usuario Invalido',"#alertCont","alert")
	},
	redirect: function(url){
		 window.location = url;
	},
	render:function(){
		var logObj = template.render('#loginT','#loginContainer',{})
		logObj.on( 'loginActivate', function ( event ) {
			var username 	= $('[name="username"]').val();
			var password 	= $('[name="password"]').val();
			var persistent 	=  $("input[name='persistent']").is(":checked");
	  		ctrl_login.login(username,password,persistent);
		});
		logObj.on('keypress',function(e){

			var isC =  ctrl_login.isCapslock(e.original)
			console.log(isC)

			if(isC) {
				 foundationJS.createAlert('Mayúsculas Activado',"#alertCont","warning")
			} else {
		      $('#alertCont').empty();
    		}
		})

	},
	isCapslock : function(e){

        e = (e) ? e : window.event;

        var charCode = false;
        if (e.which) {
            charCode = e.which;
        } else if (e.keyCode) {
            charCode = e.keyCode;
        }

        var shifton = false;
        if (e.shiftKey) {
            shifton = e.shiftKey;
        } else if (e.modifiers) {
            shifton = !!(e.modifiers & 4);
        }

        if (charCode >= 97 && charCode <= 122 && shifton) {
            return true;
        }

        if (charCode >= 65 && charCode <= 90 && !shifton) {
            return true;
        }

        return false;

    }

}