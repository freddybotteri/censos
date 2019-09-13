"use strict"
import angular from 'angular'

import  menu_controller  from './menu_controller'
import  dashboard_controller   from './dashboard.controller'

const controllers = angular  
	.module('controllers', [])
	.controller('menuMain', menu_controller)//por que no el mismo nombre
	.controller('dashboardCtrl', dashboard_controller)
	.name

export default controllers