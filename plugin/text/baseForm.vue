<template>
	<div>
		<div class="form">
			<v-text lable="名称" :formData="formData" name="name" size="l"></v-text>
		</div>
		<div class="form">
			<v-text lable="默认值" :formData="formData" name="data" size="xl"></v-text>
		</div>
		<action-form :formData="formData" :action-key-list="actionKeyList" @selectActionValue="selectActionValue" @selectImage="selectImage"></action-form>
	</div>
</template>

<script>
	export default {
		name: "textBaseForm",
		props: {
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data () {
			return {
				actionKeyList:[{
					label: '值',
					value: 'base.data',
					type: 'text'
				}]
			}
		},
		methods: {
			selectImage: function(res) {
				this.$emit('select-image', res)
			},
			selectActionValue: function(res) {
				this.$emit('open-interface-tree-model', res)
			}
		}
	}
</script>

<style>
	.form{
		position:relative;
		margin:5px 0;
	}
</style>