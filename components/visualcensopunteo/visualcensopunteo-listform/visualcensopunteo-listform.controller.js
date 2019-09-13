class visualcensopunteoListformController {
	constructor (sensoService,tabulacionAnalisisService,puntoService,$window,$timeout,notify,md5,toaster) {
		'ngInject';
		this.sensoService = sensoService
		this.puntoService = puntoService
		//this.googlechart = googlechart
		this.tabulacionAnalisisService = tabulacionAnalisisService
		this.$window = $window
		this.$timeout = $timeout
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listasensos = []
		this.Listaclientes = []
		this.Listapuntos = {}
		this.data= {
			sen_id			:0,	
			cli_id			:0,
			enc_id			:0,
			sen_nombre		:"",
			sen_fechaIni	:"",
			sen_fechaFin	:"",
			sen_descrip		:"",
			sen_nameContac	:"",
			sen_puntos		:"",
			sen_sts			:0
		}
		this.visible = false
		this.eleccionesEnc = {}
		this.actualcenso = ""
		this.nombreCenso = ""

		this.mostrartabdepreguntas = false
		this.verpreguntasabiertas = {}
		this.verpreguntascerradas = {}
		this.modalMapPuntos = ''
		this.graficaporpreg = ''
		this.preguntasid = {}//usada para almacenar el nombre y el ide de una pregunta
		this.color={
			selected:''
		}
		this.filtrarubicacion = ''//activar oh no el modal de filtro por ubicacion

		//variable para almacenar las preguntas respondidas de un punto y usarlas
		//para pintarlas en el popopup del marker
		this.preguntascerradasmarkets = {}


		this.labels = []
		this.series = []
		this.datagrafica =[] 


		this.loadingvertodo = 0
		this.loadingvercolorpunto = 0


		this.usandofiltroubcacion = 0
		this.datafiltro = {punto_pais:{},punto_depart:{},punto_municipio:{},punto_ciudad:{}}
		this.paisfiltro = {}
		this.departamentofiltro = {}
		this.municipiofiltro = {}
		this.aldeaciudadfiltro = {}

	}
	/*
		sen_id		
		cli_id
		sen_nombre
		sen_fechaIni
		sen_fechaFin
		sen_descrip
		sen_nameContac
		sen_puntos
		sen_sts
	*/

	$onInit() {
		//???????????????????????????????????

		this.labels = ['2006', '2007', '2008', '2009', '2010', '2011'];
		this.series = ['Series A', 'Series B'];

		this.datagrafica = [
			[65, 59, 80, 81, 56, 55],
			[28, 48, 40, 19, 86, 27]
		];

		this.coloresgra = ['#ff6384','#ff6384','#ff6384','#ff6384','#ff6384','#ff6384']
		//???????????????????????????????????
		this.latLng = {
			latitude: 15.5119,
			longitude: -88.0238
		};
		//funcion global para poder usarla en el controller de mapa.
		this.$window.mapReady = (map)=> {
				let that = this
				if(this.latLng.latitude != 0.0 && this.latLng.longitude != 0.0){
					this.$timeout(function(){
						//document.getElementById('MapPuntos').contentWindow.setLocationForm("cliente");
						document.getElementById('MapPuntosporpregunta').contentWindow.setMarker(0,that.latLng,'/img/clientes.png');

						document.getElementById('MapPuntosporpregunta').contentWindow.setLocationForm("puntos");
						//document.getElementById('MapPuntos').contentWindow.setMarkerPuntos(-1,that.latLng,'/img/clientes.png');

					}, 500);
				}
		};
		this.$window.onClickMap = (datos)=> {
				this.latLng.latitude = datos.lat();
				this.latLng.longitude = datos.lng();
				this.data.punto_longitud = datos.lng();
				this.data.punto_latitud = datos.lat();
				document.getElementById('MapPuntos').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
		};


  		this.sensoService.listasenso().then((data)=>{
			if(data.data.tipo = "ok"){
				//console.log(data.data.data)
				this.Listasensos = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los sensos.')
			}
		})
		this.sensoService.listaClientes().then((data)=>{
			this.Listaclientes = data.data.data
		})
		//busco todas las encuestas y les pongo un check en false
		// this.sensoService.listaEncuestas().then((data)=>{
		// 	this.Listaencuestas = data.data.data
		// 	for(let g in this.Listaencuestas){
		// 		 this.Listaencuestas[g].check = 0
		// 	}

		// })


    }

    btnVERPUNTOS (sensoid) {
    	//==================================================
		//      PARA PONER LOS PUNTOS EN EL MAPA
		//==================================================
		this.loadingvertodo = 1
		this.data.sen_nombre = sensoid.sen_nombre
		this.puntoService.listapunto(sensoid).then((data)=>{
			if(data.data.tipo = "ok"){
				document.getElementById('MapPuntosporpregunta').contentWindow.deleteMarkerPuntos();
				this.Listapuntos = data.data.data
				var that = this
				var contvep = 0
					// for(let actpunto in that.Listapuntos){
					// 	if(that.Listapuntos[actpunto].punto_latitud != undefined){
					// 		let cordenadaspunto={
					// 			latitude: parseFloat(that.Listapuntos[actpunto].punto_latitud),
					// 			longitude: parseFloat(that.Listapuntos[actpunto].punto_longitud)
					// 		}
					// 		this.$timeout(function () {
					// 		//document.getElementById('MapPuntosporpregunta').contentWindow.setMarkerPuntos(that.Listapuntos[actpunto].punto_id,cordenadaspunto,'/img/clientes.png','#2E64FE',that.Listapuntos[actpunto],{},{});	
							

					// 		}, 300);

					// 	}
					// 	contvep++
					// 	if(Object.keys(that.Listapuntos).length  == contvep){
					// 		this.loadingvertodo = 0	
					// 	}		
					// }
					document.getElementById('MapPuntosporpregunta').contentWindow.setMarkerPuntosv2(this.Listapuntos,{});
					this.loadingvertodo = 0	
			}else{
				this.notify.show('ERROR: No se cargaron los puntos.')
			}
		})
    }
    /*
	=============================================================================
					AACIONES EN LISTA DE ENCUESTAS DE UN CENSO
	=============================================================================
    */
    	btnVERENCUESTASCENSO (censo){
    		//==================================================
			//      PARA LISTAR LAS ENCUESTAS QUE TIENE UN CENSO
			//==================================================
			this.sensoService.encuestasYaasignadas(censo).then((data)=>{
					this.Listaencuestas = data.data.data
			})
    	}
    	btnVERPREGUNTAS (enc){
    		this.tabulacionAnalisisService.tabulacionAnalisis(enc).then((data)=>{
				if(data.data.tipo = "ok"){
					this.verpreguntascerradas = {}
					this.mostrartabdepreguntas = true
					//this.preguntascerradasmarkets = data.data.data.tododata
					//console.log(data)
					//this.verpreguntascerradas.length = 0
					//this.verpreguntascerradas = data.data.data.medmod[0]
					//recorro el array de preguntas 
					this.paisfiltro = data.data.data.pais
					this.departamentofiltro = data.data.data.departamento
					this.municipiofiltro = data.data.data.municipio
					this.aldeaciudadfiltro = data.data.data.aldeaciudad
					let pregc = data.data.data.medmod[0]
					for(let ore in pregc){
						if(!(ore in this.verpreguntascerradas)){
							this.verpreguntascerradas[ore] = {}
							for(let resp in pregc[ore]){
								//pregunta:{si:1,no:2}
								if(!(resp in this.verpreguntascerradas[ore])){
									this.verpreguntascerradas[ore][resp] = {resp:pregc[ore][resp],color:''}
								}
							}
						}
					}
					for(let r in data.data.data.cerradas){
						this.preguntasid[data.data.data.cerradas[r].preg_texto] = {preg_id:data.data.data.cerradas[r].preg_id,enc_id:enc}
					}
					
				}else{
					this.notify.show('ERROR: No se cargaron los tabulacionAnalisiss.')
				}
			})
    	}
    	cambiodecolor(resp,preg){
    		console.log("el creado",this.verpreguntascerradas[preg][resp].color)
    	}
    	abrirModalMapPuntos(preg_texto){

    		if(preg_texto in this.preguntasid){
    			//con el id de la pregunta y censo puedo ir a traer las respuestas de una pregunta y sus puntos
    			this.loadingvercolorpunto = 1
    			if(Object.keys(this.datafiltro.punto_pais).length != 0 || Object.keys(this.datafiltro.punto_depart).length != 0 || Object.keys(this.datafiltro.punto_municipio).length != 0 || Object.keys(this.datafiltro.punto_ciudad).length != 0){
    				this.usandofiltroubcacion = 1
    			}else{
    				this.usandofiltroubcacion = 0
    			}
    			let sqlfiltro = ''
    			for(let ji in this.datafiltro){
    				if(Object.keys(this.datafiltro[ji]).length != 0){
    					var incadena = '( '
    					for(let prey in this.datafiltro[ji]){
    							incadena += prey+','
    					}
    					incadena = incadena.substring(0,incadena.length-1)
    					sqlfiltro += 'AND  '+ji+' in '+incadena+' )'
    				}
    			}
    			//envio un parametro this.usandofiltroubcacion para saber si se estan usando filtros.
	    		this.tabulacionAnalisisService.listarrespuestapregpunto(this.preguntasid[preg_texto].enc_id,this.preguntasid[preg_texto].preg_id,this.usandofiltroubcacion,sqlfiltro).then((data)=>{
	    			if(data.data.tipo = "ok"){
						let colores = {}
						colores = this.verpreguntascerradas[preg_texto]

						//aqui viene los puntos con sus respuestas
						//console.log(data.data)
						this.preguntascerradasmarkets = data.data.tododata
						document.getElementById('MapPuntosporpregunta').contentWindow.deleteMarkerPuntos();

						var puntos = data.data.data
						document.getElementById('MapPuntosporpregunta').contentWindow.setMarkerPuntosv2(puntos,colores);
						var that = this

						var todos = this.preguntascerradasmarkets
						let listarespuestas = {}
						var contadorlis = 0
						for(let act in todos){
							if(!(todos[act].punto_id in listarespuestas)){
								listarespuestas[todos[act].punto_id] = {}
								listarespuestas[todos[act].punto_id][todos[act].resp_id] = {preg:todos[act].preg_texto,texto:todos[act].resp_texto}
							}else{
								listarespuestas[todos[act].punto_id][todos[act].resp_id] = {preg:todos[act].preg_texto,texto:todos[act].resp_texto}
							}
							contadorlis++
							//console.log(contadorlis,Object.keys(todos).length)
							if(Object.keys(todos).length  == contadorlis){
								//console.log('se fue')

								document.getElementById('MapPuntosporpregunta').contentWindow.setpreguntas(listarespuestas);
								this.loadingvercolorpunto = 0
							}
						}
							// for(let actpunto in puntos){
							// 	if(puntos[actpunto].punto_latitud != undefined){
							// 		//para saber que color es
							// 		let colormarket = ''
							// 		for(let co in colores){
							// 			if(puntos[actpunto].resp_texto == co){
							// 				colormarket = colores[co].color
							// 			}
							// 		}
							// 		let cordenadaspunto={
							// 			latitude: parseFloat(puntos[actpunto].punto_latitud),
							// 			longitude: parseFloat(puntos[actpunto].punto_longitud)
							// 		}
							// 		that.$timeout(function () {
							// 		document.getElementById('MapPuntosporpregunta').contentWindow.setMarkerPuntos(puntos[actpunto].punto_id,cordenadaspunto,'/img/clientes.png',colormarket,puntos[actpunto],{},listarespuestas[puntos[actpunto].punto_id]);	
							// 		}, 300);
							// 	}			
							// }
					}else{
						this.loadingvercolorpunto = 0
						this.notify.show('ERROR: No se cargaron los tabulacionAnalisiss.')
					}
				})
				//this.modalMapPuntos = "is-active"
	    	}else{
	    		console.log("no esta esa pregunta")
	    		this.notify.show('ERROR: No esta la pregunta')
	    	}
			//this.$window.mapReady = (map)=> {}
		}
		verrespuestasdepunto(){

		}
		cerrarModalMapPuntos(){
			this.modalMapPuntos = ""
		}

		btnVERGRAFICAPORPREGUNTA(preg_texto){
			this.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
			this.series = ['Series A', 'Series B'];

			this.datagrafica = [
				[65, 59, 80, 81, 56, 55, 40],
				[28, 48, 40, 19, 86, 27, 90]
			];
			this.coloresgra = ['#ff6384','#ff6384','#ff6384','#ff6384','#ff6384','#ff6384']

			// this.series.splice(0)
			// this.labels.splice(0)
			// this.datagrafica.splice(0)
			// this.series = []
			// this.labels = []
			// this.datagrafica = []

			/*compruebo si hay filtros
			y si existen hago una consulta con ellos 
			sino trabajo con los datos que ya estan en memoria*/
			if(Object.keys(this.datafiltro.punto_pais).length != 0 || Object.keys(this.datafiltro.punto_depart).length != 0 || Object.keys(this.datafiltro.punto_municipio).length != 0 || Object.keys(this.datafiltro.punto_ciudad).length != 0){
				this.usandofiltroubcacion = 1
			}else{
				this.usandofiltroubcacion = 0
			}
			if(this.usandofiltroubcacion == 1){
				let sqlfiltro = ''
				for(let ji in this.datafiltro){
					if(Object.keys(this.datafiltro[ji]).length != 0){
						var incadena = '( '
						for(let prey in this.datafiltro[ji]){
								incadena += prey+','
						}
						incadena = incadena.substring(0,incadena.length-1)
						sqlfiltro += 'AND  '+ji+' in '+incadena+' )'
					}
				}

				//consulta especifica con filtros
				this.tabulacionAnalisisService.listarcerradasgrafica(this.data.enc_id,preg_texto,sqlfiltro).then((data)=>{
					//console.log(data.data.data[0][preg_texto]);
					let datos = data.data.data[0][preg_texto]
					this.series.length = 0
					this.labels.length = 0
					this.datagrafica.length = 0
					this.coloresgra.length = 0
					let suma = 0
					for(let re in datos){
						suma+= Number(datos[re])
					}
					for(let respuesta in datos){
						//console.log(this.series,parseInt(((Number(datos[respuesta])*100)/suma).toFixed(2)))
						this.coloresgra.push(this.verpreguntascerradas[preg_texto][respuesta].color)
						this.series.push(respuesta)
						this.labels.push(respuesta +' - '+datos[respuesta]+'  '+parseInt(((Number(datos[respuesta])*100)/suma).toFixed(2))+'%' )
						this.datagrafica.push(parseInt(datos[respuesta]))
					}
					//console.log(this.coloresgra)
					this.graficaporpreg = "active"
				})

			}else{

				if(preg_texto in this.verpreguntascerradas){
					let datos = this.verpreguntascerradas[preg_texto]
					this.series.length = 0
					this.labels.length = 0
					this.datagrafica.length = 0
					this.coloresgra.length = 0
					let suma = 0
					for(let re in datos){
						suma+= Number(datos[re].resp)
					}
					for(let respuesta in datos){
						//console.log(this.series,parseInt(((Number(datos[respuesta].resp)*100)/suma).toFixed(2)))
						this.coloresgra.push(this.verpreguntascerradas[preg_texto][respuesta].color)
						this.series.push(respuesta)
						this.labels.push(respuesta +' - '+datos[respuesta].resp+'  '+parseInt(((Number(datos[respuesta].resp)*100)/suma).toFixed(2))+'%' )
						this.datagrafica.push(parseInt(datos[respuesta].resp))
					}
					//console.log(this.coloresgra)
					this.graficaporpreg = "active"
				}


			}
			




			

			
		}

		cerrarModalpreguntasgrafica(){
			this.graficaporpreg = ""
		}
		/*==============================================================
					MODAL FILTRO UBICACION
		================================================================*/
		btnfiltrarporubicacionopenmodal(){
			this.filtrarubicacion = "active"

		}
		cerrarModalfiltrarubicacion(){
			this.filtrarubicacion = ""
		}
		cerrarModalfiltrarubicacionguardar(){
			// var that = this
			// this.datafiltro.pais = Object.keys(that.datafiltro.pais).map(function(ubi) { return that.datafiltro.pais[ubi]; })
			// this.datafiltro.depar = Object.keys(that.datafiltro.depar).map(function(ubi) { return that.datafiltro.depar[ubi]; })
			// this.datafiltro.munic = Object.keys(that.datafiltro.munic).map(function(ubi) { return that.datafiltro.munic[ubi]; })
			// this.datafiltro.aldpue = Object.keys(that.datafiltro.aldpue).map(function(ubi) { return that.datafiltro.aldpue[ubi]; })
		}
		selectpais(pais){
			if(pais in this.datafiltro.punto_pais){
				delete this.datafiltro.punto_pais[pais]
				
			}else{
				this.datafiltro.punto_pais[pais] = pais
				
			}
		}
		selectdepartamento(depart){
			if(depart in this.datafiltro.punto_depart){
				delete this.datafiltro.punto_depart[depart]
				
			}else{
				this.datafiltro.punto_depart[depart] = depart
				
			}
		}
		selectmunicipio(muni){
			if(muni in this.datafiltro.punto_municipio){
				delete this.datafiltro.punto_municipio[muni]
				
			}else{
				this.datafiltro.punto_municipio[muni] = muni
				
			}
		}
		selectaldeaciudad(aldpueblo){
			if(aldpueblo in this.datafiltro.punto_ciudad){
				delete this.datafiltro.punto_ciudad[aldpueblo]
				
			}else{
				this.datafiltro.punto_ciudad[aldpueblo] = aldpueblo
				
			}
		}
		

    btnAgregar () {
		this.sensoService.guardarsenso(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let sen in this.Listasensos) { 
						if(this.Listasensos[sen].sen_id == this.data.sen_id){		

							this.Listasensos[sen].sen_id			=this.data.sen_id
							this.Listasensos[sen].cli_id			=this.data.cli_id
							this.Listasensos[sen].sen_nombre		=this.data.sen_nombre
							this.Listasensos[sen].sen_fechaIni		=this.data.sen_fechaIni
							this.Listasensos[sen].sen_fechaFin		=this.data.sen_fechaFin
							this.Listasensos[sen].sen_descrip		=this.data.sen_descrip
							this.Listasensos[sen].sen_nameContac	=this.data.sen_nameContac
							this.Listasensos[sen].sen_puntos		=this.data.sen_puntos
							this.Listasensos[sen].sen_sts			=this.data.sen_sts
						}
					}	
				}else{
					this.Listasensos.push({
							sen_id			:data.data.datos.insertId,	
							cli_id			:this.data.cli_id,
							sen_nombre		:this.data.sen_nombre,
							sen_fechaIni	:this.data.sen_fechaIni,
							sen_fechaFin	:this.data.sen_fechaFin,
							sen_descrip		:this.data.sen_descrip,
							sen_nameContac	:this.data.sen_nameContac,
							sen_puntos		:this.data.sen_puntos,
							sen_sts			:this.data.sen_sts
					});	
					this.data.sen_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de senso.");
						break;
					default:
						this.toaster.pop('error', "ERROR", "Problema en el servidor");
						break;
				}
			}
		}).catch((err)=>{
			console.log(err)
		})
	}







	// verEncuestas(censo){
	// 	//falta distinguir si esta o no para
	// 	//ponerla marcada
	// 	this.nombreCenso = censo.sen_nombre
	// 	this.eleccionesEnc = {}
	// 	this.actualcenso = censo.sen_id
	// 	this.sensoService.encuestasYaasignadas(censo.sen_id).then((data)=>{
	// 		//this.Listaencuestas = data.data.data
	// 			console.log(data.data.data)
	// 			for(let r in this.Listaencuestas){
	// 				this.Listaencuestas[r].check = 0
	// 			}
	// 			let that = this
	// 				for(let ii in data.data.data){
	// 					this.Listaencuestas.filter(function(item) {
	// 						if(item.enc_id.toString().indexOf(data.data.data[ii].enc_id) > -1){
	// 							item.check = 1
	// 							that.eleccionesEnc[item.enc_id] = item.enc_id
	// 						}else{
	// 							if(item.check == 1 || item.check != null){
	// 								if(item.check == null){
	// 									item.check = 0
	// 								}
	// 							}else{
	// 								item.check = 0
	// 							}
	// 						} 
	// 					})
	// 				}
	// 	})
	// }
	// eleccionEncuestas(encuesta){
	// 	console.log(this.Listaencuestas)
	// 	if(encuesta.enc_id in this.eleccionesEnc){
	// 		delete this.eleccionesEnc[encuesta.enc_id] 
	// 	}else{
	// 		this.eleccionesEnc[encuesta.enc_id] =  encuesta.enc_id
	// 	}
		
	// }
	guardarEnCen(){
		this.sensoService.guardarEleccionencen(this.eleccionesEnc,this.actualcenso).then((data)=>{
			if(data.data.sts == 'ok'){
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de senso.");
						break;
					default:
						this.toaster.pop('error', "ERROR", "Problema en el servidor");
						break;
				}
			}
		})
	}






	updsenso (senso){
		//console.log(senso.sen_sts)
		this.visible = true
		this.data = {
			sen_id			:senso.sen_id,	
			cli_id			:senso.cli_id,
			sen_nombre		:senso.sen_nombre,
			sen_fechaIni	:senso.sen_fechaIni,
			sen_fechaFin	:senso.sen_fechaFin,
			sen_descrip		:senso.sen_descrip,
			sen_nameContac	:senso.sen_nameContac,
			sen_puntos		:senso.sen_puntos,
			sen_sts			:senso.sen_sts
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargasensos(){

	}

	btnLimpiar (mainF) {
		this.data= {
			sen_id			:0,	
			cli_id			:0,
			sen_nombre		:"",
			sen_fechaIni	:"",
			sen_fechaFin	:"",
			sen_descrip		:"",
			sen_nameContac	:"",
			sen_puntos		:"",
			sen_sts			:0
		}
		this.actualcenso = ""
		this.eleccionesEnc = {}
		this.nombreCenso = ""
		mainF.$setPristine();
	}
}
export default visualcensopunteoListformController
