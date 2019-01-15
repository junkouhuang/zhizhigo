Page({
  data: {
    payment_mode: 1,//默认支付方式 微信支付
    wallets_password_flag: false,//密码输入遮罩
    zzmcTotalFeezj: '',//订单金额
    orderId: '', //订单id
    sign: '',
    orderTable: {},
    payBtnLoading: true,
    isCanClick: true,
    uniquePayCode: '', //支付码，随机生成
    param: '',
    ext1: '',
    ext2: '',
    signMsg: '',
    formatDate: '',
    isFocus: false,
    vipOpenData:{},
    czData: {}, //会员卡充值
    codeData:{}
  },

  onLoad: function (e) {
    let that=this;
    that.data.sign = e.sign;
    that.setData({
      sign:e.sign
    })
    //订单或货单参数接收
    if (e.sign == 'order' || e.sign == 'goods') {
      that.data.orderId = e.orderId;
      wx.getStorage({
        key: 'orderTable',
        success: function (res) {
          that.setData({
            zzmcTotalFeezj: e.zzmcTotalFeezj,
            orderTable: res.data
          })
        },
      })
    } 
    //开通会员卡参数接收
    if (e.sign == 'vip') {
      that.data.vipOpenData = JSON.parse(e.vipOpenData)
      that.setData({
        zzmcTotalFeezj: that.data.vipOpenData.firstmoney,
      })
    }
    //会员卡充值参数接收
    if (e.sign=='cz') {
      that.data.czData=JSON.parse(e.czData);
      that.setData({
        zzmcTotalFeezj: that.data.czData.orderamount,
      })
    }
    //支付码参数接收
    if (e.sign == 'code') {
      that.data.codeData["orderamount"] = e.orderamount;
      that.data.codeData["amount"] = e.orderamount;
      that.setData({
        zzmcTotalFeezj: e.orderamount,
      })
    }
  },

  //函数：获取唯一支付码
  onShow: function (e) { 
    let that = this;
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

  //函数：确定
  nextFun: function () {  
    let that = this;
    if (that.data.payment_mode == 1) { //微信支付
      that.weChatPay();
    } 
    if (that.data.payment_mode == 2) { //值值宝支付
      that.setData({
        zzmcTotalFeezj: that.data.zzmcTotalFeezj,
        wallets_password_flag: true,
        isFocus: true
      })
    } 
    if (that.data.payment_mode == 3) { //快捷支付 
      that.data.vipOpenData["uniquePayCode"] = that.data.uniquePayCode;  
      that.data.czData["uniquePayCode"] = that.data.uniquePayCode;  
      that.data.codeData["uniquePayCode"] = that.data.uniquePayCode;  
      that.wyFun();
    }
  },

  //函数：微信支付(分订单支付和货单支付两个接口)
  weChatPay: function () {
    let that = this;
    //类型参数
    let payment_mode = that.data.payment_mode
    //获取openid
    var value = getApp().globalData.openid;
    if (value == '') {
      value = wx.getStorageSync('openid');
    }
    if (payment_mode == 1) {
      if (that.data.isCanClick) {
        that.setData({
          payBtnLoading: false,
          isCanClick: false
        });
        setTimeout(function () {
          that.setData({
            payBtnLoading: true,
            isCanClick: true
          });
        }, 1000)
        //订单微信支付
        if (that.data.sign == "order") {
          wx.request({ //统一下单
            url: getApp().globalData.url + '/payController/wxPay',
            data: {
              "openid": value,
              'orderidBuff': that.data.orderId,
              'orderamount': that.data.zzmcTotalFeezj,
              'uniquePayCode': that.data.uniquePayCode
            },
            header: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'bearer  ' + getApp().globalData.access_token,
            },
            method: 'POST',
            success: function (res) {  //生成支付参数
              if (res.statusCode == 200) {
                if (res.data.success) {
                
                  wx.requestPayment({  //发起支付
                    'timeStamp': res.data.obj.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    'nonceStr': res.data.obj.nonceStr,  //随机字符串，长度为32个字符以下。
                    'package': res.data.obj.packageName, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    'signType': res.data.obj.signType,  //签名算法，暂支持 MD5
                    'paySign': res.data.obj.paySign, //支付签名
                    'success': function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                } else {
                 
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              } else if (res.statusCode == 401) {
                wx.redirectTo({
                  url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                })
              }
            }
          });
        }
        //货单微信支付
        if (that.data.sign == "goods") {
          wx.request({ //统一下单
            url: getApp().globalData.url + '/fhorderController/wxPayFhorder',
            data: {
              "openid": value,
              'orderidBuff': that.data.orderId,
              'orderamount': that.data.zzmcTotalFeezj,
              'uniquePayCode': that.data.uniquePayCode
            },
            header: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'bearer  ' + getApp().globalData.access_token,
            },
            method: 'POST',
            success: function (res) {  //生成支付参数
              if (res.statusCode == 200) {
                if (res.data.success) {
                 
                  wx.requestPayment({  //发起支付
                    'timeStamp': res.data.obj.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    'nonceStr': res.data.obj.nonceStr,  //随机字符串，长度为32个字符以下。
                    'package': res.data.obj.packageName, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    'signType': res.data.obj.signType,  //签名算法，暂支持 MD5
                    'paySign': res.data.obj.paySign, //支付签名
                    'success': function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                } else {
                 
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              } else if (res.statusCode == 401) {
                wx.redirectTo({
                  url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                })
              }
            }
          });
        }
        //会员开卡充值
        if (that.data.sign == "vip") {
          that.data.vipOpenData["openid"]=value;          //会员开卡微信支付
          that.data.vipOpenData["uniquePayCode"] = that.data.uniquePayCode;  
          wx.request({ //统一下单
            url: getApp().globalData.url + '/viphy/openViphyCardByWxPay',
            data: that.data.vipOpenData,  //openid,uniquePayCode,xm,xb,passport,lxdh,csyear,csriqi,province,city,vipcard,viptypeid,vippass,confirmpassword,firstmoney,vipjbid,
            header: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'bearer  ' + getApp().globalData.access_token,
            },
            method: 'POST',
            success: function (res) {  //生成支付参数
              if (res.statusCode == 200) {
                if (res.data.success) {
                  wx.requestPayment({  //发起支付
                    'timeStamp': res.data.obj.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    'nonceStr': res.data.obj.nonceStr,  //随机字符串，长度为32个字符以下。
                    'package': res.data.obj.packageName, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    'signType': res.data.obj.signType,  //签名算法，暂支持 MD5
                    'paySign': res.data.obj.paySign, //支付签名
                    'success': function (res) {
                      wx.redirectTo({
                        url: '../vipList/vipList',
                      })
                    }
                  })
                } else {
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              } else if (res.statusCode == 401) {
                wx.redirectTo({
                  url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                })
              }
            }
          });
        }
        //会员卡充值
        if (that.data.sign == "cz") {
          that.data.czData["openid"] = value;          
          that.data.czData["uniquePayCode"] = that.data.uniquePayCode;
          wx.request({ //统一下单
            url: getApp().globalData.url + '/viphy/viphyReChargeByWxPay/' + that.data.czData.vipcard, 
            data: that.data.czData,   //openid,orderamount,uniquePayCode,vipcard
            header: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'bearer  ' + getApp().globalData.access_token,
            },
            method: 'POST',
            success: function (res) {  //生成支付参数
              if (res.statusCode == 200) {
                if (res.data.success) {
                  wx.requestPayment({  //发起支付
                    'timeStamp': res.data.obj.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    'nonceStr': res.data.obj.nonceStr,  //随机字符串，长度为32个字符以下。
                    'package': res.data.obj.packageName, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    'signType': res.data.obj.signType,  //签名算法，暂支持 MD5
                    'paySign': res.data.obj.paySign, //支付签名
                    'success': function (res) {
                      wx.redirectTo({
                        url: '../vipList/vipList',
                      })
                    }
                  })
                } else {
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              } else if (res.statusCode == 401) {
                wx.redirectTo({
                  url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                })
              }
            }
          });
        }
        //购买支付码
        if (that.data.sign == "code") {
          that.data.codeData["openid"] = value;
          that.data.codeData["uniquePayCode"] = that.data.uniquePayCode;
          wx.request({ //统一下单
            url: getApp().globalData.url + '/viphy/createViphyPayCodeByWxPay',
            data: that.data.codeData,  //openid,uniquePayCode,orderamount
            header: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'bearer  ' + getApp().globalData.access_token,
            },
            method: 'POST',
            success: function (res) {  //生成支付参数
              if (res.statusCode == 200) {
                if (res.data.success) {
                  wx.requestPayment({  //发起支付
                    'timeStamp': res.data.obj.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
                    'nonceStr': res.data.obj.nonceStr,  //随机字符串，长度为32个字符以下。
                    'package': res.data.obj.packageName, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
                    'signType': res.data.obj.signType,  //签名算法，暂支持 MD5
                    'paySign': res.data.obj.paySign, //支付签名
                    'success': function (res) {
                      wx.redirectTo({
                        url: '../vipList/vipList',
                      })
                    }
                  })
                } else {
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              } else if (res.statusCode == 401) {
                wx.redirectTo({
                  url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                })
              }
            }
          });
        }
      }
    }
  },

  //函数：分订单支付和货单支付两个接口
  set_wallets_password: function (e) {//获取钱包密码
    let that = this;
    this.setData({
      wallets_password: e.detail.value,
    });
    if (that.data.wallets_password.length == 6) {//密码长度6位时，自动验证钱包支付结果
      that.walletPayFun()
    }
  },

  //函数：分订单支付和货单支付两个接口
  walletPayFun: function () {
    let that = this;
    if (that.data.sign == "order") {
      wx.request({
        url: getApp().globalData.url + '/wallet/reduceWalletBalance',
        data: {
          "password": that.data.wallets_password,
          'orderId': that.data.orderId,
          'trasactionAmount': that.data.zzmcTotalFeezj,
        },
        header: {
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.success) {
              wx.showToast({
                title: res.data.msg,
                success: function () {
                  that.setData({
                    zzmcTotalFeezj: that.data.zzmcTotalFeezj,
                    wallets_password_flag: false
                  })
                }
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          } else if (res.statusCode == 500) {
            getApp().wxToast({
              title: res.data.message, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      });
    }
    if (that.data.sign == "goods") {
      wx.request({
        url: getApp().globalData.url + '/fhorderController/walletPayFhorder',
        data: {
          "password": that.data.wallets_password,
          'orderId': that.data.orderId,
          'trasactionAmount': that.data.zzmcTotalFeezj,
        },
        header: {
          'content-type': 'application/json;charset=UTF-8',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        method: 'POST',
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.success) {
              wx.showToast({
                title: res.data.msg,
                success: function () {
                  that.setData({
                    zzmcTotalFeezj: that.data.zzmcTotalFeezj,
                    wallets_password_flag: false
                  })
                }
              })
              wx.navigateBack({
                delta: 1
              })
            } else {
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          } else if (res.statusCode == 500) {
            getApp().wxToast({
              title: res.data.message, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      });
    }
  },

  //函数：网银支付
  wyFun: function () {
    let that = this;
    let payArray = new Array();
    payArray = {
      uniquePayCode: that.data.uniquePayCode,//银行卡类型 00储蓄卡02信用卡
      amount: that.data.zzmcTotalFeezj,//支付金额
      orderidBuff: that.data.orderId//支付单号
    }
    wx.navigateTo({
      url: '../syb/syb?payArray=' + JSON.stringify(payArray) + "&sign=" + that.data.sign + "&vipOpenData=" + JSON.stringify(that.data.vipOpenData) + "&czData=" + JSON.stringify(that.data.czData) + "&codeData=" + JSON.stringify(that.data.codeData)
    })
  },

  //函数：选择微信
  iconWx: function () {
    let that = this;
    that.setData({
      payment_mode: 1
    })
  },

  //函数：选择钱包
  iconWallet: function () {
    let that = this;
    that.setData({
      payment_mode: 2,

    })
  },

  //函数：选择快捷支付
  iconWy: function () {
    let that = this;
    that.setData({
      payment_mode: 3
    })

  },

  set_Focus() {//聚焦input
    this.setData({
      isFocus: true
    })
  },

  close_wallets_password() {//关闭钱包输入密码遮罩
    let that = this;
    this.setData({
      wallets_password_flag: false,
      wallets_password: ''
    })
  },

})





