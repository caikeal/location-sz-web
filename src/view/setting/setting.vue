<template>
	<div class="huawei-setting">
		<div class="setting-cell">
			<mt-cell title="人员定位" is-link :to="{ name: 'Home' }"></mt-cell>
		</div>
	</div>
</template>
<script>
	import { Cell } from 'mint-ui';
	import changeTitle from '../../utils/changeTitle.js';
	// import errorPublic from '../../service/errorPublic.js';

	export default {
		name: 'huawei-setting',
		created () {
			// 添加head头
			changeTitle(this.$route);
		},
		methods: {
		},
		components: {
			[Cell.name]: Cell
		}
	};
</script>
<style lang="scss">
	.huawei-setting {
		.setting-cell {
			margin-top: 25px;
		}
	}
</style>
