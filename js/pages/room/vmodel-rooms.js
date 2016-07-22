//pageType = order 表示从room页面过来，确认时间
var pageType = getParam("type"),
    hotelid = getParam("hid"),
    tid = getParam("tid"),
    newOrder = Storage.get("newOrder") || null,
    tapCount = 1,
    bookDateList = null,
    tapCount = 0;

// avalon.config.async = true;

//mui操作表
(function($, doc) {
    $.init();

    $.ready(function() {

        var userResult = document.getElementById("userResult");
        // var timeResult = document.getElementById("timeResult");
        var info = document.getElementById("info");
        mui('body').on('tap', '.mui-popover-action li>a', function() {
            var a = this,
                parent;
            //根据点击按钮，反推当前是哪个actionsheet
            for (parent = a.parentNode; parent != document.body; parent = parent.parentNode) {
                if (parent.classList.contains('mui-popover-action')) {
                    break;
                }
            }
            //关闭actionsheet
            mui('#' + parent.id).popover('toggle');
            if (a.innerHTML != '取消') {
                var sss = a.parentNode.parentNode.parentNode.id;
                // if (sss == 'time') {
                //     timeResult.innerHTML = a.innerHTML;
                // }
                if (sss == 'rooms') {
                    userResult.innerHTML = '"' + a.innerHTML + '"';
                    info.innerHTML = a.getAttribute('data-info');
                }
            }
        });

        var select_bar = doc.getElementById('select_bar');
        select_bar.style.width = document.body.clientWidth - 70 + 'px';
    });
})(mui, document);

var vmLogo = avalon.define({
    $id: "logo",
    isClose: false,
    close: function() {
        ShowRoomList();
    },
    goIndex: function() {
        location.href = "index.html";
    }
});

var vmOrderType = avalon.define({
    $id: "orderType",
    type: 0,
    selectType: function(type) {
        if (vmRooms.isPartTime != type) {
            vmRooms.isPartTime = type;

            if (type == 0) {
                //夜房
                //隐藏时租房时间列表
                if (vmRooms.statusControl.isTimeListShow) {
                    vmRooms.statusControl.isTimeListShow = false;
                    vmRooms.statusControl.isCalendarShow = true;
                }

                if (pageType == 'order') {
                    vmRooms.statusControl.isCalendarShow = true;
                    vmRooms.statusControl.isCalendarEdit = true;
                    vmRooms.statusControl.isStartEdit = true;
                    vmRooms.statusControl.isStartTimeShow = true;
                    vmRooms.statusControl.isEndEdit = false;
                }

            } else if (type == 1) {
                //时租房
                if (vmRooms.statusControl.isCalendarShow) {
                    vmRooms.statusControl.isTimeListShow = true;
                    vmRooms.statusControl.isCalendarShow = false;
                }
                // vmRooms.statusControl.isStartTimeShow = false;
                // vmRooms.statusControl.isCalendarEdit = false;
                // vmRooms.statusControl.isStartEdit = false;
                // vmRooms.statusControl.isEndEdit = false;

                if (pageType == 'order') {
                    vmRooms.statusControl.isTimeListShow = true;
                }
            }

            if (pageType != 'order') {
                if (!vmRooms.statusControl.isTimeListShow && !vmRooms.statusControl.isCalendarShow) {
                    vmRooms.statusControl.isMoreBtnSow = true;
                    searchRoomList();
                }
            }
        }
    }
});

