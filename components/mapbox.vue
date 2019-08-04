<template>
  <MglMap id="map"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="coordinates"
    :zoom="10"
    @load="loadMap"
    @click="setMarker"
  >
    <MglGeocoderControl
      :accessToken="accessToken"
      :input.sync="mapSearch"
      @results="handleSearch"
      @result="getLocation"
    />
    <MglMarker :coordinates="markerCoordinates">
      <v-icon color="red" slot="marker">place</v-icon>
    </MglMarker>

    <MglNavigationControl position="top-right"/>
    <MglGeolocateControl position="top-right" :trackUserLocation="true" />
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl"

import {
  MglMap,
  MglMarker,
  MglNavigationControl,
  MglGeolocateControl
} from 'vue-mapbox'

import MglGeocoderControl from 'vue-mapbox-geocoder'

export default {
  name: 'App',

  components: {
    MglMap,
    MglMarker,
    MglNavigationControl,
    MglGeolocateControl,
    MglGeocoderControl
  },

  created () {
    this.mapbox = Mapbox
  },
  data() {
    return {
      accessToken: 'pk.eyJ1Ijoia3Jpc3BlZSIsImEiOiJjanl0dmx6ZmQwNHJ6M21wOWRtd3JwNnB4In0.wJM9noKDuLr_rtWYJfdpHQ', // your access token. Needed if you using Mapbox maps,
      mapStyle: 'mapbox://styles/mapbox/streets-v9',
      // coordinates: [115.1571983, -8.7179646],
      coordinates: [0, 0],
      markerCoordinates: [0, 0],
      mapSearch: ''
    }
  },
  methods: {
    loadMap (map) {
      console.log('LoadMap', map)
      // console.log(map.component.center)
      // :center="[115.1571983, -8.7179646]"
    },
    handleSearch(event) {
      console.log('handleSearch: ', event)
      // console.log('Control: ', event.control)
    },
    getLocation (payload) {
      console.log('getLocation: ', payload)
      this.markerCoordinates = payload.result.center
      this.coordinates = payload.result.center
      this.$emit('mapLocation', payload.result.center)
    },
    setMarker (map) {
      console.log('setMarker', map)
      const coordinates = [map.mapboxEvent.lngLat.lng, map.mapboxEvent.lngLat.lat]
      this.markerCoordinates = coordinates
      this.$emit('mapLocation', coordinates)
    }
  }
}
</script>