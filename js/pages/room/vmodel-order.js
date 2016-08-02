var orderid = getParam("id");

if (orderid != "") {
    if (isNaN(orderid)) {
        location.href = document.referrer || "index.html";
    } else {
        orderid = parseInt(orderid);
    }
} else {
    location.href = "index.html";
}

var vmOrder = avalon.define({
    $id: "order",
    data: {
        orderRoom: { orderCustomerList: [] },
        orderGoodsList: []
    },
    getStatus: function() {
        switch (vmOrder.data.status) {
            case 1: //待付款
                return "待支付";
                break;
            case 2: //未入住
                return "待入住";
                break;
            case 3: //已入住
                return "已入住";
                break;
            case 4: //已离店
                return "已离店";
                break;
        }
    },
    btn1Text: "",
    btn1Disabled: false,
    btn1Click: function() {
        vmOrder.btn1Disabled = true;
        switch (vmOrder.data.status) {
            case 1: //待付款
                cancelOrder();
                break;
            case 2: //未入住
                //退订
                UnsubscribeOrder();
                break;
            case 4: //已离店
                //开发票
                break;
        }
    },
    payinfo: {},
    btn2Text: "",
    btn2Disabled: false,
    btn2Click: function() {
        vmOrder.btn2Disabled = true;
        switch (vmOrder.data.status) {
            case 1: //待付款
                ajaxJsonp({
                    url: urls.payOrder,
                    data: {
                        oid: orderid,
                        payType: 2 //微信支付
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            vmOrder.payinfo = json.data;
                            onBridgeReady();
                        } else {
                            //调取后台接口不成功
                            alert(json.message);
                        }
                    }
                });
                break;
            case 2: //未入住
                //退订
                break;
            case 4: //已离店
                //开发票
                break;
        }
    }
});

ajaxJsonp({
    url: urls.getOrderDetail,
    data: { id: orderid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmOrder.data = json.data;

            switch (json.data.status) {
                case 1: //待付款
                    vmOrder.btn1Text = "撤消订单";
                    vmOrder.btn2Text = "支付";
                    break;
                case 2: //未入住
                    vmOrder.btn1Text = "退订房间";
                    vmOrder.btn2Text = "";
                    break;
                case 3: //已入住
                    vmOrder.btn1Text = "";
                    vmOrder.btn2Text = "评价";
                    break;
                case 4: //已离店
                    vmOrder.btn1Text = "开发票";
                    vmOrder.btn2Text = "评价";
                    break;
            }

        } else {
            location.href = document.referrer || "index.html";
        }
    }
});

//取消订单
function cancelOrder() {
    if (confirm("要撤除当前订单吗？")) {
        ajaxJsonp({
            url: urls.cancelOrder,
            data: { id: orderid },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("订单已撤除");
                    location.href = document.referrer || "index.html";
                } else {
                    alert(json.message);
                    vmOrder.btn1Disabled = false;
                    return;
                }
            }
        });
    } else {
        vmOrder.btn1Disabled = false;
    }
}

//退订
function UnsubscribeOrder() {
    if (confirm("已付费用将退至付款帐户")) {
        ajaxJsonp({
            url: urls.UnsubscribeOrder,
            data: { oid: orderid },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("退订成功");
                    location.href = document.referrer || "index.html";
                } else {
                    alert(json.message);
                    vmOrder.btn1Disabled = false;
                    return;
                }
            }
        });
    } else {
        vmOrder.btn1Disabled = false;
    }
}

/**
 * 准备微信支付
 */
function onBridgeReady() {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', callWcpay, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', callWcpay);
            document.attachEvent('onWeixinJSBridgeReady', callWcpay);
        }
    } else {
        callWcpay();
    }
}

/**
 * 发起微信支付
 */
function callWcpay() {
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": vmOrder.payinfo.appId,
        "timeStamp": vmOrder.payinfo.timeStamp,
        "nonceStr": vmOrder.payinfo.nonceStr,
        "package": vmOrder.payinfo.package,
        "signType": vmOrder.payinfo.signType,
        "paySign": vmOrder.payinfo.paySign
    }, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
            alert("支付成功");

            location.href = 'payend.html';
        } else {
            vmOrder.btn2Disabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                alert("Ooops，出问题了，请重试");
            }
        }
    });
}
