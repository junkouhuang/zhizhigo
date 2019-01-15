let clearInt;
Page({
  data: {
    areaIndex: 0,
    card:'',
    phone:'',
    verification:'',
    pwd:'',
    msg:'获取验证码',
    second:'120',
    disabled:false,
    int:'',
  },
  inputCard: function (e) {
    let that = this;
    that.setData({
      card: e.detail.value
    })
  },
  inputPhone: function (e) {
    let that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  inputVerification: function (e) {
    let that = this;
    that.setData({
      verification: e.detail.value
    })
  },
  inputPwd:function(e){
    let that=this;
    that.setData({
      pwd:e.detail.value
    })
  },
  sendVerificationCode: function () { 
    let that=this;
    if (that.data.phone==''){
      getApp().wxToast({
        title: '手机号码不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
    if (that.data.phone.length != 11) {
      getApp().wxToast({
        title: '手机号码长度不能小于11位！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(that.data.phone)) {
      getApp().wxToast({
        title: '手机号有误！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }else{
      clearInt=setInterval(
        function () {
          if (that.data.second > 0) {
            that.setData({
              second:that.data.second - 1,
              msg: that.data.second+ '秒后获取',
              int:'int',
              disabled:true,
            })
          }else{
            that.setData({
              second: 120,
              msg: '获取验证码',
              int: '',
              disabled: false,
            })
            clearInterval(clearInt)
          }
        }, 1000)
      wx.request({
        //获取openid接口  
        url: getApp().globalData.url + '/wallet/sendVerificationCode',
        method: 'post',
        data:{"tel":that.data.phone},
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'bearer' + getApp().globalData.access_token
        }
      })
    }
  },
  openWalletAccount:function(){
    let that = this;
    if (that.data.card == '') {
      getApp().wxToast({
        title: '身份证号不能为空', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    let regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regex.test(that.data.card)) {
      getApp().wxToast({
            title: '身份证号不正确', //标题，不写默认正在加载
            contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
          return false
    } 
   if (that.data.phone == '') {
     getApp().wxToast({
        title: '手机号不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
   if (that.data.phone.length != 11) {
     getApp().wxToast({
       title: '手机号码长度不正确！', //标题，不写默认正在加载
       contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
       duration: 1000, //延时关闭，默认2000
       tapClose: false //点击关闭，默认false
     });
     return false;
   }
   let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
   if (!myreg.test(that.data.phone)) {
     getApp().wxToast({
       title: '手机号有误！', //标题，不写默认正在加载
       contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
       duration: 1000, //延时关闭，默认2000
       tapClose: false //点击关闭，默认false
     });
     return false;
   }
   if (that.data.verification == '') {
     getApp().wxToast({
        title: '验证码不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.pwd == '') {
      getApp().wxToast({
        title: '密码不能为空！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
     if ( that.data.pwd.length<6){
       getApp().wxToast({
        title: '密码不能少于6位！', //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } else {
      wx.request({
        //获取openid接口  
        url: getApp().globalData.url + '/wallet/openWalletAccount',
        method: 'put',
        contentType: 'application/json;charset=UTF-8',
        data: { "idnum": that.data.card, "tel": that.data.phone, "code": that.data.verification, "password": that.data.pwd},
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          'Authorization': 'bearer' + getApp().globalData.access_token
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if(res.data.success){
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-zhengque', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false, //点击关闭，默认false
                show:function(){
                  setTimeout(function () {
                    wx.navigateBack();   //返回上一个页面
                  }, 1500)
                }
              });
            }else{
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
              that.setData({
                second: 120,
                msg: '获取验证码',
                int: '',
                disabled: false,
              })
              clearInterval(clearInt)
            }
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          }
        }
      })
    }
  }
})
