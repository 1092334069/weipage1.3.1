<template>
	<div class="panel plugin" :class="{current: selectPluginId === viewData.pluginId}" :data-id="viewData.pluginId" :style="parsePanelStyle()">
		<template v-if="viewData.base.type == 'normal' || viewData.base.type == 'swiper'">
			<div class="panel-item" :class="viewData.base.type" :style="parsePanelItemStyle()">
				<template v-for="item in viewData.pluginList">
					<panel-view v-if="item.pluginType == 'panel'" :view-data="item" :select-plugin-id="selectPluginId"></panel-view>
					<text-view v-else-if="item.pluginType == 'text'" :view-data="item" :select-plugin-id="selectPluginId"></text-view>
					<image-view v-else-if="item.pluginType == 'image'" :view-data="item" :select-plugin-id="selectPluginId"></image-view>
					<form-view v-else-if="item.pluginType == 'form'" :view-data="item" :select-plugin-id="selectPluginId"></form-view>
				</template>
			</div>
		</template>
		<template v-else>
			<div class="panel-item" :class="viewData.base.type" :style="parsePanelItemStyle()">
				<template v-for="item in viewData.pluginList">
					<panel-view v-if="item.pluginType == 'panel'" :view-data="item" :select-plugin-id="selectPluginId"></panel-view>
					<text-view v-else-if="item.pluginType == 'text'" :view-data="item" :select-plugin-id="selectPluginId"></text-view>
					<image-view v-else-if="item.pluginType == 'image'" :view-data="item" :select-plugin-id="selectPluginId"></image-view>
					<form-view v-else-if="item.pluginType == 'form'" :view-data="item" :select-plugin-id="selectPluginId"></form-view>
				</template>
			</div>
			<div class="panel-item copy" :class="viewData.base.type" :style="parsePanelItemStyle()">
				<template v-for="item in viewData.pluginList">
					<panel-view v-if="item.pluginType == 'panel'" :view-data="item" :select-plugin-id="selectPluginId"></panel-view>
					<text-view v-else-if="item.pluginType == 'text'" :view-data="item" :select-plugin-id="selectPluginId"></text-view>
					<image-view v-else-if="item.pluginType == 'image'" :view-data="item" :select-plugin-id="selectPluginId"></image-view>
					<form-view v-else-if="item.pluginType == 'form'" :view-data="item" :select-plugin-id="selectPluginId"></form-view>
				</template>
			</div>
		</template>
		<Icon size="12" class="drop-icon" type="md-move" />
		<Icon size="12" class="resize-icon" type="md-resize" />
	</div>
</template>

<script>
	import styleView from '../styleView.js'

	export default {
		name: "panelView",
		props: {
			viewData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			selectPluginId: {
				type: String,
				default: ''
			}
		},
		data () {
		    return {}
		},
		methods: styleView
	}
</script>

<style scoped>
	.panel{
		overflow:hidden;
		position:relative;
	}
	.panel .panel{
		display:inline-block;
	}
	.panel .panel-item{
		position:relative;
		background-size:100% auto;
		background-repeat:no-repeat;
	}
	.panel .panel-item.copy{
		opacity:0.2;
	}
	.panel .panel-item.waterfall{
		width:50%;
		float:left;
	}
	.panel .panel-item.slider{
		width:66%;
	}
	.panel .panel-item.slider.copy{
		position:absolute;
		left:66%;
		top:0;
		bottom:0;
	}
	.panel .panel-item.swiper:after{
		content: '. . .';
		color:#fff;
		position:absolute;
		left:50%;
		bottom:10px;
		font-size:50px;
    	transform:translate(-50%,0);
	}
</style>