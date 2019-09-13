"use strict"
import angular from 'angular'
import { UsuarioListformComponent } from './usuario-listform/usuario-listform.component'


const usuario = angular
	.module('usuario', [])
	.component('usuarioListform', UsuarioListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('usuarios', {
				url: '/usuario',
				component: 'usuarioListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default usuario