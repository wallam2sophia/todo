<template>
	<view class="log-lists">
		<view v-if="signLogs.length > 0">
			<view class="log-item" v-for="item in signLogs" :key="item.id"  >
				<view class="log-row">
					<view class="avatar">
						<image :src="item.avatarUrl" mode="aspectFit"></image>
					</view>
					<view class="member-info">
						<view class="name">
							<text>{{item.signer}}</text>
						</view>
						<view class="asign-time">
							{{item.signTime}}
						</view>
					</view>
				</view>
				<view class="log-row desc">
					<text>{{item.signText}}</text>
				</view>
				<view class="log-row action">
					<view class="comment action-item">
						<van-icon name="comment-o" custom-class="icon" />
						<text>评论</text>
					</view>
					<view class="share action-item">
						<van-icon name="share-o" custom-class="icon" />
						<text>分享</text>
					</view>
					<view class="detail action-item">
						<van-icon name="description" custom-class="icon"/>
						<text>详情</text>
					</view>
					<view class="like action-item">
						<van-icon name="good-job-o" custom-class="icon" />
					</view>
				</view>
			</view>
		</view>
		<view class="empty-box" v-else>
			<van-empty description="目前还没有人签到过哦,赶紧做第一个抢沙发的人吧!" />
		</view>
	</view>
</template>

<script>
	import signApi from "../utils/service/sign.js"
	
	export default {
		props: ["taskId", "member"],
		data() {
			return {
				signLogs: [],
			};
		},
		mounted(){
			if(this.taskId){
				this.fetchSignLogs();
			}
		},
		methods: {
			fetchSignLogs(){
				let sendData = {
					taskId: this.taskId
				}
				if(this.member){
					sendData.member = this.member;
				}
				signApi.listSign(sendData).then(res => {
					this.signLogs = res.data;
				})
			},
		}
	}
</script>

<style lang="scss">
.log-lists {
	font-size: 26rpx;
	.log-item {
		padding: 15px 10px 0 10px;
		.log-row {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
		}
		.avatar {
			width: 40px;
			height: 40px;
			margin-right: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.member-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.name {
				margin-bottom: 5px;
			}
			.asign-time {
				font-size: 22rpx;
				color: #C0C0C0;
			}
		}
		.desc {
			padding-left: 40px;
		}
		.action {
			padding-left: 40px;
			color: #C0C0C0;
			
			.action-item {
				display: flex;
				align-items: center;
				margin-right: 5px;
				
				:first-child {
					margin-right: 2px;
				}
				
				.icon {
					font-size: 16px;
					
				}
			}
			
			.like {
				font-size: 18px;
				margin-left: auto;
			}
		}
	}
	.empty-box {
		
	}
	
}
</style>
