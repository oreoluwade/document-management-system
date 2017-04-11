import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage/index';
import AboutPage from './components/AboutPage/index';
import SignupPage from './components/SignupPage/index';
import LoginPage from './components/LoginPage/index';
import DocumentPage from './components/DocumentPage/index';
import DashboardPage from './components/DashboardPage/index';
import ManangeRolePage from './components/adminComponents/ManageRolePage';
import HandleUsersPage from './components/adminComponents/HandleUsersPage';
import ProfilePage from './components/ProfilePage/index';
import requireAuth from './components/Utils/RequireAuth';
import requireAdminAuth from './components/Utils/RequireAdminAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="dashboard" component={requireAuth(DashboardPage)} />
    <Route path="login" component={LoginPage} />
    <Route path="signup" component={SignupPage} />
    <Route path="documents" component={requireAuth(DocumentPage)} />
    <Route path="profilepage" component={requireAuth(ProfilePage)} />
    <Route path="about" component={AboutPage} />
    <Route path="admin/manageroles"
      component={requireAdminAuth(ManangeRolePage)} />
    <Route path="admin/handleusers"
      component={requireAdminAuth(HandleUsersPage)} />
  </Route>
);
