<template>
	<div>
		<div class="form">
			<v-number lable="宽度" :formData="formData" name="width"></v-number>
		</div>
		<div class="form">
			<v-number lable="高度" :formData="formData" name="height"></v-number>
		</div>
		<div class="form">
			<v-number lable="字体大小" :formData="formData" name="fontSize"></v-number>
		</div>
		<div class="form">
			<v-color lable="字体颜色" :formData="formData" name="color"></v-color>
		</div>
		<div class="form">
			<v-color lable="背景颜色" :formData="formData" name="backgroundColor"></v-color>
		</div>
		<div class="form">
			<v-image lable="图片" :formData="formData" name="backgroundImage"></v-image>
		</div>
	</div>
</template>

<script>
	export default {
		name: "formStyleForm",
		props: {
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data () {
			return {}
		}
	}
</script>

<style scoped>

</style>