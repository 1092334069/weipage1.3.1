<template>
	<div class="vImage" :style="{paddingLeft:lableWidth}">
		<span v-if="lable" class="lable" :style="{width:lableWidth}">{{lable}}：</span>
		<div v-if="model!==''" class="upload-btn" @click="selectImage">
			<img :src="model" />
		</div>
		<div v-else class="upload-btn default" @click="selectImage"></div>
	</div>
</template>

<script>
	export default {
		name: "vImage",
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
			}
		},
		data () {
		    return {}
		},
		methods: {
			selectImage: function() {
				this.$emit('selectImage', {
					formData: this.formData,
					name: this.name
				})
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
	.vImage{
		margin:6px;
		position:relative;
		display:inline-block;
	}
	.lable{
		display:inline-block;
		font-size:14px;
		text-align:right;
		position:absolute;
		top:0;
		left:0;
		height:28px;
		line-height:28px;
	}
	.upload-btn{
		display:inline-block;
		width:68px;
		height:68px;
		cursor:pointer;
	}
	.upload-btn.default{
		background-image:url('../../src/img/icon-upload.png');
		background-size:100% 100%;
	}
	.upload-btn img{
		width:68px;
		height:68px;
	}
</style>