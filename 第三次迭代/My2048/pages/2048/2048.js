// pages/2048/2048.js
var Grid = require('./grid.js');
var Tile = require('./tile.js');
var GameManager = require('./game_manager.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,

    grid: [],
    over: false,
    win: false,
    score: 0,
    best_score: 0,
    overMessage: 'Playing~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.GameManager = new GameManager();
    this.setData({
      grid: this.GameManager.setup(),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var that = this;
    that.setData({
      hidden: true
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  updateView: function (data) {
    if (data.over) {
      data.overMessage = 'Game Over!';
    }
    if (data.win) {
      data.overMessage = 'You Win!';
    }
    this.setData(data);
  },

  restart: function () {
    this.updateView({
      grid: this.GameManager.restart(),
      over: false,
      won: false,
      score: 0,
      overMessage: 'Playing~'
    })
  },

  returnHome: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  touchStartClienX: 0,
  touchStartClientY: 0,
  touchEndClientX: 0,
  touchEndClientY: 0,
  isMultiple: false,

  touchStart: function (events) {
    this.isMultiple = events.touches.length > 1;
    if (this.isMultiple) {
      return;
    }
    var touch = events.touches[0];
    this.touchStartClientX = touch.clientX;
    this.touchStartClientY = touch.clientY;
  },

  touchMove: function (events) {
    var touch = events.touches[0];
    this.touchEndClientX = touch.clientX;
    this.touchEndClientY = touch.clientY;
  },

  touchEnd: function (events) {
    if (this.isMultiple) {
      return;
    }
    var dx = this.touchEndClientX - this.touchStartClientX;
    var dy = this.touchEndClientY - this.touchStartClientY;

    if (Math.max(Math.abs(dx), Math.abs(dy)) > 10) {
      var direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      var data = this.GameManager.move(direction) || {
        grid: this.data.grid,
        over: this.data.over,
        won: this.data.won,
        score: this.data.score
      };

      this.updateView({
        grid: data.grid,
        over: data.over,
        won: data.won,
        score: data.score,
      });
    }
  }
});