Page({
  data: {
    page: 1, //当前页
    pageSize: 20, //每页显示数量
    pages: '', //总页数
    currentTab: 2, //切换
    showLoading: true, //正在加载更多
    productList: {}, // 用于判断productList数组是不是空数组，默认true，空的数组  
    imgCss: [], //图片样式
    swiper_width: '', //组件swiper的宽度
    swiper_height: '', //组件sweiper的高度
    scrollTop: 0, //置顶
    batchlx: 2, //批次类别
    imgUrls: [], //图片轮播资源
    swiperCurrent: 0,
    imgHeight: '', //个体商品图片高度
    noNetWork: false, //网络异常显示
    bj: true, //背景
    mkbj: false, //模块背景
    s_move: '',
    variable: '',
    noData: '',
    firePath: true,
    firePath1: 'iconfont icon-icon-test1',
    firePath2: 'iconfont icon-icon-test2',
    fhlb: '',
    codeArray1: [],
    codeArray2: [],
    barcode: ''
  },

  onLoad: function () { //次级页面
    let that = this;

    that.data.productList.length = 0; ///加载页面，清空数组数据，不清空界面
    that.showProductList(); //接口函数
    that.imgUrls(); //轮播图片的函数
    that.setData({
      swiper_width: wx.getSystemInfoSync().windowWidth, //组件swiper的宽度
      swiper_height: wx.getSystemInfoSync().windowWidth * 3 / 4, //组件swiper的高度
      imgHeight: wx.getSystemInfoSync().windowWidth / 2,
    })

  },

  //滑动时改变图片下标
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },


  //轮播图片的资源
  imgUrls: function () {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/product/getCarouselImageList', //获取openid接口  
      method: 'GET',
      header: {
        'content-type': 'application/json',
        // 'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        var imgList = new Array();
        for (let j in res.data) {
          imgList.push({
            url: res.data[j].url
          });
        }
        that.setData({
          imgUrls: imgList
        })
      }
    })
  },

  //图片等比例显示(轮播)
  imgCss: function (e) {
    let that = this;
    let $width = e.detail.width;
    let $height = e.detail.height;
    let ratio = $width / $height;
    let swiperWidth = that.data.swiper_width; //组件swiper的宽度
    let swiperHeight = that.data.swiper_height; //组件sweiper的高度
    let readyWidth = e.detail.width;
    let readyHeight = e.detail.height;
    if ($width > swiperWidth && $height > swiperHeight && $width > $height) {
      readyWidth = swiperWidth;
      readyHeight = swiperWidth / ratio;
    }
    if ($width > swiperWidth && $height > swiperHeight && $width < $height) {
      readyWidth = swiperWidth * ratio;
      readyHeight = swiperHeight;
    }
    if ($width > swiperWidth && $height < swiperHeight && $width > $height) {
      readyWidth = swiperWidth;
      readyHeight = swiperHeight / ratio;
    }
    if ($width < swiperWidth && $height > swiperHeight && $width > $height) {
      readyWidth = swiperWidth * ratio;
      readyHeight = swiperHeight;
    }
    if ($width < swiperWidth && $height < swiperHeight && $width > $height) {
      readyWidth = e.detail.width;
      readyHeight = e.detail.height;
    }
    if ($width < swiperWidth && $height < swiperHeight && $width < $height) {
      readyWidth = e.detail.width;
      readyHeight = e.detail.height;
    }

    let image = this.data.imgUrls;
    console.log(image);
    image[e.target.dataset.index] = {
      width: readyWidth,
      height: readyHeight,
    }
    this.setData({
      imgCss: image
    })
  },

  //访问接口  
  showProductList: function () {
    let that = this;
    let data = new Array();
    if (that.data.batchlx == 2) {
      data = {
        page: that.data.page,
        pageSize: that.data.pageSize,
        batchlx: '',
      }
    }

    wx.request({
      url: getApp().globalData.url + "/reCommendProductController/getReCommendProductPageList",
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.list == "") {
            that.setData({
              bj: false,
              noData: '暂无数据',
              noNetWork: false,
              productList: [],
              mkbj: false
            })
          } else {
            that.data.productList.length <= 0 ? that.data.productList = res.data.list : that.data.productList = that.data.productList.concat(res.data.list)
            if (res.data.list.length > 10) {
              that.setData({
                showLoading: true
              })
            } else {
              that.setData({
                showLoading: false
              })
            }
            that.setData({
              productList: that.data.productList,
              pages: res.data.pages,
              noData: '',
              noNetWork: false,
              mkbj: false,
              bj: false,
            });
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'
          })
        }
        wx.stopPullDownRefresh() //停止下拉刷新    
      },
      fail: function () {
        that.setData({
          showLoading: false,
          mkbj: false,
          noNetWork: true,
          bj: false
        })
        getApp().wxToast({
          title: '网络不佳，请稍后再试',
          contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
          duration: 1000,
          tapClose: false
        });
        wx.stopPullDownRefresh() //停止下拉刷新    
      }
    })
  },


  //访问接口  
  showProductList1: function () {
    let that = this;
    let data = new Array();
    if (that.data.batchlx == 0) {
      data = {
        page: that.data.page,
        pageSize: that.data.pageSize,
        batchlx: 0
      }
    } else {
      data = {
        page: that.data.page,
        pageSize: that.data.pageSize,
        fblx: 1
      }
    }

    wx.request({
      url: getApp().globalData.url + "/product/show",
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.list == "") {
            that.setData({
              bj: false,
              noData: '暂无数据',
              noNetWork: false,
              productList: [],
              mkbj: false
            })
          } else {
            that.data.productList.length <= 0 ? that.data.productList = res.data.list : that.data.productList = that.data.productList.concat(res.data.list)
            if (res.data.list.length > 10) {
              that.setData({
                showLoading: true
              })
            } else {
              that.setData({
                showLoading: false
              })
            }
            that.setData({
              productList: that.data.productList,
              pages: res.data.pages,
              noData: '',
              noNetWork: false,
              mkbj: false,
              bj: false,
            });
          }
        } else if (res.statusCode == 401) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
        wx.stopPullDownRefresh() //停止下拉刷新    
      },
      fail: function () {
        that.setData({
          showLoading: false,
          mkbj: false,
          noNetWork: true,
          bj: false
        })
        getApp().wxToast({
          title: '网络不佳，请稍后再试',
          contentClass: 'content iconfont icon-cuowu1', //内容添加class类名
          duration: 1000,
          tapClose: false
        });
        wx.stopPullDownRefresh() //停止下拉刷新    
      }
    })
  },

  //刷新
  refresh: function () {
    let that = this;
    that.setData({
      showLoading: true,
      noNetWork: false,
      mkbj: true
    });
    if (that.data.batchlx == 2 ){
      that.showProductList() //函数接口
    }else{
      that.showProductList1() //函数接口
    }
  },

  //点击tab切换 
  swichNav: function (e) {
    let that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      if (e.currentTarget.dataset.current == 2) {
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          batchlx: e.currentTarget.dataset.current,
          page: 1,
          productList: '',
          mkbj: true,
          firePath: true
        })
        that.showProductList();
      } else if (e.currentTarget.dataset.current == 0) {
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          batchlx: e.currentTarget.dataset.current,
          page: 1,
          productList: '',
          mkbj: true,
          firePath: false
        })
        that.showProductList1();
      } else {
        that.setData({
          currentTab: e.currentTarget.dataset.current,
          batchlx: e.currentTarget.dataset.current,
          page: 1,
          productList: '',
          mkbj: true,
          firePath: false
        })
        that.showProductList1();
      }

    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
   
  },

  // 置顶
  goTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    that.setData({
      variable: ''
    })
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    console.log(e);
    let that = this;
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.scrollTop > 1000) {
      if (that.data.variable == 'flex') { } else {
        that.setData({
          variable: 'flex'
        })
      }
    } else {
      if (that.data.variable == 'flex') {
        that.setData({
          variable: ''
        })
      }
    }
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

  // 下拉刷下
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    that.setData({
      page: 1,
      pageSize: 20,
      productList: [],
      mkbj: true,
    });
    if (that.data.batchlx == 2) {
      that.showProductList() //函数接口
    } else {
      that.showProductList1() //函数接口
    }
    wx.hideNavigationBarLoading() //完成停止加载
  },

  // 上拉加载更多
  onReachBottom: function () {
    let that = this;
    if (!that.data.noNetWork) { //当有网络的时候才允许上拉加载
      if (that.data.page < that.data.pages) {
        that.setData({
          page: that.data.page + 1, //每次触发上拉事件，把page+1      
          showLoading: true,
          noNetWork: false
        });
        if (that.data.batchlx == 2) {
          that.showProductList() //函数接口
        } else {
          that.showProductList1() //函数接口
        }
      } else {
        that.setData({
          showLoading: false,
          noNetWork: false
        });
      }
    }
  },

  search: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  saoma: function () {
    let that = this;
    that.qcode();
  },

  qcode: function () {
    let that = this;
    wx.scanCode({
      success: (res) => {
        that.data.barcode = res.result;
        //1-1将条码缓存在历史搜索记录的数组中的步骤：
        wx.getStorage({
          key: 'listoryData1',
          success: function (res) {
            //1-2将缓存存入数组
            that.data.codeArray1 = res.data;
            //1-3条码若在数组存在，则不加入缓存
            let flag = true;
            for (var i in that.data.codeArray1) {
              if (that.data.codeArray1[i].name.replace(/\"/g, "") == that.data.barcode) {
                flag = false;
                that.data.codeArray1.splice(i, 1);
                that.data.codeArray1.unshift({ "name": that.data.barcode, "lx": 'barcode' });
              }
            }
            if (flag) {
              that.data.codeArray1.unshift({ "name": that.data.barcode, "lx": "barcode" });
            }
            //1-4存入缓存
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.codeArray1
            })
            wx.navigateTo({
              url: '../subclass/subclass'
            })

          }, fail: function () {
            //1-5 缓存数组为空，则直接将条码存入缓存
            that.data.codeArray1.length = 0;
            that.data.codeArray1.push({ "name": that.data.barcode, "lx": "barcode" });
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.codeArray1
            })
            wx.navigateTo({
              url: '../subclass/subclass'
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
              if (that.data.codeArray2[i].name.replace(/\"/g, "") == that.data.barcode) {
                flag = false;
                that.data.codeArray2.splice(i, 1);
                that.data.codeArray2.unshift({ "name": that.data.barcode, "lx": 'barcode' });
              }
            }
            if (flag) {
              that.data.codeArray2.unshift({ "name": that.data.barcode, "lx": "barcode" });
            }
            //1-4存入缓存
            wx.setStorage({
              key: 'listoryData2',
              data: that.data.codeArray2
            })
          }, fail: function () {
            //1-5 缓存数组为空，则直接将条码存入缓存
            that.data.codeArray2.length = 0;
            that.data.codeArray2.push({ "name": that.data.barcode, "lx": "barcode" });
            wx.setStorage({
              key: 'listoryData2',
              data: that.data.codeArray2
            })

          }
        })

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