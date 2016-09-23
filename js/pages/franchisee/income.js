var vmHeader = avalon.define({
    $id: 'header',
    sale: 0,
    checkin: 0,
    income: 0,
    getData: function() {
        //获取销售数据
        ajaxJsonp({
            url: urls.saleRangeStatistics,
            data: {
                startTime: fraStartTime,
                endTime: fraEndTime,
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmHeader.sale = json.data.amount;
                    vmHeader.checkin = json.data.number;
                }
            }
        });
        //获取分佣数据
        ajaxJsonp({
            url: urls.commissionRangeStatistics,
            data: {
                startTime: fraStartTime,
                endTime: fraEndTime
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmHeader.income = json.data.hotelAmount;
                }
            }
        });
    },
});

var vmChart = avalon.define({
    $id: 'chart',
    list: [],
    pageNo: 1,
    pageSize: 12,
    getList: function() {
        ajaxJsonp({
            url: urls.fraMonthlyList,
            data: { 
                startTime: fraStartTime,
                endTime: fraEndTime,
                pageNo: vmChart.pageNo,
                pageSize: vmChart.pageSize
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmChart.pageNo = 2;
                    vmChart.list.push.apply(vmChart.list, json.data.list);
                }
            }
        });
    },
    goMonth: function(year, month) {
        location.href = "franchisee-month.html?year=" + year + '&month=' + month;
    }
});

var fraStartTime = '2016-03-12',
    fraEndTime = getLastMonth('end');

vmHeader.getData();
vmChart.getList();


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
    vmHeader.getData();
    vmChart.pageNo = 1;
    vmChart.list = [];

    ajaxJsonp({
            url: urls.fraMonthlyList,
            data: {
                startTime: fraStartTime,
                endTime: fraEndTime,
                pageSize: vmChart.pageSize,
                pageNo: vmChart.pageNo
            },
            successCallback: function(json) {
                if (json.status === 1) {
                    vmChart.pageNo = 2;
                    vmChart.list.push.apply(vmChart.list, json.data.list);
                    
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
        url: urls.fraMonthlyList,
        data: {
            startTime: fraStartTime,
            endTime: fraEndTime,
            pageSize: vmChart.pageSize,
            pageNo: vmChart.pageNo
        },
        successCallback: function(json) {
            if (json.status == 1) {
                vmChart.pageNo++;
                vmChart.list.push.apply(vmChart.list, json.data.list);
                if (vmChart.pageNo <= json.data.pageCount) {
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
