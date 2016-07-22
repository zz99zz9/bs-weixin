var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmEnergy = avalon.define({
    $id: 'energy',
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
        if(vmEnergy.cid===0||vmEnergy.date===''||vmEnergy.count==='0'||vmEnergy.count===''){
            if(vmEnergy.cid===0){
                mui.toast("请选择物品");
                return;
            }
            if(vmEnergy.count==='0'||vmEnergy.count===''){
                mui.toast("请填写数量");
                return;
            }
            if(vmEnergy.date==''){
                mui.toast("请填写对应的时间");
                return;
            }
        }
        vmEnergy.isDisabled = true;
        ajaxJsonp({
            url: urls.commoditySave,
            data: {
                hid: hid,
                id: id,
                cid: vmEnergy.cid,
                type: 2,
                quantity: vmEnergy.count,
                outlayDate: vmEnergy.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmEnergy.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
        if(confirm("确定取消？")){
            document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
        }
    }
});
//
if (id != '') {
    ajaxJsonp({
        url: urls.commodityDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmEnergy.cid = json.data.cid;
                vmEnergy.name = json.data.name;
                vmEnergy.unitPrice = json.data.price;
                vmEnergy.count = json.data.quantity;
                vmEnergy.unit = json.data.unit;
                vmEnergy.date = json.data.createTime;
            }
        }
    });
} else {
    vmEnergy.date = getToday('date');

}

ajaxJsonp({
    url: urls.commodityList,
    data: { type: 2 },
    successCallback: function(json) {
        if (json.status === 1) {
            vmEnergy.toolList = mapList(json.data);
            // json.data.map(function(item){
            //     vmEnergy.toolList.push({value:item.id,text:item.name});
            // });
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmEnergy.toolList);
                    var showUserPickerButton = doc.getElementById('toolPicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmEnergy.name = items[0].text;
                            vmEnergy.cid = items[0].value;
                            vmEnergy.unitPrice = items[0].price;
                            vmEnergy.unit = items[0].unit;
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
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmEnergy.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
