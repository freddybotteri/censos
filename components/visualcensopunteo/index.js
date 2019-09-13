"use strict"
import angular from 'angular'
import { visualcensopunteoListformComponent } from './visualcensopunteo-listform/visualcensopunteo-listform.component'


const visualcensopunteo = angular
	.module('visualcensopunteo', [])
	.component('visualcensopunteoListform', visualcensopunteoListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('visualcensopunteo', {
				url: '/visualcensopunteo',
				component: 'visualcensopunteoListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default visualcensopunteo