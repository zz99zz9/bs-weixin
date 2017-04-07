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
    goOpendoor: function() {
        stopSwipeSkip.do(function() {
            location.href = "../opendoor.html";
        })
    },
    goCheckout: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("摸摸口袋，看看床上，翻翻包裹","再检查一下",["闪人","稍等"],function(e){
                if (e.index==0) {
                    location.href = "../checkOut.html";
                }
            },"div");
        })
    },
});
