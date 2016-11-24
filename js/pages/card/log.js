var accountID = getParam('cid');
var cid = accountID;
if (accountID != "") {
    if (isNaN(accountID)) {
        location.href = document.referrer || "index.html";
    } else {
        accountID = parseInt(accountID);
    }
} else {
    location.href = "index.html";
}

var vmCardLog = avalon.define({
    $id: 'log',
    data: { accountType: 0, accountNo: '' },
    getData: function() {
        ajaxJsonp({
            url: urls.getDefaultCashAccount,
            data: {
                cid: accountID,
            },
            successCallback: function(json){
                if(json.status == 1) {
                    if(!json.data) {
                        json.data = { accountType: 0, accountNo: '' };
                    }
                    vmCardLog.data = json.data;
                    // avalon.scan(document.body);
                }
            }
        });
    },
    list: [],
    pageNo: 1,
    pageSize: 10,
    getList: function() {
        ajaxJsonp({
            url: urls.getAccountLogList,
            data: {
                cid: accountID,
                pageSize: vmCardLog.pageSize,
                pageNo: vmCardLog.pageNo
            },
            successCallback: function(json){
                if(json.status == 1) {
                    vmCardLog.pageNo = 2;
                    vmCardLog.list.push.apply(vmCardLog.list, json.data.list);
                }
            }
        });
    },
    openRule: function() {
        
        vmPopover.useCheck = 0;
        popover('./util/card-rule.html', 1);
    },
    goBind: function() {
        location.href = "card-bind.html?cid=" + accountID;
    },
    goWeal: function() {
        location.href = 'commonweal-introduce.html?cid=' + cid;
    },
    SERVICECALL: SERVICECALL
});

var vmPopover = avalon.define({
    $id: 'popoverBtnOK',
    type: '', //窗口的类型
    useCheck: 1, //1 checkButton, 0 closeButton
    ok: function() {
        $('#pop-text').empty();

        $('.popover').addClass('popover-hide');
        popover_ishide = true;
    }
});

vmCardLog.getData();
vmCardLog.getList();

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
    vmCardLog.getData();
    vmCardLog.pageNo = 1;
    vmCardLog.list = [];
    ajaxJsonp({
        url: urls.getAccountLogList,
        data: {
            cid: accountID,
            pageSize: vmCardLog.pageSize,
            pageNo: vmCardLog.pageNo
        },
        successCallback: function(json){
            if(json.status == 1) {
                vmCardLog.pageNo = 2;
                vmCardLog.list.push.apply(vmCardLog.list, json.data.list);
                
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
            cid: accountID,
            pageSize: vmCardLog.pageSize,
            pageNo: vmCardLog.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmCardLog.pageNo++;
                vmCardLog.list.push.apply(vmCardLog.list, json.data.list);
                if (vmCardLog.pageNo <= json.data.pageCount) {
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
