var user, newOrder, bensue, actionType,
    myMarker, mapObj, geolocation,
    swiper1, swiper2,
    isSuccess = false,
    hotelMarkersOnMap = [],
    positionInStorage = Storage.getLocal("position"),
    clockObj = {};

var vmTop = avalon.define({
    $id: 'top',
    headImg: 'img/defaultHeadImg.png', //左上角头像
    isShowMap: true,
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
    goBack: function() {
        history.go(-1);
    },
    openPop: function() {
        stopSwipeSkip.do(function() {
            modalShow('./util/searchLocation.html', 1);
        })
    },
});

var vmSearch = avalon.define({
    $id: 'search',
    city: '上海',
    currentLocation: '正在定位...',
    getCurrentPosition: function() {
        vmSearch.currentLocation = '正在定位...';
        geolocation.getCurrentPosition();
    },
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        })
    }
});

var vmBottom = avalon.define({
    $id: 'bottom',
    type: 0,
    getNightDiscount: function() {
        ajaxJsonp({
            url: urls.getNightDiscount,
            successCallback: function(json) {
                if (json.status == 1) {
                }
            }
        });
    },
    getRoomPartTimeRange: function() {
        ajaxJsonp({
            url: urls.getRoomPartTimeRange,
            successCallback: function(json) {
                if (json.status == 1) {
                }
            }
        });
    },
    midnightDiscountList: [{discount: 0.3}, {discount: 0.4}, {discount: 0.5}, {discount: 0.6}],
    getMidnightDiscount: function() {
        ajaxJsonp({
            url: urls.getMidnightDiscount,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmBottom.midnightDiscountList = json.data;
                }
            }
        });
    },
    midnightBannerShowTime: 0,
    selectType: function(type) {
        vmCity.type = type;
        vmBottom.type = type;
        Storage.set("bensue", { type: type });

        vmCity.getHotelPosition(mapObj);
        vmCity.getCityGallery();

        //午夜特价时显示介绍弹窗
        if (type == 2 && vmBottom.midnightBannerShowTime == 0) {
            popover('../util/midnightBanner.html', 1, function() {
                vmBottom.midnightBannerShowTime++;
            });
        }
    },
    midnightDiscount: 0.3,
    selectMidnightDiscount: function(d) {
        bensue.midnightDiscount = d;
        Storage.set('bensue', bensue);

        vmBottom.midnightDiscount = d;
        vmCity.getHotelPosition(mapObj);

        vmBottom.su();
    },
    su: function() {
        //向上
        $('#hotelList').css('padding-bottom', '140px');
        $('#functionBtns').css('bottom', '155px');
        $('#bottomTab').css('display','block');
        $('.bs-index-bottom-tab').css('display','flex');
    },
    sd: function() {
        if(!vmCity.isShowMap) {
            //向下滑
            $('#hotelList').css('padding-bottom', '40px');
            $('#functionBtns').css('bottom', '55px');
            $('#bottomTab').css('display','none');
            $('.bs-index-bottom-tab').css('display','none');
        }
    },
});

