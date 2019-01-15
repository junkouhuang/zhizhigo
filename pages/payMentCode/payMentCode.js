// pages/paymentCode/paymentCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyArray: ['3000','5000'],
    moneyBoolean: true,
    amount:'',
    id:""
  },

  /**
 * 显示充值金额
 */
  selMoney: function (e) {
    let that = this;
    this.setData({
      moneyBoolean: false,
      money: e.detail.value,
    })
    that.data.amount=that.data.moneyArray[e.detail.value]
  },
  /**
   * 下一步
   */
  createViphyPayCodeByWxPay:function(){
    let that = this;
    if (that.data.amount==""){
      getApp().wxToast({
        title: "请选择充值金额", //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
    }else{
      wx.navigateTo({
        url: '../pay/pay?sign=code' + "&orderamount=" + that.data.amount + "&amount=" + that.data.amount,
      })
    }
  }
})