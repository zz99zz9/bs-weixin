var hotel = controlCore.getHotel();

var beddingid = getParam("id");
if (beddingid != "") {
    if (isNaN(beddingid)) {
        location.href = document.referrer || "index.html";
    } else {
        beddingid = parseInt(beddingid);
    }
} else {
    beddingid = 0;
}


var vmBedding = avalon.define({
    $id: 'bedding',
    name: '',
    pageNo: 1,
    pageSize: 10,
    list: [],
    data: {},
    monthLoss: 0, 
    newMonthLoss: 0,
    isLossDisabled: true,
    modifyLoss: function() {
        if (!vmBedding.isLossDisabled) {
            vmBedding.isLossDisabled = true;
            ajaxJsonp({
                url: urls.beddingModify,
                data: {
                    hid: hotel.hid,
                    cid: beddingid,
                    monthLoss: vmBedding.newMonthLoss
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        alert("修改当月损耗成功");
                        vmBedding.monthLoss = vmBedding.newMonthLoss;
                    } else {
                        vmBedding.isLossDisabled = false;
                        alert(json.massage);
                    }
                }
            });
        }
    },
    dayWash: 0,
    newDayWash: 0,
    isWashDisabled: true,
    modifyWash: function() {
        if (!vmBedding.isWashDisabled) {
            vmBedding.isWashDisabled = true;
            ajaxJsonp({
                url: urls.beddingModify,
                data: {
                    hid: hotel.hid,
                    cid: beddingid,
                    dayWash: vmBedding.newDayWash
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        alert("修改当日送洗成功");
                        vmBedding.dayWash = vmBedding.newDayWash;
                    } else {
                        vmBedding.isWashDisabled = false;
                        alert(json.massage);
                    }
                }
            });
        }
    },
    dayClean: 0,
    newDayClean: 0,
    isCleanDisabled: true,
    modifyClean: function() {
        if (!vmBedding.isCleanDisabled) {
            vmBedding.isCleanDisabled = true;
            ajaxJsonp({
                url: urls.beddingModify,
                data: {
                    hid: hotel.hid,
                    cid: beddingid,
                    dayClean: vmBedding.newDayClean

                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        alert("修改当日清洁成功");
                        vmBedding.dayClean = vmBedding.newDayClean;
                    } else {
                        vmBedding.isCleanDisabled = false;
                        alert(json.massage);
                    }
                }
            });
        }
    },
});

var listData = {
    vm: vmBedding,
    url: urls.beddingDetail,
    data: {
        hid: hotel.hid,
        cid: beddingid,
        pageNo: vmBedding.pageNo,
        pageSize: vmBedding.pageSize
    }
};


ajaxJsonp({
    url: urls.beddingGoods,
    data: { hid: hotel.hid, cid: beddingid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmBedding.name = json.data.name;
            vmBedding.monthLoss = json.data.monthLoss;
            vmBedding.newMonthLoss = json.data.monthLoss;
            vmBedding.dayWash = json.data.dayWash;
            vmBedding.newDayWash = json.data.dayWash;
            vmBedding.dayClean = json.data.dayClean;
            vmBedding.newDayClean = json.data.dayClean;
            $("#headerReplace").text(vmBedding.name);
        }
        vmBedding.$watch("newMonthLoss", function(a) {
            if (a != vmBedding.monthLoss && a != '') {
                vmBedding.isLossDisabled = false;
            } else {
                vmBedding.isLossDisabled = true;
            }
            vmBedding.newMonthLoss = vmBedding.newMonthLoss.replace(/\D/g, '');
        });
        vmBedding.$watch("newDayWash", function(a) {
            if (a != vmBedding.dayWash && a != '') {
                vmBedding.isWashDisabled = false;
            } else {
                vmBedding.isWashDisabled = true;
            }
            vmBedding.newDayWash = vmBedding.newDayWash.replace(/\D/g, '');
        });
        vmBedding.$watch("newDayClean", function(a) {
            if (a != vmBedding.dayClean && a != '') {
                vmBedding.isCleanDisabled = false;
            } else {
                vmBedding.isCleanDisabled = true;
            }
            vmBedding.newDayClean = vmBedding.newDayClean.replace(/\D/g, '');
        });
    }
});


ajaxJsonp({
    url: urls.beddingDetail,
    data: listData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmBedding.pageNo++;
            vmBedding.list.push.apply(vmBedding.list, json.data.list);
        } else {
            alert(json.message);
        }
    }
});
