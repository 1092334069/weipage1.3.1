<template>
	<div>
		<v-number v-if="!isValueObject" :lable="lable" :formData="formData" :name="name"></v-number>
		<v-text v-else :lable="lable" :formData="valueObject" name="value" :isReadOnly="isReadOnly"></v-text>
		<Icon v-if="subFormValid" size="20" type="ios-arrow-back" class="icon-more" @click="triggerSubForm" />
		<Icon v-else type="ios-arrow-forward" size="20" class="icon-more" @click="triggerSubForm" />
		<div class="sub-form" v-if="subFormValid">
			<v-number lable="上" size="ss" :formData="modelForm" name="top" :lableWidth="lableWidth" @formChange="formChange"></v-number>
			<v-number lable="右" size="ss" :formData="modelForm" name="right" :lableWidth="lableWidth" @formChange="formChange"></v-number>
			<v-number lable="下" size="ss" :formData="modelForm" name="bottom" :lableWidth="lableWidth" @formChange="formChange"></v-number>
			<v-number lable="左" size="ss" :formData="modelForm" name="left" :lableWidth="lableWidth" @formChange="formChange"></v-number>
		</div>
	</div>
</template>

<script>
	export default {
		name: "vFourSides",
		props: {
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			name: {
				type: String,
				default: ''
			},
			lable: {
				type: String,
				default: ''
			}
		},
		data () {
		    return {
		    	lableWidth: 30,
		    	subFormValid: false,
		    	isReadOnly: true
		    }
		},
		methods: {
			triggerSubForm: function() {
				if (this.subFormValid) {
					this.subFormValid = false
				} else {
					this.subFormValid = true
				}
			},
			computedSubForm: function(data, index) {
				if (typeof data === 'number' || typeof data === 'string') {
					return data
				} else if (typeof data === 'object' && data instanceof Array && data[index]) {
					return data[index]
				} else {
					return 0
				}
			},
			formChange: function(r) {
				const val = this.formData[this.name]
				let data = [0, 0, 0, 0]
				if (typeof val === 'number' || typeof val === 'string') {
					data = [val, val, val, val]
				} else if (typeof val === 'object' && val instanceof Array) {
					data = val
				}
				switch(r.name) {
					case 'top': data[0] = r.value; break;
					case 'right': data[1] = r.value; break;
					case 'bottom': data[2] = r.value; break;
					default: data[3] = r.value
				}
				let isTheSame = true
				for (let i = 1; i < data.length; i++) {
					if (parseFloat(data[i]) !== parseFloat(data[i-1])) {
						isTheSame = false
					}
				}
				this.modelValue = r.value
				if (!isTheSame) {
					this.modelValue = data
				}
			}
		},
		computed: {
			modelForm() {
				return {
					top: this.computedSubForm(this.formData[this.name], 0),
					right: this.computedSubForm(this.formData[this.name], 1),
					bottom: this.computedSubForm(this.formData[this.name], 2),
					left: this.computedSubForm(this.formData[this.name], 3)
				}
			},
			modelValue: {
				get() {
					return this.formData[this.name]
				},
				set(val) {
					this.formData[this.name] = val
				}
			},
			isValueObject() {
				if (typeof this.formData[this.name] === 'object') {
					return true
				} else {
					return false
				}
			},
			valueObject() {
				if (typeof this.modelValue === 'object' && this.modelValue instanceof Array) {
					return {
						value: this.modelValue.join(' ')
					}
				} else {
					return {}
				}
			}
		}
	}
</script>

<style scoped>
	.sub-form{
		position:absolute;
		padding:10px;
		top:0;
		right:-90px;
		width:130px;
		background-color:#f0f0f0;
		border-radius:5px;
		z-index:10;
	}
	.sub-form:before{
		content:"";
		width:0;
		height:0;
		border-top:10px solid transparent;
		border-bottom:10px solid transparent;
		border-right:20px solid #f0f0f0;
		position:absolute;
		top:12px;
		left:-16px;
	}
	.icon-more{
		cursor:pointer;
	}
</style>
