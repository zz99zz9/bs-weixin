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

var vmAssets= avalon.define({
    $id: "totalAssets",
    list: [],
    name: "dskj",
    money: 30000.00,
    getTotalAssets: function() {
        ajaxJsonp({
            url: urls.getTotalAssets,
            data: {},
            successCallback: function(json) {
                if (json.status === 1) {
                    json.data.map(function(e) {
                        switch(e.source) {
                            case 1:
                                e.source = "提前退房";
                                break;
                            case 2:
                                e.source = "邀请奖励";
                                break;
                            case 3:
                                e.source = "现金兑换";
                                break;
                            default: 
                                e.source = "";
                                break;
                        }
                    });
                    vmAssets.list = json.data;
                }
            }
        });
    },
    goDetail: function() {
        location.href = "../totalAssetsDetail.html";
    },
});
vmAssets.getTotalAssets();
