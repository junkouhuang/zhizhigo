//获取应用实例
var spData = [];   //存放数量
var spbatchdetailidObj = {};
Page({
  data: {
    currentTab: 0, //商品简介，商品详情
    showProduce: '', // 接收后台返回的结果
    id: '', // 商品ID
    images1: {},
    images2: {},
    swiper_height: '',
    swiperCurrent: 0,
    dataBrand: '',
    dataBranddes: '',
    dataCz: '',
    dataProductdes: '',
    yxsl: '',
    scrollHeight: '',
    detailBtnLoading: true,
    noNetWork: false, //没有网络的时候显示
    bj:false,
    isCanClick:true
  },

  onLoad: function (query) {
    let that = this;
    that.setData({
      id: query.id,
      yxsl: that.data.yxsl,
      scrollHeight: wx.getSystemInfoSync().windowHeight - 40,
      bj: true,
    });
    that.product();
    that.setData({
      swiper_height: wx.getSystemInfoSync().windowWidth
    })
  },

  //获取接口的数据
  product: function() {
    let that=this;
    wx.request({
      url: getApp().globalData.url + '/product/' + that.data.id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': 'bearer  ' + getApp().globalData.access_token,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          spbatchdetailidObj = res.data.detaillist
          spData.length = 0;
          for (var i in res.data.detaillist) {
            spData.push(0);
          }
          that.setData({
            showProduce: res.data,
            spData: spData,
            dataBrand: res.data.brand,
            dataBranddes: res.data.branddes,
            dataCz: res.data.cz,
            dataProductdes: res.data.productdes,
            bj: false,
            noNetWork: false
          });
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login'  //关闭当前页面，跳转到应用内的某个页面
          })
        }
      }, fail: () => {
          that.setData({
            bj: false,
            noNetWork:true
          })
        getApp().wxToast({
          title: '网络不佳，请稍后再试', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    })
  },

  refresh:function(){
    let that=this;
    that.setData({
      bj: true
    })
    that.product();
  },


  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //图片等比例显示(轮播)
  imageLoad1: function (e) {
    let that = this;
    let $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    let viewHeight = wx.getSystemInfoSync().windowWidth * 3 / 4;    //计算显示高度
    let viewWidth = viewHeight * ratio;       //计算显示宽度
    let maxwidth1 = wx.getSystemInfoSync().windowWidth;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    let image = this.data.images1;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight,
      maxwidth1: maxwidth1
    }
    this.setData({
      images1: image
    })
  },

  //图片等比例显示(小图)
  imageLoad2: function (e) {
    let that = this;
    let $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    let viewHeight = 120;    //计算显示高度
    let viewWidth = viewHeight * ratio;       //计算显示宽度
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    let image = this.data.images2;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images2: image
    })
  },

  // 选择数量
  buyCount: function (e) {
    let that = this;
    this.setData({
      mengShow: true,           //蒙层显示
      aniStyle: true,           //设置动画效果为slideup
    })
    var len = spData.length;
    spData.length = 0;
    for (var i = 0; i < len; i++) {
      spData.push(0);
    }
    that.setData({
      spData: spData,
    });
  },
  
  //加入购物车
  toCart: function () {
    let that = this;
    var orderNosList = new Array();
    for (var i in spData) {
      if (spData[i] > 0) {
        orderNosList.push({ "spbatchdetailid": spbatchdetailidObj[i].id, "sl": spData[i] });
      }
    }
    if (that.data.isCanClick){  //不可点
      that.setData({
        detailBtnLoading: false,
        isCanClick:false
      });
      setTimeout(function(){
        that.setData({
          detailBtnLoading: true,
          isCanClick:true
        })
      },1000)
      // 没选择数量则不发请求
      if (orderNosList.length > 0) {
      
        wx.request({
          //获取openid接口  
          url: getApp().globalData.url + '/shoppingCartController/addShoppingCart/' + that.data.id,
          method: 'PUT',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(orderNosList),
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            'Authorization': 'bearer  ' + getApp().globalData.access_token
          },
          success: function (res) {
            if (res.statusCode == 200) {
              if (res.data.success) {
                
                getApp().wxToast({
                  title: res.data.msg, //标题，不写默认正在加载
                  duration: 1000, //延时关闭，默认2000
                  tapClose: false, //点击关闭，默认false
                  show: function () { //显示函数
                    wx.redirectTo({
                      url: '../returnCart/returnCart'
                    })
                  }
                });
              } else {
                if (res.data.obj == "CARTALREADY") {
                 
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    duration: 1000, //延时关闭，默认2000
                    tapClose: false, //点击关闭，默认false
                    show: function () { //显示函数
                      wx.redirectTo({
                        url: '../returnCart/returnCart'
                      })
                    }
                  });
                } else {
                  
                  getApp().wxToast({
                    title: res.data.msg, //标题，不写默认正在加载
                    duration: 2000, //延时关闭，默认2000
                    tapClose: false
                  });

                }
              }
            } else if (res.statusCode == 401) {
              wx.redirectTo({
                url: '../login/login'  //关闭当前页面，跳转到应用内的某个页面
              })
            }
          },fail:function(){
          
            getApp().wxToast({
              title: '网络不佳，请稍后再试', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        })
      } else {
     
        getApp().wxToast({
          title: '请选择商品数量', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    }
  },

  // 减少
  sub: function (e) {
    let that = this;
    var foodId = e.currentTarget.dataset.foodId;
    if ((spData[foodId] - 1) < 0) {
      return false;
    } else {
      spData[foodId] = spData[foodId] - 1
      that.setData({
        spData: spData
      });
    }
  },

  // 添加
  add: function (e) {
    let that = this;
    var foodId = e.currentTarget.dataset.foodId;
    let showProduce = that.data.showProduce;
    if ((spData[foodId] + 1) > showProduce.detaillist[foodId].stock) {
      return false;
    } else {
      if ( showProduce.detaillist[foodId].ratioNum){
        if (spData[foodId] < showProduce.detaillist[foodId].ratioNum && spData[foodId] < showProduce.detaillist[foodId].stock) {
          spData[foodId] = spData[foodId] + 1;
          that.setData({
            spData: spData
          });
        } else {
          if (showProduce.dw!=null){
            wx.showToast({
              title:'单笔限量' + showProduce.detaillist[foodId].ratioNum + "" + showProduce.dw
            })
           // getApp().wxToast({
            //  title: '单笔限量' + showProduce.detaillist[foodId].ratioNum + "" + showProduce.dw, //标题，不写默认正在加载
            //  contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
           //   duration: 1000, //延时关闭，默认2000
           //   tapClose: false //点击关闭，默认false
         //   });
          }else{
           // getApp().wxToast({
           //   title: '单笔限量' + showProduce.detaillist[foodId].ratioNum, //标题，不写默认正在加载
            //  contentClass: 'content iconfont icon-cuowu2', //内容添加class类名
            //  duration: 1000, //延时关闭，默认2000
           //   tapClose: false //点击关闭，默认false
           // });
            wx.showToast({
              title: '单笔限量' + showProduce.detaillist[foodId].ratioNum
            })
          }
        }
      }else{
          spData[foodId] = spData[foodId] + 1;
          that.setData({
            spData: spData
          });
      }
    }
  },

  //录入购买数量聚焦
  inputsl: function (e) {
    let that = this;
    let sl = e.detail.value;
    var foodId = e.currentTarget.dataset.foodId;
    let showProduce = that.data.showProduce;
    if (typeof sl == 'string') {    //input输入为string ，转化为int
      sl = parseInt(sl);
    }
    if (sl <= showProduce.detaillist[foodId].ratioNum && sl <= showProduce.detaillist[foodId].stock) {
          spData[foodId] = sl;
          that.setData({
            spData: spData
          });
        } else {
          if (sl > showProduce.detaillist[foodId].stock) {//大于库存
            if (showProduce.detaillist[foodId].stock > showProduce.detaillist[foodId].ratioNum) {
              spData[foodId] = showProduce.detaillist[foodId].ratioNum;
            } else {
              spData[foodId] = showProduce.detaillist[foodId].stock;
            }
            that.setData({
              spData: spData
            });
            wx.showToast({
              title: '超出最大库存'
            })
            return false;
          }
          if (sl > showProduce.detaillist[foodId].ratioNum) {  //大于每份数量
            if (showProduce.detaillist[foodId].stock > showProduce.detaillist[foodId].ratioNum) {
              spData[foodId] = showProduce.detaillist[foodId].ratioNum;
            } else {
              spData[foodId] = showProduce.detaillist[foodId].stock;
            }
            that.setData({
              spData: spData
            });
            if (showProduce.dw != null) {
              wx.showToast({
                title: '单笔限量' + showProduce.detaillist[foodId].ratioNum + "" + showProduce.dw,
              })
            } else {
              wx.showToast({
                title: '单笔限量' + showProduce.detaillist[foodId].ratioNum,
              })
            }
            return false;
          }
    }
  },

  //录入购买数量失焦
  inputblur: function (e) {
    let that = this;
    let sl = e.detail.value;
    var foodId = e.currentTarget.dataset.foodId;
    if (sl == '') {
      spData[foodId] = 0;
      that.setData({
        spData: spData
      });
    }
  },

  //浏览图片手指触摸动作开始
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

 //浏览图片手指触摸动作结束
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },

  //浏览图片手指触摸动作点击
  multipleTap: function (e) {
    let that = this;
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      var current = e.target.dataset.src;
      var term = [];
      for (var i in that.data.showProduce.imglist) {
        term.push("http://119.23.48.31/" + that.data.showProduce.imglist[i].url);
      }
      wx.previewImage({
        current: current, // 当前显示图片的http链接  
        urls: term // 需要预览的图片http链接列表  
      })
    }
  },
  
  //小菜单关闭按钮
  close: function (e) {           
    let that = this;
    this.setData({
      aniStyle: false　　　　　　
    })
    setTimeout(function () {       
      that.setData({
        mengShow: false
      })
    }, 0)
  },

  //复制图片按钮
  copyImgClick:function(){
    getApp().wxToast({
      title: '长按文本区域复制', //标题，不写默认正在加载
      duration: 1000, //延时关闭，默认2000
      tapClose: false //点击关闭，默认false
    });
    that.setData({
      
    })
  },

  //长按按钮复制文本事件
  longTap: function (e) {
    let that = this;
    that.setData({ selectColor: 'selectColor'})
    wx.showModal({
      title: '提示',
      content: '您是否复制文本',
      showCancel: true,
      success: function (e) {
        that.setData({ selectColor: '' })
        if(e.confirm){
          let dataT = ""
          dataT = that.data.dataBrand + '  ' + that.data.dataBranddes + '  ' + that.data.dataCz + '  ' + that.data.dataProductdes
          wx.setClipboardData({ //设置系统剪贴板内容
            data: dataT,
            success: function (res) {
              console.log("设置系统剪贴板内容成功！");
              console.log(res);
              wx.getClipboardData({ //获取系统剪贴板内容
                success: function (res) {
                  console.log("获取系统剪贴板内容成功！");
                  console.log(res);
                }, fail: function () {
                  console.log("获取系统剪贴板内容失败！");
                }
              })
            }, fail: function () {
              console.log("设置系统剪贴板内容失败！");
            }
          })
        }else{
          console.log("点击取消");
        }
      }
    })
  }
})