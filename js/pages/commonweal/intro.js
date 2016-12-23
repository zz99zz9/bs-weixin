var vmIntroduce = avalon.define({
    $id: 'intro',
    urlAPINet: urlAPINet,
    fid: 0,
    data: [],
    userImg: '',
    getUser: function() {
        vmIntroduce.userImg = urlAPINet + Storage.getLocal("user").headImg;
    },
    //获取基金信息列表
    getInfo: function() {
        ajaxJsonp({
            url: urls.commonwealList,
            data: {
                hid: 1,
                pageSize: 1
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIntroduce.data = json.data.list;
                    vmIntroduce.fid = json.data.list[0].id;
                    vmIntroduce.getAmount();
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    goDetail: function(id) {
        stopSwipeSkip.do(function() {
            location.href = "commonweal-detail.html?id=" + id + "&cid=" + cid;
        });
    },
    join: '',
    rate: 0,
    getAmount: function() {
        //每月捐赠金额
        ajaxJsonp({
            url: urls.getDonationAmount,
            data: {
                cid: cid,
                fid: vmIntroduce.fid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetailPop.amount = json.data.amount;
                    vmDetailPop.join = json.data.join;
                    vmIntroduce.join = vmDetailPop.join;
                    vmIntroduce.rate = round(json.data.rate * 100, 1);
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    open: function() {
        stopSwipeSkip.do(function() {
            if (vmIntroduce.join) {
                console.log(123);
                vmDetailPop.getCardAomunt();
            } else {
                vmDetailPop.getAmount();
            }
            modalShow('./util/commonweal-pop.html', 1);
        });
    },
    goRecord: function() {
        stopSwipeSkip.do(function() {
            location.href = "commonweal-record.html?cid=" + cid + "&fid=" + vmIntroduce.fid;
        });
    },
});

var cid = getParam("cid");
//若是cid为空，则默认取第一张卡的账户id
if (cid == '') {
    ajaxJsonp({
        url: urls.getAccountList,
        data: {},
        successCallback: function(json) {
            if (json.status === 1) {
                cid = json.data[0].id;
                vmIntroduce.getUser();
                vmIntroduce.getInfo();
            }
        }
    });
} else{
    vmIntroduce.getUser();
    vmIntroduce.getInfo();
}

var vmDetailPop = avalon.define({
    $id: 'detailPop',
    amount: 0,
    totalAmount: 0,//总捐赠金额
    join: '', //true表示加入
    //获取会员卡捐赠情况(总额)
    getCardAomunt: function() {
        ajaxJsonp({
            url: urls.getAccountCommonwealInfo,
            data: {
                cid: cid,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetailPop.totalAmount = json.data.totalDonateAmount;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    getAmount: function() {
        //每月捐赠金额
        ajaxJsonp({
            url: urls.getDonationAmount,
            data: {
                cid: cid,
                fid: vmIntroduce.fid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetailPop.amount = json.data.amount;
                    vmDetailPop.join = json.data.join;
                    vmIntroduce.join = json.data.join;
                    console.log(vmDetailPop.join);
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    close: function() {
        modalClose();
    },
    go: function() {
        ajaxJsonp({
            url: urls.goDonate,
            data: {
                cid: cid,
                fid: vmIntroduce.fid
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    mui.alert(json.message, function() {
                        location.href = 'commonweal-introduce.html?cid=' + cid;
                    });
                } else {
                    mui.alert(json.message);
                    modalClose();
                }
            }
        });
    },
});
