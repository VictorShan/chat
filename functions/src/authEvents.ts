import {auth} from 'firebase-admin';
import {db} from './firebase';

export const createUser = async (user: auth.UserRecord) => {
  try {
    await db.collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        displayName: user.displayName,
        photoUrl: user.photoURL,
      });
    await db.collection("usersPrivate")
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
    return "Deleted user: " + user.email
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const deleteUser = (user: auth.UserRecord) => {
  db.collection("users").doc(user.uid).delete();
  db.collection("usersPrivate").doc(user.uid).delete();
};