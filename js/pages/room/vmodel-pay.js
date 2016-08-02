var newOrder = Storage.get("newOrder");
if (newOrder) {
    var roomid = newOrder.room.id;

    if (roomid) {
        if (isNaN(roomid)) {
            location.href = document.referrer || "index.html";
        } else {
            roomid = parseInt(roomid);
        }
    } else {
        location.href = "index.html";
    }
} else {
    location.href = "index.html";
}

var vmOrder = avalon.define({
    $id: 'order',
    isPartTime: 0,
    hotel: {},
    name: '',
    dayPrice: 0,
    price: 0,
    number: 1,
    payMoney: 0,
    contactList: [],
    goodsList: [],
    goodsPrice: 0,
    start: '',
    end: '',
    payinfo: {},
    oid: 0,
    submitDisabled: false,
    submitOrder: function() {
        vmOrder.submitDisabled = true;

        var cList = vmOrder.$model.contactList;
        var cids = '';
        if (cList && cList.length > 0) {
            for (var i in cList) {
                cids = cids + cList[i].id;
                if (i < cList.length - 1) {
                    cids = cids + ',';
                }
            };
        } else {
            mui.toast("请添加入住人");
            vmOrder.submitDisabled = false;
            return;
        }

        if (vmOrder.start == '') {
            alert("请选择入住时间");
            location.href = "rooms.html?type=order";
            return;
        }
        if (vmOrder.end == '') {
            alert("请选择退房时间");
            location.href = "rooms.html?type=order";
            return;
        }

        if (!vmOrder.isPartTime) {
            var gList = vmOrder.$model.goodsList;
            var goods = [];
            if (gList.length > 0) {
                gList.map(function(o) {
                    goods.push({ gid: o.gid, number: o.number });
                });
            } else {
                alert("请选择私人订制");
                location.href = "article.html";
                return;
            }
        }

        //先下单，再付款
        ajaxJsonp({
            url: urls.submitOrder,
            data: {
                rid: roomid,
                fid: (vmRedpacket.selectedID == 0 ? '' : vmRedpacket.selectedID),
                startTime: vmOrder.start,
                endTime: vmOrder.end,
                isPartTime: newOrder.date.isPartTime,
                cids: cids,
                goods: JSON.stringify(goods) || ''
            },
            successCallback: function(json) {
                if (json.status === 1) {

                    Storage.delete("newOrder");
                    Storage.set("orderData", json.data);
                    vmOrder.oid = json.data.id;

                    //进入付款流程
                    //先调后台接口
                    ajaxJsonp({
                        url: urls.payOrder,
                        data: {
                            oid: json.data.id,
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
                } else {
                    //下单不成功
                    vmOrder.submitDisabled = false;
                    alert(json.message);
                }
            }
        });


    }
});

//从本地储存取订单房间数据
(function() {
    vmOrder.hotel = newOrder.hotel;
    vmOrder.name = newOrder.room.name;
    vmOrder.isPartTime = newOrder.date.isPartTime;
    if (newOrder.date.isPartTime) {
        vmOrder.start = newOrder.date.start;
        vmOrder.end = newOrder.date.end;

        vmOrder.price = newOrder.date.pay / newOrder.date.partTimeNumber;
        vmOrder.number = newOrder.date.partTimeNumber;
    } else {
        vmOrder.start = newOrder.date.start + ' ' + newOrder.date.startTime;
        vmOrder.end = newOrder.date.end + ' 14:00';

        vmOrder.price = newOrder.date.nightPrice;
        vmOrder.number = newOrder.date.endIndex - newOrder.date.startIndex;
        vmOrder.dayPrice = newOrder.room.dayPrice;

        vmOrder.goodsList = newOrder.goods;
        newOrder.goods.map(function(o) {
            vmOrder.goodsPrice += o.price * o.number;
        });
    }

    vmOrder.contactList = newOrder.contact;
})();


var vmRedpacket = avalon.define({
    $id: 'redpacket',
    list: [],
    selectedID: 0,
    bonusMoney: 0,
    getData: function() {
        ajaxJsonp({
            url: urls.getFundAvailable,
            successCallback: function(json) {
                if (json.status != 1) {
                    alert(json.message);
                } else {
                    var list = [];
                    json.data.map(function(o) {
                        list.push({ fid: o.id, money: o.money });
                    });

                    vmRedpacket.list = list;
                    calPayMoney(0);

                    if (list.length > 0) {
                        vmRedpacket.selectRedpacket(list[0].fid, list[0].money);

                        var pickerList = [];
                        list.map(function(o) {
                            pickerList.push({
                                fid: o.fid,
                                money: o.money,
                                text: '<section class="hongbao">' + o.money + '元&emsp;体验基金</section>'
                            });
                        });

                        pickerList.push({
                            fid: 0,
                            money: 0,
                            text: '<section>不使用体验基金</section>'
                        });

                        //绑定基金列表
                        (function($, doc) {
                            var userPicker = new $.PopPicker();
                            userPicker.setData(pickerList);
                            var showUserPickerButton = doc.getElementById('showUserPicker');

                            showUserPickerButton.addEventListener('tap', function(event) {
                                userPicker.show(function(items) {
                                    //userResult.innerText = JSON.stringify(items[0]);
                                    //返回 false 可以阻止选择框的关闭
                                    //return true;
                                    vmRedpacket.selectRedpacket(items[0].fid, items[0].money);
                                });
                            }, false);
                        })(mui, document);
                    }

                    vmRedpacket.getBtnText();
                }
            }
        });
    },
    selectRedpacket: function(fid, money) {
        vmRedpacket.selectedID = fid;
        if (vmRedpacket.bonusMoney == 0) {
            calPayMoney(money);
        }
        vmRedpacket.bonusMoney = money;
    },
    redpacketBtnText: '',
    getBtnText: function() {
        if (vmRedpacket.selectedID > 0) {
            vmRedpacket.redpacketBtnText = '体验基金减免' + vmRedpacket.bonusMoney + '元';
        } else {
            vmRedpacket.redpacketBtnText = vmRedpacket.list.size() + '个可用基金';
        }
    }
});

vmRedpacket.getData();

vmRedpacket.$watch("bonusMoney", function(a) {
    calPayMoney(a);
});

function calPayMoney(bonus) {
    var result = vmOrder.price * vmOrder.number + vmOrder.goodsPrice - bonus;
    if (result < 0) {
        vmOrder.payMoney = 0;
    } else {
        vmOrder.payMoney = result;
    }
    vmRedpacket.getBtnText();
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
            if (res.err_msg == "get_brand_wcpay_request:fail") {
                alert("Ooops，出问题了，请重试");
            }
            
            location.href = 'order.html?id=' + vmOrder.oid;
        }
    });
}
