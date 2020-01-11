// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['iconfont', 'icon-pinglun','icon-fenxiang'],
  properties: {
    blogId: String,
    blog: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 登录组件是否显示
    loginShow:false,
    // 底部弹出层是否显示
    modalShow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      //判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if(res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                //显示弹出层
                this.setData({
                  modalShow:true
                })
              }
            })
          } else {
            this.setData({
              loginShow:true
            })
          }
        }
      })
    },
    onLoginsuccess(event) {
      userInfo = event.detail
      this.setData({
        loginShow: false,
      },() => {
        this.setData({
          modalShow: true,
        })
      })
    },
    onLoginfail() {
      wx.showModal({
        title: '授权用户才能评论',
        content: '',
      })
    },
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },

    onSend(event) {
      console.log(event)
      // 1.插入数据库
      let content = this.data.content
      if (content.trim() =='') { 
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }

      wx.showToast({
        title: '评论中',
        mask:true
      })

      //在小程序中实现插入数据到数据库
      db.collection('blog-comment').add({
        data: {
          content,
          createTime:db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content:''
        })
        //刷新评论页面
        this.triggerEvent('refreshCommentList')
      })

      // 2、推送模板信息

    },
  }
})
