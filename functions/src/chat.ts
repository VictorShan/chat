import * as express from 'express';
import * as cors from 'cors';
import authMiddleware, {Req} from './firebaseAuth';
import {db} from './firebase';

const app = express();
app.use(authMiddleware);
app.use(cors({origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chat App");
});

app.post("/chat/createRoom", async (req: Req, res) => {
  if (req.user && req.body.room) {
    const docRef = db.collection("chats").doc();
    const userRef = db.collection("usersPrivate").doc(req.user.uid);
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
        "chats.owner": [...ownerList, docRef],
      });
      res.send("Successfully created chatroom " + req.body.name);
    } catch (err) {
      docRef.delete();
      userRef.get()
        .then(doc => doc.data())
        .then(data => data?.chats.owner || [])
        .then(ownerList => userRef.update({"chats.owner": ownerList}))
        .catch(res.status(500).send);
      res.status(400).send(err);
    }
  } else {
    if (!req.user) {
      res.status(401).send("No user associated with this request")
    } else {
      res.status(400).send("No room name specified")
    }
  }
});

// app.post("/chat/:room/invite", (req, res) => {
//   if (req.params.room && req.body.uid) {}
// });

app.post("/chat/:room/post", (req, res) => {
  const room = req.params.room;
  if (room) {

  }
});

export default app