Page({
  data: {
    page: 1,
    pageSize: 60,
    begin: 0, //每屏开始行
    end: 20,//每屏结束行
    searchLoading: true, //"上拉加载"的变量，默认true，隐藏  
    productList: [],  // 用于判断productList数组是不是空数组，默认true，空的数组  
    scrollTop: 0,
    noclick_prev:'noclick_prev',
    noclick_next:'',
    lbname: '',//类别名称
    imgHeight: '',
    searchBox: 'searchBox',
    lbid: '',//类别id
    productNameorCode: '', //文本输入框
    minPrice: '',  //最小价格
    maxPrice: '', //最大价格
    listFix: true,//显示价格段区域
    array:[],  //存放页码
    index: 0,
    bj: true,
    mr:'mr', //默认
    choosePrice:'', //按照價格
    noNetWork: false, //没有网络的时候显示
    s_move: '',
    noData:'',
    mxcode:'', //参数-条码
    codeArray1:[], //存放条码的对象数组，用于加入到历史缓存
    codeArray2: []
  },

  onLoad: function (query) {//次级页面
    let that = this;
    that.data.productList.length = 0
    if (JSON.stringify(query) != "{}"){
      that.setData({
        lbid: query.lbid,
        lbname: query.lbname.replace(/\s+/g, ""),
      })
      that.fetchSearchList();
    }else{
      wx.getStorage({
        key: 'listoryData1',
        success: function (res) {
          if (res.data[0].lx == 'text') {
            that.setData({
              productNameorCode: res.data[0].name,
              lbname: res.data[0].name
            })
            that.data.mxcode = ''
          } else if (res.data[0].lx == 'barcode') {
            that.setData({
              productNameorCode: '',
              lbname: res.data[0].name
            })
            that.data.mxcode = res.data[0].name
          } else {
            that.setData({
              productNameorCode: '',
              lbname: ''
            })
            that.data.mxcode = ''
          }
          that.fetchSearchList();
        },
      })
    }
  },

  getStorageSyncData:function(){
    let that=this;
    var res = wx.getStorageSync('cplist');
    if (res) {
      if (res.length > that.data.begin) {
          if (res.length < 10) {
            that.setData({
              searchLoading: false,
            });
          }
          let cachedata = res.slice(that.data.begin, that.data.end);
          that.data.productList.length <= 0 ? that.data.productList = cachedata : that.data.productList = that.data.productList.concat(cachedata)
          that.setData({
            windowWidth: wx.getSystemInfoSync().windowWidth,
            productList: that.data.productList,
          });
          if (res.length <= that.data.end){
            that.setData({
              searchLoading: false,
            });
          }
        } else {
          that.setData({
            searchLoading: false,
          });
        }
    }
  },

  /**
   * 初始化页面
   */
  fetchSearchList: function () {
    let that = this;
      wx.request({
        url: getApp().globalData.url + '/product/showlb',
        method: 'GET',
        data: {
            page: that.data.page,
            pageSize: that.data.pageSize,
            lbid: that.data.lbid,
            productNameorCode: that.data.productNameorCode,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            mxcode: that.data.mxcode,
        },
        header: {
          'content-type': 'application/json',
          'Authorization': 'bearer  ' + getApp().globalData.access_token,
        },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.list.length == 0) { 
              that.setData({
                productList: [],
                noNetWork: false,
                bj: false,
                noData:'暂无数据'
              });
            } else {
              that.data.array.length = 0;
              for (var i = 1; i <= res.data.pages; i++) {
                that.data.array.push('第' + i + '页');
              }
              that.setData({
                bj: false,
                pages: res.data.pages,
                array: that.data.array,
                imgHeight:wx.getSystemInfoSync().windowWidth / 2
              });
              //数据缓存起来
              wx.setStorageSync('cplist', res.data.list);
              var res = wx.getStorageSync('cplist');
              if (res.length > that.data.begin) {
                if (res.length < 10) {
                  that.setData({
                    searchLoading: false,
                  });
                }
                let cachedata = res.slice(that.data.begin, that.data.end);
                that.data.productList.length <= 0 ? that.data.productList = cachedata : that.data.productList = that.data.productList.concat(cachedata)
                that.setData({
                  windowWidth: wx.getSystemInfoSync().windowWidth,
                  productList: that.data.productList,
                  noNetWork: false,
                  noData:''
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
                    pagination: false,
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
              } else {
                that.setData({
                  searchLoading: false,
                });
                //清除缓存
                wx.removeStorageSync('cplist')
                wx.clearStorageSync()
              }
            }
          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          }
        },fail:function(){
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
        }
      })
  },

  // 置顶
  goTop: function (e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
  },

  onPageScroll: function (e) { // 获取滚动条当前位置
    let that = this;
    if (e.scrollTop > 1000) {
      that.setData({
        s_move: 'move_up' //置顶
      });
    } else {
      if (that.data.s_move == 'move_up') {
        that.setData({
          s_move: 'move_down', //置底
        });
      }
    }
  },

  //上拉加载更多
  onReachBottom: function () {
    let that = this;
    if (that.data.searchLoading) {
      that.setData({
        begin: that.data.begin + 20,  //每次触发上拉事件，把page+1   
        end: that.data.end + 20,  //每次触发上拉事件，把page+1   
        searchLoading:true,
     });
      that.getStorageSyncData()
     }
  },

  //重置
  reset: function () {
    let that = this;
    that.setData({
      choosePrice: 'choosePrice',
      listFix: false,
      minPrice: '',
      maxPrice: '',
    })
  },

  //上一页
  prev: function () {
    let that = this;
    if (that.data.page > 1) { 
      that.setData({
        productList: [],
        page: that.data.page - 1,
        begin: 0,
        end: 20,
        searchLoading: true,
        index: that.data.page-2,//picker页码
        bj: true
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.fetchSearchList();
    } else if (that.data.page == that.data.pages && that.data.page > 1) { //当是最后一页的时候
      that.setData({
        noclick_prev: '',
        noclick_next: 'noclick_next'
      });
    } else if (that.data.page <= 1 && that.data.pages > 1) { //当是第一页的时候
      that.setData({
        noclick_prev: 'noclick_prev',
        noclick_next: ''
      });
    } else if (that.data.page <= 1 && that.data.pages <= 1) { //当仅有一页的时候
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
  },

  //下一页
  next: function () {
    let that = this;
    if (that.data.page < that.data.pages) { //总页数大于1
      that.setData({
        productList: '',
        page: that.data.page + 1,
        begin: 0,
        end: 20,
        searchLoading: true,
        index: that.data.page,
        bj: true
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.fetchSearchList()
    } else if (that.data.page == that.data.pages && that.data.page > 1) { //当是最后一页的时候
      that.setData({
        noclick_prev: '',
        noclick_next: 'noclick_next'
      });
    } else if (that.data.page <= 1 && that.data.pages > 1) { //当是第一页的时候
      that.setData({
        noclick_prev: 'noclick_prev',
        noclick_next: ''
      });
    } else if (that.data.page <= 1 && that.data.pages <= 1) { //当仅有一页的时候
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
  },

  ///关闭遮罩层
  listFix: function () {
    let that = this;
    that.setData({
      choosePrice: [],
      listFix: true,
      choosePrice: '',
      mr: 'mr',
    })
  },

  //获取最小价格
  inputMinPrice: function (e) {
    let that = this;
    let tminPrice = e.detail.value;
    if (typeof tminPrice == 'string') {    ///input输入为string ，转化为int
      tminPrice = parseInt(tminPrice);
    }
    that.setData({
      minPrice: tminPrice,
      searchBox: 'searchBox'
    })
  },

  //获取最大价格
  inputMaxPrice: function (e) {
    let that = this;
    let tmaxPrice = e.detail.value;
    if (typeof tmaxPrice == 'string') {    ///input输入为string ，转化为int
      tmaxPrice = parseInt(tmaxPrice);
    }
    that.setData({
      maxPrice: tmaxPrice,
      searchBox: 'searchBox'
    })
  },

  //按价格区间查询
  buyPrice: function () {
    let that = this;
   
      that.setData({
        choosePrice: 'choosePrice',
        listFix: false,
        mr: ''
      })
    
  },

  //获取输入值
  bindinput: function (e) {
    let that = this;
    that.setData({
      productNameorCode: e.detail.value.replace(/\s+/g, ""),
      searchBox: 'searchBox'
    })
    that.data.lbid = ''; //清掉
  },

  //事件处理函数
  searchBox: function (e) {
    let that = this;
    that.setData({
      page: 1,
      begin: 0,
      choosePrice: '',
      searchLoading: true,
      listFix: true,
      searchBox: '',
      scrolltop: 0,
      index:0,
      choosePrice: 'choosePrice',
      mr: '',
      productList:[],
      bj:true
    })

      that.data.productList.length = 0;
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.fetchSearchList();
  },

  //默认
  synthesize: function () {
    let that = this;
    that.setData({
      choosePrice: '',
      mr:'mr',
      listFix: true
    })
  },

  //选择页码
  listenerPickerSelected: function (e) {
    let that = this;
    //改变index值，通过setData()方法重绘界面
    let page = parseInt(e.detail.value);
    if (page <= that.data.pages) {
      that.setData({
        productList: '',
        page: page+1,
        begin: 0,
        end: 20,
        index: page,
        searchLoading: true,
        bj:true
      });
      if (that.data.page == that.data.pages && that.data.page >1) { //当是最后一页的时候
        that.setData({
          noclick_prev: '',
          noclick_next: 'noclick_next'
        });
      } else if (that.data.page <= 1 && that.data.pages > 1){ //当是第一页的时候
        that.setData({
          noclick_prev: 'noclick_prev',
          noclick_next: ''
        });
      } else if (that.data.page <= 1 && that.data.pages <= 1) { //当仅有一页的时候
        that.setData({
          noclick_prev: 'noclick_prev',
          noclick_next: 'noclick_next'
        });
      }else {
        that.setData({
          noclick_prev: '',
          noclick_next: ''
        });
      }
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.fetchSearchList();
    } else {
      that.setData({
        page: that.data.pages,
        begin: 0
      });
    }
  },

  //刷新
  refresh:function(){
    let that=this;
    that.setData({
      bj: true
    })
    that.fetchSearchList();   ///搜索访问网络
  },

  search: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },

  saoma:function(){
   let that=this;
    that.qcode();
  },

  qcode: function () {
    let that=this;
    wx.scanCode({
      success: (res) => {
        that.data.mxcode = res.result;
        //1-1将条码缓存在历史搜索记录的数组中的步骤：
        wx.getStorage({
          key: 'listoryData1',
          success: function (res) {
            //1-2将缓存存入数组
            that.data.codeArray1 = res.data;
            //1-3条码若在数组存在，则不加入缓存
            let flag=true;
            for (var i in that.data.codeArray1) {
              if (that.data.codeArray1[i].name.indexOf(that.data.mxcode) != -1) {
                flag=false;
                that.data.codeArray1.splice(i,1);
                that.data.codeArray1.unshift({ "name": that.data.mxcode, "lx": 'barcode' });
              }
            }
            if (flag){
              that.data.codeArray1.unshift({ "name": that.data.mxcode, "lx": "barcode" });
            }
            //1-4存入缓存
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.codeArray1
            })
          },fail:function(){
            //1-5 缓存数组为空，则直接将条码存入缓存
            that.data.codeArray1.length = 0;
            that.data.codeArray1.push({ "name": that.data.mxcode, "lx": "barcode" });
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.codeArray1
            })
          }
        })

        //1-1将条码缓存在历史搜索记录的数组中的步骤：
        wx.getStorage({
          key: 'listoryData2',
          success: function (res) {
            //1-2将缓存存入数组
            that.data.codeArray2 = res.data;
            //1-3条码若在数组存在，则不加入缓存
            let flag = true;
            for (var i in that.data.codeArray2) {
              if (that.data.codeArray2[i].name.indexOf(that.data.mxcode) != -1) {
                flag = false;
                that.data.codeArray2.splice(i, 1);
                that.data.codeArray2.unshift({ "name": that.data.mxcode, "lx": 'barcode' });
              }
            }
            if (flag) {
              that.data.codeArray2.unshift({ "name": that.data.mxcode, "lx": "barcode" });
            }
            //1-4存入缓存
            wx.setStorage({
              key: 'listoryData2',
              data: that.data.codeArray2
            })
          }, fail: function () {
            //1-5 缓存数组为空，则直接将条码存入缓存
            that.data.codeArray2.length = 0;
            that.data.codeArray2.push({ "name": that.data.mxcode, "lx": "barcode" });
            wx.setStorage({
              key: 'listoryData2',
              data: that.data.codeArray2
            })
          }
        })
        that.setData({
          lbid:'',
          page:1,
          productNameorCode:'',
          minPrice:'',
          maxPrice:'',
          choosePrice:'',
          lbname: res.result,
          productList:[],
          bj:true
        })
        that.fetchSearchList();   
      },
      fail: function (res) {
        if (res.errMsg != "scanCode:fail cancel") {
          wx.showToast({
            icon: "success",
            title: "无效条码"
          })
        }
      }
    })
  }
})


