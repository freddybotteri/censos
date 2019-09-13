"use strict"
const menu_controller = ['$scope','$http','comunicator',($scope,$http,comunicator)=>{
	$scope.menudata = [];
	$scope.init = function (algo) {
		$scope.menudata = comunicator.getMenu("comun");
		if (Object.keys($scope.menudata).length == 0 ) {
		
			getMenu();
		}
	}
	let getMenu =()=>{
		console.log("get menu")
		comunicator.dowMenu("comun");
		setTimeout(function() {
			$scope.menudata = comunicator.getMenu("comun");
			if (Object.keys($scope.menudata).length == 0 ) {
				console.log("No se a cargado el Menu");
				if (Object.keys($scope.menudata).length == 0 ) {
					getMenu();
				}
			}
			console.log($scope.menudata);
			$scope.$apply();
		},1000);
	}

	$scope.clickDashboard = function (){
		console.log("click en dashboart")
	}
}];

export default  menu_controller 
