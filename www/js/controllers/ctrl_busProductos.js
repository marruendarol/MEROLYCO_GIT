/**********************************************************
*	LIST CONTROLLER
***********************************************************/

distVis = false;
titleList = "Productos";
var spec = "";
itemCount = 1;
str = "";

var ctrl_busProductos = {
	data : {},
	pageDiv : "#busProCont",
	init : function(data,template){
		console.log('EXPSEC 2 prod')
		ctrl_busProductos.data = data;
		$(ctrl_busProductos.pageDiv).empty();

			 titleList="Sin datos";
			 distVis=true;

			 ctrl_busProductos.render();
			

	},
	getData : function(){

		//$('#loaderB').show();


		var params =  "data=" +  JSON.stringify({"pn":1,"rpp":10,"si":"producto.cve_art","sd":"ASC","q":str}) 
		dbC.query('api/getCatalogo','POST', params, ctrl_busProductos.dataRet);
	},
	dataRet : function(res){
		ctrl_busProductos.mainObj.set('searchOn',true)
		ctrl_busProductos.mainObj.set('items',res.data)

	

		setTimeout(function () {
		
            myScrollB.refresh()
           
        }, 10);

		//jqm.hideLoader();
		
	},
	render : function(res){
		
		productos = {items :[],searchOn:false};

		ctrl_busProductos.mainObj = template.render('#busProductosB',ctrl_busProductos.pageDiv,productos)

		$(ctrl_busProductos.pageDiv).trigger("create");
		$('#loaderB').hide();
		

		$('#busquedaI').keyup(function(){
			str = $('#busquedaI').val();
			if(str.length>2){
				ctrl_busProductos.getData();	
			}
			
		})


		 myScrollB = new IScroll('#wrapperListB',{  
		 	click:true,
		 	useTransition:true,
		 	scrollbars:scrolls,
		 	mouseWheel:true,
		 	disablePointer: true, // important to disable the pointer events that causes the issues
			disableTouch: false, // false if you want the slider to be usable with touch devices
			disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
		 	interactiveScrollbars: true })

		myScrollB.on('scrollEnd', function(){
			console.log(this.y,this.maxScrollY)
			 if (this.y == 0){}
               // $("#begin").show();
            if (this.y < 0){
                //$("#begin").hide();
            }
            if (this.y == this.maxScrollY){
            	//jqm.showLoader("Cargando productos...");
            	ctrl_busProductos.requestData();

            }
               
               // $("#end").show();
          //  if (this.y > this.maxScrollY)
               //requestData();// $("#end").hide();
			
			

		});



		ctrl_busProductos.mainObj.on('listDetail',function(e){
			//mainC.clickAnim(e.node)
			paramsProd = { data : e.context }
			$.mobile.changePage( "#detailProductos");
			console.log("detail prod")
			
		});	

	},
	requestData :function() {
		itemCount++;
		var params =  "data=" +  JSON.stringify({"pn":itemCount,"rpp":50,"si":"producto.cve_art","sd":"ASC","q":str}) 
		dbC.query('api/getCatalogo','POST', params, function(res){
			

			for (var i = 0; i < res.data.length; i++) {
				ctrl_busProductos.mainObj.push('items',res.data[i])
			}
				//jqm.hideLoader();
			
			//myScrollP.updateCache(itemCount, data);
			myScrollB.refresh();
		});

	
	}

	
	
}