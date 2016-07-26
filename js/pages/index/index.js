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
                    if(!(vmRooms.statusControl.isEndEdit||vmRooms.statusControl.isStartEdit)) {
                        vmRooms.startClick();
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

//日历相关
var bookDateList = null, tapCount = 0, select_bar;
var vmRooms = avalon.define({
    $id: 'rooms',
    statusControl: {
        isStartEdit: false, //选择夜房入住日期
        isEndEdit: false, //选择夜房退房日期
        isCalendarShow: false, //日历是否显示
        isCalendarEdit: false, //日历是否可点
        //isStartTimeShow: false, //选择夜房入住时间段
        isStartTimeEdit: false, //夜房入住时间修改
        //isTimeListShow: false, //时租房时间列表是否显示
        //isTypeShow: false, //房间系列是否显示
        //isMoreBtnShow: true,
        //isRoomListShow: true, //房间列表
    },
    startClick: function() {
        vmRooms.statusControl.isCalendarShow = true;

        // if (!vmRooms.statusControl.isStartEdit) {
        vmRooms.statusControl.isStartEdit = true;
        vmRooms.statusControl.isEndEdit = false;
        vmRooms.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmRooms.statusControl.isStartEdit = false;
        //     vmRooms.statusControl.isCalendarEdit = false;
        // }

        // vmRooms.statusControl.isTypeShow = false;
        // vmRooms.statusControl.isMoreBtnShow = false;
        // vmRooms.statusControl.isRoomListShow = false;
        // vmRooms.statusControl.isStartTimeShow = true;

        // if (pageType != "order") {
        //     vmLogo.isClose = true;

        //     //查询搜索时，要显示的酒店夜房优惠价格列表
        //     ajaxJsonp({
        //         url: urls.getNightDiscount,
        //         data: { hid: hotelid, tid: vmRooms.typeid },
        //         successCallback: function(json) {
        //             if (json.status === 1) {
        //                 vmRooms.nightDiscount = json.data;
        //             }
        //         }
        //     });
        // }
        // if (pageType == 'order') {
        //     vmRooms.statusControl.isStartTimeEdit = false;
        // }
    },
    endClick: function() {
        vmRooms.statusControl.isCalendarShow = true;

        // if (!vmRooms.statusControl.isEndEdit) {
        vmRooms.statusControl.isStartEdit = false;
        vmRooms.statusControl.isEndEdit = true;
        vmRooms.statusControl.isCalendarEdit = true;
        // } else {
        //     //进入非编辑模式
        //     vmRooms.statusControl.isEndEdit = false;
        //     vmRooms.statusControl.isCalendarEdit = false;
        // }

        // vmRooms.statusControl.isTypeShow = false;
        // vmRooms.statusControl.isMoreBtnShow = false;
        // vmRooms.statusControl.isRoomListShow = false;
        // vmRooms.statusControl.isStartTimeShow = false

        // if (pageType != "order") {
        //     vmLogo.isClose = true;
        //     vmRooms.statusControl.isMoreBtnShow = true;
        // }
        // if (pageType == 'order') {
        //     vmRooms.statusControl.isStartTimeEdit = true;
        // }
    },
    //日历灰掉的逻辑
    isDisabled: function(index, isStartEdit, isEndEdit, startIndex, endIndex) {
        var isDisabledByBooked,
            date = vmRooms.$model.calendar[index],
            max = -1,
            min = -1;

        isDisabledByBooked = isStartEdit ? date.inDisabled : date.outDisabled;

        if (bookDateList) {
            var list = isStartEdit ? bookDateList.inIndex : bookDateList.outIndex,
                length = list.length;

            //先选入住，再选退房时
            if (startIndex > -1 && isEndEdit) {
                for (var i in list) {
                    max = list[i];
                    if (list[i] > startIndex) {
                        break;
                    }
                }

                if (index > max && max > startIndex) {
                    isDisabledByBooked = true;
                }
            }
            //先选退房，在选入住
            if (endIndex > -1 && isStartEdit) {
                if(endIndex > list[0]) {
                    for (var i in list) {
                        min = list[i-1];
                        if (list[i] >= endIndex) {
                            break;
                        }
                    }
                    //如果退房时间在所有预订日期的后面
                    //要保留可点的入住时间的最小值就是预订日期的最大值的前一天
                    if (endIndex > list[length - 1]) {
                        min = list[length - 1];
                    }
                }

                //小于最小值的都灰掉
                if (index < min) {
                    isDisabledByBooked = true;
                }
            }
        }

        return (isStartEdit && ((endIndex != -1) && (index > endIndex))) 
        || (isEndEdit && ((startIndex != -1) && (index < startIndex))) 
        || isDisabledByBooked
    },
    isSelected: function(index) {
        if (vmRooms.startIndex == -1 && vmRooms.endIndex == -1) {
            return false;
        }
        if (vmRooms.startIndex == -1 && vmRooms.endIndex > -1) {
            return index == vmRooms.endIndex;
        }
        if (vmRooms.startIndex > -1 && vmRooms.endIndex == -1) {
            return index == vmRooms.startIndex;
        }
        return (index >= vmRooms.startIndex) && (index <= vmRooms.endIndex);
    },
    calendar: [],
    startIndex: -1,
    endIndex: -1,
    todayIndex: 0,
    clickDate: function(index) {
        stopSwipeSkip.do(function(){
            var date = vmRooms.$model.calendar[index];

            //是否是编辑状态
            if (vmRooms.statusControl.isCalendarEdit) {
                //是否是编辑入住时间
                if (vmRooms.statusControl.isStartEdit && !date.inDisabled) {
                    if ((vmRooms.startIndex != -1) && (vmRooms.startIndex == index)) {
                        vmRooms.startIndex = -1;
                        return;
                    }

                    if (vmRooms.endIndex > vmRooms.startIndex) {
                        //小于之前的结束时间
                        if (index < vmRooms.endIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmRooms.startIndex = index;
                            } else {
                                var count = 0;
                                for (var i = index; i < vmRooms.endIndex; i++) {
                                    if (bookDateList.inIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmRooms.startIndex = index;
                                }
                            }
                        }
                        //大于之前的结束时间－不响应
                    } else {
                        vmRooms.startIndex = index;
                    }

                    vmRooms.startTimeIndex = -1;
                    vmRooms.startTime = "";
                    vmRooms.nightPrice = 0;

                    // //针对安卓微信中 svg 标签不识别 avalon 的 ms-class bug
                    // $("svg").attr("class", "clock");
                    // if (vmRooms.todayIndex == index) {
                    //     $("svg[id^='svg']").each(function(o) {
                    //         if (parseInt(this.getAttribute("data-hour")) * 2 <= getHourIndex()) {
                    //             $(this).attr("class", "clock disabled");
                    //         }
                    //     })
                    // }

                    // if (bookDateList && bookDateList.outIndex.indexOf(vmRooms.startIndex) > -1) {
                    //     $("svg[id^='svg']").each(function(o) {
                    //         if (parseInt(this.getAttribute("data-hour")) <= 14) {
                    //             $(this).attr("class", "clock disabled");
                    //         }
                    //     })
                    // }
                    // //向下滚动显示选择入住时间
                    // $(window).scrollTop(190);
                }

                //是否是编辑退房时间
                if (vmRooms.statusControl.isEndEdit && !date.outDisabled) {
                    if ((vmRooms.endIndex != -1) && (vmRooms.endIndex == index)) {
                        vmRooms.endIndex = -1;
                        return;
                    }

                    if ((vmRooms.endIndex > vmRooms.startIndex || vmRooms.endIndex == -1) && vmRooms.startIndex > -1) {
                        //大于之前的起始时间
                        if (index > vmRooms.startIndex) {
                            //判断中间有没有预定掉的日期
                            if (!bookDateList) {
                                vmRooms.endIndex = index;
                            } else {
                                var count = 0;
                                for (var i = vmRooms.startIndex + 1; i <= index; i++) {
                                    if (bookDateList.outIndex.indexOf(i) > -1) {
                                        count = 1;
                                        break;
                                    }
                                }
                                if (!count) {
                                    vmRooms.endIndex = index;
                                }
                            }
                        }
                        //小于之前的起始时间－不响应
                    } else {
                        vmRooms.endIndex = index;
                    }
                }
            }
        });
    },
    startTimeIndex: -1, //夜房入住时间段序号
    startTime: "", //夜房入住时间, 格式: 08:00
    nightPrice: 0, //根据入住时间确定的夜房价格,
    filterList: [
        { "id":1, "name":"浴缸" },
        { "id":2, "name":"淋浴" },
        { "id":3, "name":"影院" },
        { "id":4, "name":"阳光" },
        { "id":5, "name":"朝南" },
    ],
    selectFilter: []
});

//日历初始化
function getCalendar() {
    var d = new Date(),
        year, month, day,
        weekday = d.getDay(),
        temp,
        list = [],
        inDisabled, outDisabled;


    if (weekday == 0) {
        weekday = 7;
    }
    temp = weekday;

    d.setDate(d.getDate() - (weekday - 1));
    for (var i = 1; i < temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            inDisabled: true,
            outDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(d.getDate() + 1);
    }
    vmRooms.todayIndex = list.length;

    d = new Date();
    for (var i = 0; i < 60; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        date = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);

        //选入住时间时，被灰掉的日期
        //不包括被预定的退房日(list2)
        //list1 + list3
        inDisabled = bookDateList && (bookDateList.inStr.indexOf(date) > -1);
        if (inDisabled) {
            bookDateList.inIndex.push(list.length);
        }

        //选退房时间时，被灰掉的日期
        //不包括被预定的入住日（14点后入住）(list1)
        //list2 + list3
        outDisabled = bookDateList && (bookDateList.outStr.indexOf(date) > -1);
        if (outDisabled) {
            bookDateList.outIndex.push(list.length);
        }

        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            inDisabled: inDisabled,
            outDisabled: outDisabled,
            date: date
        });

        d.setDate(day + 1);
    }

    if (weekday == 0) {
        weekday = 7;
    }
    temp = weekday;
    for (var i = 0; i < 7 - temp; i++) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
        day = d.getDate();
        weekday = d.getDay();
        list.push({
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            inDisabled: true,
            outDisabled: true,
            date: year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        });
        d.setDate(day + 1);
    }

    vmRooms.calendar = list;
}

