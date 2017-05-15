import Vue from 'vue';
import Router from 'vue-router';

const login = r => require.ensure([], () => r(require('../view/login/login.vue')), 'login');
const home = r => require.ensure([], () => r(require('../view/home/home.vue')), 'home');
const setting = r => require.ensure([], () => r(require('../view/setting/setting.vue')), 'setting');
const inspection = r => require.ensure([], () => r(require('../view/inspection/inspection.vue')), 'inspection');
const taskList = r => require.ensure([], () => r(require('../view/task/task-list.vue')), 'taskList');
const taskDetail = r => require.ensure([], () => r(require('../view/task/task-detail.vue')), 'taskDetail');

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Login',
			component: login,
			meta: {
				title: '登录',
				workType: 'S'
			}
		},
		{
			path: '/home',
			name: 'Home',
			component: home,
			meta: {
				title: '首页',
				workType: 'N'
			}
		},
		{
			path: '/login',
			component: login,
			meta: {
				title: '登录',
				workType: 'S'
			}
		},
		{
			path: '/setting',
			name: 'Setting',
			component: setting,
			meta: {
				title: '设置',
				workType: 'N'
			}
		},
		{
			path: '/inspection',
			name: 'Inspection',
			component: inspection,
			meta: {
				title: '巡检',
				workType: 'W'
			}
		},
		{
			path: '/task-list',
			name: 'TaskList',
			component: taskList,
			meta: {
				title: '巡检点列表',
				workType: 'W'
			}
		},
		{
			path: '/task-detail',
			name: 'TaskDetail',
			component: taskDetail,
			meta: {
				title: '巡检点详情',
				workType: 'W'
			}
		}
	]
});
