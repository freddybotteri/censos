class corporativaListformController {
	constructor (corportivaService,$window,$timeout,notify,md5,toaster) {
		'ngInject';
		this.corportivaService = corportivaService
		this.notify = notify
		this.toaster = toaster
		this.$window = $window
		this.$timeout = $timeout
		this.md5 = md5
		this.Listacorporativas = {}
		this.ListaCliente = {}
		this.data= {
			corp_id			:0,
			corp_nombre		:"",
			corp_nomcorto	:"",
			corp_latitud	:"",
			corp_longitud	:"",
			corp_contacto	:"",
			corp_telefono	:"",
			corp_sts		:"",
			cli_id			:0
		}
		this.visible = false

		this.modal = ""

		this.latLng = {
			latitude: 15.5119,
			longitude: -88.0238
		};
	}
	/*
		corp_id
		corp_nombre
		corp_nomcorto
		corp_latitud
		corp_longitud
		corp_contacto
		corp_telefono
		corp_sts
		cli_id
	*/

	$onInit() {
  		this.corportivaService.listacorporativa().then((data)=>{
  			console.log(data.data.data)
			if(data.data.tipo = "ok"){
				this.Listacorporativas = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los corporativas.')
			}
		})

  		this.corportivaService.listaClientes().then((data)=>{
  			this.ListaCliente = data.data.data
		})



		this.latLng = {
			latitude: 15.5119,
			longitude: -88.0238
		};
		

		//funcion global para poder usarla en el controller de mapa.
		this.$window.mapReady = (map)=> {
				let that = this
				if(this.latLng.latitude != 0.0 && this.latLng.longitude != 0.0){
					this.$timeout(function(){
						document.getElementById('mapFrame').contentWindow.setLocationForm("cliente");
						document.getElementById('mapFrame').contentWindow.setMarker(0,that.latLng,'/img/clientes.png');
					}, 500);
				}
		};
		this.$window.onClickMap = (datos)=> {
				this.latLng.latitude = datos.lat();
				this.latLng.longitude = datos.lng();
				this.data.corp_longitud = datos.lng();
				this.data.corp_latitud = datos.lat();
				document.getElementById('mapFrame').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
		};

    }

    btnAgregar () {
		this.corportivaService.guardarcorporativa(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let corp in this.Listacorporativas) { 
						if(this.Listacorporativas[corp].corp_id == this.data.corp_id){							
							this.Listacorporativas[corp].corp_id		=	this.data.corp_id
							this.Listacorporativas[corp].corp_nombre	=	this.data.corp_nombre
							this.Listacorporativas[corp].corp_nomcorto	=	this.data.corp_nomcorto
							this.Listacorporativas[corp].corp_latitud	=	this.data.corp_latitud
							this.Listacorporativas[corp].corp_longitud	=	this.data.corp_longitud
							this.Listacorporativas[corp].corp_contacto	=	this.data.corp_contacto
							this.Listacorporativas[corp].corp_telefono	=	this.data.corp_telefono
							this.Listacorporativas[corp].corp_sts		=	this.data.corp_sts
							this.Listacorporativas[corp].cli_id			=	this.data.cli_id	
						}
					}	
				}else{
					this.Listacorporativas.push({
							corp_id			:data.data.datos.insertId,
							corp_nombre		:this.data.corp_nombre,
							corp_nomcorto	:this.data.corp_nomcorto,
							corp_latitud	:this.data.corp_latitud,
							corp_longitud	:this.data.corp_longitud,
							corp_contacto	:this.data.corp_contacto,
							corp_telefono	:this.data.corp_telefono,
							corp_sts		:this.data.corp_sts,
							cli_id			:this.data.cli_id
					});	
					this.data.corp_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de corporativa.");
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

	activeModal(){
		console.log("sdsdd")
		this.modal = "is-active"
		//document.getElementById('mapFrame').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
	}
	cerrarModal(){
		this.modal = ""
		console.log(this.data)
	}

	
	updcoperativa(corp){
		this.visible = true
		this.data = {
			corp_id			:corp.corp_id,
			corp_nombre		:corp.corp_nombre,
			corp_nomcorto	:corp.corp_nomcorto,
			corp_latitud	:corp.corp_latitud,
			corp_longitud	:corp.corp_longitud,
			corp_contacto	:corp.corp_contacto,
			corp_telefono	:corp.corp_telefono,
			corp_sts		:corp.corp_sts,
			cli_id			:corp.cli_id
		}//cli_sts			:parseInt(corporativa.cli_sts)
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargacorporativas(){
		/*this.corporativaService.listacorporativa().success((data)=>{
			if(data.tipo = "ok"){
				this.Listacorporativas = data.data
			}else{
				notify.show('ERROR: No se cargaron los corporativas.')
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}

	btnLimpiar (mainF) {
		this.data= {
			corp_id			:0,
			corp_nombre		:"",
			corp_nomcorto	:"",
			corp_latitud	:"",
			corp_longitud	:"",
			corp_contacto	:"",
			corp_telefono	:"",
			corp_sts		:"",
			cli_id			:0
		}
		mainF.$setPristine();
	}
}
export default corporativaListformController
