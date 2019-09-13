'use strict'
class bodegaListformController {
	constructor (notify,$window,bodegaService) {
		'ngInject';
		this.notify = notify
		this.$window = $window
		this.bodegaService = bodegaService
		this.ListaEmpresas = {}
		this.ListaBodegas = {}

		/*bod_id:,
		bod_nombre:,
		bod_tipo:,
		bod_ubicacion:,
		bod_disponible:,
		bod_sts:, 
		bod_telefono:,
		emp_id:*/ 

		this.data={
			bod_id:0,
			bod_nombre:"",
			bod_tipo:"",
			bod_ubicacion:"",//null
			bod_disponible:"",//null
			bod_sts:1, 
			bod_telefono:"",//null
			emp_id:""
		}
		this.visible = false
		this.modal = ""
	}
		$onInit() {
			this.bodegaService.FKEmpresa().success((response) => {
				this.ListaEmpresas = response.data
			});
		}
		cargaBodegas(){
			this.bodegaService.listarBodega().success((response) => {
				this.ListaBodegas = response.data
			});
		}
		btnAgregar () {
		this.bodegaService.guardarBodega(this.data).success((data)=>{			
			if(data.sts == 'ok'){
				let empNombre = ""
				//Buscar en la lista de empresa el nombre 
				//ya que al momento de retornar un ingreso estos no vienen.
				for (let emp in this.ListaEmpresas) { 
					if(this.ListaEmpresas[emp].emp_id == this.data.emp_id){
						empNombre = this.ListaEmpresas[emp].emp_nombre 
					}
				}
				//compruebo si es una insercion o una actualizacion
				//y dependiendo actualizao en local lista o agrego un mas.
				if(data.datos.insertId == 0){
					for (let bodeg in this.ListaBodegas) { 
						if(this.ListaBodegas[bodeg].bod_id == this.data.bod_id){
							
							this.ListaBodegas[bodeg].bod_id			= this.data.bod_id
							this.ListaBodegas[bodeg].bod_nombre		= this.data.bod_nombre
							this.ListaBodegas[bodeg].bod_tipo		= this.data.bod_tipo
							this.ListaBodegas[bodeg].bod_ubicacion	= this.data.bod_ubicacion
							this.ListaBodegas[bodeg].bod_disponible	= this.data.bod_disponible
							this.ListaBodegas[bodeg].bod_sts		= this.data.bod_sts 
							this.ListaBodegas[bodeg].bod_telefono	= this.data.bod_telefono
							this.ListaBodegas[bodeg].emp_id			= parseInt(this.data.emp_id)
							this.ListaBodegas[bodeg].emp_nombre		= empNombre
						}
					}	
				}else{
					this.ListaBodegas.push({
	    					bod_id			:data.datos.insertId,
							bod_nombre		:this.data.bod_nombre,
							bod_tipo		:this.data.bod_tipo,
							bod_ubicacion	:this.data.bod_ubicacion,
							bod_disponible	:this.data.bod_disponible,
							bod_sts			:this.data.bod_sts, 
							bod_telefono	:this.data.bod_telefono,
							emp_id			:parseInt(this.data.emp_id),
							emp_nombre		:empNombre
					});
					this.data.bod_id = 	data.datos.insertId			
				}
				this.notify.show('GUARDADO EXITOSAMENTE...')
			}else if(data.sts == 'fail'){
				switch(data.erro.code){
					case 'ER_DUP_ENTRY':
						this.notify.show('ERROR:El nombre de la granja ya existe')
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
		updBodega(bodega){
			this.visible = true
			this.data={
				bod_id			:bodega.bod_id,
				bod_nombre		:bodega.bod_nombre,
				bod_tipo		:bodega.bod_tipo,
				bod_ubicacion	:bodega.bod_ubicacion,
				bod_disponible	:bodega.bod_disponible,
				bod_sts			:bodega.bod_sts, 
				bod_telefono	:bodega.bod_telefono,
				emp_id			:parseInt(bodega.emp_id)
			}
		}
		mostrarForm(){
			this.visible = !this.visible
		}
		btnLimpiar (form) {
			this.data = {
				bod_id:0,
				bod_nombre:"",
				bod_tipo:"",
				bod_ubicacion:"",
				bod_disponible:"",
				bod_sts:1, 
				bod_telefono:"",
				emp_id:""
			}
			form.$setPristine();
	}
}
export default bodegaListformController