var vmRooms = avalon.define({
    $id: "rooms",
    list: [],
    pageNo: 1,
    pageSize: 6,
    statusControl: {
        isStartEdit: false, //选择夜房入住日期
        isEndEdit: false, //选择夜房退房日期
        isCalendarShow: false, //日历是否显示
        isCalendarEdit: false, //日历是否可点
        isStartTimeShow: false, //选择夜房入住时间段
        isStartTimeEdit: false, //夜房入住时间修改
        isTimeListShow: false, //时租房时间列表是否显示

        isTypeShow: false, //房间系列是否显示
        isMoreBtnShow: true,
        isRoomListShow: true, //房间列表
    },
    percent: [
        'M71,36A35,35,0,1,1,36,1,35,35,0,0,1,71,36Z',
        'M63.37,14.61A35,35,0,1,1,35.67,1',
        'M71,36A35,35,0,1,1,36,1',
        'M36,71A35,35,0,0,1,36,1'
    ],
    //时间选择
    partTimeClick: function() {
        vmRooms.statusControl.isTimeListShow = true;

        vmRooms.statusControl.isTypeShow = false;
        vmRooms.statusControl.isMoreBtnShow = false;
        vmRooms.statusControl.isRoomListShow = false;
        if (pageType != "order") {
            vmLogo.isClose = true;
            vmRooms.statusControl.isMoreBtnShow = true;
        }
    },
    startClick: function() {
        vmRooms.statusControl.isCalendarShow = true;

        // if (!vmRooms.statusControl.isStartEdit) {
        vmRooms.statusControl.isStartEdit = true;
        vmRooms.statusControl.isEndEdit = false;
        vmRooms.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmRooms.statusControl.isStartEdit = false;
        //     vmRooms.statusControl.isCalendarEdit = false;
        // }

        vmRooms.statusControl.isTypeShow = false;
        vmRooms.statusControl.isMoreBtnShow = false;
        vmRooms.statusControl.isRoomListShow = false;
        vmRooms.statusControl.isStartTimeShow = true;

        if (pageType != "order") {
            vmLogo.isClose = true;

            //查询搜索时，要显示的酒店夜房优惠价格列表
            ajaxJsonp({
                url: urls.getNightDiscount,
                data: { hid: hotelid, tid: vmRooms.typeid },
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmRooms.nightDiscount = json.data;
                    }
                }
            });
        }
        if (pageType == 'order') {
            vmRooms.statusControl.isStartTimeEdit = false;
        }
    },
    endClick: function() {
        vmRooms.statusControl.isCalendarShow = true;

        // if (!vmRooms.statusControl.isEndEdit) {
        vmRooms.statusControl.isStartEdit = false;
        vmRooms.statusControl.isEndEdit = true;
        vmRooms.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmRooms.statusControl.isEndEdit = false;
        //     vmRooms.statusControl.isCalendarEdit = false;
        // }

        vmRooms.statusControl.isTypeShow = false;
        vmRooms.statusControl.isMoreBtnShow = false;
        vmRooms.statusControl.isRoomListShow = false;
        vmRooms.statusControl.isStartTimeShow = false

        if (pageType != "order") {
            vmLogo.isClose = true;
            vmRooms.statusControl.isMoreBtnShow = true;
        }
        if (pageType == 'order') {
            vmRooms.statusControl.isStartTimeEdit = true;
        }
    },
    //更多筛选
    moreClick: function() {
        // vmRooms.statusControl.isCalendarShow = false;
        // vmRooms.statusControl.isTimeListShow = false;

        vmRooms.statusControl.isTypeShow = true;
        vmRooms.statusControl.isMoreBtnShow = false;
        vmRooms.statusControl.isRoomListShow = false;
        if (pageType != "order") {
            vmLogo.isClose = true;
        }
    },
    searchClick: function(event) {
        event.preventDefault();
        searchRoomList();
    },
    isPartTime: 0, //1表示时租房,0夜房
    minIndex: 16,
    maxIndex: 40,
    partTimeIndex: 0, //时租房开始序号
    partTimeNumber: 4, //时租房数列（半小时1个单位）
    partTimeStart: "", //时租房开始时间
    partTimeEnd: "", //时租房结束时间
    timeStatus: "000000000000000000000000000000000000000000000000", //默认都可以选
    timeList: [],
    partTimePrice: [], //房间时租房时段价格
    partTimePay: 0, //时租房费用
    selectTime: function(index) {
        tapCount++;
        if (tapCount > 1) {
            //时租房订房开始时间受当前时间影响
            var hourIndex = getHourIndex();
            if (index <= hourIndex)
                index = hourIndex + 1;

            //时租房订房结束时间不能超过最大值
            if (index + vmRooms.partTimeNumber > vmRooms.maxIndex) {
                vmRooms.partTimeNumber = vmRooms.maxIndex - index;
            }

            if (index >= vmRooms.minIndex && (index <= (vmRooms.maxIndex - 4)) && vmRooms.partTimeNumber >= 4) {
                vmRooms.partTimeIndex = index;

                select_bar.style.top = this.offsetTop + 'px';

                select_bar.style.height = '';
                select_bar.className = "bar";

                var list = vmRooms.timeList;

                for (var i = 1; i <= vmRooms.partTimeNumber; i++) {
                    if (list[index + i].isBook || list[index + i].isWait) {
                        vmRooms.partTimeIndex = index - (vmRooms.partTimeNumber - i);
                        select_bar.style.top = this.offsetTop - 21 * (vmRooms.partTimeNumber - i) + 'px';
                        break;
                    }
                }
                setPartTime(vmRooms.partTimeIndex, vmRooms.partTimeNumber);
            } else {
                vmRooms.partTimeIndex = 0;
                vmRooms.partTimeNumber = 4;
                vmRooms.partTimeStart = "";
                vmRooms.partTimeEnd = "";
                vmRooms.partTimePay = 0;
            }

            tapCount = 0;
        }
        setTimeout(function() {
            tapCount = 0;
        }, 100)
    },
    addTime: function() {

        if ((vmRooms.partTimeIndex + vmRooms.partTimeNumber) < vmRooms.maxIndex && canOrderPartTime()) {
            vmRooms.partTimeNumber++;

            select_bar.style.height = select_bar.offsetHeight + 21 + 'px';

            setPartTime(vmRooms.partTimeIndex, vmRooms.partTimeNumber);
        }
    },
    minusTime: function() {
        if (vmRooms.partTimeNumber > 4) {
            vmRooms.partTimeNumber--;

            select_bar.style.height = select_bar.offsetHeight - 21 + 'px';

            setPartTime(vmRooms.partTimeIndex, vmRooms.partTimeNumber);
        } else {
            select_bar.className = "mui-hidden bar";
            vmRooms.partTimeStart = "";
            vmRooms.partTimeEnd = "";
        }
    },
    goRoom: function(id) {
        location.href = "room.html?id=" + id;

        //利用tap会触发两次方法来过滤划动触发
        // tapCount ++;
        // setTimeout(function(){
        //     if(tapCount > 1) {
        //         location.href = "room.html?rid=" + id;
        //     }
        //     tapCount = 0;
        // }, 200);
    },
    calendar: [],
    startIndex: -1,
    endIndex: -1,
    todayIndex: 0,
    clickDate: function(index) {
        tapCount++;

        if (tapCount == 1) {
            var date = vmRooms.$model.calendar[index];

            //是否是编辑状态
            if (vmRooms.statusControl.isCalendarEdit) {
                //是否是编辑入住时间
                if (vmRooms.statusControl.isStartEdit && !date.inDisabled) {
                    if ((vmRooms.startIndex != -1) && (vmRooms.startIndex == index)) {
                        vmRooms.startIndex = -1;
                        return;
                    }

                    if (vmRooms.endIndex > vmRooms.startIndex) {
                        //小于之前的结束时间
                        if (index < vmRooms.endIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmRooms.startIndex = index;
                            } else {
                                var count = 0;
                                for (var i = index; i < vmRooms.endIndex; i++) {
                                    if (bookDateList.inIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmRooms.startIndex = index;
                                }
                            }
                        }
                        //大于之前的结束时间－不响应
                    } else {
                        vmRooms.startIndex = index;
                    }

                    vmRooms.startTimeIndex = -1;
                    vmRooms.startTime = "";
                    vmRooms.nightPrice = 0;

                    //针对安卓微信中 svg 标签不识别 avalon 的 ms-class bug
                    $("svg").attr("class", "clock");
                    if (vmRooms.todayIndex == index) {
                        $("svg[id^='svg']").each(function(o) {
                            if (parseInt(this.getAttribute("data-hour")) * 2 <= getHourIndex()) {
                                $(this).attr("class", "clock disabled");
                            }
                        })
                    }

                    if (bookDateList && bookDateList.outIndex.indexOf(vmRooms.startIndex) > -1) {
                        $("svg[id^='svg']").each(function(o) {
                            if (parseInt(this.getAttribute("data-hour")) <= 14) {
                                $(this).attr("class", "clock disabled");
                            }
                        })
                    }
                    //向下滚动显示选择入住时间
                    $(window).scrollTop(190);
                }

                //是否是编辑退房时间
                if (vmRooms.statusControl.isEndEdit && !date.outDisabled) {
                    if ((vmRooms.endIndex != -1) && (vmRooms.endIndex == index)) {
                        vmRooms.endIndex = -1;
                        return;
                    }

                    if ((vmRooms.endIndex > vmRooms.startIndex || vmRooms.endIndex == -1) && vmRooms.startIndex > -1) {
                        //大于之前的起始时间
                        if (index > vmRooms.startIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmRooms.endIndex = index;
                            } else {
                                var count = 0;
                                for (var i = vmRooms.startIndex + 1; i <= index; i++) {
                                    if (bookDateList.outIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmRooms.endIndex = index;
                                }
                            }
                        }
                        //小于之前的起始时间－不响应
                    } else {
                        vmRooms.endIndex = index;
                    }
                }
            }
        } else {
            tapCount = 0;
        }
    },
    //日历灰掉的逻辑
    isDisabled: function(index, isStartEdit, isEndEdit, startIndex, endIndex) {
        var isDisabledByBooked,
            date = vmRooms.$model.calendar[index],
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
    //下单时入住时间段灰掉的逻辑
    isStartTimeDisabled: function(startIndex, todayIndex, startTime) {
        if (startIndex == todayIndex) {
            if (startTime * 2 < getHourIndex()) {
                return true;
            } else {
                return false;
            }
        } else if (bookDateList && bookDateList.outIndex.indexOf(startIndex) > -1) {
            //14点以前的入住时段要灰掉
            if (startTime <= 14) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isSelected: function(index) {
        if (vmRooms.startIndex == -1 && vmRooms.endIndex == -1) {
            return false;
        }
        if (vmRooms.startIndex == -1 && vmRooms.endIndex > -1) {
            return index == vmRooms.endIndex;
        }
        if (vmRooms.startIndex > -1 && vmRooms.endIndex == -1) {
            return index == vmRooms.startIndex;
        }
        return (index >= vmRooms.startIndex) && (index <= vmRooms.endIndex);
    },
    typeid: "", //房间系列id, 默认全部
    roomTypeList: [],
    selectType: function(tid) {
        vmRooms.typeid = tid;
    },
    nightDiscount: [], //搜索时的夜房入住时段优惠列表
    roomNightDiscount: [], //房间夜房入住时间段优惠
    startTimeIndex: -1, //夜房入住时间段序号
    startTime: "", //夜房入住时间, 格式: 08:00
    nightPrice: 0, //根据入住时间确定的夜房价格
    startTimeSelect: function(hour, index) {
        if (!vmRooms.isStartTimeDisabled(vmRooms.startIndex, vmRooms.todayIndex, hour)) {
            vmRooms.startTimeIndex = index;
            var list;

            if (pageType == 'order') { //房间下单页面，显示的房间夜房时段优惠
                list = vmRooms.$model.roomNightDiscount;

                vmRooms.startTime = list[index].startTime;
                vmRooms.nightPrice = list[index].discount;

                for (var i in list) {
                    if (index == i) {
                        $("#svg_pay_" + i).attr("class", "clock active");
                    } else {
                        if (document.getElementById("svg_pay_" + i).className.animVal != "clock disabled") {
                            $("#svg_pay_" + i).attr("class", "clock");
                        }
                    }
                }
            } else { //搜索房间页面，显示的酒店夜房时段优惠
                list = vmRooms.$model.nightDiscount;
                vmRooms.startTime = list[index].start_time;

                for (var i in list) {
                    if (index == i) {
                        $("#svg_filter_" + i).attr("class", "clock active");
                    } else {
                        if (document.getElementById("svg_filter_" + i).className.animVal != "clock disabled") {
                            $("#svg_filter_" + i).attr("class", "clock");
                        }
                    }
                }
            }
        }
    },
    goNext: function() {
        saveStorage();

        //验证
        if (!vmRooms.isPartTime) {
            //夜房
            if (vmRooms.startIndex == -1) {
                mui.toast('请选择入住日期');

                vmRooms.startClick();
                return;
            }
            if (vmRooms.startTimeIndex == -1) {
                mui.toast('请选择入住时间');

                vmRooms.startClick();
                setTimeout(function() {
                    $(window).scrollTop(190);
                }, 100);
                return;
            }
            if (vmRooms.endIndex == -1) {
                mui.toast('请选择退房日期');

                vmRooms.endClick();
                return;
            }
        } else {
            //时租房
            if (vmRooms.partTimeStart == '' || vmRooms.partTimeEnd == '') {
                mui.toast('请选择时间');
                return;
            }
        }

        //时租房直接下单
        if (vmRooms.isPartTime) {
            location.href = "pay.html"
        } else {
            location.href = "article.html";
        }
    }
});

initPage();

function initPage() {
    ///
    ///判断页面初始状态
    ///
    if (pageType != 'order') {
        //筛选搜索状态
        if (hotelid != "") {
            if (isNaN(hotelid)) {
                location.href = document.referrer || "index.html";
            } else {
                hotelid = parseInt(hotelid);
            }
        } else {
            location.href = "index.html";
        }

        if (tid != "") {
            if (isNaN(tid)) {
                location.href = document.referrer || "index.html";
            } else {
                tid = parseInt(tid);
                vmRooms.typeid = tid;
            }
        }

        //查询搜索时，要显示的酒店夜房优惠价格列表
        ajaxJsonp({
            url: urls.getNightDiscount,
            data: { hid: hotelid, tid: vmRooms.typeid },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmRooms.nightDiscount = json.data;
                }
            }
        });

        //获取房间系列
        ajaxJsonp({
            url: urls.getRoomTypeList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmRooms.roomTypeList = json.data;
                }
            }
        });

        vmRooms.timeList = getTimeList(vmRooms.timeStatus);
        getRoomList();

        getCalendar();
    } else {

        if (newOrder) {
            //下单第一步：确认时间状态
            vmLogo.isClose = false;
            vmRooms.statusControl.isMoreBtnShow = false;
            vmRooms.statusControl.isRoomListShow = false;

            //转换时租房时间段价格
            newOrder.room.hourPrice.map(function(o) {
                for (var i = o.startTime * 2; i < o.endTime * 2; i++) {
                    vmRooms.partTimePrice[i] = o.price;
                }
            })

            if (newOrder.date && newOrder.date.isPartTime == 1) {

                vmRooms.isPartTime = 1;
                vmOrderType.type = 1;
                vmRooms.statusControl.isTimeListShow = true;
                //绑定值在获取时租房时间范围回调里
            } else {
                vmRooms.statusControl.isCalendarShow = true;
                vmRooms.statusControl.isCalendarEdit = true;
                vmRooms.statusControl.isStartEdit = true;
                vmRooms.statusControl.isStartTimeShow = true;

                //如果筛选过夜房
                if (newOrder.date && newOrder.date.startIndex > -1) {
                    vmRooms.startIndex = newOrder.date.startIndex;
                    vmRooms.endIndex = newOrder.date.endIndex;
                }
            }

            //查询夜房预订日期
            ajaxJsonp({
                url: urls.getRoomBookDate,
                data: { rid: newOrder.room.rid },
                successCallback: function(json) {
                    if (json.status == 1) {
                         bookDateList = {
                            inIndex: [],
                            inStr: json.data.list3.concat(json.data.list1),
                            outIndex: [],
                            outStr: json.data.list3.concat(json.data.list2),
                        };

                        getCalendar();
                    }
                }
            });

            //查询房间夜房优惠价格
            ajaxJsonp({
                url: urls.getRoomNightDiscount,
                data: { rid: newOrder.room.rid },
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmRooms.roomNightDiscount = json.data;
                        if (newOrder.date && newOrder.date.startTimeIndex > -1)
                            vmRooms.startTimeSelect(0, newOrder.date.startTimeIndex);
                    }
                }
            });

            //查询时租房预订时间情况
            ajaxJsonp({
                url: urls.getRoomStatus,
                data: { rid: newOrder.room.rid, roomDate: getToday('date') },
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmRooms.timeList = getTimeList(json.data.status);
                    }
                }
            });

        } else {
            //没有本地储存的订单相关信息，返回首页
            location.href = "index.html";
        }
    }

    //查询时租房时间范围
    ajaxJsonp({
        url: urls.getRoomPartTimeRange,
        data: {
            rid: newOrder ? newOrder.room.rid : '',
            hid: hotelid
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmRooms.minIndex = json.data.min * 2;
                vmRooms.maxIndex = json.data.max * 2;

                if (newOrder && newOrder.date && newOrder.date.partTimeIndex >= 0) {

                    vmRooms.partTimeIndex = newOrder.date.partTimeIndex;
                    vmRooms.partTimeNumber = newOrder.date.partTimeNumber;

                    vmRooms.selectTime(newOrder.date.partTimeIndex);

                    select_bar.style.top = 21 * (vmRooms.partTimeIndex - vmRooms.minIndex + 1) + 'px';
                    select_bar.style.height = 21 * vmRooms.partTimeNumber + 'px';

                    // setPartTime(vmRooms.partTimeIndex, vmRooms.partTimeNumber);
                }
            }
        }
    });
}
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
    vmRooms.todayIndex = list.length;

    d = new Date();
    for (var i = 0; i < 40; i++) {
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

    vmRooms.calendar = list;
}

