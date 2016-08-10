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
    payType: 2, //1支付宝，2微信支付
    data: {
        isPartTime: 0,
        status: 0,
        hotel: { name: '', address: '', alias: '' },
        orderRoomList: [{
            name: '',
            startTime: '',
            endTime: '',
            timeCount: '',
            orderCustomerList: [{ name: '' }]
        }]
    },
    needAmount: 0, //总价
    selectedList: [],
    orids: [], //订单包含的房间业务流水编号
    newRadio1: function() {
        vmOrder.payType = 2;
    },
    newRadio2: function() {
        vmOrder.payType = 1;
    },
    //status 房间的状态
    selectRoom: function(index, status) {
        if (status == 1) {
            var i = vmOrder.selectedList.indexOf(index);

            if (i > -1) {
                vmOrder.selectedList.splice(i, 1);
            } else {
                vmOrder.selectedList.push(index);
            }
        }
    },
    getStatus: function(status) {
        switch (status) {
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
            case 8:
                return "已退订";
                break;
            case 9:
                return "已取消";
                break;
        }
    },
    goHotelById: function(id) {
        location.href = "hotel.html?id=" + id;
    },
    openNav: function(lat, lng, name, addr) {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                    name: name, // 位置名
                    address: addr, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'ini.xin' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    fund: 0, //基金优惠金额
    fundIndex: -1,
    fundList: [],
    getFund: function() {
        //获取用户可用基金
        ajaxJsonp({
            url: urls.getFundAvailable,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmOrder.fundList.push.apply(vmOrder.fundList, json.data);
                }
            }
        })
    },
    selectFund: function(index) {
        if (vmOrder.fundIndex !== index) {
            vmOrder.fund = vmOrder.fundList[index].money;
            vmOrder.fundIndex = index;
        } else {
            vmOrder.fund = 0;
            vmOrder.fundIndex = -1;
        }
    },
    //左边按钮
    btn1Text: "",
    btn1Disabled: false,
    btn1Click: function() {
        vmOrder.btn1Disabled = true;
        switch (vmOrder.data.status) {
            case 1: //待付款
                cancelOrder();
                break;
            case 2: //已付款－退订房间
            case 3: //已入住－评价房间
            case 4: //已离店－评价房间
                mui('#roomSheet').popover('toggle');
                vmOrder.btn1Disabled = false;
                break;
        }
    },
    payinfo: {},
    //右边按钮
    btn2Text: "",
    btn2Disabled: false,
    btn2Click: function() {
        vmOrder.btn2Disabled = true;
        switch (vmOrder.data.status) {
            case 1: //待付款
                //支付订单
                payOrder();
                break;
            case 2: //未入住
                //呼叫接送
                break;
            case 3: //已入住
                //退房
                break;
        }
    },
    isShowSheet: function(status, isComment) {
        switch (vmOrder.data.status) {
            case 2: //订单未入住－房间2未入住＋8已退订
                //可以退订的房间
                return status == 2;
                break;
            case 3: //订单已入住－房间2未入住＋3已入住＋4已离店＋8已退订
                //评价的房间
                return (status == 3 || status == 4) && !isComment;
                break;
            case 4: //订单已离店－房间4已离店+8已退订
                //评价的房间
                return status == 4 && !isComment;
                break;
        }
    },
    sheetClick: function(orid) {
        stopSwipeSkip.do(function() {
            //未入住、已入住、已离店的状态
            //会调出操作面板
            switch (vmOrder.data.status) {
                case 2: //未入住-退订
                    UnsubscribeOrder(orid);
                    break;
                case 3: //已入住-评价选择的房间
                    location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid
                        +"&room=" + getRoom(orid) + "&time=" + getTime(orid);
                    break;
                case 4: //已离店-评价选择的房间
                    location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid
                        +"&room=" + getRoom(orid) + "&time=" + getTime(orid);
                    break;
            }
        })
    }
});

