var hid,
    myPosition, myLng, myLat,
    bensue, roomType, newOrder,
    isexpand = false,
    isSuccess = false,
    user = Storage.getLocal("user");

var vmHotel = avalon.define({
    $id: 'hotel',
    type: 0, //0 全天房, 1 夜房
    //导航相关
    headImg: 'img/defaultHeadImg.png', //左上角头像
    selectType: function(type) {
        stopSwipeSkip.do(function() {
            roomType = type;
            vmHotel.type = type;
            vmFilter.type = type;
            Storage.set("bensue", { type: type });
            vmHotel.getRoomList();

            mui('#pullrefresh').pullRefresh().refresh(true);
        });
    },
    selectRoomType: function(id) {
        stopSwipeSkip.do(function() {
            vmHotel.tid = id;
            vmHotel.getRoomList();
            mui('#pullrefresh').pullRefresh().refresh(true);
        });  
    },
    goDiscover: function() {
        stopSwipeSkip.do(function() {
            location.href = "discover.html";
        });
    },
    goMidnight: function() {
        stopSwipeSkip.do(function() {
            location.href = "special.html";
        });
    },
    closeMidnight: function() {
        event.stopPropagation();
        stopSwipeSkip.do(function() {
            $('#midnight').hide();
        });
    },
    su: function() {
        //页面向上滑
        $('header').slideUp();
    },
    sd: function() {
        //向下滑
        $('header').slideDown();
    },
    alias: '',
    name: '',
    tel: '',
    address: '',
    introduction: '',
    circTraffic: '',
    lng: '',
    lat: '',
    distance: '',
    surplusList: [],
    galleryList: [],
    featureList: [],
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 1;
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
                    $('.select-time').height($(window).height() - 270);
                    loadSessionPartTime();
                });
            }
        });
    },
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
                    vmHotel.tel = json.data.telephone;
                    vmHotel.address = json.data.address;
                    vmHotel.introduction = json.data.introduction;
                    vmHotel.circTraffic = json.data.circTraffic;
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
    // openFeature: function(str) {
    //     stopSwipeSkip.do(function() {
    //         var html = "<img src=" + urlAPINet + str.imgUrl + ">" + "<p>" + str.content + "</p>";
    //         popover(html, 2);
    //     });
    // },
    openIntroduction: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelIntroduction.html', 1);
        });
    },
    serviceList: [],
    getServiceList: function() {
        ajaxJsonp({
            url: urls.hotelService,
            data: { hid: 1 },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmHotel.serviceList = json.data;
                }
            }
        });
    },
    openFeature: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelFeature.html', 1);
        });
    },
    assessCount: 0,
    score: {totalScore: 5},
    assessList: [],
    assessPageNo: 1,
    assessPageSize: 12,
    getAssess: function() {
        ajaxJsonp({
            url: urls.getRoomAssess,
            data: { hid: 1, pageNo: vmHotel.assessPageNo, pageSize: vmHotel.assessPageSize },
            successCallback: function(json) {
                if (json.status === 1) {
                    json.data.list.map(function(o) {
                        o.s = round((o.score1 + o.score2 + o.score3)/3, 1);
                    });

                    vmHotel.score = json.data.score;
                    vmHotel.assessCount = json.data.count;
                    vmHotel.assessList = json.data.list;
                    vmHotel.assessPageNo = 2;
                }
            }
        });
    },
    openAssess: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/assess.html', 1);
        });
    },
    isShowLoadMoreAssessBtn: true,
    loadMoreAssess: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.getRoomAssess,
                data: { hid: 1, pageNo: vmHotel.assessPageNo, pageSize: vmHotel.assessPageSize },
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmHotel.assessPageNo ++;
                        json.data.list.map(function(o) {
                            o.s = round((o.score1 + o.score2 + o.score3)/3, 1);
                        });

                        vmHotel.assessList.push.apply(vmHotel.assessList, json.data.list);
                        if(vmHotel.assessPageNo > json.data.pageCount) {
                            vmHotel.isShowLoadMoreAssessBtn = false;
                        }
                    }
                }
            });
        });
    },
    goShop: function() {
        stopSwipeSkip.do(function() {
            location.href = 'shop.html';
        })
    },
    openNav: function() {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: vmHotel.lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: vmHotel.lng, // 经度，浮点数，范围为180 ~ -180。
                    name: vmHotel.name, // 位置名
                    address: vmHotel.address, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    roomTypeList: [],
    tid: '', //房间类型，默认为全部
    getRoomType: function(){
        ajaxJsonp({
            url: urls.getRoomTypeList,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmHotel.roomTypeList = json.data;
                }
            }
        });
    },
    isShowRoomTypeFilter: false,
    showRoomTypeFilter: function() {
        vmHotel.isShowRoomTypeFilter = true;
    },
    pageNo: 1,
    pageSize: 6,
    roomList: [],
    getRoomList: function() {
        ajaxJsonp({
            url: urls.getRoomList,
            data: {
                hid: hid,
                tid: vmHotel.tid,
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
    swiper3Render: function() {
        var swiper3 = new Swiper('.swiper3', {
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: true,
            slidesPerView: 'auto'
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
    useCheck: 1, //1 checkButton, 0 closeButton
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

hid = 1; //目前只有1家店
// hid = getParam("id");
// if (hid != "") {
//     if (isNaN(hid)) {
//         location.href = document.referrer || "index.html";
//     } else {
//         hid = parseInt(hid);
//     }
// } else {
//     location.href = "index.html";
// }

// myPosition = Storage.getLocal("position");
// if (myPosition) {
//     myLng = myPosition.lng || "";
//     myLat = myPosition.lat || "";
// }

registerWeixinConfig();
//获得用户的位置
wx.ready(function(){
    wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {

            console.log(res);

            myLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            myLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。

            Storage.setLocal("position", {
                lat: mylat,
                lng: myLng
            });
        }
    });
});

bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type || 0;
} else {
    roomType = 0;
    Storage.set("bensue", {
        type: 0
    });
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = {
        day: {
            start: '',
            end: '',
            filter: []
        },
        partTime: {
            start: '',
            end: '',
            filter: []
        }
    };
    Storage.set("newOrder", newOrder);
}

//更换登录用户头像
if (user && user.headImg) {
    vmHotel.headImg = urlAPINet + '/' + user.headImg;
}

vmHotel.type = roomType;

vmHotel.getHotelDetail();
vmHotel.getServiceList();
vmHotel.getAssess();
vmHotel.getRoomType();
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
            tid: vmHotel.tid,
            aids: roomType ? (newOrder.partTime.filter.length > 0 ? newOrder.partTime.filter.join(',') : '') : (newOrder.day.filter.length > 0 ? newOrder.day.filter.join(',') : ''),
            startTime: roomType ? newOrder.partTime.start : newOrder.day.start,
            endTime: roomType ? newOrder.partTime.end : newOrder.day.end,
            isPartTime: roomType,
            lng: myLng,
            lat: myLat,
            pageNo: vmHotel.pageNo,
            pageSize: vmHotel.pageSize
        },
        successCallback: function(json) {
            if (json.status == 1) {
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