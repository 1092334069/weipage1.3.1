<template>
	<div>
		<div class="form-group" @click="triggerForm('shape')">
			<span>形状</span>
			<span class="form-trigger" :class="{ close: formValid.shape }"></span>
		</div>
		<div v-if="formValid.shape">
			<div class="form">
				<v-number lable="宽度" :formData="formData" name="width"></v-number>
			</div>
			<div class="form">
				<v-number lable="高度" :formData="formData" name="height"></v-number>
			</div>
			<div class="form">
				<v-four-sides lable="外边距" :formData="formData" name="margin"></v-four-sides>
			</div>
			<div class="form">
				<v-four-sides lable="内边距" :formData="formData" name="padding"></v-four-sides>
			</div>
			<div class="form">
				<v-four-sides lable="圆角" :formData="formData" name="borderRadius"></v-four-sides>
			</div>
			<div class="form">
				<v-number lable="旋转" :formData="formData" name="transformRotate"></v-number>
			</div>
			<div class="form">
				<v-radio lable="状态" :options="displayOptions" :formData="formData" name="display"></v-radio>
			</div>
		</div>
		<div class="form-group" @click="triggerForm('border')">
			<span>边框</span>
			<span class="form-trigger" :class="{ close: formValid.border }"></span>
		</div>
		<div v-if="formValid.border">
			<div class="form">
				<v-radio lable="边框状态" :options="borderDisplayOptions" :formData="formData" name="border"></v-radio>
			</div>
			<template v-if="formData.border==='block'">
				<div class="form">
					<v-radio lable="边框风格" :options="borderStyleOptions" :formData="formData" name="borderStyle"></v-radio>
				</div>
				<div class="form">
					<v-four-sides lable="边框尺寸" :formData="formData" name="borderWidth"></v-four-sides>
				</div>
				<div class="form">
					<v-color lable="边框颜色" :formData="formData" name="borderColor"></v-color>
				</div>
			</template>
		</div>
		<div class="form-group" @click="triggerForm('location')">
			<span>定位</span>
			<span class="form-trigger" :class="{close:formValid.location}"></span>
		</div>
		<div v-if="formValid.location">
			<div class="form">
				<v-radio lable="定位" :options="locationPositionOptions" :formData="formData" name="position"></v-radio>
			</div>
			<template v-if="formData.position!=='relative'">
				<div class="form">
					<v-number lable="横向" :formData="formData" name="left"></v-number>
				</div>
				<div class="form">
					<v-number lable="纵向" :formData="formData" name="top"></v-number>
				</div>
			</template>
		</div>
		<div class="form-group" @click="triggerForm('fill')">
			<span>填充</span>
			<span class="form-trigger" :class="{ close: formValid.fill }"></span>
		</div>
		<div v-if="formValid.fill">
			<div class="form">
				<v-color lable="颜色" :formData="formData" name="backgroundColor"></v-color>
			</div>
			<div class="form">
				<v-image lable="图片" :formData="formData" name="backgroundImage" @selectImage="selectImage"></v-image>
			</div>
		</div>
		<div class="form-group" @click="triggerForm('text')">
			<span>字体</span>
			<span class="form-trigger" :class="{ close: formValid.text }"></span>
		</div>
		<div v-if="formValid.text">
			<div class="form">
				<v-radio lable="对齐" :options="textAlignOptions" :formData="formData" name="textAlign"></v-radio>
			</div>
			<div class="form">
				<v-number lable="字体大小" :formData="formData" name="fontSize"></v-number>
			</div>
			<div class="form">
				<v-color lable="字体颜色" :formData="formData" name="color"></v-color>
			</div>
			<div class="form">
				<v-number lable="字体行高" :formData="formData" name="lineHeight"></v-number>
			</div>
			<div class="form">
				<v-radio lable="字体宽度" :options="fontWeightOptions" :formData="formData" name="fontWeight"></v-radio>
			</div>
			<div class="form">
				<v-radio lable="字体风格" :options="fontStyleOptions" :formData="formData" name="fontStyle"></v-radio>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "panelStyleForm",
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
				lableWidth: 30,
				isReadOnly: true,
				formValid: {
					shape: true,
					border: false,
					location: false,
					fill: false,
					text: false
				},
				displayOptions: [{
					label: '显示',
					value: 'block'
				},{
					label: '隐藏',
					value: 'none'
				}],
				borderDisplayOptions: [{
					label: '显示',
					value: 'block'
				},{
					label: '隐藏',
					value: 'none'
				}],
				borderStyleOptions: [{
					label: '实线',
					value: 'solid'
				},{
					label: '虚线',
					value: 'dashed'
				},{
					label: '点线',
					value: 'dotted'
				}],
				locationPositionOptions: [{
					label: '无',
					value: 'relative'
				},{
					label: '相对',
					value: 'absolute'
				},{
					label: '固定',
					value: 'fixed'
				}],
				textAlignOptions:[{
					label: '左',
					value: 'left'
				},{
					label: '右',
					value: 'right'
				},{
					label: '中',
					value: 'center'
				}],
				fontWeightOptions: [{
					label: '默认',
					value: 'normal'
				},{
					label: '加粗',
					value: 'bold'
				}],
				fontStyleOptions: [{
					label: '默认',
					value: 'normal'
				},{
					label: '斜体',
					value: 'italic'
				}]
			}
		},
		methods: {
			selectImage: function(res) {
				this.$emit('select-image', res)
			},
			triggerForm: function(key) {
				if (this.formValid[key]) {
					this.formValid[key] = false
				} else {
					this.formValid[key] = true
				}
			}
		}
	}
</script>

<style scoped>
	.form-group{
		padding:10px;
		background-color:#f2f2f2;
		font-size:16px;
		position:relative;
		margin-bottom:5px;
		cursor:pointer;
	}
	.form-group .form-trigger{
		width:20px;
		height:20px;
		background-image:url('../../src/img/icon-more.png');
		background-size:100% 100%;
		position:absolute;
		right:10px;
		top:6px;
		display:inline-block;
		cursor:pointer;
	}
	.form-group .form-trigger.close{
		transform:rotate(90deg);
	}
	.form{
		position:relative;
		width:300px;
		margin:5px 0;
	}
</style>