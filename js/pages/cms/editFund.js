var vmEditFund = avalon.define({
    $id: 'editFund',
    headImg: defaultHeadImg,     //显示的
    logoUrl: '',     //save传的
    name: '',
    enName: '',
    mobile: '',
    introduction: '',
    brief: '',
    isDisabled: true,
    fundId: '',    //基金id
    getFund: function() {
        ajaxJsonp({
            url: urls.benefitAmountUid,
            data: {},
            successCallback: function(json) {
                if (json.status == 1) { 
                    vmEditFund.fundId = json.data.id;
                    vmEditFund.logoUrl = json.data.logoUrl;
                    vmEditFund.name = json.data.cnName;
                    vmEditFund.enName = json.data.enName;
                    vmEditFund.introduction = json.data.introduction;
                    vmEditFund.brief = json.data.brief;
                    vmEditFund.getPic();
                }
            }
        });
    },
    getPic: function() {
        var a = Storage.get("headImg");
        console.log(vmEditFund.logoUrl);
        if (a == null && vmEditFund.logoUrl == '') {
            vmEditFund.headImg = defaultHeadImg;
            vmEditFund.logoUrl = defaultHeadImg;
        } else if (a == null && vmEditFund.logoUrl != '') {
            vmEditFund.headImg = urlAPINet + vmEditFund.logoUrl;
        } else if (a != null && vmEditFund.logoUrl != '') {
            vmEditFund.headImg = urlAPINet + a.url;
            vmEditFund.logoUrl = a.url;
        } else if (a != null && vmEditFund.logoUrl == '') {
            vmEditFund.headImg = urlAPINet + a.url;
            vmEditFund.logoUrl = a.url;
        }
        console.log(vmEditFund.logoUrl);
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
            url: urls.updateFoundationInfo,
            data: {
                id: vmEditFund.fundId,
                cnName: vmEditFund.name,   
                enName: vmEditFund.enName,
                introduction: vmEditFund.introduction,   
                brief: vmEditFund.brief,
                logoUrl: vmEditFund.logoUrl
            },
            successCallback: function(json) {
                if (json.status == 1) { //已登录
                    location.href = 'nav.html';
                }
            }
        });
    },
    
});

vmEditFund.getFund();
