var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmWaste = avalon.define({
    $id: 'waste',
    amount: 0,
    reportTime: '',
    repairTime: '',
    isDisabled: false,
    typeName:'维修',
    typeId:1,
    toolName:'请选择物品',
    toolId:0,
    cid:0,
    unitPrice:0,
    toolList:[],
    submit: function() {
        if(vmWaste.cid===0||vmWaste.repairTime===''||vmWaste.reportTime===''||vmWaste.amount===''){
            if(vmWaste.cid===0){
                mui.toast("请选择物品");
                return;
            }
            if(vmWaste.typeId==1){
                if(vmWaste.amount==''){
                mui.toast("请填写金额");
                return;
                }
            }
            if(vmWaste.reportTime===''||vmWaste.repairTime===''){
                mui.toast("请填写对应的时间");
                return;
            }
        }
        vmWaste.isDisabled = true;
        ajaxJsonp({
            url: urls.damagedOutSave,
            data: {
                cid:vmWaste.cid,
                id: id,
                hid: hid,
                name: vmWaste.toolName,
                amount: vmWaste.amount,
                reportTime: vmWaste.reportTime,
                repairTime: vmWaste.repairTime,
                type:vmWaste.typeId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmWaste.isDisabled = false;
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
        url: urls.damagedOutDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmWaste.cid = json.data.cid;
                vmWaste.toolName = json.data.name;
                vmWaste.amount = json.data.amount;
                vmWaste.reportTime = json.data.reportTime;
                vmWaste.repairTime = json.data.repairTime;
            }
        }
    });
} else {
    vmWaste.reportTime = vmWaste.repairTime = getToday('date');
}
ajaxJsonp({
    url: urls.commodityList,
    data: { type: 3 },
    successCallback: function(json) {
        if (json.status === 1) {
            vmWaste.toolList = mapList(json.data);
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmWaste.toolList);
                    var showUserPickerButton = doc.getElementById('toolPicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmWaste.toolName = items[0].text;
                            vmWaste.cid = items[0].value;
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
    var btn1 = doc.getElementById('datePicker1');
    var btn2 = doc.getElementById('datePicker2');
    btn1.addEventListener('tap', function() {
        var optionsJson = btn1.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmWaste.reportTime = rs.text;
            picker.dispose();
        });
    }, false);
    btn2.addEventListener('tap', function() {
        var optionsJson = btn2.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmWaste.repairTime = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);

(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker = new $.PopPicker();
        toolPicker.setData([{value:1,text:'维修'},{value:2,text:'损坏'}]);
        var showUserPickerButton = doc.getElementById('typePicker');
        showUserPickerButton.addEventListener('tap', function(event) {
            toolPicker.show(function(items) {
                vmWaste.typeId = items[0].value;
                vmWaste.typeName = items[0].text;
            });
        }, false);
    });
})(mui, document);
