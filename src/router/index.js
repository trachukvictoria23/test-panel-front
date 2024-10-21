import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from '@/store/auth'

//pages
const Home = () => import("@/pages/Home.vue");
const Login = () => import("@/pages/Login.vue")
const SignUp = () => import("@/pages/SignUp.vue")
const ResetPassword = () => import("@/pages/ResetPassword.vue")
const EmailConfirmed = () => import("@/pages/EmailConfirmed.vue")
const Expired = () => import("@/pages/Expired.vue")
const Users = () => import("@/pages/Users.vue");
const User = () => import("@/pages/User.vue");
const NFTs = () => import("@/pages/NFTs.vue")
const Chats = () => import("@/pages/Chats.vue") 
const Chat = () => import("@/pages/Chat.vue")
const Profile = () => import("@/pages/Profile.vue")
const ErrorPage = () => import("@/pages/Error.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword
  },
  {
    path: "/email-confirmed",
    name: "email-confirmed",
    component: EmailConfirmed
  },
  {
    path: "/expired",
    name: "expired",
    component: Expired
  },

  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/user/:id",
    name: "user",
    component: User,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nfts",
    name: "nfts",
    component: NFTs,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/chats",
    name: "chats",
    component: Chats,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/chat/:id",
    name: "chat",
    component: Chat,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "ErrorPage",
    component: ErrorPage,
  }
];

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: 'border-indigo-700',
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // console.log('router token', token)

  if ((token && to.meta.requiresAuth) || (!token && !to.meta.requiresAuth) || to.name === 'ErrorPage') {
    next();
  } else if (token && !to.meta.requiresAuth) {
    next('/')
  } else {
    const authStore = useAuth()
    if (authStore.me) authStore.logOut()
    next('/login');
  }
});

export default router;
