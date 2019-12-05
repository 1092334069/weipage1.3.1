const fs = require('fs')
const path = require("path")
const fileConfig = require('../config/fileConfig')
const pluginAction = require('./pluginAction')
const quickSortAction = require('./quickSortAction')

// 获取文件目录结构
function getLayerDir(folderName, callback) {
	try {
		const fileDir = __dirname + '/' + fileConfig.sketch + '/'
		const file = path.join(fileDir + folderName + '/', 'data.json')
		fs.readFile(file, 'utf-8', function(err, jsonData) {
			if (err) {
				callback(JSON.stringify({code: 505, message: '文件上传失败' }))
				return
			}
			const data = JSON.parse(jsonData)
			const dirList = []
			if (data && data.pageData && data.layerGroup) {
				for (let key in data.pageData) {
					const pageList = []
					for (let i = 0; i < data.pageData[key].artboardId.length; i++) {
						const artboardId = data.pageData[key].artboardId[i]
						const artboardItem = getArtboardItem(data, artboardId)
						if (artboardItem) {
							dirList.push({
								dirId: key,
								dirName: decodeURIComponent(data.pageData[key].name),
								pageId: artboardId,
								pageName: decodeURIComponent(artboardItem.name)
							})
						}
					}
				}
				callback(JSON.stringify({
					code: 200,
					data: {
						folderName,
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
	const fileUrl = `/${fileConfig.sketch}/${sketctData.folderName}/`
	const file = path.join(fileUrl, 'data.json')
	try {
		fs.readFile(__dirname + file, 'utf-8', function(err, jsonData) {
			if (err) {
				callback(JSON.stringify({code: 501, message: '生成失败' }))
				return
			}
			const imgFileDir = fileUrl + 'pic'
			const imageFileList = readFileList(__dirname + imgFileDir)
			const layerList = parseLayerList(jsonData, sketctData.dirId, sketctData.pageId)
			const coordinateList = parseCoordinateList(layerList)
			const imageSource = parseImageList(layerList, imageFileList)
			const scaleplateList = parseScaleplate(coordinateList)
			const pluginList = pluginAction.createPluginList(localKey, scaleplateList, layerList, imageSource, '/nodeServer' + imgFileDir)
			callback(JSON.stringify({
				code: 200,
				data: {
					pluginList,
					layerList,
					coordinateList: scaleplateList
				},
				message: '生成成功'
			}))
		})
	} catch (err) {
		callback(JSON.stringify({code: 500, message: '生成失败' }))
	}
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
				if (imageFileList[j].indexOf(layerList[i].src) >= 0) {
					imageSource[layerList[i].src] = imageFileList[j]
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
	if (data && data.pageOrder && data.pageData && data.layerGroup) {
		for (let i = 0; i < data.pageOrder.length; i++) {
			const pageOrderItem = data.pageData[data.pageOrder[i]]
			if (pageOrderItem && data.pageOrder[i] === pageId) {
				const pageOrderObj = {
					id: data.pageOrder[i],
					name: decodeURIComponent(pageOrderItem.name),
					artboardList: []
				}
				for (let j = 0; j < pageOrderItem.artboardId.length; j++) {
					if (pageOrderItem.artboardId[j] === artboardId) {
						const artboardItem = getArtboardItem(data, artboardId)
						if (artboardItem) {
							const artboardObj = {
								id: artboardItem.id,
								name: '',
								layerList: []
							}
							// 算出页面比例
							let ratio = 1
							if (artboardItem.width >= 320) {
								ratio = parseInt(parseInt(artboardItem.width) / 375)
							}
							for (let k = 0; k < artboardItem.layers.length; k++) {
								const detail = artboardItem.layers[k]
								if (detail) {
									const layerItem = {
										id: detail.objectID,
										src: detail.objectID,
										name: detail.name,
										place: {
											left: parseInt(detail.rect.x / ratio),
											top: parseInt(detail.rect.y / ratio),
											width: parseInt(detail.rect.width / ratio),
											height: parseInt(detail.rect.height / ratio)
										},
										content: detail.content || '',
										style: parseLayerStyle(detail.css)
									}
									artboardObj.layerList.push(layerItem)
								}

							}
							pageOrderObj.artboardList.push(artboardObj)
						}
						break
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

function toCamel(str) {
  	return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
	    return $1 + $2.toUpperCase();
  	})
}

function parseLayerStyleValue(val) {
	if (val) {
		return val.trim().replace(';', '')
	}
	return ''
}

function parseLayerStyle(layerCssList) {
	const style = {}
	if (layerCssList) {
		for (let i = 0; i < layerCssList.length; i++) {
			if (layerCssList[i]) {
				const list = layerCssList[i].split(':')
				if (list && list.length > 1) {
					const key = toCamel(list[0])
					style[key] = parseLayerStyleValue(list[1])
				}
			}
		}
	}
	return style
}

function getArtboardItem(data, artboardId) {
	for (var i = 0; i < data.layerGroup.length; i++) {
		if (data.layerGroup[i].id === artboardId) {
			return data.layerGroup[i]
		}
	}
	return null
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
	return quickSortAction.quickSort(coordinateList)
}

module.exports = {
	getLayerDir,
	sketchToWeipage
}