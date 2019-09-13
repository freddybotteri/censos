class UsuarioListformController {
	constructor (usuarioService,notify,md5,toaster) {
		'ngInject';
		this.usuarioService = usuarioService
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.ListaUsuarios = {}
		this.ListaClientes = {}
		this.data= {
			user_id:0,
			user_nombre:"",
			user_usuario:"",
			user_password:"",
			user_sts:0,
			user_tipo:0,
			user_movil:"",
			cli_id:0,
			user_perfil:""
		}
		this.visible = false
		this.nombreUser = ""

		this.Listacensos = []
		this.Listaencuestas = []

		this.eleccionesCenso = {}
		this.eleccionesEnc = {}
		this.actualUser = ""
	}
	/*
		user_id
		user_nombre
		user_password
		user_sts
		user_tipo
		user_movil
		cli_id
		user_perfil
	*/

	$onInit() {
  		this.usuarioService.listaUsuario().then((data)=>{
			if(data.tipo = "ok"){
				console.log(data.data.data)
				this.ListaUsuarios = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los usuarios.')
			}
		})	
		this.usuarioService.FKClientes().then((data)=>{
			console.log(data.data)
			this.ListaClientes = data.data.data
		})
    }



    //funcion para traer todos los censos y encuestas de un cliente en especifico
    //mostrarlas y si ya esta algunas seleccionadas marcarlas.
    verEncuestasCensos(user){
    	this.nombreUser = user.user_nombre
    	this.actualUser = user.user_id
    	this.eleccionesEnc = {}
    	this.eleccionesCenso = {}


    	this.usuarioService.listaCensos(user.cli_id).then((data)=>{
			this.Listacensos = data.data.data
			for(let g in this.Listacensos){
				 this.Listacensos[g].check = 0
			}
				this.usuarioService.censoencuestaYaasignadas(user.user_id).then((data)=>{
					console.log(data.data.data)
					for(let r in this.Listacensos){
						this.Listacensos[r].check = 0
					}
					let that = this
						for(let ii in data.data.data){
							this.Listacensos.filter(function(item) {
								if(item.sen_id.toString().indexOf(data.data.data[ii].sen_id) > -1){
									item.check = 1
									that.eleccionesCenso[item.sen_id] = item.sen_id
								}else{
									if(item.check == 1 || item.check != null){
										if(item.check == null){
											item.check = 0
										}
									}else{
										item.check = 0
									}
								} 
							})
						}
				})
		})


		//=======================================0
		//      Division censo y encuesta		//
		//========================================


		this.usuarioService.listaEncuesta(user.cli_id).then((data)=>{
			this.Listaencuestas = data.data.data
			for(let enc in this.Listaencuestas){
				 this.Listaencuestas[enc].check = 0
			}
			this.usuarioService.censoencuestaYaasignadas(user.user_id).then((data)=>{
					for(let enc in this.Listaencuestas){
						this.Listaencuestas[enc].check = 0
					}
					let that = this
						for(let denc in data.data.data){
							this.Listaencuestas.filter(function(item) {
								if(item.enc_id.toString().indexOf(data.data.data[denc].enc_id) > -1){
									item.check = 1
									that.eleccionesEnc[item.enc_id] = item.enc_id
								}else{
									if(item.check == 1 || item.check != null){
										if(item.check == null){
											item.check = 0
										}
									}else{
										item.check = 0
									}
								} 
							})
						}
				})
		})
    }


    //metodos para guardar los censos y encuestas seleccionados
    //y mandarlos a guardar.
    eleccionCenso(censo){
		if(censo.sen_id in this.eleccionesCenso){
			delete this.eleccionesCenso[censo.sen_id] 
		}else{
			this.eleccionesCenso[censo.sen_id] =  censo.sen_id
		}
		console.log(this.eleccionesCenso)
		
	}
	eleccionEncuestas(encuesta){
		if(encuesta.enc_id in this.eleccionesEnc){
			delete this.eleccionesEnc[encuesta.enc_id] 
		}else{
			this.eleccionesEnc[encuesta.enc_id] =  encuesta.enc_id
		}
		
	}
	guardarcensosElegidos(){
		this.usuarioService.guardarEleccioncenso(this.eleccionesCenso,this.actualUser).then((data)=>{
			if(data.data.sts == 'ok'){
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
		})
	}
	guardarencuestasElegidas(){
		this.usuarioService.guardarEleccionencuesta(this.eleccionesEnc,this.actualUser).then((data)=>{
			if(data.data.sts == 'ok'){
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
		})
	}








    btnAgregar () {
    	let gusrLocalPass = this.data.tusuario_pass
    	if(this.data.user_password != ""){
    		this.data.user_password = this.md5.createHash(this.data.user_password || '')
    	}
		this.usuarioService.guardarUsuario(this.data).then((data)=>{	
			this.data.user_password = ""	
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let us in this.ListaUsuarios) { 
						if(this.ListaUsuarios[us].user_id == this.data.user_id){

							this.ListaUsuarios[us].user_id 		= 	this.data.user_id
							this.ListaUsuarios[us].user_nombre	= 	this.data.user_nombre
							this.ListaUsuarios[us].user_usuario	=	this.data.user_usuario
							this.ListaUsuarios[us].user_password= 	this.data.user_password
							this.ListaUsuarios[us].user_sts		= 	this.data.user_sts
							this.ListaUsuarios[us].user_tipo	= 	this.data.user_tipo
							this.ListaUsuarios[us].user_movil	=	this.data.user_movil
							this.ListaUsuarios[us].cli_id		=	this.data.cli_id
							this.ListaUsuarios[us].user_perfil	=	this.data.user_perfil
						}
					}	
				}else{
					this.ListaUsuarios.push({
							user_id			:data.data.datos.insertId,
							user_nombre		:this.data.user_nombre,
							user_usuario 	:this.data.user_usuario,
							user_password	:"",
							user_sts		:this.data.user_sts,
							user_tipo		:this.data.user_tipo,
							user_movil		:this.data.user_movil,
							cli_id			:this.data.cli_id,
							user_perfil		:this.data.user_perfil
					});	
					this.data.user_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de usuario.");
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
	updUsuario (usuario){
		this.visible = true
		this.data = {
			user_id		:usuario.user_id,
			user_nombre	:usuario.user_nombre,
			user_usuario:usuario.user_usuario,
			user_password:"",
			user_sts	:usuario.user_sts,
			user_tipo	:usuario.user_tipo,
			user_movil	:usuario.user_movil,
			cli_id		:usuario.cli_id,
			user_perfil	:usuario.user_perfil
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	CargaUser(){
		/*this.usuarioService.listaUsuario().success((data)=>{
			if(data.tipo = "ok"){
				this.ListaUsuarios = data.data
			}else{
				notify.show('ERROR: No se cargaron los usuarios.')
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}

	btnLimpiar (mainF) {
		this.data= {
			user_id:0,
			user_nombre:"",
			user_usuario:"",
			user_password:"",
			user_sts:0,
			user_tipo:0,
			user_movil:"",
			cli_id:"",
			user_perfil:""
		}
		this.nombreUser = ""
		mainF.$setPristine();
	}
}
export default UsuarioListformController
