/**********************************************************
*	LIST CONTROLLER
***********************************************************/

distVis = false;
titleList = "Expedientes";
var spec = "";

var ctrl_expedienteSec = {
	data : {},
	pageDiv : "#expedientesSecP",
	init : function(data,template){
		console.log('EXPSEC')
		ctrl_expedienteSec.data = data;
		$(ctrl_expedienteSec.pageDiv).empty();

			 titleList="Pacientes";
			 distVis=true;
			 ctrl_expedienteSec.renderSeccs(paramsSuc.data)
			

	},
	renderSeccs : function(data){
		$('#titleList').text("Expediente")
		console.log("render Seccs ")
		var datar = {
			nombre : data.info.nombre,
			items: [{secname:"Datos personales",id:0},
					{secname:"Antecedentes",id:1},
					{secname:"Estudios",id:2},
					{secname:"Histórico de notas",id:3}
				]
		};

		ctrl_expedienteSec.mainObj = template.render('#seccsExp',ctrl_expedienteSec.pageDiv,datar)

		$(ctrl_expedienteSec.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		ctrl_expedienteSec.mainObj.on('clickSecc',function(e){
			console.log(e.context,"CONTEXTO")
			if(e.context.id==0){
				$.mobile.changePage( "#personalesView");	
			}
			if(e.context.id==1){
				$.mobile.changePage( "#antecedentesView");	
			}
			if(e.context.id==2){
				$.mobile.changePage( "#estudiosView");	
			}
			if(e.context.id==3){
				console.log("cambiando pagina")
				$.mobile.changePage( "#listNotas");	
			}
			
		})		

	}
}