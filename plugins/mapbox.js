import Vue from 'vue'
import { MglMap, MglMarker, MglNavigationControl, MglGeolocateControl } from 'vue-mapbox'
import Mapbox from 'mapbox-gl'

Vue.component('MglMap', MglMap)
Vue.component('MglMarker', MglMarker)
Vue.component('MglNavigationControl', MglNavigationControl)
Vue.component('MglGeolocateControl', MglGeolocateControl)

Vue.prototype.$mapbox = Mapbox