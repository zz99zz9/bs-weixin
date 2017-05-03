var currentRoom = Storage.get("currentRoom"),
    roomId = currentRoom.roomId,
    did,
    movie_id,
    reading_id,
    allclose_id;
var vmIllumination = avalon.define({
    $id: 'illumination',
    isScene: 0, //默认关  0-场景模式关   1-场景模式开
    isStart: 0, //默认关闭  0-关闭   1-打开
    start: function() {
        stopSwipeSkip.do(function() {
            vmIllumination.isStart = 1;
            ajaxJsonp({
                url: urls.curtainOpen,
                data: {
                    rid: roomId,
                    did: did
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
        })
    },
    isPause: 0, //默认关闭  0-关闭   1-打开
    pause: function() {
        stopSwipeSkip.do(function() {
            vmIllumination.isPause = 1;
            ajaxJsonp({
                url: urls.curtainPause,
                data: {
                    rid: roomId,
                    did: did
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
        })
    },
    isClose: 0, //默认关闭  0-关闭   1-打开
    close: function() {
        stopSwipeSkip.do(function() {
            vmIllumination.isClose = 1;
            ajaxJsonp({
                url: urls.curtainClose,
                data: {
                    rid: roomId,
                    did: did
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
        })
    },
    isShow1: 0, //默认关闭  0-关闭   1-打开
    openZoulang: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow1 == 0) {
                vmIllumination.isShow1 = 1;
            } else {
                vmIllumination.isShow1 = 0;
            }
        })
    },
    isShow2: 0, //默认关闭  0-关闭   1-打开
    openTaipen: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow2 == 0) {
                vmIllumination.isShow2 = 1;
            } else {
                vmIllumination.isShow2 = 0;
            }
        })
    },
    isShow3: 0, //默认关闭  0-关闭   1-打开
    openYugang: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow3 == 0) {
                vmIllumination.isShow3 = 1;
            } else {
                vmIllumination.isShow3 = 0;
            }
        })
    },
    isShow4: 0, //默认关闭  0-关闭   1-打开
    openLinyu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow4 == 0) {
                vmIllumination.isShow4 = 1;
            } else {
                vmIllumination.isShow4 = 0;
            }
        })
    },
    isShow5: 0, //默认关闭  0-关闭   1-打开
    openMatong: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow5 == 0) {
                vmIllumination.isShow5 = 1;
            } else {
                vmIllumination.isShow5 = 0;
            }
        })
    },
    isShow6: 0, //默认关闭  0-关闭   1-打开
    openTongfeng: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow6 == 0) {
                vmIllumination.isShow6 = 1;
            } else {
                vmIllumination.isShow6 = 0;
            }
        })
    },
    isShow7: 0, //默认关闭  0-关闭   1-打开
    openYuedu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow7 == 0) {
                vmIllumination.isShow7 = 1;
            } else {
                vmIllumination.isShow7 = 0;
            }
        })
    },
    isShow8: 0, //默认关闭  0-关闭   1-打开
    openChuangtou: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow8 == 0) {
                vmIllumination.isShow8 = 1;
            } else {
                vmIllumination.isShow8 = 0;
            }
        })
    },
    isShow9: 0, //默认关闭  0-关闭   1-打开
    openTouping: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow9 == 0) {
                vmIllumination.isShow9 = 1;
            } else {
                vmIllumination.isShow9 = 0;
            }
        })
    },
    isShow10: 0, //默认关闭  0-关闭   1-打开
    movie: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow10 == 0) {
                vmIllumination.isShow10 = 1;
                ajaxJsonp({
                    url: urls.ScePageOperate,
                    data: {
                        rid: roomId,
                        did: movie_id
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
            } else {
                vmIllumination.isShow10 = 0;
            }
        })
    },
    isShow11: 0, //默认关闭  0-关闭   1-打开
    reading: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow11 == 0) {
                vmIllumination.isShow11 = 1;
                ajaxJsonp({
                    url: urls.ScePageOperate,
                    data: {
                        rid: roomId,
                        did: reading_id
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
            } else {
                vmIllumination.isShow11 = 0;
            }
        })
    },
    isShow12: 0, //默认关闭  0-关闭   1-打开
    allClose: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow12 == 0) {
                vmIllumination.isShow12 = 1;
                ajaxJsonp({
                    url: urls.ScePageOperate,
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
            } else {
                vmIllumination.isShow12 = 0;
            }
        })
    },
    curtainList: [

    ],

    getCurtainDeviceList: function() {
        ajaxJsonp({
            url: urls.getCurtainDeviceList,
            data: {
                rid: roomId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data[0]);
                    did = json.data[0].id;
                    console.log(did)
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
    getScePageDeviceList: function() {
        ajaxJsonp({
            url: urls.getScePageDeviceList,
            data: {
                rid: roomId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data[0],json.data[1],json.data[2]);
                    movie_id = json.data[0].id;
                    reading_id = json.data[1].id;
                    allclose_id = json.data[2].id;
                    console.log(movie_id, reading_id, allclose_id)
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
    getLightDeviceList: function() {
        ajaxJsonp({
            url: urls.getLightDeviceList,
            data: {
                rid: roomId
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data[0]);
                    console.log(json.message)
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
});
document.getElementById("night").addEventListener("toggle", function(event) {
    if (event.detail.isActive) {
        vmIllumination.isScene = 1;
    } else {
        vmIllumination.isScene = 0;
    }
});

vmIllumination.getCurtainDeviceList();
vmIllumination.getScePageDeviceList();
// var obj = document.getElementById("kaishi");
// obj.addEventListener("touchstart", function(event) {
//     console.log(event);
//     if (event.targetTouches.length == 1) {
//         console.log(111);
//         // vmIllumination.isStart = 1;
//         $("#kaishi").css("background-color", "blue");
//     } else {
//         console.log(222);
//     }
// });

// obj.addEventListener("touchend", function(event) {
//     console.log(event);
//     if (event.targetTouches.length == 1) {
//         console.log(333);
//     } else {
//         console.log(444);
//         // vmIllumination.isStart = 0;
//         $("#kaishi").css("background-color", "green");
//     }
// });
