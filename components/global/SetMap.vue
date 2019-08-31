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
        <v-icon color="red" @click="clearLocation">cancel</v-icon>
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
        <!-- Do not run on server. Mapbox can only render in client (see nuxt.config plugins) -->
        <client-only>
          <MglMap id="map"
            :accessToken="accessToken"
            :mapStyle="mapStyle"
            :center="coordinates"
            :zoom="zoom"
            @load="loadMap"
            @click="setMarker"
          >
            <MglMarker v-if="markerCoordinates.length>0" :coordinates="markerCoordinates">
              <v-icon color="red" slot="marker">place</v-icon>
            </MglMarker>

            <MglNavigationControl position="top-right"/>
            <MglGeolocateControl position="top-right" :trackUserLocation="true" />
          </MglMap>
        </client-only>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapboxConfig } from '~/.config.js'
// import {
//   MglMap,
//   MglMarker,
//   MglNavigationControl,
//   MglGeolocateControl
// } from 'vue-mapbox'

export default {
  // name: 'App',

  // components: {
  //   MglMap,
  //   MglMarker,
  //   MglNavigationControl,
  //   MglGeolocateControl,
  // },

  created () {
    // if (process.browser) {
    //   this.createMap()
    // }
    this.selectedLocation = this.locationName
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
    },
    locationName: {
      type: String,
      required: true
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
    select (val) {
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
      this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + v + '.json?proximity=' + long + ',' + lat + '&access_token=' + this.accessToken)
        .then(data => {
          data.features.forEach(element => {
            this.locations.push(element.place_name)
          })

          this.loading = false
        })
    },
    // createMap () {
    //   const Mapbox = require("mapbox-gl")
    //   this.mapbox = Mapbox
    // },
    loadMap (map) {
      let same = true
      for (let index = 0; index < this.userPosition.length; index++) {
        if (this.userPosition[index] !== this.coordinates[index]) {
          same = false
          break
        }
      }
      if (!same) {
        this.zoom = 14
        this.markerCoordinates = this.coordinates
      }

    },
    setMarker (map) {
      const coordinates = [map.mapboxEvent.lngLat.lng, map.mapboxEvent.lngLat.lat]
      this.markerCoordinates = coordinates
      this.zoom = 14
      this.getLocation(coordinates)
        .then((payload) => {
          this.selectedLocation = payload.location
          const payload1 = {
            coordinates: coordinates,
            location: payload.location,
            locality: payload.locality
          }
          this.$emit('mapLocation', payload1)
        })
    },
    getCoordinates (location) {
      const long = this.userPosition[0]
      const lat = this.userPosition[1]

      this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + location + '.json?proximity=' + long + ',' + lat + '&access_token=' + this.accessToken)
        .then(data => {
          let locality = ''
          this.zoom = 12
          const coordinates = data.features[0].center
          data.features.forEach(element => {
            if (element.place_type === 'locality') {
              locality = element.place_name
            }
          })
          this.markerCoordinates = coordinates

          const payload = {
            coordinates: coordinates,
            location: location,
            locality: locality
          }
          this.$emit('mapLocation', payload)
          this.select = null
        })
    },
    getLocation (coordinates) {
      return this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + coordinates + '.json?access_token=' + this.accessToken)
        .then(data => {
          const location = data.features[0].place_name
          let locality = ''
          data.features.forEach(element => {
            if (element.place_type[0] === 'locality') {
              locality = element.place_name
            }
          })
          const payload = {
            location: location, 
            locality: locality
          }
          return payload
        })
    },
    clearLocation () {
      this.selectedLocation = ''
      this.zoom = 1
      this.markerCoordinates = []
      const payload = {
        coordinates: this.userPosition,
        location: '',
        locality: ''
      }
      this.$emit('mapLocation', payload)
    }
  }
}
</script>
