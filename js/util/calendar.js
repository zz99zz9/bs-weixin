//日历相关
var bookDateList = null,
    vmCalendar = avalon.define({
        $id: 'calendar',
        statusControl: {
            isStartEdit: false, //选择夜房入住日期
            isEndEdit: false, //选择夜房退房日期
            isCalendarShow: false, //日历是否显示
            isCalendarEdit: false, //日历是否可点
            //isStartTimeShow: false, //选择夜房入住时间段
            isStartTimeEdit: false, //夜房入住时间修改
            //isTimeListShow: false, //时租房时间列表是否显示
            //isTypeShow: false, //房间系列是否显示
            //isMoreBtnShow: true,
            //isRoomListShow: true, //房间列表
        },
        startClick: function() {
            vmCalendar.statusControl.isCalendarShow = true;
            vmCalendar.statusControl.isCalendarEdit = true;
        },
        endClick: function() {
            vmCalendar.statusControl.isCalendarShow = true;
            vmCalendar.statusControl.isCalendarEdit = true;
        },
        isSelected: function(index) {
            if (vmCalendar.startIndex == -1 && vmCalendar.endIndex == -1) {
                return false;
            }
            if (vmCalendar.startIndex == -1 && vmCalendar.endIndex > -1) {
                return index == vmCalendar.endIndex;
            }
            if (vmCalendar.startIndex > -1 && vmCalendar.endIndex == -1) {
                return index == vmCalendar.startIndex;
            }
            return (index >= vmCalendar.startIndex) && (index <= vmCalendar.endIndex);
        },
        calendar: [],
        startIndex: -1,
        endIndex: -1,
        todayIndex: 0,
        clickDate: function(index) {
            stopSwipeSkip.do(function() {
                var date = vmCalendar.$model.calendar[index];
                if (vmCalendar.calendar[index].isDisabled == false) {
                    //开始，结束，index相当于分配到开始或结束前的cache
                    if (vmCalendar.startIndex == -1) {
                        vmCalendar.startIndex = index;
                        vmCalendar.endIndex = index + 1;
                    } else if (vmCalendar.startIndex != -1 
                        && vmCalendar.endIndex == -1 
                        && vmCalendar.startIndex != index) {
                        if (index < vmCalendar.startIndex) {
                            vmCalendar.endIndex = vmCalendar.startIndex;
                            vmCalendar.startIndex = index;
                        } else {
                            vmCalendar.endIndex = index;
                        }
                    } else if (vmCalendar.startIndex != -1 
                        && vmCalendar.endIndex != -1 
                        && vmCalendar.startIndex != index 
                        && vmCalendar.endIndex != index) {
                        if (index == vmCalendar.startIndex - 1 || index == vmCalendar.startIndex + 1) {
                            vmCalendar.startIndex = index;
                        } else if (index == vmCalendar.endIndex - 1 || index == vmCalendar.endIndex + 1) {
                            vmCalendar.endIndex = index;
                        } else {
                            if(index < vmCalendar.startIndex) {
                                vmCalendar.startIndex = index;
                            } else if (index > vmCalendar.endIndex) {
                                vmCalendar.endIndex = index;
                            } else {
                                vmCalendar.startIndex = index;
                                vmCalendar.endIndex = index + 1;
                            }
                        }
                    }
                    vmCalendar.foldCalendar(index);
                    vmCalendar.isShowClock = true;
                }
            });
        },
        startTime: "", //夜房入住时间, 格式: 08:00
        nightPrice: 0, //根据入住时间确定的夜房价格
        closeModal: function() {
            modalClose();
            vmCalendar.isShowClock = false;

            //保存选中的小时
            $.extend(newOrder.day, {
                startHour: clockObj.getStartHour(),
                endHour: clockObj.getEndHour(),
                start: clockObj.getStart(),
                startShow: clockObj.getStartShow(),
                end: clockObj.getEnd(),
                endShow: clockObj.getEndShow(),
                timeSpan: clockObj.getTimeSpan()
            });
            Storage.set("newOrder", newOrder);

            if (typeof(vmCity) != 'undefined') {
                Storage.set("newOrder", newOrder);
                saveStorage();
                vmCity.getHotelPosition(mapObj);
            }
            if (typeof(vmHotel) != 'undefined') {
                Storage.set("newOrder", newOrder);
                saveStorage();
                vmHotel.getRoomTypeList();
            }
            if (typeof(vmRoom) != 'undefined') {
                vmRoom.showDate();
                saveStorage();
                vmRoom.startIndex = vmCalendar.startIndex;
            }
        },
        save: function(callback) {
            modalClose();
            vmCalendar.isShowClock = false;
            callback();
        },
        isShowClock: false,
        showClock: function() {
            vmCalendar.isShowClock = true;

            vmCalendar.foldCalendar(vmCalendar.startIndex);
        },
        foldCalendar: function(index) {
            //折叠日历，显示表盘
            if (vmCalendar.startIndex != -1) {
                $('#calendarPanel').height(screen.height * (0.15 * screen.height / 450));
                $('#calendarPanel').scrollTop(index / 7 * 45 - 30);

                var startObj, endObj;
                startObj = vmCalendar.calendar[vmCalendar.startIndex];
                clockObj.setStart(startObj.month, startObj.day);

                if (vmCalendar.endIndex == -1) {
                    vmCalendar.endIndex = vmCalendar.startIndex + 1;
                }
                endObj = vmCalendar.calendar[vmCalendar.endIndex];
                clockObj.setEnd(endObj.month, endObj.day);
            }
        },
        hideClock: function() {
            vmCalendar.isShowClock = false;
            $('#calendarPanel').height($(window).height() - 230);
        }
    });

