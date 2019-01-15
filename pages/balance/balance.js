Page({
  data: {
    trasactionAmount: '',//余额
    next:'',
    disabled:true,
  },
  inputBalance:function(e){
    let that=this;
    if (e.detail.value>0){
      that.setData({
        next:'next',
        disabled:false,
        trasactionAmount:e.detail.value
      })
    }else{
      that.setData({
        next: '',
        disabled: true,
        trasactionAmount: e.detail.value
      })
    }
  },
  // 钱包充值
  wallet_pay:function(_this) {
    let that= this;
    wx.request({
        //获取openid接口  
        url: getApp().globalData.url + '/wallet/wxPayAddWallet',
      
        method: 'post',
        data: { openid: getApp().globalData.openid,orderamount: that.data.trasactionAmount},
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          'Authorization': 'bearer' + getApp().globalData.access_token
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.success) {
              wx.requestPayment({
                'timeStamp': res.data.obj.timeStamp,
                'nonceStr': res.data.obj.nonceStr,
                'package': res.data.obj.packageName,
                'signType': res.data.obj.signType,
                'paySign': res.data.obj.paySign,
                'success': function (res) {
                  wx.navigateBack({
                    delta: 1
                  })
                },
                'fail': function (res) {

                }
              })
            } else {
              wx.showToast({
                title: res.data.msg
              })
            }
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          }
        }
      })
  }
})
