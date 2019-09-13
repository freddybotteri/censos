"use strict"
import angular from 'angular'
import { encuestaListformComponent } from './encuesta-listform/encuesta-listform.component'


const encuesta = angular
	.module('encuesta', [])
	.component('encuestaListform', encuestaListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('encuesta', {
				url: '/encuesta',
				component: 'encuestaListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default encuesta