getCalendar();

//时租房时间选择
var vmPart = avalon.define({
    $id: "partTime",
    statusControl: {
        isTimeListShow: true, //时租房时间列表是否显示
    },
    //时间选择
    partTimeClick: function() {
        vmPart.statusControl.isTimeListShow = true;
    },
    minIndex: 16,
    maxIndex: 40,
    partTimeIndex: 0, //时租房开始序号
    partTimeNumber: 4, //时租房数列（半小时1个单位）
    partTimeStart: "", //时租房开始时间
    partTimeEnd: "", //时租房结束时间
    timeStatus: "000000000000000000000000000000000000000000000000", //默认都可以选
    timeList: [],
    partTimePrice: [], //房间时租房时段价格
    partTimePay: 0, //时租房费用
    selectTime: function(index) {
        tapCount++;
        if (tapCount > 1) {
            //时租房订房开始时间受当前时间影响
            var hourIndex = getHourIndex();
            if (index <= hourIndex)
                index = hourIndex + 1;

            //时租房订房结束时间不能超过最大值
            if (index + vmPart.partTimeNumber > vmPart.maxIndex) {
                vmPart.partTimeNumber = vmPart.maxIndex - index;
            }

            if (index >= vmPart.minIndex && (index <= (vmPart.maxIndex - 4)) && vmPart.partTimeNumber >= 4) {
                vmPart.partTimeIndex = index;

                select_bar.style.top = this.offsetTop + 'px';

                select_bar.style.height = '';
                select_bar.className = "bar";

                var list = vmPart.timeList;

                for (var i = 1; i <= vmPart.partTimeNumber; i++) {
                    if (list[index + i].isBook || list[index + i].isWait) {
                        vmPart.partTimeIndex = index - (vmPart.partTimeNumber - i);
                        select_bar.style.top = this.offsetTop - 21 * (vmPart.partTimeNumber - i) + 'px';
                        break;
                    }
                }
                setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
            } else {
                vmPart.partTimeIndex = 0;
                vmPart.partTimeNumber = 4;
                vmPart.partTimeStart = "";
                vmPart.partTimeEnd = "";
                vmPart.partTimePay = 0;
            }
            tapCount = 0;
        }
        setTimeout(function() {
            tapCount = 0;
        }, 100)
    },
    addTime: function() {

        if ((vmPart.partTimeIndex + vmPart.partTimeNumber) < vmPart.maxIndex && canOrderPartTime()) {
            vmPart.partTimeNumber++;

            select_bar.style.height = select_bar.offsetHeight + 21 + 'px';

            setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
        }
    },
    minusTime: function() {
        if (vmPart.partTimeNumber > 4) {
            vmPart.partTimeNumber--;

            select_bar.style.height = select_bar.offsetHeight - 21 + 'px';

            setPartTime(vmPart.partTimeIndex, vmPart.partTimeNumber);
        } else {
            select_bar.className = "mui-hidden bar";
            vmPart.partTimeStart = "";
            vmPart.partTimeEnd = "";
        }
    },
    filterList: [
        { "id":1, "name":"浴缸" },
        { "id":2, "name":"淋浴" },
        { "id":3, "name":"影院" },
        { "id":4, "name":"阳光" },
        { "id":5, "name":"朝南" },
    ],
    selectFilter: []
})

