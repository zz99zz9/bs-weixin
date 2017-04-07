mui.init();
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#infoPage'
});

$('.cancelBtn').on('tap', function() {
    vmUser.getUserInfo();
    viewApi.back();
});

var user = {
  openUserInfo: 1
};
Storage.setLocal('user', user);

var vmUser = avalon.define({
    $id: 'info',
    headImg: defaultHeadImg,
    name: '',
    mobile: '',
    idNo: '',
    nickname: '',
    headUrl:'',
    getUserInfo: function() {
        ajaxJsonp({
            url: urls.userInfotUrl,
            data: {},
            successCallback: function(json) {
                if(json.status !== 0)
                {
                }
            }
        });
        var user = Storage.getLocal('user');
        vmUser.headImg = user.headImg;
        vmUser.name = user.name;
        vmUser.mobile = user.mobile;
        vmUser.idNo = user.idNo;
        vmUser.nickname = user.nickname;
		vmUser.headImg = user.headImg;
        vmSave.newName = vmUser.name;
        vmSave.newNickname = vmUser.nickname;
        vmSave.newMobile = vmUser.mobile;
    },
    balance: 0,
    getBalance: function() {
        ajaxJsonp({
            url: urls.getBalance,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmUser.balance = json.data.availableAmount;
                } else {
                    mui.alert(json.message, "查询余额");
                }
            }
        });
      },
    isLogin: 3, //0:没登录   1：登录
    logOff: function() {
        mui.confirm("退出当前账号", "", ["取消", "确定"], function(e) {
            if (e.index == 1) {
                ajaxJsonp({
                    url: urls.logOut,
                    data: {},
                    successCallback: function(json) {
                        if (json.status === 1) {
                            var user = {
                                logState: 0
                            };
                            Storage.setLocal('user', user);
                            location.href = "index.html";
                        } else {
                            mui.alert(json.message);
                        }
                    }
                });
            }
        });
    },
    goIndex2: function() {
        stopSwipeSkip.do(function() {
            location.href = "../index2.html";
        })
    },
    goRoom: function() {
        stopSwipeSkip.do(function() {
            location.href = "service/orderList.html";
        })
    },
    goOrder: function() {
        stopSwipeSkip.do(function() {
            location.href = "../newOrderList.html";
        })
    },
    goUser: function() {
        stopSwipeSkip.do(function() {
            location.href = "../user-info.html";
        })
    },
});

var c = Storage.getLocal('user').logState;
vmUser.isLogin = c;

var vmSave = avalon.define({
    $id: 'change',
    newName: 'name',
    newNickname: 'nickName',
    newMobile: 'mobile',
    isNameChange: false,
    isNicknameChange: false,
    isMobileChange: false,
    save: function() {
        if(vmSave.isNameChange || vmSave.isNicknameChange || vmSave.isMobileChange) {
            var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!(vmSave.newMobile.length === 11 && reg.test(vmSave.newMobile))) {
                alert("请输入正确的手机号码");
                return false;
            }
            ajaxJsonp({
                url: urls.saveUserInfo,
                data: {
                    name: vmSave.newName,
                    nickname: vmSave.newNickname,
                    mobile: vmSave.newMobile
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        var user = Storage.getLocal('user');
                        user.name = vmSave.newName;
                        user.nickname = vmSave.newNickname;
                        vmSide.nickName = vmSave.newNickname;
                        user.mobile = vmSave.newMobile;
                        Storage.setLocal('user', user);
                        vmUser.getUserInfo();
                        //保存成功后收回
                        viewApi.back();
                    } else {
                        alert(json.data.message);
                    }
                }
            });
        }
    }
});

vmSave.$watch('newName', function(a) {
    if(a != vmUser.name) {
        vmSave.isNameChange = true;
    } else {
        vmSave.isNameChange = false;
    }
});
vmSave.$watch('newNickname', function(a) {
    if(a != vmUser.nickname) {
        vmSave.isNicknameChange = true;
    } else {
        vmSave.isNicknameChange = false;
    }
});
vmSave.$watch('newMobile', function(a) {
    if(a != vmUser.mobile) {
        vmSave.isMobileChange = true;
    } else {
        vmSave.isMobileChange = false;
    }
});

vmUser.getUserInfo();
vmUser.getBalance();