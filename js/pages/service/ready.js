// var hotel = controlCore.getHotel();

// var articleid = getParam("id");
// if (articleid != "") {
//     if (isNaN(articleid)) {
//         location.href = document.referrer || "homepage.html";
//     } else {
//         articleid = parseInt(articleid);
//     }
// } else {
//     articleid = 0;
// }
var currentRoom = getGuest();
var hid = 1,
    roomType = 0,
    midnightDiscount = 1,
    myPosition, myLng, myLat,
    bensue, roomType, newOrder,
    isexpand = false,
    isSuccess = false,
    user;

var vmServiceReady = avalon.define({
    $id: 'serviceReady',
    name: '',
    pageNo: 1,
    pageSize: 10,
    data: [],
    temperature: "远程预温",
    orderList: {
        roomNo: 1123,
        startTime: 22,
    },
    list: [
        { id: 1, information: "儿童专用耗材及浴衣一套" },
        { id: 2, information: "周边地图一份" },
        { id: 3, information: "旅游景点介绍手册一份" },
        { id: 4, information: "已预约VR体验" },
    ],
    addService: function() { //添加更多定制服务
        stopSwipeSkip.do(function() {
            modalShow('../util/popMoreService.html', 1);
        });
    },
    openTem: function() { //添加更多定制服务
        stopSwipeSkip.do(function() {
            modalShow('../util/popPre-temperature.html', 1);
        });
    },
    goOpendoor: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("您已成功开启此趟旅程，请跟随我的脚步～", "follow me", ["去开门"], function(e) {
                if (e.index === 0) {
                    location.href = "../opendoor.html";
                }
            }, "div");
        });
    },
    blankTime: '', //当前时间
    timeDiffer: 0, //时间差值
    isCirqueShow: 0, //预温是否可点击  0-可点击  1-不可点击
    timePrompt: '请在19:30之前点击开启', //提示
    goTem: function() { //一键预温
        stopSwipeSkip.do(function() {
            vmServiceReady.blankTime = getToday("time").substring(0, 5);
            vmServiceReady.timeDiffer = vmServiceReady.orderList.startTime - parseInt(vmServiceReady.blankTime.substring(0, 2));
            vmServiceReady.timeDiffer = vmServiceReady.timeDiffer + ":" + vmServiceReady.blankTime.substring(3, 5);
            if (vmServiceReady.temperature == "远程预温" && parseInt(vmServiceReady.timeDiffer.substring(0, 1)) >= 0) {
                mui.confirm("预温时间只有30分钟", "是否开启远程预温？", ["确认预温", "取消"], function(e) {
                    if (e.index === 0) {
                        vmServiceReady.temperature = "预温中";
                        vmServiceReady.getAirStatus();
                        vmServiceReady.getAirDeviceList();
                        //vmServiceReady.goDevice();
                        vmServiceReady.isCirqueShow = 1;
                    }
                });
            } 
        });
    },
    airStatusList: [], //空调状态列表
    isOpen: 0,
    temPoint: 25,
    isMode: 0, //  1-制冷  3-送风  4-制热
    isWind: 0,
    getAirStatus: function() {
        ajaxJsonp({
            url: urls.getAirStatus,
            data: {
                rid: currentRoom.rid,
                t: new Date()
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmServiceReady.airStatusList = json.data;
                    vmServiceReady.isOpen = vmServiceReady.airStatusList[10];
                    vmServiceReady.temPoint = vmServiceReady.airStatusList[1] + 16;
                    vmServiceReady.isMode = vmServiceReady.airStatusList[0];
                    vmServiceReady.isWind = vmServiceReady.airStatusList[2];
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    airTempUpId: 0,
    airTempDownId: 0,
    airWindId: 0,
    airModeId: 0,
    airPowerId: 0,
    getAirDeviceList: function() { //设备id列表
        ajaxJsonp({
            url: urls.getAirDeviceList,
            data: {
                rid: currentRoom.rid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data);
                    json.data.map(function(e) {
                        if (e.rename == '模式') {
                            vmServiceReady.airModeId = e.id;
                        } else if (e.rename == '温度-') {
                            vmServiceReady.airTempDownId = e.id;
                        } else if (e.rename == '温度+') {
                            vmServiceReady.airTempUpId = e.id;
                        }
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    goDevice: function(url, did, mode, speed) { //设备控制接口，需要传接口地址和设备id；mode和speed两个是可选的，都传，用url和did来判断是哪个接口。
        ajaxJsonp({
            url: url,
            data: {
                rid: currentRoom.rid,
                did: did,
                mode: mode,
                speed: speed
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    mui.alert(json.message);
                } else {
                    if (url == urls.AirTempUp) {
                        vmServiceReady.temPoint--;
                    } else if (url == urls.airTempDown) {
                        vmServiceReady.temPoint++;
                    } else if (url == urls.changeAirMode) {
                        vmServiceReady.isMode = mode;
                    } else if (url == urls.changeAirMode) {
                        vmServiceReady.isWind = speed;
                    }
                    mui.alert(json.message);
                }
            }
        });
    },
    tempUp: function() { //升高温度
        if (vmServiceReady.temPoint < 31) {
            vmServiceReady.temPoint++;
            vmServiceReady.goDevice(urls.AirTempUp, vmServiceReady.airTempUpId);
        } else {
            mui.confirm("最高温度为31℃", "提醒", ["知道了"], function(e) {

            });
        }
    },
    tempDown: function() { //降低温度
        vmServiceReady.temPoint--;
        vmServiceReady.goDevice(urls.AirTempDown, vmServiceReady.airTempUpId);
    },
    changeMode: function(value) {
        stopSwipeSkip.do(function() {
            vmServiceReady.isMode = value;
            vmServiceReady.goDevice(urls.changeAirMode, vmServiceReady.airModeId, value, -1);
        });
    },
    serviceList: [],
    getPreService: function() { //获取用户前置选择的服务
        ajaxJsonp({
            url: urls.getPreService,
            data: {
                hid: hid,
                orid: currentRoom.orid //只orid有伪数据
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmServiceReady.serviceList = json.data;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
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
                if (json.status == 1) {
                    vmServiceReady.alias = json.data.alias;
                    vmServiceReady.name = json.data.name;
                    vmServiceReady.tel = json.data.telephone;
                    vmServiceReady.address = json.data.address;
                    vmServiceReady.introduction = json.data.introduction;
                    vmServiceReady.circTraffic = json.data.circTraffic;
                    vmServiceReady.lng = json.data.lng;
                    vmServiceReady.lat = json.data.lat;

                    if (json.data.distance > 0) {
                        vmServiceReady.distance = round(json.data.distance / 1000, 1);
                    }
                    //顶部轮播导入图片数据
                    vmServiceReady.galleryList = json.data.hotelGalleryList;
                    //房型数量
                    vmServiceReady.surplusList = json.data.surplusList;
                    // //酒店特色
                    vmServiceReady.serviceList = json.data.serviceList;
                    vmServiceReady.amenityList = json.data.amenityList;
                }
            }
        });
    },
    openNav: function() {
        stopSwipeSkip.do(function() {
            // if (isSuccess) {
            wx.openLocation({
                latitude: 31.0469, // 纬度，浮点数，范围为90 ~ -90
                longitude: 121.749, // 经度，浮点数，范围为180 ~ -180。
                name: "本宿酒店", // 位置名
                address: "惠南镇西门路18号彩虹商务大厦11楼", // 地址详情说明
                scale: 26, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: 'bensue.com' // 在查看位置界面底部显示的超链接,可点击跳转
            });
            // } 
            // else {
            //     console.log("微信接口配置注册失败，将重新注册");
            //     registerWeixinConfig();
            // }
        });
    },
    isAdvertisement: 0,
    hidAdvertisement: function() {
        if (vmServiceReady.isAdvertisement === 0) {
            $('.advertisement').css("display", "none");
            isAdvertisement = 1;
        } else {

        }
    },
});
vmServiceReady.getAirDeviceList();
vmServiceReady.data = vmServiceReady.list;
vmServiceReady.getPreService();
registerWeixinConfig();
modalShow('../util/popPre-temperature.html', 1);
//modalShow('./util/popPre-temperature.html', 1);
// wx.ready(function() {
//     wx.getLocation({
//         type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//         success: function(res) {
//             console.log(res);
//             myLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//             myLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//             vmServiceReady.getHotelDetail();

//             Storage.setLocal("position", {
//                 lat: myLat,
//                 lng: myLng
//             });
//         }
//     });
// });
// 
var vmMoreService = avalon.define({
    $id: 'moreService',
    addContent: '',
    closePop: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        });
    },
    addService: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.savePreService,
                data: {
                    hid: 1,
                    orid: currentRoom.orid,
                    contents: vmMoreService.addContent
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        mui.alert(json.message);
                        modalClose();
                        vmServiceReady.getPreService();
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        });
    }
});
var vmPopPreTemperature = avalon.define({
    $id: 'preTemperature',
    closePopPre: function() {
        stopSwipeSkip.do(function() {
            modalClose();
        });
    },
    // light: '不关闭',
    // lightId: 0,
    // lightList: [
    //     //     { type: 0, value: 1, name: '呼叫前台', engName: 'Call Reception', brief: '我们提供24小时前台呼叫服务。', url: '../img/reception-bg.jpg' },
    //     //     { type: 1, value: 2, name: '更换客用品', engName: 'Change Supplies', brief: '我们提供24小时前台呼叫服务。', url: '../img/changeSupplies-bg.jpg' },
    //     //     { type: 2, value: 3, name: '早餐服务', engName: 'Breakfast', brief: '我们提供24小时前台呼叫服务。', url: '../img/breakfast-bg.jpg' },
    //     //     { type: 3, value: 4, name: '清洁服务', engName: 'Cleaning', brief: '我们提供24小时前台呼叫服务。', url: '../img/clean-bg.jpg' },
    // ],
    // getlightList: function() {
    //     ajaxJsonp({
    //         url: urls.getReservationServiceList,
    //         data: {
    //             hid: 1,
    //         },
    //         successCallback: function(json) {
    //             if (json.status === 1) {
    //                 vmPopService.lightList = json.data;
    //             } else {
    //                 console.log(json.message);
    //             }
    //         }
    //     });
    // },
    popList: {},
});
