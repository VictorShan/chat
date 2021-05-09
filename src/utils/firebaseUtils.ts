import {
  // preloadFirestoreDoc,
  // preloadUser,
  // preloadAuth,
  preloadFirestore,
  // preloadDatabase,
  // preloadStorage,
  // preloadRemoteConfig
} from 'reactfire';
import firebase from 'firebase/app'

const preloadSDKs = (firebaseApp: firebase.app.App) => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup: firestore => {
        if (process.env.NODE_ENV === "development")
          firestore().useEmulator("localhost", 8080)
        return firestore().enablePersistence()
      },
    }),
    // preloadAuth({
    //   firebaseApp,
    //   setup: auth => {
    //     if (process.env.NODE_ENV === "development")
    //       auth().useEmulator("localhost:9099")
    //   },
    // }),
  ])
}

export default preloadSDKs
export type Timestamp = firebase.firestore.Timestamp
export type User = firebase.User