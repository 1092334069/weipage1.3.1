<template>
	<div>
		<div class="form">
			<v-text lable="名称" :formData="formData" size="l" name="name"></v-text>
		</div>
		<div class="form">
			<v-image lable="图片" :formData="formData" name="data"></v-image>
		</div>
		<div class="form">
			<v-number lable="宽度" :formData="formData" name="width"></v-number>
		</div>
		<action-form :form-data="formData" :action-key-list="actionKeyList" @form-change="formChange" @select-action-value="selectActionValue" @select-image="actionSelectImage"></action-form>
	</div>
</template>

<script>
	export default {
		name: "imageBaseForm",
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
				actionKeyList: [{
					label: '图片',
					value: 'base.data',
					type: 'image'
		    	},{
		    		label: '宽度',
		    		value: 'base.width',
		    		type: 'number'
		    	}]
		    }
		},
		methods: {
			formChange: function(res) {
				res['pname'] = 'base'
				this.$emit('form-change', res)
			},
			actionSelectImage: function(res) {
				this.$emit('action-select-image', res)
			},
			selectActionValue: function() {
				this.$emit('open-interface-tree-model', 'baseAction')
			}
		}
	}
</script>

<style>
	
</style>