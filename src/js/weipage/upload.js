import 'babel-polyfill'
import '../../css/reset.css'

var pageVue = new Vue({
	el: '#uploadList',
	data() {
		return {
			folderName: '',
			fileName: '',
			fileList: [],
			uploadTable: [
				{ title: '分类', key: 'dirName' },
				{ title: '页面名称', key: 'pageName' },
				{ title: '操作', key: 'action', render: (h, params) => {
					return h('div',[
						h('Button', {
							on: {
								click: () => {
									this.sketchToWeipage(params.row.dirId, params.row.pageId)
								}
							}
						}, '生成')
					])
				}}
			]
		}
	},
	methods: {
		sketchToWeipage: function(dirId, pageId) {
			$.ajax({
				url: '/api/file/sketchToWeipage',
				type: 'get',
				data: {
					folderName: this.folderName,
					fileName: this.fileName,
					dirId,
					pageId
				},
				dataType: 'json',
				success: function(res) {
					console.log(res)
				}
			})
		},
		upload: function() {
			$('#file').click()
		}
	}
})

$('#file').on('change', () => {
	const file = $('#file')
	const formData = new FormData()
	formData.append('file', file[0].files[0])
	$.ajax({
		url: '/api/file/sketchUpload',
		type: 'post',
		data: formData,
		contentType: false,
		processData: false,
		dataType: 'json',
		success: (res) => {
			if (res && res.code === 200 && res.data) {
				pageVue.fileList = res.data.dirList
				pageVue.folderName = res.data.folderName
				pageVue.fileName = res.data.fileName
			}
			$('#file').val('')
		},
		error: () => {
			$('#file').val('')
		}
	})
})
