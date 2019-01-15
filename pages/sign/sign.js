const app = getApp();
let obj='';
Page({
  data:{
    accttype:'00',//参数：卡类型-默认是储蓄卡
    accttypeName:'请选择卡类型',
    ckbox:false,//同意《银行卡支付协议》
    accttypeHideOrShow:true,//银行卡类型模板
    deposit:'tab', //选项卡-储蓄卡
    credit:'',//选项卡-信用卡
    accttypeTarget:null,//银行卡选中样式
    validdate:null,//有效期
    cvv2:'',//cvv2
    dateTimeArray: null,
    dateTime: null,
    startYear: 2018,
    endYear: 2099,
    validdateBoolean:false,//有效期切换
    showValiddateAndCvv2:false,
    next:'next1',
    month:'',//月份
    year:'',//年份
    tip:0,
    accttypeList: [
      {
        icon: 'iconfont icon-zhongguogongshangyinhang',
        text: '中国工商银行',
      },
      {
        icon: 'iconfont icon-zhongguonongyeyinhang',
        text: '中国农业银行',
      },
      {
        icon: 'iconfont icon-zhongguoyinhangbank1193437easyiconnet',
        text: '中国银行',
      },
      {
        icon: 'iconfont icon-zhongguojiansheyinhang',
        text: '中国建设银行',
      },
      {
        icon: 'iconfont icon-jiaotongyinhang:before',
        text: '交通银行',
      },
      {
        icon: 'iconfont icon-zhaoshangyinhang',
        text: '招商银行',
      },
      {
        icon: 'iconfont icon-zhongxinyinhang',
        text: '中信银行',
      },
      {
        icon: 'iconfont icon-yinhang-zhongguoguangda',
        text: '光大银行',
      },
      {
        icon: 'iconfont icon-huaxiayinhang',
        text: '华夏银行',
      },
      {
        icon: 'iconfont icon-yinhang-zhongguominsheng',
        text: '民生银行',
      },
      {
        icon: 'iconfont icon-yinhang-fujianxingye',
        text: '兴业银行',
      },
      {
        icon: 'iconfont icon-guangfayinhang',
        text: '广发银行',
      },
      {
        icon: 'iconfont icon-yinhang-zhongguopingan',
        text: '平安银行',
      },
      {
        icon: 'iconfont icon-pufayinhang',
        text: '浦发银行',
      },
      {
        icon: 'iconfont icon-youzhengyinhang',
        text: '邮政储蓄',
      },
      {
        icon: 'iconfont icon-beijingyinhang',
        text: '北京银行',
      },
      {
        icon: 'iconfont icon-shanghaiyinhang',
        text: '上海银行',
      }]
  },
  onLoad:function(query){
    let that=this;
    that.data.tip=query.tip;
  },
  onShow:function(){
    let that = this;
    // 获取完整的年月日 时分秒，以及默认显示的数组
    obj = dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
  },
  //函数：打开银行卡类型模板
  accttypeFun: function(){
    let that = this;
    that.setData({
      accttypeHideOrShow: false
    })
  },
  //函数：选项卡切换-储蓄卡
  depositFun:function(){
    let that=this;
    that.setData({
      deposit: 'tab',
      credit: '',
      accttype:'00',
    })
    that.data.showValiddateAndCvv2 = false;
  },
  //函数：选项卡切换-信用卡
  creditFun: function () {
    let that = this;
    that.setData({
      deposit: '',
      credit: 'tab',
      accttype: '02'
    })
    that.data.showValiddateAndCvv2 = true;
  },
  //函数:银行卡选中样式
  accttypeClickFun:function(e){
    let that=this;
    that.data.accttypeName=e.currentTarget.dataset.text;
    that.setData({
      accttypeTarget:e.currentTarget.dataset.index
    })
  },
  //函数：银行卡类型-取消
  cancelFun:function(){
    let that=this;
    that.setData({
      accttypeHideOrShow:true
    })
  },
  //函数：银行卡类型-确定
  confirmFun: function () {
    let that = this;
    console.log(that.data.showValiddateAndCvv2);
    if (that.data.accttypeName != "请选择卡类型"){ //如果选中一家银行就显示
      that.setData({
        showValiddateAndCvv2: that.data.showValiddateAndCvv2
      })
    }else{
      getApp().wxToast({
        title: '请选择签约银行', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    that.setData({
      accttypeName: that.data.accttypeName,
      accttypeHideOrShow: true,
    })
  },
  //函数：同意银行卡支付协议
  agreeFun:function(e){
    let that=this;
    that.data.ckbox = e.detail.value[0] == 'false' ? true : false;
    if (that.data.ckbox){
      that.setData({
        ckbox: true
      })
    }else{
      that.setData({
        ckbox: false
      })
    }
  },
  //函数：下一步
  submit:function(e){
    let that=this;
    let isIDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则表达式
    let compare = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;  //手机正则表达式
    if (that.data.accttypeName =="请选择卡类型"){//卡类型校验
      getApp().wxToast({
        title: '请选择卡类型', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
    if (e.detail.value.acctno == "") {//卡号非空校验
      getApp().wxToast({
        title: '请填入储蓄卡/信用卡号', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
     if (e.detail.value.acctname==""){//户名校验
      getApp().wxToast({
        title: '请填写持卡人姓名', //标题，不写默认正在加载
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
     if (e.detail.value.mobile=="") {//手机号码非空校验
      getApp().wxToast({
        title: '请填写手机号码', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
     if (!compare.test(e.detail.value.mobile)){//手机号码正则校验
      getApp().wxToast({
        title: '手机号码格式有误', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    } 
     if (that.data.showValiddateAndCvv2){
       if (that.data.validdate == null) {//卡有效期校验
         getApp().wxToast({
           title: '请填写卡正面有效期', //标题，不写默认正在加载
           duration: 1000, //延时关闭，默认2000
           tapClose: false //点击关闭，默认false
         });
         return false;
       }
       if (e.detail.value.cvv2 == "") {//cvv2校验
         getApp().wxToast({
           title: '请填写信用卡安全码', //标题，不写默认正在加载
           duration: 1000, //延时关闭，默认2000
           tapClose: false //点击关闭，默认false
         });
         return false;
       }
    }
    if (!that.data.ckbox){
      getApp().wxToast({
        title: '请勾选同意协议', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
      return false;
    }
    that.setData({
      next:"next2"
    })
    let json=new Array();
    if (that.data.showValiddateAndCvv2){
      json={
        accttype: that.data.accttype,//银行卡类型 00储蓄卡02信用卡
        acctno: e.detail.value.acctno,//银行卡号
        acctname: e.detail.value.acctname,//户名
        idno: e.detail.value.idno,//证件号
        mobile: e.detail.value.mobile,//手机号
        validdate: that.data.validdate,//有效期
        cvv2: e.detail.value.cvv2//安全码
      }
    }else{
      json = {
        accttype: that.data.accttype,//银行卡类型 00储蓄卡02信用卡
        acctno: e.detail.value.acctno,//银行卡号
        acctname: e.detail.value.acctname,//户名
        idno: e.detail.value.idno,//证件号
        mobile: e.detail.value.mobile,//手机号
      }
    }
    that.setData({ disabled:false})
    //签约
    wx.request({
      url: getApp().globalData.url + '/qpay/agreeapply',
      method: 'post',
      data: json,
      header: {
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if(res.data.success){
          if (res.data.obj=="0000"){ //签约成功直接跳转我的银行卡界面
            getApp().wxToast({
              title: res.data.obj.errmsg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                  wx.navigateBack({
                    delta: 1
                  })
              }
            });
          } else if (res.data.obj == "1999") { //需获取短信验证码,进行下一步确认操作
            let jsonData = JSON.stringify(json);
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show:function(){
                if(that.data.tip>0){
                  wx.navigateTo({
                    url: '../message/message?jsonData=' + jsonData+"&tip="+that.data.tip,
                  })
                }else{
                  wx.navigateTo({
                    url: '../message/message?jsonData=' + jsonData,
                  })
                }

              }
            });
          } else if (res.data.obj == "3046") { //卡信息或手机号码错误
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          } else if (res.data.obj == "3004") { //卡号错误
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }else{
            getApp().wxToast({
              title: res.data.obj.errmsg, //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        }else{
          getApp().wxToast({
            title: res.data.msg, //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
        }
      }
    })
  },
  //函数：选择有效期
  changeDateTime(e) {
    let that=this;
    obj.dateTime[0]=e.detail.value[0];
    obj.dateTime[1] = e.detail.value[1];
    that.data.month = obj.dateTimeArray[1][e.detail.value[1]];
    that.data.year = obj.dateTimeArray[0][e.detail.value[0]].replace("20", "");
    that.data.validdate = that.data.month + that.data.year;
    that.setData({
      validdateBoolean: true,
      month: that.data.month,
      year: that.data.year,
    })
  }
})
//年月联动
function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}
function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}
function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;
  switch (month) {
    case '01':
    case '02':
    case '03':
    case '04':
    case '05':
    case '06':
    case '07':
    case '08':
    case '09':
    case '10':
    case '11':
    case '12':
  }
  return array;
}
function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1);
  return [year, mont];
}
function dateTimePicker(startYear, endYear, date) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], []];
  var start = startYear || 1978;
  var end = endYear || 2100;
  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();
  // 处理联动列表数据
  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });
  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
