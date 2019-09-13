class puntoListformController {
	constructor (puntoService,$window,$timeout,notify,md5,toaster,$stateParams) {
		'ngInject';
		this.puntoService = puntoService
		this.notify = notify
		this.toaster = toaster
		this.$window = $window
		this.$timeout = $timeout
		this.$stateParams = $stateParams
		this.md5 = md5
		this.Listapuntos = {}
		this.ListaSenso = {}
		this.ListaCorporacion = {}
		this.ListaTipopuntos = []

		this.ListaPais = []
		this.ListaDep  = []
		this.ListaMuni = []
		this.ListaPuCiu = []

		//para el modal de puntos del censo en mapa
		this.modalMapPuntos = ''

		this.data= {
			punto_id		:0,
			punto_nombre	:"",
			punto_contacto	:"",
			punto_longitud	:"",
			punto_latitud	:"",
			senso_id 		:0,
			corp_id 		:"",
			punto_fvalid	:"",
			punto_sts		:"",
			punto_supervisor:"",
			punto_pais		:"",
			punto_depart	:"",
			punto_municipio	:"",
			punto_ciudad	:"",
			ageo_id			:"",
		}
		this.visible = false

		this.modal = ""

		this.latLng = {
			latitude: 15.5119,
			longitude: -88.0238
		};

		this.TPselecciondos = {}
	}
	/*
		punto_id
		punto_nombre
		punto_contacto
		punto_longitud
		punto_latitud
		senso_id 
		corp_id 
		punto_fvalid
		punto_sts
		punto_supervisor


		punto_pais
		punto_depart
		punto_municipio
		punto_ciudad
		ageo_id


	*/

	$onInit() {
		this.idSenso = this.$stateParams.idSenso
		this.nameSenso =  this.$stateParams.senNom
		this.latLng = {
			latitude: 15.5119,
			longitude: -88.0238
		};
		this.toaster.pop('success', "hay cambios");
		//funcion global para poder usarla en el controller de mapa.
		this.$window.mapReady = (map)=> {
				let that = this
				if(this.latLng.latitude != 0.0 && this.latLng.longitude != 0.0){
					this.$timeout(function(){
						document.getElementById('mapFrame').contentWindow.setLocationForm("cliente");
						document.getElementById('mapFrame').contentWindow.setMarker(0,that.latLng,'/img/clientes.png');

						//document.getElementById('MapPuntos').contentWindow.setLocationForm("puntos");
						//document.getElementById('MapPuntos').contentWindow.setMarkerPuntos(-1,that.latLng,'/img/clientes.png');

					}, 500);
				}
		};
		this.$window.onClickMap = (datos)=> {
				this.latLng.latitude = datos.lat();
				this.latLng.longitude = datos.lng();
				this.data.punto_longitud = datos.lng();
				this.data.punto_latitud = datos.lat();
				document.getElementById('mapFrame').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
		};

  		this.puntoService.listapunto(this.idSenso).then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listapuntos = data.data.data
					for(let actpunto in this.Listapuntos){
						if(this.Listapuntos[actpunto].punto_latitud != undefined){
							let cordenadaspunto={
								latitude: parseFloat(this.Listapuntos[actpunto].punto_latitud),
								longitude: parseFloat(this.Listapuntos[actpunto].punto_longitud)
							}
							this.$timeout(function () {
							document.getElementById('MapPuntos').contentWindow.setMarkerPuntos(-1,cordenadaspunto,'/img/clientes.png',"");	
							}, 300);
						}			
					}
			}else{
				this.notify.show('ERROR: No se cargaron los puntos.')
			}
		})
		this.puntoService.listaTipoPunto(this.idSenso).then((data)=>{
			this.ListaTipopuntoLimpia = data.data.data
			this.ListaTipopuntos = data.data.data
		})

		this.puntoService.listaagrupaciongeo().then((data)=>{
			this.ListaAG = data.data.data
		})

		this.puntoService.listaPais('Pais').then((data)=>{
			this.ListaPais = data.data.data
		})

		//cargo las corporaciones que el cliente actual posee
		this.puntoService.listaCorporacion().then((data)=>{
			this.ListaCorporacion = data.data.data
		})
		
    }
	elegirDepartamento(){
		this.puntoService.listPadre(this.data.punto_pais).then((data)=>{
			this.ListaDep = data.data.data
		})
	}
	elegirMunicipio(){
		this.puntoService.listPadre(this.data.punto_depart).then((data)=>{
			this.ListaMuni = data.data.data
		})
	}
	elegirCiudad(){
		this.puntoService.listPadre(this.data.punto_municipio).then((data)=>{
			this.ListaPuCiu = data.data.data
		})
	}
    btnAgregar () {
    	console.log(this.data)
    	this.data.senso_id = this.idSenso
		this.puntoService.guardarpunto(this.data,this.TPselecciondos).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let pu in this.Listapuntos) { 
						if(this.Listapuntos[pu].punto_id == this.data.punto_id){

							this.Listapuntos[pu].punto_id		=	this.data.punto_id
							this.Listapuntos[pu].punto_nombre	=	this.data.punto_nombre
							this.Listapuntos[pu].punto_contacto	=	this.data.punto_contacto
							this.Listapuntos[pu].punto_longitud	=	this.data.punto_longitud
							this.Listapuntos[pu].punto_latitud	=	this.data.punto_latitud
							this.Listapuntos[pu].senso_id 		=	this.data.senso_id
							this.Listapuntos[pu].corp_id 		=	this.data.corp_id
							this.Listapuntos[pu].punto_fvalid	=	this.data.punto_fvalid
							this.Listapuntos[pu].punto_sts		=	this.data.punto_sts
							this.Listapuntos[pu].punto_supervisor=	this.data.punto_supervisor	

							this.Listapuntos[pu].punto_pais			=	this.data.punto_pais
							this.Listapuntos[pu].punto_depart		=	this.data.punto_depart
							this.Listapuntos[pu].punto_municipio	=	this.data.punto_municipio
							this.Listapuntos[pu].punto_ciudad		=	this.data.punto_ciudad
							this.Listapuntos[pu].ageo_id			=	this.data.ageo_id
						}
					}	
				}else{
					this.Listapuntos.push({
							punto_id			:data.data.datos.insertId,
							punto_nombre		:this.data.punto_nombre,
							punto_contacto		:this.data.punto_contacto,
							punto_longitud		:this.data.punto_longitud,
							punto_latitud		:this.data.punto_latitud,
							senso_id 			:this.data.senso_id,
							corp_id 			:this.data.corp_id,
							punto_fvalid		:this.data.punto_fvalid,
							punto_sts			:this.data.punto_sts,
							punto_supervisor	:this.data.punto_supervidor,
							punto_pais			:this.data.punto_pais,
							punto_depart		:this.data.punto_depart,
							punto_municipio		:this.data.punto_municipio,
							punto_ciudad		:this.data.punto_ciudad,
							ageo_id				:this.data.ageo_id
					});	
					this.data.punto_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de punto.");
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
	updpunto (punto){
		this.visible = true
		this.data = {
			punto_id		:punto.punto_id,
			punto_nombre	:punto.punto_nombre,
			punto_contacto	:punto.punto_contacto,
			punto_longitud	:punto.punto_longitud,
			punto_latitud	:punto.punto_latitud,
			senso_id 		:punto.senso_id,
			corp_id 		:punto.corp_id,
			punto_fvalid	:punto.punto_fvalid,
			punto_sts		:punto.punto_sts,
			punto_supervisor:punto.punto_supervisor,
			punto_pais		:punto.punto_pais,
			punto_depart	:punto.punto_depart,
			punto_municipio	:punto.punto_municipio,
			punto_ciudad	:punto.punto_ciudad,
			ageo_id			:punto.ageo_id,

		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargapuntos(){
	}
	eleccionTipopunto(id,name){
		if(id in this.TPselecciondos){
			delete this.TPselecciondos[id]
		}else{
			this.TPselecciondos[id] = name
		}
		if(Object.keys(this.TPselecciondos).length == 0){
			this.TPselecciondos[1] = 'Ninguno'
		}
	}
	activeModal(){
		console.log("active modal")
		this.modal = "is-active"
		//document.getElementById('mapFrame').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
	}
	cerrarModal(){
		this.modal = ""
	}
	activeModalTP(){
		for(let d in this.ListaTipopuntos){
			this.ListaTipopuntos[d].check = 0
		}
		this.TPselecciondos = {}
		console.log(this.ListaTipopuntos)
		if(this.data.punto_id != 0){
			this.puntoService.listaPuntosTipoYa(this.data.punto_id).then((data)=>{
				for(let i in data.data.data){
					if(data.data.data[i].tipp_id in this.TPselecciondos){
						delete this.TPselecciondos[i]
					}else{
						this.TPselecciondos[data.data.data[i].tipp_id] = 'name'
					}
				}
				//==============================================
				
					let that = this
					for(let ii in data.data.data){
						this.ListaTipopuntos.filter(function(item) {
							if(item.tipp_id.toString().indexOf(data.data.data[ii].tipp_id) > -1){
								item.check = 1
							}else{
								if(item.check == 1 || item.check != null){
									if(item.check == null){
										item.check == 0
									}
								}else{
									item.check = 0
								}
							} 
						})
					}
				//==============================================
			})
		}
		console.log(this.ListaTipopuntos)
		this.modalTP = "is-active"
	}
	cerrarModalTP(){
		this.modalTP = ""
	}

	abrirModalMapPuntos(){
		this.modalMapPuntos = "is-active"
		//this.$window.mapReady = (map)=> {}
	}
	cerrarModalMapPuntos(){
		this.modalMapPuntos = ""
	}

	btnLimpiar (mainF) {
		this.data= {
			punto_id		:0,
			punto_nombre	:"",
			punto_contacto	:"",
			punto_longitud	:"",
			punto_latitud	:"",
			senso_id 		:0,
			corp_id 		:null,
			punto_fvalid	:"",
			punto_sts		:"",
			punto_supervisor:"",
			punto_pais		:"",
			punto_depart	:"",
			punto_municipio	:"",
			punto_ciudad	:"",
			ageo_id			:"",
		}
		this.TPselecciondos = {}
		mainF.$setPristine();
	}
}
export default puntoListformController
