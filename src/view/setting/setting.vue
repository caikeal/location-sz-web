<template>
	<div class="huawei-setting">
		<div class="setting-cell">
			<mt-cell title="人员定位" is-link :to="{ name: 'Home' }"></mt-cell>
		</div>
		<div class="setting-control">
			<mt-button size="large" type="primary" class="btn-logout" @click="goLogout">退出</mt-button>
		</div>
	</div>
</template>
<script>
	import { Cell, Button, Toast } from 'mint-ui';
	import changeTitle from '../../utils/changeTitle.js';
	import { mapState, mapMutations, mapActions } from 'vuex';
	import apis from '../../service/getData.js';
	import errorPublic from '../../service/errorPublic.js';

	export default {
		name: 'huawei-setting',
		computed: {
			...mapState([
				'userInfo'
			])
		},
		created () {
			// 添加head头
			changeTitle(this.$route);
			// 同步用户信息
			this.SYNC_USERINFO();
			// 初步验证是否登录
			if (!this.userInfo || !this.userInfo.token) {
				this.$router.push({name: 'Login'});
			}
		},
		methods: {
			...mapActions([
				'fedLogout'
			]),
			...mapMutations([
				'SYNC_USERINFO'
			]),
			goLogout () {
				apis.logout()
				.then(() => {
					Toast({
						message: '退出成功！',
						iconClass: 'mintui mintui-success',
						duration: 1500
					});
					this.fedLogout();
					this.$router.push({name: 'Login'});
				})
				.catch((err) => {
					errorPublic(err.response);
				});
				return false;
			}
		},
		components: {
			[Cell.name]: Cell,
			[Button.name]: Button,
			[Toast.name]: Toast
		}
	};
</script>
<style lang="scss">
	.huawei-setting {
		.setting-cell {
			margin-top: 25px;
		}
		.setting-control {
			margin-top: 80px;
			padding: 0 25px;
		}
	}
</style>
