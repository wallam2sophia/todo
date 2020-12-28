<template>
	<view class="log-lists">
		<view v-if="list.length > 0">
			<view class="log-item" v-for="item in list" :key="item.id"  >
				<view class="log-row base">
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
				<view class="log-row desc" v-if="item.text">
					<text>{{item.text}}</text>
				</view>
				<view class="log-row media-box flex-row"  v-if="item.media.length > 0">>
					<view class="media-item" v-for="(item1,index) in item.media" :key="index">
						<image :src="item1" mode="aspectFit"></image>
					</view>
				</view>
				<view class="log-row location" v-if="item.location.name">
					<van-icon name="location" custom-class="icon"/>
					<text class="text">{{item.location.name}}</text>
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
		props: ["list"],
		data() {
			return {
			};
		},
		computed:{
		},
		watch:{
		},
		mounted(){
		},
		methods: {
		}
	}
</script>

<style lang="scss">
.log-lists {
	font-size: 26rpx;
	.log-item {
		padding: 15px 10px;
		.log-row {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			padding-left: 40px;
		}
		.base {
			padding-left: 0;
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
		.location {
			padding: 5px;
			margin-left: 40px;
			background-color: $main-grey-border;
			color: $main-grey-text;
			border-radius: 4px;
			display: inline-flex;
			.icon {
				margin-right: 4px;
				font-size: 16px;
			}
			.text {
				font-size: 10px;
			}
			
		}
		.media-box {
			flex-wrap: wrap;
			.media-item {
				width: 150rpx;
				height: 150rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
				}
				
				.icon-delete {
					font-size: 18px;
					position: absolute;
					color: #f00;
					top: 0;
					right: -5px;
				}
			}
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
