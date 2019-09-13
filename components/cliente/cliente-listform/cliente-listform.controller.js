class clienteListformController {
	constructor (clienteService,notify,md5,toaster) {
		'ngInject';
		this.clienteService = clienteService
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listaclientes = {}
		this.data= {
			cli_id		:0,
			cli_nombre	:"",
			cli_nomcorto:"",
			cli_telefono:"",
			cli_direccion:"",
			cli_secretkey:"",
			cli_sts:""
		}
		this.visible = false
	}
	/*
		  cli_id
		  cli_nombre
		  cli_nomcorto
		  cli_telefono
		  cli_direccion
		  cli_sts
	*/

	$onInit() {
  		this.clienteService.listacliente().then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listaclientes = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los clientes.')
			}
		})

    }

    btnAgregar () {
		this.clienteService.guardarcliente(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let cli in this.Listaclientes) { 
						if(this.Listaclientes[cli].cli_id == this.data.cli_id){

							this.Listaclientes[cli].cli_id			=	this.data.cli_id 							
							this.Listaclientes[cli].cli_nombre		=	this.data.cli_nombre
							this.Listaclientes[cli].cli_nomcorto	=	this.data.cli_nomcorto
							this.Listaclientes[cli].cli_telefono	=	this.data.cli_telefono
							this.Listaclientes[cli].cli_direccion	=	this.data.cli_direccion
							this.Listaclientes[cli].cli_secretkey  	= 	this.data.cli_secretkey
							this.Listaclientes[cli].cli_sts			=	this.data.cli_sts						
						}
					}	
				}else{
					this.Listaclientes.push({
							cli_id			:data.data.datos.insertId,
							cli_nombre		:this.data.cli_nombre,
							cli_nomcorto	:this.data.cli_nomcorto,
							cli_telefono	:this.data.cli_telefono,
							cli_direccion	:this.data.cli_direccion,
							cli_secretkey	:this.data.cli_secretkey,
							cli_sts			:this.data.cli_sts
					});	
					this.data.user_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de cliente.");
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
	updCliente (cliente){
		this.visible = true
		this.data = {
			cli_id			:cliente.cli_id,
			cli_nombre		:cliente.cli_nombre,
			cli_nomcorto	:cliente.cli_nomcorto,
			cli_telefono	:cliente.cli_telefono,
			cli_direccion	:cliente.cli_direccion,
			cli_secretkey	:cliente.cli_secretkey,
			cli_sts			:parseInt(cliente.cli_sts)
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	CargaClientes(){
	}

	btnLimpiar (mainF) {
		this.data= {
			cli_id		:0,
			cli_nombre	:"",
			cli_nomcorto:"",
			cli_telefono:"",
			cli_direccion:"",
			cli_secretkey:"",
			cli_sts:0
		}
		mainF.$setPristine();
	}
}
export default clienteListformController
