import Vue from 'vue';
import Router from 'vue-router';

const home = r => require.ensure([], () => r(require('../view/home/home.vue')), 'home');
const setting = r => require.ensure([], () => r(require('../view/setting/setting.vue')), 'setting');
const inspection = r => require.ensure([], () => r(require('../view/inspection/inspection.vue')), 'inspection');
// const taskList = r => require.ensure([], () => r(require('../view/task/task-list.vue')), 'taskList');

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: home,
			meta: {
				title: '首页',
				workType: 'N'
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
				title: '定位',
				workType: 'W',
				refresh: false
			}
		}
		// {
		// 	path: '/task-list',
		// 	name: 'TaskList',
		// 	component: taskList,
		// 	meta: {
		// 		title: '巡检点列表',
		// 		workType: 'W'
		// 	}
		// }
	]
});
