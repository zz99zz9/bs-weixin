var hid, roomTypeId, bensue, newOrder, vmRoom, vmBtn, vmDesigner, vmAmenity,
    isSuccess = false,
    roomType = 0,//住宿类型
    user = Storage.getLocal("user"),
    clockObj = {};

hid = getParam("hid");
if (hid != "") {
    if (isNaN(hid)) {
        location.href = document.referrer || "index.html";
    } else {
        hid = parseInt(hid);
    }
} else {
    location.href = "index.html";
}

//房型
roomTypeId = getParam("tid");
if (roomTypeId != "") {
    if (isNaN(roomTypeId)) {
        location.href = document.referrer || "index.html";
    } else {
        roomTypeId = parseInt(roomTypeId);
    }
} else {
    location.href = "index.html";
}

vmRoom = avalon.define({
    $id: "room",
    type: 0, //0 全天房，1 时租房, 2 午夜房
    start: '请选择',
    end: '请选择',
    amount: '0',
    timeSpan: '',
    unit: '',
    price: 0,
    timeCoin: 0,
    room: {
        hotel: {
            name: '',
            alias: '',
            address: ''
        },
        roomGalleryList: [],
        designer: {
            name: '',
            message: ''
        },
        amenityList: []
    },
    assess: {
        count: 0,
        data: {}
    },
    list: [],
    startTimeIndex: 1, //夜房入住时间表盘
    todayIndex: 0,
    startIndex: -1,
    roomNightDiscount: [{
        discount: 0
    }],
    checkinList: [],
    isAgree: true,
    getData: function() {
        //获取房型详情
        ajaxJsonp({
            url: urls.getRoomTypeDetail,
            data: {
                tid: roomTypeId,
                startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
                endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
                hid: hid,
                isPartTime: vmRoom.type,
                aids: vmRoom.aids,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmRoom.room = json.data;

                    $.extend(newOrder, {
                        room: {
                            id: json.data.id,
                            name: json.data.name
                        },
                        hotel: {
                            id: json.data.hotel.id,
                            name: json.data.hotel.name,
                            address: json.data.hotel.address
                        }
                    });
                    Storage.set("newOrder", newOrder);

                    vmDesigner.designer = json.data.designer;
                    // if (vmRoom.type == 1) {
                    //     //时租房的价格，接口返回的是每半个小时
                    //     vmRoom.price = vmRoom.room.minPrice * 2;
                    // }
                }
            }
        });
    },
    openTimePanel: function(e) {
        stopSwipeSkip.do(function() {
            modalShow('./util/calendar.html', 1, function() {
                e.stopPropagation();
                vmCalendar.iniCalendarModal(roomTypeId);
            });
        });
    },
    openDesigner: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/designer.html', 1);
        });
    },
    // openAssess: function() {
    //     stopSwipeSkip.do(function() {
    //         vmBtn.useCheck = 0;
    //         popover('./util/assess.html', 1);
    //     });
    // },
    openCheckin: function() {
        stopSwipeSkip.do(function() {
            vmBtn.type = "checkin";
            vmBtn.useCheck = 1;
            popover('./util/contactList.html', 1, function() {

                //获取联系人列表
                ajaxJsonp({
                    url: urls.getContactList,
                    data: {
                        pageSize: 30 //因为要维护选中状态，没有用loadmore按钮
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            vmContactList.list = json.data.list;

                            //读取本地保存
                            if (newOrder.hasOwnProperty("contact")) {
                                vmContactList.selectedList = [];
                                for (var i in json.data.list) {
                                    if (newOrder.contact.length > 0) {
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
                    }
                });
            });
        });
    },
    clickIsAgree: function() {
        stopSwipeSkip.do(function() {
            vmRoom.isAgree = !vmRoom.isAgree;
        });
    },
    openRule: function() {
        // event.stopPropagation();
        stopSwipeSkip.do(function() {
            vmBtn.type = "rule";
            vmBtn.useCheck = 1;
            popover('./util/note.html', 1);
        })
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?hid=" + hid + "&tid=" + id;
        });
    },
    isGoNext: false,
    //下单
    goNext: function() {
        var popCase = '';
        vmRoom.isGoNext = true;
        // Storage.set("newOrder", newOrder);

        if (vmRoom.type == 1) {
            if (!newOrder.partTime.start || !newOrder.partTime.end || newOrder.partTime.start == '' || newOrder.partTime.end == '' || newOrder.partTime.start.length < 12 || newOrder.partTime.end.length < 12) {
                // mui.toast('请选择时间');
                popCase = 'time';
                vmRoom.isGoNext = false;
            }
        } else {
            if (!newOrder.day.start || !newOrder.day.end || newOrder.day.start == '' || newOrder.day.end == '') {
                // mui.toast('请选择时间');
                popCase = 'time';
                vmRoom.isGoNext = false;
            }
        }

        if (vmRoom.isGoNext && vmRoom.checkinList.length < 1) {
            // mui.toast('请选择入住人');
            vmRoom.isGoNext = false;
            popCase = 'checkin';
        }

        if (vmRoom.isGoNext && !vmRoom.isAgree) {
            // mui.toast('请阅读并同意《入住条款》');
            vmRoom.isGoNext = false;
            popCase = 'rule';
        }

        if (vmRoom.isGoNext) {
            ajaxJsonp({
                url: urls.submitOrder,
                data: {
                    tid: roomTypeId,
                    startTime: vmRoom.type ? newOrder.partTime.start : (newOrder.day.start),
                    endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
                    isPartTime: vmRoom.type,
                    cids: newOrder.contact.map(function(o) {
                        return o.id;
                    }).join(','),
                    aids: vmRoom.aids,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        Storage.delete("newOrder");   //清空该用户的缓存记录

                        location.href = "order.html?id=" + json.data.id;
                    } else {
                        mui.alert(json.message);
                        vmRoom.isGoNext = false;
                    }
                }
            })
        } else {
            switch (popCase) {
                case 'time':
                    vmRoom.openTimePanel();
                    vmRoom.openTimePanel();
                    break;
                case 'checkin':
                    vmRoom.openCheckin();
                    vmRoom.openCheckin();
                    break;
                case 'rule':
                    vmRoom.openRule();
                    vmRoom.openRule();
                    break;
                default:
                    break;
            }
        }
    },
    swiper1Render: function() {
        var swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            autoplay: 3000,
            speed: 300
        });

        mui.previewImage();
    },
    swiper2Render: function() {
        var swiper2 = new Swiper('.swiper2', {
            slidesPerView: 1,
            width: window.innerWidth - 20,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4
        });
    },
    swiper3Render: function() {
        var swiper3 = new Swiper('.swiper3', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    swiper4Render: function() {
        var swiper4 = new Swiper('.swiper4', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
        });
    },
    //显示夜房的入住时间
    showDate: function() {
        sessionToDateData();
    },
    //显示时租房的入住时间
    showPartTime: function() {
        sessionToDateData();
    }
});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        switch (vmBtn.type) {
            case 'checkin':
                if (vmContactList.selectDone()) {
                    vmRoom.checkinList = newOrder.contact;
                    break;
                } else {
                    return;
                }
            case 'rule':
                vmRoom.isAgree = true;
                break;
        }
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmDesigner = avalon.define({
    $id: "designer",
    designer: {
        portraitUrl: '',
        name: '',
        message: ''
    }
});

