var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmCommodity = avalon.define({
    $id: 'commodity',
    unitPrice: 0,
    cid: 0,
    name: '请选择物品',
    count: 0,
    sum: 0,
    date: '',
    toolList: [],
    unit: '',
    isDisabled: false,
    submit: function() {
        if(vmCommodity.cid===0||vmCommodity.count===''||vmCommodity.count==='0'){
            if(vmCommodity.cid ===0){
                mui.toast("请选择物品");
                return;
            }
            if(vmCommodity.count===''||vmCommodity.count==='0'){
                mui.toast("请填写数量");
                return;
            }
        }
        vmCommodity.isDisabled = true;
        ajaxJsonp({
            url: urls.commoditySave,
            data: {
                hid: hid,
                id: id,
                cid: vmCommodity.cid,
                type: 1,
                quantity: vmCommodity.count,
                outlayDate: vmCommodity.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmCommodity.isDisabled = false;
                }
            }
        });
    },
    cancel: function() {
        if (confirm("确认取消？")) {
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
                vmCommodity.cid = json.data.cid;
                vmCommodity.name = json.data.name;
                vmCommodity.unitPrice = json.data.price;
                vmCommodity.count = json.data.quantity;
                vmCommodity.unit = json.data.unit;
                vmCommodity.date = json.data.createTime;
            }
        }
    });
} else {
    vmCommodity.date = getToday('date');

}

ajaxJsonp({
    url: urls.commodityList,
    data: { type: 1 },
    successCallback: function(json) {
        if (json.status === 1) {
            vmCommodity.toolList = mapList(json.data);
            // json.data.map(function(item){
            //     vmCommodity.toolList.push({value:item.id,text:item.name});
            // });
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmCommodity.toolList);
                    var showUserPickerButton = doc.getElementById('toolPicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmCommodity.name = items[0].text;
                            vmCommodity.cid = items[0].value;
                            vmCommodity.unitPrice = items[0].price;
                            vmCommodity.unit = items[0].unit;
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
            vmCommodity.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
