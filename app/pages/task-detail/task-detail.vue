<template>
	<view class="task-detail">
		<view class="task-base" :style="{'background-image': 'url('+taskInfo.bgImg+')'}">
			<view class="title">
				<text>{{taskInfo.title}}</text>
			</view>
			<view class="info">
				<view>第{{taskInfo.finishDays}}/{{taskInfo.totalDays}}天</view>
				<view>共{{taskInfo.members.length}}人参与</view>
			</view>
			<view class="progress">
				<view class="bg-line"></view>
				<view class="front-line" :style="{'width':taskInfo.finishDays / taskInfo.totalDays * 100+'%' }"></view>
			</view>
			
		</view>
		<view class="ds-beetw block-box">
			<view class="creator">
				<van-icon name="user-o" custom-class="icon" />
				<view class="name">{{taskInfo.creator}}</view>
				<view class="tag">发起人</view>
			</view>
			<view class="member-manage">
				<view>成员管理</view>
				<van-icon name="arrow" custom-class="icon"/>
			</view>
		</view>
		<view class="block-box">
			<view class="desc">
				<van-icon name="notes-o" custom-class="icon"/>
				<text>打卡规则</text>
			</view>
			<view class="duration">
				* 签到日期：{{taskInfo.beginTime}} 至 {{taskInfo.endTime}}
			</view>
			<view class="rule">
				* 签到规则：{{taskInfo.desc}}
			</view>
		</view>
		<view class="block-box task-log">
			<text class="title">签到动态</text>
			<text class="tag">全部</text>
			<text class="tag">今天</text>
			<text class="tag">选择日期</text>
		</view>
		<view class="asign-logs">
			<signLog :userInfo="userInfo" :signLogs="signLogs" v-if="signLogs.length > 0"></signLog>
			<van-empty description="暂无数据" v-else/>
		</view>
	</view>
</template>

<script>
	import signLog from "../../components/sign-log.vue"
	import taskApi from "../../utils/service/task.js"
	import signApi from "../../utils/service/sign.js"
	
	export default {
		components:{ signLog },
		data() {
			return {
				userInfo: {},
				taskId: "",
				taskInfo: {},
				signLogs:[]
			}
		},
		methods: {
			fetchTaskInfo(){
				taskApi.detailTask(this.taskId).then(res => {
					this.taskInfo = res.data;
				})
			},
			fetchSignLogs(){
				let sendData = {
					taskId: this.taskId
				}
				signApi.listSign(sendData).then(res => {
					this.signLogs = res.data;
				})
			},
		},
		onLoad(options){
			this.taskId = options.taskId;
			this.userInfo = uni.getStorageSync('userInfo');
			this.fetchTaskInfo();
			this.fetchSignLogs();
			
		}
	}
</script>

<style lang="scss">
.task-detail {
	font-size: 26rpx;
	.task-base {
		position: relative;
		color: #fff;
		width: 100%;
		height: 120px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		padding: 10px;
	    box-sizing: border-box;
		
		image {
			width: 100%;
		}
		.title {
			font-size: 16px;
			position: absolute;
			bottom: 50px;
		}
		.info {
			position: absolute;
			bottom: 25px;
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			width: calc(100% - 20px);
		}
		.progress {
			width: calc(100% - 20px);
			position: absolute;
			bottom: 10px;
			.bg-line {
				width: 100%;
				height: 5px;
				background-color: #fff;
			}
			.front-line {
				height: 5px;
				background-color: #0081FF;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
    .creator {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 5px;
			font-size: 16px;
		}
		.name {
			margin-right: 5px;
		}
		.tag {
			font-size: 8px;
			padding: 3px 5px;
			background-color: $main-bg-color;
			color: #fff;
			border: 1px solid $main-bg-color;
			border-radius: 4px;
		}
	}
	.member-manage {
		color: #0081FF;
		cursor: pointer;
		display: flex;
		align-items: center;
		.icon {
			margin-left: 5px;
			font-size: 16px;
		}
	}
	.desc {
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		.icon {
			margin-right: 5px;
			font-size: 16px;
		}
	}
	.duration {
		line-height: 1.6;
		font-size: 24rpx;
		color: #C0C0C0;
	}
	.rule {
		line-height: 1.6;
		font-size: 24rpx;
		color: #C0C0C0;
	}
	.task-log {
		display: flex;
		align-items: center;
		.title {
			margin-right: 5px;
		}
		.tag {
			font-size: 22rpx;
			color: #0081FF;
			border: 1px solid #0081FF;
			padding: 1px 5px;
			border-radius: 15px;
			margin-right: 5px;
			cursor: pointer;
		}
	}
	.block-box {
		border-bottom: 1px solid #eee;
		padding: 10px;
	}
}
</style>
