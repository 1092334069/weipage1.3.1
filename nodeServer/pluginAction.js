const pluginConfig = require('../plugin/pluginConfig')

// 创建插件列表
function createPluginList(localKey, scaleplateList, layerList, imageSource, imgFileDir) {
	const pluginList = []
	for (let i = 0; i < scaleplateList.length; i++) {
		let height = 0
		if (i > 0) {
			height = scaleplateList[i] - scaleplateList[i-1]
		} else {
			height = scaleplateList[i]
		}
		const style = {
			width: 375,
			height
		}
		const panelPlugin = createPanel(localKey, '面板', style)
		pluginList.push(panelPlugin)
	}
	for (let i = 0; i < layerList.length; i++) {
		for (let j = 0; j < scaleplateList.length; j++) {
			if ((layerList[i].place.top + layerList[i].place.height) <= scaleplateList[j]) {
				const pluginName = layerList[i].id
				let top = 0
				if (j > 0) {
					top = scaleplateList[j-1]
				}
				let pluginStyle = {}
				if (layerList[i].style) {
					pluginStyle = layerList[i].style
				}
				pluginStyle['position'] = 'absolute'
				pluginStyle['top'] = layerList[i].place.top - top
				pluginStyle['left'] = layerList[i].place.left
				pluginStyle['width'] = layerList[i].place.width
				pluginStyle['height'] = layerList[i].place.height
				if (imageSource[layerList[i].src]) {
					pluginStyle['backgroundImage'] = imgFileDir + '/' + imageSource[layerList[i].src]
				}
				const panelPlugin = createPanel(localKey, pluginName, pluginStyle)
				if (layerList[i].content) {
					panelPlugin.pluginList.push(createText(localKey, layerList[i].content))
				}
				pluginList[j].pluginList.push(panelPlugin)
				break
			}
		}
	}
	return pluginList
}

let uuIndex = 0

// 获取全局唯一id
function getLocalUuid(localKey) {
	const timeString = Date.now()
	uuIndex += 1
	return 'p' + localKey + timeString + uuIndex
}

// 创建面板插件
function createPanel(localKey, name, style) {
	const plugin = JSON.parse(JSON.stringify(pluginConfig['panel']))
	plugin['pluginId'] = getLocalUuid(localKey)
	plugin.base.name = name
	for (let key in style) {
		plugin.style[key] = style[key]
	}
	return plugin
}

// 创建文本插件
function createText(localKey, text) {
	const plugin = JSON.parse(JSON.stringify(pluginConfig['text']))
	plugin['pluginId'] = getLocalUuid(localKey)
	plugin.base.data = text
	return plugin
}

module.exports = {
	createPluginList
}