var roomid, bensue, newOrder, vmRoom, vmBtn, vmRoomAssess,
    isSuccess = false,
    positionInStorage = Storage.getLocal("position");

roomid = getParam("id");
if (roomid != "") {
    if (isNaN(roomid)) {
        location.href = document.referrer || "index.html";
    } else {
        roomid = parseInt(roomid);
    }
} else {
    location.href = "index.html";
}

vmRoom = avalon.define({
    $id: "room",
    type: 0, //0 夜房，1 时租房
    start: '<br>请选择',
    end: '<br>请选择',
    amount: '?',
    unit: '',
    price: '',
    room: {
        hotel: { name: '', alias: '', address: '' },
        roomGalleryList: [],
        designer: { name: '', message: '' },
        amenityList: []
    },
    assess: { count: 0, data: {} },
    list: [],
    startTimeIndex: 0,
    roomNightDiscount: [],
    checkinList: [],
    goHotel: function() {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + vmRoom.room.hotel.id;
        });
    },
    openNav: function() {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: vmRoom.room.hotel.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: vmRoom.room.hotel.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: vmRoom.room.hotel.name, // 位置名
                    address: vmRoom.room.hotel.address, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'ini.xin' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            if (vmRoom.type == 0) {
                vmBtn.type = "date";
                popover('./calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 300);
                    //初始状态打开选择入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }
                });
            } else {
                vmBtn.type = "partTime";
                popover('./partTime.html', 1, function() {
                    loadSessionPartTime();
                });
            }
        });
    },
    openCheckin: function() {
        stopSwipeSkip.do(function() {
            vmBtn.type = "checkin";
            popover('./contactList.html', 1, function() {

                //获取联系人列表
                ajaxJsonp({
                    url: urls.getContactList,
                    data: { pageSize: 10 },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            vmContactList.list = json.data.list;

                            //读取本地保存
                            if (newOrder.hasOwnProperty("contact")) {
                                vmContactList.selectedList = [];
                                for (var i in json.data.list) {
                                    //绑定本地储存已选联系人
                                    newOrder.contact.map(function(c) {
                                        if (c.id == json.data.list[i].id) {
                                            vmContactList.selectedList.push(parseInt(i));
                                        }
                                    });
                                }
                            }
                        }
                    }
                });
            });
        });
    },
    selectDiscount: function(index) {
        vmRoom.startTimeIndex = index;
        vmRoom.price = vmRoom.roomNightDiscount[index].discount;

        newOrder.day.startTimeIndex = index;
        Storage.set("newOrder", newOrder);
    },
    showTotalPrice: function(price, amount) {
        if (isNaN(price * amount)) {
            return '';
        } else {
            return price * amount;
        }
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?id=" + id;
        });
    },
    isGoNext: false,
    goNext: function() {
        vmRoom.isGoNext = true;
        Storage.set("newOrder", newOrder);

        if (vmRoom.type) {
            if (vmPart.partTimeStart == '' || vmPart.partTimeEnd == '') {
                mui.toast('请选择时间');
                vmRoom.isGoNext = false;
                return;
            }
        } else {
            if (vmCalendar.starIndex == -1 || vmCalendar.endIndex == -1) {
                mui.toast('请选择时间');
                vmRoom.isGoNext = false;
                return;
            }
        }

        if (vmRoom.checkinList.length < 1) {
            mui.toast('请选择入住人');
            vmRoom.isGoNext = false;
            return;
        }

        location.href = "pay.html"
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth - 40,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });

        mui.previewImage();
    },
    swiper2Render: function() {
        var swiper2 = new Swiper('.swiper2', {
            slidesPerView: 1,
            width: window.innerWidth - 40,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });
    },
    swiper3Render: function() {
        var swiper2 = new Swiper('.swiper3', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    //显示夜房的入住时间
    showDate: function() {
        var startObj, endObj, startIndex, endIndex;

        if (vmCalendar.startIndex == -1) {
            vmRoom.start = '<br>请选择';
        } else {
            startObj = vmCalendar.calendar[vmCalendar.startIndex];
            if (startObj) {
                startIndex = vmCalendar.startIndex;
                vmRoom.start = startObj.month + '月' + startObj.day + '日' + '<br><br>' + getWeekday(startObj.date);
            }
        }

        if (vmCalendar.endIndex == -1) {
            vmRoom.end = '<br>请选择';
        } else {
            endObj = vmCalendar.calendar[vmCalendar.endIndex];
            if (endObj) {
                endIndex = vmCalendar.endIndex;
                vmRoom.end = endObj.month + '月' + endObj.day + '日' + '<br><br>' + getWeekday(endObj.date);
            }
        }

        if (startIndex && endIndex) {
            vmRoom.amount = (endIndex - startIndex);
        } else {
            vmRoom.amount = '?';
        }

        dateDataToSession();
    },
    //显示时租房的入住时间
    showPartTime: function() {
        var start = vmPart.partTimeStart,
            end = vmPart.partTimeEnd;

        if (start) {
            vmRoom.start = '今日<br><br>' + start;
        } else {
            vmRoom.start = '<br>请选择';
        }

        if (end) {
            vmRoom.end = '今日<br><br>' + end;
        } else {
            vmRoom.end = '<br>请选择';
        }

        if (start && end) {
            vmRoom.amount = vmPart.partTimeNumber / 2;
        } else {
            vmRoom.amount = '?';
        }

        dateDataToSession();
    }
});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    ok: function() {
        switch (vmBtn.type) {
            case 'date':
                vmRoom.showDate();
                saveStorage();
                break;
            case 'partTime':
                vmRoom.showPartTime();
                saveStorage();
                break;
            case 'checkin':
                if (vmContactList.selectDone()) {
                    vmRoom.checkinList = newOrder.contact;
                    break;
                } else {
                    return;
                }
        }
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmRoomAssess = avalon.define({
    $id: "roomassess",
    designer: { portraitUrl: '', name: '', message: '' },
    list: [],
    scoreList: [
        { name: '淋浴舒适度', r: 1, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '浴舒适度', r: 2, s: 5, list: [1, 2, 3, 4, 5] },
        { name: '清洁度', r: 3, s: 5, list: [1, 2, 3, 4, 5] },
    ],
    pageNo: 1,
    count: 0,
    s1: 5,
    s2: 5,
    s3: 5,
    r: 0,
    s: 0,
    pageSize: 20
});

bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type || 0;
}
vmRoom.type = roomType;

