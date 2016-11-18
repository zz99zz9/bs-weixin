var vmAccount = avalon.define({
    $id: 'account',
    fid: 0, //基金id
    cid: 0, //基金账户id
    amount: 0,
    getFid: function() {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmAccount.fid = json.data.id;

                    ajaxJsonp({
                        url: urls.getFoundationAccount,
                        data: { fid: vmAccount.fid },
                        successCallback: function(json) {
                            if (json.status == 1) {
                                vmAccount.cid = json.data.cid;
                                vmAccount.amount = json.data.cashAmount;

                                vmAccount.getCashAccount();
                                vmAccount.getList();
                            } else {
                                mui.alert(json.message);
                            }
                        }
                    });
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || '../index.html';
                    });
                }
            }
        })
    },
    cashAccount: { accountType: 0, accountNo: '' },
    getCashAccount: function() {
        ajaxJsonp({
            url: urls.getFoundationCashAccount,
            data: { cid: vmAccount.cid },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmAccount.cashAccount = json.data;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    list: [],
    pageNo: 1,
    pageSize: 10,
    getList: function() {
        vmAccount.pageNo = 1;
        ajaxJsonp({
            url: urls.getFoundationAccountLog,
            data: {
                cid: vmAccount.cid,
                pageSize: vmAccount.pageSize,
                pageNo: vmAccount.pageNo
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmAccount.pageNo = 2;
                    vmAccount.list = json.data.list;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    openWithdraw: function() {
        if (vmAccount.amount == 0) {
            mui.toast("您的可用余额不足");
        } else {
            //判断有没有绑定提现帐户
            if (vmAccount.cashAccount.accountType == 0) {
                mui.alert('请先绑定提现帐号', function() {
                    location.href = "../card-bind.html?type=foundation&cid=" + vmAccount.cid;
                });
            } else {
                
                vmAccountWithdraw.accountID = vmAccount.cid;
                vmAccountWithdraw.cashAmount = vmAccount.amount;

                vmPopover.useCheck = 1;
                popover('../util/foundation-withdraw.html', 1);
            }
        }
    },
    goBind: function() {
        location.href = "../card-bind.html?type=foundation&cid=" + vmAccount.cid;
    }
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 0, //1 checkButton, 0 closeButton
    ok: function() {
        var reg = new RegExp("^[0-9]+(.[0-9]{1})?(.[0-9]{2})?$");

        if (!reg.test(vmAccountWithdraw.cash)) {
            mui.alert('请输入正确的金额');
        } else {
            if (vmAccountWithdraw.cash > vmAccountWithdraw.cashAmount) {
                mui.alert('提现金额超限');
            } else if (vmAccountWithdraw.cash < 60) {
                mui.alert('对不起，每次提现金额不能少于60元')
            } else {
                //提现
                ajaxJsonp({
                    url: urls.foundationWithdrawCash,
                    data: {
                        cid: vmAccountWithdraw.accountID,
                        amount: vmAccountWithdraw.cash
                    },
                    successCallback: function(json) {
                        if (json.status == 1) {
                            mui.alert('提现成功，请等待打款', function() {
                                vmAccountWithdraw.cash = '';

                                vmAccount.getFid();
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

var vmAccountWithdraw = avalon.define({
    $id: 'withdraw',
    accountID: 0,
    cashAmount: '',
    cash: '',
    close: function() {
        vmPopover.close();
    }
});

vmAccount.getFid();

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: false, //可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            height: 50, //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function reload() {
    vmAccount.pageNo = 1;
    vmAccount.list = [];
    ajaxJsonp({
        url: urls.getFoundationAccountLog,
        data: {
            cid: vmAccount.cid,
            pageSize: vmAccount.pageSize,
            pageNo: vmAccount.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmAccount.pageNo = 2;
                vmAccount.list.push.apply(vmAccount.list, json.data.list);

                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);

                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            }
        }
    });
}

function loadmore() {
    ajaxJsonp({
        url: urls.getFoundationAccountLog,
        data: {
            cid: vmAccount.cid,
            pageSize: vmAccount.pageSize,
            pageNo: vmAccount.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmAccount.pageNo++;
                vmAccount.list.push.apply(vmAccount.list, json.data.list);
                if (vmAccount.pageNo <= json.data.pageCount) {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                } else {
                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                }
            } else {
                console.log(json.message);
            }
        }
    });
}
