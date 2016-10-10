var orderid = getParam("oid");

if (orderid != "") {
    if (isNaN(orderid)) {
        location.href = document.referrer || "index.html";
    } else {
        orderid = parseInt(orderid);
    }
} else {
    location.href = "index.html";
}

var vmPay = avalon.define({
    $id: 'pay',
    isShowMask: false,
    maskToggle: function() {
        vmPay.isShowMask = !vmPay.isShowMask;
    },
    payOrder: function() {
        //再支付订单
        ajaxJsonp({
            url: urls.payCardOrder,
            data: { 
                oid:  orderid,
                payType: 1,
                returnUrl: window.location.origin + "/card-show.html"
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    //跳转支付宝提供的支付页面
                    location.href = json.data.payUrl;
                }
            }
        });
    }
});

if(isweixin) {
    vmPay.isShowMask = true;
} else {
    vmPay.payOrder();
}