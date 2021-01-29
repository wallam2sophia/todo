<template>
	<view class="my-news">
		<view class="msg-list" v-if="!loading && msgLists.length > 0">
			<view class="msg-item" v-for="item in msgLists" :key="item.id">
				<view class="msg-content" :class=" item.type+ '-border'">
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
						<view class="oper-btns flex-column" v-if="item.type === 'apply' && item.status == 0">
							<view class="my-btn primary-btn small-btn" @click="approveSign(item, 1)">
								同意
							</view>
							<view class="my-btn info-btn small-btn" @click="approveSign(item, -1)">
								拒绝
							</view>
						</view>
						<view class="oper-btns flex-column" v-if="item.type === 'comment' && item.status == 0">
							<view class="my-btn primary-btn small-btn" @click="replyComment(item)">
								回复
							</view>
						</view>
					</view>
					<view class="log-row desc">
						<van-icon name="like" custom-class="like-icon" v-if="item.type === 'like'"/>
						<text v-else>{{item.message}}</text>
					</view>
				</view>
				<view class="title">
					--内容来自《{{item.taskTitle}}》
				</view>
			</view>
		</view>
		<van-empty description="暂无数据" v-else-if="!loading && msgLists.length === 0"/>
		<view class="no-data" v-if="dataFinishShow">
			-------我是有底线的--------
		</view>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="news-notify"/>
		<van-dialog use-slot :show="inputShow" show-cancel-button @cancel="onClose" @confirm="handleReply">
			<view class="comment-row">
				<input
					:value="commentText" 
					placeholder="请输入回复内容" 
					@input="(e)=>commentText=e.detail.value" 
					@confirm="handleReply                                                                                                                   "
					type="text" 
					placeholder-class="comment-input-placeholder"
					class="comment-input"/>
			</view>
		</van-dialog>
	</view>
</template>

<script>
	import messageApi from "../../utils/service/message.js"
	import commentApi from "../../utils/service/comment.js"
	import signApi from "../../utils/service/sign.js"
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				page: 1,
				size: 10,
				total: 0,
				msgLists: [],
				dataFinishShow: false,
				inputShow: false,
				commentText: "",
				curMsg: {}
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
			handleInput(e){
				console.log(111, e)
				this.commentText = e.detail.value;
			},
			onClose(){
				this.inputShow = false;
				this.commentText = ""
			},
			replyComment(item){
				this.inputShow = true;
				this.curMsg = item;
			},
			handleReply(){
				if(this.commentText === ''){
					// 失败通知
					this.notify({ 
						context: this,
						text: '回复内容不能为空',
						type: "danger",
						selector: "#news-notify"
					});
					return false;
				}
				let sendData = {
					signId: this.curMsg.signId,
					taskId: this.curMsg.taskId,
					sender: this.userInfo.nickName,
					content: this.commentText,
					avatar: this.userInfo.avatarUrl,
					receiver: this.curMsg.sender,
				}
				commentApi.addComment(sendData).then(res=>{
					messageApi.addMessage({...this.curMsg, status: 1}).then(()=>{
						this.refreshMsgList();
						this.onClose()
					}).catch(error=>{
						console.log(error)
						this.onClose()
					})
					
				}).catch(error=>{
					console.log(error)
					this.onClose()
				})
			},
			dayjs(data){
				return dayjs(data)
			},
			approveSign(data, status){
				let sendData = {
					msgId: data.id,
					signId: data.signId,
					status
				}
				signApi.approveSign(sendData).then(res=>{
					// 成功通知
					this.notify({ 
						context: this,
						text: "审批成功!",
						type: "success",
						selector: "#news-notify"
					});
					this.refreshMsgList();
				}).catch(error=>{
					// 失败通知
					this.notify({ 
						context: this,
						text: error.data,
						type: "danger",
						selector: "#news-notify"
					});
				})
			},
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
	min-height: 100vh;
	padding: 10px 0;
	.msg-list {
		.msg-item {
			margin-bottom: 10px;
			.msg-content {
				padding: 10px;
				background-color: #fff;
				// border-top: 5px solid #fff;
				border-radius: 3px;
			}
			.sign-border {
				border-color: $uni-color-success
			}
			.comment-border {
				border-color: $main-bg-color
			}
			.like-border {
				border-color: $minor-icon-color
			}
			.apply-border {
				border-color: $uni-color-error
			}
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
		.oper-btns {
			margin-left: auto;
			
			& > .my-btn:first-child {
				margin-bottom: 5px;
			}
		}
		.desc {
			// padding-left: 20px;
			.like-icon {
			}
		}
		.title {
			font-size: 24rpx;
		    text-align: right;
		    margin-top: 10px;
		    color: $main-icon-color;
			padding-right: 10px;
		}
	}
	.comment-row {
		padding: 40rpx;
	}
	.comment-input {
		border: 1px solid #eee;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		padding: 5px;
		margin-bottom: 20rpx;
		min-height: 100px;
	}
	.comment-input-placeholder {
		font-size: 24rpx;
		color: #999;
	}
}
</style>
