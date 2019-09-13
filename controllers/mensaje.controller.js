function  MensajeController($scope,$http,$timeout){
   $scope.visible;
	$scope.init = (time)=> {
		console.log("tiempo:")
			 $timeout(function () {
				$scope.visible = false
			}, time);	
	}
}
module.exports.MensajeController = MensajeController;