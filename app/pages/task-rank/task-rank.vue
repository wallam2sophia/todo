<template>
	<view class="task-rank">
		<view class="tab-bars flex-row">
			<view class="tab-item" :class="{'active-tab': item.value === activeTab}" v-for="(item, index) in tabOptions" :key="index">
				{{item.label}}
			</view>
		</view>
		<view class="rank-lists" v-if="rankList.length > 0">
			<view class="rank-item flex-row" v-for="(item, index) in rankList" :key="index">
				<view class="rank-number">
					<image :src="SERVER_URL+'imgs/gold1.png'" mode="aspectFit" v-if="index == 0"></image>
					<image :src="SERVER_URL+'imgs/sliver.png'" mode="aspectFit" v-else-if="index == 1"></image>
					<image :src="SERVER_URL+'imgs/gold.png'" mode="aspectFit" v-else-if="index == 2"></image>
					<text v-else>{{parseInt(index) + 1}}</text>
				</view>
				<view class="avatar">
					<image :src="item.avatarUrl" mode="aspectFit"></image>
				</view>
				<view class="nick-name">
					{{item.signer}}
				</view>
				<view class="sign-number">
					累计{{item.sign_count}}次
				</view>
			</view>
		</view>
		<view class="empty-box" v-else>
			<van-empty description="暂无数据!" />
		</view>
	</view>
</template>

<script>
	import { rankTabOptions } from "../../utils/const.js"
	import signApi from "../../utils/service/sign.js"
	
	export default {
		data() {
			return {
				taskid: '',
				activeTab: 'today',
				tabOptions: rankTabOptions,
				rankList: []
			}
		},
		methods: {
			fetchRankData(){
				let sendData = {
					taskId: this.taskId
				}
				signApi.statisticTask(sendData).then(res => {
					this.rankList = res.data;
				})
			},
		},
		onLoad(options){
			this.taskId = options.taskId;
			this.fetchRankData();
		}
	}
</script>

<style lang="scss">
.task-rank {
	font-size: 26rpx;
	.tab-bars {
		margin: 40rpx auto;
		justify-content: space-around;
		
		.tab-item {
			padding: 5px 15px;
			border: 1px solid $main-grey-border;
			border-radius: 15px;
			font-size: 24rpx;
			color: $main-grey-text;
		}
		.active-tab {
			border-color: $main-icon-color;
			background-color: $main-icon-color;
			color: #fff;
		}
	}
	.rank-lists {
		
		.rank-item {
			padding: 20rpx 20rpx;
			border-bottom: 0.5px solid $main-grey-border;
			box-sizing: border-box;
			
			.rank-number {
				width: 20px;
				height: 20px;
				margin-right: 15rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			.avatar {
				width: 30px;
				height: 30px;
				margin-right: 20rpx;
				
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.nick-name {
				margin-right: 20rpx;
			}
			.sign-number {
				margin-left: auto;
			}
		}
	}
}
</style>