//获得时租房的入住退房时间，费用
function setPartTime(index, number) {
    var startHour = Math.floor(index / 2);
    var endHour = Math.floor((index + number) / 2);
    vmPart.partTimeStart = (startHour < 10 ? ('0' + startHour) : startHour) + ":" + (index % 2 ? "30" : "00");
    vmPart.partTimeEnd = (endHour < 10 ? ('0' + endHour) : endHour) + ":" + ((index + number) % 2 ? "30" : "00");

    vmPart.partTimePay = 0;
    for (var i = index; i < (index + number); i++) {
        vmPart.partTimePay += vmPart.partTimePrice[i];
    }
}

//房间状态返回时租房时间列表对象
function getTimeList(status) {
    var list = status.split(''),
        olist = [],
        o = {},
        count = 0,
        index = getHourIndex();

    //已过的时间都灰掉
    for (var i = 0; i < 48; i++) {
        if (i < index) {
            list[i] = '1';
        }
    }
    vmPart.timeStatus = list.join('');

    for (var i = 0; i < 48; i++) {
        if (count > 0) {
            count++;
        }

        o = { isBook: 0, isWait: 0, price: 0, node: 0 };

        if (list[i] == 0 && (list[i - 1] == 1)) {
            o.isWait = 1;
            count = 1;
        }
        if (list[i] == 0 && (list[i + 1] == 1)) {
            o.isWait = 1;
        }

        if (list[i] == 1) {
            o.isBook = 1;
            //间隔不足5个全部灰掉
            if (count <= 6 && count > 0) {
                for (var j = 1; j <= count; j++) {
                    olist[olist.length - j].isBook = 1;
                }
            }
            count = 0;
        }

        o.price = vmPart.$model.partTimePrice[i];
        if (o.price != vmPart.$model.partTimePrice[i - 1]) {
            o.node = 1;
        }
        olist.push(o);

    }

    return olist;
}

//判断是否能否半个小时能否订时租房
function canOrderPartTime() {
    var list = vmPart.timeList;
    return !(list[vmPart.partTimeIndex + vmPart.partTimeNumber].isBook || list[vmPart.partTimeIndex + vmPart.partTimeNumber].isWait);
}

//在时租房时间列表上，显示时间段节点价格
function partTimePriceShow(index, node, price) {
    if (node) {
        return " " + index / 2 + "点以后，每半小时 " + price + " 元";
    } else {
        return '';
    }
}

//获取当前小时序号
function getHourIndex() {
    var now = getToday('time').split(':'),
        index = parseInt(now[0]) * 2;

    if (parseInt(now[1]) >= 30) {
        index++;
    }

    return index;
}

vmPart.timeList = getTimeList(vmPart.timeStatus);