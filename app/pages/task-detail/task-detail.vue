<template>
	<view class="task-detail">
		<view class="task-base" :style="{'background-image': 'url('+ SERVER_URL + taskInfo.bgImg+')'}">
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
			<view class="member-manage" @click="addMember">
				<view>查看成员</view>
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
		<view class="block-box tab-bars">
			<van-button custom-class="bar-btn" open-type="share">
				<view class="btn-slot">
					<van-icon name="share-o" custom-class="icon"></van-icon>
					<text class='title'>分享</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn" @click="goRank">
				<view class="btn-slot">
					<van-icon name="chart-trending-o" custom-class="icon"></van-icon>
					<text class='title'>排行榜</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn">
				<view class="btn-slot">
					<van-icon name="setting-o" custom-class="icon"></van-icon>
					<text class='title'>设置</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn" @click="goRecord">
				<view class="btn-slot">
					<van-icon name="records" custom-class="icon"></van-icon>
					<text class='title'>我的记录</text>
				</view>
			</van-button>
		</view>
		<view class="oper-bar" v-if="taskInfo.members">
			<view  class="my-btn primary-btn" v-if="taskInfo.members.includes(userInfo.nickName) && !taskInfo.isSigned" @click="signIn">点击打卡</view>
			<view class="my-btn success-btn disabled-btn" v-else-if="taskInfo.members.includes(userInfo.nickName) && taskInfo.isSigned">今日打卡已完成</view>
			<view class="my-btn warning-btn" @click="joinPopShow=true" v-else>参与打卡</view>
		</view>
		<view class="ds-beetw card-box">
			<view class="user">
				<view class="avatar">
					<image :src="userInfo.avatarUrl" mode="aspectFit"></image>
				</view>
				<view class="name">{{userInfo.nickName}}</view>
				<view class="tag" v-if="taskInfo.creator === userInfo.nickName">发起人</view>
			</view>
			<view class="sign-calander" @click="goRecord">
				<view>打卡日志</view>
				<van-icon name="arrow" custom-class="icon"/>
			</view>
		</view>
		<view class="block-box task-log">
			<text class="title">签到动态</text>
			<text class="tag" @click="changeSignData('all')" :class="{'active-tag': signTab==='all'}">全部</text>
			<text class="tag" @click="changeSignData('today')" :class="{'active-tag': signTab==='today'}">今天</text>
			<text class="tag" @click="dateShow=true" :class="{'active-tag': signTab==='custom'}" v-show="signTab !== 'custom' || (signTab === 'custom' && !signDate)">选择日期</text>
			<text class="tag" @click="dateShow=true" :class="{'active-tag': signTab==='custom'}" v-show="signTab === 'custom' && !!signDate">{{signDate}}</text>
		</view>
		<view class="asign-logs">
			<signLog :list="signLogs"></signLog>
		</view>
		<van-popup :show="joinPopShow" @close="joinPopShow=false" custom-class="join-task-popup">
			<joinTaskPop :taskInfo="taskInfo" @close="joinPopShow=false" @submit="onJoinSubmit"></joinTaskPop>
		</van-popup>
		<van-popup :show="dateShow" position="bottom" round @cloce="dateShow=false">
			<van-datetime-picker type="date" :value="currentDate" :min-date="minDate" :max-date="maxDate" @input="onInput"  @cancel="dateShow=false" @confirm="changeSignData(currentDate)"/>
		</van-popup>
	</view>
</template>

