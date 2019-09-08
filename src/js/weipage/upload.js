import 'babel-polyfill'
import '../../css/reset.css'

$('#btn').click(function() {
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
		success: function(res) {
			console.log(res)
		}
	})
})

$.ajax({
	url: '/api/file/sketchToWeipage',
	type: 'get',
	data: {
		folderName: '0e38bc264f47dcec9edd6b21bb95d8f6_20190908181237',
		fileName: '2',
		dirId: '57B1B839-4E03-428A-883C-ADB6F0FE43F3',
		pageId: '787F49B2-8194-49D5-8E59-ECB84FE4E7DB'
	},
	dataType: 'json',
	success: function(res) {
		console.log(res)
	}
})
