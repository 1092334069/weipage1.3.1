<template>
	<div class="text plugin" :data-id="viewData.pluginId">
		<template v-if="parseBaseData()" v-for="item in parseTextHtml(parseBaseData())">
			<span>{{item}}</span><br />
		</template>
	</div>
</template>

<script>
	import mobileMethods from '../mobileMethods.js'

	export default {
		name: "textView",
		props: {
			viewData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			viewDataIndexList: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data () {
		    return {}
		},
		methods: mobileMethods
	}
</script>

<style scoped>
	.text{
		display:inline-block;
		max-width:100%;
		word-wrap:break-word;
	}
</style>