ajaxJsonp({
    url: urls.getOrderDetail,
    data: { id: orderid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmOrder.data = json.data;

            if (json.data.fid > 0) {
                vmOrder.fundList.push(json.data.userFund);
                vmOrder.fund = 0;
                vmOrder.fundList[0].isValid = true;
            }

            vmOrder.getFund();

            for (var i = 0; i < json.data.orderRoomList.length; i++) {
                vmOrder.selectedList.push(i);
            }

            switch (json.data.status) {
                case 1: //待付款
                    vmOrder.btn1Text = "取消预订";
                    vmOrder.btn2Text = "立即支付";
                    break;
                case 2: //未入住
                    vmOrder.btn1Text = "退订";
                    vmOrder.btn2Text = "呼叫接送";
                    break;
                case 3: //已入住
                    vmOrder.btn1Text = "去评价";
                    vmOrder.btn2Text = "退房";
                    break;
                case 4: //已离店
                    vmOrder.btn1Text = "去评价";
                    vmOrder.btn2Text = "";
                    break;
            }
        }
    }
});

registerWeixinConfig();

//支付订单
function payOrder() {
    if(vmOrder.orids.length == 0) {
        mui.toast('请选择房间');
        vmOrder.btn2Disabled = false;
        return;
    }

    ajaxJsonp({
        url: urls.payOrder,
        data: {
            oid: orderid,
            payType: vmOrder.payType,
            fid: vmOrder.fundIndex > -1 ? vmOrder.fundList[vmOrder.fundIndex].id : '',
            orids: vmOrder.orids.join(','),
            returnUrl: window.location.origin + '/payend.html?id=' + orderid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmOrder.payinfo = json.data;
                if (vmOrder.payType == 1) { //支付宝支付
                    if (isweixin) { //如果是在微信里打开
                        location.href = 'alipay-iframe.html?payUrl=' + encodeURIComponent(json.data.payUrl);
                    } else { //在其它浏览器打开
                        location.href = json.data.payUrl;
                    }
                } else if (vmOrder.payType == 2) { //微信支付
                    onBridgeReady();
                }
            } else {
                //调取后台接口不成功
                alert(json.message);
                vmOrder.btn2Disabled = false;
            }
        }
    });
}

//取消订单
function cancelOrder() {
    if (confirm("订单取消以后就无法恢复了，确定吗？")) {
        ajaxJsonp({
            url: urls.cancelOrder,
            data: {
                id: orderid,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("订单已取消");
                    location.href = "index.html";
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

//退订所选房间
function UnsubscribeOrder(orid) {
    if (confirm("该房间的房费将退至付款帐户，确定要退订所选房间吗？")) {
        ajaxJsonp({
            url: urls.UnsubscribeOrder,
            data: {
                oid: orderid,
                orids: orid,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("退订房间成功");
                    location.href = document.referrer || "index.html";
                } else {
                    alert(json.message);
                    vmOrder.btn1Disabled = false;
                    return;
                }
            }
        });
    }
}

function getRoom(orid) {
    return vmOrder.$model.data.orderRoomList.map(function(or) {
        if(or.id == orid) {
            return or.name;
        }
    })[0];
}

function getTime(orid) {
    return vmOrder.$model.data.orderRoomList.map(function(or) {
        if(or.id == orid) {
            return formatDate(or.startTime) + " - " + formatDate(or.endTime);
        }
    })[0];
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

            location.href = 'payend.html?id=' + orderid;
        } else {
            vmOrder.btn2Disabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                alert("Ooops，出问题了，请重试");
            }
        }
    });
}

vmOrder.$watch('selectedList.length', function(a) {
    vmOrder.needAmount = 0;
    vmOrder.orids = [];

    vmOrder.selectedList.map(function(index) {
        if (vmOrder.data.orderRoomList[index].status <= vmOrder.data.status) {
            //计算选择要支付房间的总价
            //不含已退订的房间
            vmOrder.needAmount += vmOrder.data.orderRoomList[index].amount;
        }

        //记录要支付房间的业务流水号
        vmOrder.orids.push(vmOrder.data.orderRoomList[index].id);
    })
})
