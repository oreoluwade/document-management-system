import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
// import DocumentPage from './components/DocumentPage';
import RenderDocument from './components/document/render-document';
import DashboardPage from './components/DashboardPage';
import { Users, Roles } from './components/adminComponents';
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
  // {
  //   path: '/documents',
  //   component: requireAuth(DocumentPage),
  //   exact: true
  // },
  {
    path: '/render-document',
    component: requireAuth(RenderDocument),
    exact: true
  },
  {
    path: '/render-document/:id',
    component: requireAuth(RenderDocument),
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
    component: requireAdminAuth(Roles)
  },
  {
    path: '/admin/users',
    component: requireAdminAuth(Users)
  }
];

export default routes;
