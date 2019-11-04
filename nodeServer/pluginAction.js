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
			height,
			backgroundImage: imgFileDir + '/artboard/' + scaleplateList[i] + '.png'
		}
		const panelPlugin = createPanel(localKey, '面板', style)
		pluginList.push(panelPlugin)
	}
	for (let i = 0; i < layerList.length; i++) {
		for (let j = 0; j < scaleplateList.length; j++) {
			if ((layerList[i].place.top + layerList[i].place.height) <= scaleplateList[j]) {
				const pluginName = layerList[i].name
				let top = 0
				if (j > 0) {
					top = scaleplateList[j-1]
				}
				const pluginStyle = {
					position: 'absolute',
					top: layerList[i].place.top - top,
					left: layerList[i].place.left,
					width: layerList[i].place.width,
					height: layerList[i].place.height
				}
				if (layerList[i].style) {
					pluginStyle['textAlign'] = layerList[i].style['text-align'] || 'left'
					pluginStyle['fontSize'] = parseInt(layerList[i].style['font-size']) || 12
					pluginStyle['color'] = layerList[i].style.color || '#333333'
					pluginStyle['lineHeight'] = parseInt(layerList[i].style['line-height']) || 18
				}
				if (imageSource[layerList[i].id]) {
					pluginStyle['backgroundImage'] = imgFileDir + '/' + imageSource[layerList[i].id]
				}
				const panelPlugin = createPanel(localKey, pluginName, pluginStyle)
				if (layerList[i].html) {
					panelPlugin.style['display'] = 'none'
					panelPlugin.pluginList.push(createText(localKey, layerList[i].html))
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