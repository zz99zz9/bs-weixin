var orderid = getParam("id"),
    showCancelBtn = 0,
    showCheckoutBtn = 0;


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
        //location.href = "hotel.html?id=" + id;
        location.href = "index.html";
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
                    infoUrl: 'bensue.com' // 在查看位置界面底部显示的超链接,可点击跳转
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
    mayCancelRoomList: [],
    //左边按钮
    btn1Text: "",
    btn1Disabled: false,
    btn1Click: function() {
        vmOrder.btn1Disabled = true;

        if(vmOrder.data.status == 1) {
            //待付款-取消预订
            cancelOrder();
        } else {
            if(showCancelBtn > 1) {
                vmOrder.sheetType = 1;
                //退订房间
                mui('#roomSheet').popover('toggle');
                vmOrder.btn1Disabled = false;
            } else if (showCancelBtn == 1) {
                //已付款-退订
                unsubscribeOrder(vmOrder.mayCancelRoomList[0]);
            }
        }
    },
    payinfo: {},
    mayCheckoutRoomList: [],
    //右边按钮
    btn2Text: "",
    btn2Disabled: false,
    btn2Click: function() {
        vmOrder.btn2Disabled = true;
        if(vmOrder.data.status ==1 ) {
            //待付款-支付订单
            payOrder();
        } else {
            if(showCheckoutBtn > 1) {
                vmOrder.sheetType = 2;
                //退房
                mui('#roomSheet').popover('toggle');
                vmOrder.btn2Disabled = false;
            } else if (showCheckoutBtn == 1) {
                //已付款-退订
                checkout(vmOrder.mayCheckoutRoomList[0]);
            }
        }
    },
    showActionText: function(status) {
        switch (status) {
            // case 2: //2未入住－可以退订
            //     return '';
            //     break;
            case 3: //3已入住－评价
            case 4: //4已离店－评价
                return '评价';
                break;
        }
    },
    orderRoomAction: function(orid, status) {
        switch (status) {
            case 3: //3已入住－评价
            case 4: //4已离店－评价
                location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid
                        +"&room=" + getRoom(orid) + "&time=" + getTime(orid) + "&hid=" + vmOrder.data.hotel.id;
                break;
        }
    },
    sheetType: 0, //1 退订房间列表, 2 退房房间列表
    isShowSheet: function(status, sheetType) {
        switch(sheetType) {
            case 1: 
                //退订
                return status == 2;
            case 2: 
                //退房
                return status == 3;
            default: 
                return true;
        }
    },
    sheetClick: function(orid, status) {
        stopSwipeSkip.do(function() {
            //未入住、已入住的状态会调出操作面板
            switch(status) {
                case 2: 
                    //已付款-退订
                    unsubscribeOrder(orid);
                    break;
                case 3: 
                    //已入住-退房
                    checkout(orid);
                    break;
                default:
                    break;
            }
        })
    }
});

iniOrder();

registerWeixinConfig();

function iniOrder() {
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

                showCancelBtn = 0;
                showCheckoutBtn = 0;
                vmOrder.mayCancelRoomList = [];
                vmOrder.mayCheckoutRoomList = [];

                for (var i = 0; i < json.data.orderRoomList.length; i++) {
                    vmOrder.selectedList.push(i);
                    if(json.data.orderRoomList[i].status == 2) {
                        //可以退订房间列表
                        showCancelBtn ++;
                        vmOrder.mayCancelRoomList.push(json.data.orderRoomList[i].id);
                    }

                    if(json.data.orderRoomList[i].status == 3) {
                        //可以退房房间列表
                        showCheckoutBtn ++;
                        vmOrder.mayCheckoutRoomList.push(json.data.orderRoomList[i].id);
                    }
                }

                if(json.data.status == 1) {
                        //待付款
                        vmOrder.btn1Text = "取消预订";
                        vmOrder.btn2Text = "立即支付";
                } else {
                    if(showCancelBtn > 0) {
                        vmOrder.btn1Text = "退订";
                    }
                    if(showCheckoutBtn > 0) {
                        vmOrder.btn2Text = "退房";
                    }
                }
            }
        }
    });
}

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
                        // location.href = 'alipay-iframe.html?payUrl=' + encodeURIComponent(json.data.payUrl);
                        alert('请点击微信右上角菜单中的“在浏览器中打开”选项，在外部浏览器使用支付宝支付');
                        vmOrder.btn2Disabled = false;
                    } else { //在其它浏览器打开
                        location.href = json.data.payUrl;
                    }
                } else if (vmOrder.payType == 2) { //微信支付
                    onBridgeReady();
                }
            } else {
                //调取后台接口不成功
                mui.toast(json.message);
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
function unsubscribeOrder(orid) {
    if (confirm("该房间的房费将退至付款帐户，确定要退订所选房间吗？")) {
        ajaxJsonp({
            url: urls.unsubscribeOrder,
            data: {
                oid: orderid,
                orids: orid,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("退订房间成功");
                    if(vmOrder.sheetType) {
                        mui('#roomSheet').popover('toggle');
                        vmOrder.sheetType = 0;
                    }
                    iniOrder(); 
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

//退房
function checkout(orid) {
    if (confirm("退房后将无法再通过微信开门，确定要退所选房间吗？")) {
        ajaxJsonp({
            url: urls.checkout,
            data: {
                orid: orid,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert("退房成功");
                    location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid
                        +"&room=" + getRoom(orid) + "&time=" + getTime(orid) + "&hid=" + vmOrder.data.hotel.id;
                   
                } else {
                    alert(json.message);
                    vmOrder.btn2Disabled = false;
                    return;
                }
            }
        });
    } else {
        vmOrder.btn2Disabled = false;
    }
}

function getRoom(orid) {
    var name = '';
    vmOrder.$model.data.orderRoomList.map(function(or) {
        if(or.id == orid) {
            name = or.name;
        }
    });
    return name;
}

function getTime(orid) {
    var time = '';
    vmOrder.$model.data.orderRoomList.map(function(or) {
        if(or.id == orid) {
            time = formatDate(or.startTime) + " - " + formatDate(or.endTime);
        }
    });
    return time;
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
