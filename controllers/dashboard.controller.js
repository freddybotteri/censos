"use strict"
const dashboard_controller = ['$scope','$http','comunicator','ocultarmenu',($scope,$http,comunicator,ocultarmenu)=>{
	$scope.listaSensos = []
	$scope.listaPuntos = []
	$scope.init = function () {
		$scope.listaSensos
		comunicator.getListacenso().then(function(respuesta){
			let data = []
			if (respuesta.data.tipo == 'ok') {
				$scope.listaSensos = respuesta.data.data
			}else{
			
			}
		})
	}
	$scope.verDash = function (censo){
		//Hago una consulta y consigo los datos de numero de puntos
		$scope.censoseleccionado = censo.sen_nombre
		comunicator.listapuntos(censo.sen_id).then(function(respuesta){
			if (respuesta.data.tipo == 'ok') {
				$scope.cargando = ''
				$scope.listaPuntos = respuesta.data.data
			}else{
			
			}
		})
	}
	$scope.ocultar = true
	$scope.btnocultar = function(){
		$scope.ocultar  = !$scope.ocultar

	}
	$scope.censoseleccionado = ''
	$scope.cargando = 'Cargando...'
}];

export default  dashboard_controller 