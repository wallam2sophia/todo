<template>
	<view class="task-lists">
		<view class="task-card card-item" v-for="item in list" :key="item.id" @click="goDetail(item.id)">
			<!-- <view class="task-status" :class="item.status ? 'finish-status' : 'unfinish-status'">
				{{item.status ? '已打卡' : '未打卡'}}
			</view> -->
			<view class="task-img">
				<image :src="item.bgImg" mode="aspectFit"></image>
				<view class="member-mask">
					{{item.members.length || 0}}人参与
				</view>
			</view>
			<view class="task-info">
				<view class="task-row title">
					<text>{{item.title}}</text>
				</view>
				<view class="task-row van-ellipsis desc">
					<text>{{item.desc}}</text>
				</view>
				<view class="task-row">
					<van-icon name="manager-o" custom-class="icon" />
					<text>{{item.creator}}</text>
				</view>
				<view class="task-row">
					<van-icon name="clock-o" custom-class="icon" />
					<text>{{item.beginTime}} 至 {{item.endTime}}</text>
				</view>
				<view v-if="item.status==='doing'">
					<view class="my-btn primary-btn" v-if="!item.isSigned" @click.stop="signIn(item.id)">
						打卡
					</view>
					<view class="my-btn disabled-btn" v-else @click.stop="">
						已打卡
					</view>
				</view>
				
			</view>
		</view>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="van-notify" />
	</view>
</template>

<script>
	import signApi from "../utils/service/sign.js"
	
	export default {
		props: {
			list:{
				required:true,
				type:Array
			}
		},
		data() {
			return {
				userInfo: {},
			};
		},
		mounted() {
			this.userInfo = uni.getStorageSync('userInfo');
		},
		methods: {
			goDetail(id){
				this.$emit('task-click', id)
			},
			signIn(taskId){
				let sendData = {
					taskId: taskId,
					signer: this.userInfo.nickName,
					avatarUrl: this.userInfo.avatarUrl,
					signTime: new Date().getTime()
				}
				signApi.addSign(sendData).then(res => {
					// 成功通知
					this.Notify({ type: 'success', message: res.msg });
					this.$emit("refresh")
				})
			},
		}
	}
</script>

<style lang="scss">
	.task-lists {
		
		.my-btn {
			font-size: 26rpx;
			color: #fff;
			border-radius: 50rpx;
			padding: 0rpx 28rpx;
			line-height: 2;
			position: absolute;
			right: -10rpx;
			bottom: 60rpx;
			cursor: pointer;
		}
		
		.primary-btn {
			background: linear-gradient(to right, #114fad, #0073d1);
		}
		
		.disabled-btn {
			color: #fff !important;
			background: linear-gradient(to right, #ededed, #bdbdbd);
			cursor: not-allowed;
		}
		.task-card {
			position: relative;
			padding: 10px 15px;
			font-size: 12px;
			color: #333;
			box-sizing: border-box;
			background-color: #fafafa;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			border-bottom: 0.5px solid #fff;

			.task-status {
				position: absolute;
				top: 0;
				left: 0;
				transform: rotate(-45deg);
				font-size: 10px;
			}

			.finish-status {}

			.unfinish-status {}

			.task-img {
				position: relative;
				width: 90px;
				height: 90px;
				margin-right: 10px;
				flex: none;

				image {
					width: 100%;
					height: 100%;
					max-width: 100%;
					display: inline-block;
					position: relative;
					z-index: 0;
				}

				.member-mask {
					position: absolute;
					bottom: 20rpx;
					width: 90px;
					background-color: rgba(0, 0, 0, 0.6);
					color: #fff;
					height: 32px;
					line-height: 32px;
					text-align: center;
					font-size: 22rpx;
				}
			}

			.task-info {
				position: relative;
				flex: 1;
				min-width: 0;

				.task-row {
					&+.task-row {
						margin-top: 10px;
					}
				}

				.title {
					font-weight: 700;
					font-size: 14px;
				}

				.desc {
					color: #7d7e80;
				}

				.icon {
					color: $main-bg-color;
					font-size: 16px;
					margin-right: 5px;
				}

				text {
					line-height: 16px;
					height: 16px;
					display: inline-block;
					vertical-align: top;
				}
			}
		}
	}
</style>
