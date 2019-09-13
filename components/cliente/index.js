"use strict"
import angular from 'angular'
import { clienteListformComponent } from './cliente-listform/cliente-listform.component'


const cliente = angular
	.module('cliente', [])
	.component('clienteListform', clienteListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('clientes', {
				url: '/cliente',
				component: 'clienteListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default cliente