var vmIntroduce = avalon.define({
    $id: 'intro',
    data: 'kill',
    getData: function() {
        ajaxJsonp({
            url: urls.getDicCardList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmCardList.data = [];
                    json.data.map(function(c) {
                        c.imgUrl = 'img/card/card_list_No' + c.id + '.png';

                        vmCardList.data.push(c);
                    });
                }
            }
        });
    },
    goDetail: function() {
        location.href = "commonweal-detail.html";
    },
    open: function() {
        if (vmIntroduce.cardNo != '') {
            vmDetailPop.getAmount();
            if (vmDetailPop.useCheck) {
                //av2 不知道为什么不能 scan 第二次
                //纯粹显示，在关闭弹窗的时候不要清空弹窗内容
                modalShow('./util/commonweal-pop.html', 0);
            } else {
                vmDetailPop.useCheck = 1;
                modalShow('./util/commonweal-pop.html', 1);
            }
        } else {
            mui.alert("123");
        }
    },
    goRecord: function() {
        location.href = "commonweal-record.html";
    },
    cardId: '',
    getId: function() {
        ajaxJsonp({
            url: urls.getCardAccountList,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmIntroduce.cardId = json.data[0].userBuyCard.id;
                }
            }
        });
    },
    rule: function() {
        console.log(123);
        popover('./util/lottery-rule.html', 1);
    },
});
vmIntroduce.getId();

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
    getAmount: function() {
        ajaxJsonp({
            url: urls.getDonationAmount,
            data: {
                cid: vmIntroduce.cardId,
                fid: 1
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmDetailPop.amount = json.data.amount;
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
                cid: vmDetail.cardId,
                fid: 1
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    mui.alert(json.message);
                    modalClose();
                    location.href = "commonweal-introduce.html";
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
});
