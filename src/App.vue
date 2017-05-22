<template>
	<div id="app">
		<transition name="router-fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import apis from './service/getData.js';
import beacon from './utils/beacon.js';

export default {
	name: 'app',
	computed: {
		...mapState([
			'userInfo'
		])
	},
	mounted () {
		this.pointBack();
		this.getPosition();
		// setIntval(() => {
		// 	window.bleLocation([
		// 		{
		// 			minor: 43443,
		// 			major: 10101,
		// 			uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
		// 			rssi: -60
		// 		},
		// 		{
		// 			minor: 43640,
		// 			major: 10101,
		// 			uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
		// 			rssi: -91
		// 		},
		// 		{
		// 			minor: 43423,
		// 			major: 10101,
		// 			uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
		// 			rssi: -82
		// 		}
		// 	]);
		// });
	},
	methods: {
		...mapMutations([
			'MY_OWN_PLACE',
			'MY_OWN_DIRECTION'
		]),
		pointBack () {
			/*
			 * 巡检位置上报
			 * 1.登录页面不用上报,type为S
			 * 2.巡检页面type使用W,(inspection/task-detail)
			 * 3.非巡检页面type使用N
			 */
			// 初始化函数，用户名,获取位置的回调函数
			window.initPdrPosition(this.userInfo ? this.userInfo.phone : '13962175383', (x, y, groupID) => {
				let type = this.$route.meta.workType;
				// 鉴权
				if (type === 'S' || !this.userInfo || !this.userInfo.token) {
					return false;
				}
				// 组织上传数据
				let params = {
					type,
					x: x,
					y: y,
					group_id: groupID
				};
				this.MY_OWN_PLACE(params);
				apis.reportingLocation(params)
				.then(() => {
					return true;
				})
				.catch(() => {
					return false;
				});
			});
		},
		getPosition () {
			let isOk = beacon.startMonitor();
			if (isOk) {
				// 获取beacon数据
				let getBeacon = function (info) {
					if (info) {
						window.bleLocation(JSON.parse(info));
					}
				};
				// 获取指南针朝向
				let getHeading = (info) => {
					let tem = info ? -info : 0;
					if (tem) {
						// 更新手机朝向，需要一直调用这个函数更新。
						window.compassHeadingHandler(tem);
						this.MY_OWN_DIRECTION(tem);
					}
				};
				beacon.compassHeading(getHeading);
				beacon.setBeaconInfo(getBeacon);
			}
		}
	}
};
</script>

<style lang="scss">
@import './assets/sass/base/normalize.scss';
@import './assets/sass/base/mobile.scss';
@import './assets/sass/base/base.scss';

.router-fade-enter-active, .router-fade-leave-active {
	transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
	opacity: 0;
}
body {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
</style>
