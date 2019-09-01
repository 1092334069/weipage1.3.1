<template>
	<div class="plugin-form">
		<div class="form">
			<v-text lable="名称" :formData="formData" name="name" size="l"></v-text>
		</div>
		<div class="form">
			<v-text lable="描述" :formData="formData" name="describes" size="l"></v-text>
		</div>
		<div class="form">
			<v-image lable="图片" :formData="formData" name="cover" @selectImage="selectImage"></v-image>
		</div>
		<div class="form">
			<v-text lable="文件名" :formData="formData" name="pageName" size="l" placeholder="请输入字母"></v-text>
		</div>
		<div class="form">
			<v-color lable="背景色" :formData="formData" name="backgroundColor"></v-color>
		</div>
		<div class="form-list">
			<div class="form-lable">接口：</div>
			<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.interfaceList" @click="selectInterface(index)">{{item.name}}</div>
			<div class="add-module" @click="openInterfaceModel"></div>
		</div>
		<div class="sub-form-list" v-if="formData.interfaceList && formData.interfaceList.length">
			<hr/>
			<template v-for="(itf,index) in formData.interfaceList" v-if="selectIndex === index">
				<div class="delete-module" @click="deleteInterface(index)"></div>
				<div class="form size-l" v-for="item in itf.param">
					<v-input-source :lable="item.name" :formData="item" name="value" :sourceOptions="sourceOptions" @formChange="interfaceChange" @sourceChange="interfaceChange"></v-input-source>
				</div>
			</template>
			<hr/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "weipageBaseForm",
		props: {
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data () {
		    return {
		    	selectIndex: 0,
				sourceOptions: [{
					label: '固定值',
					value: 'static'
				},{
					label: '链接参数',
					value: 'url'
				},{
					label: '缓存',
					value: 'cookie'
				}]
			}
		},
		methods: {
			openInterfaceModel: function() {
				this.$emit('open-interface-model','weipage')
			},
			selectImage: function(res) {
				this.$emit('select-image', res)
			},
			selectInterface: function(index) {
				this.selectIndex = index
			},
			interfaceChange: function(res) {
				const interfaceList = this.formData.interfaceList
				for (let i = 0; i < interfaceList.length; i++) {
					if (this.selectIndex === i) {
						for (let j = 0; j < interfaceList[i].param.length; j++) {
							if (interfaceList[i].param[j].key === res.name) {
								interfaceList[i].param[j].value = res.value
							}
						}
					}
				}
			},
			parseClass: function(index) {
				if (index === this.selectIndex) {
					return 'current'
				} else {
					return ''
				}
			},
			deleteInterface: function(index) {
				const interfaceList = this.formData.interfaceList
				interfaceList.splice(this.selectIndex, 1)
				this.selectIndex = 0
			}
		}
	}
</script>

<style scoped>
	.form{
		width:300px;
	}
	.form.size-l{
		width:500px;
	}
</style>