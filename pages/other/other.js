var timer;
Page({
  data: {
    payment_mode: 1,//默认支付方式 微信支付
    wallets_password_flag: false,//密码输入遮罩
    zzmcTotalFeezj: '',
    orderList: '',
    orderDetailData:{},
    cartToLoading: true,
    isCanClick: false,
    uniquePayCode:'',
    verification: '',
    newWalletPwd: '',
    wxappModal: true,
    oldSee: true,
    newSee: true,
    typp1: 'number',
    verificationCode: '',
    msg: '获取验证码',
    second: '120',
    disabled: false,
    int: '',
    clearInt: '',
    showBoolean:true
  },
  //事件处理函数
  onLoad: function (e) {
    let that = this;
    that.data.zzmcTotalFeezj = e.zzmcTotalFeezj;
    that.data.orderList = e.orderList;
    wx.getStorage({
      key: 'orderDetailData',
      success: function(res) {
      that.setData({
        zzmcTotalFeezj: e.zzmcTotalFeezj,
        orderDetailData: res.data
      })
      },
    })
  },
  onShow: function () {
    let that=this;
    wx.request({
      url: getApp().globalData.url + '/payController/getUniquePayCode',
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      method: 'get',
      success: function (res) {
        that.data.uniquePayCode = res.data.obj;
      }
    });
  },
  inputBalance: function () {  //确定
    let that = this;
      that.setData({
        zzmcTotalFeezj: that.data.zzmcTotalFeezj,
        wallets_password_flag: true
      })
  },
  set_wallets_password: function (e) {//获取钱包密码
    let that = this;
    this.setData({
      newWalletPwd: e.detail.value,
    });
    
  },
  set_Focus() {//聚焦input
    this.setData({
      isFocus: true
    })
  },
  close_wallets_password() {//关闭钱包输入密码遮罩
    let that=this;
    that.data.second = 120;
    that.setData({
      wallets_password_flag: false,
      newWalletPwd: '',
      showBoolean: true
    })
     clearInterval(timer)
  },
  //获取验证码值
  verification: function (e) {
    let that = this;
    that.data.verificationCode = e.detail.value;
  },
  //修改值值宝密码
  updateWalletPassword: function () {
    let that = this;
    if (that.data.verificationCode == '') {
      getApp().wxToast({
        title: '验证码不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.newWalletPwd == '') {
      getApp().wxToast({
        title: '新密码不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/wallet/updateWalletPassWord',
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      data: { "verificationCode": that.data.verificationCode, "passwd": that.data.newWalletPwd },
      success: function (res) {
        if (res.data.success) {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            contentClass: 'content iconfont icon-zhengque', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false, //点击关闭，默认false
            show: function () {
              setTimeout(() => { wx.navigateBack();},1000)
            }
          });
        } else {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  },
  //获取验证码
  sendUpdatePasswordVerification: function () {
    let that = this;
    that.setData({
      showBoolean: false
    })
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/wallet/sendUpdatePassVerificationCode',
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.data.success) {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            contentClass: 'content iconfont icon-zhengque', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false, //点击关闭，默认false
            show: function () {
              timer = setInterval(that.timeIntervalFun, 1000);
            }
          });
        }
      }
    })
  },
  timeIntervalFun:function(){
    let that = this;
    if (that.data.second > 0) {
      that.data.second= that.data.second - 1,
      that.setData({
        msg: that.data.second + '秒后获取',
      })
    }else{
      that.data.second=120;
      clearInterval(timer)
      that.setData({
        showBoolean: true
      })
    }
  }
})





