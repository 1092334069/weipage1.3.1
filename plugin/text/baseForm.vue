<template>
	<div>
		<div class="form">
			<v-text lable="名称" :formData="formData" name="name" size="l"></v-text>
		</div>
		<div class="form">
			<v-text lable="默认值" :formData="formData" name="data" size="xl"></v-text>
		</div>
		<action-form :form-data="formData" :action-key-list="actionKeyList" @form-change="formChange" @select-action-value="selectActionValue"></action-form>
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
			formChange: function(res) {
				res['pname'] = 'base'
				this.$emit('form-change', res)
			},
			selectActionValue: function() {
				this.$emit('open-interface-tree-model', 'baseAction')
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