/**
 * app.js
 *
 * Root modulethat imports all modules of the app.
 */
 import '../node_modules/angular-chart.js/angular-chart.js'
import angular from 'angular'
import uiRouter from 'angular-ui-router'
import translate from 'angular-translate'
import sanitize from 'angular-sanitize'
import angularmd5 from 'angular-md5'

import { AppComponent } from './app.component'

import services 	from './services/'
import componentes 	from './components/'
import controllers 	from './controllers/'
import notify  from 'angular-notify'
import toaster from 'angularjs-toaster'

import espanol from './common/idioms/espanol.js'


const root = angular
	.module('Facturacion', [
		uiRouter,
		notify,
		toaster,
		translate,
		sanitize,
		'chart.js',
		angularmd5,
		services,
		componentes,
		controllers,

	])
	.component('plantilla', AppComponent)
	.config(($stateProvider, $urlRouterProvider) => {
		$stateProvider
		.state('inicio', {
			url: '/inicio',
			templateUrl: "/dashboard"
		})
		.state('adminPanel', {
			url: '/adminPanel',
			templateUrl: "/adminPanel"
		})
		/*.state('perfiles', {
			url: '/perfiles',
			templateUrl: "/perfiles/local"
		})*/
		.state('perfilesAdmin', {
			url: '/perfilesAdmin',
			templateUrl: "/perfiles/admin"
		})
		.state('datos', {
			url: '/datos',
			templateUrl: "/datos",
			onEnter: function(){   
			},
			//redirectTo: 'datos.empresa',
		})
		.state('empresa', {
			url: '/empresa',
			templateUrl: "/empresa",
			onEnter: function(){   
			},
			//redirectTo: 'empresa.empresa',
		})
		.state('venta', {
			url: '/venta',
			templateUrl: "/venta",
			//redirectTo: 'venta.cliente',
		})
		.state('seguridad', {
			url: '/seguridad',
			templateUrl: "/seguridad",
			//redirectTo: 'seguridad.perfiles',
		})
		$urlRouterProvider.otherwise('/inicio')
	})
	.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.translations('es',espanol );
		$translateProvider.preferredLanguage('es');
		$translateProvider.useSanitizeValueStrategy(null);//'sanitize'
	}]);
// Bootstrap the app.
document.addEventListener('DOMContentLoaded', () => angular.bootstrap(document, ['Facturacion']))

export default root
