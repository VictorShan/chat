import { useEffect, useState } from "react"
import { useUser, useFirestore } from "reactfire"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
// import firebase from 'firebase/app'
import 'firebase/firestore'
import { useHistory } from "react-router-dom"
import { DocRef } from "../utils/firebaseUtils"
import { postRequest } from "../utils/authFetch"

const API_URL = process.env.NODE_ENV === "development" ?
    "http://localhost:5001/serverless-chat-3240c/us-central1/api/createRoom" :
    "https://us-central1-serverless-chat-3240c.cloudfunctions.net/api/createRoom"

export default function Chats() {
  const user = useUser()
  const db = useFirestore()
  const [chats, setChats] = useState<Chat[]>([])
  const [chatName, setChatName] = useState("")
  const history = useHistory()

  useEffect(() => {
    if (user.data) {
      const docRef = db.collection('usersPrivate').doc(user.data.uid)
      const unsubscribe = docRef.onSnapshot(doc => {
        const docData = doc.data() as UserPrivateData
        const chatData = docData.chats
        setChats([...(chatData.owner), ...(chatData.moderator), ...(chatData.user)])
      })
      console.log(user.data.getIdToken())
      return unsubscribe
    }
  }, [user.status, db])

  return (
    <main>
      <h1>Chats</h1>
      <Form>
        <Form.Group controlId="displayName">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            name="displayName"
            type="text"
            placeholder={"Display Name"}
            onChange={e => setChatName(e.currentTarget.value)}
            value={chatName}/>
        </Form.Group>
        <Button
          onClick={() => postRequest(API_URL, user.data, {name: chatName})}>
          Create Chat
        </Button>
      </Form>
      <ul>
        {chats.map(chat => (
          <li id={chat.ref.id} onClick={() => history.push('/chat/' + chat.ref.id)}>
            {chat.name}
          </li>
        ))}
      </ul>
    </main>
  )
}

type UserPrivateData = {
  chats: {
    owner: Chat[]
    moderator: Chat[]
    user: Chat[]
  }
}

type Chat = {
  name: string,
  ref: DocRef
}