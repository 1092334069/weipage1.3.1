<template>
	<div class="plugin-form">
		<div class="form">
			<v-text lable="名称" :formData="formData" name="name" size="l"></v-text>
		</div>
		<div class="form">
			<v-radio lable="类型" :options="typeList" :formData="formData" name="type"></v-radio>
		</div>
		<action-form :formData="formData" :action-key-list="actionKeyList" @selectActionValue="selectActionValue" @selectImage="selectImage"></action-form>
		<form ref="actionForm">
			<div class="form-list">
				<div class="form-lable">属性：</div>
				<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.attrList" @click="selectAttr(index)">{{item.name}}</div>
				<div class="add-module" @click="addAttr"></div>
			</div>
			<div class="sub-form-list" v-if="formData.attrList && formData.attrList.length">
				<hr/>
				<template v-for="(item,index) in formData.attrList" v-if="attrSelectIndex === index">
					<div class="delete-module" @click="deleteAttr"></div>
					<div class="form">
						<v-text lable="属性键" :formData="item" name="key" placeholder="请输入字母"></v-text>
					</div>
					<div class="form">
						<div class="form-perch">
							<span class="lable">属性值：</span>
							<div class="perch-btn" @click="selectAttrValue(formData.attrList, index)">{{item.name}}</div>
						</div>
					</div>
				</template>
				<hr/>
			</div>
		</form>
	</div>
</template>

<script>
	import { getLocalUuid } from '../pluginAction.js'

	export default {
		name: "panelBaseForm",
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
		    	attrSelectIndex: 0,
				typeList: [{
					label: '普通',
					value: 'normal'
				},{
					label: '列表',
					value: 'list'
				},{
					label: '瀑布流',
					value: 'waterfall'
				},{
					label: '轮播',
					value: 'swiper'
				},{
					label: '滑块',
					value: 'slider'
				}],
				actionKeyList: [{
					label: '数据',
					value: 'base.data',
					type: 'text'
				},{
					label: '样式 宽度',
					value: 'style.width',
					type: 'number'
				},{
					label: '样式 高度',
					value: 'style.height',
					type: 'number'
				},{
					label: '样式 外边距',
					value: 'style.margin',
					type: 'fourSides'
				},{
					label: '样式 内边距',
					value: 'style.padding',
					type: 'fourSides'
				},{
					label: '样式 圆角',
					value: 'style.borderRadius',
					type: 'fourSides'
				},{
					label: '样式 旋转',
					value: 'style.transformRotate',
					type: 'number'
				},{
					label: '样式 状态',
					value: 'style.display',
					type: 'select',
					options: [{
						label: '显示',
						value: 'block'
					},{
						label: '隐藏',
						value: 'none'
					}]
				},{
					label: '样式 边框',
					value: 'style.border',
					type: 'text'
				},{
					label: '样式 定位',
					value: 'style.position',
					type: 'text'
				},{
					label: '样式 背景颜色',
					value: 'style.backgroundColor',
					type: 'color'
				},{
					label: '样式 图片',
					value: 'style.backgroundImage',
					type: 'image'
				},{
					label: '样式 字体对齐',
					value: 'style.textAlign',
					type: 'select',
					options: [{
						label: '左',
						value: 'left'
					},{
						label: '右',
						value: 'right'
					},{
						label: '中',
						value: 'center'
					}]
				},{
					label: '样式 字体大小',
					value: 'style.fontSize',
					type: 'number'
				},{
					label: '样式 字体颜色',
					value: 'style.color',
					type: 'color'
				},{
					label: '样式 字体行高',
					value: 'style.lineHeight',
					type: 'number'
				},{
					label: '样式 字体宽度',
					value: 'style.fontWeight',
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
			},
			parseClass: function(index) {
				if (index === this.attrSelectIndex) {
					return 'current'
				} else {
					return ''
				}
			},
			selectAttrValue: function(list, index) {
				this.$emit('open-interface-tree-model', {
					formData: list,
					name: index
				})
			},
			selectAttr: function(index) {
				this.attrSelectIndex = index
			},
			addAttr: function() {
				const attrList = this.formData.attrList
				const uuid = getLocalUuid()
				attrList.push({
					attrId: uuid,
					key: '',
					name: '请选择属性',
					url: '',
					keyList: []
				})
				this.attrSelectIndex = attrList.length - 1
			},
			deleteAttr: function() {
				const attrList = this.formData.attrList
				attrList.splice(this.attrSelectIndex, 1)
				this.attrSelectIndex = 0
			}
		}
	}
</script>

<style>

</style>