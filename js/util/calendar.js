//日历相关
var bookDateList = null,
    vmCalendar = avalon.define({
        $id: 'calendar',
        status: {
            key: 1,
            chooseType: 1,
            calendar: 2,
            dayClock: 3,
            partTimeClock: 4
        },
        setType: function(type) {
            if (typeof(vmCity) != 'undefined') {
                vmCity.type = type;
            }
            if (typeof(vmHotel) != 'undefined') {
                vmHotel.type = type;
            }
            if (typeof(vmRoom) != 'undefined') {
                vmRoom.type = type;
            }
        },
        goDay: function() { //订全天房
            vmCalendar.status.key = vmCalendar.status.calendar;
            vmCalendar.changeStatusBtnText = "去订时租房";
            vmCalendar.nextBtnText = "选择到店时间";
            $.extend(bensue, {
                type: 0
            });
            Storage.set("bensue", bensue);
            vmCalendar.setType(0);
        },
        goDayClock: function() {
            vmCalendar.status.key = vmCalendar.status.dayClock;
            vmCalendar.changeStatusBtnText = "修改日期";
            vmCalendar.nextBtnText = "确定";
            clockObj.setStatus(vmCalendar.status.dayClock);
        },
        goPartTime: function() { //订时租房
            var time = new Date(),
                hour = time.getHours();
            if (hour >= 7 && hour <= 18) {
                vmCalendar.status.key = vmCalendar.status.partTimeClock;
                vmCalendar.changeStatusBtnText = "去订全天房";
                vmCalendar.nextBtnText = "确定";

                $.extend(bensue, {
                    type: 1
                });
                Storage.set("bensue", bensue);
                vmCalendar.setType(1);

                //更新表盘状态
                clockObj.setPartTimeStart(hour);
                clockObj.setPartTimeEnd(hour);
                clockObj.setStatus(vmCalendar.status.partTimeClock);
            } else {
                mui.alert('时租房可预订时间为7:00-18:00', function() {
                    vmCalendar.goDay();
                });
            }
        },
        changeStatusBtnText: '',
        changeStatus: function() {
            switch (vmCalendar.status.key) {
                case vmCalendar.status.calendar:
                    vmCalendar.goPartTime();
                    break;
                case vmCalendar.status.dayClock:
                case vmCalendar.status.partTimeClock:
                    vmCalendar.goDay();
                    break;
            }
        },
        isNextBtnDisabled: true,
        nextBtnText: '',
        goNext: function() {
            if (!vmCalendar.isNextBtnDisabled) {
                switch (vmCalendar.status.key) {
                    case vmCalendar.status.calendar:
                        vmCalendar.goDayClock();
                        break;
                    case vmCalendar.status.dayClock:
                        //保存选中的小时
                        $.extend(newOrder.day, {
                            start: clockObj.getStart(),
                            end: clockObj.getEnd(),
                            startHour: clockObj.getStartHour(),
                            endHour: clockObj.getEndHour(),
                            startShow: clockObj.getStartShow(),
                            endShow: clockObj.getEndShow(),
                            timeSpan: clockObj.getTimeSpan()
                        });
                        Storage.set("newOrder", newOrder);

                        modalClose();
                        vmCalendar.status.key = vmCalendar.status.calendar;
                        vmCalendar.changeStatusBtnText = "去订时租房";
                        vmCalendar.save();
                        break;
                    case vmCalendar.status.partTimeClock:
                        var startShow, endShow, amount,
                            start = clockObj.getStart(),
                            end = clockObj.getEnd();

                        if (start) {
                            startShow = '今日<br><br>' + clockObj.getStartHour() + ":00";
                        } else {
                            startShow = '<br>请选择';
                        }

                        if (end) {
                            endShow = '今日<br><br>' + clockObj.getEndHour() + ":00";
                        } else {
                            endShow = '<br>请选择';
                        }
                        if (start && end) {
                            amount = clockObj.getEndHour() - clockObj.getStartHour();
                        } else {
                            amount = '?';
                        }

                        $.extend(newOrder.partTime, {
                            start: start,
                            end: end,
                            startHour: clockObj.getStartHour(),
                            endHour: clockObj.getEndHour(),
                            startShow: startShow,
                            endShow: endShow,
                            timeSpan: clockObj.getTimeSpan(),
                            amount: amount
                        });
                        Storage.set("newOrder", newOrder);

                        modalClose();
                        vmCalendar.save();
                        break;
                }
            }
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
        calendar: [], //显示交互用，按月份存储
        calendarNum: 0,
        calendarDates: [], //存储数据用，按天存储
        startIndex: -1,
        endIndex: -1,
        todayIndex: 0,
        clickDate: function(data, clickIndex) {
            stopSwipeSkip.do(function() {
                data = data.$model;
                var index = data.index;
                if (data.isDisabled == false) {
                    //开始，结束，index相当于分配到开始或结束前的cache
                    if (vmCalendar.startIndex == -1) {
                        vmCalendar.startIndex = index;
                        vmCalendar.endIndex = -1;
                    } else if (vmCalendar.endIndex == -1 && vmCalendar.startIndex != index) {
                        if (index < vmCalendar.startIndex) {
                            vmCalendar.endIndex = vmCalendar.startIndex;
                            vmCalendar.startIndex = index;
                        } else {
                            vmCalendar.endIndex = index;
                        }
                    } else if (vmCalendar.endIndex != -1 && vmCalendar.startIndex != index && vmCalendar.endIndex != index
                        // && vmCalendar.startIndex != vmCalendar.endIndex
                    ) {
                        if (index == vmCalendar.startIndex - 1 || index == vmCalendar.startIndex + 1) {
                            vmCalendar.startIndex = index;
                        } else if (index == vmCalendar.endIndex - 1 || index == vmCalendar.endIndex + 1) {
                            vmCalendar.endIndex = index;
                        } else {
                            vmCalendar.startIndex = index;
                            vmCalendar.endIndex = -1;
                        }
                    } else {
                        // if(index >= vmCalendar.startIndex) {
                        //     if(vmCalendar.endIndex != index) {
                        //         vmCalendar.endIndex = index;
                        //     } else {
                        //         vmCalendar.startIndex = index;
                        //     }
                        // } else if (index <= vmCalendar.endIndex) {
                        //     vmCalendar.startIndex = index;
                        // } 
                    }
                    // vmCalendar.foldCalendar(data, clickIndex);
                }
            });
        },
        startTime: "", //夜房入住时间, 格式: 08:00
        nightPrice: 0, //根据入住时间确定的夜房价格
        closeModal: function() {
            modalClose();
            // vmCalendar.isShowClock = false;

            if (vmCalendar.key == vmCalendar.status.dayClock) {
                vmCalendar.status.key = vmCalendar.status.calendar;
            }
        },
        save: function() {
            if (typeof(vmCity) != 'undefined') {
                // Storage.set("newOrder", newOrder);
                // saveStorage();
                vmCity.getHotelPosition(mapObj);
            }
            if (typeof(vmHotel) != 'undefined') {
                // Storage.set("newOrder", newOrder);
                // saveStorage();
                vmHotel.getRoomTypeList();
            }
            if (typeof(vmRoom) != 'undefined') {
                if(vmCalendar.status.key == vmCalendar.status.partTimeClock) {
                    vmRoom.showPartTime();
                } else {
                    vmRoom.showDate();
                }
                // saveStorage();
                vmRoom.getData();
                vmRoom.startIndex = vmCalendar.startIndex;
            }
        },

        // isShowClock: false,
        // showClock: function() {
        //     vmCalendar.isShowClock = true;

        //     vmCalendar.foldCalendar(vmCalendar.startIndex);
        // },
        // foldCalendar: function(data) {
        //     var index = data.calendarNum,
        //         monthTitleNum = data.month - vmCalendar.$model.calendar[0].month;
        //     vmCalendar.isShowClock = true;

        //     //折叠日历，显示表盘
        //     if (vmCalendar.startIndex != -1) {
        //         $('#calendarPanel').height(screen.height * (0.15 * screen.height / 450));
        //         $('#calendarPanel').scrollTop(index / 7 * 45 + monthTitleNum * 50 - 30);

        //         // var startObj, endObj;
        //         // startObj = vmCalendar.calendarDates[vmCalendar.startIndex];
        //         // clockObj.setStart(startObj.month, startObj.day);

        //         // if (vmCalendar.endIndex == -1) {
        //         //     vmCalendar.endIndex = vmCalendar.startIndex + 1;
        //         // }
        //         // endObj = vmCalendar.calendarDates[vmCalendar.endIndex];
        //         // clockObj.setEnd(endObj.month, endObj.day);
        //     }
        // },
        // hideClock: function() {
        //     vmCalendar.isShowClock = false;
        //     $('#calendarPanel').height($(window).height() - 230);
        // }
    });

//先读取本地session
if (newOrder && newOrder.day) {
    if (newOrder.day.startIndex > -1) {
        vmCalendar.startIndex = newOrder.day.startIndex;
        vmCalendar.endIndex = newOrder.day.endIndex;

        if (vmCalendar.startIndex > -1 && vmCalendar.endIndex > -1) {
            vmCalendar.isNextBtnDisabled = false;
        }
    }
}

getServerTime(getCalendar);

//日历初始化
function getCalendar(serverTime) {
    var d = new Date(serverTime.replace(/-/g, '/')),
        month = d.getMonth() + 1,
        today = new Date(serverTime.replace(/-/g, '/')),
        list = [];

    //生成几个月的日历
    for (var i = 0; i < 6; i++) {
        list.push({
            month: month + i,
            days: addMonth(d, today)
        });
    }

    vmCalendar.calendar = list;
}

//添加指定日期所在的一个整月
function addMonth(date, today) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        dayNum = getDayNum(year, month),
        temp,
        list = [];

    //d为当月第一天，补齐当月第一天所在的一星期天数
    date.setDate(1);
    temp = date.getDay();
    date.setDate(1 - temp);

    addDate(list, date, temp, today, month, -1);

    //补齐当月的天数
    addDate(list, date, dayNum, today, month, 0);

    temp = date.getDay();
    //如果下月第一天不是周日，则补齐当月最后一天所在的一星期天数
    if (temp != 0) {
        dateAdd(date, 'd', -1);
        temp = date.getDay();
        dateAdd(date, 'd', 1);

        addDate(list, date, 7 - temp, today, month, -1);
    }
    return list;
}

