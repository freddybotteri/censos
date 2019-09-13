class perfilesList{  
	constructor(comunicator,$timeout) {
		'ngInject'
		this.comunicator = comunicator;
		this.$timeout = $timeout;
	};
	$onInit(){
		this.perfiles = this.comunicator.getPerfiles(this.estados);
	};
}

export default perfilesList