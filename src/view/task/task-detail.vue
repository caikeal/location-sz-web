<template>
	<div class="huawei-task-detail">
		<div class="form-task">
			<mt-radio
				class="page-part cl-fx"
				title="是否有可疑人员"
				v-model="suspectivePerson"
				:options="optionsSp" />
			<mt-radio
				class="page-part cl-fx"
				title="是否有可疑物品"
				v-model="suspectiveItem"
				:options="optionsSi" />
			<mt-field placeholder="发现可疑情况，请描述" type="textarea" rows="4" v-model="description"></mt-field>
		</div>
		<div class="control-bar">
			<mt-button class="btn-save" size="large" type="primary" @click="save">保存</mt-button>
			<mt-button class="btn-cancel" size="large" type="primary" @click="cancel">取消</mt-button>
		</div>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import { mapState, mapMutations } from 'vuex';
	import { Radio, Field, Button } from 'mint-ui';

	export default {
		name: 'huawei-task-detail',
		data () {
			return {
				optionsSp: [
					{
						label: '没有可疑人员',
						value: '1'
					},
					{
						label: '有可疑人员',
						value: '2'
					}
				],
				optionsSi: [
					{
						label: '没有可疑物品',
						value: '1'
					},
					{
						label: '有可疑物品',
						value: '2'
					}
				],
				suspectivePerson: '1',
				suspectiveItem: '1',
				description: ''
			};
		},
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
			...mapMutations([
				'SYNC_USERINFO'
			]),
			save () {
				return false;
			},
			cancel () {
				return false;
			}
		},
		components: {
			[Radio.name]: Radio,
			[Field.name]: Field,
			[Button.name]: Button
		}
	};
</script>
<style lang="scss">
	.huawei-task-detail {
		.control-bar {
			margin-top: 20px;
			padding: 0 25px;
		}
		.btn-cancel {
			margin-top: 15px;
		}
	}
</style>
