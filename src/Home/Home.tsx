import { Jumbotron } from "react-bootstrap";
import styles from './Home.module.sass'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function Home() {
  const history = useHistory()
  return (
    <Jumbotron>
      <h1 className={styles.title}>Welcome to my Chat App!</h1>
      <Button onClick={() => history.push('/')}>Get Started!</Button>
    </Jumbotron>
  )
}