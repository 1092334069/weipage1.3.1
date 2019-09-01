<template>
	<div class="plugin-form">
		<div class="form-list">
			<div class="form-lable">事件列表：</div>
			<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.scrollEvent.eventList" @click="selectEvent(index)">{{index+1}}</div>
			<div class="add-module" @click="addEvent"></div>
		</div>
		<div class="sub-form-list" v-if="formData.scrollEvent.eventList && formData.scrollEvent.eventList.length">
			<hr/>
			<template v-for="(item,index) in formData.scrollEvent.eventList" v-if="formData.scrollEvent.selectIndex === index">
				<div class="delete-module" @click="deleteEvent"></div>
				<div class="form">
					<v-radio lable="方向" :options="directionOptions" :formData="item" name="direction"></v-radio>
				</div>
				<div class="form">
					<v-radio lable="类型" :options="eventTypeOptions" :formData="item" name="type"></v-radio>
				</div>
				<template v-if="item.type === 'normal'">
					<div class="form-list">
						<span class="form-lable">元件：</span>
						<div class="form-item" @click="openPluginTreeModel(item)">{{item.value.name}}</div>
					</div>
					<template v-if="item.value.options && item.value.options.length">
						<div class="form">
							<v-select lable="响应" :options="item.value.options" :formData="item.value" name="actionIndex" @formChange="normalEventChange"></v-select>
						</div>
					</template>
				</template>
				<template v-else>
					<div class="form-list">
						<span class="form-lable">接口：</span>
						<div class="form-item" @click="openInterfaceModel">{{item.value.name}}</div>
					</div>
					<template v-if="item.value.param && item.value.param.length">
						<div class="form size-l" v-for="inf in item.value.param">
							<v-input-source v-if="inf.value.source === 'count'" :lable="inf.name" :value="inf.value" :name="inf.key" :sourceOptions="sourceOptions" type="select" :inputOptions="countOptions" @formChange="interfaceChange" @sourceChange="interfaceChange"></v-input-source>
							<v-input-source v-else :lable="inf.name" :value="inf.value" :name="inf.key" :sourceOptions="sourceOptions" @formChange="interfaceChange" @sourceChange="interfaceChange"></v-input-source>
						</div>
					</template>
					<div class="form-list">
						<span class="form-lable">累加参数：</span>
						<div class="form-item" @click="openInteraceTreeModel(item)">{{item.keyword.name}}</div>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		name: "weipageScrollForm",
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
				eventTypeOptions: [{
					label: '接口事件',
					value: 'interface'
				},{
					label: '本地事件',
					value: 'normal'
				}],
				directionOptions: [{
					label: '向下',
					value: 'bottom'
				},{
					label: '向上',
					value: 'top'
				}],
				sourceOptions: [{
					label: '固定值',
					value: 'static'
				},{
					label: '链接参数',
					value: 'url'
				},{
					label: '缓存',
					value: 'sessionStorage'
				},{
					label: '表单',
					value: 'form'
				},{
					label: '计数器',
					value: 'count'
				}]
			}
		},
		methods: {
			parseClass: function(index) {
				if (index === this.selectIndex) {
					return 'current'
				} else {
					return ''
				}
			},
			selectEvent: function(index) {
				this.selectIndex = index
			},
			addEvent: function() {
				const eventList = this.formData.scrollEvent.eventList
				eventList.push({
					type: 'interface',
					direction: 'bottom',
					key: '',
					value: {
						name: '点击选择接口'
					},
					keyword: {
						name: '点击选择接口参数',
						url: '',
						keyList: []
					}
				})
				this.selectIndex = eventList.length - 1
			},
			deleteEvent: function(index) {
				const eventList = this.formData.scrollEvent.eventList
				eventList.splice(index, 1)
			},
			eventTypeChange: function(res) {
				if (res.value === 'interface') {
					this.formData.scrollEvent.eventList[this.selectIndex]['value'] = {
						name: '点击选择接口'
					}
				} else if (res.value === 'normal') {
					this.formData.scrollEvent.eventList[this.selectIndex]['value'] = {
						name: '点击选择元件',
						id: '',
						options: [],
						actionName: '',
						actionId: ''
					}
				} else {
					this.formData.scrollEvent.eventList[this.selectIndex]['value'] = ''
				}
			},
			normalEventChange: function(val) {
				const v = this.formData.scrollEvent.eventList[this.selectIndex]['value']
				let actionName = ''
				for (var i = 0; i < v.options.length; i++) {
					if (v.options.value === res.value) {
						actionName = v.options.label
					}
				}
				v['actionIndex'] = val
				v['actionName'] = actionName
			},
			interfaceChange: function(val) {
				const interfaceInfo = this.formData.scrollEvent.eventList[this.selectIndex]['value']
				for (let i = 0; i < interfaceInfo.param.length; i++) {
					if (interfaceInfo.param[i].key === res.name) {
						interfaceInfo.param[i].value = res.value
					}
				}
			},
			openPluginTreeModel: function(formData) {
				this.$emit('open-interface-tree-model', {
					formData: formData,
					name: 'value'
				})
			},
			openInterfaceModel: function() {
				this.$emit('open-interface-model', 'weipageScroll')
			},
			openInteraceTreeModel: function(formData) {
				this.$emit('open-interface-tree-model', {
					formData: formData,
					name: 'keyword'
				})
			}
		},
		computed: {
			countOptions() {
				const options = []
				for (let i = 0; i < this.formData.countEvent.eventList.length; i++) {
					options.push({
						label: this.formData.countEvent.eventList[i].name,
						value: this.formData.countEvent.eventList[i].countId
					})
				}
				return options
			}
		}
	}
</script>