//先读取本地session
if (newOrder && newOrder.day) {
    if (newOrder.day.startIndex > -1) {
        vmCalendar.startIndex = newOrder.day.startIndex;
        vmCalendar.endIndex = newOrder.day.endIndex;
    }
}

getServerTime(getCalendar);

//日历初始化
function getCalendar(serverTime) {
    var d = new Date(serverTime.replace(/-/g, '/')),
        year, month, day,
        weekday = d.getDay(),
        temp,
        list = [],
        isDisabled = false;

    // if (weekday == 0) {
    //     weekday = 7;
    // }
    temp = weekday;

    //如果是周一，就多往前显示一周
    // if (temp == 1) {
    //     temp = temp + 7;
    // }

    // d.setDate(d.getDate() - (temp - 1));
    d.setDate(d.getDate() - temp);
    for (var i = 0; i < temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            isDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(d.getDate() + 1);
        // d.setDate(d.getDate());

        //当前时间6点前的话，可以订昨天的夜房
        if (getHourIndex() < 13 && (i == temp - 1)) {
            // if (getHourIndex() < 13 && (i == temp)) {
            list[i - 1].isDisabled = false;
        }
    }
    vmCalendar.todayIndex = list.length;

    d = new Date();
    for (var i = 0; i < 90; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        date = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);

        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            isDisabled: isDisabled,
            date: date
        });

        d.setDate(day + 1);
        // d.setDate(day);
    }

    // if (weekday == 0) {
    //     weekday = 7;
    // }
    temp = weekday;
    for (var i = 1; i < 7 - temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            isDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(day + 1);
        // d.setDate(day);
    }

    vmCalendar.calendar = list;
}

vmCalendar.$watch('startIndex', function(a) {
    var startObj, sIndex, startShow, amount;

    if (a == -1) {
        startShow = '<br>请选择';
    } else {
        startObj = vmCalendar.calendar[a];
        if (startObj) {
            sIndex = a;
            startShow = startObj.month + '月' + startObj.day + '日' + '<br>'
            + clockObj.getStartHour() + ':00<br>' + getWeekday(startObj.date);
        }
    }

    if (sIndex && (vmCalendar.endIndex > -1)) {
        amount = vmCalendar.endIndex - sIndex;
    } else {
        amount = '?';
    }

    $.extend(newOrder.day, {
        startIndex: a,
        startShow: startShow,
        amount: amount
    });
    Storage.set("newOrder", newOrder);

    clockObj.setStart(startObj.month, startObj.day);
});

vmCalendar.$watch('endIndex', function(a) {
    var endObj, eIndex, endShow, amount;

    if (a == -1) {
        endShow = '<br>请选择';
    } else {
        endObj = vmCalendar.calendar[a];
        if (endObj) {
            eIndex = a;
            endShow = endObj.month + '月' + endObj.day + '日' + '<br>'
            + clockObj.getEndHour() + ':00<br>' + getWeekday(endObj.date);
        }
    }

    if (eIndex && (vmCalendar.startIndex > -1)) {
        amount = eIndex - vmCalendar.startIndex;
    } else {
        amount = '?';
    }

    $.extend(newOrder.day, {
        endIndex: a,
        endShow: endShow,
        amount: amount
    });
    Storage.set("newOrder", newOrder);

    clockObj.setEnd(endObj.month, endObj.day);
});

Observer.regist('startChange', function(e) {
    var start = e.args.date,
        delta = e.args.delta;
    if (delta > 0) {
        vmCalendar.startIndex++;
    } else {
        vmCalendar.startIndex--;
    }
});

Observer.regist('endChange', function(e) {
    var start = e.args.date,
        delta = e.args.delta;
    if (delta > 0) {
        vmCalendar.endIndex++;
    } else {
        vmCalendar.endIndex--;
    }
});
