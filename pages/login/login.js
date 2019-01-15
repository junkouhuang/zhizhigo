

Page({
  data: {
    username: '', 
    password: '',
    imagecode: '',
    imgUrl: '',
    openid: '',
    conceal: 'block',
    ensconce: 'none',
    // mold: 'number',
    mold: 'password',
    obliterate: true,
    eliminate: true,
    security: true,
    userauto: true, //用户名是否拉起键盘
    passauto: false, //密码是否拉起键盘
    refresh:''
  },
  onload:function(){
   
  },
  onShow: function() {
    let that = this;
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
    that.getvcode();
  },

  // 获取用户名输入值
  userNameInput: function(e) {
    let that = this;
    that.data.username = e.detail.value;
    if (that.data.username != '') {
      that.setData({
        obliterate: false
      })
    } else {
      that.setData({
        obliterate: true
      })
    }
  },

  //获取密码输入值
  pwdInput: function(e) {
    let that = this;
    that.data.password = e.detail.value;
    if (that.data.password != '') {
      that.setData({
        eliminate: false
      })
    } else {
      that.setData({
        eliminate: true
      })
    }
  },

  //获取验证码输入值
  imagecodeInput: function(e) {
    let that = this;
    that.data.imagecode = e.detail.value;
    if (that.data.imagecode != '') {
      that.setData({
        security: false
      })
    } else {
      that.setData({
        security: true
      })
    }
  },

  //聚焦input
  set_Focus() {
    this.setData({
      isFocus: true
    })
  },

  //清除用户名
  clearusername: function() {
    let that = this;
    that.setData({
      username: '',
      obliterate: true,
    })
  },

  //清除密码
  clearpwd: function() {
    let that = this;
    that.setData({
      inputpwd: '',
      password: '',
      eliminate: true,
    })
  },

  // 清除验证码
  clearsecurity: function() {
    let that = this;
    that.setData({
      imagecode: '',
      security: true,
    })
  },

  //密码可视
  show: function() {
    let that = this;
    that.setData({
      conceal: 'none',
      ensconce: 'block',
      //mold: '',
      mold: '',
      inputpwd: that.data.password
    })
  },

  //密码不可视
  hide: function() {
    let that = this;
    that.setData({
      conceal: 'block',
      ensconce: 'none',
      //mold: 'number',
      mold: 'password',
      inputpwd: that.data.password
    })
  },

  //获取验证码
  //微信认证流程（我自己简称三次握手）：
  //1、用户同意授权，获取code
  //2、通过code换取用户openId等信息
  //3、通过用户的openId获取验证码
  getvcode: function() {
    let that = this;
    let openid = getApp().globalData.openid;
    if (openid == '') {
      var value = wx.getStorageSync('openid');
      if (value == '') {
        wx.login({ //授权页面同意授权
          success: function(res) { //每次请求都会重新返回 一个新登陆凭证code,code的有效时间为5分钟
            wx.request({ //登录凭证校验
              url: getApp().globalData.url + '/authentication/deviceid/' + res.code, //使用 code,appid,secret 换取 openid 和 session_key 等信息
              method: 'GET',
              success: function(res) {
                if (res.statusCode == 200) {
                  if (res.data.openid != null) {
                    getApp().globalData.openid = res.data.openid;
                    wx.setStorageSync('openid', res.data.openid);
                    wx.downloadFile({
                      url: getApp().globalData.url + '/code/image?width=200&height=30',
                      method: 'get',
                      header: {
                        'deviceId': res.data.openid
                      },
                      success: function(res) {
                        that.setData({
                          imgUrl: res.tempFilePath,
                          refresh:''
                        });
                      }, fail: () => {
                        that.setData({
                          refresh: 'iconfont icon-tupian'
                        })
                      }
                    })
                  } else {
                    getApp().wxToast({
                      title: 'errcode:' + res.data.errcode, //标题，不写默认正在加载
                      duration: 1000, //延时关闭，默认2000
                      tapClose: false //点击关闭，默认false
                    });
                  }
                } else {
                  getApp().wxToast({
                    title: res.data.error, //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                }
              },
              fail: function(res) {
                getApp().wxToast({
                  title: '连接服务器失败', //标题，不写默认正在加载
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                });
              }
            })
          },
          fail: function(res) {
            getApp().wxToast({
              title: '连接微信失败', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        });
      } else {
        getApp().globalData.openid = value;
        wx.downloadFile({
          url: getApp().globalData.url + '/code/image?width=200&height=30',
          method: 'get',
          header: {
            'deviceId': value
          },
          success: function(res) {
            that.setData({
              imgUrl: res.tempFilePath,
              refresh: ''
            });
          }, fail:() =>{
            that.setData({
              refresh:'iconfont icon-tupian'
            })
          }
        })
      }
    } else {
      wx.downloadFile({
        url: getApp().globalData.url + '/code/image?width=200&height=30',
        method: 'get',
        header: {
          'deviceId': openid
        },
        success: function(res) {
          that.setData({
            imgUrl: res.tempFilePath,
            refresh:''
          });
        }, fail: () => {
          that.setData({
            refresh: 'iconfont icon-tupian'
          })
        }
      })
    }
  },

  //选择微信号登录
  tapWeixinLogin: function(cal) {
    let that = this;
    wx.showLoading({
      title: '登录中...',
    })
    var value = getApp().globalData.openid;
    if (value == '') {
      value = wx.getStorageSync('openid');
      if (value == '') {
        wx.login({ //授权页面同意授权
          success: function(res) { //每次请求都会重新返回 一个新的登陆凭证code,code的有效时间为5分钟
            wx.request({ //登录凭证校验
              url: getApp().globalData.url + '/authentication/deviceid/' + res.code, //使用 code ,appid,secret换取 openid 和 session_key 等信息
              method: 'GET',
              success: function(res) {
                if (res.statusCode == 200) {
                  if (res.data.openid != null) {
                    getApp().globalData.openid = res.data.openid;
                    wx.setStorageSync('openid', res.data.openid);
                    that.wxlogin(res.data.openid);
                  } else {
                    getApp().wxToast({
                      title: 'errcode:' + res.data.errcode, //标题，不写默认正在加载
                      duration: 1000, //延时关闭，默认2000
                      tapClose: false, //点击关闭，默认false
                      show: function() {
                        wx.hideLoading();
                      }
                    });
                  }
                } else {
                  getApp().wxToast({
                    title: res.data.error, //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false, //点击关闭，默认false
                    show: function() {
                      wx.hideLoading();
                    }
                  });
                }
              },
              fail: function() { //当没有网络时候执行这一步
                wx.hideLoading();
                getApp().wxToast({
                  title: '请求服务器失败', //标题，不写默认正在加载
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                });
              }
            })
          },
          fail: function() { //当没有网络时候执行这一步
            wx.hideLoading();
            getApp().wxToast({
              title: '请求服务器失败', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        });
      } else {
        that.wxlogin(value);
      }
    } else {
      that.wxlogin(value);
    }
  },

  //微信登陆
  wxlogin: function(openid) {
    if (openid != '') {
      wx.request({
        url: getApp().globalData.url + '/authentication/openid',
        data: {
          openId: openid,
          providerId: 'weixin'
        }, //openid在缓存获取
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic emhpemhpMzYwX3NjOjE1YjYwYzc0LWVmMjEtNGRkNC05NGY3LWVmZmY1NmY2YzcxYQ==', //授权
        },
        success: function(res) {
          if (res.statusCode == 200) {
            getApp().globalData.access_token = res.data.access_token; //将登陆凭证保存起来，失效则跳转到登陆界面
            setTimeout(() => {
              wx.hideLoading();
            }, 100);
            //跳转主页
            wx.switchTab({
              url: '../index/index'
            })
          } else if (res.statusCode == 500) {
            setTimeout(() => {
              wx.hideLoading()
            }, 1000)
            setTimeout(() => {
              getApp().wxToast({
                title: res.data.content, //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }, 1000);
          } else {
            setTimeout(() => {
              wx.hideLoading()
            }, 1000)
            setTimeout(() => {
              getApp().wxToast({
                title: '登录失败!', //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }, 1000);
          }
        },
        fail: function() {
          wx.hideLoading();
          getApp().wxToast({
            title: '请求服务器失败', //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      });
    } else {
      getApp().wxToast({
        title: "获取openid失败", //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false, //点击关闭，默认false
        show: function() { //显示函数
          wx.hideLoading();
        }
      });
    }
  },

  //  用户名/密码/验证码登陆
  submit: function(e) {
    let that = this;
    console.log(e);
    that.data.username = e.detail.value.username;
    that.data.password = e.detail.value.password;
    that.dataimagecode = e.detail.value.imagecode;
    if (e.detail.value.username == '') {
      getApp().wxToast({
        title: '用户名不能为空', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
    } else {
      if (e.detail.value.password == '') {
        getApp().wxToast({
          title: '密码不能为空', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      } else {
        if (e.detail.value.imagecode == '') {
          getApp().wxToast({
            title: '验证码不能为空', //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        } else {
          // 用户名 密码 验证码具备
          wx.showLoading({
            title: '登录中...',
          })
          wx.request({
            url: getApp().globalData.url + '/authentication/form',
            data: {
              imageCode: that.data.imagecode,
              username: that.data.username,
              password: that.data.password
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'deviceId': getApp().globalData.openid, //验证码都出来了,直接从全局变量里取就行了
              'Authorization': 'Basic emhpemhpMzYwX3NjOjE1YjYwYzc0LWVmMjEtNGRkNC05NGY3LWVmZmY1NmY2YzcxYQ==', //授权
            },
            success: function(res) {
              //登陆成功后将登录名缓存
              wx.setStorage({
                key: 'username',
                data: that.data.username,
                success: function(res) {}
              });
              getApp().globalData.access_token = res.data.access_token; //将登陆凭证保存起来，失效则跳转到登陆界面
              if (res.statusCode == 200) {
                //跳转主页
                wx.switchTab({ //关闭所有页面，打开到应用内的某个页面
                  url: '../index/index'
                })
              } else if (res.statusCode == 500) {
                if (res.data.content == 'Bad credentials') {
                  wx.hideLoading()
                  getApp().wxToast({
                    title: '用户名或密码错误', //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                  //重新获取验证码图片
                  that.getvcode();
                } else if (res.data.content == '坏的凭证') {
                  wx.hideLoading();
                  getApp().wxToast({
                    title: '用户名或密码错误', //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                  //重新获取验证码图片
                  that.getvcode();
                } else if (res.data.content == 'IMAGE验证码不存在') {
                  wx.hideLoading()
                  getApp().wxToast({
                    title: '验证码不存在', //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                  //重新获取验证码图片
                  that.getvcode();
                } else if (res.data.content == 'IMAGE验证码不匹配') {
                  wx.hideLoading()
                  getApp().wxToast({
                    title: '验证码不匹配', //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                  //重新获取验证码图片
                  that.getvcode();
                } else {
                  wx.hideLoading();
                  getApp().wxToast({
                    title: res.data.content, //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                  //重新获取验证码图片
                  that.getvcode();
                }
              } else {
                wx.hideLoading();
                that.getvcode();
                getApp().wxToast({
                  title: res.data.content, //标题，不写默认正在加载
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                });
              }
            },
            fail: function() { //当没有网络时候执行这一步
              wx.hideLoading();
              getApp().wxToast({
                title: '请求服务器失败', //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          })
        }
      }
    }
  },
 


});