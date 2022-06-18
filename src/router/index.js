//前端路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import test1 from '../views/test1.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'test1',
    component: test1
  },
  {
    path: '/1',
    name: 'Home',
    component: Home,
    children:[
      {
        path: '/2',
        name: 'test1',
        component: test1
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
