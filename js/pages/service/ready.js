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
var currentRoom = Storage.get("currentRoom"),
    orid = currentRoom.roomId;
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
        })
    },
    goOpendoor: function() {
        stopSwipeSkip.do(function() {
            mui.confirm("您已成功开启此趟旅程，请跟随我的脚步～", "follow me", ["去开门"], function(e) {
                if (e.index == 0) {
                    location.href = "../opendoor.html";
                }
            }, "div");
        })
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
                vmServiceReady.temperature = "预温中";
                mui.alert('<div style="text-align:left;">您的房间将于19:30-20:00开启空调，若您20:00前未能办理入住，我们将关闭空调，谢谢您的谅解。</div>', '已为您预约', '<span style="color: blue;">知道了</span>', function(e) {
                    vmServiceReady.temperature = "预温中";
                }, 'div');
                // vmServiceReady.timePrompt = "将于 " + vmServiceReady.timeDiffer + " 后自启动预温";
                vmServiceReady.timePrompt = "已预约";
                $(".cirque").css("color", "white");
                $(".cirque").css("background-color", "#fdd942");
                $(".cirque").css("box-shadow", "0 3px 3px 0 rgba(253,217,66,.24)");
                $(".cirque").css("border-color", "rgba(255,255,255,.5)");
            } else {
                vmServiceReady.temperature = "远程预温";
                vmServiceReady.timePrompt = "请在19:30之前点击开启";
                // $(".cirque").css("background-color", "#444");
                // $(".cirque").css("box-shadow", "0 0 3px 3px #ccc");
                // $(".cirque").css("border", "none");
                $(".cirque").css("color", "#fdd942");
                $(".cirque").css("background-color", "white");
                $(".cirque").css("box-shadow", "none");
                $(".cirque").css("border-color", "#fdd942");
            }
        })
    },
    serviceList: [],
    getPreService: function() { //获取用户前置选择的服务
        ajaxJsonp({
            url: urls.getPreService,
            data: {
                hid: hid,
                orid: 1527  //只1527有伪数据
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
});
vmServiceReady.data = vmServiceReady.list;
vmServiceReady.getPreService();
registerWeixinConfig();
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
        })
    },
    addService: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.savePreService,
                data: {
                    hid: 1,
                    orid: 1527,
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
        })
    }
});
