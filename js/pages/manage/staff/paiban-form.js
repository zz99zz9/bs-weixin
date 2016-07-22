var hotel = controlCore.getHotel();

var vmPaiban = avalon.define({
    $id: 'paiban',
    typeList: [{ value: 1, text: '保洁' }, { value: 2, text: '前台' }, { value: 3, text: '保安' }],
    position: '',
    date: '',
    isChose: false,
    type: 0,
    dateType: 0,
    monthList: [],
    weekList1: [],
    weekList2: [],
    isMonthShow: true,
    isthisWeek: true,
    clickA: function(index) {
        vmPaiban.isChose = true;
        vmPaiban.type = vmPaiban.typeList[index - 1].value;
        vmPaiban.position = vmPaiban.typeList[index - 1].text;
        vmPaiban.date = getToday('monthNotFormat');
        getmonthList(vmPaiban.date, vmPaiban.type);
        getweekList(vmPaiban.type);
    },
    change: function(i) {
        vmPaiban.dateType = i;
        switch (i) {
            case 0:
                vmPaiban.isMonthShow = true;
                break;
            case 1:
                vmPaiban.isMonthShow = false;
                vmPaiban.isthisWeek = true;
                break;
            case 2:
                vmPaiban.isMonthShow = false;
                vmPaiban.isthisWeek = false;
                break;
        }
    }
});


(function($, doc) {
    $.ready(function() {
        var toolPicker = new $.PopPicker();
        toolPicker.setData(vmPaiban.typeList);
        var showUserPickerButton = doc.getElementById('positionPicker');
        showUserPickerButton.addEventListener('tap', function(event) {
            toolPicker.show(function(items) {
                vmPaiban.position = items[0].text;
                vmPaiban.type = items[0].value;
                getmonthList(vmPaiban.date, vmPaiban.type);
                getweekList(vmPaiban.type);
            });
        }, false);
    });
})(mui, document);

(function($) {
    var btns = $('.btn');
    btns.each(function(i, btn) {
        btn.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                vmPaiban.date = rs.text;
                getmonthList(rs.text, vmPaiban.type);
                picker.dispose();
            });
        }, false);
    });
})(mui);
//获取月排列表
function getmonthList(date, type) {
    var d = new Date(date.split('-')[0], date.split('-')[1], 0);
    var days = d.getDate();
    var startTime = date + '-' + '1';
    var endTime = date + '-' + '' + days;
    ajaxJsonp({
        url: urls.employeeScheduleList,
        data: {
            hid: hotel.hid,
            type: type,
            startTime: startTime,
            endTime: endTime
        },
        successCallback: function(json) {
            if (json.status === 1) {
                var tempList = [];
                for (var i = 1; i <= days; i++) {
                    var weekday = getWeekday(date + '-' + '' + i);
                    var tmpDate = '';
                    if (i < 10) {
                        tmpDate = date + '-' + '0' + i;
                    } else {
                        tmpDate = date + '-' + '' + i;
                    }
                    tempList.push({ workDate: tmpDate, names: '', weekDay: weekday, hid: hotel.hid, type: vmPaiban.type })
                }
                tempList.map(function(a) {
                    json.data.map(function(b) {
                        if (b.workDate === a.workDate) {
                            a.names = b.names;
                        }
                    });
                });
                vmPaiban.monthList = tempList;
            } else {
                alert(json.message);
            }
        }
    });
}
//获取周排列表
function getweekList(type) {
    var startTime1 = '';
    var startTime2 = '';
    var endTime1 = '';
    var endTime2 = '';
    var Time = new Date(getToday('date').replace(/-/g, "/"));
    var index = Time.getDay(); //这周第几天
    var year = Time.getFullYear(),
        month = Time.getMonth() + 1,
        day = Time.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var strTime = year + "-" + month + "-" + day;
    var w_array = new Array("周一", "周二", "周三", "周四", "周五", "周六", "周日");
    if (index === 0) {
        index = 7;
    }
    startTime1 = getDateByDays(strTime, -index + 1);
    endTime1 = getDateByDays(strTime, -index + 7);
    startTime2 = getDateByDays(strTime, -index + 8);
    endTime2 = getDateByDays(strTime, -index + 14);
    ajaxJsonp({
        url: urls.employeeScheduleList,
        data: {
            hid: hotel.hid,
            type: type,
            startTime: startTime1,
            endTime: endTime1
        },
        successCallback: function(json) {
            if (json.status === 1) {
                var tempList = [];
                var tmpDate = '';
                for (var i = 0; i < 7; i++) {
                    tmpDate = getDateByDays(startTime1, i);
                    tempList.push({ workDate: tmpDate, names: '', weekDay: w_array[i], hid: hotel.hid, type: vmPaiban.type });
                }
                tempList.map(function(a) {
                    json.data.map(function(b) {
                        if (b.workDate === a.workDate) {
                            a.names = b.names;
                        }
                    });
                });
                vmPaiban.weekList1 = tempList;
            } else {
                alert(json.message);
            }
        }
    });
    ajaxJsonp({
        url: urls.employeeScheduleList,
        data: {
            hid: hotel.hid,
            type: type,
            startTime: startTime2,
            endTime: endTime2
        },
        successCallback: function(json) {
            if (json.status === 1) {
                var tempList = [];
                var tmpDate = '';
                for (var i = 0; i < 7; i++) {
                    tmpDate = getDateByDays(startTime2, i);
                    tempList.push({ workDate: tmpDate, names: '', weekDay: w_array[i], hid: hotel.hid, type: vmPaiban.type });
                }
                tempList.map(function(a) {
                    json.data.map(function(b) {
                        if (b.workDate === a.workDate) {
                            a.names = b.names;
                        }
                    });
                });
                vmPaiban.weekList2 = tempList;
            } else {
                alert(json.message);
            }
        }
    });

}
