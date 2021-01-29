<template>
	<view class="sign-comment">
		<view class="log-row" v-show="inputShow">
			<input 
				:value="commentText" 
				placeholder="请输入评论内容" 
				@input="(e)=>commentText=e.detail.value" 
				type="text" 
				@confirm="addComment" 
				@blur="closeInput"
				placeholder-class="comment-input-placeholder"
				class="comment-input"/>
		</view>
		<view class="like-list" v-if="likeList.length > 0">
			<van-icon name="like" custom-class="like-icon"/>
			<view class="like-item" v-for="(like, index) in likeList" :key="like.id">
				<text class="author">{{like.author}}</text>
				<text v-if="index != likeList.length - 1">,</text>
			</view>
		</view>
		<view class="comment-list" v-if="commentList.length > 0">
			<view class="comment-item" v-for="com in commentList" :key="com.id" @click="handleOperCom(com)">
				<text class="author">{{com.sender}}</text>
				<text v-if="com.receiver">&nbsp;&nbsp;回复&nbsp;&nbsp;</text>
				<text class="author" v-if="com.receiver">{{com.receiver}}</text>
				<text>:&nbsp;&nbsp;{{com.content}}</text>
			</view>
		</view>
		<van-action-sheet
		  :show="actionShow"
		  :actions="actionList"
		  @close="actionShow = false"
		  @select="onSelect"
		  cancel-text="取消"
		  @cancel="actionShow = false"
		/>
	</view>
</template>

<script>
	import signApi from "../utils/service/sign.js"
	import commentApi from "../utils/service/comment.js"
	import likeApi from "../utils/service/like.js"
	export default {
		props: ["taskId", "signInfo"],
		data() {
			return {
				curComment: {},
				actionShow: false,
				replyShow: false,
				commentText: "",
				likeList: [],
				commentList: [],
				actionList: [
					{
						name: '回复',
					},
				]
			};
		},
		computed:{
			inputShow(){
				return this.replyShow || this.signInfo.inputShow;
			}
		},
		watch:{
		},
		mounted(){
			this.fetchComments();
			this.fetchLikes();
		},
		methods: {
			handleOperCom(comment){
				this.curComment = comment;
				this.actionShow = true;
				if(this.userInfo.nickName === comment.sender){
					this.actionList = [
						{
							name: '删除',
						},
					]
				}else if(this.userInfo.nickName === comment.receiver || this.userInfo.nickName === this.signInfo.signer){
					this.actionList = [
						{
							name: '回复',
						},
					]
				}else {
					this.actionList = [
						{
							name: '复制',
						},
					]
				}
				
			},
			onSelect(e){
				let action = e.detail.name;
				switch(action){
					case '删除':
						commentApi.deleteComment(this.curComment.id).then(res=>{
							this.fetchComments();
							this.actionShow = false;
						})
						break;
					case '回复':
						this.replyShow = true;
						break;
					case '复制':
						wx.setClipboardData({
							data: this.curComment.content,
						})
						break;
				}
				
			},
			closeInput(){
				this.$emit("closeInput")
			},
			addComment(){
				let sendData = {
					signId: this.signInfo.id,
					taskId: this.taskId,
					sender: this.userInfo.nickName,
					content: this.commentText,
					avatar: this.userInfo.avatarUrl
				}
				if(this.replyShow){
					sendData.receiver = this.curComment.sender;
				}
				console.log(sendData)
				commentApi.addComment(sendData).then(res=>{
					this.fetchComments();
					this.$emit("closeInput")
					this.replyShow = false;
				}).catch(error=>{
					console.log(error)
					this.$emit("closeInput")
					this.replyShow = false;
				})
			},
			fetchComments(){
				let sendData = {
					signId: this.signInfo.id,
					taskId: this.taskId,
				}
				commentApi.listComment(sendData).then(res=>{
					this.commentList = res.data;
				})
			},
			fetchLikes(){
				let sendData = {
					signId: this.signInfo.id,
					taskId: this.taskId,
				}
				likeApi.listLike(sendData).then(res=>{
					this.likeList = res.data;
					let ilike = res.data.filter(item=>item.author === this.userInfo.nickName)
					if(ilike.length > 0){
						this.$emit('ilike', this.signInfo.id, true, ilike[0].id)
					}else {
						this.$emit('ilike', this.signInfo.id, false, null)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.sign-comment {
	font-size: 26rpx;
	padding-left: 40px;
	padding-right: 10px;
	
	.comment-input {
		width: 95%;
		border: 1px solid #eee;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		padding: 5px;
		margin-bottom: 20rpx;
	}
	.comment-input-placeholder {
		font-size: 24rpx;
		color: #999;
	}
	.like-list {
		padding: 5px;
		background-color: $main-grey-border;
		border: 1px solid $main-grey-border;
		margin-bottom: 20rpx;
		.like-item {
			display: inline-block;
			margin-left: 5px;
		}
	}
	.comment-list {
		padding: 5px;
		background-color: $main-grey-border;
		border: 1px solid $main-grey-border;
		.comment-item {
			margin-bottom: 5px;
			line-height: 1.5;
		}
	}
	.like-icon {
		color: $minor-icon-color;
	}
	.author {
		color: $uni-color-primary;
	}
}
</style>
