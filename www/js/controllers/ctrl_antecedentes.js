/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_antecedentes = {
	data : {},
	pageDiv : "#antecedentesP",

	init : function(data,template){

		console.log(data,"PERSONALES")
		ctrl_antecedentes.data = data;
		ctrl_antecedentes.render();
	},
	render : function(){

		var data  = paramsSuc.data 

		 var info = data.info;
		 	info.antecedentes = data.antecedentes;

		var mainObj = template.render('#antecedentesT',ctrl_antecedentes.pageDiv,info)
		$(ctrl_antecedentes.pageDiv).trigger("create");

		var  myScroll = new IScroll('#wrapperInfo',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		$("#table_antecedentes tr:odd").css('background-color', 'rgb(223, 223, 223)'); 

		setTimeout(function(){ myScroll.refresh() }, 500);
		
	
	}
}

