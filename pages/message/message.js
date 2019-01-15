var timer;
Page({
  data:{
    mobile:'',//接收到的手机号
    time:'180', //倒计时总秒数
    message:'',//显示倒计时信息
    securityCode:'',
    jsonData:'',
    regionData:'',
    disabled:true,
    forbid:false,
    tip:0
  },
  onLoad: function (options){
    let that=this;
    that.setData({
      forbid: that.data.forbid,
      tip: options.tip,
      _width: wx.getSystemInfoSync().windowWidth/2,
      _height: wx.getSystemInfoSync().windowWidth/2,
      mobile: JSON.parse(options.jsonData).mobile.substring(0, 3) + "*********" + JSON.parse(options.jsonData).mobile.substring(JSON.parse(options.jsonData).mobile.length - 4, JSON.parse(options.jsonData).mobile.length)
    })
    timer=setInterval(that.setIntervalFun,1000);
    that.data.regionData = JSON.parse(options.jsonData);
    that.data.jsonData = JSON.parse(options.jsonData);
  },
  //函数：时间倒计时
  setIntervalFun:function(){
    let that=this;
    if(that.data.time>0){
      that.data.time=that.data.time-1; //倒计时开始
      that.setData({
       message:"重新获取("+that.data.time+")" ,
       disabled: true,
      })
    }else{
      that.data.time = 180;//倒计时停止
      clearInterval(timer);
      that.setData({
        disabled:false,
      })
    }
  },
  //函数：获取验证码
  securityCodeFun:function(e){
    let that=this;
    that.data.securityCode = e.detail.value;
  },
  //函数：重新获取验证码
  getCodeFun:function(){
    let that=this;
    wx.request({
      url: getApp().globalData.url + '/qpay/agreeSms',
      method: 'post',
      data: that.data.regionData,
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.data.success) {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false, //点击关闭，默认false
            show: function () {
              timer = setInterval(that.setIntervalFun, 1000);
            }
          });
          that.setData({ forbid: false })
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
  nextFun:function(){
    let that=this;
    that.setData({ forbid:true})
    if (that.data.securityCode==""){
      getApp().wxToast({
        title: '请输入验证码', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    that.data.jsonData["smscode"] = that.data.securityCode;
    //确定签约
    wx.request({
      url: getApp().globalData.url + '/qpay/agreeconfirm',
      method: 'post',
      data: that.data.jsonData,
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.data.success) {
          if (res.data.obj == "3058"){//重发验证码
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  that.data.time = 180;//倒计时停止
                  clearInterval(timer);
                  that.setData({
                    disabled: false,
                    forbid: false
                  })
                }
              });
          } else if (res.data.obj == "0000"){ //签约成功
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                if(that.data.tip==2){
                  wx.navigateBack({
                    delta: 2
                  })
                }else{
                  wx.navigateBack({
                    delta: 2
                  })
                }

              }
            });
          }else{
            that.setData({ forbid: false })
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        } else {
          that.setData({ forbid: false })
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