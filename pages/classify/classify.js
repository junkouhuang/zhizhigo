let dataJson=new Array();
let sex='';
let season='';
Page({
    data: {
      indexx: 0,//用于控制左菜单选中后字体的颜色显示
		    scrollTop: 0,
        scrollHeight:0,
        noNetWork: false, //没有网络的时候显示
        id:1, //用做于接口参数，此id为左菜单各类的id
        navLeftItems:[],//左菜单
        navRightItems:[],//右菜单
        cans:[],//用于存放选中哪些选项（四季-1，冬季-2，夏季-3，春秋-4，男-1，女-2）
        sex:'',//性别变量
        season:'',//季节变量
        sexok:true  //默认需要把性别加入过滤器
    },
    
    onLoad: function() {
        let that = this
        that.getSplbPageInfo(0);
        that.getSplbPageInfo(that.data.id);
        that.setData({
          indexx:0
        })
    },

  getSplbPageInfo: function (indexx){
      let that = this;
      let dataLeft=new Array();
      let dataRight = new Array();
      wx.request({
        //获取openid接口  
        url: getApp().globalData.url + '/product/getProductLbInfoByParentid/' + indexx,
        method: 'get',
        data: dataJson,
        header: {
          'content-type': 'application/json',
          'Authorization': 'bearer  ' + getApp().globalData.access_token
        },
        success: function (res) {
          if (res.statusCode == 200){
            if (indexx == 0) {
              for (var i in res.data) {
                dataLeft.push({ "id": res.data[i].id, "desc": res.data[i].lbmc, "productsl": res.data[i].productsl, "sexok": !res.data[i].sexok });
              }
              that.setData({
                navLeftItems: dataLeft,
                scrollHeight: wx.getSystemInfoSync().windowHeight,
                noNetWork: false
              })
            } else {
              for (var i in res.data) {
                dataRight.push({ "id": res.data[i].id, "desc": res.data[i].lbmc, "productsl": res.data[i].productsl, "season": res.data[i].season, "sex": res.data[i].sex, "show": 'true' });
              }
              that.setData({
                navRightItems: dataRight,
                scrollHeight: wx.getSystemInfoSync().windowHeight,
                noNetWork: false
              })

            }

          } else if (res.statusCode == 401) {
            wx.redirectTo({
              url: '../login/login'  ///关闭当前页面，跳转到应用内的某个页面
            })
          }
        },fail:function(){
          that.setData({
            noNetWork:true
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

    // 置中
    goMiddle: function (e) {
      let that=this;
      that.setData({
        season: '',
        sex: '',
        indexx: e.target.dataset.index,
        sexok: e.target.dataset.sexok
      });
      that.getSplbPageInfo(e.target.dataset.id);
      if (e.target.offsetTop > wx.getSystemInfoSync().windowHeight * 0.5){
        that.setData({
          scrollTop:e.target.offsetTop - wx.getSystemInfoSync().windowHeight * 0.5 + 21.5,
        })
        
      }else{
       that.setData({
         scrollTop: 0,
        
       })
      }
    },

    //刷新
    refresh:function(){
      let that = this
      that.setData({
        bj: true
      })
      that.getSplbPageInfo(that.data.indexx);
    },


  f1:function(e){
    let that = this;
    if (that.data.season != e.target.dataset.season){
      that.data.season = e.target.dataset.season;
      that.setData({
        season: that.data.season
      })
    }else{
      that.setData({
        season:''
      })
    }
    
   
    that.data.cans={"season":that.data.season,"sex":that.data.sex}
    if (that.data.sexok) {  //裤子，贴身衣物，外套，裙子，针织衫，鞋履，皮草，童装
    for (var i in that.data.navRightItems){
      //第一种情景，既选中季节也选中性别
      if (that.data.cans.season != '' && that.data.cans.sex!=''){
        if (that.data.navRightItems[i].season != that.data.cans.season || that.data.navRightItems[i].sex != that.data.cans.sex) {
          that.data.navRightItems[i].show = false;
        } else {
          that.data.navRightItems[i].show = true;
        }
      }
      //第二种情景，当选中季节
      else if (that.data.cans.season != '' && that.data.cans.sex == ''){
        if (that.data.navRightItems[i].season != that.data.cans.season ) {
          that.data.navRightItems[i].show = false;
        } else {
          that.data.navRightItems[i].show = true;
        }
      }
      //第三种情景，当选中性别
      else if (that.data.cans.sex != '' && that.data.cans.season == ''){
        if (that.data.navRightItems[i].sex != that.data.cans.sex) {
          that.data.navRightItems[i].show = false;
        } else {
          that.data.navRightItems[i].show = true;
        }
      }
      //第四种情景，都不选
      else{
        that.data.navRightItems[i].show = true;
      }
    
    }
    } else {//配饰品，辅材  男-0  女-0  特殊
      for (var i in that.data.navRightItems) {
        if (that.data.navRightItems[i].season != that.data.cans.season) {
          if (that.data.cans.season==""){
           that.data.navRightItems[i].show = true;
         }else{
           that.data.navRightItems[i].show = false;
         }
        } else {
          that.data.navRightItems[i].show = true;
        }

      }

    }

    that.setData({
      navRightItems: that.data.navRightItems
    })
   
   
  },
  f2: function (e) {
    let that = this;
    if (that.data.sex != e.target.dataset.sex){
      that.data.sex = e.target.dataset.sex;
      that.setData({
        sex: that.data.sex
      })
    }else{
      that.setData({
        sex:''
      })
    }
   
    that.data.cans = { "season": that.data.season, "sex": that.data.sex }
    if (that.data.sexok){  //裤子，贴身衣物，外套，裙子，针织衫，鞋履，皮草，童装
      for (var i in that.data.navRightItems) {
        //第一种情景，既选中季节也选中性别
        if (that.data.cans.season != '' && that.data.cans.sex != '') {
          console.log(that.data.navRightItems[i].season != that.data.cans.season);
          if (that.data.navRightItems[i].season != that.data.cans.season || that.data.navRightItems[i].sex != that.data.cans.sex) {
            that.data.navRightItems[i].show = false;
          } else {
            that.data.navRightItems[i].show = true;
          }
        }
        //第二种情景，当选中季节
        else if (that.data.cans.season != '' && that.data.cans.sex == '') {
          if (that.data.navRightItems[i].season != that.data.cans.season) {
            that.data.navRightItems[i].show = false;
          } else {
            that.data.navRightItems[i].show = true;
          }
        }
        //第三种情景，当选中性别
        else if (that.data.cans.sex != '' && that.data.cans.season == '') {
          if (that.data.navRightItems[i].sex != that.data.cans.sex) {
            that.data.navRightItems[i].show = false;
          } else {
            that.data.navRightItems[i].show = true;
          }
        }
        //第四种情景，都不选
        else {
          that.data.navRightItems[i].show = true;
        }

      }
    } else {//配饰品，辅材  男-0  女-0  特殊
      for (var i in that.data.navRightItems) {
          if (that.data.navRightItems[i].season != that.data.cans.season) {
            if (that.data.cans.season==""){
             that.data.navRightItems[i].show = true;
           }else{
             that.data.navRightItems[i].show = false;
           }
          } else {
            that.data.navRightItems[i].show = true;
          }

      }

    }

    that.setData({
      navRightItems: that.data.navRightItems
    })
  }
})