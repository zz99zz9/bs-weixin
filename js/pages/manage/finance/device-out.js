var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmDevice = avalon.define({
    $id: 'device',
    unitPrice: 0,
    cid: 0,
    name: '请选择项目',
    count: 0,
    sum: 0,
    date: '',
    toolList: [],
    unit: '',
    isDisabled: false,
    submit: function() {
        if(vmDevice.cid===0||vmDevice.date===''||vmDevice.count==='0'||vmDevice.count===''){
            if(vmDevice.cid===0){
                mui.toast("请选择物品");
                return;
            }
            if(vmDevice.count==='0'||vmDevice.count===''){
                mui.toast("请填写数量");
                return;
            }
            if(vmDevice.date==''){
                mui.toast("请填写对应的时间");
                return;
            }
        }
        vmDevice.isDisabled = true;
        ajaxJsonp({
            url: urls.commoditySave,
            data: {
                hid: hid,
                id: id,
                cid: vmDevice.cid,
                type: 3,
                quantity: vmDevice.count,
                outlayDate: vmDevice.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmDevice.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
        document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
    }
});
//
if (id != '') {
    ajaxJsonp({
        url: urls.commodityDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmDevice.cid = json.data.cid;
                vmDevice.name = json.data.name;
                vmDevice.unitPrice = json.data.price;
                vmDevice.count = json.data.quantity;
                vmDevice.unit = json.data.unit;
                vmDevice.date = json.data.createTime;
            }
        }
    });
} else {
    vmDevice.date = getToday('date');

}

ajaxJsonp({
    url: urls.commodityList,
    data: { type: 3 },
    successCallback: function(json) {
        if (json.status === 1) {
            vmDevice.toolList = mapList(json.data);
            // json.data.map(function(item){
            //     vmDevice.toolList.push({value:item.id,text:item.name});
            // });
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmDevice.toolList);
                    var showUserPickerButton = doc.getElementById('toolPicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmDevice.name = items[0].text;
                            vmDevice.cid = items[0].value;
                            vmDevice.unitPrice = items[0].price;
                            vmDevice.unit = items[0].unit;
                        });
                    }, false);
                });
            })(mui, document);
        } else {
            // location.href = document.referrer || "index.html";
        }
    }
});

(function($, doc) {
    $.init();
    var btn = doc.getElementById('datePicker')
    btn.addEventListener('tap', function() {
        var optionsJson = btn.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        options.isSection = false; //月份和日期有全部的选项
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmDevice.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
