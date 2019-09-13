class tabulacionAnalisisListformController {
	constructor (tabulacionAnalisisService,puntoService,notify,toaster,$stateParams) {
		'ngInject';
		

		this.tabulacionAnalisisService = tabulacionAnalisisService
		this.puntoService = puntoService
		this.notify = notify
		this.toaster = toaster
		this.$stateParams = $stateParams
		this.ListatabulacionAnalisis = {}
		/*this.data= {
			cli_id		:0,
			cli_nombre	:"",
			cli_nomcorto:"",
			cli_telefono:"",
			cli_direccion:"",
			cli_secretkey:"",
			cli_sts:""
		}*/
		this.visible = false


		this.listacerrada = {}
		this.listaabiertos = {}
		this.agrupacionBuscar=0
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
		this.idEnc = this.$stateParams.idEnc
		this.nameEnc =  this.$stateParams.encNom
		this.cargaAgrupacionesGeograficas()
    }

    cargaAgrupacionesGeograficas(){
		this.puntoService.listaagrupaciongeo().then((data)=>{
			this.ListaAgrupacion = data.data.data
		})
	}
	//al momento de escoger una ubucacion geografica filtro en respuestas por enc y ageoid
	filtroAgeografica(idGeo){
		this.tabulacionAnalisisService.tabulacionAnalisisFiltrado(this.idEnc,idGeo).then((data)=>{
			this.ListatabulacionAnalisis = {}
			this.listaabiertos = {}
    		this.listacerrada = {}
			if(data.data.tipo = "ok"){
				this.ListatabulacionAnalisis = data.data.data
				this.mostrarDatosTabuladosCerrados()
				this.mostrarMedia(data.data.data['medmod'])
				this.mostrarModa(data.data.data['medmod'])
			}else{
				notify.show('ERROR: No se cargaron los tabulacionAnalisiss.')
			}
		})
	}
	cargaTodos(){
		this.agrupacionBuscar = 0
		this.tabulacionAnalisisService.tabulacionAnalisis(this.idEnc).then((data)=>{
			if(data.data.tipo = "ok"){
				this.ListatabulacionAnalisis = data.data.data
				
				this.mostrarDatosTabuladosCerrados()
				this.mostrarMedia(data.data.data['medmod'])
				this.mostrarModa(data.data.data['medmod'])
				//this.mostrarMediana(data.data.data['medmod'])
			}else{
				notify.show('ERROR: No se cargaron los tabulacionAnalisiss.')
			}
		})
	}
	mostrarMedia(arreglo){
		//debo agregar a nivel de pregunta la moda y la media this.listacerrada
		let total = 0
		let jsonMedia = {}
		for(let arr in arreglo[0]){
			total = 0
			for(let op in arreglo[0][arr]){
				total += arreglo[0][arr][op]
				
			}
			//jsonMedia[arr] = (total / Object.keys(arreglo[0][arr]).length)
			for(let pre in this.listacerrada){
				if(arr == this.listacerrada[pre].pregunta){
					this.listacerrada[pre].media = (total / Object.keys(arreglo[0][arr]).length).toFixed(2)
				}	
			}

		}
	}
	mostrarModa(arreglo){
		//hay que ordenar de mayor a menor
		var counts = {};
		let numero = 0
		let json = {}
		for(let co in arreglo[0])
		{
			counts = {}
			for(let op in arreglo[0][co]){
				var key = arreglo[0][co][op];
				numero = (counts[key])? counts[key] + 1 : 1 ;
				counts[key] = numero
			}
			//1ra vez = {1: 2, 3: 1}
			//2da vez = {1: 1, 4: 1}
				json = {}
				json[co] = Object.keys(counts).sort( function(a,b) {
					return counts[b] - counts[a];
				})
				//jsonMedia[arr] = (total / Object.keys(arreglo[0][arr]).length)
				for(let pre in this.listacerrada){
					if(co == this.listacerrada[pre].pregunta){
						//busco si ademas del 0 el 1 es igual al 0
						let modaNum = []
						let inicio = 0
						modaNum.push(json[co][0])
						let contador = 0
						for(let y in json){	
							for(let moda = 0; moda < json[y].length;moda++){
								if(counts[json[y][0]] == counts[json[y][moda + 1]]){
									modaNum.push(json[y][moda + 1])
								}
								contador++
							}
							//si el primero tiene la misma cantidad que el segundo,tercero,cuarto
						}
						//ahora cuento cuantos componen la moda, si son dos lo sumo y divido
						//si son mas de dos solo los concateno.
						let cadenaModa = ""
						let suma = 0
						if(modaNum.length > 2){
							for(let i = 0; i < modaNum.length;i++){
								cadenaModa += modaNum[i]
							}
							this.listacerrada[pre].moda = cadenaModa
							//esta validacion se hace por las condiciones al medir una moda
						}else if(modaNum.length == 2){

							if(Object.keys(counts).length == 2){
								this.listacerrada[pre].moda = "No existe moda"
							}else{
								for(let i = 0; i < modaNum.length;i++){
									suma += parseInt(modaNum[i])
								}
								suma = (parseInt(suma)/2)
								this.listacerrada[pre].moda = suma
							}	
						}else{
							this.listacerrada[pre].moda = json[co][0]
						}
						//this.listacerrada[pre].moda = json[co][0]
					}	
				}
		}
		/*
		for(let arr in arreglo[0]){
			
		}*/
	}
	mostrarMediana(arreglo){
		//saco el total y lo dibujo entre dos, luego veo el que esta antes si es igual y el siguiente.
		for(let arr in arreglo[0]){
			let ordenado = []

			/*for(let op in arreglo[0][arr]){
				console.log(arreglo[0][arr][op])
			}*/
			let aux = 0
			for(let op in arreglo[0][arr]){
				for(let j in arreglo[0][arr]){
					if(arreglo[0][arr][j] > arreglo[0][arr][j+1]){
						aux=arreglo[0][arr][j];
						arreglo[0][arr][j]=arreglo[0][arr][j+1];
						arreglo[0][arr][j+1]=aux;
					}
				}
			}


		}
	}
    mostrarDatosTabuladosAbiertos(){

    	this.listaabiertos = this.ListatabulacionAnalisis['abiertas']
    }

    mostrarDatosTabuladosCerrados(){
    	
    	for(let res in this.ListatabulacionAnalisis['cerradas']){
    		if(!(this.ListatabulacionAnalisis['cerradas'][res].preg_texto in this.listacerrada)){
    			this.listacerrada[this.ListatabulacionAnalisis['cerradas'][res].preg_texto] = {media:0,moda:0,mediana:0,pregunta:this.ListatabulacionAnalisis['cerradas'][res].preg_texto,respuestas:{}}
    		}
    		//this.listacerrada[this.ListatabulacionAnalisis['cerradas'][res].preg_texto][this.ListatabulacionAnalisis['cerradas'][res].resp_texto].respuestas
    		this.listacerrada[this.ListatabulacionAnalisis['cerradas'][res].preg_texto].respuestas[this.ListatabulacionAnalisis['cerradas'][res].resp_texto] = {
																										titulo:this.ListatabulacionAnalisis['cerradas'][res].resp_texto,
																										contestada:this.ListatabulacionAnalisis['cerradas'][res].contestadas
																									}
    																																				
    	}
    }
    btnAgregar () {
		/*this.tabulacionAnalisisService.guardartabulacionAnalisis(this.data).then((data)=>{		
			if(data.data.sts == 'ok'){
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.data.datos.insertId == 0){
					for (let cli in this.ListatabulacionAnalisiss) { 
						if(this.ListatabulacionAnalisiss[cli].cli_id == this.data.cli_id){

							this.ListatabulacionAnalisiss[cli].cli_id			=	this.data.cli_id 							
							this.ListatabulacionAnalisiss[cli].cli_nombre		=	this.data.cli_nombre
							this.ListatabulacionAnalisiss[cli].cli_nomcorto	=	this.data.cli_nomcorto
							this.ListatabulacionAnalisiss[cli].cli_telefono	=	this.data.cli_telefono
							this.ListatabulacionAnalisiss[cli].cli_direccion	=	this.data.cli_direccion
							this.ListatabulacionAnalisiss[cli].cli_secretkey  	= 	this.data.cli_secretkey
							this.ListatabulacionAnalisiss[cli].cli_sts			=	this.data.cli_sts						
						}
					}	
				}else{
					this.ListatabulacionAnalisis.push({
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
						this.toaster.pop('warning', "Datos duplicados", "Nombre de tabulacionAnalisis.");
						break;
					default:
						this.toaster.pop('error', "ERROR", "Problema en el servidor");
						break;
				}
			}
		}).catch((err)=>{
			console.log(err)
		})*/
	}
	updtabulacionAnalisis (tabulacionAnalisis){
		this.visible = true
		this.data = {
			cli_id			:tabulacionAnalisis.cli_id,
			cli_nombre		:tabulacionAnalisis.cli_nombre,
			cli_nomcorto	:tabulacionAnalisis.cli_nomcorto,
			cli_telefono	:tabulacionAnalisis.cli_telefono,
			cli_direccion	:tabulacionAnalisis.cli_direccion,
			cli_secretkey	:tabulacionAnalisis.cli_secretkey,
			cli_sts			:parseInt(tabulacionAnalisis.cli_sts)
		}
	}
	mostrarForm(){
			this.visible = !this.visible
		}
	CargatabulacionAnalisiss(){
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
export default tabulacionAnalisisListformController
