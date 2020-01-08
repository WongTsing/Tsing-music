// pages/player/player.js
let musiclist = [];
let nowPlayingIndex = 0;
//获取全局唯一位移音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying:false, //是否播放
    isLyricShow: false, //歌词是否显示
    lyric:'',
    isSame:false //是否同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index;
    // 歌曲存储到本地
    musiclist = wx.getStorageSync('musiclist') 
    this._loadMusicDetail(options.musicId)
  },
  // 加载歌曲
  _loadMusicDetail(musicId) {
    if(musicId == app.getPlayMusicId()) {
      this.setData({
        isSame:true
      })
    }else {
      this.setData({
        isSame:false
      })
    }
    if(!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    
    let music = musiclist[nowPlayingIndex]
    console.log(music)

    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying:false
    })

    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'music',
      data: {
        $url:'musicUrl',
        musicId: musicId,
      }
    }).then((res) => {
      console.log(res)
      console.log(JSON.parse(res.result))
      const result = JSON.parse(res.result) 
      if(!this.data.isSame) {
        backgroundAudioManager.src = result.data[0].url;
        backgroundAudioManager.title = music.name;
        backgroundAudioManager.coverImgUrl = music.al.picUrl;
        backgroundAudioManager.singer = music.ar[0].name;
        backgroundAudioManager.epname = music.al.name;
      } 
      

      this.setData({
        isPlaying:true
      })
      wx.hideLoading()
      //加载歌词
      wx.cloud.callFunction({
        name:'music',
        data: {
          musicId:musicId,
          $url: 'lyric',
        }
      }).then((res) => {
        console.log(res)
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc;
        if(lrc) {
          lyric = lrc.lyric;
        }
        this.setData({
          lyric: lyric
        })
      })
    })
  },
  togglePlaying()  {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
    }else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev() {
    nowPlayingIndex--;
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext() {
    nowPlayingIndex++;
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  //歌词点击显示
  onchengeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying:true
    })
  },
  onPause() {
    this.setData({
      isPlaying:false
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})