var vmCity = avalon.define({
    $id: 'city',
    lng: 121.749, //用户选择位置的经度
    lat: 31.0469, //用户选择位置的维度
    su: function() {
        //列表模式页面向上滑
        if(!vmCity.isShowMap) {
            vmTop.su();
        }
    },
    sd: function() {
        //列表模式页面向上滑
        if(!vmCity.isShowMap) {
            vmTop.sd();
            vmBottom.sd();
        }
    },
    isShowMap: true,
    showMap: function() {
        vmCity.isShowMap = true;

        myMarker.setPosition([vmCity.lng, vmCity.lat]);

        //自动调整显示所有的点
        setTimeout(function() {
            mapObj.setFitView();
        }, 500);
        //marker.setMap(mapObj);
    },
    toggleMap: function() { //切换地图模式和列表模式
        stopSwipeSkip.do(function() {
            vmCity.isShowMap = !vmCity.isShowMap;
            vmTop.isShowMap = vmCity.isShowMap;
            vmCity.isSort = 0;
            if(vmCity.isShowMap) {
                vmTop.sd();
                vmBottom.su();
            } else {
                //列表模式不现实酒店详情轮播
                vmCity.isShowHotelDetail = false;
            }
        });
    },
    type: 0,
    openTimePanel: function() {
        stopSwipeSkip.do(function() {

            vmBtn.useCheck = 1;
            if (vmCity.type == 0) {
                vmBtn.type = 'date';
                modalShow('./util/calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 230);
                    
                    if(vmCalendar.startIndex > 0) {
                        $('#calendarPanel').scrollTop(vmCalendar.startIndex / 7 * 25);
                    }
                    //初始状态打开`入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }

                    clockObj = clock();
                });
            } else {
                vmBtn.type = 'partTime';
                popover('./util/partTime.html', 1, function() {
                    $('.select-time').height($(window).height() - 150);
                    loadSessionPartTime();
                });
            }
        });
    },
    hotelMarkers: [],
    selectedHid: 0,
    isShowHotelDetail: false,
    swiper1Render: function() {
        //先销毁老的 再实例化新的
        if (swiper1) {
            swiper1.destroy();
        }
        swiper1 = new Swiper('.swiper1', {
            slidesPerView: 1,
            width: window.innerWidth - 30,
            spaceBetween: 10,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            onSlideChangeEnd: function(swiper) {
                var marker = hotelMarkersOnMap[swiper.activeIndex];
                marker.getMap().setCenter(marker.getPosition());
                vmCity.selectedHid = marker.getExtData().hid;
                setMarkers();
            }
        });
    },
    goHotel: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "hotel.html?id=" + id;
        })
    },
    // sort: 1, //1按距离，2按价格   原始的
    // changeSort: function(type) {
    //     stopSwipeSkip.do(function() {
    //         vmCity.sort = type;
    //         ajaxJsonp({
    //             url: urls.getHotelByPosition,
    //             data: {
    //                 lng: vmCity.lng,
    //                 lat: vmCity.lat,
    //                 isPartTime: vmCity.type,
    //                 discount: vmBottom.midnightDiscount,
    //                 distance: 100000,
    //                 sort: vmCity.sort,
    //                 pageCount: 20,
    //             },
    //             successCallback: function(json) {
    //                 if (json.status == 1) {
    //                     vmCity.hotelMarkers = json.data;
    //                 }
    //             }
    //         });
    //     });
    // },
    sort: 1, //1高到低，2低到高   3近到远    为2.0-demo而生的
    changeSort: function(type) {
        stopSwipeSkip.do(function() {
            vmCity.sort = type;
            ajaxJsonp({
                url: urls.getHotelByPosition,
                data: {
                    lng: vmCity.lng,
                    lat: vmCity.lat,
                    isPartTime: vmCity.type,
                    discount: vmBottom.midnightDiscount,
                    distance: 100000,
                    sort: vmCity.sort,
                    pageCount: 20,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmCity.hotelMarkers = json.data;
                    }
                }
            });
        });
    },
    isSort: 0,  //默认不展开  1-展开
    goSort: function() {
        stopSwipeSkip.do(function() {
            if (vmCity.isSort==1) {
                vmCity.isSort = 0;
            } else {
                vmCity.isSort = 1;
            }
        });
    },
    getHotelPosition: function(mapObj) {
        mapObj.remove(hotelMarkersOnMap);
        hotelMarkersOnMap = [];

        //获取酒店定位
        ajaxJsonp({
            url: urls.getHotelByPosition,
            data: {
                lng: vmCity.lng,
                lat: vmCity.lat,
                isPartTime: vmCity.type,
                discount: vmBottom.midnightDiscount,
                distance: 100000,
                sort: vmCity.sort,
                pageCount: 20,
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmCity.hotelMarkers = json.data;

                    json.data.map(function(marker, index) {
                        var domMarker = createMarker(marker.id, marker.minPrice);

                        var marker = new AMap.Marker({
                            map: mapObj,
                            // icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                            position: [marker.lng, marker.lat],
                            offset: new AMap.Pixel(-34, -46),
                            content: domMarker,
                            extData: { hid: marker.id, minPrice: marker.minPrice }
                        }).on('click', function() {
                            vmCity.selectedHid = this.getExtData().hid;
                            vmCity.isShowHotelDetail = true;

                            //点击酒店，在地图里居中
                            this.getMap().setCenter(this.getPosition());

                            setMarkers();
                            swiper1.slideTo(index);
                        });

                        hotelMarkersOnMap.push(marker);
                    });
                }
            }
        });
    },
    galleryList: [{ imgUrl: '' }], //城市图片
    getCityGallery: function() {
        ajaxJsonp({
            url: urls.getCityGallery,
            data: {
                cityCode: '021', //默认上海
                isPartTime: vmCity.type
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    if (json.data.length >= 1) {
                        vmCity.galleryList = json.data;
                    }
                }
            }
        });
    },
    swiper2Render: function() {
        swiper2 = new Swiper('.swiper2', {
            loop: true,
            width: window.innerWidth,
            autoplay: 3000,
        });
    },
    openNav: function(lng, lat, name, address) {
        stopSwipeSkip.do(function() {
            if (isSuccess) {
                wx.openLocation({
                    longitude: lng, // 经度，浮点数，范围为180 ~ -180。
                    latitude: lat, // 纬度，浮点数，范围为90 ~ -90
                    name: name, // 位置名
                    address: address, // 地址详情说明
                    scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: 'bensue.com' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            } else {
                console.log("微信接口配置注册失败，将重新注册");
                registerWeixinConfig();
            }
        });
    },
});

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
                vmCity.getHotelPosition(mapObj);
                break;
            default:
                break;
        }

        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

