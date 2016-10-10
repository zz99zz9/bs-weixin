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
                returnUrl: window.location.origin + "/closePage.html"
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    //跳转支付宝提供的支付页面
                    location.href = json.data.payUrl;
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || "index.html";
                    });
                }
            }
        });
    },
    isPaySuccess: function() {
        ajaxJsonp({
            url: urls.getCardOrderInfo,
            data: {
                oid: orderid,
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    //支付成功
                    if (json.data.payStatus) {
                        //根据卡号查询已购买的卡id
                        ajaxJsonp({
                            url: urls.getCardDetailByCardNo,
                            data: {
                                cardNo: json.data.cardNo,
                            },
                            successCallback: function(json) {
                                if (json.status == 1) {
                                    location.href = "card-show.html?id=" + json.data.id;
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

if (!isLocalStorageNameSupported) {
    mui.alert("您的 Safari 浏览器可能需要修改‘阻止Cookie’设置，请在打开 设置-Safari-阻止Cookie，选择'始终允许'。")
}

if (isweixin) {
    vmPay.isShowMask = true;
} else {
    vmPay.payOrder();
}

setInterval('vmPay.isPaySuccess()', 1000);
