import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import pages
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Dashboard from '@/pages/Dashboard.vue'
import CreateRequest from '@/pages/CreateRequest.vue'
import RequestDetail from '@/pages/RequestDetail.vue'
import MyRequest from '@/pages/MyRequest.vue'
import OffersForRequest from '@/pages/OffersForRequest.vue'
import OfferDetail from '@/pages/OfferDetail.vue'
import TransactionList from '@/pages/TransactionList.vue'
import TransactionDetail from '@/pages/TransactionDetail.vue'
import BlockchainPage from '@/pages/BlockchainPage.vue'
import BlockchainSimulation from '@/pages/BlockchainSimulation.vue'

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/create-request',
    name: 'CreateRequest',
    component: CreateRequest,
    meta: { requiresAuth: true },
  },
  {
    path: '/request/:id',
    name: 'RequestDetail',
    component: RequestDetail,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/my-request',
    name: 'MyRequest',
    component: MyRequest,
    meta: { requiresAuth: true },
  },
  {
    path: '/offers/:id',
    name: 'OffersForRequest',
    component: OffersForRequest,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/offer/:offerId',
    name: 'OfferDetail',
    component: OfferDetail,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/transactions',
    name: 'TransactionList',
    component: TransactionList,
    meta: { requiresAuth: true },
  },
  {
    path: '/transaction/:id',
    name: 'TransactionDetail',
    component: TransactionDetail,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/blockchain',
    name: 'Blockchain',
    component: BlockchainPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/blockchain-simulation',
    name: 'BlockchainSimulation',
    component: BlockchainSimulation,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  console.log('Router guard - to:', to.path, 'from:', from.path)
  console.log('Auth state - isAuthenticated:', authStore.isAuthenticated, 'has token:', !!localStorage.getItem('token'))
  
  // Initialize auth if not already done and we have a stored token
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    console.log('Initializing auth from router guard')
    authStore.initializeAuth()
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('Auth required but not authenticated, redirecting to login')
    next('/login')
    return
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('Guest required but authenticated, redirecting to dashboard')
    next('/dashboard')
    return
  }

  console.log('Navigation allowed')
  // Continue navigation
  next()
})

// Global after each hook for analytics, logging, etc.
router.afterEach((to, from) => {
  // Log route changes in development
  if (import.meta.env.DEV) {
    console.log(`Route changed from ${from.path} to ${to.path}`)
  }
})

export default router
