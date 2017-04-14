// mui.init();
// //初始化单页view
// var viewApi = mui('#app').view({
//     defaultPage: '#infoPage'
// });

// $('.cancelBtn').on('tap', function() {
//     vmMore.getUserInfo();
//     viewApi.back();
// });

// var user = {
//   openUserInfo: 1
// };
// Storage.setLocal('user', user);

var vmMore = avalon.define({
    $id: 'more',
    goIndex: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
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
});