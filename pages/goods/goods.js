let chearTime;
Page({
  data: {
    orderList: [],
    page: 1,
    pageSize:10,
    pages: '',
    pagination: false,  //“没有数据”的变量，默认true，隐藏  
    batchlx: 0,
    selectAll: false,    // 全选状态，默认不全选
    currentTab: 1,
    showfoot: true,
    status: 0,
    total_amount: 0, //总金额
    hidefooter: false,
    noclick_prev: 'noclick_prev',
    noclick_next: '',
    scrollHeight: '',
    array: [],//存放页码
    total_micro_second: [],
    id: 1,
    index: 0,
    bj: true,
    cartToLoading: true,
    noNetWork: false, //没有网络的时候显示
    isCanClick:true,
    yixuan: 0,
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

  getOrderList: function () {
    let that = this;
    ///获取订单信息
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/fhorderController/getFhorderListPage/' + that.data.id,
      method: 'get',
      data: {
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.list == "" || res.data.list == null) { // 暂无数据
            that.setData({
              orderList: [],
              pages: res.data.pages,
              noNetWork: false, //没有网络的时候显示
              pagination: false,
              bj: false,
              yixuan: 0,
            });
          } else {
            if (res.data.length==0){
              that.setData({
                bj: false,
                selectAll:false,
                total_amount:0
              })
             }
            that.data.orderList.length = 0;   ///加载页面，清空
            that.data.total_micro_second.length = 0;
            that.data.array.length = 0;
            for (var i = 1; i <= res.data.pages; i++) {
              that.data.array.push('第' + i + '页');
            }
            that.setData({
              pages: res.data.pages,
              array: that.data.array,
              orderList: res.data.list,
              selectAll: false,
              noNetWork: false, //没有网络的时候显示
              bj: false,
            });
            that.total_amount();
          }
          if (that.data.page == that.data.pages && that.data.page > 1) { //当是最后一页的时候
            that.setData({
              noclick_prev: '',
              noclick_next: 'noclick_next'
            });
          } else if (that.data.page <= 1 && that.data.pages > 1) { //当是第一页的时候
            that.setData({
              noclick_prev: 'noclick_prev',
              noclick_next: ''
            });
          } else if (that.data.page == 1 && that.data.pages == 1) { //当仅有一页的时候
            that.setData({
              noclick_prev: 'noclick_prev',
              noclick_next: 'noclick_next'
            });
          } else {
            that.setData({
              noclick_prev: '',
              noclick_next: ''
            });
          }
          if (that.data.pages <= 1) {
            that.setData({
              pagination: false,
            });
          } else {
            that.setData({
              pagination: true,
            });
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
    const index = e.currentTarget.dataset.index;    // 获取传进来的index
    let allOrders = that.data.orderList;                    // 获取购物车列表
    const selected = allOrders[index].selected;
    // 获取当前商品的选中状态
    allOrders[index].selected = !selected;              // 改变状态
    that.setData({
      orderList: allOrders
    });
    that.total_amount();
    that.setData({
      hidefooter: false,
    });
    for (var i in that.data.orderList) {  ///存在子选框有没选中状态，全选按钮不为选中状态
      if (that.data.orderList[i].selected) {
        that.setData({
          hidefooter: false,
        });
      }
    }
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
        hidefooter: false,
        orderList: that.data.orderList
      });
      that.total_amount();
    } else {  //全选
      for (var i in that.data.orderList) {
        that.data.orderList[i].selected = true
      }
      that.setData({
        selectAll: true,
        hidefooter: false,
        orderList: that.data.orderList
      });
      that.total_amount();
    }
  },

  //计算总金额
  total_amount: function () {
    let that = this;
    let zzTotolPrice = 0;
    let yixuan=0;
    for (var i in that.data.orderList) {
      if (that.data.orderList[i].selected) {
        yixuan = yixuan+1;
        zzTotolPrice = zzTotolPrice + that.data.orderList[i].fhamount;
      }
    }
    that.setData({
      total_amount: zzTotolPrice,
      yixuan: yixuan
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
      hidefooter: false,
      page: 1,
      noclick_prev: '',
      noclick_next: '',
      bj: true
    })
    that.setData({
      id: that.data.currentTab
    })
    if (that.data.orderList != null) {
      that.data.orderList.length = 0;   
    } else {
      that.data.orderList = [];
    }
    that.getOrderList();   
    clearInterval(chearTime);
   
  },

  //支付
  payment: function () {
    let that = this;
    let orderId = new Array();
    let orderTable = new Array();
    for (var i in that.data.orderList) {
      if (that.data.orderList[i].selected) {
        orderId.push(that.data.orderList[i].id);
        orderTable.push({ "ordercode": that.data.orderList[i].ordercode, "orderamount": that.data.orderList[i].fhamount, "createtime": that.data.orderList[i].createtime });
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
         url: '/pages/pay/pay?zzmcTotalFeezj=' + that.data.total_amount + '&orderId=' + orderId + '&sign=goods' 
        })
       /** getApp().wxToast({
          title: "维护中，不能支付....", //标题，不写默认正在加载
           contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
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
      that.data.orderList.length = 0;
      that.setData({
        page: that.data.page - 1,
        noclick_prev: '',
        noclick_next: '',
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
        index: that.data.page - 2,
        bj: true
      });
      that.getOrderList();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
    } else {
      that.setData({
        page: 1,
        noclick_prev: 'noclick_prev',
        noclick_next: '',
      });
    }
    that.setData({
      page: that.data.pages,
      noclick_prev: '',
      noclick_next: 'noclick_next',
    });
  },

  //下一页
  next: function () {
    let that = this;
    if (that.data.page < that.data.pages) {
      that.data.orderList.length = 0
      that.setData({
        page: that.data.page + 1,
        noclick_prev: '',
        noclick_next: '',
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
        index: that.data.page,
        bj: true
      });
      that.getOrderList();
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
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
    let page = parseInt(e.detail.value);
    if (page < that.data.pages) {
      that.data.array.length = 0;
      that.data.orderList.length = 0
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.setData({
        page: page + 1,
        noclick_prev: '',
        noclick_next: '',
        index: page,
        selectAll: false,    // 全选状态，默认不全选
        total_amount: 0, //总金额
      });
      that.getOrderList();
    } else {
      that.setData({
        page: that.data.pages,
        noclick_prev: '',
        noclick_next: 'noclick_next',
      });
    }
  },

  //撤销订单信息
  repealOrder: function (e) {
    let that = this;
    let flag = false;
    let orderList = new Array();
    orderList.push(e.currentTarget.dataset.id);
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/ordersController/revokeOrdersByorderidList',
      method: 'post',
      data: orderList,
      header: {
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
              title: "撤单失败", //标题，不写默认正在加载
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

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    let that = this;
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.scrollTop > 40) {
      that.setData({
        goNav: 'com-widget-goNav'
      });
    } else {
      that.setData({
        goNav: ''
      });
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
      selectAll: false
    });
    that.data.total_micro_second.length = 0
    that.data.orderList.length = 0;   ///加载页面，清空
    that.getOrderList()
    wx.stopPullDownRefresh() //停止下拉刷新    
    wx.hideNavigationBarLoading() //完成停止加载
  },

  //查看拣货明细
  getFhDetail:function(e){
    let that=this;
    wx.showLoading({
      title: '正在导出中...',
    })
    wx.request({
      url: getApp().globalData.url + '/fhorderController/getFhdetailspExcelJhfilePath/' + e.currentTarget.dataset.id,
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if(res.data.success){
          wx.hideLoading();
          wx.downloadFile({
            url: res.data.obj,
            success: function (res) {
              var filePath = res.tempFilePath;
              wx.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功')
                }, fail: function () {
                  console.log('打开文档失败')
                }
              })
            }
          })
        }else{
          getApp().wxToast({
            title: "导出失败", //标题，不写默认正在加载
            duration: 1000, //延时关闭，默认2000
            tapClose: false //点击关闭，默认false
          });
          wx.hideLoading();
          console.log("获取文件路径失败");
        }
      },fail:function(){
        getApp().wxToast({
          title: "导出失败", //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
        wx.hideLoading();
        console.log("获取文件路径失败");
      }
    })
  }
})
