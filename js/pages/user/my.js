var ishide = false,
    isManageMode = false,
    isCMSMode = false,
    localpath = location.pathname;

//判断是否为管理模式
isManageMode = localpath.indexOf('manage') > 0 ? true : false;
isCMSMode = localpath.indexOf('cms') > 0 ? true : false;

$(function () {
    if (!isios && isweixin) {
        // $('#popModule').css('-webkit-transition-duration', '0');
    }
    $('#menu').on('tap', function (event) {
        event.preventDefault();
        vmSide.show();
    });
    $('#popModule').on('webkitTransitionEnd', function () {
        if (ishide) {
            $('#popModule').hide();
        }
    })
    $('#closebtn').on('click', function () {
        $('#popModule').addClass('hide');
        ishide = true;
    })
});

var vmSide = avalon.define({
    $id: 'aside',
    headImg: defaultHeadImg,
    name: '',
    nickName: '',
    isVip: 0,
    isAdmin: 0,
    isAlliance: 0,
    isManage: isManageMode,
    isCMS: isCMSMode,
    isFoundation: 0,
    cardList: [{
        id: 0,
        img: '../img/card/card_null.svg'
    },
        {
            id: 0,
            img: '../img/card/card_null.svg'
        }],
    goCard: function (id, index) {
        stopSwipeSkip.do(function () {
            if (id > 0) {
                location.href = "../card-show.html?id=" + id;
            } else {
                Storage.set('cardData', {cardIndex: index});
                location.href = "../card-list.html";
            }
        });
    },
    roomData: [],
    //开门列表
    getDoorList: function () {
        ajaxJsonp({
            noSkip: 1,
            url: urls.openDoorList,
            data: {},
            successCallback: function (json) {
                if (json.status === 1) {
                    vmSide.roomData = json.data;
                } else {
                    alert(json.message);
                }
            }
        });
    },
    //一个房，就开门，两个的话，就弹框
    open: function () {
        if (vmSide.roomData.length == 1) {
            var id = vmSide.roomData[0].id;
            var No = vmSide.roomData[0].roomNo;
            vmSide.openDoor(id, No);
        } else if (vmSide.roomData.length > 1) {
            mui('#roomSheet').popover('toggle');
        } else {
            mui.alert("没有可开门的房间");
        }
    },
    //开门
    openDoor: function (id, No) {
        ajaxJsonp({
            url: urls.openDoor,
            data: {
                id: id
            },
            successCallback: function (json) {
                if (json.status === 1) {
                    mui.alert(No + json.message);
                    if (vmSide.roomData.length != 1) {
                        mui('#roomSheet').popover('toggle');
                    }
                    vmSide.getDoorList();
                    vmSide.getLeaveList();
                } else {
                    mui.alert(No + json.message);
                }
            }
        });
    },
    leaveData: [],
    //一个房，就退，两个的话，就弹框
    leave: function () {
        if (vmSide.leaveData.length == 1) {
            var id = vmSide.leaveData[0].id;
            var No = vmSide.leaveData[0].roomNo;
            vmSide.checkOut(id, No);
        } else if (vmSide.leaveData.length > 1) {
            mui('#leaveSheet').popover('toggle');
        } else {
            mui.alert("没有可退的房间");
        }
    },
    //退房列表
    getLeaveList: function () {
        ajaxJsonp({
            noSkip: 1,
            url: urls.checkOutDoorList,
            data: {},
            successCallback: function (json) {
                if (json.status === 1) {
                    vmSide.leaveData = json.data;
                } else {
                    alert(json.message);
                }
            }
        });
    },
    //退房
    checkOut: function (orid, No) {
        mui.confirm("是否退房？", "退房", ["否", "是"], function (e) {
            if (e.index == 1) {
                ajaxJsonp({
                    url: urls.checkOutDoor,
                    data: {
                        id: orid
                    },
                    successCallback: function (json) {
                        if (json.status === 1) {
                            mui.alert(No + json.message);
                            if (vmSide.leaveData.length != 1) {
                                mui('#leaveSheet').popover('toggle');
                            }
                            vmSide.getDoorList();
                            vmSide.getLeaveList();
                        } else {
                            mui.alert(No + json.message);
                        }
                    }
                });
            }
        });
    },
    show: function () {
        vmSide.getUserInfo();
        //非管理系统才调取开门和退房
        if (!isCMSMode && !isManageMode) {
            vmSide.getDoorList();
            vmSide.getLeaveList();
        }
        ishide = false;
        $('#popModule').show();
        setTimeout("$('#popModule').removeClass('hide')", 10);
        //$('#popModule').removeClass('hide');

        Storage.setLocal('user', {openUserInfo: 0});
    },
    getUserInfo: function () {
        var userInfo = Storage.getLocal('user') || {};
        var token = userInfo.accessToken || '';
        var openid = userInfo.openId || '';

        $.ajax({
            // type: "get",
            type: "post",
            async: true,
            url: urls.userInfotUrl + "?accessToken=" + token + "&openId=" + openid,
            dataType: "json",
            // dataType: "jsonp",
            // jsonp: "jsonpcallback",
            success: function (json) {
                if (json.status === -1) {
                    vmSide.nickName = ' 未登录 ';
                    var user = Storage.getLocal("user") || {};
                    user.logState = 0;
                    Storage.setLocal('user', user);
                } else {
                    if (json.data.headUrl === '') {
                        vmSide.headImg = defaultHeadImg;
                    } else {
                        vmSide.headImg = urlAPINet + json.data.headUrl;
                    }

                    if (location.pathname.indexOf('index') >= 0) {
                        try {
                            vmTop.headImg = vmSide.headImg;
                        } catch (e) {
                        }
                    }

                    vmSide.nickName = json.data.nickname;
                    vmSide.isAdmin = json.data.isAdmin;
                    vmSide.isAlliance = json.data.isAlliance;
                    vmSide.isFoundation = json.data.isFoundation;

                    if (json.data.userBuyCardList && json.data.userBuyCardList.length) {
                        var cList = json.data.userBuyCardList;

                        for (var i = 0; i < cList.length; i++) {
                            if (cList[i].type != 4) {
                                if (vmSide.cardList[0].id == 0 && i == 0) {
                                    vmSide.cardList[0].id = cList[i].id;
                                    vmSide.cardList[0].img = '../img/card/card_No' + cList[i].type + '.svg';
                                } else if (vmSide.cardList[1].id == 0 && i == 1) {
                                    vmSide.cardList[1].id = cList[i].id;
                                    vmSide.cardList[1].img = '../img/card/card_No' + cList[i].type + '.svg';
                                }
                            }
                        }
                    }

                    var user = {
                        uid: json.data.id,
                        mobile: json.data.mobile,
                        openId: json.data.openId,
                        name: json.data.name,
                        nickname: json.data.nickname,
                        headImg: json.data.headUrl,
                        logState: 1,
                        idUrl: json.data.idUrl,
                        idNo: json.data.idNo,
                        authStatus: json.data.authStatus,
                        invoiceMoney: json.data.invoiceMoney,
                        isVip: json.data.isVip,
                        isAdmin: json.data.isAdmin,
                        isAlliance: json.data.isAlliance,
                        isFoundation: json.data.isFoundation,
                        accessToken: json.data.accessToken
                    };
                    Storage.setLocal('user', user);
                }
            },
            error: function (XMLHttpRequest, type, errorThrown) {
                console.log(XMLHttpRequest.responseText + "\n" + type + "\n" + errorThrown);
            }
        });
    },
    changeImg: function () {
        stopSwipeSkip.do(function () {
            ajaxJsonp({
                url: urls.userInfotUrl,
                data: {},
                successCallback: function (json) {
                    if (json.status == 1) { //已登录
                        location.href = '../avatar.html';
                        //通过config接口注入权限验证配置
                        // ajaxJsonp({
                        //     url: urls.weiXinConfig,
                        //     data: {
                        //         url: window.location.href
                        //     },
                        //     successCallback: function(json) {
                        //         if (json.status === 1) {
                        //             wx.config({
                        //                 debug: false,
                        //                 appId: json.data.appId,
                        //                 timestamp: json.data.timestamp,
                        //                 nonceStr: json.data.nonceStr,
                        //                 signature: json.data.signature,
                        //                 jsApiList: ['chooseImage','uploadImage']
                        //             });

                        //             wx.ready(function() {
                        //                 wx.chooseImage({
                        //                     count: 1, // 默认9
                        //                     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        //                     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        //                     success: function(res) {
                        //                         wx.uploadImage({
                        //                             localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        //                             isShowProgressTips: 1, // 默认为1，显示进度提示
                        //                             success: function(res1) {
                        //                                 //alert(res1.serverId);
                        //                                 savePic(res1.serverId);
                        //                                 // console.log(res1.serverId);
                        //                             }
                        //                         });
                        //                     }
                        //                 });
                        //             })
                        //         }
                        //     }
                        // });
                    }
                }
            });
        });
    },
    clickA: function (i) {
        stopSwipeSkip.do(function () {
            switch (i) {
                case 1:
                    location.href = "../user-info.html";
                    break;
                case 2:
                    location.href = "../orderList.html";
                    break;
                case 3:
                    location.href = "../service.html";
                    break;
                case 4:
                    location.href = "../coupon.html";
                    // goPromotion(); //config.js
                    break;
                case 5:
                    location.href = "../manage/homepage.html";
                    break;
                case 6:
                    location.href = "../index.html";
                    break;
                case 7:
                    location.href = "../manage/homepage.html";
                    break;
                case 8:
                    location.href = "../franchisee.html";
                    break;
                case 9:
                    location.href = "../card-detail.html";
                    break;
                case 10:
                    location.href = "../cms/nav.html";
                    break;
            }
        });
    }
});

function savePic(serverId) {
    ajaxJsonp({
        url: urls.saveUserInfo,
        data: {
            headUrl: serverId
        },
        successCallback: function (json) {
            if (json.status === 1) {
                vmSide.getUserInfo();
                alert(json.message);
            } else {
                alert(json.message);
            }
        }
    });
}

vmSide.getUserInfo();
