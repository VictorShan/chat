import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import { useUser, useAuth } from "reactfire";
import { Dropdown, DropdownButton } from "react-bootstrap";
import styles from './NavBar.module.sass'
export default function NavBar() {
  const auth = useAuth()
  const { data: user } = useUser()
  const history = useHistory()
  return (
    <Navbar bg="light" expand="sm">
      <Navbar.Brand as={Link} to={"/"}>Chat</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
          <Nav.Link as={Link} to="/privacy">Privacy</Nav.Link>
          {user ?
            <DropdownButton className={styles.button} title={(user.displayName || user.email) + " "}>
              <Dropdown.Item onClick={() => history.push("/account")}>Account</Dropdown.Item>
              <Dropdown.Item onClick={() => history.push("/chat")}>Chats</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => auth.signOut()}>Sign Out</Dropdown.Item>
            </DropdownButton> : <Button className={styles.button} onClick={() => history.push("/signIn")}>Sign In</Button>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}