// pages/blog/blog.js
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,
    blogList: []
  },
  onPublish() {
    wx.getSetting({
      success:(res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success:(res) => {
              console.log(res)
              this.onLoginsuccess({
                detail:res.userInfo,
              })
            }
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  onLoginsuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginfail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },
  onSearch(event) {
    console.log(event.detail.keyWord)
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyWord
    this._loadBlogList(0)
  },

  //加载博客列表
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url: 'list',//指定路由名称list(在云函数blog index的router)
        start,
        count:10,
        keyword,
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result) //在原来的列表上使用concat()方法追加数据
      })
      wx.hideLoading();
      wx.stopPullDownRefresh()
    })
  },

  // 查看详情
  goComment(event) {
    console.log(event)
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
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
    this.setData({
      blogList: [],
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path:`/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl:''
    }
  }
})