import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DocumentPage from './components/DocumentPage';
import DashboardPage from './components/DashboardPage';
import ManangeRolePage from './components/adminComponents/ManageRolePage';
import HandleUsersPage from './components/adminComponents/HandleUsersPage';
import ProfilePage from './components/ProfilePage';
import requireAuth from './components/Utils/RequireAuth';
import requireAdminAuth from './components/Utils/RequireAdminAuth';

const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    path: '/dashboard',
    component: requireAuth(DashboardPage),
    exact: true
  },
  {
    path: '/login',
    component: LoginPage,
    exact: true
  },
  {
    path: '/signup',
    component: SignupPage,
    exact: true
  },
  {
    path: '/documents',
    component: requireAuth(DocumentPage),
    exact: true
  },
  {
    path: '/profile',
    component: requireAuth(ProfilePage),
    exact: true
  },
  {
    path: '/about',
    component: AboutPage
  },
  {
    path: '/admin/roles',
    component: requireAdminAuth(ManangeRolePage)
  },
  {
    path: '/admin/users',
    component: requireAdminAuth(HandleUsersPage)
  }
];

export default routes;
