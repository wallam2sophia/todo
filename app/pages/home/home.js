// pages/home/home.js
//获取应用实例
const app = getApp()
Page({

  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    taskLists: [{
        id: 1,
        title: '今天你跳了吗？',
        desc: "相约一起跳绳锻炼身体，需每日打卡，互相监督，有对应的奖惩规则!",
        bgImg: "",
        members: [],
        signType: "day",
        warnTime: "22:00",
        creator:"多喝水"
      },
      {
        id: 1,
        title: '今天你跳了吗？',
        desc: "相约一起跳绳锻炼身体，需每日打卡，互相监督，有对应的奖惩规则!",
        bgImg: "",
        members: [],
        signType: "day",
        warnTime: "22:00",
        creator: "多喝水"
      },
      {
        id: 1,
        title: '今天你跳了吗？',
        desc: "相约一起跳绳锻炼身体，需每日打卡，互相监督，有对应的奖惩规则!",
        bgImg: "",
        members: [],
        signType: "day",
        warnTime: "22:00",
        creator: "多喝水"
      },
      {
        id: 1,
        title: '今天你跳了吗？',
        desc: "相约一起跳绳锻炼身体，需每日打卡，互相监督，有对应的奖惩规则!",
        bgImg: "",
        members: [],
        signType: "day",
        warnTime: "22:00",
        creator: "多喝水"
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})