class sensoListformController {
	constructor (sensoService,notify,md5,toaster) {
		'ngInject';
		this.sensoService = sensoService
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listasensos = []
		this.Listaclientes = []
		this.data= {
			sen_id			:0,	
			cli_id			:0,
			sen_nombre		:"",
			sen_fechaIni	:new Date().toISOString(),
			sen_fechaFin	:new Date().toISOString(),
			sen_descrip		:"",
			sen_nameContac	:"",
			sen_puntos		:0,
			sen_sts			:0
		}
		this.visible = false
		this.eleccionesEnc = {}
		this.actualcenso = ""
		this.nombreCenso = ""



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
  		this.sensoService.listasenso().then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listasensos = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los sensos.')
			}
		})
		this.sensoService.listaClientes().then((data)=>{
			this.Listaclientes = data.data.data
		})
		//busco todas las encuestas y les pongo un check en false
		this.sensoService.listaEncuestas().then((data)=>{
			this.Listaencuestas = data.data.data
			for(let g in this.Listaencuestas){
				 this.Listaencuestas[g].check = 0
			}

		})
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







	verEncuestas(censo){
		//falta distinguir si esta o no para
		//ponerla marcada
		this.nombreCenso = censo.sen_nombre
		this.eleccionesEnc = {}
		this.actualcenso = censo.sen_id
		this.sensoService.encuestasYaasignadas(censo.sen_id).then((data)=>{
			//this.Listaencuestas = data.data.data
				console.log(data.data.data)
				for(let r in this.Listaencuestas){
					this.Listaencuestas[r].check = 0
				}
				let that = this
					for(let ii in data.data.data){
						this.Listaencuestas.filter(function(item) {
							if(item.enc_id.toString().indexOf(data.data.data[ii].enc_id) > -1){
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
	}
	eleccionEncuestas(encuesta){
		console.log(this.Listaencuestas)
		if(encuesta.enc_id in this.eleccionesEnc){
			delete this.eleccionesEnc[encuesta.enc_id] 
		}else{
			this.eleccionesEnc[encuesta.enc_id] =  encuesta.enc_id
		}
		
	}
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
		console.log(senso.sen_sts)
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
			sen_puntos		:0,
			sen_sts			:0
		}
		this.actualcenso = ""
		this.eleccionesEnc = {}
		this.nombreCenso = ""
		mainF.$setPristine();
	}
}
export default sensoListformController
