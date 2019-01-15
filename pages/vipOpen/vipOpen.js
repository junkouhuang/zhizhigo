// pages/vip.js
Page({
  data: {
    sexArray: ['男', '女'],
    sexBoolean:true,
    bornBoolean: true,
    proviceBoolean:true,
    region: ['广东省', '广州市'],
    moneyArray: ['3000','5000'],
    moneyBoolean:true,
    kkje:'',
    accttypeHideOrShow: true,//银行卡类型模板
    sex:'',
    born:'',
    provice:'',
    cardTypeArray:[], //卡类型
    cardTypeId: [], //卡类型-id传参
    zkjbArray:[], //折扣级别
    zkjbId: [], //折扣级别-id传参
    cardTypeBoolean:true,
    zkjbBoolean:true,
    cardType:'',//卡类型
    zkjb:''//折扣级别

  },
  onLoad: function (options) {
    let that=this;
    //获取卡类型
    that.getVipCardType();
    //获取折扣级别
    that.getVipCardJbs();
  },
  /**
   * 获取卡类型
   */
  getVipCardType:function(){
    let that = this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/viphy/getVipCardType',
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer' + getApp().globalData.access_token
      },
      success: function (res) {
        for(var i in res.data){
          that.data.cardTypeId.push(res.data[i].id);
          that.data.cardTypeArray.push(res.data[i].typename);
        }
        that.setData({
          cardTypeArray: that.data.cardTypeArray
        })
      }
    })
  },
  /**
   * 获取折扣级别
   */
  getVipCardJbs: function () {
    let that = this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/viphy/getVipCardJbs',
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer' + getApp().globalData.access_token
      },
      success: function (res) {
        for (var i in res.data) {
          that.data.zkjbId.push(res.data[i].id);
          that.data.zkjbArray.push(res.data[i].jb);
        }
        that.setData({
          zkjbArray: that.data.zkjbArray
        })
      }
    })
  },
  /**
   * 选择性别
   */
  selSex: function (e) {
    let that=this;
    that.setData({
      sexBoolean: false,
      index: e.detail.value
    })
    that.data.sex = that.data.sexArray[e.detail.value];
  },

  /**
   * 显示出生日期选择器
   */
  selBorn: function (e) {
    let that = this;
    that.setData({
      bornBoolean: false,
      born: e.detail.value
    })
    that.data.born=e.detail.value
  },

  /**
   * 显示省市区选择器
   */
  selProvice: function (e) {
    let that = this;
    this.setData({
      proviceBoolean: false,
      region: e.detail.value
    })
    that.data.provice = e.detail.value
  },

  /**
 * 显示卡类型
 */
  selCardType: function (e) {
    let that = this;
    this.setData({
      cardTypeBoolean: false,
      start: e.detail.value
    })
    that.data.cardType = that.data.cardTypeId[e.detail.value]
  },

  /**
 * 显示卡折扣级别
 */
  selZkjb: function (e) {
    let that = this;
    this.setData({
      zkjbBoolean: false,
      begin: e.detail.value
    })
    that.data.zkjb = that.data.zkjbId[e.detail.value]
  },
  /**
   * 显示充值金额
   */
  selMoney: function (e) {
    let that = this;
    this.setData({
      moneyBoolean: false,
      money: e.detail.value,
      kkje: that.data.moneyArray[e.detail.value]
    })
  },
  /**
   * 开卡
   */
  toOpenVipCard:function(e){
    let that = this;
    let acctReg = /^(\d{16}|\d{17}|\d{18}|\d{19})$/; //银行卡简答校验，有可能是16位也有可能是19位
    let isIDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则表达式
    let compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;  //手机正则表达式
    if (e.detail.value.userName == "") {//姓名非空校验
      getApp().wxToast({
        title: '请输入姓名', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.sex == "") {//姓名非空校验
      getApp().wxToast({
        title: '选择性别', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (e.detail.value.idno == "") {//二代身份证非空校验
      getApp().wxToast({
        title: '请填写第二代身份证', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (e.detail.value.mobile == "") {//手机号码非空校验
      getApp().wxToast({
        title: '请填写手机号码', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (!compare.test(e.detail.value.mobile)) {//手机号码正则校验
      getApp().wxToast({
        title: '手机号码格式有误', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.born == "") {//请选择生日
      getApp().wxToast({
        title: '请选择生日', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.provice == "") {//请选择省市区
      getApp().wxToast({
        title: '请选择省市区', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (e.detail.value.acctno == "") {//卡号非空校验
      getApp().wxToast({
        title: '请填写会员卡号', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
  
    if (e.detail.value.acctno.length != 6 ) {//卡号正则校验
      if (e.detail.value.acctno.length != 11){
        getApp().wxToast({
          title: '会员卡号必须是6或者11位数字', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
        return false;
    }
    }
    if (that.data.cardType == "") {//请选择卡类型
      getApp().wxToast({
        title: '请选择卡类型', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (e.detail.value.password == "") {//请输入密码
      getApp().wxToast({
        title: '请输入密码', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.kkje == "") {//请选择首次充值金额
      getApp().wxToast({
        title: '请选择首次充值金额', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    if (that.data.zkjb == "") {//请选择折扣级别
      getApp().wxToast({
        title: '请选择折扣级别', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    let vipOpenData = new Array();
    vipOpenData = {
        xm:e.detail.value.userName,//姓名
        xb:that.data.sex,//性别
        passport: e.detail.value.idno,//身份证号
        lxdh:e.detail.value.mobile,//手机号
        csyear: that.data.born.substring(0, 4),//生日-年
        csriqi: that.data.born.substring(5, 7) + '-' + that.data.born.substring(8, 10),//生日-月
        kaika:that.data.provice[0],//省
        city: that.data.provice[1],//市
        vipcard: e.detail.value.acctno,//卡号
        viptypeid: that.data.cardType,//卡类型 
        vippass: e.detail.value.password,//密码
        confirmpassword: e.detail.value.confirmpassword,//确认密码
        firstmoney: that.data.kkje,//首次充值金额
        vipjbid: that.data.zkjb,//折扣级别
      }
    wx.navigateTo({
     url: "../pay/pay?&vipOpenData=" + JSON.stringify(vipOpenData)+"&sign=vip",
   })
  }
})