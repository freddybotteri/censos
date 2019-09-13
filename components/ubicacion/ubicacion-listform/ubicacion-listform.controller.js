class ubicacionListformController {
	constructor (ubicacionService,notify,md5,toaster) {
		'ngInject';
		this.ubicacionService = ubicacionService
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listaubicacion = []
		this.ListaClientes = []
		this.ListaUbicacionPadre = []
		this.data= {
			ubi_id		:0,
			ubi_nombre	:"",
			ubi_tipo	:"",
			ubi_padre	:"",
			ubi_valor1	:"",
			cli_id		:0
		}
		this.visible = false
	}
	/*
		ubi_id
		ubi_nombre
		ubi_tipo
		ubi_padre
		ubi_valor1
		cli_id
	*/

	$onInit() {
  		this.ubicacionService.listaubicacion().then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listaubicacion = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los ubicacions.')
			}
		})
		this.ubicacionService.listacliente().then((data)=>{
			this.ListaClientes  = data.data.data
		})

    }

    btnAgregar () {
    	if(this.data.cli_id == 0 || this.data.cli_id == undefined ){
    		this.data.cli_id = 0
    	}
    	
		this.ubicacionService.guardarubicacion(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let ub in this.Listaubicacion) { 
						if(this.Listaubicacion[ub].ubi_id == this.data.ubi_id){
	
							this.Listaubicacion[ub].ubi_id		=	this.data.ubi_id
							this.Listaubicacion[ub].ubi_nombre	=	this.data.ubi_nombre
							this.Listaubicacion[ub].ubi_tipo	=	this.data.ubi_tipo
							this.Listaubicacion[ub].ubi_padre	=	this.data.ubi_padre
							this.Listaubicacion[ub].ubi_valor1	=	this.data.ubi_valor1
							this.Listaubicacion[ub].cli_id		=	parseInt(this.data.cli_id)			
						}
					}	
				}else{
					this.Listaubicacion.push({
							ubi_id			:data.data.datos.insertId,
							ubi_nombre		:this.data.ubi_nombre,
							ubi_tipo		:this.data.ubi_tipo,
							ubi_padre		:this.data.ubi_padre,
							ubi_valor1		:this.data.ubi_valor1,
							cli_id			:parseInt(this.data.cli_id)
					});	
					this.data.ubi_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "");
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
	updubicacion (ub){
		this.visible = true
		this.data = {
			ubi_id		:ub.ubi_id,
			ubi_nombre	:ub.ubi_nombre,
			ubi_tipo	:ub.ubi_tipo,
			ubi_padre	:ub.ubi_padre,
			ubi_valor1	:ub.ubi_valor1,
			cli_id		:ub.cli_id
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargaubicacions(){
		if(this.data.ubi_tipo == 'Pais'){
			this.ListaUbicacionPadre = {}
		}else{
			let tipoUbicacion = ''
			switch(this.data.ubi_tipo){
				case 'Departamento':
					tipoUbicacion = 'Pais'
					break;
				case 'Municipio':
					tipoUbicacion = 'Departamento'
					break;
				case 'Pueblociudad':
					tipoUbicacion = 'Municipio'
					break;
			}
			if(tipoUbicacion != ''){
				this.ubicacionService.listaubicacionPadre(tipoUbicacion).then((data)=>{
					if(data.data.tipo = "ok"){
						this.ListaUbicacionPadre = data.data.data
						for(let num in this.ListaUbicacionPadre){
							this.ListaUbicacionPadre[num].nombreVista = tipoUbicacion +' '+ this.ListaUbicacionPadre[num].ubi_nombre
						}


					}else{
						this.toaster.pop('error', "ERROR", "Carga segun tipo");
					}
				}).catch((err)=>{
					console.log(err)
				})
			}else{
				
			}
			
		}
	
	}

	btnLimpiar (mainF) {
		this.data= {
			ubi_id		:0,
			ubi_nombre	:"",
			ubi_tipo	:"",
			ubi_padre	:"",
			ubi_valor1	:"",
			cli_id		:""
		}
		mainF.$setPristine();
	}
}
export default ubicacionListformController
