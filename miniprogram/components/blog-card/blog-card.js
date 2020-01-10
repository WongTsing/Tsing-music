// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: {
      type:Object
    }
  },
  //格式化时间
  observers: {
    ['blog.createTime'](val) {
      if(val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
        
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {
      // 查看图片
      const ds = event.target.dataset;
      wx.previewImage({
        urls: ds.imgs,
        current:ds.imgsrc
      })
    }
  }
})
