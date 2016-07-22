var hotel = controlCore.getHotel();

var vmTable = avalon.define({
    $id: 'table',
    pageNo: 1,
    pageSize: 15,
    data: {th:[], tr:[], id:[]},
    isShowAdd: function() {
        return false;
    },
    index: -1, //点击的行
    go: function(index) {
        stopSwipeSkip.do(function() {
            vmTable.index = index;
            setTimeout(function() {
                vmTable.index = -1;
            }, 50);

            //有实际参数再传参
            location.href = vmTable.data.url + '?id=' + vmTable.data.id[index];
        });
    }
});

//表格页数据，传给 table.string 用
var tableData = {
    vm: vmTable, 
    url: urls.invoiceManage,
    data: {
        hid: hotel.hid,
        pageNo: vmTable.pageNo,
        pageSize: vmTable.pageSize
    }
};

ajaxJsonp({
    url: urls.invoiceManage,
    data: {hid: hotel.hid, pageNo: vmTable.pageNo, pageSize: vmTable.pageSize},
    successCallback: function(json) {
        if (json.status === 1) {
            vmTable.pageNo ++

            vmTable.data.url = "invoice-detail.html";
            vmTable.data.th = json.data.heads;
            vmTable.data.tr = json.data.lines;
            vmTable.data.id = json.data.ids;
        }
    }
});
