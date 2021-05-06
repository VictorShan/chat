import * as express from 'express';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import authMiddleware from './firebaseAuth';

admin.initializeApp();
const app = express();
app.use(authMiddleware);
app.use(cors({origin: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chat App");
});

app.post("/chat/:room", (req, res) => {
  const room = req.params.room;
  if (room) {

  }
});

export default app