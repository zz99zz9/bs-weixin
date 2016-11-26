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
    shareID: shareID,
    data: {},
    list: [{
        id: 1,
        src: 'http://www.bensue.com/article.html?id=1',
        title: '酒店品牌能否对接共享经济',
        desc: '这是一个产业升级的时代，赋予了我们创新的机会；这是一个消费升级的时代，给予了我们创新的理由。分享经济能否对接传统酒店？',
        imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
        link: 'http://mp.weixin.qq.com/s/2UENgugjioKC19YR5P7vSg'
    },{
        id: 2,
        src: 'http://www.bensue.com/article.html?id=2',
        title: '我们希望能够改变什么？',
        desc: '诺基亚认为手机是通讯工具，而老乔却认为手机是生活和娱乐的工具。传统酒店认为酒店是住宿空间，而本宿却认为酒店是生活和娱乐的空间，是人们生活方式的延展。',
        imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
        link: 'http://mp.weixin.qq.com/s/Ewjocde0dHGqpNVZo6UHJw'
    },{
        id: 3,
        src: 'http://www.bensue.com/article.html?id=3',
        title: '我们希望能够帮助什么',
        desc: '大家都知道变革的时代来了，却依然选择再次等待。各种酒店不良报道的背后是高昂的成本导致从业者的慌不择路',
        imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
        link: 'http://mp.weixin.qq.com/s/EjEZBeyTpkdGrO4fHhUTLg'
    }],
    getData: function() {
        vmShare.data = vmShare.list[shareID-1];

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
                    title: vmShare.data.title, // 分享标题
                    link: vmShare.data.link, // 分享链接
                    imgUrl: vmShare.data.imgUrl, // 分享图标
                    success: function() {
                        ajaxJsonp({
                            url: urls.submitPromoteTaskList,
                            data: { pid: ptid },
                            successCallback: function(json) {
                                if (json.status == 1) {
                                    // 用户确认分享后执行的回调函数
                                    mui.alert("分享成功，感谢您的支持", "任务完成", function() {
                                        location.href = "../promotion-detail.html";
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
                    title: vmShare.data.title, // 分享标题
                    desc: vmShare.data.desc, // 分享描述
                    link: vmShare.data.link, // 分享链接
                    imgUrl: vmShare.data.imgUrl, // 分享图标
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
    },
});

vmShare.getData();

