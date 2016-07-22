var hotel = controlCore.getHotel();

var workDate = getParam('date');
var type = getParam('type');

var vmArrange = avalon.define({
    $id: 'arrange',
    data: [],
    isChose: false,
    employeeList: [],
    timeList: [],
    recordId: '',
    addNameId: 0,
    addTimeId: 0,
    addName: '',
    addTime: '',
    change: function(id, name, uid, stid, time) {
        vmArrange.isChose = true;
        vmArrange.recordId = id;
        vmArrange.addName = name;
        vmArrange.addNameId = uid;
        vmArrange.addTime = time;
        vmArrange.addTimeId = stid;
    },
    add: function() {
        vmArrange.isChose = true;
        vmArrange.recordId = '';
        vmArrange.addName = '请选择名字';
        vmArrange.addTime = '请选择时间段';
    },
    submit: function() {
        ajaxJsonp({
            url: urls.employeeScheduleSave,
            data: {
                id: vmArrange.recordId,
                uid: vmArrange.addNameId,
                hid: hotel.hid,
                type: type,
                workDate: workDate,
                stid: vmArrange.addTimeId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    ajaxJsonp({
                        url: urls.employeeScheduleDay,
                        data: {
                            hid: hotel.hid,
                            type: type,
                            workDate: workDate
                        },
                        successCallback: function(json) {
                            if (json.status === 1) {
                                vmArrange.data = json.data;
                            } else {
                                alert(json.message);
                            }
                        }
                    });
                    vmArrange.isChose = false;
                } else {
                    alert(json.message);
                }
            }
        });
    },
    cancel: function() {
        vmArrange.isChose = false;
    }
});
ajaxJsonp({
    url: urls.employeeScheduleDay,
    data: {
        hid: hotel.hid,
        type: type,
        workDate: workDate
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmArrange.data = json.data;
        } else {
            alert(json.message);
        }
    }
});
ajaxJsonp({
    url: urls.employeeList,
    data: {
        hid: hotel.hid
    },
    successCallback: function(json) {
        if (json.status === 1) {
            (function($, doc) {
                var toolPicker = new $.PopPicker();
                json.data.list.map(function(e) {
                    vmArrange.employeeList.push({ value: e.id, text: e.name });
                });
                toolPicker.setData(vmArrange.employeeList);
                var showUserPickerButton = doc.getElementById('employeePicker');
                showUserPickerButton.addEventListener('tap', function(event) {
                    toolPicker.show(function(items) {
                        vmArrange.addNameId = items[0].value;
                        vmArrange.addName = items[0].text;
                    });
                }, false);
            })(mui, document);
        } else {
            alert(json.message);
        }
    }
});
ajaxJsonp({
    url: urls.scheduleList,
    data: {
        type: type
    },
    successCallback: function(json) {
        if (json.status === 1) {
            (function($, doc) {
                var toolPicker = new $.PopPicker();
                json.data.map(function(e) {
                    vmArrange.timeList.push({ value: e.id, text: e.turn + e.startTime + '~' + e.endTime });
                });
                toolPicker.setData(vmArrange.timeList);
                var showUserPickerButton = doc.getElementById('timePicker');
                showUserPickerButton.addEventListener('tap', function(event) {
                    toolPicker.show(function(items) {
                        vmArrange.addTimeId = items[0].value;
                        vmArrange.addTime = items[0].text;
                    });
                }, false);
            })(mui, document);

        } else {
            alert(json.message);
        }
    }
});
