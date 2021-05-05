import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route } from 'react-router';
import SignIn from './SignIn/SignIn';
import ChatRoom from './ChatRoom/ChatRoom';
import Home from './Home/Home';
import Page404 from './404/404';

function App() {
  return (
    <Switch>
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/chat/:room" children={<ChatRoom />} />
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="*">
        <Page404 />
      </Route>
    </Switch>
  );
}

export default App;
