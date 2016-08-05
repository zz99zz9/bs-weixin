var newOrder, bensue, myMarker, mapObj, geolocation,
    positionInStorage = Storage.getLocal("position"),
    user = Storage.getLocal("user");;

var vmIndex = avalon.define({
    $id: 'index',
    headImg: 'img/icon1.jpg', //左上角头像
    galleryList: [
        { imgUrl: './img/tour1.jpg' },
        { imgUrl: './img/tour2.jpg' },
        { imgUrl: './img/tour3.jpg' },
    ],
    getCityGallery: function() {
        ajaxJsonp({
            url: urls.getCityGallery,
            data: {
                cityCode: '021' //默认上海
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmIndex.galleryList = json.data;
                }
            }
        });
    },
    hotelMarkers: [],
    getHotelPosition: function(mapObj) {
        //获取酒店定位
        ajaxJsonp({
            url: urls.getHotelByPosition,
            data: {
                lng: vmIndex.lng,
                lat: vmIndex.lat,
                distance: 10000000
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    json.data.map(function(o) {
                        vmIndex.hotelMarkers.push({
                            hid: o.id,
                            name: o.name,
                            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                            position: [o.lng, o.lat],
                            roomCount: o.roomCount,
                        })
                    });

                    vmIndex.$model.hotelMarkers.forEach(function(marker) {
                        new AMap.Marker({
                            hid: marker.hid,
                            map: mapObj,
                            icon: marker.icon,
                            position: [marker.position[0], marker.position[1]],
                            offset: new AMap.Pixel(-12, -36)
                        }).on('click', function() {
                            Storage.set("bensue", { type: vmIndex.type });
                            for(var i in this){
                                if( typeof this[i] !== 'function') {
                                    for(var j in this[i]) {
                                        if(j=='hid') {
                                            location.href = "hotel.html?id=" + this[i][j];
                                            return;
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            }
        });
    },
    type: 0, //0 全天房, 1 夜房
    selectType: function(type) {
        stopSwipeSkip.do(function() {
            vmIndex.type = type;
            vmFilter.type = type;
            Storage.set("bensue", { type: type });
            updateData();
        });
    },
    lng: 121.626131, //用户选择位置的经度
    lat: 31.210465, //用户选择位置的维度
    position: '正在定位...',
    openLocationSearch: function() {
        stopSwipeSkip.do(function() {
            popover('./util/searchLocation.html', 1, function() {
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
    isShowMap: false,
    showMap: function() {
        vmIndex.isShowMap = true;
        console.log([vmIndex.lng, vmIndex.lat]);
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
    openTimePanel: function() {
        stopSwipeSkip.do(function() {
            if (vmIndex.type == 0) {
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
    //最近浏览
    isShowSeen: false,
    seenList: [],
    getRecentViewRoomList: function() {
        ajaxJsonp({
            url: urls.getRecentViewLog,
            data: {
                lng: vmIndex.lng,
                lat: vmIndex.lat,
                isPartTime: vmIndex.type
            },
            successCallback: function(json) {
                if (json.status !== 0 && json.data && json.data.count > 0) {
                    vmIndex.isShowSeen = true;
                    vmIndex.seenList = json.data.list;
                } else {
                    vmIndex.isShowSeen = false;
                    vmIndex.seenList = [];
                }
            }
        });
    },
    //房间列表
    pageNo: 1,
    pageSize: 6,
    roomList: [],
    getRoomList: function() {
        ajaxJsonp({
            url: urls.getRoomList,
            data: {
                isPartTime: vmIndex.type,
                aids: vmIndex.type ? newOrder.partTime.filter.join(',') : newOrder.day.filter.join(','),
                startTime: vmIndex.type ? newOrder.partTime.start : newOrder.day.start,
                endTime: vmIndex.type ? newOrder.partTime.end : newOrder.day.end,
                lng: vmIndex.lng,
                lat: vmIndex.lat,
                sort: vmIndex.sort,
                pageNo: 1,
                pageSize: vmIndex.pageSize
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmIndex.pageNo = 2;
                    vmIndex.roomList = json.data.list;
                }
            }
        });
    },
    sort: 1, //1 按距离排序, 2按价格排序
    sortBy: function(type) {
        stopSwipeSkip.do(function() {
            if (vmIndex.sort != type) {
                vmIndex.sort = type;
                vmIndex.pageNo = 1;
                vmIndex.getRoomList();
            }
        });
    },
    goHotelById: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + id;
        });
    },
    goRoom: function(id) {
        stopSwipeSkip.do(function() {
            Storage.set("bensue", { type: vmIndex.type });
            location.href = "room.html?id=" + id;
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
});

//地址搜索栏
var vmSearch = avalon.define({
    $id: 'search',
    city: '上海',
    currentLocation: '正在定位...',
    getCurrentPosition: function() {
        vmSearch.currentLocation = '正在定位...';
        geolocation.getCurrentPosition();
    }
});

//弹出框的确定按钮
var vmBtn = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    ok: function() {
        switch (vmBtn.type) {
            case 'date':
            case 'partTime':
                saveStorage();
                vmIndex.getRoomList();
                break;
        }

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

bensue = Storage.get("bensue");
if (bensue && bensue.type) {
    vmIndex.type = bensue.type;
    vmFilter.type = bensue.type;
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = {
        day: { start: '', end: '', filter: [] },
        partTime: { start: '', end: '', filter: [] }
    };
    Storage.set("newOrder", newOrder);
}

//更换登录用户头像
if (user && user.headImg && user.logState) {
    vmIndex.headImg = urlAPINet + '/' + user.headImg;
}

//高德地图
mapObj = new AMap.Map('container', {
    zoom: 13,
    center: [121.626131, 31.210465] //默认地图中心
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

//用户选择的地址，标记上点，可以使用 mapObj.setFitView()
//使用透明的图片
myMarker = new AMap.Marker({
    map: mapObj,
    icon: "./img/transparent.png",
    position: [121.626131, 31.210465],
    offset: new AMap.Pixel(-12, -36)
});

//获取地址
if (verify(positionInStorage)) {
    //如果本地储存的地址有效，直接使用本地数据更新列表
    updateData();
} else {
    geolocation.getCurrentPosition();
}

vmIndex.getHotelPosition(mapObj);
//获取便利设施
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
            isPartTime: vmIndex.type,
            aids: vmIndex.type ? newOrder.partTime.filter.join(',') : newOrder.day.filter.join(','),
            startTime: vmIndex.type ? newOrder.partTime.start : newOrder.day.start,
            endTime: vmIndex.type ? newOrder.partTime.end : newOrder.day.end,
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
    //获取最近浏览数据
    vmIndex.getRecentViewRoomList();
    vmSearch.currentLocation = vmIndex.position;
}

//保存到本地
function saveStorage() {
    if (vmIndex.type) {
        $.extend(newOrder.partTime, {
            start: getStartTime(vmIndex.type),
            end: getEndTime(vmIndex.type),
            filter: vmFilter.$model.selectPartTimeFilter
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(vmIndex.type),
            end: getEndTime(vmIndex.type),
            filter: vmFilter.$model.selectDayFilter
        });
    }

    Storage.set("newOrder", newOrder);
}
