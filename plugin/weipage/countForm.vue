<template>
	<div class="plugin-form">
		<div class="form-list">
			<div class="form-lable">计数器列表：</div>
			<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.countEvent.eventList" @click="selectEvent(index)">{{item.name}}</div>
			<div class="add-module" @click="addEvent"></div>
		</div>
		<div class="sub-form-list" v-if="formData.countEvent.eventList && formData.countEvent.eventList.length">
			<hr/>
			<template v-for="(item,index) in formData.countEvent.eventList" v-if="selectIndex === index">
				<div class="delete-module" @click="deleteOption(index)"></div>
				<div class="form">
					<v-text lable="名称" :formData="item" name="name"></v-text>
				</div>
				<div class="form">
					<v-radio lable="规则" :options="ruleOptions" :formData="item" name="rule"></v-radio>
				</div>
				<div class="form">
					<v-number lable="初始值" :formData="item" name="initial"></v-number>
				</div>
				<div class="form">
					<v-number lable="变化基数" :formData="item" name="cardinal"></v-number>
				</div>
			</template>
			<hr/>
		</div>
	</div>
</template>

<script>
	import { getLocalUuid } from '../pluginAction.js'
	export default {
		name: "weipageCountForm",
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
				ruleOptions: [{
					label: '自增',
					value: 'add'
				},{
					label: '自减',
					value: 'reduce'
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
				const eventList = this.formData.countEvent.eventList
				const uuid = getLocalUuid()
				eventList.push({
					countId: uuid,
					name: '计数器',
					rule: 'add',
					initial: 1,
					cardinal: 1
				})
				this.selectIndex = eventList.length - 1
			},
			deleteEvent: function(index) {
				const eventList = this.formData.countEvent.eventList
				eventList.splice(index, 1)
				this.selectIndex = 0
			}
		}
	}
</script>


<style scoped>

</style>
