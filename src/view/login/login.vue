<template>
	<div class="huawei-login input-field-con">
		<div class="heading">
			<img src="../../assets/images/logo/logo.png" alt="logo" class="heading-img">
		</div>
		<div class="content">
			<div class="bg-phone mt-field-con">
				<mt-field placeholder="请输入手机号" type="text" v-model="phone"></mt-field>
			</div>
			<div class="bg-password mt-field-con">
				<mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
			</div>
		</div>
		<div class="btn-register">
			<mt-button size="large" type="primary" @click="goLogin">登录</mt-button>
		</div>
	</div>
</template>
<script>
	import { mapMutations, mapState } from 'vuex';
	import { requiredMe, phone } from '../../utils/valid.js';
	import errorLogin from '../../service/errorLogin.js';
	import apis from '../../service/getData.js';
	import { MessageBox, Toast, Button, Field } from 'mint-ui';
	import changeTitle from '../../utils/changeTitle.js';

	export default {
		name: 'huawei-login',
		data () {
			return {
				phone: '',
				password: '',
				valid: {
					msg: '',
					ok: true
				}
			};
		},
		computed: {
			...mapState([
				'userInfo'
			])
		},
		created () {
			changeTitle(this.$route);
			// 同步用户信息
			this.SYNC_USERINFO();
			// 初步验证是否登录
			if (this.userInfo &&
				this.userInfo.token) {
				this.$router.push({name: 'Home'});
			}
		},
		methods: {
			...mapMutations([
				'RECORD_USERINFO',
				'SYNC_USERINFO'
			]),
			goLogin () {
				this.valid = {msg: '', ok: true};
				if (!requiredMe(this.phone)) {
					this.valid.msg = '手机号必填！';
					this.valid.ok = false;
					MessageBox.alert('请填写手机号！', '提示');
					return false;
				}
				if (!phone(this.phone)) {
					this.valid.msg = '手机号格式错误！';
					this.valid.ok = false;
					MessageBox.alert('手机号格式错误！', '提示');
					return false;
				}
				apis.login(this.phone, this.password)
				.then((res) => {
					Toast({
						message: '登录成功！',
						iconClass: 'mintui mintui-success'
					});
					this.RECORD_USERINFO(res.data.data);
					this.valid = {msg: '', ok: true};
					this.$router.push({name: 'Home'});
				})
				.catch((err) => {
					console.log(err);
					errorLogin(err.response);
				});
			}
		},
		components: {
			[MessageBox.name]: MessageBox,
			[Toast.name]: Toast,
			[Button.name]: Button,
			[Field.name]: Field
		}
	};
</script>
<style>
	.huawei-login .heading{
		padding: 50px 0 60px 0;
		text-align: center;
		background: url('../../assets/images/login/bg.png') no-repeat;
		background-size: cover;
	}
	.huawei-login .heading-img {
		border-radius: 50%;
		background: #fff;
		width: 35%;
	}
	.huawei-login .btn-register {
		margin-top: 50px;
		padding: 0 25px;
	}
</style>
