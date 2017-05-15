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
			<div class="task-list">
				<router-link :to="{name: 'TaskList'}">
					<span>列表</span>
				</router-link>
			</div>
		</div>
		<footer>
			<div class="next-inspection cl-fx">
				<div class="place-icon">
					<i></i>
					<span>下个巡检位置</span>
				</div>
				<div class="place-name one-line">
					<span>{{task.place ? task.place.name : ''}}</span>
				</div>
				<div class="task-name">
					<router-link
					v-if="needSolveTaskList.length"
					:to="{name: 'TaskDetail', params: {id: task.value}}">
						<span>巡检任务</span>
					</router-link>
					<span v-else>巡检任务</span>
				</div>
				<div class="quick-over">
					<k-checkbox
						:option="task"
						v-model="taskCheck"
						@input="quickReportTask">
					</k-checkbox>
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
	import apis from '../../service/getData.js';
	import errorPublic from '../../service/errorPublic.js';

	export default {
		name: 'huawei-inspection',
		data () {
			return {
				time: toCNTime(new Date()),
				autoTimer: '',
				task: {
					value: '',
					label: '',
					place: {name: ''},
					disabled: false
				},
				taskCheck: '',
				needSolveTaskList: [],
				map: null
			};
		},
		computed: {
			...mapState([
				'userInfo',
				'taskList',
				'toSolveTaskList',
				'myPlace'
			]),
			nowPlaceLayer () {
				return this.loactionMaker(this.myPlace.x, this.myPlace.y, this.myPlace.group_id, this.myPlace.direction);
			}
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
			// 判断是否存在任务列表、待解决任务列表，存在读缓存，否则取新的
			if (this.taskList.length === 0 || this.toSolveTaskList.length === 0) {
				this.getInspectionList();
			} else {
				if (this.toSolveTaskList.length) {
					this.needSolveTaskList = this.toSolveTaskList;
					this.task.place = this.toSolveTaskList[0].place ? this.toSolveTaskList[0].place : {name: ''};
					this.task.value = this.toSolveTaskList[0].id;
				} else {
					this.task.place.name = '今天任务已完成';
					this.task.value = '';
					this.task.disabled = true;
				}
			}
		},
		mounted () {
			// 开启定时器
			this.autoTimer = setInterval(() => {
				this.time = toCNTime(new Date());
			}, 1000);
			// 地图初始化
			document.querySelector('.inspection-map').style.height = (getScreenHeight() - 220 - 49) + 'px';
			document.querySelector('.inspection-map').style.marginTop = 220 + 'px';
			document.querySelector('.inspection-map').style.marginBottom = 49 + 'px';
			this.initMap();
		},
		beforeDestroy () {
			if (this.autoTimer) {
				clearInterval(this.autoTimer);
			}
		},
		methods: {
			...mapMutations([
				'SYNC_USERINFO',
				'TASK_LIST',
				'TO_SOLVE_TASK_LIST'
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
			},
			getInspectionList () {
				apis.taskList()
				.then((res) => {
					this.chooseSolveTask(res.data.data);
					this.TASK_LIST(res.data.data);
				})
				.catch((err) => {
					errorPublic(err.response);
				});
			},
			chooseSolveTask (tasks) {
				if (tasks.length <= 0) {
					return false;
				}
				this.needSolveTaskList = tasks.filter((item) => {
					return item.status.length && item.status.indexOf('U') !== -1;
				});
				this.TO_SOLVE_TASK_LIST(this.needSolveTaskList);
				if (this.needSolveTaskList.length) {
					this.task.value = this.needSolveTaskList[0].id;
					this.task.place = this.needSolveTaskList[0].place ? this.needSolveTaskList[0].place : {name: ''};

					// 地图加载完毕后加载点数据
					this.map.on('loadComplete', () => {
						if (this.task.place && this.task.place.hasOwnProperty('x')) {
							this.task.place.options = this.imageMaker(this.task.place.x, this.task.place.y, this.task.place.group_id);
						}
					});
				} else {
					this.task.place.name = '今天任务已完成';
					this.task.value = '';
					this.task.disabled = true;
				}
			},
			quickReportTask () {
				if (!this.task.value) {
					return false;
				}
				this.task.disabled = true;
				let params = {
					has_suspicious_person: 2,
					has_suspicious_item: 2
				};
				apis.reportTask(this.task.value, params)
				.then((res) => {
					// 切换到下个任务，并将当前任务从可用任务列表去除
					this.removeFirstTask();
				})
				.catch((err) => {
					errorPublic(err.response);
				});
			},
			removeFirstTask () {
				this.needSolveTaskList.shift(); // 移除第一项
				this.TO_SOLVE_TASK_LIST(this.needSolveTaskList); // 同步数据
				// 移除任务点
				this.removeMarker(this.task.place.options);

				if (this.needSolveTaskList.length === 0) { // 所有任务完成
					// 修改提示
					this.task.place.name = '今天任务已完成';
					this.task.value = '';
					return false;
				}
				this.task.value = this.needSolveTaskList[0].id;
				this.task.place = this.needSolveTaskList[0].place ? this.needSolveTaskList[0].place : '';
				// 添加巡检点
				this.task.place.options = this.imageMaker(this.task.place.x, this.task.place.y, this.task.place.group_id);
				this.task.disabled = false;
				this.taskCheck = '';
			},
			// 标记巡检点
			imageMaker (x, y, groupId) {
				if (!this.map) return '';
				let group = this.map.getFMGroup(groupId);
				let layer = group.getOrCreateLayer('imageMarker');
				// 图标标注对象，默认位置为该楼层中心点
				let im = new fengmap.FMImageMarker({
					x: x,
					y: y,
					z: 0,
					url: '/static/img/redPoint.png',        // 设置图片路径
					size: 80,                               // 设置图片显示尺寸
					// 图片标注渲染完成的回调方法
					callback: function () {
						// 在图片载入完成后，设置 "一直可见",即显示优先级最高
						// 如相同位置有其他标注，则此标注在前。
						im.alwaysShow();
					}
				});
				layer.addMarker(im);  // 标注层添加Marker
				return {layer: layer, marker: im};
			},
			// 我的位置
			loactionMaker (x, y, groupId, direction) {
				if (!this.map) return '';
				// 图标标注对象，默认位置为该楼层中心点
				let lm = new fengmap.FMLocationMarker({
					// 设置图片的路径
					url: '/static/img/pointer.png',
					// 设置图片显示尺寸
					size: 80,
					// 设置图片高度
					height: 10,
					// 图片标注渲染完成的回调方法
					callback: function () {
						// 在图片载入完成后，设置 "一直可见",即显示优先级最高
						// 如相同位置有其他标注，则此标注在前。
						lm.alwaysShow();
						lm.direction = direction;
					}
				});
				this.map.addLocationMarker(lm);  // 标注层添加Marker
				lm.setPosition({
					// 设置定位点的x坐标
					x: x,
					// 设置定位点的y坐标
					y: y,
					// 设置定位点所在楼层
					groupID: groupId,
					// 设置定位点的高于楼层多少
					zOffset: 1
				});
				return lm;
			},
			// 去除巡检点
			removeMarker (options) {
				options.layer.removeMarker(options.marker);
				options.marker = null;
				options.layer = null;
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
			z-index: 1000;
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
		.inspection-map {
			.task-list {
				position: absolute;
				bottom: 65px;
				right: 30px;
				width: 42px;
				height: 42px;
				background-color: $color-white;
				cursor: pointer;
				box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 3px;
				border-radius: 2px;
				font-size: 0.8em;
				font-weight: bold;
				color: rgb(102, 102, 102);
				text-align: center;
				line-height: 42px;
				z-index: 1;
			}
		}
		footer {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #f8f8f8;
			border-top: 1px solid #e2e2e2;
			z-index: 1000;
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
