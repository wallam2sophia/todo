<template>
	<view class="home">
		<view class="user-info my-card">
			<image class="avatar" :src="userInfo.avatarUrl"></image>
			<text class="nickname">{{userInfo.nickName}}</text>
		</view>
		<view class="my-news">
			<!-- <van-divider contentPosition="center" customStyle="color: #e54d42;font-size: 14px;">我的消息</van-divider> -->
			<van-notice-bar left-icon="music-o" text="笨笨刚刚签到了一起跳绳吧lalalallalalalalalalalalalalaallala" scrollable custom-class="news-item" />
		</view>
		<view class="my-tasks">
			<van-tabs :active="status" :border="false" @change="changeStatus" line-height="2" animated swipeable lazy-render sticky>
				<van-tab :title="item.title" :name="item.name" v-for="(item, index) in taskStatus" :key="index">
					<taskList :list="taskLists" @task-click="goDetail" @refresh="fetchTaskList" v-if="taskLists.length > 0"></taskList>
					<van-empty description="暂无数据" v-else/>
				</van-tab>
			</van-tabs>
		</view>
		<image mode="aspectFit" :src="SERVER_URL+'imgs/add.png'" class="add-task" @click="addTask"></image>
	</view>
</template>

<script>
	import taskList from "../../components/task-list.vue"
	import taskApi from "../../utils/service/task.js"
	
	export default {
		components: {
			taskList
		},
		data() {
			return {
				taskLists: [],
				status: "",
				taskStatus: [
					{
						name: 'all',
						title: '全部'
					},
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
				]
			}
		},
		onShow(){
			this.status = "doing"
			this.fetchTaskList();
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '打卡吧',
		      path: '/pages/test/test?id=123',
			  imageUrl: '../../static/logo.png'
		    }
		},
		methods: {
			fetchTaskList(){
				taskApi.listTask({user: this.userInfo.nickName, status: this.status}).then(res => {
					this.taskLists = res.data;
				})
			},
			changeStatus(status){
				this.status = status.detail.name;
				this.fetchTaskList();
			},
			addTask() {
				uni.navigateTo({
					url: "../add-task/add-task"
				})
			},
			goDetail(id){
				console.log("goDetail...")
				uni.navigateTo({
					url: "../task-detail/task-detail?taskId=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
	.home {
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
			width: 80rpx;
			height: 80rpx;
			position: fixed;
			bottom: 20rpx;
			right: 20rpx;
			z-index: 999;
		}
	}
</style>