//添加指定日期开始，指定数量的天数
function addDate(list, date, num, today, renderMonth, index) {
    var isDisabled = false,
        isShowDay = 0,
        year, month, day, weekday,
        formatedDate = '';

    for (var i = 0; i < num; i++) {
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        weekday = date.getDay();
        formatedDate = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);

        if (month == renderMonth) {
            isShowDay = day;
            isDisabled = false;

            if (month == today.getMonth() + 1) {
                if (day < today.getDate()) {
                    isDisabled = true;
                } else {
                    isDisabled = false;
                }
            }
        } else {
            isShowDay = 0;
            isDisabled = true;
        }

        if (index >= 0) {
            vmCalendar.calendarDates.push({
                year: year,
                month: month,
                day: isShowDay,
                weekday: weekday,
                isDisabled: isDisabled,
                date: formatedDate,
            })
        }
        list.push({
            year: year,
            month: month,
            day: isShowDay,
            weekday: weekday,
            isDisabled: isDisabled,
            date: formatedDate,
            index: index >= 0 ? vmCalendar.$model.calendarDates.length - 1 : -1,
            calendarNum: vmCalendar.calendarNum
        });

        date.setDate(day + 1);

        vmCalendar.calendarNum++;
        // //当前时间6点前的话，可以订昨天的夜房
        // if (getHourIndex() < 13 && (i == num - 1)) {
        //     // if (getHourIndex() < 13 && (i == num)) {
        //     list[i - 1].isDisabled = false;
        // }
    }
}

