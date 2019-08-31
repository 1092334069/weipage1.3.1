<template>
	<div class="plugin-form">
		<div class="form">
			<v-text lable="名称" :formData="formData" size="l" name="name"></v-text>
		</div>
		<div class="form">
			<v-text lable="默认值" :formData="formData" size="l" name="data"></v-text>
		</div>
		<div class="form">
			<v-text lable="表单键" :formData="formData" size="l" name="key" placeholder="请输入字母"></v-text>
		</div>
		<v-radio lable="表单类型" :options="typeOptions" :formData="formData" name="type"></v-radio>
		<action-form :form-data="formData" :action-key-list="actionKeyList" @form-change="formChange" @select-action-value="selectActionValue" @select-image="actionSelectImage"></action-form>
		<form v-if="formData.type === 'select'">
			<div class="form-list">
				<div class="form-lable">选项：</div>
				<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.optionList" @click="selectOption(index)">{{item.label}}</div>
				<div class="add-module" @click="addOption"></div>
			</div>
			<div class="sub-form-list" v-if="formData.optionList && formData.optionList.length">
				<hr/>
				<template v-for="(item,index) in formData.optionList" v-if="optionSelectIndex === index">
					<div class="delete-module" @click="deleteOption"></div>
					<div class="form">
						<v-text lable="选项名" :formData="item" name="label"></v-text>
					</div>
					<div class="form">
						<v-text lable="选项值" :formData="item" name="value"></v-text>
					</div>
				</template>
				<hr/>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: "formBaseForm",
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
				optionSelectIndex: 0,
				actionKeyList: [{
					label: '数据',
					value: 'data',
					type: 'text'
				},{
					label: '样式 宽度',
					value: 'width',
					type: 'number'
				},{
					label: '样式 高度',
					value: 'height',
					type: 'number'
				},{
					label: '样式 字体大小',
					value: 'fontSize',
					type: 'number'
				},{
					label: '样式 文字颜色',
					value: 'color',
					type: 'color'
				}],
				typeOptions: [{
					label: '文本',
					value: 'text'
				},{
					label: '数字',
					value: 'number'
				},{
					label: '电话',
					value: 'tel'
				},{
					label: '选项',
					value: 'select'
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
			},
			parseClass: function(index) {
				if (index === this.optionSelectIndex) {
					return 'current'
				} else {
					return ''
				}
			},
			selectOption: function(index) {
				this.optionSelectIndex = index
			},
			addOption: function() {
				const optionList = this.formData.optionList
				optionList.push({
					label: '',
					value: ''
				})
				this.optionSelectIndex = optionList.length - 1
			},
			deleteOption: function() {
				const optionList = this.formData.optionList
				optionList.splice(this.formData.optionSelectIndex, 1)
				this.optionSelectIndex = 0
			}
		}
	}
</script>

<style scoped>
	.form{
		position:relative;
		margin:5px 0;
	}
</style>