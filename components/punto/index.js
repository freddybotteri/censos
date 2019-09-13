"use strict"
import angular from 'angular'
import { puntoListformComponent } from './punto-listform/punto-listform.component'


const punto = angular
	.module('punto', [])
	.component('puntoListform', puntoListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('punto', {
				url: '/punto',
				params: {
					idSenso: 0,
					senNom:""
				},
				component: 'puntoListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default punto