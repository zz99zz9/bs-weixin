var accountID = getParam('cid');
if (accountID != "") {
    if (isNaN(accountID)) {
        location.href = document.referrer || "index.html";
    } else {
        accountID = parseInt(accountID);
    }
} else {
    location.href = "index.html";
}

var user = Storage.getLocal('user'),
    mobile = user.mobile,
    wait = 60;

var vmCardBind = avalon.define({
    $id: 'bind',
    bindType: 1, //1 支付宝, 2 银行卡
    accountNo: '',
    accountName: '',
    bankName: '',
    bind: function() {
        // mui.confirm(
        //     '请确认帐号信息无误，绑定完成后，如需更改请联系客服。',
        //     '绑定提现帐号',
        //     ['否','是'],
        //     function(e) {
        //         if(e.index) {
        //             mui.alert('绑定成功', function() {
        //                 location.replace("card-log.html");
        //             });
        //         }
        //     });

        //验证
        if (vmCardBind.bindType == 1) {
            if (vmCardBind.accountNo == '') {
                mui.alert('请输入您的支付宝帐号');
                return;
            }
        } else if (vmCardBind.bindType == 2) {
            if (vmCardBind.accountNo == '') {
                mui.alert('请输入您的银行卡号');
                return;
            }
            if (vmCardBind.bankName == '') {
                mui.alert('请输入您的开户行及支行');
                return;
            }
        }

        if (vmCardBind.accountName == '') {
            mui.alert('请输入您的姓名');
            return;
        }

        if (vmPopover.useCheck) {
            vmCode.getCode();
            //av2 不知道为什么不能 scan 第二次
            //纯粹显示，在关闭弹窗的时候不要清空弹窗内容
            popover('./util/code.html', 0);
        } else {
            vmCode.getCode();
            vmPopover.useCheck = 1;
            popover('./util/code.html', 1);
        }
    },
    select: function(type) {
        this.bindType = type;
    },
    getData: function() {
        ajaxJsonp({
            url: urls.getDefaultCashAccount,
            data: {
                cid: accountID,
            },
            successCallback: function(json){
                if(json.status == 1) {
                    if(json.data) {
                        location.href = document.referrer || 'index.html';
                    }
                }
            }
        });
    },
});

//如果已经绑定过默认帐号，就跳转
vmCardBind.getData();

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        if (!/^\d{4}$/.test(vmCode.code)) {
            mui.alert('请输入4位数字验证码');
        } else {
            //绑定提现帐号
            ajaxJsonp({
                url: urls.bindCashAccount,
                data: {
                    cid: accountID,
                    code: vmCode.code,
                    accountType: vmCardBind.bindType,
                    accountNo: vmCardBind.accountNo,
                    accountName: vmCardBind.accountName,
                    bankName: vmCardBind.bankName,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        location.replace("card-log.html?cid=" + accountID);
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        }
    },
    close: function() {
        //纯粹隐藏，在关闭弹窗的时候不要清空弹窗内容

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

var vmCode = avalon.define({
    $id: 'code',
    code: '',
    isDisabled: false,
    codeMsg: '发送验证码',
    getCode: function() {
        if(!vmCode.isDisabled) {
            vmCode.isDisabled = true;

            ajaxJsonp({
                url: urls.bindCashAccountSMS,
                successCallback: function(json) {
                    if (json.status !== 1) {
                        mui.alert(json.message);
                        vmCode.isDisabled = false;
                        return;
                    } else {
                        vmCode.isDisabled = true;
                        wait = 60;
                        countSecond();
                    }
                }
            });
        }
    },
    close: function() {
        vmPopover.close();
    }
});

//倒计时
function countSecond() {
    if (wait === 0) {
        vmCode.isDisabled = false;
        vmCode.codeMsg = '点击重发';
        wait = 60;
    } else {
        vmCode.codeMsg = wait + '秒';
        vmCode.isDisabled = true;
        wait--;
        setTimeout(countSecond, 1000);
    }
}
