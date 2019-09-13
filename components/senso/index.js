"use strict"
import angular from 'angular'
import { sensoListformComponent } from './senso-listform/senso-listform.component'


const senso = angular
	.module('senso', [])
	.component('sensoListform', sensoListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('sensos', {
				url: '/senso',
				component: 'sensoListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default senso