"use strict"
import controller from './perfilesform_controller'
const perfilesform_component = {  
	bindings: {
		perfilData: '<'
	},
	controller,
	templateUrl:'/temcomp/perfilesform' 
};
export default perfilesform_component