"use strict"
import controller from './perfilList_controller'
const perfilList_component = {  
	bindings: {
		estados: '<',
	},
	controller,
	templateUrl:'/temcomp/perfilesList' 
};
export default perfilList_component