var vmBalance = avalon.define({
  $id: 'balance',
  isweixin: isweixin,
  amount: 0,
  money: '',
  getBalance: function() {
    ajaxJsonp({
        url: urls.getBalance,
        successCallback: function(json) {
            if (json.status === 1) {
                vmBalance.amount = json.data.availableAmount;
            } else {
                mui.alert(json.message, "查询余额");
            }
        }
    });
  },
  isDisabled: true,
  //提现按钮变化
  rechargeBtnChange: function() {
      if (vmBalance.money.length > 0) {
          vmBalance.isDisabled = false;
      } else {
          vmBalance.isDisabled = true;
      }
  },
  recharge: function() {
    vmBalance.isDisabled = true;
    modalShow('./util/pay.html', 1);
  },
  payinfo: {},
  goLog: function() {

  }
});

//支付方式选择弹窗
var vmPay = avalon.define({
  $id: 'pay',
  closeModal: function() {
    modalClose();
    vmBalance.isDisabled = false;
  },
  goPay: function(type) {
    //先下单
    ajaxJsonp({
        url: urls.submitBalanceOrder,
        data: { amount: vmBalance.money },
        successCallback: function(json) {
            if (json.status === 1) {
                var oid = json.data.id;
                
                //再支付
                if (type == 1) { 
                    //支付宝支付，跳转支付页面
                    location.href = 'alipay.html?oid=' + oid + "&type=balance";
                } else if (type == 2) { 
                    //微信支付订单
                    ajaxJsonp({
                        url: urls.payBalanceOrder,
                        data: { 
                            oid:  oid,
                            payType: 2,
                        },
                        successCallback: function(json) {
                            if (json.status === 1) {
                                vmBalance.payinfo = json.data;

                                onBridgeReady();
                            } else {
                                mui.alert(json.message, "支付订单");
                            }
                        }
                    });
                }
            }   else {
                //调取后台接口不成功
                mui.alert(json.message, "余额充值");
                vmBalance.isDisabled = false;
            } 

        }
    });
  }
});

vmBalance.getBalance();

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
        "appId": vmBalance.payinfo.appId,
        "timeStamp": vmBalance.payinfo.timeStamp,
        "nonceStr": vmBalance.payinfo.nonceStr,
        "package": vmBalance.payinfo.package,
        "signType": vmBalance.payinfo.signType,
        "paySign": vmBalance.payinfo.paySign
    }, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {

            location.replace("balance.html");
        } else {
            vmBalance.isDisabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                mui.alert("Ooops，出问题了，请重试", "支付订单");
            }
        }
    });
}