bensue = Storage.get("bensue");
if (bensue && bensue.type) {
    vmBottom.type = bensue.type;
    vmCity.type = bensue.type;

    if (bensue.type == 2) {
        vmBottom.midnightDiscount = bensue.midnightDiscount || vmBottom.midnightDiscountList[0].discount;
    }
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

    // if (user.openUserInfo) {
    //     vmSide.show();
    // }
}

//开门或者退房操作，打开面板
actionType = getParam('type');
if (actionType) {
    vmSide.show();
}

//高德地图
mapObj = new AMap.Map('container', {
    zoom: 10,   //默认的事14
    //center: [121.749, 31.0469] //默认地图中心
    center: [121.340, 31.300] //默认地图中心
}).on('click', function() {
    iniMarkers();
});
// }).on('touchmove',function() {
//     iniMarkers();
        //会影响安卓机的marker点击区域
// });

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

vmBottom.getMidnightDiscount();
vmCity.getHotelPosition(mapObj);
vmCity.getCityGallery();
registerWeixinConfig();

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
    vmCity.position = positionInStorage.name;
    vmCity.lng = positionInStorage.lng;
    vmCity.lat = positionInStorage.lat;
}

//保存到本地
function saveStorage() {
    if (vmCity.type) {
        $.extend(newOrder.partTime, {
            start: getStartTime(vmCity.type),
            end: getEndTime(vmCity.type),
        });
    } else {
        $.extend(newOrder.day, {
            start: getStartTime(vmCity.type),
            end: getEndTime(vmCity.type),
        });
    }

    Storage.set("newOrder", newOrder);
}

//遍历高德的点标注
//高亮新选择的点，取消上一次高亮的点
function setMarkers() {
    hotelMarkersOnMap.map(function(markerOnMap) {
        //重新构建 markerDom
        var domMarkerOnMap = createMarker(markerOnMap.getExtData().hid, markerOnMap.getExtData().minPrice);
        markerOnMap.setContent(domMarkerOnMap);
    });
}

//设置某个 Maker 的 content
function createMarker(hid, price) {
    var domMarker = document.createElement('div');
    domMarker.className = 'bs-marker';

    var domMarkerPrice = document.createElement('div');
    if (hid != vmCity.selectedHid) {
        domMarkerPrice.className = 'bs-marker-price';
    } else {
        domMarkerPrice.className = 'bs-marker-price selected';
    }
    domMarkerPrice.innerHTML = '¥' + price;
    domMarker.appendChild(domMarkerPrice);

    var domMarkerPoint = document.createElement('div');
    domMarkerPoint.className = 'bs-marker-point';
    domMarker.appendChild(domMarkerPoint);

    return domMarker;
}

function iniMarkers() {
    vmCity.isShowHotelDetail = false;
    vmCity.selectedHid = 0;
    setMarkers();
}

