import * as functions from "firebase-functions";
import msgs from './chat'

export const api = functions.https.onRequest(msgs);