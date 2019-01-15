Page({
  data: {
    bankList: {},//银行卡列表
    payData: {},//支付参数
    cardPic: 'iconfont icon-yinhangqia',
    acctno:'',//银行卡号,
    zzpass:'',//值值宝支付密码
    moblie:'',//银行卡预留手机号码
    wallets_password_flag: false,//密码输入遮罩
    isFocus: false,//是否自动定位在密码的第一格
    sign:'',//是否货单表示
    vipOpenData:{},
    czData: {},
    vipcard:''
  },
  onLoad: function (options) {
    let that = this;
    that.data.sign = options.sign;
    that.data.payData = JSON.parse(options.payArray);
    that.data.vipOpenData = JSON.parse(options.vipOpenData);
    that.data.czData = JSON.parse(options.czData)
    that.data.codeData = JSON.parse(options.codeData)
   
    that.setData({
      _height: wx.getSystemInfoSync().windowWidth / 3
    })
  },
  onShow:function(){
    let that = this;
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
      success: function (res){
        if (res.statusCode == 200) {
         if(res.data.length>0){
           for (var i in res.data){
             if (res.data[i]["bankname"].indexOf("工商") != -1) {
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
             if (res.data[i]["bankname"].indexOf("浦发") != -1) {
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
           for (var i in res.data) {
             res.data[i]["star"] = res.data[i].acctno.substring(0, 3) + "**************" + res.data[i].acctno.substring(res.data[i].acctno.length - 4, res.data[i].acctno.length);
            
           }
           that.setData({
             bankList: res.data
           })
         }else{ //当前没有银行卡，则跳转到我的银行卡
           that.setData({
             bankList: []
           })
         }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        } else {
          getApp().wxToast({
            title: res.errmsg, //标题，不写默认正在加载
            contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  },
  //函数：进入支付-输入值值宝密码
  wyPayFun:function(e){
    let that = this;
    //获取银行卡号
    that.data.acctno = e.currentTarget.dataset.acctno;//银行卡号
    //获取手机号码
    that.data.moblie = e.currentTarget.dataset.moblie;//手机号
    //开启值值宝密码输入框
    that.setData({
      zzmcTotalFeezj: that.data.payData.amount,
      wallets_password_flag: true,
      isFocus: true,
      zzpass:'' //清空值值宝支付密码
    })
  },
  //函数：确定输入值值宝密码
  paywxapply:function(){
    let that=this;
    that.data.payData["acctno"] = that.data.acctno;
    that.data.vipOpenData["acctno"] = that.data.acctno;
    that.data.czData["acctno"] = that.data.acctno;
    that.data.codeData["acctno"] = that.data.acctno;
    that.data.payData["zzpass"] = that.data.zzpass;
    that.data.vipOpenData["zzpass"] = that.data.zzpass;
    that.data.czData["zzpass"] = that.data.zzpass;
    that.data.codeData["zzpass"] = that.data.zzpass;
    if (that.data.sign=="goods"){ //货单支付
      wx.request({
        url: getApp().globalData.url + '/qpay/payfhapply',
        method: 'post',
        data: that.data.payData,//acctno,zzpass,uniquePayCode,amount,orderidBuff
        header: {
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.data.success) {
            if (res.data.obj == "1999") {//输入验证码确认支付
              getApp().wxToast({
                title: "请输入短信验证码", //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 2000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.navigateTo({
                    url: '../payMessage/payMessage?orderid=' + res.data.msg + "&acctno=" + that.data.acctno + "&moblie=" + that.data.moblie + "&sign=" + that.data.sign+"&tip=3",
                  })
                }
              });
            } else if (res.data.obj == "0000") {
              getApp().wxToast({
                title: res.data.obj.errmsg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../order/order',
                  })
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
          else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
    if (that.data.sign == "order"){ //订单支付
      wx.request({
        url: getApp().globalData.url + '/qpay/paywxapply',
        method: 'post',
        data: that.data.payData,  //acctno,zzpass,uniquePayCode,amount,orderidBuff
        header: {
          'content-type': 'application/json',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.data.success) {
            if (res.data.obj == "1999") {//输入验证码确认支付
              getApp().wxToast({
                title: "请输入短信验证码", //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 2000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.navigateTo({
                    url: '../payMessage/payMessage?orderid=' + res.data.msg + "&acctno=" + that.data.acctno + "&moblie=" + that.data.moblie + "&sign=" + that.data.sign + "&tip=3",
                  })
                }
              });
            } else if (res.data.obj == "0000") {
              getApp().wxToast({
                title: res.data.obj.errmsg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../order/order',
                  })
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
          else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
    if(that.data.sign=='vip'){ //会员卡开卡
      wx.request({
        url: getApp().globalData.url + '/viphy/openViphyCardByQpay',
        method: 'post',
        data: that.data.vipOpenData, //acctno,zzpass+uniquePayCode,xm,xb,passport,lxdh,csyear,csriqi,province,city,vipcard,viptypeid,vippass,confirmpassword,firstmoney,vipjbid,
        header: {
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.data.success) {
            if (res.data.obj == "1999") {//输入验证码确认支付
              getApp().wxToast({
                title: "请输入短信验证码", //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 2000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.navigateTo({
                    url: '../payMessage/payMessage?orderid=' + res.data.msg + "&acctno=" + that.data.acctno + "&moblie=" + that.data.moblie + "&sign=" + that.data.sign + "&tip=4",
                  })
                }
              });
            } else if (res.data.obj == "0000") {
              getApp().wxToast({
                title: res.data.obj.errmsg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                 wx.navigateBack({
                   delta:2
                 })
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
          else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
    if (that.data.sign == "cz") { //会员卡充值支付
      wx.request({
        url: getApp().globalData.url + '/viphy/viphyRechargeByQpay/'+that.data.czData.vipcard,
        method: 'post',
        data: that.data.czData, //acctno,zzpass+amount,uniquePayCode,vipcard
        header: {
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.data.success) {
            if (res.data.obj == "1999") {//输入验证码确认支付
              getApp().wxToast({
                title: "请输入短信验证码", //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 2000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../payMessage/payMessage?orderid=' + res.data.msg + "&acctno=" + that.data.acctno + "&moblie=" + that.data.moblie + "&sign=" + that.data.sign + "&tip=3",
                  })
                }
              });
            } else if (res.data.obj == "0000") {
              getApp().wxToast({
                title: res.data.obj.errmsg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../order/order',
                  })
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
          else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
    if (that.data.sign == "code") { //生成支付码
      wx.request({
        url: getApp().globalData.url + '/viphy/createViphyPayCodeByQpay/',
        method: 'post',
        data: that.data.codeData,  //uniquePayCode,zzpass+acctno,amount
        header: {
          'content-type': 'application/json',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.data.success) {
            if (res.data.obj == "1999") {//输入验证码确认支付
              getApp().wxToast({
                title: "请输入短信验证码", //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 2000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../payMessage/payMessage?orderid=' + res.data.msg + "&acctno=" + that.data.acctno + "&moblie=" + that.data.moblie + "&sign=" + that.data.sign+"&tip=3",
                  })
                }
              });
            } else if (res.data.obj == "0000") {
              getApp().wxToast({
                title: res.data.obj.errmsg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show: function () {
                  wx.redirectTo({
                    url: '../order/order',
                  })
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
          else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
  },
  //函数：关闭密码输入框
  close_wallets_password() {//关闭钱包输入密码遮罩
    let that = this;
    this.setData({
      wallets_password_flag: false,
      wallets_password: '' //清空密码记录
    })
  },
  //函数：聚焦
  set_Focus() {//聚焦input
    this.setData({
      isFocus: true
    })
  },
  //函数：获取钱包密码
  set_wallets_password: function (e) {//获取钱包密码
    let that = this;
    this.setData({
      zzpass: e.detail.value,
    });
    if (that.data.zzpass.length == 6) {//密码长度6位时，自动验证钱包支付结果
      that.paywxapply();
    }
  },
  addFun:function(){
    wx.navigateTo({
      url: '../sign/sign?tip=2'  ///关闭当前页面，跳转到应用内的某个页面
    })
  }
})