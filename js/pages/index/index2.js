/**
 * Created by lyh on 2017/4/5/005.
 */
var vmIndex2 = avalon.define({
    $id: 'index2',
    goToUrl: function(url) {
        location.href = url;
    },
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
    goUser: function() {
        stopSwipeSkip.do(function() {
            location.href = "../user-info.html";
        })
    },
    goCity: function() {
        stopSwipeSkip.do(function() {
            location.href = "../city.html";
        })
    },
});
