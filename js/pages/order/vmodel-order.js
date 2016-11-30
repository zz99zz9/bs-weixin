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
    selectPayType: function(type) {
        vmOrder.payType = type;
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
                console.log("微信接口配置注册失败，将重新注册");
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
        });
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
    discount: 1,
    did: '',
    discountCard: '',
    getDiscount: function() {
        ajaxJsonp({
            url: urls.getDiscountList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if(json.data.length > 0 && json.data[0].discount){
                        vmOrder.did = json.data[0].id;
                        vmOrder.discount = json.data[0].discount;
                        vmOrder.discountCard = json.data[0].name;

                        vmOrder.getCardList();
                    }
                }
            }
        });
    },
    getCardList: function() {
        ajaxJsonp({
            url: urls.getAccountList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if(json.data.length > 0){
                        vmOrder.payType = 6;

                        vmSelectCard.cardList = json.data;
                        //设置默认支付卡
                        vmSelectCard.selectCardID = json.data[0].id;
                    }
                }
            }
        });
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
                unsubscribeOrder(vmOrder.mayCancelRoomList[0].id, vmOrder.mayCancelRoomList[0].name);
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
                checkout(vmOrder.mayCheckoutRoomList[0].id, vmOrder.mayCheckoutRoomList[0].name);
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
    sheetClick: function(orid, status, name) {
        stopSwipeSkip.do(function() {
            //未入住、已入住的状态会调出操作面板
            switch(status) {
                case 2: 
                    //已付款-退订
                    unsubscribeOrder(orid, name);
                    break;
                case 3: 
                    //已入住-退房
                    checkout(orid, name);
                    break;
                default:
                    break;
            }
        })
    }
});

