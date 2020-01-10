// components/search/search.js
let keyWord = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:"请输入关键字"
    }
  },
  //接收外部传入外部样式
  externalClasses:[
    'iconfont',
    'icon-search'
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyWord = event.detail.value
    },
    onSearch() {
      //查询云数据库
      this.triggerEvent('search',{
        keyWord
      })
    }
  }
})
