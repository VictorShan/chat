import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import styles from './SignInUp.module.sass'

export default function SignInUp() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Tabs>
          <Tab eventKey="signIn" title="Sign In">
              <SignIn />
          </Tab>
          <Tab eventKey="signUp" title="Sign Up">
              <SignUp />
          </Tab>
        </Tabs>
      </main>
    </div>
  )
}