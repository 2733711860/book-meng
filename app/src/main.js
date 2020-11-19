import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import Navigation from 'vue-navigation'
Vue.use(Navigation, {router})
import "@/assets/style/index.less";

import "@/components/Vant";
// rem
import "amfe-flexible";

import './assets/Iconfont/css/iconfont.css'

// 接口请求
import {post,get,patch,put} from './api/http.js'
// import api from './api'
Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$patch=patch;
Vue.prototype.$put=put;
// Vue.prototype.$api=api;

import store from './store'; // vuex

import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name:'v-touch' })
VueTouch.config.swipe = {
  threshold:50  // 设置左右滑动的距离
}

Vue.config.productionTip = false;

import Loading from './components/me-loading'
Vue.use(Loading)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
