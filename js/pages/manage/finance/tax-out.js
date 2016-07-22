var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmTax = avalon.define({
    $id: 'tax',
    name: '',
    amount: 0,
    date: '',
    typeId: 0,
    typeName: '请选择',
    typeList: [],
    isDisabled: false,
    submit: function() {
        if (vmTax.name === '' || vmTax.amount == 0) {
            if (vmTax.name === '') {
                mui.toast('请输入名称');
            }
            if (vmTax.amount == 0) {
                mui.toast('请填写金额');
            }
            if (vmTax.typeName === '') {
                mui.toast('请选择税种');
            }
            return;
        }
        vmTax.isDisabled = true;
        ajaxJsonp({
            url: urls.taxOutSave,
            data: {
                hid: hid,
                id: id,
                name: vmTax.name,
                typeId: vmTax.typeId,
                typeName: vmTax.typeName,
                amount: vmTax.amount,
                outlayTime: vmTax.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmTax.isDisabled = false;
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
        url: urls.taxOutDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmTax.name = json.data.name;
                vmTax.amount = json.data.amount;
                vmTax.typeId = json.data.typeId;
                vmTax.typeName = json.data.typeName;
                vmTax.date = json.data.outlayTime;
            }
        }
    });
} else {
    vmTax.date = getToday('date');

}
// ajaxJsonp({
//     url: urls.dictList,
//     data: { type: 9 },
//     successCallback: function(json) {
//         if (json.status === 1) {
            // json.data.map(function(item) {
            //     vmTax.typeList.push({value: item.id, text: item.label});
            // });
//         }
//     }
// });

ajaxJsonp({
    url: urls.dictList,
    data: { type: 9 },
    successCallback: function(json) {
        if (json.status === 1) {
                json.data.map(function(item) {
                vmTax.typeList.push({value: item.id, text: item.label});
            });
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmTax.typeList);
                    var showUserPickerButton = doc.getElementById('taxPicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmTax.typeName = items[0].text;
                            vmTax.typeId = items[0].value;
                        });
                    }, false);
                });
            })(mui, document);
        } else {
            // location.href = document.referrer || "index.html";
        }
    }
});


// (function($, doc) {
//     $.init();
//     $.ready(function() {
//         var toolPicker = new $.PopPicker();
//         toolPicker.setData(vmTax.typeList);
//         var showUserPickerButton = doc.getElementById('taxPicker');
//         showUserPickerButton.addEventListener('tap', function(event) {
//             toolPicker.show(function(items) {
//                 vmTax.typeName = items[0].text;
//                 vmTax.typeId = items[0].value;
//             });
//         }, false);
//     });
// })(mui, document);

(function($, doc) {
    $.init();
    var btn = doc.getElementById('datePicker')
    btn.addEventListener('tap', function() {
        var optionsJson = btn.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmTax.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
