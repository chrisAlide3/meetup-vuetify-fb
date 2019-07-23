// import * as firebase from 'firebase'
import { fireAuth, fireDb, fireStorage } from '~/plugins/firebase.js'


export const state = () => ({
  user: {},
  meetups: [],
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
  addMeetup (state, meetup) {
    state.meetups.push(meetup)
  },
  updateMeetup (state, formData) {
    const index = state.meetups.findIndex(i => i.id == formData.id)
    if (index >= 0) {
      state.meetups[index] = formData
    }
  },
  clearMeetupImageFields (state, meetupId) {
    const index = state.meetups.findIndex(i => i.id == meetupId)
    if (index >= 0) {
      state.meetups[index].imgName = ''
      state.meetups[index].imgUrl = ''
    }
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
  updateProfile ({ commit, dispatch }, payload) {
    // When new image uploaded
    if (payload.formData.image) {
      // Upload image and update user with imgName and imgUrl
      const name = payload.formData.image.name
      const ext = name.slice(name.lastIndexOf('.'))
      const ref = fireStorage.ref('users/' + payload.userid + ext)
      return ref.put(payload.formData.image)
        .then(snapshot => {
          console.log('image uploaded')
          payload.formData.imgName = snapshot.metadata.name
          return snapshot.ref.getDownloadURL()
            .then(downloadURL => {
              payload.formData.imgUrl = downloadURL
              dispatch('updateUser', payload)
                .then(() => {
                  console.log('User updated')
                })
            })
          })
    }
    // When no new image uploaded
    dispatch('updateUser', payload)
      .then(() => {
        console.log('User updated')
      })
      .catch(err => console.error(err))
  },
  updateUser ({ commit }, payload) {
    const userRef = fireDb.collection('users').doc(payload.userid)
    const setWithMerge = userRef.set({
      firstname: payload.formData.firstname,
      surname: payload.formData.surname,
      imgUrl: payload.formData.imgUrl,
      imgName: payload.formData.imgName
    }, { merge: true })
    return setWithMerge
      .then(function() {
        commit('updateUser', payload.formData)
        commit('clearError')
      })
      .catch((err) => {
        commit('setError', err)
          console.error("Error writing document: ", err);
      })
  },
  removeUserImage ({ commit }, payload) {
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
  addMeetup ({ commit }, payload) {
    return fireDb.collection('meetups').add(payload.formData)
        .then(function(docRef) {
            payload.formData.id = docRef.id
            // Upload image if available
            if (payload.image) {
              const name = payload.image.name
              const ext = name.slice(name.lastIndexOf('.'))
              const ref = fireStorage.ref('meetups/' + payload.formData.id + ext)
              return ref.put(payload.image)
                .then(snapshot => {
                  payload.formData.imgName = snapshot.metadata.name
                  return snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                      payload.formData.imgUrl = downloadURL
                      // Update meetup with uploaded image data
                      return fireDb.collection('meetups').doc(payload.formData.id).set({
                        imgName: payload.formData.imgName,
                        imgUrl: payload.formData.imgUrl
                      }, { merge: true })
                        .then(() => {
                          commit('addMeetup', payload.formData)
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
            // Add meetup when no images
            } else {
              console.log('enter no payload.image')
              commit('addMeetup', payload.formData)
            }            
        })
        .catch(function(error) {
            console.error("Error writing document: ", error)
        })
  },
  updateMeetup ({ commit }, payload) {
    if (payload.image) {
      // Image to upload
      const name = payload.image.name
      const ext = name.slice(name.lastIndexOf('.'))
      const ref = fireStorage.ref('meetups/' + payload.meetupId + ext)
      return ref.put(payload.image)
        .then(snapshot => {
          payload.formData.imgName = snapshot.metadata.name
          return snapshot.ref.getDownloadURL()
            .then(downloadURL => {
              payload.formData.imgUrl = downloadURL
              // Update meetup with uploaded image data
              return fireDb.collection('meetups').doc(payload.meetupId).set(payload.formData, { merge: true })
                .then(() => {
                  payload.formData.id = payload.meetupId
                  commit('updateMeetup', payload.formData)
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))   
    } else {
      // No image to upload
      return fireDb.collection('meetups').doc(payload.meetupId).set(payload.formData, { merge: true })
        .then(() => {
          payload.formData.id = payload.meetupId
          commit('updateMeetup', payload.formData)
        })
        .catch(err => console.log(err))
    }
  },
  removeMeetupImage ({ commit }, payload) {
    // Create a reference to the file to delete
    const ref = fireStorage.ref('meetups/' + payload.imgName)
    // Delete the file
    return ref.delete()
      .then(function() {
        // Clear image fields on meetup
        const userRef = fireDb.collection('meetups').doc(payload.meetupId)
        const setWithMerge = userRef.set({
          imgUrl: '',
          imgName: ''
        }, { merge: true })
      
        return setWithMerge
          .then(function() {
            commit('clearMeetupImageFields', payload.meetupId)
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