var timer;
Page({
  data: {
    time: '180', //倒计时总秒数
    message: '', //显示倒计时信息
    mobile: '', //接收到的手机号
    orderid: '', //订单号
    acctno: '', //银行卡号
    securityCode: '', //短信验证码
    disabled: true,
    sign:'',//是否货单标识
    forbid:false,
    tip:0
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      _width: wx.getSystemInfoSync().windowWidth / 2,
      _height: wx.getSystemInfoSync().windowWidth / 2,
      mobile: options.moblie.substring(0, 3) +  "*********" + options.moblie.substring(options.moblie.length - 4, options.moblie.length)
    })
    timer = setInterval(that.setIntervalFun, 1000);
    that.data.orderid = options.orderid; //订单号
    that.data.acctno = options.acctno;//银行卡号
    that.data.sign = options.sign //是否货单标识
    that.data.tip= options.tip

  },
  //函数：时间倒计时
  setIntervalFun: function() {
    let that = this;
    if (that.data.time > 0) {
      that.data.time = that.data.time - 1; //倒计时开始
      that.setData({
        message: "重新获取(" + that.data.time + ")",
        disabled: true,
      })
    } else {
      that.data.time = 180; //倒计时停止
      clearInterval(timer);
      that.setData({
        disabled: false,
      })
    }
  },
  //函数：获取验证码
  securityCodeFun: function(e) {
    let that = this;
    that.data.securityCode = e.detail.value;
  },
  //函数：重新获取验证码
  getCodeFun: function() {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/qpay/paysms ',
      method: 'post',
      data: {
        orderid: that.data.orderid,
        acctno: that.data.acctno
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function(res) {
        if (res.data.success) {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false, //点击关闭，默认false
            show: function() {
              timer = setInterval(that.setIntervalFun, 1000);
              that.setData({ forbid: false })
            }
          });
        } else {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  },
  //函数：下一步
  nextFun: function() {
    let that = this;
    if (that.data.securityCode == "") {
      getApp().wxToast({
        title: '请输入验证码', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    that.setData({ forbid: true })
    //货单
    if(that.data.sign=="goods"){
      that.payconfirm('/qpay/payfhconfirm',  '点击确定，跳转货单界面');
    }
    //确定订单支付
    if (that.data.sign == "order"){
      that.payconfirm('/qpay/paywxconfirm',  '点击确定，跳转订单界面'); 
    }
    //确定会员开卡
    if (that.data.sign == "vip") {
      that.payconfirm('/viphy/openViphyCardQpayConfirm', '点击确定，跳转会员界面');
    }
    //确定会员卡充值
    if (that.data.sign == "cz") {
      that.payconfirm('/viphy/viphyRechargeByQpayConfirm', '点击确定，跳转会员界面'); 
    }
    //生成支付码
    if (that.data.sign == "code") {
      that.payconfirm('/viphy/createViphyPayCodeByQpayConfirm',  '点击确定，跳转会员界面'); 
    }
  },
  payconfirm: function (port,content){
    let that=this;
    wx.request({
      url: getApp().globalData.url + port,
      method: 'post',
      data: {
        acctno: that.data.acctno,
        orderid: that.data.orderid,
        smscode: that.data.securityCode,
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.data.success) {
          if (res.data.obj == "0000") { //付款成功
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                if (that.data.tip == 3) {
                  wx.navigateBack({
                    delta: 3
                  })
                }
                if (that.data.tip == 4) {
                  wx.navigateBack({
                    delta: 4
                  })
                }
              }
            });
          } else if (res.data.obj == "2000" || res.data.obj == "2008") { //银行处理交易中
            wx.showModal({
              title: res.data.msg,
              content: content,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                 if(that.data.tip==3){
                   wx.navigateBack({
                     delta: 3
                   })
                 }
                  if (that.data.tip == 4) {
                    wx.navigateBack({
                      delta: 4
                    })
                  }
                }
              }
            })
          } else { //3045：卡上的余额不足,3058：重发验证码
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                that.data.time = 180; //倒计时停止
                clearInterval(timer);
                that.setData({
                  disabled: false,
                  forbid: false
                })
              }
            });
          }
        } else {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  }
})