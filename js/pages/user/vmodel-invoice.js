/**
 * Created by lyh on 2016/7/29/029.
 */

var vmInvoiceList = avalon.define({
    $id: 'invoiceList',
    pageNo: 1,
    pageSize: 10,
    list: [],
    selectedList: [],
    selectDone: function () {
        console.log(vmInvoiceList.selectedList);
    }
});

mui.init({
    pullRefresh: {
        container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
            height: 50,//可选,默认50.触发下拉刷新拖动距离,
            auto: true,//可选,默认false.自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: reload //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        up: {
            height: 50,//可选.默认50.触发上拉加载拖动距离
            auto: true,//可选,默认false.自动上拉加载一次
            contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: loadMore //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
    }
});

/**
 * 下拉刷新
 */
function reload() {
    vmInvoiceList.pageNo = 1;
    ajaxJsonp({
        url: urls.getInvoiceList,
        data: {
            pageNo: vmInvoiceList.pageNo,
            pageSize: vmInvoiceList.pageSize
        },
        successCallback: function (json) {
            if (json.status === 1) {
                vmInvoiceList.pageNo++;
                vmInvoiceList.list = json.data.list;
                vmInvoiceList.selectedList = [];
                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                mui('#refreshContainer').pullRefresh().refresh(true);
            } else {
                alert(json.message);
            }
        }
    });
}

/**
 * 上拉加载更多
 */
function loadMore() {
    ajaxJsonp({
        url: urls.getInvoiceList,
        data: {
            pageNo: vmInvoiceList.pageNo,
            pageSize: vmInvoiceList.pageSize
        },
        successCallback: function (json) {
            if (json.status === 1) {
                vmInvoiceList.pageNo++;
                vmInvoiceList.list.push.apply(vmInvoiceList.list, json.data.list);
                if (vmInvoiceList.pageNo >= json.data.pageCount) {
                    mui("#refreshContainer").pullRefresh().endPullupToRefresh(true);
                } else {
                    mui("#refreshContainer").pullRefresh().endPullupToRefresh(false);
                }
            } else {
                alert(json.message);
            }
        }
    });
}