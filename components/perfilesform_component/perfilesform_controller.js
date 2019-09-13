class perfileForm{  
	//la viewusada esta en templates/perfilesform.pug
	constructor(perfilService,notify) {
		'ngInject'
		this.perfilService = perfilService;
		this.notify = notify
		this.data= {
			tperfil_id:0,
			tperfil_name:"",
			tperfil_descricion:"",
			tperfil_sts:1
		}
		this.ListaPerfiles = {}
		this.ListaOperaciones = {}
		this.asignarOperaciones = false
		this.OperacionesCheck = {}
		this.perfilIdAcual = 0
		this.visible = false
	};
	$onInit(){
	};

	btnAgregar (form){
		this.perfilService.guardarPerfil(this.data).success((data)=>{
			if(data.sts == 'ok'){
				if(data.datos.insertId == 0){
					for (let per in this.ListaPerfiles) { 
						if(this.ListaPerfiles[per].tperfil_id == this.data.tperfil_id){
							 this.ListaPerfiles[per].tperfil_name = this.data.tperfil_name
							 this.ListaPerfiles[per].tperfil_descricion = this.data.tperfil_descricion
							 this.ListaPerfiles[per].tperfil_sts = this.data.tperfil_sts
						}
					}	
				}else{
					this.ListaPerfiles.push({
	    				tperfil_id:data.datos.insertId,
						tperfil_name:this.data.tperfil_name,
						tperfil_descricion:this.data.tperfil_descricion,
						tperfil_sts:this.data.tperfil_sts
					});	
					this.data.tperfil_id = 	data.datos.insertId			
				}
				this.notify.show('GUARDADO EXITOSAMENTE...')
			}else if(data.sts == 'fail'){
				switch(data.erro.code){
					case 'ER_DUP_ENTRY':
						this.notify.show('ERROR:El nombre del perfil ya existe')
						break;
					default:
						this.notify.show('ERROR:Problema en el servidor.')
						break;
				}
			}
		}).catch((err)=>{
			console.log(err)
		})
	}

	CargaPerfiles (){
		this.perfilService.listaPerfiles().success((data)=>{
			if(data.tipo = "ok"){
				this.ListaPerfiles = data.data
			}else{
				notify.show('ERROR: No se cargaron los perfiles.')
			}
		}).catch((err)=>{
			console.log(err)
		})
	}
	updPerfil (perfil){
		this.visible = true
		this.data = {
			tperfil_id:perfil.tperfil_id,
			tperfil_name:perfil.tperfil_name,
			tperfil_descricion:perfil.tperfil_descricion,
			tperfil_sts:perfil.tperfil_sts
		}
	}
	mostrarForm(){
			this.visible = !this.visible
	}
	btnLimpiar (form) {
			this.data = {
				tperfil_id:0,
				tperfil_name:"",
				tperfil_descricion:"",
				tperfil_sts:1
			}
			form.$setPristine();
	}
	//al momento de asignarle operaciones a un perfil
	//se almacena el id de ese prfil
	//para utilizarleo al momento de guardar el detalla de perfil
	asigOperaciones (perfilId){
		this.perfilIdAcual = perfilId
		this.asignarOperaciones = !this.asignarOperaciones;
		this.perfilService.listaOperaciones().success((data)=>{
			if(data.tipo = "ok"){
				this.ListaOperaciones = data.data
			}else{
				notify.show('ERROR: No se cargaron los perfiles.')
			}
		}).catch((err)=>{
			console.log(err)
		})
	}
}
export default perfileForm