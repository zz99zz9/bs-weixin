var vmIntroduce = avalon.define({
    $id: 'intro',
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
                }
            }
        });
    },
    goDetail: function(id) {
        location.href = "commonweal-detail.html?id=" + id + "&cid=" + cid;
    },
    join: '',
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
                }
            }
        });
    },
    open: function() {
        console.log(vmIntroduce.join);
        if (vmIntroduce.join) {
            vmDetailPop.getCardAomunt();
        } else {
            vmDetailPop.getAmount();
        }
        if (vmDetailPop.useCheck) {
            //av2 不知道为什么不能 scan 第二次
            //纯粹显示，在关闭弹窗的时候不要清空弹窗内容
            modalShow('./util/commonweal-pop.html', 0);
        } else {
            vmDetailPop.useCheck = 1;
            modalShow('./util/commonweal-pop.html', 1);
        }
    },
    goRecord: function() {
        location.href = "commonweal-record.html?cid=" + cid + "&fid=" + vmIntroduce.fid;
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

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

var vmDetailPop = avalon.define({
    $id: 'detailPop',
    useCheck: 0, //1 checkButton, 0 closeButton
    amount: 0,
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
                    vmDetailPop.amount = json.data.totalDonateAmount;
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
