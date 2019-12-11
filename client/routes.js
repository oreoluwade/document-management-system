import Home from './components/home';
import About from './components/about';
import Signup from './components/signup';
import Login from './components/login';
// import DocumentPage from './components/DocumentPage';
import RenderDocument from './components/document/render-document';
import Dashboard from './components/dashboard';
import { Users, Roles } from './components/adminComponents';
import Profile from './components/profile';
import requireAuth from './components/Utils/RequireAuth';
import requireAdminAuth from './components/Utils/RequireAdminAuth';

const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/dashboard',
        component: requireAuth(Dashboard),
        exact: true
    },
    {
        path: '/login',
        component: Login,
        exact: true
    },
    {
        path: '/signup',
        component: Signup,
        exact: true
    },
    // {
    //   path: '/documents',
    //   component: requireAuth(DocumentPage),
    //   exact: true
    // },
    {
        path: '/document',
        component: requireAuth(RenderDocument),
        exact: true
    },
    {
        path: '/document/:id',
        component: requireAuth(RenderDocument),
        exact: true
    },
    {
        path: '/profile',
        component: requireAuth(Profile),
        exact: true
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/roles',
        component: requireAdminAuth(Roles)
    },
    {
        path: '/users',
        component: requireAdminAuth(Users)
    }
];

export default routes;
