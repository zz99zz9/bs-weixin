var hid,
    myPosition, myLng, myLat,
    bensue, roomType, newOrder,
    isexpand = false,
    isSuccess = false;

var vmHotel = avalon.define({
    $id: 'hotel',
    type: 0,
    alias: '',
    name: '',
    address: '',
    introduction: '',
    lng: '',
    lat: '',
    distance: '',
    surplusList: [],
    galleryList: [],
    featureList: [],
    getHotelDetail: function() {
        ajaxJsonp({
            url: urls.getHotelDetail,
            data: {
                hid: hid,
                lng: myLng,
                lat: myLat,
                isPartTime: roomType
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmHotel.alias = json.data.alias;
                    vmHotel.name = json.data.name;
                    vmHotel.address = json.data.address;
                    vmHotel.introduction = json.data.introduction;
                    vmHotel.lng = json.data.lng;
                    vmHotel.lat = json.data.lat;
                    vmHotel.distance = round(json.data.distance / 1000, 2);
                    //顶部轮播导入图片数据
                    vmHotel.galleryList = json.data.hotelGalleryList;
                    //房型数量
                    vmHotel.surplusList = json.data.surplusList;
                    //酒店特色
                    vmHotel.featureList = json.data.featureList;
                }
            }
        });
    },
    expand: function() {
        stopSwipeSkip.do(function() {
            var h = ($(".pic-info"))[0].scrollHeight;
            isexpand = !isexpand;
            if (isexpand) {
                $(".pic-info").addClass('expanded');
                $(".tdclass").text("收起");
                $(".pic-info").css('height', h + 'px')
            } else {
                $(".pic-info").removeClass('expanded');
                $(".tdclass").text("展开");
                $(".pic-info").css('height', '')
            }
        });
    },
    openFeature: function(str) {
        stopSwipeSkip.do(function() {
            var html = "<img src=" + urlAPINet + str.imgUrl + ">" + "<p>" + str.content + "</p>";
            popover(html, 2);
        });
    },
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            if (roomType == 0) {
                vmBtn.type = 'date';
                popover('./util/calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 300);
                    //初始状态打开选择入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }
                });
            } else {
                vmBtn.type = 'partTime';
                popover('./util/partTime.html', 1, function() {
                    loadSessionPartTime();
                });
            }
        });
    },
    pageNo: 1,
    pageSize: 6,
    roomList: [],
    getRoomList: function() {
        ajaxJsonp({
            url: urls.getRoomList,
            data: {
                hid: hid,
                aids: roomType.type ? newOrder.partTime.filter.join(',') : newOrder.day.filter.join(','),
                startTime: roomType ? newOrder.partTime.start : newOrder.day.start,
                endTime: roomType ? newOrder.partTime.end : newOrder.day.end,
                isPartTime: roomType,
                lng: myLng,
                lat: myLat,
                pageNo: 1,
                pageSize: vmHotel.pageSize
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmHotel.pageNo = 2;
                    vmHotel.roomList = json.data.list;
                }
            }
        });
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
    },
    goHotelById: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + id;
        });
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?id=" + id;
        });
    }
})

//弹出框的确定按钮
var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1,
    ok: function() {
        switch (vmBtn.type) {
            case 'date':
            case 'partTime':
                mui('#pullrefresh').pullRefresh().refresh(true);

                saveStorage();
                vmHotel.getRoomList();
                break;
        }

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})


hid = getParam("id");
if (hid != "") {
    if (isNaN(hid)) {
        location.href = document.referrer || "index.html";
    } else {
        hid = parseInt(hid);
    }
} else {
    location.href = "index.html";
}

myPosition = Storage.getLocal("position");
if (myPosition) {
    myLng = myPosition.lng || "";
    myLat = myPosition.lat || "";
}

bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type || 0;
} else {
    roomType = 0;
    Storage.set("bensue", {type: 0});
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = { day: { filter: [] }, partTime: { filter: [] } };
    Storage.set("newOrder", newOrder);
}

vmHotel.type = roomType;
vmHotel.getHotelDetail();
vmHotel.getRoomList();

vmFilter.type = roomType;
vmFilter.getFilter();

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            contentnomore: "没有更多房间了",
            callback: loadmore
        }
    }
});

//mui 上拉加载
function loadmore() {
    ajaxJsonp({
        url: urls.getRoomList,
        data: {
            hid: hid,
            aids: roomType ? (newOrder.partTime.filter.length>0?newOrder.partTime.filter.join(','):'') 
                : (newOrder.day.filter.length>0?newOrder.day.filter.join(','):''),
            startTime: roomType ? newOrder.partTime.start : newOrder.day.start,
            endTime: roomType ? newOrder.partTime.end : newOrder.day.end,
            isPartTime: roomType,
            lng: myLng,
            lat: myLat,
            pageNo: vmHotel.pageNo,
            pageSize: vmHotel.pageSize
        },
        successCallback: function(json) {
            if(json.status == 1) {
                vmHotel.pageNo++;
                vmHotel.roomList.push.apply(vmHotel.roomList, json.data.list);
                if (vmHotel.pageNo > json.data.pageCount) {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                } else {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                }
            } else {
                console.log(json.message);
            }
        }
    });
}

//保存到本地
function saveStorage() {
    if (roomType) {
        $.extend(newOrder.partTime, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
            filter: vmFilter.$model.selectPartTimeFilter
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(roomType),
            end: getEndTime(roomType),
            filter: vmFilter.$model.selectDayFilter
        });
    }

    Storage.set("newOrder", newOrder);
}
