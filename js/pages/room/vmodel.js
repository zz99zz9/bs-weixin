var roomid, bensue, newOrder, vmRoom, vmBtn, vmRoomAssess, isSuccess = false;

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
    room: {
        hotel: { name: '', alias: '', address: '' },
        roomGalleryList: [],
        designer: { name: '', message: '' },
        amenityList: []
    },
    assess: { count: 0, data: {} },
    list: [],
    roomNightDiscount: [],
    goHotel: function() {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + vmRoom.room.hotel.id;
        });
    },
    openNav: function(lat, lng, name, addr) {
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
                    $('.select-time').height($(window).height() - 260);

                    select_bar = document.getElementById('select_bar');
                    select_bar.style.width = $('#select_time').width() + 'px';
                });
            }
        });
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
        location.href = "rooms.html?type=order";
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
    }
});

//弹出框的确定按钮
vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //打开的窗口
    ok: function() {
        switch(vmBtn.type) {
            case 'date':
                getDate();
                break;
            case 'partTime':
                getPartTime();
                break;
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
newOrder = { room: {}, goods: [] };

//获取房间详情
ajaxJsonp({
    url: urls.getRoomDetail,
    data: { rid: roomid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmRoom.room = json.data;
            newOrder.room.rid = json.data.id;
            newOrder.room.hid = json.data.hid;
            newOrder.room.name = json.data.name;
            newOrder.room.dayPrice = json.data.dayPrice;
            // newOrder.room.hourPrice = json.data.hourPrice;

            vmRoomAssess.designer = json.data.designer;
        }
    }
});

if(!roomType) {
 //查询房间夜房优惠价格
    ajaxJsonp({
        url: urls.getRoomNightDiscount,
        data: { rid: roomid },
        successCallback: function(json) {
            if (json.status == 1) {
                vmRoom.roomNightDiscount = json.data;
                // if (newOrder.date && newOrder.date.startTimeIndex > -1)
                //     vmRooms.startTimeSelect(0, newOrder.date.startTimeIndex);
            }
        }
    });
}

//获取房间时租房价格列表
ajaxJsonp({
    url: urls.getRoomPartTimePrice,
    data: { rid: roomid },
    successCallback: function(json) {
        if (json.status == 1) {
            newOrder.room.hourPrice = json.data;
        }
    }
});

//更多房间
ajaxJsonp({
    url: urls.getRoomList,
    //data: {url:window.location.href},
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

//显示夜房的入住时间
function getDate() {
    var startObj, endObj, startIndex, endIndex;

    if(vmCalendar.startIndex==-1) {
        vmRoom.start = '<br>请选择';
    } else {
        startObj = vmCalendar.calendar[vmCalendar.startIndex];
        if(startObj) {
            startIndex = vmCalendar.startIndex;
            vmRoom.start = startObj.month + '月' + startObj.day + '日'
                + '<br><br>' + getWeekday(startObj.date);
        }
    }

    if(vmCalendar.endIndex==-1) {
        vmRoom.end = '<br>请选择';
    } else {
        endObj = vmCalendar.calendar[vmCalendar.endIndex];
        if(endObj) {
            endIndex = vmCalendar.endIndex;
            vmRoom.end = endObj.month + '月' + endObj.day + '日'
                + '<br><br>' + getWeekday(endObj.date);
        }
    }

    if(startIndex && endIndex) {
        vmRoom.amount = (endIndex - startIndex) + '晚';
    } else {
        vmRoom.amount = '?';
    }
}

//显示时租房的入住时间
function getPartTime() {
    var start = vmPart.partTimeStart,
        end = vmPart.partTimeEnd;

    if(start) {
        vmRoom.start = '<br>' + start;
    } else {
        vmRoom.start = '<br>请选择';
    }

    if(end) {
        vmRoom.end = '<br>' + end;
    } else {
        vmRoom.end = '<br>请选择';
    }

    if(start && end) {
        vmRoom.amount = vmPart.partTimeNumber/2 + '小时';
    } else {
        vmRoom.amount = '?';
    }
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