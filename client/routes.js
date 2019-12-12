import Home from './components/home';
import About from './components/about';
import Signup from './components/signup';
import Login from './components/login';
import RenderDocument from './components/document/render-document';
import Dashboard from './components/dashboard';
import { Users, Roles } from './components/adminComponents';
import Profile from './components/profile';
import { RequireAuth, RequireAdminAuth } from './components/protected';

const routes = [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/dashboard',
        component: RequireAuth(Dashboard),
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
        component: RequireAuth(RenderDocument),
        exact: true
    },
    {
        path: '/document/:id',
        component: RequireAuth(RenderDocument),
        exact: true
    },
    {
        path: '/profile',
        component: RequireAuth(Profile),
        exact: true
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/roles',
        component: RequireAdminAuth(Roles)
    },
    {
        path: '/users',
        component: RequireAdminAuth(Users)
    }
];

export default routes;
