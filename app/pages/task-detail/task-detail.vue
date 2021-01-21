<template>
	<view class="task-detail">
		<view class="task-base" :style="{'background-image': 'url('+ bgUrl + ')'}">
			<view class="title">
				<text>{{taskInfo.title}}</text>
			</view>
			<view class="info">
				<view>第{{taskInfo.finishDays}}/{{taskInfo.totalDays}}天</view>
				<view>共{{taskInfo.members.length}}人参与</view>
			</view>
			<view class="progress">
				<view class="bg-line"></view>
				<view class="front-line" :style="{'width':taskInfo.finishDays / taskInfo.totalDays * 100+'%' }"></view>
			</view>
			
		</view>
		<view class="ds-beetw block-box">
			<view class="creator">
				<van-icon name="user-o" custom-class="icon" />
				<view class="name">{{taskInfo.creator}}</view>
				<view class="tag">发起人</view>
			</view>
			<view class="member-manage" @click="addMember">
				<view>查看成员</view>
				<van-icon name="arrow" custom-class="icon"/>
			</view>
		</view>
		<view class="block-box">
			<view class="desc">
				<van-icon name="notes-o" custom-class="icon"/>
				<text>打卡规则</text>
			</view>
			<view class="duration">
				* 签到日期：{{taskInfo.beginTime}} 至 {{taskInfo.endTime}}
			</view>
			<view class="rule">
				* 签到规则：{{taskInfo.desc}}
			</view>
		</view>
		<view class="block-box tab-bars">
			<van-button custom-class="bar-btn" @click="goShare">
				<view class="btn-slot">
					<van-icon name="share-o" custom-class="icon"></van-icon>
					<text class='title'>分享</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn" @click="goRank">
				<view class="btn-slot">
					<van-icon name="chart-trending-o" custom-class="icon"></van-icon>
					<text class='title'>排行榜</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn">
				<view class="btn-slot">
					<van-icon name="setting-o" custom-class="icon"></van-icon>
					<text class='title'>设置</text>
				</view>
			</van-button>
			<van-button custom-class="bar-btn" @click="goRecord">
				<view class="btn-slot">
					<van-icon name="records" custom-class="icon"></van-icon>
					<text class='title'>我的记录</text>
				</view>
			</van-button>
		</view>
		<view class="oper-bar">
			<view v-if="taskInfo.members">
				<view v-if="taskInfo.members.includes(userInfo.nickName)">
					<view  class="my-btn warning-btn disabled-btn" v-if="taskInfo.status === 'done'">打卡已结束</view>
					<view  class="my-btn info-btn disabled-btn" v-else-if="taskInfo.status === 'todo'">打卡未开始</view>
					<view v-else-if="taskInfo.status === 'doing' && !taskInfo.isSigned">
						<view  class="my-btn primary-btn"  @click="signIn">点击打卡</view>
						<view class="notice-bar">
							<view class="location" v-if="taskInfo.locationLimit">
								<!-- <view class="title">
									指定打卡地点:
								</view> -->
								<view class="loc" v-for="(item, index) in taskInfo.locations" :key="index">
									<text class='loc-href' @click="goAddress(item)">{{item.name}}</text>-{{item.offset}}米以内
								</view>
							</view>
							<view class="wifi-l" v-if="taskInfo.wifiLimit">
								<!-- <view class="title">
									指定打卡wifi:
								</view> -->
								<view class="wifi">
									{{taskInfo.wifis.map(item=>item.SSID).join("/")}}
								</view>
								
							</view>
						</view>
					</view>
					<view class="my-btn success-btn disabled-btn" v-else>今日打卡已完成</view>
				</view>
				<view class="my-btn warning-btn" @click="joinPopShow=true" v-else>参与打卡</view>
			</view>
		</view>
		<view class="ds-beetw card-box">
			<view class="user">
				<view class="avatar">
					<image :src="userInfo.avatarUrl" mode="aspectFit"></image>
				</view>
				<view class="name">{{userInfo.nickName}}</view>
				<view class="tag" v-if="taskInfo.creator === userInfo.nickName">发起人</view>
			</view>
			<view class="sign-calander" @click="goRecord">
				<view>打卡日志</view>
				<van-icon name="arrow" custom-class="icon"/>
			</view>
		</view>
		<view class="block-box task-log">
			<text class="title">签到动态</text>
			<text class="tag" @click="changeSignData('all')" :class="{'active-tag': signTab==='all'}">全部</text>
			<text class="tag" @click="changeSignData('today')" :class="{'active-tag': signTab==='today'}">今天</text>
			<text class="tag" @click="dateShow=true" :class="{'active-tag': signTab==='custom'}" v-show="signTab !== 'custom' || (signTab === 'custom' && !signDate)">选择日期</text>
			<text class="tag" @click="dateShow=true" :class="{'active-tag': signTab==='custom'}" v-show="signTab === 'custom' && !!signDate">{{signDate}}</text>
		</view>
		<view class="asign-logs">
			<signLog :list="signLogs" :taskId="taskId" :taskStatus="taskStatus"></signLog>
			<view class="no-data" v-if="dataFinishShow">
				-------我是有底线的--------
			</view>
		</view>
		<van-popup :show="joinPopShow" @close="joinPopShow=false" custom-class="join-task-popup">
			<joinTaskPop :taskInfo="taskInfo" @close="joinPopShow=false" @submit="onJoinSubmit"></joinTaskPop>
		</van-popup>
		<van-popup :show="dateShow" position="bottom" round @cloce="dateShow=false">
			<van-datetime-picker type="date" :value="currentDate" :min-date="minDate" :max-date="maxDate" @input="onInput"  @cancel="dateShow=false" @confirm="changeSignData(currentDate)"/>
		</van-popup>
		<van-action-sheet :show="shareShow" cancel-text="取消" @cancel="shareShow = false" @select="shareShow = false">
			<view class="share-sheet flex-row">
				<van-button custom-class="share-btn" open-type="share" dataset="sharePage">
					<view class="share-item flex-column">
						<view class="share-icon">
							<image src="../../static/icon/wechat.png" mode="aspectFit"></image>
						</view>
						<view class="share-text">
							微信朋友
						</view>
					</view>
				</van-button>
				<view class="share-item flex-column">
					<view class="share-icon tupian">
						<image src="../../static/icon/tupian.png" mode="aspectFit"></image>
					</view>
					<view class="share-text">
						日签分享图
					</view>
				</view>
				<view class="share-item flex-column" @click="signQRCode">
					<view class="share-icon">
						<image src="../../static/icon/minipro.png" mode="aspectFit"></image>
					</view>
					<view class="share-text">
						签到小程序码
					</view>
				</view>
				<view class="share-item flex-column">
					<view class="share-icon tupian">
						<image src="../../static/icon/erweima.png" mode="aspectFit"></image>
					</view>
					<view class="share-text">
						签到二维码
					</view>
				</view>
			</view>
		</van-action-sheet>
		<!-- 分享图片 -->
		<van-overlay :show="shareImgShow" @click="shareImgShow=false">
		  <view class="wrapper pos-center"  @click.stop="shareSheetShow=true">
		    <!-- <image :src="shareImg" mode="aspectFit"></image> -->
			<canvas canvas-id="share-canvas" id="share-canvas" style="width: 320px; height: 350px;background:#fff"></canvas>
		  </view>
		</van-overlay>
		<van-action-sheet
		  :show="shareSheetShow"
		  :actions="shareActions"
		  cancel-text="取消"
		  @cancel="shareSheetShow = false"
		  @select="shareSheetShow = false"
		/>
		<!-- 在页面内添加对应的节点 -->
		<van-notify id="task-notify"/>
	</view>
