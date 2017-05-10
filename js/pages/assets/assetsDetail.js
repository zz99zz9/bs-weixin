// created by zwh on 2017/05/09
var vmAssetsDetail = avalon.define({
    $id: 'assetsDetail',
    list: [],
    pageNo: 1,
    pageSize: 10,
    getList: function() {
        ajaxJsonp({
            url: urls.getTotalAssetsRecord,
            data: { 
                pageNo: vmAssetsDetail.pageNo,
                pageSize: vmAssetsDetail.pageSize
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmAssetsDetail.pageNo = 2;
                    json.data.list.map(function(e) {
                        switch(e.source) {
                            case 1: 
                                e.source = "提前退房";
                                break;
                            case 2: 
                                e.source = "邀请奖励";
                                break;
                            case 3: 
                                e.source = "现金兑换";
                                break;
                            case 4: 
                                e.source = "订单取消";
                                break;
                            case 5: 
                                e.source = "服务消费";
                                break;
                            default: 
                                e.source = "";
                                break;
                        }
                    });
                    vmAssetsDetail.list.push.apply(vmAssetsDetail.list, json.data.list);
                }
            }
        });
    }
});

vmAssetsDetail.getList();


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
    vmAssetsDetail.pageNo = 1;
    vmAssetsDetail.list = [];

    ajaxJsonp({
            url: urls.getTotalAssetsRecord,
            data: {
                pageSize: vmAssetsDetail.pageSize,
                pageNo: vmAssetsDetail.pageNo
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmAssetsDetail.pageNo = 2;
                    json.data.list.map(function(e) {
                        switch(e.source) {
                            case 1: 
                                e.source = "提前退房";
                                break;
                            case 2: 
                                e.source = "邀请奖励";
                                break;
                            case 3: 
                                e.source = "现金兑换";
                                break;
                            case 4: 
                                e.source = "订单取消";
                                break;
                            case 5: 
                                e.source = "服务消费";
                                break;
                            default: 
                                e.source = "";
                                break;
                        }
                    });
                    vmAssetsDetail.list.push.apply(vmAssetsDetail.list, json.data.list);
                    
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                    mui('#pullrefresh').pullRefresh().refresh(true);

                    mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                }
            }
        });
}

//mui 上拉加载
function loadmore() {
    ajaxJsonp({
        url: urls.getTotalAssetsRecord,
        data: {
            pageSize: vmAssetsDetail.pageSize,
            pageNo: vmAssetsDetail.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmAssetsDetail.pageNo++;
                json.data.list.map(function(e) {
                        switch(e.source) {
                            case 1: 
                                e.source = "提前退房";
                                break;
                            case 2: 
                                e.source = "邀请奖励";
                                break;
                            case 3: 
                                e.source = "现金兑换";
                                break;
                            case 4: 
                                e.source = "订单取消";
                                break;
                            case 5: 
                                e.source = "服务消费";
                                break;
                            default: 
                                e.source = "";
                                break;
                        }
                    });
                vmAssetsDetail.list.push.apply(vmAssetsDetail.list, json.data.list);
                if (vmAssetsDetail.pageNo <= json.data.pageCount) {
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
