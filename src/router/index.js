import Vue from 'vue';
import Router from 'vue-router';

const login = r => require.ensure([], () => r(require('../view/login/login.vue')), 'login');
const home = r => require.ensure([], () => r(require('../view/home/home.vue')), 'home');
const setting = r => require.ensure([], () => r(require('../view/setting/setting.vue')), 'setting');
const inspection = r => require.ensure([], () => r(require('../view/inspection/inspection.vue')), 'inspection');
const taskDetail = r => require.ensure([], () => r(require('../view/task/task-detail.vue')), 'taskDetail');

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/home',
			name: 'Home',
			component: home,
			meta: {
				title: '首页'
			}
		},
		{
			path: '/',
			name: 'Login',
			component: login,
			meta: {
				title: '登录'
			}
		},
		{
			path: '/login',
			component: login,
			meta: {
				title: '登录'
			}
		},
		{
			path: '/setting',
			name: 'Setting',
			component: setting,
			meta: {
				title: '设置'
			}
		},
		{
			path: '/inspection',
			name: 'Inspection',
			component: inspection,
			meta: {
				title: '巡检'
			}
		},
		{
			path: '/task-detail',
			name: 'TaskDetail',
			component: taskDetail,
			meta: {
				title: '巡检点详情'
			}
		}
	]
});
