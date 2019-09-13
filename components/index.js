"use strict"
import angular from 'angular'

import  menuComponent  from './menu_component/menu_component'
import usuario 		   from './usuario'
import cliente 		   from './cliente'
import senso 		   from './senso'
import corporativa 		from './corporativa'
import punto 		   from './punto'
import tipopunto 		   from './tipopunto'
import geografica		   from './geografica'
import ubicacion		   from './ubicacion'
import encuesta		   from './encuesta'
import pregunta		   from './pregunta'
import tabulacionAnalisis		   from './tabulacionAnalisis'
import visualcensopunteo		   from './visualcensopunteo'

import  perfilesFrmComponent	from './perfilesform_component/perfilesform_component'
import  perfilListComponent		from './perfilList_component/perfilList_component'


const componentes = angular
	.module('componentes', [usuario,cliente,senso
							,corporativa,punto,tipopunto
							,geografica,ubicacion,encuesta
							,pregunta,tabulacionAnalisis,visualcensopunteo])
	.component('menu', menuComponent)
	.component('perfilesForm', perfilesFrmComponent)
	.component('perfilList', perfilListComponent)
	.name
export default componentes