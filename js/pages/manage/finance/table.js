var hotel = controlCore.getHotel();

var typeid = getParam("type");
Storage.set("financeTemp", { id: typeid });

if (typeid != "") {
    if (isNaN(typeid)) {
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
    data: { th: [], tr: [], id: [], url: '' },
    isShowAdd: function() {
        return typeid > 3;
    },
    index: -1, //点击的行
    add: function() {
        location.href = vmTable.data.url;
    },
    go: function(index) {
        stopSwipeSkip.do(function() {
            vmTable.index = index;
            setTimeout(function() {
                vmTable.index = -1;
            }, 150);

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
        tableData.url = urls.fRoomIncome;
        tableData.data.isPartTime = 0;
        $("#headerReplace").text("夜房收入");
        break;
    case 2:
        tableData.url = urls.fRoomIncome;
        tableData.data.isPartTime = 1;
        $("#headerReplace").text("时租房收入");
        break;
    case 3:
        tableData.url = urls.fGoodsIncome;
        $("#headerReplace").text("非房收入");
        break;
    case 4:
        vmTable.data.url = "commodity-out.html";
        tableData.url = urls.commodityOut;
        tableData.data.type = 1;
        $("#headerReplace").text("日用品支出");
        break;
    case 5:
        vmTable.data.url = "toolwaste-out.html";
        tableData.url = urls.damagedOut;
        $("#headerReplace").text("物品损坏支出");
        break;
    case 6:
        vmTable.data.url = "salary-out.html";
        tableData.url = urls.salaryOut;
        $("#headerReplace").text("人员工资支出");
        break;
    case 7:
        vmTable.data.url = "energy-out.html";
        tableData.url = urls.commodityOut;
        tableData.data.type = 2;
        $("#headerReplace").text("能耗支出");
        break;
    case 8:
        vmTable.data.url = "device-out.html";
        tableData.url = urls.commodityOut;
        tableData.data.type = 3;
        $("#headerReplace").text("设备支出");
        break;
    case 9:
        vmTable.data.url = "tax-out.html";
        tableData.url = urls.taxOut;
        $("#headerReplace").text("税务支出");
        break;
    case 10:
        vmTable.data.url = "other-out.html";
        tableData.url = urls.otherOut;
        $("#headerReplace").text("其它支出");
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
