// pages/vip.js
Page({
  data: {
    vipcard: '', //会员卡号
    xm: '', //姓名
    money: '', //首次开卡金额
    showModal: false, //充值金额输入框
    moneyArray: [3000, 5000],
    amount:'',
    moneyBoolean:true,

  },
  /**
   * 获取卡号
   */
  getVipCard: function(e) {
    let that = this;
    that.data.vipcard = e.detail.value; //获取卡号
  },
  /**
   * 获取卡信息（查询）
   */
  getViphyInfoByVipCard: function() { 
    let that = this;
    if (that.data.vipcard == "") {
      getApp().wxToast({
        title: '请输入会员卡号', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } else {
      wx.request({
        url: getApp().globalData.url + '/viphy/getViphyInfoByVipCard/' + that.data.vipcard,
        method: 'get',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          'Authorization': 'bearer' + getApp().globalData.access_token
        },
        success: function(res) {
          if (res.data.success) {
            that.setData({
              xm: res.data.obj.xm,
              money: res.data.obj.money
            })
          }else{
            that.setData({
              xm: '',
              money: ''
            })
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }
      })
    }
  },
  /**
   * 获取充值金额
   */
  selMoney:function(e){
   let that=this;
   that.setData({
     moneyBoolean: false,
     index: e.detail.value
   })
    that.data.amount = that.data.moneyArray[e.detail.value];
  },
  /**
   * 充值
   */
  showDialogBtn:function(){
    let that = this;
    if(that.data.vipcard==""){
      getApp().wxToast({
        title: '会员卡号不能为空', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
    }else{
      if (that.data.amount==""){
        getApp().wxToast({
          title: '请选择充值金额', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }else{
        wx.request({
          url: getApp().globalData.url + '/viphy/getViphyInfoByVipCard/' + that.data.vipcard,
          method: 'get',
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            'Authorization': 'bearer' + getApp().globalData.access_token
          },
          success: function (res) {
            if (res.data.success) {
              that.setData({
                xm: res.data.obj.xm,
                money: res.data.obj.money
              })
              let czData = new Array();
              czData = {
                amount: that.data.amount, //充值金额（快捷支付）
                orderamount: that.data.amount, //充值金额（微信）
                vipcard: that.data.vipcard //会员卡号
              }
              wx.navigateTo({
                url: '../pay/pay?czData=' + JSON.stringify(czData) + "&sign=cz",
              })
            } else {
              that.setData({
                xm: '',
                money: ''
              })
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          }
        })
         
       
      }
    }
  }
})