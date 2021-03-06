// components/progress-bar/progress-bar.js
let movableAreaWidth = 0;
let movableViewWidth = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1;//当前秒数
let duration = 0;//歌曲总时长，秒为单位
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime:"00:00",//开始时间
      totalTime:"00:00" //总时间
    },
    movableDis:0,
    progress:0
  },
  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
      }
      this._getMovableDis();
      this._bindBGMEvent()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //手动拖动进度条
    onChange(event) {
      console.log(event);
      //拖动产效果
      if(event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth-movableViewWidth) * 100,
        this.data.movableDis = event.detail.x
        isMoving =true
      }
    },
    //手动拖动进度条释放的时候触发
    onTouchEnd() {
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
      // console.log('end', isMoving)
    },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect();
      query.select('.movable-view').boundingClientRect();
      query.exec((rect) => {
        console.log(rect)
        movableAreaWidth = rect[0].width;
        movableViewWidth = rect[1].width;
        console.log(movableAreaWidth, movableViewWidth)
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay')
        console.log(backgroundAudioManager.duration)
        if (typeof backgroundAudioManager.duration == undefined) {
          this._setTime()
        }else {
          setTimeout(()=> {
            this._setTime()
          },1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        if(!isMoving) {
          const currentTime = backgroundAudioManager.currentTime;//进度时间
          const duration = backgroundAudioManager.duration;
          const sec = currentTime.toString().split('.')[0]
          if(sec != currentSec) {
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currentSec =sec;
            //联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
        wx.showToast({
          title: '错误'+ res.errCode,
        })
      })

    },
    _setTime() {
      duration = backgroundAudioManager.duration
      console.log(duration)//歌曲总时间
      const durationFmt = this._dateFormat(duration)
      console.log(durationFmt)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`,
      })
    },
    // 格式化时间
    _dateFormat(sec) {
      const min = Math.floor(sec / 60);
      sec = Math.floor(sec% 60);
      return {
        'min': this._paese0(min),
        'sec':this._paese0(sec),
      }
    },
    //补0
    _paese0(sec) {
      return sec < 10 ? '0' +sec : sec
    }
  }
})
