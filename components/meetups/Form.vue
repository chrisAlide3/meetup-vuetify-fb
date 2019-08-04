<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <v-card>

          <v-layout row justify-center>
            <v-card-title>
              <h2 v-if="!meetup" class="grey--text">Create a new meetup</h2>
              <h2 v-else class="grey--text">Update meetup</h2>
            </v-card-title> 
          </v-layout>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-text-field
                    v-model="formData.title"
                    :rules="titleRules"
                    label="Title"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-text-field
                    label="Location"
                    readonly
                    :value="locationName"
                    @click="showMap=true"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row justify-center v-if="showMap">
                <v-flex xs12 sm10>
                  <MapboxComponent @mapLocation="setLocation"/>
                </v-flex>
              </v-layout>

              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-btn v-if="!formData.imgName"
                    raised
                    color="primary"
                    @click="onPickFile"
                  >Upload image
                  </v-btn>
                  <v-btn v-if="formData.imgName"
                    :loading="loading.includes('removeImage')"
                    raised
                    color="error"
                    @click="onRemoveFile"
                  >Remove image
                  </v-btn>
                  <input
                    type="file"
                    style="display: none"
                    ref="fileInput"
                    accept="image/*"
                    @change="onFilePicked"
                  >
                </v-flex>
              </v-layout>
              <v-layout row justify-center v-if="formData.imgUrl">
                <v-flex xs12 sm10>
                  <img :src="formData.imgUrl" height="150" >
                </v-flex>
              </v-layout>

              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-textarea
                    v-model="formData.description"
                    :rules="descriptionRules"
                    label="Description"
                    required
                    solo
                    rows="3"
                  >
                  </v-textarea>
                </v-flex>
              </v-layout>

              <v-layout row wrap justify-center>
                <v-flex xs12 sm10>
                   <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.date"
                        label="Meetup Date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="formData.date" no-title scrollable :allowed-dates="allowedDates">
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.dateMenu.save(formData.date)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout row wrap justify-center class="mt-3">
                <v-flex xs12 sm10>
                  <v-menu
                    ref="timeMenu"
                    v-model="timeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.time"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.time"
                        :rules="checkDate"
                        label="Meetup Time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="timeMenu"
                      v-model="formData.time"
                      format="24hr"
                      full-width
                      @click:minute="$refs.timeMenu.save(formData.time)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
              </v-layout>

              <v-layout row justify-center class="mt-3">
                <v-flex xs12 sm10>
                  <v-btn 
                    color="success" 
                    flat
                    round
                    :loading="loading.includes('save')"
                    :disabled="!valid"
                    @click="save"
                  >
                    <v-icon left>save</v-icon>
                  Save
                  </v-btn>
                  <v-btn
                    depressed
                    round
                    @click="$router.go(-1)"
                  >
                    <v-icon left>cancel</v-icon>
                  Cancel
                  </v-btn>
                </v-flex>

              </v-layout>

            </v-form> 
          </v-card-text>
        </v-card>
        
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MapboxComponent from '~/components/mapbox'

export default {
  components: {
    MapboxComponent,
  },
  created () {
    if (this.meetup) {
      this.formData.title = this.meetup.title,
      this.formData.location = this.meetup.location
      this.formData.description = this.meetup.description,
      this.formData.date = this.meetup.date,
      this.formData.time = this.meetup.time,
      this.formData.userId = this.meetup.userId,
      this.formData.imgName = this.meetup.imgName,
      this.formData.imgUrl = this.meetup.imgUrl
    }
  },
  data () {
    return {
      valid: false,
      showMap: false,
      locationName: '',
      // Picker full display
      landscape: true,
      reactive: false,
      // Datepicker as Menu
      dateMenu: false,
      // Timepicker as Menu
      timeMenu: false,

      titleRules: [
        v => !!v || 'Title is required',
      ],
      descriptionRules: [
        v => !!v || 'Description is required',
      ],
      locationRules: [
        v => !!v || 'Location is required',
      ],

      formData: {
        title: '',
        location: [],
        description: '',
        date: new Date().toISOString().substr(0, 10),
        time: '00:00',
        userId: this.$store.getters.user.id,
        imgName: '',
        imgUrl: '',
      },
      image: null
    }
  },
  props: {
    meetup: {
      type: Object,
      required: false
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    // locationName () {
    //   return this.$store.getters.locationName
    // },
    checkDate () {
      const now = new Date()
      const enteredDate = new Date(this.formData.date)
      const hours_minutes = this.formData.time.split(':')
      enteredDate.setHours(hours_minutes[0])
      enteredDate.setMinutes(hours_minutes[1])
      if (enteredDate.getTime() < now.getTime()) {
        return ["Time is in the past, please adjust! Or choose another Date"]
      } else {
        return []
      }
    },
  },
  methods: {
    setLocation (coordinates) {
      this.formData.location = coordinates
      return this.$axios.$get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + coordinates + '.json?access_token=pk.eyJ1Ijoia3Jpc3BlZSIsImEiOiJjanl0dmx6ZmQwNHJ6M21wOWRtd3JwNnB4In0.wJM9noKDuLr_rtWYJfdpHQ')
      .then(data => {
          this.locationName = data.features[0].place_name
        })
        .catch(err => {
          console.error(err)
        })     
    },
    save () {
      const payload = {
        formData: this.formData,
        image: this.image
      }
      if (this.meetup && this.$refs.form.validate()) {
        if (!payload.formData.imgName) {
          payload.formData.imgUrl = ''
        }
        payload.meetupId = this.$route.params.id
        const loadElement = ['save']
        this.$store.dispatch('loading', loadElement)
        this.$emit('updateMeetup', payload)
      } 
      if (!this.meetup && this.$refs.form.validate()) {
        payload.formData.imgUrl = ''
        const loadElement = ['save']
        this.$store.dispatch('loading', loadElement)
        this.$emit('addMeetup', payload)
      }
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      if (!event.target.files[0]) {
        return
      }
      const files = event.target.files
      const filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Invalid file. File must have an image extension')
      }
      // convert picked file to baseUrl format to display preview of chosen file
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.formData.imgUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    onRemoveFile () {
      if (this.formData.imgName) {
        const loadElement = ['removeImage']
        this.$store.dispatch('loading', loadElement)
        const payload = {
          meetupId: this.$route.params.id,
          imgName: this.formData.imgName
        }
        this.$store.dispatch('removeMeetupImage', payload)
          .then(() => {
            this.$store.dispatch('clearLoading')
            this.image = null
            this.formData.imgName = ''
            this.formData.imgUrl = ''
          })
      }  
    },
    allowedDates (value) {
      const now = new Date().toISOString().substr(0, 10)
      return value >= now
    },
  }
}
</script>

<style scoped>
  #map {
    height: 300px
  }
</style>
