var vmInvite = avalon.define({
    $id: 'invite',
    code: '',
    url: '',
    getInviteCode: function() {
        //获取邀请码
        ajaxJsonp({
            url: urls.getInviteCode,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmInvite.code = json.data;
                    // vmShare.initUrl();
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
                            
                            //获取分享链接地址
                            ajaxJsonp({
                                url: urls.getRedPacketUrl,
                                data: {
                                    url: urlWeixin + '/inviteToUser.html?code=' + vmInvite.code, //分享页面地址
                                },
                                successCallback: function(json) {
                                    if (json.status === 1) {
                                        vmInvite.url = json.data;

                                        wx.onMenuShareTimeline({
                                            title: '本宿互联网酒店', // 分享标题
                                            link: vmInvite.url, // 分享链接
                                            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                            success: function() {
                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function() {
                                                console.log('取消分享到朋友圈');
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });
                                        wx.onMenuShareAppMessage({
                                            title: '本宿互联网酒店', // 分享标题
                                            desc: '遵本心，轻奢宿', // 分享描述
                                            link: vmInvite.url, // 分享链接
                                            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
                                            type: '', // 分享类型,music、video或link，不填默认为link
                                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                            success: function() {
                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function() {
                                                console.log("取消分享到个人");
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });
                                    }
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
    clickRule: function() {
        popover('./util/user-invite-rule.html', 1);
    },
    clickLog: function() {
        popover('./util/user-invite-log.html', 1);
    },
    isShowMask: true,
    maskToggle: function() {
        vmInvite.isShowMask = !vmInvite.isShowMask;
    }
    // clickShare: function() {
    //         getShareConfig(vmInvite.code);
    //         popover('./util/share.html', 1);
    //         //jiathis_config.url = urlWeixin + "/register-1.html?code="+vmInvite.code;
    //     }
    // shareCode: function() {
    //     getShareConfig();
    // }
});

vmInvite.getInviteCode();

//jiaThis分享链接绑定
// var vmShare = avalon.define({
//     $id: 'share',
//     renrenUrl: '',
//     txweiboUrl: '',
//     sinaUrl: '',
//     qzoneUrl: '',
//     initUrl: function() {
//         vmShare.renrenUrl = 'http://www.jiathis.com/send/?webid=renren&url=http://weixin.bensue.com/index.html' + vmInvite.code + '&title=住本宿,不将就';
//         vmShare.sinaUrl = 'http://www.jiathis.com/send/?webid=tsina&url=http://weixin.bensue.com/index.html' + vmInvite.code + '&title=住本宿,不将就';
//         vmShare.txweiboUrl = 'http://www.jiathis.com/send/?webid=tqq&url=http://weixin.bensue.com/index.html' + vmInvite.code + '&title=住本宿,不将就';
//         vmShare.qzoneUrl = 'http://www.jiathis.com/send/?webid=qzone&url=http://weixin.bensue.com/register-1.html?code=' + vmInvite.code + '&title=住本宿,不将就';
//     }

// });

//过去的邀请
var vmOldInvite = avalon.define({
    $id: 'oldInvite',
    list: [],
    count: 0,
    getInfo: function() {
        ajaxJsonp({
            url: urls.getInvitationLogURL,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmOldInvite.list = json.data.list;
                    vmOldInvite.count = json.data.count;
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
