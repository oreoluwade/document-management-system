import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom';
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

const App = () => (
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

export default App;
