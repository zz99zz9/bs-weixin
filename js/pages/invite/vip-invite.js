var user = Storage.getLocal('user');

var vmInvite = avalon.define({
    $id: 'invite',
    bAward: 0,
    gAward: 0,
    sAward: 0,
    getAward: function() {
        ajaxJsonp({
            url: urls.getDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    json.data.map(function(card) {
                        switch(card.name) {
                            case '黑卡':
                                vmInvite.bAward = round(card.inviterKickbackRate * card.amount);
                                break;
                            case '金卡':
                                vmInvite.gAward = round(card.inviterKickbackRate * card.amount);
                                break;
                            case '银卡':
                                vmInvite.sAward = round(card.inviterKickbackRate * card.amount);
                                break;
                        }
                    });
                }
            }
        });
    },
    code: '',
    url: urlWeixin + '/inviteToVip.html',
    inviterName: user?(user.nickname?user.nickname:user.name):'好友',
    getInviteCode: function() {
        //获取邀请码
        ajaxJsonp({
            url: urls.getInviteCode,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmInvite.code = json.data;
                    vmInvite.url += '?code=' + json.data;

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
                                title: '本宿VIP会员卡', // 分享标题
                                link: vmInvite.url, // 分享链接
                                imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert('分享成功', function() {
                                        vmInvite.isShowMask = false;
                                    });
                                },
                                cancel: function() {
                                    console.log('取消分享到朋友圈');
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: '本宿VIP会员卡', // 分享标题
                                desc: '遵本心，轻奢宿，快来成为本宿VIP会员吧 --' + vmInvite.inviterName, // 分享描述
                                link: vmInvite.url, // 分享链接
                                imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert('分享成功', function() {
                                        vmInvite.isShowMask = false;
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
    clickLog: function() {
        popover('./util/vip-invite-log.html', 1);
    },
    isShowMask: false,
    maskToggle: function() {
        vmInvite.isShowMask = !vmInvite.isShowMask;
    }
});
vmInvite.getAward();
vmInvite.getInviteCode();

//过去的邀请
var vmOldInvite = avalon.define({
    $id: 'oldInvite',
    list: [],
    count: 0,
    awardAmount: 0,
    getInfo: function() {
        ajaxJsonp({
            url: urls.getInviteVIPLogList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmOldInvite.list = json.data.list;
                    vmOldInvite.count = json.data.count;
                }
            }
        });

        ajaxJsonp({
            url: urls.getInviteVIPAward,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmOldInvite.awardAmount = json.data.kickback;
                }
            }
        });
    }
});

vmOldInvite.getInfo();

//弹出框的确定按钮
var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})
