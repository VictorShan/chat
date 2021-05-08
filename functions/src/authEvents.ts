import {auth} from "firebase-admin";
import {db} from "./firebase";

export const createUser = async (user: auth.UserRecord): Promise<string> => {
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
          uid: user.uid,
          chats: {
            moderator: [],
            owner: [],
            user: [],
          },
          email: user.email,
        });
    return "Deleted user: " + user.email;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteUser = async (user: auth.UserRecord): Promise<string> => {
  try {
    const publicUser = db.collection("users").doc(user.uid).delete();
    const privateUser = db.collection("usersPrivate").doc(user.uid).delete();
    await Promise.all([publicUser, privateUser]);
    return "Deleted user";
  } catch (err) {
    return err;
  }
};
