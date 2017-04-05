import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import SignupPage from './components/authentication/SignupPage';
import LoginPage from './components/login/LoginPage';
import DocumentPage from './components/document/DocumentPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ManangeRolePage from './components/adminStuff/ManageRolePage';
import HandleUsersPage from './components/adminStuff/HandleUsersPage';

import requireAuth from './utils/requireAuth';
import requireAdminAuth from './utils/requireAdminAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="dashboard" component={requireAuth(DashboardPage)} />
    <Route path="login" component={LoginPage} />
    <Route path="signup" component={SignupPage} />
    <Route path="documents" component={requireAuth(DocumentPage)} />
    <Route path="about" component={AboutPage} />
    <Route path="admin/manageroles"
      component={requireAdminAuth(ManangeRolePage)} />
    <Route path="admin/handleusers"
      component={requireAdminAuth(HandleUsersPage)} />
  </Route>
);