//钱包支付：换卡弹窗
var vmSelectCard = avalon.define({
    $id: 'selectCard',
    cardList: [],
    selectCardID: 0,
    selectIndex: 0,
    select: function(index, cid) {
        if(vmSelectCard.cardList[index].cashAmount>=vmOrder.needAmount* vmOrder.discount) {

            vmSelectCard.selectIndex = index;
            vmSelectCard.selectCardID = cid;

            vmPopover.close();
            payOrder();
        }
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        vmPopover.close();
    },
    close: function() {
        //纯粹隐藏，在关闭弹窗的时候不要清空弹窗内容

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

iniOrder();

registerWeixinConfig();

function iniOrder() {
    if(!isweixin) {
        vmOrder.payType = 1; //不在微信里打开时，默认支付方式改成支付宝
    }

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

                // vmOrder.getFund();

                showCancelBtn = 0;
                showCheckoutBtn = 0;
                vmOrder.mayCancelRoomList = [];
                vmOrder.mayCheckoutRoomList = [];

                for (var i = 0; i < json.data.orderRoomList.length; i++) {
                    vmOrder.selectedList.push(i);
                    if(json.data.orderRoomList[i].status == 2) {
                        //可以退订房间列表
                        showCancelBtn ++;
                        vmOrder.mayCancelRoomList.push({
                            id: json.data.orderRoomList[i].id,
                            name: json.data.orderRoomList[i].name
                        });
                    }

                    if(json.data.orderRoomList[i].status == 3) {
                        //可以退房房间列表
                        showCheckoutBtn ++;
                        vmOrder.mayCheckoutRoomList.push({
                            id: json.data.orderRoomList[i].id,
                            name: json.data.orderRoomList[i].name
                        });
                    }
                }

                if(json.data.status == 1) {
                    //待付款
                    vmOrder.btn1Text = "取消预订";
                    vmOrder.btn2Text = "立即支付";

                    //查询可用会员卡及折扣
                    vmOrder.getDiscount();
                } else {
                    if(showCancelBtn > 0) {
                        vmOrder.btn1Text = "退订";
                    } else {
                        vmOrder.btn1Text = "";
                    }
                    if(showCheckoutBtn > 0) {
                        vmOrder.btn2Text = "退房";
                    } else {
                        vmOrder.btn2Text = "";
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

    if(vmOrder.payType == 6) {
        
        var cardCash = vmSelectCard.cardList[vmSelectCard.selectIndex].cashAmount;
        
        //暂时不算约会基金
        if(cardCash==0 || cardCash < vmOrder.needAmount* vmOrder.discount) {
            vmOrder.btn2Disabled = false;

            popover('./util/card-select.html', 1)
            return;
        }
    }

    ajaxJsonp({
        url: urls.payOrder,
        data: {
            oid: orderid,
            payType: vmOrder.payType,
            fid: vmOrder.fundIndex > -1 ? vmOrder.fundList[vmOrder.fundIndex].id : '',
            orids: vmOrder.orids.join(','),
            returnUrl: window.location.origin + "/closePage.html",
            cid: vmSelectCard.selectCardID,
            did: vmOrder.did,
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmOrder.payinfo = json.data;
                if (vmOrder.payType == 1) { //支付宝支付
                    // if (isweixin) { //如果是在微信里打开
                    //     // location.href = 'alipay-iframe.html?payUrl=' + encodeURIComponent(json.data.payUrl);
                    //     mui.alert("请点击微信右上角菜单中的\"在浏览器中打开\"选项，在外部浏览器中使用支付宝支付", "支付订单");
                    //     vmOrder.btn2Disabled = false;
                    // } else { //在其它浏览器打开
                    //     location.href = json.data.payUrl;
                    // }
                    location.href = 'alipay.html?oid=' + orderid + '&payUrl=' + encodeURIComponent(json.data.payUrl);
                } else if (vmOrder.payType == 2) { //微信支付
                    onBridgeReady();
                } else if (vmOrder.payType == 6) { //钱包支付
                    location.href = '/payend.html?id=' + orderid;
                }
            } else {
                //调取后台接口不成功
                mui.alert(json.message, "支付订单");
                vmOrder.btn2Disabled = false;
            }
        }
    });
}

//取消订单
function cancelOrder() {
    mui.confirm(
        "订单取消以后就无法恢复了，要取消该订单吗？",
        "取消订单",
        ['否', '是'],
        function(e) {
            if(e.index == 1) {
                ajaxJsonp({
                    url: urls.cancelOrder,
                    data: {
                        id: orderid,
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            mui.alert("订单已取消", "取消订单");
                            location.href = "index.html";
                        } else {
                            mui.alert(json.message, "取消订单");
                            vmOrder.btn1Disabled = false;
                            return;
                        }
                    }
                });
            } else {
                vmOrder.btn1Disabled = false;
            }
        });
}

//退订所选房间
function unsubscribeOrder(orid, roomName) {
    if(vmOrder.sheetType) {
        mui('#roomSheet').popover('toggle');
        vmOrder.sheetType = 0;
    }

    mui.confirm(
        "房费将退至付款帐户，确定要退订吗？",
        "退订房间: " + roomName,
        ['否', '是'],
        function(e) {
            if(e.index == 1) {
                ajaxJsonp({
                    url: urls.unsubscribeOrder,
                    data: {
                        oid: orderid,
                        orids: orid,
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            mui.alert("退订房间成功", "退订房间: " + roomName);
                            
                            iniOrder(); 
                        } else {
                            mui.alert(json.message, "退订房间: " + roomName);
                            vmOrder.btn1Disabled = false;
                            return;
                        }
                    }
                });
            } else {
                vmOrder.btn1Disabled = false;
            }
        });
}

//退房
function checkout(orid, roomName) {
    if(vmOrder.sheetType) {
        mui('#roomSheet').popover('toggle');
        vmOrder.sheetType = 0;
    }

    mui.confirm(
        "退房后将无法再使用微信开门，确定要退房吗？",
        "退房: " + roomName,
        ['否', '是'],
        function(e) {
            if (e.index == 1) {
                ajaxJsonp({
                    url: urls.checkOutDoor,
                    data: {
                        id: orid,
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            mui.alert("退房成功", "退房: " + roomName);
                            location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid
                                +"&room=" + getRoom(orid) + "&time=" + getTime(orid) + "&hid=" + vmOrder.data.hotel.id;
                           
                        } else {
                            mui.alert(json.message, "退房: " + roomName);
                            vmOrder.btn2Disabled = false;
                            return;
                        }
                    }
                });
            } else {
                vmOrder.btn2Disabled = false;
            }
        });
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
            location.href = 'payend.html?id=' + orderid;
        } else {
            vmOrder.btn2Disabled = false;
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                mui.alert("Ooops，出问题了，请重试", "支付订单");
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
