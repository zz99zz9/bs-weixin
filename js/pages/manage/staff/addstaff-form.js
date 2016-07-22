var hotel = controlCore.getHotel();

var uid = parseInt(hotel.staffUid);
if (isNaN(uid)) {
    location.href = document.referrer || "staff.html";
}

var uid = hotel.staffUid;
var vmAdd = avalon.define({
    $id: 'addstaff',
    name: '',
    sex: '未知',
    gender: 0,
    mobile: '',
    basicSalary: '',
    countSalary: '',
    position: '',
    positionId: 0,
    isDisabled: false,
    isAdd: false,
    submit: function() {
        vmAdd.isDisabled = true;
        ajaxJsonp({
            url: urls.employeeSave,
            data: {
                uid: uid,
                mobile: vmAdd.mobile,
                name: vmAdd.name,
                hid: hotel.hid,
                gender: vmAdd.gender,
                monthSalary: vmAdd.basicSalary,
                pieceSalary: vmAdd.countSalary,
                position: vmAdd.positionId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    document.referrer ? history.go(-1) : location.replace('../manage/staff.html');
                } else {
                    vmAdd.isDisabled = false;
                    alert(json.message);
                }
            }
        });
    },
    cancel: function() {
        if (confirm('确认取消？')) {
            document.referrer ? history.go(-1) : location.replace('../manage/staff.html');
        }
    }
});
if (uid == 0) {
    uid = '';
    vmAdd.position = '请选择';
    vmAdd.isAdd = false;
} else {
    $('#headerReplace').text('修改员工');
    vmAdd.isAdd = true;
    ajaxJsonp({
        url: urls.employeeDetail,
        data: {
            uid: uid
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmAdd.name = json.data.name;
                vmAdd.mobile = json.data.mobile;
                if (json.data.employee.gender !== 0) {
                    if (json.data.employee.gender === 1) {
                        vmAdd.sex = '男';
                    } else {
                        vmAdd.sex = '女';
                    }
                } else {
                    vmAdd.sex = '未知';
                }
                vmAdd.gender = json.data.employee.gender;
                vmAdd.positionId = json.data.employee.position.id;
                vmAdd.position = json.data.employee.position.label;
                vmAdd.basicSalary = json.data.employee.monthSalary;
                vmAdd.countSalary = json.data.employee.pieceSalary;
            } else {

                alert(json.message);
            }
        }
    });
}
ajaxJsonp({
    url: urls.dictList,
    data: {
        type: 8
    },
    successCallback: function(json) {
        if (json.status === 1) {
            (function($, doc) {
                $.init();
                $.ready(function() {
                    var toolPicker1 = new $.PopPicker();
                    var data = [];
                    json.data.map(function(e) {
                        data.push({ value: e.id, text: e.label });
                    });
                    toolPicker1.setData(data);
                    var showUserPickerButton1 = doc.getElementById('positionPicker');
                    showUserPickerButton1.addEventListener('tap', function(event) {
                        toolPicker1.show(function(items) {
                            vmAdd.positionId = items[0].value;
                            vmAdd.position = items[0].text;
                        });
                    }, false);
                });
            })(mui, document);
        }
    }
});
(function($, doc) {
    $.init();
    $.ready(function() {
        var toolPicker2 = new $.PopPicker();
        toolPicker2.setData([{ value: 0, text: '未知' }, { value: 1, text: '男' }, { value: 2, text: '女' }]);
        var showUserPickerButton2 = doc.getElementById('genderPicker');
        showUserPickerButton2.addEventListener('tap', function(event) {
            toolPicker2.show(function(items) {
                vmAdd.gender = items[0].value;
                vmAdd.sex = items[0].text;
            });
        }, false);
    });
})(mui, document);
