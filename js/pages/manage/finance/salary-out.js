var hid = controlCore.getHotel().hid;
var id = getParam('id');

var vmSalary = avalon.define({
    $id: 'salary',
    name: '请选择',
    headUrl: '../img/default.png',
    position: '请选择',
    date: '',
    uid: 0,
    list: [], //员工信息列表
    grantList: [],
    deductList: [],
    grantAmount: 0,
    deductAmount: 0,
    actualAmount: 0,
    isDisabled: false,
    change: function() {
        vmSalary.grantAmount = 0;
        vmSalary.$model.grantList.map(function(e) {
            if (e.amount == '') {
                e.amount = 0;
            }
            vmSalary.grantAmount += e.amount;
        });
        vmSalary.deductAmount = 0;
        vmSalary.$model.deductList.map(function(e) {
            if (e.amount == '') {
                e.amount = 0;
            }
            vmSalary.deductAmount += e.amount;
        });
        vmSalary.grantAmount = round(vmSalary.grantAmount);
        vmSalary.deductAmount = round(vmSalary.deductAmount);
        vmSalary.actualAmount = round(vmSalary.grantAmount - vmSalary.deductAmount);
    },
    submit: function() {
        vmSalary.isDisabled = true;
        var json = vmSalary.$model.grantList.concat(vmSalary.$model.deductList);
        var jsonrec = [];
        json.map(function(e) {
            jsonrec.push({ pid: e.pid, amount: e.amount });
        });
        console.log(json);
        jsonrec = JSON.stringify(jsonrec);
        console.log(jsonrec);
        ajaxJsonp({
            url: urls.salaryOutSave,
            data: {
                hid: hid,
                id: id,
                uid: vmSalary.uid,
                outlayTime: vmSalary.date,
                lines: jsonrec
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    alert('操作成功');
                    document.referrer ? history.go(-1) : location.replace('../manage/finance.html');
                } else {
                    alert(json.message);
                    vmSalary.isDisabled = false;
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
        url: urls.salaryOutDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmSalary.name = json.data.salaryInfoOutlay.user.name;
                vmSalary.uid = json.data.salaryInfoOutlay.uid;
                vmSalary.date = json.data.salaryInfoOutlay.outlayTime;
                vmSalary.headUrl = urlAPINet + json.data.salaryInfoOutlay.user.headUrl;
                vmSalary.position = json.data.salaryInfoOutlay.user.employee.position.label;
                vmSalary.grantAmount = json.data.salaryInfoOutlay.grantAmount;
                vmSalary.deductAmount = json.data.salaryInfoOutlay.deductAmount;
                vmSalary.actualAmount = json.data.salaryInfoOutlay.actualAmount;
                vmSalary.grantList = json.data.grantList;
                vmSalary.deductList = json.data.deductList;
            }
        }
    });
} else {
    ajaxJsonp({
        url: urls.salaryOutDetail,
        data: { id: id },
        successCallback: function(json) {
            if (json.status === 1) {
                vmSalary.grantList = json.data.grantList;
                vmSalary.deductList = json.data.deductList;
            }
        }
    });
    vmSalary.date = getToday('date');
}

ajaxJsonp({
    url: urls.employeeList,
    data: {
        hid: hid
    },
    successCallback: function(json) {
        if (json.status === 1) {
            json.data.list.map(function(item) {
                vmSalary.list.push({ value: item.id, text: item.name, headUrl: item.headUrl, position: item.employee.position.label });
            });

            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker = new $.PopPicker();
                    toolPicker.setData(vmSalary.list);
                    var showUserPickerButton = doc.getElementById('employeePicker');
                    showUserPickerButton.addEventListener('tap', function(event) {
                        toolPicker.show(function(items) {
                            vmSalary.name = items[0].text;
                            vmSalary.uid = items[0].value;
                            vmSalary.position = items[0].position;
                            vmSalary.headUrl = urlAPINet + items[0].headUrl;
                        });
                    }, false);
                });
            })(mui, document);
        } else {
            alert(json.message);
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
            vmSalary.date = rs.text;
            picker.dispose();
        });
    }, false);
})(mui, document);
