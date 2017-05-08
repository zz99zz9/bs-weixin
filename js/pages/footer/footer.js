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
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "../service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
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
        } else if (path.indexOf('newOrderList.html') > -1 || path.indexOf('checkOut.html') > -1) {
            vmFooter.orderUrl = vmFooter.list[2].url;
        } else if (path.indexOf('more.html') > -1) {
            vmFooter.moreUrl = vmFooter.list[3].url;
        }
    }
});
vmFooter.judgeSelect();
