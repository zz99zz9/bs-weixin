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
    isVip: 0,  //根据是否买卡来判断  0-不是  1-是
    getCardList: function() {
        ajaxJsonp({
            url: urls.getCardList,
            successCallback: function(json) {
                if (json.status == 1) {
                    // json.data.map(function(o) {
                    //     vmMore.cardTypeList.push(o.type);
                    // });
                    vmMore.isVip = json.data.length;
                    console.log(vmMore.isVip);
                }
            }
        });
    },
    // goIndex: function() {
    //     stopSwipeSkip.do(function() {
    //         location.href = "../index.html";
    //     })
    // },
    // goRoom: function() {
    //     stopSwipeSkip.do(function() {
    //         location.href = "service/orderList.html";
    //     })
    // },
    // goOrder: function() {
    //     stopSwipeSkip.do(function() {
    //         location.href = "../newOrderList.html";
    //     })
    // },
    // goMore: function() {
    //     stopSwipeSkip.do(function() {
    //         location.href = "../more.html";
    //     })
    // },
});

vmMore.getCardList();
