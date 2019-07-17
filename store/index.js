import * as firebase from 'firebase'

export const state = () => ({
  user: {}
})

export const mutations = {
  setUser (state, user) {
    state.user = user
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
            email: formData.email
          }
          return (
            firebase.firestore().collection("users").add(user)
              .then(function(docRef) {
                // Write user to state
                const newUser = { ...user, id: docRef.id, registeredMeetups: []}
                commit('setUser', newUser)
              })
              .catch(function(error) {
                  console.error("Error adding document: ", error);
              })
          )
        })
        .catch(err => console.log(err))
    )
  },
  login ({ commit }, formData) {
    return (
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
        .then(res => {
          // Read userdata
          
          const user = {
            id: res.user.uid,
            registeredMeetups: []
          }
          commit('setUser', user)
        })
        .catch(err => console.log(err))
    )
  }

}

export const getters = {

}