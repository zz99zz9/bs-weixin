var hid, 
    myPosition, myLng, myLat, 
    bensue, roomType = 0,
    isexpand = false;

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
    vmHotel.type = roomType;
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
    expandBtn: function() {
        var h = ($(this).parent())[0].scrollHeight;
        event.preventDefault();
        event.stopPropagation();
        isexpand = !isexpand;
        if (isexpand) {
            $(this).parent().addClass('expanded');
            $(".tdclass").text("收起");
            $(this).parent().css('height', h + 'px')
        } else {
            $(this).parent().removeClass('expanded');
            $(".tdclass").text("展开");
            $(this).parent().css('height', '')
        }
    },
    openNav: function() {
        console.log('打开跟我走');
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
    goRoom: function(rid) {
        stopSwipeSkip.do(function() {
            console.log(rid);
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

vmHotel.getHotelDetail();
vmHotel.getRoomList();

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
