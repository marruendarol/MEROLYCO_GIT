/**********************************************************
*	LIST CONTROLLER
***********************************************************/

distVis = false;
titleList = "";
var spec = "";
var expInt;
var pacs = []
var currList = [];

var ctrl_list = {
	data : {},
	pageDiv : "#listPCont",
	init : function(data,template){
		ctrl_list.data = data;
		$(ctrl_list.pageDiv).empty();
 		titleList="Lineas";	
 		distVis=false;
 		ctrl_list.getLineas()
		
	//--------------------------------------------ZONA
	},

	//------------------------------------------ESPECIALIDAD
	getLineas : function(id){

		jqm.showLoader("Cargando lineas...")
		dbC.query('api/getCategorias','GET', {}, ctrl_list.lineasRes);
		
	},
	lineasRes : function(response){
		
        	ctrl_list.render(response.data)
	},
	getProductos : function(id){

		jqm.showLoader("Cargando lineas...")
		dbC.query('api/getCategorias','GET', {}, ctrl_list.prodRes);
		
	},
	prodRes : function(){

	},
	//------------------------------------------LISTADO DE DESCUENTOS
	//-----------------------------------------------------------
	render : function(data){


		jqm.hideLoader();

			
		var datar = { 
			items  : data,
					distVis : distVis,
					empty 	: (data.length==0 ? true : false),
					img 		: "noimage.png",
			}

		$('#titleList').text(titleList)

		ctrl_list.mainObj = template.render('#listT',ctrl_list.pageDiv,datar)

		ctrl_list.mainObj.on('listDetail',function(event){
			mainC.clickAnim(event.node)
			paramsPage = { id : event.context._id, type: "listProductos", linea : event.context.id_cat_pri }
			$.mobile.changePage("#listProductos");
		});

		$(ctrl_list.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	 myScroll = new IScroll('#wrapperList',{  
		 	click:true,
		 	useTransition:true,
		 	scrollbars:scrolls,
		 	mouseWheel:true,
		 	disablePointer: true, // important to disable the pointer events that causes the issues
			disableTouch: false, // false if you want the slider to be usable with touch devices
			disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
		 	interactiveScrollbars: true })

		 ctrl_list.mainObj.on('openLink',function(event){
				window.open(event.context.urlLink, '_system')
			});
		
	

	},
	renderProductos : function(data){


		jqm.hideLoader();

		
		var datar = { 
			items  : data,
					distVis : distVis,
					empty 	: (data.length==0 ? true : false),
					img 		: "noimage.png",
			}

		$('#titleList').text(titleList)

		ctrl_list.mainObj = template.render('#listTP',ctrl_list.pageDiv,datar)

		ctrl_list.mainObj.on('listDetail',function(event){
			
			mainC.clickAnim(event.node)
			paramsSuc = { data : event.context }
			$.mobile.changePage( "#expedientSec");
			//ctrl_list.renderSeccs(event.context);
		});

		$(ctrl_list.pageDiv).trigger("create");
		//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		 myScroll = new IScroll('#wrapperList',{  
		 	click:true,useTransition:true,scrollbars:scrolls,mouseWheel:true,interactiveScrollbars: true })

		 ctrl_list.mainObj.on('openLink',function(event){
				window.open(event.context.urlLink, '_system')
			});
		
	

	}
}