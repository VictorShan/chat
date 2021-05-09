import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useFirestore, useUser } from "reactfire"
import { Timestamp, User } from "../utils/firebaseUtils"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styles from './ChatRoom.module.sass'
import { postRequest } from "../utils/authFetch"

const API_URL = process.env.NODE_ENV === "development" ?
    "http://localhost:5001/serverless-chat-3240c/us-central1/api/" :
    "https://us-central1-serverless-chat-3240c.cloudfunctions.net/api/"
export default function ChatRoom() {
  // @ts-ignore
  let { room } = useParams()
  const user = useUser()
  const db = useFirestore()
  const docRef = db.collection('chats').doc(room)
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<{[uid: string]: Participant}>({})
  const [newMsg, setNewMsg] = useState("")

  useEffect(() => {
    if (user.data) {
      try {
        const unsubscribe = docRef.onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data() as ChatData
            setUsers(data.users)
            setMessages(oldMsgs => data.messages as Message[] || [])
            console.log("snap")
          }
        })
        console.log(user.data.uid)
        return unsubscribe
      } catch (err) {
        console.error("Error:", err)
      }
    }
  }, [])
  return (
    <main>
      <section>
        <h1>ChatRoom: {room}</h1>
        <ul>
          {messages.map((msg, i) => {
            return (
              <li key={i} className={styles.message}>
                <span className={styles.name}>{users[msg.uid].displayName}: </span>
                {msg.message}
                <span className={styles.time}>{msg.time.toDate().toDateString()}</span>
              </li>
            )
          })}
        </ul>
        <hr/>
        <Form className={styles.form}>
          <Form.Control
            onChange={e => setNewMsg(e.currentTarget.value)}
            value={newMsg}/>
          <Button onClick={() => postRequest(genUrl(room), user.data, {newMsg})}>
            Submit
          </Button>
        </Form>
      </section>
    </main>
  )
}

function genUrl(room: string): string {
  return API_URL + room + "/post"
}

type ChatData = {
  name: string
  messages: Message[]
  users: {
    [uid: string]: Participant
  }
}

type Message = {
  uid: string
  message: string
  time: Timestamp
}

type Participant = {
  displayName: string
  role: "owner" | "moderator" | "user"
}