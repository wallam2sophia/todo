<template>
	<view class="join-task">
		<view class="sign-rules">
			<view class="title">
				打卡规则
			</view>
			<view class="duration">
				* 打卡日期：{{taskInfo.beginTime}} 至 {{taskInfo.endTime}}
			</view>
			<view class="rule">
				* 打卡规则：{{taskInfo.desc}}
			</view>
			<view class="rule">
				* 以上所有解释权归{{taskInfo.creator}}所有。
			</view>
		</view>
		<van-divider />
		<view class="oper-bar">
			<van-button type="default" size="small" custom-class="cancel-btn" @click="onCancel">取消</van-button>
			<van-button type="info" size="small" @click="onSubmit">加入</van-button>
		</view>
	</view>
</template>

<script>
	import taskApi from "../utils/service/task.js"
	export default {
		props:["taskInfo"],
		data() {
			return {
				
			};
		},
		methods: {
			onCancel(){
				this.$emit("close")
			},
			onSubmit(){
				console.log(this.userInfo.nickName)
				let sendData = {
					id: this.taskInfo.id,
					members: [...this.taskInfo.members, this.userInfo.nickName]
				}
				taskApi.editTask(sendData).then(res=>{
					console.log(res)
					this.$emit("submit")
				})
				
			}
		}
	}
</script>

<style lang="scss">
.join-task {
	padding: 20rpx 30rpx;
	color: #333;
	.sign-rules {
		.title {
			font-size: 32rpx;
			text-align: center;
			line-height: 2;
		}
		.duration {
			line-height: 2;
			font-size: 26rpx;
			color: #333;
		}
		.rule {
			line-height: 2;
			font-size: 26rpx;
			color: #333;
		}
	}
	.oper-bar {
		text-align: center;
		.cancel-btn {
			margin-right: 10px;
		}
	}
}
</style>
