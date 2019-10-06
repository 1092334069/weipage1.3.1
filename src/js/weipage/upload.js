import 'babel-polyfill'
import '../../css/reset.css'
import { weipageAction } from './weipageAction.js'

let isUploading = false

var pageVue = new Vue({
	el: '#uploadList',
	data() {
		return {
			folderName: '',
			fileList: [],
			uploadTable: [
				{ title: '分类', key: 'dirName' },
				{ title: '页面名称', key: 'pageName' },
				{ title: '操作', key: 'action', render: (h, params) => {
					if (params.row.weipageId) {
						return h('div',[
							h('Button', {
								on: {
									click: () => {
										window.open(`/weipage/view?weipageId=${params.row.weipageId}`)
									}
								}
							}, '预览')
						])
					} else {
						return h('div',[
							h('Button', {
								on: {
									click: () => {
										this.sketchToWeipage(params.row.dirId, params.row.pageId, params.row.pageName)
									}
								}
							}, '生成')
						])
					}
				}}
			]
		}
	},
	methods: {
		sketchToWeipage: function(dirId, pageId, pageName) {
			if (isUploading) {
				return
			}
			isUploading = true
			const loadingMsg = this.$Message.loading({
				content: '正在生成，请稍等',
				duration: 0
			})
			$.ajax({
				url: '/api/file/sketchToWeipage',
				type: 'get',
				data: {
					folderName: this.folderName,
					dirId,
					pageId,
					pageName
				},
				dataType: 'json',
				success: (res) => {
					if (res && res.code === 200) {
						weipageAction.insertWeipage({
							name: pageName,
							describes: '',
							cover: 'http://hbimg.b0.upaiyun.com/2e5bbdfd2c380c468fe9b05f985b890b35cf74d519a98-WPlKO2_fw236',
							pageName: this.fileName,
							data: {
								weipage: {
									name: '',
									describes: '',
									cover: '',
									pageName: '',
									backgroundColor: '',
									interfaceList: [],
									scrollEvent: {
										eventList: []
									},
									countEvent: {
										eventList: []
									}
								},
								pluginList: res.data.pluginList,
								interfaceTree: []
							}
						}, (result) => {
							for (let i = 0; i < this.fileList.length; i++) {
								if (this.fileList[i].pageId === pageId) {
									this.fileList[i]['weipageId'] = result.weipageId
									break
								}
							}
							this.$Message.success('生成成功')
							loadingMsg()
							isUploading = false
						}, (msg) => {
							if (msg) {
								this.$Message.error(msg)
							} else {
								this.$Message.error('生成失败，请稍后重试')
							}
							loadingMsg()
							isUploading = false
						})
					} else {
						this.$Message.error('生成失败，请稍后重试')
						loadingMsg()
						isUploading = false
					}
				},
				error: () => {
					loadingMsg()
					isUploading = false
				}
			})
		}
	}
})

if (sessionStorage['fileList']) {
	pageVue.fileList = JSON.parse(sessionStorage['fileList'])
	pageVue.folderName = sessionStorage['folderName']
} else {
	pageVue.$Message.error('文件已失效，请重新上传')
}
