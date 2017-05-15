// edited by zwh on 2017/05/10
var newOrder, bensue, positionInStorage, 
    myMarker, mapOption, mapObj, geolocation, autocomplete,
    swiper1, swiper2,
    isSuccess = false,
    hotelMarkersOnMap = [],
    clockObj = {};

var vmTop = avalon.define({
    $id: 'top',
    // headImg: 'img/defaultHeadImg.png', //左上角头像
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

var vmCity = avalon.define({
    $id: 'city',
    position: '',
    lng: 121.516546, //接口传参
    lat: 31.217467, //接口传参
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
            // vmBottom.sd();
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
            vmCity.isSort = 0;
            if(vmCity.isShowMap) {
                vmTop.sd();
                // vmBottom.su();
            } else {
                //列表模式不现实酒店详情轮播
                vmCity.isShowHotelDetail = false;
            }
        });
    },
    type: 0,
    openTimePanel: function() {
        //tap会穿透，触发弹窗上的点击事件，换成 click
        // stopSwipeSkip.do(function() {

        modalShow('./util/calendar.html', 1, function() {
            vmCalendar.iniCalendarModal();
        });
        // });
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
            freeMode: false,
            // freeModeSticky: true,
            // freeModeMomentumRatio: 0.4,
            onSlideChangeEnd: function(swiper) {
                var marker = hotelMarkersOnMap[swiper.activeIndex];
                marker.setTop(true);
                // marker.getMap().setCenter(marker.getPosition());
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
    sort: 1, //1高到低，2低到高   3近到远    为2.0-demo而生的
    changeSort: function(type) {
        stopSwipeSkip.do(function() {
            if (type==true) {
                vmCity.sort = 2;
            } else if (type==false) {
                vmCity.sort = 1;
            }
            ajaxJsonp({
                url: urls.getHotelByPosition,
                data: {
                    lng: vmCity.lng,
                    lat: vmCity.lat,
                    isPartTime: vmCity.type,
                    // discount: vmBottom.midnightDiscount,
                    distance: 100000,
                    sort: vmCity.sort,
                    pageCount: 20,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        vmCity.hotelMarkers = json.data.list;
                    }
                }
            });
        });
    },
    isSort: 0,  //0-低到高  true-高到低
    goSort: function() {
        stopSwipeSkip.do(function() {
            vmCity.isSort = !vmCity.isSort;
            vmCity.changeSort(vmCity.isSort);
        });
    },
    getHotelPositionUrl: function() {
        switch(positionInStorage.mode.value) {
            case positionInStorage.mode.city: 
                return urls.getHotelByCity;
            case positionInStorage.mode.center:
            case positionInStorage.mode.nearby:
                return urls.getHotelByPosition;
        }
    },
    getHotelPosition: function(mapObj) {
        mapObj.remove(hotelMarkersOnMap);
        hotelMarkersOnMap = [];

        //获取酒店定位
        ajaxJsonp({
            url: vmCity.getHotelPositionUrl(),
            data: {
                lng: vmCity.lng,
                lat: vmCity.lat,
                isPartTime: vmCity.type,
                startTime: vmCity.type ? newOrder.partTime.start : newOrder.day.start,
                endTime: vmCity.type ? newOrder.partTime.end : newOrder.day.end,
                // discount: vmBottom.midnightDiscount,
                distance: 5000,
                sort: vmCity.sort,
                pageCount: 20,
                loading: true,
                cityId: positionInStorage.city.cid,
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmCity.hotelMarkers = json.data.list;

                    json.data.list.map(function(marker, index) {
                        var domMarker = createMarker(marker.id, marker.minPrice);

                        var marker = new AMap.Marker({
                            map: mapObj,
                            // icon: "./img/icon/icon-hotelInMap.svg",
                            position: [marker.lng, marker.lat],
                            offset: new AMap.Pixel(-34, -46),
                            content: domMarker,
                            extData: { hid: marker.id, minPrice: marker.minPrice }
                        }).on('click', function() {
                            vmCity.selectedHid = this.getExtData().hid;
                            vmCity.isShowHotelDetail = true;

                            //点击酒店，marker置顶
                            this.setTop(true);

                            //点击酒店，在地图里居中
                            // this.getMap().setCenter(this.getPosition());

                            setMarkers();
                            swiper1.slideTo(index);
                        });

                        hotelMarkersOnMap.push(marker);
                    });

                    if(positionInStorage.mode.value == positionInStorage.mode.city) {
                        mapObj.setFitView();
                    }
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
    bottomBarStartTime: '',
    bottomBarEndTime: '',
    setBottomBarTime: function() {
        var newOrder = Storage.get('newOrder'),
            start = '', 
            end = '',
            arr1 = [], arr2 = [],
            now = new Date();

        if(!vmCity.type){
            if(newOrder && newOrder.day && newOrder.day.startShow) {
                arr1 = newOrder.day.startShow.split('<br>');
                start = arr1[0] + ' ' + arr1[1];

                arr2 = newOrder.day.endShow.split('<br>');
                end = arr2[0] + ' ' + arr2[1];

            } else {
                start = (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + now.getHours() + ':00';
                end = formatDate(getDates(1)) + ' 12:00';
            }
        } else {
            if(newOrder && newOrder.partTime && newOrder.partTime.startHour) {
                start = '今日 ' + newOrder.partTime.startHour + ':00';
                end = '今日 ' + newOrder.partTime.endHour + ':00';
            } else {
                start = '今日 ' + now.getHours() + ':00';
                end = '今日 ' + (now.getHours()+3>=24?((now.getHours()+3-24) + ':00'):((now.getHours()+3) + ':00'));
            }
        }

        vmCity.bottomBarStartTime = start;
        vmCity.bottomBarEndTime = end;
    }
});

//模式变化，设置地图中心
Observer.regist('mapModeChange', function(e) {
    // var start = e.args.date,
    //     delta = e.args.delta;
    positionInStorage = Storage.get("position");

    if(positionInStorage.mode.value == positionInStorage.mode.city) {
        //城市模式，地图中心=城市中心
        mapObj.setCity(positionInStorage.city.name);
        var center = mapObj.getCenter();
        vmCity.lng = center.lng;
        vmCity.lat = center.lat;
        
        setTimeout(function() {
            vmSearch.saveCenterMode("", center.lng, center.lat);
        }, 100);
    } else if (positionInStorage.mode.value == positionInStorage.mode.center) {
        //中心模式，地图中心=本地储存中的地标
        mapObj.setCenter([positionInStorage.center.lng, positionInStorage.center.lat]);
        vmCity.lng = positionInStorage.center.lng;
        vmCity.lat = positionInStorage.center.lat;
    } else if (positionInStorage.mode.value == positionInStorage.mode.nearby) {
        //定位或者地图移动后，获取新的中心
        var center = mapObj.getCenter();
        vmCity.lng = center.lng;
        vmCity.lat = center.lat;

        setTimeout(function() {
            vmSearch.saveCenterMode("", center.lng, center.lat);
        }, 100);
    }

    vmCity.getHotelPosition(mapObj);
});

bensue = Storage.get("bensue");
if (bensue && bensue.type) {
    vmCity.type = bensue.type;
} else {
    bensue = { type: 0 };
    Storage.set("bensue", bensue);
}

newOrder = iniOrderTime();

positionInStorage = Storage.get("position");
if(!positionInStorage) {
    positionInStorage = positionIniData;
}

switch(positionInStorage.mode.value) {
    case positionInStorage.mode.city:
    case positionInStorage.mode.nearby:
        mapOption = {
            zoom: 12,
            features: ['bg','road','point']
        };
        break;
    case positionInStorage.mode.center:
        mapOption = {
            zoom: 12,
            features: ['bg','road','point'],
            center: [positionInStorage.center.lng, positionInStorage.center.lat]
        }
        break;
}

//高德地图
mapObj = new AMap.Map('container', mapOption).on('click', function() {
    iniMarkers();
}).on('dragend', function(){
    positionInStorage.mode.value = positionInStorage.mode.nearby;
    Storage.set("position", positionInStorage);

    Observer.fire('mapModeChange');
}).on('zoomend', function(){
    //城市模式会调 setFitView，影响 zoom，要排除下
    if(positionInStorage.mode.value != positionInStorage.mode.city) {
        positionInStorage.mode.value = positionInStorage.mode.nearby;
        Storage.set("position", positionInStorage);

        Observer.fire('mapModeChange');
    }
});
// }).on('touchmove',function() {
//     iniMarkers();
        //会影响安卓机的marker点击区域
// });

Observer.fire('mapModeChange');

mapObj.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(25, 25), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonDom: getGeoBtnDom(), 
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);

    // var isLocated = verify(positionInStorage);
    // //获取地址
    // if (isLocated) {
    //     //如果本地储存的地址有效，直接使用本地数据更新列表
    //     updateData();
    // } else {
    //     geolocation.getCurrentPosition();
    // }

    if(positionInStorage.mode.value == positionInStorage.mode.nearby) {
        //定位
        geolocation.getCurrentPosition();
    } else {
        vmCity.getHotelPosition(mapObj);
    }

    AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
});


//用户选择的地址，标记上点，可以使用 mapObj.setFitView()
//使用透明的图片
// myMarker = new AMap.Marker({
//     map: mapObj,
//     icon: "./img/transparent.png",
//     position: [121.749, 31.0469],
//     offset: new AMap.Pixel(-12, -36)
// });

vmCity.setBottomBarTime();
// vmBottom.getMidnightDiscount();
// vmCity.getHotelPosition(mapObj);
vmCity.getCityGallery();
registerWeixinConfig();

//解析定位结果，逆向地理编码
function onComplete(data) {
    positionInStorage.mode.value = positionInStorage.mode.nearby;

    Observer.fire('mapModeChange');
    // //步骤二：通过AMap.service加载检索服务，加载的服务可以包括服务插件列表中一个或多个
    // AMap.service(["AMap.Geocoder"], function() { //加载地理编码
    //     geocoder = new AMap.Geocoder({
    //         radius: 1000,
    //         extensions: "all"
    //     });
    //     //步骤三：通过服务对应的方法回调服务返回结果，本例中通过逆地理编码方法getAddress回调结果
    //     geocoder.getAddress(new AMap.LngLat(positionInStorage.lng, positionInStorage.lat), function(status, result) {
    //         //根据服务请求状态处理返回结果
    //         if (status == 'error') {
    //             alert("服务请求出错啦！ ");
    //         }
    //         if (status == 'no_data') {
    //             alert("无数据返回，请换个关键字试试～～");
    //         } else {
    //             //判断得到地址是否和之前保存的一致，不一致就更新相关数据
    //             if (positionInStorage.name != result.regeocode.pois[0].name) {
    //                 updateLocal(result.regeocode.pois[0].name, 
    //                     result.regeocode.pois[0].location.getLng(), 
    //                     result.regeocode.pois[0].location.getLat())
    //                 updateData();
    //             } else {
    //                 // vmSearch.currentLocation = positionInStorage.name;
    //             }
    //         }
    //     });
    // });
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

    Storage.set("position", positionInStorage);
}

function updateData() {
    vmCity.position = positionInStorage.name;
    vmCity.lng = positionInStorage.lng;
    vmCity.lat = positionInStorage.lat;
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

    if (hid != vmCity.selectedHid) {
        domMarker.className = 'bs-marker';
    } else {
        domMarker.className = 'bs-marker selected';
    }

    // var domMarkerPrice = document.createElement('div');
    // if (hid != vmCity.selectedHid) {
    //     domMarkerPrice.className = 'bs-marker-price';
    // } else {
    //     domMarkerPrice.className = 'bs-marker-price selected';
    // }
    // domMarkerPrice.innerHTML = '¥' + price;
    // domMarker.appendChild(domMarkerPrice);

    // var domMarkerPoint = document.createElement('div');
    // domMarkerPoint.className = 'bs-marker-point';
    // domMarker.appendChild(domMarkerPoint);

    return domMarker;
}

function getGeoBtnDom(){
    var domMarker = document.createElement('div');

    domMarker.className = 'bs-GeoBtn';

    return domMarker;
}

function iniMarkers() {
    vmCity.isShowHotelDetail = false;
    vmCity.selectedHid = 0;
    setMarkers();
}

//监听 type 变化
vmCity.$watch('type', function(a) {
    vmCity.getHotelPosition(mapObj);
    // vmCity.getCityGallery();
});
