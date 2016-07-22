
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
    listData;

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
        vmIndex.type = type;
    },
    lng: 0,
    lat: 0,
    position: '正在定位...',
    openLocationSearch: function() {
        popover('./searchLocation.html', 1, function() {
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
    goRoom: function(id) {
        location.href = "room.html?id=" + id;
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

mapObj = new AMap.Map('container');
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
        zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    //mapObj.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
    AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
});

if (verify(positionInStorage)) {
    updateData();
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

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
})

function verify(position) {
    if (position) {
        if (position.lng && position.lat) {
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