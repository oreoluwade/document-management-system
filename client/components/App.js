import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Common';
import FlashMessagesList from './FlashMessagesList';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import DocumentPage from './DocumentPage';
import DashboardPage from './DashboardPage';
import ManangeRolePage from './adminComponents/ManageRolePage';
import HandleUsersPage from './adminComponents/HandleUsersPage';
import ProfilePage from './ProfilePage';
import requireAuth from './Utils/RequireAuth';
import requireAdminAuth from './Utils/RequireAdminAuth';

class App extends Component {
  render() {
    // const { location } = this.props;
    return (
      <Router>
        <div>
          <FlashMessagesList />
          <Switch>
            <Route
              component={HomePage}
              exact
              path="/"
            />
            <Route
              path="dashboard"
              component={requireAuth(DashboardPage)}
            />
            <Route
              path="login"
              component={LoginPage}
            />
            <Route
              path="signup"
              component={SignupPage}
            />
            <Route
              path="documents"
              component={requireAuth(DocumentPage)}
            />
            <Route
              path="profilepage"
              component={requireAuth(ProfilePage)}
            />
            <Route
              path="about"
              component={AboutPage}
            />
            <Route
              path="admin/manageroles"
              component={requireAdminAuth(ManangeRolePage)}
            />
            <Route
              path="admin/handleusers"
              component={requireAdminAuth(HandleUsersPage)}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  location: PropTypes.object
};

export default App;
