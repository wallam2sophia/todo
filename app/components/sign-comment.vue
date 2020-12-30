<template>
	<view class="sign-comment">
		<view class="log-row" v-show="signInfo.inputShow">
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
			<view class="comment-item" v-for="com in commentList" :key="com.id" @click="handleOperCom(com.id)">
				<text class="author">{{com.author}}</text>
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
				curCommentId: null,
				actionShow: false,
				commentText: "",
				likeList: [],
				commentList: [],
				actionList: [
					{
						name: '删除',
					}
				]
			};
		},
		computed:{
		},
		watch:{
		},
		mounted(){
			console.log('userInfo', this.userInfo)
			this.fetchComments();
			this.fetchLikes();
		},
		methods: {
			handleOperCom(id){
				this.curCommentId = id;
				this.actionShow = true;
			},
			onSelect(e){
				commentApi.deleteComment(this.curCommentId).then(res=>{
					this.fetchComments();
					this.actionShow = false;
				})
			},
			closeInput(){
				this.$emit("closeInput")
			},
			addComment(){
				let sendData = {
					signId: this.signInfo.id,
					taskId: this.taskId,
					author: this.userInfo.nickName,
					content: this.commentText
				}
				commentApi.addComment(sendData).then(res=>{
					this.fetchComments();
					this.$emit("closeInput")
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
