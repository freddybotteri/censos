class preguntaListformController {
	constructor (preguntaService,notify,md5,toaster,$stateParams) {
		'ngInject';
		this.preguntaService = preguntaService
		this.notify = notify
		this.toaster = toaster
		this.$stateParams = $stateParams
		this.md5 = md5
		this.Listapreguntas = []
		this.ListaOpciones = {}
		this.textoOpcion = ""
		this.data= {
			preg_id		:0,
			enc_id		:"",
			preg_texto	:"",
			preg_tipo	:""
		}
		this.visible = false
	}
	/*
		preg_id
		enc_id
		preg_texto
		preg_tipo
	*/

	$onInit() {
		this.idEnc = this.$stateParams.idEnc
		this.nameEnc =  this.$stateParams.encNom

  		this.preguntaService.listapregunta(this.idEnc).then((data)=>{
			if(data.data.tipo = "ok"){
				this.Listapreguntas = data.data.data
			}else{
				notify.show('ERROR: No se cargaron los preguntas.')
			}
		})
    }
    AgregarOpcion(){
		this.ListaOpciones[this.textoOpcion] = this.textoOpcion
	}

	eliminarOpc(opc){
		delete this.ListaOpciones[opc]
	}
	updateOpc(opc){
		this.textoOpcion = opc
		delete this.ListaOpciones[opc]

	}

    btnAgregar () {
    	this.data.enc_id = this.idEnc
		this.preguntaService.guardarpregunta(this.data,this.ListaOpciones).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let pre in this.Listapreguntas) { 
						if(this.Listapreguntas[pre].preg_id == this.data.preg_id){

							this.Listapreguntas[pre].preg_id	= this.data.preg_id
							this.Listapreguntas[pre].enc_id		= this.data.enc_id
							this.Listapreguntas[pre].preg_texto	= this.data.preg_texto
							this.Listapreguntas[pre].preg_tipo	= this.data.preg_tipo					
						}
					}	
				}else{
					this.Listapreguntas.push({
						preg_id			:data.data.datos.insertId,
						enc_id			:this.data.enc_id,
						preg_texto		:this.data.preg_texto,
						preg_tipo		:this.data.preg_tipo
					});	
					this.data.preg_id = 	data.data.datos.insertId				
				}
				this.toaster.pop('success', "Datos Guardados", "Operacion realizada correctamente.");
			}else if(data.data.sts == 'fail'){
				switch(data.data.erro.code){
					case 'ER_DUP_ENTRY':
						this.toaster.pop('warning', "Datos duplicados", "Nombre de pregunta.");
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
	updpregunta (pregunta){
		this.visible = true
		this.data = {
			preg_id			:pregunta.preg_id,
			enc_id			:pregunta.enc_id,
			preg_texto		:pregunta.preg_texto,
			preg_tipo		:pregunta.preg_tipo
		}
		this.ListaOpciones = {}
	}
	cargaOpciones(){
		console.log("carga")
		if(this.data.preg_id != 0){
				this.preguntaService.listaopcionespre(this.data.preg_id).then((data)=>{
					if(data.data.tipo = "ok"){
						this.ListaOpciones = data.data.data
					}else{
						notify.show('ERROR: No se cargaron los preguntas.')
					}
				})
		}
			
	}
	mostrarForm(){
			this.visible = !this.visible
		}

	btnLimpiar (mainF) {
		this.data= {
			preg_id		:0,
			enc_id		:"",
			preg_texto	:"",
			preg_tipo	:""
		}
		this.ListaOpciones = {}
		mainF.$setPristine();
	}
}
export default preguntaListformController
