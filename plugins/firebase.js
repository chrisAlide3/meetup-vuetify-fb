// import Vue from 'vue'
import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAgB7MrRcKXJUr5jSpDRCKzi3ICqcg3wgk',
  authDomain: 'meetup-vuetify-fb.firebaseapp.com',
  databaseURL: 'https://meetup-vuetify-fb.firebaseio.com',
  projectId: 'meetup-vuetify-fb',
  storageBucket: 'meetup-vuetify-fb.appspot.com'
}

!firebase.apps.length ? firebase.initializeApp(config) : ''

export default {
  
}