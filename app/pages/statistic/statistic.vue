<template>
	<view class="statistic-page">
		<view class="to-be-wait">
			<image :src="SERVER_URL+'imgs/tobewait.gif'" mode="aspectFit"></image>
			<view class="text">
				敬请期待...
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.statistic-page {
	.to-be-wait {
		text-align: center;
		margin-top: 20%;
		.text {
			margin-top: 20px;
		}
	}
	
}
</style>
