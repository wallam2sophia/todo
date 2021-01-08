<template>
	<view class="home">
		<!-- <uni-nav-bar left-icon="back" left-text="返回" title="打卡了吧" status-bar fixed color="#fff"></uni-nav-bar> -->
		<view class="user-info my-card">
			<image class="avatar" :src="userInfo.avatarUrl"></image>
			<text class="nickname">{{userInfo.nickName}}</text>
			<view class="task-info flex-row">
				<view class="total-tasks flex-column">
					<view class="number">
						{{myGeneral.tasks || 0}}
					</view>
					<view class="text">
						总任务数
					</view>
				</view>
				<view class="total-signs flex-column">
					<view class="number">
						{{myGeneral.signs || 0}}
					</view>
					<view class="text">
						总打卡数
					</view>
				</view>
				
			</view>
			
		</view>
		<!-- <view class="my-news flex-row">
			<view class="my-btn login-box success-btn" @click="login">
				登录
			</view>
			<view class="my-btn login-box success-btn" @click="hasWarning">
				提醒
			</view>
			<view class="my-btn login-box success-btn" @click="sendMsg">
				发送
			</view>
		</view> -->
		<!-- <view class="my-news">
			<van-notice-bar left-icon="chat-o" text="笨笨刚刚签到了一起跳绳吧lalalallalalalalalalalalalalaallala" scrollable custom-class="news-item" />
		</view> -->
		<view class="my-tasks">
			<!-- <van-loading type="spinner" color="#1989fa" v-show="loading"/> -->
			<van-tabs :active="status" :border="false" @change="changeStatus" line-height="2" animated swipeable lazy-render sticky color="#ff5722">
				<van-tab :title="item.title" :name="item.name" v-for="(item, index) in taskStatus" :key="index">
					<van-search :value="searchTask" placeholder="请输入你要搜索的任务" @change="e=>searchTask=e.detail" @search="refreshTaskList"/>
					<taskList :list="taskLists" :tabStatus="status" @task-click="goDetail" @refresh="refreshTaskList" v-if="!loading && taskLists.length > 0"></taskList>
					<van-empty description="暂无数据" v-else-if="!loading && taskLists.length === 0"/>
					<view class="no-data" v-if="dataFinishShow">
						-------我是有底线的--------
					</view>
				</van-tab>
			</van-tabs>
		</view>
		<movable-area class="move-area">
			<movable-view x="750rpx" y="1000rpx" direction="all" @change="onChange" class="move-view">
				<image mode="aspectFit" :src="SERVER_URL+'imgs/add1.gif'" class="add-task" @click="addTask" :draggable="true" ></image>
			</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue"
	import taskList from "../../components/task-list.vue"
	import taskApi from "../../utils/service/task.js"
	import commonApi from "../../utils/service/common.js"
	import statisticApi from "../../utils/service/statistic.js"
	const template_id = "I8PnqSS0b5pEWVAaV5I-OMRjK0WR5vPbYDjMhx-zihM"
	export default {
		components: {
			taskList,
			uniNavBar
		},
		data() {
			return {
				page: 1,
				size: 5,
				total: 0,
				searchTask: "",
				dataFinishShow: false,
				taskLists: [],
				status: "doing",
				myGeneral: {},
				taskStatus: [
					{
						name: 'doing',
						title: '进行中'
					},
					{
						name: 'todo',
						title: '未开始'
					},
					{
						name: 'done',
						title: '已结束'
					},
					{
						name: 'all',
						title: '全部'
					},
				]
			}
		},
		methods: {
			sendMsg(){
				let sendData = {
					nickName: this.userInfo.nickName,
					template_id: template_id
				}
				commonApi.sendMsg(sendData).then(res=>{
					console.log(res)
				})
			},
			login(){
				let that = this;
				wx.login({
					success(res){
						if (res.code) {
						      //发起网络请求
							  let sendData = {
								  nickName: that.userInfo.nickName,
								  avatarUrl: that.userInfo.avatarUrl,
								  code: res.code
							  }
							  commonApi.login(sendData).then(res=>{
								  console.log(res)
							  })
						} else {
						  console.log('登录失败！' + res.errMsg)
						}
					}
				})
			},
			getPhoneNumber(e){
				console.log(e)
			},
			onChange(){
				// console.log("moving")
			},
			fetchMyGeneral(){
				statisticApi.myGeneral({ user: this.userInfo.nickName }).then(res=>{
					this.myGeneral = res.data;
				})
			},
			fetchTaskList(){
				this.startLoading();
				let sendData = {
					user: this.userInfo.nickName, 
					status: this.status,
					page: this.page,
					size: this.size
				}
				if(this.searchTask){
					sendData.title = this.searchTask
				}
				taskApi.listTask(sendData).then(res => {
					let { count, list } = res.data;
					this.total = count;
					this.taskLists = [...this.taskLists, ...list];
					this.stopLoading();
				}).catch(error=>{
					this.stopLoading();
				})
			},
			refreshTaskList(){
				this.page = 1;
				this.taskLists = []
				this.dataFinishShow = false
				this.fetchTaskList();
			},
			changeStatus(status){
				this.searchTask = ""
				this.status = status.detail.name;
				this.refreshTaskList();
			},
			addTask() {
				uni.navigateTo({
					url: "../add-task/add-task"
				})
			},
			goDetail(id, taskStatus){
				console.log("goDetail...")
				uni.navigateTo({
					url: `../task-detail/task-detail?taskId=${id}&taskStatus=${taskStatus}`
				})
			}
		},
		onShow(){
			this.fetchMyGeneral();
			this.refreshTaskList();
		},
		onReachBottom(){
			if(this.taskLists.length > 0 && this.taskLists.length === this.total){
				this.dataFinishShow = true;
			}
			if(!this.dataFinishShow){
				this.page ++;
				this.fetchTaskList();
			}
		}
	}
