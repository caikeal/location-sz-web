<template>
	<div class="huawei-inspection">
		<div class="fixed-heading">
			<div class="heading">
				<div class="heading-content">
					<img src="../../assets/images/logo/logo.png" alt="logo" class="img-logo">
				</div>
			</div>
			<div class="time-counter">
				<span>星期{{this.time.week}} {{this.time.year}}年{{this.time.month}}月{{this.time.day}}日</span>
				<span class="now-time">{{this.time.hour}}:{{this.time.minute}}:{{this.time.second}}</span>
			</div>
		</div>
		<div class="inspection-map">
		</div>
		<div class="inspection-task">
			<ul>
				<li></li>
			</ul>
		</div>
		<footer>
			<div class="next-inspection cl-fx">
				<div class="place-icon">
					<i></i>
					<span>下个巡检位置</span>
				</div>
				<div class="place-name one-line">
					<span>星巴克咖啡</span>
				</div>
				<div class="task-name">
					<router-link :to="{name: 'TaskDetail'}">
						<span>巡检任务</span>
					</router-link>
				</div>
				<div class="quick-over">
					<k-checkbox :option="task" v-model="taskCheck"></k-checkbox>
				</div>
			</div>
		</footer>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import { mapState, mapMutations } from 'vuex';
	import { getScreenHeight, toCNTime } from '../../utils/fixTool.js';
	import fengmap from 'fengmap';
	import checkbox from '../../components/checkbox/checkbox.vue';

	export default {
		name: 'huawei-inspection',
		data () {
			return {
				time: toCNTime(new Date()),
				autoTimer: '',
				task: {
					value: '1',
					label: '',
					disabled: false
				},
				taskCheck: ''
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
		mounted () {
			// 开启定时器
			this.autoTimer = setInterval(() => {
				this.time = toCNTime(new Date());
			}, 1000);
			// 地图初始化
			document.querySelector('.inspection-map').style.minHeight = (getScreenHeight() - 220 - 49) + 'px';
			document.querySelector('.inspection-map').style.marginTop = 220 + 'px';
			document.querySelector('.inspection-task').style.marginBottom = 49 + 'px';
			this.initMap();
		},
		beforeDestroy () {
			if (this.autoTimer) {
				clearInterval(this.autoTimer);
			}
		},
		methods: {
			...mapMutations([
				'SYNC_USERINFO'
			]),
			initMap () {
				// 定义全局map变量
				let map;
				let fmapID = 'mediasoc1002';
				/* eslint-disable no-new, new-cap */
				map = new fengmap.FMMap({
					// 渲染dom
					container: document.querySelector('.inspection-map'),
					// 地图数据位置
					// mapServerURL: '/maps/map/' + fmapID,
					// 主题数据位置
					// mapThemeURL: '/maps/theme',
					// 设置主题
					// defaultThemeName: '3007',
					// 默认比例尺级别设置为19级
					defaultMapScaleLevel: 19,
					// 关闭聚焦层切换的动画显示
					focusAnimateMode: true,
					focusAlphaMode: false,
					// 开发者申请应用下web服务的key
					key: '92a2b21f85c5ce7dc36ce5dbfda93b19',
					// 开发者申请应用名称
					appName: 'shangyan'
				});
				this.map = map;

				// 楼层控制控件配置参数
				let ctlOpt = new fengmap.controlOptions({
					position: fengmap.controlPositon.RIGHT_TOP, // 默认在左下角
					showBtnCount: 7, // 默认显示楼层的个数
					allLayer: true, // 初始是否是多层显示，默认单层显示
					// 位置x,y的偏移量
					offset: {
						x: 20,
						y: 67
					},
					imgURL: '/static/img/'
				});

				// 2D、3D控件配置
				new fengmap.toolControl(map, {
					init2D: false,   // 初始化2D模式
					groupsButtonNeeded: false,   // 设置为false表示只显示2D,3D切换按钮
					// 位置x,y的偏移量
					offset: {
						x: 20,
						y: 5
					},
					imgURL: '/static/img/',
					// 点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
					clickCallBack: function (type, value) {
						// console.log(type,value);
					}
				});

				// 打开Fengmap服务器的地图数据和主题
				map.openMapById(fmapID, function (error) {
					// 打印错误信息
					console.log(error);
				});

				// 地图加载完回调事件
				map.on('loadComplete', function () {
					// 默认楼层加载完后不显示，需自定义设置要显示的楼层和聚焦层
					map.visibleGroupIDs = map.groupIDs;
					map.focusGroupID = map.groupIDs[0];
					map.showCompass = true; // 显示指北针控件
					new fengmap.scrollGroupsControl(map, ctlOpt);
				});

				// 如：点击指南针事件, 使角度归0
				map.on('mapClickCompass', function () {
					map.rotateTo({
						to: 0,           // 设置角度
						duration: 0.3,      // 动画持续时间，默认为。3秒
						callback: function () {             // 回调函数
							console.log('rotateTo complete!');
						}
					});
				});
			}
		},
		components: {
			[checkbox.name]: checkbox
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/parital/_var.scss';

	.huawei-inspection {
		background-color: #e2e2e2;
		position: relative;
		width: 100%;
		height: 100%;
		.fixed-heading {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			background-color: #e2e2e2;
			.heading {
				background: url('../../assets/images/login/bg.png') no-repeat;
				background-size: cover;
				text-align: center;
				.heading-content {
					padding: 25px 0;
					position: relative;
					background: hsla(0,0%,100%,.25) border-box;
					overflow: hidden;
					&:before {
						content: ' ';
						position: absolute;
						top: 0;
						left: 0;
						bottom: 0;
						right: 0;
						z-index: -1;
						width: 100%;
						height: 100%;
						filter: blur(20px);
					}
				}
				.img-logo {
					width: 93px;
					border-radius: 50%;
				}
			}
			.time-counter {
				background-color: $color-white;
				margin-top: 15px;
				padding: 20px 10px;
				.now-time {
					float: right;
					font-size: 22px;
					line-height: 0.8;
				}
				box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 1px 5px rgba(171, 171, 171, 0.6);
			}
		}
		footer {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #f8f8f8;
			border-top: 1px solid #e2e2e2;
			.next-inspection {
				padding: 5px 10px;
				font-size: 14px;
				text-align: center;
				& > div {
					float: left;
					line-height: 1.5;
				}
				.place-icon {
					width: 25%;
					font-size: 12px;
					i {
						display: block;
						width: 20px;
						height: 20px;
						background: url('../../assets/images/inspection/main.png') no-repeat;
						background-size: contain;
						margin: 0 auto;
					}
					span {
						display: block;
					}
				}
				.place-name {
					width: 36%;
					line-height: 38px;
					font-weight: 600;
				}
				.task-name {
					width: 22%;
					line-height: 38px;
					color: $info-color;
					text-decoration: underline;
					cursor: pointer;
				}
				.quick-over {
					width: 17%;
					line-height: 38px;
					cursor: pointer;
				}
			}
		}
	}
</style>
