var hotel = controlCore.getHotel();

var typeid = getParam("type");
Storage.set("financeTemp", { id: typeid });

if (typeid != "") {
    if (isNaN(typeid)) {
        location.href = document.referrer || "finance.html";
    } else {
        typeid = parseInt(typeid);
    }
} else {
    location.href = "finance.html";
}

mui.init({
    pullRefresh: {
        container: '#pullrefresh',
        up: {
            contentrefresh: '正在加载...',
            contentnomore: "没有更多数据了",
            callback: loadmore
        }
    }
});

var vmDetailOut = avalon.define({
    $id: 'detail',
    pageNo: 1,
    pageSize: 7,
    data: []
});

var tableData = {
    vm: vmDetailOut,
    url: urls.outLog,
    data: {
        hid: hotel.hid,
        pageNo: vmDetailOut.pageNo,
        pageSize: vmDetailOut.pageSize,
        startTime: hotel.startTime,
        endTime: hotel.endTime
    }
};

ajaxJsonp({
    url: tableData.url,
    data: tableData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmDetailOut.pageNo++

            vmDetailOut.data = json.data.list;
        }
    }
});
$("#headerReplace").text("支出明细修改");

function loadmore() {
    var vm = tableData.vm,
        url = tableData.url;

    tableData.data.pageNo = vm.pageNo;
    tableData.data.pageSize = vm.pageSize;

    ajaxJsonp({
        url: url,
        data: tableData.data,
        successCallback: function(json) {
            if (json.data.count + json.data.pageSize > (vm.pageNo * json.data.pageSize) && json.data.list.length > 0) {
                vm.pageNo++;
                vm.data.push.apply(vm.data, json.data.list);

                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
            } else {
                mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
            }
        }
    });
}
