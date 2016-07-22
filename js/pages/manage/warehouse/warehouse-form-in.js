var hotel = controlCore.getHotel();

var inid = getParam("id");
if (inid != "") {
    if (isNaN(inid)) {
        location.href = document.referrer || "index.html";
    } else {
        inid = parseInt(inid);
    }
} else {
    inid = 0;
}

var vmInStorage = avalon.define({
    $id: 'in',
    listSupplier: [],
    listIn: [],
    listWay: [],
    listAgent: [],
    listCreator: [],
    listCommodity: [],
    data: {
        carator: { value: '', name: '--请选择--' },
        inDate: '--请选择--',
        supplier: { value: '', name: '--请选择--' },
        warehouse: { value: '', name: '--请选择--' },
        warehousePutWay: { value: '', name: '--请选择--' },
        agent: { value: '', name: '--请选择--' },
        commodity: { value: '', name: '--请选择--', stock: '', price: '', unit: ''},
        quantity: '',
    },
    wid: '',
    sid: '',
    agentUid: '',
    pid: '',
    cid: '',
    type: 001,
    isDisabled: true,
    isAddShow: function() {
        if (inid == 0) {
            return true;
        } else {
            return false;
        }
    },
    changed: function() {
        console.log(vmInStorage.data.quantity);
        vmInStorage.data.quantity = vmInStorage.data.quantity.replace(/\D/g, '');
        //符合一定规则再让按钮可以点击
        if (vmInStorage.inDate == '--请选择--' || vmInStorage.inDate == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.warehouse.name == '--请选择--' || vmInStorage.data.warehouse.name == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.supplier.name == '--请选择--' || vmInStorage.data.supplier.name == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.agent.name == '--请选择--' || vmInStorage.data.agent.name == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.warehousePutWay.name == '--请选择--' || vmInStorage.data.warehousePutWay.name == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.commodity.name == '--请选择--' || vmInStorage.data.commodity.name == '') {
            vmInStorage.isDisabled = true;
            return;
        }
        if (vmInStorage.data.quantity == '' || vmInStorage.data.quantity <= 0 ) {
            vmInStorage.isDisabled = true;
            return;
        }
        vmInStorage.isDisabled = false;

    },
    save: function() {
        ajaxJsonp({
            url: urls.warehouseInSave,
            data: {
                hid: hotel.hid,
                wid: vmInStorage.wid,
                sid: vmInStorage.sid,
                agentUid: vmInStorage.agentUid,
                pid: vmInStorage.pid,
                cid: vmInStorage.type,
                quantity: vmInStorage.data.quantity,
                inDate: vmInStorage.data.inDate
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
                } else {
                    alert(json.message);
                    vmInStorage.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
        document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
    }
});

(function($, doc) {
    var btns = doc.getElementById('demo4');
    btns.addEventListener('tap', function() {
        var optionsJson = this.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        //options.isSection = true; //月份和日期有全部的选项
        var id = this.getAttribute('id');
        /*
         * 首次显示时实例化组件
         * 示例为了简洁，将 options 放在了按钮的 dom 上
         * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
         */
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            /*
             * rs.value 拼合后的 value
             * rs.text 拼合后的 text
             * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
             * rs.m 月，用法同年
             * rs.d 日，用法同年
             * rs.h 时，用法同年
             * rs.i 分（minutes 的第二个字母），用法同年
             */
            vmInStorage.data.inDate = rs.text;
            vmInStorage.changed();
            /* 
             * 返回 false 可以阻止选择框的关闭
             * return false;
             */
            /*
             * 释放组件资源，释放后将将不能再操作组件
             * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
             * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
             * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
             */
            picker.dispose();
        });
    }, false);
})(mui, document);

if (inid == 0) {
    $("#headerReplace").text("入库添加");

    //仓库选择
    ajaxJsonp({
        url: urls.warehouseList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmInStorage.listIn.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton1 = doc.getElementById('showUserPicker1');
                    showUserPickerButton1.addEventListener('tap', function(event) {
                        userPicker.setData(vmInStorage.listIn);
                        userPicker.show(function(items) {
                            vmInStorage.data.warehouse.name = items[0].text;
                            vmInStorage.wid = items[0].value;
                            vmInStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //供应商选择
    ajaxJsonp({
        url: urls.supplierList,
        data: {},
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmInStorage.listSupplier.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton2 = doc.getElementById('showUserPicker2');
                    showUserPickerButton2.addEventListener('tap', function(event) {
                        userPicker.setData(vmInStorage.listSupplier);
                        userPicker.show(function(items) {
                            vmInStorage.data.supplier.name = items[0].text;
                            vmInStorage.sid = items[0].value;
                            vmInStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //经办人选择
    ajaxJsonp({
        url: urls.employeeList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.list.map(function(e) {
                    vmInStorage.listAgent.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton3 = doc.getElementById('showUserPicker3');
                    showUserPickerButton3.addEventListener('tap', function(event) {
                        userPicker.setData(vmInStorage.listAgent);
                        userPicker.show(function(items) {
                            vmInStorage.data.agent.name = items[0].text;
                            vmInStorage.agentUid = items[0].value;
                            vmInStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //入库方式选择
    ajaxJsonp({
        url: urls.warehouseWayList,
        data: {
            type: vmInStorage.type
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmInStorage.listWay.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton4 = doc.getElementById('showUserPicker4');
                    showUserPickerButton4.addEventListener('tap', function(event) {
                        userPicker.setData(vmInStorage.listWay);
                        userPicker.show(function(items) {
                            vmInStorage.data.warehousePutWay.name = items[0].text;
                            vmInStorage.pid = items[0].value;
                            vmInStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //商品选择
    ajaxJsonp({
        url: urls.commodityList,
        data: {
            type: vmInStorage.type
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmInStorage.listCommodity.push({ value: e.id, text: e.name, price: e.price, stock: e.stock, unit: e.unit });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton5 = doc.getElementById('showUserPicker5');
                    showUserPickerButton5.addEventListener('tap', function(event) {
                        userPicker.setData(vmInStorage.listCommodity);
                        userPicker.show(function(items) {
                            vmInStorage.type = items[0].value;
                            vmInStorage.data.commodity.name = items[0].text;
                            vmInStorage.data.commodity.price = items[0].price;
                            vmInStorage.data.commodity.unit = items[0].unit;
                            vmInStorage.data.quantity = '';
                            vmInStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });
} else {
    $("#headerReplace").text("入库详情");
    ajaxJsonp({
        url: urls.warehouseInDetail,
        data: { id: inid },
        successCallback: function(json) {
            if (json.status === 1) {
                vmInStorage.data = json.data;
                console.log(vmInStorage.data);
            } else {
                // location.href = document.referrer || "index.html";
            }
        }
    });
}
