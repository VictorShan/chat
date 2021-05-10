import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useFirestore, useUser } from "reactfire"
import { Timestamp } from "../utils/firebaseUtils"
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
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<{[uid: string]: Participant}>({})
  const [newMsg, setNewMsg] = useState("")
  const [roomName, setRoomName] = useState(room)

  useEffect(() => {
    if (user.data) {
      try {
        const docRef = db.collection('chats').doc(room)
        const unsubscribe = docRef.onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data() as ChatData
            setUsers(data.users)
            setMessages(oldMsgs => data.messages as Message[] || [])
            setRoomName(data.name)
          }
        })
        return unsubscribe
      } catch (err) {
        console.error("Error:", err)
      }
    }
  }, [user.data, room, db])

  const makeRequest = () => {
    if (!newMsg) return
    postRequest(genUrl(room), user.data, {message: newMsg})
        .then(() => setNewMsg(""))
        .catch(err => console.error("Failed to make room:", err))
  }
  return (
    <main>
      <section>
        <header className={styles.header}>
          <h1>ChatRoom: {roomName}</h1>
          <Button variant="outline-primary">Invite</Button>
        </header>
        <ul className={styles.messages}>
          {messages.map((msg, i) => {
            return (
              <li key={i} className={styles.message}>
                <span className={styles.name}>{users[msg.uid].displayName}: </span>
                {msg.message}
                <span className={styles.time}>{formatDate(msg.time.toDate())}</span>
              </li>
            )
          })}
        </ul>
        <hr/>
        <Form className={styles.form}>
          <Form.Control
            onChange={e => setNewMsg(e.currentTarget.value)}
            value={newMsg}/>
          <Button onClick={makeRequest}>
            Submit
          </Button>
        </Form>
      </section>
    </main>
  )
}

function formatDate(date: Date): string {
  if ((new Date()).toLocaleDateString() !== date.toLocaleDateString()) {
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    }
    return (
      date.toLocaleTimeString(undefined, timeOptions) +
      ", " +
      date.toLocaleDateString(undefined, dateOptions)
    )
  }
  return date.toLocaleTimeString()
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