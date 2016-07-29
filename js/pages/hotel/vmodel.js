var hid, 
    myPosition, myLng, myLat, 
    bensue, roomType = 0,
    isexpand = false,
    isSuccess = false;

hid = getParam("id");
if(hid != "") {
    if(isNaN(hid)) {
        location.href = document.referrer || "index.html";
    } else {
        hid = parseInt(hid);
    }
} else {
    location.href = "index.html";
}

myPosition = Storage.getLocal("position");
if(myPosition) {
    myLng = myPosition.lng || "";
    myLat = myPosition.lat || "";
}

bensue = Storage.get("bensue");
if(bensue) {
    roomType = bensue.type || 0;
}

var vmHotel = avalon.define({
    $id: 'hotel',
    type: 0,
    alias: '',
    name: '',
    address: '',
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
                if(json.status == 1) {
                    vmHotel.alias = json.data.alias;
                    vmHotel.name = json.data.name;
                    vmHotel.address = json.data.address;
                    vmHotel.lng = json.data.lng;
                    vmHotel.lat = json.data.lat;
                    vmHotel.distance = round(json.data.distance/1000, 2);
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
        stopSwipeSkip.do(function(){
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
    openNav: function(lat, lng, name, addr) {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                    longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                    name: name, // 位置名
                    address: addr, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'ini.xin' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                alert("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
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
            if(roomType == 0) {
                popover('./calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 300);
                    //初始状态打开选择入住时间
                    if(!(vmCalendar.statusControl.isEndEdit||vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }
                });
            } else {
                popover('./partTime.html', 1, function(){
                    $('.select-time').height($(window).height() - 260);

                    select_bar = document.getElementById('select_bar');
                    select_bar.style.width = $('#select_time').width() + 'px';
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
                isPartTime: roomType,
                lng: myLng,
                lat: myLat,
                pageNo: vmHotel.pageNo,
                pageSize: vmHotel.pageSize
            },
            successCallback: function(json) {
                if(json.status == 1) {
                    vmHotel.pageNo = 2;
                    vmHotel.roomList = json.data.list;
                }
            }
        });
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
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

vmHotel.type = roomType;
vmHotel.getHotelDetail();
vmHotel.getRoomList();
registerWeixinConfig();

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
            lng: vmHotel.lng,
            lat: vmHotel.lat,
            pageNo: vmHotel.pageNo,
            pageSize: vmHotel.pageSize
        },
        successCallback: function(json) {
            if (json.data.count + json.data.pageSize > (vmHotel.pageNo * json.data.pageSize) && json.data.list.length > 0) {
                vmHotel.pageNo++;
                vmHotel.roomList.push.apply(vmHotel.roomList, json.data.list);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
            } else {
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
            }
        }
    });
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
