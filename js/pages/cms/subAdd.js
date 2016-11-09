var vmSubAdd = avalon.define({
    $id: 'subAdd',
    headImg: defaultHeadImg,
    name: '',
    mobile: '',
    isDisabled: true,
    fundId: '',    //基金id
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
                }
            }
        });
    },
});

vmSubAdd.getFund();
vmSubAdd.getPic();
