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
		<!-- <view class="my-news">
			<van-notice-bar left-icon="chat-o" text="笨笨刚刚签到了一起跳绳吧lalalallalalalalalalalalalalaallala" scrollable custom-class="news-item" />
		</view> -->
		<view class="my-tasks">
			<!-- <van-loading type="spinner" color="#1989fa" v-show="loading"/> -->
			<van-tabs :active="status" :border="false" @change="changeStatus" line-height="2" animated swipeable lazy-render sticky color="#ff5722">
				<van-tab :title="item.title" :name="item.name" v-for="(item, index) in taskStatus" :key="index">
					<van-search :value="searchTask" placeholder="请输入你要搜索的任务" @change="e=>searchTask=e.detail" @search="fetchTaskList"/>
					<taskList :list="taskLists" @task-click="goDetail" @refresh="refreshTaskList" v-if="!loading && taskLists.length > 0"></taskList>
					<van-empty description="暂无数据" v-else-if="!loading && taskLists.length === 0"/>
					<view class="no-data" v-if="dataFinishShow">
						-------我是有底线的--------
					</view>
				</van-tab>
			</van-tabs>
		</view>
		<image mode="aspectFit" :src="SERVER_URL+'imgs/add1.gif'" class="add-task" @click="addTask"></image>
	</view>
</template>

<script>
	import uniNavBar from "../../components/uni-nav-bar/uni-nav-bar.vue"
	import taskList from "../../components/task-list.vue"
	import taskApi from "../../utils/service/task.js"
	import statisticApi from "../../utils/service/statistic.js"
	
	export default {
		components: {
			taskList,
			uniNavBar
		},
		data() {
			return {
				page: 1,
				size: 5,
				searchTask: "",
				loading: false,
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
			fetchMyGeneral(){
				statisticApi.myGeneral({ user: this.userInfo.nickName }).then(res=>{
					this.myGeneral = res.data;
				})
			},
			fetchTaskList(){
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
					if(this.page >1 && this.page * this.size >= count){
						this.dataFinishShow = true;
					}
					this.taskLists = [...this.taskLists, ...list];
				})
			},
			refreshTaskList(){
				this.page = 1;
				this.taskLists = []
				this.dataFinishShow = false
				this.fetchTaskList();
			},
			changeStatus(status){
				this.page = 1;
				this.dataFinishShow = false
				this.taskLists = []
				this.searchTask = ""
				this.status = status.detail.name;
				this.fetchTaskList();
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
				margin-right: 40px;
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
			position: fixed;
			bottom: 20rpx;
			right: 20rpx;
			z-index: 999;
		}
		
		.uni-navbar {
			background: url(http://127.0.0.1:8090/imgs/home_bg4.png);
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
</style>
