/**
 * Created by lyh on 2017/4/4/004.
 */
var vmInroom = avalon.define({
    $id: 'inroom',
    goIndex2: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index2.html";
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
});
