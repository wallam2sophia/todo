<template>
	<view class="my-news">
		<view class="msg-list" v-if="!loading && msgLists.length > 0">
			<view class="msg-item" v-for="item in msgLists" :key="item.id">
				<view class="log-row base">
					<view class="avatar">
						<image :src="item.avatarUrl" mode="aspectFit"></image>
					</view>
					<view class="member-info">
						<view class="name">
							<text>{{item.sender}}</text>
						</view>
						<view class="asign-time">
							{{dayjs(item.createTime).format("YYYY-MM-DD hh:mm:ss")}}
						</view>
					</view>
				</view>
				<view class="log-row desc">
					<text>{{item.message}}</text>
				</view>
			</view>
		</view>
		<van-empty description="暂无数据" v-else-if="!loading && msgLists.length === 0"/>
		<view class="no-data" v-if="dataFinishShow">
			-------我是有底线的--------
		</view>
	</view>
</template>

<script>
	import messageApi from "../../utils/service/message.js"
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				total: 0,
				msgLists: [],
				dataFinishShow: false,
			}
		},
		methods: {
			fetchMsgList(){
				this.startLoading();
				let sendData = {
					nickName: this.userInfo.nickName, 
					page: this.page,
					size: this.size
				}
				messageApi.listMessage(sendData).then(res => {
					let { count, list } = res.data;
					this.total = count;
					this.msgLists = [...this.msgLists, ...list];
					this.stopLoading();
				}).catch(error=>{
					this.stopLoading();
				})
			},
			refreshMsgList(){
				this.page = 1;
				this.msgLists = []
				this.dataFinishShow = false
				this.fetchMsgList();
			},
			dayjs(data){
				return dayjs(data)
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.refreshMsgList();
		},
		onReachBottom(){
			if(this.msgLists.length > 0 && this.msgLists.length === this.total){
				this.dataFinishShow = true;
			}
			if(!this.dataFinishShow){
				this.page ++;
				this.fetchMsgList();
			}
		},
		onTabItemTap(e){
			if(e.index === 1){
				uni.hideTabBarRedDot({
					index: 1
				})
			}
		},
	}
</script>

<style lang="scss">
.my-news {
	font-size: 26rpx;
	background-color: #eee;
	height: 100vh;
	padding: 10px 0;
	.msg-list {
		.msg-item {
			padding: 10px;
			background-color: #fff;
			margin-bottom: 10px;
		}
		
		.log-row {
			display: flex;
			align-items: center;
			margin-bottom: 5px;
			// padding-left: 20px;
		}
		.base {
			padding-left: 0;
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
			// padding-left: 20px;
		}
	}
}
</style>
