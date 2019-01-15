//app.js
var wxToast = require('toast/toast.js')

App({
  wxToast,
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    that: 'this',
    access_token: '', ///用于检测登陆时间是否过期，过期则返回登陆界面
    productid: 0,
    openid: '', //openid登陆时候获取，微信登陆时需要判断是否一致
    userId: '',
    baudied: '', //是否到货 传1
    stockExists: '', //是否售罄 传true
  //APPID: 'wxdccba5e486d678b1',//输入小程序appid  
    //SECRET: '388ecb618c70dbe732a4b6fd906bbc9b'//输入小程序app_secret  
  //url: "http://192.168.10.237:8060"  //本地
  //url: "http://192.168.10.189:8060"  //本地
  // url: "http://192.168.10.197:8060"  //本地
//url: "https://zztest.zhizhi360.com"  //本地
    // url: "http://120.79.78.245:8080"  //本地
   //  url: "http://szzz.vipgz1.idcfengye.com"  //本地
url: "https://zz.zhizhi360.com",
    // url: "http://localhost:8080"
  }
})