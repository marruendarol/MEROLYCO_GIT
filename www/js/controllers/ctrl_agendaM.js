
var ctrl_agendaM = {
	tabData : {tabs  : []},
	rObj : {},
	userId : {},
    pacientes : [],
	init: function(obj){
		ctrl_agendaM.render(obj);
	},
    populate : function(combo,url,defaultValue,params){
            
    },
    render : function(obj){
		var pacientes = [];
		var valor = parseInt(Math.random(1000000)*100000000);
		var boton = {
			nombre: 'Crear cita',
			accion: 'crearCita_'+valor
		};
		
    	ctrl_agendaM.rObj = template.render('#agendaT','#calendarP',{boton: boton, pacientes: pacientes});
        
        var zone = "UTC-06:00";  //Change this to your timezone
        
        var currentMousePos = {
            x: -1,
            y: -1
        };
            jQuery(document).on("mousemove", function (event) {
            currentMousePos.x = event.pageX; 
            currentMousePos.y = event.pageY;
        });
    
            /* initialize the external events
            -----------------------------------------------------------------*/
    
            $('#external-events .fc-event').each(function() {
    
                // store data so the calendar knows to render an event upon drop
                $(this).data('event', {
                    title: $.trim($(this).text()), // use the element's text as the event title
                    stick: true // maintain when user navigates (see docs on the renderEvent method)
                });
    
                // make the event draggable using jQuery UI
                $(this).draggable({
                    zIndex: 999,
                    revert: true,      // will cause the event to go back to its
                    revertDuration: 0  //  original position after the drag
                });
    
            });

            var currHeight = $(document).height() - 130;
            console.log(currHeight,"CURR HE");

			$('#calendar').fullCalendar({
                //events: JSON.stringify(events),

				schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                utc: true,
				header: {
					left: 'prev',
					center: 'month,agendaWeek,agendaDay',
					right: 'next'
				},
                footer :{
                    left : 'prev,next'
                },
                defaultDate: $('#calendar').fullCalendar('today'),
				defaultView : 'agendaDay',
				lang: 'es',
				buttonIcons: false, // show the prev/next text
				contentHeight: currHeight,
				weekNumbers: false,
				editable: true,
                droppable: true,
				eventLimit: true, // allow "more" link when too many events
				//resourceLabelText: 'Citas',
				slotEventOverlap : false,
                selectable: false,
                allDaySlot : false,
                titleFormat : 'MMMM D YYYY',
                columnFormat : {
                    month: 'ddd',    // Mon
                    week: 'ddd M/D', // Mon 9/7
                    day: 'dddd MMMM/D'      // Monday
                    },
                select: function(start, end, jsEvent, view) {
                     // start contains the date you have selected
                     // end contains the end date. 
                     // Caution: the end date is exclusive (new since v2).
                     
                },
                eventRender: function(event, element) {
                    var desc = event.description
                    if(desc==undefined){
                        desc ="";
                    }
                   element.find('.fc-title').append('<div class="hr-line-solid-no-margin"></div><span style="font-size: 10px">'+  desc +'</span></div>');
                },
				
				businessHours: {
                    start: '08:00', // a start time (10am in this example)
                    end: '18:00', // an end time (6pm in this example)
                
                    dow: [ 1, 2, 3, 4, 5, 6 ]
                    // days of week. an array of zero-based day of week integers (0=Sunday)
                    // (Monday-Thursday in this example)
                },
                
                eventDrop: function(event, delta, revertFunc) {
                    var title = event.title;
                    var start = event.start.format();
                    var end = (event.end === null) ? start : event.end.format();
                    $.ajax({
                        url: 'calendario/update_Rango',
                        data: 'type=resetdate&title='+title+'&start='+start+'&end='+end+'&eventid='+event._id,
                        type: 'POST',
                        dataType: 'json',
                        success: function(){
                            $('#calendar').fullCalendar('refetchEvents');
                        },
                        error: function(e){		    			
                            revertFunc();
                            alert('Error processing your request: '+e.responseText);
                        }
                    });
                },
                eventClick: function(event, view) {

                     var modal = template.render('#editarT', '#modal', {});
                    createModal($('#eCita'))

					var valor = parseInt(Math.random(1000000)*100000000);
				        

                    $('#motivo').val(event.description);
                    $('#paciente').val(event.title);
                    $('#start').val(event.start.format());


                    modal.on("deleteCita", function(){
                        console.log("DELETE")
                        var con = confirm('Desea eliminar la cita del paciente '+ event.title +' permanentemente?');
                        if(con === true) {
                            $.ajax({
                                url: 'calendario/delete_Evento',
                                data: 'type=remove&title='+event.title+'&eventid='+event._id,
                                type: 'POST',
                                    dataType: 'json',
                                success: function(response){
                                    console.log(response);
                                    //if(response.message == 'El evento se ha eliminado'){
                                        $('#calendar').fullCalendar('removeEvents', event._id);
                                        createGrowl("Group info","Cita " + event.title +   " borrada.",false,'bg_ok','guardando');
                                        $('.qtip-modal').qtip('hide');
                                        //simpleRefresh();
                                    //}
                                },
                                error: function(e){ 
                                    alert('Error processing your request: '+e.responseText);
                                }
                            });
                        }

                    }) ;  
				
					modal.on("updateCita", function(){

                     //$("#start").val = toString(start._f);


                        var dataCita = {
                            eventid : event._id,
                            description : $('#motivo').val(),
                           
                        }

                        $.ajax({
                            url: 'calendario/update_Evento',
                            data: dataCita ,
                            type: 'POST',
                            dataType: 'json',
                            success: function(response){
                                console.log(response);
                                
                                 $('#calendar').fullCalendar('refetchEvents');
                                $('.qtip-modal').qtip('hide');
                                createGrowl("Group info","Cita Actualizada.",false,'bg_ok','guardando');
                                
                            },
                            error: function(e){
                                alert('Error procesando la llamada: '+e.responseText);
                            }
                        });
                        $('.qtip-modal').qtip('hide');
                    });
                    
                    modal.on("cancelarCita", function(){
                          $('.qtip-modal').qtip('hide');
                    });




                    //$('#end').val(event.end.format());
                },
                
                dayClick: function(date, event, view, data) {

                     var modal = template.render('#eventT', '#modal', {});
                    createModal($('#rCita'));

                    var paciente= "";
                    var allDay= "";
                    var title= "";
                    var start= "";
                    var end= "";
                    $("#paciente").val('');
                    $("#input_allDay").val('');
                    $("#motivo").val('');
                    $("#start").val('');
                    $("#end").val('');
                    var valor = parseInt(Math.random(1000000)*100000000);
                    
                    // COBMO

                 


                    $('#start').datetimepicker({lang:'es', 
                        step:30,
                        startDate: new Date(date).addDays(1),
                       // timepicker:true,
                        format:'Y-m-d h:i',
                    });
                    $('#end').datetimepicker({lang:'es', 
                        step:30,
                        startDate: new Date(date).addDays(1),
                       // timepicker:true,
                        format:'Y-m-d h:i',
                    });
                    
                    modal.on("crearCita", function(){
                        paciente= $("#motivo").val(),
                        allDay= $("#input_allDay").val(),
                        title= selPacienteN,
                        start= $("#start").val(),
                        end= $("#end").val(),
                        $("#start").val = toString(date.format())

                        var check = $("#notificar").is(':checked');



                        var dataCita = {
                            pacienteCurp :selPaciente,
                            title : selPacienteN ,
                            start :  $("#start").val(),
                            end : $("#end").val(),
                            description : $("#motivo").val(),
                            notificar : check,
                            emailpaciente : ctrl_agendaM.selP[0].username,
                            nombremedico : ctrl_medico.userData.info.nombrecompleto
                        }

                        $.ajax({
                            url: 'calendario/create_Evento',
                            data: {data : dataCita} ,
                            type: 'POST',
                            dataType: 'json',
                            success: function(response){
                                console.log(response);
                                if(response.message == 'Agregado'){
                                    
                                    console.log('agregado cita')
                                }
                                 $('#calendar').fullCalendar('refetchEvents');
                                $('.qtip-modal').qtip('hide');
                                createGrowl("Group info","Cita Capturada.",false,'bg_ok','guardando');
                                
                            },
                            error: function(e){
                                alert('Error procesando la llamada: '+e.responseText);
                            }
                        });
                        $('.qtip-modal').qtip('hide');
                    });
                    
                    modal.on("cancelarCita", function(){
                          $('.qtip-modal').qtip('hide');
                    });
                    //alert(ctrl_user.userInfo.data.username);
                    //$('#name').val(ctrl_user.userInfo.data.username);
                    $('#start').val(date.format());
                    $('#end').val(date.format());

                    
                    var comboSucursal = new dhtmlXComboFromSelect("paciente");
                    comboSucursal.enableFilteringMode('between');
                    //comboSucursal.enableAutocomplete();
                    comboSucursal.allowFreeText(false);
                    comboSucursal.attachEvent("onChange", function(value, text){
                           selPaciente = value
                           selPacienteN = text
                           ctrl_agendaM.selP = JSON.search(ctrl_agendaM.pacientes,"//*[curp='"+ value +"']")
                           
                      });
                    ctrl_agendaM.populate(comboSucursal);


                },
               
                
                eventResize: function(event, delta, revertFunc) {
                    console.log(event);
                    var title = event.title;
                    var end = event.end.format();
                    var start = event.start.format();
                    $.ajax({
                        url: 'calendario/update_Rango_Adm',
                        data: 'type=resetdate&title='+title+'&start='+start+'&end='+end+'&eventid='+event._id,  
                        type: 'POST',
                        dataType: 'json',
                        success: function(){		    				
                            $('#calendar').fullCalendar('refetchEvents');
                        },
                        error: function(e){		    			
                            revertFunc();
                            alert('Error processing your request: '+e.responseText);
                        }
                    });
                },
                eventDragStop: function (event, jsEvent, ui, view) {
                    /*if (isElemOverDiv()) {
                        var con = confirm('Desea eliminar la cita del paciente '+ event.title +' permanentemente?');
                        if(con === true) {
                            $.ajax({
                                url: 'calendario/delete_Evento',
                                data: 'type=remove&title='+event.title+'&eventid='+event._id,
                                type: 'POST',
                                    dataType: 'json',
                                success: function(response){
                                    console.log(response);
                                    //if(response.message == 'El evento se ha eliminado'){
                                        $('#calendar').fullCalendar('removeEvents', event._id);
                                        //simpleRefresh();
                                    //}
                                },
                                error: function(e){	
                                    alert('Error processing your request: '+e.responseText);
                                }
                            });
                        }   
                    }*/
                },
                    
                events:  {
            url: serverURL + '/calendario/read_calendarioMob?userid=' + userRoom ,
            error: function() 
            {
                alert("error");
            },
            success: function()
            {
                console.log("successfully loaded");
            }
        }
			});
		
		//Autocomplete Pacientes
	/*	$('#paciente').autocomplete({
			source: function(req, response){
				$.ajax({
					url: 'calendario/getPaciente',
					type: 'GET',
					dataType: 'json',
					data: 'termi =' + req.term,
					success: function(res){
						pacientes = [];
						for(var i=0; i<res.length; i++){
							if(res[i].info.nombre !== undefined){
								pacientes.push(res[i].info.nombre + " " + res[i].info.paterno + " " + res[i].info.materno);
							}
						}
						console.log(pacientes);
					}
				});
			},
			minLength: 2,
		});
		
        */
		ctrl_agendaM.rObj.on('selPaciente', function(event){
			console.log(event);
			$('#paciente').val(event.context);
			ctrl_agendaM.rObj.set('pacientes', []);
		});
		
        function isElemOverDiv() {
            var trashEl = jQuery('#trash');
    
            var ofs = trashEl.offset();
    
            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);
    
            if (currentMousePos.x >= x1 && currentMousePos.x <= x2 &&
                currentMousePos.y >= y1 && currentMousePos.y <= y2) {
                return true;
            }
            return false;
        }
        
        Date.prototype.addDays = function(days){
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        }
    }
};



window.createModal = function(html){
    $('#modal').qtip({
                    content: {
                        text: html,
                        //button : true
                    },
                    position: {
                         my: 'center', at: 'center',
                        target: $(window)
                    },
                    show: {
                        ready: true,
                        modal: {
                            on: true,
                            blur: false
                        }
                    },
                    hide: false,
                    style: {
                        classes: 'qtip-light qtip-shadow qtip-rounded qtip-modal',
                    },
                }); 
}

