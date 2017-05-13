var currentRoom = getGuest();
var vmTemperature = avalon.define({
    $id: 'temperature',
    temPoint: 25, //温度数值
    isOpen: 0, //默认关闭  0-关闭   1-打开，非0表示打开
    getPower: function() {
        stopSwipeSkip.do(function() {
            vmTemperature.isOpen = !vmTemperature.isOpen;
            vmTemperature.goDevice(vmTemperature.isOpen ? urls.openAir : urls.closeAir, vmTemperature.airPowerId); //上行的开关判断已经调换了，所以这行也要调换，即非零调关机接口，0调开机接口
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
                        if (e.rename == '风速') {
                            vmTemperature.airWindId = e.id;
                        } else if (e.rename == '模式') {
                            vmTemperature.airModeId = e.id;
                        } else if (e.rename == '温度-') {
                            vmTemperature.airTempDownId = e.id;
                        } else if (e.rename == '温度+') {
                            vmTemperature.airTempUpId = e.id;
                        } else if (e.rename == '电源(开/关)') {
                            vmTemperature.airPowerId = e.id;
                        }
                    });
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    airStatusList: [], //空调状态列表
    getAirStatus: function() {
        ajaxJsonp({
            url: urls.getAirStatus,
            data: {
                rid: currentRoom.rid,
                t: new Date()
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmTemperature.airStatusList = json.data;
                    vmTemperature.isOpen = vmTemperature.airStatusList[10];
                    vmTemperature.temPoint = vmTemperature.airStatusList[1] + 16;
                    vmTemperature.isMode = vmTemperature.airStatusList[0];
                    vmTemperature.isWind = vmTemperature.airStatusList[2];
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
                        vmTemperature.temPoint--;
                    } else if (url == urls.airTempDown) {
                        vmTemperature.temPoint++;
                    } else if (url == urls.changeAirMode) {
                        vmTemperature.isMode = mode;
                    } else if (url == urls.changeAirMode) {
                        vmTemperature.isWind = speed;
                    }
                    mui.alert(json.message);
                }
            }
        });
    },
    tempUp: function() { //升高温度
        vmTemperature.temPoint++;
        vmTemperature.goDevice(urls.AirTempUp, vmTemperature.airTempUpId);
    },
    tempDown: function() { //降低温度
        vmTemperature.temPoint--;
        vmTemperature.goDevice(urls.AirTempDown, vmTemperature.airTempUpId);
    },
    isMode: 0, //  1-制冷  3-送风  4-制热
    changeMode: function(value) {
        stopSwipeSkip.do(function() {
            vmTemperature.isMode = value;
            vmTemperature.goDevice(urls.changeAirMode, vmTemperature.airModeId, value, -1);
        });
    },
    isWind: 0, //  1-低  2-中  3-高
    changeWind: function(value) {
        stopSwipeSkip.do(function() {
            vmTemperature.isWind = value;
            vmTemperature.goDevice(urls.changeAirWind, vmTemperature.airWindId, -1, value);
        });
    },
});

vmTemperature.getAirStatus();
vmTemperature.getAirDeviceList();

// var obj = document.getElementById("start");
// obj.addEventListener("touchstart", function(event) {
//     console.log(event);
//     if (event.targetTouches.length == 1) {
//         // vmTemperature.isStart = 1;
//         $("#start").css("background-color", "blue");
//     } else {
//         console.log(789);
//     }
// });

// obj.addEventListener("touchend", function(event) {
//     console.log(event);
//     if (event.targetTouches.length == 1) {
//         console.log(465);
//     } else {
//         vmTemperature.isStart = 0;
//     }
// });
