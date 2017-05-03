/**
 * Created by lyh on 2017/4/5/005.
 */

var vmOpenDoor = avalon.define({
    $id: 'opendoor',
    // showType: 1,
    // onswitch: function() {
    //     document.getElementById("mySwitch").addEventListener("toggle", function(event) {
    //         if (event.detail.isActive) {
    //             vmOpenDoor.showType = 2;
    //             console.log("你启动了开关");
    //         } else {
    //             vmOpenDoor.showType = 1;
    //             console.log("你关闭了开关");
    //         }
    //     })
    // },
    did: 0,
    getDid: function() {
        ajaxJsonp({
            url: urls.getDoorDeviceList,
            data: {
                hid: 1
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmOpenDoor.did = json.data[0].id;
                    console.log( vmOpenDoor.did);
                    mui.alert(json.message);
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    open: function() {
        ajaxJsonp({
            url: urls.openRoomDoor,
            data: {
                rid: roomId,
                did: allclose_id
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data);
                    mui.alert(json.message);
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
});

// vmOpenDoor.onswitch();
//vmOpenDoor.getDid();
