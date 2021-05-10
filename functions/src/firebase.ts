import * as admin from "firebase-admin";

admin.initializeApp();
export const db = admin.firestore();
export type DocRef = admin.firestore.DocumentReference;
export type Timestamp = admin.firestore.Timestamp;
export const timestamp = admin.firestore.Timestamp.now;

export type ChatElement = {
  ref: DocRef
  name: string
}

export type ChatDoc = {
  messages: Message[]
  name: string
  next?: DocRef
  prev?: DocRef
  users: MessageUsers
}

export type MessageUsers = {
  [uid: string]: MessageUser
}

export type MessageUser = {
  displayName: string
  role: "owner" | "moderator" | "user"
}

export type Message = {
  message: string
  uid: string
  time: Timestamp
}

export type UserDoc = {
  displayName: string
  photoUrl: string
  uid: string
}

export type UserPrivateDoc = {
  chats: {
    moderator: ChatElement[]
    owner: ChatElement[]
    user: ChatElement[]
    invited: ChatElement[]
  }
  email: string
  uid: string
}