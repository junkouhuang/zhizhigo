Page({
    data: {
      inputOPwd:'',
      inputNPwd: '',
      inputAPwd: '',
      oPwd:true,
      nPwd:true,
      aPwd:true
    },
    ///清除旧密码
    oPwd:function(){
      let that = this;
      that.setData({
        inputOPwd:'',
        oPwd: true
      })
    },
    ///清除新密码
    nPwd: function () {
      let that = this;
      that.setData({
        inputNPwd: '',
        nPwd: true
      })
    },
    ///清除确定密码
    aPwd: function () {
      let that = this;
      that.setData({
        inputAPwd: '',
        aPwd: true
      })
    },
    oldpassword:function(e) {//获取当前密码
     let that=this;
     that.data.inputOPwd = e.detail.value;
     if (that.data.inputOPwd!=''){
        that.setData({
          oPwd: false
        })
     }else{
       that.setData({
         oPwd: true
       })
     }
    },
    newpassword: function(e){
      let that = this;
      that.data.inputNPwd = e.detail.value;
      if (that.data.inputNPwd != '') {
        that.setData({
          nPwd: false
        })
      } else {
        that.setData({
          nPwd: true
        })
      }
    },
    affirmpassword: function(e){
      let that = this;
      that.data.inputAPwd = e.detail.value;
      if (that.data.inputAPwd != '') {
        that.setData({
          aPwd: false
        })
      } else {
        that.setData({
          aPwd: true
        })
      }
    },
    savepwd:function(e){
      let that=this;
      if (that.data.inputNPwd != '') {
        if (that.data.inputNPwd.length==6){
          if (that.data.inputAPwd != '') {
            if (that.data.inputAPwd.length == 6) {
              if (that.data.inputNPwd == that.data.inputAPwd) {
                wx.request({
                  //获取openid接口  
                  url: getApp().globalData.url + '/user/updateUserPassWordByUsername',
                  method: 'post',
                  data: {
                    oldpasswd: '',
                    newpasswd: that.data.inputNPwd,
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Authorization': 'bearer  ' + getApp().globalData.access_token
                  },
                  success: function (res) {
                    if (res.statusCode == 200) {
                      getApp().wxToast({
                        title: "重置密码成功", //标题，不写默认正在加载
                        duration: 1000, //延时关闭，默认2000
                        tapClose: false, //点击关闭，默认false
                        show: function () { //显示函数
                          setTimeout(function () {
                            wx.navigateBack();   //返回上一个页面
                          }, 1500)
                        }
                      });
                    } else if (res.statusCode == 401) {
                      wx.redirectTo({
                        url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
                      })
                    }
                  }
                })
              } else {
                getApp().wxToast({
                  title: "两次密码不一致", //标题，不写默认正在加载
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false //点击关闭，默认false
                });
                return false;
              }

            } else {
              getApp().wxToast({
                title: "确认密码必须为6位数字", //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          } else {
            getApp().wxToast({
              title: "请输入确认密码", //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
            return false;
          }
        }else{
          getApp().wxToast({
            title: "新密码必须为6位数字", //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
          return false;
        }
      }else{
        getApp().wxToast({
          title: "请输入新密码", //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
        return false;
      }             
    }
})