import { fireAuth, fireDb } from '~/plugins/firebase.js'

export default (context => {
  fireAuth.onAuthStateChanged(function(user) {
    if (user) {
      console.log('plugin firebaseAuth SignedIn')
      user.getIdToken()
        .then(token => {
          // Remove old cookies
          if (context.app.$cookies.get('userId') != undefined) {
            context.app.$cookies.remove('userId')
          }
          if (context.app.$cookies.get('idToken') != undefined) {
            context.app.$cookies.remove('idToken')
          }
          // Set new cookies
          context.app.$cookies.set('userId', user.uid, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365
          })
          context.app.$cookies.set('idToken', token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365
          })
          // Set state user object
          if (context.store.getters.user == '') {
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
                  console.log("Error getting user documents: ", error);
              })
          }
        })
        .catch(err => {
          console.error("No token!")
        })
    
    // On logout
    } else if (context.store.getters.user != ''){
      console.log('plugin firebaseAuth SignedOut')
      // Remove cookie
      if (context.app.$cookies.get('userId') != undefined) {
        context.app.$cookies.remove("userId")
      }
      if (context.app.$cookies.get('idToken') != undefined) {
        context.app.$cookies.remove('idToken')
      }
      // Logout user in store
      context.store.dispatch('logoutUser')
    }
  })
})
