<template>
  <v-container>
    <v-layout row v-if="selectedLocation !== ''">
      <v-flex xs11>
        <v-text-field
          label="Selected location"
          readonly
          :value="selectedLocation"
        >
        </v-text-field>
      </v-flex>
      <v-flex xs1 shrink align-self-center>
        <v-icon @click="clearLocation">cancel</v-icon>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-2">
      <v-flex xs12>
        <v-autocomplete 
          v-model="select"
          :loading="loading"
          :items="locations"
          :search-input.sync="search"
          cache-items
          flat
          hide-no-data
          hide-details
          label="Choose location"
          box
        ></v-autocomplete>
      </v-flex>
    </v-layout>
    
    <v-layout row>
      <v-flex xs12>
        <MglMap id="map"
          :accessToken="accessToken"
          :mapStyle="mapStyle"
          :center="coordinates"
          :zoom="zoom"
          @click="setMarker"
        >
          <MglMarker v-if="markerCoordinates.length>0" :coordinates="markerCoordinates">
            <v-icon color="red" slot="marker">place</v-icon>
          </MglMarker>

          <MglNavigationControl position="top-right"/>
          <MglGeolocateControl position="top-right" :trackUserLocation="true" />
        </MglMap>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapboxConfig } from '~/.config.js'
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
      accessToken: mapboxConfig.accessToken,
      mapStyle: 'mapbox://styles/mapbox/streets-v9',
      markerCoordinates: [],
      zoom: 1,
      // Autocomplete
      loading: false,
      locations: [],
      search: null,
      select: null,

      selectedLocation: ''
    }
  },
  props: {
    userPosition: {
      type: Array,
      required: true
    },
    coordinates: {
      type: Array,
      required: true
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
    select (val) {
      console.log('selectWatcher: ', val)
      if (val !== null) {
        this.selectedLocation = val
        this.getCoordinates(val)
      }
    }
  },
  methods: {
    querySelections (v) {
      this.loading = true
      const long = this.userPosition[0]
      const lat = this.userPosition[1]
      console.log('long/lat: ', long + '/' + lat)
      this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + v + '.json?proximity=' + long + ',' + lat + '&access_token=' + this.accessToken)
        .then(data => {
          data.features.forEach(element => {
            this.locations.push(element.place_name)
          })

          this.loading = false
        })
    },
    setMarker (map) {
      const coordinates = [map.mapboxEvent.lngLat.lng, map.mapboxEvent.lngLat.lat]
      this.markerCoordinates = coordinates
      this.zoom = 14
      this.getLocation(coordinates)
        .then((location) => {
          this.selectedLocation = location
          const payload = {
            coordinates: coordinates,
            location: location
          }
          this.$emit('mapLocation', payload)
        })
    },
    getCoordinates (location) {
      const long = this.userPosition[0]
      const lat = this.userPosition[1]
      console.log('long/lat: ', long + '/' + lat)

      this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + location + '.json?proximity=' + long + ',' + lat + '&access_token=' + this.accessToken)
        .then(data => {
          this.zoom = 12
          const coordinates = data.features[0].center
          this.markerCoordinates = coordinates

          const payload = {
            coordinates: coordinates,
            location: location
          }
          this.$emit('mapLocation', payload)
          this.select = null
        })
    },
    getLocation (coordinates) {
      return this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + coordinates + '.json?access_token=' + this.accessToken)
        .then(data => {
          return data.features[0].place_name
        })
    },
    clearLocation () {
      this.selectedLocation = ''
      this.zoom = 1
      this.markerCoordinates = []
      const payload = {
        coordinates: this.userPosition,
        location: ''
      }
      this.$emit('mapLocation', payload)
    }
  }
}
</script>
