import * as express from "express";
import * as cors from "cors";
import authMiddleware, {Req} from "./firebaseAuth";
import {
  ChatDoc,
  ChatElement,
  db,
  DocRef,
  MessageUsers,
  timestamp,
  UserPrivateDoc
} from "./firebase";

const app = express();
app.use(cors({origin: true}));
app.use(authMiddleware);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chat App");
});

app.post("/createRoom", async (req: Req, res) => {
  const user = req.user || req.body.user;
  if (user && req.body.name) {
    const docRef = db.collection("chats").doc();
    const userRef = db.collection("usersPrivate").doc(user.uid);
    const newListElement: ChatElement = {ref: docRef, name: req.body.name};
    try {
      docRef.set({
        name: req.body.name,
        users: {
          [user.uid]: {
            displayName: user.displayName || user.email || user.uid,
            role: "owner",
          },
        },
        messages: [],
      });
      const userDoc = await userRef.get();
      const ownerList = userDoc.data()?.chats.owner || [];
      userRef.update({
        "chats.owner": [...ownerList, newListElement],
      });
      res.send("Successfully created chatroom " + req.body.name);
    } catch (err) {
      docRef.delete();
      userRef.get()
          .then((doc) => doc.data())
          .then((data) => (data?.chats.owner || []) as ChatElement[])
          .then((ownerList) => userRef.update({
            "chats.owner": ownerList.filter((item) => item !== newListElement),
          })).catch(res.status(500).send);
      res.status(400)
          .send(`Could not create ${req.body.name} from ${user.uid}. ${err}`);
    }
  } else {
    if (user) {
      res.status(401).send("No user associated with this request");
    } else {
      res.status(400).send("No room name specified");
    }
  }
});

app.post("/chat/invite", async (req: Req, res) => {
  const user = req.user || req.body.user;
  const uid = req.body.uid;
  const room = req.body.roomId;
  const roomName = req.body.roomName;
  const chatRef = db.collection("chats").doc(room);
  const userRef = db.collection("usersPrivate").doc(uid);
  try {
    if (!uid) {
      res.status(400).send("No uid to invite.");
    } else {
      const chat = await chatRef.get();
      const invitee = await userRef.get();
      if (!chat.exists) {
        res.status(400).send(`Room ${room} does not exist.`)
      } else if (!invitee.exists) {
        res.status(400).send(`User ${uid} does not exist.`)
      } else {
        const chatData = chat.data() as ChatDoc;
        const userData = invitee.data() as UserPrivateDoc;
        if (
            checkShouldInvite(chatRef, user.uid, uid, chatData.users, userData)
          ) {
          const newChat: ChatElement = {
            name: roomName,
            ref: chatRef,
          };
          userRef.update({
            "chats.invited": [...userData.chats.invited, newChat],
          });
        } else {
          res.status(400).send("Insufficent permissions or already invited.");
        }
      }
    }
  } catch (err) {
    res.status(500).send(`Failed to invite ${uid} to ${room}, ${err}`);
  }
});

/**
 * Evaluates whether a user can be invited by checking if the
 * inviter can invite, invitee is not already in the chat, and
 * the invitee does not already have an invite.
 * @param room The reference to the firestore document
 * @param inviterId The id of the user inviting
 * @param inviteeId The id of the user being invited
 * @param users The users currently in the chat
 * @param userData The private userdata of the person being invited
 * @returns True if the invitee can be invited
 */
function checkShouldInvite(
    room: DocRef,
    inviterId: string,
    inviteeId: string,
    users: MessageUsers,
    userData: UserPrivateDoc): boolean {
  const inviterRole = users[inviterId].role;
  const canInvite = inviterRole === "owner" || inviterRole === "moderator";
  const invites = userData.chats.invited
  const hasInvite = invites.filter((chat) => chat.ref === room).length === 1
  const notInChat = !users[inviteeId];
  return canInvite && notInChat && !hasInvite;
}

app.post("/acceptInvite", async (req, res) => {});

// body.message
app.post("/:room/post", async (req: Req, res) => {
  const user = req.user || req.body.user;
  const room = req.params.room;
  const docRef = db.collection("chats").doc(room);
  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data() as ChatDoc;
      const uids = Object.keys(data.users);
      if (uids.includes(user.uid || "")) {
        await docRef.update({
          messages: [
            ...data.messages,
            {
              uid: user.uid || "Anonymous",
              message: req.body.message || "",
              time: timestamp(),
            },
          ],
        });
        res.send("Sucessfully sent message from " + user.uid);
      } else {
        res.status(400).send("Not part of chatroom");
      }
    } else {
      res.status(400).send("Chatroom not found");
    }
  } catch (err) {
    res.status(500)
        .send(`Could not post ${req.body.message} for ${user.uid}. ${err}`);
  }
});

export default app;
