class geograficaListformController {
	constructor (geograficaService,notify,md5,toaster) {
		'ngInject';
		this.geograficaService = geograficaService
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listageograficas = []
		this.Listaclientes = []
		this.data= {
			ageo_id			:0,
			ageo_nombre		:"",
			ageo_descrip	:"",
			cli_id			:""
		}
		this.visible = false
	}
	/*
		ageo_id
		ageo_nombre
		ageo_descrip
		cli_id
	*/

	$onInit() {
		console.log("entro a geografica")
  		this.geograficaService.listageografica().then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listageograficas = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los geograficas.')
			}
		})
		this.geograficaService.listacliente().then((data)=>{
			this.Listaclientes = data.data.data
		})

    }

    btnAgregar () {
		this.geograficaService.guardargeografica(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let geo in this.Listageograficas) { 
						if(this.Listageograficas[geo].ageo_id == this.data.ageo_id){	

							this.Listageograficas[geo].ageo_id			= this.data.ageo_id
							this.Listageograficas[geo].ageo_nombre		= this.data.ageo_nombre
							this.Listageograficas[geo].ageo_descrip		= this.data.ageo_descrip
							this.Listageograficas[geo].cli_id			= this.data.cli_id		
						}
					}	
				}else{
					this.Listageograficas.push({
							ageo_id			:data.data.datos.insertId,
							ageo_nombre		:this.data.ageo_nombre,
							ageo_descrip	:this.data.ageo_descrip,
							cli_id			:this.data.cli_id
					});	
					this.data.user_id = 	data.data.datos.insertId				
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
	updageo (geo){
		this.visible = true
		this.data = {
			ageo_id			:geo.ageo_id,
			ageo_nombre		:geo.ageo_nombre,
			ageo_descrip	:geo.ageo_descrip,
			cli_id			:geo.cli_id
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargageograficas(){
		/*this.geograficaService.listageografica().success((data)=>{
			if(data.tipo = "ok"){
				this.Listageograficas = data.data
			}else{
				notify.show('ERROR: No se cargaron los geograficas.')
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}

	btnLimpiar (mainF) {
		this.data= {
			ageo_id			:0,
			ageo_nombre		:"",
			ageo_descrip	:"",
			cli_id			:""
		}
		mainF.$setPristine();
	}
}
export default geograficaListformController
