Page({
    data: {
        shrxm: '',
        lxdh: '',
        shdz: '',
        bj:true

    },
    onLoad:function(){
      let that = this;
      that.setData({
        bj: true
      })
      wx.request({
        //获取openid接口  
        url: getApp().globalData.url + '/user/me',
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.statusCode == 200) {
            that.setData({
              bj: false,
              shrxm: res.data.store.shrxm,
              lxdh: res.data.store.lxdh,
              shdz: res.data.store.shdz,
            });
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          }
        }, fail: () => {
          setTimeout(function () {
            that.setData({
              bj: false,
            })
          }, 500)
          getApp().wxToast({
            title: '网络不佳，请稍后再试', //标题，不写默认正在加载
            contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      })
    },
    addNewAddress:function(){
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            userName: res.userName,
            phone: res.telNumber,
            area: res.provinceName + res.cityName + res.countyName,
            address: res.detailInfo
          })
        }
      })
    }
})