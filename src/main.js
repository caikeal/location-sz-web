// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
});

router.beforeEach((to, from, next) => {
	// 为了解决fengmap库（webGL）内存泄露问题,每次进入刷新带有地图页面
	// 最2的地方是没有销毁map的方法。。。T T
	if (to.name === 'Inspector' || to.name === 'Inspection') {
		to.meta.refresh = true;
	}
	next();
});
