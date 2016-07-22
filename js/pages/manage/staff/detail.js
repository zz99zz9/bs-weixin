var hotel = controlCore.getHotel();

var uid = parseInt(hotel.staffUid);
if (isNaN(uid) || uid == 0) {
    location.href = document.referrer || "staff.html";
}

var vmDetail = avalon.define({
    $id: "detail",
    data: {},
    checkList: [],
    calendar: [],
    todayIndex: 0,
    getGender: function(sex) {
        switch (sex) {
            case 1:
                return '男';
            case 2:
                return '女';
            default:
                return '未知';
        }
    },
    statusList: [
        { text: '请假', status: 2 },
        { text: '调休', status: 3 },
        { text: '迟到', status: 6 },
        { text: '早退', status: 4 },
        { text: '旷工', status: 5 },
    ],
    isChecked: false,
    addStatus: function() {
        mui("#check").popover('toggle');
        // vmDetail.isleft = true;
    },
    check: function(status, text) {
        //给今天加状态
        if (confirm("确认" + vmDetail.data.name + "今天" + text + "吗？")) {

            ajaxJsonp({
                url: urls.employeeCheckSave,
                data: { uid: uid, status: status },
                successCallback: function(json) {
                    if (json.status === 1) {
                        mui("#check").popover('toggle');
                        vmDetail.isChecked = true;

                        vmDetail.calendar[vmDetail.todayIndex].status = status;
                    }
                }
            });
        }

    },
    getStatus: function(status) {
        //2-请假；3-调休；4-早退；5-旷工；6-迟到
        switch (status) {
            case 1:
                return '#fff';
                break;
            case 2:
                return '#fb6362';
                break;
            case 3:
                return '#fbd562';
                break;
            case 4:
                return '#c062fb';
                break;
            case 5:
                return '#6286fb';
                break;
            case 6:
                return '#62e0fb';
                break;
        }
    },
    addAssess: function() {
        location.href = "../manage/assess-form.html?id=" + uid + "&name=" + vmDetail.data.name;
    },
    assessList: [],
    isLeft: false, //离职人员不显示操作按钮
    edit: function() {
        location.href = "../manage/addstaff-form.html?id=" + vmDetail.data.id;
    },
    isDisabled: false,
    fire: function() {
        if (confirm("确认" + vmDetail.data.name + "已离职吗？")) {

            vmDetail.isDisabled = true;
            //员工离职
            ajaxJsonp({
                url: urls.employeeFired,
                data: { uid: uid },
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmDetail.isLeft = true;
                    } else {
                        vmDetail.isDisabled = false;
                    }
                }
            });
        }
    }
});

//获取员工基本信息
ajaxJsonp({
    url: urls.employeeDetail,
    data: { uid: uid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetail.data = json.data;
            $("#headerReplace").text('员工详情：' + vmDetail.data.name);
        }
    }
});

//获取员工当月考勤列表
//2-请假；3-调休；4-早退；5-旷工；6-迟到
ajaxJsonp({
    url: urls.employeeCheckList,
    data: { uid: uid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetail.checkList = json.data;

            calendar(); //生成日历

            //当天如果已添加过考勤，就不禁用考勤按钮
            vmDetail.isChecked = vmDetail.calendar[vmDetail.todayIndex].status > 1;
        }
    }
});

function calendar() {
    var d = new Date(),
        year, month, day = d.getDate(),
        weekday,
        temp,
        list = [];

    d.setDate(1); //设为当月1号
    weekday = d.getDay();

    if (weekday == 0) {
        weekday = 7;
    }
    temp = weekday;
    vmDetail.todayIndex = day + temp - 2;

    d.setDate(d.getDate() - (weekday - 1));
    for (var i = 1; i < temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            status: 1,
            isDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + " 00:00:00"
        });
        d.setDate(d.getDate() + 1);
    }

    for (var i = 0; i < getDayNum(year, month); i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        var date = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + " 00:00:00";
        var isNormal = true;

        vmDetail.$model.checkList.map(function(o) {
            if (o.checkDate == date) {
                list.push({
                    year: year,
                    month: month,
                    day: day,
                    weekday: weekday,
                    status: o.status,
                    isDisabled: false,
                    date: date
                });
                isNormal = false;
                d.setDate(d.getDate() + 1);
            }
        })

        if (isNormal) {
            list.push({
                year: year,
                month: month,
                day: day,
                weekday: weekday,
                status: 1,
                isDisabled: false,
                date: date
            });
            d.setDate(d.getDate() + 1);
        }
    }

    if (weekday == 0) {
        weekday = 7;
    }
    temp = weekday;
    for (var i = 0; i < 7 - temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            status: 1,
            isDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + " 00:00:00"
        });
        d.setDate(day + 1);
    }

    vmDetail.calendar = list;
}


//获取员工评价列表，默认显示 10 条
ajaxJsonp({
    url: urls.employeeEvaluateList,
    data: { uid: uid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetail.assessList = json.data.list;
        }
    }
});
