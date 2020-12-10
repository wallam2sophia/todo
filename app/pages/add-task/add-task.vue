<template>
	<view class="add-task">
		<image :src="formData.bgImg" />
		<van-field :value="formData.title" placeholder="请填写打卡标题" @input="(e)=>formData.title=e.detail"/>
		<van-field :value="formData.desc" placeholder="请填写备注" @input="(e)=>formData.desc=e.detail"/>
		<van-cell title="开始日期" :value="formData.beginTime" is-link @click="beginShow=true"/>
		<van-cell title="结束日期" :value="formData.endTime" is-link @click="endShow=true"/>
		<van-cell title="签到周期" :value="formData.asignType" is-link @click="periodShow=true"/>
		<van-action-sheet :show="periodShow" :actions="periods" round close-on-click-overlay @select="setPeriod"/>
		<van-popup :show="beginShow" position="bottom" round >
			<van-datetime-picker type="datetime" :value="currentDate"  @input="onInput"  @cancel="beginShow=false" @confirm="setBeginCurrent"/>
		</van-popup>
		<van-popup :show="endShow" position="bottom" round @cloce="endShow=false">
			<van-datetime-picker type="datetime" :value="currentDate"  @input="onInput"  @cancel="endShow=false" @confirm="setEndCurrent"/>
		</van-popup>
		<!-- <van-popup :show="endShow" position="bottom" round @cloce="endShow=false">
			<van-datetime-picker type="datetime" :value="currentDate"  @input="onInput"  @cancel="endShow=false" @confirm="setEndCurrent"/>
		</van-popup> -->
		<van-button type="primary" block :loading="loading" @click="submitForm" custom-class="submit-btn">创建</van-button>
	</view>
</template>

<script>
	import uniCombox from "../../components/uni-combox/uni-combox"
	import taskApi from "../../utils/service/task.js"
	export default {
		components: {
			"uni-combox": uniCombox
		},
		data() {
			return {
				beginShow: false,
				endShow: false,
				periodShow: false,
				currentDate: "",
				loading: false,
				formData: {
					bgImg: "../../static/imgs/5.jpg",
					title: "",
					desc: "",
					beginTime: "",
					endTime: "",
					asignType: ""
				},
				periods: [
					 {
						value: "daily",
						name: '每天',
					 },
					 {
						value: "weekday",
						name: '法定工作日',
					 },
				],
				formatter(type, value) {
				      console.log(type, value)
				},
			}
		},
		methods: {
			submitForm() {
				taskApi.addTask(this.formData).then(res => {
					console.log(res);
				})
			},
			onInput(e){
				this.currentDate = e.detail;
			},
			setPeriod(e){
				this.formData.asignType = e.detail.name;
				this.periodShow = false;
			},
			setBeginCurrent(val){
				val = new Date(val.detail)
				let year = val.getFullYear()
				let month = (val.getMonth() + 1 + '').padStart(2, '0')
				let day = (val.getDate() + '').padStart(2, '0')
				let hour = (val.getHours() + '').padStart(2, '0')
				let minute = (val.getMinutes() + '').padStart(2, '0')
				this.formData.beginTime = `${year}-${month}-${day} ${hour}:${minute}:00`
				this.beginShow = false
			},
			setEndCurrent(val){
				val = new Date(val.detail)
				let year = val.getFullYear()
				let month = (val.getMonth() + 1 + '').padStart(2, '0')
				let day = (val.getDate() + '').padStart(2, '0')
				let hour = (val.getHours() + '').padStart(2, '0')
				let minute = (val.getMinutes() + '').padStart(2, '0')
				this.formData.endTime = `${year}-${month}-${day} ${hour}:${minute}:00`
				this.endShow = false
			},
			
		},
	}
</script>

<style lang="scss">
	.add-task {
		image {
			width: 100%;
			height: 100px;
		}
		.submit-btn {
			margin-top: 40rpx;
			background-color: $main-bg-color;
			border-color: $main-bg-color;
		}
	}
</style>
