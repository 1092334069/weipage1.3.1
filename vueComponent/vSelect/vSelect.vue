<template>
	<div class="vSelect" :style="{paddingLeft:lableWidth}">
		<span v-if="lable" class="lable" :style="{width:lableWidth}">{{lable}}：</span>
		<select ref="form" v-model="model" @change="formChange">
			<option value="">请选择</option>
			<option v-for="item in options" :value="item.value" :selected="checkTheSame(item.value, model)">{{item.label}}</option>
		</select>
	</div>
</template>

<script>
	export default {
		name: "vSelect",
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
			},
			lableWidth: {
				type: Number,
				default: 80
			},
			options: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data () {
		    return {}
		},
		methods: {
			checkTheSame: function(a, b) {
				if (a === b) {
					return true
				} else {
					return false
				}
			},
			formChange: function() {
				this.$emit('formChange', this.$refs.form.value)
			}
		},
		computed: {
			model: {
				get() {
					return this.formData[this.name]
				},
				set(val) {
					this.formData[this.name] = val
					this.$emit('formChange', {
						name: this.name,
						value: val
					})
				}
			}
		}		
	}
</script>

<style scoped>
	.vSelect{
		margin:6px;
		position:relative;
		display:inline-block;
	}
	.lable{
		display:inline-block;
		font-size:14px;
		text-align:right;
		position:absolute;
		left:0;
		top:0;
		height:28px;
		line-height:28px;
	}
	.vSelect select{
		min-width:100px;
		height:26px;
		font-size:14px;
	}
</style>