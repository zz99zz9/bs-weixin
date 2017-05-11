// created by zwh on 2017/05/09

// var roomid = getParam("rid");
// if(roomid != "") {
//     if(isNaN(roomid)) {
//         location.href = document.referrer || "index.html";
//     } else {
//         roomid = parseInt(roomid);
//     }
// } else {
//     location.href = "index.html";
// }

var vmAssets = avalon.define({
    $id: "totalAssets",
    list: [],
    data: [{
        amount: 329.4,
        source: 1
    }, {
        amount: 60,
        source: 2
    }, {
        amount: 60,
        source: 3
    }],
    name: "dskj",
    money: 30000.00,
    getTotalAssets: function() {
        ajaxJsonp({
            url: urls.getTotalAssets,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmAssets.money = json.data.availableCoin;
                }
            }
        });
    },
    getTotalAssetsContent: function() {
        ajaxJsonp({
            url: urls.getTotalAssetsContent,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    vmAssets.list = json.data;
                }
            }
        });
    },
    goDetail: function() {
        location.href = "../totalAssetsDetail.html";
    },
    goRecharge: function() {
        stopSwipeSkip.do(function() {
            location.href = "../tokensRecharge.html";
        });
    },
});
vmAssets.getTotalAssets();
vmAssets.getTotalAssetsContent();
//vmAssets.list = vmAssets.data;
