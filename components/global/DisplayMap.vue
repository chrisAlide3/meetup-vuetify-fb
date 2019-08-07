<template>
  <v-container>
    <v-layout row v-if="locationName !== ''">
      <v-flex xs11>
        <v-text-field
          label="Selected location"
          readonly
          :value="locationName"
        >
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-2">
      <v-flex xs12>
        <MglMap id="map"
          :accessToken="accessToken"
          :mapStyle="mapStyle"
          :center="coordinates"
          :zoom="10"
        >
          <MglMarker :coordinates="coordinates">
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
import {
  MglMap,
  MglMarker,
  MglNavigationControl,
  MglGeolocateControl
} from 'vue-mapbox'

export default {
  components: {
    MglMap,
    MglMarker,
    MglNavigationControl,
    MglGeolocateControl,
  },
  data () {
    return {
      accessToken: mapboxConfig.accessToken,
      mapStyle: 'mapbox://styles/mapbox/streets-v11',
    }
  },
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    locationName: {
      type: String,
      required: true
    }
  },
  created () {
    if (process.browser) {
      this.createMap()
    }
  },
  methods: {
    createMap () {
      console.log('create map')
      const Mapbox = require("mapbox-gl")
      this.mapbox = Mapbox
    }
  }
}
</script>
