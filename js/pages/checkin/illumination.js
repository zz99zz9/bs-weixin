var vmIllumination = avalon.define({
    $id: 'illumination',
    isScene: 0,  //默认关  0-场景模式关   1-场景模式开
    isStart: 0,  //默认关闭  0-关闭   1-打开
    start: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isStart==0) {
                vmIllumination.isStart = 1;
            } else {
                vmIllumination.isStart = 0;
            }
        })
    },
    isPause: 0,  //默认关闭  0-关闭   1-打开
    pause: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isPause==0) {
                vmIllumination.isPause = 1;
            } else {
                vmIllumination.isPause = 0;
            }
        })
    },
    isClose: 0,  //默认关闭  0-关闭   1-打开
    close: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isClose==0) {
                vmIllumination.isClose = 1;
            } else {
                vmIllumination.isClose = 0;
            }
        })
    },
    isShow1: 0,  //默认关闭  0-关闭   1-打开
    openZoulang: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow1==0) {
                vmIllumination.isShow1 = 1;
            } else {
                vmIllumination.isShow1 = 0;
            }
        })
    },
    isShow2: 0,  //默认关闭  0-关闭   1-打开
    openTaipen: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow2==0) {
                vmIllumination.isShow2 = 1;
            } else {
                vmIllumination.isShow2 = 0;
            }
        })
    },
    isShow3: 0,  //默认关闭  0-关闭   1-打开
    openYugang: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow3==0) {
                vmIllumination.isShow3 = 1;
            } else {
                vmIllumination.isShow3 = 0;
            }
        })
    },
    isShow4: 0,  //默认关闭  0-关闭   1-打开
    openLinyu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow4==0) {
                vmIllumination.isShow4 = 1;
            } else {
                vmIllumination.isShow4 = 0;
            }
        })
    },
    isShow5: 0,  //默认关闭  0-关闭   1-打开
    openMatong: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow5==0) {
                vmIllumination.isShow5 = 1;
            } else {
                vmIllumination.isShow5 = 0;
            }
        })
    },
    isShow6: 0,  //默认关闭  0-关闭   1-打开
    openTongfeng: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow6==0) {
                vmIllumination.isShow6 = 1;
            } else {
                vmIllumination.isShow6 = 0;
            }
        })
    },
    isShow7: 0,  //默认关闭  0-关闭   1-打开
    openYuedu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow7==0) {
                vmIllumination.isShow7 = 1;
            } else {
                vmIllumination.isShow7 = 0;
            }
        })
    },
    isShow8: 0,  //默认关闭  0-关闭   1-打开
    openChuangtou: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow8==0) {
                vmIllumination.isShow8 = 1;
            } else {
                vmIllumination.isShow8 = 0;
            }
        })
    },
    isShow9: 0,  //默认关闭  0-关闭   1-打开
    openTouping: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow9==0) {
                vmIllumination.isShow9 = 1;
            } else {
                vmIllumination.isShow9 = 0;
            }
        })
    },
    isShow10: 0,  //默认关闭  0-关闭   1-打开
    movie: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow10==0) {
                vmIllumination.isShow10 = 1;
            } else {
                vmIllumination.isShow10 = 0;
            }
        })
    },
    isShow11: 0,  //默认关闭  0-关闭   1-打开
    reading: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow11==0) {
                vmIllumination.isShow11 = 1;
            } else {
                vmIllumination.isShow11 = 0;
            }
        })
    },
    isShow12: 0,  //默认关闭  0-关闭   1-打开
    allClose: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow12==0) {
                vmIllumination.isShow12 = 1;
            } else {
                vmIllumination.isShow12 = 0;
            }
        })
    },
});

document.getElementById("night").addEventListener("toggle", function(event) {
    if (event.detail.isActive) {
        vmIllumination.isScene = 1;
        console.log(vmIllumination.isScene);
    } else {
        vmIllumination.isScene = 0;
    }
})
