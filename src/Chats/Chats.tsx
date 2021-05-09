import { useEffect, useState } from "react"
import { useAuth, useFirestore } from "reactfire"
import firebase from 'firebase/app'
import 'firebase/firestore'
import { useHistory } from "react-router-dom"


export default function Chats() {
  const auth = useAuth()
  const db = useFirestore()
  const [chats, setChats] = useState<Chat[]>([])
  const history = useHistory()

  useEffect(() => {
    if (auth.currentUser) {
      const docRef = db.collection('usersPrivate').doc(auth.currentUser.uid)
      docRef.onSnapshot(doc => {
        const docData = doc.data() as UserPrivateData
        const chatData = docData.chats
        console.log("Snapshot")
        setChats([...(chatData.owner), ...(chatData.moderator), ...(chatData.user)])
      })
    }
  }, [auth.currentUser, db])

  return (
    <main>
      <h1>Chats</h1>
      {/* Get chats from firestore */}
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
  ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
}