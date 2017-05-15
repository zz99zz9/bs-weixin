var currentRoom = getGuest(),
    did,
    movie_id,
    reading_id,
    allclose_id,
    lightZoulangId,
    lightTaipenId,
    lightYugangdaiId,
    lightLinyuId,
    lightMatongId,
    TongfengId,
    lightYueduId,
    lightChuangtouId,
    lightHuxingpingId;
var vmIllumination = avalon.define({
    $id: 'illumination',
    isScene: 1, //默认关  0-场景模式关   1-场景模式开
    isStart: 0, //默认关闭  0-关闭   1-打开
    start: function() {
        stopSwipeSkip.do(function() {
            vmIllumination.isStart = 1;
            ajaxJsonp({
                url: urls.curtainOpen,
                data: {
                    rid: currentRoom.rid,
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
                    rid: currentRoom.rid,
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
                    rid: currentRoom.rid,
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
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightZoulangId
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
                vmIllumination.isShow1 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightZoulangId
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
            }
        })
    },
    isShow2: 0, //默认关闭  0-关闭   1-打开
    openTaipen: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow2 == 0) {
                vmIllumination.isShow2 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightTaipenId
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
                vmIllumination.isShow2 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightTaipenId
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
            }
        })
    },
    isShow3: 0, //默认关闭  0-关闭   1-打开
    openYugang: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow3 == 0) {
                vmIllumination.isShow3 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightYugangdaiId
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
                vmIllumination.isShow3 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightYugangdaiId
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
            }
        })
    },
    isShow4: 0, //默认关闭  0-关闭   1-打开
    openLinyu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow4 == 0) {
                vmIllumination.isShow4 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightLinyuId
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
                vmIllumination.isShow4 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightLinyuId
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
            }
        })
    },
    isShow5: 0, //默认关闭  0-关闭   1-打开
    openMatong: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow5 == 0) {
                vmIllumination.isShow5 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightMatongId
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
                vmIllumination.isShow5 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightMatongId
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
            }
        })
    },
    isShow6: 0, //默认关闭  0-关闭   1-打开
    openTongfeng: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow6 == 0) {
                vmIllumination.isShow6 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: TongfengId
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
                vmIllumination.isShow6 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: TongfengId
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
            }
        })
    },
    isShow7: 0, //默认关闭  0-关闭   1-打开
    openYuedu: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow7 == 0) {
                vmIllumination.isShow7 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightYueduId
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
                vmIllumination.isShow7 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightYueduId
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
            }
        })
    },
    isShow8: 0, //默认关闭  0-关闭   1-打开
    openChuangtou: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow8 == 0) {
                vmIllumination.isShow8 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightChuangtouId
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
                vmIllumination.isShow8 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightChuangtouId
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
            }
        })
    },
    isShow9: 0, //默认关闭  0-关闭   1-打开
    openTouping: function() {
        stopSwipeSkip.do(function() {
            if (vmIllumination.isShow9 == 0) {
                vmIllumination.isShow9 = 1;
                ajaxJsonp({
                    url: urls.openLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightHuxingpingId
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
                vmIllumination.isShow9 = 0;
                ajaxJsonp({
                    url: urls.closeLight,
                    data: {
                        rid: currentRoom.rid,
                        did: lightHuxingpingId
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
                        rid: currentRoom.rid,
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
                        rid: currentRoom.rid,
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
                        rid: currentRoom.rid,
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
                rid: currentRoom.rid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    did = json.data[0].id;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    sceneList: [],
    getScePageDeviceList: function() {
        ajaxJsonp({
            url: urls.getScePageDeviceList,
            data: {
                rid: currentRoom.rid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIllumination.sceneList = json.data;
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
    sceneClick: function(name,did) {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.ScePageOperate,
                data: {
                    rid: currentRoom.rid,
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
        });
    },
    getLightDeviceList: function() {
        ajaxJsonp({
            url: urls.getLightDeviceList,
            data: {
                rid: currentRoom.rid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    console.log(json.data);
                    json.data.map(function(e) {
                        if (e.rename == '走廊灯') {
                            lightZoulangId = e.id;
                        } else if (e.rename == '台盆灯') {
                            lightTaipenId = e.id;
                        } else if (e.rename == '鱼缸灯带') {
                            lightYugangdaiId = e.id;
                        } else if (e.rename == '淋浴灯') {
                            lightLinyuId = e.id;
                        } else if (e.rename == '马桶灯') {
                            lightMatongId = e.id;
                        } else if (e.rename == '排风') {
                            TongfengId = e.id;
                        } else if (e.rename == '阅读灯') {
                            lightYueduId = e.id;
                        } else if (e.rename == '床头灯') {
                            lightChuangtouId = e.id;
                        } else if (e.rename == '弧形屏灯') {
                            lightHuxingpingId = e.id;
                        }
                    });
                } else {
                    mui.alert(json.message)
                }
            }
        });
    },
});
// document.getElementById("night").addEventListener("toggle", function(event) {
//     if (event.detail.isActive) {
//         vmIllumination.isScene = 1;
//     } else {
//         vmIllumination.isScene = 0;
//     }
// });

vmIllumination.getCurtainDeviceList();
vmIllumination.getScePageDeviceList();
vmIllumination.getLightDeviceList();
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
