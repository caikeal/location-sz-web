<template>
	<div class="huawei-inspection">
		<div class="fixed-heading">
			<div class="heading">
				<div class="heading-content">
					<img src="../../assets/images/logo/logo.png" alt="logo" class="img-logo">
				</div>
			</div>
			<div class="time-counter cl-fx">
				<span class="now-date">{{this.time.year}}-{{this.time.month}}-{{this.time.day}}&nbsp;&bull;&nbsp;星期{{this.time.week}}</span>
				<span class="now-time">{{this.time.hour}}:{{this.time.minute}}:{{this.time.second}}</span>
			</div>
		</div>
		<div class="inspection-map"></div>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import { mapState } from 'vuex';
	import { getScreenHeight, toCNTime } from '../../utils/fixTool.js';
	import fengmap from 'fengmap';
	import env from '../../config/env.js';
	let map = null; // 定义全局map变量

	export default {
		name: 'huawei-inspection',
		data () {
			return {
				time: toCNTime(new Date()),
				autoTimer: '',
				nowPlaceMaker: null
			};
		},
		computed: {
			...mapState([
				'myPlace'
			])
		},
		watch: {
			myPlace: {
				handler (val) {
					this.nowPlaceMaker = this.loactionMaker(val.x, val.y, val.group_id, val.direction);
				},
				deep: true
			}
		},
		created () {
			if (this.$route.meta.refresh) {
				window.location.reload();
			}
			// 添加head头
			changeTitle(this.$route);
		},
		mounted () {
			// 开启定时器
			this.autoTimer = setInterval(() => {
				this.time = toCNTime(new Date());
			}, 1000);
			// 地图初始化
			document.querySelector('.inspection-map').style.height = (getScreenHeight() - 205) + 'px';
			document.querySelector('.inspection-map').style.marginTop = 205 + 'px';
			this.initMap();
		},
		beforeDestroy () {
			if (this.autoTimer) {
				clearInterval(this.autoTimer);
			}
			if (this.nowPlaceMaker) {
				map.removeLocationMarker(this.nowPlaceMaker);
				this.nowPlaceMaker = null;
			}
			map = null;
		},
		methods: {
			initMap () {
				let fmapID = env.mapInfo.id;
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
					key: env.mapInfo.key,
					// 开发者申请应用名称
					appName: env.mapInfo.name
				});

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
			// 我的位置
			loactionMaker (x, y, groupId, direction) {
				if (!map) return '';
				let lm = this.nowPlaceMaker;
				if (lm) {
					lm.setPosition({
						// 设置定位点的x坐标
						x: x,
						// 设置定位点的y坐标
						y: y,
						// 设置定位点所在楼层
						groupID: Number(groupId),
						// 设置定位点的高于楼层多少
						zOffset: 1
					});
					lm.direction = direction;
				} else {
					// 图标标注对象，默认位置为该楼层中心点
					lm = new fengmap.FMLocationMarker({
						// 设置图片的路径
						url: '/static/img/pointer.png',
						// 设置图片显示尺寸
						size: 50,
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
					map.addLocationMarker(lm);  // 标注层添加Marker
					lm.setPosition({
						// 设置定位点的x坐标
						x: x,
						// 设置定位点的y坐标
						y: y,
						// 设置定位点所在楼层
						groupID: Number(groupId),
						// 设置定位点的高于楼层多少
						zOffset: 1
					});
				}
				return lm;
			}
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
				padding: 10px 10px;
				color: $color-black2;
				.now-date {
					height: 38px;
					line-height: 38px;
				}
				.now-time {
					float: right;
					font-size: 22px;
					line-height: 0.8;
					border-left: 1px dashed $color-grey2;
					height: 38px;
					line-height: 38px;
					display: block;
					padding-left: 20px;
					font-weight: 600;
				}
				box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 1px 5px rgba(171, 171, 171, 0.6);
			}
		}
	}
</style>
