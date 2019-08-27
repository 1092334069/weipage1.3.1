<template>
	<div class="plugin-form">
		<div class="form-list">
			<div class="form-lable">计数器列表：</div>
			<div class="form-item" :class="parseClass(index)" v-for="(item,index) in formData.countEvent.eventList" @click="selectEvent(index)">{{item.name}}</div>
			<div class="add-module" @click="addEvent"></div>
		</div>
		<div class="sub-form-list" v-if="formData.countEvent.eventList && formData.countEvent.eventList.length">
			<hr/>
			<template v-for="(item,index) in formData.countEvent.eventList" v-if="formData.countEvent.selectIndex === index">
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
			weipageChange: function(res) {
				const countEvent = this.formData.countEvent
				countEvent[res.name] = res.value
				this.$emit('weipage-change', {
					name: 'countEvent',
					value: countEvent
				})
			},
			parseClass: function(index) {
				if (index === this.formData.countEvent.selectIndex) {
					return 'current'
				} else {
					return ''
				}
			},
			selectEvent: function(index) {
				this.weipageChange({
					name: 'selectIndex',
					value: index
				})
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
				this.weipageChange({
					name: 'eventList',
					value: eventList
				})
				this.weipageChange({
					name: 'selectIndex',
					value: eventList.length - 1
				})
			},
			deleteEvent: function() {
				const eventList = this.formData.countEvent.eventList
				eventList.splice(this.formData.countEvent.selectIndex, 1)
				this.weipageChange({
					name: 'selectIndex',
					value: 0
				})
				this.weipageChange({
					name: 'eventList',
					value: eventList
				})
			}
		}
	}
</script>


<style scoped>

</style>