vmCalendar.$watch('startIndex', function(a) {
    var startObj, sIndex, startShow, amount;

    if (a == -1) {
        startShow = '<br>请选择';
    } else {
        startObj = vmCalendar.calendarDates[a];
        if (startObj) {
            sIndex = a;
            startShow = startObj.month + '月' + startObj.day + '日' + '<br>' + clockObj.getStartHour() + ':00<br>' + getWeekday(startObj.date);


            //设置表盘的日期
            // if(vmCalendar.startIndex == vmCalendar.endIndex) {
            //     clockObj.setPartTimeEnd(startObj.month, startObj.day);
            // } 
            clockObj.setStart(startObj.month, startObj.day);
        }
    }

    if (sIndex && (vmCalendar.endIndex > -1)) {
        amount = vmCalendar.endIndex - sIndex;
        vmCalendar.isNextBtnDisabled = false;
    } else {
        amount = '?';
        vmCalendar.isNextBtnDisabled = true;
    }

    $.extend(newOrder.day, {
        startIndex: a,
        startShow: startShow,
        amount: amount,
        start: clockObj.getStart()
    });
    Storage.set("newOrder", newOrder);
});

vmCalendar.$watch('endIndex', function(a) {
    var endObj = {
            month: null,
            day: null
        },
        eIndex, endShow, amount;

    if (a == -1) {
        endShow = '<br>请选择';
    } else {
        endObj = vmCalendar.calendarDates[a];
        if (endObj) {
            eIndex = a;
            endShow = endObj.month + '月' + endObj.day + '日' + '<br>' + clockObj.getEndHour() + ':00<br>' + getWeekday(endObj.date);

            //设置表盘的日期
            // if(vmCalendar.startIndex == vmCalendar.endIndex) {
            //     clockObj.setPartTimeEnd(endObj.month, endObj.day);
            // } else {
            clockObj.setEnd(endObj.month, endObj.day);
            // }
        }
    }

    if (eIndex && (vmCalendar.startIndex > -1)) {
        amount = eIndex - vmCalendar.startIndex;
        vmCalendar.isNextBtnDisabled = false;
    } else {
        amount = '?';
        vmCalendar.isNextBtnDisabled = true;
    }

    $.extend(newOrder.day, {
        endIndex: a,
        endShow: endShow,
        amount: amount,
        end: clockObj.getEnd()
    });

    Storage.set("newOrder", newOrder);
});

//注册表盘日期改变事件
Observer.regist('startChange', function(e) {
    // var start = e.args.date,
    //     delta = e.args.delta;
    // if (delta > 0) {
    //     vmCalendar.startIndex++;
    // } else {
    //     vmCalendar.startIndex--;
    // }
});

Observer.regist('endChange', function(e) {
    // var start = e.args.date,
    //     delta = e.args.delta;
    // if (delta > 0) {
    //     vmCalendar.endIndex++;
    // } else {
    //     vmCalendar.endIndex--;
    // }
});
