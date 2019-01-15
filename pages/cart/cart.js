let opsl = 0;
let allBeforeGoods;
let editorgoods;
Page({
  data: {
    page: 1,
    pageSize: 20, //每页显示20
    currue: 0, ///初始化选框状态：未选中
    imgCheckOrUcheck: '/images/cart/ucheck.png', //初始化图片
    allGoods: {}, // 购物车列表
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false, // 全选状态，默认不全选
    images1: {},
    hidedel: true,
    delOrder: true,
    editorgoods: true, //编辑商品
    noclick_prev: 'noclick_prev',
    noclick_next: '',
    scrollHeight: '',
    pagebar: false, //“没有数据”的变量，默认false，隐藏  
    array: [], //存放页码
    index: 0,
    topImgWidth: '',
    cartBtnLoading: true,
    bj: true,
    allEdiotGoods: {},
    allBeforeGoods: {},
    noNetWork: false, //没有网络的时候显示
    goNav: '',
    noData: '',
    yixuan: 0,
    isCanClick:true
  },
  onLoad: function () {
    let that = this;
    that.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight - 42,
      topImgWidth: wx.getSystemInfoSync().windowWidth * 0.25,
    })
  },
  onShow: function () {
    let that = this;
    ///获取购物车信息
    that.setData({
      page: 1,
      noclick_prev: '',
      noclick_next: '',
    })
    that.showShoppingCartDetailPage();
  },
  //获取列表信息
  showShoppingCartDetailPage() {
    let that = this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/shoppingCartController/showShoppingCartDetailPage',
      method: 'get',
      data: {
        page: that.data.page,
        pageSize: that.data.pageSize,
      },
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) { // 暂无数据
          if (res.data.list.length == 0) {
            that.setData({
              allGoods: [],
              pagebar: false,
              noNetWork: false,
              bj: false,
              noData: '亲，购物车空空的耶~',
              carPic: 'iconfont icon-gouwuchekong'
            });
          } else {
            that.data.array.length = 0;
            for (var i = 1; i <= res.data.pages; i++) {
              that.data.array.push('第' + i + '页');
            }
            that.setData({
              pages: res.data.pages,
              array: that.data.array,
              selectAllStatus: false,
              noNetWork: false,
              bj: false,
              allBeforeGoods: res.data.list,
              allEdiotGoods: res.data.list,
              allGoods: res.data.list,
            });
            if (that.data.page == that.data.pages && that.data.page > 1) { //当是最后一页的时候
              that.setData({
                pagebar: true,
                noclick_prev: '',
                noclick_next: 'noclick_next'
              });
            } else if (that.data.page == 1 && that.data.pages > 1) { //当是第一页的时候
              that.setData({
                pagebar: true,
                noclick_prev: 'noclick_prev',
                noclick_next: ''
              });
            } else if (that.data.page == 1 && that.data.pages == 1) { //当仅有一页的时候
              that.setData({
                pagebar: false,
                noclick_prev: 'noclick_prev',
                noclick_next: 'noclick_next'
              });
            } else {
              that.setData({
                pagebar: true,
                noclick_prev: '',
                noclick_next: ''
              });
            }
            if (editorgoods) {
              that.setData({
                editorgoods: true
              })
            }
            that.getTotalPrice(-1, -1);
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login' ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      },
      fail: function () {
        setTimeout(function () {
          that.setData({
            bj: false,
            noNetWork: true
          })
        }, 500)
        getApp().wxToast({
          title: '网络不佳，请稍后再试', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    })
  },

  refresh: function () {
    let that = this;
    that.showShoppingCartDetailPage();
  },

  ///图片等比例显示(小图)
  imageLoad1: function (e) {
    let that = this;
    let $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    let viewHeight = 120; //计算显示高度
    let viewWidth = viewHeight * ratio; //计算显示宽度
    let maxWidth = wx.getSystemInfoSync().windowWidth * 0.25;
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
  editorgoods: function () {
    let that = this;
    for (var i in that.data.allEdiotGoods) { ///存在子选框有没选中状态，全选按钮不为选中状态
      if (that.data.allEdiotGoods[i].selected) {
        that.data.allEdiotGoods[i].selected = false;
      }
    }
    that.setData({
      hidedel: false,
      delOrder: false,
      editorgoods: false,
      allGoods: that.data.allEdiotGoods,
      selectAllStatus: false,
    })
    editorgoods = false;
    //---------
    let total = 0;
    for (let i = 0; i < that.data.allGoods.length; i++) {
      let subtotal = 0;
      let price = that.data.allGoods[i].spBatchBasic.sellprice;
      let rate = that.data.allGoods[i].spBatchBasic.rate;
      for (let j = 0; j < that.data.allGoods[i].shoppingCartDetailList.length; j++) {
        subtotal = subtotal + price * that.data.allGoods[i].shoppingCartDetailList[j].sl * that.data.allGoods[i].shoppingCartDetailList[j].mfsl * rate;
      }
      //更新小计
      that.data.allGoods[i].cartAmount = subtotal;
      if (!that.data.allGoods[i].selected) { // 判断选中才会计算价格
        continue;
      }
      // 所有选择的项目金额加起来
      total = total + subtotal;
    }

    if (that.data.allGoods.length == 0) {
      that.showShoppingCartDetailPage();
    } else {
      if (that.data.editorgoods) {
        this.setData({
          //allEdiotGoods: allGoods,
          //allBeforeGoods: allGoods,                               // 最后赋值到data中渲染到页面
          allGoods: that.data.allGoods,
          total: total

        });
      } else {
        this.setData({
          //allEdiotGoods: allGoods,
          // allBeforeGoods: allGoods,                               // 最后赋值到data中渲染到页面
          allGoods: that.data.allGoods,

        });
      }
    }
    //---------
  },
  finsh: function () {
    let that = this;
    let flag = true;
    that.setData({
      hidedel: true,
      delOrder: true,
      editorgoods: true,
      allGoods: that.data.allBeforeGoods,
    })
    editorgoods = true;
    that.getTotalPrice(-1, -1);
    for (var i in that.data.allGoods) { ///存在子选框有没选中状态，全选按钮不为选中状态
      if (!that.data.allGoods[i].selected) {
        flag = false;
        that.setData({
          selectAllStatus: false
        });
        return false;
      }
    }
    if (flag) {
      that.setData({
        selectAllStatus: true
      });
    }
  },
  selectList(e) { //点击勾选图标
    let that = this;
    let flag = true;
    let num = 0;
    // 获取当前商品的选中状态
    if (that.data.editorgoods) {
      that.data.allBeforeGoods[e.currentTarget.dataset.index].selected = !that.data.allBeforeGoods[e.currentTarget.dataset.index].selected; // 改变状态(编辑前)
      that.setData({
        allGoods: that.data.allBeforeGoods,
      });
    } else {
      that.data.allEdiotGoods[e.currentTarget.dataset.index].selected = !that.data.allEdiotGoods[e.currentTarget.dataset.index].selected; // 改变状态(编辑完成)
      that.setData({
        allGoods: that.data.allEdiotGoods,
      });
    }
    that.getTotalPrice(-1, -1);
    // 重新获取总价
    for (var i in that.data.allGoods) { ///存在子选框有没选中状态，全选按钮不为选中状态
      if (!that.data.allGoods[i].selected) {
        flag = false;
        that.setData({
          selectAllStatus: false
        });
        return false;
      }
    }
    if (flag) {
      that.setData({
        selectAllStatus: true
      });
    }

  },
  /// 全选
  selectAll: function (e) {
    let that = this;
    if (e.currentTarget.dataset.selectId) {
      for (var i in that.data.allBeforeGoods) {
        that.data.allBeforeGoods[i].selected = false;
      }
      that.setData({
        selectAllStatus: false,
        allGoods: that.data.allBeforeGoods,
      });
      that.getTotalPrice(-1, -1);
      // 重新获取总价
    } else {
      if (that.data.editorgoods) { //编辑前
        for (var i in that.data.allBeforeGoods) {
          that.data.allBeforeGoods[i].selected = true;
        }
        that.setData({
          selectAllStatus: true,
          allGoods: that.data.allBeforeGoods,
        });
        that.getTotalPrice(-1, -1);
      } else { //编辑后
        for (var i in that.data.allEdiotGoods) {
          that.data.allEdiotGoods[i].selected = true;
        }
        that.setData({
          selectAllStatus: true,
          allGoods: that.data.allEdiotGoods,
        });
        that.getTotalPrice(-1, -1);
      }
    }
  },
  ///清除+计算总价
  getTotalPrice(parentindex, childindex) {
    let that = this;
    let num = 0;
    let allGoods = this.data.allGoods;
    if (parentindex != -1 && childindex != -1) { //-1为删除操作（此处为删除操作）
      allGoods[parentindex].shoppingCartDetailList.splice(childindex, 1);
      if (!that.data.editorgoods) { //当前为编辑状态
        that.data.allBeforeGoods[parentindex].shoppingCartDetailList.splice(childindex, 1);
        that.data.allEdiotGoods[parentindex].shoppingCartDetailList.splice(childindex, 1);
      }
    }
    if (parentindex != -1) { //删除....
      if (allGoods[parentindex].shoppingCartDetailList.length == 0) {
        allGoods.splice(parentindex, 1);
        if (!that.data.editorgoods) {
          that.data.allBeforeGoods.splice(parentindex, 1);
          that.data.allEdiotGoods.splice(parentindex, 1);
        }
      }
    }
    let total = 0;
    for (let i = 0; i < allGoods.length; i++) {
      let subtotal = 0;
      let price = allGoods[i].spBatchBasic.sellprice;
      let rate = allGoods[i].spBatchBasic.rate;
      for (let j = 0; j < allGoods[i].shoppingCartDetailList.length; j++) {
        subtotal = subtotal + price * allGoods[i].shoppingCartDetailList[j].sl * allGoods[i].shoppingCartDetailList[j].mfsl * rate;
      }
      //更新小计
      allGoods[i].cartAmount = subtotal;
      if (allGoods[i].selected) { // 所有选择的项目金额加起来              // 判断选中才会计算价格
        total = total + subtotal;
        num = num + 1;
      }
    }
    console.log(editorgoods);
    if (allGoods.length == 0) {
      that.showShoppingCartDetailPage();
    } else {
      if (that.data.editorgoods) { //编辑前
        this.setData({
          allGoods: that.data.allBeforeGoods,
          totalPrice: total,
          yixuan: num
        });
      } else { //编辑中
        this.setData({
          allGoods: that.data.allEdiotGoods,
        });
      }
    }
  },
  updnumblur(e) {
    let that = this;
    const childrenindex = e.currentTarget.dataset.index;
    const parentindex = e.currentTarget.dataset.parentindex;
    let allGoods = that.data.allGoods;
    let sl = e.detail.value;
    let id = allGoods[parentindex].shoppingCartDetailList[childrenindex].id;
    let oldsl = allGoods[parentindex].shoppingCartDetailList[childrenindex].sl;
    let ratioNum = allGoods[parentindex].shoppingCartDetailList[childrenindex].ratioNum;
    let stock = allGoods[parentindex].shoppingCartDetailList[childrenindex].stock;
    if (sl == '' || sl == 0) { // 手机键盘是纯数字模式，这里只需要判断输入是否为空就可以
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = 1;
      that.setData({
        allGoods: allGoods
      });
      sl = 1; //再一次获取值
    }
    if (sl == oldsl) { // 没改变就不发请求
      return false;
    }
    if (sl > stock && ratioNum < stock) {
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = ratioNum;
      that.setData({
        allGoods: allGoods
      });
      sl = ratioNum;
    }
    if (sl > stock && ratioNum > stock) {
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = stock;
      that.setData({
        allGoods: allGoods
      });
      sl = stock;
    }
    if (sl > stock && ratioNum == stock) {
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = ratioNum;
      that.setData({
        allGoods: allGoods
      });
      sl = ratioNum;
    }
    if (sl < stock && sl > ratioNum) {
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = ratioNum;
      that.setData({
        allGoods: allGoods
      });
      sl = ratioNum;
    }
    if (sl < ratioNum && sl > stock) {
      allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = stock;
      that.setData({
        allGoods: allGoods
      });
      sl = stock;
    }
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/shoppingCartController/optionShoppingCartDetail',
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: {
        "id": id,
        "sl": sl
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.success) {
            getApp().wxToast({
              title: '修改成功', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {

                allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = sl;


                that.data.allBeforeGoods[parentindex].shoppingCartDetailList[childrenindex].sl = sl;
                that.data.allEdiotGoods[parentindex].shoppingCartDetailList[childrenindex].sl = sl;

                that.setData({

                  allGoods: allGoods
                });
                that.getTotalPrice(parentindex, -1);
              }
            });
          } else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = oldsl;
                // allGoods[parentindex].shoppingCartDetailList[childrenindex].sl = sl;
                that.setData({
                  allGoods: allGoods
                });
              }
            });
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login' ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }
    })
    //请求结束
  },
  deletechildcart: function (e) {  //单款删除
    let that = this;
    const childindex = e.currentTarget.dataset.index;
    const parentindex = e.currentTarget.dataset.parentindex;
    let allGoods = that.data.allGoods;
    let id = allGoods[parentindex].shoppingCartDetailList[childindex].id;
    wx.showModal({
      title: '您确定删除？',
      content: allGoods[parentindex].shoppingCartDetailList[childindex].ys + "+" + allGoods[parentindex].shoppingCartDetailList[childindex].cm,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#ccc',
      confirmText: '删除',
      confirmColor: '#ccc',
      success: function (res) {
        if (res.confirm) {
          that.clearShoppingCartDetailByid(id, 0, parentindex, childindex); //保存数量
        }
      }
    })
  },
  ///生成订单
  addOrders: function () {
    let that = this;
    let orderNosList = this.data.allGoods;
    let datalist = new Array();
    let flag = false;
    for (var i in orderNosList) {
      if (orderNosList[i].selected) {
        flag = true;
        datalist.push({
          "cartid": that.data.allGoods[i].id
        })
      }
    }
    if (that.data.isCanClick) { //不可点
      that.setData({
        cartBtnLoading: false,
        isCanClick:false
      });
      setTimeout(function () {
        that.setData({
          cartBtnLoading: true,
          isCanClick: true
        });
      }, 1000)
      if (flag) {
        wx.request({
          //获取openid接口  
          url: getApp().globalData.url + '/ordersController/addOrders',
          method: 'put',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(datalist),
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            'Authorization': 'bearer  ' + getApp().globalData.access_token
          },
          success: function (res) {
            if (res.data.success) {
              wx.showToast({
                icon: "success",
                title: "已生成订单",
                success: function () {
                  let has = true;
                  while (has) {
                    has = false;
                    for (var i = 0; i < that.data.allGoods.length; i++) {
                      if (that.data.allGoods[i].selected) {
                        that.data.allGoods.splice(i, 1);
                        that.data.allBeforeGoods.splice(i, 1);
                        that.data.allEdiotGoods.splice(i, 1);
                        has = true;
                      }
                    }
                  }
                  that.getTotalPrice(-1, -1);
                },
                complete: function () {
                  if (that.data.allGoods.length == 0) {
                    if (that.data.page <= 1) {
                      that.setData({
                        pagebar: false,
                        page: 1
                      })
                    } else {
                      that.setData({
                        pagebar: true,
                        page: that.data.page - 1
                      })
                    }

                  } else {
                    that.setData({
                      allBeforeGoods: that.data.allGoods,
                      allEdiotGoods: that.data.allGoods,
                    });
                    that.setData({
                      allGoods: that.data.allBeforeGoods
                    })
                  }

                }
              })
            } else {
              
              getApp().wxToast({
                title: res.data.msg, //标题，不写默认正在加载
                duration: 1000, //延时关闭，默认2000
                tapClose: false //点击关闭，默认false
              });
            }
          },
          fail: function () {
         
          }
        })
      } else {
        
        getApp().wxToast({
          title: '请选择商品', //标题，不写默认正在加载
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    }
  },
  bindAddCount: function (id, sl, parentindex, childindex) {
    let that = this;
    wx.request({
      url: getApp().globalData.url + '/shoppingCartController/additionShoppingCartDetailStock',
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      data: {
        "id": id,
        "sl": sl
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.success) {
            getApp().wxToast({
              title: '修改成功', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                that.getTotalPrice(parentindex, childindex);
              }
            });
          } else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login' ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }
    })
  },
  clearShoppingCartDetailByid: function (id, sl, parentindex, childindex) { //单款删除的方法
    let that = this;
    wx.request({
      //获取openid接口  
      url: getApp().globalData.url + '/shoppingCartController/clearShoppingCartDetailByid/' + id,
      method: 'DELETE',
      header: {
        'Authorization': 'bearer  ' + getApp().globalData.access_token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.success) {
            getApp().wxToast({
              title: '操作成功', //标题，不写默认正在加载
              duration: 1000, //延时关闭，默认2000
              tapClose: false, //点击关闭，默认false
              show: function () {
                that.getTotalPrice(parentindex, childindex);
                if (that.data.allGoods.length == 0) {
                  that.setData({
                    selectAllStatus: false,
                    page: that.data.page - 1,
                    hidedel: true,
                    delOrder: true,
                    editorgoods: false,
                  })
                  editorgoods = true;
                }
              }
            });
          } else {
            getApp().wxToast({
              title: res.data.msg, //标题，不写默认正在加载
              duration: 2000, //延时关闭，默认2000
              tapClose: false //点击关闭，默认false
            });
          }
        } else if (res.statusCode == 401) {
          wx.redirectTo({
            url: '../login/login' ///关闭当前页面，跳转到应用内的某个页面
          })
        }
      }
    })
  },
  ///删除购物车
  delOrder: function () {
    let that = this;
    let flag = false;
    let datalist = new Array();
    for (var i in that.data.allEdiotGoods) {
      if (that.data.allEdiotGoods[i].selected) {
        flag = true;
        datalist.push(that.data.allEdiotGoods[i].id)
      }
    }
    if (flag) {
      wx.showModal({
        title: '您确定删除所有选中商品？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#ccc',
        confirmText: '删除',
        confirmColor: '#ccc',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              //获取openid接口  
              url: getApp().globalData.url + '/shoppingCartController/clearShoppingCartByid/' + datalist,
              method: 'DELETE',
              header: {
                "Content-Type": "application/json;charset=UTF-8",
                'Authorization': 'bearer  ' + getApp().globalData.access_token
              },
              success: function (res) {
                if (res.statusCode == 200) {
                  if (res.data.success) {
                    for (var i in datalist) {
                      for (var j in that.data.allEdiotGoods) {
                        if (that.data.allEdiotGoods[j].id == datalist[i]) {

                          that.data.allBeforeGoods.splice(j, 1);
                          that.data.allEdiotGoods.splice(j, 1);
                        }
                      }
                    }
                    that.setData({
                      allGoods: that.data.allEdiotGoods
                    })
                    if (that.data.allGoods.length == 0) {
                      editorgoods = true;
                    }
                    that.getTotalPrice(-1, -1);
                    getApp().wxToast({
                      title: '移除成功', //标题，不写默认正在加载
                      duration: 1000, //延时关闭，默认2000
                      tapClose: false //点击关闭，默认false
                    });
                  } else {
                    getApp().wxToast({
                      title: res.data.msg, //标题，不写默认正在加载
                      duration: 2000, //延时关闭，默认2000
                      tapClose: false //点击关闭，默认false
                    });
                  }
                  if (that.data.allGoods.length == 0) {
                    that.setData({
                      selectAllStatus: false,
                      editorgoods: false,
                      hidedel: true,
                      delOrder: true,
                      page: that.data.pages - 1
                    })
                    editorgoods = true;
                  }
                } else if (res.statusCode == 401) {
                  wx.redirectTo({
                    url: '../login/login' ///关闭当前页面，跳转到应用内的某个页面
                  })
                }
              }
            })
          }
        }
      })
    } else {
      getApp().wxToast({
        title: '请选择要删除的商品', //标题，不写默认正在加载
        duration: 1000, //延时关闭，默认2000
        tapClose: false //点击关闭，默认false
      });
    }
  },
  //上一页
  prev: function () {
    let that = this;
    if (that.data.page > 1) {
      that.setData({
        allGoods: [],
        bj: true,
        page: that.data.page - 1,
        index: that.data.page - 2,
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.showShoppingCartDetailPage();
      // }
    } else {
      if (that.data.pages == 1) {
        that.setData({
          page: 1,
          noclick_prev: 'noclick_prev',
          noclick_next: 'noclick_next',
        });
      } else {
        that.setData({
          page: 1,
          noclick_prev: 'noclick_prev',
          noclick_next: '',
        });
      }
    }
  },
  //下一页
  nextPage: function () {
    let that = this;
    if (that.data.page < that.data.pages) {
      that.setData({
        bj: true,
        allGoods: [],
        page: that.data.page + 1,
        index: that.data.page,
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1
      })
      that.showShoppingCartDetailPage();
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
    let page = parseInt(e.detail.value) + 1;
    //that.data.array.length = 0;
    //先将页面清空
    that.setData({
      allGoods: []
    })
    that.setData({
      page: page,
      index: page,
      bj: true
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 1
    })
    that.showShoppingCartDetailPage();
  },
  /// 下拉刷下
  onPullDownRefresh: function () {
    let that = this;
    // wx.startPullDownRefresh()
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    that.setData({
      page: 1,
      index: that.data.page,
      allGoods: [],
      bj: true
    });
    that.showShoppingCartDetailPage()
    wx.stopPullDownRefresh() //停止下拉刷新    
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    let that = this;
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.scrollTop > 50) {
      if (that.data.goNav == 'com-widget-goNav') { } else {
        that.setData({
          goNav: 'com-widget-goNav'
        });
      }
    } else {
      if (that.data.goNav == 'com-widget-goNav') {
        that.setData({
          goNav: ''
        });
      }
    }
    if (e.scrollTop > 500) {
      that.setData({
        floorstatus: 'showFooterCss'
      });
    } else {
      that.setData({
        floorstatus: '',
      });
    }
  },
})