class encuestaListformController {
	constructor (encuestaService,notify,md5,toaster) {
		'ngInject';
		this.encuestaService = encuestaService
		
		this.notify = notify
		this.toaster = toaster
		this.md5 = md5
		this.Listaencuestas = []
		this.Listaclientes = []
		//para guardar las opciones de la pregunta
		this.ListaOpciones ={}
		this.textoOpcion = ""
		this.data= {
			enc_id			:0,
			enc_nombre		:"",
			enc_fechacre	:"",
			enc_cantquest	:"",
			cli_id			:0
		}
		this.visible = false
		this.modal = ""

		//variable usada para la seleccion de una encuesta 
		//al momento de importar sus preguntas
		this.encImpostar = ""
		this.ListaPreguntas = {}
		this.listasoloPregunta = {}
		this.listaPregImportadasSel = {}
		
	}
	/*
		enc_id
		enc_nombre
		enc_fechacre
		enc_cantquest
		cli_id
	*/
	importarPreguntas(){
		this.encuestaService.listaPreguntasImportar(this.encImpostar).then((data)=>{
			this.listasoloPregunta = {}
			this.ListaPreguntas = data.data.data
			for(let o in this.ListaPreguntas){
				if(!(this.ListaPreguntas[o].preg_id in this.listasoloPregunta)){
					this.listasoloPregunta[this.ListaPreguntas[o].preg_id] = this.ListaPreguntas[o]
				}
			}
		})
	}
	eleccionTipopunto(texto,tipo,idpre){
		let opcionesPregunta = {}
		if(texto in this.listaPregImportadasSel){
			delete this.listaPregImportadasSel[texto]
		}else{
			//busco las opciones de la pregunta seleccionada y las 
			//agrego a un json
			for(let opcion in this.ListaPreguntas){
				if(this.ListaPreguntas[opcion].preg_id == idpre && this.ListaPreguntas[opcion].oppre_id != null){
					opcionesPregunta[this.ListaPreguntas[opcion].oppre_id] = {oppre_texto:this.ListaPreguntas[opcion].oppre_texto,preg_id:this.ListaPreguntas[opcion].preg_id}
				}
			}
			this.listaPregImportadasSel[texto] = {texto:texto,tipo:tipo,preid:idpre,opciones:opcionesPregunta}
		}	
		console.log(this.listaPregImportadasSel)
	}
	eliminarImportacion(texto){
		delete this.listaPregImportadasSel[texto]
	}

	activeModal(){
		this.modal = "is-active"
		//document.getElementById('mapFrame').contentWindow.setMarker(0,this.latLng,'/img/clientes.png');
	}
	cerrarModal(){
		this.modal = ""
	}
	$onInit() {
  		this.encuestaService.listaencuesta().then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listaencuestas = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los encuestas.')
			}
		})
		this.encuestaService.listaClientes().then((data)=>{
			this.Listaclientes = data.data.data
		})
    }

    btnAgregar () {
		this.encuestaService.guardarencuesta(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let enc in this.Listaencuestas) { 
						if(this.Listaencuestas[enc].enc_id == this.data.enc_id){	

							this.Listaencuestas[enc].enc_id			= this.data.enc_id
							this.Listaencuestas[enc].enc_nombre		= this.data.enc_nombre
							this.Listaencuestas[enc].enc_fechacre	= this.data.enc_fechacre
							this.Listaencuestas[enc].enc_cantquest	= this.data.enc_cantquest
							this.Listaencuestas[enc].cli_id			= this.data.cli_id	
						}
					}	
				}else{
					this.Listaencuestas.push({
							enc_id			:data.data.datos.insertId,
							enc_nombre		:this.data.enc_nombre,
							enc_fechacre	:this.data.enc_fechacre,
							enc_cantquest	:this.data.enc_cantquest,
							cli_id			:this.data.cli_id
					});	
					this.data.enc_id = 	data.data.datos.insertId

					//SI el this.listaPregImportadasSel esta vacio no ejecuto la accion para guardar las preguntas
					if(Object.keys(this.listaPregImportadasSel).length != 0){
						this.encuestaService.guardarPreguntasImportadas(this.listaPregImportadasSel,data.data.datos.insertId).then((data)=>{
							console.log(data)
							if(data.data.sts = "ok"){
								console.log("Preguntas importadas")
							}else{
								notify.show('ERROR: No se importaron las preguntas.')
							}
						}).catch((err)=>{
							console.log(err)
						})
					}			
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de encuesta.");
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
	updencuesta (encuesta){
		this.visible = true
		this.data = {
			enc_id			:encuesta.enc_id,
			enc_nombre		:encuesta.enc_nombre,
			enc_fechacre	:encuesta.enc_fechacre,
			enc_cantquest	:encuesta.enc_cantquest,
			cli_id			:encuesta.cli_id,
		}

		this.ListaPreguntas = {}
		this.listaPregImportadasSel = {}
		this.listasoloPregunta = {}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	Cargaencuestas(){
		/*this.encuestaService.listaencuesta().success((data)=>{
			if(data.tipo = "ok"){
				this.Listaencuestas = data.data
			}else{
				notify.show('ERROR: No se cargaron los encuestas.')
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}

	btnLimpiar (mainF) {
		this.data= {
			enc_id			:0,
			enc_nombre		:"",
			enc_fechacre	:"",
			enc_cantquest	:"",
			cli_id			:0
		}
		this.ListaPreguntas = {}
		this.listaPregImportadasSel = {}
		this.listasoloPregunta = {}

		mainF.$setPristine();
	}
}
export default encuestaListformController
