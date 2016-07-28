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

var positionInStorage = Storage.getLocal("position"),
    myMarker,
    hotelMarkers = [
        {
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.601989, 31.204213]
        }, {
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.5025, 31.237015]
        }, {
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.5625, 31.137015]
        }, {
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.3025, 31.187015]
        }
    ];

var vmIndex = avalon.define({
    $id: 'index',
    galleryList: [{
        imgUrl: './img/tour1.jpg'
    }, {
        imgUrl: './img/tour2.jpg'
    }, {
        imgUrl: './img/tour3.jpg'
    }, ],
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
    sort: 1, //1 按距离排序, 2按价格排序
    sortBy: function(type) {
        if (vmIndex.sort != type) {
            vmIndex.sort = type;
            vmIndex.pageNo = 1;
            vmIndex.getRoomList();
        }
    },
    type: 0, //0 全天房, 1 夜房
    selectType: function(type) {
        stopSwipeSkip.do(function() {
            vmIndex.type = type;
            vmFilter.type = type;
        });
    },
    lng: 0,
    lat: 0,
    position: '正在定位...',
    openLocationSearch: function() {
        stopSwipeSkip.do(function() {
            popover('./searchLocation.html', 1, function() {
                //高德自动提示
                AMap.plugin('AMap.Autocomplete', function() { //回调函数
                    //实例化Autocomplete
                    var autoOptions = {
                        city: "021", //城市
                        input: "tipinput" //使用联想输入的input的id
                    };
                    autocomplete = new AMap.Autocomplete(autoOptions);
                    //TODO: 使用autocomplete对象调用相关功能
                    AMap.event.addListener(autocomplete, "select", select); //注册监听，当选中某条记录时会触发
                })
            });
        });
    },
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            console.log(vmIndex.type);
            if(vmIndex.type == 0) {
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
                lng: vmIndex.lng,
                lat: vmIndex.lat,
                sort: vmIndex.sort,
                pageNo: vmIndex.pageNo,
                pageSize: vmIndex.pageSize
            },
            successCallback: function(json) {
                vmIndex.pageNo = 2;
                vmIndex.roomList = json.data.list;
            }
        });
    },
    isShowMap: false,
    showMap: function() {
        vmIndex.isShowMap = true;
        myMarker.setPosition([vmIndex.lng, vmIndex.lat]);

        //自动调整显示所有的点
        setTimeout(function() {
            mapObj.setFitView();
        }, 500);
        //marker.setMap(mapObj);
    },
    closeMap: function() {
        vmIndex.isShowMap = false;
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "room.html?id=" + id;
        });
    },

    //最近浏览
    isShow: false,
    seenList: [],
    getRecentViewRoomList: function() {
        ajaxJsonp({
            url: urls.getRecentViewLog,
            data: {},
            successCallback: function(json) {
                if (json.status !== 0) {
                    vmIndex.isShow = true;
                    vmIndex.seenList = json.data.list;
                } else {
                    vmIndex.isShow = false;
                    vmIndex.seenList = [];
                }
            }
        });

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
    openNav: function(lat, lng, name, addr) {
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

    },
    clickA: function(str) {
        var html = "<img src=" + urlAPINet + str.imgUrl + ">" + "<p>" + str.content + "</p>";
        popover(html, 2);
    },
});
var isSuccess = false;

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
                // wx.ready(function (){
                //   wx.checkJsApi({
                //      jsApiList: [
                //      'openLocation',
                //      'getLocation',
                //      'checkJsApi',
                //      'chooseImage',
                //      'previewImage',
                //      'uploadImage',
                //      'downloadImage'
                //     ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                //      success: function(res) {
                //          alert("注册成功");
                //          isSuccess = true;
                //      }
                //     });
                // });
            }
        }
    });
}

//vmIndex.getRecommendList();

registerWeixinConfig();

var vmSearch = avalon.define({
    $id: 'search',
    city: '上海',
    currentLocation: '正在定位...',
    getCurrentPosition: function() {
        vmSearch.currentLocation = '正在定位...';
        geolocation.getCurrentPosition();
    }
});

var mapObj, geolocation;

mapObj = new AMap.Map('container', {
    zoom: 13,
    center: [121.626131, 31.210465]
});
mapObj.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);
    //geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
});

