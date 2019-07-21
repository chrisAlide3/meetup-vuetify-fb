// import * as firebase from 'firebase'
import { fireAuth, fireDb, fireStorage } from '~/plugins/firebase.js'


export const state = () => ({
  user: {},
  loading: [],
  error: null
})

export const mutations = {
  loadUser (state, user) {
    state.user = user
  },
  updateUser ( state, formData) {
    state.user.firstname = formData.firstname
    state.user.surname = formData.surname
    state.user.imgUrl = formData.imgUrl
    state.user.imgName = formData.imgName
  },
  clearUserImageFields (state) {
    state.user.imgUrl = ''
    state.user.imgName = ''
  },

  setError (state, error) {
    state.error = error
  },
  clearError (state) {
    state.error = null
  },
  loading (state, element) {
    // state.loading = payload
    state.loading.push(element)
  },
  clearLoading (state) {
    state.loading = []
  }
}

export const actions = {
  register ({ commit }, formData) {
    let key = ''
    let imageUrl = ''
    let imageName = ''

    return (
      fireAuth.createUserWithEmailAndPassword(formData.email, formData.password)
        .then(res => {
          // Write user to firebase
          const user = {
            authid: res.user.uid,
            firstname: formData.firstname,
            surname: formData.surname,
            imgUrl: '',
            imgName: '',
            email: formData.email,
            registeredMeetups: []
          }
          return (
            fireDb.collection("users").add(user)
              .then(function(docRef) {
                // Write user to state
                const newUser = { ...user, id: docRef.id }
                key = docRef.id
                // Upload image to firestore
                if (formData.image) {
                  console.log('image found')
                  const name = formData.image.name
                  const ext = name.slice(name.lastIndexOf('.'))
                  const ref = fireStorage.ref('users/' + docRef.id + ext)
                  return ref.put(formData.image)
                    .then(snapshot => {
                      console.log('image uploaded')
                      console.log(snapshot.metadata)
                      imageName = snapshot.metadata.name
                      return snapshot.ref.getDownloadURL()
                        .then(downloadURL => {
                          imageUrl = downloadURL
                          console.log('imageUrl: ', imageUrl)
                          const userRef = fireDb.collection('users').doc(key)
                          const setWithMerge = userRef.set({
                            imgUrl: imageUrl,
                            imgName: imageName
                          }, { merge: true })
                          return setWithMerge
                            .then(() => {
                              newUser.imgUrl = imageUrl
                              newUser.imgName = imageName
                              console.log('Image URL updated')
                              commit('clearError')
                              commit('loadUser', newUser)
                            })
                            .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                } else {
                  commit('clearError')
                  commit('loadUser', newUser)
                }
              })
              .catch(function(err) {
                commit('setError', err)
                  console.error("Error adding document: ", err);
              })
          )
        })
        .catch(err => {
          commit('setError', err)
          console.error(err)
        })
    )
  },
  login ({ commit }, formData) {
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
              commit('clearError')
              commit('loadUser', user)
            })
            .catch(err => {
              commit('setError', err)
              console.error(err)
            })
        })
        .catch(err => {
          commit('setError', err)
          console.error(err)
        })
    )
  },
  updateProfile ({ commit }, payload) {
    console.log(payload)
    let imageUrl = ''
    let imageName = ''
    if (payload.formData.image) {
      // Upload image
      console.log('image found')
      const name = payload.formData.image.name
      const ext = name.slice(name.lastIndexOf('.'))
      const ref = fireStorage.ref('users/' + payload.userid + ext)
      return ref.put(payload.formData.image)
        .then(snapshot => {
          console.log('image uploaded')
          imageName = snapshot.metadata.name
          return snapshot.ref.getDownloadURL()
            .then(downloadURL => {
              imageUrl = downloadURL
              console.log('imageName imageUrl: ',imageName + '/' + imageUrl)
              const userRef = fireDb.collection('users').doc(payload.userid)
              const setWithMerge = userRef.set({
                firstname: payload.formData.firstname,
                surname: payload.formData.surname,
                imgUrl: imageUrl,
                imgName: imageName
              }, { merge: true })
            
              return setWithMerge
                .then(function() {
                  payload.formData.imgUrl = imageUrl
                  payload.formData.imgName = imageName
                  console.log('formData.imgUrl/imgName: ', payload.formData.imgUrl + '/' + payload.formData.imgName)
                  console.log("Document successfully written!");
                  commit('updateUser', payload.formData)
                  commit('clearError')
                })
                .catch((err) => {
                  commit('setError', err)
                    console.error("Error writing document: ", err);
                })
            })
          })
    } else {
      imageUrl = payload.formData.imgUrl
      imageName = payload.formData.imgName
    }
    console.log('imageName imageUrl: ',imageName + '/' + imageUrl)
    const userRef = fireDb.collection('users').doc(payload.userid)
    const setWithMerge = userRef.set({
      firstname: payload.formData.firstname,
      surname: payload.formData.surname,
      imgUrl: imageUrl,
      imgName: imageName
    }, { merge: true })
  
    return setWithMerge
      .then(function() {
        payload.formData.imgUrl = imageUrl
        payload.formData.imgName = imageName
        console.log('formData.imgUrl/imgName: ', payload.formData.imgUrl + '/' + payload.formData.imgName)
        console.log("Document successfully written!");
        commit('updateUser', payload.formData)
        commit('clearError')
      })
      .catch((err) => {
        commit('setError', err)
          console.error("Error writing document: ", err);
      })
  },
  removeImage ({ commit }, payload) {
    // Create a reference to the file to delete
    const ref = fireStorage.ref('users/' + payload.imgName)
    // Delete the file
    return ref.delete()
      .then(function() {
        console.log('image deleted')
        // Clear image fields on user
        const userRef = fireDb.collection('users').doc(payload.userid)
        const setWithMerge = userRef.set({
          imgUrl: '',
          imgName: ''
        }, { merge: true })
      
        return setWithMerge
          .then(function() {
            commit('clearUserImageFields')
          })
          .catch((err) => {
            console.error("Error clearing image fields: ", err);
          })
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  clearError ({ commit }) {
    commit('clearError')
  },
  loading ( {commit }, element) {
    commit('loading', element)
  },
  clearLoading ({ commit }) {
    commit('clearLoading')
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
  },
  loading (state) {
    return state.loading
  }
}