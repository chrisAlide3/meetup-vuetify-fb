// import * as firebase from 'firebase'
import { fireAuth, fireDb, fireStorage } from '~/plugins/firebase.js'


export const state = () => ({
  user: {},
  loading: false,
  error: null
})

export const mutations = {
  loadUser (state, user) {
    state.user = user
  },
  updateUser ( state, formData) {
    state.user.firstname = formData.firstname
    state.user.surname = formData.surname
  },
  setError (state, error) {
    state.error = error
  },
  clearError (state) {
    state.error = null
  },
  loading (state, payload) {
    state.loading = payload
  }
}

export const actions = {
  register ({ commit }, formData) {
    commit('loading', true)
    return (
      fireAuth.createUserWithEmailAndPassword(formData.email, formData.password)
        .then(res => {
          // Write user to firebase
          const user = {
            authid: res.user.uid,
            firstname: formData.firstname,
            surname: formData.surname,
            email: formData.email,
            registeredMeetups: []
          }
          return (
            fireDb.collection("users").add(user)
              .then(function(docRef) {
                // Write user to state
                const newUser = { ...user, id: docRef.id }
                commit('clearError')
                commit('loadUser', newUser)
                commit('loading', false)
              })
              .catch(function(err) {
                commit('setError', err)
                commmit('loading', false)
                  console.error("Error adding document: ", err);
              })
          )
        })
        .catch(err => {
          commit('loading', false)
          commit('setError', err)
          console.error(err)
        })
    )
  },
  login ({ commit }, formData) {
    commit('loading', true)
    return (
      fireAuth.signInWithEmailAndPassword(formData.email, formData.password)
      .then(res => {
          // Read userdata with authid
          let user = {}
          const usersRef = fireDb.collection("users")
          const query =  usersRef.where("authid", "==", res.user.uid)
           return query.get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                user = {...doc.data(), id: doc.id}
              })
              commit('loading', false)
              commit('clearError')
              commit('loadUser', user)
            })
            .catch(err => {
              commit('loading', false)
              commit('setError', err)
              console.error(err)
            })
        })
        .catch(err => {
          commit('loading', false)
          commit('setError', err)
          console.error(err)
        })
    )
  },
  updateProfile ({ commit }, payload) {
    commit('loading', true)
    const userRef = fireDb.collection('users').doc(payload.userid)
    const setWithMerge = userRef.set({
      firstname: payload.formData.firstname,
      surname: payload.formData.surname,
    }, { merge: true })
  
    return setWithMerge
      .then(function() {
        console.log("Document successfully written!");
        commit('updateUser', payload.formData)
        commit('clearError')
        commit('loading', false)
      })
      .catch((err) => {
        commit('loading', false)
        commit('setError', err)
          console.error("Error writing document: ", err);
      });
  },
  clearError ({ commit }) {
    commit('clearError')
  }
}

export const getters = {
  error (state) {
    return state.error
  },
  user (state) {
    return state.user
  },
  isLoggedIn (state) {
    if (state.user.id) {
      return true
    } else {
      return false
    }
  }
}