//获取住宿类型 0-全天房，1-时租房，2-午夜房
bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type || 0;
}
vmRoom.type = roomType;

newOrder = iniOrderTime();

//本地有入住人信息优先使用本地数据
//没有的话就读接口查询是否设置过默认入住人
if (newOrder.contact && newOrder.contact.length > 0) {
    vmRoom.checkinList = newOrder.contact;
} else {
    newOrder.contact = [];
}

if(!newOrder.day.startShow) {
    newOrder.day.startShow = formatDate(newOrder.day.start) + '<br><br>' + newOrder.day.startHour + ":00";
    newOrder.day.endShow = formatDate(newOrder.day.end) + '<br><br>' + newOrder.day.endHour + ":00";
    newOrder.day.timeSpan = getTimeSpan(newOrder.day.start, newOrder.day.end);
}
if(!newOrder.partTime.startShow){
    newOrder.partTime.startShow = "今日<br><br>" + newOrder.partTime.startHour + ":00";
    newOrder.partTime.endShow = "今日<br><br>" + newOrder.partTime.endHour + ":00";
    newOrder.partTime.timeSpan = getTimeSpan(newOrder.partTime.start, newOrder.partTime.end);
}

Storage.set("newOrder", newOrder);

sessionToDateData();
room_init();

/*
 **函数声明
 */
