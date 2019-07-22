<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex xs12 sm8>
        <v-card>

          <v-layout row justify-center>
            <v-card-title>
              <h2>Create a new meetup</h2>
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
                    v-model="formData.location"
                    :rules="locationRules"
                    label="Location"
                    required
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-btn v-if="!formData.image"
                    raised
                    color="primary"
                    @click="onPickFile"
                  >Upload image
                  </v-btn>
                  <v-btn v-if="formData.image"
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
                  <v-date-picker
                    v-model="formData.date"
                    :landscape="landscape"
                    :reactive="reactive">
                  </v-date-picker>
                </v-flex>
              </v-layout>

              <v-layout row wrap justify-center class="mt-3">
                <v-flex xs12 sm10>
                  <v-time-picker
                    v-model="formData.time"
                    :rules="timeRules"
                    format="24hr"
                    :landscape="landscape">
                    </v-time-picker>
                  </v-flex>
              </v-layout>

              <v-layout row justify-center>
                <v-flex xs12 sm10>
                  <v-btn 
                    color="success" 
                    depressed
                    round
                    :disabled="!valid"
                    @click="save"
                  >Save
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
export default {
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
      valid: true,
      landscape: true,
      reactive: false,

      titleRules: [
        v => !!v || 'Title is required',
      ],
      descriptionRules: [
        v => !!v || 'Description is required',
      ],
      locationRules: [
        v => !!v || 'Location is required',
      ],
      timeRules: [
        v => !!v || 'Time is required',
      ],

      formData: {
        title: '',
        location: '',
        description: '',
        date: new Date().toISOString().substr(0, 10),
        time: null,
        userId: this.userId,
        imgName: '',
        imgUrl: '',
        image: null
      },
    }
  },
  props: {
    meetup: {
      type: Object,
      required: false
    }
  },
  computed: {
    userId () {
      return this.$store.getters.user.id
    }
  },
  methods: {
    save () {
      if (this.meetup & this.$refs.form.validate()) {
        console.log('Update meetup')
      } 
      if (!this.meetup & this.$refs.form.validate()) {
        delete this.formData['imgUrl']
        console.log('add meetup')
        console.log(this.formData)
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
        this.formData.image = files[0]
      },
      onRemoveFile () {
        this.formData.image = null
        this.formData.imgName = ''
        this.formData.imgUrl = ''
      }
  }
}
</script>