newOrder = Storage.get("newOrder");
if (newOrder) {
    //显示本地时间数据
    if (newOrder.day) {
        sessionToDateData();
    }

    if (newOrder.contact && newOrder.contact.length > 0) {
        vmRoom.checkinList = newOrder.contact;
    }
} else {
    newOrder = { room: {}, hotel: {}, day: {}, partTime: {}, contact: {} };
}

room_init();

//用pullRefresh防止穿透
mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: true, //可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
    }
});

/*
 **函数声明
 */
function room_init() {
    //获取房间详情
    ajaxJsonp({
        url: urls.getRoomDetail,
        data: { rid: roomid, isPartTime: roomType },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRoom.room = json.data;
                $.extend(newOrder, {
                    room: {
                        id: json.data.id,
                        name: json.data.name
                    },
                    hotel: {
                        id: json.data.hotel.id
                    }
                });

                vmRoomAssess.designer = json.data.designer;
                if (roomType) {
                    //时租房的价格，接口返回的是每半个小时
                    vmRoom.price = vmRoom.room.minPrice * 2;
                }
            }
        }
    });

    if (!roomType) {
        //查询房间夜房优惠价格
        ajaxJsonp({
            url: urls.getRoomNightDiscount,
            data: { rid: roomid },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmRoom.roomNightDiscount = json.data;

                    //加载本地保存数据
                    if (newOrder.day && newOrder.day.startTimeIndex > 0) {
                        vmRoom.startTimeIndex = newOrder.day.startTimeIndex;
                        vmRoom.price = json.data[newOrder.day.startTimeIndex].discount;
                    } else {
                        //默认选择第一个，最高价格
                        vmRoom.price = json.data[0].discount;
                        newOrder.day.startTimeIndex = 0;
                        Storage.set("newOrder", newOrder);
                    }
                }
            }
        });
    }

    //查询时租房预订时间情况
    ajaxJsonp({
        url: urls.getRoomStatus,
        data: { rid: roomid, roomDate: getToday('date') },
        successCallback: function(json) {
            if (json.status == 1) {
                vmPart.timeList = getTimeList(json.data.status);
            }
        }
    });

    //更多房间
    ajaxJsonp({
        url: urls.getRoomList,
        data: {
            isPartTime: vmRoom.type,
            aids: vmRoom.type ? newOrder.partTime.filter.join(',') : newOrder.day.filter.join(','),
            startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
            endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
            lng: positionInStorage ? positionInStorage.lng : '',
            lat: positionInStorage ? positionInStorage.lat : '',
            pageNo: 1,
            pageSize: 6
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRoom.list = json.data.list;
            }
        }
    });

    //获取评论
    ajaxJsonp({
        url: urls.getRoomAssess,
        data: { rid: roomid, pageSize: 20 },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRoomAssess.list = json.data.list;
                vmRoomAssess.count = json.data.count;

                if (json.data.score) {
                    vmRoomAssess.s1 = json.data.score.score1;
                    vmRoomAssess.s2 = json.data.score.score2;
                    vmRoomAssess.s3 = json.data.score.score3;
                }

                vmRoom.assess.count = json.data.count;
                if (json.data.list.length > 0) {
                    vmRoom.assess.data = json.data.list[0];
                }
            }
        }
    });

    registerWeixinConfig();
}

