import Vue from 'vue'
import Router from 'vue-router'

import dashboard from '../views/dashboard'
import login from '../views/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
}
)
