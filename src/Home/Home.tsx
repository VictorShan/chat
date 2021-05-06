import { Jumbotron } from "react-bootstrap";
import styles from './Home.module.sass'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function Home() {
  const history = useHistory()
  return (
    <Jumbotron className={styles.hero}>
      <h1>Welcome to my Chat App!</h1>
      <Button>Get Started!</Button>
    </Jumbotron>
  )
}