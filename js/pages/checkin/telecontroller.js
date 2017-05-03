var currentRoom = Storage.get("currentRoom"),
    roomId = currentRoom.roomId;
var vmTelecontroller = avalon.define({
    $id: 'telecontroller',
    isSwitch: 0, //默认不启动  0-不启动  1-启动
    switch1: function() {
        stopSwipeSkip.do(function() {
            if (vmTelecontroller.isSwitch == 0) {
                $("#switch1").css("background-color", "#444");
                vmTelecontroller.isSwitch = 1;
            } else {
                $("#switch1").css("background-color", "#bdbdbd");
                vmTelecontroller.isSwitch = 0;
            }
        })
    },
    isThreed: 0, //默认不启动  0-不启动  1-启动
    threeD: function() {
        stopSwipeSkip.do(function() {
            if (vmTelecontroller.isThreed == 0) {
                $("#threeD").css("background-color", "#bdbdbd");
                vmTelecontroller.isThreed = 1;
                ajaxJsonp({
                    url: urls.controlTele3d,
                    data: {
                        rid: roomId,
                        did: 0,
                    },
                    successCallback: function(json) {
                        if (json.status === 1) {
                            console.log(1);
                        } else {
                            mui.alert(json.message)
                        }
                    }
                });
            } else {
                $("#threeD").css("background-color", "#f2f2f2");
                vmTelecontroller.isThreed = 0;
            }
        })
    },
    homePageId: 0,
    getAirDeviceList: function() { //设备id列表
        ajaxJsonp({
            url: urls.getTeleDeviceList,
            data: {
                rid: roomId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.$model.data);
                    json.data.map(function(e) {
                        if(e.func_name=="主页") {
                            vmTelecontroller.homePageId = e.id;
                        }
                    });
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
});
vmTelecontroller.getAirDeviceList();
