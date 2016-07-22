var hotel = controlCore.getHotel();
var typeid = getParam("type");

if(typeid != "") {
    if(isNaN(typeid)) {
        location.href = document.referrer || "nav.html";
    } else {
        typeid = parseInt(typeid);
    }
} else {
    location.href = "nav.html";
}

var vmTable = avalon.define({
	$id: 'table',
    pageNo: 1,
    pageSize: 15,
	data: { th:[], tr:[], id:[], url:''},
	index: -1, //点击的行
	isShowAdd: function() {
        return false;
    },
    go: function(index) {
        stopSwipeSkip.do(function() {
            //有实际参数再传参
            if (vmTable.data.url) {
                location.href = vmTable.data.url + "?id=" + vmTable.data.id[index];
            } else {
                return;
            }
        });
    },
});

//表格页数据
var tableData = {
    vm: vmTable,
    url: '',
    data: {
        hid: hotel.hid,
        pageNo: vmTable.pageNo,
        pageSize: vmTable.pageSize,
        startTime: hotel.startTime,
        endTime: hotel.endTime
    }
};

switch (typeid) {
    case 1:
        vmTable.data.url = "consume-article.html";
        tableData.url = urls.articleList;
        tableData.data.type = 1;
        $("#headerReplace").text("日用品");
        break;
    case 2:
       vmTable.data.url = "consume-bedding.html";
        tableData.url = urls.beddingList;
        tableData.data.type = 2;
        $("#headerReplace").text("床上用品");
        break;
    case 3:
        vmTable.data.url = "consume-asset.html";
        tableData.url = urls.assetList;
        tableData.data.type = 3;
        $("#headerReplace").text("固定资产");
        break;
}

ajaxJsonp({
    url: tableData.url,
    data: tableData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmTable.pageNo++;
            vmTable.data.th.push.apply(vmTable.data.th, json.data.heads);
            vmTable.data.tr.push.apply(vmTable.data.tr, json.data.lines);
            vmTable.data.id.push.apply(vmTable.data.id, json.data.ids);
        }
    }
});

