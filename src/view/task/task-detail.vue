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
			<div class="img-upload" v-for="(imageItem, index) in images">
				<k-img-btn
					type="card"
					:img="imageItem.imgPre" disable></k-img-btn>

				<div class="delete-btn" @click="removeImg(index)"></div>
			</div>
			<div class="img-upload" v-if="images.length<3">
				<k-img-btn
					type="card"
					:after-upload-show="false"
					@file-upload="uploadImg"></k-img-btn>
			</div>
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
	import { Radio, Field, Button, Toast, Indicator } from 'mint-ui';
	import ImgUpload from '../../components/image-upload/image-upload.vue';
	import apis from '../../service/getData.js';
	import errorPublic from '../../service/errorPublic.js';

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
				images: [],
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
			uploadImg (imgFile) {
				let fd = new FormData();
				fd.append('poster', imgFile.imgFile);
				Indicator.open('上传中...');
				apis.upload(fd)
				.then((res) => {
					Indicator.close();
					Toast({
						message: '上传成功',
						iconClass: 'mintui mintui-success',
						duration: 2000
					});
					imgFile.id = res.data.data.id;
					this.images.push(imgFile);
				})
				.catch((err) => {
					Indicator.close();
					errorPublic(err.response);
				});
				return false;
			},
			removeImg (index) {
				this.images.splice(index, 1);
			},
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
			[Button.name]: Button,
			[ImgUpload.name]: ImgUpload,
			[Toast.name]: Toast,
			[Indicator.name]: Indicator
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/parital/_var.scss';
	.huawei-task-detail {
		.form-task {
			margin-top: 25px;
			.mint-radiolist-title {
				padding: 5px;
				font-size: 16px;
				color: $color-black;
			}
			.page-part {
				&:not(:first-child) {
					background-image: -webkit-linear-gradient(bottom, #d9d9d9, #d9d9d9 50%, transparent 50%);
					background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
					background-size: 100% 1px;
					background-repeat: no-repeat;
					background-position: top left;
				}
				.mint-cell {
					float: left;
					.mint-cell-wrapper {
						background-image: none;
					}
					&:last-child {
						background-image: none;
					}
				}
			}
			.img-upload {
			    padding: 15px 0;
				background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
				background-size: 100% 1px;
				background-repeat: no-repeat;
				background-position: top left;
				position: relative;
				.delete-btn {
					position: absolute;
					z-index: 2;
					background: url('../../assets/images/inspection/delete.png') no-repeat;
					background-size: contain;
					// top: 8px;
					top: 0.5rem;
					// right: 31px;
					right: 2.1rem;
					border-radius: 50%;
					width: 15px;
					height: 15px;
					text-align: center;
					vertical-align: middle;
					cursor: pointer;
				}
			}
		}
		.control-bar {
			margin-top: 35px;
			padding: 0 25px;
		}
		.btn-cancel {
			margin-top: 15px;
			background-color: $cancel-color;
			color: $cancel-word;
		}
	}
</style>
