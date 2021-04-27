import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from './context/UserContext';
import PostsPage from './components/posts/PostsPage';
import NotFound from './components/NotFound';
import PostPage from './components/posts/PostPage';
import Login from './components/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import NavBar from './components/Navbar';
import Logout from './components/Logout';
import ProfilePage from './components/profile/ProfilePage';
import EditDescription from './components/profile/EditDescription';
import EditUsername from './components/profile/EditUsername';
import EditEmail from './components/profile/EditEmail';
import EditPassword from './components/profile/EditPassword';
import ProfileEdit from './components/profile/ProfileEdit';
import ScrollToTop from './components/ScrollToTop';

import auth from './services/authService';
import { getMe } from './services/userService';
import { decompress } from './utils/media';
import Register from './components/Register';
import favicon from './images/favicon.svg';
class App extends Component {
  state = {
    currentUser: null,
  };

  componentDidMount() {
    this.setUser();
  }

  setUser = async () => {
    if (!auth.hasCurrentUser()) return;

    try {
      this.handleLogin();
    } catch (ex) {
      toast.error('Something went wrong');
      auth.logout();
    }
  };

  handleLogin = async () => {
    const currentUser = await getMe();

    if (currentUser.profilePic)
      currentUser.profilePic = await decompress(currentUser.profilePic);
    this.setState({ currentUser });
  };

  updateUser = (property, value) => {
    const currentUser = { ...this.state.currentUser };
    currentUser[property] = value;
    this.setState({ currentUser });
  };

  render() {
    if (auth.hasCurrentUser() && !this.state.currentUser) return null;

    return (
      <UserContext.Provider
        value={{
          currentUser: this.state.currentUser,
          onLogin: this.handleLogin,
          updateUser: this.updateUser,
        }}
      >
        <React.Fragment>
          <Helmet>
            <link rel="icon" type="image/svg+xml" href={favicon} sizes="any" />
            <title>SBKonnect</title>
          </Helmet>
          <ToastContainer />
          <NavBar />
          <main>
            <ScrollToTop>
              <Switch>
                <Route path="/register" component={Register} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/posts/:id" component={PostPage} exact />
                <Route path="/posts" component={PostsPage} exact />
                <ProtectedRoute
                  path="/profile/edit"
                  component={ProfileEdit}
                  exact
                />
                <ProtectedRoute
                  path="/profile/:id"
                  component={ProfilePage}
                  exact
                />
                <ProtectedRoute
                  path="/profile/edit/username"
                  component={EditUsername}
                  exact
                />
                <ProtectedRoute
                  path="/profile/edit/email"
                  component={EditEmail}
                  exact
                />
                <ProtectedRoute
                  path="/profile/edit/description"
                  component={EditDescription}
                  exact
                />
                <ProtectedRoute
                  path="/profile/edit/password"
                  component={EditPassword}
                  exact
                />
                <Route path="/not-found" component={NotFound} />
                <Redirect
                  from="/"
                  to={auth.hasCurrentUser() ? '/posts' : '/login'}
                  exact
                />
                <Redirect to="/not-found" />
              </Switch>
            </ScrollToTop>
          </main>
          <footer></footer>
        </React.Fragment>
      </UserContext.Provider>
    );
  }
}

export default App;
