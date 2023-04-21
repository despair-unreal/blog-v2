//前端路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import blog from '../components/global/blog.vue'
import article from '../views/article.vue'
import articleContent from '../views/articleContent.vue'
import classify from '../views/classify.vue'
import articleOverview from '../views/articleOverview.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'blog',
    component:blog,
    children:[
      {
        path: '',
        name: 'article',
        component: article
      },
      {
        path: '/classify',
        name: 'classify',
        component: classify
      },
      {
        path: '/articleOverview',
        name: 'articleOverview',
        component: articleOverview
      }
    ]
  },
  {
    path: '/articleContent',
    name: 'articleContent',
    component:articleContent,
  },
  {
    path: '/home',
    name: 'home',
    component: home,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
