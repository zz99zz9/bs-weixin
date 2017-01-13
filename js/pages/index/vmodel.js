var user, newOrder, bensue, 
    myMarker, mapObj, geolocation,
    swiper1,
    hotelMarkersOnMap = [],
    positionInStorage = Storage.getLocal("position");

var vmTop = avalon.define({
    $id: 'top',
    headImg: 'img/defaultHeadImg.png', //左上角头像
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

var vmBottom = avalon.define({
    $id: 'bottom',
    type: 0,
    selectType: function(type) {
        vmIndex.type = type;
        vmBottom.type = type;
        Storage.set("bensue", { type: type });

        vmIndex.getHotelPosition(mapObj);
    },
    midnightDiscount: 0.3,
    selectMidnightDiscount: function(d) {
        vmBottom.midnightDiscount = d;
        vmIndex.getHotelPosition(mapObj);
    }
});

var vmIndex = avalon.define({
    $id: 'index',
    lng: 121.749, //用户选择位置的经度
    lat: 31.0469, //用户选择位置的维度
    isShowMap: true,
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
    type: 0,
    hotelMarkers: [],
    selectedHid: 0,
    isShowHotelDetail: false,
    swiper1Render: function() {
        //先销毁老的 再实例化新的
        if(swiper1) {
            swiper1.destroy();
        }
        swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth - 30,
            spaceBetween: 10,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 3,
            onSlideChangeEnd: function(swiper) {
                vmIndex.selectedHid = hotelMarkersOnMap[swiper.activeIndex].getExtData().hid;
                setMarkers();
            }
        });
    },
    goHotel: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + id;
        })
    },
    getHotelPosition: function(mapObj) {
        mapObj.remove(hotelMarkersOnMap);

        //获取酒店定位
        ajaxJsonp({
            url: urls.getHotelByPosition,
            data: {
                lng: vmIndex.lng,
                lat: vmIndex.lat,
                isPartTime: vmIndex.type,
                discount: vmBottom.midnightDiscount,
                distance: 100000,
                pageCount: 20
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmIndex.hotelMarkers = json.data;

                    json.data.map(function(marker, index) {
                        var domMarker = createMarker(marker.id);

                        var marker = new AMap.Marker({
                            map: mapObj,
                            // icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                            position: [marker.lng, marker.lat],
                            offset: new AMap.Pixel(-34, -46),
                            content: domMarker,
                            extData: {hid: marker.id}
                        }).on('click', function() {
                            vmIndex.selectedHid = this.getExtData().hid;
                            vmIndex.isShowHotelDetail = true;
                            
                            setMarkers();
                            swiper1.slideTo(index); 
                        });

                        hotelMarkersOnMap.push(marker);
                    });
                }
            }
        });
    },
});

bensue = Storage.get("bensue");
if (bensue && bensue.type) {
    vmBottom.type = bensue.type;
    vmIndex.type = bensue.type;
} else {
    bensue = { type: 0 };
    Storage.set("bensue", bensue);
}

newOrder = Storage.get("newOrder");
if (!newOrder) {
    newOrder = {
        day: { start: '', end: '', filter: [] },
        partTime: { start: '', end: '', filter: [] }
    };
    Storage.set("newOrder", newOrder);
}

user = Storage.getLocal("user");
//更换登录用户头像
if (user) {
    if (user.logState && user.headImg) {
        vmTop.headImg = urlAPINet + user.headImg;
    }

    if (user.openUserInfo) {
        vmSide.show();
    }
}

//高德地图
mapObj = new AMap.Map('container', {
    zoom: 14,
    center: [121.749, 31.0469] //默认地图中心
}).on('click', function() {
    vmIndex.isShowHotelDetail = false;
    vmIndex.selectedHid = 0;
    //遍历高德的点标注
    //高亮新选择的点，取消上一次高亮的点
    hotelMarkersOnMap.map(function(markerOnMap) {
        //重新构建 markerDom
        var domMarkerOnMap = createMarker(markerOnMap.getExtData().hid);
        markerOnMap.setContent(domMarkerOnMap);
    });
});
mapObj.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);

    var isLocated = verify(positionInStorage);
    //获取地址
    if (isLocated) {
        //如果本地储存的地址有效，直接使用本地数据更新列表
        updateData();
    } else {
        geolocation.getCurrentPosition();
    }

    AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
});

//用户选择的地址，标记上点，可以使用 mapObj.setFitView()
//使用透明的图片
myMarker = new AMap.Marker({
    map: mapObj,
    icon: "./img/transparent.png",
    position: [121.749, 31.0469],
    offset: new AMap.Pixel(-12, -36)
});

vmIndex.getHotelPosition(mapObj);

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
                    // vmSearch.currentLocation = positionInStorage.name;
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

//判断position
function verify(position) {

    if (position) {
        if (position.lng && position.lat) {

            if (myMarker) {
                myMarker.setPosition([position.lng, position.lat]);
            } else {
                myMarker = new AMap.Marker({
                    map: mapObj,
                    icon: "./img/transparent.png",
                    position: [121.749, 31.0469],
                    offset: new AMap.Pixel(-12, -36),
                });
                myMarker.setPosition([position.lng, position.lat]);
            }
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
}

//保存到本地
function saveStorage() {
    if (vmIndex.type) {
        $.extend(newOrder.partTime, {
            start: getStartTime(vmIndex.type),
            end: getEndTime(vmIndex.type),
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(vmIndex.type),
            end: getEndTime(vmIndex.type),
        });
    }

    Storage.set("newOrder", newOrder);
}

//遍历高德的点标注
//高亮新选择的点，取消上一次高亮的点
function setMarkers() {
    hotelMarkersOnMap.map(function(markerOnMap) {
        //重新构建 markerDom
        var domMarkerOnMap = createMarker(markerOnMap.getExtData().hid);
        markerOnMap.setContent(domMarkerOnMap);
    });  
}

//设置某个 Maker 的 content
function createMarker(hid) {
    var domMarker = document.createElement('div');
    domMarker.className = 'bs-marker';
    
    var domMarkerPrice = document.createElement('div');
    if(hid != vmIndex.selectedHid) {
        domMarkerPrice.className = 'bs-marker-price';
    } else {
        domMarkerPrice.className = 'bs-marker-price selected';
    }
    domMarkerPrice.innerHTML = '¥300';
    domMarker.appendChild(domMarkerPrice);

    var domMarkerPoint = document.createElement('div');
    domMarkerPoint.className = 'bs-marker-point';
    domMarker.appendChild(domMarkerPoint);

    return domMarker;
}