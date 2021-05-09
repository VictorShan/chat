import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useFirestore, useUser } from "reactfire"
import { Timestamp } from "../utils/firebaseUtils"


export default function ChatRoom() {
  // @ts-ignore
  let { room } = useParams()
  const user = useUser()
  const db = useFirestore()
  const docRef = db.collection('chats').doc(room)
  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    try {
      docRef.onSnapshot(doc => {
        console.log(doc.data())
        setMessages(oldMsgs => doc.data()?.messages as Message[] || oldMsgs)
      })
    } catch (err) {
      console.error("Error:", err)
    }
  }, [user.status])
  return (
    <main>
      <section>
        <h1>ChatRoom: {room}</h1>
        <ul>
          {messages.map((msg, i) => {
            return (
              <li key={i}>
                <span>{msg.message}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

type Message = {
  uid: string
  message: string
  time: Timestamp
}