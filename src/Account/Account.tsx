import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useHistory } from "react-router-dom"
import { useAuth } from "reactfire"
import styles from './Account.module.sass'
import { useState } from "react"

export default function Account() {
  const history = useHistory()
  const auth = useAuth()
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "")
  if (auth.currentUser){
    const user = auth.currentUser
    const updateDisplayName = () => {
      console.log("ran profile update")
      user.updateProfile({ displayName })
    }
    const update = () => {
      console.log("ran update")
      updateDisplayName()
    }
    return (
      <main>
      <h1>Account</h1>
      <Form>
        <Form.Group controlId="displayName">
          <Form.Label>Display Name</Form.Label>
          <Form.Control
            name="displayName"
            type="text"
            placeholder={"Display Name"}
            onChange={e => setDisplayName(e.currentTarget.value)}
            value={displayName}/>
        </Form.Group>
        {/* <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Email" value={user.email || ""}/>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="passwordVerify">
          <Form.Label>Verify Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group> */}
        <Button
          className={styles.submitBtn}
          onClick={update}>
          Submit
        </Button>
      </Form>
    </main>
    )
  } else {
    history.push("/signIn")
    return (<></>)
  }
}