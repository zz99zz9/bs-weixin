var user = Storage.getLocal('user');

var vmRechargeFriend = avalon.define({
	$id: 'rechargeFriend',
	code: '',
    //url: urlWeixin + '/inviteToRecharge.html',
    url: urlWeixin + '/inviteToRecharge.html',
    inviterName: user?(user.nickname?user.nickname:user.name):'好友',
    getInviteCode: function() {
        //获取邀请码
        ajaxJsonp({
            url: urls.getInviteCode,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmRechargeFriend.code = json.data;
                    vmRechargeFriend.url += '?code=' + json.data;
                    registerWeixinConfig(function() {
                        wx.ready(function() {
                            //隐藏菜单项
                            wx.hideMenuItems({
                                menuList: [
                                    "menuItem:share:qq", // 分享到QQ
                                    "menuItem:share:weiboApp", // 分享到Weibo
                                    "menuItem:share:QZone" // 分享到 QQ 空间
                                ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                            });

                            wx.onMenuShareTimeline({
                                title: '成为D&K会员', // 分享标题
                                link: vmRechargeFriend.url, // 分享链接
                                imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert('分享成功', function() {
                                        vmRechargeFriend.isShowMask = false;
                                    });
                                },
                                cancel: function() {
                                    console.log('取消分享到朋友圈');
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: 'D&K会员邀请', // 分享标题
                                desc: vmRechargeFriend.inviterName + '邀请您成为D&K客房的会员，点击立即前往', // 分享描述
                                link: vmRechargeFriend.url, // 分享链接
                                imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert('分享成功', function() {
                                        vmRechargeFriend.isShowMask = false;
                                    });
                                },
                                cancel: function() {
                                    console.log("取消分享到个人");
                                    // 用户取消分享后执行的回调函数
                                }
                            });   
                        });
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
	isShowMask: false,
	sendInvition: function(){
		vmRechargeFriend.isShowMask = !vmRechargeFriend.isShowMask;
	},
});

vmRechargeFriend.getInviteCode();

var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});
