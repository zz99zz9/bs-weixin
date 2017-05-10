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
    goDetail: function() {
        location.href = "../totalAssetsDetail.html";
    },
});
