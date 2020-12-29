<template>
	<view class="log-lists">
		<view v-if="signList.length > 0">
			<view class="log-item" v-for="(item, index) in signList" :key="item.id"  >
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
				<view class="log-row media-box flex-row"  v-if="item.media.length > 0">
					<view class="media-item" v-for="(item1,index) in item.media" :key="index">
						<image :src="item1" mode="aspectFit"></image>
					</view>
				</view>
				<view class="log-row location" v-if="item.location.name">
					<van-icon name="location" custom-class="icon"/>
					<text class="text">{{item.location.name}}</text>
				</view>
				<view class="log-row action" v-if="taskStatus !== 'done'">
					<view class="comment action-item" @click="openComment(item)" :class="{'disabled-icon': item.inputShow}">
						<van-icon name="comment-o" custom-class="icon" />
						<text>评论</text>
					</view>
					<view class="share action-item">
						<van-icon name="share-o" custom-class="icon" />
						<text>分享</text>
					</view>
					<!-- <view class="detail action-item">
						<van-icon name="description" custom-class="icon"/>
						<text>详情</text>
					</view> -->
					<view class="like action-item" @click="addLike(item, index)" :class="{'is-liked': item.isLiked}">
						<van-icon name="like" custom-class="icon" />
					</view>
				</view>
				<signComment :taskId="taskId" :signInfo="item" class="sign-comment" @closeInput="closeInput(item)" @ilike="handleLike" ref="signComment"></signComment>
			</view>
		</view>
		<view class="empty-box" v-else>
			<van-empty description="目前还没有人签到过哦,赶紧做第一个抢沙发的人吧!" />
		</view>
	</view>
</template>

<script>
	import signApi from "../utils/service/sign.js"
	import commentApi from "../utils/service/comment.js"
	import likeApi from "../utils/service/like.js"
	import signComment from "./sign-comment.vue"
	export default {
		props: ["taskId", "taskStatus", "list"],
		components:{ signComment },
		data() {
			return {
				signList: [],
				commentList:[]
			};
		},
		computed:{
		},
		watch:{
			list: {
				deep: true,
				handler(val, oldVal){
					this.signList = this.list.map(item=>{
						return Object.assign({}, item, {inputShow: false})
					})
					console.log(this.signList)
				}
			}
		},
		mounted(){
		},
		methods: {
			openComment(data){
				if(data.inputShow) return;
				data.inputShow = true;
			},
			closeInput(data){
				data.inputShow = false;
			},
			handleLike(signId, value, likeId){
				this.signList.forEach(item=>{
					if(item.id == signId){
						this.$set(item, 'isLiked', value)
						this.$set(item, 'likeId', likeId)
					}
				})
			},
			addLike(data, index){
				if(data.isLiked){
					likeApi.deleteLike(data.likeId).then(res=>{
						this.$refs.signComment[index].fetchLikes();
					})
				}else {
					let sendData = {
						signId: data.id,
						taskId: this.taskId,
						author: this.userInfo.nickName,
					}
					likeApi.addLike(sendData).then(res=>{
						this.$refs.signComment[index].fetchLikes();
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
.log-lists {
	font-size: 26rpx;
	.log-item {
		padding: 15px 10px 0;
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
				cursor: pointer;
				
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
	.sign-comment {
		width: 100%;
	}
	.is-liked {
		color: $minor-icon-color;
	}
	
}
</style>
