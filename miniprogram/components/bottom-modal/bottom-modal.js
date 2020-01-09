// components/bottom-modal/bottom-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },
  options: {
    styleIsolation:'apply-shared',//使用外部样式声明
    multipleSlots: true  //使用多个具名插槽之前，先声明multipleSlots
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
    onClose() {
      this.setData({
        modalShow:false,
      })
    }
  }
})
