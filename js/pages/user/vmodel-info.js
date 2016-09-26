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

        vmSave.newName = vmUser.name;
        vmSave.newNickname = vmUser.nickname;
        vmSave.newMobile = vmUser.mobile;
    }
});
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
