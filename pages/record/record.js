Page({
  data: {
    page: 1,
    pageSize: 9,
    pages:'',
    recordList: [],
    searchLoading: false,
    bj: true,
    noNetWork: false, //没有网络的时候显示
  },

  onShow: function () {
    let that = this;
    that.setData({
      bj: true,
      searchLoading: false,
    })
    that.data.recordList.length=0;
    that.getRecord();
  },

  getRecord:function(){
    let that=this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/wallet/getWalletTraRecord?userId=' + getApp().globalData.userId + "&page=" + that.data.page + "&pageSize=" + that.data.pageSize,
      method: 'post',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {

          if (res.data.list == "" || res.data.list == null) { // 暂无数据
            that.setData({
              bj: false,
              recordList: [],
              searchLoading: false,  /// 显示加载更多
              noNetWork: false
            });
          } else {
            for (var i in res.data.list){
              res.data.list[i]["sign"]="true";
            }
            if (that.data.page <= res.data.pages) {
              that.data.recordList.length <= 0 ? that.data.recordList = res.data.list : that.data.recordList = that.data.recordList.concat(res.data.list)
              that.setData({
                bj: false,
                pages: res.data.pages,
                recordList: that.data.recordList,
                noNetWork: false,
                searchLoading: false,
              });

            } else {
              that.setData({
                bj: false,
                noNetWork: false,
                searchLoading: false,
              });
            }
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '/login/login'  ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }, fail: () => {
        setTimeout(function () {
          that.setData({
            bj: false,
            searchLoading: false,
            noNetWork: true
          })
        }, 500)
        getApp().wxToast({
          title: '网络不佳，请稍后再试', //标题，不写默认正在加载
          contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    })
  },

  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    if(that.data.page<=that.data.pages){
      that.setData({
        page: that.data.page + 1,
        searchLoading:true,
        bj: true
      });
      that.getRecord();
    }
   
  },

  //刷新
  refresh: function () {
    let that = this;
    that.setData({
      bj: true
    })
    that.getRecord();
  },

  more:function(e){
    let that=this;
    let index = e.currentTarget.dataset.index;
    that.data.recordList[index].sign = !that.data.recordList[index].sign;
    that.setData({
      recordList: that.data.recordList
    })
  },

  shouqi: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.data.recordList[index].sign = !that.data.recordList[index].sign;
    that.setData({
      recordList: that.data.recordList
    })
  }

})
