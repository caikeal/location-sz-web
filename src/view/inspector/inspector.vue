<template>
	<div class="huawei-inspector">
		<div class="inspector-map-container"></div>
		<div class="inspector-list cl-fx">
			<div class="inspector-info cl-fx" v-for="user in userList">
				<div :class="['inspector-poster', user.isOn ? 'user-on' : 'user-off']">
					<img :src="user.poster" alt="poster">
				</div>
				<div :class="['inspector-name', 'one-line', user.isOn ? 'user-on' : 'user-off']">
					<span>{{user.name}}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import { mapMutations } from 'vuex';
	import apis from '../../service/getData.js';
	import errorPublic from '../../service/errorPublic.js';
	import { getScreenHeight } from '../../utils/fixTool.js';
	import fengmap from 'fengmap';
	import env from '../../config/env.js';
	let map = null;

	export default {
		name: 'HuaweiInspector',
		data () {
			return {
				userList: [],
				intervalTime: null
			};
		},
		created () {
			// 添加head头
			changeTitle(this.$route);
			// 同步用户信息
			this.SYNC_USERINFO();
			// 用户列表
			this.initData();
		},
		mounted () {
			// 地图初始化
			document.querySelector('.inspector-map-container').style.height = Math.floor(getScreenHeight() * 0.6) + 'px';
			this.initMap();
			map.on('loadComplete', () => {
				this.getUserPoint();
			});
			this.intvalPoint();
		},
		beforeDestroy () {
			map = null;
			if (this.intervalTime) {
				clearInterval(this.intervalTime);
				this.intervalTime = null;
			}
		},
		methods: {
			...mapMutations([
				'SYNC_USERINFO'
			]),
			initMap () {
				let fmapID = env.mapInfo.id;
				/* eslint-disable no-new, new-cap */
				map = new fengmap.FMMap({
					// 渲染dom
					container: document.querySelector('.inspector-map-container'),
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
			initData () {
				apis.inspectorList()
				.then((res) => {
					this.userList = res.data.data.map((item) => {
						item.isOn = false;
						item.groupId = null;
						item.textMarker = null;
						item.imgMarker = null;
						return item;
					});
				})
				.catch((err) => {
					errorPublic(err.response);
				});
			},
			// 获取用户位置
			getUserPoint () {
				apis.inspectorPoint('all')
				.then((res) => {
					res.data.data.map((item) => {
						let user = this.userList.find((val) => Number(val.id) === Number(item.user_id));
						if (item.place) {
							if (user.groupId) { // 存在楼层数的图层
								// 文字删除
								this.removeTextMarker(user.groupId, user.textMarker);

								user.groupId = item.place.group_id;
								// 图片
								user.imgMarker.moveToGroup(item.place.group_id);
								user.imgMarker.setPosition(item.place.x, item.place.y, Number(item.place.group_id), 0);

								// 文字添加
								user.textMarker = this.addTextMarker(item.place.x, item.place.y, item.place.group_id, user.name);
							} else { // 不存在楼层
								user.groupId = item.place.group_id;
								// 添加图片
								user.imgMarker = this.addImgMarker(item.place.x, item.place.y, item.place.group_id);

								// 添加文字
								user.textMarker = this.addTextMarker(item.place.x, item.place.y, item.place.group_id, user.name);
							}
							user.isOn = true;
						} else {
							// 移除原先图形
							user.textMarker ? this.removeTextMarker(user.groupId, user.textMarker) : '';
							user.imgMarker ? this.removeImgMarker(user.groupId, user.imgMarker) : '';
							user.isOn = false;
							user.groupId = '';
							user.textMarker = '';
							user.imgMarker = '';
						}
					});
				})
				.catch((err) => {
					errorPublic(err.response);
				});
			},
			// 开启循环
			intvalPoint () {
				this.intervalTime = setInterval(() => {
					this.getUserPoint();
				}, 30000);
			},
			getLayer (groupId, layerName) {
				if (!map) return '';
				let group = map.getFMGroup(groupId);
				return group.getOrCreateLayer(layerName);
			},
			removeTextMarker (groupId, marker) {
				this.getLayer(groupId, 'textMarker').removeMarker(marker);
			},
			removeImgMarker (groupId, marker) {
				this.getLayer(groupId, 'imageMarker').removeMarker(marker);
			},
			addTextMarker (x, y, groupId, name) {
				let layer = this.getLayer(groupId, 'textMarker');
				// 图标标注对象，默认位置为该楼层中心点
				let tm = new fengmap.FMTextMarker({
					x: Number(x),
					y: Number(y),
					z: 0,
					name: name,        // 设置文字
					fillcolor: '255,0,0', // 填充色
					fontsize: 10,     // 设置尺寸
					// 图片标注渲染完成的回调方法
					callback: function () {
						// 在图片载入完成后，设置 "一直可见",即显示优先级最高
						// 如相同位置有其他标注，则此标注在前。
						tm.alwaysShow();
					}
				});
				layer.addMarker(tm);  // 标注层添加Marker
				return tm;
			},
			addImgMarker (x, y, groupId, img = '/static/img/blueImageMarker.png') {
				if (!map) return '';
				let layer = this.getLayer(groupId, 'imageMarker');
				// 图标标注对象，默认位置为该楼层中心点
				let im = new fengmap.FMImageMarker({
					x: x,
					y: y,
					z: 0,
					height: 0,
					url: img,        // 设置图片路径
					size: 70,        // 设置图片显示尺寸
					// 图片标注渲染完成的回调方法
					callback: function () {
						// 在图片载入完成后，设置 "一直可见",即显示优先级最高
						// 如相同位置有其他标注，则此标注在前。
						im.alwaysShow();
					}
				});
				layer.addMarker(im);  // 标注层添加Marker
				return im;
			}
		}
	};
</script>
<style lang="scss">
	.huawei-inspector {
		.inspector-map-container {
			margin-top: 0px;
		}
		.inspector-list {
			margin: 10px 15px;
			overflow: hidden;
			& > .inspector-info {
				width: 50%;
				float: left;
				margin-top: 15px;
				.inspector-poster {
					float: left;
					position: relative;
					top: 0;
					right: 0;
					& > img {
						width: 60px;
						border-radius: 50%;
					}
				}
				.inspector-poster.user-off {
					&:before {
						content: ' ';
						top: 0;
						right: 0;
						width: 60px;
						height: 60px;
						position: absolute;
						border-radius: 50%;
						background: rgba(255, 255, 255, 0.8);
					}
				}
				.inspector-name {
					float: left;
					line-height: 60px;
					margin-left: 10px;
					font-size: 15px;
					width: 51%;
				}
				.inspector-name.user-off {
					color: #b5b5b5;
				}
			}
		}
	}
</style>
