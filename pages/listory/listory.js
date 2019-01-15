Page({
  data: {
    searchLoading:false,
    batchList: [], 
    page:1,
    pageSize:10, //每页显示50
    pages:'',
    searchLoading: true, //"上拉加载"的变量，默认true，隐藏  
    searchLoadingComplete: true,  //“没有数据”的变量，默认true，隐藏  
    images1:{},
    batchlx: 0,
    selectAllStatus: false,    // 全选状态，默认不全选
    currentTab:0,
    showfoot:true,
    status:'',
    zzmcTotalFeezj:0, //总金额
    bottomnav:false,
    hidefooter:true,
    noclick_prev: 'noclick_prev',
    noclick_next: '',
    batchid:'',
    bj: true,
    noNetWork:false //没有网络的时候显示
  },
  onLoad:function(query){
    let that=this;
    that.setData({
      batchid:query.batchid,
    })
  },
  onShow:function(){
    let that = this;
    that.data.batchList.length = 0;   ///加载页面，清空
    that.getBatchList();   ///搜索访问网络
    that.setData({
      zzmcTotalFeezj: that.data.zzmcTotalFeezj,
    });
  },
  getBatchList: function () {
    let that = this;
    ///获取订单信息
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/ordersController/getOrdersInfoByBatchid/' + that.data.batchid,
      method: 'get',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.obj == "" || res.data.obj == null) { // 暂无数据
            that.setData({
              batchList: [],
              searchLoading: false,  /// 显示加载更多
              noNetWork: false,
              bj: false
            });
          } else {
           
           // that.data.batchList.length <= 0 ? that.data.batchList = res.data.list : that.data.batchList = that.data.batchList.concat(res.data.list)
            that.setData({
              pages: res.data.pages,
              batchList: res.data.obj,
              noNetWork:false,
              bj: false
            });
          }
          if (that.data.page >= res.data.pages) {
            that.setData({
              //searchLoadingComplete: false,
              //searchLoading: false  /// 显示加载更多
            });
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
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
          contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },

  //刷新
  refresh: function () {
    let that = this;
    that.setData({
      bj: true
    })
    that.getBatchList();
  },

  zzckorder(e) {   //点击勾选图标
    let that = this;
    let flag = true;
    const index = e.currentTarget.dataset.index;    // 获取传进来的index
    let allOrders = that.data.batchList;                    // 获取购物车列表
    const selected = allOrders[index].selected;
    // 获取当前商品的选中状态
    allOrders[index].selected = !selected;              // 改变状态
    that.setData({
      batchList: allOrders
    });
    that.zzmcTotalFeezj();
    that.setData({
      hidefooter: true,
    });
    for (var i in that.data.batchList) {  ///存在子选框有没选中状态，全选按钮不为选中状态
      if (that.data.batchList[i].selected) {
        
        that.setData({
          hidefooter: false,
        });
       
      }
    }
    for (var i in that.data.batchList) {  ///存在子选框有没选中状态，全选按钮不为选中状态
      if (!that.data.batchList[i].selected) {
        flag = false;
        that.setData({
          selectAllStatus: false
        });
        return false;
      }
    }
    if (flag) {
      that.setData({
        selectAllStatus: true,
        
      });
    }
  },
  // 全选
  zzicoElectBuy:function(){
      let that = this;
      if (that.data.selectAllStatus){ //反选
        for (var i in that.data.batchList) {
          that.data.batchList[i].selected = false
        }
        that.setData({
          selectAllStatus: false,
          hidefooter: true,
          batchList: that.data.batchList
        });
        that.zzmcTotalFeezj();
      }else{  //全选
        for (var i in that.data.batchList) {
          that.data.batchList[i].selected = true
        }
        that.setData({
          selectAllStatus: true,
          hidefooter: false,
          batchList: that.data.batchList
        });
        that.zzmcTotalFeezj();
      }
  },
  //计算总金额
  zzmcTotalFeezj:function(){
    let that=this;
    let zzTotolPrice=0;
    for (var i in that.data.batchList) {
      if (that.data.batchList[i].selected){
          zzTotolPrice = zzTotolPrice + that.data.batchList[i].orderamount;
      }
    }
    that.setData({
      zzmcTotalFeezj: zzTotolPrice     
    });
  },
 ///上拉加载更多
  /**onReachBottom: function () {
    let that = this;
    if (that.data.searchLoading && that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把page+1      
      });
      //setTimeout(function () { that.batchList() }, 1000)
      that.getBatchList()
    }
  },**/
  swichNav: function (e) {   ///点击tab切换 
    let that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        batchlx: e.target.dataset.current,
        status: e.target.dataset.current,
        zzmcTotalFeezj: 0, //总金额
        selectAllStatus:false,
        hidefooter: true
      })
      if (e.target.dataset.current==9){
          that.setData({
            hidefooter:true
          })
      }else{
        that.setData({
          hidefooter: true
        })
      }
      if (that.data.batchList!=null){
        that.data.batchList.length = 0;   ///加载页面，清空
      }else{
        that.data.batchList=[];
      }
      that.getBatchList();   ///搜索访问网络
    }
  },
  ///支付
  settlement:function(){
    let that=this;
    let batchList=new Array();
    for (var i in that.data.batchList){
      if (that.data.batchList[i].selected){
        batchList.push(that.data.batchList[i].ordercode);
        }
    }
    if (that.data.zzmcTotalFeezj>0){
      wx.navigateTo({
        url: '../pay/pay?zzmcTotalFeezj=' + that.data.zzmcTotalFeezj + '&batchList=' + batchList
      })
    }else{
      getApp().wxToast({
        title: "付款金额不能小于0", //标题，不写默认正在加载
        contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
        duration: 1000, //延时关闭，默认2000
        tapClose: false, //点击关闭，默认false
        show: function () { //显示函数

        },
        hide: function () { //关闭函数

        }
      });
    }
    
  },
  //上一页
  prev: function () {
    let that = this;
    if (that.data.page > 1) {
      that.data.batchList.length = 0;
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      that.setData({
        page: that.data.page - 1,
        noclick_prev: '',
        noclick_next: '',
      });
      that.getBatchList();
    } else {
      that.setData({
        page: 1,
        noclick_prev: 'noclick_prev',
        noclick_next: '',
      });
    }
  },
  //下一页
  next: function () {
    let that = this;
    if (that.data.page < that.data.pages) {
      that.data.batchList.length = 0
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      that.setData({
        page: that.data.page + 1,
        noclick_prev: '',
        noclick_next: '',
      });
      that.getBatchList();
    } else {
      that.setData({
        page: that.data.pages,
        noclick_prev: '',
        noclick_next: 'noclick_next',
      });
    }
  }
})
