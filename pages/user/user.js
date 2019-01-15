Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mdmc: '',
    mdcode: '',
    shrxm: '',
    shdz: '',
    lxdh: '',
    items1:[
      {
        icon: 'iconfont  icon-dingdan3',
        text: '订单',
        path: '/pages/order/order'
      },
      {
        icon: 'iconfont icon-fahuodan1',
        text: '货单',
        path: '/pages/goods/goods'
      },
      {
        icon: 'iconfont icon-dizhi',
        text: '收货地址',
        path: '/pages/address/address'
      },
      {
        icon: 'iconfont icon-guanyu',
        text: '关于我们',
        path: '/pages/about/about',
      },
    ],
    items2: [
      {
        icon: 'iconfont icon-qianbao',
        text: '值值宝',
        path: '/pages/wallet/wallet',
      },
     
      {
        icon: 'iconfont icon-yinhangqia1',
        text: '银行卡',
        path: '/pages/myCard/myCard',
      },
      {
        icon: 'iconfont icon-huiyuanqia-mianxing',
        text: '会员',
        path: '/pages/vipList/vipList',
      },
    ]
  },
  onLoad: function () {
    let that = this;
    if (getApp().globalData.userInfo) {
      this.setData({
        userInfo: getApp().globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回,所以此处加入 callback 以防止这种情况
      getApp().userInfoReadyCallback = res => { //userInfoReadyCallback 在user.js中定义，在app.js中使用
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else { //调用 getUserInfo 获取头像昵称，弹框
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          getApp().globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    let that = this;
    if (getApp().globalData.userInfo) {
      that.setData({
        userInfo: getApp().globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          getApp().globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/user/me',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        getApp().globalData.userId = res.data.id;
        if (res.statusCode == 200) {
          that.setData({
            mdmc: res.data.store.mdmc,
            mdcode: res.data.store.mdcode,
          });

        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }
    })
  },
  ///绑定openid
  bindopenid: function () {
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: getApp().globalData.url + '/user/bindwx',
          method: 'POST',
          data: {
            //openid: app.globalData.openid
            openid: res.data    ///openid在缓存获取
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'bearer  ' + getApp().globalData.access_token,
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.success) {
                getApp().wxToast({
                  title: res.data.msg, //标题，不写默认正在加载
                  contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                })
              } else {
                getApp().wxToast({
                  title: res.data.msg, //标题，不写默认正在加载
                  contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                })
              }
            } else if (res.statusCode == 401) {
              wx.redirectTo({
                url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
              })
            }
          }
        })
      }, fail: function () {
        getApp().wxToast({
          title: "获取openid失败", //标题，不写默认正在加载
          contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
          duration: 1000, //延时关闭，默认2000
          tapClose: false, //点击关闭，默认false
          show: function () { //显示函数                          
          },
          hide: function () { //关闭函数                          
          }
        });
      }
    });
  },
  ///跳转到我的地址
  address: function () {
    let that = this;
    wx.navigateTo({
      url: '../user/address/address'
    })
  },
  wallet: function () {
    wx.navigateTo({
      url: '../user/wallet/wallet'
    })
  },
  orders: function () {
    wx.navigateTo({
      url: '../user/order/order'
    })
  },
  //退出
  exit: function () {
    wx.showModal({
      title: '提示',
      content: '确定退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  about: function () {
    wx.navigateTo({
      url: '../user/about/about'
    })
  },
  getUserInfo: function (e) { ////调用 getUserInfo 获取头像昵称，弹框
    getApp().globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

