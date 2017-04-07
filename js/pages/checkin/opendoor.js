/**
 * Created by lyh on 2017/4/5/005.
 */

var vmOpenDoor = avalon.define({
    $id: 'opendoor',
    showType: 1,
    onswitch: function () {
        document.getElementById("mySwitch").addEventListener("toggle", function (event) {
            if (event.detail.isActive) {
                vmOpenDoor.showType = 2;
                console.log("你启动了开关");
            } else {
                vmOpenDoor.showType = 1;
                console.log("你关闭了开关");
            }
        })
    }
});

vmOpenDoor.onswitch();