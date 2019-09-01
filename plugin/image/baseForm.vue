<template>
	<div>
		<div class="form">
			<v-text lable="名称" :formData="formData" size="l" name="name"></v-text>
		</div>
		<div class="form">
			<v-image lable="图片" :formData="formData" name="data" @selectImage="selectImage"></v-image>
		</div>
		<div class="form">
			<v-number lable="宽度" :formData="formData" name="width"></v-number>
		</div>
		<action-form :formData="formData" :action-key-list="actionKeyList" @selectActionValue="selectActionValue" @selectImage="selectImage"></action-form>
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
	
</style>