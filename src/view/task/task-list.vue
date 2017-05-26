<template>
	<div class="huawei-task-list">
		<ul>
			<li v-for="(taskItem, index) in taskList">
				<div class="content cl-fx">
					<div class="heading">
						<span>{{ index+1 }}</span>
					</div>
					<div class="place-name one-line">{{ taskItem.place?taskItem.place.name:'' }}</div>
					<div :class="['inspection-status', inspectionStatusToColor(taskItem.status)]">{{ inspectionStatusToCN(taskItem.status) }}</div>
					<div class="inspection-status-icon">
						<img :src="inspectionStatusToIcon(taskItem.status)" alt="logo">
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import changeTitle from '../../utils/changeTitle.js';
	import apis from '../../service/getData.js';
	import errorPublic from '../../service/errorPublic.js';
	const abnormalIcon = require('../../assets/images/inspection/abnormal.png');
	const uncheckIcon = require('../../assets/images/inspection/uncheck.png');
	const delayIcon = require('../../assets/images/inspection/delay.png');
	const normalIcon = require('../../assets/images/inspection/normal.png');

	export default {
		name: 'huawei-task-list',
		created () {
			// 添加head头
			changeTitle(this.$route);
		},
		methods: {
			...mapMutations([
				'SYNC_USERINFO',
				'TASK_LIST',
				'TO_SOLVE_TASK_LIST'
			]),
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
			},
			inspectionStatusToCN (status) {
				let tem = '';
				let statusRange = {
					'U': '未检',
					'N': '正常',
					'A': '异常',
					'D': '漏检'
				};
				if (status instanceof Array) {
					for (let i of status) {
						tem += statusRange[i] + ' ';
					}
				} else if (typeof status === 'string') {
					tem += statusRange[status] + ' ';
				}
				return tem.trim();
			},
			inspectionStatusToColor (status) {
				let tem = '';
				let statusRange = {
					'U': 'color-silver',
					'N': 'color-success',
					'A': 'color-danger',
					'D': 'color-warning'
				};
				if (status instanceof Array || typeof status === 'string') {
					if (status.indexOf('U') !== -1) {
						tem = statusRange.U;
					}
					if (status.indexOf('N') !== -1) {
						tem = statusRange.N;
					}
					if (status.indexOf('D') !== -1) {
						tem = statusRange.D;
					}
					if (status.indexOf('A') !== -1) {
						tem = statusRange.A;
					}
				}
				return tem;
			},
			inspectionStatusToIcon (status) {
				let tem = '';
				let statusRange = {
					'U': uncheckIcon,
					'N': normalIcon,
					'A': abnormalIcon,
					'D': delayIcon
				};
				if (status instanceof Array || typeof status === 'string') {
					if (status.indexOf('U') !== -1) {
						tem = statusRange.U;
					}
					if (status.indexOf('N') !== -1) {
						tem = statusRange.N;
					}
					if (status.indexOf('D') !== -1) {
						tem = statusRange.D;
					}
					if (status.indexOf('A') !== -1) {
						tem = statusRange.A;
					}
				}
				return tem;
			}
		}
	};
</script>
<style lang="scss">
	@import '../../assets/sass/parital/_var.scss';

	.huawei-task-list {
		padding-top: 20px;
		.content {
			padding: 15px 15px;
			line-height: 1.5;
			font-size: 13px;
			&>div {
				float: left;
			}
			.heading {
				width: 12%;
			}
			.place-name {
				width: 40%;
			}
			.inspection-status {
				width: 36%;
			}
			.inspection-status-icon {
				width: 12%;
			}
			.color-danger {
				color: $error-color;
			}
			.color-silver {
				color: $color-silver;
			}
			.color-warning {
				color: $warning-color;
			}
			.color-success {
				color: $success-color;
			}
			.inspection-status-icon img {
				width: 20px;
			}
		}
	}
</style>
