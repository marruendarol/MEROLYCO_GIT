/**********************************************************
*	LIST CONTROLLER
***********************************************************/

distVis = false;
titleList = "Productos";
var spec = "";
itemCount = 1;

var ctrl_listProductos = {
	data : {},
	pageDiv : "#listProCont",
	init : function(data,template){
		console.log('EXPSEC 2 prod')
		ctrl_listProductos.data = data;
		$(ctrl_listProductos.pageDiv).empty();

			 titleList="Sin datos";
			 distVis=true;

			 ctrl_listProductos.getData();
			

	},
	getData : function(){

		jqm.showLoader("Cargando productos...");
		var params =  "data=" +  JSON.stringify({"pn":1,"rpp":50,"si":"producto.cve_art","sd":"ASC","q":paramsPage.linea}) 
		dbC.query('api/getCatalogo','POST', params, ctrl_listProductos.render);
	},
	render : function(res){
		
		jqm.hideLoader();

		$('#titleList').text("Productos")

		productos = {items :res.data};

		ctrl_listProductos.mainObj = template.render('#listProductosT',ctrl_listProductos.pageDiv,productos)

		$(ctrl_listProductos.pageDiv).trigger("create");


		 myScrollP = new IScroll('#wrapperListP',{  
		 	click:true,
		 	useTransition:true,
		 	scrollbars:scrolls,
		 	mouseWheel:true,
		 	disablePointer: true, // important to disable the pointer events that causes the issues
			disableTouch: false, // false if you want the slider to be usable with touch devices
			disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
		 	interactiveScrollbars: true })

		myScrollP.on('scrollEnd', function(){
			console.log(this.y,this.maxScrollY)
			 if (this.y == 0){}
               // $("#begin").show();
            if (this.y < 0){
                //$("#begin").hide();
            }
            if (this.y == this.maxScrollY){
            	
            	ctrl_listProductos.requestData();

            }
               
               // $("#end").show();
          //  if (this.y > this.maxScrollY)
               //requestData();// $("#end").hide();
			
			

		});



		ctrl_listProductos.mainObj.on('listDetail',function(e){
			//mainC.clickAnim(e.node)
			paramsProd = { data : e.context }
			$.mobile.changePage( "#detailProductos");
			console.log("detail prod")
			
		});	

	},
	requestData :function() {
		itemCount++;
		//jqm.showLoader("Cargando productos...");
		var params =  "data=" +  JSON.stringify({"pn":itemCount,"rpp":50,"si":"producto.cve_art","sd":"ASC","q":paramsPage.linea}) 
		dbC.query('api/getCatalogo','POST', params, function(res){
			

			for (var i = 0; i < res.data.length; i++) {
				ctrl_listProductos.mainObj.push('items',res.data[i])
			}
				//jqm.hideLoader();
			
			//myScrollP.updateCache(itemCount, data);
			myScrollP.refresh();
		});

	
	}

	
	
}