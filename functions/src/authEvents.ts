import * as admin from 'firebase-admin'
import { auth } from 'firebase-admin'

const db = admin.firestore()

export const createUser = (user: auth.UserRecord) => {
  db.collection("users")
    .doc(user.uid)
    .set({
      uid: user.uid,
      displayName: user.displayName,
      photoUrl: user.photoURL,
    });
  db.collection("usersPrivate")
    .doc(user.uid)
    .set({
      uid: user,
      chats: {
        moderator: [],
        owner: [],
        user: [],
      },
      email: user.email,
    });
}

export const deleteUser = (user: auth.UserRecord) => {
  db.collection("users").doc(user.uid).delete();
  db.collection("usersPrivate").doc(user.uid).delete();
};