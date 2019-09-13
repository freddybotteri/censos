"use strict"
import angular from 'angular'
import { geograficaListformComponent } from './geografica-listform/geografica-listform.component'


const geografica = angular
	.module('geografica', [])
	.component('geograficaListform', geograficaListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('geografica', {
				url: '/geografica',
				component: 'geograficaListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default geografica