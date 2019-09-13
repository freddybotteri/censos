"use strict"
import angular from 'angular'
import { tipopuntoListformComponent } from './tipopunto-listform/tipopunto-listform.component'


const tipopunto = angular
	.module('tipopunto', [])
	.component('tipopuntoListform', tipopuntoListformComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
			.state('tipopunto', {
				url: '/tipopunto',
				params: {
					idSenso: 0,
					senNom:""
				},
				component: 'tipopuntoListform',
			})
		$urlRouterProvider.otherwise('/inicio')
	})
	.name
export default tipopunto