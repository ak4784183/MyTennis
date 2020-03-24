import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入接口JS
import http from './https.js'
Vue.prototype.$http=http;
//引入mintUi
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

//引入轮播组件
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

// 引入全局组件
import Invalid from './components/Invalid.vue'
import MyHeader from './components/Header.vue'
import MyLoadMore from './components/MyLoadMore.vue'
import MyBlankPage from './components/Blank.vue'
Vue.component('invalid-item',Invalid);
Vue.component('MyHeader',MyHeader);
Vue.component('MyLoadMore',MyLoadMore);
Vue.component('MyBlankPage',MyBlankPage);
// 引入字体图标
import './assets/iconfont/iconfont.css'
import './assets/css/style.scss'
import './assets/css/common.scss'
import 'font-awesome/css/font-awesome.css' 

//引入mixin
import mixin from './mixin'
Vue.mixin(mixin);
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
