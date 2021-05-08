import * as functions from "firebase-functions";
import { createUser, deleteUser } from "./authEvents";
import msgs from './chat'

export const api = functions.https.onRequest(msgs);
export const createUserDoc = functions.auth.user().onCreate(createUser);
export const deleteUserDoc = functions.auth.user().onDelete(deleteUser);