function room_init() {
    vmRoom.getData();

    //初始的价格
    ajaxJsonp({
        url: urls.getRoomPrice,
        data: {
            tid: roomTypeId,
            isPartTime: vmRoom.type,
            startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
            endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmRoom.price = json.data.amount;
                vmRoom.timeCoin = json.data.timeCoin;
            }
        }
    });

    //更多推荐房型
    ajaxJsonp({
        url: urls.getRoomTypeList,
        data: {
            hid: hid,
            isPartTime: vmRoom.type,
            startTime: vmRoom.type ? newOrder.partTime.start : newOrder.day.start,
            endTime: vmRoom.type ? newOrder.partTime.end : newOrder.day.end,
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmRoom.list = json.data;
            } else {
                console.log(json.message);
            }
        }
    });

    //获取评论
    // ajaxJsonp({
    //     url: urls.getRoomAssess,
    //     data: { rid: roomid, pageSize: 20 },
    //     successCallback: function(json) {
    //         if (json.status === 1) {
    //             json.data.list.map(function(o) {
    //                 o.s = vmRoomAssess.sum(o.score1, o.score2, o.score3);
    //             })
    //             vmRoomAssess.list = json.data.list;
    //             vmRoomAssess.count = json.data.count;
    //         }
    //     }
    // });

    if(user && user.logState) {
        //获取默认联系人
        ajaxJsonp({
            url: urls.getContactList,
            successCallback: function(json) {
                var defaultList = [];
                if (json.status === 1) {
                    json.data.list.map(function(o) {
                        if (o.isDefault) {
                            defaultList.push(o);
                        }
                    });
                    //如果有默认入住人，就覆盖本地数据
                    if (defaultList.length > 0) {
                        newOrder.contact = defaultList;
                        vmRoom.checkinList = defaultList;
                    }
                }
            }
        });
    }

    registerWeixinConfig();
}

function dateDataToSession() {
    if (vmRoom.type == 0) {
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
    newOrder = Storage.get("newOrder");
    
    if (vmRoom.type == 0) {
        if (newOrder.day.startShow) {
            vmRoom.start = newOrder.day.startShow;
        }
        if (newOrder.day.endShow) {
            vmRoom.end = newOrder.day.endShow;
        }
        if (newOrder.day.amount) {
            vmRoom.amount = newOrder.day.amount;
        }
        if (newOrder.day.todayIndex) {
            vmRoom.todayIndex = newOrder.day.todayIndex;
        }
        if (newOrder.day.startIndex) {
            vmRoom.startIndex = newOrder.day.startIndex;
        }
        if (newOrder.day.timeSpan) {
            vmRoom.timeSpan = newOrder.day.timeSpan;
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
        if (newOrder.partTime.timeSpan) {
            vmRoom.timeSpan = newOrder.partTime.timeSpan;
        }
    }
}

//保存到本地
function saveStorage() {
    if (vmRoom.type == 1) {
        $.extend(newOrder.partTime, {
            start: getStartTime(vmRoom.type),
            end: getEndTime(vmRoom.type),
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(vmRoom.type),
            end: getEndTime(vmRoom.type),
        });
    }

    Storage.set("newOrder", newOrder);
}

//注册导航接口
function registerWeixinConfig() {
    ajaxJsonp({
        url: urls.weiXinConfig,
        data: {
            url: window.location.href
        },
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
                        'getLocation'
                    ],
                });
                isSuccess = true;
            }
        }
    });
}

vmRoom.$watch('type', function(a) {
    room_init();
});

function getTimeSpan(start, end) {
    var startDate, endDate, day, hour, timeSpan;
    startDate = new Date(start.replace(/-/g, "/"));
    endDate = new Date(end.replace(/-/g, "/"));
    day = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / 86400000);
    hour = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / 3600000) % 24;

    if (day) {
        if (hour) {
            timeSpan = day + "天 " + hour + "小时";
        } else {
            timeSpan = day + "天 ";
        }
    } else {
        timeSpan = hour + "小时";
    }

    return timeSpan;
}