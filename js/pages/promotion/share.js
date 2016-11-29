var ptid = getParam('ptid');
if (ptid != "") {
    if (isNaN(ptid)) {
        location.href = document.referrer || "index.html";
    } else {
        ptid = parseInt(ptid);
    }
} else {
    location.href = "index.html";
}

var shareID = getParam('id');
if (shareID != "") {
    if (isNaN(shareID)) {
        location.href = document.referrer || "index.html";
    } else {
        shareID = parseInt(shareID);
    }
} else {
    location.href = "index.html";
}

var vmShare = avalon.define({
    $id: 'share',
    isShowMask: true,
    maskHide: function() {
        vmShare.isShowMask = false;  
    },
    shareID: shareID,
    data: {},
    getData: function() {
        ajaxJsonp({
            url: urls.getShareData,
            data: { id: shareID },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmShare.data = json.data;

                    registerWeixinConfig(function() {
                        wx.ready(function() {

                            //隐藏菜单项
                            wx.hideMenuItems({
                                menuList: [
                                        "menuItem:share:qq", // 分享到QQ
                                        "menuItem:share:weiboApp", // 分享到Weibo
                                        "menuItem:share:QZone", // 分享到 QQ 空间
                                        // "menuItem:share:appMessage" // 分享到 朋友
                                    ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                            });

                            wx.onMenuShareTimeline({
                                title: vmShare.data.shareTitle, // 分享标题
                                link: vmShare.data.wxUrl, // 分享链接
                                imgUrl: urlAPINet + vmShare.data.shareImg, // 分享图标
                                success: function() {
                                    ajaxJsonp({
                                        url: urls.submitPromoteTaskList,
                                        data: { pid: ptid, mid: shareID },
                                        successCallback: function(json) {
                                            if (json.status == 1) {
                                                // 用户确认分享后执行的回调函数
                                                mui.alert("分享成功，感谢您的支持", "任务完成", function() {
                                                    history.go(-1);
                                                });
                                            } else {
                                                mui.alert(json.message);
                                            }
                                        }
                                    });
                                },
                                cancel: function() {
                                    console.log('取消分享到朋友圈');
                                    // 用户取消分享后执行的回调函数
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: vmShare.data.shareTitle, // 分享标题
                                desc: vmShare.data.shareContent, // 分享描述
                                link: vmShare.data.wxUrl, // 分享链接
                                imgUrl: urlAPINet + vmShare.data.shareImg, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert("分享成功，感谢您的支持（如果你在做推广任务，需要分享本页面到朋友圈哦～）");
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
});

vmShare.getData();
