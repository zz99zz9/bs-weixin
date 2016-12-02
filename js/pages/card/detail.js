var cardData = Storage.get('cardData');
if (!cardData) {
    cardData = { index: 0 };
} else {
    if (!cardData.index) {
        cardData.index = 0;
    }
}
var swiper;

//进入首页时，默认打开个人中心弹窗
Storage.setLocal('user', { openUserInfo: 1 });

var vmCardDetail = avalon.define({
    $id: 'detail',
    data: [{
        id: 0,
        accountAmount: 0,
        cardRemainAmount: 0,
        cashAmount: 0,
        totalAwardAmount: 0,
        totalReturnAmount: 0,
        userBuyCard: {
            cardNo: "",
            id: 0,
            name: "",
            type: 0
        },
        isDonate: 0,
        totalDonateAmount: 0
    }],
    test: -1,
    getCard: function() {
        ajaxJsonp({
            url: urls.getCardAccountList,
            successCallback: function(json) {
                if (json.status === 1) {
                    var length = json.data.length;
                    if (length) {
                        vmCardDetail.data = json.data;
                        for(var j = 0; j < length; j++) {
                            (function() {
                                var k = j;
                                ajaxJsonp({
                                    url: urls.getAccountCommonwealInfo,
                                    data: { cid: json.data[k].id },
                                    successCallback: function(json) {
                                        if (json.status === 1) {
                                            vmCardDetail.data[k].isDonate = 1;
                                            vmCardDetail.data[k].totalDonateAmount = json.data.totalDonateAmount;
                                            vmCardDetail.test = k;
                                        }
                                    }
                                });
                            })();
                        }
                    }
                }
            }
        });
    },
    renderSwiper: function() {
        swiper = new Swiper('.swiper', {
            initialSlide: cardData.index,
            slidesPerView: 1,
            width: window.innerWidth,
            spaceBetween: 5,
            freeMode: true,
            freeModeSticky: true,
            freeModeMomentumRatio: 0.4,
            onSlideChangeEnd: function() {
                cardData.index = swiper.activeIndex;
                Storage.set('cardData', cardData);
            },
        });
    },
    goLog: function(index) {
        Storage.set('cardData', { index: index });
        location.href = 'card-log.html?cid=' + vmCardDetail.data[index].id;
    },
    goCardList: function() {
        location.href = 'card-list.html';
    },
    goPromotion: function(index) {
        Storage.set('cardData', { index: index });
        location.href = 'promotion-apply.html';
    },
    openWithdraw: function(index, cash) {
        if(cash == 0) {
            mui.toast("您的可用余额不足");
        } else {
            //判断有没有绑定提现帐户
            ajaxJsonp({
                url: urls.getDefaultCashAccount,
                data: {
                    cid: vmCardDetail.data[index].id,
                },
                successCallback: function(json) {
                    if (json.status == 1) {
                        if (!json.data) {
                            mui.alert('请先绑定提现帐号', function() {
                                location.href = 'card-bind.html?cid=' + vmCardDetail.data[index].id;
                            });
                        } else {
                            if (vmPopover.useCheck) {
                                //av2 不知道为什么不能 scan 第二次
                                //纯粹显示，在关闭弹窗的时候不要清空弹窗内容
                                popover('./util/card-withdraw.html', 0);

                                vmCardWithdraw.accountID = vmCardDetail.data[index].id;
                                vmCardWithdraw.cashAmount = vmCardDetail.data[index].cashAmount;
                            } else {
                                vmCardWithdraw.accountID = vmCardDetail.data[index].id;
                                vmCardWithdraw.cashAmount = vmCardDetail.data[index].cashAmount;

                                vmPopover.useCheck = 1;
                                popover('./util/card-withdraw.html', 1);
                            }
                        }
                    }
                }
            });
        }
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        var reg = new RegExp("^[0-9]+(.[0-9]{1})?(.[0-9]{2})?$");

        if (!reg.test(vmCardWithdraw.cash)) {
            mui.alert('请输入正确的金额');
        } else {
            if (vmCardWithdraw.cash > vmCardWithdraw.cashAmount) {
                mui.alert('提现金额超限');
            } else if (vmCardWithdraw.cash < 60) {
                mui.alert('对不起，每次提现金额不能少于60元')
            } else {
                //提现
                ajaxJsonp({
                    url: urls.withdrawCash,
                    data: {
                        cid: vmCardWithdraw.accountID,
                        amount: vmCardWithdraw.cash
                    },
                    successCallback: function(json) {
                        if (json.status == 1) {
                            mui.alert('提现成功，请等待打款',function() {
                                vmCardWithdraw.cash = '';

                                vmCardDetail.getCard();
                                vmPopover.close();
                            });
                        } else {
                            mui.alert(json.message);
                        }
                    }
                })
            }
        }
    },
    close: function() {
        //纯粹隐藏，在关闭弹窗的时候不要清空弹窗内容

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

var vmCardWithdraw = avalon.define({
    $id: 'withdraw',
    accountID: 0,
    cashAmount: '',
    cash: '',
    close: function() {
        vmPopover.close();
    }
});

vmCardDetail.getCard();
