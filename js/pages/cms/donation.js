const byTimeDesc = 1,
    byMoneyDesc = 2;

var vmDonation = avalon.define({
    $id: 'donation',
    fid: 0,
    data: {
        amount: 0,
        number: 0
    },
    list: [],
    getFid: function() {
        ajaxJsonp({
            url: urls.getFoundationByUid,
            successCallback: function(json) {
                if (json.status == 1) {
                    vmDonation.fid = json.data.id;

                    vmDonation.getData();
                    vmDonation.getList(vmDonation.orderType);
                } else {
                    mui.alert(json.message, function() {
                        location.href = document.referrer || '../index.html';
                    });
                }
            }
        })
    },
    getData: function() {
        ajaxJsonp({
            url: urls.benefitAmount,
            data: { fid: vmDonation.fid },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmDonation.data.amount = json.data.totalDonateAmount;
                    vmDonation.data.number = json.data.number;
                } else {
                    mui.alert(json.message);
                }
            }
        })
    },
    orderType: byMoneyDesc,
    pageNo: 1,
    pageSize: 7,
    getList: function() {
        ajaxJsonp({
            url: urls.getDonationList,
            data: {
                pageNo: vmDonation.pageNo,
                pageSize: vmDonation.pageSize,
                fid: vmDonation.fid,
                type: vmDonation.orderType
            },
            successCallback: function(json) {
                if (json.status == 1) {
                    vmDonation.pageNo++;
                    vmDonation.list = json.data.list;
                } else {
                    mui.alert(json.message);
                }
            }
        });
    },
    changeOrderType: function(type) {
        vmDonation.orderType = type;
        reload();
    }
});

vmDonation.getFid();


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
    vmDonation.pageNo = 1;
    vmDonation.list = [];

    ajaxJsonp({
        url: urls.getDonationList,
        data: {
            fid: vmDonation.fid,
            type: vmDonation.orderType,
            pageSize: vmDonation.pageSize,
            pageNo: vmDonation.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDonation.pageNo = 2;
                vmDonation.list.push.apply(vmDonation.list, json.data.list);

                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);

                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            } else {
                console.log(json.message);
            }
        }
    });
}

function loadmore() {
    ajaxJsonp({
        url: urls.getDonationList,
        data: {
            fid: vmDonation.fid,
            type: vmDonation.orderType,
            pageSize: vmDonation.pageSize,
            pageNo: vmDonation.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmDonation.pageNo++;
                vmDonation.list.push.apply(vmDonation.list, json.data.list);
                if (vmDonation.pageNo <= json.data.pageCount) {
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
