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

const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/dashboard',
    component: requireAuth(DashboardPage),
    exact: true,
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
    path: '/profilepage',
    component: requireAuth(ProfilePage),
    exact: true
  },
  {
    path: '/about',
    component: AboutPage
  },
  {
    path: '/admin/manageroles',
    component: requireAdminAuth(ManangeRolePage)
  },
  {
    path: '/admin/handleusers',
    component: requireAdminAuth(HandleUsersPage)
  },
];

export default routes;
