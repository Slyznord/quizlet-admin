import Auth from '@/views/Auth'
import Home from '@/views/Home'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isProtected: true
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  }
]
