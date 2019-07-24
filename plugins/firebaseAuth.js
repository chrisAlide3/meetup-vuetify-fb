import { fireAuth, fireDb } from '~/plugins/firebase.js'

export default (context => {
  fireAuth.onAuthStateChanged(function(user) {
    // console.log('context: ', context)
    if (user) {
      // Set state user object
      if (!context.store.getters.user) {
        let signedInUser = ''
        const authId = user.uid
        return fireDb.collection('users').where('authid', "==", authId).get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                signedInUser = {...doc.data(), id: doc.id}
              })
            context.store.commit('loadUser', signedInUser)
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          })      

      }
    } else if (context.store.getters.user){
      console.log('not signed in')
      context.store.dispatch('logout')
    }
  })
})
