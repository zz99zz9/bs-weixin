var hotel = controlCore.getHotel();

var outid = getParam("id");
if (outid != "") {
    if (isNaN(outid)) {
        location.href = document.referrer || "warehouse.html";
    } else {
        outid = parseInt(outid);
    }
} else {
    outid = 0;
}
var vmOutStorage = avalon.define({
    $id: 'out',
    date: '--请选择--',
    listIn: [],
    listOut: [],
    listWay: [],
    listAgent: [],
    listCommodity: [],
    data: {
        outDate: '--请选择--',
        warehouse: { value: '', name: '--请选择--' },
        inWarehouse: { value: '', name: '--请选择--' },
        warehousePutWay: { value: '', name: '--请选择--' },
        agent: { value: '', name: '--请选择--' },
        commodity: { value: '', name: '--请选择--', stock: '', price: '', unit: '' },
        quantity: ''
    },
    wid: '',
    inWid: '',
    agentUid: '',
    cid: '',
    pid: '',
    type: 001,
    isCreateAllot: 0,
    isDisabled: true,
    isAllocate: function(value) {
        vmOutStorage.isCreateAllot = value;
    },
    isInShow: function() {
        if (vmOutStorage.isCreateAllot == 1) {
            return true;
        } else {
            return false;
        }
    },
    isAllocateListShow: function() {
        return vmOutStorage.isCreateAllot == 1;
    },
    isAddShow: function() {
        if (outid == 0) {
            return true;
        } else {
            return false;
        }
    },
    changed: function() {
        vmOutStorage.data.quantity = vmOutStorage.data.quantity.replace(/\D/g, '');
        //符合一定规则再让按钮可以点击
        if (vmOutStorage.outDate == '--请选择--' || vmOutStorage.outDate == '') {
            vmOutStorage.isDisabled = true;
            return;
        }
        if (vmOutStorage.data.warehouse.name == '--请选择--' || vmOutStorage.data.warehouse.name == '') {
            vmOutStorage.isDisabled = true;
            return;
        }
        if (vmOutStorage.data.agent.name == '--请选择--' || vmOutStorage.data.agent.name == '') {
            vmOutStorage.isDisabled = true;
            return;
        }
        if ((vmOutStorage.data.inWarehouse.name == '--请选择--' && vmOutStorage.isCreateAllot == 1) || vmOutStorage.data.inWarehouse.name == '') {
            
                vmOutStorage.isDisabled = true;
                return;
            
        }
        if (vmOutStorage.data.warehouse.name == vmOutStorage.data.inWarehouse.name) {
            vmOutStorage.isDisabled = true;
            return;
        }

        if (vmOutStorage.data.warehousePutWay.name == '--请选择--' || vmOutStorage.data.warehousePutWay.name == '') {
            vmOutStorage.isDisabled = true;
            return;
        }
        if (vmOutStorage.data.commodity.name == '--请选择--' || vmOutStorage.data.commodity.name == '') {
            vmOutStorage.isDisabled = true;
            return;
        }
        if (vmOutStorage.data.quantity == '' || vmOutStorage.data.quantity <= 0 || (vmOutStorage.data.commodity.stock - vmOutStorage.data.quantity) < 0) {
            vmOutStorage.isDisabled = true;
            return;
        }
        vmOutStorage.isDisabled = false;

    },
    save: function() {
        ajaxJsonp({
            url: urls.warehouseOutSave,
            data: {
                hid: hotel.hid,
                wid: vmOutStorage.wid,
                sid: vmOutStorage.sid,
                agentUid: vmOutStorage.agentUid,
                pid: vmOutStorage.pid,
                cid: vmOutStorage.cid,
                quantity: vmOutStorage.data.quantity,
                outDate: vmOutStorage.data.outDate,
                isCreateAllot: vmOutStorage.isCreateAllot,
                isCreateAllot: vmOutStorage.isCreateAllot,
                inWid: vmOutStorage.inWid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
                } else {
                    alert(json.message);
                    vmOutStorage.isDisabled = false;
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

            // * rs.value 拼合后的 value
            // * rs.text 拼合后的 text
            // * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
            // * rs.m 月，用法同年
            // * rs.d 日，用法同年
            // * rs.h 时，用法同年
            // * rs.i 分（minutes 的第二个字母），用法同年

            vmOutStorage.data.outDate = rs.text;
            vmOutStorage.changed();
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

if (outid == 0) {
    $("#headerReplace").text("出库添加");

    //出库仓库选择
    ajaxJsonp({
        url: urls.warehouseList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmOutStorage.listOut.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton1 = doc.getElementById('showUserPicker1');
                    showUserPickerButton1.addEventListener('tap', function(event) {
                        userPicker.setData(vmOutStorage.listOut);
                        userPicker.show(function(items) {
                            vmOutStorage.data.warehouse.name = items[0].text;
                            vmOutStorage.wid = items[0].value;
                            vmOutStorage.changed();
                            //商品选择
                            ajaxJsonp({
                                url: urls.commodityStockList,
                                data: {
                                    wid: vmOutStorage.wid
                                },
                                successCallback: function(json) {
                                    if (json.status === 1) {
                                        json.data.map(function(e) {
                                            vmOutStorage.listCommodity.push({ value: e.id, text: e.name, price: e.price, stock: e.stock, unit: e.unit });
                                        });
                                        (function($, doc) {
                                            var userPicker = new $.PopPicker();
                                            var showUserPickerButton5 = doc.getElementById('showUserPicker5');
                                            showUserPickerButton5.addEventListener('tap', function(event) {
                                                userPicker.setData(vmOutStorage.listCommodity);
                                                userPicker.show(function(items) {
                                                    vmOutStorage.data.commodity.name = items[0].text;
                                                    vmOutStorage.data.commodity.price = items[0].price;
                                                    vmOutStorage.data.commodity.unit = items[0].unit;
                                                    vmOutStorage.data.commodity.stock = items[0].stock;
                                                    vmOutStorage.data.quantity = '';
                                                    vmOutStorage.cid = items[0].value;
                                                    vmOutStorage.changed();
                                                });
                                            }, false);
                                        })(mui, document);
                                    } else {
                                        alert(json.message);
                                    }
                                }
                            });
                            console.log(vmOutStorage.data.commodity.stock);
                            //console.log(vmOutStorage.data.warehouse.name);
                            //返回 false 可以阻止选择框的关闭
                            //return false;
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
                    vmOutStorage.listAgent.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton2 = doc.getElementById('showUserPicker2');
                    showUserPickerButton2.addEventListener('tap', function(event) {
                        userPicker.setData(vmOutStorage.listAgent);
                        userPicker.show(function(items) {
                            vmOutStorage.data.agent.name = items[0].text;
                            vmOutStorage.agentUid = items[0].value;
                            vmOutStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //入库仓库选择
    ajaxJsonp({
        url: urls.warehouseList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmOutStorage.listIn.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton3 = doc.getElementById('showUserPicker3');
                    showUserPickerButton3.addEventListener('tap', function(event) {
                        userPicker.setData(vmOutStorage.listIn);
                        userPicker.show(function(items) {
                            vmOutStorage.data.inWarehouse.name = items[0].text;
                            vmOutStorage.inWid = items[0].value;
                            vmOutStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

    //出库方式选择
    ajaxJsonp({
        url: urls.warehouseWayList,
        data: {
            type: vmOutStorage.type
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmOutStorage.listWay.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton4 = doc.getElementById('showUserPicker4');
                    showUserPickerButton4.addEventListener('tap', function(event) {
                        userPicker.setData(vmOutStorage.listWay);
                        userPicker.show(function(items) {
                            vmOutStorage.data.warehousePutWay.name = items[0].text;
                            vmOutStorage.pid = items[0].value;
                            vmOutStorage.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });

} else {
    $("#headerReplace").text("出库详情");
    ajaxJsonp({
        url: urls.warehouseOutDetail,
        data: { id: outid },
        successCallback: function(json) {
            if (json.status === 1) {
                console.log(123);
                vmOutStorage.data = json.data;
                console.log(json.data);
            } else {
                // location.href = document.referrer || "index.html";
            }
        }
    });
}
