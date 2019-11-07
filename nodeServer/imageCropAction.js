const fs = require('fs')
const gm = require('gm')

// 主图裁剪
function artboardCrop(fileDir, scaleplateList, callback, errorCallback) {
	const artboardDir = __dirname + fileDir + '/artboard'
	createArtboardDir(artboardDir, () => {
		const srcImg = __dirname + fileDir + '/artboard.png'
		gm(srcImg).size((err, size) => {
			if (err) {
				errorCallback(JSON.stringify({code: 500, message: '切片失败' }))
				return
			}
			const scale = size.width / 375
			const maxHeight = size.height / scale
			// 当坐标没到达到原图高度时，将原图高度补充进最后一个坐标
			const scaleplateJsonList = JSON.parse(JSON.stringify(scaleplateList))
			if (maxHeight > scaleplateJsonList[scaleplateJsonList.length - 1]) {
				scaleplateJsonList.push(maxHeight)
			}
			cropImageList(0, fileDir, scaleplateJsonList, 0, srcImg, scale, maxHeight, (lastScaleplate) => {
				callback(lastScaleplate)
			}, () => {
				errorCallback(JSON.stringify({code: 501, message: '切片失败' }))
			})
		})
	})
}


// 创建切图文件夹
function createArtboardDir(src, callback) {
	fs.exists(src, function(res) {
		if (res) {
			callback()
		} else {
			fs.mkdir(src, function(err) {
				callback()
			})
		}
	})
}

// 裁剪图片列表
function cropImageList(count, fileDir, scaleplateList, lastNum, srcImg, scale, maxHeight, callback, errorCallback) {
	if (count > 10000) {
		errorCallback()
		return
	}
	if (scaleplateList.length) {
		const item = scaleplateList.splice(0, 1)
		const destImg = `${__dirname}${fileDir}/artboard/${item[0]}.png`
		const height = (item[0] - lastNum) * scale
		const top = lastNum * scale
		const width = 375 * scale
		// 当坐标系的高度超过原图高度时直接使用原图高度切最后一张
		if (height < maxHeight) {
			cropImg(srcImg, destImg, width, height, 0, top, (r) => {
				if (r) {
					count += 1
					cropImageList(count, fileDir, scaleplateList, item[0], srcImg, scale, maxHeight, callback, errorCallback)
				} else {
					errorCallback()
				}
			}, errorCallback)
		} else {
			cropImg(srcImg, destImg, width, maxHeight, 0, top, (r) => {
				if (r) {
					callback(maxHeight)
				} else {
					errorCallback()
				}
			}, errorCallback)
		}
	} else {
		callback()
	}
}

// 切图
function cropImg(srcImg, destImg, width, height, x, y , callback, errorCallback) {
	gm(srcImg).crop(width, height, x, y).write(destImg, function (err) {
		if (err) {
			callback(false)
		} else {
			callback(true)
		}
	})
}

module.exports = {
	artboardCrop,
	cropImg
}