import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useFirestore, useUser } from "reactfire"
import { Timestamp, User } from "../utils/firebaseUtils"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import styles from './ChatRoom.module.sass'

const API_URL = "https://us-central1-serverless-chat-3240c.cloudfunctions.net/api/"
// const API_URL = "http://localhost:5001/serverless-chat-3240c/us-central1/api/"
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
    if (user.status === "success") {
      try {
        docRef.onSnapshot(doc => {
          const data = doc.data() as ChatData
          setUsers(data.users)
          setMessages(oldMsgs => data.messages as Message[] || [])
        })
      } catch (err) {
        console.error("Error:", err)
      }
    }
  }, [user.status, docRef])
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
          <Button onClick={() => postMessage(genUrl(room), user.data, newMsg)}>
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
async function postMessage(url: string, user: User, message: string) {
  return await fetch(
    url,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await user.getIdToken(),
      },
      body: JSON.stringify({message}),
    }
  )
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