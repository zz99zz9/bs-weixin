//var hotel = controlCore.getHotel();

// var articleid = getParam("id");
// if (articleid != "") {
//     if (isNaN(articleid)) {
//         location.href = document.referrer || "homepage.html";
//     } else {
//         articleid = parseInt(articleid);
//     }
// } else {
//     articleid = 0;
// }
var currentRoom = getGuest();

var vmServiceOrderList = avalon.define({
    $id: 'serviceOrderList',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    oid: 0, //订单id
    orid: 0, //订单房间id
    rid: 0, //房间id
    getData: function() {
        ajaxJsonp({
            url: urls.getWaitRoomList,
            successCallback: function(json) {
                if (json.status === 1) {
                    var length = json.data.length;
                    if (length === 0) { //没订房的
                        location.href = "../goBooking.html";
                    } else {
                        vmServiceOrderList.data = json.data;
                        json.data.map(function(e) {
                            if (e.customerStatus == 1) { //本人是入住人 存订单id、订单房间id、和房间id
                                if (e.processStatus == 3) { //已开房
                                    location.href = "../inroom.html";
                                } else if (e.processStatus == 2) { //已回答问题，未开房
                                    location.href = "../service/ready.html";
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    isSend: 0, //0-不显示  1-显示
    sendBtnText: '发送订单',
    send: function(isMe, oid, orid, rid) { //发送订单
        stopSwipeSkip.do(function() {
            if (isMe == 1) {
                location.href = "process.html";
            } else {
                vmServiceOrderList.oid = oid;
                vmServiceOrderList.orid = orid;
                vmServiceOrderList.rid = rid;
                Storage.set('guest', { oid: oid, orid: id, rid: rid });
                if (vmServiceOrderList.isSend === 0) {
                    vmServiceOrderList.isSend = 1;
                } else {
                    vmServiceOrderList.isSend = 0;
                }
            }
        });
    },
    close: function() {
        vmServiceOrderList.isSend = 0;
    },
});
vmServiceOrderList.getData();

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
            title: '发送订单', // 分享标题
            link: location.href + "?oid=" + vmServiceOrderList.oid + "&orid=" + vmServiceOrderList.orid + "&rid=" + vmServiceOrderList.rid, // 分享链接
            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
                mui.alert("感谢您的厚爱与支持");
            },
            cancel: function() {
                console.log('取消分享到朋友圈');
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title: '发送订单', // 分享标题
            desc: '分享住房呀', // 分享描述
            link: location.href + "?oid=" + vmServiceOrderList.oid + "&orid=" + vmServiceOrderList.orid + "&rid=" + vmServiceOrderList.rid, // 分享链接
            imgUrl: urlWeixin + '/img/logo.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                mui.alert("感谢您的厚爱与支持");
            },
            cancel: function() {
                console.log("取消分享到个人");
                // 用户取消分享后执行的回调函数
            }
        });
    });
});
