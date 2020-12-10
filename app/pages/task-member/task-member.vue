<template>
	<view class="task-member">
		<van-search :value="searchName" placeholder="请输入你要搜索的名字" @change="e=>searchName=e.detail"/>
		<van-tabbar :active="active" @change="onChange">
		  <van-tabbar-item icon="manager" @click="inviteMember">邀请新人</van-tabbar-item>
		  <van-tabbar-item icon="friends">黑名单</van-tabbar-item>
		  <van-tabbar-item icon="cluster">关联账号</van-tabbar-item>
		  <van-tabbar-item icon="chat">消息</van-tabbar-item>
		</van-tabbar>
		<van-index-bar :index-list="index">
		  <view>
		    <van-index-anchor index="1">标题1</van-index-anchor>
		    <van-cell title="文本" />
		    <van-cell title="文本" />
		    <van-cell title="文本" />
		  </view>
		
		  <view>
		    <van-index-anchor index="2">标题2</van-index-anchor>
		    <van-cell title="文本" />
		    <van-cell title="文本" />
		    <van-cell title="文本" />
		  </view>
		</van-index-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchName: "",
				active: "",
				index: 1
			}
		},
		methods: {
			inviteMember(){
				console.log('inviteMember')
			}
		}
	}
</script>

<style lang="scss">

</style>
