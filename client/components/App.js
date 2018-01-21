import React from 'react';
import {
  Route,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom';
import FlashMessagesList from './FlashMessagesList';
import HomePage from './HomePage';
import Header from './Common';
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
      <Header location={window.location}/>
      <FlashMessagesList />
      <Route
        component={HomePage}
        exact
        path="/"
      />
      <Switch>
        <Route
          path="dashboard"
          component={requireAuth(DashboardPage)}
        />
        <Route
          exact
          path="/login"
          component={LoginPage}
        />
        <Route
          exact
          path="/signup"
          component={SignupPage}
        />
        <Route
          exact
          path="/documents"
          component={requireAuth(DocumentPage)}
        />
        <Route
          exact
          path="/profilepage"
          component={requireAuth(ProfilePage)}
        />
        <Route
          exact
          path="/about"
          component={AboutPage}
        />
        <Route
          exact
          path="/admin/manageroles"
          component={requireAdminAuth(ManangeRolePage)}
        />
        <Route
          exact
          path="/admin/handleusers"
          component={requireAdminAuth(HandleUsersPage)}
        />
      </Switch>
    </div>
  </Router>
);

export default App;
