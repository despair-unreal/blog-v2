//入口js文件
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
//自定义工具
import utils from './utils/util';
//字体
import '@fontsource/montserrat/500.css';
import '@fontsource/noto-sans-sc';
//字体图标
import './assets/css/iconfont/iconfont.css';
//全局样式
import './assets/css/base.scss';
import './assets/css/reset.scss';
// 全局组件
import Icon from '@/components/global/Icon.vue';
Vue.component('Icon', Icon);

Vue.config.productionTip = false;
Vue.prototype.$utils = utils;
//EventBus
Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
