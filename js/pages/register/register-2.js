var mobile = getParam('pNum'),
    prePage = getParam('prePage'),
    inviteCode = getParam('code'),
    wait = 60,
    user = Storage.getLocal('user');

var vmReg = avalon.define({
    $id: 'register',
    mobile: '',
    code: '',
    verifyCodeArray: [{
        code: ''
    }, {
        code: ''
    }, {
        code: ''
    }, {
        code: ''
    }],
    codeInput: function(value) {
        vmReg.code = value;
        for (var i = 0; i < 4; i++) {
            if (i < value.length) {
                vmReg.verifyCodeArray[i].code = value[i];
            } else {
                vmReg.verifyCodeArray[i].code = '';
            }
        }
    },
    inviteCode: inviteCode,
    codeMsg: '发送验证码',
    isSuccess: false,
    isUsed: false,
    getCode: function() {
        ajaxJsonp({
            url: urls.getCodeURL,
            data: {
                mobile: mobile
            },
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    return;
                } else {
                    wait = 60;
                    countSecond();
                }
            }
        });
    },
    isGoNextDisabled: true, //下一步按钮是否启用
    goRegister: function() {
        vmReg.isGoNextDisabled = true;
        ajaxJsonp({
            url: urls.loginURL,
            data: {
                username: mobile,
                authCode: vmReg.code,
                invitationCode: vmReg.inviteCode
            },
            successCallback: function(json) {
                if (json.status !== 1) {
                    alert(json.message);
                    vmReg.isGoNextDisabled = false;
                } else {
                    var user = {
                        uid: json.data.id,
                        mobile: mobile,
                        openId: json.data.openId,
                        name: json.data.name,
                        nickname: json.data.nickname,
                        headImg: json.data.headUrl,
                        logState: 1,
                        accessToken: json.data.accessToken,
                        idUrl: json.data.idUrl,
                        idNo: json.data.idNo,
                        authStatus: json.data.authStatus,
                        invoiceMoney: json.data.invoiceMoney
                    };
                    Storage.setLocal('user', user);
                    window.location.replace(prePage);
                }
            }
        });
    }
});

//读取本地储存的邀请码
if(user && user.inviteCode) {
    vmReg.inviteCode = user.inviteCode;
}

vmReg.$watch("code", function(a) {
    if (a.length == 4) {
        vmReg.isGoNextDisabled = false;
    } else {
        vmReg.isGoNextDisabled = true;
    }
});

//倒计时
function countSecond() {
    if (wait === 0) {
        vmReg.isSuccess = false;
        vmReg.codeMsg = '发送验证码';
        wait = 60;
    } else {
        vmReg.codeMsg = wait + '秒后可重新获取';
        vmReg.isSuccess = true;
        wait--;
        setTimeout(countSecond, 1000);
    }

}

//是否已注册
ajaxJsonp({
    url: urls.getRegisterLogURL,
    data: {
        mobile: mobile
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmReg.isUsed = json.data;
        }
    }
});

vmReg.getCode();