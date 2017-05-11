<template>
	<div class="k-checkbox">
		<label class="k-checkbox-label">
			<span :class="['k-checkbox-control', align === 'right' ? 'is-right': '']">
				<input
					class="k-checkbox-input"
					type="checkbox"
					:value="option.value"
					v-model="currentValue"
					:disabled="option.disabled">
				<span class="k-checkbox-core"></span>
			</span>
			<span class="k-checkbox-title" v-text="option.label" v-if="option.label"></span>
			<slot></slot>
		</label>
	</div>
</template>
<script>
	export default {
		name: 'k-checkbox',
		computed: {
			currentValue: {
				get () {
					return this.value;
				},
				set (val) {
					this.$emit('input', val);
					this.$emit('on-change', val);
				}
			}
		},
		props: {
			align: String,
			option: {
				type: Object,
				required: true
			},
			value: {
				default: null
			}
		}
	};
</script>
<style lang="scss">
	.k-checkbox{
		.k-checkbox-label{
			display: block;
		}
		.k-checkbox-title{
			vertical-align: middle;
		}
		.is-right{
			float:  right;
		}
		.k-checkbox-core{
			display: inline-block;
			background-color: #fff;
			border: 1px solid #ccc;
			position: relative;
			width: 20px;
			height: 20px;
			vertical-align: middle;
		}
		.k-checkbox-input{
			opacity: 0;
		}
		.k-checkbox-input:checked + .k-checkbox-core{
			background-color: #26a2ff;
			border-color: #26a2ff;
			&:after{
				border-color: #fff;
				transform: rotate(45deg) scale(1);
			}
		}
		.k-checkbox-input[disabled] + .k-checkbox-core{
			background-color: #d9d9d9;
			border-color: #ccc;
		}
		.k-checkbox-core:after{
			border: 2px solid transparent;
			border-left: 0;
			border-top: 0;
			content: " ";
			top: 3px;
			left: 6px;
			position: absolute;
			width: 4px;
			height: 8px;
			transform: rotate(45deg) scale(0);
			transition: transform .2s;
		}
	}
</style>