myMarker = new AMap.Marker({
    map: mapObj,
    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
    position: [121.626131, 31.210465],
    offset: new AMap.Pixel(-12, -36)
});
hotelMarkers.forEach(function(marker) {
    new AMap.Marker({
        map: mapObj,
        icon: marker.icon,
        position: [marker.position[0], marker.position[1]],
        offset: new AMap.Pixel(-12, -36)
    });
});

if (verify(positionInStorage)) {
    //如果本地储存的地址有效，直接使用本地数据更新列表
    updateData();
} else {
    geolocation.getCurrentPosition();
}
//获取最近浏览数据
vmIndex.getRecentViewRoomList();

//解析定位结果，逆向地理编码
function onComplete(data) {

    positionInStorage.lng = data.position.getLng();
    positionInStorage.lat = data.position.getLat();

    //步骤二：通过AMap.service加载检索服务，加载的服务可以包括服务插件列表中一个或多个
    AMap.service(["AMap.Geocoder"], function() { //加载地理编码
        geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        //步骤三：通过服务对应的方法回调服务返回结果，本例中通过逆地理编码方法getAddress回调结果
        geocoder.getAddress(new AMap.LngLat(positionInStorage.lng, positionInStorage.lat), function(status, result) {
            //根据服务请求状态处理返回结果
            if (status == 'error') {
                alert("服务请求出错啦！ ");
            }
            if (status == 'no_data') {
                alert("无数据返回，请换个关键字试试～～");
            } else {
                //判断得到地址是否和之前保存的一致，不一致就更新相关数据
                if (positionInStorage.name != result.regeocode.pois[0].name) {
                    updateLocal(result.regeocode.pois[0].name, result.regeocode.pois[0].location.getLng(), result.regeocode.pois[0].location.getLat())
                    updateData();
                } else {
                    vmSearch.currentLocation = positionInStorage.name;
                }
            }
        });
    });
}

//解析定位错误信息
function onError(data) {
    console.log(data.info);
}

//选中地址
function select(e) {
    updateLocal(e.poi.name, e.poi.location.lng, e.poi.location.lat);
    updateData();

    $('.popover').addClass('popover-hide');
    popover_ishide = true;
}

//弹出框的确定按钮
var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

function verify(position) {
    if (position) {
        if (position.lng && position.lat) {
            myMarker.setPosition([position.lng, position.lat]);
            return true;
        } else {
            positionInStorage.lng = 0;
            positionInStorage.lat = 0;
            return false;
        }
    } else {
        positionInStorage = { name: '', lng: 0, lat: 0 };
        return false;
    }
}

function updateLocal(name, lng, lat) {
    myMarker.setPosition([lng, lat]);

    positionInStorage.name = name;
    positionInStorage.lng = lng;
    positionInStorage.lat = lat;

    Storage.setLocal("position", positionInStorage);
}

function updateData() {
    vmIndex.position = positionInStorage.name;
    vmIndex.lng = positionInStorage.lng;
    vmIndex.lat = positionInStorage.lat;
    vmIndex.pageNo = 1;
    vmIndex.getRoomList();

    vmSearch.currentLocation = vmIndex.position;
}

//mui 上拉加载
function loadmore() {
    ajaxJsonp({
        url: urls.getRoomList,
        data: {
            lng: vmIndex.lng,
            lat: vmIndex.lat,
            sort: vmIndex.sort,
            pageNo: vmIndex.pageNo,
            pageSize: vmIndex.pageSize
        },
        successCallback: function(json) {
            if (json.data.count + json.data.pageSize > (vmIndex.pageNo * json.data.pageSize) && json.data.list.length > 0) {
                vmIndex.pageNo++;
                vmIndex.roomList.push.apply(vmIndex.roomList, json.data.list);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
            } else {
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
            }
        }
    });
}

//更多筛选
var vmFilter = avalon.define({
    $id: 'filter',
    type: 0,
    dayFilter: [
        { "id":1, "name":"浴缸" },
        { "id":2, "name":"淋浴" },
        { "id":3, "name":"影院" },
        { "id":4, "name":"阳光" },
        { "id":5, "name":"朝南" },
    ],
    selectDayFilter: [],
    partTimeFilter: [
        { "id":1, "name":"浴缸" },
        { "id":2, "name":"淋浴" },
        { "id":3, "name":"影院" },
    ],
    selectPartTimeFilter: [],
}) 