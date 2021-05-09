import * as admin from "firebase-admin";

admin.initializeApp();
export const db = admin.firestore();
export type DocRef = admin.firestore.DocumentReference;
export type Timestamp = admin.firestore.Timestamp;
export const timestamp = admin.firestore.Timestamp.now;
