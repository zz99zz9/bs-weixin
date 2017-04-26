var vmTemperature = avalon.define({
    $id: 'temperature',
    temPoint: 25,  //温度数值
    isTongfeng: 0,  //默认关闭  0-关闭   1-打开
    tongfeng: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isTongfeng==0) {
                vmTemperature.isTongfeng = 1;
            } else {
                vmTemperature.isTongfeng = 0;
            }
        })
    },
    isZhire: 0,  //默认关闭  0-关闭   1-打开
    zhire: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isZhire==0) {
                vmTemperature.isZhire = 1;
            } else {
                vmTemperature.isZhire = 0;
            }
        })
    },
    isZhileng: 0,  //默认关闭  0-关闭   1-打开
    zhileng: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isZhileng==0) {
                vmTemperature.isZhileng = 1;
            } else {
                vmTemperature.isZhileng = 0;
            }
        })
    },
    // isUp: 0,  //默认关闭  0-关闭   1-打开
    wendujia: function() {
        vmTemperature.temPoint++;
    },
    // isDown: 0,  //默认关闭  0-关闭   1-打开
    wendujian: function() {
        vmTemperature.temPoint--;
    },
    isSmall: 0,  //默认关闭  0-关闭   1-打开
    small: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isSmall==0) {
                vmTemperature.isSmall = 1;
            } else {
                vmTemperature.isSmall = 0;
            }
        })
    },
    isMiddle: 0,  //默认关闭  0-关闭   1-打开
    middle: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isMiddle==0) {
                vmTemperature.isMiddle = 1;
            } else {
                vmTemperature.isMiddle = 0;
            }
        })
    },
    isLarge: 0,  //默认关闭  0-关闭   1-打开
    large: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isLarge==0) {
                vmTemperature.isLarge = 1;
            } else {
                vmTemperature.isLarge = 0;
            }
        })
    },
    isSwitch: 0,  //默认关闭  0-关闭   1-打开
    kaiguan: function() {
        stopSwipeSkip.do(function() {
            if (vmTemperature.isSwitch==0) {
                vmTemperature.isSwitch = 1;
            } else {
                vmTemperature.isSwitch = 0;
            }
        })
    },
    curtainList: [

    ],
});

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
