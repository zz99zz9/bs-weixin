// created by zwh on 2017/05/09
// edited by Michael on 2017/05/11

var vmTokensRecharge = avalon.define({
    $id: "tokensRecharge",
    payinfo: {},
    nickname: '',
    balance: 0,
    getTimeCoinBalance: function() {
        ajaxJsonp({
            url: urls.getTotalAssets,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmTokensRecharge.balance = json.data.availableCoin;
                }
            }
        });
    },
    list: [],
    getTimeCoinProductList: function() {
        ajaxJsonp({
            url: urls.getTimeCoinProductList,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmTokensRecharge.list = json.data;
                }
            }
        });
    },
    selectedID: 0,
    select: function(id) {
        stopSwipeSkip.do(function() {
            vmTokensRecharge.selectedID = id;
            modalShow('./util/pay.html', 1);
        });
    }
});

//支付方式选择弹窗
var vmPay = avalon.define({
    $id: 'pay',
    closeModal: function() {
        modalClose();
    },
    goPay: function(type) {
        //先下单
        ajaxJsonp({
            url: urls.submitTimeCoinRechargeOrder,
            data: { tid: vmTokensRecharge.selectedID },
            successCallback: function(json) {
                if (json.status === 1) {
                    var oid = json.data.id;

                    //再支付
                    ajaxJsonp({
                        url: urls.payTimeCoinRechargeOrder,
                        data: {
                            oid: oid,
                            payType: type,
                            returnUrl: window.location.origin + "/closePage.html"
                        },
                        successCallback: function(json) {
                            if (json.status === 1) {
                                if (json.data.payStatus == 0) {
                                    if (type == 1) { //支付宝支付
                                        location.href = 'alipay.html?oid=' + oid + '&payUrl=' + encodeURIComponent(json.data.payUrl) + "&type=balance";
                                    } else if (type == 2) { //微信支付
                                        vmTokensRecharge.payinfo = json.data;
                                        onBridgeReady();
                                    }
                                } else if (json.data.payStatus == 1) {
                                    history.go(-1);
                                } else {
                                    mui.alert("正在支付订单，请稍后", function() {});
                                }
                            } else {
                                mui.alert(json.message);
                            }
                        }
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    }
});


var user = Storage.getLocal('user');
if (user && user.nickname) {
    vmTokensRecharge.nickname = user.nickname;
}

vmTokensRecharge.getTimeCoinBalance();
vmTokensRecharge.getTimeCoinProductList();


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
        "appId": vmTokensRecharge.payinfo.appId,
        "timeStamp": vmTokensRecharge.payinfo.timeStamp,
        "nonceStr": vmTokensRecharge.payinfo.nonceStr,
        "package": vmTokensRecharge.payinfo.package,
        "signType": vmTokensRecharge.payinfo.signType,
        "paySign": vmTokensRecharge.payinfo.paySign
    }, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {

            history.go(-1);
        } else {
            vmTokensRecharge.isDisabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                mui.alert("Ooops，出问题了，请重试", "支付订单");
            }
        }
    });
}
