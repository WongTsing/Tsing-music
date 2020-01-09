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
        formatTime(new Date(val))
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
