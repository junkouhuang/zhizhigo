var timer;
Page({
  data: {
    acctno: '' //卡号
  },
  //函数：获取银行卡号
  getCardFun: function(e) {
    let that = this;
    that.data.acctno = e.detail.value;
  },
  //函数：下一步
  nextFun: function() {
    let that = this;
    if (that.data.acctno == "") {
      getApp().wxToast({
        title: '请填写银行卡号', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    //确定解绑
    wx.request({
      url: getApp().globalData.url + '/qpay/agreeunbind',
      method: 'post',
      data: {
        acctno: that.data.acctno
      },
      header: {
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function(res) {
        if (res.data.success) {
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false, //点击关闭，默认false
            show:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
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
  }
})