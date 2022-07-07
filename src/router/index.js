//前端路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  }/*,
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
  }*/
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
