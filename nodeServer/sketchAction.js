const fs = require('fs')
const path = require("path")
const fileConfig = require('../config/fileConfig')
const pluginConfig = require('../plugin/pluginConfig')

// 获取文件目录结构
function getLayerDir(folderName, fileName, callback) {
	try {
		const fileDir = __dirname + '/' + fileConfig.sketch + '/'
		const file = path.join(fileDir + folderName + '/' + fileName + '/', 'data.json')
		fs.readFile(file, 'utf-8', function(err, jsonData) {
			if (err) {
				callback(JSON.stringify({code: 505, message: '文件上传失败' }))
				return
			}
			const data = JSON.parse(jsonData)
			const dirList = []
			if (data && data.pageData && data.artboard) {
				for (let key in data.pageData) {
					const pageList = []
					for (let i = 0; i < data.pageData[key].artboardId.length; i++) {
						const artboardId = data.pageData[key].artboardId[i]
						if (data.artboard[artboardId]) {
							dirList.push({
								dirId: key,
								dirName: decodeURIComponent(data.pageData[key].name),
								pageId: artboardId,
								pageName: decodeURIComponent(data.artboard[artboardId].name)
							})
						}
					}
				}
				callback(JSON.stringify({
					code: 200,
					data: {
						folderName,
						fileName,
						dirList
					},
					message: '文件上传成功'
				}))
			} else {
				callback(JSON.stringify({code: 506, message: '文件上传失败' }))
			}
		})
	} catch (err) {
		callback(JSON.stringify({code: 507, message: '文件上传失败' }))
	}
}

