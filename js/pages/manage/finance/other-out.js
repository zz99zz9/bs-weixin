var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmOther = avalon.define({
    $id: 'other',
    name: '请选择',
    amount: 0,
    date: '',
    uid: '',
    list: [],
    reason: '',
    isDisabled: false,
    submit: function() {
        if(vmOther.reason===''||vmOther.amount==='0'||vmOther.amount===0){
            if(vmOther.reason===''){
                mui.toast('请填写原因');
            }else{
                mui.toast('请填写金额');
            }
            return;
        }
        vmOther.isDisabled = true;
        ajaxJsonp({
            url: urls.otherOutSave,
            data: {
                hid: hid,
                id: id,
                uid: vmOther.uid,
                reason: vmOther.reason,
                amount: vmOther.amount,
                outlayTime: vmOther.date
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmOther.isDisabled = false;
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
        url: urls.otherOutDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmOther.reason = json.data.reason;
                vmOther.amount = json.data.amount;
                vmOther.uid = json.data.uid;
                vmOther.date = json.data.outlayTime;
                //console.log(json.data);
                getPicker();
            }
        }
    });
} else {
    vmOther.date = getToday('date');
    getPicker();
}
//获取人员列表放入picker选择器
function getPicker() {
    ajaxJsonp({
        url: urls.employeeList,
        data: {
            hid: hid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                json.data.list.map(function(item) {
                    vmOther.list.push({ value: item.id, text: item.name });
                    // if(item.id==vmOther.uid){
                    //     vmOther.name = item.name;
                    // }
                });

                (function($, doc) {
                    $.init();
                    $.ready(function() {
                        var toolPicker = new $.PopPicker();
                        toolPicker.setData(vmOther.list);
                        toolPicker.pickers[0].setSelectedValue(vmOther.uid);
                        //console.log(vmOther.uid);
                        //vmOther.name = toolPicker.pickers[0].getSelectedText();
                        //console.log(toolPicker.pickers[0].getSelectedText());
                        var showUserPickerButton = doc.getElementById('employeePicker');
                        showUserPickerButton.addEventListener('tap', function(event) {
                            toolPicker.show(function(items) {
                                vmOther.name = items[0].text;
                                vmOther.uid = items[0].value;
                            });
                        }, false);
                    });
                })(mui, document);
            } else {
                alert(json.message);
            }
        }
    });
}

(function($, doc) {
    $.init();
    var btn = doc.getElementById('datePicker')
    btn.addEventListener('tap', function() {
        var optionsJson = btn.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        var picker = new $.DtPicker(options);
        picker.show(function(rs) {
            vmOther.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