function dateDataToSession() {
    if (!roomType) {
        newOrder.day.startShow = vmRoom.start;
        newOrder.day.endShow = vmRoom.end;
        newOrder.day.amount = vmRoom.amount;
    } else {
        newOrder.partTime.startShow = vmRoom.start;
        newOrder.partTime.endShow = vmRoom.end;
        newOrder.partTime.amount = vmRoom.amount;
    }

    Storage.set("newOrder", newOrder);
}

function sessionToDateData() {
    if (!roomType) {
        if (newOrder.day.startShow) {
            vmRoom.start = newOrder.day.startShow;
        }
        if (newOrder.day.endShow) {
            vmRoom.end = newOrder.day.endShow;
        }
        if (newOrder.day.amount) {
            vmRoom.amount = newOrder.day.amount;
        }
    } else {
        if (newOrder.partTime.startShow) {
            vmRoom.start = newOrder.partTime.startShow;
        }
        if (newOrder.partTime.endShow) {
            vmRoom.end = newOrder.partTime.endShow;
        }
        if (newOrder.partTime.amount) {
            vmRoom.amount = newOrder.partTime.amount;
        }
    }
}

//保存到本地
function saveStorage() {
    if (roomType) {
        $.extend(newOrder.partTime, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
        });
    }

    Storage.set("newOrder", newOrder);
}

//注册导航接口
function registerWeixinConfig() {
    ajaxJsonp({
        url: urls.weiXinConfig,
        data: { url: window.location.href },
        successCallback: function(json) {
            if (json.status === 1) {
                wx.config({
                    debug: false,
                    appId: json.data.appId,
                    timestamp: json.data.timestamp,
                    nonceStr: json.data.nonceStr,
                    signature: json.data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'openLocation',
                        'getLocation',
                        'checkJsApi'
                    ],
                });
                isSuccess = true;
            }
        }
    });
}

//下拉刷新
function reload() {
    room_init();
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    mui('#pullrefresh').pullRefresh().refresh(true);
}
