// var hotel = controlCore.getHotel();

// var typeid = getParam("type");

// if (typeid != "") {
//     if (isNaN(typeid)) {
//         location.href = document.referrer || "nav.html";
//     } else {
//         typeid = parseInt(typeid);
//     }
// } else {
//     location.href = "nav.html";
// }

var vmAuditList = avalon.define({
    $id: 'auditList',
    pageNo: 1,
    pageSize: 10,
    url: '',
    data: [],
    submit: function(a, id) {
        ajaxJsonp({
            url: urls.getAuditSuccess,
            data: {
                id: id,
                status: a,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    mui.alert('已审核');
                    // location.replace('../customer/auditList.html');
                    reload();
                }
            }
        });
    },
    getData: function() {
        ajaxJsonp({
            url: listData.url,
            data: listData.data,
            successCallback: function(json) {
                if (json.status === 1) {
                    vmAuditList.pageNo++;
                    json.data.list.map(function(e) {
                        var src = '';
                        if (e.userCardMarketPackage.name == "黑卡套餐") {
                            src = "../img/card/card_No1.svg";
                        } else if (e.userCardMarketPackage.name == "金卡套餐") {
                            src = "../img/card/card_No2.svg";
                        } else if (e.userCardMarketPackage.name == "银卡套餐") {
                            src = "../img/card/card_No3.svg";
                        }
                        vmAuditList.data.push({
                            id: e.id,
                            cardNo: e.userBuyCard.cardNo,
                            headUrl: e.user.headUrl,
                            card: src,
                            mobile: e.user.mobile,
                            time: e.userCardMarketPackagePlan.endTime,
                        })
                    })
                } else {
                    alert(json.message);
                }
            }
        });
    }
});

var listData = {
    vm: vmAuditList,
    url: urls.getAuditList,
    data: {}
};
vmAuditList.getData();

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
    vmAuditList.pageNo = 1;
    vmAuditList.data = [];
    ajaxJsonp({
        url: urls.getAuditList,
        data: {
            pageSize: vmAuditList.pageSize,
            pageNo: vmAuditList.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmAuditList.pageNo = 2;
                json.data.list.map(function(e) {
                    var src = '';
                    if (e.userCardMarketPackage.name == "黑卡套餐") {
                        src = "../img/card/card_No1.svg";
                    } else if (e.userCardMarketPackage.name == "金卡套餐") {
                        src = "../img/card/card_No2.svg";
                    } else if (e.userCardMarketPackage.name == "银卡套餐") {
                        src = "../img/card/card_No3.svg";
                    }
                    vmAuditList.data.push({
                        id: e.id,
                        cardNo: e.userBuyCard.cardNo,
                        headUrl: e.user.headUrl,
                        card: src,
                        mobile: e.user.mobile,
                        time: e.userCardMarketPackagePlan.endTime,
                    })
                })

                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);

                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);

            }
        }
    });
}

function loadmore() {
    ajaxJsonp({
        url: urls.getAuditList,
        data: {
            pageSize: vmAuditList.pageSize,
            pageNo: vmAuditList.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmAuditList.pageNo++;
                json.data.list.map(function(e) {
                    var src = '';
                    if (e.userCardMarketPackage.name == "黑卡套餐") {
                        src = "../img/card/card_No1.svg";
                    } else if (e.userCardMarketPackage.name == "金卡套餐") {
                        src = "../img/card/card_No2.svg";
                    } else if (e.userCardMarketPackage.name == "银卡套餐") {
                        src = "../img/card/card_No3.svg";
                    }
                    vmAuditList.data.push({
                        id: e.id,
                        cardNo: e.userBuyCard.cardNo,
                        headUrl: e.user.headUrl,
                        card: src,
                        mobile: e.user.mobile,
                        time: e.userCardMarketPackagePlan.endTime,
                    })
                })
                if (vmAuditList.pageNo <= json.data.pageCount) {
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
