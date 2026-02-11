import { createRouter, createWebHistory } from 'vue-router'
import Settings from '../pages/Settings.vue'
import Home from '../pages/Home.vue'
import Dev from '../pages/Dev.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/settings', component: Settings },
  { path: '/dev', component: Dev }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