<script>
	import signLog from "../../components/sign-log.vue"
	import taskApi from "../../utils/service/task.js"
	import signApi from "../../utils/service/sign.js"
	import joinTaskPop from "../../components/joinTaskPop.vue"
	import dayjs from 'dayjs'
	
	export default {
		components:{ signLog, joinTaskPop },
		data() {
			return {
				currentDate: "",
				minDate: "",
				maxDate: "",
				taskId: "",
				signDate: "",
				signTab: "all",
				taskInfo: {},
				signLogs:[],
				joinPopShow: false,
				dateShow: false
			}
		},
		methods: {
			fetchTaskInfo(){
				taskApi.detailTask(this.userInfo.nickName, this.taskId).then(res => {
					this.taskInfo = res.data;
					this.minDate = dayjs(this.taskInfo.beginTime).toDate().getTime()
					this.maxDate = dayjs(this.taskInfo.endTime).toDate().getTime()
				})
			},
			fetchSignLogs(){
				let sendData = {
					taskId: this.taskId,
					signDate: this.signDate
				}
				signApi.listSign(sendData).then(res => {
					this.signLogs = res.data;
				})
			},
			changeSignData(day){
				console.log(day)
				if(day === 'today'){
					this.signTab = 'today'
					this.signDate = dayjs(new Date()).format("YYYY-MM-DD");
				}else if(day === 'all'){
					this.signTab = 'all'
					this.signDate = ''
				}else {
					this.signTab = 'custom'
					this.signDate = dayjs(day).format("YYYY-MM-DD");
					this.dateShow = false;
				}
				this.fetchSignLogs();
			},
			onInput(e){
				this.currentDate = e.detail;
			},
			addMember(){
				uni.navigateTo({
					url: "../task-member/task-member?members=" + JSON.stringify(this.taskInfo.members) + "&creator=" + this.taskInfo.creator + "&taskTitle=" + this.taskInfo.title
				})
			},
			goRecord(){
				uni.navigateTo({
					url: `../my-logs/my-logs?taskId=${this.taskInfo.id}&beginTime=${this.taskInfo.beginTime}&endTime=${this.taskInfo.endTime}&isSigned=${this.taskInfo.isSigned}`
				})
			},
			goRank(){
				uni.navigateTo({
					url: `../task-rank/task-rank?taskId=${this.taskInfo.id}`
				})
			},
			signIn(){
				uni.navigateTo({
					url: `../add-sign/add-sign?taskId=${this.taskInfo.id}`
				})
			},
			onJoinSubmit(){
				this.fetchTaskInfo();
				this.joinPopShow = false;
			}
		},
		onLoad(options){
			this.taskId = options.taskId;
		},
		onShow(){
			this.fetchTaskInfo();
			this.fetchSignLogs();
		},
		onShareAppMessage(options){
			console.log(options)
			
		},
	}
</script>

<style lang="scss">
.task-detail {
	font-size: 26rpx;
	background-color: #eee;
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
				background-color: $main-icon-color;
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
			background-color: $minor-icon-color;
			color: #fff;
			border: 1px solid $minor-icon-color;
			border-radius: 4px;
		}
	}
	.member-manage {
		color: $main-icon-color;
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
		color: $uni-text-color-grey;
	}
	.rule {
		line-height: 1.6;
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
	.tab-bars {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.bar-btn {
			 border: none;
			 cursor: pointer;
			 
			.btn-slot {
				display: flex;
				flex-direction: column;
				justify-content: center;
				.icon {
					font-size: 20px;
					color: $main-icon-color;
				}
				.title {
					margin-top: 2px;
					color: $uni-text-color-grey;
				}
			}
			
		}
	}
	.oper-bar {
		width: 80%;
		margin: 10px auto;
	}
	.user {
		display: flex;
		align-items: center;
		.avatar {
			width: 20px;
			height: 20px;
			margin-right: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		
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
			background-color: $minor-icon-color;
			color: #fff;
			border: 1px solid $minor-icon-color;
			border-radius: 4px;
		}
	}
	.sign-calander {
		color: $main-icon-color;
		cursor: pointer;
		display: flex;
		align-items: center;
		.icon {
			margin-left: 5px;
			font-size: 16px;
		}
	}
	.task-log {
		display: flex;
		align-items: center;
		.title {
			margin-right: 5px;
		}
		.tag {
			font-size: 22rpx;
			color: $main-grey-text;
			border: 1px solid $main-grey-border;
			padding: 1px 5px;
			border-radius: 15px;
			margin-right: 5px;
			cursor: pointer;
		}
		.active-tag {
			color: $main-icon-color;
			border-color: $main-icon-color;
		}
	}
	.block-box {
		border-bottom: 1px solid #eee;
		padding: 10px;
		background-color: #fff;
	}
	.card-box {
		padding: 10px;
		margin: 10px auto;
		background-color: #fff;
	}
	.join-task-popup {
		width: 80%;
	}
	.asign-logs {
		background-color: #fff;
	}
	.van-empty {
		background-color: #fff !important;
	}
	.van-empty__image {
		width: 100px;
		height: 100px;
	}
	.van-empty__description {
		padding: 0;
		font-size: 12px;
	}
}
</style>
