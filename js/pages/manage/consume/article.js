var hotel = controlCore.getHotel();

var articleid = getParam("id");
if (articleid != "") {
    if (isNaN(articleid)) {
        location.href = document.referrer || "homepage.html";
    } else {
        articleid = parseInt(articleid);
    }
} else {
    articleid = 0;
}

var vmArticle = avalon.define({
    $id: 'article',
    name: '',
    onlineStock: '',
    monthAmount: '',
    pageNo: 1,
    pageSize: 10,
    list: [],
    data: {},
    actualQuantity: '', //当月的盘点值
    newActualQuantity: '',
    isDisabled: true,
    // changed: function(a) {
    //     vmArticle.newActualQuantity = vmArticle.newActualQuantity.replace(/\D/g, '');
    //     if (a != vmArticle.actualQuantity) {
    //         vmArticle.isDisabled = false;
    //     } else {
    //         vmArticle.isDisabled = true;
    //     }

    // },
    modify: function() {
        if (!vmArticle.isDisabled) {
            vmArticle.isDisabled = true;
            ajaxJsonp({
                url: urls.articleModify,
                data: {
                    hid: hotel.hid,
                    cid: articleid,
                    actualQuantity: vmArticle.newActualQuantity
                },
                successCallback: function(json) {
                    if (json.status === 1) {
                        alert("修改成功");
                        vmArticle.actualQuantity = vmArticle.newActualQuantity;
                    } else {
                        vmArticle.isDisabled = false;
                        alert(json.massage);
                    }
                }
            });
        }
    },
});

vmArticle.$watch("newActualQuantity", function(a) {
    if (a != vmArticle.actualQuantity && a != '') {
        vmArticle.isDisabled = false;
    } else {
        vmArticle.isDisabled = true;
    }
    vmArticle.newActualQuantity = vmArticle.newActualQuantity.replace(/\D/g, '');

});

var listData = {
    vm: vmArticle,
    url: urls.articleDetail,
    data: {
        hid: hotel.hid,
        cid: articleid,
        pageNo: vmArticle.pageNo,
        pageSize: vmArticle.pageSize
    }
};

ajaxJsonp({
    url: urls.articleGoods,
    data: { hid: hotel.hid, id: articleid },
    successCallback: function(json) {
        if (json.status === 1) {
            vmArticle.name = json.data.name;
            vmArticle.onlineStock = json.data.onlineStock;
            vmArticle.monthAmount = json.data.monthAmount;
            $("#headerReplace").text(vmArticle.name);
        }
    }
});

ajaxJsonp({
    url: urls.articleDetail,
    data: listData.data,
    successCallback: function(json) {
        if (json.status === 1) {
            vmArticle.pageNo++;
            vmArticle.list.push.apply(vmArticle.list, json.data.list);
        } else {
            alert(json.message);
        }
    }
});
