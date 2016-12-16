var cardID = getParam('cid');
if (cardID != "") {
    if (isNaN(cardID)) {
        location.href = document.referrer || "index.html";
    } else {
        cardID = parseInt(cardID);
    }
} else {
    location.href = "index.html";
}

var user = Storage.getLocal('user'), code = '';
if(user && user.inviteCode) {
    code = user.inviteCode;
}

var vmCardBuy = avalon.define({
    $id: 'cardBuy',
    data: {
        imgUrl: '',
    },
    getType: function() {
        return 'img/card/No' + vmCardBuy.data.type + '.png';
    },
    getData: function() {
        if(!isweixin) {
            vmCardBuy.payType = 1; //不在微信里打开时，默认支付方式改成支付宝
        }

        ajaxJsonp({
            url: urls.getDicCardDetail,
            data: { id: cardID },
            successCallback: function(json) {
                if (json.status === 1) {
                    json.data.imgUrl = 'img/card/No' + json.data.type + '.png';

                    vmCardBuy.data = json.data;
                }
            }
        });
    },
    isAgree: true,
    clickIsAgree: function() {
        this.isAgree = !this.isAgree;
    },
    openRule: function() {
        vmPopover.useCheck = 1;
        popover('./util/card-rule.html', 1);
    },
    payType: 2,
    chooseType: function(type) {
        this.payType = type;
    },
    isDisabled: false,
    payinfo: {},
    buyCard: function() {
        if (this.payType == 3) {
            popover('./util/ETF.html', 1);
        } else {
            //todo: 判断有没有买卡资格（会员卡少于两张）
            ajaxJsonp({
                url: urls.getCardList,
                successCallback: function(json) {
                    if (json.status === 1) {
                        if (vmCardBuy.isAgree) {
                            vmCardBuy.isDisabled = true;
                            //先下单
                            ajaxJsonp({
                                url: urls.submitCardOrder,
                                data: { cid: cardID, invitationCode: code },
                                successCallback: function(json) {
                                    if (json.status === 1) {
                                        var oid = json.data.id;
                                        
                                        if (vmCardBuy.payType == 1) { 
                                            //支付宝支付，跳转支付页面
                                            location.href = 'alipay.html?oid=' + oid;
                                        } else if (vmCardBuy.payType == 2) { 
                                            //微信支付订单
                                            ajaxJsonp({
                                                url: urls.payCardOrder,
                                                data: { 
                                                    oid:  oid,
                                                    payType: vmCardBuy.payType,
                                                    returnUrl: window.location.origin + "/card-show.html?isShowNew=1"
                                                },
                                                successCallback: function(json) {
                                                    if (json.status === 1) {
                                                        vmCardBuy.payinfo = json.data;

                                                        onBridgeReady();
                                                    } else {
                                                        mui.alert(json.message, "支付订单");
                                                    }
                                                }
                                            });
                                        }
                                    }   else {
                                        //调取后台接口不成功
                                        mui.alert(json.message, "支付订单");
                                        vmCardBuy.isDisabled = false;
                                    } 

                                }
                            });
                        } else {
                            vmPopover.useCheck = 1;
                            popover('./util/card-rule.html', 1);
                        }
                    }
                }
            });
        }
    },
    goSafe: function() {
        location.href = 'card-safe.html';
    },
    round: function(a, b) {
        return round(a, b);
    },
    isweixin: isweixin,
    getToday: function(type) {
        return getToday(type);
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;

        vmCardBuy.isAgree = true;
    }
});

vmCardBuy.getData();

switch(cardID) {
    case 2:
    case 3:
        $('.card-font').css('color', 'white');
        break;
    case 6:
        $('.card-font').css('color', '#eee');
        break;
}

var cardWidth, cardHeight;
avalon.ready(function() {
    cardWidth = $('.card-frame').width();
    
    //卡的长高比例 1.73
    cardHeight = cardWidth / 1.73;

    $('.card-font').css('left', cardWidth * 0.05 + 'px');
    $('.card-font').css('top', cardHeight * 0.64 + 'px');
    $('.card-discount').css('top', '-' + cardHeight * 0.32 + 'px');
});

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
        "appId": vmCardBuy.payinfo.appId,
        "timeStamp": vmCardBuy.payinfo.timeStamp,
        "nonceStr": vmCardBuy.payinfo.nonceStr,
        "package": vmCardBuy.payinfo.package,
        "signType": vmCardBuy.payinfo.signType,
        "paySign": vmCardBuy.payinfo.paySign
    }, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {

            location.replace("card-show.html?isShowNew=1");
        } else {
            vmCardBuy.isDisabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                mui.alert("Ooops，出问题了，请重试", "支付订单");
            }
        }
    });
}