import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import http from './http'
Vue.prototype.$http=http;
import mixin from './mixin'
Vue.mixin(mixin);
import './assets/css/style.css'
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
