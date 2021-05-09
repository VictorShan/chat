import * as express from "express";
import * as cors from "cors";
import authMiddleware, {Req} from "./firebaseAuth";
import {db} from "./firebase";

const app = express();
app.use(authMiddleware);
app.use(cors({origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chat App");
});

app.post("/createRoom", async (req: Req, res) => {
  if (req.user && req.body.room) {
    const docRef = db.collection("chats").doc();
    const userRef = db.collection("usersPrivate").doc(req.user.uid);
    const newListElement: ChatElement = {ref: docRef, name: req.body.name};
    try {
      docRef.set({
        name: req.body.name,
        users: {
          [req.user.uid]: {
            displayName: req.user.displayName,
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
      res.status(400).send(err);
    }
  } else {
    if (!req.user) {
      res.status(401).send("No user associated with this request");
    } else {
      res.status(400).send("No room name specified");
    }
  }
});

// app.post("/chat/:room/invite", (req, res) => {
//   if (req.params.room && req.body.uid) {}
// });

// body.message
app.post("/:room/post", async (req: Req, res) => {
  const room = req.params.room;
  const docRef = db.collection("chats").doc(room);
  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const data = doc.data() as ChatDoc;
      const uids = Object.keys(data.users);
      if (uids.includes(req.user?.uid || "")) {
        await docRef.update({
          messages: [
            ...data.messages,
            {
              uid: req.user?.uid || "Anonymous",
              message: req.body.message || "",
              time: FirebaseFirestore.Timestamp.now(),
            },
          ],
        });
      } else {
        res.status(400).send("Not part of chatroom");
      }
    } else {
      res.status(400).send("Chatroom not found");
    }
  } catch (err) {
    res.status(500).send("Failed to send message");
  }
});

export default app;

type DocRef = FirebaseFirestore
  .DocumentReference<FirebaseFirestore.DocumentData>

type ChatElement = {
  ref: DocRef
  name: string
}

type ChatDoc = {
  messages: Message[]
  name: string
  next?: DocRef
  prev?: DocRef
  users: {[uid: string]: User}
}

type User = {
  displayName: string
  role: "owner" | "moderator" | "user"
}

type Message = {
  message: string
  uid: string
  time: FirebaseFirestore.Timestamp
}
