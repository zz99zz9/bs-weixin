var hotel = controlCore.getHotel();

var stockid = getParam("id");
if (stockid != "") {
    if (isNaN(stockid)) {
        location.href = document.referrer || "index.html";
    } else {
        stockid = parseInt(stockid);
    }
} else {
    stockid = 0;
}

var vmStock = avalon.define({
    $id: 'stock',
    list: [],
    listCommodity: [],
    type: '',
    actualQuantity: '',
    data: {
        id: '',
        startQuantity: '',
        inQuantity: '',
        allotQuantity: '',
        saleQuantity: '',
        outQuantity: '',
        actualQuantity: '',
        differQuantity: '',
        amount: '',
        remarks: '',
        commodity: { name: '--请选择--' },
        startTime: '--请选择--',
        endTime: '--请选择--',
    },
    isDisabled: true,
    isStartShow: false,
    isAddShow: function() {
        if (stockid == 0) {
            return true;
        } else {
            return false;
        }
    },
    changed: function() {
        vmStock.actualQuantity = vmStock.actualQuantity.replace(/\D/g, '');
        //符合一定规则再让按钮可以点击
        if (vmStock.data.commodity.name == '--请选择--' || vmStock.data.commodity.name == '') {
            vmStock.isDisabled = true;
            return;
        }
        if (vmStock.data.startTime == '--请选择--' || vmStock.data.startTime == '') {
            vmStock.isDisabled = true;
            return;
        }
        if (vmStock.data.endTime == '--请选择--' || vmStock.data.endTime == '') {
            vmStock.isDisabled = true;
            return;
        }
        if ((new Date(vmStock.data.startTime.replace(/-/g, "\/"))) >= (new Date(vmStock.data.endTime.replace(/-/g, "\/")))) {
            vmStock.isDisabled = true;
            return;
        }
        if (vmStock.actualQuantity == '') {
            vmStock.isDisabled = true;
            return;
        }
        vmStock.isDisabled = false;
    },
    save: function() {
        vmStock.isDisabled = true;
        ajaxJsonp({
            url: urls.warehouseStockSave,
            data: {
                hid: hotel.hid,
                id: stockid,
                startTime: vmStock.data.startTime,
                endTime: vmStock.data.endTime,
                cid: vmStock.type,
                actualQuantity: vmStock.actualQuantity,
                remarks: vmStock.data.remarks
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
                } else {
                    alert(json.message);
                    vmStock.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
        document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
    }
});

vmStock.$watch("data.commodity.name", function(a) {
    if (a != "" && vmStock.data.startTime != "" && vmStock.data.endTime != "" && vmStock.data.startTime < vmStock.data.endTime) {
        getData();
    }
});
vmStock.$watch("data.startTime", function(b) {
    if (b != "" && vmStock.data.commodity.name != "" && vmStock.data.endTime != "" && vmStock.data.startTime < vmStock.data.endTime) {
        getData();
    }
});
vmStock.$watch("data.endTime", function(c) {
    if (c != "" && vmStock.data.startTime != "" && vmStock.data.commodity.name != "" && vmStock.data.startTime < vmStock.data.endTime) {
        getData();
    }
});
var getData = function() {
    ajaxJsonp({
        url: urls.warehouseStockAdd,
        data: {
            hid: hotel.hid,
            id: stockid,
            cid: vmStock.type,
            startTime: vmStock.data.startTime,
            endTime: vmStock.data.endTime
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmStock.data.startQuantity = json.data.startQuantity,
                    vmStock.data.inQuantity = json.data.inQuantity,
                    vmStock.data.allotQuantity = json.data.allotQuantity,
                    vmStock.data.saleQuantity = json.data.saleQuantity,
                    vmStock.data.outQuantity = json.data.outQuantity,
                    vmStock.data.differQuantity = json.data.differQuantity,
                    vmStock.data.amount = json.data.amount
            } else {
                // location.href = document.referrer || "index.html";
            }
        }
    });
};

if (stockid == 0) {
    $("#headerReplace").text("库存盘点");
    //商品选择
    ajaxJsonp({
        url: urls.commodityList,
        data: {
            type: vmStock.type
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmStock.listCommodity.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton1 = doc.getElementById('showUserPicker1');
                    showUserPickerButton1.addEventListener('tap', function(event) {
                        userPicker.setData(vmStock.listCommodity);
                        userPicker.show(function(items) {
                            vmStock.type = items[0].value;
                            vmStock.data.commodity.name = items[0].text;
                            vmStock.data.startTime = '';
                            vmStock.data.endTime = '';
                            vmStock.changed();
                            //时间判断
                            ajaxJsonp({
                                url: urls.warehouseStockAdd,
                                data: {
                                    hid: hotel.hid,
                                    id: stockid,
                                    cid: vmStock.type,
                                    startTime: vmStock.data.startTime,
                                    endTime: vmStock.data.endTime
                                },
                                successCallback: function(json) {
                                    if (json.status === 1) {
                                        if (json.data.startTime != '') {
                                            vmStock.data.startTime = json.data.startTime;
                                            vmStock.isStartShow = true;
                                        } else {
                                            vmStock.isStartShow = false;
                                        }
                                    }
                                }
                            });
                        });

                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });
} else {
    $("#headerReplace").text("库存盘点");
    ajaxJsonp({
        url: urls.warehouseStockDetail,
        data: {
            hid: hotel.hid,
            id: stockid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmStock.data = json.data;
                console.log(vmStock.data);
            } else {
                // location.href = document.referrer || "index.html";
            }
        }
    });
}

(function($, doc) {
    $.ready(function() {
        var btns = doc.getElementById('demo4');
        btns.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                vmStock.data.endTime = rs.text;
                vmStock.changed();
                picker.dispose();
            });
        }, false);
    });
})(mui, document);

(function($, doc) {
    $.ready(function() {
        var btns = doc.getElementById('demo3');
        btns.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                vmStock.data.startTime = rs.text;
                vmStock.changed();
                picker.dispose();
            });
        }, false);
    });
})(mui, document);
