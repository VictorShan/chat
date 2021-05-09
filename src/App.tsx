import './App.css';
import { Switch, Route } from 'react-router';
import SignInUp from './SignIn/SignInUp';
import ChatRoom from './ChatRoom/ChatRoom';
import Home from './Home/Home';
import Page404 from './404/404';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout/Layout';
import Account from './Account/Account';
import About from './About/About';
import Privacy from './Privacy/Privacy';
import Chats from './Chats/Chats';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/signIn">
          <SignInUp />
        </Route>
        <Route path="/chats">
          <Chats />
        </Route>
        <Route path="/chat/:room" children={<ChatRoom />} />
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/privacy">
          <Privacy />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <Page404 />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
