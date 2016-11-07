var vmSubAdd = avalon.define({
    $id: 'subAdd',
    headImg: defaultHeadImg,
    name: '',
    mobile: '',
    nickName: '',
    isVip: 0,
    isAdmin: 0,
    isAlliance: 0,
    isManage: isManageMode,
    isDisabled: true,
    show: function() {
        vmSubAdd.getUserInfo();
        ishide = false;
        $('#popModule').show();
        setTimeout("$('#popModule').removeClass('hide')", 10);
        //$('#popModule').removeClass('hide');

        Storage.setLocal('user', { openUserInfo: 0 });
    },
    changed: function() {
        if (vmSubAdd.name =='' || vmSubAdd.mobile == '' || vmSubAdd.mobile.length != 11) {
            vmSubAdd.isDisabled = true;
            return;
        }
        vmSubAdd.isDisabled = false;
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
                    vmSubAdd.nickName = ' 未登录 ';
                } else {
                    if (json.data.headUrl === '') {
                        vmSubAdd.headImg = defaultHeadImg;
                    } else {
                        vmSubAdd.headImg = urlAPINet + json.data.headUrl;
                    }

                    if (location.pathname.indexOf('index') >= 0) {
                        vmHotel.headImg = vmSubAdd.headImg;
                    }

                    vmSubAdd.nickName = json.data.nickname;
                    vmSubAdd.isAdmin = json.data.isAdmin;
                    vmSubAdd.isAlliance = json.data.isAlliance;

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
                vmSubAdd.getUserInfo();
                alert(json.message);
            } else {
                alert(json.message);
            }
        }
    });
}

vmSubAdd.getUserInfo();