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
			window.initPdrPosition(this.userInfo ? this.userInfo.id : 'tf', (x, y, groupID) => {
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
						window.bleLocation(info);
					}
				};
				// 获取指南针朝向
				let getHeading = (info) => {
					if (info) {
						// 更新手机朝向，需要一直调用这个函数更新。
						window.compassHeadingHandler(info);
						this.MY_OWN_DIRECTION(info);
					}
				};
				beacon.setBeaconInfo(getBeacon);
				beacon.compassHeading(getHeading);
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
