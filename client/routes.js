import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage/index.jsx';
import AboutPage from './components/AboutPage/index.jsx';
import SignupPage from './components/SignupPage/index.jsx';
import LoginPage from './components/LoginPage/index.jsx';
import DocumentPage from './components/DocumentPage/index.jsx';
import DashboardPage from './components/DashboardPage/index.jsx';
import RolesPage from './components/AdminPage/RolesPage.jsx';
import UsersPage from './components/AdminPage/UsersPage.jsx';
import ProfilePage from './components/ProfilePage/index.jsx';
import requireAuth from './utils/requireAuth.jsx';
import requireAdminAuth from './utils/requireAdminAuth.jsx';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="dashboard" component={requireAuth(DashboardPage)} />
    <Route path="login" component={LoginPage} />
    <Route path="signup" component={SignupPage} />
    <Route path="documents" component={requireAuth(DocumentPage)} />
    <Route path="profilepage" component={requireAuth(ProfilePage)}/>
    <Route path="about" component={AboutPage} />
    <Route path="admin/manageroles"
      component={requireAdminAuth(RolesPage)} />
     <Route path="admin/handleusers"
      component={requireAdminAuth(UsersPage)} />
  </Route>
);
