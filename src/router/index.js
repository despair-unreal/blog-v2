//前端路由
import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../views/Home.vue';
import Blog from '../components/global/Blog.vue';
import article from '../views/index.vue';
import articleDetail from '../views/articleDetail.vue';
import classify from '../views/classify.vue';
import essay from '../views/essay.vue';
import music from '../views/music.vue';
import articleOverview from '../views/articleOverview.vue';
import random from '../views/random.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Blog,
    children: [
      {
        path: '',
        name: 'article',
        component: article
      },
      {
        path: '/essay',
        name: 'essay',
        component: essay
      },
      {
        path: '/articleOverview',
        name: 'articleOverview',
        component: articleOverview
      },
      {
        path: '/random',
        name: 'random',
        component: random
      }
    ]
  },
  {
    path: '/articleDetail',
    name: 'articleDetail',
    component: articleDetail
  },
  {
    path: '/classify',
    name: 'classify',
    component: classify
  },
  {
    path: '/music',
    name: 'music',
    component: music
  },
  {
    path: '/home',
    name: 'home',
    component: home
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
