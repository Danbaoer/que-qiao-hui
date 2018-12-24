// pages/interest/interest.js
const app = getApp()
let baseApiUrl = require('../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {
    uploadUrl: baseApiUrl.config().uploadUrl,
    attentionMe: [],
    attentionMeCount:0,
    myAttention: [],
    myAttentionCount: 0,
    selectedPage: 1,
    selected1Page: 1,
    tab:'selected',
    token: '',
    loading:1,
  },
  selected: function (e) {
    this.setData({
      tab:'selected',
    })
  },
  selected1: function (e) {
    this.setData({
      tab:'selected1',
    })
  },
  //转发
  onShareAppMessage(res) {
    return app.shareMessage()
  },
  //跳转到登录
  toLogin () {
    wx.switchTab({
      url: '../my/my',
    })
  },
  //查看个人信息详情
  showDetail(e) {
    let that = this
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../index/detail/detail?id=' + id,
    })
  },
  //点击留言
  leaveMessage: function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../index/detail/words/words?id=' + id,
    })
  },
  //取消关注
  toggleFollow: function (event) {
    let that = this
    var token = wx.getStorageSync('token');
    wx.showModal({
      content: '确定取消关注吗？',
      success (res) {
        if (res.confirm) {
          let id = event.target.id
          wx.request({
            url: url + '/member/attention',
            data: {touid: id,token:token,status:0},
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            success(res) {
              that.setData({
                myAttention: res.data.message
              })
              // 我关注的
              wx.request({
                url: url + "/member/attention_members",
                method: 'post',
                data: { token: that.data.token },
                header: {
                  "Content-Type": "application/json"
                },
                success(res) {
                  that.setData({
                    myAttention: res.data.message
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
  onShow: function () {
    let that = this
    var token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        token: token
      })
    }
  	this.getAttentionMembers();
  	this.getAttentionedMembers();
  },
  getAttentionedMembers:function() {
  	var that = this;
  	if(that.data.selectedLoading == 0) {
  		return false;
  	}
  	// 关注我的
  	wx.showToast({title:"加载中",icon:'loading'});
  	that.setData({selectedLoading:0});
    wx.request({
      url: url + "/member/attentioned_members",
      method: 'post',
      data: {token: that.data.token,page:that.data.selectedPage},
      header: {
        "Content-Type": "application/json"
      },
      success (res) {
      	wx.hideToast();
      	if(res.data.code == 0) {
      		var attentionMe = that.data.attentionMe;
      		if(res.data.message.length > 0) {
      			attentionMe = attentionMe.concat(res.data.message);
      			that.setData({
		          attentionMe:attentionMe,
              attentionMeCount:res.data.count,
		          selectedLoading:1,
		          selectedPage: that.data.selectedPage + 1
		        })
      		}
      	}
      }
    })
  },

  getAttentionMembers:function() {
  	var that = this;
  	if(that.data.selected1Loading == 0) {
  		return false;
  	}
  	// 关注我的
  	wx.showToast({title:"加载中",icon:'loading'});
  	that.setData({selected1Loading:0});
  	// 我关注的
    wx.request({
      url: url + "/member/attention_members",
      method: 'post',
      data: {token: that.data.token,page:that.data.selected1Page},
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
      	wx.hideToast();
      	if(res.data.code == 0) {
      		var myAttention = that.data.myAttention;
      		if(res.data.message.length > 0) {
      			myAttention = myAttention.concat(res.data.message);
      			that.setData({
      				myAttention:myAttention,
              myAttentionCount:res.data.count,
      				selected1Loading:1,
      				selected1Page: that.data.selected1Page + 1
      			})
      		}
      	}
      }
    })
  }
})