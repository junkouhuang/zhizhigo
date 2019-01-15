Page({
  data: {
    bankList: [],
    cardPic:'iconfont icon-yinhangqia',
    tip:""
  },
  onLoad:function(query){
    let that=this;
    that.data.tip=query.tip;
  },
  onShow: function () {
    let that = this;
    console.log(wx.getSystemInfoSync().windowWidth);
    that.setData({
      _height:wx.getSystemInfoSync().windowWidth /3
    })
    that.getqpayagreesFun();
  },
  //函数：获取签约银行
  getqpayagreesFun: function () {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/qpay/getqpayagrees',
      method: 'get',
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          for (var i in res.data) {
            if (res.data[i]["bankname"].indexOf("工商")!=-1 ) {
              res.data[i]["class"] = "iconfont icon-zhongguogongshangyinhang";
              res.data[i]["color"] = "#C60009";
            }
            if (res.data[i]["bankname"].indexOf("农业") != -1) {
              res.data[i]["class"] = "iconfont icon-zhongguonongyeyinhang";
              res.data[i]["color"] = "#009882";
            }
            if (res.data[i]["bankname"].indexOf("中国银行") != -1) {
              res.data[i]["class"] = "iconfont icon-zhongguoyinhangbank1193437easyiconnet";
              res.data[i]["color"] = "#B81A21";
            }
            if (res.data[i]["bankname"].indexOf("建设") != -1) {
              res.data[i]["class"] = "iconfont icon-zhongguojiansheyinhang";
              res.data[i]["color"] = "rgba(12,52,132,1)";
            }
            if (res.data[i]["bankname"].indexOf("交通") != -1) {
              res.data[i]["class"] = "iconfont icon-jiaotongyinhang:before";
              res.data[i]["color"] = "#1C1F88";
            }
            if (res.data[i]["bankname"].indexOf("招商") != -1) {
              res.data[i]["class"] = "iconfont icon-zhaoshangyinhang";
              res.data[i]["color"] = "#C7152E";
            }
            if (res.data[i]["bankname"].indexOf("中信") != -1) {
              res.data[i]["class"] = "iconfont icon-zhongxinyinhang";
              res.data[i]["color"] = "#E50011";
            }
            if (res.data[i]["bankname"].indexOf("光大") != -1) {
              res.data[i]["class"] = "iconfont icon-yinhang-zhongguoguangda";
              res.data[i]["color"] = "#E6A400";
            }
            if (res.data[i]["bankname"].indexOf("华夏") != -1) {
              res.data[i]["class"] = "iconfont icon-huaxiayinhang";
              res.data[i]["color"] = "#FED000";
            }
            if (res.data[i]["bankname"].indexOf("民生") != -1) {
              res.data[i]["class"] = "iconfont icon-yinhang-zhongguominsheng";
              res.data[i]["color"] = "#5AA572";
            }
            if (res.data[i]["bankname"].indexOf("兴业") != -1) {
              res.data[i]["class"] = "iconfont icon-yinhang-fujianxingye";
              res.data[i]["color"] = "#8aa9ca";
            }
            if (res.data[i]["bankname"].indexOf("广发") != -1) {
              res.data[i]["class"] = "iconfont icon-guangfayinhang";
              res.data[i]["color"] = "#E6001F";
            }
            if (res.data[i]["bankname"].indexOf("平安") != -1) {
              res.data[i]["class"] = "iconfont icon-yinhang-zhongguopingan";
              res.data[i]["color"] = "#EA5503";
            }
            if (res.data[i]["bankname"].indexOf("浦") != -1) {
              res.data[i]["class"] = "iconfont icon-pufayinhang";
              res.data[i]["color"] = "#0C3768";
            }
            if (res.data[i]["bankname"].indexOf("邮政") != -1) {
              res.data[i]["class"] = "iconfont icon-youzhengyinhang";
              res.data[i]["color"] = "#007F3E";
            }
            if (res.data[i]["bankname"].indexOf("北京银行") != -1) {
              res.data[i]["class"] = "iconfont icon-beijingyinhang";
              res.data[i]["color"] = "#E82429";
            }
            if (res.data[i]["bankname"].indexOf("上海银行") != -1) {
              res.data[i]["class"] = "iconfont icon-shanghaiyinhang";
              res.data[i]["color"] = "#FED000";
            }
          }
          for(var i in res.data){
            res.data[i].acctno = res.data[i].acctno.substring(0, 3) + "**************" + res.data[i].acctno.substring(res.data[i].acctno.length - 4, res.data[i].acctno.length)
          }
          that.setData({
            bankList: res.data
          })
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        } else {
          getApp().wxToast({
            title: res.errmsg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  },
  addFun: function () {
    let that=this;
    if (that.data.tip==-1){
      wx.navigateTo({
        url: '../sign/sign?tip=-1',
      })
    }else{
      wx.navigateTo({
        url: '../sign/sign',
      })
    }

  },
  //函数：解绑银行卡
  unbindFun: function () {
    let that=this;
    if (that.data.bankList.length>0){
      wx.navigateTo({
        url: '../unbind/unbind',
      })
    }else {
      getApp().wxToast({
        title: '您暂无可以解绑的银行卡', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      }
  }
})