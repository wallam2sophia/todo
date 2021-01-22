<template>
	<view>
		<view class="wifi-symbol">
			<view class="wifi-circle first"></view>
			<view class="wifi-circle second" :class="{'animation-second': isPlay}"></view>
			<view class="wifi-circle third" :class="{'animation-third': isPlay}"></view>
		</view>

	</view>
</template>

<script>
	export default {
		props: ['isPlay'],
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.wifi-symbol {
		width: 14px;
		height: 14px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: relative;
		margin-right: 5px;

	}

	.wifi-circle {
		border: 2px solid #fff;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 16px;
		height: 16px;
		top: 10px;
		left: 10px;
	}

	.second {
		width: 20px;
		height: 20px;
		top: 5px;
		left: 5px;
		animation: none;
	}

	.third {
		width: 25px;
		height: 25px;
		top: 0px;
		left: 0px;
		animation: none;
	}
	
	.animation-second {
		animation: fadeInOut 1s infinite 0.3s;
	}
	.animation-third {
		animation: fadeInOut 1s infinite 0.5s;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
			/*初始状态 透明度为0*/
		}

		100% {
			opacity: 1;
			/*结尾状态 透明度为1*/
		}
	}
</style>
