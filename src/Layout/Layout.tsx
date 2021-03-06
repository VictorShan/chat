import NavBar from "./NavBar/NavBar"
import { FirebaseAppProvider } from 'reactfire'
import Container from 'react-bootstrap/Container'
import styles from './Layout.module.sass'
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyAKLRDQ3-XaX7PPRsEiHXSsh_f-_JI980w",
  authDomain: "serverless-chat-3240c.firebaseapp.com",
  projectId: "serverless-chat-3240c",
  storageBucket: "serverless-chat-3240c.appspot.com",
  messagingSenderId: "726165478026",
  appId: "1:726165478026:web:55f8fadf71079b9bd96b73",
  measurementId: "G-RV2619SG68"
};
const app = firebase.initializeApp(firebaseConfig)
// app.firestore().useEmulator("localhost", 8080)
if (process.env.NODE_ENV === "development")
  app.auth().useEmulator("http://localhost:9099/")


type props = {
  children?: JSX.Element | JSX.Element[]
}
export default function Layout({ children }: props) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <NavBar />
      <Container fluid="sm" className={styles.container}>
        {children}
      </Container>
    </FirebaseAppProvider>
  )
}