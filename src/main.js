//入口js文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import utils from './utils/util'

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