</script>

<style lang="scss">
	.home {
		overflow: hidden;
		.van-divider {
			margin: 20rpx 0;
		}

		.my-card {
			background-color: #fff;
			overflow: hidden;
			border-radius: 5px;
			border: 1px solid #eee;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
			padding: 20rpx 30rpx;
		}

		.user-info {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				border-radius: 50%;
			}

			.nickname {
				color: #333;
			}
		}
		
		.task-info {
			margin-left: 40px;
			
			.total-tasks {
				margin-right: 20px;
				.number {
					margin-bottom: 5px;
					font-size: 34rpx;
					color: #df4d38;
					font-weight: 600;
					// font-style: italic;
				}
				.text {
					font-size: 22rpx;
				}
			}
			.total-signs {
				margin-right: 20px;
				.number {
					margin-bottom: 5px;
					font-size: 34rpx;
					color: #038ead;
					font-weight: 600;
					// font-style: italic;
				}
				.text {
					font-size: 22rpx;
				}
			}
		}
		.my-news {
			margin-top: 20rpx;

			.news-item {
				height: 32px;
			}
		}

		.my-tasks {
			margin-top: 20rpx;
		}

		.add-task {
			width: 150rpx;
			height: 150rpx;
			// position: fixed;
			// bottom: 20rpx;
			// right: 20rpx;
		}
		
		.uni-navbar {
			background: url(https://guoxiuqiong.top/imgs/home_bg4.png);
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center 0;
			color: #fff !important;
		}
		.uni-navbar__content,.uni-navbar__placeholder,.uni-navbar__header {
			background-color: rgba(0,0,0,0) !important;
			color: #fff !important;
		}
	}
	.move-area {
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;//设置area元素不可点击，则事件便会下移至页面下层元素
	}
	.move-view {
		pointer-events: auto;//可以点击
		width: 150rpx;
		height: 150rpx;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 999;
	}
	.login-box {
		padding: 15rpx 30rpx;
		margin-left: 20px;
	}
</style>
