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
                oid: orderid,
                payType: 1,
                returnUrl: window.location.origin + "/card-show.html"
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    //跳转支付宝提供的支付页面
                    location.href = json.data.payUrl;
                }
            }
        });
    }
});

if(!isLocalStorageNameSupported) {
    mui.alert("您的 Safari 浏览器可能需要修改‘阻止Cookie’设置，请在打开 设置-Safari-阻止Cookie，选择'始终允许'。")
}

if(isweixin) {
    vmPay.isShowMask = true;
} else {
    vmPay.payOrder();
}