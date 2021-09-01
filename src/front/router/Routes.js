import Home from "../components/Home";
import NotFound from "../components/NotFound";
import Main from "../components/Main";
import Login from "../components/Login";
import Checkout from "../components/Checkout";
import Profile from '../components/Profile'
import EditProfile from "../components/EditProfile";
import Brandpage from '../components/Brands/Brandpage'
import MenWomen from '../components/MenWomen'
import Cart from '../components/Cart'

export default [
    {
        component: Main,
        routes: [
            {
                component: Home,
                path: "/",
                exact: true,
            },
            {
                component: Login,
                path: "/login",
                exact: true,
            },
            {
                component: Login,
                path: "/login/:id",
                exact: true,
            },
            {
                component: Login,
                path: "/register",
                exact: true,
            },
            {
                component: Login,
                path: "/api/reset/password/:token",
                exact: true,
            },
            {
                component: Profile,
                path: '/profile',
                exact: true
            },
            {
                component: EditProfile,
                path: '/profile/main',
                exact: true
            },
            {
                component: Checkout,
                path: "/checkout/:id",
                exact: true,
            },
            {
                component: MenWomen,
                path: "/cate/:cate",
                exact: true,
            },
            {
                component: Cart,
                path: "/cart",
                exact: true,
            },
            {
                component: Brandpage,
                path: '/brands',
                exact: true,
            },
            {
                component: NotFound,
                path: "*",
            },
        ],
    },
];
