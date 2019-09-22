const fs = require('fs')
const path = require("path")
const fileConfig = require('../config/fileConfig')
const pluginAction = require('./pluginAction')
const quickSortAction = require('./quickSortAction')
const imageCropAction = require('./imageCropAction')

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

			imageCropAction.artboardCrop(imgFileDir, scaleplateList, () => {
				const pluginList = pluginAction.createPluginList(localKey, scaleplateList, layerList, imageSource, '/nodeServer' + imgFileDir)
				callback(JSON.stringify({
					code: 200,
					data: {
						layerList,
						pluginList
					},
					message: '生成成功'
				}))
			}, callback)

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
	return quickSortAction.quickSort(coordinateList)
}

module.exports = {
	getLayerDir,
	sketchToWeipage
}