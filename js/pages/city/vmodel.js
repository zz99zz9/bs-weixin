var user, newOrder, bensue, actionType,
    myMarker, mapObj, geolocation,
    swiper1, swiper2,
    isSuccess = false,
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
    goBack: function() {
        history.go(-1);
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
    $id: 'index',
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
            console.log(vmCity.type);
            vmBtn.useCheck = 1;
            if (vmCity.type == 0) {
                vmBtn.type = 'date';
                modalShow('./util/calendar.html', 1, function() {
                    $('#calendarPanel').height($(window).height() - 230);
                    //初始状态打开`入住时间
                    if (!(vmCalendar.statusControl.isEndEdit || vmCalendar.statusControl.isStartEdit)) {
                        vmCalendar.startClick();
                    }


var canvas = document.getElementById('clock'),
    ctx = canvas.getContext('2d'),
    cw = 240,
    ch = 240, //画布大小
    canvasBackgroundColor = "#fff",
    r = 100, //圆半径
    lw = 36, //线宽
    circleColor = "#eee",
    tColor = "#ccc",
    arcColor = "#169488",
    dr = 18, //点半径
    dx1 = 100,
    dy1 = 0, //点1的位置
    t1 = 3,
    dx2 = 0,
    dy2 = -100, //点2的位置
    t2 = 12,
    dotColor = "#B3DFDB",
    isTouchDot1 = false,
    isTouchDot2 = false,
    hourCoord = [];

var now = new Date();
t1 = now.getHours();
//步进模式，记录步进点的坐标
for (var i = 1; i <= 12; i++) {
    hourCoord.push({
        x: r * Math.cos((i - 3) / 12 * 2 * Math.PI),
        y: r * Math.sin((i - 3) / 12 * 2 * Math.PI)
    });
}
if (t1 > 12) {
    dx1 = hourCoord[t1 - 13].x;
    dy1 = hourCoord[t1 - 13].y;
} else if (t1 == 12 && t1 == 0) {
    dx1 = 0;
    dy1 = -100;
} else {
    dx1 = hourCoord[t1 - 1].x;
    dy1 = hourCoord[t1 - 1].y;
}

canvas.width = cw;
canvas.height = ch;
ctx.translate(cw / 2, ch / 2); //画布原点移到 0，0
document.getElementById('startHour').innerHTML = t1 + ':00';
document.getElementById('endHour').innerHTML = t2 + ':00';

//触摸事件绑定
canvas.ontouchstart = function(e) {
    e.preventDefault();

    var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
        tx = coord.x,
        ty = coord.y;

    isTouchDot1 = isDot1Touched(tx, ty);
    isTouchDot2 = isDot2Touched(tx, ty);
}

canvas.ontouchmove = function(e) {
    var coord = getCoord(e.touches[0].pageX, e.touches[0].pageY, cw, ch, canvas.offsetLeft, canvas.offsetTop),
        tx = coord.x,
        ty = coord.y,
        newCoord;

    // if (isDot1Touched(tx, ty) && isTouchDot1) {//手指要沿着圆规拖动
    if (isTouchDot1) {
        t1 = calHour(t1, tx, ty)

        document.getElementById('startHour').innerHTML = t1 + ':00';
        //沿着圆平滑移动
        newDx1 = tx * r / Math.sqrt(tx * tx + ty * ty);
        newDy1 = ty * r / Math.sqrt(tx * tx + ty * ty);
        draw(newDx1, newDy1, dx2, dy2);

        //步进模式
        // newCoord = clockStep(tx, ty);
        // draw(newCoord.x, newCoord.y, dx2, dy2);
    }

    // if (isDot2Touched(tx, ty) && isTouchDot2 && !isTouchDot1) {//手指要沿着圆拖动
    if (isTouchDot2 && !isTouchDot1) {
        t2 = calHour(t2, tx, ty);
        document.getElementById('endHour').innerHTML = t2 + ':00';

        //沿着圆平滑移动
        newDx2 = tx * r / Math.sqrt(tx * tx + ty * ty);
        newDy2 = ty * r / Math.sqrt(tx * tx + ty * ty);
        draw(dx1, dy1, newDx2, newDy2);
        //步进模式
        // newCoord = clockStep(tx, ty);
        // draw(dx1, dy1, newCoord.x, newCoord.y);
    }
}

canvas.ontouchend = function(e) {
    isTouchDot1 = false;
    isTouchDot2 = false;
}

//初始值
draw(dx1, dy1, dx2, dy2);

function draw(x1, y1, x2, y2) {
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(-cw / 2, -ch / 2, cw, ch);
    drawClock();
    drawArc();

    drawDot(x2, y2);
    drawDotText("退", x2, y2);
    //记录点2的最新位置
    dx2 = x2;
    dy2 = y2;

    drawDot(x1, y1);
    drawDotText("入", x1, y1);
    //记录点1的最新位置
    dx1 = x1;
    dy1 = y1;

    drawTime();
}

//画表盘
function drawClock() {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI, true);
    ctx.strokeStyle = circleColor;
    ctx.lineWidth = lw;
    ctx.stroke();

    //画刻度
    for (var i = 0; i < 12; i++) {
        ctx.save();

        var angle = i * 30 * Math.PI / 180;
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.fillStyle = circleColor;
        ctx.rect(r - lw + 6, -1.2, 8, 2.4);
        ctx.fill();

        ctx.restore();
    }

    //写时间刻度
    var tl = r - lw - 3;
    ctx.fillStyle = tColor;
    ctx.font = "13px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var j = 1; j <= 12; j++) {
        var tangle = (j - 3) * 30 * Math.PI / 180;
        if (j % 3 == 0) {
            ctx.fillText(j, tl * Math.cos(tangle), tl * Math.sin(tangle));
        }
    }
}

function drawTime() {
    //写时间
    ctx.fillStyle = "black";
    ctx.font = "18px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    var n = Math.floor((dayNum * 24 + t2 - t1)/24),
        r = (dayNum * 24 + t2 - t1)%24;
    if (n>0) {
        ctx.fillText(n + "天 " + r + "小时", 0, 0);
    } else {
        ctx.fillText(r + "小时", 0, 0);
    }
}

function calHour(time, tx, ty) {
    var cos = Math.acos(tx / Math.sqrt(tx * tx + ty * ty));
    var angle = cos * 360 / 2 / Math.PI;

    if (tx >= 0) {
        if (ty < 0)
            angle = 90 - angle; //第一象限
        else
            angle = 90 + angle; //第四象限
    } else {
        if (ty >= 0)
            angle = 90 + angle; //第三象限
        else
            angle = 180 - angle + 270; //第二象限
    }
    var hour = Math.floor(angle / 360 * 12);
    
    if(time == 0){
        if (hour == 11) {
            time = 23;
        } else {
            time = hour;
        }
    } else if (time == 11) {
        if (hour == 0) {
            time = 12;
        } else {
            time = hour;
        }
    } else if(time == 12) {
        if(hour == 11)
            time = 11;
        else
            time = hour + 12;
    } else if (time > 12 && time < 23) {
        time = hour + 12;
    } else if (time == 23) {
        if (hour == 0) {
            time = 0;
        } else {
            time = hour + 12;
        }
    } else {
        time = hour;
    }

    return time;
}

//步进模式
function clockStep(tx, ty) {
    var cos = Math.acos(tx / Math.sqrt(tx * tx + ty * ty));
    var angle = cos * 360 / 2 / Math.PI;

    if (tx >= 0) {
        if (ty < 0)
            angle = 90 - angle; //第一象限
        else
            angle = 90 + angle; //第四象限
    } else {
        if (ty >= 0)
            angle = 90 + angle; //第三象限
        else
            angle = 180 - angle + 270; //第二象限
    }
    var hour = angle / 360 * 12;

    index = hour < 1 ? 0 : (Math.round(hour) - 1);
    return {
        x: hourCoord[index].x,
        y: hourCoord[index].y
    }
}

//画弧线
function drawArc() {
    //arcTo 只会画最短的弧
    // var k = (dy1 - dy2) / (dx2 - dx1),
    //     x = k * r * r / (dx1 * k + dy1),
    //     y = r * r / (dx1 * k + dy1);
    // ctx.beginPath();
    // ctx.moveTo(dx1, dy1);
    // ctx.arcTo(x, y, dx2, dy2, r);

    ctx.beginPath();
    ctx.arc(0, 0, r, Math.atan2(dy1, dx1), Math.atan2(dy2, dx2), false);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = lw;
    ctx.stroke();
}

function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
    ctx.fillStyle = dotColor;
    ctx.fill();

    ctx.arc(x, y, dr, 0, 2 * Math.PI, true);
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

function drawDotText(text, x, y) {
    ctx.fillStyle = arcColor;
    ctx.font = "15px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
}

function isDot1Touched(x, y) {
    if (Math.abs(x - dx1) <= lw && Math.abs(y - dy1) <= lw) {
        return true;
    } else {
        return false;
    }
}

function isDot2Touched(x, y) {
    if (Math.abs(x - dx2) <= lw && Math.abs(y - dy2) <= lw) {
        return true;
    } else {
        return false;
    }
}

//获取触摸位置在画布坐标系的坐标
function getCoord(x, y, w, h, left, top) {
    return {
        x: x - w / 2 - left,
        y: y - h / 2 - top
    };
}
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
            freeModeMomentumRatio: 3,
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

    if (user.openUserInfo) {
        vmSide.show();
    }
}

//开门或者退房操作，打开面板
actionType = getParam('type');
if (actionType) {
    vmSide.show();
}

//高德地图
mapObj = new AMap.Map('container', {
    zoom: 14,
    center: [121.749, 31.0469] //默认地图中心
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

