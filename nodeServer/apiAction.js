const fs = require('fs')
const FormData = require('form-data')
const aesUtil = require('./aesUtil')
const apiServer = require('./apiServer')
const fileAction = require('./fileAction')
const sketchAction = require('./sketchAction')

const imageInfo = {
	upload: function(parameter, callback) {
		fileAction.fileUpload(parameter.req, (file, path) => {
			let formdata = new FormData()
			console.log(fs.createReadStream(path))
			formdata.append('file', fs.createReadStream(path))
			parameter.param = formdata
			console.log(parameter.param);
			apiServer.javaServerRequest(parameter, callback)
		}, callback)
	},
	insert: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	delete: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	detail: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	getPageList: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	}
}

const interfaceInfo = {
	insert: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	update: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	delete: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	detail: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	getPageList: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	}
}

const loginInfo = {
	phoneCode: function(parameter, callback, requestResult) {
		apiServer.serverRequest(parameter, (res) => {
			const result = JSON.parse(res)
			if (result && result.code === 200 && result.data) {
				requestResult.cookie('userIdStr', result.data.userIdStr)
				requestResult.cookie('token', result.data.token)
			}
			callback(res)
		})
	},
	phonePassword: function(parameter, callback, requestResult) {
		apiServer.serverRequest(parameter, (res) => {
			const result = JSON.parse(res)
			if (result && result.code === 200 && result.data) {
				requestResult.cookie('userIdStr', result.data.userIdStr)
				requestResult.cookie('token', result.data.token)
			}
			callback(res)
		})
	}
}

const phoneInfo = {
	sendPhoneCode: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	}
}

const userInfo = {
	detail: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	}
}

const weipageInfo = {
	insert: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	update: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	delete: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	detail: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	},
	getPageList: function(parameter, callback) {
		apiServer.serverRequest(parameter, callback)
	}
}

const localInfo = {
	getLocalKey: function(parameter, callback) {
		const ip = parameter.req.headers['x-forwarded-for'] || 
        parameter.req.connection.remoteAddress || 
        parameter.req.socket.remoteAddress || 
        parameter.req.connection.socket.remoteAddress
        callback(JSON.stringify({
			localKey: aesUtil.encrypt(ip)
        }))
	}
}

const fileInfo = {
	sketchUpload: function(parameter, callback) {
		if (parameter.param.userIdStr) {
			fileAction.sketchUpload(parameter.req, parameter.param.userIdStr, callback)
		} else {
			callback(JSON.stringify({
				code: 700,
				message: '未登录'
			}))
		}
	},
	sketchToWeipage: function(parameter, callback) {
		if (parameter.param.userIdStr) {
			if (parameter.param.folderName && parameter.param.dirId && parameter.param.pageId) {
				localInfo.getLocalKey(parameter, (r) => {
					const res = JSON.parse(r)
					if (res && res.localKey) {
						const sketctData = {
							folderName:parameter.param.folderName,
							dirId: parameter.param.dirId,
							pageId: parameter.param.pageId
						}
						sketchAction.sketchToWeipage(sketctData, res.localKey, callback)
					} else {
						callback(JSON.stringify({
							code: 601,
							message: '密钥丢失'
						}))
					}
				})
			} else {
				callback(JSON.stringify({
					code: 600,
					message: '缺少参数'
				}))
			}
		} else {
			callback(JSON.stringify({
				code: 700,
				message: '未登录'
			}))
		}
	}
}

module.exports = {
	imageInfo,
	interfaceInfo,
	loginInfo,
	phoneInfo,
	userInfo,
	weipageInfo,
	localInfo,
	fileInfo
}