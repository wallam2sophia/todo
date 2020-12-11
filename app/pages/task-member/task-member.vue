<template>
	<view class="task-member">
		<van-search :value="searchName" placeholder="请输入你要搜索的名字" @change="e=>searchName=e.detail"/>
		<view class="oper-bar">
			<van-button custom-class="bar-btn" open-type="share" @click="inviteMember">
				<view class="btn-slot">
					<van-icon name="manager" custom-class="icon"></van-icon>
					<text class='title'>邀请新人</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn">
				<view class="btn-slot">
					<van-icon name="friends" custom-class="icon"></van-icon>
					<text class='title'>黑名单</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn">
				<view class="btn-slot">
					<van-icon name="cluster" custom-class="icon"></van-icon>
					<text class='title'>关联账号</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn">
				<view class="btn-slot">
					<van-icon name="chat" custom-class="icon"></van-icon>
					<text class='title'>消息</text>
				</view>
			</van-button>
		</view>
		<van-index-bar :index-list="curIndex" class="member-lists">
		  <view v-for="(item, index) in members" :key="index">
		    <van-index-anchor :index="item.letter">{{item.letter}}</van-index-anchor>
		    <van-cell :title="item1" v-for="(item1, index1) in item.data" :key="index1" custom-class="member-name"/>
		  </view>
		</van-index-bar>
	</view>
</template>

<script>
	import { pySegSort } from "../../utils/util.js";
	export default {
		data() {
			return {
				searchName: "",
				active: "",
				curIndex: "B",
				members: [],
			}
		},
		methods: {
			inviteMember(){
				console.log('inviteMember')
				uni.showShareMenu({ 
					withShareTicket:false,
					success(res){
						console.log(res)
					},
					fail(error){
						console.log(error)
					}
					});
			}
		},
		onLoad(options){
			this.members = pySegSort(JSON.parse(options.members));
			console.log("members", this.members)
		}
	}
</script>

<style lang="scss">
.task-member {
	.oper-bar {
		display: flex;
		align-items: center;
		justify-content: space-around;
		margin: 10px auto;
	}
	.bar-btn {
		 border: none;
		 cursor: pointer;
		 
		.btn-slot {
			display: flex;
			flex-direction: column;
			justify-content: center;
			.icon {
				font-size: 20px;
				color: #0081FF;
			}
			.title {
				margin-top: 2px;
			}
		}
		
	}
	
	.member-lists {
		
		.van-index-anchor {
			float: right;
			font-size: 26rpx;
		}
		.member-name {
			color: #0081FF;
		}
	}
	
	
}
</style>
