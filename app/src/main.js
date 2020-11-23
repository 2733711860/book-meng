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

import store from './store'; // vuex

import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name:'v-touch' })
VueTouch.config.swipe = {
  threshold:50  // 设置左右滑动的距离
}

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
