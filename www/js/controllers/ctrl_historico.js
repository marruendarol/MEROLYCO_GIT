/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_historico = {
	data : {},
	pageDiv : "#historicoP",

	init : function(data,template){

		console.log(data,"Historico")
		ctrl_historico.data = data;
		ctrl_historico.render();
	},
	render : function(){

		var data  = paramsSuc.data 

		var mainObj = template.render('#historicoT',ctrl_historico.pageDiv,data)
		$(ctrl_historico.pageDiv).trigger("create");

		var  myScroll = new IScroll('#wrapperInfo',{  
		 	click:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })


		setTimeout(function(){ myScroll.refresh() }, 500);
		
	
	}
}

