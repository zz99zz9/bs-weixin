//Edit by Michael 20170511

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
    payType: 8, //1-支付宝，2-微信支付，3-余额抵扣，4-红包抵扣，5-积分抵扣，6-会员卡帐户支付，7-现金支付，8-时币支付
    data: {
        isPartTime: 0,
        status: 0,
        hotel: { name: '', address: '', alias: '' },
        orderRoomList: [{
            name: '',
            startTime: '',
            endTime: '',
            timeCount: '',
            roomType: { name: '' },
            orderCustomerList: [{ name: '' }]
        }]
    },
    needAmount: 0, //总价
    minFee: 9999, //订单中最便宜房间的房费，供免费入住抵扣
    selectedList: [],
    orids: [], //订单包含的房间业务流水编号
    selectPayType: function(type) {
        stopSwipeSkip.do(function() {
            vmOrder.payType = type;
        });
    },
    //status 房间的状态
    selectRoom: function(index, status) {
        stopSwipeSkip.do(function() {
            if (status == 1) {
                var i = vmOrder.selectedList.indexOf(index);

                if (i > -1) {
                    vmOrder.selectedList.splice(i, 1);
                } else {
                    vmOrder.selectedList.push(index);
                }
            }
        });
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
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + id;
        });
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
    fundType: 0, //1现金优惠券 2免费入住券
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
    selectFund: function(index, type) {
        stopSwipeSkip.do(function() {
            vmOrder.fundType = type;

            if (vmOrder.fundIndex !== index) {
                vmOrder.fundIndex = index;

                if (type == 1) {
                    vmOrder.fund = vmOrder.fundList[index].money;
                } else if (type == 2) {
                    //type == 2 免费入住券抵扣房价最低的房间房费
                    vmOrder.fund = vmOrder.minFee;
                }
            } else {
                vmOrder.fund = 0;
                vmOrder.fundIndex = -1;
            }
        });
    },
    discount: 1,
    did: '',
    discountCard: '',
    getDiscount: function() {
        ajaxJsonp({
            url: urls.getDiscountList,
            successCallback: function(json) {
                if (json.status == 1) {
                    if (json.data.length > 0 && json.data[0].discount) {
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
                    if (json.data.length > 0) {
                        //取到卡信息
                        //如果是vip卡，将支付方式设置为卡支付
                        if (vmOrder.discount < 1) {
                            vmOrder.payType = 6;

                            vmSelectCard.cardList = json.data;

                            //设置默认支付卡
                            vmSelectCard.selectCardID = json.data[0].id;
                        }
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
        stopSwipeSkip.do(function() {
            vmOrder.btn1Disabled = true;

            if (vmOrder.data.status == 1) {
                //待付款-取消预订
                cancelOrder();
            } else {
                if (showCancelBtn > 1) {
                    vmOrder.sheetType = 1;
                    //退订房间
                    mui('#roomSheet').popover('toggle');
                    vmOrder.btn1Disabled = false;
                } else if (showCancelBtn == 1) {
                    //已付款-退订
                    unsubscribeOrder(vmOrder.mayCancelRoomList[0].id, vmOrder.mayCancelRoomList[0].name);
                }
            }
        });
    },
    payinfo: {},
    mayCheckoutRoomList: [],
    //右边按钮
    btn2Text: "",
    btn2Disabled: false,
    btn2Click: function() {
        stopSwipeSkip.do(function() {
            vmOrder.btn2Disabled = true;
            if (vmOrder.data.status == 1) {
                //待付款-支付订单
                payOrder();
            } else {
                if (showCheckoutBtn > 1) {
                    vmOrder.sheetType = 2;
                    //退房
                    mui('#roomSheet').popover('toggle');
                    vmOrder.btn2Disabled = false;
                } else if (showCheckoutBtn == 1) {
                    //已付款-退订
                    checkout(vmOrder.mayCheckoutRoomList[0].id, vmOrder.mayCheckoutRoomList[0].name);
                }
            }
        });
    },
    showActionText: function(status, customerStatus) {
        switch (status) {
            case 2: //2未入住－可以退订
                return customerStatus ? '去做准备' : '发送订单';
            case 3: //3已入住－评价
            case 4: //4已离店－评价
                return '评价';
        }
    },
    orderRoomAction: function(orid, status, customerStatus, oid, rid) {
        switch (status) {
            case 2:
                if (customerStatus) {
                    //去做准备
                    Storage.set('guest', { oid: oid, orid: orid, rid: rid });
                    location.href = "../service/process.html";
                } else {

                }
                break;
            case 3: //3已入住－评价
            case 4: //4已离店－评价
                location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid + "&room=" + getRoom(orid) + "&time=" + getTime(orid) + "&hid=" + vmOrder.data.hotel.id;
                break;
        }
    },
    sheetType: 0, //1 退订房间列表, 2 退房房间列表
    isShowSheet: function(status, sheetType) {
        switch (sheetType) {
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
            switch (status) {
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
    },
    cashPrice: 0, //现金价格
    timeCoinPrice: 0, //时币价格
    timeCoinDiscount: 1, //时币折扣
    timeCoinBalance: 0,
    getTimeCoinBalance: function() {
        ajaxJsonp({
            url: urls.getTotalAssets,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmOrder.timeCoinBalance = json.data.availableCoin;
                }
            }
        });
    },
    getTimeCoinDiscount: function() {
        ajaxJsonp({
            url: urls.getTimeCoinDiscount,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmOrder.timeCoinDiscount = json.data.discount;
                }
            }
        });
    },
    getPrice: function(payType, needAmount, fund, discount) {
        if (vmOrder.data.status != 1) {
            if (payType != 8) {
                vmOrder.cashPrice = vmOrder.data.paidAmount
                return vmOrder.cashPrice + '元';
            } else {
                vmOrder.timeCoinPrice = vmOrder.data.timeCoinCount;
                return vmOrder.timeCoinPrice + '时币';
            }
        } else {
            if (round(needAmount - fund) < 0) {
                if (payType != 8) {
                    vmOrder.cashPrice = 0;
                    return vmOrder.cashPrice + '元';
                } else {
                    vmOrder.timeCoinPrice = 0;
                    return vmOrder.timeCoinPrice + '时币';
                }
            } else {
                if (payType != 8) {
                    vmOrder.cashPrice = round((needAmount - fund) * discount);
                    return vmOrder.cashPrice + '元';
                } else {
                    vmOrder.timeCoinPrice = Math.floor((round((needAmount - fund) * discount) * vmOrder.timeCoinDiscount) / 10 + 1);
                    return vmOrder.timeCoinPrice + '时币';
                }
            }
        }
    },
    getPayType: function(type, payedType) {
        if (vmOrder.data.status != 1) {
            type = payedType;
        }
        switch (type) {
            case 1:
                return '支付宝';
            case 2:
                return '微信支付';
            case 3:
                return '余额';
            case 4:
                return '红包';
            case 5:
                return '积分';
            case 6:
                return '会员卡钱包';
            case 7:
                return '现金';
            case 8:
                return '时币';
        }
    }
});

//钱包支付：换卡弹窗
var vmSelectCard = avalon.define({
    $id: 'selectCard',
    cardList: [],
    selectCardID: 0,
    selectIndex: 0,
    select: function(index, cid) {
        if (vmSelectCard.cardList[index].cashAmount >= vmOrder.needAmount * vmOrder.discount) {

            vmSelectCard.selectIndex = index;
            vmSelectCard.selectCardID = cid;

            vmPopoverBtn.close();
            payOrder();
        }
    }
});

var vmBeforePay = avalon.define({
    $id: 'beforePay',
    type: 1, //1: 时币支付, 2: 微信支付, 3: 支付宝支付
    title: '时币支付',
    timeCoinPrice: 0,
    timeCoinBalance: 0,
    cashPrice: 0,
    deduction: 0,
    btnText: '确认支付',
    closeModal: function() {
        stopSwipeSkip.do(function() {
            vmOrder.btn2Disabled = false;
            modalClose();
        });
    },
    setStatus: function(type) {
        switch (type) {
            case 8:
                vmBeforePay.type = 1;
                vmBeforePay.title = "时币支付";
                vmBeforePay.timeCoinPrice = vmOrder.timeCoinPrice;
                vmBeforePay.timeCoinBalance = vmOrder.timeCoinBalance;

                if (vmBeforePay.timeCoinBalance < vmBeforePay.timeCoinPrice) {
                    vmBeforePay.btnText = '您的时币余额不足，请先充值 >';
                } else {
                    vmBeforePay.btnText = '确认支付';
                }
                break;
            case 2:
                vmBeforePay.type = 2;
                vmBeforePay.title = "微信支付";
                vmBeforePay.cashPrice = vmOrder.cashPrice;
                vmBeforePay.timeCoinBalance = vmOrder.timeCoinBalance;

                if (vmBeforePay.timeCoinBalance * 10 >= vmBeforePay.cashPrice) {
                    vmBeforePay.deduction = vmBeforePay.cashPrice;
                } else {
                    vmBeforePay.deduction = round(vmBeforePay.timeCoinBalance * 10);
                }

                vmBeforePay.btnText = '确认支付';
                break;
            case 1:
                vmBeforePay.type = 3;
                vmBeforePay.title = "支付宝支付";
                vmBeforePay.cashPrice = vmOrder.cashPrice;
                vmBeforePay.timeCoinBalance = vmOrder.timeCoinBalance;

                if (vmBeforePay.timeCoinBalance * 10 >= vmBeforePay.cashPrice) {
                    vmBeforePay.deduction = vmBeforePay.cashPrice;
                } else {
                    vmBeforePay.deduction = round(vmBeforePay.timeCoinBalance * 10);
                }

                vmBeforePay.btnText = '确认支付';
                break;
        }
    },
    isDeduction: false,
    toggleDeduction: function() {
        stopSwipeSkip.do(function() {
            vmBeforePay.isDeduction = !vmBeforePay.isDeduction;
        });
    },
    go: function() {
        stopSwipeSkip.do(function() {
            if (vmBeforePay.type == 1) {
                if (vmBeforePay.timeCoinBalance < vmBeforePay.timeCoinPrice) {
                    location.href = "tokensRecharge.html";
                }
            }

            payAPI();
        });
    }
});

var vmPopoverBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        vmPopoverBtn.close();
    },
    close: function() {
        //纯粹隐藏，在关闭弹窗的时候不要清空弹窗内容

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

iniOrder();
vmOrder.getTimeCoinBalance();
vmOrder.getTimeCoinDiscount();

registerWeixinConfig();

function iniOrder() {
    // if(!isweixin) {
    //     vmOrder.payType = 1; //不在微信里打开时，默认支付方式改成支付宝
    // }

    ajaxJsonp({
        url: urls.getOrderDetail,
        data: { id: orderid },
        successCallback: function(json) {
            if (json.status === 1) {
                var orderRoom;
                vmOrder.data = json.data;
                if (json.data.payType) {
                    vmOrder.payType = json.data.payType;
                }

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
                    orderRoom = json.data.orderRoomList[i];
                    vmOrder.selectedList.push(i);
                    if (orderRoom.status == 2) {
                        //可以退订房间列表
                        showCancelBtn++;
                        vmOrder.mayCancelRoomList.push({
                            id: orderRoom.id,
                            name: orderRoom.name
                        });
                    }

                    if (orderRoom.status == 3) {
                        //可以退房房间列表
                        showCheckoutBtn++;
                        vmOrder.mayCheckoutRoomList.push({
                            id: orderRoom.id,
                            name: orderRoom.name
                        });
                    }
                }

                if (json.data.status == 1) {
                    //待付款
                    vmOrder.btn1Text = "取消预订";
                    vmOrder.btn2Text = "立即支付";

                    //查询可用会员卡及折扣
                    vmOrder.getDiscount();
                } else {
                    if (showCancelBtn > 0) {
                        vmOrder.btn1Text = "退订";
                    } else {
                        vmOrder.btn1Text = "";
                    }
                    if (showCheckoutBtn > 0) {
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
    if (vmOrder.orids.length == 0) {
        mui.toast('请选择房间');
        vmOrder.btn2Disabled = false;
        return;
    }

    if (vmOrder.payType == 6) {

        var cardCash = vmSelectCard.cardList[vmSelectCard.selectIndex].cashAmount;

        //暂时不算约会基金
        if (cardCash == 0 || cardCash < vmOrder.needAmount * vmOrder.discount) {
            vmOrder.btn2Disabled = false;

            popover('./util/card-select.html', 1)
            return;
        }
        payAPI();
    }

    if (vmOrder.payType == 1 || vmOrder.payType == 2 || vmOrder.payType == 8) {
        modalShow('./util/beforePay.html', 1, function() {
            vmBeforePay.setStatus(vmOrder.payType);
        });
    }
}

function payAPI() {
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
            timeCoin: round(vmBeforePay.deduction / 10)
        },
        successCallback: function(json) {
            if (json.status === 1) {
                if (json.data.payStatus == 0) {
                    vmOrder.payinfo = json.data;
                    if (vmOrder.payType == 1) { //支付宝支付
                        location.href = 'alipay.html?oid=' + orderid + '&payUrl=' + encodeURIComponent(json.data.payUrl) + '&type=room';
                    } else if (vmOrder.payType == 2) { //微信支付
                        onBridgeReady();
                    } else if (vmOrder.payType == 6 || vmOrder.payType == 8) { //钱包支付
                        //location.href = '/payend.html?id=' + orderid;
                        location.href = '../service/orderList.html';
                    }
                } else if (json.data.payStatus == 1) {
                    //付款已完成（比如用了大额的优惠券，把房费降为了0
                    //location.href = '/payend.html?id=' + orderid;
                    location.href = '../service/orderList.html';
                } else {
                    mui.alert("正在支付订单，请稍后", function() {
                        vmOrder.btn2Disabled = false;
                    });
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
        "取消订单", ['否', '是'],
        function(e) {
            if (e.index == 1) {
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
    if (vmOrder.sheetType) {
        mui('#roomSheet').popover('toggle');
        vmOrder.sheetType = 0;
    }

    mui.confirm(
        "房费将退至付款帐户，确定要退订吗？",
        "退订房间: " + roomName, ['否', '是'],
        function(e) {
            if (e.index == 1) {
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
    if (vmOrder.sheetType) {
        mui('#roomSheet').popover('toggle');
        vmOrder.sheetType = 0;
    }

    mui.confirm(
        "退房后将无法再使用微信开门，确定要退房吗？",
        "退房: " + roomName, ['否', '是'],
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
                            location.href = "submitassess.html?oid=" + orderid + "&orid=" + orid + "&room=" + getRoom(orid) + "&time=" + getTime(orid) + "&hid=" + vmOrder.data.hotel.id;

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
        if (or.id == orid) {
            name = or.name;
        }
    });
    return name;
}

function getTime(orid) {
    var time = '';
    vmOrder.$model.data.orderRoomList.map(function(or) {
        if (or.id == orid) {
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
    var minFee = 0,
        orderRoom;
    vmOrder.minFee = 9999; //重新计算最低房费
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

        orderRoom = vmOrder.data.orderRoomList[index];
        //找到最低的房费
        if (vmOrder.data.isPartTime == 0) {
            minFee = orderRoom.amount / orderRoom.timeCount;
        } else if (vmOrder.data.isPartTime == 1) {
            minFee = orderRoom.amount;
        }

        if (vmOrder.minFee > minFee) {
            vmOrder.minFee = minFee;

            if (vmOrder.fundType == 2) {
                vmOrder.fund = minFee;
            }
        }
    })

    if (a == 0) {
        vmOrder.fund = 0;
    }
})
