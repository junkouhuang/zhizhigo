Page({
  data: {
    historyData: {}, //用于页面赋值
    searchText:'',
    jsonData1:[],
    jsonData2: []
  },
  onShow: function() {
    let that = this;
    that.data.searchTex='';
    //初始化文本输入框
    wx.getStorage({
      key: 'listoryData2',
      success: function(res) {
        let data=new Array();
        data=res.data;
        for (var i = data.length-1;i>=0;i--){
          if(data[i].name==""){
            data.splice(i,1);
          }
        }
        that.setData({
          historyData2:data
        })
      },
    })
  },
  saveToStroge: function(e) {
    let that = this;
    that.data.searchText = e.detail.value;
    
  },
  //清除
  clear: function() {
    let that = this;
    wx.removeStorage({
      key: 'listoryData1',
      success: function(res) {
        console.log("清除缓存1成功");
      }
    })
    wx.removeStorage({
      key: 'listoryData2',
      success: function (res) {
        that.setData({
          historyData2: ''
        })
        getApp().wxToast({
          title: '清除成功！', //标题，不写默认正在加载
          contentClass: 'content', //内容添加class类名
          duration: 1000, //延时关闭，默认2000
          tapClose: false //点击关闭，默认false
        });
      }
    })
  },
  searchBtn: function() {
    let that=this;
    wx.getStorage({
      key: 'listoryData1',
      success: function (res) {
          that.data.jsonData1 = res.data;
          if (that.data.searchText != "") {
            let flag=true;
            for (var i in that.data.jsonData1) {
              if (JSON.stringify(that.data.jsonData1[i].name).replace(/\"/g, "") == that.data.searchText) {
               flag=false;
               //删除再插入
                 that.data.jsonData1.splice(i, 1);
                 that.data.jsonData1.unshift({ "name": that.data.searchText, "lx": 'text' });
              }
            }
            if(flag){
              that.data.jsonData1.unshift({ "name": that.data.searchText, "lx": 'text' });
            }
          }else{
            that.data.jsonData1.unshift({ "name": '', "lx": '' });
          }
          wx.setStorage({
           key: 'listoryData1',
           data: that.data.jsonData1 //用于控制缓存的数据条数
          })
          wx.redirectTo({
            url: '../subclass/subclass'
          })

      },
      fail: function () {
        if (that.data.searchText != "") {
          that.data.jsonData1.push({ "name": that.data.searchText, "lx": 'text' })
          wx.setStorage({
            key: 'listoryData1',
            data: that.data.jsonData1
          })

        }else{
          that.data.jsonData1.push({ "name": '', "lx": "" });
          wx.setStorage({
            key: 'listoryData1',
            data: that.data.jsonData1
          })
        }
        wx.redirectTo({
          url: '../subclass/subclass'
        })
      }

    })


    wx.getStorage({
      key: 'listoryData2',
      success: function (res) {
        that.data.jsonData2 = res.data;
        if (that.data.searchText != "") {
          let flag = true;
          for (var i in that.data.jsonData2) {
            if (JSON.stringify(that.data.jsonData2[i].name).replace(/\"/g, "") == that.data.searchText) {
              flag = false;
              //删除再插入
              that.data.jsonData2.splice(i, 1);
              that.data.jsonData2.unshift({ "name": that.data.searchText, "lx": 'text' });
            }
          }
          if (flag) {
            that.data.jsonData2.unshift({ "name": that.data.searchText, "lx": 'text' });
          }
        } else {
          that.data.jsonData2.unshift({ "name": '', "lx": '' });
        }
        wx.setStorage({
          key: 'listoryData2',
          data: that.data.jsonData2 //用于控制缓存的数据条数
        })
        wx.setStorage({
          key: 'listoryData2',
          data: that.data.jsonData2 //用于控制缓存的数据条数
        })

      },
      fail: function () {
        if (that.data.searchText != "") {
          that.data.jsonData2.push({ "name": that.data.searchText, "lx": 'text' })
          wx.setStorage({
            key: 'listoryData2',
            data: that.data.jsonData2
          })
        } else {
          that.data.jsonData2.push({ "name": '', "lx": "" });
        }
      }
    })

  },
  listroyClick: function(e) {
    let that=this;
    //普通文本
    let data=e.currentTarget.dataset.value;
    wx.getStorage({
      key: 'listoryData1',
      success: function (res) {
 
          that.data.jsonData1 = res.data
          if (e.currentTarget.dataset.lx == 'text') {
            for (var i in that.data.jsonData1) {
              if (JSON.stringify(that.data.jsonData1[i].name).replace(/\"/g, "") == data) {
                //删除再插入
                  that.data.jsonData1.splice(i, 1);
                  that.data.jsonData1.unshift({ "name": data, "lx": 'text' });
                
            }
            }
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.jsonData1
            })
            wx.redirectTo({
              url: '../subclass/subclass' 
            })
          }
          //条码
          else {
            for (var i in that.data.jsonData1) {
                if (JSON.stringify(that.data.jsonData1[i].name).replace(/\"/g, "") == data){
                //删除再插入
                  that.data.jsonData1.splice(i, 1);
                  that.data.jsonData1.unshift({ "name": data, "lx": 'barcode' });
                }
                
            }
            wx.setStorage({
              key: 'listoryData1',
              data: that.data.jsonData1
            })
            wx.redirectTo({
              url: '../subclass/subclass' 
            })
          }  

      }
    })

  },
  sigleDel:function(e){
    let that=this;
    let name = e.currentTarget.dataset.name;

    wx.getStorage({
      key: 'listoryData1',
      success: function (res) {
        that.data.jsonData1 = res.data
        if(that.data.jsonData1.length>0){
          for (var i in that.data.jsonData1) {
            if (JSON.stringify(that.data.jsonData1[i].name).replace(/\"/g, "") == name) {
              that.data.jsonData1.splice(i, 1);
            }
          }
        }else{
          wx.removeStorage({
            key: 'listoryData1',
            success: function (res) {
              console.log("1已经全部清除");
            },
          })
        }
        wx.setStorage({
          key: 'listoryData1',
          data: that.data.jsonData1
        })
      }
    })

    wx.getStorage({
      key: 'listoryData2',
      success: function (res) {
        that.data.jsonData2 = res.data
        if (that.data.jsonData2.length>0){
          for (var i in that.data.jsonData2) {

            if (JSON.stringify(that.data.jsonData2[i].name).replace(/\"/g, "") == name) {
              that.data.jsonData2.splice(i, 1);
            }
          }

        }else{
          wx.removeStorage({
            key: 'listoryData2',
            success: function (res) {
              console.log("2已经全部清除");
            },
          })
        }

        that.setData({
          historyData2: that.data.jsonData2
        })
        wx.setStorage({
          key: 'listoryData2',
          data: that.data.jsonData2
        })
      }
    })
    
    
  }
})