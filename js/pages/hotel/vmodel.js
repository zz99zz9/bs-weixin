var hid, 
    roomType = 0, 
    midnightDiscount = 1,
    myPosition, myLng, myLat,
    bensue, roomType, newOrder,
    isexpand = false,
    isSuccess = false,
    clockObj = null;

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

myPosition = Storage.get("position");
if (myPosition) {
    myLng = myPosition.center.lng || "";
    myLat = myPosition.center.lat || "";
}

bensue = Storage.get("bensue");
if (bensue) {
    roomType = bensue.type;

    // if (bensue.type == 2) {
    //     midnightDiscount = bensue.midnightDiscount;
    // }
} else {
    //第一次加载
    roomType = 0;
    Storage.set("bensue", { type: 0 });
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = {
        day: {
            start: '',
            end: ''
        },
        partTime: {
            start: '',
            end: ''
        },
    };
    Storage.set("newOrder", newOrder);
}

var vmTop = avalon.define({
    $id: 'top',
    headImg: 'img/defaultHeadImg.png', //左上角头像
    type: 0,
    selectType: function(type) {
        stopSwipeSkip.do(function() {
            roomType = type;
            vmTop.type = type;
            vmHotel.type = type;
            Storage.set("bensue", { type: type });

            vmHotel.getHotelDetail();
            vmHotel.getRoomTypeList();

            // mui('#pullrefresh').pullRefresh().refresh(true);
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
            //隐藏广告栏
            $('#midnight').hide();
            //调整顶部导航的高度
            $('#header-nav').css('height', '48px');
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
});

var vmHotel = avalon.define({
    $id: 'hotel',
    type: roomType, //0 全天房, 1 时租房
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
    serviceList: [],
    amenityList: [],
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 1;
            if (vmHotel.type == 0) {
                vmBtn.type = 'date';
            } else {
                vmBtn.type = 'partTime';
                // modalShow('./util/partTime.html', 1, function() {
                //     $('.select-time').height($(window).height() - 150);
                //     loadSessionPartTime();
                // });

            }

            modalShow('./util/calendar.html', 1, function() {
                vmCalendar.iniCalendarModal();
            });
        });
    },
    getHotelDetail: function() {
        ajaxJsonp({
            url: urls.getHotelDetail,
            data: {
                hid: hid,
                lng: myLng,
                lat: myLat,
                isPartTime: vmHotel.type
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

                    if (json.data.distance > 0) {
                        vmHotel.distance = round(json.data.distance / 1000, 2);
                    }
                    //顶部轮播导入图片数据
                    vmHotel.galleryList = json.data.hotelGalleryList;
                    //房型数量
                    vmHotel.surplusList = json.data.surplusList;
                    // //酒店特色
                    vmHotel.serviceList = json.data.serviceList;
                    vmHotel.amenityList = json.data.amenityList;
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
    openIntroduction: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelIntroduction.html', 1);
        });
    },
    openFeature: function() {
        stopSwipeSkip.do(function() {
            vmBtn.useCheck = 0;
            popover('./util/hotelFeature.html', 1);
        });
    },
    /*
     * 评价相关
     */
    assessCount: 0,
    score: { score1: 5, score2: 5, score3: 5, totalScore: 5 },
    assessList: [],
    assessPageNo: 1,
    assessPageSize: 8,
    getAssess: function() {
        ajaxJsonp({
            url: urls.getRoomAssess,
            data: {
                hid: 1,
                pageNo: vmHotel.assessPageNo,
                pageSize: vmHotel.assessPageSize
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    if (json.data.list.length > 0) {
                        if (json.data.pageCount > 1) {
                            vmHotel.isShowLoadMoreBtn = true;
                        }
                        json.data.list.map(function(o) {
                            o.s = round((o.score1 + o.score2 + o.score3) / 3, 1);
                        });

                        vmHotel.score = json.data.score;
                        vmHotel.assessCount = json.data.count;
                        vmHotel.assessList = json.data.list;
                        vmHotel.assessPageNo = 2;
                    }
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
    isShowLoadMoreBtn: false,
    loadMore: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.getRoomAssess,
                data: { hid: 1, pageNo: vmHotel.assessPageNo, pageSize: vmHotel.assessPageSize },
                successCallback: function(json) {
                    if (json.status === 1) {
                        vmHotel.assessPageNo++;
                        json.data.list.map(function(o) {
                            o.s = round((o.score1 + o.score2 + o.score3) / 3, 1);
                        });

                        vmHotel.assessList.push.apply(vmHotel.assessList, json.data.list);
                        if (vmHotel.assessPageNo > json.data.pageCount) {
                            vmHotel.isShowLoadMoreBtn = false;
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
                    infoUrl: 'bensue.com' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                console.log("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
    midnightDiscount: 1,
    roomTypeList: [],
    tid: '', //房间类型，默认为全部
    getRoomTypeList: function() {
        ajaxJsonp({
            url: urls.getRoomTypeList,
            data: {
                // startTime: vmHotel.type ? newOrder.partTime.start : (newOrder.day.start == getToday('date') ? getToday() : newOrder.day.start),
                // endTime: vmHotel.type ? newOrder.partTime.end : newOrder.day.end,
                startTime: "2017-05-08",
                endTime: "2017-05-11",
                hid: hid,
                isPartTime: vmHotel.type,
                discount: midnightDiscount
            },
            successCallback: function(json) {
                if (json.status == 1) {

                    vmHotel.roomTypeList = [];
                    json.data.map(function(o) {
                        if(o.minPrice) {
                            vmHotel.roomTypeList.push(o);

                        }
                    });
                }
            }
        });
    },
    pageNo: 1,
    pageSize: 6,
    roomList: [],
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
            // location.href = "hotel.html?id=" + id;
            location.href = "index.html";
        });
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?hid=" + hid + "&tid=" + id;
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
                //vmCalendar.startClick();
            case 'partTime':
                // mui('#pullrefresh').pullRefresh().refresh(true);
                
                newOrder.partTime.startShow = vmPart.partTimeStart;
                newOrder.partTime.endShow = vmPart.partTimeEnd;
                newOrder.partTime.amount = vmPart.partTimeNumber / 2;
                Storage.set("newOrder", newOrder);
                saveStorage();
                vmHotel.getRoomTypeList();
                break;
            case 'roomType':
                // mui('#pullrefresh').pullRefresh().refresh(true);
                saveStorage();
                vmHotel.getRoomTypeList();
                break;
        }

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmHotel.type = roomType;

registerWeixinConfig();

//获得用户的位置
// wx.ready(function() {
//     wx.getLocation({
//         type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//         success: function(res) {
//             console.log(res);
//             myLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//             myLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//             vmHotel.getHotelDetail();

//             Storage.setLocal("position", {
//                 lat: myLat,
//                 lng: myLng
//             });
//         }
//     });
// });

vmHotel.getHotelDetail();
vmHotel.getAssess();
vmHotel.getRoomTypeList();

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

//下拉刷新
function reload() {
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
    mui('#pullrefresh').pullRefresh().refresh(true);
}

//保存到本地
function saveStorage() {
    if (vmHotel.type) {
        $.extend(newOrder.partTime, {
            start: getStartTime(vmHotel.type),
            end: getEndTime(vmHotel.type)
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(vmHotel.type),
            end: getEndTime(vmHotel.type)
        });
    }
    Storage.set("newOrder", newOrder);
}

vmHotel.$watch('type', function(a) {
    vmHotel.getHotelDetail();
    vmHotel.getRoomTypeList();

    bensue.type = a;
});
