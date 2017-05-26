<template>
	<div class="huawei-home">
		<div class="heading">
			<img src="../../assets/images/logo/logo.png" alt="logo" class="img-logo">
		</div>
		<div class="base-content">
			<h3>
				<strong>欢迎您</strong>
				<span class="user-name">Caikeal</span>
			</h3>
			<p>
				<span>今天是</span>
				<span>{{time.year}}年{{time.month}}月{{time.day}}日 星期{{time.week}}</span>
			</p>
		</div>
		<div class="base-control">
			<div class="control-setting">
				<span>
					<router-link :to="{name: 'Setting'}">设置</router-link>
				</span>
			</div>
			<div class="setting-bar">
				<mt-button size="large" type="primary" class="btn-inspection" @click="goInspection">开始定位</mt-button>
			</div>
		</div>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import { Button } from 'mint-ui';
	import { getScreenHeight, toCNTime } from '../../utils/fixTool.js';

	export default {
		name: 'huawei-home',
		data () {
			return {
				time: toCNTime(new Date())
			};
		},
		created () {
			// 添加head头
			changeTitle(this.$route);
		},
		mounted () {
			document.querySelector('.huawei-home').style.minHeight = getScreenHeight() + 'px';
		},
		methods: {
			goInspection () {
				this.$router.push({name: 'Inspection'});
			}
		},
		components: {
			[Button.name]: Button
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/parital/_var.scss';
	.huawei-home {
		background: url('../../assets/images/login/bg.png') no-repeat;
		background-size: cover;
		.heading {
			text-align: center;
			padding: 50px 0 60px 0;
		}
		.img-logo {
			width: 35%;
			border-radius: 50%;
		}
		.base-content {
			text-align: center;
			line-height: 2;
			.user-name {
				font-weight: 500;
				font-size: 22px
			}
		}
		.base-control {
			text-align: center;
			.control-setting {
				padding: 40px;
				& > span {
					cursor: pointer;
					border-bottom: 1px solid $color-silver;
				}
			}
			.setting-bar {
				padding: 0 25px;
			}
		}
		.btn-inspection {
			cursor: pointer;
			background-color: $btn-inspection;
		}
	}
</style>
