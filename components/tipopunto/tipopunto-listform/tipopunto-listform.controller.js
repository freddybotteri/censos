class tipopuntoListformController {
	constructor (tipopuntoService,notify,md5,toaster,$stateParams) {
		'ngInject';
		this.tipopuntoService = tipopuntoService
		this.notify = notify
		this.toaster = toaster
		this.$stateParams = $stateParams
		this.md5 = md5
		this.Listatipopuntos = []
		this.data= {
			tipp_id		:0,
			senso_id	:0,
			tipp_nombre	:"",
			tipp_descrip:"",
			tipp_sts	:""
		}
		this.visible = false
	}
	/*
		tipp_id
		senso_id
		tipp_nombre
		tipp_descrip
		tipp_sts
	*/

	$onInit() {
		this.idSenso = this.$stateParams.idSenso
		this.nameSenso =  this.$stateParams.senNom
  		this.tipopuntoService.listatipopunto(this.idSenso).then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listatipopuntos = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los tipopuntos.')
			}
		})
    }

    btnAgregar () {
    	this.data.senso_id = this.idSenso
		this.tipopuntoService.guardartipopunto(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let tp in this.Listatipopuntos) { 
						if(this.Listatipopuntos[tp].tipp_id == this.data.tipp_id){

							this.Listatipopuntos[tp].tipp_id		=this.data.tipp_id
							this.Listatipopuntos[tp].senso_id		=this.data.senso_id
							this.Listatipopuntos[tp].tipp_nombre	=this.data.tipp_nombre
							this.Listatipopuntos[tp].tipp_descrip	=this.data.tipp_descrip
							this.Listatipopuntos[tp].tipp_sts		=this.data.tipp_sts				
						}
					}	
				}else{
					this.Listatipopuntos.push({
							tipp_id			:data.data.datos.insertId,
							senso_id		:this.data.senso_id,
							tipp_nombre		:this.data.tipp_nombre,
							tipp_descrip	:this.data.tipp_descrip,
							tipp_sts		:this.data.tipp_sts
					});	
					this.data.tipp_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				console.log(data.data.erro)
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
	updtipopunto (tp){
		this.visible = true
		this.data = {
			tipp_id		:tp.tipp_id,
			senso_id	:tp.senso_id,
			tipp_nombre	:tp.tipp_nombre,
			tipp_descrip:tp.tipp_descrip,
			tipp_sts	:tp.tipp_sts
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargatipopuntos(){
		/*this.tipopuntoService.listatipopunto().success((data)=>{
			if(data.tipo = "ok"){
				this.Listatipopuntos = data.data
			}else{
				notify.show('ERROR: No se cargaron los tipopuntos.')
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}

	btnLimpiar (mainF) {
		this.data= {
			tipp_id		:0,
			senso_id	:0,
			tipp_nombre	:"",
			tipp_descrip:"",
			tipp_sts	:""
		}
		mainF.$setPristine();
	}
}
export default tipopuntoListformController
