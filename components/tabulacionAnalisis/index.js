"use strict"
import angular from 'angular'
import { tabulacionAnalisisListformComponent } from './tabulacionAnalisis-listform/tabulacionAnalisis-listform.component'


const tabulacionAnalisis = angular
	.module('tabulacionAnalisis', [])
	.component('tabulacionAnalisisListform', tabulacionAnalisisListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('tabulacionAnalisis', {
				url: '/tabulacionAnalisis',
				params: {
					idEnc: 0,
					encNom:""
				},
				component: 'tabulacionAnalisisListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default tabulacionAnalisis