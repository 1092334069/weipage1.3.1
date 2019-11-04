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
			cropImageList(0, fileDir, JSON.parse(JSON.stringify(scaleplateList)), 0, srcImg, scale, () => {
				callback()
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
function cropImageList(count, fileDir, scaleplateList, lastNum, srcImg, scale, callback, errorCallback) {
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
		cropImg(srcImg, destImg, width, height, 0, top, (r) => {
			if (r) {
				count += 1
				cropImageList(count, fileDir, scaleplateList, item[0], srcImg, scale, callback, errorCallback)
			} else {
				callback()
			}
		}, errorCallback)
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
	artboardCrop
}