// sketch转微页面
function sketchToWeipage(sketctData, localKey, callback) {
	const fileDir = '/' + fileConfig.sketch + '/'
	const fileUrl = fileDir + sketctData.folderName + '/' + sketctData.fileName + '/'
	const file = path.join(fileUrl, 'data.json')
	try {
		fs.readFile(__dirname + file, 'utf-8', function(err, jsonData) {
			if (err) {
				callback(JSON.stringify({code: 501, message: '生成失败' }))
				return
			}
			const imgFileDir = fileUrl + sketctData.pageId
			const imageFileList = readFileList(__dirname + imgFileDir)
			const layerList = parseLayerList(jsonData, sketctData.dirId, sketctData.pageId)
			const coordinateList = parseCoordinateList(layerList)
			const imageSource = parseImageList(layerList, imageFileList)
			const scaleplateList = parseScaleplate(coordinateList)
			const pluginList = createPluginList(localKey, scaleplateList, layerList, imageSource, '/nodeServer' + imgFileDir)

			callback(JSON.stringify({
				code: 200,
				data: {
					pluginList
				},
				message: '生成成功'
			}))

		})
	} catch (err) {
		callback(JSON.stringify({code: 500, message: '生成失败' }))
	}
}

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
		const panelPlugin = createPanel(localKey, '面板', {
			width: 375,
			height
		})
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
					pluginStyle['backgroundImage'] = imgFileDir + '/' +imageSource[layerList[i].id]
				}
				const panelPlugin = createPanel(localKey, pluginName, pluginStyle)
				if (layerList[i].html) {
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

// 读取资源文件夹
function readFileList(path) {
	const filesList = []
	const files = fs.readdirSync(path)
	files.forEach(function (itm, index) {
		const stat = fs.statSync(path + '/' + itm)
		if (!stat.isDirectory()) {
			filesList.push(itm)
		}
	})
	return filesList
}

// 解析图片资源
function parseImageList(layerList, imageFileList) {
	const imageSource = {}
	if (layerList && layerList.length && imageFileList && imageFileList.length) {
		for (let i = 0; i < layerList.length; i++) {
			for (let j = imageFileList.length - 1; j >= 0; j--) {
				if (imageFileList[j].indexOf(layerList[i].id) >= 0) {
					imageSource[layerList[i].id] = imageFileList[j]
					break
				}
			}
		}
	}
	return imageSource
}

// 解析标尺
function parseScaleplate(coordinateList) {
	const list = []
	if (coordinateList && coordinateList.length) {
		list.push({
			top: coordinateList[0].top,
			bottom: coordinateList[0].bottom
		})
		for (let i = 1; i < coordinateList.length; i++) {
			const item = list[list.length - 1]
			if (coordinateList[i].top >= item.bottom) {
				list.push({
					top: coordinateList[i].top,
					bottom: coordinateList[i].bottom
				})
			} else if (coordinateList[i].bottom > item.bottom) {
				item.bottom = coordinateList[i].bottom
			}
		}
	}
	const scaleplateList = []
	for (let i = 0; i < list.length; i++) {
		scaleplateList.push(list[i].bottom)
	}
	return scaleplateList
}

// 解析布局资源
function parseLayerList(jsonData, pageId, artboardId) {
	const data = JSON.parse(jsonData)
	const pageOrderList = []
	if (data && data.pageOrder && data.pageData && data.artboard) {
		for (let i = 0; i < data.pageOrder.length; i++) {
			const pageOrderItem = data.pageData[data.pageOrder[i]]
			if (pageOrderItem && data.pageOrder[i] === pageId) {
				const pageOrderObj = {
					id: data.pageOrder[i],
					name: decodeURIComponent(pageOrderItem.name),
					artboardList: []
				}
				for (let j = 0; j < pageOrderItem.artboardId.length; j++) {
					const artboardItem = data.artboard[pageOrderItem.artboardId[j]]
					if (artboardItem && artboardItem.id === artboardId) {
						const percentage = artboardItem.width / 375
						const artboardX = artboardItem.x
						const artboardY = artboardItem.y
						const artboardObj = {
							id: artboardItem.id,
							name: decodeURIComponent(artboardItem.name),
							layerList: []
						}
						for (let k = 0; k < artboardItem.layer.length; k++) {
							const layerItem = {
								id: artboardItem.layer[k].id,
								name: decodeURIComponent(artboardItem.layer[k].name),
								style: artboardItem.layer[k].style,
								place: {
									left: artboardItem.layer[k].x - artboardX,
									top: artboardItem.layer[k].y - artboardY,
									width: artboardItem.layer[k].width / percentage,
									height: artboardItem.layer[k].height / percentage
								}
							}
							if (artboardItem.layer[k].hasOwnProperty('html')) {
								layerItem.html = decodeURIComponent(artboardItem.layer[k].html)
							}
							artboardObj.layerList.push(layerItem)
						}
						pageOrderObj.artboardList.push(artboardObj)
					}
				}
				pageOrderList.push(pageOrderObj)
			}
		}
	}
	if (pageOrderList.length && pageOrderList[0].artboardList && pageOrderList[0].artboardList.length) {
		return pageOrderList[0].artboardList[0].layerList
	} else {
		return []
	}
}

// 重构排序
function parseCoordinateList(layerList) {
	const coordinateList = []
	if (layerList && layerList.length) {
		for (let i = 0; i < layerList.length; i++) {
			coordinateList.push({
				id: layerList[i].id,
				left: layerList[i].place.left,
				top: layerList[i].place.top,
				right: layerList[i].place.width + layerList[i].place.left,
				bottom: layerList[i].place.height + layerList[i].place.top
			})
		}
	}
	return quickSort(coordinateList)
}

// 以下三个方法是快速排序
function quickSort(arr, left, right) {
	let len = arr.length,
		partitionIndex
		left = typeof left != 'number' ? 0 : left,
		right = typeof right != 'number' ? len - 1 : right
	if (left < right) {
		partitionIndex = partition(arr, left, right)
		quickSort(arr, left, partitionIndex - 1)
		quickSort(arr, partitionIndex + 1, right)
	}
	return arr
}
function partition(arr, left, right) {
	let pivot = left,
		index = pivot + 1
	for (let i = index; i <= right; i++) {
		if (arr[i].top < arr[pivot].top) {
			swap(arr, i, index)
			index ++
		} else if (arr[i].top === arr[pivot].top && arr[i].left < arr[pivot].left) {
			swap(arr, i, index)
			index ++
		}
	}
	swap(arr, pivot, index - 1)
	return index - 1
}
function swap(arr, i, j) {
	let temp = arr[i]
	arr[i] = arr[j]
	arr[j] = temp
}

module.exports = {
	getLayerDir,
	sketchToWeipage
}