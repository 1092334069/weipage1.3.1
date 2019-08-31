<template>
	<div>
		<v-select v-if="type === 'select'" :lable="lable" :options="inputOptions" :formData="inputForm" name="data"></v-select>
		<v-text v-else :lable="lable" :formData="inputForm" name="data"></v-text>
		<v-select :lableWidth="0" :options="sourceOptions" :formData="inputForm" name="source"></v-select>
	</div>
</template>

<script>
	export default {
		name: "vInputSource",
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
			sourceOptions: {
				type: Array,
				default: function() {
					return []
				}
			},
			type: {
				type: String,
				default: 'text'
			},
			inputOptions: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data () {
		    return {}
		},
		computed: {
			inputForm() {
				return this.formData[this.name]
			}
		}
	}
</script>