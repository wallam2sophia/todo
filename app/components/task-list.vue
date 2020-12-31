<template>
	<view class="task-lists">
		
		<view v-for="item in list" :key="item.id">
			<van-swipe-cell :right-width="65" :left-width="65" async-close :name="item.id" @close="onClose">
			 <view slot="left">
				 <view class="swipe-icon">
				 	修改
				 </view>
			 </view>
			  <view class="task-card card-item" @click="goDetail(item.id, item.status)">
			  	<view class="task-status" :class="item.status + '-status'" v-if="tabStatus === 'all'">
			  		{{statusMap[item.status]}}
			  	</view>
			  	<view class="task-img">
			  		<image :src="item.bgImg.startsWith('https://') ? item.bgImg : SERVER_URL + item.bgImg" mode="aspectFit"></image>
			  		<view class="member-mask">
			  			{{item.members.length || 0}}人参与
			  		</view>
			  	</view>
			  	<view class="task-info">
			  		<view class="task-row title">
			  			<text>{{item.title}}</text>
			  		</view>
			  		<view class="task-row van-ellipsis desc">
			  			<text>{{item.desc}}</text>
			  		</view>
			  		<view class="task-row">
			  			<van-icon name="manager-o" custom-class="icon" />
			  			<text>{{item.creator}}</text>
			  		</view>
			  		<view class="task-row">
			  			<van-icon name="clock-o" custom-class="icon" />
			  			<text>{{item.beginTime}} 至 {{item.endTime}}</text>
			  		</view>
			  		<view v-if="item.status==='doing'">
			  			<view class="my-btn primary-btn btn-pos" v-if="!item.isSigned" @click.stop="signIn(item.id)">
			  				打卡
			  			</view>
			  			<view class="my-btn info-btn disabled-btn btn-pos" v-else @click.stop="">
			  				已打卡
			  			</view>
			  		</view>
			  		
			  	</view>
				
			  </view>
			 <view slot="right">
				 <view class="swipe-icon">
				 	删除
				 </view>
			 </view>
			</van-swipe-cell>
			
		</view>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="detail-notify"/>
		<van-dialog id="del-dialog" />
	</view>
</template>

<script>
	import signApi from "../utils/service/sign.js"
	import taskApi from "../utils/service/task.js"
	import Dialog from '../wxcomponents/vant-weapp/dialog/dialog';

	export default {
		props: {
			list:{
				required:true,
				type:Array
			},
			tabStatus: {
				required:true,
				type:String
			}
		},
		data() {
			return {
				userInfo: {},
				statusMap: {
					'todo': '待',
					'doing': '进',
					'done': '结',
				}
			};
		},
		mounted() {
			this.userInfo = uni.getStorageSync('userInfo');
		},
		methods: {
			onClose(event){
				const { position, instance, name } = event.detail;
				console.log(position, instance, name)
				    switch (position) {
				      case 'left':
					    this.handleEdit(name)
				      case 'cell':
				        instance.close();
				        break;
				      case 'right':
				        Dialog.confirm({
						  context: this,
						  selector: '#del-dialog',
				          message: '确定删除该任务吗？',
				        }).then(() => {
						  this.handleDelete(name).then(res=>{
							  instance.close();
						  }).catch(err=>{
							  instance.close();
						  })
				        })
				        break;
				    }
			},
			async handleDelete(id){
				try {
					const res = await taskApi.deleteTask(id)
					if(res.code !== 100){
						this.notify({
							context: this,
							text: "删除失败!",
							type: "danger",
							selector: "#detail-notify"
						})
						return false
					}
					this.notify({
						context: this,
						text: "删除成功!",
						selector: "#detail-notify"
					})
					this.$emit("refresh")
					return true
				}catch(error){
					this.notify({
						context: this,
						text: "删除失败!",
						type: "danger",
						selector: "#detail-notify"
					})
					return false
				}
				
			},
			handleEdit(data){
				console.log(data)
			},
			goDetail(id, status){
				this.$emit('task-click', id, status)
			},
			signIn(taskId){
				let sendData = {
					taskId: taskId,
					signer: this.userInfo.nickName,
					avatarUrl: this.userInfo.avatarUrl,
					signTime: new Date().getTime()
				}
				signApi.addSign(sendData).then(res => {
					// 成功通知
					this.notify({ 
						context: this,
						text: "打卡成功!",
						type: "sucess",
						selector: "#detail-notify"
					});
					this.$emit("refresh")
				}).catch(error=>{
					// 失败通知
					this.notify({ 
						context: this,
						text: error.data,
						type: "danger",
						selector: "#detail-notify"
					});
				})
			},
		}
	}
</script>

<style lang="scss">
	.task-lists {
		.task-card {
			position: relative;
			padding: 10px 15px;
			font-size: 12px;
			color: #333;
			box-sizing: border-box;
			background-color: #fafafa;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			border-bottom: 0.5px solid #fff;

			.task-status {
				position: absolute;
				top: 1px;
				left: 1px;
				font-size: 10px;
				color: #fff;
				width: 20px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				// padding-left: 2px;
				// border-bottom-left-radius: 50%;
				// border-top-right-radius: 50%;
				// border-bottom-right-radius: 50%;
				border-radius: 50%;
			}
			.todo-status {
				background: linear-gradient(to right, #ada310, #d1b200);
			}
			.doing-status {
				background: linear-gradient(to right, #3681e3, #3810b0);
			}
			.done-status {
				background: linear-gradient(to right, #ad1313, #d10000);
			}

			.task-img {
				position: relative;
				width: 90px;
				height: 90px;
				margin-right: 10px;
				flex: none;

				image {
					width: 100%;
					height: 100%;
					max-width: 100%;
					display: inline-block;
					position: relative;
					z-index: 0;
				}

				.member-mask {
					position: absolute;
					bottom: 20rpx;
					width: 90px;
					background-color: rgba(0, 0, 0, 0.6);
					color: #fff;
					height: 32px;
					line-height: 32px;
					text-align: center;
					font-size: 22rpx;
				}
			}

			.task-info {
				position: relative;
				flex: 1;
				min-width: 0;

				.task-row {
					&+.task-row {
						margin-top: 10px;
					}
				}

				.title {
					font-weight: 700;
					font-size: 14px;
				}

				.desc {
					color: #7d7e80;
				}

				.icon {
					color: $minor-icon-color;
					font-size: 16px;
					margin-right: 5px;
				}

				text {
					line-height: 16px;
					height: 16px;
					display: inline-block;
					vertical-align: top;
				}
			}
		}
		.btn-pos {
			position: absolute;
			right: -10rpx;
			bottom: 60rpx;
			padding: 10rpx 28rpx;
		}
		.swipe-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