//根据日历日期index返回时间字符串
function getDate(index) {
    var date;
    if (index == -1) {
        return "";
    } else {
        date = vmRooms.calendar[index];
        return date.year + '-' + (date.month < 10 ? ('0' + date.month) : date.month) + '-' + (date.day < 10 ? ('0' + date.day) : date.day);
    }
}

//获取入住时间
function getStartTime() {
    if (vmRooms.isPartTime) {
        if (vmRooms.partTimeStart) {
            var today = new Date();
            return today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate() + " " + vmRooms.partTimeStart;
        } else {
            return '';
        }
    } else {
        return getDate(vmRooms.startIndex);
    }
}

//获取退房时间
function getEndTime() {
    if (vmRooms.isPartTime) {
        if (vmRooms.partTimeEnd) {
            var today = new Date();
            return today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + "-" + today.getDate() + " " + vmRooms.partTimeEnd;
        } else {
            return '';
        }
    } else {
        return getDate(vmRooms.endIndex);
    }
}

//获得时租房的入住退房时间，费用
function setPartTime(index, number) {
    var startHour = Math.floor(index / 2);
    var endHour = Math.floor((index + number) / 2);
    vmRooms.partTimeStart = (startHour < 10 ? ('0' + startHour) : startHour) + ":" + (index % 2 ? "30" : "00");
    vmRooms.partTimeEnd = (endHour < 10 ? ('0' + endHour) : endHour) + ":" + ((index + number) % 2 ? "30" : "00");

    vmRooms.partTimePay = 0;
    for (var i = index; i < (index + number); i++) {
        vmRooms.partTimePay += vmRooms.partTimePrice[i];
    }
}

