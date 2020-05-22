import Vue from 'vue'
import VueRouter from 'vue-router'

import Draw from './pages/draw'
import Watch from './pages/watch'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [{
    path: '/draw',
    component: Draw
  }, {
    path: '/watch',
    component: Watch
  }]
})

export default router
