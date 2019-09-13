"use strict"
import controller from './menu_controller'
const menu_component = {  
	bindings: {
		menutipe: '<'//donde la usa 
	},
	controller,
	templateUrl:'/temcomp/menu2' 
};
export default menu_component