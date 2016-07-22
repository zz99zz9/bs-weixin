var hotel = controlCore.getHotel();

var typeid = getParam("type");

if (typeid != "") {
    if (isNaN(typeid)) {
        location.href = document.referrer || "nav.html";
    } else {
        typeid = parseInt(typeid);
    }
} else {
    location.href = "nav.html";
}

var vmList = avalon.define({
    $id: 'list',
    pageNo: 1,
    pageSize: 10,
    url: '',
    num: '',
    data: [],
    getNum: function(data) {
        if (data.inNo != undefined) {
            return data.inNo;
        } else if (data.outNo != undefined) {
            return data.outNo;
        } else {
            return data.allotNo;
        }
    },
    isStockShow: function() {
        if (typeid == 4) {
            return true;
        } else {
            return false;
        }
    },
    add: function() {
        stopSwipeSkip.do(function() {
            location.href = vmList.url;
        })
    },
    go: function(id) {
        //有实际参数再传参
        stopSwipeSkip.do(function() {
            if (vmList.url) {
                location.href = vmList.url + "?id=" + id;
            } else {
                return;
            }
        })
    }
});

var listData = {
    vm: vmList,
    url: '',
    data: {
        hid: hotel.hid,
        pageNo: vmList.pageNo,
        pageSize: vmList.pageSize,
    }
};
switch (typeid) {
    case 1:
        vmList.url = "warehouse-form-in.html";
        listData.url = urls.warehouseInList;
        vmList.num = "入库单号";
        $("#headerReplace").text("入库");
        break;
    case 2:
        vmList.url = "warehouse-form-out.html";
        listData.url = urls.warehouseOutList;
        vmList.num = "出库单号";
        console.log(vmList.num);
        $("#headerReplace").text("出库");
        break;
    case 3:
        vmList.url = "warehouse-form-allocate.html";
        listData.url = urls.warehouseAllocateList;
        vmList.num = "调拨单号";
        $("#headerReplace").text("调拨");
        break;
    case 4:
        vmList.url = "warehouse-form-stock.html";
        listData.url = urls.warehouseStockList;
        $("#headerReplace").text("库存盘点");
        break;
}

ajaxJsonp({
    url: listData.url,
    data: listData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmList.pageNo++;
            vmList.data.push.apply(vmList.data, json.data.list);
        } else {
            alert(json.message);
        }
    }
});
