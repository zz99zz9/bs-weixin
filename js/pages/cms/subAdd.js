var vmSubAdd = avalon.define({
    $id: 'subAdd',
    headImg: defaultHeadImg,
    name: '',
    mobile: '',
    isDisabled: true,
    fundId: '', //基金id
    changed: function() {
        if (vmSubAdd.name == '' || vmSubAdd.mobile == '' || vmSubAdd.mobile.length != 11) {
            vmSubAdd.isDisabled = true;
            return;
        }
        vmSubAdd.isDisabled = false;
    },
    getPic: function() {
        var a = Storage.get("headImg");
        if (a == null) {
            vmSubAdd.headImg = defaultHeadImg;
            console.log(vmSubAdd.headImg);
        } else {
            vmSubAdd.headImg = urlAPINet + Storage.get("headImg").url;
        }
        Storage.set("head", { headImg: vmSubAdd.headImg });
    },
    changeImg: function() {
        stopSwipeSkip.do(function() {
            ajaxJsonp({
                url: urls.userInfotUrl,
                data: {},
                successCallback: function(json) {
                    if (json.status == 1) { //已登录
                        location.href = '../avatar.html';
                    } else {
                        mui.alert(json.message);
                    }
                }
            });
        });
    },
    save: function() {
        ajaxJsonp({
            url: urls.addSubAccount,
            data: {
                fid: vmSubAdd.fundId,
                mobile: vmSubAdd.mobile,
                name: vmSubAdd.name,
                headUrl: vmSubAdd.headImg
            },
            successCallback: function(json) {
                if (json.status == 1) { //已登录
                    location.href = 'subList.html';
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    getFund: function() {
        ajaxJsonp({
            url: urls.benefitAmountUid,
            data: {},
            successCallback: function(json) {
                if (json.status == 1) {
                    vmSubAdd.fundId = json.data.id;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
});

vmSubAdd.getFund();
vmSubAdd.getPic();

//防止移动端小键盘弹出，footer被顶起。
var oHeight = $(window).height();
$(window).resize(function() {
    if ($('.cms').height() < oHeight) {
        $(".footer").css('display', 'none');
    } else {
        $(".footer").css('display', 'block');
    }
});