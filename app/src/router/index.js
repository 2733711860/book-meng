import Vue from 'vue'
import Router from 'vue-router'
import book from './book'
Vue.use(Router)
const router = new Router({
  routes: [
		...book,
  ]
})

router.beforeEach((to, from, next) => {
	let { title } = to.meta;
	document.title = title;
	next();
});

export default router;
