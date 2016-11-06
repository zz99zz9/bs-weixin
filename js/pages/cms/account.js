var vmAccount = avalon.define({
    $id: 'account',
    data: { accountType: 0, accountNo: '', accountID: 0, cashAmount: 20000 },
    getData: function() {
        // ajaxJsonp({
        //     url: urls.getDefaultCashAccount,
        //     data: {
        //         cid: vmAccount.data.accountID,
        //     },
        //     successCallback: function(json){
        //         if(json.status == 1) {
        //             if(!json.data) {
        //                 json.data = { accountType: 0, accountNo: '' };
        //             }
        //             vmAccount.data = json.data;
        //         }
        //     }
        // });
    },
    list: [
        { type: 2, amount: 382.5, description: "提现", createTime: "2016-11-04 22:50:47" },
        { type: 1, amount: 0.79, description: "捐赠", createTime: "2016-11-04 22:47:58" },
        { type: 1, amount: 0.83, description: "捐赠", createTime: "2016-11-04 22:47:06" },
        { type: 1, amount: 0.65, description: "捐赠", createTime: "2016-11-04 22:46:58" },
        { type: 2, amount: 0.53, description: "支付订单", createTime: "2016-11-04 17:35:49" },
        { type: 1, amount: 1.38, description: "捐赠", createTime: "2016-11-03 17:09:45" },
        { type: 1, amount: 3.56, description: "捐赠", createTime: "2016-11-03 16:57:41" },
        { type: 1, amount: 0.4, description: "捐赠", createTime: "2016-11-03 15:52:46" },
        { type: 1, amount: 1.88, description: "捐赠", createTime: "2016-10-26 03:15:22" }
    ],
    pageNo: 1,
    pageSize: 10,
    getList: function() {
        // ajaxJsonp({
        //     url: urls.getAccountLogList,
        //     data: {
        //         cid: vmAccount.data.accountID,
        //         pageSize: vmAccount.pageSize,
        //         pageNo: vmAccount.pageNo
        //     },
        //     successCallback: function(json) {
        //         if (json.status == 1) {
        //             vmAccount.pageNo = 2;
        //             vmAccount.list.push.apply(vmAccount.list, json.data.list);
        //         }
        //     }
        // });
    },
    openWithdraw: function(index, cash) {
        if(cash == 0) {
            mui.toast("您的可用余额不足");
        } else {
            //判断有没有绑定提现帐户
            if (vmAccount.accountType == 0) {
                mui.alert('请先绑定提现帐号', function() {
                    location.href = 'card-bind.html?cid=' + vmAccount.data.id;
                });
            } else {
                if (vmPopover.useCheck) {
                    //av2 不知道为什么不能 scan 第二次
                    //纯粹显示，在关闭弹窗的时候不要清空弹窗内容
                    popover('../util/card-withdraw.html', 0);

                    vmAccountWithdraw.accountID = vmAccount.data.id;
                    vmAccountWithdraw.cashAmount = vmAccount.data.cashAmount;
                } else {
                    vmAccountWithdraw.accountID = vmAccount.data.id;
                    vmAccountWithdraw.cashAmount = vmAccount.data.cashAmount;

                    vmPopover.useCheck = 1;
                    popover('../util/card-withdraw.html', 1);
                }
            }
        }
    },
    goBind: function() {
        location.href = "card-bind.html?cid=" + vmAccount.data.accountID;
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
                    url: urls.withdrawCash,
                    data: {
                        cid: vmAccountWithdraw.accountID,
                        amount: vmAccountWithdraw.cash
                    },
                    successCallback: function(json) {
                        if (json.status == 1) {
                            mui.alert('提现成功，请等待打款', function() {
                                vmAccountWithdraw.cash = '';

                                vmAccount.getData();
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


mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        down: {
            height: 50,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            height: 50,//可选.默认50.触发上拉加载拖动距离
            auto: false,//可选,默认false.自动上拉加载一次
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

function reload() {
    vmAccount.getData();
    vmAccount.pageNo = 1;
    vmAccount.list = [];
    ajaxJsonp({
        url: urls.getAccountLogList,
        data: {
            cid: vmAccount.data.accountID,
            pageSize: vmAccount.pageSize,
            pageNo: vmAccount.pageNo
        },
        successCallback: function(json){
            if(json.status == 1) {
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
        url: urls.getAccountLogList,
        data: {
            cid: vmAccount.data.accountID,
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