//房间状态返回时租房时间列表对象
function getTimeList(status) {
    var list = status.split(''),
        olist = [],
        o = {},
        count = 0,
        index = getHourIndex();

    //已过的时间都灰掉
    for (var i = 0; i < 48; i++) {
        if (i < index) {
            list[i] = '1';
        }
    }
    vmRooms.timeStatus = list.join('');

    for (var i = 0; i < 48; i++) {
        if (count > 0) {
            count++;
        }

        o = { isBook: 0, isWait: 0, price: 0, node: 0 };

        if (list[i] == 0 && (list[i - 1] == 1)) {
            o.isWait = 1;
            count = 1;
        }
        if (list[i] == 0 && (list[i + 1] == 1)) {
            o.isWait = 1;
        }

        if (list[i] == 1) {
            o.isBook = 1;
            //间隔不足5个全部灰掉
            if (count <= 6 && count > 0) {
                for (var j = 1; j <= count; j++) {
                    olist[olist.length - j].isBook = 1;
                }
            }
            count = 0;
        }

        o.price = vmRooms.$model.partTimePrice[i];
        if (o.price != vmRooms.$model.partTimePrice[i - 1]) {
            o.node = 1;
        }
        olist.push(o);

    }

    return olist;
}

//判断是否能否半个小时能否订时租房
function canOrderPartTime() {
    var list = vmRooms.timeList;
    return !(list[vmRooms.partTimeIndex + vmRooms.partTimeNumber].isBook || list[vmRooms.partTimeIndex + vmRooms.partTimeNumber].isWait);
}

