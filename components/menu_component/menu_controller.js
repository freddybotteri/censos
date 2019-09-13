class menucontroller{  
	constructor(comunicator,$timeout) {
		'ngInject'
		this.comunicator = comunicator;
		this.$timeout = $timeout;
	};
	getMenu(){
		this.data = this.comunicator.secureGet(this.menutipe);//de donde sale menutipe
		if (Object.keys(this.data).length == 0 ) {
			this.comunicator.dowMenu(this.menutipe);
			var thos = this;//por que thos
			this.$timeout(function() {
				thos.data = thos.comunicator.secureGet(thos.menutipe);
				if (Object.keys(thos.data).length == 0 ) {
					thos.getMenu();
				}//promise en lugar de time desde comunicator

			},1000);//por que cda 1000
		}
		/*for(let r in this.data){
			console.log(this.data[r].tmenu_text)
			if(this.data[r].tmenu_text == "Admin"){
				delete this.data[r] 
			}
		}*/
	};
	$onInit(){
		this.global = ""
		this.data = this.comunicator.secureGet(this.menutipe);
		if (Object.keys(this.data).length == 0 ) {
			this.getMenu();
		}
	};
}

export default menucontroller