
//日历相关
var bookDateList = null, tapCount = 0, select_bar;
var vmCalendar = avalon.define({
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

        // if (!vmCalendar.statusControl.isStartEdit) {
        vmCalendar.statusControl.isStartEdit = true;
        vmCalendar.statusControl.isEndEdit = false;
        vmCalendar.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmCalendar.statusControl.isStartEdit = false;
        //     vmCalendar.statusControl.isCalendarEdit = false;
        // }

        // vmCalendar.statusControl.isTypeShow = false;
        // vmCalendar.statusControl.isMoreBtnShow = false;
        // vmCalendar.statusControl.isRoomListShow = false;
        // vmCalendar.statusControl.isStartTimeShow = true;

        // if (pageType != "order") {
        //     vmLogo.isClose = true;

        //     //查询搜索时，要显示的酒店夜房优惠价格列表
        //     ajaxJsonp({
        //         url: urls.getNightDiscount,
        //         data: { hid: hotelid, tid: vmCalendar.typeid },
        //         successCallback: function(json) {
        //             if (json.status === 1) {
        //                 vmCalendar.nightDiscount = json.data;
        //             }
        //         }
        //     });
        // }
        // if (pageType == 'order') {
        //     vmCalendar.statusControl.isStartTimeEdit = false;
        // }
    },
    endClick: function() {
        vmCalendar.statusControl.isCalendarShow = true;

        // if (!vmCalendar.statusControl.isEndEdit) {
        vmCalendar.statusControl.isStartEdit = false;
        vmCalendar.statusControl.isEndEdit = true;
        vmCalendar.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmCalendar.statusControl.isEndEdit = false;
        //     vmCalendar.statusControl.isCalendarEdit = false;
        // }

        // vmCalendar.statusControl.isTypeShow = false;
        // vmCalendar.statusControl.isMoreBtnShow = false;
        // vmCalendar.statusControl.isRoomListShow = false;
        // vmCalendar.statusControl.isStartTimeShow = false

        // if (pageType != "order") {
        //     vmLogo.isClose = true;
        //     vmCalendar.statusControl.isMoreBtnShow = true;
        // }
        // if (pageType == 'order') {
        //     vmCalendar.statusControl.isStartTimeEdit = true;
        // }
    },
    //日历灰掉的逻辑
    isDisabled: function(index, isStartEdit, isEndEdit, startIndex, endIndex) {
        var isDisabledByBooked,
            date = vmCalendar.$model.calendar[index],
            max = -1,
            min = -1;

        isDisabledByBooked = isStartEdit ? date.inDisabled : date.outDisabled;

        if (bookDateList) {
            var list = isStartEdit ? bookDateList.inIndex : bookDateList.outIndex,
                length = list.length;

            //先选入住，再选退房时
            if (startIndex > -1 && isEndEdit) {
                for (var i in list) {
                    max = list[i];
                    if (list[i] > startIndex) {
                        break;
                    }
                }

                if (index > max && max > startIndex) {
                    isDisabledByBooked = true;
                }
            }
            //先选退房，在选入住
            if (endIndex > -1 && isStartEdit) {
                if(endIndex > list[0]) {
                    for (var i in list) {
                        min = list[i-1];
                        if (list[i] >= endIndex) {
                            break;
                        }
                    }
                    //如果退房时间在所有预订日期的后面
                    //要保留可点的入住时间的最小值就是预订日期的最大值的前一天
                    if (endIndex > list[length - 1]) {
                        min = list[length - 1];
                    }
                }

                //小于最小值的都灰掉
                if (index < min) {
                    isDisabledByBooked = true;
                }
            }
        }

        return (isStartEdit && ((endIndex != -1) && (index > endIndex))) 
        || (isEndEdit && ((startIndex != -1) && (index < startIndex))) 
        || isDisabledByBooked
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
        stopSwipeSkip.do(function(){
            var date = vmCalendar.$model.calendar[index];

            //是否是编辑状态
            if (vmCalendar.statusControl.isCalendarEdit) {
                //是否是编辑入住时间
                if (vmCalendar.statusControl.isStartEdit && !date.inDisabled) {
                    if ((vmCalendar.startIndex != -1) && (vmCalendar.startIndex == index)) {
                        vmCalendar.startIndex = -1;
                        return;
                    }

                    if (vmCalendar.endIndex > vmCalendar.startIndex) {
                        //小于之前的结束时间
                        if (index < vmCalendar.endIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmCalendar.startIndex = index;
                            } else {
                                var count = 0;
                                for (var i = index; i < vmCalendar.endIndex; i++) {
                                    if (bookDateList.inIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmCalendar.startIndex = index;
                                }
                            }
                        }
                        //大于之前的结束时间－不响应
                    } else {
                        vmCalendar.startIndex = index;
                    }

                    vmCalendar.startTimeIndex = -1;
                    vmCalendar.startTime = "";
                    vmCalendar.nightPrice = 0;
                }

                //是否是编辑退房时间
                if (vmCalendar.statusControl.isEndEdit && !date.outDisabled) {
                    if ((vmCalendar.endIndex != -1) && (vmCalendar.endIndex == index)) {
                        vmCalendar.endIndex = -1;
                        return;
                    }

                    if ((vmCalendar.endIndex > vmCalendar.startIndex || vmCalendar.endIndex == -1) && vmCalendar.startIndex > -1) {
                        //大于之前的起始时间
                        if (index > vmCalendar.startIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmCalendar.endIndex = index;
                            } else {
                                var count = 0;
                                for (var i = vmCalendar.startIndex + 1; i <= index; i++) {
                                    if (bookDateList.outIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmCalendar.endIndex = index;
                                }
                            }
                        }
                        //小于之前的起始时间－不响应
                    } else {
                        vmCalendar.endIndex = index;
                    }
                }
            }
        });
    },
    startTimeIndex: -1, //夜房入住时间段序号
    startTime: "", //夜房入住时间, 格式: 08:00
    nightPrice: 0, //根据入住时间确定的夜房价格
});

//日历初始化
function getCalendar() {
    var d = new Date(),
        year, month, day,
        weekday = d.getDay(),
        temp,
        list = [],
        inDisabled, outDisabled;


    if (weekday == 0) {
        weekday = 7;
    }
    temp = weekday;

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
            inDisabled: true,
            outDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(d.getDate() + 1);
    }
    vmCalendar.todayIndex = list.length;

    d = new Date();
    for (var i = 0; i < 60; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        date = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);

        //选入住时间时，被灰掉的日期
        //不包括被预定的退房日(list2)
        //list1 + list3
        inDisabled = bookDateList && (bookDateList.inStr.indexOf(date) > -1);
        if (inDisabled) {
            bookDateList.inIndex.push(list.length);
        }

        //选退房时间时，被灰掉的日期
        //不包括被预定的入住日（14点后入住）(list1)
        //list2 + list3
        outDisabled = bookDateList && (bookDateList.outStr.indexOf(date) > -1);
        if (outDisabled) {
            bookDateList.outIndex.push(list.length);
        }

        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            inDisabled: inDisabled,
            outDisabled: outDisabled,
            date: date
        });

        d.setDate(day + 1);
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
            inDisabled: true,
            outDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(day + 1);
    }

    vmCalendar.calendar = list;
}

getCalendar();