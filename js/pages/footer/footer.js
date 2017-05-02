var vmFooter = avalon.define({
    $id: 'footer',
    headUrl: '../img/icon/icon-home.svg',
    checkinUrl: '../img/icon/icon-ruzhu.svg',
    orderUrl: '../img/icon/icon-dingdan.svg',
    moreUrl: '../img/icon/icon-more.svg',
    list: [
        {value: 0, url: '../img/icon/icon-home-select.svg'},
        {value: 1, url: '../img/icon/icon-ruzhu-select.svg'},
        {value: 2, url: '../img/icon/icon-dingdan-select.svg'},
        {value: 3, url: '../img/icon/icon-more-select.svg'}
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
    address: '',
    judgeSelect: function() {
        vmFooter.address = window.location.href;
        // console.log(vmFooter.address);
        if (vmFooter.address.indexOf('index.html') > 0) {
            vmFooter.headUrl = vmFooter.list[0].url;
        } else if (vmFooter.address.indexOf('service/orderList.html')>0 || vmFooter.address.indexOf('service/ready.html')>0 || vmFooter.address.indexOf('inroom.html')>0) {
            vmFooter.checkinUrl = vmFooter.list[1].url;
        } else if (vmFooter.address.indexOf('newOrderList.html') > 0 || vmFooter.address.indexOf('checkOut.html') > 0) {
            vmFooter.orderUrl = vmFooter.list[2].url;
        } else if (vmFooter.address.indexOf('more.html') > 0) {
            vmFooter.moreUrl = vmFooter.list[3].url;
        }
    }
});
vmFooter.judgeSelect();
