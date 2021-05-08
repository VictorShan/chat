import { useState } from "react"
import { useAuth, useFirestore } from "reactfire"
import firebase from 'firebase/app'
import 'firebase/firestore'


export default function Chats() {
  const auth = useAuth()
  const db = useFirestore()
  const [chats, setChats] = useState<Chat[]>([])
  if (auth.currentUser) {
    db.collection('userPrivate')
      .doc(auth.currentUser.uid)
      .get()
      .then(doc => (doc.data() || emptyUserPrivateData) as UserPrivateData)
      .then(data => {
        setChats([...(data.chats.owner), ...(data.chats.moderator), ...(data.chats.user)])
      })

  }
  return (
    <main>
      <h1>Chats</h1>
      {/* Get chats from firestore */}
      <ul>
        {chats.map(chat => (
          <li id={chat.ref.id}>{chat.name}</li>
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
  ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
}

const emptyUserPrivateData = {
  chats: {
    owner: [],
    moderator: [],
    user: []
  }
}