// pages/my/redAppliate/service/service.js
Page({
  data: {

  },
  // 电话联系
  call() {
    wx.makePhoneCall({
      phoneNumber: '18636718507'
    })
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  },
})