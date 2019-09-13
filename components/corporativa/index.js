"use strict"
import angular from 'angular'
import { corporativaListformComponent } from './corporativa-listform/corporativa-listform.component'


const corporativa = angular
	.module('corporativa', [])
	.component('corporativaListform', corporativaListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('corporativas', {
				url: '/corporativa',
				component: 'corporativaListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default corporativa