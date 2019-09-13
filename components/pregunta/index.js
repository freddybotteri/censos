"use strict"
import angular from 'angular'
import { preguntaListformComponent } from './pregunta-listform/pregunta-listform.component'


const pregunta = angular
	.module('pregunta', [])
	.component('preguntaListform', preguntaListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('pregunta', {
				url: '/pregunta',
				params: {
					idEnc: 0,
					encNom:""
				},
				component: 'preguntaListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default pregunta