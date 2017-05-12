/**
 * Created by zwh on 2017/4/20
 * Edited by zwh on 2017/5/8
 */

var vmFooter = avalon.define({
    $id: 'footer',
    headUrl: '../img/icon/icon-home.svg',
    checkinUrl: '../img/icon/icon-ruzhu.svg',
    orderUrl: '../img/icon/icon-dingdan.svg',
    moreUrl: '../img/icon/icon-more.svg',
    list: [
        { value: -1, url: '../img/icon/icon-home-select.svg' },
        { value: 1, url: '../img/icon/icon-ruzhu-select.svg' },
        { value: 2, url: '../img/icon/icon-dingdan-select.svg' },
        { value: 3, url: '../img/icon/icon-more-select.svg' }
    ],
    goIndex: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        });
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.getWaitRoomList,
                successCallback: function(json) {
                    if (json.status === 1) {
                        var length = json.data.length;
                        if (length == 0) { //没订房的
                            location.href = "../goBooking.html";
                        } else {
                            json.data.map(function(e) {
                                if (e.customerStatus == 1) {
                                    if (e.processStatus == 3) {  //存订单房间id和房间id
                                        Storage.set('guest', {orid: e.id, rid: e.rid});
                                        location.href = "../inroom.html";
                                    } else if (e.processStatus == 2) { 
                                        Storage.set('guest', {orid: e.id, rid: e.rid});
                                        location.href = "../service/ready.html";
                                    } else {
                                        Storage.set('guest', {orid: e.id, rid: e.rid});
                                        location.href = "../service/orderList.html";
                                    }
                                }
                            });
                            location.href = "../service/orderList.html";
                        }
                    }
                }
            });
        });
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../orderList.html";
        })
    },
    goMore: function() {
        stopSwipeSkip.do(function() {
            location.href = "../more.html";
        })
    },
    judgeSelect: function() {
        var path = window.location.pathname;
        if (path.indexOf('index.html') > -1 || path == '/') {
            vmFooter.headUrl = vmFooter.list[0].url;
        } else if (path.indexOf('service/orderList.html') > -1 || path.indexOf('service/ready.html') > -1 || path.indexOf('inroom.html') > -1) {
            vmFooter.checkinUrl = vmFooter.list[1].url;
        } else if (path.indexOf('orderList.html') > -1 || path.indexOf('checkOut.html') > -1) {
            vmFooter.orderUrl = vmFooter.list[2].url;
        } else if (path.indexOf('more.html') > -1) {
            vmFooter.moreUrl = vmFooter.list[3].url;
        }
    }
});
vmFooter.judgeSelect();