</template>

<script>
	import signLog from "../../components/sign-log.vue"
	import taskApi from "../../utils/service/task.js"
	import signApi from "../../utils/service/sign.js"
	import commonApi from "../../utils/service/common.js"
	import joinTaskPop from "../../components/joinTaskPop.vue"
	import dayjs from 'dayjs'
	import { getDistance } from "../../utils/util.js"
	export default {
		components:{ signLog, joinTaskPop },
		data() {
			return {
				page: 1,
				size: 5,
				total: 0,
				currentDate: "",
				minDate: "",
				maxDate: "",
				taskId: "",
				taskStatus: "",
				signDate: "",
				signTab: "all",
				taskInfo: {},
				signLogs:[],
				shareImg: "",
				shareSheetShow: false,
				shareActions: [
				  { name: '发送给朋友', openType: 'share' },
				  { name: '收藏' },
				  { name: '保存图片' },
				],
				joinPopShow: false,
				dateShow: false,
				dataFinishShow: false,
				shareShow: false,
				shareImgShow: false,
			}
		},
		computed:{
			bgUrl(){
				if(!this.taskInfo.bgImg) return ""
				return this.taskInfo.bgImg.startsWith('https://') ? this.taskInfo.bgImg : this.SERVER_URL + this.taskInfo.bgImg
			}
		},
		methods: {
			fetchTaskInfo(){
				taskApi.detailTask(this.userInfo.nickName, this.taskId).then(res => {
					this.taskInfo = res.data;
					this.minDate = dayjs(this.taskInfo.beginTime).toDate().getTime()
					this.maxDate = dayjs(this.taskInfo.endTime).toDate().getTime()
				})
			},
			fetchSignLogs(){
				let sendData = {
					taskId: this.taskId,
					signDate: this.signDate,
					page: this.page,
					size: this.size
				}
				signApi.listSign(sendData).then(res => {
					let { count, list } = res.data;
					this.total = count;
					this.signLogs = [...this.signLogs, ...list];
				})
			},
			refreshSignLogs(){
				this.page = 1;
				this.signLogs = []
				this.dataFinishShow = false
				this.fetchSignLogs();
			},
			changeSignData(day){
				console.log(day)
				if(day === 'today'){
					this.signTab = 'today'
					this.signDate = dayjs(new Date()).format("YYYY-MM-DD");
				}else if(day === 'all'){
					this.signTab = 'all'
					this.signDate = ''
				}else {
					this.signTab = 'custom'
					this.signDate = dayjs(day).format("YYYY-MM-DD");
					this.dateShow = false;
				}
				this.refreshSignLogs();
			},
			onInput(e){
				this.currentDate = e.detail;
			},
			addMember(){
				uni.navigateTo({
					url: `../task-member/task-member?taskId=${this.taskInfo.id}&members=${JSON.stringify(this.taskInfo.members)}&creator=${this.taskInfo.creator}&taskTitle=${this.taskInfo.title}`
				})
			},
			goRecord(){
				uni.navigateTo({
					url: `../my-logs/my-logs?taskId=${this.taskInfo.id}`
				})
			},
			goRank(){
				uni.navigateTo({
					url: `../task-rank/task-rank?taskId=${this.taskInfo.id}`
				})
			},
			goShare(){
				this.shareShow = true;
			},
			signQRCode(){
				let sendData = {
					path: "/page/task-detail/task-detail?taskId=" + this.taskId
				}
				commonApi.getQRCode(sendData).then(res=>{
					console.log(res)
					this.shareShow = false;
					this.shareImgShow = true;
					let imgSrc = "data:image/png;base64," + wx.arrayBufferToBase64(res.data.data);
					this.createPoster(this.taskInfo.title, `${this.taskInfo.beginTime} 至 ${this.taskInfo.endTime}`, imgSrc, "长按或扫码进入")
				})
			},
			createPoster(title, subTitle, imgSrc, tips){
				let firstY = 50
				let centerX = 160
				let imgSize = 100
				const ctx = wx.createCanvasContext('share-canvas')
				// 清空之前内容
				ctx.draw()
				// 绘制顶部title
				ctx.setFontSize(15)
				ctx.setTextAlign('center')
				ctx.fillStyle = "#0081FF"
				ctx.fillText(`# ${title} #`, centerX, firstY)
				// 绘制副title
				ctx.setFontSize(12)
				ctx.setTextAlign('center')
				ctx.fillStyle = "#999"
				ctx.fillText(subTitle, centerX, firstY + 30)
				// 绘制图片
				ctx.drawImage(imgSrc, centerX - imgSize / 2, firstY + 30 * 2, imgSize, imgSize)
				// 绘制提示
				ctx.setFontSize(12)
				ctx.setTextAlign('center')
				ctx.setTextBaseline('middle')
				ctx.fillStyle = "#333"
				ctx.fillText(tips, centerX, firstY + 30 * 3 + 120)
				
				ctx.setLineWidth(1)
				ctx.setStrokeStyle('#333')
				ctx.setLineDash([5, 5], 0);
				ctx.beginPath();
				ctx.moveTo(100, firstY + 30 * 3 + 100)
				ctx.lineTo(220, firstY + 30 * 3 + 100)
				ctx.lineTo(220, firstY + 30 * 3 + 140)
				ctx.lineTo(100, firstY + 30 * 3 + 140)
				ctx.lineTo(100, firstY + 30 * 3 + 100)
				ctx.stroke()
				
				ctx.draw()
			},
			async signIn(){
				try {
					// 限制打卡地点
					let locValid = true
					if(this.taskInfo.locationLimit){
						let [_, curLoc] = await uni.getLocation({type: 'wgs84', altitude: true })
						// 获取当前位置
						for(let location of this.taskInfo.locations){
							let distance = getDistance(location.latitude, location.longitude, curLoc.latitude, curLoc.longitude)
							if(distance > parseInt(location.offset)){
								locValid = false;
								break;
							}
						}
					}
					// 限制打卡wifi
					let wifiValid = true
					if(this.taskInfo.wifiLimit){
						let { wifi: curWifi }  = await wx.getConnectedWifi()
						// 获取当前位置
						for(let wifi of this.taskInfo.wifis){
							if(wifi.BSSID !== curWifi.BSSID){
								wifiValid = false;
								break;
							}
						}
					}
					if(locValid && wifiValid){
						uni.navigateTo({
							url: `../add-sign/add-sign?taskId=${this.taskInfo.id}`
						})
					}else if(!locValid){
						// 失败通知
						this.notify({ 
							context: this,
							text: "你当前不在可打卡的范围!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}else if(!wifiValid){
						// 失败通知
						this.notify({ 
							context: this,
							text: "请连接到指定wifi列表打卡!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}else{
						// 失败通知
						this.notify({ 
							context: this,
							text: "暂无法打卡,请联系管理员!",
							type: "danger",
							selector: "#task-notify"
						});
						return false
					}
				}catch(error){
					console.log(error)
				}
			},
			goAddress(location){
				uni.openLocation({
					latitude: location.latitude,
					longitude: location.longitude,
					name: location.name,
					address: location.address,
					success(res){
						console.log(res)
					},
					fail(error){
						console.log(error)
						// 失败通知
						this.notify({ 
							context: this,
							text: "查看地图失败!",
							type: "danger",
							selector: "#task-notify"
						});
					}
				})
			},
			onJoinSubmit(){
				this.fetchTaskInfo();
				this.joinPopShow = false;
			}
		},
		onLoad(options){
			this.taskId = options.taskId;
			this.taskStatus = options.taskStatus;
		},
		onShow(){
			this.fetchTaskInfo();
			this.refreshSignLogs();
		},
		onReachBottom(){
			if(this.signLogs.length > 0 && this.signLogs.length === this.total){
				this.dataFinishShow = true;
			}
			if(!this.dataFinishShow){
				this.page ++;
				this.fetchSignLogs();
			}
		},
		onShareAppMessage(options){
			console.log(options)
			if(options.target.dataset.detail === 'sharePage'){
				return {
					title: `${this.userInfo.nickName}邀请您一起参与【${this.taskInfo.title}】打卡任务!`,
					path: `/pages/task-detail/task-detail?taskId=${this.taskInfo.id}`,
					success: function(){
						console.log('share success')
					},
					fail: function(error){
						console.log('share fail:', error)
					},
				}
			}else {
				return {
					title: '小程序码分享',
					path: `/pages/task-detail/task-detail?taskId=${this.taskInfo.id}`,
				}
			}
			
		},
	}
</script>

<style lang="scss">
.task-detail {
	font-size: 26rpx;
	background-color: #eee;
	.task-base {
		position: relative;
		color: #fff;
		width: 100%;
		height: 120px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		padding: 10px;
	    box-sizing: border-box;
		
		image {
			width: 100%;
		}
		.title {
			font-size: 16px;
			position: absolute;
			bottom: 50px;
		}
		.info {
			position: absolute;
			bottom: 25px;
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			width: calc(100% - 20px);
		}
		.progress {
			width: calc(100% - 20px);
			position: absolute;
			bottom: 10px;
			.bg-line {
				width: 100%;
				height: 5px;
				background-color: #fff;
			}
			.front-line {
				height: 5px;
				background-color: $main-icon-color;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
    .creator {
		display: flex;
		align-items: center;
		.icon {
			margin-right: 5px;
			font-size: 16px;
		}
		.name {
			margin-right: 5px;
		}
		.tag {
			font-size: 8px;
			padding: 3px 5px;
			background-color: $minor-icon-color;
			color: #fff;
			border: 1px solid $minor-icon-color;
			border-radius: 4px;
		}
	}
	.member-manage {
		color: $main-icon-color;
		cursor: pointer;
		display: flex;
		align-items: center;
		.icon {
			margin-left: 5px;
			font-size: 16px;
		}
	}
	.desc {
		margin-bottom: 10px;
		display: flex;
		align-items: center;
		.icon {
			margin-right: 5px;
			font-size: 16px;
		}
	}
	.duration {
		line-height: 1.6;
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
	.rule {
		line-height: 1.6;
		font-size: 24rpx;
		color: $uni-text-color-grey;
	}
	.tab-bars {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.bar-btn {
			 border: none;
			 cursor: pointer;
			 
			.btn-slot {
				display: flex;
				flex-direction: column;
				justify-content: center;
				.icon {
					font-size: 20px;
					color: $main-icon-color;
				}
				.title {
					margin-top: 2px;
					color: $uni-text-color-grey;
				}
			}
			
		}
	}
	.oper-bar {
		width: 80%;
		margin: 10px auto;
		
		.notice-bar {
			margin-top: 10px;
			font-size: 12px;
			color: #999;
			text-align: center;
			.location {
				margin-bottom: 5px;
				line-height: 20px;
				
				.loc-href {
					color: $main-bg-color;
				}
			}
			.wifi{
				color: $main-bg-color;
			}
		}
	}
	.user {
		display: flex;
		align-items: center;
		.avatar {
			width: 20px;
			height: 20px;
			margin-right: 20rpx;
			
			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		
		.icon {
			margin-right: 5px;
			font-size: 16px;
		}
		.name {
			margin-right: 5px;
		}
		.tag {
			font-size: 8px;
			padding: 3px 5px;
			background-color: $minor-icon-color;
			color: #fff;
			border: 1px solid $minor-icon-color;
			border-radius: 4px;
		}
	}
	.sign-calander {
		color: $main-icon-color;
		cursor: pointer;
		display: flex;
		align-items: center;
		.icon {
			margin-left: 5px;
			font-size: 16px;
		}
	}
	.task-log {
		display: flex;
		align-items: center;
		.title {
			margin-right: 5px;
		}
		.tag {
			font-size: 22rpx;
			color: $main-grey-text;
			border: 1px solid $main-grey-border;
			padding: 1px 5px;
			border-radius: 15px;
			margin-right: 5px;
			cursor: pointer;
		}
		.active-tag {
			color: $main-icon-color;
			border-color: $main-icon-color;
		}
	}
	.block-box {
		border-bottom: 1px solid #eee;
		padding: 10px;
		background-color: #fff;
	}
	.card-box {
		padding: 10px;
		margin: 10px auto;
		background-color: #fff;
	}
	.join-task-popup {
		width: 80%;
	}
	.asign-logs {
		background-color: #fff;
	}
	.share-sheet {
		padding: 40rpx 30rpx;
		justify-content: space-around;
		.share-btn {
			cursor: pointer;
			border: none;
			padding: 0;
			height: auto;
		}
		.share-item {
			.share-icon {
				line-height: 31px;
				height: 31px;
				image {
					width: 62rpx;
					height: 62rpx;
					display: inherit;
				}
			}
			.tupian {
				image {
					width: 52rpx;
					height: 52rpx;
					display: inherit;
				}
			}
			.share-text {
				font-size: 24rpx;
				color: $main-grey-text;
			}
		}
	}
	.van-empty {
		background-color: #fff !important;
	}
	.van-empty__image {
		width: 100px;
		height: 100px;
	}
	.van-empty__description {
		padding: 0;
		font-size: 12px;
	}
}
</style>
