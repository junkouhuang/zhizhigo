let chearTime;
Page({
  data: {
    orderList: [],
    page: 1,
    pageSize: 20,
    pages: '',
    pagination: false,  //“没有数据”的变量，默认true，隐藏  
    images1: {},
    batchlx: 0,
    selectAll: false,    // 全选状态，默认不全选
    currentTab: 1,
    showfoot: true,
    status: 0,
    total_amount: 0, //总金额
    noclick_prev: 'noclick_prev',
    noclick_next: '',
    scrollHeight: '',
    array: [],//存放页码
    total_micro_second: [],
    module: 1,
    index: 0,
    bj: true,
    cartToLoading: true,
    noNetWork: false, //没有网络的时候显示
    goNav:'',
    yixuan:0,
    isCanClick:true
  },

  onShow: function () {
    let that = this;
    that.getOrderList();   ///搜索访问网络
    that.setData({
      total_amount: that.data.total_amount,
      scrollHeight: wx.getSystemInfoSync().windowHeight - 46,
      topImgWidth: wx.getSystemInfoSync().windowWidth * 0.27,
      selectAll: false,
      total_amount: 0,
      bj: true
    });
  },

  onReady() {  //onshow之后之行为为
    let that = this;
    chearTime = setInterval(function () { that.timeRun() }, 1000);
  },

  timeRun: function () {
    let that = this;
    if (that.data.orderList.length>0){
      if (that.data.total_micro_second.length <= 0) {
        for (var i = 0; i < that.data.orderList.length; i++) {
          if (that.data.orderList[i].expiretime != null && that.data.orderList[i].expiretime != 0) {
            that.data.total_micro_second.push(that.data.orderList[i].expiretime - 1);
          } else {
            that.data.total_micro_second.splice(i, 1);
          }
        }
      } else {
        for (var i = 0; i < that.data.total_micro_second.length; i++) {
          if (that.data.total_micro_second[i] > 0) {

            that.data.total_micro_second[i] = that.data.total_micro_second[i] - 1;
          }
        }
      }
      for (var j = 0; j < that.data.total_micro_second.length; j++) {
        if (that.data.total_micro_second[j] != null && that.data.total_micro_second[j] != 0) {
          if (that.data.total_micro_second[j] > 0) {
            let hour = Math.floor(that.data.total_micro_second[j] / 3600);
            if (hour <= 0) {
              hour = 0;
            }
            let min = Math.floor(that.data.total_micro_second[j] / 60) % 60;
            if (min <= 0) {
              min = 0;
            }
            let sec = that.data.total_micro_second[j] % 60;
            if (sec <= 0) {
              sec = 0;
            }
            that.data.orderList[j].expiretime = hour + "时" + min + "分" + sec + "秒"

          } else {

          }
        }
      }
      that.setData({
        orderList: that.data.orderList,
      })

    }
  },

  ///图片等比例显示(小图)
  imageLoad1: function (e) {
    let that = this;
    let $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    let viewHeight = 110;    //计算显示高度
    let viewWidth = viewHeight * ratio;       //计算显示宽度
    let maxWidth = wx.getSystemInfoSync().windowWidth * 0.2;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    let image = this.data.images1;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight,
      maxwidth1: maxWidth
    }
    this.setData({
      images1: image
    })
  },

  getOrderList: function () {
    let that = this;
    ///获取订单信息
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/ordersController/showNewOrdersInfo',
      method: 'get',
      data: {
        page: that.data.page,
        pageSize: that.data.pageSize,
        module: that.data.module  //3已提交  9已撤单
      },
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.list == "" || res.data.list == null) { // 暂无数据
          let msg=''
            if (that.data.module==1){
              msg='暂无待支付订单';
            }
            if (that.data.module == 2) {
              msg = '暂无待发货订单';
            }
            if (that.data.module == 3) {
              msg = '暂无已发货订单';
            }
            if (that.data.module == 4) {
              msg = '暂无已撤单订单';
            }
            if (that.data.module == 6) {
              msg = '暂无支付中订单';
            }
            that.setData({
              orderList: [],
              noNetWork: false, //没有网络的时候显示
              pagination: false,
              msg:msg,
              orderPic:'iconfont  icon-dingdan1 ',
              bj: false,
              selectAll: false,
              yixuan: 0,
              total_amount: 0
            });
          } else {
           // that.data.orderList.length = 0;   ///加载页面，清空
            that.data.total_micro_second.length = 0;
            that.data.array.length = 0;
            for (var i = 1; i <= res.data.pages; i++) {
              that.data.array.push('第' + i + '页');
            }
            var date = new Date();//获取系统当前时间
            var Y = date.getFullYear();
            //月  
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            //日  
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            //时  
            var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            //分  
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            //秒  
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            //获得当前的总秒数
            let secodeTotal = Y * 31536000 + M * 2592000 + D * 86400 + h * 3600+m*60+s;
            for (let i in res.data.list){
              let yy = parseInt(res.data.list[i].createtime.substring(0, 4));
              let month = parseInt(res.data.list[i].createtime.substring(5, 7));
              let dat = parseInt(res.data.list[i].createtime.substring(8, 10));
              let hours = parseInt(res.data.list[i].createtime.substring(11, 13));
              let minutes = parseInt(res.data.list[i].createtime.substring(14, 16));
              let second = parseInt(res.data.list[i].createtime.substring(17, 19));
              let twenty=1728000;
              let secodeTotalForCreatetime = yy * 31536000 + month * 2592000 + dat * 86400 + hours * 3600 + minutes * 60 + second;
              console.log(secodeTotal - secodeTotalForCreatetime > twenty);
              if (secodeTotal - secodeTotalForCreatetime > twenty){
                res.data.list[i]["overtwenty"]="1"
              }else{
                res.data.list[i]["overtwenty"] = "0"
              }
            }
            console.log(res.data.list)

            that.setData({
              pages: res.data.pages,
              array: that.data.array,
              orderList: res.data.list,
              selectAll: false,
              noNetWork: false, //没有网络的时候显示
              bj: false
            });
           
            if (that.data.page == that.data.pages && that.data.page > 1) { //当是最后一页的时候
              that.setData({
                noclick_prev: '',
                noclick_next: 'noclick_next',
                pagination: true,
              });
            } else if (that.data.page == 1 && that.data.pages > 1) { //当是第一页的时候
              that.setData({
                noclick_prev: 'noclick_prev',
                noclick_next: '',
                pagination: true,
              });
            } else if (that.data.page == 1 && that.data.pages == 1) { //当仅有一页的时候
              that.setData({
                noclick_prev: 'noclick_prev',
                noclick_next: 'noclick_next',
                pagination: false
              });
            } else {
              that.setData({
                noclick_prev: '',
                noclick_next: '',
                pagination: true
              });
            }
          that.total_amount();
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../../login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      },
      fail: function () {
          that.setData({
            bj: false,
            noNetWork: true
          })
        getApp().wxToast({
          title: '网络不佳，请稍后再试', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  refresh: function () {
    let that = this;
    that.setData({
      bj: true
    })
    that.getOrderList();
  },

  zzckorder(e) {   //点击勾选图标
    let that = this;
    let flag = true;
    let mun=0;
    const index = e.currentTarget.dataset.index;    // 获取传进来的index
    let allOrders = that.data.orderList;                    // 获取购物车列表
    // 获取当前商品的选中状态
    allOrders[index].selected = !allOrders[index].selected;              // 改变状态
    that.setData({
      orderList: allOrders
    });
    that.total_amount();
    for (var i in that.data.orderList) {  ///存在子选框有没选中状态，全选按钮不为选中状态
      if (!that.data.orderList[i].selected) {
        flag = false;
        that.setData({
          selectAll: false
        });
        return false;
      }
    }

    if (flag) {
      that.setData({
        selectAll: true,

      });
    }
  },

  // 全选
  selectAll: function () {
    let that = this;
    if (that.data.selectAll) { //反选
      for (var i in that.data.orderList) {
        that.data.orderList[i].selected = false
      }
      that.setData({
        selectAll: false,
        orderList: that.data.orderList,
      });
      that.total_amount();
    } else {  //全选
      for (var i in that.data.orderList) {
        that.data.orderList[i].selected = true
      }
      that.setData({
        selectAll: true,
        orderList: that.data.orderList,
      });
      that.total_amount();
    }
  },

  //计算总金额
  total_amount: function () {
    let that = this;
    let mun=0;
    let zzTotolPrice = 0;
    for (var i in that.data.orderList) {
      if (that.data.orderList[i].selected) {
        zzTotolPrice = zzTotolPrice + that.data.orderList[i].orderamount;
        mun = mun + 1;
      }
    }
    that.setData({
      total_amount: zzTotolPrice,
      yixuan: mun
    });
  },

  //点击tab切换 
  swichNav: function (e) {
    let that = this;
    that.setData({
      currentTab: e.target.dataset.current,
      batchlx: e.target.dataset.current,
      status: e.target.dataset.current,
      total_amount: 0, //总金额
      selectAll: false,
      page: 1,
      noclick_prev: '',
      noclick_next: '',
      bj: true
    })
    that.setData({
      module: that.data.currentTab
    })
    if (that.data.orderList != null) {
      that.data.orderList.length = 0;   
    } else {
      that.data.orderList = [];
    }
    that.getOrderList();   
    clearInterval(chearTime);
    chearTime = setInterval(function () { that.timeRun() }, 1000);
  },

  //支付
  payment: function () {
    let that = this;
    let orderId = new Array();
    let orderTable = new Array();
    for (var i in that.data.orderList) {
      if (that.data.orderList[i].selected) {
        orderId.push(that.data.orderList[i].id);
        orderTable.push({ "ordercode": that.data.orderList[i].ordercode, "orderamount": that.data.orderList[i].orderamount, "createtime": that.data.orderList[i].createtime });
      }
    }
    wx.setStorage({
      key: 'orderTable',
      data: orderTable,
    })
    if (that.data.isCanClick) {
      that.setData({
        cartToLoading: false,
        isCanClick: false
      });
      setTimeout(function () {
        that.setData({
          cartToLoading: true,
          isCanClick: true
        });
      }, 1000)
      if (that.data.total_amount > 0) {
       wx.navigateTo({
         url: '/pages/pay/pay?zzmcTotalFeezj=' + that.data.total_amount + '&orderId=' + orderId +'&sign=order'
        })
       /** getApp().wxToast({
          title: "维护中，不能支付....", //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });**/
        
      } else {
        getApp().wxToast({
          title: "付款金额不能小于0", //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    }
  },

  //上一页
  prev: function () {
    let that = this;
    if (that.data.page > 1) {
      //清空页面
      that.setData({
        bj: true,
        orderList: [],
        pagination: false,
        orderPic: '',
        page: that.data.page - 1,
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
        index: that.data.page - 2,
        
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.getOrderList();
    } else {
      if (that.data.pages==1){
        that.setData({
          page: 1,
          noclick_prev: 'noclick_prev',
          noclick_next: 'noclick_next',
        });
      }else{
        that.setData({
          page: 1,
          noclick_prev: 'noclick_prev',
          noclick_next: '',
        });
      }
     
    }
   
  },

  //下一页
  next: function () {
    let that = this;
    if (that.data.page < that.data.pages) {
      //清空页面
      that.setData({
        bj: true,
        orderList:[],
        pagination: false,
        orderPic:'',
        page: that.data.page + 1,
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
        index: that.data.page,
        
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.getOrderList();
    } else {
      that.setData({
        page: that.data.pages,
        noclick_prev: '',
        noclick_next: 'noclick_next',
      });
    }
  },

  //选择页码
  listenerPickerSelected: function (e) {
    let that = this;
    //改变index值，通过setData()方法重绘界面
    let page = parseInt(e.detail.value)+1;
    //清空页面
      that.setData({
        orderList:[],
        pagination: false,
        orderPic: '',
      })
      that.setData({
        page: page,
        index: page,
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
        bj:true
      });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
      that.getOrderList();
  },

  //撤销订单信息(待支付撤销订单)
  repealOrder: function (e) {
    let that = this;
    let flag = false;
    let orderList = new Array();
    orderList.push(e.currentTarget.dataset.id);
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/ordersController/revokeOrdersByorderidList',
      method: 'post',
      "Content-Type": "application/json;charset=UTF-8",
      data: orderList,
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.success) {
            that.getOrderList();
            getApp().wxToast({
              title: "撤单成功", //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }else{
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
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
    })
  },

  //撤销订单信息(待发货撤销订单)
  delOrder: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定撤单？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            //获取openid接口  
            url: getApp().globalData.url + '/ordersController/revokePayOrderByOrderid/' + e.currentTarget.dataset.id,
            method: 'post',
            "Content-Type": "application/json;charset=UTF-8",
            // data: orderList,
            header: {
              "Content-Type": "application/json;charset=UTF-8",
              'Authorization': 'bearer  ' + getApp().globalData.access_token
            },
            success: function (res) {
              if (res.statusCode == 200) {
                if (res.data.success) {
                  that.getOrderList();
                  getApp().wxToast({
                    title: "撤单成功", //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false //点击关闭，默认false
                  });
                } else {
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
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
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
   
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    let that = this;
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.scrollTop > 40) {
      if (that.data.goNav =='com-widget-goNav'){

      }else{
        that.setData({
          goNav: 'com-widget-goNav'
        });
      }
     
    } else {
      if (that.data.goNav == 'com-widget-goNav'){
        that.setData({
          goNav: ''
        });
      }
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    that.setData({
      page: 1,
      pageSize: 20,
      index: 0,
      wxversion: that.data.wxversion,
      noclick_prev: '',
      noclick_next: '',
      total_amount: 0,
      selectAll: false,
      orderList:[],
      bj:true
    });
    that.data.total_micro_second.length = 0
    that.getOrderList()
    wx.stopPullDownRefresh() //停止下拉刷新    
    wx.hideNavigationBarLoading() //完成停止加载
  }
})
