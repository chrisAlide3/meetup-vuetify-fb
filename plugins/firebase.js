import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { firebaseConfig } from '~/.config'


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const fireAuth = firebase.auth()
const fireStore = firebase.firestore
const fireDb = firebase.firestore()
const fireStorage = firebase.storage()
export {fireAuth, fireStore, fireDb, fireStorage}
