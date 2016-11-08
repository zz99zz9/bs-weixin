var inid = 1;

var vmFavoree = avalon.define({
    $id: 'favoree',
    data: {
        edu1: '',
        edu2: '',
        reason: '',
    },
    headImg: defaultHeadImg,
    name: '',
    mobile: '',
    nickName: '',
    isVip: 0,
    isAdmin: 0,
    isAlliance: 0,
    isManage: isManageMode,
    isDisabled: true,
    listEdu1: [],
    listEdu2: [],
    getData: function() {
        ajaxJsonp({
            url: urls.warehouseInDetail,
            data: { id: 25 },
            successCallback: function(json) {
                vmFavoree.getList1();
                vmFavoree.getList2();
                if (json.status === 1) {
                    vmFavoree.name = json.data.agent.name;
                    vmFavoree.data.edu1 = json.data.amount;
                    vmFavoree.data.edu2 = json.data.cid;
                }
            }
        });
    },
    getList1: function() {
        //仓库选择
        vmFavoree.listEdu1 = ["大学", "高中", "初中", "小学"];
        (function($, doc) {
            var userPicker = new $.PopPicker();
            var showUserPickerButton1 = doc.getElementById('edu1');
            showUserPickerButton1.addEventListener('tap', function(event) {
                userPicker.setData(vmFavoree.listEdu1);
                userPicker.show(function(items) {
                    vmFavoree.data.edu1 = items[0].text;
                    var grade1 = ["大一", "大二", "大三", "大四", "大五"];
                    var grade2 = ["高一", "高二", "高三"];
                    var grade3 = ["初一", "初二", "初三", ];
                    var grade4 = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];
                    
                    vmFavoree.getList2();
                    vmFavoree.changed();
                });
            }, false);
        })(mui, document);
    },
    getList2: function() {
        //供应商选择
        vmFavoree.listEdu2 = ["大一", "大二", "大三", "大四", "大五"];
        vmFavoree.listEdu2 = ["高一", "高二", "高三"];
        vmFavoree.listEdu2 = ["初一", "初二", "初三", ];
        vmFavoree.listEdu2 = ["一年级", "二年级", "三年级", "四年级", "五年级", "六年级"];
        (function($, doc) {
            var userPicker = new $.PopPicker();
            var showUserPickerButton2 = doc.getElementById('edu2');
            showUserPickerButton2.addEventListener('tap', function(event) {
                userPicker.setData(vmFavoree.listEdu2);
                userPicker.show(function(items) {
                    vmFavoree.data.edu2 = items[0].text;
                    vmFavoree.changed();
                });
            }, false);
        })(mui, document);
    },
    show: function() {
        vmFavoree.getUserInfo();
        ishide = false;
        $('#popModule').show();
        setTimeout("$('#popModule').removeClass('hide')", 10);
        //$('#popModule').removeClass('hide');

        Storage.setLocal('user', { openUserInfo: 0 });
    },
    changed: function() {
        if (vmFavoree.name == '' || vmFavoree.mobile == '' || vmFavoree.mobile.length != 11) {
            vmFavoree.isDisabled = true;
            return;
        }
        vmFavoree.isDisabled = false;
    },
    getUserInfo: function() {
        var userInfo = Storage.getLocal('user') || {};
        var token = userInfo.accessToken || '';
        var openid = userInfo.openId || '';

        $.ajax({
            type: "get",
            async: true,
            url: urls.userInfotUrl + "?accessToken=" + token + "&openId=" + openid,
            dataType: "jsonp",
            jsonp: "jsonpcallback",
            success: function(json) {
                if (json.status === -1) {
                    vmFavoree.nickName = ' 未登录 ';
                } else {
                    if (json.data.headUrl === '') {
                        vmFavoree.headImg = defaultHeadImg;
                    } else {
                        vmFavoree.headImg = urlAPINet + json.data.headUrl;
                    }

                    if (location.pathname.indexOf('index') >= 0) {
                        vmHotel.headImg = vmFavoree.headImg;
                    }

                    vmFavoree.nickName = json.data.nickname;
                    vmFavoree.isAdmin = json.data.isAdmin;
                    vmFavoree.isAlliance = json.data.isAlliance;

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
                        accessToken: json.data.accessToken
                    };
                    Storage.setLocal('user', user);
                }
            },
            error: function(XMLHttpRequest, type, errorThrown) {
                console.log(XMLHttpRequest.responseText + "\n" + type + "\n" + errorThrown);
            }
        });
    },
    changeImg: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.userInfotUrl,
                data: {},
                successCallback: function(json) {
                    if (json.status == 1) { //已登录
                        location.href = '../avatar.html';
                    }
                }
            });
        });
    },
});

function savePic(serverId) {
    ajaxJsonp({
        url: urls.saveUserInfo,
        data: {
            headUrl: serverId
        },
        successCallback: function(json) {
            if (json.status === 1) {
                vmFavoree.getUserInfo();
                alert(json.message);
            } else {
                alert(json.message);
            }
        }
    });
}

if (inid == 0) {
    $("#headerReplace").text("添加");
    vmFavoree.getList1();
    vmFavoree.getList2();
} else {
    $("#headerReplace").text("修改");
    vmFavoree.getData();
}

vmFavoree.getUserInfo();
