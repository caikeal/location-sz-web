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

export default {
	name: 'app',
	computed: {
		...mapState([
			'userInfo'
		])
	},
	created () {
		this.pointBack();
	},
	methods: {
		...mapMutations([
			'MY_OWN_PLACE'
		]),
		pointBack () {
			/*
			 * 巡检位置上报
			 * 1.登录页面不用上报,type为S
			 * 2.巡检页面type使用W,(inspection/task-detail)
			 * 3.非巡检页面type使用N
			 */
			setInterval(() => {
				let type = this.$route.meta.workType;
				if (type === 'S' || !this.userInfo || !this.userInfo.token) {
					return false;
				}
				// 组织上传数据
				let params = {
					type,
					x: 13539243.805673061,
					y: 3667103.790031852,
					group_id: 1
				};
				this.MY_OWN_PLACE({
					x: params.x,
					y: params.y,
					group_id: params.group_id,
					direction: 180
				});
				apis.reportingLocation(params)
				.then(() => {
					return true;
				})
				.catch(() => {
					return false;
				});
			}, 60000);
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
