<template>
	<view class="task-bg">
		<van-uploader :file-list="fileList" @after-read="afterRead" deletable/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskId:'',
				fileList: []
			}
		},
		onLoad(options){
			this.taskId = options.taskId;
		},
		methods: {
			afterRead(event) {
				let that = this;
			    const { file } = event.detail;
				console.log(file);
			    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			    uni.uploadFile({
			      url: this.SERVER_URL + 'api/change/taskbg', // 仅为示例，非真实的接口地址
			      filePath: file.url,
			      name: 'file',
				  formData: {
					taskId: this.taskId
				  },
			      success(res) {
			        // 上传完成需要更新 fileList
					console.log(res)
			        that.fileList.push({ ...file, url: res.data });
					console.log(that.fileList)
			      },
			    });
			  },
		}
	}
</script>

<style>

</style>
