var vmRecord = avalon.define({
    $id: 'record',
    amount: '0',
    list: [],
    pageNo: 1,
    pageSize: 10,
    getData: function() {
        ajaxJsonp({
            url: urls.getMyWealCount,
            data: {},
            successCallback: function(json){
                if(json.status == 1) {
                    vmRecord.amount = json.data.amount;
                    console.log(vmRecord.amount);
                }
            }
        });
    },
    getList: function() {
        ajaxJsonp({
            url: urls.getMyWealRecord,
            data: {},
            successCallback: function(json){
                if(json.status == 1) {
                    vmRecord.list = json.data.list;
                }
            }
        });
    },
});
vmRecord.getData();
vmRecord.getList();

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
    vmRecord.pageNo = 1;
    vmRecord.list = [];
    ajaxJsonp({
        url: urls.getMyWealRecord,
        data: {
            pageSize: vmRecord.pageSize,
            pageNo: vmRecord.pageNo
        },
        successCallback: function(json){
            if(json.status == 1) {
                vmRecord.pageNo = 2;
                vmRecord.list.push.apply(vmRecord.list, json.data.list);
                
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                mui('#pullrefresh').pullRefresh().refresh(true);
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                
            }
        }
    });
}

function loadmore() {
    ajaxJsonp({
        url: urls.getMyWealRecord,
        data: {
            pageSize: vmRecord.pageSize,
            pageNo: vmRecord.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmRecord.pageNo++;
                vmRecord.list.push.apply(vmRecord.list, json.data.list);
                if (vmRecord.pageNo <= json.data.pageCount) {
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
