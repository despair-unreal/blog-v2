//入口js文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//自定义工具
import utils from './utils/util'
//字体
import "@fontsource/montserrat/500.css";
import "@fontsource/noto-sans-sc";
//字体图标
import "./assets/css/iconfont/iconfont.css"
//全局样式
import "./assets/css/base.css";
import "./assets/css/reset.css";

Vue.config.productionTip = false
Vue.prototype.$utils = utils
//EventBus
Vue.prototype.$bus = new Vue()

Vue.prototype.$store = {
  debug: false,
  state: {
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  addToStateAction (value,key) {
    if (this.debug) console.log('addToStateAction triggered with', value)
    this.state[key] = value;
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
