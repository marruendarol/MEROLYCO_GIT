/**********************************************************
*	LIST CONTROLLER
***********************************************************/

var ctrl_detail = {
	data : {},
	pageDiv : "#detailPro",

	init : function(data,template){

		console.log(data,"DETALLE PRODCUTO")
		ctrl_detail.data = data;
		ctrl_detail.render();
	},
	render : function(){

		var data  = paramsProd.data         
        
		var exist = data.existencias.split(",")
		data.exist = exist;

		var total = 0
		for (var i = 0; i < exist.length; i++) {
			total+=parseFloat(exist[i]);
		}
		data.total = total;

		var precios = data.precios.split(",")
		data.precios = precios;



		resObj = {
			data : data,
		    perms : getPerms(userdata.type)['catalogoList'].perms,
		}

		var mainObj = template.render('#detailPT',ctrl_detail.pageDiv,resObj)

		try {
		myScroll.destroy(); } catch (e){}
		
		$(ctrl_detail.pageDiv).trigger("create");


		$("#table_prod tr:odd").css('background-color', 'rgb(223, 223, 223)'); 

		 myScroll = new IScroll('#wrapperInfo',{  
		 	click:true,
		 	useTransition:true,
		 	scrollbars:scrolls,
		 	mouseWheel:true,
		 	disablePointer: true, // important to disable the pointer events that causes the issues
			disableTouch: false, // false if you want the slider to be usable with touch devices
			disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
		 	interactiveScrollbars: true })
		
			setTimeout(function(){ myScroll.refresh() }, 500);

			
	}
}


