var hotel = controlCore.getHotel();

var allocateid = getParam("id");
if (allocateid != "") {
    if (isNaN(allocateid)) {
        location.href = document.referrer || "index.html";
    } else {
        allocateid = parseInt(allocateid);
    }
} else {
    allocateid = 0;
}

var vmAllocate = avalon.define({
    $id: 'allocate',
    listOut: [],
    listIn: [],
    listAgent: [],
    listCreator: [],
    listCommodity: [],
    data: {
        allotDate: '--请选择--',
        outWarehouse: { value: '', name: '--请选择--' },
        inWarehouse: { value: '', name: '--请选择--' },
        agent: { value: '', name: '--请选择--' },
        commodity: { value: '', name: '--请选择--', stock: '', price: '', unit: '' },
        quantity: '',
    },
    wid: '',
    outWid: '',
    inWid: '',
    agentUid: '',
    cid: '',
    isDisabled: true,
    isAddShow: function() {
        if (allocateid == 0) {
            return true;
        } else {
            return false;
        }
    },
    changed: function() {
        vmAllocate.data.quantity = vmAllocate.data.quantity.replace(/\D/g, '');
        //符合一定规则再让按钮可以点击
        if (vmAllocate.allotDate == '--请选择--' || vmAllocate.allotDate == '') {
            vmAllocate.isDisabled = true;
            return;
        }
        if (vmAllocate.data.outWarehouse.name == '--请选择--' || vmAllocate.data.outWarehouse.name == '') {
            vmAllocate.isDisabled = true;
            return;
        }
        if (vmAllocate.data.inWarehouse.name == '--请选择--' || vmAllocate.data.inWarehouse.name == '') {
            vmAllocate.isDisabled = true;
            return;
        }
        if (vmAllocate.data.outWarehouse.name == vmAllocate.data.inWarehouse.name) {
            vmAllocate.isDisabled = true;
            return;
        }
        if (vmAllocate.data.agent.name == '--请选择--' || vmAllocate.data.agent.name == '') {
            vmAllocate.isDisabled = true;
            return;
        }
        if (vmAllocate.data.commodity.name == '--请选择--' || vmAllocate.data.commodity.name == '') {
            vmAllocate.isDisabled = true;
            return;
        }

        if (vmAllocate.data.quantity == '' || vmAllocate.data.quantity <= 0 || (vmAllocate.data.commodity.stock - vmAllocate.data.quantity) < 0) {
            vmAllocate.isDisabled = true;
            return;
        }
        console.log(vmAllocate.data.quantity);
        vmAllocate.isDisabled = false;

    },
    save: function() {
        ajaxJsonp({
            url: urls.warehouseAllocateSave,
            data: {
                hid: hotel.hid,
                outWid: vmAllocate.outWid,
                inWid: vmAllocate.inWid,
                agentUid: vmAllocate.agentUid,
                cid: vmAllocate.wid,
                quantity: vmAllocate.data.quantity,
                allotDate: vmAllocate.data.allotDate
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/warehouse.html');
                } else {
                    alert(json.message);
                    vmAllocate.isDisabled = false;
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
            vmAllocate.data.allotDate = rs.text;
            vmAllocate.changed();
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

if (allocateid == 0) {
    $("#headerReplace").text("调拨添加");

    //出库仓库选择
    ajaxJsonp({
        url: urls.warehouseList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmAllocate.listOut.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton1 = doc.getElementById('showUserPicker1');
                    showUserPickerButton1.addEventListener('tap', function(event) {
                        userPicker.setData(vmAllocate.listOut);
                        userPicker.show(function(items) {
                            vmAllocate.data.outWarehouse.name = items[0].text;
                            vmAllocate.outWid = items[0].value;
                            vmAllocate.changed();

                            //商品选择
                            ajaxJsonp({
                                url: urls.commodityStockList,
                                data: {
                                    wid: vmAllocate.outWid
                                },
                                successCallback: function(json) {
                                    if (json.status === 1) {
                                        json.data.map(function(e) {
                                            vmAllocate.listCommodity.push({ value: e.id, text: e.name, price: e.price, stock: e.stock, unit: e.unit });
                                        });
                                        (function($, doc) {
                                            var userPicker = new $.PopPicker();
                                            var showUserPickerButton5 = doc.getElementById('showUserPicker5');
                                            showUserPickerButton5.addEventListener('tap', function(event) {
                                                userPicker.setData(vmAllocate.listCommodity);
                                                userPicker.show(function(items) {
                                                    vmAllocate.wid = items[0].value;
                                                    vmAllocate.data.commodity.name = items[0].text;
                                                    vmAllocate.data.commodity.price = items[0].price;
                                                    vmAllocate.data.commodity.unit = items[0].unit;
                                                    vmAllocate.data.commodity.stock = items[0].stock;
                                                    vmAllocate.data.quantity = '';
                                                    vmAllocate.changed();
                                                });
                                            }, false);
                                        })(mui, document);
                                    } else {
                                        alert(json.message);
                                    }
                                }
                            });
                            //console.log(vmAllocate.data.outWarehouse.name);
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

    //入库仓库选择
    ajaxJsonp({
        url: urls.warehouseList,
        data: {
            hid: hotel.hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.map(function(e) {
                    vmAllocate.listIn.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton2 = doc.getElementById('showUserPicker2');
                    showUserPickerButton2.addEventListener('tap', function(event) {
                        userPicker.setData(vmAllocate.listIn);
                        userPicker.show(function(items) {
                            vmAllocate.data.inWarehouse.name = items[0].text;
                            vmAllocate.inWid = items[0].value;
                            vmAllocate.changed();
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
                    vmAllocate.listAgent.push({ value: e.id, text: e.name });
                });
                (function($, doc) {
                    var userPicker = new $.PopPicker();
                    var showUserPickerButton3 = doc.getElementById('showUserPicker3');
                    showUserPickerButton3.addEventListener('tap', function(event) {
                        userPicker.setData(vmAllocate.listAgent);
                        userPicker.show(function(items) {
                            vmAllocate.data.agent.name = items[0].text;
                            vmAllocate.agentUid = items[0].value;
                            vmAllocate.changed();
                        });
                    }, false);
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });


} else {
    $("#headerReplace").text("调拨详情");
    ajaxJsonp({
        url: urls.warehouseAllocateDetail,
        data: { id: allocateid },
        successCallback: function(json) {
            if (json.status === 1) {
                vmAllocate.data = json.data;
                console.log(vmAllocate.data);
            } else {
                // location.href = document.referrer || "index.html";
            }
        }
    });
}
