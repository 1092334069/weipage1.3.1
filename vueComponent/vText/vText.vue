<template>
	<div class="vInput" :style="{paddingLeft:lableWidth}">
		<span v-if="lable" class="lable" :style="{width:lableWidth}">{{lable}}：</span>
		<input type="text" :class="size" v-model="model" :readonly="isReadOnly" :placeholder="placeholder" />
	</div>
</template>

<script>
	export default {
		name: "vText",
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
			lableWidth:{
				type: Number,
				default: 80
			},
			size: {
				type: String,
				default: 'm'
			},
			isReadOnly: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: ''
			}
		},
		data () {
		    return {}
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
	.vInput{
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
	.vInput input{
		padding:5px;
		border:1px solid #e5e5e5;
		border-radius:2px;
	}
	.vInput input:hover{
		border-color:#138ed4;
	}
	.vInput .s{
		width:60px;
	}
	.vInput .m{
		width:120px;
	}
	.vInput .l{
		width:180px;
	}
	.vInput .xl{
		width:240px;
	}
	input[readonly='readonly']{
		background-color:#f2f2f2;
	}
</style>