function searchRoomList() {
    ShowRoomList();
    saveStorage();
    getRoomList();
}

//搜索列表
function ShowRoomList() {
    vmRooms.statusControl.isStartEdit = false;
    vmRooms.statusControl.isEndEdit = false;
    vmRooms.statusControl.isCalendarEdit = false;
    vmRooms.statusControl.isCalendarShow = false;
    vmRooms.statusControl.isTypeShow = false;
    vmRooms.statusControl.isTimeListShow = false;
    vmRooms.statusControl.isMoreBtnShow = true;
    vmRooms.statusControl.isRoomListShow = true;
    vmLogo.isClose = false;
}

//保存到本地
function saveStorage() {
    if (!newOrder) {
        newOrder = {};
    }

    newOrder.date = {
        start: getStartTime(),
        end: getEndTime(),
        pay: vmRooms.isPartTime ? vmRooms.partTimePay : vmRooms.nightPrice * (vmRooms.endIndex - vmRooms.startIndex),
        isPartTime: vmRooms.isPartTime,
        partTimeIndex: vmRooms.partTimeIndex,
        partTimeNumber: vmRooms.partTimeNumber,
        nightPrice: vmRooms.nightPrice,
        startIndex: vmRooms.startIndex,
        endIndex: vmRooms.endIndex,
        startTimeIndex: vmRooms.startTimeIndex,
        startTime: vmRooms.startTime ? (vmRooms.startTime + ':00') : ''
    };

    Storage.set("newOrder", newOrder);
}

function getRoomList() {
    var start = getStartTime(),
        end = getEndTime();
    if (start && end) {
        vmRooms.pageSize = 6;
    } else {
        vmRooms.pageSize = -1;
    }

    if (start) {
        start += vmRooms.startTime ? (' ' + vmRooms.startTime + ':00') : '';
    }
    if (end) {
        end += ' 14:00';
    }

    ajaxJsonp({
        url: urls.getRoomList,
        data: {
            hid: hotelid,
            tid: vmRooms.typeid,
            startTime: start,
            endTime: end,
            isPartTime: vmRooms.isPartTime,
            pageNo: vmRooms.pageNo,
            pageSize: vmRooms.pageSize
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRooms.list = json.data.list;
            }
        }
    });
}

//在时租房时间列表上，显示时间段节点价格
function partTimePriceShow(index, node, price) {
    if (node) {
        return " " + index / 2 + "点以后，每半小时 " + price + " 元";
    } else {
        return '';
    }
}

//获取当前小时序号
function getHourIndex() {
    var now = getToday('time').split(':'),
        index = parseInt(now[0]) * 2;

    if (parseInt(now[1]) >= 30) {
        index++;
    }

    return index;
}
