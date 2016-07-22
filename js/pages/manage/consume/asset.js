var hotel = controlCore.getHotel();

var assetid = getParam("id");
if (assetid != "") {
    if (isNaN(assetid)) {
        location.href = document.referrer || "index.html";
    } else {
        assetid = parseInt(assetid);
    }
} else {
    assetid = 0;
}

var vmAsset = avalon.define({
    $id: 'asset',
    name: '',
    data: {},
    list: [],
    pageNo: 1,
    pageSize: 10,
});

var listData = {
    vm: vmAsset,
    url: urls.assetDetail,
    data: {
        hid: hotel.hid,
        cid: assetid,
        pageNo: vmAsset.pageNo,
        pageSize: vmAsset.pageSize
    }
};

ajaxJsonp({
    url: urls.assetGoods,
    data: {
        hid: hotel.hid,
        cid: assetid
    },
    successCallback: function(json) {
        if (json.status === 1) {
            vmAsset.name = json.data.name;
            $("#headerReplace").text(vmAsset.name);
        }
    }
});

ajaxJsonp({
    url: urls.assetDetail,
    data: listData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmAsset.pageNo++;
            vmAsset.list.push.apply(vmAsset.list, json.data.list);
        } else {
            alert(json.message);
        }
    }
});