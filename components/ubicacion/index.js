"use strict"
import angular from 'angular'
import { ubicacionListformComponent } from './ubicacion-listform/ubicacion-listform.component'


const ubicacion = angular
	.module('ubicacion', [])
	.component('ubicacionListform', ubicacionListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('ubicacions', {
				url: '/ubicacion',
				component: 'ubicacionListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default ubicacion