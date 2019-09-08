const fs = require('fs')
const path = require("path")
const fileConfig = require('../config/fileConfig')

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
							pageList.push({
								id: artboardId,
								name: decodeURIComponent(data.artboard[artboardId].name)
							})
						}
					}
					dirList.push({
						id: key,
						name: decodeURIComponent(data.pageData[key].name),
						pageList
					})
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

function sketchToWeipage(folderName, fileName, dirId, pageId, callback) {
	const fileDir = __dirname + '/' + fileConfig.sketch + '/'
	const fileUrl = fileDir + folderName + '/' + fileName + '/'
	const file = path.join(fileUrl, 'data.json')
	try {
		fs.readFile(file, 'utf-8', function(err, jsonData) {
			if (err) {
				callback(JSON.stringify({code: 501, message: '生成失败' }))
				return
			}
			const imgFileDir = fileUrl + pageId
			const imageFileList = readFileList(imgFileDir)
			const layerList = parseLayerList(jsonData, dirId, pageId)
			const coordinateList = parseCoordinateList(layerList)
			const imageList = parseImageList(layerList, imageFileList)
			callback(JSON.stringify({
				code: 200,
				data: {
					layerList,
					coordinateList,
					imageList
				},
				message: '生成成功'
			}))

		})
	} catch (err) {
		callback(JSON.stringify({code: 500, message: '生成失败' }))
	}
}

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

function parseImageList(layerList, imageFileList) {
	const imageList = []
	if (layerList && layerList.length && imageFileList && imageFileList.length) {
		for (let i = 0; i < layerList.length; i++) {
			for (let j = imageFileList.length - 1; j >= 0; j--) {
				if (imageFileList[j].indexOf(layerList[i].id) >= 0) {
					imageList.push({
						id: layerList[i].id,
						src: imageFileList[j]
					})
					break
				}
			}
		}
	}
	return imageList
}

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