// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
// 方式二步骤，第一步：对云数据库初始化
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getListByCloudFn()//云函数端
    // this._getListByMiniprogram()//小程序端调用
  },

  
  _getListByCloudFn() {
    
    wx.showLoading({
      title: '加载中',
    })
    //2 小程序端接收云函数，调用云函数 （方式一：通过云函数端方式查询云数据库）
    wx.cloud.callFunction({
      name:'blog',// 云函数名称
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,//第几条开始取数据
        count:MAX_LIMIT,//每次查询多少条
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })
  },

  // 方式二：通过小程序端方式查询云数据库
  _getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blog').skip(this.data.blogList.length)
      .limit(MAX_LIMIT).orderBy('createTime','desc').get().then((res) => {
      console.log(res)
      let _bloglist = res.data //转换时间格式为数字
      for(let i = 0; i < _bloglist.length; i++) {
        _bloglist[i].createTime = _bloglist[i].createTime.toString()
      }
      this.setData({
        blogList: this.data.blogList.concat(_bloglist)
      })
      wx.hideLoading()
    })
  },
  goComment(event) {
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getListByCloudFn() //云函数端调用
    // this._getListByMiniprogram()//小程序端调用
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `../blog-comment/blog-comment?blogId=${blog._id }`
    }
  }
})