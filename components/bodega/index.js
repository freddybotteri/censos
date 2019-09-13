"use strict"
import angular from 'angular'
import { bodegaListformComponent } from './bodega-listform/bodega-listform.component'


const bodega = angular
	.module('bodega', [])
	.component('bodegaListform', bodegaListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('bodega', {
				url: '/bodega',
				component: 'bodegaListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default bodega