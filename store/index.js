import * as firebase from 'firebase'

export const state = () => ({
  user: {},
  error: ''
})

export const mutations = {
  loadUser (state, user) {
    state.user = user
  },
  setError (state, error) {
    state.error = error
  }
}

export const actions = {
  register ({ commit }, formData) {
    return (
      firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password)
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
            firebase.firestore().collection("users").add(user)
              .then(function(docRef) {
                // Write user to state
                const newUser = { ...user, id: docRef.id }
                commit('setError', '')
                commit('loadUser', newUser)
              })
              .catch(function(err) {
                commit('setError', err.code)
                  console.error("Error adding document: ", err);
              })
          )
        })
        .catch(err => {
          commit('setError', err.code)
          console.error(err)
        })
    )
  },
  login ({ commit }, formData) {
    return (
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
        .then(res => {
          // Read userdata with authid
          let user = {}
          const usersRef = firebase.firestore().collection("users")
          const query =  usersRef.where("authid", "==", res.user.uid)
           return query.get()
            .then(function (querySnapshot) {
              // commit('loadUser', user)
              querySnapshot.forEach(function (doc) {
                user = {...doc.data(), id: doc.id}
              })
              commit('setError', '')
              commit('loadUser', user)
            })
            .catch(err => console.error(err))
        })
        .catch(err => {
          commit('setError', err.code)
          console.error('Invalid login', err)
        })
    )
  }
}

export const getters = {
  error (state) {
    return state.error
  },
  user (state) {
    return state.user
  }
}