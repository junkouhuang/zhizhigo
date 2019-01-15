Page({
  data: {
    walletSfkWidth: '',
    walletSfkHeight: '',
    lastbalance: '',
    items: [
      {
        icon: 'iconfont icon-bao',
        text: '值值宝交易流水',
        path: '/pages/record/record'
      },
      {
        icon: 'iconfont icon-zhangdan1',
        text: '支付流水',
        path: '/pages/account/account'
      },
      {
        icon: 'iconfont icon-qita',
        text: '其它',
        path: '/pages/other/other',
      }
    ]
  },
  onShow: function () {
    let that = this;
    that.setData({
      walletSfkWidth: wx.getSystemInfoSync().windowWidth / 3,
      walletSfkHeight: wx.getSystemInfoSync().windowWidth / 3,
    })
    that.judegeWalletisOpen();
  },
  judegeWalletisOpen: function () {
    let that = this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/wallet/judgeWalletisOpen',
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.success) {
            that.setData({
              lastbalance: res.data.obj
            })
           
          } else {
            wx.showModal({
              title: '是否开通值值宝？',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../openWallet/openWallet',
                  })
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }
    })
  },
  updateWalletBalance: function () {
    wx.navigateTo({
      url: '../wallet/balance/balance',
    })
  }
})
